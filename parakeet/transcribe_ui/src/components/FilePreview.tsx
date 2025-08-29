import React from 'react'
import { formatFileSize, formatDuration } from '@/lib/file-utils'
import { FilePreviewProps } from '@/types/file-interfaces'

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  status,
  progress = 0,
  error,
  duration,
  uploadSpeed,
  estimatedTimeRemaining,
  onRemove,
  onRetry,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return '⏳'
      case 'uploading':
        return '⬆️'
      case 'validating':
        return '🔍'
      case 'converting':
        return '🔄'
      case 'converted':
        return '✅'
      case 'ready':
        return '✅'
      case 'processing':
        return '⚙️'
      case 'completed':
        return '✅'
      case 'error':
        return '❌'
      default:
        return '📄'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'uploading':
        return 'Uploading'
      case 'validating':
        return 'Validating'
      case 'converting':
        return 'Converting'
      case 'converted':
        return 'Converted'
      case 'ready':
        return 'Ready'
      case 'processing':
        return 'Processing'
      case 'completed':
        return 'Completed'
      case 'error':
        return 'Error'
      default:
        return 'Unknown'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'text-gray-600'
      case 'uploading':
        return 'text-blue-600'
      case 'validating':
        return 'text-purple-600'
      case 'converting':
        return 'text-yellow-600'
      case 'converted':
        return 'text-green-600'
      case 'ready':
        return 'text-green-600'
      case 'processing':
        return 'text-blue-600'
      case 'completed':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const showProgress = status === 'uploading' || status === 'validating' || status === 'converting' || status === 'processing'

  return (
    <div
      className="custom-file-preview bg-white border border-gray-200 rounded-lg p-4 shadow-sm
                 hover:shadow-md transition-shadow duration-200
                 xs:p-5
                 sm:p-6
                 md:flex md:items-center md:justify-between"
      role="listitem"
      aria-label={`File ${file.name}, ${getStatusText()}`}
    >
      {/* File Icon and Info */}
      <div className="flex items-start space-x-3 min-w-0 flex-1">
        <div className="flex-shrink-0">
          <div
            className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-lg"
            data-testid="audio-icon"
            aria-hidden="true"
          >
            🎵
          </div>
        </div>
        
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </h4>
            <span className={`text-xs font-medium ${getStatusColor()}`}>
              {getStatusIcon()} {getStatusText()}
            </span>
          </div>
          
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span>{formatFileSize(file.size)}</span>
            {duration && <span>{formatDuration(Math.floor(duration))}</span>}
            {uploadSpeed && status === 'uploading' && (
              <span>{formatFileSize(uploadSpeed)}/s</span>
            )}
          </div>
          
          {estimatedTimeRemaining && showProgress && (
            <div className="text-xs text-gray-500">
              {formatDuration(Math.floor(estimatedTimeRemaining))} remaining
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="mt-3 md:mt-0 md:ml-4 md:w-48">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-600">{getStatusText()}</span>
            <span className="font-medium text-gray-900">{progress}%</span>
          </div>
          <div
            className="w-full bg-gray-200 rounded-full h-2"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${getStatusText()} progress: ${progress}%`}
          >
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                status === 'uploading' 
                  ? 'bg-blue-500' 
                  : status === 'validating'
                  ? 'bg-purple-500'
                  : status === 'converting' 
                  ? 'bg-yellow-500'
                  : status === 'processing'
                  ? 'bg-blue-500'
                  : 'bg-gray-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {status === 'error' && error && (
        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 mt-3 md:mt-0 md:ml-4">
        {status === 'error' && onRetry && (
          <button
            onClick={() => onRetry(file)}
            className="custom-button px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md border border-blue-200
                       hover:bg-blue-100 hover:border-blue-300
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       transition-colors duration-200"
            aria-label={`Retry upload for ${file.name}`}
          >
            Retry
          </button>
        )}
        
        <button
          onClick={() => onRemove(file)}
          className="custom-button px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md border border-red-200
                     hover:bg-red-100 hover:border-red-300
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                     transition-colors duration-200"
          aria-label={`Remove ${file.name}`}
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default FilePreview