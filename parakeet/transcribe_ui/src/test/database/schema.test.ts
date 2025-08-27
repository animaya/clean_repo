import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

describe('Database Schema Tests', () => {
  beforeEach(async () => {
    // Use same database as setup.ts but with a fresh client
    const testDbName = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.db`
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: `file:./${testDbName}`
        }
      }
    })
    await prisma.$connect()

    // Create schema for each test to ensure isolation
    await prisma.$executeRaw`PRAGMA foreign_keys = ON;`
    
    // Create all tables
    await prisma.$executeRaw`
      CREATE TABLE uploaded_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        originalFilename TEXT NOT NULL,
        originalFormat TEXT NOT NULL,
        convertedFormat TEXT,
        fileSize INTEGER NOT NULL,
        convertedFileSize INTEGER,
        filePath TEXT NOT NULL,
        convertedFilePath TEXT,
        uploadMethod TEXT NOT NULL CHECK(uploadMethod IN ('drag_drop', 'url_download')),
        sourceUrl TEXT,
        uploadDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        conversionStartedAt DATETIME,
        conversionCompletedAt DATETIME,
        status TEXT NOT NULL DEFAULT 'uploaded' CHECK(status IN ('uploaded', 'converting', 'converted', 'conversion_failed', 'ready_for_transcription')),
        errorMessage TEXT,
        checksum TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );`

    await prisma.$executeRaw`
      CREATE TABLE upload_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sessionUuid TEXT UNIQUE NOT NULL,
        totalFiles INTEGER NOT NULL DEFAULT 0,
        completedFiles INTEGER DEFAULT 0,
        failedFiles INTEGER DEFAULT 0,
        totalSizeBytes INTEGER DEFAULT 0,
        processedSizeBytes INTEGER DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed', 'failed', 'cancelled')),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        completedAt DATETIME,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );`

    await prisma.$executeRaw`
      CREATE TABLE transcription_jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fileId INTEGER NOT NULL,
        jobUuid TEXT UNIQUE NOT NULL,
        modelName TEXT NOT NULL DEFAULT 'mlx-community/parakeet-tdt-0.6b-v3',
        outputFormat TEXT NOT NULL DEFAULT 'srt' CHECK(outputFormat IN ('srt', 'txt', 'vtt', 'json')),
        outputFilePath TEXT,
        status TEXT NOT NULL DEFAULT 'queued' CHECK(status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
        progressPercentage INTEGER DEFAULT 0 CHECK(progressPercentage >= 0 AND progressPercentage <= 100),
        estimatedDuration INTEGER,
        actualDuration INTEGER,
        errorMessage TEXT,
        transcriptionText TEXT,
        wordCount INTEGER,
        confidenceScore REAL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        startedAt DATETIME,
        completedAt DATETIME,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (fileId) REFERENCES uploaded_files(id) ON DELETE CASCADE
      );`

    await prisma.$executeRaw`
      CREATE TABLE file_metadata (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fileId INTEGER NOT NULL,
        durationSeconds REAL,
        sampleRate INTEGER,
        channels INTEGER,
        bitRate INTEGER,
        codec TEXT,
        formatLongName TEXT,
        tagsTitle TEXT,
        tagsArtist TEXT,
        tagsAlbum TEXT,
        tagsDate TEXT,
        tagsGenre TEXT,
        languageDetected TEXT,
        audioQualityScore REAL,
        noiseLevel TEXT CHECK(noiseLevel IN ('low', 'medium', 'high')),
        extractedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (fileId) REFERENCES uploaded_files(id) ON DELETE CASCADE
      );`

    await prisma.$executeRaw`
      CREATE TABLE session_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sessionId INTEGER NOT NULL,
        fileId INTEGER NOT NULL,
        orderIndex INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sessionId) REFERENCES upload_sessions(id) ON DELETE CASCADE,
        FOREIGN KEY (fileId) REFERENCES uploaded_files(id) ON DELETE CASCADE,
        UNIQUE(sessionId, fileId)
      );`
  })

  afterEach(async () => {
    // Just disconnect, the database will be disposed
    await prisma.$disconnect()
  })

  describe('uploaded_files table', () => {
    test('should create uploaded file with all required fields', async () => {
      const fileData = {
        filename: 'test-audio-123456.mp3',
        originalFilename: 'test-audio.mp3',
        originalFormat: 'mp3',
        fileSize: 1024000,
        filePath: '/uploads/test-audio-123456.mp3',
        uploadMethod: 'drag_drop' as const,
        checksum: 'sha256:abcd1234efgh5678'
      }

      const uploadedFile = await prisma.uploadedFiles.create({
        data: fileData
      })

      expect(uploadedFile.id).toBeDefined()
      expect(uploadedFile.filename).toBe(fileData.filename)
      expect(uploadedFile.originalFilename).toBe(fileData.originalFilename)
      expect(uploadedFile.originalFormat).toBe(fileData.originalFormat)
      expect(uploadedFile.fileSize).toBe(fileData.fileSize)
      expect(uploadedFile.filePath).toBe(fileData.filePath)
      expect(uploadedFile.uploadMethod).toBe(fileData.uploadMethod)
      expect(uploadedFile.status).toBe('uploaded') // default value
      expect(uploadedFile.checksum).toBe(fileData.checksum)
      expect(uploadedFile.createdAt).toBeDefined()
      expect(uploadedFile.updatedAt).toBeDefined()
    })

    test('should create uploaded file with URL download method', async () => {
      const fileData = {
        filename: 'downloaded-audio-789012.wav',
        originalFilename: 'audio-from-url.wav',
        originalFormat: 'wav',
        fileSize: 2048000,
        filePath: '/uploads/downloaded-audio-789012.wav',
        uploadMethod: 'url_download' as const,
        sourceUrl: 'https://example.com/audio.wav',
        checksum: 'sha256:xyz789abc012def3'
      }

      const uploadedFile = await prisma.uploadedFiles.create({
        data: fileData
      })

      expect(uploadedFile.uploadMethod).toBe('url_download')
      expect(uploadedFile.sourceUrl).toBe(fileData.sourceUrl)
    })

    test('should enforce upload method constraints', async () => {
      const invalidData = {
        filename: 'test.mp3',
        originalFilename: 'test.mp3',
        originalFormat: 'mp3',
        fileSize: 1024,
        filePath: '/uploads/test.mp3',
        uploadMethod: 'invalid_method' as any
      }

      await expect(prisma.uploadedFiles.create({ data: invalidData }))
        .rejects.toThrow()
    })

    test('should enforce status constraints', async () => {
      const fileData = {
        filename: 'test.mp3',
        originalFilename: 'test.mp3',
        originalFormat: 'mp3',
        fileSize: 1024,
        filePath: '/uploads/test.mp3',
        uploadMethod: 'drag_drop' as const,
        status: 'invalid_status' as any
      }

      await expect(prisma.uploadedFiles.create({ data: fileData }))
        .rejects.toThrow()
    })

    test('should update timestamps on modification', async () => {
      const file = await prisma.uploadedFiles.create({
        data: {
          filename: 'test.mp3',
          originalFilename: 'test.mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/test.mp3',
          uploadMethod: 'drag_drop'
        }
      })

      const originalUpdatedAt = file.updatedAt

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10))

      const updatedFile = await prisma.uploadedFiles.update({
        where: { id: file.id },
        data: { status: 'converting' }
      })

      expect(updatedFile.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
    })
  })

  describe('transcription_jobs table', () => {
    test('should create transcription job linked to uploaded file', async () => {
      const uploadedFile = await prisma.uploadedFiles.create({
        data: {
          filename: 'test.mp3',
          originalFilename: 'test.mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/test.mp3',
          uploadMethod: 'drag_drop'
        }
      })

      const jobData = {
        fileId: uploadedFile.id,
        jobUuid: 'job-uuid-123456789',
        modelName: 'mlx-community/parakeet-tdt-0.6b-v3',
        outputFormat: 'srt' as const,
        outputFilePath: '/transcripts/test.srt'
      }

      const transcriptionJob = await prisma.transcriptionJobs.create({
        data: jobData
      })

      expect(transcriptionJob.id).toBeDefined()
      expect(transcriptionJob.fileId).toBe(uploadedFile.id)
      expect(transcriptionJob.jobUuid).toBe(jobData.jobUuid)
      expect(transcriptionJob.modelName).toBe(jobData.modelName)
      expect(transcriptionJob.outputFormat).toBe(jobData.outputFormat)
      expect(transcriptionJob.status).toBe('queued') // default value
      expect(transcriptionJob.progressPercentage).toBe(0) // default value
    })

    test('should enforce output format constraints', async () => {
      const uploadedFile = await prisma.uploadedFiles.create({
        data: {
          filename: 'test.mp3',
          originalFilename: 'test.mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/test.mp3',
          uploadMethod: 'drag_drop'
        }
      })

      const invalidData = {
        fileId: uploadedFile.id,
        jobUuid: 'job-uuid-123456789',
        outputFormat: 'invalid_format' as any
      }

      await expect(prisma.transcriptionJobs.create({ data: invalidData }))
        .rejects.toThrow()
    })

    test('should enforce progress percentage constraints', async () => {
      const uploadedFile = await prisma.uploadedFiles.create({
        data: {
          filename: 'test.mp3',
          originalFilename: 'test.mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/test.mp3',
          uploadMethod: 'drag_drop'
        }
      })

      const invalidData = {
        fileId: uploadedFile.id,
        jobUuid: 'job-uuid-123456789',
        progressPercentage: 150 // Invalid: over 100
      }

      await expect(prisma.transcriptionJobs.create({ data: invalidData }))
        .rejects.toThrow()
    })

    test('should cascade delete when uploaded file is deleted', async () => {
      const uploadedFile = await prisma.uploadedFiles.create({
        data: {
          filename: 'test.mp3',
          originalFilename: 'test.mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/test.mp3',
          uploadMethod: 'drag_drop'
        }
      })

      const transcriptionJob = await prisma.transcriptionJobs.create({
        data: {
          fileId: uploadedFile.id,
          jobUuid: 'job-uuid-123456789'
        }
      })

      await prisma.uploadedFiles.delete({
        where: { id: uploadedFile.id }
      })

      const remainingJobs = await prisma.transcriptionJobs.findMany({
        where: { id: transcriptionJob.id }
      })

      expect(remainingJobs).toHaveLength(0)
    })
  })

  describe('file_metadata table', () => {
    test('should create file metadata linked to uploaded file', async () => {
      const uploadedFile = await prisma.uploadedFiles.create({
        data: {
          filename: 'test.mp3',
          originalFilename: 'test.mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/test.mp3',
          uploadMethod: 'drag_drop'
        }
      })

      const metadataData = {
        fileId: uploadedFile.id,
        durationSeconds: 120.5,
        sampleRate: 44100,
        channels: 2,
        bitRate: 320000,
        codec: 'mp3',
        formatLongName: 'MP3 (MPEG audio layer 3)',
        tagsTitle: 'Test Audio',
        tagsArtist: 'Test Artist',
        languageDetected: 'en',
        audioQualityScore: 0.95,
        noiseLevel: 'low' as const
      }

      const metadata = await prisma.fileMetadata.create({
        data: metadataData
      })

      expect(metadata.id).toBeDefined()
      expect(metadata.fileId).toBe(uploadedFile.id)
      expect(metadata.durationSeconds).toBe(metadataData.durationSeconds)
      expect(metadata.sampleRate).toBe(metadataData.sampleRate)
      expect(metadata.channels).toBe(metadataData.channels)
      expect(metadata.noiseLevel).toBe(metadataData.noiseLevel)
    })

    test('should enforce noise level constraints', async () => {
      const uploadedFile = await prisma.uploadedFiles.create({
        data: {
          filename: 'test.mp3',
          originalFilename: 'test.mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/test.mp3',
          uploadMethod: 'drag_drop'
        }
      })

      const invalidData = {
        fileId: uploadedFile.id,
        noiseLevel: 'invalid_level' as any
      }

      await expect(prisma.fileMetadata.create({ data: invalidData }))
        .rejects.toThrow()
    })
  })

  describe('upload_sessions and session_files tables', () => {
    test('should create upload session and link files', async () => {
      const sessionData = {
        sessionUuid: 'session-uuid-123456789',
        totalFiles: 2,
        totalSizeBytes: 2048000
      }

      const session = await prisma.uploadSessions.create({
        data: sessionData
      })

      const file1 = await prisma.uploadedFiles.create({
        data: {
          filename: 'test1.mp3',
          originalFilename: 'test1.mp3',
          originalFormat: 'mp3',
          fileSize: 1024000,
          filePath: '/uploads/test1.mp3',
          uploadMethod: 'drag_drop'
        }
      })

      const file2 = await prisma.uploadedFiles.create({
        data: {
          filename: 'test2.wav',
          originalFilename: 'test2.wav',
          originalFormat: 'wav',
          fileSize: 1024000,
          filePath: '/uploads/test2.wav',
          uploadMethod: 'drag_drop'
        }
      })

      const sessionFile1 = await prisma.sessionFiles.create({
        data: {
          sessionId: session.id,
          fileId: file1.id,
          orderIndex: 0
        }
      })

      const sessionFile2 = await prisma.sessionFiles.create({
        data: {
          sessionId: session.id,
          fileId: file2.id,
          orderIndex: 1
        }
      })

      expect(session.status).toBe('active') // default value
      expect(sessionFile1.sessionId).toBe(session.id)
      expect(sessionFile2.sessionId).toBe(session.id)
    })

    test('should enforce unique session-file combinations', async () => {
      const session = await prisma.uploadSessions.create({
        data: {
          sessionUuid: 'session-uuid-123456789',
          totalFiles: 1
        }
      })

      const file = await prisma.uploadedFiles.create({
        data: {
          filename: 'test.mp3',
          originalFilename: 'test.mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/test.mp3',
          uploadMethod: 'drag_drop'
        }
      })

      await prisma.sessionFiles.create({
        data: {
          sessionId: session.id,
          fileId: file.id,
          orderIndex: 0
        }
      })

      // Attempting to create duplicate should fail
      await expect(prisma.sessionFiles.create({
        data: {
          sessionId: session.id,
          fileId: file.id,
          orderIndex: 1
        }
      })).rejects.toThrow()
    })

    test('should enforce session status constraints', async () => {
      const invalidData = {
        sessionUuid: 'session-uuid-123456789',
        status: 'invalid_status' as any
      }

      await expect(prisma.uploadSessions.create({ data: invalidData }))
        .rejects.toThrow()
    })
  })

  describe('Database relationships and constraints', () => {
    test('should maintain referential integrity across all tables', async () => {
      // Create complete workflow: session -> files -> jobs -> metadata
      const session = await prisma.uploadSessions.create({
        data: {
          sessionUuid: 'integration-test-session',
          totalFiles: 1,
          totalSizeBytes: 1024000
        }
      })

      const file = await prisma.uploadedFiles.create({
        data: {
          filename: 'integration-test.mp3',
          originalFilename: 'integration-test.mp3',
          originalFormat: 'mp3',
          fileSize: 1024000,
          filePath: '/uploads/integration-test.mp3',
          uploadMethod: 'drag_drop'
        }
      })

      const sessionFile = await prisma.sessionFiles.create({
        data: {
          sessionId: session.id,
          fileId: file.id,
          orderIndex: 0
        }
      })

      const transcriptionJob = await prisma.transcriptionJobs.create({
        data: {
          fileId: file.id,
          jobUuid: 'integration-job-uuid'
        }
      })

      const metadata = await prisma.fileMetadata.create({
        data: {
          fileId: file.id,
          durationSeconds: 60.0,
          sampleRate: 44100,
          channels: 2
        }
      })

      // Verify all relationships exist
      const fileWithRelations = await prisma.uploadedFiles.findUnique({
        where: { id: file.id },
        include: {
          transcriptionJobs: true,
          fileMetadata: true,
          sessionFiles: {
            include: {
              uploadSession: true
            }
          }
        }
      })

      expect(fileWithRelations).not.toBeNull()
      expect(fileWithRelations!.transcriptionJobs).toHaveLength(1)
      expect(fileWithRelations!.fileMetadata).toHaveLength(1)
      expect(fileWithRelations!.sessionFiles).toHaveLength(1)
      expect(fileWithRelations!.sessionFiles[0].uploadSession.id).toBe(session.id)
    })

    test('should properly handle cascade deletes', async () => {
      const file = await prisma.uploadedFiles.create({
        data: {
          filename: 'cascade-test.mp3',
          originalFilename: 'cascade-test.mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/cascade-test.mp3',
          uploadMethod: 'drag_drop'
        }
      })

      await prisma.transcriptionJobs.create({
        data: {
          fileId: file.id,
          jobUuid: 'cascade-job-uuid'
        }
      })

      await prisma.fileMetadata.create({
        data: {
          fileId: file.id,
          durationSeconds: 30.0
        }
      })

      // Delete the file
      await prisma.uploadedFiles.delete({
        where: { id: file.id }
      })

      // Verify cascaded deletions
      const jobs = await prisma.transcriptionJobs.findMany({
        where: { fileId: file.id }
      })

      const metadata = await prisma.fileMetadata.findMany({
        where: { fileId: file.id }
      })

      expect(jobs).toHaveLength(0)
      expect(metadata).toHaveLength(0)
    })
  })
})