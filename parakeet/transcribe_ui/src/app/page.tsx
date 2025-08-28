'use client'

import React, { useState, useEffect } from 'react'
import UploadInterface from '@/components/UploadInterface'
import TranscriptionModal from '@/components/TranscriptionModal'
import ProgressBar from '@/components/ProgressBar'

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
}

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [transcriptionResults, setTranscriptionResults] = useState<TranscriptionResult[]>([])
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcriptionProgress, setTranscriptionProgress] = useState(0)
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null)
  const [selectedTranscription, setSelectedTranscription] = useState<TranscriptionResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    setUploadedFiles(files)
    // Don't start transcription automatically anymore
  }

  const handleStartTranscription = async () => {
    if (uploadedFiles.length === 0) return
    
    setIsTranscribing(true)
    setTranscriptionProgress(0)
    setEstimatedTimeRemaining(null)
    
    const startTime = Date.now()
    let progressInterval: NodeJS.Timeout | null = null
    
    // Set up realistic progress tracking based on file processing time
    const setupProgressTracking = (totalFiles: number, totalDurationEstimate: number) => {
      // Estimate progress based on file count and typical processing time
      const baseTimePerFile = 10000 // 10 seconds base time per file
      const durationMultiplier = 1000 // 1 second processing per 1 second of audio
      const estimatedTotalTime = Math.max(
        totalFiles * baseTimePerFile,
        totalDurationEstimate * durationMultiplier
      )
      
      let currentProgress = 0
      const updateInterval = 1000 // Update every second
      const progressIncrement = (100 / (estimatedTotalTime / updateInterval)) * 0.7 // Conservative estimate
      
      const progressInterval = setInterval(() => {
        currentProgress = Math.min(currentProgress + progressIncrement, 85) // Cap at 85% until complete
        setTranscriptionProgress(currentProgress)
        
        // Calculate estimated time remaining
        const elapsed = (Date.now() - startTime) / 1000
        const remaining = estimatedTotalTime - elapsed * 1000
        setEstimatedTimeRemaining(Math.max(remaining / 1000, 0))
        
        // Stop the interval if we've reached our max simulated progress
        if (currentProgress >= 85) {
          clearInterval(progressInterval)
        }
      }, updateInterval)
      
      // Store interval reference for cleanup
      return progressInterval
    }
    
    try {
      // Extract file IDs from the uploaded files
      const fileIds = uploadedFiles.map(file => file.id)
      console.log('Files received in handleStartTranscription:', uploadedFiles)
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
        
        // Estimate total duration for progress tracking
        const totalFiles = uploadedFiles.length
        const totalDurationEstimate = uploadedFiles.reduce((sum, file) => {
          // Estimate duration based on file size (rough approximation)
          const estimatedSeconds = (file.size || 0) / (1024 * 1024) * 10
          return sum + Math.max(estimatedSeconds, 5) // Minimum 5 seconds per file
        }, 0)
        
        // Set up realistic progress tracking
        progressInterval = setupProgressTracking(totalFiles, totalDurationEstimate)
        
        // Store job IDs for polling
        const jobIds = responseData.jobIds
        const pollInterval = 2000 // Poll every 2 seconds
        let completedJobs = 0
        const totalJobs = jobIds.length
        
        // Create placeholder results for each job
        const placeholderResults = uploadedFiles.map((file, index) => ({
          id: `${file.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fileName: file.name || file.originalFilename || `File ${index + 1}`,
          status: 'processing' as const,
          transcript: '',
          preview: '',
          duration: 0,
          confidence: 0,
          timestamp: new Date().toISOString(),
          jobId: jobIds[index] // Store job ID for tracking
        }))
        
        setTranscriptionResults(prev => [...prev, ...placeholderResults])
        
        // Poll job status until all jobs are complete
        const pollJobStatus = async () => {
          const completedResults = [...placeholderResults]
          let newCompletedJobs = 0
          
          for (let i = 0; i < jobIds.length; i++) {
            const jobId = jobIds[i]
            try {
              const statusResponse = await fetch(`/api/transcribe?jobId=${jobId}`)
              if (statusResponse.ok) {
                const statusData = await statusResponse.json()
                const job = statusData.data?.job || statusData.job // Handle nested structure
                
                if (job.status === 'completed' && job.result) {
                  const result = job.result.result
                  const transcript = result.transcript || ''
                  const preview = transcript.split(/[.!?]/).slice(0, 3).join('. ').trim()
                  
                  completedResults[i] = {
                    ...completedResults[i],
                    status: 'completed' as const,
                    transcript,
                    preview: preview || transcript.substring(0, 150) + '...',
                    duration: result.duration || 0,
                    confidence: result.confidence || 0
                  }
                  newCompletedJobs++
                } else if (job.status === 'failed') {
                  completedResults[i] = {
                    ...completedResults[i],
                    status: 'failed' as const,
                    error: job.error || 'Transcription failed'
                  }
                  newCompletedJobs++
                }
              }
            } catch (pollError) {
              console.warn(`Failed to poll status for job ${jobId}:`, pollError)
            }
          }
          
          // Update completed jobs count
          completedJobs = newCompletedJobs
          
          // Update progress based on completed jobs
          const jobProgress = (completedJobs / totalJobs) * 100
          setTranscriptionProgress(Math.max(jobProgress, 10)) // Minimum 10% to show progress
          
          // Update results
          setTranscriptionResults(prev => {
            const updated = [...prev]
            const startIndex = prev.length - placeholderResults.length
            completedResults.forEach((result, index) => {
              updated[startIndex + index] = result
            })
            return updated
          })
          
          // Continue polling if jobs are still processing
          if (completedJobs < totalJobs) {
            setTimeout(pollJobStatus, pollInterval)
          } else {
            // All jobs completed
            if (progressInterval) {
              clearInterval(progressInterval)
            }
            setTranscriptionProgress(100)
            setEstimatedTimeRemaining(0)
            setIsTranscribing(false)
          }
        }
        
        // Start polling
        setTimeout(pollJobStatus, pollInterval)
        
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
      const errorResults = uploadedFiles.map(file => ({
        id: `${file.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fileName: file.name || file.originalName,
        status: 'failed' as const,
        transcript: '',
        preview: '',
        duration: 0,
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown transcription error',
        timestamp: new Date().toISOString()
      }))
      
      setTranscriptionResults(prev => [...prev, ...errorResults])
    } finally {
      // Clean up progress interval
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      setIsTranscribing(false)
      setTranscriptionProgress(0)
      setEstimatedTimeRemaining(null)
    }
  }
  
  const handleCancelTranscription = () => {
    setIsTranscribing(false)
    setTranscriptionProgress(0)
    setEstimatedTimeRemaining(null)
    // Note: EventSource cleanup happens in the finally block of handleStartTranscription
  }
  
  const handleRemoveFile = (fileId: string) => {
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
              onUploadComplete={handleUploadComplete}
              onError={handleError}
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
                    onClick={() => setUploadedFiles([])}
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
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
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
                    <p className="text-sm text-blue-700">Processing your files with Parakeet ASR</p>
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
                        {result.status === 'completed' && result.duration > 0 && (
                          <p className="text-sm text-gray-500">
                            {Math.floor(result.duration / 60)}m {Math.floor(result.duration % 60)}s
                          </p>
                        )}
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
