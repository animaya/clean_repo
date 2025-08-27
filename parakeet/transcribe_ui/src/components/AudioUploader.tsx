import React, { useState, useCallback } from 'react'
import { FileRejection } from 'react-dropzone'
import DropZone from './DropZone'
import FilePreview, { FileStatus } from './FilePreview'

interface FileWithStatus extends File {
  id: string
  status: FileStatus['status']
  progress?: number
  error?: string
  duration?: number
  uploadSpeed?: number
  estimatedTimeRemaining?: number
}

interface AudioUploaderProps {
  onUploadStart: (files: File[]) => void
  onUploadProgress: (fileId: string, progress: number) => void
  onUploadComplete: (files: FileWithStatus[]) => void
  onError: (error: FileRejection[] | Error) => void
  maxFiles?: number
  maxSize?: number
}

const AudioUploader: React.FC<AudioUploaderProps> = ({
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
  onError,
  maxFiles = 10,
  maxSize = 100 * 1024 * 1024, // 100MB
}) => {
  const [files, setFiles] = useState<FileWithStatus[]>([])

  // Generate unique ID for files
  const generateFileId = useCallback(() => {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }, [])

  // Convert File to FileWithStatus
  const createFileWithStatus = useCallback((file: File): FileWithStatus => {
    const fileWithStatus = file as FileWithStatus
    fileWithStatus.id = generateFileId()
    fileWithStatus.status = 'pending'
    return fileWithStatus
  }, [generateFileId])

  // Handle files dropped or selected
  const handleFilesDrop = useCallback((droppedFiles: File[]) => {
    const newFiles = droppedFiles.map(createFileWithStatus)
    
    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles, ...newFiles]
      // Limit total files
      const limitedFiles = updatedFiles.slice(0, maxFiles)
      return limitedFiles
    })

    // Notify parent component
    onUploadStart(droppedFiles)
    
    // Start upload process for each file
    newFiles.forEach(file => {
      simulateUpload(file)
    })
  }, [createFileWithStatus, maxFiles, onUploadStart])

  // Handle file rejection
  const handleFileReject = useCallback((rejectedFiles: FileRejection[]) => {
    onError(rejectedFiles)
  }, [onError])

  // Simulate file upload process (replace with real upload logic)
  const simulateUpload = useCallback((file: FileWithStatus) => {
    // Update file status to uploading
    setFiles(prevFiles =>
      prevFiles.map(f =>
        f.id === file.id ? { ...f, status: 'uploading' as const, progress: 0 } : f
      )
    )

    // Simulate upload progress
    let progress = 0
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(uploadInterval)
        
        // Start conversion phase
        setFiles(prevFiles =>
          prevFiles.map(f =>
            f.id === file.id 
              ? { ...f, status: 'converting' as const, progress: 0 }
              : f
          )
        )
        
        // Simulate conversion
        simulateConversion(file)
      } else {
        setFiles(prevFiles =>
          prevFiles.map(f =>
            f.id === file.id ? { ...f, progress: Math.floor(progress) } : f
          )
        )
        onUploadProgress(file.id, Math.floor(progress))
      }
    }, 200)
  }, [onUploadProgress])

  // Simulate file conversion process
  const simulateConversion = useCallback((file: FileWithStatus) => {
    let progress = 0
    const conversionInterval = setInterval(() => {
      progress += Math.random() * 20
      if (progress >= 100) {
        progress = 100
        clearInterval(conversionInterval)
        
        // Mark as completed
        setFiles(prevFiles =>
          prevFiles.map(f =>
            f.id === file.id 
              ? { 
                  ...f, 
                  status: 'completed' as const, 
                  progress: 100,
                  duration: Math.floor(Math.random() * 300) + 60 // Random duration 1-6 minutes
                }
              : f
          )
        )
        
        // Check if all files are completed
        setFiles(prevFiles => {
          const updatedFiles = prevFiles.map(f =>
            f.id === file.id 
              ? { 
                  ...f, 
                  status: 'completed' as const, 
                  progress: 100,
                  duration: Math.floor(Math.random() * 300) + 60
                }
              : f
          )
          
          const allCompleted = updatedFiles.every(f => 
            f.status === 'completed' || f.status === 'error'
          )
          
          if (allCompleted) {
            onUploadComplete(updatedFiles)
          }
          
          return updatedFiles
        })
      } else {
        setFiles(prevFiles =>
          prevFiles.map(f =>
            f.id === file.id ? { ...f, progress: Math.floor(progress) } : f
          )
        )
      }
    }, 150)
  }, [onUploadComplete])

  // Handle file removal
  const handleFileRemove = useCallback((fileToRemove: File) => {
    setFiles(prevFiles => 
      prevFiles.filter(f => f.id !== (fileToRemove as FileWithStatus).id)
    )
  }, [])

  // Handle file retry
  const handleFileRetry = useCallback((fileToRetry: File) => {
    const fileWithId = fileToRetry as FileWithStatus
    setFiles(prevFiles =>
      prevFiles.map(f =>
        f.id === fileWithId.id 
          ? { ...f, status: 'pending' as const, progress: 0, error: undefined }
          : f
      )
    )
    
    // Restart upload
    setTimeout(() => {
      simulateUpload(fileWithId)
    }, 500)
  }, [simulateUpload])

  const hasFiles = files.length > 0
  const canAddMore = files.length < maxFiles

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      {canAddMore && (
        <DropZone
          onFilesDrop={handleFilesDrop}
          onFileReject={handleFileReject}
          accept={{ 'audio/*': ['.mp3', '.wav', '.m4a', '.flac'] }}
          maxSize={maxSize}
          maxFiles={maxFiles - files.length}
        >
          <div className="space-y-4">
            <div className="text-6xl text-gray-400">
              🎵
            </div>
            <div>
              <p className="text-xl font-medium text-gray-700 mb-2
                           xs:text-lg
                           sm:text-xl
                           md:text-2xl">
                Drag and drop audio files here
              </p>
              <p className="text-base text-gray-500
                           xs:text-sm
                           sm:text-base">
                or click to browse
              </p>
            </div>
            <div className="text-sm text-gray-400 space-y-2
                           xs:text-xs
                           sm:text-sm">
              <p>Supports: MP3, WAV, M4A, FLAC</p>
              <p>Max size: 100MB per file • Max duration: 2 hours</p>
              <p>Remaining slots: {maxFiles - files.length} / {maxFiles}</p>
            </div>
          </div>
        </DropZone>
      )}

      {/* File Previews */}
      {hasFiles && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Files ({files.length})
            </h3>
            {files.length > 0 && (
              <button
                onClick={() => setFiles([])}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>
          
          <div 
            className="space-y-3"
            role="list"
            aria-label="Upload queue"
          >
            {files.map(file => (
              <FilePreview
                key={file.id}
                file={file}
                status={file.status}
                progress={file.progress}
                error={file.error}
                duration={file.duration}
                uploadSpeed={file.uploadSpeed}
                estimatedTimeRemaining={file.estimatedTimeRemaining}
                onRemove={handleFileRemove}
                onRetry={handleFileRetry}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upload Summary */}
      {hasFiles && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Total files: {files.length} / {maxFiles}
            </span>
            <span className="text-gray-600">
              Completed: {files.filter(f => f.status === 'completed').length}
            </span>
          </div>
          
          {files.some(f => f.status === 'error') && (
            <div className="mt-2 text-sm text-red-600">
              {files.filter(f => f.status === 'error').length} file(s) failed to upload
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AudioUploader