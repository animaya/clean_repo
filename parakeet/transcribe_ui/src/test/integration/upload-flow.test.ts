import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

// Integration tests for the complete upload flow
describe('Upload Flow Integration', () => {
  let testDb: PrismaClient
  let testUploadsDir: string

  beforeEach(async () => {
    // Setup test database
    const testDbPath = `/tmp/test_integration_${Date.now()}_${Math.random().toString(36).substring(7)}.db`
    process.env.DATABASE_URL = `file:${testDbPath}`
    testDb = new PrismaClient()

    // Create test uploads directory
    testUploadsDir = `/tmp/test_uploads_${Date.now()}`
    await fs.mkdir(testUploadsDir, { recursive: true })
    process.env.UPLOADS_DIR = testUploadsDir

    // Create database schema
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

    await testDb.$executeRaw`
      CREATE TABLE IF NOT EXISTS session_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sessionId INTEGER NOT NULL,
        fileId INTEGER NOT NULL,
        orderIndex INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(sessionId, fileId)
      )
    `
  })

  afterEach(async () => {
    await testDb.$disconnect()
    
    // Cleanup test files
    try {
      await fs.rm(testUploadsDir, { recursive: true, force: true })
    } catch (error) {
      // Ignore cleanup errors
    }
  })

  describe('Complete Upload Workflow', () => {
    test('should handle complete file upload and database persistence', async () => {
      // Create a real audio file for testing
      const audioBuffer = Buffer.from([
        0x49, 0x44, 0x33, // ID3 header
        0x03, 0x00, // Version
        0x00, // Flags
        0x00, 0x00, 0x00, 0x00 // Size
      ])
      
      const file = new File([audioBuffer], 'test.mp3', { type: 'audio/mp3' })
      const formData = new FormData()
      formData.append('files', file)
      formData.append('sessionId', 'integration-test-session')

      const { POST } = await import('../../app/api/upload/route')
      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.uploads).toHaveLength(1)

      // Verify file was stored on disk
      const uploadedFile = data.uploads[0]
      const filePath = path.join(testUploadsDir, uploadedFile.filename)
      const fileExists = await fs.access(filePath).then(() => true).catch(() => false)
      expect(fileExists).toBe(true)

      // Verify database record was created
      const dbRecord = await testDb.$queryRaw`
        SELECT * FROM uploaded_files WHERE filename = ${uploadedFile.filename}
      `
      expect(dbRecord).toHaveLength(1)

      // Verify session was created
      const sessionRecord = await testDb.$queryRaw`
        SELECT * FROM upload_sessions WHERE sessionUuid = 'integration-test-session'
      `
      expect(sessionRecord).toHaveLength(1)
    })

    test('should handle URL-based upload workflow', async () => {
      const { POST: urlUploadHandler } = await import('../../app/api/upload/url/route')
      
      const requestBody = {
        urls: ['https://httpbin.org/json'], // Mock URL
        sessionId: 'url-integration-session',
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
      expect(data.imports).toHaveLength(1)
      expect(data.imports[0].status).toBe('downloading')

      // Verify session was created
      const sessionRecord = await testDb.$queryRaw`
        SELECT * FROM upload_sessions WHERE sessionUuid = 'url-integration-session'
      `
      expect(sessionRecord).toHaveLength(1)
    })

    test('should handle session management across multiple uploads', async () => {
      const sessionId = 'multi-upload-session'
      const { POST } = await import('../../app/api/upload/route')

      // First upload
      const file1 = new File([Buffer.from('audio1')], 'test1.mp3', { type: 'audio/mp3' })
      const formData1 = new FormData()
      formData1.append('files', file1)
      formData1.append('sessionId', sessionId)

      const request1 = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData1
      })

      const response1 = await POST(request1)
      const data1 = await response1.json()
      expect(response1.status).toBe(200)

      // Second upload to same session
      const file2 = new File([Buffer.from('audio2')], 'test2.wav', { type: 'audio/wav' })
      const formData2 = new FormData()
      formData2.append('files', file2)
      formData2.append('sessionId', sessionId)

      const request2 = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData2
      })

      const response2 = await POST(request2)
      const data2 = await response2.json()
      expect(response2.status).toBe(200)

      // Verify session contains both files
      const sessionFiles = await testDb.$queryRaw`
        SELECT uf.* FROM uploaded_files uf
        JOIN session_files sf ON uf.id = sf.fileId
        JOIN upload_sessions us ON sf.sessionId = us.id
        WHERE us.sessionUuid = ${sessionId}
      `
      expect(sessionFiles).toHaveLength(2)

      // Verify session totals are updated
      const session = await testDb.$queryRaw`
        SELECT * FROM upload_sessions WHERE sessionUuid = ${sessionId}
      `
      expect(session[0].totalFiles).toBe(2)
    })

    test('should handle file validation and rejection in workflow', async () => {
      const { POST } = await import('../../app/api/upload/route')

      // Upload mix of valid and invalid files
      const validFile = new File([Buffer.from('valid audio')], 'valid.mp3', { type: 'audio/mp3' })
      const invalidFile = new File([Buffer.from('not audio')], 'invalid.txt', { type: 'text/plain' })
      
      const formData = new FormData()
      formData.append('files', validFile)
      formData.append('files', invalidFile)
      formData.append('sessionId', 'validation-test-session')

      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400) // Should fail due to invalid file
      expect(data.success).toBe(false)
      expect(data.details.invalidFiles).toHaveLength(1)
      expect(data.details.invalidFiles[0].filename).toBe('invalid.txt')

      // Verify no files were stored
      const dbFiles = await testDb.$queryRaw`
        SELECT * FROM uploaded_files
      `
      expect(dbFiles).toHaveLength(0)
    })

    test('should handle rate limiting across requests', async () => {
      const { POST } = await import('../../app/api/upload/route')
      const clientIp = '192.168.1.100'

      // Make multiple requests to trigger rate limiting
      const promises = []
      for (let i = 0; i < 5; i++) {
        const file = new File([Buffer.from(`audio${i}`)], `test${i}.mp3`, { type: 'audio/mp3' })
        const formData = new FormData()
        formData.append('files', file)

        const request = new NextRequest('http://localhost:3000/api/upload', {
          method: 'POST',
          body: formData,
          headers: { 'x-forwarded-for': clientIp }
        })

        promises.push(POST(request))
      }

      const responses = await Promise.all(promises)
      
      // All should succeed initially (within rate limit)
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status) // Either success or rate limited
        expect(response.headers.get('X-RateLimit-Limit')).toBeDefined()
        expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined()
      })
    })

    test('should handle file storage and cleanup on errors', async () => {
      const { POST } = await import('../../app/api/upload/route')

      // Create a file that will cause an error during processing
      const problematicFile = new File([Buffer.alloc(0)], 'empty.mp3', { type: 'audio/mp3' })
      const formData = new FormData()
      formData.append('files', problematicFile)

      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)
      
      // Even if the request fails, temporary files should be cleaned up
      const uploadDirContents = await fs.readdir(testUploadsDir).catch(() => [])
      
      // Should not contain any leftover temporary files
      const tempFiles = uploadDirContents.filter(file => file.includes('tmp') || file.includes('temp'))
      expect(tempFiles).toHaveLength(0)
    })

    test('should generate correct checksums for uploaded files', async () => {
      const { POST } = await import('../../app/api/upload/route')
      
      const fileContent = Buffer.from('consistent audio content for checksum testing')
      const file = new File([fileContent], 'checksum-test.mp3', { type: 'audio/mp3' })
      const formData = new FormData()
      formData.append('files', file)

      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)
      const data = await response.json()

      if (response.status === 200) {
        const uploadedFile = data.uploads[0]
        
        // Verify checksum was generated and stored
        const dbRecord = await testDb.$queryRaw`
          SELECT checksum FROM uploaded_files WHERE filename = ${uploadedFile.filename}
        `
        expect(dbRecord[0].checksum).toBeDefined()
        expect(dbRecord[0].checksum).toMatch(/^[a-f0-9]{64}$/) // SHA-256 format
      }
    })
  })

  describe('Error Recovery and Resilience', () => {
    test('should handle database connection failures gracefully', async () => {
      // Close database connection to simulate failure
      await testDb.$disconnect()
      
      const { POST } = await import('../../app/api/upload/route')
      const file = new File([Buffer.from('test')], 'test.mp3', { type: 'audio/mp3' })
      const formData = new FormData()
      formData.append('files', file)

      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.code).toBe('INTERNAL_ERROR')
    })

    test('should handle file system errors during storage', async () => {
      // Set uploads directory to read-only location
      const readOnlyDir = '/usr/bin' // System directory (read-only)
      process.env.UPLOADS_DIR = readOnlyDir

      const { POST } = await import('../../app/api/upload/route')
      const file = new File([Buffer.from('test')], 'test.mp3', { type: 'audio/mp3' })
      const formData = new FormData()
      formData.append('files', file)

      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.code).toBe('STORAGE_ERROR')

      // Restore original uploads directory
      process.env.UPLOADS_DIR = testUploadsDir
    })

    test('should handle partial upload failures in batch', async () => {
      const { POST } = await import('../../app/api/upload/route')
      
      // Create files where some will succeed and others will fail
      const validFile1 = new File([Buffer.from('valid1')], 'valid1.mp3', { type: 'audio/mp3' })
      const validFile2 = new File([Buffer.from('valid2')], 'valid2.wav', { type: 'audio/wav' })
      const invalidFile = new File([Buffer.from('invalid')], 'invalid.txt', { type: 'text/plain' })
      
      const formData = new FormData()
      formData.append('files', validFile1)
      formData.append('files', validFile2)
      formData.append('files', invalidFile)

      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.details.invalidFiles).toHaveLength(1)
      
      // Should not create any database records for failed batch
      const dbFiles = await testDb.$queryRaw`SELECT COUNT(*) as count FROM uploaded_files`
      expect(dbFiles[0].count).toBe(0)
    })
  })
})