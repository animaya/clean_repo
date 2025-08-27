import { createHash } from 'crypto'

export type FileValidationResult = {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export type SupportedAudioFormat = 'mp3' | 'wav' | 'm4a' | 'flac' | 'ogg'

export type SupportedMimeType = 
  | 'audio/mpeg' 
  | 'audio/wav' 
  | 'audio/wave'
  | 'audio/mp4' 
  | 'audio/flac' 
  | 'audio/ogg'

const SUPPORTED_EXTENSIONS: SupportedAudioFormat[] = ['mp3', 'wav', 'm4a', 'flac', 'ogg']

const SUPPORTED_MIME_TYPES: SupportedMimeType[] = [
  'audio/mpeg',
  'audio/wav',
  'audio/wave',
  'audio/mp4',
  'audio/flac',
  'audio/ogg'
]

const MIME_TYPE_TO_EXTENSION: Record<SupportedMimeType, SupportedAudioFormat[]> = {
  'audio/mpeg': ['mp3'],
  'audio/wav': ['wav'],
  'audio/wave': ['wav'],
  'audio/mp4': ['m4a'],
  'audio/flac': ['flac'],
  'audio/ogg': ['ogg']
}

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '314572800', 10) // 300MB default
const MAX_FILENAME_LENGTH = 255

/**
 * Validates if a file extension is a supported audio format
 */
export function validateAudioFormat(filename: string): boolean {
  if (!filename || typeof filename !== 'string') {
    return false
  }

  const extension = filename.toLowerCase().split('.').pop()
  return extension ? SUPPORTED_EXTENSIONS.includes(extension as SupportedAudioFormat) : false
}

/**
 * Validates if file size is within allowed limits
 */
export function validateFileSize(sizeInBytes: number): boolean {
  return sizeInBytes > 0 && sizeInBytes <= MAX_FILE_SIZE
}

/**
 * Validates if MIME type is supported
 */
export function validateMimeType(mimeType: string): boolean {
  return SUPPORTED_MIME_TYPES.includes(mimeType as SupportedMimeType)
}

/**
 * Validates consistency between file extension and MIME type
 */
export function validateFileConsistency(filename: string, mimeType: string): boolean {
  const extension = filename.toLowerCase().split('.').pop()
  
  if (!extension || !validateMimeType(mimeType)) {
    return false
  }

  const allowedExtensions = MIME_TYPE_TO_EXTENSION[mimeType as SupportedMimeType]
  return allowedExtensions ? allowedExtensions.includes(extension as SupportedAudioFormat) : false
}

/**
 * Sanitizes filename by removing unsafe characters and normalizing
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return 'unnamed-file'
  }

  // Extract extension
  const parts = filename.split('.')
  const extension = parts.length > 1 ? parts.pop() : ''
  const nameWithoutExt = parts.join('.')

  // Remove/replace unsafe characters
  let sanitized = nameWithoutExt
    .replace(/[<>:"/\\|?*]/g, '-') // Replace Windows unsafe chars
    .replace(/['"]/g, '-') // Replace quotes
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/\.+/g, '') // Remove dots from name part
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, '') // Trim hyphens from start/end
    .toLowerCase()

  // Ensure reasonable length
  if (sanitized.length > MAX_FILENAME_LENGTH - 20) { // Leave room for extension and unique suffix
    sanitized = sanitized.substring(0, MAX_FILENAME_LENGTH - 20)
  }

  // Ensure not empty
  if (!sanitized) {
    sanitized = 'file'
  }

  return extension ? `${sanitized}.${extension.toLowerCase()}` : sanitized
}

/**
 * Generates a unique filename by appending a random suffix
 */
export function generateUniqueFilename(originalFilename: string): string {
  const sanitized = sanitizeFilename(originalFilename)
  const parts = sanitized.split('.')
  const extension = parts.length > 1 ? parts.pop() : ''
  const nameWithoutExt = parts.join('.')

  // Generate 8-character random hex suffix
  const suffix = createHash('md5')
    .update(`${nameWithoutExt}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .substring(0, 8)

  return extension ? `${nameWithoutExt}-${suffix}.${extension}` : `${nameWithoutExt}-${suffix}`
}

/**
 * Comprehensive file validation function
 */
export function validateFile(
  filename: string, 
  sizeInBytes: number, 
  mimeType: string
): FileValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Validate filename
  if (!filename || filename.trim().length === 0) {
    errors.push('Filename is required')
  }

  // Validate file format
  if (!validateAudioFormat(filename)) {
    errors.push(`Unsupported file format. Allowed formats: ${SUPPORTED_EXTENSIONS.join(', ')}`)
  }

  // Validate file size
  if (!validateFileSize(sizeInBytes)) {
    if (sizeInBytes <= 0) {
      errors.push('File size must be greater than 0')
    } else {
      errors.push(`File size exceeds maximum limit of ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB`)
    }
  }

  // Validate MIME type
  if (!validateMimeType(mimeType)) {
    errors.push(`Unsupported MIME type: ${mimeType}`)
  }

  // Validate consistency
  if (filename && mimeType && !validateFileConsistency(filename, mimeType)) {
    warnings.push('File extension and MIME type may not match')
  }

  // File size warnings
  const sizeInMB = sizeInBytes / 1024 / 1024
  if (sizeInMB > 50) {
    warnings.push('Large file size may result in longer processing times')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.toLowerCase().split('.').pop() || ''
}

/**
 * Get expected MIME type from file extension
 */
export function getExpectedMimeType(filename: string): string {
  const extension = getFileExtension(filename) as SupportedAudioFormat
  
  const mimeTypeMap: Record<SupportedAudioFormat, SupportedMimeType> = {
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'm4a': 'audio/mp4',
    'flac': 'audio/flac',
    'ogg': 'audio/ogg'
  }

  return mimeTypeMap[extension] || ''
}

/**
 * Format file size for display
 */
export function formatFileSize(sizeInBytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = sizeInBytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

/**
 * Check if filename is already sanitized
 */
export function isFilenameSanitized(filename: string): boolean {
  const sanitized = sanitizeFilename(filename)
  return filename === sanitized
}