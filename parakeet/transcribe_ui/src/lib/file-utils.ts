/**
 * Utility functions for file handling and formatting
 */

/**
 * Format file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0B'
  
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, i)
  
  return `${Math.round(size * 100) / 100}${sizes[i]}`
}

/**
 * Format duration in seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase()
}

/**
 * Check if file type is supported audio format
 */
export function isAudioFile(filename: string): boolean {
  const supportedExtensions = ['mp3', 'wav', 'm4a', 'flac', 'ogg', 'aac']
  const extension = getFileExtension(filename)
  return supportedExtensions.includes(extension)
}

/**
 * Validate URL format
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

/**
 * Check if URL points to an audio file
 */
export function isAudioUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    
    // Check if the pathname ends with an audio extension
    if (isAudioFile(pathname)) {
      return true
    }
    
    // Also check query parameters for audio filenames (e.g., recordUrl=file.wav)
    const searchParams = urlObj.searchParams
    for (const [key, value] of searchParams.entries()) {
      if (value && isAudioFile(value)) {
        return true
      }
    }
    
    return false
  } catch {
    return false
  }
}