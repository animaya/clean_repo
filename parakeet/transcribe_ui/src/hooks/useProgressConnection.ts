import { useEffect, useState, useCallback } from 'react'
import { useWebSocket } from './useWebSocket'
import { useSSE } from './useSSE'
import { ProgressEvent, ErrorEvent, CompleteEvent } from '@/lib/websocket-server'

export interface UseProgressConnectionOptions {
  onProgress?: (progress: ProgressEvent) => void
  onError?: (error: ErrorEvent) => void
  onComplete?: (complete: CompleteEvent) => void
  onConnect?: () => void
  onDisconnect?: () => void
  preferWebSocket?: boolean
  fallbackToSSE?: boolean
  autoConnect?: boolean
}

export interface UseProgressConnectionReturn {
  isConnected: boolean
  connectionType: 'websocket' | 'sse' | 'none'
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'error'
  lastError: Error | null
  retryCount: number
  connect: () => void
  disconnect: () => void
  forceSSE: () => void
  forceWebSocket: () => void
}

export function useProgressConnection(
  sessionId: string,
  options: UseProgressConnectionOptions = {}
): UseProgressConnectionReturn {
  const {
    onProgress,
    onError,
    onComplete,
    onConnect,
    onDisconnect,
    preferWebSocket = true,
    fallbackToSSE = true,
    autoConnect = true
  } = options

  const [connectionType, setConnectionType] = useState<'websocket' | 'sse' | 'none'>('none')
  const [forcedConnection, setForcedConnection] = useState<'websocket' | 'sse' | null>(null)

  // WebSocket connection
  const webSocket = useWebSocket(sessionId, {
    onProgress,
    onError,
    onComplete,
    onConnect: () => {
      setConnectionType('websocket')
      onConnect?.()
    },
    onDisconnect: () => {
      if (connectionType === 'websocket') {
        onDisconnect?.()
      }
    },
    autoConnect: false // We'll control this manually
  })

  // SSE connection
  const sse = useSSE(sessionId, {
    onProgress,
    onError,
    onComplete,
    onConnect: () => {
      setConnectionType('sse')
      onConnect?.()
    },
    onDisconnect: () => {
      if (connectionType === 'sse') {
        onDisconnect?.()
      }
    },
    autoConnect: false // We'll control this manually
  })

  // Determine which connection to use
  const shouldUseWebSocket = (): boolean => {
    // Check if WebSocket is supported
    if (typeof window !== 'undefined' && !window.WebSocket) {
      return false
    }

    // Check forced connection type
    if (forcedConnection === 'sse') return false
    if (forcedConnection === 'websocket') return true

    // Default preference
    return preferWebSocket
  }

  const shouldUseSSE = (): boolean => {
    // Check forced connection type
    if (forcedConnection === 'websocket') return false
    if (forcedConnection === 'sse') return true

    // Use SSE if WebSocket is not preferred or not supported
    return !shouldUseWebSocket() || (!webSocket.isConnected && fallbackToSSE)
  }

  // Connection management
  const connect = useCallback(() => {
    if (shouldUseWebSocket()) {
      console.log('Attempting WebSocket connection')
      webSocket.connect()
    } else if (shouldUseSSE()) {
      console.log('Attempting SSE connection')
      sse.connect()
    }
  }, [webSocket, sse])

  const disconnect = useCallback(() => {
    webSocket.disconnect()
    sse.disconnect()
    setConnectionType('none')
  }, [webSocket, sse])

  const forceSSE = useCallback(() => {
    setForcedConnection('sse')
    webSocket.disconnect()
    sse.connect()
  }, [webSocket, sse])

  const forceWebSocket = useCallback(() => {
    setForcedConnection('websocket')
    sse.disconnect()
    webSocket.connect()
  }, [webSocket, sse])

  // Auto-connect logic
  useEffect(() => {
    if (autoConnect && sessionId) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [sessionId, autoConnect, connect, disconnect])

  // WebSocket fallback logic
  useEffect(() => {
    if (preferWebSocket && !webSocket.isConnected && webSocket.connectionState === 'error' && fallbackToSSE && !sse.isConnected) {
      console.log('WebSocket failed, falling back to SSE')
      setTimeout(() => {
        if (!webSocket.isConnected && !sse.isConnected) {
          sse.connect()
        }
      }, 1000)
    }
  }, [webSocket.isConnected, webSocket.connectionState, sse.isConnected, preferWebSocket, fallbackToSSE, sse])

  // Determine current connection state
  const getCurrentConnectionState = (): 'disconnected' | 'connecting' | 'connected' | 'error' => {
    if (connectionType === 'websocket') {
      return webSocket.connectionState
    } else if (connectionType === 'sse') {
      return sse.connectionState
    } else {
      // If neither is connected, show the state of the preferred connection
      return shouldUseWebSocket() ? webSocket.connectionState : sse.connectionState
    }
  }

  const isConnected = connectionType === 'websocket' ? webSocket.isConnected : 
                     connectionType === 'sse' ? sse.isConnected : false

  const lastError = connectionType === 'websocket' ? webSocket.lastError :
                   connectionType === 'sse' ? sse.lastError : null

  const retryCount = connectionType === 'websocket' ? webSocket.retryCount :
                    connectionType === 'sse' ? sse.reconnectCount : 0

  return {
    isConnected,
    connectionType,
    connectionState: getCurrentConnectionState(),
    lastError,
    retryCount,
    connect,
    disconnect,
    forceSSE,
    forceWebSocket
  }
}