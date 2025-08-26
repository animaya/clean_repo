import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs/promises'
import path from 'path'
import * as fileValidation from '../../lib/file-validation'
import * as metadataExtraction from '../../lib/metadata-extraction'
import * as fileStorage from '../../lib/file-storage'
import * as duplicateDetection from '../../lib/duplicate-detection'
import * as databaseCleanup from '../../lib/database-cleanup'

describe('File Management Utilities', () => {
  const testUploadsDir = '/tmp/test-uploads'
  const testFile = path.join(testUploadsDir, 'test-audio.mp3')

  beforeEach(async () => {
    try {
      await fs.mkdir(testUploadsDir, { recursive: true })
      await fs.writeFile(testFile, Buffer.from('fake audio data'))
    } catch (error) {
      // Directory might already exist
    }
  })

  afterEach(async () => {
    try {
      await fs.rm(testUploadsDir, { recursive: true, force: true })
    } catch (error) {
      // Directory might not exist
    }
  })

  describe('File validation functions', () => {
    test('should validate supported audio formats', () => {
      expect(fileValidation.validateAudioFormat('test.mp3')).toBe(true)
      expect(fileValidation.validateAudioFormat('test.wav')).toBe(true)
      expect(fileValidation.validateAudioFormat('test.m4a')).toBe(true)
      expect(fileValidation.validateAudioFormat('test.flac')).toBe(true)
      expect(fileValidation.validateAudioFormat('test.ogg')).toBe(true)
      
      expect(fileValidation.validateAudioFormat('test.txt')).toBe(false)
      expect(fileValidation.validateAudioFormat('test.pdf')).toBe(false)
      expect(fileValidation.validateAudioFormat('test.mp4')).toBe(false)
      expect(fileValidation.validateAudioFormat('')).toBe(false)
    })

    test('should validate file size within limits', () => {
      const { validateFileSize } = require('../../lib/file-validation')
      const maxSize = 100 * 1024 * 1024 // 100MB

      expect(validateFileSize(1024)).toBe(true)
      expect(validateFileSize(50 * 1024 * 1024)).toBe(true)
      expect(validateFileSize(maxSize)).toBe(true)
      
      expect(validateFileSize(maxSize + 1)).toBe(false)
      expect(validateFileSize(200 * 1024 * 1024)).toBe(false)
      expect(validateFileSize(-1)).toBe(false)
      expect(validateFileSize(0)).toBe(false)
    })

    test('should validate MIME types', () => {
      const { validateMimeType } = require('../../lib/file-validation')

      expect(validateMimeType('audio/mpeg')).toBe(true)
      expect(validateMimeType('audio/wav')).toBe(true)
      expect(validateMimeType('audio/mp4')).toBe(true)
      expect(validateMimeType('audio/flac')).toBe(true)
      expect(validateMimeType('audio/ogg')).toBe(true)
      
      expect(validateMimeType('text/plain')).toBe(false)
      expect(validateMimeType('video/mp4')).toBe(false)
      expect(validateMimeType('application/pdf')).toBe(false)
      expect(validateMimeType('')).toBe(false)
    })

    test('should validate file extension matches MIME type', () => {
      const { validateFileConsistency } = require('../../lib/file-validation')

      expect(validateFileConsistency('test.mp3', 'audio/mpeg')).toBe(true)
      expect(validateFileConsistency('test.wav', 'audio/wav')).toBe(true)
      expect(validateFileConsistency('test.m4a', 'audio/mp4')).toBe(true)
      
      expect(validateFileConsistency('test.mp3', 'audio/wav')).toBe(false)
      expect(validateFileConsistency('test.txt', 'audio/mpeg')).toBe(false)
      expect(validateFileConsistency('test.mp3', 'text/plain')).toBe(false)
    })

    test('should sanitize filenames', () => {
      const { sanitizeFilename } = require('../../lib/file-validation')

      expect(sanitizeFilename('normal-file.mp3')).toBe('normal-file.mp3')
      expect(sanitizeFilename('file with spaces.wav')).toBe('file-with-spaces.wav')
      expect(sanitizeFilename('file/with\\unsafe:chars<>.mp3')).toBe('file-with-unsafe-chars.mp3')
      expect(sanitizeFilename('file"with\'quotes.flac')).toBe('file-with-quotes.flac')
      expect(sanitizeFilename('..dangerous-path.m4a')).toBe('dangerous-path.m4a')
      expect(sanitizeFilename('very-long-filename-that-exceeds-normal-limits-and-should-be-truncated-to-reasonable-length.mp3'))
        .toMatch(/^very-long-filename-that-exceeds.*\.mp3$/)
    })

    test('should generate unique filenames', () => {
      const { generateUniqueFilename } = require('../../lib/file-validation')

      const filename1 = generateUniqueFilename('test.mp3')
      const filename2 = generateUniqueFilename('test.mp3')
      
      expect(filename1).toMatch(/^test-[a-f0-9]{8}\.mp3$/)
      expect(filename2).toMatch(/^test-[a-f0-9]{8}\.mp3$/)
      expect(filename1).not.toBe(filename2)
    })
  })

  describe('Metadata extraction functions', () => {
    test('should extract basic file metadata', async () => {
      const { extractFileMetadata } = require('../../lib/metadata-extraction')

      const metadata = await extractFileMetadata(testFile)

      expect(metadata).toHaveProperty('filename')
      expect(metadata).toHaveProperty('size')
      expect(metadata).toHaveProperty('extension')
      expect(metadata).toHaveProperty('lastModified')
      expect(metadata).toHaveProperty('checksum')
      expect(metadata.filename).toBe('test-audio.mp3')
      expect(metadata.extension).toBe('mp3')
      expect(metadata.size).toBeGreaterThan(0)
    })

    test('should generate file checksums', async () => {
      const { generateChecksum } = require('../../lib/metadata-extraction')

      const checksum1 = await generateChecksum(testFile)
      const checksum2 = await generateChecksum(testFile)

      expect(checksum1).toBe(checksum2)
      expect(checksum1).toMatch(/^[a-f0-9]{64}$/) // SHA-256 format
    })

    test('should extract audio duration using FFmpeg', async () => {
      const { extractAudioDuration } = require('../../lib/metadata-extraction')

      // Mock FFmpeg probe for testing
      const mockProbe = vi.fn().mockResolvedValue({
        streams: [{
          codec_type: 'audio',
          duration: '120.5'
        }]
      })

      vi.doMock('fluent-ffmpeg', () => ({
        ffprobe: mockProbe
      }))

      const duration = await extractAudioDuration(testFile)

      expect(duration).toBe(120.5)
      expect(mockProbe).toHaveBeenCalledWith(testFile)
    })

    test('should extract audio format information', async () => {
      const { extractAudioFormat } = require('../../lib/metadata-extraction')

      // Mock FFmpeg probe
      const mockProbe = vi.fn().mockResolvedValue({
        format: {
          format_name: 'mp3',
          format_long_name: 'MP3 (MPEG audio layer 3)',
          duration: '120.5',
          size: '2048000',
          bit_rate: '128000'
        },
        streams: [{
          codec_type: 'audio',
          codec_name: 'mp3',
          sample_rate: '44100',
          channels: 2,
          bit_rate: '128000'
        }]
      })

      vi.doMock('fluent-ffmpeg', () => ({
        ffprobe: mockProbe
      }))

      const format = await extractAudioFormat(testFile)

      expect(format).toEqual({
        formatName: 'mp3',
        formatLongName: 'MP3 (MPEG audio layer 3)',
        duration: 120.5,
        size: 2048000,
        bitRate: 128000,
        codec: 'mp3',
        sampleRate: 44100,
        channels: 2
      })
    })

    test('should handle metadata extraction errors gracefully', async () => {
      const { extractFileMetadata } = require('../../lib/metadata-extraction')

      await expect(extractFileMetadata('/nonexistent/file.mp3'))
        .rejects.toThrow('File not found')
    })
  })

  describe('File storage functions', () => {
    test('should create storage directories', async () => {
      const { ensureStorageDirectory } = require('../../lib/file-storage')

      const testDir = '/tmp/test-storage-dir'
      await ensureStorageDirectory(testDir)

      const stats = await fs.stat(testDir)
      expect(stats.isDirectory()).toBe(true)

      // Cleanup
      await fs.rm(testDir, { recursive: true })
    })

    test('should move files to storage location', async () => {
      const { moveFileToStorage } = require('../../lib/file-storage')

      const sourceFile = path.join(testUploadsDir, 'source.mp3')
      const targetDir = path.join(testUploadsDir, 'storage')
      const targetFile = path.join(targetDir, 'target.mp3')

      await fs.writeFile(sourceFile, 'test content')

      const result = await moveFileToStorage(sourceFile, targetFile)

      expect(result).toBe(targetFile)
      expect(fs.access(targetFile)).resolves.toBeUndefined()
      await expect(fs.access(sourceFile)).rejects.toThrow()
    })

    test('should calculate storage paths', () => {
      const { calculateStoragePath } = require('../../lib/file-storage')

      const date = new Date('2024-01-15')
      const filename = 'test-audio.mp3'

      const storagePath = calculateStoragePath(filename, date)

      expect(storagePath).toMatch(/^\/uploads\/2024\/01\/15\/test-audio\.mp3$/)
    })

    test('should validate storage space', async () => {
      const { checkStorageSpace } = require('../../lib/file-storage')

      const spaceInfo = await checkStorageSpace('/tmp')

      expect(spaceInfo).toHaveProperty('total')
      expect(spaceInfo).toHaveProperty('free')
      expect(spaceInfo).toHaveProperty('used')
      expect(spaceInfo.total).toBeGreaterThan(0)
      expect(spaceInfo.free).toBeGreaterThan(0)
    })
  })

  describe('File duplicate detection', () => {
    test('should detect duplicate files by checksum', async () => {
      const { findDuplicatesByChecksum } = require('../../lib/duplicate-detection')

      // Mock database response
      const mockPrisma = {
        uploadedFiles: {
          findMany: vi.fn().mockResolvedValue([
            {
              id: 1,
              filename: 'existing-file.mp3',
              checksum: 'abc123def456',
              filePath: '/uploads/existing-file.mp3'
            }
          ])
        }
      }

      const duplicates = await findDuplicatesByChecksum('abc123def456', mockPrisma)

      expect(duplicates).toHaveLength(1)
      expect(duplicates[0].filename).toBe('existing-file.mp3')
      expect(mockPrisma.uploadedFiles.findMany).toHaveBeenCalledWith({
        where: { checksum: 'abc123def456' }
      })
    })

    test('should compare files for similarity', async () => {
      const { compareFileSimilarity } = require('../../lib/duplicate-detection')

      const file1 = { filename: 'audio.mp3', size: 1024000, checksum: 'abc123' }
      const file2 = { filename: 'audio-copy.mp3', size: 1024000, checksum: 'abc123' }
      const file3 = { filename: 'different.wav', size: 2048000, checksum: 'def456' }

      const similarity12 = compareFileSimilarity(file1, file2)
      const similarity13 = compareFileSimilarity(file1, file3)

      expect(similarity12.isExactMatch).toBe(true)
      expect(similarity12.checksumMatch).toBe(true)
      expect(similarity12.sizeMatch).toBe(true)

      expect(similarity13.isExactMatch).toBe(false)
      expect(similarity13.checksumMatch).toBe(false)
      expect(similarity13.sizeMatch).toBe(false)
    })

    test('should handle duplicate file policies', () => {
      const { resolveDuplicatePolicy } = require('../../lib/duplicate-detection')

      const duplicateInfo = {
        isExactMatch: true,
        existingFile: { id: 1, filename: 'existing.mp3' },
        newFile: { filename: 'new.mp3' }
      }

      const skipResult = resolveDuplicatePolicy(duplicateInfo, 'skip')
      const replaceResult = resolveDuplicatePolicy(duplicateInfo, 'replace')
      const keepBothResult = resolveDuplicatePolicy(duplicateInfo, 'keep_both')

      expect(skipResult.action).toBe('skip')
      expect(skipResult.existingFileId).toBe(1)

      expect(replaceResult.action).toBe('replace')
      expect(replaceResult.replaceFileId).toBe(1)

      expect(keepBothResult.action).toBe('keep_both')
      expect(keepBothResult.newFilename).toMatch(/^new-\d+\.mp3$/)
    })
  })

  describe('Database cleanup functions', () => {
    test('should clean up orphaned files', async () => {
      const { cleanupOrphanedFiles } = require('../../lib/database-cleanup')

      const mockPrisma = {
        uploadedFiles: {
          findMany: vi.fn().mockResolvedValue([
            { id: 1, filePath: '/uploads/exists.mp3' },
            { id: 2, filePath: '/uploads/missing.mp3' }
          ]),
          delete: vi.fn()
        }
      }

      // Mock file system
      vi.doMock('fs/promises', () => ({
        access: vi.fn().mockImplementation((path) => {
          if (path.includes('missing.mp3')) {
            throw new Error('File not found')
          }
          return Promise.resolve()
        })
      }))

      const result = await cleanupOrphanedFiles(mockPrisma)

      expect(result.deletedRecords).toBe(1)
      expect(result.orphanedFiles).toEqual(['/uploads/missing.mp3'])
      expect(mockPrisma.uploadedFiles.delete).toHaveBeenCalledWith({
        where: { id: 2 }
      })
    })

    test('should clean up old upload sessions', async () => {
      const { cleanupOldSessions } = require('../../lib/database-cleanup')

      const mockPrisma = {
        uploadSessions: {
          deleteMany: vi.fn().mockResolvedValue({ count: 5 })
        }
      }

      const daysOld = 30
      const result = await cleanupOldSessions(mockPrisma, daysOld)

      expect(result.deletedCount).toBe(5)
      expect(mockPrisma.uploadSessions.deleteMany).toHaveBeenCalled()
    })

    test('should clean up completed transcription jobs', async () => {
      const { cleanupCompletedJobs } = require('../../lib/database-cleanup')

      const mockPrisma = {
        transcriptionJobs: {
          deleteMany: vi.fn().mockResolvedValue({ count: 10 })
        }
      }

      const result = await cleanupCompletedJobs(mockPrisma, 7) // 7 days old

      expect(result.deletedCount).toBe(10)
      expect(mockPrisma.transcriptionJobs.deleteMany).toHaveBeenCalledWith({
        where: {
          status: 'completed',
          completedAt: {
            lt: expect.any(Date)
          }
        }
      })
    })
  })
})