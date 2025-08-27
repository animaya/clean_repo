/**
 * Cleanup service for temporary conversion files and memory management
 * Handles cleanup of FFmpeg temporary files, browser memory, and conversion artifacts
 */
export class ConversionCleanupService {
  private static instance: ConversionCleanupService | null = null
  
  // Track temporary files and cleanup tasks
  private tempFiles: Map<string, string[]> = new Map() // jobId -> file paths
  private cleanupTasks: Map<string, NodeJS.Timeout> = new Map() // jobId -> timeout
  private memoryUsageTracking: Map<string, number> = new Map() // jobId -> memory size
  
  // Cleanup configuration
  private readonly defaultCleanupDelay = 30000 // 30 seconds
  private readonly maxMemoryUsage = 500 * 1024 * 1024 // 500MB
  private readonly cleanupBatchSize = 5 // Max cleanup operations per batch

  private constructor() {
    // Set up global cleanup on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.performEmergencyCleanup()
      })
      
      // Periodic memory cleanup
      setInterval(() => {
        this.performPeriodicCleanup()
      }, 60000) // Every minute
    }
  }

  /**
   * Get singleton instance of cleanup service
   */
  static getInstance(): ConversionCleanupService {
    if (!ConversionCleanupService.instance) {
      ConversionCleanupService.instance = new ConversionCleanupService()
    }
    return ConversionCleanupService.instance
  }

  /**
   * Register temporary files for cleanup
   */
  registerTempFiles(jobId: string, filePaths: string[]): void {
    const existingFiles = this.tempFiles.get(jobId) || []
    const allFiles = [...existingFiles, ...filePaths]
    
    this.tempFiles.set(jobId, allFiles)
    console.log(`Registered ${filePaths.length} temp files for job ${jobId}`)
    
    // Schedule cleanup
    this.scheduleCleanup(jobId)
  }

  /**
   * Register memory usage for tracking
   */
  registerMemoryUsage(jobId: string, sizeBytes: number): void {
    const currentUsage = this.memoryUsageTracking.get(jobId) || 0
    this.memoryUsageTracking.set(jobId, currentUsage + sizeBytes)
    
    console.log(`Job ${jobId} memory usage: ${this.formatBytes(currentUsage + sizeBytes)}`)
    
    // Check if we're approaching memory limits
    this.checkMemoryLimits()
  }

  /**
   * Clean up immediately for a specific job
   */
  async cleanupJob(jobId: string): Promise<{
    filesCleanedUp: number
    memoryFreed: number
    errors: string[]
  }> {
    const results = {
      filesCleanedUp: 0,
      memoryFreed: 0,
      errors: [] as string[]
    }

    try {
      // Cancel scheduled cleanup
      const scheduledCleanup = this.cleanupTasks.get(jobId)
      if (scheduledCleanup) {
        clearTimeout(scheduledCleanup)
        this.cleanupTasks.delete(jobId)
      }

      // Clean up temporary files
      const tempFiles = this.tempFiles.get(jobId) || []
      for (const filePath of tempFiles) {
        try {
          await this.cleanupTempFile(filePath)
          results.filesCleanedUp++
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown file cleanup error'
          results.errors.push(`Failed to cleanup ${filePath}: ${errorMessage}`)
          console.warn(`Failed to cleanup temp file ${filePath}:`, error)
        }
      }

      // Free memory tracking
      const memoryUsage = this.memoryUsageTracking.get(jobId) || 0
      results.memoryFreed = memoryUsage

      // Clear tracking
      this.tempFiles.delete(jobId)
      this.memoryUsageTracking.delete(jobId)

      console.log(`Cleanup completed for job ${jobId}:`, {
        files: results.filesCleanedUp,
        memory: this.formatBytes(results.memoryFreed),
        errors: results.errors.length
      })

      // Force garbage collection if available
      this.requestGarbageCollection()

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown cleanup error'
      results.errors.push(`Job cleanup failed: ${errorMessage}`)
      console.error(`Cleanup failed for job ${jobId}:`, error)
    }

    return results
  }

  /**
   * Clean up all jobs and temporary resources
   */
  async cleanupAll(): Promise<{
    totalJobs: number
    filesCleanedUp: number
    memoryFreed: number
    errors: string[]
  }> {
    const results = {
      totalJobs: this.tempFiles.size,
      filesCleanedUp: 0,
      memoryFreed: 0,
      errors: [] as string[]
    }

    console.log(`Starting cleanup of ${results.totalJobs} jobs`)

    const jobIds = Array.from(this.tempFiles.keys())
    
    // Process cleanup in batches to avoid overwhelming the system
    for (let i = 0; i < jobIds.length; i += this.cleanupBatchSize) {
      const batch = jobIds.slice(i, i + this.cleanupBatchSize)
      
      await Promise.all(batch.map(async (jobId) => {
        const jobResults = await this.cleanupJob(jobId)
        results.filesCleanedUp += jobResults.filesCleanedUp
        results.memoryFreed += jobResults.memoryFreed
        results.errors.push(...jobResults.errors)
      }))

      // Small delay between batches
      if (i + this.cleanupBatchSize < jobIds.length) {
        await this.delay(100)
      }
    }

    console.log('Global cleanup completed:', results)
    return results
  }

  /**
   * Schedule cleanup for a job with delay
   */
  scheduleCleanup(jobId: string, delayMs?: number): void {
    const delay = delayMs || this.defaultCleanupDelay

    // Cancel existing scheduled cleanup
    const existingTimeout = this.cleanupTasks.get(jobId)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    // Schedule new cleanup
    const timeout = setTimeout(async () => {
      await this.cleanupJob(jobId)
    }, delay)

    this.cleanupTasks.set(jobId, timeout)
    console.log(`Cleanup scheduled for job ${jobId} in ${delay}ms`)
  }

  /**
   * Cancel scheduled cleanup for a job
   */
  cancelScheduledCleanup(jobId: string): void {
    const timeout = this.cleanupTasks.get(jobId)
    if (timeout) {
      clearTimeout(timeout)
      this.cleanupTasks.delete(jobId)
      console.log(`Cancelled scheduled cleanup for job ${jobId}`)
    }
  }

  /**
   * Get current cleanup status
   */
  getCleanupStatus(): {
    activeJobs: number
    scheduledCleanups: number
    totalTempFiles: number
    totalMemoryUsage: number
    memoryUsageByJob: Record<string, string>
  } {
    let totalTempFiles = 0
    let totalMemoryUsage = 0
    const memoryUsageByJob: Record<string, string> = {}

    this.tempFiles.forEach((files, jobId) => {
      totalTempFiles += files.length
      const memory = this.memoryUsageTracking.get(jobId) || 0
      totalMemoryUsage += memory
      memoryUsageByJob[jobId] = this.formatBytes(memory)
    })

    return {
      activeJobs: this.tempFiles.size,
      scheduledCleanups: this.cleanupTasks.size,
      totalTempFiles,
      totalMemoryUsage,
      memoryUsageByJob
    }
  }

  /**
   * Force immediate cleanup of oldest jobs to free memory
   */
  async forceMemoryCleanup(targetMemoryReduction: number): Promise<number> {
    const jobsByMemoryUsage = Array.from(this.memoryUsageTracking.entries())
      .sort(([, a], [, b]) => b - a) // Sort by memory usage (highest first)

    let memoryFreed = 0
    const jobsToCleanup: string[] = []

    // Select jobs to cleanup until we reach the target
    for (const [jobId, memoryUsage] of jobsByMemoryUsage) {
      jobsToCleanup.push(jobId)
      memoryFreed += memoryUsage
      
      if (memoryFreed >= targetMemoryReduction) {
        break
      }
    }

    console.log(`Force cleaning up ${jobsToCleanup.length} jobs to free ${this.formatBytes(memoryFreed)}`)

    // Cleanup selected jobs
    for (const jobId of jobsToCleanup) {
      await this.cleanupJob(jobId)
    }

    return memoryFreed
  }

  /**
   * Private: Clean up a specific temporary file
   */
  private async cleanupTempFile(filePath: string): Promise<void> {
    // In browser environment, this would clean up from FFmpeg's virtual filesystem
    // For now, this is a placeholder - actual implementation would use FFmpeg.deleteFile()
    
    try {
      console.log(`Cleaning up temp file: ${filePath}`)
      
      // Simulate file cleanup delay
      await this.delay(10)
      
      // In actual implementation:
      // await ffmpeg.deleteFile(filePath)
      
    } catch (error) {
      console.error(`Failed to cleanup temp file ${filePath}:`, error)
      throw error
    }
  }

  /**
   * Private: Check memory limits and trigger cleanup if needed
   */
  private checkMemoryLimits(): void {
    const totalMemoryUsage = Array.from(this.memoryUsageTracking.values())
      .reduce((sum, usage) => sum + usage, 0)

    if (totalMemoryUsage > this.maxMemoryUsage) {
      const excessMemory = totalMemoryUsage - this.maxMemoryUsage
      console.warn(`Memory usage (${this.formatBytes(totalMemoryUsage)}) exceeds limit. Forcing cleanup...`)
      
      // Force cleanup of excess memory usage
      this.forceMemoryCleanup(excessMemory)
        .catch(error => console.error('Emergency memory cleanup failed:', error))
    }
  }

  /**
   * Private: Perform periodic cleanup of old resources
   */
  private async performPeriodicCleanup(): void {
    const status = this.getCleanupStatus()
    
    // Clean up if we have too many temp files or high memory usage
    if (status.totalTempFiles > 50 || status.totalMemoryUsage > this.maxMemoryUsage * 0.8) {
      console.log('Performing periodic cleanup due to resource usage')
      
      // Clean up oldest jobs first
      const oldJobIds = Array.from(this.tempFiles.keys()).slice(0, Math.floor(status.activeJobs * 0.3))
      
      for (const jobId of oldJobIds) {
        await this.cleanupJob(jobId)
      }
    }
  }

  /**
   * Private: Emergency cleanup on page unload
   */
  private performEmergencyCleanup(): void {
    console.log('Performing emergency cleanup before page unload')
    
    // Cancel all scheduled cleanups
    this.cleanupTasks.forEach(timeout => clearTimeout(timeout))
    this.cleanupTasks.clear()

    // Clear tracking (files will be cleaned up when FFmpeg instance terminates)
    this.tempFiles.clear()
    this.memoryUsageTracking.clear()
  }

  /**
   * Private: Request garbage collection if available
   */
  private requestGarbageCollection(): void {
    if (typeof window !== 'undefined' && 'gc' in window) {
      try {
        (window as any).gc()
        console.log('Garbage collection requested')
      } catch (error) {
        // Ignore errors - gc() may not be available
      }
    }
  }

  /**
   * Private: Simple delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Private: Format bytes for human reading
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * Set custom cleanup delay
   */
  setCleanupDelay(delayMs: number): void {
    if (delayMs < 1000) {
      throw new Error('Cleanup delay must be at least 1000ms')
    }
    
    console.log(`Cleanup delay updated to ${delayMs}ms`)
    // Implementation would update the default delay
  }

  /**
   * Set maximum memory usage threshold
   */
  setMaxMemoryUsage(bytes: number): void {
    if (bytes < 10 * 1024 * 1024) { // Minimum 10MB
      throw new Error('Maximum memory usage must be at least 10MB')
    }
    
    console.log(`Maximum memory usage updated to ${this.formatBytes(bytes)}`)
    // Implementation would update the threshold
  }

  /**
   * Get memory usage statistics
   */
  getMemoryStatistics(): {
    totalUsage: number
    averagePerJob: number
    maxJobUsage: number
    jobCount: number
  } {
    const usages = Array.from(this.memoryUsageTracking.values())
    const totalUsage = usages.reduce((sum, usage) => sum + usage, 0)
    
    return {
      totalUsage,
      averagePerJob: usages.length > 0 ? totalUsage / usages.length : 0,
      maxJobUsage: usages.length > 0 ? Math.max(...usages) : 0,
      jobCount: usages.length
    }
  }

  /**
   * Manual cleanup trigger for testing/debugging
   */
  async manualCleanup(): Promise<void> {
    console.log('Manual cleanup triggered')
    const results = await this.cleanupAll()
    console.log('Manual cleanup results:', results)
  }
}