import type {
  ConversionJob,
  ConversionResult,
  QueueStats,
  ConversionOptions,
  ConversionProgress
} from '../../types/audio'
import { QueueError } from '../../types/audio'

/**
 * Conversion queue system for managing audio conversion jobs
 * Provides job queuing, priority scheduling, and progress tracking
 */
export class ConversionQueue {
  private static instance: ConversionQueue | null = null
  private jobs: Map<string, ConversionJob> = new Map()
  private jobQueue: string[] = [] // Job IDs in priority order
  private processingJobs: Set<string> = new Set()
  private completedJobs: Set<string> = new Set()
  private failedJobs: Set<string> = new Set()
  private maxConcurrentJobs = 2 // Limit concurrent conversions
  private jobIdCounter = 0

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get singleton instance of conversion queue
   */
  static getInstance(): ConversionQueue {
    if (!ConversionQueue.instance) {
      ConversionQueue.instance = new ConversionQueue()
    }
    return ConversionQueue.instance
  }

  /**
   * Add a new conversion job to the queue
   */
  addJob(jobData: Omit<ConversionJob, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = this.generateJobId()
    const now = new Date()

    const job: ConversionJob = {
      id,
      ...jobData,
      createdAt: now,
      updatedAt: now
    }

    this.jobs.set(id, job)
    this.insertJobByPriority(id, job.priority)

    console.log(`Job ${id} added to queue with priority ${job.priority}`)
    
    // Start processing if not at capacity
    this.processNextJobs()

    return id
  }

  /**
   * Get a job by ID
   */
  getJob(id: string): ConversionJob | undefined {
    return this.jobs.get(id)
  }

  /**
   * Get the next job in queue (highest priority)
   */
  getNextJob(): ConversionJob | null {
    if (this.jobQueue.length === 0) {
      return null
    }

    const jobId = this.jobQueue[0]
    const job = this.jobs.get(jobId)
    
    if (!job) {
      // Clean up invalid job ID
      this.jobQueue.shift()
      return this.getNextJob() // Recurse to get next valid job
    }

    // Only return jobs that are pending
    if (job.status === 'pending') {
      return job
    }

    // Remove non-pending job from queue
    this.jobQueue.shift()
    return this.getNextJob()
  }

  /**
   * Update job status
   */
  updateJobStatus(
    jobId: string, 
    status: ConversionJob['status'],
    progress?: ConversionProgress
  ): void {
    const job = this.jobs.get(jobId)
    if (!job) {
      throw new QueueError(`Job ${jobId} not found`, jobId)
    }

    const previousStatus = job.status
    job.status = status
    job.updatedAt = new Date()

    if (progress) {
      job.progress = progress
    }

    // Update tracking sets
    this.updateJobTracking(jobId, previousStatus, status)

    // Start next job if this one completed/failed
    if (status === 'completed' || status === 'failed') {
      if (status === 'completed' && !job.completedAt) {
        job.completedAt = new Date()
      }
      
      this.processingJobs.delete(jobId)
      this.removeJobFromQueue(jobId)
      this.processNextJobs()
    } else if (status === 'processing' && !job.startedAt) {
      job.startedAt = new Date()
      this.processingJobs.add(jobId)
    }

    console.log(`Job ${jobId} status updated: ${previousStatus} → ${status}`)
  }

  /**
   * Mark job as completed with result
   */
  completeJob(jobId: string, result: ConversionResult): void {
    const job = this.jobs.get(jobId)
    if (!job) {
      throw new QueueError(`Job ${jobId} not found`, jobId)
    }

    job.result = result
    job.completedAt = new Date()
    this.updateJobStatus(jobId, 'completed')
    
    console.log(`Job ${jobId} completed successfully`)
  }

  /**
   * Mark job as failed with error message
   */
  failJob(jobId: string, errorMessage: string): void {
    const job = this.jobs.get(jobId)
    if (!job) {
      throw new QueueError(`Job ${jobId} not found`, jobId)
    }

    job.errorMessage = errorMessage
    this.updateJobStatus(jobId, 'failed')
    
    console.error(`Job ${jobId} failed: ${errorMessage}`)
  }

  /**
   * Remove job from queue
   */
  removeJob(jobId: string): boolean {
    const job = this.jobs.get(jobId)
    if (!job) {
      return false
    }

    // Can't remove processing jobs
    if (job.status === 'processing') {
      throw new QueueError(
        `Cannot remove job ${jobId} while processing`, 
        jobId
      )
    }

    this.jobs.delete(jobId)
    this.removeJobFromQueue(jobId)
    this.updateJobTracking(jobId, job.status, null)

    console.log(`Job ${jobId} removed from queue`)
    return true
  }

  /**
   * Get queue length
   */
  getQueueLength(): number {
    return this.jobQueue.length
  }

  /**
   * Get queue statistics
   */
  getQueueStats(): QueueStats {
    const stats: QueueStats = {
      total: this.jobs.size,
      pending: 0,
      processing: this.processingJobs.size,
      completed: this.completedJobs.size,
      failed: this.failedJobs.size
    }

    // Count pending jobs
    for (const job of this.jobs.values()) {
      if (job.status === 'pending') {
        stats.pending++
      }
    }

    return stats
  }

  /**
   * Get all jobs with optional status filter
   */
  getJobs(status?: ConversionJob['status']): ConversionJob[] {
    const jobs = Array.from(this.jobs.values())
    
    if (status) {
      return jobs.filter(job => job.status === status)
    }
    
    return jobs
  }

  /**
   * Get estimated processing time for all pending jobs
   */
  getEstimatedProcessingTime(): number {
    const pendingJobs = this.getJobs('pending')
    
    // Estimate based on file size and format complexity
    let totalEstimatedTime = 0
    
    for (const job of pendingJobs) {
      const fileSize = job.inputFile.length
      const complexity = this.getFormatComplexity(job.options)
      
      // Base estimation: ~1MB per second processing + format complexity
      const basetime = (fileSize / (1024 * 1024)) * 1000 // milliseconds
      const complexityMultiplier = complexity
      
      totalEstimatedTime += basetime * complexityMultiplier
    }
    
    // Account for concurrent processing
    const concurrentFactor = Math.min(this.maxConcurrentJobs, pendingJobs.length)
    if (concurrentFactor > 1) {
      totalEstimatedTime = totalEstimatedTime / concurrentFactor
    }
    
    return Math.round(totalEstimatedTime / 1000) // Convert to seconds
  }

  /**
   * Clear all jobs from queue
   */
  clear(): void {
    // Don't clear processing jobs
    const processingJobs = Array.from(this.jobs.values())
      .filter(job => job.status === 'processing')
      
    if (processingJobs.length > 0) {
      throw new QueueError(
        `Cannot clear queue while ${processingJobs.length} jobs are processing`
      )
    }

    this.jobs.clear()
    this.jobQueue = []
    this.processingJobs.clear()
    this.completedJobs.clear()
    this.failedJobs.clear()
    
    console.log('Queue cleared')
  }

  /**
   * Pause queue processing
   */
  pause(): void {
    // Implementation would set a paused flag
    console.log('Queue processing paused')
  }

  /**
   * Resume queue processing
   */
  resume(): void {
    // Implementation would clear paused flag and start processing
    this.processNextJobs()
    console.log('Queue processing resumed')
  }

  /**
   * Get job position in queue
   */
  getJobPosition(jobId: string): number {
    return this.jobQueue.indexOf(jobId) + 1 // 1-based position
  }

  /**
   * Update job priority (will reorder in queue)
   */
  updateJobPriority(jobId: string, newPriority: number): void {
    const job = this.jobs.get(jobId)
    if (!job) {
      throw new QueueError(`Job ${jobId} not found`, jobId)
    }

    if (job.status === 'processing') {
      throw new QueueError(
        `Cannot update priority of processing job ${jobId}`, 
        jobId
      )
    }

    const oldPriority = job.priority
    job.priority = newPriority
    job.updatedAt = new Date()

    // Reorder in queue
    this.removeJobFromQueue(jobId)
    this.insertJobByPriority(jobId, newPriority)

    console.log(`Job ${jobId} priority updated: ${oldPriority} → ${newPriority}`)
  }

  /**
   * Private: Generate unique job ID
   */
  private generateJobId(): string {
    this.jobIdCounter++
    const timestamp = Date.now().toString(36)
    const counter = this.jobIdCounter.toString(36).padStart(3, '0')
    return `job_${timestamp}_${counter}`
  }

  /**
   * Private: Insert job into queue by priority
   */
  private insertJobByPriority(jobId: string, priority: number): void {
    // Lower priority number = higher priority (1 is highest)
    let insertIndex = this.jobQueue.length

    for (let i = 0; i < this.jobQueue.length; i++) {
      const existingJobId = this.jobQueue[i]
      const existingJob = this.jobs.get(existingJobId)
      
      if (existingJob && existingJob.priority > priority) {
        insertIndex = i
        break
      }
    }

    this.jobQueue.splice(insertIndex, 0, jobId)
  }

  /**
   * Private: Remove job from queue
   */
  private removeJobFromQueue(jobId: string): void {
    const index = this.jobQueue.indexOf(jobId)
    if (index !== -1) {
      this.jobQueue.splice(index, 1)
    }
  }

  /**
   * Private: Update job tracking sets
   */
  private updateJobTracking(
    jobId: string, 
    previousStatus: ConversionJob['status'] | null, 
    newStatus: ConversionJob['status'] | null
  ): void {
    // Remove from previous status tracking
    if (previousStatus) {
      switch (previousStatus) {
        case 'processing':
          this.processingJobs.delete(jobId)
          break
        case 'completed':
          this.completedJobs.delete(jobId)
          break
        case 'failed':
          this.failedJobs.delete(jobId)
          break
      }
    }

    // Add to new status tracking
    if (newStatus) {
      switch (newStatus) {
        case 'processing':
          this.processingJobs.add(jobId)
          break
        case 'completed':
          this.completedJobs.add(jobId)
          break
        case 'failed':
          this.failedJobs.add(jobId)
          break
      }
    }
  }

  /**
   * Private: Start processing next available jobs
   */
  private processNextJobs(): void {
    const availableSlots = this.maxConcurrentJobs - this.processingJobs.size
    
    for (let i = 0; i < availableSlots; i++) {
      const nextJob = this.getNextJob()
      if (nextJob) {
        this.startJobProcessing(nextJob)
      } else {
        break // No more jobs available
      }
    }
  }

  /**
   * Private: Start processing a specific job
   */
  private async startJobProcessing(job: ConversionJob): Promise<void> {
    try {
      this.updateJobStatus(job.id, 'processing')
      
      // This would integrate with FFmpegConversionService
      console.log(`Starting processing for job ${job.id}`)
      
      // Note: Actual processing would be handled by a separate service
      // This queue manager just tracks job states
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown processing error'
      this.failJob(job.id, errorMessage)
    }
  }

  /**
   * Private: Get format complexity multiplier for time estimation
   */
  private getFormatComplexity(options: ConversionOptions): number {
    const complexityMap: Record<string, number> = {
      'mp3': 1.0,
      'wav': 0.5,   // Faster (less compression)
      'm4a': 1.2,
      'flac': 0.8,  // Lossless but efficient
      'ogg': 1.1
    }

    const inputComplexity = complexityMap[options.inputFormat] || 1.0
    const outputComplexity = complexityMap[options.outputFormat] || 1.0
    
    // Quality settings affect complexity
    const qualityMultiplier = {
      'lowest': 0.7,
      'low': 0.8,
      'standard': 1.0,
      'high': 1.3,
      'highest': 1.8
    }[options.quality] || 1.0

    return inputComplexity + outputComplexity + qualityMultiplier
  }

  /**
   * Set maximum concurrent jobs
   */
  setMaxConcurrentJobs(max: number): void {
    if (max < 1) {
      throw new QueueError('Maximum concurrent jobs must be at least 1')
    }
    
    this.maxConcurrentJobs = max
    console.log(`Maximum concurrent jobs set to ${max}`)
    
    // Start processing if we now have available slots
    this.processNextJobs()
  }

  /**
   * Get maximum concurrent jobs
   */
  getMaxConcurrentJobs(): number {
    return this.maxConcurrentJobs
  }
}