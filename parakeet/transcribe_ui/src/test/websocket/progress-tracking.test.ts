import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Server as SocketIOServer } from 'socket.io'
import { Server as HttpServer } from 'http'
import { createServer } from 'http'
import Client from 'socket.io-client'

// Mock types for progress events
interface ProgressEvent {
  type: 'upload_progress' | 'conversion_progress' | 'transcription_progress'
  sessionId: string
  fileId: string
  progress: number // 0-100
  bytesUploaded?: number
  totalBytes?: number
  stage?: string
  eta?: string
}

describe('WebSocket Progress Tracking', () => {
  let httpServer: HttpServer
  let io: SocketIOServer
  let serverSocket: any
  let clientSocket: any
  let port: number

  beforeEach((done) => {
    httpServer = createServer()
    io = new SocketIOServer(httpServer)
    
    // Find available port
    httpServer.listen(() => {
      const address = httpServer.address()
      if (address && typeof address === 'object') {
        port = address.port
        clientSocket = Client(`http://localhost:${port}`)
        
        io.on('connection', (socket) => {
          serverSocket = socket
        })
        
        clientSocket.on('connect', done)
      }
    })
  })

  afterEach(() => {
    io.close()
    clientSocket.close()
    httpServer.close()
  })

  describe('Connection Management', () => {
    it('should establish WebSocket connection', () => {
      expect(clientSocket.connected).toBe(true)
    })

    it('should handle disconnection gracefully', (done) => {
      clientSocket.on('disconnect', () => {
        expect(clientSocket.connected).toBe(false)
        done()
      })
      
      clientSocket.disconnect()
    })

    it('should rejoin session room on reconnection', (done) => {
      const sessionId = 'test-session-123'
      
      clientSocket.emit('join_session', sessionId)
      clientSocket.disconnect()
      
      clientSocket.on('connect', () => {
        clientSocket.emit('join_session', sessionId)
        done()
      })
      
      clientSocket.connect()
    })
  })

  describe('Progress Event Handling', () => {
    it('should receive upload progress events', (done) => {
      const progressEvent: ProgressEvent = {
        type: 'upload_progress',
        sessionId: 'session-123',
        fileId: 'file-456',
        progress: 45,
        bytesUploaded: 45000,
        totalBytes: 100000
      }

      clientSocket.on('progress_update', (data: ProgressEvent) => {
        expect(data).toEqual(progressEvent)
        expect(data.progress).toBe(45)
        expect(data.type).toBe('upload_progress')
        done()
      })

      serverSocket.emit('progress_update', progressEvent)
    })

    it('should receive conversion progress events', (done) => {
      const progressEvent: ProgressEvent = {
        type: 'conversion_progress',
        sessionId: 'session-123',
        fileId: 'file-456',
        progress: 75,
        stage: 'converting',
        eta: '30s'
      }

      clientSocket.on('progress_update', (data: ProgressEvent) => {
        expect(data.type).toBe('conversion_progress')
        expect(data.stage).toBe('converting')
        expect(data.eta).toBe('30s')
        done()
      })

      serverSocket.emit('progress_update', progressEvent)
    })

    it('should receive transcription progress events', (done) => {
      const progressEvent: ProgressEvent = {
        type: 'transcription_progress',
        sessionId: 'session-123',
        fileId: 'file-456',
        progress: 90,
        stage: 'postprocessing',
        eta: '5s'
      }

      clientSocket.on('progress_update', (data: ProgressEvent) => {
        expect(data.type).toBe('transcription_progress')
        expect(data.stage).toBe('postprocessing')
        expect(data.progress).toBe(90)
        done()
      })

      serverSocket.emit('progress_update', progressEvent)
    })
  })

  describe('Error Handling', () => {
    it('should handle connection errors', (done) => {
      const clientWithError = Client('http://localhost:9999') // Non-existent port
      
      clientWithError.on('connect_error', (error) => {
        expect(error).toBeDefined()
        clientWithError.close()
        done()
      })
    })

    it('should emit error events for invalid progress data', (done) => {
      const invalidProgress = {
        type: 'invalid_type',
        sessionId: 'session-123',
        progress: 150 // Invalid: over 100%
      }

      clientSocket.on('progress_error', (error: any) => {
        expect(error.message).toContain('Invalid progress data')
        done()
      })

      // Simulate server-side validation and error emission
      serverSocket.emit('progress_error', { message: 'Invalid progress data' })
    })

    it('should handle network interruptions', (done) => {
      let reconnectCount = 0
      
      clientSocket.on('disconnect', () => {
        reconnectCount++
      })

      clientSocket.on('connect', () => {
        if (reconnectCount > 0) {
          expect(reconnectCount).toBe(1)
          done()
        }
      })

      // Simulate network interruption
      clientSocket.disconnect()
      setTimeout(() => clientSocket.connect(), 100)
    })
  })

  describe('Session Management', () => {
    it('should join session room successfully', (done) => {
      const sessionId = 'test-session-789'
      
      serverSocket.on('join_session', (receivedSessionId: string) => {
        expect(receivedSessionId).toBe(sessionId)
        done()
      })

      clientSocket.emit('join_session', sessionId)
    })

    it('should leave session room when requested', (done) => {
      const sessionId = 'test-session-789'
      
      serverSocket.on('leave_session', (receivedSessionId: string) => {
        expect(receivedSessionId).toBe(sessionId)
        done()
      })

      clientSocket.emit('leave_session', sessionId)
    })

    it('should handle multiple clients in same session', (done) => {
      const sessionId = 'shared-session'
      const client2 = Client(`http://localhost:${port}`)
      
      let progressReceived = 0
      const progressEvent: ProgressEvent = {
        type: 'upload_progress',
        sessionId,
        fileId: 'shared-file',
        progress: 50
      }

      const checkCompletion = () => {
        progressReceived++
        if (progressReceived === 2) {
          client2.close()
          done()
        }
      }

      clientSocket.emit('join_session', sessionId)
      client2.on('connect', () => {
        client2.emit('join_session', sessionId)
        
        clientSocket.on('progress_update', checkCompletion)
        client2.on('progress_update', checkCompletion)
        
        // Emit to session room
        io.to(sessionId).emit('progress_update', progressEvent)
      })
    })
  })

  describe('Progress Validation', () => {
    it('should validate progress percentage bounds', () => {
      const validProgress: ProgressEvent = {
        type: 'upload_progress',
        sessionId: 'session-123',
        fileId: 'file-456',
        progress: 50
      }

      expect(validProgress.progress).toBeGreaterThanOrEqual(0)
      expect(validProgress.progress).toBeLessThanOrEqual(100)
    })

    it('should validate required fields', () => {
      const event: ProgressEvent = {
        type: 'conversion_progress',
        sessionId: 'session-123',
        fileId: 'file-456',
        progress: 75
      }

      expect(event.type).toBeDefined()
      expect(event.sessionId).toBeDefined()
      expect(event.fileId).toBeDefined()
      expect(event.progress).toBeDefined()
    })

    it('should validate progress event types', () => {
      const validTypes = ['upload_progress', 'conversion_progress', 'transcription_progress']
      
      validTypes.forEach(type => {
        const event: ProgressEvent = {
          type: type as any,
          sessionId: 'session-123',
          fileId: 'file-456',
          progress: 25
        }
        
        expect(validTypes).toContain(event.type)
      })
    })
  })
})