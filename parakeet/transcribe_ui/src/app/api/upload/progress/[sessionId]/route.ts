import { NextRequest } from 'next/server'
import { getProgressTrackingService } from '@/lib/services/progress-tracking'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const sessionId = params.sessionId

  if (!sessionId) {
    return new Response('Session ID required', { status: 400 })
  }

  // Create SSE response
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      
      // Send initial connection message
      const connectionData = {
        type: 'connection',
        sessionId,
        timestamp: new Date().toISOString(),
        message: 'SSE connection established'
      }
      
      controller.enqueue(encoder.encode(
        `data: ${JSON.stringify(connectionData)}\n\n`
      ))

      // Get progress tracking service
      const progressService = getProgressTrackingService()

      // Set up listeners for progress events
      const handleProgress = (progressEvent: any) => {
        if (progressEvent.sessionId === sessionId) {
          const sseData = `data: ${JSON.stringify(progressEvent)}\n\n`
          try {
            controller.enqueue(encoder.encode(sseData))
          } catch (error) {
            console.error('Error sending SSE progress data:', error)
          }
        }
      }

      const handleError = (errorEvent: any) => {
        if (errorEvent.sessionId === sessionId) {
          const sseData = `event: error\ndata: ${JSON.stringify(errorEvent)}\n\n`
          try {
            controller.enqueue(encoder.encode(sseData))
          } catch (error) {
            console.error('Error sending SSE error data:', error)
          }
        }
      }

      const handleComplete = (completeEvent: any) => {
        if (completeEvent.sessionId === sessionId) {
          const sseData = `event: complete\ndata: ${JSON.stringify(completeEvent)}\n\n`
          try {
            controller.enqueue(encoder.encode(sseData))
          } catch (error) {
            console.error('Error sending SSE complete data:', error)
          }
        }
      }

      // Register event listeners
      progressService.on('progress', handleProgress)
      progressService.on('error', handleError)
      progressService.on('complete', handleComplete)

      // Send existing progress data for this session
      const activeTrackers = progressService.getActiveTrackersBySession(sessionId)
      activeTrackers.forEach(tracker => {
        const existingProgress = {
          type: 'upload_progress',
          sessionId: tracker.sessionId,
          fileId: tracker.fileId,
          progress: tracker.currentProgress,
          stage: tracker.stage
        }
        
        const sseData = `data: ${JSON.stringify(existingProgress)}\n\n`
        controller.enqueue(encoder.encode(sseData))
      })

      // Set up heartbeat to keep connection alive
      const heartbeatInterval = setInterval(() => {
        const heartbeat = `event: heartbeat\ndata: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`
        try {
          controller.enqueue(encoder.encode(heartbeat))
        } catch (error) {
          console.error('Error sending heartbeat:', error)
          clearInterval(heartbeatInterval)
        }
      }, 30000) // 30 seconds

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        console.log(`SSE client disconnected for session: ${sessionId}`)
        
        // Clean up listeners
        progressService.off('progress', handleProgress)
        progressService.off('error', handleError)
        progressService.off('complete', handleComplete)
        
        // Clear heartbeat
        clearInterval(heartbeatInterval)
        
        // Close the controller
        try {
          controller.close()
        } catch (error) {
          console.error('Error closing SSE controller:', error)
        }
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
}