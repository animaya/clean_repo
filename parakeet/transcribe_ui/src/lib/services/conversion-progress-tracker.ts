import type {
  ConversionProgress,
  ConversionJob,
  ProgressTracker
} from '../../types/audio'

/**
 * Progress tracking service for audio conversion operations
 * Provides real-time progress updates and event management
 */
export class ConversionProgressTracker implements ProgressTracker {
  private static instance: ConversionProgressTracker | null = null
  
  // Progress tracking for individual jobs
  private jobProgress: Map<string, ConversionProgress> = new Map()
  
  // Event listeners for progress updates
  private globalProgressListeners: Set<(progress: ConversionProgress) => void> = new Set()
  private jobProgressListeners: Map<string, Set<(progress: ConversionProgress) => void>> = new Map()
  
  // Overall queue progress
  private queueProgress: ConversionProgress = {
    percentage: 0,
    currentStep: 'Ready',
    estimatedTimeRemaining: 0
  }

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get singleton instance of progress tracker
   */
  static getInstance(): ConversionProgressTracker {
    if (!ConversionProgressTracker.instance) {
      ConversionProgressTracker.instance = new ConversionProgressTracker()
    }
    return ConversionProgressTracker.instance
  }

  /**
   * Initialize progress tracking for a job
   */
  initializeJobProgress(jobId: string, initialStep = 'Initializing'): void {
    const initialProgress: ConversionProgress = {
      percentage: 0,
      currentStep: initialStep,
      estimatedTimeRemaining: 0
    }

    this.jobProgress.set(jobId, initialProgress)
    this.jobProgressListeners.set(jobId, new Set())

    console.log(`Progress tracking initialized for job ${jobId}`)
    this.notifyJobProgress(jobId, initialProgress)
  }

  /**
   * Update progress for a specific job
   */
  updateJobProgress(
    jobId: string, 
    update: Partial<ConversionProgress>
  ): void {
    const currentProgress = this.jobProgress.get(jobId)
    if (!currentProgress) {
      console.warn(`No progress tracking for job ${jobId}`)
      return
    }

    const updatedProgress: ConversionProgress = {
      ...currentProgress,
      ...update
    }

    // Ensure percentage is within bounds
    updatedProgress.percentage = Math.max(0, Math.min(100, updatedProgress.percentage))

    // Update timestamp for rate calculations  
    ;(updatedProgress as any).lastUpdateTime = Date.now()

    this.jobProgress.set(jobId, updatedProgress)
    this.notifyJobProgress(jobId, updatedProgress)

    // Update overall queue progress
    this.updateQueueProgress()

    console.log(`Job ${jobId} progress: ${updatedProgress.percentage}% - ${updatedProgress.currentStep}`)
  }

  /**
   * Complete progress tracking for a job
   */
  completeJobProgress(jobId: string): void {
    const finalProgress: ConversionProgress & { lastUpdateTime: number } = {
      percentage: 100,
      currentStep: 'Completed',
      estimatedTimeRemaining: 0,
      lastUpdateTime: Date.now()
    }

    this.updateJobProgress(jobId, finalProgress)
    
    // Clean up after a delay to allow final notifications
    setTimeout(() => {
      this.cleanupJobProgress(jobId)
    }, 5000)
  }

  /**
   * Mark job progress as failed
   */
  failJobProgress(jobId: string, errorMessage: string): void {
    const failedProgress: ConversionProgress & { lastUpdateTime: number } = {
      percentage: 0,
      currentStep: `Failed: ${errorMessage}`,
      estimatedTimeRemaining: 0,
      lastUpdateTime: Date.now()
    }

    this.updateJobProgress(jobId, failedProgress)
    
    // Clean up after a delay
    setTimeout(() => {
      this.cleanupJobProgress(jobId)
    }, 10000)
  }

  /**
   * Get current progress for a job
   */
  getJobProgress(jobId: string): ConversionProgress | null {
    return this.jobProgress.get(jobId) || null
  }

  /**
   * Get overall queue progress
   */
  getQueueProgress(): ConversionProgress {
    return { ...this.queueProgress }
  }

  /**
   * Add progress listener for specific job
   */
  addJobProgressListener(
    jobId: string, 
    callback: (progress: ConversionProgress) => void
  ): void {
    let listeners = this.jobProgressListeners.get(jobId)
    if (!listeners) {
      listeners = new Set()
      this.jobProgressListeners.set(jobId, listeners)
    }
    
    listeners.add(callback)
    console.log(`Progress listener added for job ${jobId}`)
  }

  /**
   * Remove progress listener for specific job
   */
  removeJobProgressListener(
    jobId: string, 
    callback: (progress: ConversionProgress) => void
  ): void {
    const listeners = this.jobProgressListeners.get(jobId)
    if (listeners) {
      listeners.delete(callback)
      console.log(`Progress listener removed for job ${jobId}`)
    }
  }

  /**
   * Global progress listener (for all jobs)
   */
  onProgress(callback: (progress: ConversionProgress) => void): void {
    this.globalProgressListeners.add(callback)
    console.log('Global progress listener added')
  }

  /**
   * Remove global progress listener
   */
  offProgress(callback: (progress: ConversionProgress) => void): void {
    this.globalProgressListeners.delete(callback)
    console.log('Global progress listener removed')
  }

  /**
   * Update progress implementation (for ProgressTracker interface)
   */
  updateProgress(progress: Partial<ConversionProgress>): void {
    // This updates the overall queue progress
    this.queueProgress = {
      ...this.queueProgress,
      ...progress
    } as any
    
    // Set lastUpdateTime separately to avoid type issues
    ;(this.queueProgress as any).lastUpdateTime = Date.now()

    this.notifyGlobalProgress(this.queueProgress)
  }

  /**
   * Create progress reporter for FFmpeg operations
   */
  createFFmpegProgressReporter(jobId: string): (message: string) => void {
    return (message: string) => {
      const progress = this.parseFFmpegProgress(message)
      if (progress) {
        this.updateJobProgress(jobId, progress)
      }
    }
  }

  /**
   * Create progress estimator based on file size and format
   */
  createProgressEstimator(
    jobId: string,
    fileSize: number,
    inputFormat: string,
    outputFormat: string
  ): {
    start: () => void
    updateStep: (step: string) => void
    finish: () => void
  } {
    let startTime: number
    let currentStep = 'Preparing'
    
    const estimateTimeRemaining = (percentage: number): number => {
      if (!startTime || percentage === 0) return 0
      
      const elapsed = (Date.now() - startTime) / 1000
      const rate = percentage / elapsed
      
      if (rate > 0) {
        return Math.round((100 - percentage) / rate)
      }
      
      return 0
    }

    return {
      start: () => {
        startTime = Date.now()
        this.updateJobProgress(jobId, {
          percentage: 5,
          currentStep: 'Starting conversion',
          estimatedTimeRemaining: this.estimateConversionTime(fileSize, inputFormat, outputFormat)
        })
      },

      updateStep: (step: string) => {
        currentStep = step
        const currentProgress = this.getJobProgress(jobId)
        if (currentProgress) {
          this.updateJobProgress(jobId, {
            currentStep: step,
            estimatedTimeRemaining: estimateTimeRemaining(currentProgress.percentage)
          })
        }
      },

      finish: () => {
        this.completeJobProgress(jobId)
      }
    }
  }

  /**
   * Get progress statistics for all active jobs
   */
  getProgressStatistics(): {
    activeJobs: number
    totalProgress: number
    averageProgress: number
    estimatedTimeRemaining: number
  } {
    const activeJobs = Array.from(this.jobProgress.values())
      .filter(progress => progress.percentage < 100)

    if (activeJobs.length === 0) {
      return {
        activeJobs: 0,
        totalProgress: 100,
        averageProgress: 100,
        estimatedTimeRemaining: 0
      }
    }

    const totalProgress = activeJobs.reduce((sum, progress) => sum + progress.percentage, 0)
    const averageProgress = totalProgress / activeJobs.length
    const maxTimeRemaining = Math.max(...activeJobs.map(p => p.estimatedTimeRemaining || 0))

    return {
      activeJobs: activeJobs.length,
      totalProgress,
      averageProgress,
      estimatedTimeRemaining: maxTimeRemaining
    }
  }

  /**
   * Private: Parse FFmpeg progress message
   */
  private parseFFmpegProgress(message: string): Partial<ConversionProgress> | null {
    // Parse FFmpeg progress output
    // Example: "frame=  123 fps= 45 q=-0.0 size=    1024kB time=00:00:12.34 bitrate= 678.9kbits/s speed=1.23x"
    
    if (!message.includes('time=') || !message.includes('speed=')) {
      return null
    }

    try {
      // Extract time information
      const timeMatch = message.match(/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/)
      const speedMatch = message.match(/speed=([0-9.]+)x/)
      const sizeMatch = message.match(/size=\s*(\d+)/)

      if (!timeMatch || !speedMatch) {
        return null
      }

      const hours = parseInt(timeMatch[1])
      const minutes = parseInt(timeMatch[2])
      const seconds = parseFloat(timeMatch[3])
      const totalSeconds = hours * 3600 + minutes * 60 + seconds
      
      const speed = parseFloat(speedMatch[1])
      const processedSize = sizeMatch ? parseInt(sizeMatch[1]) : 0

      // Estimate progress percentage (would need total duration for accuracy)
      // For now, use a heuristic based on processing speed and size
      let percentage = Math.min(95, totalSeconds * 2) // Rough estimate
      
      const estimatedRemaining = speed > 0 ? (100 - percentage) / speed : 0

      return {
        percentage: Math.round(percentage),
        currentStep: `Converting... (${speed}x speed)`,
        estimatedTimeRemaining: Math.round(estimatedRemaining)
      }

    } catch (error) {
      console.warn('Failed to parse FFmpeg progress:', error)
      return null
    }
  }

  /**
   * Private: Update overall queue progress
   */
  private updateQueueProgress(): void {
    const stats = this.getProgressStatistics()
    
    this.queueProgress = {
      percentage: Math.round(stats.averageProgress),
      currentStep: stats.activeJobs > 0 
        ? `Processing ${stats.activeJobs} job${stats.activeJobs > 1 ? 's' : ''}`
        : 'Ready',
      estimatedTimeRemaining: stats.estimatedTimeRemaining
    } as any
    
    // Set lastUpdateTime separately to avoid type issues
    ;(this.queueProgress as any).lastUpdateTime = Date.now()

    this.notifyGlobalProgress(this.queueProgress)
  }

  /**
   * Private: Notify job-specific progress listeners
   */
  private notifyJobProgress(jobId: string, progress: ConversionProgress): void {
    const listeners = this.jobProgressListeners.get(jobId)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(progress)
        } catch (error) {
          console.error(`Error in job progress callback for ${jobId}:`, error)
        }
      })
    }
  }

  /**
   * Private: Notify global progress listeners
   */
  private notifyGlobalProgress(progress: ConversionProgress): void {
    this.globalProgressListeners.forEach(callback => {
      try {
        callback(progress)
      } catch (error) {
        console.error('Error in global progress callback:', error)
      }
    })
  }

  /**
   * Private: Clean up progress tracking for completed job
   */
  private cleanupJobProgress(jobId: string): void {
    this.jobProgress.delete(jobId)
    this.jobProgressListeners.delete(jobId)
    console.log(`Progress tracking cleaned up for job ${jobId}`)
  }

  /**
   * Private: Estimate conversion time based on file characteristics
   */
  private estimateConversionTime(
    fileSize: number, 
    inputFormat: string, 
    outputFormat: string
  ): number {
    // Base time estimation in seconds
    const baseMBPerSecond = 2 // Rough processing rate
    const fileSizeMB = fileSize / (1024 * 1024)
    
    // Format complexity multipliers
    const complexityMap: Record<string, number> = {
      'wav': 0.5,   // Uncompressed, fast
      'mp3': 1.0,   // Standard baseline
      'flac': 0.8,  // Lossless but efficient
      'm4a': 1.2,   // More complex encoding
      'ogg': 1.1    // Moderately complex
    }

    const inputComplexity = complexityMap[inputFormat] || 1.0
    const outputComplexity = complexityMap[outputFormat] || 1.0
    
    const avgComplexity = (inputComplexity + outputComplexity) / 2
    const estimatedTime = (fileSizeMB / baseMBPerSecond) * avgComplexity
    
    return Math.max(5, Math.round(estimatedTime)) // Minimum 5 seconds
  }

  /**
   * Reset all progress tracking
   */
  reset(): void {
    this.jobProgress.clear()
    this.jobProgressListeners.clear()
    this.queueProgress = {
      percentage: 0,
      currentStep: 'Ready',
      estimatedTimeRemaining: 0
    }
    
    console.log('Progress tracker reset')
  }

  /**
   * Get debug information about current progress state
   */
  getDebugInfo(): {
    activeJobs: string[]
    queueProgress: ConversionProgress
    listenerCounts: Record<string, number>
    globalListeners: number
  } {
    const listenerCounts: Record<string, number> = {}
    
    this.jobProgressListeners.forEach((listeners, jobId) => {
      listenerCounts[jobId] = listeners.size
    })

    return {
      activeJobs: Array.from(this.jobProgress.keys()),
      queueProgress: this.queueProgress,
      listenerCounts,
      globalListeners: this.globalProgressListeners.size
    }
  }
}