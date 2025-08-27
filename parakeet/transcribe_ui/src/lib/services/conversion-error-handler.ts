import type {
  ConversionJob,
  ConversionResult,
  SupportedFormat
} from '../../types/audio'
import { ConversionError } from '../../types/audio'

/**
 * Error handling service for audio conversion operations
 * Provides error classification, recovery strategies, and user-friendly error messages
 */
export class ConversionErrorHandler {
  private static instance: ConversionErrorHandler | null = null
  
  // Error recovery strategies
  private recoveryStrategies: Map<string, (job: ConversionJob) => Promise<ConversionResult | null>> = new Map()
  
  // Error statistics for analysis
  private errorStats: Map<string, number> = new Map()
  
  // Maximum retry attempts
  private readonly maxRetryAttempts = 3

  private constructor() {
    this.initializeRecoveryStrategies()
  }

  /**
   * Get singleton instance of error handler
   */
  static getInstance(): ConversionErrorHandler {
    if (!ConversionErrorHandler.instance) {
      ConversionErrorHandler.instance = new ConversionErrorHandler()
    }
    return ConversionErrorHandler.instance
  }

  /**
   * Handle conversion error and attempt recovery
   */
  async handleConversionError(
    error: Error | ConversionError,
    job: ConversionJob,
    attemptNumber = 1
  ): Promise<{
    canRecover: boolean
    shouldRetry: boolean
    userMessage: string
    technicalDetails: string
    suggestedActions: string[]
    recoveryResult?: ConversionResult
  }> {
    const errorInfo = this.classifyError(error)
    this.recordErrorStatistics(errorInfo.code)

    console.error(`Conversion error for job ${job.id}:`, {
      error: errorInfo,
      attempt: attemptNumber,
      maxAttempts: this.maxRetryAttempts
    })

    // Determine if retry is appropriate
    const shouldRetry = this.shouldRetryError(errorInfo, attemptNumber)
    
    // Attempt recovery if possible
    let recoveryResult: ConversionResult | null = null
    if (errorInfo.canRecover && shouldRetry) {
      recoveryResult = await this.attemptRecovery(error, job)
    }

    return {
      canRecover: errorInfo.canRecover,
      shouldRetry: shouldRetry && !recoveryResult?.success,
      userMessage: this.generateUserFriendlyMessage(errorInfo, job),
      technicalDetails: this.generateTechnicalDetails(error, job),
      suggestedActions: this.generateSuggestedActions(errorInfo, job),
      ...(recoveryResult && { recoveryResult })
    }
  }

  /**
   * Classify error type and determine handling strategy
   */
  private classifyError(error: Error | ConversionError): {
    code: string
    category: 'user' | 'system' | 'network' | 'format' | 'resource'
    severity: 'low' | 'medium' | 'high' | 'critical'
    canRecover: boolean
    isRetryable: boolean
    requiresUserAction: boolean
  } {
    if (error instanceof ConversionError) {
      return this.classifyConversionError(error)
    }

    // Standard JavaScript errors
    const message = error.message.toLowerCase()
    
    if (message.includes('memory') || message.includes('heap')) {
      return {
        code: 'MEMORY_ERROR',
        category: 'resource',
        severity: 'high',
        canRecover: true,
        isRetryable: true,
        requiresUserAction: false
      }
    }

    if (message.includes('network') || message.includes('fetch') || message.includes('cors')) {
      return {
        code: 'NETWORK_ERROR',
        category: 'network',
        severity: 'medium',
        canRecover: true,
        isRetryable: true,
        requiresUserAction: false
      }
    }

    if (message.includes('timeout')) {
      return {
        code: 'TIMEOUT_ERROR',
        category: 'system',
        severity: 'medium',
        canRecover: true,
        isRetryable: true,
        requiresUserAction: false
      }
    }

    if (message.includes('permission') || message.includes('access')) {
      return {
        code: 'PERMISSION_ERROR',
        category: 'system',
        severity: 'high',
        canRecover: false,
        isRetryable: false,
        requiresUserAction: true
      }
    }

    // Default classification for unknown errors
    return {
      code: 'UNKNOWN_ERROR',
      category: 'system',
      severity: 'medium',
      canRecover: true,
      isRetryable: true,
      requiresUserAction: false
    }
  }

  /**
   * Classify ConversionError specifically
   */
  private classifyConversionError(error: ConversionError): {
    code: string
    category: 'user' | 'system' | 'network' | 'format' | 'resource'
    severity: 'low' | 'medium' | 'high' | 'critical'
    canRecover: boolean
    isRetryable: boolean
    requiresUserAction: boolean
  } {
    const errorClassifications: Record<string, {
      category: 'user' | 'system' | 'network' | 'format' | 'resource'
      severity: 'low' | 'medium' | 'high' | 'critical'
      canRecover: boolean
      isRetryable: boolean
      requiresUserAction: boolean
    }> = {
      'FFMPEG_INIT_ERROR': {
        category: 'system',
        severity: 'critical',
        canRecover: true,
        isRetryable: true,
        requiresUserAction: false
      },
      'UNSUPPORTED_INPUT_FORMAT': {
        category: 'format',
        severity: 'high',
        canRecover: false,
        isRetryable: false,
        requiresUserAction: true
      },
      'UNSUPPORTED_OUTPUT_FORMAT': {
        category: 'format',
        severity: 'high',
        canRecover: false,
        isRetryable: false,
        requiresUserAction: true
      },
      'SAME_FORMAT_ERROR': {
        category: 'user',
        severity: 'low',
        canRecover: false,
        isRetryable: false,
        requiresUserAction: true
      },
      'INVALID_BITRATE': {
        category: 'user',
        severity: 'medium',
        canRecover: true,
        isRetryable: true,
        requiresUserAction: false
      },
      'INVALID_SAMPLE_RATE': {
        category: 'user',
        severity: 'medium',
        canRecover: true,
        isRetryable: true,
        requiresUserAction: false
      },
      'INVALID_CHANNELS': {
        category: 'user',
        severity: 'medium',
        canRecover: true,
        isRetryable: true,
        requiresUserAction: false
      },
      'EMPTY_FILE': {
        category: 'user',
        severity: 'high',
        canRecover: false,
        isRetryable: false,
        requiresUserAction: true
      },
      'FILE_TOO_SMALL': {
        category: 'user',
        severity: 'high',
        canRecover: false,
        isRetryable: false,
        requiresUserAction: true
      },
      'FILE_TOO_LARGE': {
        category: 'user',
        severity: 'high',
        canRecover: false,
        isRetryable: false,
        requiresUserAction: true
      }
    }

    const classification = errorClassifications[error.code]
    if (classification) {
      return {
        code: error.code,
        ...classification
      }
    }

    // Default for unknown ConversionError codes
    return {
      code: error.code || 'UNKNOWN_CONVERSION_ERROR',
      category: 'system',
      severity: 'medium',
      canRecover: true,
      isRetryable: true,
      requiresUserAction: false
    }
  }

  /**
   * Determine if error should be retried
   */
  private shouldRetryError(
    errorInfo: ReturnType<typeof ConversionErrorHandler.prototype.classifyError>,
    attemptNumber: number
  ): boolean {
    // Don't retry if max attempts reached
    if (attemptNumber >= this.maxRetryAttempts) {
      return false
    }

    // Don't retry non-retryable errors
    if (!errorInfo.isRetryable) {
      return false
    }

    // Don't retry user errors that require action
    if (errorInfo.requiresUserAction) {
      return false
    }

    // Retry system and network errors with exponential backoff
    return ['system', 'network', 'resource'].includes(errorInfo.category)
  }

  /**
   * Attempt to recover from error
   */
  private async attemptRecovery(
    error: Error | ConversionError,
    job: ConversionJob
  ): Promise<ConversionResult | null> {
    const errorCode = error instanceof ConversionError ? error.code : 'UNKNOWN_ERROR'
    const recoveryStrategy = this.recoveryStrategies.get(errorCode)

    if (!recoveryStrategy) {
      console.log(`No recovery strategy for error code: ${errorCode}`)
      return null
    }

    try {
      console.log(`Attempting recovery for job ${job.id} with strategy for ${errorCode}`)
      return await recoveryStrategy(job)
    } catch (recoveryError) {
      console.error(`Recovery failed for job ${job.id}:`, recoveryError)
      return null
    }
  }

  /**
   * Generate user-friendly error message
   */
  private generateUserFriendlyMessage(
    errorInfo: ReturnType<typeof ConversionErrorHandler.prototype.classifyError>,
    job: ConversionJob
  ): string {
    const userMessages: Record<string, string> = {
      'FFMPEG_INIT_ERROR': 'Audio conversion system is initializing. Please wait a moment and try again.',
      'UNSUPPORTED_INPUT_FORMAT': `The input format "${job.options.inputFormat}" is not supported. Please use MP3, WAV, M4A, FLAC, or OGG files.`,
      'UNSUPPORTED_OUTPUT_FORMAT': `The output format "${job.options.outputFormat}" is not supported. Available formats: MP3, WAV, M4A, FLAC, OGG.`,
      'SAME_FORMAT_ERROR': 'Input and output formats are the same. Please choose a different output format.',
      'INVALID_BITRATE': 'Invalid bitrate setting. Please use a standard bitrate like 128k, 192k, or 320k.',
      'INVALID_SAMPLE_RATE': 'Invalid sample rate. Please use a standard rate like 44100 Hz or 48000 Hz.',
      'INVALID_CHANNELS': 'Invalid channel configuration. Please use mono (1) or stereo (2) channels.',
      'EMPTY_FILE': 'The selected file appears to be empty or corrupted.',
      'FILE_TOO_SMALL': 'The file is too small to be a valid audio file.',
      'FILE_TOO_LARGE': 'The file is too large. Maximum supported size is 300MB.',
      'MEMORY_ERROR': 'Conversion failed due to insufficient memory. Try with a smaller file or lower quality settings.',
      'NETWORK_ERROR': 'Network connection issue. Please check your internet connection and try again.',
      'TIMEOUT_ERROR': 'Conversion timed out. This might happen with very large files.',
      'PERMISSION_ERROR': 'Permission denied. Please check your browser settings and try again.',
      'UNKNOWN_ERROR': 'An unexpected error occurred during conversion.'
    }

    return userMessages[errorInfo.code] || 
           `Conversion failed: ${errorInfo.code.toLowerCase().replace(/_/g, ' ')}`
  }

  /**
   * Generate technical error details
   */
  private generateTechnicalDetails(error: Error | ConversionError, job: ConversionJob): string {
    const details = [
      `Error: ${error.message}`,
      `Job ID: ${job.id}`,
      `Input Format: ${job.options.inputFormat}`,
      `Output Format: ${job.options.outputFormat}`,
      `File Size: ${job.inputFile.length} bytes`,
      `Timestamp: ${new Date().toISOString()}`
    ]

    if (error instanceof ConversionError) {
      details.push(`Error Code: ${error.code}`)
      if (error.details) {
        details.push(`Details: ${JSON.stringify(error.details)}`)
      }
    }

    return details.join('\n')
  }

  /**
   * Generate suggested actions for user
   */
  private generateSuggestedActions(
    errorInfo: ReturnType<typeof ConversionErrorHandler.prototype.classifyError>,
    job: ConversionJob
  ): string[] {
    const suggestions: Record<string, string[]> = {
      'FFMPEG_INIT_ERROR': [
        'Wait a few seconds and try again',
        'Refresh the page if the problem persists',
        'Check your internet connection'
      ],
      'UNSUPPORTED_INPUT_FORMAT': [
        'Use a supported audio format (MP3, WAV, M4A, FLAC, OGG)',
        'Convert your file using another tool first',
        'Check that the file extension matches the actual format'
      ],
      'UNSUPPORTED_OUTPUT_FORMAT': [
        'Choose a supported output format',
        'Use MP3 for general compatibility',
        'Use WAV for uncompressed audio'
      ],
      'SAME_FORMAT_ERROR': [
        'Select a different output format',
        'Choose format based on your needs (MP3 for size, WAV for quality)'
      ],
      'INVALID_BITRATE': [
        'Use standard bitrates: 128k, 192k, 256k, 320k',
        'Try "128k" for good quality and small size',
        'Use "320k" for highest quality'
      ],
      'EMPTY_FILE': [
        'Select a different file',
        'Check that the original file plays correctly',
        'Re-download the file if it came from the internet'
      ],
      'FILE_TOO_LARGE': [
        'Use a file smaller than 300MB',
        'Compress the file using another tool first',
        'Split large files into smaller segments'
      ],
      'MEMORY_ERROR': [
        'Try with a smaller file',
        'Use lower quality settings',
        'Close other browser tabs to free memory',
        'Refresh the page and try again'
      ],
      'NETWORK_ERROR': [
        'Check your internet connection',
        'Try again in a few minutes',
        'Disable browser extensions that might block requests'
      ],
      'TIMEOUT_ERROR': [
        'Try with a smaller file',
        'Use faster conversion settings',
        'Check your internet connection speed'
      ]
    }

    return suggestions[errorInfo.code] || [
      'Try refreshing the page',
      'Try with a different file',
      'Contact support if the problem persists'
    ]
  }

  /**
   * Initialize recovery strategies
   */
  private initializeRecoveryStrategies(): void {
    // Recovery strategy for invalid bitrate
    this.recoveryStrategies.set('INVALID_BITRATE', async (job) => {
      const fallbackBitrate = '128k'
      console.log(`Attempting recovery with fallback bitrate: ${fallbackBitrate}`)
      
      const recoveredJob = {
        ...job,
        options: {
          ...job.options,
          bitrate: fallbackBitrate
        }
      }
      
      // Would need to integrate with actual conversion service
      return null // Placeholder - actual implementation would retry conversion
    })

    // Recovery strategy for invalid sample rate
    this.recoveryStrategies.set('INVALID_SAMPLE_RATE', async (job) => {
      const fallbackSampleRate = 44100
      console.log(`Attempting recovery with fallback sample rate: ${fallbackSampleRate}`)
      
      const recoveredJob = {
        ...job,
        options: {
          ...job.options,
          sampleRate: fallbackSampleRate
        }
      }
      
      return null // Placeholder
    })

    // Recovery strategy for invalid channels
    this.recoveryStrategies.set('INVALID_CHANNELS', async (job) => {
      const fallbackChannels = 2 // Stereo
      console.log(`Attempting recovery with fallback channels: ${fallbackChannels}`)
      
      const recoveredJob = {
        ...job,
        options: {
          ...job.options,
          channels: fallbackChannels
        }
      }
      
      return null // Placeholder
    })

    // Recovery strategy for memory errors
    this.recoveryStrategies.set('MEMORY_ERROR', async (job) => {
      console.log('Attempting recovery by reducing quality settings')
      
      const recoveredJob = {
        ...job,
        options: {
          ...job.options,
          quality: 'low' as const,
          bitrate: '128k'
        }
      }
      
      return null // Placeholder
    })
  }

  /**
   * Record error statistics for analysis
   */
  private recordErrorStatistics(errorCode: string): void {
    const current = this.errorStats.get(errorCode) || 0
    this.errorStats.set(errorCode, current + 1)
  }

  /**
   * Get error statistics
   */
  getErrorStatistics(): Record<string, number> {
    return Object.fromEntries(this.errorStats)
  }

  /**
   * Get most common errors
   */
  getMostCommonErrors(limit = 5): Array<{ code: string; count: number }> {
    return Array.from(this.errorStats.entries())
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  /**
   * Clear error statistics
   */
  clearStatistics(): void {
    this.errorStats.clear()
    console.log('Error statistics cleared')
  }

  /**
   * Create error report for debugging
   */
  createErrorReport(error: Error | ConversionError, job: ConversionJob): {
    timestamp: string
    jobId: string
    errorCode: string
    errorMessage: string
    jobDetails: object
    systemInfo: object
  } {
    return {
      timestamp: new Date().toISOString(),
      jobId: job.id,
      errorCode: error instanceof ConversionError ? error.code : 'UNKNOWN',
      errorMessage: error.message,
      jobDetails: {
        inputFormat: job.options.inputFormat,
        outputFormat: job.options.outputFormat,
        fileSize: job.inputFile.length,
        options: job.options,
        status: job.status,
        createdAt: job.createdAt
      },
      systemInfo: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        platform: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown',
        memory: typeof performance !== 'undefined' && 'memory' in performance 
          ? (performance as any).memory 
          : 'Unknown',
        timestamp: Date.now()
      }
    }
  }

  /**
   * Check if error is user-recoverable
   */
  isUserRecoverable(error: Error | ConversionError): boolean {
    const errorInfo = this.classifyError(error)
    return errorInfo.requiresUserAction && !errorInfo.isRetryable
  }

  /**
   * Get retry delay in milliseconds (exponential backoff)
   */
  getRetryDelay(attemptNumber: number): number {
    const baseDelay = 1000 // 1 second
    const maxDelay = 30000 // 30 seconds
    
    const delay = Math.min(baseDelay * Math.pow(2, attemptNumber - 1), maxDelay)
    
    // Add some jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * delay
    
    return Math.round(delay + jitter)
  }
}