import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export type ErrorCode = 
  | 'VALIDATION_ERROR'
  | 'FILE_TOO_LARGE'
  | 'UNSUPPORTED_FORMAT'
  | 'CONVERSION_FAILED'
  | 'STORAGE_ERROR'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'DATABASE_ERROR'
  | 'NETWORK_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'

export interface ApiError {
  code: ErrorCode
  message: string
  details?: any
  statusCode: number
  timestamp: string
  requestId: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  code?: ErrorCode
  details?: any
  timestamp: string
  requestId?: string
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  error: ErrorCode | Error | string,
  statusCode?: number,
  details?: any
): NextResponse {
  const requestId = uuidv4()
  const timestamp = new Date().toISOString()

  let errorInfo: ApiError

  if (typeof error === 'string') {
    errorInfo = {
      code: 'INTERNAL_ERROR',
      message: error,
      statusCode: statusCode || 500,
      timestamp,
      requestId,
      details
    }
  } else if (error instanceof Error) {
    const errorCode = getErrorCodeFromError(error)
    const errorStatusCode = getStatusCodeFromError(error)
    errorInfo = {
      code: errorCode,
      message: error.message,
      statusCode: statusCode || errorStatusCode,
      timestamp,
      requestId,
      details: details || { stack: error.stack }
    }
  } else {
    errorInfo = {
      code: error,
      message: getErrorMessage(error),
      statusCode: statusCode || getStatusCodeFromErrorCode(error),
      timestamp,
      requestId,
      details
    }
  }

  const response: ApiResponse = {
    success: false,
    error: errorInfo.message,
    code: errorInfo.code,
    details: errorInfo.details,
    timestamp: errorInfo.timestamp,
    requestId: errorInfo.requestId
  }

  // Log error for monitoring (in production, use proper logging service)
  logError(errorInfo)

  return NextResponse.json(response, { status: errorInfo.statusCode })
}

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  statusCode: number = 200,
  headers?: Record<string, string>
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString()
  }

  const nextResponse = NextResponse.json(response, { status: statusCode })
  
  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      nextResponse.headers.set(key, value)
    })
  }

  return nextResponse
}

/**
 * Wraps API route handlers with error handling
 */
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<NextResponse> | NextResponse
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      return createErrorResponse(error as Error)
    }
  }
}

/**
 * Gets error code from Error instance
 */
function getErrorCodeFromError(error: Error): ErrorCode {
  // Check for specific error types
  if (error.name === 'ValidationError') {
    return 'VALIDATION_ERROR'
  }
  
  if (error.message.includes('database') || error.message.includes('prisma')) {
    return 'DATABASE_ERROR'
  }
  
  if (error.message.includes('network') || error.message.includes('fetch')) {
    return 'NETWORK_ERROR'
  }
  
  if (error.message.includes('storage') || error.message.includes('file system')) {
    return 'STORAGE_ERROR'
  }

  // Add more specific error detection as needed
  return 'INTERNAL_ERROR'
}

/**
 * Gets HTTP status code from Error instance
 */
function getStatusCodeFromError(error: Error): number {
  if (error.name === 'ValidationError') {
    return 400
  }
  
  if (error.name === 'RateLimitError') {
    return 429
  }
  
  if (error.name === 'StorageError') {
    return 500
  }
  
  if (error.message.includes('not found')) {
    return 404
  }
  
  if (error.message.includes('unauthorized')) {
    return 401
  }
  
  if (error.message.includes('forbidden')) {
    return 403
  }
  
  return 500
}

/**
 * Gets human-readable error message from error code
 */
function getErrorMessage(code: ErrorCode): string {
  const messages: Record<ErrorCode, string> = {
    VALIDATION_ERROR: 'Invalid request parameters or data',
    FILE_TOO_LARGE: 'File exceeds maximum size limit',
    UNSUPPORTED_FORMAT: 'File format is not supported',
    CONVERSION_FAILED: 'Failed to convert audio file',
    STORAGE_ERROR: 'File storage operation failed',
    RATE_LIMITED: 'Request rate limit exceeded',
    INTERNAL_ERROR: 'An internal server error occurred',
    DATABASE_ERROR: 'Database operation failed',
    NETWORK_ERROR: 'Network request failed',
    AUTHENTICATION_ERROR: 'Authentication required',
    AUTHORIZATION_ERROR: 'Insufficient permissions'
  }

  return messages[code] || 'An unknown error occurred'
}

/**
 * Gets HTTP status code from error code
 */
function getStatusCodeFromErrorCode(code: ErrorCode): number {
  const statusCodes: Record<ErrorCode, number> = {
    VALIDATION_ERROR: 400,
    FILE_TOO_LARGE: 413,
    UNSUPPORTED_FORMAT: 415,
    CONVERSION_FAILED: 422,
    STORAGE_ERROR: 500,
    RATE_LIMITED: 429,
    INTERNAL_ERROR: 500,
    DATABASE_ERROR: 500,
    NETWORK_ERROR: 502,
    AUTHENTICATION_ERROR: 401,
    AUTHORIZATION_ERROR: 403
  }

  return statusCodes[code] || 500
}

/**
 * Logs error for monitoring and debugging
 */
function logError(error: ApiError): void {
  // In production, use proper logging service (e.g., Winston, Pino)
  console.error('API Error:', {
    code: error.code,
    message: error.message,
    statusCode: error.statusCode,
    timestamp: error.timestamp,
    requestId: error.requestId,
    details: error.details
  })

  // Could also send to external monitoring service here
  // e.g., Sentry, DataDog, etc.
}

/**
 * Validates request body and throws validation error if invalid
 */
export function validateRequestBody(body: any, schema: any): void {
  if (!body) {
    throw new ValidationError('Request body is required')
  }

  // Add JSON schema validation here if needed
  // For now, just basic checks
  if (typeof body !== 'object') {
    throw new ValidationError('Request body must be a valid JSON object')
  }
}

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  name = 'ValidationError'
  
  constructor(message: string, public field?: string) {
    super(message)
  }
}

/**
 * Custom rate limit error class
 */
export class RateLimitError extends Error {
  name = 'RateLimitError'
  
  constructor(
    message: string, 
    public retryAfter: number,
    public limit: number,
    public remaining: number
  ) {
    super(message)
  }
}

/**
 * Custom storage error class
 */
export class StorageError extends Error {
  name = 'StorageError'
  
  constructor(message: string, public operation: string, public path?: string) {
    super(message)
  }
}

/**
 * Handles multer errors specifically
 */
export function handleMulterError(error: any): ErrorCode {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return 'FILE_TOO_LARGE'
  }
  
  if (error.code === 'LIMIT_FILE_COUNT') {
    return 'VALIDATION_ERROR'
  }
  
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return 'VALIDATION_ERROR'
  }
  
  return 'STORAGE_ERROR'
}

/**
 * Sanitizes error details for client response (removes sensitive info)
 */
export function sanitizeErrorDetails(details: any): any {
  if (!details || typeof details !== 'object') {
    return details
  }

  const sanitized = { ...details }
  
  // Remove sensitive fields
  delete sanitized.stack
  delete sanitized.env
  delete sanitized.config
  delete sanitized.password
  delete sanitized.secret
  delete sanitized.key
  delete sanitized.token
  
  return sanitized
}