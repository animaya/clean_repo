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
  maxSize = 300 * 1024 * 1024, // 300MB
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
      uploadFile(file)
    })
  }, [createFileWithStatus, maxFiles, onUploadStart])

  // Handle file rejection
  const handleFileReject = useCallback((rejectedFiles: FileRejection[]) => {
    onError(rejectedFiles)
  }, [onError])

  // Upload file to server
  const uploadFile = useCallback(async (file: FileWithStatus) => {
    try {
      // Update file status to uploading
      setFiles(prevFiles =>
        prevFiles.map(f =>
          f.id === file.id ? { ...f, status: 'uploading' as const, progress: 0 } : f
        )
      )

      // Create FormData for file upload
      const formData = new FormData()
      formData.append('files', file)
      
      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest()
      
      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          setFiles(prevFiles =>
            prevFiles.map(f =>
              f.id === file.id ? { ...f, progress: Math.floor(progress) } : f
            )
          )
          onUploadProgress(file.id, Math.floor(progress))
        }
      }

      // Handle completion
      const uploadResult = await new Promise<any>((resolve, reject) => {
        xhr.onload = () => {
          console.log('Upload response status:', xhr.status)
          console.log('Upload response text:', xhr.responseText)
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText)
            console.log('Parsed response:', response)
            // Handle nested response structure
            const uploadData = response.data || response
            if (response.success && uploadData.uploads && uploadData.uploads.length > 0) {
              console.log('Upload successful, file info:', uploadData.uploads[0])
              resolve(uploadData.uploads[0]) // Return the first uploaded file info
            } else {
              console.error('Response validation failed:', { success: response.success, uploads: uploadData.uploads, data: response.data })
              reject(new Error('Upload failed: Invalid response'))
            }
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`))
          }
        }

        xhr.onerror = () => reject(new Error('Upload failed: Network error'))
        
        xhr.open('POST', '/api/upload')
        xhr.send(formData)
      })

      // Update file with server response
      setFiles(prevFiles => {
        const updatedFiles = prevFiles.map(f =>
          f.id === file.id 
            ? { 
                ...f, 
                id: uploadResult.id, // Use the database ID from server
                status: 'completed' as const, 
                progress: 100,
                duration: uploadResult.duration || 0
              }
            : f
        )
        
        const allCompleted = updatedFiles.every(f => 
          f.status === 'completed' || f.status === 'error'
        )
        
        if (allCompleted) {
          // Use setTimeout to avoid calling during render
          setTimeout(() => {
            onUploadComplete(updatedFiles)
          }, 0)
        }
        
        return updatedFiles
      })

    } catch (error) {
      console.error('Upload error:', error)
      // Mark file as failed
      setFiles(prevFiles =>
        prevFiles.map(f =>
          f.id === file.id 
            ? { 
                ...f, 
                status: 'error' as const, 
                progress: 0,
                error: error instanceof Error ? error.message : 'Upload failed'
              }
            : f
        )
      )
      
      // Check if all files are processed (completed or failed)
      setFiles(prevFiles => {
        const allProcessed = prevFiles.every(f => 
          f.status === 'completed' || f.status === 'error'
        )
        
        if (allProcessed) {
          setTimeout(() => {
            onUploadComplete(prevFiles)
          }, 0)
        }
        
        return prevFiles
      })
    }
  }, [onUploadProgress, onUploadComplete])


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
      uploadFile(fileWithId)
    }, 500)
  }, [uploadFile])

  const hasFiles = files.length > 0
  const canAddMore = files.length < maxFiles

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      {canAddMore && (
        <DropZone
          onFilesDrop={handleFilesDrop}
          onFileReject={handleFileReject}
          accept={{ 
            'audio/*': ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.wma'],
            'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm']
          }}
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
                Drag and drop audio or video files here
              </p>
              <p className="text-base text-gray-500
                           xs:text-sm
                           sm:text-base">
                or click to browse
              </p>
            </div>
            <div className="text-sm text-gray-400
                           xs:text-xs
                           sm:text-sm">
              <p>Audio: MP3, WAV, M4A, FLAC, OGG, WMA • Video: MP4, AVI, MOV, MKV, WEBM • Max: 300MB, 2hrs • Slots: {maxFiles - files.length}/{maxFiles}</p>
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