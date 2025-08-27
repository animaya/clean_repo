import { useState, useCallback, useEffect } from 'react'
import { ProgressEvent, ErrorEvent, CompleteEvent } from '@/lib/websocket-server'

export interface FileProgress {
  fileId: string
  fileName: string
  progress: number
  stage: string
  eta: string | null
  bytesUploaded?: number
  totalBytes?: number
  isComplete: boolean
  hasError: boolean
  errorMessage: string | null
  startTime: Date
  endTime?: Date
}

export interface ProgressStateOptions {
  onProgress?: (fileId: string, progress: ProgressEvent) => void
  onError?: (fileId: string, error: ErrorEvent) => void
  onComplete?: (fileId: string, complete: CompleteEvent) => void
  onAllComplete?: () => void
}

export interface UseProgressStateReturn {
  files: Map<string, FileProgress>
  addFile: (fileId: string, fileName: string) => void
  updateProgress: (progress: ProgressEvent) => void
  updateError: (error: ErrorEvent) => void
  updateComplete: (complete: CompleteEvent) => void
  removeFile: (fileId: string) => void
  clearAll: () => void
  getFile: (fileId: string) => FileProgress | undefined
  getAllFiles: () => FileProgress[]
  getActiveFiles: () => FileProgress[]
  getCompletedFiles: () => FileProgress[]
  getFailedFiles: () => FileProgress[]
  getTotalProgress: () => number
  isAllComplete: () => boolean
  hasAnyErrors: () => boolean
}

export function useProgressState(options: ProgressStateOptions = {}): UseProgressStateReturn {
  const {
    onProgress,
    onError,
    onComplete,
    onAllComplete
  } = options

  const [files, setFiles] = useState<Map<string, FileProgress>>(new Map())

  // Add a new file to track
  const addFile = useCallback((fileId: string, fileName: string) => {
    setFiles(prev => {
      const newFiles = new Map(prev)
      newFiles.set(fileId, {
        fileId,
        fileName,
        progress: 0,
        stage: 'initializing',
        eta: null,
        isComplete: false,
        hasError: false,
        errorMessage: null,
        startTime: new Date()
      })
      return newFiles
    })
  }, [])

  // Update progress for a file
  const updateProgress = useCallback((progress: ProgressEvent) => {
    setFiles(prev => {
      const newFiles = new Map(prev)
      const existingFile = newFiles.get(progress.fileId)
      
      if (existingFile) {
        newFiles.set(progress.fileId, {
          ...existingFile,
          progress: progress.progress,
          stage: progress.stage || getStageFromType(progress.type),
          eta: progress.eta || null,
          bytesUploaded: progress.bytesUploaded,
          totalBytes: progress.totalBytes,
          hasError: false,
          errorMessage: null
        })
      }
      
      return newFiles
    })

    onProgress?.(progress.fileId, progress)
  }, [onProgress])

  // Update error for a file
  const updateError = useCallback((error: ErrorEvent) => {
    setFiles(prev => {
      const newFiles = new Map(prev)
      const existingFile = newFiles.get(error.fileId || '')
      
      if (existingFile) {
        newFiles.set(error.fileId || '', {
          ...existingFile,
          hasError: true,
          errorMessage: error.error,
          stage: 'error',
          endTime: new Date()
        })
      }
      
      return newFiles
    })

    onError?.(error.fileId || '', error)
  }, [onError])

  // Update completion for a file
  const updateComplete = useCallback((complete: CompleteEvent) => {
    setFiles(prev => {
      const newFiles = new Map(prev)
      const existingFile = newFiles.get(complete.fileId)
      
      if (existingFile) {
        newFiles.set(complete.fileId, {
          ...existingFile,
          isComplete: true,
          progress: 100,
          stage: complete.success ? 'completed' : 'failed',
          eta: null,
          hasError: !complete.success,
          errorMessage: complete.success ? null : 'Process failed',
          endTime: new Date()
        })
      }
      
      return newFiles
    })

    onComplete?.(complete.fileId, complete)
  }, [onComplete])

  // Remove a file from tracking
  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const newFiles = new Map(prev)
      newFiles.delete(fileId)
      return newFiles
    })
  }, [])

  // Clear all files
  const clearAll = useCallback(() => {
    setFiles(new Map())
  }, [])

  // Get a specific file
  const getFile = useCallback((fileId: string): FileProgress | undefined => {
    return files.get(fileId)
  }, [files])

  // Get all files as array
  const getAllFiles = useCallback((): FileProgress[] => {
    return Array.from(files.values())
  }, [files])

  // Get active (in-progress) files
  const getActiveFiles = useCallback((): FileProgress[] => {
    return Array.from(files.values()).filter(file => 
      !file.isComplete && !file.hasError
    )
  }, [files])

  // Get completed files
  const getCompletedFiles = useCallback((): FileProgress[] => {
    return Array.from(files.values()).filter(file => 
      file.isComplete && !file.hasError
    )
  }, [files])

  // Get failed files
  const getFailedFiles = useCallback((): FileProgress[] => {
    return Array.from(files.values()).filter(file => file.hasError)
  }, [files])

  // Get total progress across all files
  const getTotalProgress = useCallback((): number => {
    const fileArray = Array.from(files.values())
    if (fileArray.length === 0) return 0

    const totalProgress = fileArray.reduce((sum, file) => sum + file.progress, 0)
    return Math.round(totalProgress / fileArray.length)
  }, [files])

  // Check if all files are complete
  const isAllComplete = useCallback((): boolean => {
    if (files.size === 0) return false
    return Array.from(files.values()).every(file => file.isComplete)
  }, [files])

  // Check if any files have errors
  const hasAnyErrors = useCallback((): boolean => {
    return Array.from(files.values()).some(file => file.hasError)
  }, [files])

  // Check for all complete and trigger callback
  useEffect(() => {
    if (files.size > 0 && isAllComplete()) {
      onAllComplete?.()
    }
  }, [files, isAllComplete, onAllComplete])

  return {
    files,
    addFile,
    updateProgress,
    updateError,
    updateComplete,
    removeFile,
    clearAll,
    getFile,
    getAllFiles,
    getActiveFiles,
    getCompletedFiles,
    getFailedFiles,
    getTotalProgress,
    isAllComplete,
    hasAnyErrors
  }
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