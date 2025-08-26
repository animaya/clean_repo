import { PrismaClient } from '@prisma/client'
import { promises as fs } from 'fs'
import path from 'path'

export type CleanupResult = {
  deletedRecords: number
  orphanedFiles: string[]
  errors: string[]
  totalProcessed: number
}

export type MaintenanceReport = {
  timestamp: Date
  orphanedFiles: CleanupResult
  oldSessions: CleanupResult
  completedJobs: CleanupResult
  databaseSize: number
  storageSize: number
  recommendations: string[]
}

/**
 * Cleans up orphaned file records (database entries without corresponding files)
 */
export async function cleanupOrphanedFiles(
  prisma: PrismaClient,
  uploadsBasePath: string = './uploads'
): Promise<CleanupResult> {
  const result: CleanupResult = {
    deletedRecords: 0,
    orphanedFiles: [],
    errors: [],
    totalProcessed: 0
  }

  try {
    // Get all uploaded files from database
    const uploadedFiles = await prisma.uploadedFiles.findMany({
      select: {
        id: true,
        filePath: true,
        convertedFilePath: true
      }
    })

    result.totalProcessed = uploadedFiles.length

    for (const file of uploadedFiles) {
      try {
        let hasValidFile = false

        // Check if main file exists
        if (file.filePath) {
          try {
            await fs.access(file.filePath)
            hasValidFile = true
          } catch {
            result.orphanedFiles.push(file.filePath)
          }
        }

        // Check if converted file exists (if it should)
        if (file.convertedFilePath) {
          try {
            await fs.access(file.convertedFilePath)
            if (!hasValidFile) hasValidFile = true
          } catch {
            result.orphanedFiles.push(file.convertedFilePath)
          }
        }

        // If no valid files exist, delete the database record
        if (!hasValidFile) {
          await prisma.uploadedFiles.delete({
            where: { id: file.id }
          })
          result.deletedRecords++
        }
      } catch (error) {
        result.errors.push(`Failed to process file ${file.id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  } catch (error) {
    result.errors.push(`Failed to query uploaded files: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  return result
}

/**
 * Cleans up old upload sessions that are completed or failed
 */
export async function cleanupOldSessions(
  prisma: PrismaClient,
  daysOld: number = 30
): Promise<CleanupResult> {
  const result: CleanupResult = {
    deletedRecords: 0,
    orphanedFiles: [],
    errors: [],
    totalProcessed: 0
  }

  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    // Find sessions to delete
    const sessionsToDelete = await prisma.uploadSessions.findMany({
      where: {
        OR: [
          {
            status: 'completed',
            completedAt: {
              lt: cutoffDate
            }
          },
          {
            status: 'failed',
            updatedAt: {
              lt: cutoffDate
            }
          },
          {
            status: 'cancelled',
            updatedAt: {
              lt: cutoffDate
            }
          }
        ]
      }
    })

    result.totalProcessed = sessionsToDelete.length

    // Delete old sessions (this will cascade to session_files due to foreign key constraints)
    const deleteResult = await prisma.uploadSessions.deleteMany({
      where: {
        id: {
          in: sessionsToDelete.map(s => s.id)
        }
      }
    })

    result.deletedRecords = deleteResult.count
  } catch (error) {
    result.errors.push(`Failed to cleanup old sessions: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  return result
}

/**
 * Cleans up completed transcription jobs older than specified days
 */
export async function cleanupCompletedJobs(
  prisma: PrismaClient,
  daysOld: number = 7,
  preserveRecentJobs: number = 100
): Promise<CleanupResult> {
  const result: CleanupResult = {
    deletedRecords: 0,
    orphanedFiles: [],
    errors: [],
    totalProcessed: 0
  }

  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    // Get jobs to potentially delete (completed and old)
    const jobsToConsider = await prisma.transcriptionJobs.findMany({
      where: {
        status: 'completed',
        completedAt: {
          lt: cutoffDate
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    })

    result.totalProcessed = jobsToConsider.length

    // Keep the most recent N jobs, delete the rest
    if (jobsToConsider.length > preserveRecentJobs) {
      const jobsToDelete = jobsToConsider.slice(preserveRecentJobs)
      
      // Delete output files first
      for (const job of jobsToDelete) {
        if (job.outputFilePath) {
          try {
            await fs.unlink(job.outputFilePath)
          } catch {
            // File might not exist, which is fine
          }
        }
      }

      // Delete database records
      const deleteResult = await prisma.transcriptionJobs.deleteMany({
        where: {
          id: {
            in: jobsToDelete.map(j => j.id)
          }
        }
      })

      result.deletedRecords = deleteResult.count
    }
  } catch (error) {
    result.errors.push(`Failed to cleanup completed jobs: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  return result
}

/**
 * Cleans up temporary files in the system temp directory
 */
export async function cleanupTempFiles(tempDir: string = '/tmp'): Promise<CleanupResult> {
  const result: CleanupResult = {
    deletedRecords: 0,
    orphanedFiles: [],
    errors: [],
    totalProcessed: 0
  }

  try {
    const cutoffTime = Date.now() - (2 * 60 * 60 * 1000) // 2 hours ago

    const entries = await fs.readdir(tempDir)
    const tempFiles = entries.filter(entry => 
      entry.startsWith('upload_') || 
      entry.startsWith('parakeet_') ||
      entry.includes('transcribe')
    )

    result.totalProcessed = tempFiles.length

    for (const file of tempFiles) {
      try {
        const filePath = path.join(tempDir, file)
        const stats = await fs.stat(filePath)
        
        if (stats.mtime.getTime() < cutoffTime) {
          await fs.unlink(filePath)
          result.deletedRecords++
        }
      } catch (error) {
        result.errors.push(`Failed to cleanup temp file ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  } catch (error) {
    result.errors.push(`Failed to access temp directory: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  return result
}

/**
 * Performs vacuum operation on SQLite database
 */
export async function vacuumDatabase(prisma: PrismaClient): Promise<void> {
  try {
    await prisma.$executeRaw`VACUUM;`
  } catch (error) {
    throw new Error(`Database vacuum failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Analyzes database for optimization opportunities
 */
export async function analyzeDatabaseStats(prisma: PrismaClient): Promise<{
  tables: Record<string, { rowCount: number; estimatedSize: string }>
  indexUsage: string[]
  recommendations: string[]
}> {
  const stats = {
    tables: {} as Record<string, { rowCount: number; estimatedSize: string }>,
    indexUsage: [] as string[],
    recommendations: [] as string[]
  }

  try {
    // Get row counts for all tables
    const uploadedFilesCount = await prisma.uploadedFiles.count()
    const transcriptionJobsCount = await prisma.transcriptionJobs.count()
    const uploadSessionsCount = await prisma.uploadSessions.count()
    const fileMetadataCount = await prisma.fileMetadata.count()
    const sessionFilesCount = await prisma.sessionFiles.count()

    stats.tables = {
      'uploaded_files': { 
        rowCount: uploadedFilesCount,
        estimatedSize: `~${Math.round(uploadedFilesCount * 0.5)} KB`
      },
      'transcription_jobs': { 
        rowCount: transcriptionJobsCount,
        estimatedSize: `~${Math.round(transcriptionJobsCount * 1.2)} KB`
      },
      'upload_sessions': { 
        rowCount: uploadSessionsCount,
        estimatedSize: `~${Math.round(uploadSessionsCount * 0.3)} KB`
      },
      'file_metadata': { 
        rowCount: fileMetadataCount,
        estimatedSize: `~${Math.round(fileMetadataCount * 0.8)} KB`
      },
      'session_files': { 
        rowCount: sessionFilesCount,
        estimatedSize: `~${Math.round(sessionFilesCount * 0.2)} KB`
      }
    }

    // Generate recommendations based on data
    if (transcriptionJobsCount > 1000) {
      stats.recommendations.push('Consider archiving old transcription jobs to improve performance')
    }

    if (uploadSessionsCount > 500) {
      stats.recommendations.push('Regular cleanup of old upload sessions recommended')
    }

    if (uploadedFilesCount > 5000) {
      stats.recommendations.push('Consider implementing file archiving strategy for better performance')
    }

    stats.indexUsage.push('Database indexes are defined for optimal query performance')
    
  } catch (error) {
    stats.recommendations.push(`Failed to analyze database: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  return stats
}

/**
 * Performs comprehensive database maintenance
 */
export async function performMaintenanceTask(
  prisma: PrismaClient,
  options: {
    cleanupOrphanedFiles?: boolean
    cleanupOldSessions?: boolean
    cleanupCompletedJobs?: boolean
    cleanupTempFiles?: boolean
    vacuumDatabase?: boolean
    sessionCleanupDays?: number
    jobCleanupDays?: number
    uploadsPath?: string
  } = {}
): Promise<MaintenanceReport> {
  const {
    cleanupOrphanedFiles = true,
    cleanupOldSessions = true,
    cleanupCompletedJobs = true,
    cleanupTempFiles = true,
    vacuumDatabase = true,
    sessionCleanupDays = 30,
    jobCleanupDays = 7,
    uploadsPath = './uploads'
  } = options

  const report: MaintenanceReport = {
    timestamp: new Date(),
    orphanedFiles: { deletedRecords: 0, orphanedFiles: [], errors: [], totalProcessed: 0 },
    oldSessions: { deletedRecords: 0, orphanedFiles: [], errors: [], totalProcessed: 0 },
    completedJobs: { deletedRecords: 0, orphanedFiles: [], errors: [], totalProcessed: 0 },
    databaseSize: 0,
    storageSize: 0,
    recommendations: []
  }

  try {
    // Cleanup orphaned files
    if (cleanupOrphanedFiles) {
      report.orphanedFiles = await cleanupOrphanedFiles(prisma, uploadsPath)
    }

    // Cleanup old sessions
    if (cleanupOldSessions) {
      report.oldSessions = await cleanupOldSessions(prisma, sessionCleanupDays)
    }

    // Cleanup completed jobs
    if (cleanupCompletedJobs) {
      report.completedJobs = await cleanupCompletedJobs(prisma, jobCleanupDays)
    }

    // Cleanup temp files
    if (cleanupTempFiles) {
      await cleanupTempFiles()
    }

    // Vacuum database
    if (vacuumDatabase) {
      await vacuumDatabase(prisma)
    }

    // Get database statistics
    const dbStats = await analyzeDatabaseStats(prisma)
    report.recommendations = dbStats.recommendations

    // Calculate total cleanup impact
    const totalDeleted = report.orphanedFiles.deletedRecords + 
                        report.oldSessions.deletedRecords + 
                        report.completedJobs.deletedRecords

    if (totalDeleted > 0) {
      report.recommendations.push(`Successfully cleaned up ${totalDeleted} database records`)
    }

    // Add storage usage recommendations
    if (report.storageSize > 5 * 1024 * 1024 * 1024) { // 5GB
      report.recommendations.push('Storage usage is high - consider implementing file archiving')
    }

  } catch (error) {
    report.recommendations.push(`Maintenance task error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  return report
}

/**
 * Schedules regular maintenance tasks
 */
export function createMaintenanceSchedule(
  prisma: PrismaClient,
  intervalHours: number = 24
): NodeJS.Timeout {
  const intervalMs = intervalHours * 60 * 60 * 1000

  return setInterval(async () => {
    try {
      const report = await performMaintenanceTask(prisma)
      console.log('Scheduled maintenance completed:', {
        timestamp: report.timestamp,
        orphanedFilesCleanup: report.orphanedFiles.deletedRecords,
        sessionsCleanup: report.oldSessions.deletedRecords,
        jobsCleanup: report.completedJobs.deletedRecords,
        recommendations: report.recommendations.length
      })
    } catch (error) {
      console.error('Scheduled maintenance failed:', error)
    }
  }, intervalMs)
}

/**
 * Validates database integrity
 */
export async function validateDatabaseIntegrity(prisma: PrismaClient): Promise<{
  isValid: boolean
  issues: string[]
  warnings: string[]
}> {
  const result = {
    isValid: true,
    issues: [] as string[],
    warnings: [] as string[]
  }

  try {
    // Check for files without metadata
    const filesWithoutMetadata = await prisma.uploadedFiles.findMany({
      where: {
        fileMetadata: {
          none: {}
        },
        status: {
          in: ['converted', 'ready_for_transcription']
        }
      }
    })

    if (filesWithoutMetadata.length > 0) {
      result.warnings.push(`${filesWithoutMetadata.length} files are missing metadata`)
    }

    // Check for jobs without files
    const jobsWithoutFiles = await prisma.transcriptionJobs.findMany({
      where: {
        uploadedFile: null
      }
    })

    if (jobsWithoutFiles.length > 0) {
      result.issues.push(`${jobsWithoutFiles.length} transcription jobs reference non-existent files`)
      result.isValid = false
    }

    // Check for sessions without files
    const sessionsWithoutFiles = await prisma.uploadSessions.findMany({
      where: {
        sessionFiles: {
          none: {}
        }
      }
    })

    if (sessionsWithoutFiles.length > 0) {
      result.warnings.push(`${sessionsWithoutFiles.length} upload sessions have no associated files`)
    }

    // Check for inconsistent session counts
    const sessionsWithInconsistentCounts = await prisma.uploadSessions.findMany({
      include: {
        sessionFiles: true
      }
    })

    for (const session of sessionsWithInconsistentCounts) {
      const actualFileCount = session.sessionFiles.length
      if (session.totalFiles !== actualFileCount) {
        result.warnings.push(`Session ${session.id} reports ${session.totalFiles} files but has ${actualFileCount}`)
      }
    }

  } catch (error) {
    result.issues.push(`Integrity check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    result.isValid = false
  }

  return result
}