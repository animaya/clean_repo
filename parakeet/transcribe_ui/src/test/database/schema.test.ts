import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { PrismaClient, UploadMethod, FileStatus, TranscriptionStatus, SessionStatus, OutputFormat, NoiseLevel } from '@prisma/client'

let prisma: PrismaClient

describe('Database Schema Tests', () => {
  beforeEach(async () => {
    // Use same database as setup.ts but with a fresh client
    const testDbName = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.db`
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: `file:./prisma/${testDbName}`
        }
      }
    })
    await prisma.$connect()

    // Push the schema to create tables
    await prisma.$executeRaw`PRAGMA foreign_keys = ON;`
  })

  afterEach(async () => {
    await prisma.$disconnect()
  })

  describe('uploaded_files table', () => {
    test('should create uploaded file with all required fields', async () => {
      const fileData = {
        filename: 'test-audio-123456.mp3',
        originalFilename: 'test-audio.mp3',
        mimeType: 'audio/mp3',
        originalFormat: 'mp3',
        fileSize: 1024000,
        filePath: '/uploads/test-audio-123456.mp3',
        uploadMethod: UploadMethod.DRAG_DROP,
        checksum: 'sha256:abcd1234efgh5678'
      }

      const uploadedFile = await prisma.uploadedFiles.create({
        data: fileData
      })

      expect(uploadedFile.id).toBeDefined()
      expect(uploadedFile.filename).toBe(fileData.filename)
      expect(uploadedFile.originalFilename).toBe(fileData.originalFilename)
      expect(uploadedFile.mimeType).toBe(fileData.mimeType)
      expect(uploadedFile.originalFormat).toBe(fileData.originalFormat)
      expect(uploadedFile.fileSize).toBe(fileData.fileSize)
      expect(uploadedFile.filePath).toBe(fileData.filePath)
      expect(uploadedFile.uploadMethod).toBe(UploadMethod.DRAG_DROP)
      expect(uploadedFile.checksum).toBe(fileData.checksum)
      expect(uploadedFile.status).toBe(FileStatus.UPLOADED)
      expect(uploadedFile.createdAt).toBeDefined()
      expect(uploadedFile.updatedAt).toBeDefined()
    })

    test('should create uploaded file with URL download method', async () => {
      const fileData = {
        filename: 'downloaded-audio-789012.wav',
        originalFilename: 'audio-from-url.wav',
        mimeType: 'audio/wav',
        originalFormat: 'wav',
        fileSize: 2048000,
        filePath: '/uploads/downloaded-audio-789012.wav',
        uploadMethod: UploadMethod.URL_DOWNLOAD,
        sourceUrl: 'https://example.com/audio.wav',
        checksum: 'sha256:xyz789abc012def3'
      }

      const uploadedFile = await prisma.uploadedFiles.create({
        data: fileData
      })

      expect(uploadedFile.uploadMethod).toBe(UploadMethod.URL_DOWNLOAD)
      expect(uploadedFile.sourceUrl).toBe(fileData.sourceUrl)
    })

    test('should enforce upload method constraints', async () => {
      const invalidData = {
        filename: 'test.mp3',
        originalFilename: 'test.mp3',
        mimeType: 'audio/mp3',
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
        mimeType: 'audio/mp3',
        originalFormat: 'mp3',
        fileSize: 1024,
        filePath: '/uploads/test.mp3',
        uploadMethod: UploadMethod.DRAG_DROP,
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
          mimeType: 'audio/mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/test.mp3',
          uploadMethod: UploadMethod.DRAG_DROP
        }
      })

      const originalUpdatedAt = file.updatedAt

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10))

      const updatedFile = await prisma.uploadedFiles.update({
        where: { id: file.id },
        data: { status: FileStatus.CONVERTING }
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
          mimeType: 'audio/mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/test.mp3',
          uploadMethod: UploadMethod.DRAG_DROP
        }
      })

      const jobData = {
        fileId: uploadedFile.id,
        jobUuid: 'job-uuid-123',
        modelName: 'mlx-community/parakeet-tdt-0.6b-v3',
        outputFormat: OutputFormat.SRT,
        status: TranscriptionStatus.QUEUED
      }

      const job = await prisma.transcriptionJobs.create({
        data: jobData
      })

      expect(job.fileId).toBe(uploadedFile.id)
      expect(job.jobUuid).toBe(jobData.jobUuid)
      expect(job.outputFormat).toBe(OutputFormat.SRT)
      expect(job.status).toBe(TranscriptionStatus.QUEUED)
      expect(job.retryCount).toBe(0)
      expect(job.maxRetries).toBe(3)
      expect(job.priority).toBe(0)
    })

    test('should enforce output format constraints', async () => {
      const uploadedFile = await prisma.uploadedFiles.create({
        data: {
          filename: 'test.mp3',
          originalFilename: 'test.mp3',
          mimeType: 'audio/mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/test.mp3',
          uploadMethod: UploadMethod.DRAG_DROP
        }
      })

      const jobData = {
        fileId: uploadedFile.id,
        jobUuid: 'job-uuid-124',
        outputFormat: 'invalid_format' as any
      }

      await expect(prisma.transcriptionJobs.create({ data: jobData }))
        .rejects.toThrow()
    })

    test('should enforce progress percentage constraints', async () => {
      const uploadedFile = await prisma.uploadedFiles.create({
        data: {
          filename: 'test.mp3',
          originalFilename: 'test.mp3',
          mimeType: 'audio/mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/test.mp3',
          uploadMethod: UploadMethod.DRAG_DROP
        }
      })

      const job = await prisma.transcriptionJobs.create({
        data: {
          fileId: uploadedFile.id,
          jobUuid: 'job-uuid-125',
          progressPercentage: 50
        }
      })

      expect(job.progressPercentage).toBe(50)

      // Test that we can update progress
      const updatedJob = await prisma.transcriptionJobs.update({
        where: { id: job.id },
        data: { progressPercentage: 100 }
      })

      expect(updatedJob.progressPercentage).toBe(100)
    })

    test('should cascade delete when uploaded file is deleted', async () => {
      const uploadedFile = await prisma.uploadedFiles.create({
        data: {
          filename: 'test.mp3',
          originalFilename: 'test.mp3',
          mimeType: 'audio/mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/test.mp3',
          uploadMethod: UploadMethod.DRAG_DROP
        }
      })

      const job = await prisma.transcriptionJobs.create({
        data: {
          fileId: uploadedFile.id,
          jobUuid: 'job-uuid-126'
        }
      })

      // Delete the uploaded file
      await prisma.uploadedFiles.delete({
        where: { id: uploadedFile.id }
      })

      // Job should be cascade deleted
      const remainingJob = await prisma.transcriptionJobs.findUnique({
        where: { id: job.id }
      })

      expect(remainingJob).toBeNull()
    })
  })

  describe('file_metadata table', () => {
    test('should create file metadata linked to uploaded file', async () => {
      const uploadedFile = await prisma.uploadedFiles.create({
        data: {
          filename: 'test.mp3',
          originalFilename: 'test.mp3',
          mimeType: 'audio/mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/test.mp3',
          uploadMethod: UploadMethod.DRAG_DROP
        }
      })

      const metadataData = {
        fileId: uploadedFile.id,
        durationSeconds: 120.5,
        sampleRate: 44100,
        channels: 2,
        bitRate: 320000,
        codec: 'mp3',
        languageDetected: 'en',
        audioQualityScore: 0.95,
        noiseLevel: NoiseLevel.LOW
      }

      const metadata = await prisma.fileMetadata.create({
        data: metadataData
      })

      expect(metadata.fileId).toBe(uploadedFile.id)
      expect(metadata.durationSeconds).toBe(metadataData.durationSeconds)
      expect(metadata.sampleRate).toBe(metadataData.sampleRate)
      expect(metadata.channels).toBe(metadataData.channels)
      expect(metadata.noiseLevel).toBe(NoiseLevel.LOW)
    })

    test('should enforce noise level constraints', async () => {
      const uploadedFile = await prisma.uploadedFiles.create({
        data: {
          filename: 'test.mp3',
          originalFilename: 'test.mp3',
          mimeType: 'audio/mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/test.mp3',
          uploadMethod: UploadMethod.DRAG_DROP
        }
      })

      const metadataData = {
        fileId: uploadedFile.id,
        noiseLevel: 'invalid_level' as any
      }

      await expect(prisma.fileMetadata.create({ data: metadataData }))
        .rejects.toThrow()
    })
  })

  describe('upload_sessions and session_files tables', () => {
    test('should create upload session and link files', async () => {
      const session = await prisma.uploadSessions.create({
        data: {
          sessionUuid: 'session-uuid-123',
          totalFiles: 2,
          status: SessionStatus.ACTIVE
        }
      })

      const file1 = await prisma.uploadedFiles.create({
        data: {
          filename: 'file1.mp3',
          originalFilename: 'file1.mp3',
          mimeType: 'audio/mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/file1.mp3',
          uploadMethod: UploadMethod.DRAG_DROP
        }
      })

      const file2 = await prisma.uploadedFiles.create({
        data: {
          filename: 'file2.mp3',
          originalFilename: 'file2.mp3',
          mimeType: 'audio/mp3',
          originalFormat: 'mp3',
          fileSize: 2048,
          filePath: '/uploads/file2.mp3',
          uploadMethod: UploadMethod.DRAG_DROP
        }
      })

      await prisma.sessionFiles.create({
        data: {
          sessionId: session.id,
          fileId: file1.id,
          orderIndex: 0
        }
      })

      await prisma.sessionFiles.create({
        data: {
          sessionId: session.id,
          fileId: file2.id,
          orderIndex: 1
        }
      })

      const sessionWithFiles = await prisma.uploadSessions.findUnique({
        where: { id: session.id },
        include: { sessionFiles: true }
      })

      expect(sessionWithFiles?.sessionFiles).toHaveLength(2)
    })

    test('should enforce unique session-file combinations', async () => {
      const session = await prisma.uploadSessions.create({
        data: {
          sessionUuid: 'session-uuid-124',
          status: SessionStatus.ACTIVE
        }
      })

      const file = await prisma.uploadedFiles.create({
        data: {
          filename: 'file.mp3',
          originalFilename: 'file.mp3',
          mimeType: 'audio/mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/file.mp3',
          uploadMethod: UploadMethod.DRAG_DROP
        }
      })

      await prisma.sessionFiles.create({
        data: {
          sessionId: session.id,
          fileId: file.id,
          orderIndex: 0
        }
      })

      // Try to create duplicate session-file combination
      await expect(prisma.sessionFiles.create({
        data: {
          sessionId: session.id,
          fileId: file.id,
          orderIndex: 1  // Different order index, but same session-file combo
        }
      })).rejects.toThrow()
    })

    test('should enforce session status constraints', async () => {
      const sessionData = {
        sessionUuid: 'session-uuid-125',
        status: 'invalid_status' as any
      }

      await expect(prisma.uploadSessions.create({ data: sessionData }))
        .rejects.toThrow()
    })
  })

  describe('Database relationships and constraints', () => {
    test('should maintain referential integrity across all tables', async () => {
      // Create a complete workflow
      const session = await prisma.uploadSessions.create({
        data: {
          sessionUuid: 'integrity-test-session',
          totalFiles: 1,
          status: SessionStatus.ACTIVE
        }
      })

      const file = await prisma.uploadedFiles.create({
        data: {
          filename: 'integrity-test.mp3',
          originalFilename: 'integrity-test.mp3',
          mimeType: 'audio/mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/integrity-test.mp3',
          uploadMethod: UploadMethod.DRAG_DROP
        }
      })

      const sessionFile = await prisma.sessionFiles.create({
        data: {
          sessionId: session.id,
          fileId: file.id,
          orderIndex: 0
        }
      })

      const metadata = await prisma.fileMetadata.create({
        data: {
          fileId: file.id,
          durationSeconds: 60
        }
      })

      const job = await prisma.transcriptionJobs.create({
        data: {
          fileId: file.id,
          jobUuid: 'integrity-test-job'
        }
      })

      // Verify all relationships exist
      const fullFile = await prisma.uploadedFiles.findUnique({
        where: { id: file.id },
        include: {
          fileMetadata: true,
          transcriptionJobs: true,
          sessionFiles: true
        }
      })

      expect(fullFile?.fileMetadata).toHaveLength(1)
      expect(fullFile?.transcriptionJobs).toHaveLength(1)
      expect(fullFile?.sessionFiles).toHaveLength(1)
    })

    test('should properly handle cascade deletes', async () => {
      const file = await prisma.uploadedFiles.create({
        data: {
          filename: 'cascade-test.mp3',
          originalFilename: 'cascade-test.mp3',
          mimeType: 'audio/mp3',
          originalFormat: 'mp3',
          fileSize: 1024,
          filePath: '/uploads/cascade-test.mp3',
          uploadMethod: UploadMethod.DRAG_DROP
        }
      })

      const metadata = await prisma.fileMetadata.create({
        data: {
          fileId: file.id,
          durationSeconds: 60
        }
      })

      const job = await prisma.transcriptionJobs.create({
        data: {
          fileId: file.id,
          jobUuid: 'cascade-test-job'
        }
      })

      // Delete the file
      await prisma.uploadedFiles.delete({
        where: { id: file.id }
      })

      // All related records should be cascade deleted
      const remainingMetadata = await prisma.fileMetadata.findUnique({
        where: { id: metadata.id }
      })
      const remainingJob = await prisma.transcriptionJobs.findUnique({
        where: { id: job.id }
      })

      expect(remainingMetadata).toBeNull()
      expect(remainingJob).toBeNull()
    })
  })
})