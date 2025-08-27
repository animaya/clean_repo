import { NextRequest } from 'next/server'

export interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  resetTime: number
  retryAfter?: number
  headers: Record<string, string>
}

export type RateLimitType = 'upload' | 'api' | 'websocket'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

// Rate limit configurations
const RATE_LIMITS: Record<RateLimitType, RateLimitConfig> = {
  upload: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 uploads per minute
  api: { windowMs: 60 * 1000, maxRequests: 100 },   // 100 API calls per minute
  websocket: { windowMs: 60 * 1000, maxRequests: 5 } // 5 WebSocket connections per minute
}

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Validates rate limits for incoming requests
 */
export async function validateRateLimit(
  request: NextRequest, 
  type: RateLimitType = 'api'
): Promise<RateLimitResult> {
  const clientIp = getClientIp(request)
  const config = RATE_LIMITS[type]
  const key = `${clientIp}:${type}`
  const now = Date.now()
  const windowStart = now - config.windowMs

  // Clean up expired entries
  cleanupExpiredEntries(windowStart)

  // Get current rate limit data
  let rateData = rateLimitStore.get(key)
  
  if (!rateData || rateData.resetTime <= now) {
    // Initialize or reset rate limit window
    rateData = {
      count: 0,
      resetTime: now + config.windowMs
    }
  }

  // Increment request count
  rateData.count++
  rateLimitStore.set(key, rateData)

  const remaining = Math.max(0, config.maxRequests - rateData.count)
  const allowed = rateData.count <= config.maxRequests

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(rateData.resetTime / 1000).toString()
  }

  if (!allowed) {
    const retryAfter = Math.ceil((rateData.resetTime - now) / 1000)
    headers['X-RateLimit-RetryAfter'] = retryAfter.toString()
    
    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime: rateData.resetTime,
      retryAfter,
      headers
    }
  }

  return {
    allowed: true,
    limit: config.maxRequests,
    remaining,
    resetTime: rateData.resetTime,
    headers
  }
}

/**
 * Extracts client IP address from request
 */
function getClientIp(request: NextRequest): string {
  // Check various headers for client IP
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  const remoteAddr = request.headers.get('remote-addr')
  if (remoteAddr) {
    return remoteAddr
  }

  // Fallback to a default IP (for development)
  return '127.0.0.1'
}

/**
 * Cleans up expired rate limit entries to prevent memory leaks
 */
function cleanupExpiredEntries(cutoffTime: number): void {
  for (const [key, data] of rateLimitStore.entries()) {
    if (data.resetTime <= cutoffTime) {
      rateLimitStore.delete(key)
    }
  }
}

/**
 * Resets rate limits for a specific client and type (useful for testing)
 */
export function resetRateLimit(clientIp: string, type: RateLimitType): void {
  const key = `${clientIp}:${type}`
  rateLimitStore.delete(key)
}

/**
 * Gets current rate limit status without incrementing
 */
export function getRateLimitStatus(clientIp: string, type: RateLimitType): RateLimitResult {
  const config = RATE_LIMITS[type]
  const key = `${clientIp}:${type}`
  const now = Date.now()
  
  const rateData = rateLimitStore.get(key)
  
  if (!rateData || rateData.resetTime <= now) {
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests,
      resetTime: now + config.windowMs,
      headers: {
        'X-RateLimit-Limit': config.maxRequests.toString(),
        'X-RateLimit-Remaining': config.maxRequests.toString(),
        'X-RateLimit-Reset': Math.ceil((now + config.windowMs) / 1000).toString()
      }
    }
  }

  const remaining = Math.max(0, config.maxRequests - rateData.count)
  const allowed = rateData.count < config.maxRequests

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(rateData.resetTime / 1000).toString()
  }

  if (!allowed) {
    const retryAfter = Math.ceil((rateData.resetTime - now) / 1000)
    headers['X-RateLimit-RetryAfter'] = retryAfter.toString()
    
    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime: rateData.resetTime,
      retryAfter,
      headers
    }
  }

  return {
    allowed: true,
    limit: config.maxRequests,
    remaining,
    resetTime: rateData.resetTime,
    headers
  }
}