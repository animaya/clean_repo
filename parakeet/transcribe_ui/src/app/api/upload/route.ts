import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Add global type for Prisma
declare global {
  var __prisma: PrismaClient | undefined
}
import path from 'path'
import fs from 'fs/promises'
import { validateUploadRequest, validateFileContent, generateFileHash, generateUniqueFilename } from '../../../lib/middleware/validation'
import { validateRateLimit } from '../../../lib/middleware/rate-limiting'
import { createErrorResponse, createSuccessResponse, withErrorHandler, ValidationError, RateLimitError, StorageError } from '../../../lib/error-handling'
import { createOrGetSession, updateSessionWithFiles, markFileCompleted, markFileFailed } from '../../../lib/session-management'
import { UploadedFileInfo, UploadResponse } from '../../../types/api'
import { transitionFileStatus } from '../../../lib/services/state-machine'
import { AuditService, extractAuditContext } from '../../../lib/services/audit-service'

// Use global Prisma instance or create new one
const prisma = globalThis.__prisma || new PrismaClient()
if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma
}

// Configuration
const UPLOADS_DIR = process.env.UPLOADS_DIR || '/tmp/uploads'
const MAX_REQUEST_SIZE = 300 * 1024 * 1024 // 300MB

/**
 * POST /api/upload
 * Handles multipart file uploads with validation and storage
 */
export const POST = withErrorHandler(async (request: NextRequest) => {
  // Parse form data once and use it throughout
  const formData = await request.formData()
  const sessionId = formData.get('sessionId')?.toString()
  
  // Extract audit context for logging with session-based user tracking
  const auditContext = extractAuditContext(request, sessionId)
  
  // Rate limiting check
  const rateLimitResult = await validateRateLimit(request, 'upload')
  if (!rateLimitResult.allowed) {
    throw new RateLimitError(
      'Upload rate limit exceeded',
      rateLimitResult.retryAfter!,
      rateLimitResult.limit,
      rateLimitResult.remaining
    )
  }

  // Extract files and options
  const files: File[] = []
  const fileEntries = formData.getAll('files')
  
  for (const entry of fileEntries) {
    if (entry instanceof File) {
      files.push(entry)
    }
  }

  if (files.length === 0) {
    throw new ValidationError('No files provided for upload')
  }

  const convertFormat = formData.get('convertFormat')?.toString() || 'wav'
  const outputQuality = formData.get('outputQuality')?.toString() || 'medium'

  // Validate files
  let validationResult
  try {
    validationResult = validateUploadRequest(files)
  } catch (error) {
    throw new ValidationError(`File validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  
  if (!validationResult.isValid) {
    return createErrorResponse('VALIDATION_ERROR', 400, {
      invalidFiles: validationResult.invalidFiles,
      errors: validationResult.errors
    })
  }

  // Ensure uploads directory exists
  await ensureUploadsDirectory()

  // Create or get upload session
  const session = await createOrGetSession(sessionId, auditContext)

  const uploadedFiles: UploadedFileInfo[] = []
  const fileIds: number[] = []
  const fileSizes: number[] = []

  try {
    // Process each valid file
    for (const validFile of validationResult.validFiles) {
      const processedFile = await processUploadedFile(validFile, convertFormat, outputQuality, auditContext)
      uploadedFiles.push(processedFile)
      fileIds.push(parseInt(processedFile.id))
      fileSizes.push(processedFile.fileSize)
    }

    // Update session with uploaded files
    await updateSessionWithFiles(session.sessionUuid, fileIds, fileSizes)

    // Mark all files as completed
    for (let i = 0; i < uploadedFiles.length; i++) {
      await markFileCompleted(session.sessionUuid, fileIds[i], fileSizes[i])
    }

    const response: UploadResponse = {
      success: true,
      sessionId: session.sessionUuid,
      uploads: uploadedFiles
    }

    return createSuccessResponse(response, 200, rateLimitResult.headers)

  } catch (error) {
    // Mark files as failed if error occurred during processing
    for (const fileId of fileIds) {
      try {
        await markFileFailed(session.sessionUuid, fileId)
      } catch (e) {
        console.error('Error marking file as failed:', e)
      }
    }
    throw error
  }
})

/**
 * Processes a single uploaded file
 */
async function processUploadedFile(
  validFile: any,
  convertFormat: string,
  outputQuality: string,
  auditContext: ReturnType<typeof extractAuditContext>
): Promise<UploadedFileInfo> {
  const { file, filename, originalName, size, format, mimeType } = validFile

  // Validate file content against MIME type
  const contentValidation = await validateFileContent(file)
  if (!contentValidation.isValid) {
    throw new ValidationError(`File content validation failed: ${contentValidation.error}`)
  }

  // Generate unique filename to prevent conflicts
  const uniqueFilename = generateUniqueFilename(filename)
  const filePath = path.join(UPLOADS_DIR, uniqueFilename)

  // Generate file hash for deduplication
  const fileHash = await generateFileHash(file)

  // Check for duplicate files
  const existingFile = await prisma.uploadedFiles.findFirst({
    where: { checksum: fileHash }
  })

  if (existingFile) {
    // File already exists, return existing file info
    return {
      id: existingFile.id.toString(),
      filename: existingFile.filename,
      originalName: existingFile.originalFilename,
      fileSize: existingFile.fileSize,
      duration: 0, // Would need to extract from metadata
      mimeType: `audio/${existingFile.originalFormat}`,
      status: existingFile.status.toLowerCase() as any,
      uploadedAt: existingFile.uploadDate.toISOString()
    }
  }

  try {
    // Save file to disk
    const buffer = await file.arrayBuffer()
    await fs.writeFile(filePath, new Uint8Array(buffer))

    // Save file record to database with initial status
    const fileData = {
      filename: uniqueFilename,
      originalFilename: originalName,
      originalFormat: format,
      fileSize: size,
      filePath: filePath,
      uploadMethod: 'DRAG_DROP',
      mimeType: mimeType,
      status: 'UPLOADED',
      checksum: fileHash,
      uploadDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const uploadedFile = await prisma.uploadedFiles.create({
      data: fileData
    })

    // Log file creation in audit trail
    await AuditService.logFileUpload(
      uploadedFile.id,
      {
        ...fileData,
        id: uploadedFile.id
      },
      auditContext
    )

    return {
      id: uploadedFile.id.toString(),
      filename: uniqueFilename,
      originalName: originalName,
      fileSize: size,
      duration: 0, // Would extract from metadata in real implementation
      mimeType: mimeType,
      status: uploadedFile.status.toLowerCase() as any,
      uploadedAt: uploadedFile.uploadDate.toISOString()
    }

  } catch (error) {
    // Clean up file if database operation fails
    try {
      await fs.unlink(filePath)
    } catch (e) {
      console.error('Failed to clean up file after error:', e)
    }

    if (error instanceof Error && error.message.includes('ENOSPC')) {
      throw new StorageError('Insufficient disk space', 'write', filePath)
    }

    throw new StorageError(`Failed to store file: ${error instanceof Error ? error.message : 'Unknown error'}`, 'write', filePath)
  }
}

/**
 * Ensures the uploads directory exists
 */
async function ensureUploadsDirectory(): Promise<void> {
  try {
    await fs.access(UPLOADS_DIR)
  } catch (error) {
    try {
      await fs.mkdir(UPLOADS_DIR, { recursive: true })
    } catch (mkdirError) {
      throw new StorageError(`Failed to create uploads directory: ${UPLOADS_DIR}`, 'mkdir', UPLOADS_DIR)
    }
  }
}