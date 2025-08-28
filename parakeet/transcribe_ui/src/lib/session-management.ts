import { PrismaClient, SessionStatus } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { AuditService, AuditContext } from './services/audit-service'

// Use global Prisma instance or create new one
const prisma = globalThis.__prisma || new PrismaClient()
if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma
}

export interface UploadSession {
  id: number
  sessionUuid: string
  totalFiles: number
  completedFiles: number
  failedFiles: number
  totalSizeBytes: number
  processedSizeBytes: number
  status: SessionStatus
  createdAt: Date
  completedAt?: Date
  updatedAt: Date
}

// Note: SessionStatus is imported from Prisma

export interface SessionFile {
  sessionId: number
  fileId: number
  orderIndex: number
}

/**
 * Creates a new upload session or retrieves existing one
 */
export async function createOrGetSession(sessionId?: string, auditContext?: AuditContext): Promise<UploadSession> {
  if (sessionId) {
    // Try to get existing session
    const existing = await prisma.uploadSessions.findUnique({
      where: { sessionUuid: sessionId }
    })
    
    if (existing) {
      return existing as UploadSession
    }
  }

  // Create new session
  const newSessionId = sessionId || generateSessionId()
  const sessionData = {
    sessionUuid: newSessionId,
    totalFiles: 0,
    completedFiles: 0,
    failedFiles: 0,
    totalSizeBytes: 0,
    processedSizeBytes: 0,
    status: 'ACTIVE' as const
  }

  const session = await prisma.uploadSessions.create({
    data: sessionData
  })

  // Log session creation in audit trail
  if (auditContext) {
    await AuditService.logSessionCreation(
      session.id,
      {
        ...sessionData,
        id: session.id
      },
      auditContext
    )
  }

  return session as UploadSession
}

/**
 * Updates session with file information
 */
export async function updateSessionWithFiles(
  sessionUuid: string, 
  fileIds: number[], 
  fileSizes: number[]
): Promise<void> {
  const session = await prisma.uploadSessions.findUnique({
    where: { sessionUuid }
  })

  if (!session) {
    throw new Error(`Session not found: ${sessionUuid}`)
  }

  const totalSize = fileSizes.reduce((sum, size) => sum + size, 0)

  // Update session totals
  await prisma.uploadSessions.update({
    where: { sessionUuid },
    data: {
      totalFiles: session.totalFiles + fileIds.length,
      totalSizeBytes: session.totalSizeBytes + totalSize,
      updatedAt: new Date()
    }
  })

  // Create session file associations
  const sessionFiles = fileIds.map((fileId, index) => ({
    sessionId: session.id,
    fileId: fileId,
    orderIndex: session.totalFiles + index
  }))

  await prisma.sessionFiles.createMany({
    data: sessionFiles
  })
}

/**
 * Marks a file as completed in the session
 */
export async function markFileCompleted(sessionUuid: string, fileId: number, fileSize: number): Promise<void> {
  const session = await prisma.uploadSessions.findUnique({
    where: { sessionUuid }
  })

  if (!session) {
    throw new Error(`Session not found: ${sessionUuid}`)
  }

  await prisma.uploadSessions.update({
    where: { sessionUuid },
    data: {
      completedFiles: session.completedFiles + 1,
      processedSizeBytes: session.processedSizeBytes + fileSize,
      updatedAt: new Date()
    }
  })

  // Check if session should be marked as completed
  const updatedSession = await prisma.uploadSessions.findUnique({
    where: { sessionUuid }
  })

  if (updatedSession && updatedSession.completedFiles + updatedSession.failedFiles >= updatedSession.totalFiles) {
    const finalStatus = updatedSession.failedFiles > 0 ? 'FAILED' : 'COMPLETED'
    await prisma.uploadSessions.update({
      where: { sessionUuid },
      data: {
        status: finalStatus,
        completedAt: new Date(),
        updatedAt: new Date()
      }
    })
  }
}

/**
 * Marks a file as failed in the session
 */
export async function markFileFailed(sessionUuid: string, fileId: number): Promise<void> {
  const session = await prisma.uploadSessions.findUnique({
    where: { sessionUuid }
  })

  if (!session) {
    throw new Error(`Session not found: ${sessionUuid}`)
  }

  await prisma.uploadSessions.update({
    where: { sessionUuid },
    data: {
      failedFiles: session.failedFiles + 1,
      updatedAt: new Date()
    }
  })

  // Check if session should be marked as completed/failed
  const updatedSession = await prisma.uploadSessions.findUnique({
    where: { sessionUuid }
  })

  if (updatedSession && updatedSession.completedFiles + updatedSession.failedFiles >= updatedSession.totalFiles) {
    const finalStatus = updatedSession.failedFiles > 0 ? 'FAILED' : 'COMPLETED'
    await prisma.uploadSessions.update({
      where: { sessionUuid },
      data: {
        status: finalStatus,
        completedAt: new Date(),
        updatedAt: new Date()
      }
    })
  }
}

/**
 * Gets session details with file information
 */
export async function getSessionDetails(sessionUuid: string): Promise<UploadSession & { files: any[] } | null> {
  const session = await prisma.uploadSessions.findUnique({
    where: { sessionUuid },
    include: {
      sessionFiles: {
        include: {
          uploadedFile: true
        },
        orderBy: {
          orderIndex: 'asc'
        }
      }
    }
  })

  if (!session) {
    return null
  }

  return {
    ...session,
    files: session.sessionFiles.map(sf => sf.uploadedFile)
  } as any
}

/**
 * Gets session progress information
 */
export async function getSessionProgress(sessionUuid: string): Promise<{
  totalFiles: number
  completedFiles: number
  failedFiles: number
  progressPercentage: number
  totalSizeBytes: number
  processedSizeBytes: number
  status: SessionStatus
} | null> {
  const session = await prisma.uploadSessions.findUnique({
    where: { sessionUuid }
  })

  if (!session) {
    return null
  }

  const progressPercentage = session.totalFiles > 0 
    ? Math.round(((session.completedFiles + session.failedFiles) / session.totalFiles) * 100)
    : 0

  return {
    totalFiles: session.totalFiles,
    completedFiles: session.completedFiles,
    failedFiles: session.failedFiles,
    progressPercentage,
    totalSizeBytes: session.totalSizeBytes,
    processedSizeBytes: session.processedSizeBytes,
    status: session.status as SessionStatus
  }
}

/**
 * Cancels an active session
 */
export async function cancelSession(sessionUuid: string): Promise<void> {
  await prisma.uploadSessions.update({
    where: { sessionUuid },
    data: {
      status: 'cancelled',
      completedAt: new Date(),
      updatedAt: new Date()
    }
  })
}

/**
 * Cleans up old completed sessions (for maintenance)
 */
export async function cleanupOldSessions(daysOld: number = 7): Promise<number> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysOld)

  const result = await prisma.uploadSessions.deleteMany({
    where: {
      status: { in: ['COMPLETED', 'FAILED', 'CANCELLED'] },
      completedAt: {
        lt: cutoffDate
      }
    }
  })

  return result.count
}

/**
 * Generates a unique session ID
 */
function generateSessionId(): string {
  return `sess_${uuidv4().replace(/-/g, '')}`
}

/**
 * Validates session ID format
 */
export function validateSessionId(sessionId: string): boolean {
  if (!sessionId || typeof sessionId !== 'string') {
    return false
  }

  // Check format: sess_ followed by 32 hex characters
  const sessionIdPattern = /^sess_[a-f0-9]{32}$/
  return sessionIdPattern.test(sessionId)
}

/**
 * Lists active sessions (for admin/debugging)
 */
export async function getActiveSessions(limit: number = 50): Promise<UploadSession[]> {
  const sessions = await prisma.uploadSessions.findMany({
    where: {
      status: 'ACTIVE'
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit
  })

  return sessions as UploadSession[]
}