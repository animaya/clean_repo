import { URL } from 'url'
import path from 'path'

export interface UrlValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  validUrls: ValidatedUrl[]
  invalidUrls: InvalidUrl[]
}

export interface ValidatedUrl {
  url: string
  hostname: string
  pathname: string
  filename: string
  extension: string
}

export interface InvalidUrl {
  url: string
  reason: string
}

const SUPPORTED_AUDIO_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.wma']
const ALLOWED_PROTOCOLS = ['http:', 'https:']
const MAX_URLS_PER_REQUEST = 10
const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '::1', '0.0.0.0'] // Prevent SSRF
const SUSPICIOUS_PATTERNS = [
  /javascript:/i,
  /data:/i,
  /vbscript:/i,
  /file:/i,
  /ftp:/i
]

/**
 * Validates URLs for audio file downloads
 */
export function validateUrlRequest(urls: string[]): UrlValidationResult {
  const result: UrlValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    validUrls: [],
    invalidUrls: []
  }

  if (!urls || urls.length === 0) {
    result.errors.push('No URLs provided')
    result.isValid = false
    return result
  }

  if (urls.length > MAX_URLS_PER_REQUEST) {
    result.errors.push(`Too many URLs provided (maximum ${MAX_URLS_PER_REQUEST} allowed)`)
    result.isValid = false
    return result
  }

  for (const url of urls) {
    const urlResult = validateSingleUrl(url)
    
    if (urlResult.isValid && urlResult.validatedUrl) {
      result.validUrls.push(urlResult.validatedUrl)
    } else {
      result.invalidUrls.push({
        url: url,
        reason: urlResult.errors.join(', ')
      })
      result.errors.push(...urlResult.errors)
      result.isValid = false
    }

    result.warnings.push(...urlResult.warnings)
  }

  return result
}

/**
 * Validates a single URL
 */
function validateSingleUrl(url: string): { 
  isValid: boolean
  errors: string[]
  warnings: string[]
  validatedUrl?: ValidatedUrl
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Basic URL validation
  if (!url || url.trim() === '') {
    errors.push('URL cannot be empty')
    return { isValid: false, errors, warnings }
  }

  // Check for suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(url)) {
      errors.push(`Suspicious URL pattern detected: ${url}`)
      return { isValid: false, errors, warnings }
    }
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch (error) {
    errors.push(`Invalid URL format: ${url}`)
    return { isValid: false, errors, warnings }
  }

  // Check protocol
  if (!ALLOWED_PROTOCOLS.includes(parsedUrl.protocol)) {
    errors.push(`Unsupported protocol: ${parsedUrl.protocol}. Only HTTP and HTTPS are allowed`)
    return { isValid: false, errors, warnings }
  }

  // Check for SSRF attempts
  if (BLOCKED_HOSTS.includes(parsedUrl.hostname.toLowerCase())) {
    errors.push(`Access to localhost/internal addresses is not allowed: ${parsedUrl.hostname}`)
    return { isValid: false, errors, warnings }
  }

  // Check for private IP ranges (basic check)
  if (isPrivateIpAddress(parsedUrl.hostname)) {
    errors.push(`Access to private IP addresses is not allowed: ${parsedUrl.hostname}`)
    return { isValid: false, errors, warnings }
  }

  // Extract filename from URL path
  const pathname = parsedUrl.pathname
  const filename = path.basename(pathname)
  const extension = path.extname(filename).toLowerCase()

  // Check if URL appears to point to an audio file
  if (!extension) {
    errors.push(`URL does not have a supported audio file extension: ${url}`)
    return { isValid: false, errors, warnings }
  } else if (!SUPPORTED_AUDIO_EXTENSIONS.includes(extension)) {
    errors.push(`URL does not point to a supported audio format: ${url} (${extension})`)
    return { isValid: false, errors, warnings }
  }

  // Check for reasonable filename
  if (!filename || filename === '/' || filename === '.') {
    warnings.push(`URL does not contain a clear filename: ${url}`)
  }

  // Additional security checks
  if (url.length > 2048) {
    warnings.push(`Unusually long URL: ${url.length} characters`)
  }

  if (parsedUrl.port && !['80', '443', '8080', '8443'].includes(parsedUrl.port)) {
    warnings.push(`Non-standard port detected: ${parsedUrl.port}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    validatedUrl: {
      url: url,
      hostname: parsedUrl.hostname,
      pathname: parsedUrl.pathname,
      filename: filename || 'downloaded_file',
      extension: extension || '.mp3'
    }
  }
}

/**
 * Checks if hostname is a private IP address
 */
function isPrivateIpAddress(hostname: string): boolean {
  // Basic regex patterns for private IP ranges
  const privateIpPatterns = [
    /^10\./,                    // 10.0.0.0/8
    /^192\.168\./,              // 192.168.0.0/16
    /^172\.(1[6-9]|2[0-9]|3[01])\./, // 172.16.0.0/12
    /^127\./,                   // 127.0.0.0/8 (loopback)
    /^169\.254\./,              // 169.254.0.0/16 (link-local)
    /^::1$/,                    // IPv6 loopback
    /^fc00:/,                   // IPv6 unique local
    /^fe80:/                    // IPv6 link-local
  ]

  return privateIpPatterns.some(pattern => pattern.test(hostname))
}

/**
 * Sanitizes URL for safe logging and storage
 */
export function sanitizeUrlForLogging(url: string): string {
  try {
    const parsedUrl = new URL(url)
    // Remove sensitive query parameters
    const sensitiveParams = ['api_key', 'token', 'password', 'secret', 'auth']
    
    sensitiveParams.forEach(param => {
      if (parsedUrl.searchParams.has(param)) {
        parsedUrl.searchParams.set(param, '[REDACTED]')
      }
    })
    
    return parsedUrl.toString()
  } catch (error) {
    return '[INVALID_URL]'
  }
}

/**
 * Extracts filename from URL with fallback options
 */
export function extractFilenameFromUrl(url: string): string {
  try {
    const parsedUrl = new URL(url)
    let filename = path.basename(parsedUrl.pathname)
    
    if (!filename || filename === '/' || filename === '.') {
      // Fallback to using hostname and timestamp
      const timestamp = Date.now()
      const hostname = parsedUrl.hostname.replace(/[^a-zA-Z0-9]/g, '_')
      filename = `download_${hostname}_${timestamp}.mp3`
    }
    
    // Ensure filename has an extension
    if (!path.extname(filename)) {
      filename += '.mp3'
    }
    
    return filename
  } catch (error) {
    return `download_${Date.now()}.mp3`
  }
}

/**
 * Validates URL accessibility (basic check without actually downloading)
 */
export async function validateUrlAccessibility(url: string): Promise<{ accessible: boolean; error?: string }> {
  try {
    // Perform a HEAD request to check if URL is accessible
    const response = await fetch(url, { method: 'HEAD', timeout: 5000 })
    
    if (!response.ok) {
      return { accessible: false, error: `HTTP ${response.status}: ${response.statusText}` }
    }
    
    // Check Content-Type if available
    const contentType = response.headers.get('Content-Type')
    if (contentType && !contentType.startsWith('audio/')) {
      return { accessible: false, error: `Content-Type is not audio: ${contentType}` }
    }
    
    return { accessible: true }
  } catch (error) {
    return { accessible: false, error: error instanceof Error ? error.message : 'Network error' }
  }
}