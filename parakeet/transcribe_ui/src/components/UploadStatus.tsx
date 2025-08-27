import React from 'react'
import { formatFileSize } from '@/lib/file-utils'

interface FileStatusCount {
  pending: number
  uploading: number
  converting: number
  completed: number
  error: number
}

interface UploadStatusProps {
  statusCounts: FileStatusCount
  totalFiles: number
  totalSize: number
  uploadSpeed?: number
  estimatedTimeRemaining?: number
  onRetryAll?: () => void
  onCancelAll?: () => void
}

const UploadStatus: React.FC<UploadStatusProps> = ({
  statusCounts,
  totalFiles,
  totalSize,
  uploadSpeed,
  estimatedTimeRemaining,
  onRetryAll,
  onCancelAll,
}) => {
  const overallProgress = totalFiles > 0 
    ? Math.round(((statusCounts.completed) / totalFiles) * 100)
    : 0

  const hasActiveUploads = statusCounts.uploading > 0 || statusCounts.converting > 0
  const hasErrors = statusCounts.error > 0
  const isCompleted = statusCounts.completed === totalFiles && totalFiles > 0

  const getOverallStatus = () => {
    if (isCompleted) return 'All files processed successfully'
    if (hasErrors && !hasActiveUploads) return 'Some files failed to upload'
    if (hasActiveUploads) return 'Processing files...'
    if (statusCounts.pending > 0) return 'Ready to upload'
    return 'No files selected'
  }

  const getStatusColor = () => {
    if (isCompleted) return 'text-green-600'
    if (hasErrors) return 'text-red-600'
    if (hasActiveUploads) return 'text-blue-600'
    return 'text-gray-600'
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Overall Status */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Upload Status
          </h3>
          <p className={`text-sm ${getStatusColor()}`}>
            {getOverallStatus()}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {hasErrors && onRetryAll && (
            <button
              onClick={onRetryAll}
              className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-md border border-blue-200
                         hover:bg-blue-100 hover:border-blue-300
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         transition-colors duration-200"
            >
              Retry Failed
            </button>
          )}
          
          {(hasActiveUploads || statusCounts.pending > 0) && onCancelAll && (
            <button
              onClick={onCancelAll}
              className="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded-md border border-red-200
                         hover:bg-red-100 hover:border-red-300
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                         transition-colors duration-200"
            >
              Cancel All
            </button>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      {totalFiles > 0 && (
        <div className="space-y-3">
          {/* Overall Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-medium text-gray-900">{overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* File Statistics */}
          <div className="grid grid-cols-2 gap-4 text-sm
                         xs:grid-cols-1
                         sm:grid-cols-2
                         md:grid-cols-4">
            <div className="space-y-1">
              <div className="font-medium text-gray-900">Total Files</div>
              <div className="text-gray-600">{totalFiles}</div>
            </div>
            
            <div className="space-y-1">
              <div className="font-medium text-gray-900">Total Size</div>
              <div className="text-gray-600">{formatFileSize(totalSize)}</div>
            </div>
            
            {uploadSpeed && hasActiveUploads && (
              <div className="space-y-1">
                <div className="font-medium text-gray-900">Upload Speed</div>
                <div className="text-gray-600">{formatFileSize(uploadSpeed)}/s</div>
              </div>
            )}
            
            {estimatedTimeRemaining && hasActiveUploads && (
              <div className="space-y-1">
                <div className="font-medium text-gray-900">Time Remaining</div>
                <div className="text-gray-600">
                  {Math.floor(estimatedTimeRemaining / 60)}:
                  {String(estimatedTimeRemaining % 60).padStart(2, '0')}
                </div>
              </div>
            )}
          </div>

          {/* Status Breakdown */}
          <div className="flex items-center space-x-4 text-xs">
            {statusCounts.completed > 0 && (
              <div className="flex items-center space-x-1 text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>{statusCounts.completed} Completed</span>
              </div>
            )}
            
            {statusCounts.uploading > 0 && (
              <div className="flex items-center space-x-1 text-blue-600">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span>{statusCounts.uploading} Uploading</span>
              </div>
            )}
            
            {statusCounts.converting > 0 && (
              <div className="flex items-center space-x-1 text-yellow-600">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                <span>{statusCounts.converting} Converting</span>
              </div>
            )}
            
            {statusCounts.pending > 0 && (
              <div className="flex items-center space-x-1 text-gray-600">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span>{statusCounts.pending} Pending</span>
              </div>
            )}
            
            {statusCounts.error > 0 && (
              <div className="flex items-center space-x-1 text-red-600">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>{statusCounts.error} Failed</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success State */}
      {isCompleted && (
        <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-center">
            <div className="text-2xl text-green-600 mb-2">✅</div>
            <div className="text-green-800 font-medium">
              All files processed successfully!
            </div>
            <div className="text-green-600 text-sm mt-1">
              Ready for transcription
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadStatus