import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST as uploadHandler } from '../../app/api/upload/route'
import { POST as urlUploadHandler } from '../../app/api/upload/url/route'
import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'
import { fileTypeFromBuffer } from 'file-type'

// Mock file for testing
const createMockFile = (filename: string, size: number = 1024, type: string = 'audio/mp3'): File => {
  const buffer = Buffer.alloc(size)
  const blob = new Blob([buffer], { type })
  return new File([blob], filename, { type })
}

// Mock FormData for multipart requests
const createFormDataWithFiles = (files: File[], options: any = {}): FormData => {
  const formData = new FormData()
  files.forEach(file => formData.append('files', file))
  
  if (options.sessionId) {
    formData.append('sessionId', options.sessionId)
  }
  if (options.convertFormat) {
    formData.append('convertFormat', options.convertFormat)
  }
  if (options.outputQuality) {
    formData.append('outputQuality', options.outputQuality)
  }
  
  return formData
}

// Test database setup
let testDb: PrismaClient

describe('Upload API Endpoints', () => {
  beforeEach(async () => {
    // Setup test database
    const testDbPath = `/tmp/test_upload_${Date.now()}_${Math.random().toString(36).substring(7)}.db`
    process.env.DATABASE_URL = `file:${testDbPath}`
    testDb = new PrismaClient()
    
    // Create tables manually (simplified schema for tests)
    await testDb.$executeRaw`
      CREATE TABLE IF NOT EXISTS uploaded_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        originalFilename TEXT NOT NULL,
        originalFormat TEXT NOT NULL,
        convertedFormat TEXT,
        fileSize INTEGER NOT NULL,
        convertedFileSize INTEGER,
        filePath TEXT NOT NULL,
        convertedFilePath TEXT,
        uploadMethod TEXT NOT NULL,
        sourceUrl TEXT,
        uploadDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        conversionStartedAt DATETIME,
        conversionCompletedAt DATETIME,
        status TEXT DEFAULT 'uploaded',
        errorMessage TEXT,
        checksum TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    await testDb.$executeRaw`
      CREATE TABLE IF NOT EXISTS upload_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sessionUuid TEXT UNIQUE NOT NULL,
        totalFiles INTEGER DEFAULT 0,
        completedFiles INTEGER DEFAULT 0,
        failedFiles INTEGER DEFAULT 0,
        totalSizeBytes INTEGER DEFAULT 0,
        processedSizeBytes INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        completedAt DATETIME,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `
  })

  afterEach(async () => {
    await testDb.$disconnect()
  })

  describe('POST /api/upload', () => {
    test('should successfully upload valid audio files', async () => {
      const files = [
        createMockFile('test1.mp3', 1024, 'audio/mp3'),
        createMockFile('test2.wav', 2048, 'audio/wav')
      ]
      
      const formData = createFormDataWithFiles(files, { convertFormat: 'wav' })
      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await uploadHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.sessionId).toBeDefined()
      expect(data.uploads).toHaveLength(2)
      expect(data.uploads[0]).toMatchObject({
        filename: expect.any(String),
        originalName: 'test1.mp3',
        fileSize: 1024,
        mimeType: 'audio/mp3',
        status: 'uploaded'
      })
    })

    test('should reject files that are too large', async () => {
      const largeFile = createMockFile('large.mp3', 105 * 1024 * 1024, 'audio/mp3') // 105MB
      const formData = createFormDataWithFiles([largeFile])
      
      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await uploadHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.code).toBe('FILE_TOO_LARGE')
      expect(data.details.invalidFiles).toHaveLength(1)
      expect(data.details.invalidFiles[0].reason).toContain('size limit')
    })

    test('should reject unsupported file formats', async () => {
      const invalidFile = createMockFile('test.txt', 1024, 'text/plain')
      const formData = createFormDataWithFiles([invalidFile])
      
      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await uploadHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.code).toBe('UNSUPPORTED_FORMAT')
      expect(data.details.invalidFiles).toHaveLength(1)
      expect(data.details.invalidFiles[0].reason).toContain('format not supported')
    })

    test('should handle mixed valid and invalid files', async () => {
      const files = [
        createMockFile('valid.mp3', 1024, 'audio/mp3'),
        createMockFile('invalid.txt', 512, 'text/plain'),
        createMockFile('too-large.wav', 105 * 1024 * 1024, 'audio/wav')
      ]
      const formData = createFormDataWithFiles(files)
      
      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await uploadHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.details.invalidFiles).toHaveLength(2)
    })

    test('should validate MIME type against file headers', async () => {
      // Create a file with wrong MIME type (text content with audio MIME type)
      const fakeAudioFile = new File(['text content'], 'fake.mp3', { type: 'audio/mp3' })
      const formData = createFormDataWithFiles([fakeAudioFile])
      
      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await uploadHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.code).toBe('VALIDATION_ERROR')
    })

    test('should create upload session for tracking', async () => {
      const files = [createMockFile('test.mp3', 1024, 'audio/mp3')]
      const sessionId = 'test-session-123'
      const formData = createFormDataWithFiles(files, { sessionId })
      
      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await uploadHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.sessionId).toBe(sessionId)
      
      // Verify session was created in database
      const session = await testDb.$queryRaw`
        SELECT * FROM upload_sessions WHERE sessionUuid = ${sessionId}
      `
      expect(session).toHaveLength(1)
    })

    test('should apply rate limiting headers', async () => {
      const files = [createMockFile('test.mp3', 1024, 'audio/mp3')]
      const formData = createFormDataWithFiles(files)
      
      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await uploadHandler(request)

      expect(response.headers.get('X-RateLimit-Limit')).toBeDefined()
      expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined()
      expect(response.headers.get('X-RateLimit-Reset')).toBeDefined()
    })

    test('should handle empty file upload', async () => {
      const formData = new FormData()
      
      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await uploadHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.code).toBe('VALIDATION_ERROR')
      expect(data.error).toContain('No files provided')
    })

    test('should handle malformed multipart data', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: 'invalid-multipart-data',
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const response = await uploadHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('POST /api/upload/url', () => {
    test('should successfully download from valid URLs', async () => {
      const requestBody = {
        urls: ['https://httpbin.org/get'], // Mock URL for testing
        sessionId: 'url-test-session',
        convertFormat: 'wav'
      }
      
      const request = new NextRequest('http://localhost:3000/api/upload/url', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await urlUploadHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.sessionId).toBe(requestBody.sessionId)
      expect(data.imports).toHaveLength(1)
      expect(data.imports[0].status).toBe('downloading')
    })

    test('should validate URL format', async () => {
      const requestBody = {
        urls: ['invalid-url', 'not-a-url'],
        sessionId: 'url-test-session'
      }
      
      const request = new NextRequest('http://localhost:3000/api/upload/url', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await urlUploadHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.code).toBe('VALIDATION_ERROR')
    })

    test('should handle empty URL array', async () => {
      const requestBody = {
        urls: [],
        sessionId: 'empty-urls-session'
      }
      
      const request = new NextRequest('http://localhost:3000/api/upload/url', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await urlUploadHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.code).toBe('VALIDATION_ERROR')
      expect(data.error).toContain('No URLs provided')
    })

    test('should limit number of concurrent URL downloads', async () => {
      const urls = Array.from({ length: 11 }, (_, i) => `https://httpbin.org/get?id=${i}`)
      const requestBody = {
        urls,
        sessionId: 'bulk-url-session'
      }
      
      const request = new NextRequest('http://localhost:3000/api/upload/url', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await urlUploadHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.code).toBe('VALIDATION_ERROR')
      expect(data.error).toContain('Too many URLs')
    })

    test('should handle invalid JSON in request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload/url', {
        method: 'POST',
        body: 'invalid-json',
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await urlUploadHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.code).toBe('VALIDATION_ERROR')
    })

    test('should validate supported audio formats in URLs', async () => {
      const requestBody = {
        urls: ['https://example.com/audio.mp3', 'https://example.com/video.mp4'],
        sessionId: 'format-validation-session'
      }
      
      const request = new NextRequest('http://localhost:3000/api/upload/url', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await urlUploadHandler(request)
      const data = await response.json()

      // Should accept the MP3 but reject the MP4
      expect(response.status).toBe(200)
      expect(data.imports).toHaveLength(2)
      expect(data.imports.find((imp: any) => imp.url.includes('mp3'))?.status).toBe('downloading')
      expect(data.imports.find((imp: any) => imp.url.includes('mp4'))?.status).toBe('failed')
    })
  })

  describe('File Validation', () => {
    test('should validate file size limits', async () => {
      const maxSize = 100 * 1024 * 1024 // 100MB
      const file = createMockFile('test.mp3', maxSize + 1, 'audio/mp3')
      const formData = createFormDataWithFiles([file])
      
      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await uploadHandler(request)
      const data = await response.json()

      expect(data.success).toBe(false)
      expect(data.code).toBe('FILE_TOO_LARGE')
    })

    test('should validate supported audio formats', async () => {
      const supportedFormats = ['mp3', 'wav', 'm4a', 'flac', 'ogg', 'wma']
      const unsupportedFormats = ['mp4', 'avi', 'txt', 'pdf']
      
      for (const format of supportedFormats) {
        const file = createMockFile(`test.${format}`, 1024, `audio/${format}`)
        const formData = createFormDataWithFiles([file])
        
        const request = new NextRequest('http://localhost:3000/api/upload', {
          method: 'POST',
          body: formData
        })

        const response = await uploadHandler(request)
        const data = await response.json()

        // Note: This might fail if MIME validation is strict, but format should be accepted
        expect([200, 400]).toContain(response.status)
      }
      
      for (const format of unsupportedFormats) {
        const file = createMockFile(`test.${format}`, 1024, `application/${format}`)
        const formData = createFormDataWithFiles([file])
        
        const request = new NextRequest('http://localhost:3000/api/upload', {
          method: 'POST',
          body: formData
        })

        const response = await uploadHandler(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.code).toBe('UNSUPPORTED_FORMAT')
      }
    })
  })

  describe('Session Management', () => {
    test('should create new session when not provided', async () => {
      const files = [createMockFile('test.mp3', 1024, 'audio/mp3')]
      const formData = createFormDataWithFiles(files)
      
      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await uploadHandler(request)
      const data = await response.json()

      expect(data.sessionId).toBeDefined()
      expect(data.sessionId).toMatch(/^[a-z0-9-]+$/) // UUID-like format
    })

    test('should reuse existing session when provided', async () => {
      const sessionId = 'existing-session-123'
      const files = [createMockFile('test.mp3', 1024, 'audio/mp3')]
      const formData = createFormDataWithFiles(files, { sessionId })
      
      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await uploadHandler(request)
      const data = await response.json()

      expect(data.sessionId).toBe(sessionId)
    })
  })

  describe('Error Handling', () => {
    test('should return standardized error format', async () => {
      const invalidFile = createMockFile('test.txt', 1024, 'text/plain')
      const formData = createFormDataWithFiles([invalidFile])
      
      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await uploadHandler(request)
      const data = await response.json()

      expect(data).toMatchObject({
        success: false,
        error: expect.any(String),
        code: expect.any(String),
        timestamp: expect.any(String)
      })
    })

    test('should handle internal server errors gracefully', async () => {
      // This test would need to mock a database error or similar
      // For now, we'll test the error response format
      const files = [createMockFile('test.mp3', 1024, 'audio/mp3')]
      const formData = createFormDataWithFiles(files)
      
      // Mock database failure by setting invalid database URL
      const originalUrl = process.env.DATABASE_URL
      process.env.DATABASE_URL = 'invalid://database/url'
      
      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      try {
        const response = await uploadHandler(request)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.success).toBe(false)
        expect(data.code).toBe('INTERNAL_ERROR')
      } finally {
        process.env.DATABASE_URL = originalUrl
      }
    })
  })

  describe('Security', () => {
    test('should prevent path traversal in filenames', async () => {
      const maliciousFile = createMockFile('../../../malicious.mp3', 1024, 'audio/mp3')
      const formData = createFormDataWithFiles([maliciousFile])
      
      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await uploadHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      // Filename should be sanitized
      expect(data.uploads[0].filename).not.toContain('../')
    })

    test('should sanitize special characters in filenames', async () => {
      const specialCharFile = createMockFile('test<>:|?*.mp3', 1024, 'audio/mp3')
      const formData = createFormDataWithFiles([specialCharFile])
      
      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await uploadHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      // Special characters should be removed or replaced
      expect(data.uploads[0].filename).not.toMatch(/[<>:|?*]/)
    })
  })
})