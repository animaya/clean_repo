import React, { useState, useCallback, useRef, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react'
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

export interface UploadInterfaceRef {
  clearFiles: () => void
}

const UploadInterface = forwardRef<UploadInterfaceRef, UploadInterfaceProps>(({
  onUploadComplete,
  onError,
  maxFiles = 10,
  maxSize = 300 * 1024 * 1024, // 300MB
  className = '',
}, ref) => {
  const [files, setFiles] = useState<FileWithStatus[]>([])
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [announcements, setAnnouncements] = useState<string[]>([])
  
  // Refs for accessibility
  const urlInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Announce status changes for screen readers
  const announce = useCallback((message: string) => {
    setAnnouncements(prev => [...prev.slice(-4), message]) // Keep last 5 announcements
  }, [])

  // Clear files function
  const clearAllFiles = useCallback(() => {
    setFiles([])
    announce('All files cleared')
  }, [announce])

  // Expose clearFiles function via ref
  useImperativeHandle(ref, () => ({
    clearFiles: clearAllFiles
  }), [clearAllFiles])

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
    
    // Extract filename from URL for display
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    let fileName = pathname.substring(pathname.lastIndexOf('/') + 1)
    if (!fileName || !fileName.includes('.')) {
      const extension = pathname.includes('.') ? pathname.split('.').pop() : 'mp3'
      fileName = `audio_${Date.now()}.${extension}`
    }
    
    // Generate temporary file ID for tracking
    const tempFileId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Add file to pending state
    const pendingFile: FileWithStatus = {
      id: tempFileId,
      name: fileName,
      size: 0,
      status: 'uploading',
      progress: 0
    }
    
    setFiles(prev => [...prev, pendingFile])
    announce(`Added ${fileName} to download queue`)
    
    try {
      // Call the server-side URL upload API
      const response = await fetch('/api/upload/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: [url],
          convertFormat: 'wav',
          outputQuality: 'medium'
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Server error: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Handle nested data structure from API response
      const responseData = data.data || data
      
      if (!data.success || !responseData.imports || responseData.imports.length === 0) {
        throw new Error('Invalid response from upload API')
      }
      
      const importResult = responseData.imports[0]
      
      if (importResult.status !== 'completed') {
        throw new Error(importResult.error || 'Upload failed')
      }
      
      // Update file with completed status and real server file ID
      const completedFile: FileWithStatus = {
        id: importResult.fileId, // Use the real server file ID
        name: importResult.originalName || importResult.filename || fileName,
        size: importResult.fileSize || 0, // Use actual file size from server
        status: 'completed',
        progress: 100
      }
      
      setFiles(prev => prev.map(f => 
        f.id === tempFileId ? completedFile : f
      ))
      
      announce(`Successfully uploaded ${fileName}`)
      
      // Call onUploadComplete with the completed file
      const allCompletedFiles = files.filter(f => f.status === 'completed' && f.id !== tempFileId)
      allCompletedFiles.push(completedFile)
      
      onUploadComplete?.(allCompletedFiles)
      
    } catch (error) {
      console.error('URL upload failed:', error)
      
      // Update file status to error
      setFiles(prev => prev.map(f => 
        f.id === tempFileId ? { 
          ...f, 
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed'
        } : f
      ))
      
      announce(`Failed to upload ${fileName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      onError?.(error instanceof Error ? error : new Error('Upload failed'))
    }
  }, [announce, files, onUploadComplete, onError])

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
    clearAllFiles()
  }, [clearAllFiles])

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
        accept="audio/*,video/*,.mp3,.wav,.m4a,.flac,.ogg,.wma,.mp4,.avi,.mov,.mkv,.webm"
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

    </div>
  )
})

UploadInterface.displayName = 'UploadInterface'

export default UploadInterface