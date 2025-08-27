import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { FFmpegConversionService } from '../../lib/services/ffmpeg-conversion'
import { AudioFormatDetector } from '../../lib/services/audio-format-detector'
import { ConversionQueue } from '../../lib/services/conversion-queue'
import type { 
  ConversionOptions, 
  ConversionResult, 
  AudioMetadata,
  SupportedFormat,
  ConversionJob,
  ConversionProgress 
} from '../../types/audio'
import fs from 'fs/promises'
import path from 'path'

// Mock browser APIs for Node.js environment
Object.assign(global, {
  URL: {
    createObjectURL: vi.fn().mockReturnValue('blob://mock-url'),
    revokeObjectURL: vi.fn()
  },
  Blob: class MockBlob {
    constructor(public parts: any[], public options?: any) {}
  }
})

// Mock ffmpeg module
vi.mock('@ffmpeg/ffmpeg', () => ({
  FFmpeg: vi.fn(() => ({
    load: vi.fn().mockResolvedValue(undefined),
    writeFile: vi.fn().mockResolvedValue(undefined),
    exec: vi.fn().mockResolvedValue(0),
    readFile: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    deleteFile: vi.fn().mockResolvedValue(undefined),
    on: vi.fn(),
    off: vi.fn(),
    terminate: vi.fn().mockResolvedValue(undefined)
  })),
  toBlobURL: vi.fn().mockResolvedValue('blob://test-url')
}))

// Mock @ffmpeg/util
vi.mock('@ffmpeg/util', () => ({
  toBlobURL: vi.fn().mockResolvedValue('blob://test-url')
}))

// Mock file system operations
vi.mock('fs/promises')

describe('FFmpegConversionService', () => {
  let conversionService: FFmpegConversionService
  let mockFs: any

  beforeEach(async () => {
    mockFs = vi.mocked(fs)
    conversionService = await FFmpegConversionService.getInstance()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    test('should create singleton instance', async () => {
      const instance1 = await FFmpegConversionService.getInstance()
      const instance2 = await FFmpegConversionService.getInstance()
      
      expect(instance1).toBe(instance2)
    })

    test('should initialize FFmpeg WebAssembly', async () => {
      const service = await FFmpegConversionService.getInstance()
      
      expect(service).toBeInstanceOf(FFmpegConversionService)
    })
  })

  describe('format conversion', () => {
    // Create test file larger than minimum size (100 bytes)
    const testFile = new Uint8Array(200).fill(1).map((_, i) => i % 256)
    const conversionOptions: ConversionOptions = {
      inputFormat: 'mp3',
      outputFormat: 'wav',
      bitrate: '128k',
      sampleRate: 44100,
      channels: 2,
      quality: 'high'
    }

    test('should convert audio from MP3 to WAV', async () => {
      const result = await conversionService.convertAudio(
        testFile,
        'test.mp3',
        conversionOptions
      )

      expect(result).toEqual({
        success: true,
        outputData: expect.any(Uint8Array),
        outputFileName: 'test.wav',
        metadata: expect.objectContaining({
          format: 'wav',
          size: expect.any(Number),
          duration: expect.any(Number)
        }),
        processingTime: expect.any(Number)
      })
    })

    test('should convert with custom bitrate settings', async () => {
      const options: ConversionOptions = {
        ...conversionOptions,
        bitrate: '320k',
        quality: 'highest'
      }

      const result = await conversionService.convertAudio(
        testFile,
        'high-quality.mp3',
        options
      )

      expect(result.success).toBe(true)
      expect(result.metadata.bitrate).toBeGreaterThan(128000)
    })

    test('should convert with different channel configurations', async () => {
      const stereoOptions = { ...conversionOptions, channels: 2 }
      const monoOptions = { ...conversionOptions, channels: 1 }

      const stereoResult = await conversionService.convertAudio(
        testFile,
        'stereo.mp3',
        stereoOptions
      )
      const monoResult = await conversionService.convertAudio(
        testFile,
        'mono.mp3',
        monoOptions
      )

      expect(stereoResult.metadata.channels).toBe(2)
      expect(monoResult.metadata.channels).toBe(1)
    })

    test('should handle all supported format conversions', async () => {
      const supportedFormats: SupportedFormat[] = ['mp3', 'wav', 'm4a', 'flac', 'ogg']
      
      for (const inputFormat of supportedFormats) {
        for (const outputFormat of supportedFormats) {
          if (inputFormat !== outputFormat) {
            const options: ConversionOptions = {
              inputFormat,
              outputFormat,
              bitrate: '128k',
              sampleRate: 44100,
              channels: 2,
              quality: 'standard'
            }

            const result = await conversionService.convertAudio(
              testFile,
              `test.${inputFormat}`,
              options
            )

            expect(result.success).toBe(true)
            expect(result.outputFileName).toBe(`test.${outputFormat}`)
          }
        }
      }
    })
  })

  describe('error handling', () => {
    test('should handle FFmpeg execution errors', async () => {
      // Mock FFmpeg to throw error
      const mockFFmpeg = await import('@ffmpeg/ffmpeg')
      const ffmpegInstance = new mockFFmpeg.FFmpeg()
      vi.mocked(ffmpegInstance.exec).mockRejectedValue(new Error('FFmpeg error'))

      const result = await conversionService.convertAudio(
        new Uint8Array([1, 2, 3]),
        'error-test.mp3',
        {
          inputFormat: 'mp3',
          outputFormat: 'wav',
          bitrate: '128k',
          sampleRate: 44100,
          channels: 2,
          quality: 'standard'
        }
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('FFmpeg error')
    })

    test('should handle unsupported format combinations', async () => {
      const largeTestFile = new Uint8Array(200).fill(1)
      const result = await conversionService.convertAudio(
        largeTestFile,
        'test.unknown',
        {
          inputFormat: 'unknown' as SupportedFormat,
          outputFormat: 'wav',
          bitrate: '128k',
          sampleRate: 44100,
          channels: 2,
          quality: 'standard'
        }
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('Unsupported input format')
    })

    test('should handle empty or corrupted files', async () => {
      const emptyFile = new Uint8Array([])
      
      const result = await conversionService.convertAudio(
        emptyFile,
        'empty.mp3',
        {
          inputFormat: 'mp3',
          outputFormat: 'wav',
          bitrate: '128k',
          sampleRate: 44100,
          channels: 2,
          quality: 'standard'
        }
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid or empty file')
    })
  })

  describe('progress tracking', () => {
    test('should emit progress events during conversion', async () => {
      const progressEvents: ConversionProgress[] = []
      
      conversionService.onProgress((progress) => {
        progressEvents.push(progress)
      })

      await conversionService.convertAudio(
        new Uint8Array(200).fill(1),
        'progress-test.mp3',
        {
          inputFormat: 'mp3',
          outputFormat: 'wav',
          bitrate: '128k',
          sampleRate: 44100,
          channels: 2,
          quality: 'standard'
        }
      )

      expect(progressEvents.length).toBeGreaterThan(0)
      expect(progressEvents[0]).toEqual({
        percentage: expect.any(Number),
        currentStep: expect.any(String),
        estimatedTimeRemaining: expect.any(Number)
      })
    })

    test('should provide accurate progress percentages', async () => {
      const progressEvents: ConversionProgress[] = []
      
      conversionService.onProgress((progress) => {
        progressEvents.push(progress)
      })

      await conversionService.convertAudio(
        new Uint8Array(200).fill(1),
        'progress-accuracy-test.mp3',
        {
          inputFormat: 'mp3',
          outputFormat: 'wav',
          bitrate: '128k',
          sampleRate: 44100,
          channels: 2,
          quality: 'standard'
        }
      )

      // Verify progress increases monotonically
      for (let i = 1; i < progressEvents.length; i++) {
        expect(progressEvents[i].percentage).toBeGreaterThanOrEqual(
          progressEvents[i - 1].percentage
        )
      }

      // Final progress should be 100%
      expect(progressEvents[progressEvents.length - 1].percentage).toBe(100)
    })
  })

  describe('cleanup operations', () => {
    test('should cleanup temporary files after conversion', async () => {
      await conversionService.convertAudio(
        new Uint8Array(200).fill(1),
        'cleanup-test.mp3',
        {
          inputFormat: 'mp3',
          outputFormat: 'wav',
          bitrate: '128k',
          sampleRate: 44100,
          channels: 2,
          quality: 'standard'
        }
      )

      // Verify temporary files are cleaned up
      expect(mockFs.unlink).toHaveBeenCalled()
    })

    test('should handle cleanup errors gracefully', async () => {
      mockFs.unlink.mockRejectedValue(new Error('Cleanup error'))

      const result = await conversionService.convertAudio(
        new Uint8Array(200).fill(1),
        'cleanup-error-test.mp3',
        {
          inputFormat: 'mp3',
          outputFormat: 'wav',
          bitrate: '128k',
          sampleRate: 44100,
          channels: 2,
          quality: 'standard'
        }
      )

      // Conversion should still succeed despite cleanup error
      expect(result.success).toBe(true)
    })
  })
})

describe('AudioFormatDetector', () => {
  let formatDetector: AudioFormatDetector

  beforeEach(() => {
    formatDetector = new AudioFormatDetector()
  })

  describe('format detection by file extension', () => {
    test('should detect MP3 format', () => {
      const result = formatDetector.detectByExtension('audio.mp3')
      
      expect(result).toEqual({
        format: 'mp3',
        mimeType: 'audio/mpeg',
        isSupported: true
      })
    })

    test('should detect WAV format', () => {
      const result = formatDetector.detectByExtension('audio.wav')
      
      expect(result).toEqual({
        format: 'wav',
        mimeType: 'audio/wav',
        isSupported: true
      })
    })

    test('should detect all supported formats', () => {
      const testCases = [
        { file: 'test.mp3', format: 'mp3', mimeType: 'audio/mpeg' },
        { file: 'test.wav', format: 'wav', mimeType: 'audio/wav' },
        { file: 'test.m4a', format: 'm4a', mimeType: 'audio/mp4' },
        { file: 'test.flac', format: 'flac', mimeType: 'audio/flac' },
        { file: 'test.ogg', format: 'ogg', mimeType: 'audio/ogg' }
      ]

      testCases.forEach(({ file, format, mimeType }) => {
        const result = formatDetector.detectByExtension(file)
        expect(result.format).toBe(format)
        expect(result.mimeType).toBe(mimeType)
        expect(result.isSupported).toBe(true)
      })
    })

    test('should handle unsupported formats', () => {
      const result = formatDetector.detectByExtension('document.txt')
      
      expect(result).toEqual({
        format: null,
        mimeType: null,
        isSupported: false
      })
    })

    test('should handle files without extensions', () => {
      const result = formatDetector.detectByExtension('audio-file')
      
      expect(result).toEqual({
        format: null,
        mimeType: null,
        isSupported: false
      })
    })
  })

  describe('format detection by magic numbers', () => {
    test('should detect MP3 by magic number', async () => {
      // MP3 magic number: ID3 tag or MPEG sync pattern
      const mp3Buffer = new Uint8Array([0x49, 0x44, 0x33, 0x04, 0x00]) // ID3v2.4
      
      const result = await formatDetector.detectByMagicNumber(mp3Buffer)
      
      expect(result.format).toBe('mp3')
      expect(result.confidence).toBeGreaterThan(0.8)
    })

    test('should detect WAV by magic number', async () => {
      // WAV magic number: RIFF...WAVE
      const wavBuffer = new Uint8Array([
        0x52, 0x49, 0x46, 0x46, // RIFF
        0x00, 0x00, 0x00, 0x00, // file size
        0x57, 0x41, 0x56, 0x45  // WAVE
      ])
      
      const result = await formatDetector.detectByMagicNumber(wavBuffer)
      
      expect(result.format).toBe('wav')
      expect(result.confidence).toBeGreaterThan(0.9)
    })

    test('should detect FLAC by magic number', async () => {
      // FLAC magic number: fLaC
      const flacBuffer = new Uint8Array([0x66, 0x4C, 0x61, 0x43])
      
      const result = await formatDetector.detectByMagicNumber(flacBuffer)
      
      expect(result.format).toBe('flac')
      expect(result.confidence).toBeGreaterThan(0.9)
    })

    test('should handle unknown magic numbers', async () => {
      const unknownBuffer = new Uint8Array([0x00, 0x01, 0x02, 0x03])
      
      const result = await formatDetector.detectByMagicNumber(unknownBuffer)
      
      expect(result.format).toBe(null)
      expect(result.confidence).toBe(0)
    })
  })

  describe('comprehensive format detection', () => {
    test('should combine extension and magic number detection', async () => {
      const mp3Buffer = new Uint8Array([0x49, 0x44, 0x33, 0x04, 0x00])
      
      const result = await formatDetector.detectFormat('audio.mp3', mp3Buffer)
      
      expect(result).toEqual({
        format: 'mp3',
        mimeType: 'audio/mpeg',
        confidence: expect.any(Number),
        detectionMethod: 'combined',
        isSupported: true,
        metadata: expect.objectContaining({
          hasID3: true,
          version: expect.any(String)
        })
      })
    })

    test('should handle mismatched extension and content', async () => {
      // MP3 content with WAV extension
      const mp3Buffer = new Uint8Array([0x49, 0x44, 0x33, 0x04, 0x00])
      
      const result = await formatDetector.detectFormat('audio.wav', mp3Buffer)
      
      expect(result.format).toBe('mp3') // Should trust magic number over extension
      expect(result.confidence).toBeLessThan(0.8) // Lower confidence due to mismatch
      expect(result.detectionMethod).toBe('magic_number')
    })
  })

  describe('metadata extraction', () => {
    test('should extract basic audio metadata', async () => {
      const mp3Buffer = new Uint8Array([0x49, 0x44, 0x33, 0x04, 0x00])
      
      const metadata = await formatDetector.extractMetadata(mp3Buffer, 'mp3')
      
      expect(metadata).toEqual({
        format: 'mp3',
        size: mp3Buffer.length,
        hasMetadata: expect.any(Boolean),
        estimatedDuration: expect.any(Number),
        estimatedBitrate: expect.any(Number),
        channels: expect.any(Number),
        sampleRate: expect.any(Number)
      })
    })

    test('should handle files without metadata', async () => {
      const rawBuffer = new Uint8Array([0x00, 0x01, 0x02, 0x03])
      
      const metadata = await formatDetector.extractMetadata(rawBuffer, 'wav')
      
      expect(metadata.hasMetadata).toBe(false)
      expect(metadata.estimatedDuration).toBe(0)
    })
  })
})

describe('ConversionQueue', () => {
  let queue: ConversionQueue

  beforeEach(() => {
    queue = ConversionQueue.getInstance()
    // Force clear any existing jobs for testing
    try {
      queue.clear()
    } catch (error) {
      // If clear fails due to processing jobs, create a new instance
      // In real implementation, we'd need a way to force clear or reset for tests
      console.warn('Could not clear queue, some jobs may be processing')
    }
  })

  describe('job management', () => {
    test('should add jobs to queue', () => {
      const job: Omit<ConversionJob, 'id' | 'createdAt' | 'updatedAt'> = {
        inputFile: new Uint8Array(200).fill(1),
        inputFileName: 'test.mp3',
        options: {
          inputFormat: 'mp3',
          outputFormat: 'wav',
          bitrate: '128k',
          sampleRate: 44100,
          channels: 2,
          quality: 'standard'
        },
        status: 'pending',
        priority: 1
      }

      const jobId = queue.addJob(job)
      
      expect(jobId).toBeDefined()
      expect(queue.getQueueLength()).toBe(1)
    })

    test('should process jobs in priority order', async () => {
      const highPriorityJob = {
        inputFile: new Uint8Array([1]),
        inputFileName: 'high.mp3',
        options: {
          inputFormat: 'mp3' as SupportedFormat,
          outputFormat: 'wav' as SupportedFormat,
          bitrate: '128k',
          sampleRate: 44100,
          channels: 2,
          quality: 'standard' as const
        },
        status: 'pending' as const,
        priority: 1
      }

      const lowPriorityJob = {
        inputFile: new Uint8Array([2]),
        inputFileName: 'low.mp3',
        options: {
          inputFormat: 'mp3' as SupportedFormat,
          outputFormat: 'wav' as SupportedFormat,
          bitrate: '128k',
          sampleRate: 44100,
          channels: 2,
          quality: 'standard' as const
        },
        status: 'pending' as const,
        priority: 5
      }

      queue.addJob(lowPriorityJob)
      queue.addJob(highPriorityJob)

      const nextJob = queue.getNextJob()
      expect(nextJob?.inputFileName).toBe('high.mp3')
    })

    test('should update job status', () => {
      const jobId = queue.addJob({
        inputFile: new Uint8Array([1, 2, 3]),
        inputFileName: 'test.mp3',
        options: {
          inputFormat: 'mp3',
          outputFormat: 'wav',
          bitrate: '128k',
          sampleRate: 44100,
          channels: 2,
          quality: 'standard'
        },
        status: 'pending',
        priority: 1
      })

      queue.updateJobStatus(jobId, 'processing')
      const job = queue.getJob(jobId)
      
      expect(job?.status).toBe('processing')
    })

    test('should handle job completion', () => {
      const jobId = queue.addJob({
        inputFile: new Uint8Array([1, 2, 3]),
        inputFileName: 'test.mp3',
        options: {
          inputFormat: 'mp3',
          outputFormat: 'wav',
          bitrate: '128k',
          sampleRate: 44100,
          channels: 2,
          quality: 'standard'
        },
        status: 'pending',
        priority: 1
      })

      const result: ConversionResult = {
        success: true,
        outputData: new Uint8Array([4, 5, 6]),
        outputFileName: 'test.wav',
        metadata: {
          format: 'wav',
          size: 3,
          duration: 10,
          bitrate: 128000,
          sampleRate: 44100,
          channels: 2
        },
        processingTime: 1000
      }

      queue.completeJob(jobId, result)
      const job = queue.getJob(jobId)
      
      expect(job?.status).toBe('completed')
      expect(job?.result).toEqual(result)
    })

    test('should handle job failures', () => {
      const jobId = queue.addJob({
        inputFile: new Uint8Array([1, 2, 3]),
        inputFileName: 'test.mp3',
        options: {
          inputFormat: 'mp3',
          outputFormat: 'wav',
          bitrate: '128k',
          sampleRate: 44100,
          channels: 2,
          quality: 'standard'
        },
        status: 'pending',
        priority: 1
      })

      queue.failJob(jobId, 'Conversion failed due to corrupt file')
      const job = queue.getJob(jobId)
      
      expect(job?.status).toBe('failed')
      expect(job?.errorMessage).toBe('Conversion failed due to corrupt file')
    })
  })

  describe('queue statistics', () => {
    test('should provide accurate queue statistics', () => {
      // Add jobs with different statuses
      const pendingId = queue.addJob({
        inputFile: new Uint8Array([1]),
        inputFileName: 'pending.mp3',
        options: {
          inputFormat: 'mp3',
          outputFormat: 'wav',
          bitrate: '128k',
          sampleRate: 44100,
          channels: 2,
          quality: 'standard'
        },
        status: 'pending',
        priority: 1
      })

      const processingId = queue.addJob({
        inputFile: new Uint8Array([2]),
        inputFileName: 'processing.mp3',
        options: {
          inputFormat: 'mp3',
          outputFormat: 'wav',
          bitrate: '128k',
          sampleRate: 44100,
          channels: 2,
          quality: 'standard'
        },
        status: 'pending',
        priority: 1
      })

      queue.updateJobStatus(processingId, 'processing')

      const stats = queue.getQueueStats()
      
      expect(stats).toEqual({
        total: 2,
        pending: 1,
        processing: 1,
        completed: 0,
        failed: 0
      })
    })

    test('should calculate estimated processing time', () => {
      queue.addJob({
        inputFile: new Uint8Array([1, 2, 3]),
        inputFileName: 'test1.mp3',
        options: {
          inputFormat: 'mp3',
          outputFormat: 'wav',
          bitrate: '128k',
          sampleRate: 44100,
          channels: 2,
          quality: 'standard'
        },
        status: 'pending',
        priority: 1
      })

      queue.addJob({
        inputFile: new Uint8Array([4, 5, 6]),
        inputFileName: 'test2.mp3',
        options: {
          inputFormat: 'mp3',
          outputFormat: 'flac',
          bitrate: '128k',
          sampleRate: 44100,
          channels: 2,
          quality: 'highest'
        },
        status: 'pending',
        priority: 1
      })

      const estimatedTime = queue.getEstimatedProcessingTime()
      
      expect(estimatedTime).toBeGreaterThan(0)
    })
  })
})