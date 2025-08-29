import { fileTypeFromBuffer } from 'file-type'
import path from 'path'
import crypto from 'crypto'
import { 
  FILE_SIZE_LIMITS, 
  FILENAME_CONSTRAINTS,
  SUPPORTED_EXTENSIONS, 
  SUPPORTED_MIME_TYPES, 
  SUPPORTED_AUDIO_FORMATS, 
  SUPPORTED_VIDEO_FORMATS,
  SECURITY_PATTERNS,
  FileValidationResult,
  ValidatedFile,
  InvalidFile,
  isExtensionSupported,
  isMimeTypeSupported,
  getExtensionFromFilename
} from '../../types/validation-config'

export interface SanitizedFile {
  filename: string
  originalFilename: string
  safePath: string
}

// Re-export types for backwards compatibility
export type { FileValidationResult, ValidatedFile, InvalidFile }
export type SupportedAudioFormat = typeof SUPPORTED_AUDIO_FORMATS[number]
export type SupportedVideoFormat = typeof SUPPORTED_VIDEO_FORMATS[number]

/**
 * Validates uploaded files for audio upload API
 */
export function validateUploadRequest(files: File[]): FileValidationResult {
  const result: FileValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    validFiles: [],
    invalidFiles: []
  }

  if (!files || files.length === 0) {
    result.errors.push('No files provided for upload')
    result.isValid = false
    return result
  }

  if (files.length > FILE_SIZE_LIMITS.MAX_FILES_PER_REQUEST) {
    result.errors.push(`Too many files (${files.length}). Maximum ${FILE_SIZE_LIMITS.MAX_FILES_PER_REQUEST} files allowed per request`)
    result.isValid = false
    return result
  }

  for (const file of files) {
    const fileResult = validateSingleFile(file)
    
    if (fileResult.isValid) {
      result.validFiles.push({
        file,
        filename: sanitizeFilename(file.name),
        originalFilename: file.name, // Use consistent field name
        size: file.size,
        format: getFileExtension(file.name),
        mimeType: file.type
      })
    } else {
      result.invalidFiles.push({
        filename: file.name,
        reason: fileResult.errors.join(', '),
        size: file.size
      })
      result.errors.push(...fileResult.errors)
      result.isValid = false
    }

    result.warnings.push(...fileResult.warnings)
  }

  return result
}

/**
 * Validates a single file
 */
function validateSingleFile(file: File): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  // Check filename
  if (!file.name || file.name.trim() === '') {
    errors.push('Invalid filename: filename cannot be empty')
  }

  // Check filename length
  if (file.name.length > FILENAME_CONSTRAINTS.MAX_FILENAME_LENGTH) {
    errors.push(`Filename too long: ${file.name} (${file.name.length} > ${FILENAME_CONSTRAINTS.MAX_FILENAME_LENGTH} characters)`)
  }

  // Check for path traversal attempts
  for (const pattern of SECURITY_PATTERNS.PATH_TRAVERSAL_PATTERNS) {
    if (pattern.test(file.name)) {
      warnings.push(`Potentially dangerous filename: ${file.name}`)
      break
    }
  }

  // Check for forbidden characters
  if (SECURITY_PATTERNS.FORBIDDEN_FILENAME_CHARS.test(file.name)) {
    warnings.push(`Filename contains forbidden characters: ${file.name}`)
  }

  // Check for Windows reserved names
  const nameWithoutExt = path.parse(file.name).name
  if (SECURITY_PATTERNS.WINDOWS_RESERVED_NAMES.test(nameWithoutExt)) {
    warnings.push(`Filename uses Windows reserved name: ${file.name}`)
  }

  // Check for dangerous extensions
  const hasDangerousExtension = SECURITY_PATTERNS.DANGEROUS_EXTENSIONS.some(ext => 
    file.name.toLowerCase().includes(ext.toLowerCase())
  )
  if (hasDangerousExtension) {
    errors.push(`Dangerous file extension detected: ${file.name}`)
  }

  // Check file size
  if (file.size === 0) {
    errors.push(`File is empty: ${file.name}`)
  } else if (file.size > FILE_SIZE_LIMITS.MAX_FILE_SIZE) {
    errors.push(`File too large: ${file.name} (${file.size} bytes > ${FILE_SIZE_LIMITS.MAX_FILE_SIZE} bytes)`)
  }

  // Check file format by extension
  const extension = getExtensionFromFilename(file.name)
  if (extension && !isExtensionSupported(extension)) {
    errors.push(`Unsupported file format: ${file.name}. Supported formats: ${SUPPORTED_EXTENSIONS.join(', ')}`)
  } else if (!extension) {
    warnings.push(`File has no extension: ${file.name}`)
  }

  // Check MIME type
  if (!isMimeTypeSupported(file.type)) {
    if (file.type === '') {
      warnings.push(`No MIME type provided for: ${file.name}`)
    } else if (file.type === 'application/octet-stream') {
      // Allow octet-stream only if extension is supported
      if (extension && isExtensionSupported(extension)) {
        warnings.push(`Generic MIME type detected but extension is supported: ${file.name}`)
      } else {
        errors.push(`Unsupported file: ${file.name} (generic binary with unsupported extension)`)
      }
    } else {
      errors.push(`Unsupported MIME type: ${file.type} for file ${file.name}`)
    }
  }

  // Check for MIME type vs extension mismatch
  const expectedMimeTypes = getMimeTypesForExtension(extension)
  if (expectedMimeTypes.length > 0 && !expectedMimeTypes.includes(file.type)) {
    warnings.push(`MIME type mismatch: ${file.name} has type ${file.type} but extension suggests audio`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validates file content against its claimed type using magic bytes
 */
export async function validateFileContent(file: File): Promise<{ isValid: boolean; detectedType?: string; error?: string }> {
  try {
    const buffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)
    
    // Use file-type to detect actual file type
    const detectedType = await fileTypeFromBuffer(uint8Array)
    
    if (!detectedType) {
      return { isValid: false, error: 'Could not detect file type from content' }
    }

    // Check if detected type matches expected audio or video formats
    const isAudioFile = detectedType.mime.startsWith('audio/')
    const isVideoFile = detectedType.mime.startsWith('video/')
    const isValidFile = isAudioFile || isVideoFile
    
    return {
      isValid: isValidFile,
      detectedType: detectedType.mime,
      error: isValidFile ? undefined : `File content is ${detectedType.mime}, not an audio or video file`
    }
  } catch (error) {
    return { isValid: false, error: 'Failed to analyze file content' }
  }
}

/**
 * Generates a secure hash for file content
 */
export async function generateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const hash = crypto.createHash('sha256')
  hash.update(new Uint8Array(buffer))
  return hash.digest('hex')
}

/**
 * Sanitizes filename for safe storage
 */
export function sanitizeFilename(filename: string): string {
  // Remove path components
  const basename = path.basename(filename)
  
  // Replace problematic characters
  let sanitized = basename
    .replace(/[<>:|?*]/g, '_')        // Replace special chars with underscore
    .replace(/["\0\r\n\t]/g, '')      // Remove quotes, nulls, newlines, tabs
    .replace(/\.\./g, '_')            // Replace .. with underscore
    .replace(/^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i, '_reserved_') // Windows reserved names
    .trim()

  // Ensure filename isn't empty after sanitization
  if (!sanitized || sanitized === '.') {
    sanitized = `file_${Date.now()}`
  }

  // Ensure it has an extension
  if (!path.extname(sanitized)) {
    const originalExt = path.extname(filename)
    if (originalExt) {
      sanitized += originalExt
    } else {
      sanitized += '.bin'
    }
  }

  return sanitized
}

/**
 * Generates a unique filename to prevent conflicts
 */
export function generateUniqueFilename(originalFilename: string): string {
  const sanitized = sanitizeFilename(originalFilename)
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const ext = path.extname(sanitized)
  const name = path.basename(sanitized, ext)
  
  return `${name}_${timestamp}_${random}${ext}`
}

/**
 * Gets file extension from filename
 */
function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase().slice(1)
}

/**
 * Gets expected MIME types for a file extension
 */
function getMimeTypesForExtension(extension: string): string[] {
  const mimeMap: Record<string, string[]> = {
    // Audio formats
    'mp3': ['audio/mp3', 'audio/mpeg'],
    'wav': ['audio/wav', 'audio/wave', 'audio/x-wav'],
    'm4a': ['audio/m4a', 'audio/mp4', 'audio/aac'],
    'flac': ['audio/flac'],
    'ogg': ['audio/ogg', 'audio/vorbis'],
    'wma': ['audio/x-ms-wma'],
    // Video formats
    'mp4': ['video/mp4', 'audio/mp4'],
    'avi': ['video/x-msvideo', 'video/avi'],
    'mov': ['video/quicktime'],
    'mkv': ['video/x-matroska'],
    'webm': ['video/webm']
  }
  
  return mimeMap[extension] || []
}