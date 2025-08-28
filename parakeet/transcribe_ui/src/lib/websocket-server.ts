import { Server as SocketIOServer } from 'socket.io'
import { Server as HttpServer } from 'http'

export interface ProgressEvent {
  type: 'upload_progress' | 'conversion_progress' | 'transcription_progress'
  sessionId: string
  fileId: string
  progress: number // 0-100
  bytesUploaded?: number
  totalBytes?: number
  stage?: string
  eta?: string
}

export interface ErrorEvent {
  type: 'error'
  sessionId: string
  fileId?: string
  error: string
  details?: string
}

export interface CompleteEvent {
  type: 'complete'
  sessionId: string
  fileId: string
  success: boolean
  result?: string
}

export type WebSocketEvent = ProgressEvent | ErrorEvent | CompleteEvent

export class WebSocketServer {
  private io: SocketIOServer
  private connectedClients: Map<string, Set<string>> = new Map() // sessionId -> socketIds

  constructor(httpServer: HttpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'production' ? false : '*',
        methods: ['GET', 'POST']
      },
      transports: ['websocket', 'polling']
    })

    this.setupEventHandlers()
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(`WebSocket client connected: ${socket.id}`)

      // Handle session joining
      socket.on('join_session', (sessionId: string) => {
        this.joinSession(socket.id, sessionId)
        socket.join(sessionId)
        console.log(`Client ${socket.id} joined session ${sessionId}`)
      })

      // Handle session leaving
      socket.on('leave_session', (sessionId: string) => {
        this.leaveSession(socket.id, sessionId)
        socket.leave(sessionId)
        console.log(`Client ${socket.id} left session ${sessionId}`)
      })

      // Handle client progress updates (if clients need to send progress)
      socket.on('progress_update', (progressEvent: ProgressEvent) => {
        if (this.validateProgressEvent(progressEvent)) {
          this.broadcastToSession(progressEvent.sessionId, 'progress_update', progressEvent)
        } else {
          socket.emit('progress_error', { 
            message: 'Invalid progress data',
            details: 'Progress must be between 0-100 and include required fields'
          })
        }
      })

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        console.log(`Client ${socket.id} disconnected: ${reason}`)
        this.removeFromAllSessions(socket.id)
      })

      // Handle connection errors
      socket.on('error', (error) => {
        console.error(`Socket error for ${socket.id}:`, error)
      })

      // Send connection confirmation
      socket.emit('connection_confirmed', { 
        socketId: socket.id,
        timestamp: new Date().toISOString()
      })
    })
  }

  private joinSession(socketId: string, sessionId: string): void {
    if (!this.connectedClients.has(sessionId)) {
      this.connectedClients.set(sessionId, new Set())
    }
    this.connectedClients.get(sessionId)!.add(socketId)
  }

  private leaveSession(socketId: string, sessionId: string): void {
    const sessionClients = this.connectedClients.get(sessionId)
    if (sessionClients) {
      sessionClients.delete(socketId)
      if (sessionClients.size === 0) {
        this.connectedClients.delete(sessionId)
      }
    }
  }

  private removeFromAllSessions(socketId: string): void {
    for (const [sessionId, clients] of this.connectedClients.entries()) {
      if (clients.has(socketId)) {
        clients.delete(socketId)
        if (clients.size === 0) {
          this.connectedClients.delete(sessionId)
        }
      }
    }
  }

  private validateProgressEvent(event: ProgressEvent): boolean {
    return (
      !!event.type && 
      ['upload_progress', 'conversion_progress', 'transcription_progress'].includes(event.type) &&
      !!event.sessionId &&
      !!event.fileId &&
      typeof event.progress === 'number' &&
      event.progress >= 0 &&
      event.progress <= 100
    )
  }

  // Public methods for server-side progress emission

  public emitUploadProgress(
    sessionId: string,
    fileId: string,
    progress: number,
    bytesUploaded?: number,
    totalBytes?: number
  ): void {
    const progressEvent: ProgressEvent = {
      type: 'upload_progress',
      sessionId,
      fileId,
      progress,
      bytesUploaded,
      totalBytes
    }

    this.broadcastToSession(sessionId, 'progress_update', progressEvent)
  }

  public emitConversionProgress(
    sessionId: string,
    fileId: string,
    progress: number,
    stage: string,
    eta?: string
  ): void {
    const progressEvent: ProgressEvent = {
      type: 'conversion_progress',
      sessionId,
      fileId,
      progress,
      stage,
      eta
    }

    this.broadcastToSession(sessionId, 'progress_update', progressEvent)
  }

  public emitTranscriptionProgress(
    sessionId: string,
    fileId: string,
    progress: number,
    stage: string,
    eta?: string
  ): void {
    const progressEvent: ProgressEvent = {
      type: 'transcription_progress',
      sessionId,
      fileId,
      progress,
      stage,
      eta
    }

    this.broadcastToSession(sessionId, 'progress_update', progressEvent)
  }

  public emitError(
    sessionId: string,
    error: string,
    fileId?: string,
    details?: string
  ): void {
    const errorEvent: ErrorEvent = {
      type: 'error',
      sessionId,
      fileId,
      error,
      details
    }

    this.broadcastToSession(sessionId, 'error', errorEvent)
  }

  public emitComplete(
    sessionId: string,
    fileId: string,
    success: boolean,
    result?: string
  ): void {
    const completeEvent: CompleteEvent = {
      type: 'complete',
      sessionId,
      fileId,
      success,
      result
    }

    this.broadcastToSession(sessionId, 'complete', completeEvent)
  }

  private broadcastToSession(sessionId: string, eventName: string, data: any): void {
    this.io.to(sessionId).emit(eventName, data)
    console.log(`Broadcasted ${eventName} to session ${sessionId}:`, data)
  }

  public getConnectedClients(): Map<string, Set<string>> {
    return new Map(this.connectedClients)
  }

  public getSessionClientCount(sessionId: string): number {
    return this.connectedClients.get(sessionId)?.size || 0
  }

  public close(): void {
    this.io.close()
    this.connectedClients.clear()
  }
}

// Singleton instance for use across the application
let webSocketServerInstance: WebSocketServer | null = null

export function initializeWebSocketServer(httpServer: HttpServer): WebSocketServer {
  if (!webSocketServerInstance) {
    webSocketServerInstance = new WebSocketServer(httpServer)
  }
  return webSocketServerInstance
}

export function getWebSocketServer(): WebSocketServer | null {
  return webSocketServerInstance
}