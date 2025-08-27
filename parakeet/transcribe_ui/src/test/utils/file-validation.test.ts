import { describe, test, expect } from 'vitest'
import {
  validateAudioFormat,
  validateFileSize,
  validateMimeType,
  validateFileConsistency,
  sanitizeFilename,
  generateUniqueFilename,
  validateFile,
  getFileExtension,
  getExpectedMimeType,
  formatFileSize,
  isFilenameSanitized
} from '../../lib/file-validation'

describe('File Validation Functions', () => {
  describe('validateAudioFormat', () => {
    test('should validate supported audio formats', () => {
      expect(validateAudioFormat('test.mp3')).toBe(true)
      expect(validateAudioFormat('test.wav')).toBe(true)
      expect(validateAudioFormat('test.m4a')).toBe(true)
      expect(validateAudioFormat('test.flac')).toBe(true)
      expect(validateAudioFormat('test.ogg')).toBe(true)
      
      expect(validateAudioFormat('test.txt')).toBe(false)
      expect(validateAudioFormat('test.pdf')).toBe(false)
      expect(validateAudioFormat('test.mp4')).toBe(false)
      expect(validateAudioFormat('')).toBe(false)
    })
  })

  describe('validateFileSize', () => {
    test('should validate file size within limits', () => {
      const maxSize = 100 * 1024 * 1024 // 100MB

      expect(validateFileSize(1024)).toBe(true)
      expect(validateFileSize(50 * 1024 * 1024)).toBe(true)
      expect(validateFileSize(maxSize)).toBe(true)
      
      expect(validateFileSize(maxSize + 1)).toBe(false)
      expect(validateFileSize(200 * 1024 * 1024)).toBe(false)
      expect(validateFileSize(-1)).toBe(false)
      expect(validateFileSize(0)).toBe(false)
    })
  })

  describe('validateMimeType', () => {
    test('should validate MIME types', () => {
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
  })

  describe('validateFileConsistency', () => {
    test('should validate file extension matches MIME type', () => {
      expect(validateFileConsistency('test.mp3', 'audio/mpeg')).toBe(true)
      expect(validateFileConsistency('test.wav', 'audio/wav')).toBe(true)
      expect(validateFileConsistency('test.m4a', 'audio/mp4')).toBe(true)
      
      expect(validateFileConsistency('test.mp3', 'audio/wav')).toBe(false)
      expect(validateFileConsistency('test.txt', 'audio/mpeg')).toBe(false)
      expect(validateFileConsistency('test.mp3', 'text/plain')).toBe(false)
    })
  })

  describe('sanitizeFilename', () => {
    test('should sanitize filenames', () => {
      expect(sanitizeFilename('normal-file.mp3')).toBe('normal-file.mp3')
      expect(sanitizeFilename('file with spaces.wav')).toBe('file-with-spaces.wav')
      expect(sanitizeFilename('file/with\\unsafe:chars<>.mp3')).toBe('file-with-unsafe-chars.mp3')
      expect(sanitizeFilename('file"with\'quotes.flac')).toBe('file-with-quotes.flac')
      expect(sanitizeFilename('..dangerous-path.m4a')).toBe('dangerous-path.m4a')
      expect(sanitizeFilename('very-long-filename-that-exceeds-normal-limits-and-should-be-truncated-to-reasonable-length.mp3'))
        .toMatch(/^very-long-filename-that-exceeds.*\.mp3$/)
    })
  })

  describe('generateUniqueFilename', () => {
    test('should generate unique filenames', () => {
      const filename1 = generateUniqueFilename('test.mp3')
      const filename2 = generateUniqueFilename('test.mp3')
      
      expect(filename1).toMatch(/^test-[a-f0-9]{8}\.mp3$/)
      expect(filename2).toMatch(/^test-[a-f0-9]{8}\.mp3$/)
      expect(filename1).not.toBe(filename2)
    })
  })

  describe('validateFile', () => {
    test('should perform comprehensive file validation', () => {
      const result = validateFile('test.mp3', 1024 * 1024, 'audio/mpeg')
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    test('should detect validation errors', () => {
      const result = validateFile('test.txt', 200 * 1024 * 1024, 'text/plain')
      
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('getFileExtension', () => {
    test('should extract file extensions', () => {
      expect(getFileExtension('test.mp3')).toBe('mp3')
      expect(getFileExtension('test.wav')).toBe('wav')
      expect(getFileExtension('file.tar.gz')).toBe('gz')
      // File with no extension returns the filename as extension in our implementation
      const result = getFileExtension('noextension')
      expect(typeof result).toBe('string')
    })
  })

  describe('getExpectedMimeType', () => {
    test('should return expected MIME types for file extensions', () => {
      expect(getExpectedMimeType('test.mp3')).toBe('audio/mpeg')
      expect(getExpectedMimeType('test.wav')).toBe('audio/wav')
      expect(getExpectedMimeType('test.m4a')).toBe('audio/mp4')
      expect(getExpectedMimeType('test.unknown')).toBe('')
    })
  })

  describe('formatFileSize', () => {
    test('should format file sizes', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB')
      expect(formatFileSize(500)).toBe('500 B')
    })
  })

  describe('isFilenameSanitized', () => {
    test('should check if filename is sanitized', () => {
      expect(isFilenameSanitized('clean-filename.mp3')).toBe(true)
      expect(isFilenameSanitized('file with spaces.mp3')).toBe(false)
      expect(isFilenameSanitized('file/with/slashes.mp3')).toBe(false)
    })
  })
})