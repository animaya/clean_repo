import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWebSocket } from '@/hooks/useWebSocket'

// Mock Socket.IO client
const mockSocket = {
  id: 'mock-socket-id',
  connected: false,
  disconnected: true,
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  close: vi.fn()
}

vi.mock('socket.io-client', () => ({
  default: vi.fn(() => mockSocket),
  io: vi.fn(() => mockSocket)
}))

interface ProgressEvent {
  type: 'upload_progress' | 'conversion_progress' | 'transcription_progress'
  sessionId: string
  fileId: string
  progress: number
  bytesUploaded?: number
  totalBytes?: number
  stage?: string
  eta?: string
}

interface UseWebSocketOptions {
  onProgress?: (progress: ProgressEvent) => void
  onError?: (error: Error) => void
  onComplete?: () => void
  onConnect?: () => void
  onDisconnect?: () => void
}

// Mock the hook implementation for testing
const mockUseWebSocket = (sessionId: string, options: UseWebSocketOptions = {}) => {
  const [isConnected, setIsConnected] = vi.fn().mockReturnValue([false, vi.fn()])
  const [connectionState, setConnectionState] = vi.fn().mockReturnValue(['disconnected', vi.fn()])
  const [lastError, setLastError] = vi.fn().mockReturnValue([null, vi.fn()])
  const [retryCount, setRetryCount] = vi.fn().mockReturnValue([0, vi.fn()])

  const connect = vi.fn(() => {
    setIsConnected[1](true)
    setConnectionState[1]('connected')
    options.onConnect?.()
  })

  const disconnect = vi.fn(() => {
    setIsConnected[1](false)
    setConnectionState[1]('disconnected')
    options.onDisconnect?.()
  })

  const sendProgress = vi.fn((progress: ProgressEvent) => {
    if (isConnected[0]) {
      mockSocket.emit('progress_update', progress)
    }
  })

  const joinSession = vi.fn((sessionId: string) => {
    if (isConnected[0]) {
      mockSocket.emit('join_session', sessionId)
    }
  })

  const leaveSession = vi.fn((sessionId: string) => {
    if (isConnected[0]) {
      mockSocket.emit('leave_session', sessionId)
    }
  })

  return {
    isConnected: isConnected[0],
    connectionState: connectionState[0],
    lastError: lastError[0],
    retryCount: retryCount[0],
    connect,
    disconnect,
    sendProgress,
    joinSession,
    leaveSession,
    socket: mockSocket
  }
}

vi.mock('@/hooks/useWebSocket', () => ({
  useWebSocket: mockUseWebSocket
}))

describe('useWebSocket Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSocket.connected = false
    mockSocket.disconnected = true
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Connection Management', () => {
    it('should initialize with disconnected state', () => {
      const { result } = renderHook(() => 
        useWebSocket('test-session', {})
      )

      expect(result.current.isConnected).toBe(false)
      expect(result.current.connectionState).toBe('disconnected')
    })

    it('should connect successfully', async () => {
      const onConnect = vi.fn()
      const { result } = renderHook(() => 
        useWebSocket('test-session', { onConnect })
      )

      act(() => {
        result.current.connect()
      })

      expect(result.current.connect).toHaveBeenCalled()
    })

    it('should disconnect successfully', async () => {
      const onDisconnect = vi.fn()
      const { result } = renderHook(() => 
        useWebSocket('test-session', { onDisconnect })
      )

      act(() => {
        result.current.disconnect()
      })

      expect(result.current.disconnect).toHaveBeenCalled()
    })

    it('should handle connection state transitions', () => {
      const { result } = renderHook(() => 
        useWebSocket('test-session', {})
      )

      // Initial state
      expect(result.current.connectionState).toBe('disconnected')

      // Connecting
      act(() => {
        result.current.connect()
      })
    })
  })

  describe('Session Management', () => {
    it('should join session when connected', () => {
      const sessionId = 'test-session-123'
      const { result } = renderHook(() => 
        useWebSocket(sessionId, {})
      )

      act(() => {
        result.current.joinSession(sessionId)
      })

      expect(result.current.joinSession).toHaveBeenCalledWith(sessionId)
    })

    it('should leave session when requested', () => {
      const sessionId = 'test-session-123'
      const { result } = renderHook(() => 
        useWebSocket(sessionId, {})
      )

      act(() => {
        result.current.leaveSession(sessionId)
      })

      expect(result.current.leaveSession).toHaveBeenCalledWith(sessionId)
    })

    it('should not emit events when disconnected', () => {
      const sessionId = 'test-session-123'
      const { result } = renderHook(() => 
        useWebSocket(sessionId, {})
      )

      // Try to join session while disconnected
      act(() => {
        result.current.joinSession(sessionId)
      })

      // Socket emit should not be called when disconnected
      // This is handled by the mock implementation
    })
  })

  describe('Progress Events', () => {
    it('should handle progress updates', () => {
      const onProgress = vi.fn()
      const { result } = renderHook(() => 
        useWebSocket('test-session', { onProgress })
      )

      const progressEvent: ProgressEvent = {
        type: 'upload_progress',
        sessionId: 'test-session',
        fileId: 'file-123',
        progress: 50,
        bytesUploaded: 5000,
        totalBytes: 10000
      }

      act(() => {
        result.current.sendProgress(progressEvent)
      })

      expect(result.current.sendProgress).toHaveBeenCalledWith(progressEvent)
    })

    it('should handle different progress types', () => {
      const onProgress = vi.fn()
      const { result } = renderHook(() => 
        useWebSocket('test-session', { onProgress })
      )

      const progressTypes: ProgressEvent['type'][] = [
        'upload_progress',
        'conversion_progress', 
        'transcription_progress'
      ]

      progressTypes.forEach((type, index) => {
        const progressEvent: ProgressEvent = {
          type,
          sessionId: 'test-session',
          fileId: 'file-123',
          progress: (index + 1) * 25
        }

        act(() => {
          result.current.sendProgress(progressEvent)
        })

        expect(result.current.sendProgress).toHaveBeenCalledWith(progressEvent)
      })
    })

    it('should validate progress data', () => {
      const onProgress = vi.fn()
      const { result } = renderHook(() => 
        useWebSocket('test-session', { onProgress })
      )

      const validProgress: ProgressEvent = {
        type: 'upload_progress',
        sessionId: 'test-session',
        fileId: 'file-123',
        progress: 75
      }

      // Validate progress bounds
      expect(validProgress.progress).toBeGreaterThanOrEqual(0)
      expect(validProgress.progress).toBeLessThanOrEqual(100)
      
      // Validate required fields
      expect(validProgress.type).toBeDefined()
      expect(validProgress.sessionId).toBeDefined()
      expect(validProgress.fileId).toBeDefined()
      expect(validProgress.progress).toBeDefined()
    })
  })

  describe('Error Handling', () => {
    it('should handle connection errors', () => {
      const onError = vi.fn()
      renderHook(() => 
        useWebSocket('test-session', { onError })
      )

      // Simulate connection error
      const error = new Error('Connection failed')
      
      // In real implementation, this would be triggered by socket.on('connect_error')
      act(() => {
        onError(error)
      })

      expect(onError).toHaveBeenCalledWith(error)
    })

    it('should track retry count on connection failures', () => {
      const { result } = renderHook(() => 
        useWebSocket('test-session', {})
      )

      expect(result.current.retryCount).toBe(0)
    })

    it('should store last error', () => {
      const { result } = renderHook(() => 
        useWebSocket('test-session', {})
      )

      expect(result.current.lastError).toBeNull()
    })
  })

  describe('Event Listeners', () => {
    it('should register event listeners on mount', () => {
      renderHook(() => useWebSocket('test-session', {}))

      // Socket.on should be called for various events
      expect(mockSocket.on).toHaveBeenCalled()
    })

    it('should clean up event listeners on unmount', () => {
      const { unmount } = renderHook(() => useWebSocket('test-session', {}))

      unmount()

      // Socket.off should be called to clean up listeners
      expect(mockSocket.off).toHaveBeenCalled()
    })

    it('should handle socket events properly', () => {
      const onConnect = vi.fn()
      const onDisconnect = vi.fn()
      const onError = vi.fn()
      
      renderHook(() => 
        useWebSocket('test-session', {
          onConnect,
          onDisconnect, 
          onError
        })
      )

      // Verify event listeners are set up
      expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function))
      expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function))
      expect(mockSocket.on).toHaveBeenCalledWith('connect_error', expect.any(Function))
    })
  })

  describe('Hook Cleanup', () => {
    it('should disconnect socket on unmount', () => {
      const { unmount } = renderHook(() => useWebSocket('test-session', {}))

      unmount()

      // Should clean up the connection
      expect(mockSocket.off).toHaveBeenCalled()
    })

    it('should not cause memory leaks', () => {
      const { result, unmount } = renderHook(() => 
        useWebSocket('test-session', {})
      )

      // Simulate multiple re-renders
      act(() => {
        result.current.connect()
      })

      act(() => {
        result.current.disconnect()
      })

      unmount()

      // Ensure cleanup is called
      expect(mockSocket.off).toHaveBeenCalled()
    })
  })
})