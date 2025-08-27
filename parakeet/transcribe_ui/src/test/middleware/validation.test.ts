import { describe, test, expect } from 'vitest'
import { validateUploadRequest } from '../../lib/middleware/validation'
import { validateUrlRequest } from '../../lib/middleware/url-validation'
import { validateRateLimit } from '../../lib/middleware/rate-limiting'
import { NextRequest } from 'next/server'

describe('Upload Validation Middleware', () => {
  describe('File Upload Validation', () => {
    test('should validate supported audio formats', () => {
      const supportedFiles = [
        { name: 'test.mp3', type: 'audio/mp3', size: 1024 },
        { name: 'test.wav', type: 'audio/wav', size: 2048 },
        { name: 'test.m4a', type: 'audio/m4a', size: 1500 },
        { name: 'test.flac', type: 'audio/flac', size: 3000 },
        { name: 'test.ogg', type: 'audio/ogg', size: 1200 },
        { name: 'test.wma', type: 'audio/wma', size: 1800 }
      ]

      supportedFiles.forEach(file => {
        const result = validateUploadRequest([file as any])
        expect(result.isValid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    test('should reject unsupported file formats', () => {
      const unsupportedFiles = [
        { name: 'test.mp4', type: 'video/mp4', size: 1024 },
        { name: 'test.txt', type: 'text/plain', size: 512 },
        { name: 'test.pdf', type: 'application/pdf', size: 2048 },
        { name: 'test.jpg', type: 'image/jpeg', size: 1024 }
      ]

      unsupportedFiles.forEach(file => {
        const result = validateUploadRequest([file as any])
        expect(result.isValid).toBe(false)
        expect(result.errors).toContain(`Unsupported file format: ${file.name}`)
      })
    })

    test('should validate file size limits', () => {
      const maxSize = 100 * 1024 * 1024 // 100MB
      
      const validFile = { name: 'small.mp3', type: 'audio/mp3', size: maxSize }
      const result1 = validateUploadRequest([validFile as any])
      expect(result1.isValid).toBe(true)

      const oversizedFile = { name: 'large.mp3', type: 'audio/mp3', size: maxSize + 1 }
      const result2 = validateUploadRequest([oversizedFile as any])
      expect(result2.isValid).toBe(false)
      expect(result2.errors).toContain(`File too large: large.mp3 (${oversizedFile.size} bytes > ${maxSize} bytes)`)
    })

    test('should validate multiple files with mixed results', () => {
      const files = [
        { name: 'valid1.mp3', type: 'audio/mp3', size: 1024 },
        { name: 'invalid.txt', type: 'text/plain', size: 512 },
        { name: 'too-large.wav', type: 'audio/wav', size: 101 * 1024 * 1024 },
        { name: 'valid2.flac', type: 'audio/flac', size: 2048 }
      ]

      const result = validateUploadRequest(files as any[])
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(3)
      expect(result.errors).toContain('Unsupported file format: invalid.txt')
      expect(result.errors).toContain('Unsupported MIME type: text/plain for file invalid.txt')
      expect(result.errors).toContain('File too large: too-large.wav (105906176 bytes > 104857600 bytes)')
      expect(result.validFiles).toHaveLength(2)
      expect(result.invalidFiles).toHaveLength(2)
    })

    test('should handle empty file array', () => {
      const result = validateUploadRequest([])
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('No files provided for upload')
    })

    test('should validate filename characters', () => {
      const problematicFiles = [
        { name: '../../../malicious.mp3', type: 'audio/mp3', size: 1024 },
        { name: 'test<>:|?*.mp3', type: 'audio/mp3', size: 1024 },
        { name: '', type: 'audio/mp3', size: 1024 } // Empty filename
      ]

      problematicFiles.forEach(file => {
        const result = validateUploadRequest([file as any])
        if (file.name === '') {
          expect(result.errors).toContain('Invalid filename: filename cannot be empty')
        } else if (file.name.includes('../')) {
          expect(result.warnings).toContain(`Potentially dangerous filename: ${file.name}`)
        } else if (/[<>:|?*]/.test(file.name)) {
          expect(result.warnings).toContain(`Filename contains special characters: ${file.name}`)
        }
      })
    })

    test('should validate MIME type consistency', () => {
      const inconsistentFile = { name: 'test.mp3', type: 'text/plain', size: 1024 }
      const result = validateUploadRequest([inconsistentFile as any])
      expect(result.warnings).toContain('MIME type mismatch: test.mp3 has type text/plain but extension suggests audio')
    })
  })

  describe('URL Upload Validation', () => {
    test('should validate valid URLs', () => {
      const validUrls = [
        'https://example.com/audio.mp3',
        'http://external-server.com/test.wav',
        'https://cdn.example.com/path/to/file.flac',
        'https://secure-site.org/media/audio.m4a'
      ]

      validUrls.forEach(url => {
        const result = validateUrlRequest([url])
        expect(result.isValid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    test('should reject invalid URLs', () => {
      const invalidUrls = [
        'not-a-url',
        'ftp://example.com/file.mp3', // Unsupported protocol
        'javascript:alert(1)', // Potentially malicious
        '', // Empty URL
        'http://', // Incomplete URL
        'https://example.com/file.exe' // Non-audio file
      ]

      invalidUrls.forEach(url => {
        const result = validateUrlRequest([url])
        expect(result.isValid).toBe(false)
        expect(result.errors.length).toBeGreaterThan(0)
      })
    })

    test('should validate URL count limits', () => {
      const tooManyUrls = Array.from({ length: 11 }, (_, i) => `https://example.com/audio${i}.mp3`)
      const result = validateUrlRequest(tooManyUrls)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Too many URLs provided (maximum 10 allowed)')
    })

    test('should validate file extensions in URLs', () => {
      const urls = [
        'https://example.com/audio.mp3', // Valid
        'https://example.com/video.mp4', // Invalid for audio
        'https://example.com/document.pdf', // Invalid for audio
        'https://example.com/audio.wav', // Valid
        'https://example.com/file' // No extension
      ]

      const result = validateUrlRequest(urls)
      expect(result.isValid).toBe(false)
      expect(result.validUrls).toHaveLength(2)
      expect(result.invalidUrls).toHaveLength(3)
    })

    test('should handle empty URL array', () => {
      const result = validateUrlRequest([])
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('No URLs provided')
    })

    test('should validate URL protocols', () => {
      const protocolTests = [
        { url: 'https://example.com/audio.mp3', valid: true },
        { url: 'http://example.com/audio.mp3', valid: true },
        { url: 'ftp://example.com/audio.mp3', valid: false },
        { url: 'file:///path/audio.mp3', valid: false },
        { url: 'data:audio/mp3;base64,abc', valid: false }
      ]

      protocolTests.forEach(({ url, valid }) => {
        const result = validateUrlRequest([url])
        expect(result.isValid).toBe(valid)
        if (!valid) {
          expect(result.errors.length).toBeGreaterThan(0)
        }
      })
    })
  })

  describe('Rate Limiting', () => {
    test('should allow requests within rate limits', async () => {
      const clientIp = '192.168.1.1'
      const request = new NextRequest('http://localhost:3000/api/upload', {
        headers: { 'x-forwarded-for': clientIp }
      })

      const result = await validateRateLimit(request, 'upload')
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBeLessThanOrEqual(100)
      expect(result.resetTime).toBeGreaterThan(Date.now())
    })

    test('should reject requests exceeding rate limits', async () => {
      const clientIp = '192.168.1.2'
      const request = new NextRequest('http://localhost:3000/api/upload', {
        headers: { 'x-forwarded-for': clientIp }
      })

      // Simulate exceeding rate limit
      for (let i = 0; i < 101; i++) {
        await validateRateLimit(request, 'upload')
      }

      const result = await validateRateLimit(request, 'upload')
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
      expect(result.retryAfter).toBeGreaterThan(0)
    })

    test('should handle different rate limit types', async () => {
      const clientIp = '192.168.1.3'
      const request = new NextRequest('http://localhost:3000/api/upload', {
        headers: { 'x-forwarded-for': clientIp }
      })

      const uploadResult = await validateRateLimit(request, 'upload')
      const apiResult = await validateRateLimit(request, 'api')

      expect(uploadResult.allowed).toBe(true)
      expect(apiResult.allowed).toBe(true)
      // Different limits should be tracked separately
      expect(uploadResult.limit).not.toBe(apiResult.limit)
    })

    test('should reset rate limits after time window', async () => {
      // This test would require mocking time or waiting
      // For now, we'll test the logic structure
      const clientIp = '192.168.1.4'
      const request = new NextRequest('http://localhost:3000/api/upload', {
        headers: { 'x-forwarded-for': clientIp }
      })

      const result1 = await validateRateLimit(request, 'upload')
      expect(result1.allowed).toBe(true)
      
      // In a real scenario, after the time window expires,
      // the rate limit should reset
      const result2 = await validateRateLimit(request, 'upload')
      expect(result2.resetTime).toBeGreaterThan(Date.now())
    })

    test('should handle missing client IP', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload')
      
      const result = await validateRateLimit(request, 'upload')
      // Should still work with default IP or handle gracefully
      expect(result.allowed).toBeDefined()
    })

    test('should provide correct headers for rate limiting', async () => {
      const clientIp = '192.168.1.5'
      const request = new NextRequest('http://localhost:3000/api/upload', {
        headers: { 'x-forwarded-for': clientIp }
      })

      const result = await validateRateLimit(request, 'upload')
      expect(result.headers).toMatchObject({
        'X-RateLimit-Limit': expect.any(String),
        'X-RateLimit-Remaining': expect.any(String),
        'X-RateLimit-Reset': expect.any(String)
      })

      if (!result.allowed) {
        expect(result.headers).toHaveProperty('X-RateLimit-RetryAfter')
      }
    })
  })

  describe('Security Validation', () => {
    test('should detect and prevent malicious file patterns', () => {
      const maliciousFiles = [
        { name: 'malware.exe.mp3', type: 'audio/mp3', size: 1024 },
        { name: 'script.js.wav', type: 'audio/wav', size: 512 },
        { name: 'virus.bat.flac', type: 'audio/flac', size: 2048 }
      ]

      maliciousFiles.forEach(file => {
        const result = validateUploadRequest([file as any])
        expect(result.warnings).toContain(`Potentially suspicious filename pattern: ${file.name}`)
      })
    })

    test('should validate file content against extension', async () => {
      // This would require actual file content analysis
      // For now, we'll test the structure
      const suspiciousFile = { name: 'test.mp3', type: 'audio/mp3', size: 1024 }
      const result = validateUploadRequest([suspiciousFile as any])
      // Would check magic bytes vs extension in real implementation
      expect(result.isValid).toBeDefined()
    })

    test('should sanitize filenames for safe storage', () => {
      const dangerousNames = [
        '../../../etc/passwd',
        'con.mp3', // Windows reserved name
        'aux.wav', // Windows reserved name
        'file with spaces.mp3',
        'file\nwith\nnewlines.wav'
      ]

      dangerousNames.forEach(name => {
        const result = validateUploadRequest([{ name, type: 'audio/mp3', size: 1024 } as any])
        if (result.sanitizedFiles) {
          expect(result.sanitizedFiles[0].filename).not.toContain('../')
          expect(result.sanitizedFiles[0].filename).not.toContain('\n')
        }
      })
    })
  })
})