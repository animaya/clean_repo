import React from 'react'

interface ProgressBarProps {
  progress: number
  status: 'uploading' | 'converting' | 'completed' | 'error'
  label?: string
  size?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
  animated?: boolean
  className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  status,
  label,
  size = 'md',
  showPercentage = true,
  animated = true,
  className = '',
}) => {
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
      {(label || showPercentage) && (
        <div className={`flex items-center justify-between ${getTextSize()} mb-1`}>
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
          className={`${getSize()} ${getBarColor()} rounded-full transition-all duration-300 ${
            animated ? 'ease-out' : ''
          }`}
          style={{ width: `${clampedProgress}%` }}
        >
          {animated && status === 'uploading' && (
            <div
              className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
              style={{
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }}
            />
          )}
        </div>
      </div>
      
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
      
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  )
}

export default ProgressBar