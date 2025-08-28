import React from 'react'

interface ProgressBarProps {
  progress: number
  estimatedTimeRemaining?: number | null
  status?: 'uploading' | 'converting' | 'completed' | 'error'
  label?: string
  size?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
  animated?: boolean
  className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  estimatedTimeRemaining,
  status = 'uploading',
  label,
  size = 'md',
  showPercentage = true,
  animated = true,
  className = '',
}) => {
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }
  const getBarColor = () => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-500'
      case 'converting':
        return 'bg-yellow-500'
      case 'completed':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'h-1'
      case 'lg':
        return 'h-3'
      default:
        return 'h-2'
    }
  }

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xs'
      case 'lg':
        return 'text-sm'
      default:
        return 'text-xs'
    }
  }

  const clampedProgress = Math.max(0, Math.min(100, progress))

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage || estimatedTimeRemaining !== undefined) && (
        <div className={`flex items-center justify-between ${getTextSize()} mb-1`}>
          <div className="flex items-center space-x-2">
            {label && (
              <span className="text-gray-600 font-medium">
                {label}
              </span>
            )}
            {showPercentage && (
              <span className="font-medium text-gray-900">
                {Math.round(clampedProgress)}%
              </span>
            )}
          </div>
          {estimatedTimeRemaining !== null && estimatedTimeRemaining !== undefined && (
            <span className="text-gray-600">
              ⏱️ {estimatedTimeRemaining > 0 ? formatTime(estimatedTimeRemaining) : 'Almost done'} remaining
            </span>
          )}
        </div>
      )}
      
      <div
        className={`w-full bg-gray-200 rounded-full ${getSize()} overflow-hidden`}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `Progress: ${Math.round(clampedProgress)}%`}
      >
        <div
          className={`${getSize()} ${getBarColor()} rounded-full transition-all duration-500 ${
            animated ? 'ease-out' : ''
          } relative overflow-hidden`}
          style={{ width: `${clampedProgress}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
          )}
        </div>
      </div>
      
      {/* Transcription status message */}
      {!label && (
        <div className="text-xs text-gray-600 text-center mt-2">
          {clampedProgress < 30 ? '🎵 Analyzing audio...' : 
           clampedProgress < 70 ? '🧠 Running AI transcription...' : 
           clampedProgress < 95 ? '📝 Finalizing text...' : 
           '✨ Almost ready!'}
        </div>
      )}
      
      {status === 'error' && (
        <div className="mt-1 text-xs text-red-600">
          Upload failed
        </div>
      )}
      
      {status === 'completed' && (
        <div className="mt-1 text-xs text-green-600 flex items-center">
          <span className="mr-1">✓</span>
          Complete
        </div>
      )}
    </div>
  )
}

export default ProgressBar