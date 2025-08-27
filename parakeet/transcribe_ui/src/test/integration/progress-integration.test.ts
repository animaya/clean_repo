import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getProgressTrackingService, resetProgressTrackingService } from '@/lib/services/progress-tracking'
import { getErrorRecoveryService, resetErrorRecoveryService } from '@/lib/services/error-recovery'

describe('Progress Tracking Integration', () => {
  let progressService: ReturnType<typeof getProgressTrackingService>
  let errorService: ReturnType<typeof getErrorRecoveryService>

  beforeEach(() => {
    // Reset services for each test
    resetProgressTrackingService()
    resetErrorRecoveryService()
    
    progressService = getProgressTrackingService()
    errorService = getErrorRecoveryService()
  })

  afterEach(() => {
    // Clean up after each test
    progressService.cleanup()
    errorService.cleanup()
  })

  describe('Progress Tracking Service', () => {
    it('should start tracking progress', () => {
      const sessionId = 'test-session-123'
      const fileId = 'test-file-456'
      
      const tracker = progressService.startTracking(sessionId, fileId, 'initializing')
      
      expect(tracker).toBeDefined()
      expect(tracker.sessionId).toBe(sessionId)
      expect(tracker.fileId).toBe(fileId)
      expect(tracker.currentProgress).toBe(0)
      expect(tracker.stage).toBe('initializing')
      expect(tracker.startTime).toBeInstanceOf(Date)
    })

    it('should update upload progress', async () => {
      const sessionId = 'test-session-123'
      const fileId = 'test-file-456'
      
      progressService.startTracking(sessionId, fileId)
      
      const progressPromise = new Promise((resolve) => {
        progressService.on('progress', (progressEvent) => {
          expect(progressEvent.type).toBe('upload_progress')
          expect(progressEvent.sessionId).toBe(sessionId)
          expect(progressEvent.fileId).toBe(fileId)
          expect(progressEvent.progress).toBe(50)
          expect(progressEvent.bytesUploaded).toBe(5000)
          expect(progressEvent.totalBytes).toBe(10000)
          resolve(progressEvent)
        })
      })
      
      progressService.updateUploadProgress(sessionId, fileId, 50, 5000, 10000)
      await progressPromise
    })

    it('should update conversion progress', async () => {
      const sessionId = 'test-session-123'
      const fileId = 'test-file-456'
      
      progressService.startTracking(sessionId, fileId)
      
      const progressPromise = new Promise((resolve) => {
        progressService.on('progress', (progressEvent) => {
          expect(progressEvent.type).toBe('conversion_progress')
          expect(progressEvent.sessionId).toBe(sessionId)
          expect(progressEvent.fileId).toBe(fileId)
          expect(progressEvent.progress).toBe(75)
          expect(progressEvent.stage).toBe('converting')
          resolve(progressEvent)
        })
      })
      
      progressService.updateConversionProgress(sessionId, fileId, 75, 'converting')
      await progressPromise
    })

    it('should update transcription progress', async () => {
      const sessionId = 'test-session-123'
      const fileId = 'test-file-456'
      
      progressService.startTracking(sessionId, fileId)
      
      const progressPromise = new Promise((resolve) => {
        progressService.on('progress', (progressEvent) => {
          expect(progressEvent.type).toBe('transcription_progress')
          expect(progressEvent.sessionId).toBe(sessionId)
          expect(progressEvent.fileId).toBe(fileId)
          expect(progressEvent.progress).toBe(90)
          expect(progressEvent.stage).toBe('transcribing')
          resolve(progressEvent)
        })
      })
      
      progressService.updateTranscriptionProgress(sessionId, fileId, 90, 'transcribing')
      await progressPromise
    })

    it('should complete tracking', async () => {
      const sessionId = 'test-session-123'
      const fileId = 'test-file-456'
      
      progressService.startTracking(sessionId, fileId)
      
      const completePromise = new Promise((resolve) => {
        progressService.on('complete', (completeEvent) => {
          expect(completeEvent.type).toBe('complete')
          expect(completeEvent.sessionId).toBe(sessionId)
          expect(completeEvent.fileId).toBe(fileId)
          expect(completeEvent.success).toBe(true)
          expect(completeEvent.result).toBe('Transcription completed successfully')
          resolve(completeEvent)
        })
      })
      
      progressService.completeTracking(sessionId, fileId, true, 'Transcription completed successfully')
      await completePromise
    })

    it('should report errors', async () => {
      const sessionId = 'test-session-123'
      const fileId = 'test-file-456'
      
      progressService.startTracking(sessionId, fileId)
      
      const errorPromise = new Promise((resolve) => {
        progressService.on('error', (errorEvent) => {
          expect(errorEvent.type).toBe('error')
          expect(errorEvent.sessionId).toBe(sessionId)
          expect(errorEvent.fileId).toBe(fileId)
          expect(errorEvent.error).toBe('Conversion failed')
          expect(errorEvent.details).toBe('Unsupported format')
          resolve(errorEvent)
        })
      })
      
      progressService.reportError(sessionId, fileId, 'Conversion failed', 'Unsupported format')
      await errorPromise
    })

    it('should get active tracker', () => {
      const sessionId = 'test-session-123'
      const fileId = 'test-file-456'
      
      progressService.startTracking(sessionId, fileId)
      
      const tracker = progressService.getActiveTracker(sessionId, fileId)
      expect(tracker).toBeDefined()
      expect(tracker?.sessionId).toBe(sessionId)
      expect(tracker?.fileId).toBe(fileId)
    })

    it('should check if tracking is active', () => {
      const sessionId = 'test-session-123'
      const fileId = 'test-file-456'
      
      expect(progressService.isTrackingActive(sessionId, fileId)).toBe(false)
      
      progressService.startTracking(sessionId, fileId)
      expect(progressService.isTrackingActive(sessionId, fileId)).toBe(true)
    })

    it('should get progress history', () => {
      const sessionId = 'test-session-123'
      const fileId = 'test-file-456'
      
      progressService.startTracking(sessionId, fileId)
      progressService.updateUploadProgress(sessionId, fileId, 25)
      progressService.updateUploadProgress(sessionId, fileId, 50)
      
      const history = progressService.getProgressHistory(sessionId, fileId)
      expect(history).toHaveLength(3) // initial + 2 updates
      expect(history[1].progress).toBe(25)
      expect(history[2].progress).toBe(50)
    })
  })

  describe('Error Recovery Service', () => {
    it('should handle WebSocket connection errors', async () => {
      const sessionId = 'test-session-123'
      const error = {
        type: 'websocket' as const,
        message: 'Connection failed',
        timestamp: new Date(),
        attemptNumber: 1
      }

      let recoveryAttempted = false
      errorService.on('recovery-attempt', () => {
        recoveryAttempted = true
      })

      await errorService.handleError(sessionId, error)
      expect(recoveryAttempted).toBe(true)
    })

    it('should schedule retry with exponential backoff', () => {
      const sessionId = 'test-session-123'
      const error = {
        type: 'websocket' as const,
        message: 'Connection failed',
        timestamp: new Date(),
        attemptNumber: 2
      }

      let retryScheduled = false
      errorService.on('retry-scheduled', ({ delay }) => {
        retryScheduled = true
        expect(delay).toBeGreaterThan(1000) // Should be more than base delay due to backoff
      })

      errorService.scheduleRetry(sessionId, error)
      expect(retryScheduled).toBe(true)
    })

    it('should cancel retries', () => {
      const sessionId = 'test-session-123'
      const error = {
        type: 'network' as const,
        message: 'Network error',
        timestamp: new Date(),
        attemptNumber: 1
      }

      errorService.scheduleRetry(sessionId, error)
      expect(errorService.isRetryActive(sessionId)).toBe(true)

      errorService.cancelRetry(sessionId)
      expect(errorService.isRetryActive(sessionId)).toBe(false)
    })

    it('should add custom recovery strategy', async () => {
      const customStrategy = {
        name: 'custom-strategy',
        priority: 10,
        canHandle: (error: any) => error.type === 'custom',
        execute: vi.fn().mockResolvedValue(true)
      }

      errorService.addRecoveryStrategy(customStrategy)

      const error = {
        type: 'custom' as any,
        message: 'Custom error',
        timestamp: new Date(),
        attemptNumber: 1
      }

      await errorService.handleError('test-session', error)
      expect(customStrategy.execute).toHaveBeenCalledWith(error)
    })

    it('should track error history', () => {
      const sessionId = 'test-session-123'
      const error1 = {
        type: 'websocket' as const,
        message: 'Connection failed',
        timestamp: new Date(),
        attemptNumber: 1
      }
      const error2 = {
        type: 'network' as const,
        message: 'Network error',
        timestamp: new Date(),
        attemptNumber: 1
      }

      errorService.handleError(sessionId, error1)
      errorService.handleError(sessionId, error2)

      const history = errorService.getErrorHistory()
      expect(history).toHaveLength(2)
      expect(history[0]).toEqual(error1)
      expect(history[1]).toEqual(error2)
    })

    it('should stop retrying after max attempts', async () => {
      const sessionId = 'test-session-123'
      const error = {
        type: 'websocket' as const,
        message: 'Connection failed',
        timestamp: new Date(),
        attemptNumber: 10 // Exceeds default maxAttempts (5)
      }

      let maxAttemptsReached = false
      errorService.on('max-attempts-reached', () => {
        maxAttemptsReached = true
      })

      const result = await errorService.handleError(sessionId, error)
      expect(result).toBe(false)
      expect(maxAttemptsReached).toBe(true)
    })
  })

  describe('Integration Scenarios', () => {
    it('should handle full upload-to-transcription flow', async () => {
      const sessionId = 'test-session-123'
      const fileId = 'test-file-456'
      
      let progressEvents: any[] = []

      const completePromise = new Promise((resolve) => {
        progressService.on('progress', (event) => {
          progressEvents.push(event)
        })

        progressService.on('complete', async () => {
          // Verify we received progress events
          expect(progressEvents.length).toBeGreaterThan(0)
          
          // Wait for cleanup to complete
          await new Promise(resolve => setTimeout(resolve, 20))
          
          // Verify final state after cleanup
          expect(progressService.isTrackingActive(sessionId, fileId)).toBe(false)
          resolve(true)
        })
      })

      // Simulate full flow
      progressService.startTracking(sessionId, fileId, 'initializing')
      progressService.updateUploadProgress(sessionId, fileId, 25)
      progressService.updateUploadProgress(sessionId, fileId, 50)
      progressService.updateConversionProgress(sessionId, fileId, 75, 'converting')
      progressService.updateTranscriptionProgress(sessionId, fileId, 90, 'transcribing')
      progressService.completeTracking(sessionId, fileId, true, 'Success')
      
      await completePromise
    })

    it('should handle error recovery flow', async () => {
      const sessionId = 'test-session-123'
      const fileId = 'test-file-456'
      
      // Start tracking
      progressService.startTracking(sessionId, fileId)
      
      // Simulate error
      const error = {
        type: 'websocket' as const,
        message: 'Connection lost',
        timestamp: new Date(),
        attemptNumber: 1
      }

      let errorReceived = false
      progressService.on('error', () => {
        errorReceived = true
      })

      // Report error through progress service
      progressService.reportError(sessionId, fileId, 'Connection lost')
      
      // Handle error through recovery service
      await errorService.handleError(sessionId, error)
      
      expect(errorReceived).toBe(true)
      expect(progressService.isTrackingActive(sessionId, fileId)).toBe(false)
    })

    it('should handle multiple concurrent sessions', () => {
      const session1 = 'session-1'
      const session2 = 'session-2'
      const file1 = 'file-1'
      const file2 = 'file-2'
      
      // Start tracking for both sessions
      progressService.startTracking(session1, file1)
      progressService.startTracking(session2, file2)
      
      // Update progress for both
      progressService.updateUploadProgress(session1, file1, 30)
      progressService.updateUploadProgress(session2, file2, 60)
      
      // Verify both are tracked
      expect(progressService.isTrackingActive(session1, file1)).toBe(true)
      expect(progressService.isTrackingActive(session2, file2)).toBe(true)
      
      const tracker1 = progressService.getActiveTracker(session1, file1)
      const tracker2 = progressService.getActiveTracker(session2, file2)
      
      expect(tracker1?.currentProgress).toBe(30)
      expect(tracker2?.currentProgress).toBe(60)
    })
  })
})