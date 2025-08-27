import { useEffect, useRef, useState, useCallback } from 'react'
import { ProgressEvent, ErrorEvent, CompleteEvent } from '@/lib/websocket-server'

export interface UseSSEOptions {
  onProgress?: (progress: ProgressEvent) => void
  onError?: (error: ErrorEvent) => void
  onComplete?: (complete: CompleteEvent) => void
  onConnect?: () => void
  onDisconnect?: () => void
  autoConnect?: boolean
  reconnectDelay?: number
  maxReconnectAttempts?: number
}

export interface UseSSEReturn {
  isConnected: boolean
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'error'
  lastError: Error | null
  reconnectCount: number
  connect: () => void
  disconnect: () => void
  eventSource: EventSource | null
}

export function useSSE(
  sessionId: string,
  options: UseSSEOptions = {}
): UseSSEReturn {
  const {
    onProgress,
    onError,
    onComplete,
    onConnect,
    onDisconnect,
    autoConnect = true,
    reconnectDelay = 3000,
    maxReconnectAttempts = 5
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')
  const [lastError, setLastError] = useState<Error | null>(null)
  const [reconnectCount, setReconnectCount] = useState(0)

  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectingRef = useRef(false)

  // Create SSE connection
  const connect = useCallback(() => {
    if (eventSourceRef.current && eventSourceRef.current.readyState === EventSource.OPEN) {
      return
    }

    try {
      setConnectionState('connecting')
      setLastError(null)

      const eventSource = new EventSource(`/api/upload/progress/${sessionId}`)
      eventSourceRef.current = eventSource

      // Connection opened
      eventSource.addEventListener('open', () => {
        console.log('SSE connection opened')
        setIsConnected(true)
        setConnectionState('connected')
        setReconnectCount(0)
        reconnectingRef.current = false
        onConnect?.()
      })

      // Handle generic messages
      eventSource.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'connection') {
            console.log('SSE connection confirmed:', data)
            return
          }

          // Handle progress events
          if (data.type && ['upload_progress', 'conversion_progress', 'transcription_progress'].includes(data.type)) {
            onProgress?.(data as ProgressEvent)
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error)
        }
      })

      // Handle error events
      eventSource.addEventListener('error', (event) => {
        try {
          const data = JSON.parse((event as any).data)
          onError?.(data as ErrorEvent)
        } catch (error) {
          console.error('Error parsing SSE error message:', error)
        }
      })

      // Handle completion events
      eventSource.addEventListener('complete', (event) => {
        try {
          const data = JSON.parse((event as any).data)
          onComplete?.(data as CompleteEvent)
        } catch (error) {
          console.error('Error parsing SSE complete message:', error)
        }
      })

      // Handle heartbeat
      eventSource.addEventListener('heartbeat', (event) => {
        // Just log heartbeat for debugging
        console.debug('SSE heartbeat received')
      })

      // Handle connection errors
      eventSource.addEventListener('error', (event) => {
        console.error('SSE connection error:', event)
        setIsConnected(false)
        setConnectionState('error')
        
        const error = new Error('SSE connection failed')
        setLastError(error)
        onDisconnect?.()

        // Auto-reconnect with delay
        if (reconnectCount < maxReconnectAttempts && !reconnectingRef.current) {
          reconnectingRef.current = true
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectCount(prev => prev + 1)
            connect()
          }, reconnectDelay * Math.pow(1.5, reconnectCount)) // Exponential backoff
        } else {
          setConnectionState('error')
        }
      })

    } catch (error) {
      console.error('Error creating SSE connection:', error)
      setLastError(error as Error)
      setConnectionState('error')
    }
  }, [sessionId, onProgress, onError, onComplete, onConnect, onDisconnect, reconnectCount, maxReconnectAttempts, reconnectDelay])

  // Disconnect SSE
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    setIsConnected(false)
    setConnectionState('disconnected')
    setReconnectCount(0)
    reconnectingRef.current = false
  }, [])

  // Auto-connect on mount and sessionId change
  useEffect(() => {
    if (autoConnect && sessionId) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [sessionId, connect, disconnect, autoConnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      disconnect()
    }
  }, [disconnect])

  return {
    isConnected,
    connectionState,
    lastError,
    reconnectCount,
    connect,
    disconnect,
    eventSource: eventSourceRef.current
  }
}