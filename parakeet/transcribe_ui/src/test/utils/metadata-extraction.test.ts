import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs/promises'
import path from 'path'
import {
  extractFileMetadata,
  generateChecksum,
  extractAudioDuration,
  extractAudioFormat,
  extractAudioMetadata,
  validateFileAccess,
  detectMimeType,
  estimateTranscriptionTime,
  calculateAudioQualityScore
} from '../../lib/metadata-extraction'

describe('Metadata Extraction Functions', () => {
  const testUploadsDir = '/tmp/test-metadata'
  const testFile = path.join(testUploadsDir, 'test-audio.mp3')

  beforeEach(async () => {
    try {
      await fs.mkdir(testUploadsDir, { recursive: true })
      // Create a larger fake file to simulate real audio file
      const fakeAudioData = Buffer.alloc(2 * 1024 * 1024, 'fake audio data') // 2MB
      await fs.writeFile(testFile, fakeAudioData)
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

  describe('extractFileMetadata', () => {
    test('should extract basic file metadata', async () => {
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

    test('should handle metadata extraction errors gracefully', async () => {
      await expect(extractFileMetadata('/nonexistent/file.mp3'))
        .rejects.toThrow('Failed to extract file metadata')
    })
  })

  describe('generateChecksum', () => {
    test('should generate file checksums', async () => {
      const checksum1 = await generateChecksum(testFile)
      const checksum2 = await generateChecksum(testFile)

      expect(checksum1).toBe(checksum2)
      expect(checksum1).toMatch(/^[a-f0-9]{64}$/) // SHA-256 format
    })
  })

  describe('extractAudioDuration', () => {
    test('should extract audio duration', async () => {
      const duration = await extractAudioDuration(testFile)

      expect(typeof duration).toBe('number')
      expect(duration).toBeGreaterThan(0)
    })
  })

  describe('extractAudioFormat', () => {
    test('should extract audio format information', async () => {
      const format = await extractAudioFormat(testFile)

      expect(format).toHaveProperty('formatName')
      expect(format).toHaveProperty('formatLongName')
      expect(format).toHaveProperty('duration')
      expect(format).toHaveProperty('size')
      expect(format).toHaveProperty('bitRate')
      expect(format).toHaveProperty('codec')
      expect(format).toHaveProperty('sampleRate')
      expect(format).toHaveProperty('channels')
      
      expect(format.formatName).toBe('mp3')
      expect(format.channels).toBeGreaterThan(0)
    })
  })

  describe('extractAudioMetadata', () => {
    test('should extract comprehensive audio metadata', async () => {
      const metadata = await extractAudioMetadata(testFile)

      expect(metadata).toHaveProperty('duration')
      expect(metadata).toHaveProperty('sampleRate')
      expect(metadata).toHaveProperty('channels')
      expect(metadata).toHaveProperty('bitRate')
      expect(metadata).toHaveProperty('codec')
      expect(metadata).toHaveProperty('formatLongName')
      
      expect(typeof metadata.duration).toBe('number')
    })
  })

  describe('validateFileAccess', () => {
    test('should validate file access', async () => {
      const canAccess = await validateFileAccess(testFile)
      expect(canAccess).toBe(true)

      const cannotAccess = await validateFileAccess('/nonexistent/file.mp3')
      expect(cannotAccess).toBe(false)
    })
  })

  describe('detectMimeType', () => {
    test('should detect MIME type from file content', async () => {
      const mimeType = await detectMimeType(testFile)
      expect(typeof mimeType).toBe('string')
      expect(mimeType.length).toBeGreaterThan(0)
    })
  })

  describe('estimateTranscriptionTime', () => {
    test('should estimate transcription time', () => {
      const estimate1 = estimateTranscriptionTime(600) // 10 minutes
      const estimate2 = estimateTranscriptionTime(120) // 2 minutes

      expect(estimate1).toBe(60) // ~1/10th of duration
      expect(estimate2).toBe(12)
      expect(typeof estimate1).toBe('number')
    })
  })

  describe('calculateAudioQualityScore', () => {
    test('should calculate audio quality score', () => {
      const highQuality = {
        formatName: 'flac',
        formatLongName: 'FLAC',
        duration: 120,
        size: 50 * 1024 * 1024,
        bitRate: 1000000,
        codec: 'flac',
        sampleRate: 48000,
        channels: 2
      }

      const lowQuality = {
        formatName: 'mp3',
        formatLongName: 'MP3',
        duration: 120,
        size: 5 * 1024 * 1024,
        bitRate: 128000,
        codec: 'mp3',
        sampleRate: 22050,
        channels: 1
      }

      const highScore = calculateAudioQualityScore(highQuality)
      const lowScore = calculateAudioQualityScore(lowQuality)

      expect(highScore).toBeGreaterThan(lowScore)
      expect(highScore).toBeGreaterThanOrEqual(0)
      expect(highScore).toBeLessThanOrEqual(1)
      expect(lowScore).toBeGreaterThanOrEqual(0)
      expect(lowScore).toBeLessThanOrEqual(1)
    })
  })
})