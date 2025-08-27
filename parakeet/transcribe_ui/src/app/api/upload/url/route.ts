import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs/promises'
import { validateUrlRequest, extractFilenameFromUrl, sanitizeUrlForLogging } from '../../../../lib/middleware/url-validation'
import { validateRateLimit } from '../../../../lib/middleware/rate-limiting'
import { createErrorResponse, createSuccessResponse, withErrorHandler, ValidationError, RateLimitError, StorageError } from '../../../../lib/error-handling'
import { createOrGetSession, updateSessionWithFiles } from '../../../../lib/session-management'
import { generateUniqueFilename } from '../../../../lib/middleware/validation'
import { UrlImportResponse, UrlImportInfo } from '../../../../types/api'
import crypto from 'crypto'

// Use global Prisma instance or create new one
const prisma = globalThis.__prisma || new PrismaClient()
if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma
}

// Configuration
const UPLOADS_DIR = process.env.UPLOADS_DIR || '/tmp/uploads'
const DOWNLOAD_TIMEOUT = 30000 // 30 seconds
const MAX_DOWNLOAD_SIZE = 300 * 1024 * 1024 // 300MB

interface UrlDownloadRequest {
  urls: string[]
  sessionId?: string
  convertFormat?: string
  outputQuality?: string
}

/**
 * POST /api/upload/url
 * Downloads audio files from remote URLs and imports them
 */
export const POST = withErrorHandler(async (request: NextRequest) => {
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

  // Parse request body
  let requestBody: UrlDownloadRequest
  try {
    requestBody = await request.json()
  } catch (error) {
    throw new ValidationError('Invalid JSON in request body')
  }

  const { urls, sessionId, convertFormat = 'wav', outputQuality = 'medium' } = requestBody

  if (!urls || !Array.isArray(urls)) {
    throw new ValidationError('URLs must be provided as an array')
  }

  // Validate URLs
  const validationResult = validateUrlRequest(urls)
  if (!validationResult.isValid) {
    return createErrorResponse('VALIDATION_ERROR', 400, {
      invalidUrls: validationResult.invalidUrls,
      errors: validationResult.errors
    })
  }

  // Ensure uploads directory exists
  await ensureUploadsDirectory()

  // Create or get upload session
  const session = await createOrGetSession(sessionId)

  const imports: UrlImportInfo[] = []

  // Process each URL (start downloads concurrently but track individually)
  const downloadPromises = validationResult.validUrls.map(async (validatedUrl) => {
    try {
      const importInfo = await processUrlDownload(validatedUrl, convertFormat, outputQuality, session.sessionUuid)
      return importInfo
    } catch (error) {
      console.error(`Error downloading ${validatedUrl.url}:`, error)
      return {
        url: validatedUrl.url,
        status: 'failed' as const,
        error: error instanceof Error ? error.message : 'Download failed'
      }
    }
  })

  // Wait for all downloads to complete or fail
  const results = await Promise.allSettled(downloadPromises)
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      imports.push(result.value)
    } else {
      imports.push({
        url: validationResult.validUrls[index].url,
        status: 'failed',
        error: result.reason?.message || 'Unknown error'
      })
    }
  })

  const response: UrlImportResponse = {
    success: true,
    sessionId: session.sessionUuid,
    imports
  }

  return createSuccessResponse(response, 200, rateLimitResult.headers)
})

/**
 * Downloads and processes a single URL
 */
async function processUrlDownload(
  validatedUrl: any,
  convertFormat: string,
  outputQuality: string,
  sessionUuid: string
): Promise<UrlImportInfo> {
  const { url, filename: extractedFilename } = validatedUrl

  try {
    // Start download
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Parakeet Audio Transcription Service/1.0',
        'Accept': 'audio/*,*/*;q=0.9'
      },
      signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    // Check content type
    const contentType = response.headers.get('Content-Type') || ''
    if (!contentType.startsWith('audio/') && !contentType.includes('ogg') && !isLikelyAudioContent(contentType, extractedFilename)) {
      throw new Error(`Content-Type is not audio: ${contentType}`)
    }

    // Check content length
    const contentLength = response.headers.get('Content-Length')
    if (contentLength && parseInt(contentLength) > MAX_DOWNLOAD_SIZE) {
      throw new Error(`File too large: ${contentLength} bytes exceeds ${MAX_DOWNLOAD_SIZE} bytes`)
    }

    // Generate unique filename
    const sanitizedFilename = extractFilenameFromUrl(url)
    const uniqueFilename = generateUniqueFilename(sanitizedFilename)
    const filePath = path.join(UPLOADS_DIR, uniqueFilename)

    // Download file
    const buffer = await response.arrayBuffer()
    
    // Validate downloaded size
    if (buffer.byteLength > MAX_DOWNLOAD_SIZE) {
      throw new Error(`Downloaded file too large: ${buffer.byteLength} bytes`)
    }

    if (buffer.byteLength === 0) {
      throw new Error('Downloaded file is empty')
    }

    // Generate file hash for deduplication
    const fileHash = crypto.createHash('sha256')
      .update(new Uint8Array(buffer))
      .digest('hex')

    // Check for duplicate files
    const existingFile = await prisma.uploadedFiles.findFirst({
      where: { checksum: fileHash }
    })

    if (existingFile) {
      return {
        url,
        status: 'completed',
        fileId: existingFile.id.toString(),
        filename: existingFile.filename
      }
    }

    // Save file to disk
    await fs.writeFile(filePath, new Uint8Array(buffer))

    // Determine file format from extension or content-type
    const fileExtension = path.extname(extractedFilename).toLowerCase().slice(1) || 'mp3'
    
    // Save file record to database
    const uploadedFile = await prisma.uploadedFiles.create({
      data: {
        filename: uniqueFilename,
        originalFilename: extractedFilename,
        originalFormat: fileExtension,
        fileSize: buffer.byteLength,
        filePath: filePath,
        uploadMethod: 'url_download',
        sourceUrl: sanitizeUrlForLogging(url),
        status: 'uploaded',
        checksum: fileHash,
        uploadDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Update session
    await updateSessionWithFiles(sessionUuid, [uploadedFile.id], [buffer.byteLength])

    return {
      url,
      status: 'completed',
      fileId: uploadedFile.id.toString(),
      filename: uniqueFilename
    }

  } catch (error) {
    console.error(`Error processing URL ${url}:`, error)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        throw new Error('Download timed out')
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Network error during download')
      }
      throw error
    }
    
    throw new Error('Unknown error during download')
  }
}

/**
 * Determines if content is likely audio based on content-type or filename
 */
function isLikelyAudioContent(contentType: string, filename: string): boolean {
  // Check if content-type suggests binary content that might be audio
  const binaryTypes = [
    'application/octet-stream',
    'binary/octet-stream',
    'application/binary'
  ]
  
  if (binaryTypes.includes(contentType.toLowerCase())) {
    // Check filename extension
    const audioExtensions = ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.wma']
    return audioExtensions.some(ext => filename.toLowerCase().endsWith(ext))
  }
  
  return false
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