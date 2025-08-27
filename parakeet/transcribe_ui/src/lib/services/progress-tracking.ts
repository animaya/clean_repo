import { EventEmitter } from 'events'
import { getWebSocketServer, ProgressEvent, ErrorEvent, CompleteEvent } from '../websocket-server'

export interface ProgressTracker {
  sessionId: string
  fileId: string
  currentProgress: number
  stage: string
  startTime: Date
  estimatedTotalTime?: number
}

export class ProgressTrackingService extends EventEmitter {
  private activeTrackers: Map<string, ProgressTracker> = new Map()
  private progressHistory: Map<string, ProgressEvent[]> = new Map()

  constructor() {
    super()
    this.setMaxListeners(100) // Allow many listeners for progress events
  }

  // Progress tracking methods
  
  public startTracking(sessionId: string, fileId: string, initialStage: string = 'initializing'): ProgressTracker {
    const trackerId = this.generateTrackerId(sessionId, fileId)
    
    const tracker: ProgressTracker = {
      sessionId,
      fileId,
      currentProgress: 0,
      stage: initialStage,
      startTime: new Date()
    }

    this.activeTrackers.set(trackerId, tracker)
    this.progressHistory.set(trackerId, [])

    // Emit initial progress
    this.updateProgress(sessionId, fileId, 0, initialStage)

    return tracker
  }

  public updateUploadProgress(
    sessionId: string,
    fileId: string,
    progress: number,
    bytesUploaded?: number,
    totalBytes?: number
  ): void {
    const trackerId = this.generateTrackerId(sessionId, fileId)
    const tracker = this.activeTrackers.get(trackerId)

    if (tracker) {
      tracker.currentProgress = progress
      tracker.stage = 'uploading'
      
      // Calculate ETA if we have bytes info
      let eta: string | undefined
      if (bytesUploaded && totalBytes && progress > 0) {
        const elapsedTime = Date.now() - tracker.startTime.getTime()
        const estimatedTotalTime = (elapsedTime / progress) * 100
        const remainingTime = estimatedTotalTime - elapsedTime
        eta = this.formatETA(remainingTime)
      }

      const progressEvent: ProgressEvent = {
        type: 'upload_progress',
        sessionId,
        fileId,
        progress,
        bytesUploaded,
        totalBytes,
        stage: tracker.stage,
        eta
      }

      this.emitProgress(progressEvent)
    }
  }

  public updateConversionProgress(
    sessionId: string,
    fileId: string,
    progress: number,
    stage: string = 'converting'
  ): void {
    const trackerId = this.generateTrackerId(sessionId, fileId)
    const tracker = this.activeTrackers.get(trackerId)

    if (tracker) {
      tracker.currentProgress = progress
      tracker.stage = stage

      const eta = this.calculateETA(tracker, progress)

      const progressEvent: ProgressEvent = {
        type: 'conversion_progress',
        sessionId,
        fileId,
        progress,
        stage,
        eta: eta ? this.formatETA(eta) : undefined
      }

      this.emitProgress(progressEvent)
    }
  }

  public updateTranscriptionProgress(
    sessionId: string,
    fileId: string,
    progress: number,
    stage: string = 'transcribing'
  ): void {
    const trackerId = this.generateTrackerId(sessionId, fileId)
    const tracker = this.activeTrackers.get(trackerId)

    if (tracker) {
      tracker.currentProgress = progress
      tracker.stage = stage

      const eta = this.calculateETA(tracker, progress)

      const progressEvent: ProgressEvent = {
        type: 'transcription_progress',
        sessionId,
        fileId,
        progress,
        stage,
        eta: eta ? this.formatETA(eta) : undefined
      }

      this.emitProgress(progressEvent)
    }
  }

  public updateProgress(
    sessionId: string,
    fileId: string,
    progress: number,
    stage: string,
    type: ProgressEvent['type'] = 'upload_progress'
  ): void {
    const trackerId = this.generateTrackerId(sessionId, fileId)
    const tracker = this.activeTrackers.get(trackerId)

    if (tracker) {
      tracker.currentProgress = progress
      tracker.stage = stage

      const progressEvent: ProgressEvent = {
        type,
        sessionId,
        fileId,
        progress,
        stage
      }

      this.emitProgress(progressEvent)
    }
  }

  public completeTracking(
    sessionId: string,
    fileId: string,
    success: boolean,
    result?: string
  ): void {
    const trackerId = this.generateTrackerId(sessionId, fileId)
    const tracker = this.activeTrackers.get(trackerId)

    if (tracker) {
      // Final progress update
      this.updateProgress(sessionId, fileId, 100, 'completed')

      // Emit completion event
      const completeEvent: CompleteEvent = {
        type: 'complete',
        sessionId,
        fileId,
        success,
        result
      }

      this.emitComplete(completeEvent)

      // Clean up immediately for completion
      setTimeout(() => {
        this.activeTrackers.delete(trackerId)
      }, 10) // Small delay to ensure event emission completes
      
      // Keep history for a while for debugging
      setTimeout(() => {
        this.progressHistory.delete(trackerId)
      }, 5 * 60 * 1000) // 5 minutes
    }
  }

  public reportError(
    sessionId: string,
    fileId: string,
    error: string,
    details?: string
  ): void {
    const errorEvent: ErrorEvent = {
      type: 'error',
      sessionId,
      fileId,
      error,
      details
    }

    this.emitError(errorEvent)

    // Mark as failed and clean up
    const trackerId = this.generateTrackerId(sessionId, fileId)
    this.activeTrackers.delete(trackerId)
  }

  // Event emission methods

  private emitProgress(progressEvent: ProgressEvent): void {
    const trackerId = this.generateTrackerId(progressEvent.sessionId, progressEvent.fileId)
    
    // Store in history
    const history = this.progressHistory.get(trackerId) || []
    history.push(progressEvent)
    this.progressHistory.set(trackerId, history)

    // Emit via WebSocket if available
    const wsServer = getWebSocketServer()
    if (wsServer) {
      switch (progressEvent.type) {
        case 'upload_progress':
          wsServer.emitUploadProgress(
            progressEvent.sessionId,
            progressEvent.fileId,
            progressEvent.progress,
            progressEvent.bytesUploaded,
            progressEvent.totalBytes
          )
          break
        case 'conversion_progress':
          wsServer.emitConversionProgress(
            progressEvent.sessionId,
            progressEvent.fileId,
            progressEvent.progress,
            progressEvent.stage || 'converting',
            progressEvent.eta
          )
          break
        case 'transcription_progress':
          wsServer.emitTranscriptionProgress(
            progressEvent.sessionId,
            progressEvent.fileId,
            progressEvent.progress,
            progressEvent.stage || 'transcribing',
            progressEvent.eta
          )
          break
      }
    }

    // Emit local event for listeners
    this.emit('progress', progressEvent)
  }

  private emitError(errorEvent: ErrorEvent): void {
    const wsServer = getWebSocketServer()
    if (wsServer) {
      wsServer.emitError(
        errorEvent.sessionId,
        errorEvent.error,
        errorEvent.fileId,
        errorEvent.details
      )
    }

    this.emit('error', errorEvent)
  }

  private emitComplete(completeEvent: CompleteEvent): void {
    const wsServer = getWebSocketServer()
    if (wsServer) {
      wsServer.emitComplete(
        completeEvent.sessionId,
        completeEvent.fileId,
        completeEvent.success,
        completeEvent.result
      )
    }

    this.emit('complete', completeEvent)
  }

  // Utility methods

  private generateTrackerId(sessionId: string, fileId: string): string {
    return `${sessionId}:${fileId}`
  }

  private calculateETA(tracker: ProgressTracker, currentProgress: number): number | null {
    if (currentProgress <= 0) return null

    const elapsedTime = Date.now() - tracker.startTime.getTime()
    const progressPerMs = currentProgress / elapsedTime
    const remainingProgress = 100 - currentProgress
    const estimatedRemainingTime = remainingProgress / progressPerMs

    return estimatedRemainingTime
  }

  private formatETA(milliseconds: number): string {
    const seconds = Math.ceil(milliseconds / 1000)
    
    if (seconds < 60) {
      return `${seconds}s`
    } else if (seconds < 3600) {
      const minutes = Math.ceil(seconds / 60)
      return `${minutes}m`
    } else {
      const hours = Math.floor(seconds / 3600)
      const remainingMinutes = Math.ceil((seconds % 3600) / 60)
      return `${hours}h ${remainingMinutes}m`
    }
  }

  // Query methods

  public getActiveTracker(sessionId: string, fileId: string): ProgressTracker | undefined {
    const trackerId = this.generateTrackerId(sessionId, fileId)
    return this.activeTrackers.get(trackerId)
  }

  public getProgressHistory(sessionId: string, fileId: string): ProgressEvent[] {
    const trackerId = this.generateTrackerId(sessionId, fileId)
    return this.progressHistory.get(trackerId) || []
  }

  public getActiveTrackers(): ProgressTracker[] {
    return Array.from(this.activeTrackers.values())
  }

  public getActiveTrackersBySession(sessionId: string): ProgressTracker[] {
    return Array.from(this.activeTrackers.values()).filter(
      tracker => tracker.sessionId === sessionId
    )
  }

  public isTrackingActive(sessionId: string, fileId: string): boolean {
    const trackerId = this.generateTrackerId(sessionId, fileId)
    return this.activeTrackers.has(trackerId)
  }

  public cleanup(): void {
    this.activeTrackers.clear()
    this.progressHistory.clear()
    this.removeAllListeners()
  }
}

// Singleton instance
let progressTrackingServiceInstance: ProgressTrackingService | null = null

export function getProgressTrackingService(): ProgressTrackingService {
  if (!progressTrackingServiceInstance) {
    progressTrackingServiceInstance = new ProgressTrackingService()
  }
  return progressTrackingServiceInstance
}

export function resetProgressTrackingService(): void {
  if (progressTrackingServiceInstance) {
    progressTrackingServiceInstance.cleanup()
    progressTrackingServiceInstance = null
  }
}