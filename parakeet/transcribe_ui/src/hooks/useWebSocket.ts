import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { ProgressEvent, ErrorEvent, CompleteEvent } from '@/lib/websocket-server'

export interface UseWebSocketOptions {
  onProgress?: (progress: ProgressEvent) => void
  onError?: (error: ErrorEvent) => void
  onComplete?: (complete: CompleteEvent) => void
  onConnect?: () => void
  onDisconnect?: () => void
  autoConnect?: boolean
  maxRetries?: number
  retryDelay?: number
}

export interface UseWebSocketReturn {
  isConnected: boolean
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'error'
  lastError: Error | null
  retryCount: number
  connect: () => void
  disconnect: () => void
  joinSession: (sessionId: string) => void
  leaveSession: (sessionId: string) => void
  sendProgress: (progress: ProgressEvent) => void
  socket: Socket | null
}

export function useWebSocket(
  sessionId: string,
  options: UseWebSocketOptions = {}
): UseWebSocketReturn {
  const {
    onProgress,
    onError,
    onComplete,
    onConnect,
    onDisconnect,
    autoConnect = true,
    maxRetries = 5,
    retryDelay = 1000
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')
  const [lastError, setLastError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const socketRef = useRef<Socket | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentSessionRef = useRef<string>('')
  const reconnectingRef = useRef(false)

  // Create socket connection
  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      return
    }

    try {
      setConnectionState('connecting')
      setLastError(null)

      const socket = io({
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true,
        autoConnect: false
      })

      socketRef.current = socket

      // Connection event handlers
      socket.on('connect', () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setConnectionState('connected')
        setRetryCount(0)
        reconnectingRef.current = false

        // Auto-join session if we have one
        if (currentSessionRef.current) {
          socket.emit('join_session', currentSessionRef.current)
        }

        onConnect?.()
      })

      socket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason)
        setIsConnected(false)
        setConnectionState('disconnected')
        onDisconnect?.()

        // Auto-reconnect for certain disconnect reasons
        if (reason === 'io server disconnect' || reason === 'io client disconnect') {
          // Don't auto-reconnect for intentional disconnects
          return
        }

        // Auto-reconnect with exponential backoff
        if (retryCount < maxRetries && !reconnectingRef.current) {
          reconnectingRef.current = true
          const delay = retryDelay * Math.pow(2, retryCount)
          
          retryTimeoutRef.current = setTimeout(() => {
            setRetryCount(prev => prev + 1)
            connect()
          }, delay)
        } else {
          setConnectionState('error')
        }
      })

      socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error)
        setLastError(error)
        setConnectionState('error')
        setIsConnected(false)

        // Retry connection with exponential backoff
        if (retryCount < maxRetries) {
          const delay = retryDelay * Math.pow(2, retryCount)
          
          retryTimeoutRef.current = setTimeout(() => {
            setRetryCount(prev => prev + 1)
            connect()
          }, delay)
        }
      })

      // Progress event handlers
      socket.on('progress_update', (data: ProgressEvent) => {
        onProgress?.(data)
      })

      socket.on('error', (data: ErrorEvent) => {
        onError?.(data)
      })

      socket.on('complete', (data: CompleteEvent) => {
        onComplete?.(data)
      })

      socket.on('progress_error', (error: any) => {
        console.error('Progress error:', error)
        const progressError = new Error(error.message || 'Progress tracking error')
        setLastError(progressError)
      })

      socket.on('connection_confirmed', (data: any) => {
        console.log('Connection confirmed:', data)
      })

      // Connect the socket
      socket.connect()

    } catch (error) {
      console.error('Error creating socket connection:', error)
      setLastError(error as Error)
      setConnectionState('error')
    }
  }, [onProgress, onError, onComplete, onConnect, onDisconnect, retryCount, maxRetries, retryDelay])

  // Disconnect socket
  const disconnect = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }

    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }

    setIsConnected(false)
    setConnectionState('disconnected')
    setRetryCount(0)
    reconnectingRef.current = false
  }, [])

  // Join session
  const joinSession = useCallback((sessionId: string) => {
    currentSessionRef.current = sessionId
    
    if (socketRef.current?.connected) {
      socketRef.current.emit('join_session', sessionId)
      console.log(`Joining session: ${sessionId}`)
    }
  }, [])

  // Leave session
  const leaveSession = useCallback((sessionId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave_session', sessionId)
      console.log(`Leaving session: ${sessionId}`)
    }
    
    if (currentSessionRef.current === sessionId) {
      currentSessionRef.current = ''
    }
  }, [])

  // Send progress update
  const sendProgress = useCallback((progress: ProgressEvent) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('progress_update', progress)
    } else {
      console.warn('Cannot send progress: WebSocket not connected')
    }
  }, [])

  // Auto-connect on mount and sessionId change
  useEffect(() => {
    currentSessionRef.current = sessionId

    if (autoConnect) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [sessionId, connect, disconnect, autoConnect])

  // Join session when connected
  useEffect(() => {
    if (isConnected && sessionId && currentSessionRef.current === sessionId) {
      joinSession(sessionId)
    }
  }, [isConnected, sessionId, joinSession])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
      disconnect()
    }
  }, [disconnect])

  return {
    isConnected,
    connectionState,
    lastError,
    retryCount,
    connect,
    disconnect,
    joinSession,
    leaveSession,
    sendProgress,
    socket: socketRef.current
  }
}