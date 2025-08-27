import React, { useState, useCallback, useRef, useMemo } from 'react'
import { FileRejection } from 'react-dropzone'
import AudioUploader from './AudioUploader'
import UrlUpload from './UrlUpload'
import UploadStatus from './UploadStatus'
import { useKeyboardShortcuts, createUploadShortcuts } from '@/hooks/useKeyboardShortcuts'

interface FileWithStatus {
  id: string
  name: string
  size: number
  status: 'pending' | 'uploading' | 'converting' | 'completed' | 'error'
  progress?: number
  error?: string
  duration?: number
  uploadSpeed?: number
  estimatedTimeRemaining?: number
}

interface UploadInterfaceProps {
  onUploadComplete?: (files: FileWithStatus[]) => void
  onError?: (error: Error | FileRejection[]) => void
  maxFiles?: number
  maxSize?: number
  className?: string
}

const UploadInterface: React.FC<UploadInterfaceProps> = ({
  onUploadComplete,
  onError,
  maxFiles = 10,
  maxSize = 100 * 1024 * 1024, // 100MB
  className = '',
}) => {
  const [files, setFiles] = useState<FileWithStatus[]>([])
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [announcements, setAnnouncements] = useState<string[]>([])
  
  // Refs for accessibility
  const urlInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculate status counts for UploadStatus component
  const statusCounts = useMemo(() => {
    return files.reduce((counts, file) => {
      counts[file.status] = (counts[file.status] || 0) + 1
      return counts
    }, {
      pending: 0,
      uploading: 0,
      converting: 0,
      completed: 0,
      error: 0,
    })
  }, [files])

  const totalSize = useMemo(() => {
    return files.reduce((total, file) => total + file.size, 0)
  }, [files])

  // Announce status changes for screen readers
  const announce = useCallback((message: string) => {
    setAnnouncements(prev => [...prev.slice(-4), message]) // Keep last 5 announcements
  }, [])

  // Handle upload start
  const handleUploadStart = useCallback((newFiles: File[]) => {
    announce(`Started uploading ${newFiles.length} file${newFiles.length > 1 ? 's' : ''}`)
  }, [announce])

  // Handle upload progress
  const handleUploadProgress = useCallback((fileId: string, progress: number) => {
    // Optional: Announce major progress milestones
    if (progress === 50 || progress === 100) {
      const file = files.find(f => f.id === fileId)
      if (file) {
        announce(`${file.name} ${progress}% ${progress === 100 ? 'uploaded' : 'complete'}`)
      }
    }
  }, [files, announce])

  // Handle upload completion
  const handleUploadComplete = useCallback((completedFiles: FileWithStatus[]) => {
    setFiles(completedFiles)
    announce(`Upload completed. ${completedFiles.filter(f => f.status === 'completed').length} files ready for transcription`)
    onUploadComplete?.(completedFiles)
  }, [announce, onUploadComplete])

  // Handle URL upload
  const handleUrlUpload = useCallback(async (url: string) => {
    announce(`Starting download from URL: ${url}`)
    // URL upload logic would go here
    // For now, just announce the action
  }, [announce])

  // Handle errors
  const handleError = useCallback((error: Error | FileRejection[]) => {
    if (Array.isArray(error)) {
      announce(`Upload failed for ${error.length} file${error.length > 1 ? 's' : ''}`)
    } else {
      announce(`Upload error: ${error.message}`)
    }
    onError?.(error)
  }, [announce, onError])

  // Clear all files
  const handleClearAll = useCallback(() => {
    setFiles([])
    announce('All files cleared')
  }, [announce])

  // Retry failed uploads
  const handleRetryFailed = useCallback(() => {
    const failedCount = statusCounts.error
    if (failedCount > 0) {
      announce(`Retrying ${failedCount} failed upload${failedCount > 1 ? 's' : ''}`)
      // Retry logic would go here
    }
  }, [statusCounts.error, announce])

  // Toggle URL input visibility
  const handleToggleUrlInput = useCallback(() => {
    setShowUrlInput(prev => {
      const newValue = !prev
      announce(newValue ? 'URL input shown' : 'URL input hidden')
      return newValue
    })
  }, [announce])

  // Focus URL input
  const handleFocusUrlInput = useCallback(() => {
    if (showUrlInput && urlInputRef.current) {
      urlInputRef.current.focus()
      announce('Focused on URL input')
    } else if (!showUrlInput) {
      setShowUrlInput(true)
      setTimeout(() => {
        urlInputRef.current?.focus()
        announce('URL input shown and focused')
      }, 100)
    }
  }, [showUrlInput, announce])

  // Open file dialog
  const handleOpenFileDialog = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
      announce('File dialog opened')
    }
  }, [announce])

  // Set up keyboard shortcuts
  const shortcutActions = useMemo(() => ({
    onOpenFileDialog: handleOpenFileDialog,
    onClearAll: files.length > 0 ? handleClearAll : undefined,
    onRetryFailed: statusCounts.error > 0 ? handleRetryFailed : undefined,
    onToggleUrlInput: handleToggleUrlInput,
    onFocusUrlInput: handleFocusUrlInput,
  }), [
    handleOpenFileDialog,
    files.length,
    handleClearAll,
    statusCounts.error,
    handleRetryFailed,
    handleToggleUrlInput,
    handleFocusUrlInput,
  ])

  const shortcuts = useMemo(() => createUploadShortcuts(shortcutActions), [shortcutActions])
  useKeyboardShortcuts(shortcuts)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Screen Reader Announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="false" 
        className="sr-only"
        role="status"
      >
        {announcements.map((announcement, index) => (
          <div key={`${index}-${announcement}`}>{announcement}</div>
        ))}
      </div>

      {/* Keyboard Shortcuts Help */}
      <details className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <summary className="text-sm font-medium text-blue-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
          Keyboard Shortcuts
        </summary>
        <div className="mt-3 space-y-1 text-xs text-blue-700">
          {shortcuts.filter(s => !s.disabled).map((shortcut, index) => (
            <div key={index} className="flex justify-between">
              <span>{shortcut.description.split('(')[0].trim()}</span>
              <kbd className="bg-white px-1 py-0.5 rounded text-blue-800 font-mono">
                {shortcut.description.match(/\(([^)]+)\)/)?.[1]}
              </kbd>
            </div>
          ))}
        </div>
      </details>

      {/* Upload Method Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Upload methods">
          <button
            onClick={() => setShowUrlInput(false)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !showUrlInput
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            aria-current={!showUrlInput ? 'page' : undefined}
          >
            Drag & Drop Files
          </button>
          <button
            onClick={() => setShowUrlInput(true)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              showUrlInput
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            aria-current={showUrlInput ? 'page' : undefined}
          >
            Upload from URL
          </button>
        </nav>
      </div>

      {/* Upload Interface */}
      <div role="tabpanel" aria-label={showUrlInput ? 'URL upload' : 'File upload'}>
        {showUrlInput ? (
          <UrlUpload
            onUrlUpload={handleUrlUpload}
            onError={handleError}
            maxSize={maxSize}
          />
        ) : (
          <AudioUploader
            onUploadStart={handleUploadStart}
            onUploadProgress={handleUploadProgress}
            onUploadComplete={handleUploadComplete}
            onError={handleError}
            maxFiles={maxFiles}
            maxSize={maxSize}
          />
        )}
      </div>

      {/* Upload Status */}
      {files.length > 0 && (
        <UploadStatus
          statusCounts={statusCounts}
          totalFiles={files.length}
          totalSize={totalSize}
          onRetryAll={statusCounts.error > 0 ? handleRetryFailed : undefined}
          onCancelAll={files.length > 0 ? handleClearAll : undefined}
        />
      )}

      {/* Hidden file input for keyboard shortcut */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*,.mp3,.wav,.m4a,.flac"
        onChange={(e) => {
          const files = Array.from(e.target.files || [])
          if (files.length > 0 && !showUrlInput) {
            handleUploadStart(files)
          }
        }}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Supports MP3, WAV, M4A, FLAC audio files</p>
        <p>• Maximum file size: 100MB per file</p>
        <p>• All processing happens locally on your device</p>
        <p>• Use keyboard shortcuts for faster navigation</p>
      </div>
    </div>
  )
}

export default UploadInterface