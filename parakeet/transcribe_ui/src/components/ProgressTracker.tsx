import React, { useState, useEffect, useCallback } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { ProgressEvent, ErrorEvent, CompleteEvent } from '@/lib/websocket-server'

export interface ProgressTrackerProps {
  sessionId: string
  fileId: string
  fileName?: string
  onProgressUpdate?: (progress: ProgressEvent) => void
  onComplete?: (complete: CompleteEvent) => void
  onError?: (error: ErrorEvent) => void
  fallbackToSSE?: boolean
  showDetails?: boolean
  className?: string
}

export interface ProgressState {
  currentProgress: number
  stage: string
  eta: string | null
  bytesUploaded?: number
  totalBytes?: number
  isComplete: boolean
  hasError: boolean
  errorMessage: string | null
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  sessionId,
  fileId,
  fileName,
  onProgressUpdate,
  onComplete,
  onError,
  fallbackToSSE = true,
  showDetails = true,
  className = ''
}) => {
  // Progress state
  const [progressState, setProgressState] = useState<ProgressState>({
    currentProgress: 0,
    stage: 'initializing',
    eta: null,
    isComplete: false,
    hasError: false,
    errorMessage: null
  })

  // Connection state for fallback logic
  const [useSSEFallback, setUseSSEFallback] = useState(false)

  // WebSocket progress handlers
  const handleProgress = useCallback((progress: ProgressEvent) => {
    setProgressState(prev => ({
      ...prev,
      currentProgress: progress.progress,
      stage: progress.stage || getStageFromType(progress.type),
      eta: progress.eta || null,
      bytesUploaded: progress.bytesUploaded,
      totalBytes: progress.totalBytes,
      hasError: false,
      errorMessage: null
    }))

    onProgressUpdate?.(progress)
  }, [onProgressUpdate])

  const handleError = useCallback((error: ErrorEvent) => {
    setProgressState(prev => ({
      ...prev,
      hasError: true,
      errorMessage: error.error,
      stage: 'error'
    }))

    onError?.(error)
  }, [onError])

  const handleComplete = useCallback((complete: CompleteEvent) => {
    setProgressState(prev => ({
      ...prev,
      isComplete: true,
      currentProgress: 100,
      stage: complete.success ? 'completed' : 'failed',
      eta: null,
      hasError: !complete.success,
      errorMessage: complete.success ? null : 'Process failed'
    }))

    onComplete?.(complete)
  }, [onComplete])

  const handleWebSocketError = useCallback(() => {
    if (fallbackToSSE) {
      console.log('WebSocket failed, falling back to SSE')
      setUseSSEFallback(true)
    }
  }, [fallbackToSSE])

  // WebSocket connection
  const {
    isConnected,
    connectionState,
    lastError,
    connect,
    disconnect,
    retryCount
  } = useWebSocket(sessionId, {
    onProgress: handleProgress,
    onError: handleError,
    onComplete: handleComplete,
    onDisconnect: handleWebSocketError,
    autoConnect: !useSSEFallback
  })

  // SSE fallback implementation
  useEffect(() => {
    if (useSSEFallback) {
      const eventSource = new EventSource(`/api/upload/progress/${sessionId}`)

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'progress') {
            handleProgress(data)
          } else if (data.type === 'error') {
            handleError(data)
          } else if (data.type === 'complete') {
            handleComplete(data)
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error)
        }
      }

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error)
        setProgressState(prev => ({
          ...prev,
          hasError: true,
          errorMessage: 'Connection lost. Please refresh the page.'
        }))
      }

      return () => {
        eventSource.close()
      }
    }
  }, [useSSEFallback, sessionId, handleProgress, handleError, handleComplete])

  // Retry connection handler
  const handleRetry = useCallback(() => {
    setProgressState(prev => ({
      ...prev,
      hasError: false,
      errorMessage: null
    }))

    if (useSSEFallback) {
      setUseSSEFallback(false)
      connect()
    } else {
      connect()
    }
  }, [useSSEFallback, connect])

  // Format progress percentage
  const formatProgress = (progress: number): string => {
    return `${Math.round(progress)}%`
  }

  // Format bytes
  const formatBytes = (bytes?: number): string => {
    if (!bytes) return ''
    
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  // Get connection status display
  const getConnectionStatus = (): string => {
    if (useSSEFallback) {
      return 'Connected via SSE'
    }
    
    switch (connectionState) {
      case 'connected':
        return 'Connected'
      case 'connecting':
        return 'Connecting...'
      case 'error':
        return `Connection failed (${retryCount} retries)`
      default:
        return 'Disconnected'
    }
  }

  // Error display component
  if (progressState.hasError) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`} role="alert">
        <div className="flex items-center mb-2">
          <span className="text-red-600 text-sm font-medium">
            Error: {progressState.errorMessage}
          </span>
        </div>
        {fileName && (
          <div className="text-sm text-gray-600 mb-2">File: {fileName}</div>
        )}
        <button
          onClick={handleRetry}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      {/* File info */}
      {fileName && (
        <div className="text-sm font-medium text-gray-900 mb-2" title={fileName}>
          {fileName.length > 40 ? `${fileName.slice(0, 37)}...` : fileName}
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-2">
        <div 
          className="bg-gray-200 rounded-full h-2 overflow-hidden"
          role="progressbar"
          aria-valuenow={progressState.currentProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Upload progress: ${formatProgress(progressState.currentProgress)}`}
        >
          <div
            className="bg-blue-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressState.currentProgress}%` }}
          />
        </div>
      </div>

      {/* Progress text */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          {formatProgress(progressState.currentProgress)} Complete
        </span>
        {progressState.isComplete && (
          <div className="text-green-600 text-sm font-medium" role="status">
            ✓ Complete
          </div>
        )}
      </div>

      {/* Progress details */}
      {showDetails && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Stage: {progressState.stage}</span>
            {progressState.eta && <span>ETA: {progressState.eta}</span>}
          </div>

          {progressState.bytesUploaded && progressState.totalBytes && (
            <div className="text-xs text-gray-500">
              {formatBytes(progressState.bytesUploaded)} / {formatBytes(progressState.totalBytes)}
            </div>
          )}

          <div className="text-xs text-gray-400">
            Connection: {getConnectionStatus()}
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to get stage name from progress type
function getStageFromType(type: ProgressEvent['type']): string {
  switch (type) {
    case 'upload_progress':
      return 'uploading'
    case 'conversion_progress':
      return 'converting'
    case 'transcription_progress':
      return 'transcribing'
    default:
      return 'processing'
  }
}