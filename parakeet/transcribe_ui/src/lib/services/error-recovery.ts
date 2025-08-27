import { EventEmitter } from 'events'

export interface RetryConfig {
  maxAttempts: number
  baseDelay: number
  maxDelay: number
  backoffMultiplier: number
  jitter: boolean
}

export interface ConnectionError {
  type: 'websocket' | 'sse' | 'network' | 'server'
  message: string
  code?: string | number
  timestamp: Date
  attemptNumber: number
}

export interface RecoveryStrategy {
  name: string
  canHandle: (error: ConnectionError) => boolean
  execute: (error: ConnectionError) => Promise<boolean>
  priority: number
}

export class ErrorRecoveryService extends EventEmitter {
  private retryConfig: RetryConfig
  private recoveryStrategies: RecoveryStrategy[] = []
  private activeRetries: Map<string, NodeJS.Timeout> = new Map()
  private errorHistory: ConnectionError[] = []
  private maxHistorySize = 100

  constructor(retryConfig?: Partial<RetryConfig>) {
    super()
    
    this.retryConfig = {
      maxAttempts: 5,
      baseDelay: 1000,
      maxDelay: 30000,
      backoffMultiplier: 2,
      jitter: true,
      ...retryConfig
    }

    this.setupDefaultStrategies()
  }

  private setupDefaultStrategies(): void {
    // WebSocket connection recovery
    this.addRecoveryStrategy({
      name: 'websocket-reconnect',
      priority: 1,
      canHandle: (error) => error.type === 'websocket',
      execute: async (error) => {
        this.emit('recovery-attempt', { strategy: 'websocket-reconnect', error })
        
        // Check if WebSocket is still supported
        if (typeof window !== 'undefined' && !window.WebSocket) {
          this.emit('recovery-failed', { strategy: 'websocket-reconnect', reason: 'WebSocket not supported' })
          return false
        }

        // Emit event to trigger WebSocket reconnection
        this.emit('websocket-reconnect', { error })
        return true
      }
    })

    // SSE fallback strategy
    this.addRecoveryStrategy({
      name: 'sse-fallback',
      priority: 2,
      canHandle: (error) => error.type === 'websocket' && error.attemptNumber > 2,
      execute: async (error) => {
        this.emit('recovery-attempt', { strategy: 'sse-fallback', error })
        
        // Check if EventSource is supported
        if (typeof window !== 'undefined' && !window.EventSource) {
          this.emit('recovery-failed', { strategy: 'sse-fallback', reason: 'EventSource not supported' })
          return false
        }

        // Emit event to trigger SSE fallback
        this.emit('sse-fallback', { error })
        return true
      }
    })

    // Network connectivity check
    this.addRecoveryStrategy({
      name: 'network-check',
      priority: 3,
      canHandle: (error) => error.type === 'network' || error.message.includes('network'),
      execute: async (error) => {
        this.emit('recovery-attempt', { strategy: 'network-check', error })
        
        // Check network connectivity
        const isOnline = await this.checkNetworkConnectivity()
        
        if (!isOnline) {
          this.emit('recovery-failed', { strategy: 'network-check', reason: 'No network connectivity' })
          return false
        }

        // Network is available, try reconnection
        this.emit('network-recovered', { error })
        return true
      }
    })

    // Server health check
    this.addRecoveryStrategy({
      name: 'server-health-check',
      priority: 4,
      canHandle: (error) => error.type === 'server' || (error.code && [500, 502, 503, 504].includes(Number(error.code))),
      execute: async (error) => {
        this.emit('recovery-attempt', { strategy: 'server-health-check', error })
        
        // Check server health
        const isHealthy = await this.checkServerHealth()
        
        if (!isHealthy) {
          this.emit('recovery-failed', { strategy: 'server-health-check', reason: 'Server not responding' })
          return false
        }

        // Server is healthy, try reconnection
        this.emit('server-recovered', { error })
        return true
      }
    })
  }

  public addRecoveryStrategy(strategy: RecoveryStrategy): void {
    this.recoveryStrategies.push(strategy)
    this.recoveryStrategies.sort((a, b) => a.priority - b.priority)
  }

  public removeRecoveryStrategy(name: string): void {
    this.recoveryStrategies = this.recoveryStrategies.filter(s => s.name !== name)
  }

  public async handleError(
    sessionId: string,
    error: ConnectionError
  ): Promise<boolean> {
    // Add to error history
    this.addToHistory(error)

    // Emit error event
    this.emit('error-occurred', { sessionId, error })

    // Check if we should stop retrying
    if (error.attemptNumber >= this.retryConfig.maxAttempts) {
      this.emit('max-attempts-reached', { sessionId, error })
      return false
    }

    // Find applicable recovery strategies
    const applicableStrategies = this.recoveryStrategies.filter(strategy => 
      strategy.canHandle(error)
    )

    if (applicableStrategies.length === 0) {
      this.emit('no-recovery-strategy', { sessionId, error })
      return false
    }

    // Try recovery strategies in priority order
    for (const strategy of applicableStrategies) {
      try {
        const success = await strategy.execute(error)
        if (success) {
          this.emit('recovery-success', { sessionId, error, strategy: strategy.name })
          return true
        }
      } catch (strategyError) {
        console.error(`Recovery strategy ${strategy.name} failed:`, strategyError)
        this.emit('recovery-strategy-error', { 
          sessionId, 
          error, 
          strategy: strategy.name, 
          strategyError 
        })
      }
    }

    // All strategies failed, schedule retry
    this.scheduleRetry(sessionId, error)
    return false
  }

  public scheduleRetry(sessionId: string, error: ConnectionError): void {
    // Cancel existing retry for this session
    this.cancelRetry(sessionId)

    // Calculate delay with exponential backoff
    const delay = this.calculateRetryDelay(error.attemptNumber)

    // Emit retry scheduled event
    this.emit('retry-scheduled', { sessionId, error, delay })

    // Schedule retry
    const timeoutId = setTimeout(async () => {
      this.activeRetries.delete(sessionId)
      
      const newError: ConnectionError = {
        ...error,
        attemptNumber: error.attemptNumber + 1,
        timestamp: new Date()
      }

      // Emit retry attempt
      this.emit('retry-attempt', { sessionId, error: newError })

      // Try recovery again
      await this.handleError(sessionId, newError)
    }, delay)

    this.activeRetries.set(sessionId, timeoutId)
  }

  public cancelRetry(sessionId: string): void {
    const timeoutId = this.activeRetries.get(sessionId)
    if (timeoutId) {
      clearTimeout(timeoutId)
      this.activeRetries.delete(sessionId)
      this.emit('retry-cancelled', { sessionId })
    }
  }

  public cancelAllRetries(): void {
    for (const [sessionId, timeoutId] of this.activeRetries) {
      clearTimeout(timeoutId)
      this.emit('retry-cancelled', { sessionId })
    }
    this.activeRetries.clear()
  }

  private calculateRetryDelay(attemptNumber: number): number {
    let delay = this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, attemptNumber - 1)
    
    // Apply maximum delay limit
    delay = Math.min(delay, this.retryConfig.maxDelay)

    // Apply jitter to avoid thundering herd
    if (this.retryConfig.jitter) {
      delay *= (0.5 + Math.random() * 0.5)
    }

    return Math.round(delay)
  }

  private addToHistory(error: ConnectionError): void {
    this.errorHistory.push(error)
    
    // Keep history size manageable
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift()
    }
  }

  private async checkNetworkConnectivity(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      if (!navigator.onLine) {
        return false
      }
    }

    // Try to fetch a small resource to verify connectivity
    try {
      const response = await fetch('/api/websocket', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      })
      return response.ok
    } catch {
      return false
    }
  }

  private async checkServerHealth(): Promise<boolean> {
    try {
      const response = await fetch('/api/websocket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status' }),
        signal: AbortSignal.timeout(5000)
      })
      return response.ok
    } catch {
      return false
    }
  }

  // Query methods
  public getErrorHistory(): ConnectionError[] {
    return [...this.errorHistory]
  }

  public getActiveRetries(): string[] {
    return Array.from(this.activeRetries.keys())
  }

  public isRetryActive(sessionId: string): boolean {
    return this.activeRetries.has(sessionId)
  }

  public getRetryConfig(): RetryConfig {
    return { ...this.retryConfig }
  }

  public updateRetryConfig(config: Partial<RetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config }
    this.emit('config-updated', this.retryConfig)
  }

  // Cleanup
  public cleanup(): void {
    this.cancelAllRetries()
    this.errorHistory = []
    this.removeAllListeners()
  }
}

// Singleton instance
let errorRecoveryServiceInstance: ErrorRecoveryService | null = null

export function getErrorRecoveryService(): ErrorRecoveryService {
  if (!errorRecoveryServiceInstance) {
    errorRecoveryServiceInstance = new ErrorRecoveryService()
  }
  return errorRecoveryServiceInstance
}

export function resetErrorRecoveryService(): void {
  if (errorRecoveryServiceInstance) {
    errorRecoveryServiceInstance.cleanup()
    errorRecoveryServiceInstance = null
  }
}