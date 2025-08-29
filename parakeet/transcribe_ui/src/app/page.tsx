'use client'

import React, { useState, useEffect, useRef } from 'react'
import UploadInterface, { UploadInterfaceRef } from '@/components/UploadInterface'
import TranscriptionModal from '@/components/TranscriptionModal'
import ProgressBar from '@/components/ProgressBar'
import { FileWithStatus } from '@/types/file-interfaces'
import { UnifiedProgressData, ProgressSummary, calculateOverallProgress, formatTimeRemaining } from '@/types/progress'

interface TranscriptionResult {
  id: string
  fileName: string
  status: 'completed' | 'failed' | 'processing'
  transcript: string
  duration: number
  confidence: number
  error?: string
  timestamp: string
  preview: string
  jobId?: string // For tracking async jobs
  fileSize?: number // Original file size in bytes
  originalFile?: any // Reference to original file data
}

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithStatus[]>([])
  const [transcriptionResults, setTranscriptionResults] = useState<TranscriptionResult[]>([])
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcriptionProgress, setTranscriptionProgress] = useState(0)
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null)
  const [selectedTranscription, setSelectedTranscription] = useState<TranscriptionResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Real-time progress tracking state
  const [activeJobs, setActiveJobs] = useState<string[]>([])
  const [jobProgressMap, setJobProgressMap] = useState<Map<string, UnifiedProgressData>>(new Map())
  const [progressSummary, setProgressSummary] = useState<ProgressSummary | null>(null)
  
  // Ref to access UploadInterface methods
  const uploadInterfaceRef = useRef<UploadInterfaceRef>(null)

  // Load transcription results from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('parakeet-transcriptions')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setTranscriptionResults(parsed)
      } catch (e) {
        console.error('Failed to load saved transcriptions:', e)
      }
    }
  }, [])

  // Save transcription results to localStorage whenever they change
  useEffect(() => {
    if (transcriptionResults.length > 0) {
      localStorage.setItem('parakeet-transcriptions', JSON.stringify(transcriptionResults))
    }
  }, [transcriptionResults])

  const handleUploadComplete = async (files: any[]) => {
    console.log('Upload completed:', files)
    console.log('Files details:')
    files.forEach((file, index) => {
      console.log(`File ${index}:`, {
        id: file.id,
        name: file.name,
        size: file.size,
        status: file.status,
        originalFilename: file.originalFilename
      })
    })
    
    // Merge new files with existing ones (avoid duplicates by ID)
    setUploadedFiles(prev => {
      const newFiles = files.filter(newFile => 
        !prev.some(existingFile => existingFile.id === newFile.id)
      )
      const combined = [...prev, ...newFiles]
      console.log('Combined files:', combined)
      return combined
    })
    // Don't start transcription automatically anymore
  }

  const handleStartTranscription = async () => {
    if (uploadedFiles.length === 0) return
    
    console.log('Starting transcription, clearing uploaded files...')
    console.log('Files before clearing:', uploadedFiles)
    
    // Filter out any files that might not have proper IDs
    const validFiles = uploadedFiles.filter(file => file.id && file.id !== '' && file.status === 'completed')
    console.log('Valid files for transcription:', validFiles)
    
    if (validFiles.length === 0) {
      console.log('No valid files for transcription')
      return
    }

    // Validate that files still exist in database before starting transcription
    const fileIds = validFiles.map(file => file.id)
    try {
      const validationResponse = await fetch('/api/upload/files/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileIds })
      })
      
      if (validationResponse.ok) {
        const validationData = await validationResponse.json()
        if (validationData.missingFiles && validationData.missingFiles.length > 0) {
          console.warn('Some files no longer exist:', validationData.missingFiles)
          // Remove missing files from state
          const existingFiles = validFiles.filter(file => !validationData.missingFiles.includes(file.id))
          setUploadedFiles(existingFiles)
          
          if (existingFiles.length === 0) {
            console.log('No files available for transcription after validation')
            alert('The files you selected for transcription are no longer available. Please upload new files.')
            return
          }
          
          // Show warning about missing files
          if (validationData.missingFiles.length < validFiles.length) {
            console.log(`${validationData.missingFiles.length} files were removed and won't be transcribed. Proceeding with ${existingFiles.length} remaining files.`)
          }
          
          // Update validFiles to only include existing files
          validFiles.splice(0, validFiles.length, ...existingFiles)
        }
      }
    } catch (error) {
      console.warn('Failed to validate files, proceeding with transcription:', error)
      // Continue with transcription even if validation fails
    }
    
    setIsTranscribing(true)
    setTranscriptionProgress(0)
    setEstimatedTimeRemaining(null)
    
    // Clear uploaded files from the queue when transcription starts
    setUploadedFiles([])
    
    console.log('Files cleared from upload queue')
    
    // Real-time job progress monitoring
    const monitorJobProgress = (jobIds: string[]) => {
      setActiveJobs(jobIds)
      
      // Poll job status every second
      const pollInterval = setInterval(async () => {
        try {
          const progressUpdates = new Map<string, UnifiedProgressData>()
          let completedJobs = 0
          let failedJobs = 0
          let totalProgress = 0
          
          for (const jobId of jobIds) {
            const response = await fetch(`/api/transcribe?jobId=${jobId}`)
            const data = await response.json()
            
            // Handle nested response structure
            const responseData = data.data || data
            if (data.success && responseData.job) {
              const job = responseData.job
              const progress: UnifiedProgressData = {
                fileId: jobId,
                progress: job.progress?.progress || 0,
                stage: job.progress?.stage || (job.status === 'completed' ? 'completed' : 
                       job.status === 'failed' ? 'error' : 'preparing'),
                message: job.progress?.message || `Job ${job.status}`,
                estimatedTimeRemaining: job.progress?.estimatedTimeRemaining
              }
              
              progressUpdates.set(jobId, progress)
              totalProgress += progress.progress
              
              if (job.status === 'completed') {
                completedJobs++
              } else if (job.status === 'failed') {
                failedJobs++
              }
            }
          }
          
          // Update progress state
          setJobProgressMap(progressUpdates)
          const overallProgress = totalProgress / jobIds.length
          setTranscriptionProgress(overallProgress)
          
          // Calculate overall estimated time remaining from active jobs
          const activeProgresses = Array.from(progressUpdates.values())
            .filter(p => p.stage !== 'completed' && p.stage !== 'error' && p.estimatedTimeRemaining)
          
          if (activeProgresses.length > 0) {
            const totalEstimatedTime = activeProgresses.reduce((sum, p) => 
              sum + (p.estimatedTimeRemaining || 0), 0)
            const avgEstimatedTime = totalEstimatedTime / activeProgresses.length
            setEstimatedTimeRemaining(avgEstimatedTime)
          } else {
            setEstimatedTimeRemaining(null)
          }
          
          // Update summary
          const summary: ProgressSummary = {
            totalFiles: jobIds.length,
            completedFiles: completedJobs,
            failedFiles: failedJobs,
            overallProgress,
            currentlyProcessing: Array.from(progressUpdates.values())
              .filter(p => p.stage !== 'completed' && p.stage !== 'error')
              .map((_, index) => `File ${index + 1}`)
          }
          setProgressSummary(summary)
          
          // Stop polling when all jobs are complete
          if (completedJobs + failedJobs === jobIds.length) {
            clearInterval(pollInterval)
            setIsTranscribing(false)
            
            // Fetch final transcription results
            await fetchCompletedResults(jobIds)
            
            // Clean up uploaded files from server after transcription is complete
            uploadInterfaceRef.current?.clearFiles()
            console.log('Transcription completed, files cleaned up')
          }
          
        } catch (error) {
          console.error('Error polling job progress:', error)
        }
      }, 1000)
      
      return pollInterval
    }

    // Fetch completed transcription results
    const fetchCompletedResults = async (jobIds: string[]) => {
      for (let i = 0; i < jobIds.length; i++) {
        const jobId = jobIds[i]
        try {
          const response = await fetch(`/api/transcribe?jobId=${jobId}`)
          if (response.ok) {
            const data = await response.json()
            const job = data.data?.job || data.job
            
            if (job.status === 'completed' && job.result) {
              const result = job.result.result
              const transcript = result.transcript || ''
              const preview = transcript.split(/[.!?]/).slice(0, 3).join('. ').trim()
              const originalFile = validFiles[i]
              
              const transcriptionResult: TranscriptionResult = {
                id: `${jobId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                fileName: originalFile?.name || originalFile?.originalFilename || `Audio File ${i + 1}`,
                status: 'completed',
                transcript,
                preview: preview || transcript.substring(0, 150) + '...',
                duration: result.duration || 0,
                confidence: result.confidence || 0,
                timestamp: new Date().toISOString(),
                jobId,
                fileSize: originalFile?.size || 0,
                originalFile
              }
              
              setTranscriptionResults(prev => [...prev, transcriptionResult])
            } else if (job.status === 'failed') {
              const originalFile = validFiles[i]
              const errorResult: TranscriptionResult = {
                id: `${jobId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                fileName: originalFile?.name || originalFile?.originalFilename || `Audio File ${i + 1}`,
                status: 'failed',
                transcript: '',
                preview: '',
                duration: 0,
                confidence: 0,
                error: job.error || 'Transcription failed',
                timestamp: new Date().toISOString(),
                jobId,
                fileSize: originalFile?.size || 0,
                originalFile
              }
              
              setTranscriptionResults(prev => [...prev, errorResult])
            }
          }
        } catch (error) {
          console.error(`Failed to fetch result for job ${jobId}:`, error)
        }
      }
    }
    
    try {
      // Extract file IDs from the valid files
      const fileIds = validFiles.map(file => file.id)
      console.log('Files received in handleStartTranscription:', validFiles)
      console.log('Extracted file IDs:', fileIds)
      
      // Call the transcription API
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileIds,
          options: {
            model: 'mlx-community/parakeet-tdt-0.6b-v3',
            outputFormat: 'txt',
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Transcription failed')
      }

      const data = await response.json()
      console.log('Transcription API response:', data)
      
      // Handle nested response structure - API returns { success, data: { success, jobIds, message } }
      const responseData = data.data || data; // Handle both nested and flat response structures
      
      if (data.success && responseData.jobIds) {
        console.log('Transcription jobs started:', responseData.jobIds)
        
        // Start real-time progress monitoring
        monitorJobProgress(responseData.jobIds)
        
      } else {
        console.error('Response validation failed:', { 
          success: data.success, 
          jobIds: responseData?.jobIds, 
          message: responseData?.message || data.message,
          fullResponse: data 
        })
        throw new Error(responseData?.message || data.message || 'Failed to start transcription jobs')
      }
    } catch (error) {
      console.error('Transcription error:', error)
      
      // Show error state to user
      const errorResults = validFiles.map((file, index) => ({
        id: `${file.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fileName: file.name || file.originalFilename || `Audio File ${index + 1}`,
        status: 'failed' as const,
        transcript: '',
        preview: '',
        duration: 0,
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown transcription error',
        timestamp: new Date().toISOString(),
        fileSize: file.size || 0,
        originalFile: file
      }))
      
      setTranscriptionResults(prev => [...prev, ...errorResults])
      setIsTranscribing(false)
      setTranscriptionProgress(0)
      setEstimatedTimeRemaining(null)
      
      // Clean up uploaded files from server after transcription fails
      uploadInterfaceRef.current?.clearFiles()
      console.log('Transcription failed, files cleaned up')
    }
  }
  
  const handleCancelTranscription = () => {
    setIsTranscribing(false)
    setTranscriptionProgress(0)
    setEstimatedTimeRemaining(null)
    
    // Clean up uploaded files from server when transcription is cancelled
    uploadInterfaceRef.current?.clearFiles()
    console.log('Transcription cancelled, files cleaned up')
    // Note: EventSource cleanup happens in the finally block of handleStartTranscription
  }
  
  const handleRemoveFile = async (fileId: string) => {
    // Remove from database
    try {
      const response = await fetch(`/api/upload/files?fileId=${fileId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        console.warn('Failed to remove file from server:', response.statusText)
      }
    } catch (error) {
      console.warn('Error removing file from server:', error)
    }
    
    // Remove from local state
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }
  
  const handleClearTranscriptions = () => {
    setTranscriptionResults([])
    localStorage.removeItem('parakeet-transcriptions')
  }

  const handleDeleteTranscription = (idToDelete: string) => {
    setTranscriptionResults(prev => {
      const updated = prev.filter(result => result.id !== idToDelete)
      // Update localStorage with the filtered results
      if (updated.length > 0) {
        localStorage.setItem('parakeet-transcriptions', JSON.stringify(updated))
      } else {
        localStorage.removeItem('parakeet-transcriptions')
      }
      return updated
    })
  }
  
  const handleViewTranscription = (result: TranscriptionResult) => {
    setSelectedTranscription(result)
    setIsModalOpen(true)
  }

  const handleError = (error: any) => {
    console.error('Upload error:', error)
    setIsTranscribing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8
                     xs:px-6 xs:py-6
                     sm:px-8 sm:py-10
                     lg:px-12 lg:py-16">
        <div className="space-y-6">

          {/* Upload Interface */}
          <div className="bg-white rounded-xl shadow-lg p-6
                         xs:p-4
                         sm:p-6
                         md:p-8
                         lg:p-10">
            <UploadInterface
              ref={uploadInterfaceRef}
              onUploadComplete={handleUploadComplete}
              onError={handleError}
              onFileRemove={handleRemoveFile}
              maxFiles={10}
              maxSize={300 * 1024 * 1024} // 300MB
            />
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ready for Transcription</h3>
                <div className="space-x-2">
                  {!isTranscribing && (
                    <button
                      onClick={handleStartTranscription}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      🎯 Start Transcription
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      // Clear files from database
                      try {
                        const response = await fetch('/api/upload/files?clearAll=true', {
                          method: 'DELETE'
                        })
                        
                        if (!response.ok) {
                          console.warn('Failed to clear files from server:', response.statusText)
                        }
                      } catch (error) {
                        console.warn('Error clearing files from server:', error)
                      }
                      
                      // Clear local state
                      setUploadedFiles([])
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    🗑️ Clear All
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">🎵</div>
                      <div>
                        <p className="font-medium text-gray-900">{file.name || file.originalFilename || 'Unknown file'}</p>
                        <p className="text-sm text-gray-500">
                          {file.size && !isNaN(file.size) ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : 'Size unknown'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove file"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transcription Progress */}
          {isTranscribing && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <div>
                    <h3 className="text-lg font-medium text-blue-900">Transcribing Audio...</h3>
                    <p className="text-sm text-blue-700">
                      {progressSummary 
                        ? `Processing ${progressSummary.totalFiles} files - ${progressSummary.completedFiles} completed, ${progressSummary.failedFiles} failed`
                        : 'Processing your files with Parakeet ASR'
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancelTranscription}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  ⏹️ Cancel
                </button>
              </div>
              
              <ProgressBar 
                progress={transcriptionProgress}
                estimatedTimeRemaining={estimatedTimeRemaining}
              />
              
              {/* Show detailed progress for each job */}
              {progressSummary && progressSummary.currentlyProcessing.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-blue-900">Currently Processing:</p>
                  {Array.from(jobProgressMap.values()).map((progress, index) => (
                    progress.stage !== 'completed' && progress.stage !== 'error' && (
                      <div key={progress.fileId} className="flex items-center justify-between text-sm">
                        <span className="text-blue-700">File {index + 1}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-blue-600 capitalize">{progress.stage}</span>
                          <span className="text-blue-800 font-medium">{progress.progress}%</span>
                          {progress.estimatedTimeRemaining && (
                            <span className="text-blue-600">
                              ({formatTimeRemaining(progress.estimatedTimeRemaining)} remaining)
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Transcription Results */}
          {transcriptionResults.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    📋 Transcription History
                  </h2>
                  <p className="text-gray-600">
                    {transcriptionResults.length} transcription{transcriptionResults.length > 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={handleClearTranscriptions}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  🗑️ Clear History
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {transcriptionResults.map((result) => (
                  <div 
                    key={result.id} 
                    className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105 flex flex-col h-full"
                    onClick={() => handleViewTranscription(result)}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-3xl mb-2">🎵</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                          {result.fileName}
                        </h3>
                        <p className="text-sm text-gray-500 mb-1">
                          {new Date(result.timestamp).toLocaleDateString()}
                        </p>
                        <div className="text-sm text-gray-500 space-y-1">
                          {result.fileSize && !isNaN(result.fileSize) && (
                            <p>{(result.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                          )}
                          {result.status === 'completed' && result.duration > 0 && (
                            <p>{Math.floor(result.duration / 60)}m {Math.floor(result.duration % 60)}s</p>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm(`Delete transcription for "${result.fileName}"?`)) {
                            handleDeleteTranscription(result.id)
                          }
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors ml-2"
                        title="Delete this transcription"
                        aria-label={`Delete transcription for ${result.fileName}`}
                      >
                        🗑️
                      </button>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      {result.status === 'completed' ? (
                        <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                          ✅ {result.confidence ? `${Math.round(result.confidence * 100)}% confidence` : 'Complete'}
                        </span>
                      ) : result.status === 'failed' ? (
                        <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
                          ❌ Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
                          ⏳ Processing
                        </span>
                      )}
                    </div>
                    
                    {/* Card Content */}
                    <div className="flex-1 flex flex-col">
                      {result.status === 'failed' ? (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex-1">
                          <h4 className="font-medium text-red-900 mb-2">❌ Transcription Failed</h4>
                          <p className="text-red-700 text-sm">
                            {result.error || 'An unknown error occurred during transcription.'}
                          </p>
                        </div>
                      ) : result.preview ? (
                        <div className="bg-gray-50 p-4 rounded-lg flex-1 flex flex-col">
                          <p className="text-gray-700 leading-relaxed text-sm flex-1 line-clamp-4">
                            {result.preview}
                          </p>
                          {result.transcript.length > result.preview.length && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-blue-600 text-xs font-medium flex items-center">
                                📖 Click to read full transcript
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg flex-1 flex items-center justify-center">
                          <p className="text-gray-500 text-sm">No transcript available</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transcription Modal */}
          <TranscriptionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            transcription={selectedTranscription}
          />

        </div>
      </main>

    </div>
  )
}
