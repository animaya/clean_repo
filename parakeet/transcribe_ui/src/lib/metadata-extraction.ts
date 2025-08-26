import { promises as fs } from 'fs'
import { createHash } from 'crypto'
import path from 'path'

export type BasicFileMetadata = {
  filename: string
  size: number
  extension: string
  lastModified: Date
  checksum: string
}

export type AudioFormatInfo = {
  formatName: string
  formatLongName: string
  duration: number
  size: number
  bitRate: number
  codec: string
  sampleRate: number
  channels: number
}

export type AudioMetadata = {
  duration: number
  sampleRate?: number
  channels?: number
  bitRate?: number
  codec?: string
  formatLongName?: string
  title?: string
  artist?: string
  album?: string
  date?: string
  genre?: string
}

/**
 * Extracts basic file metadata without audio-specific information
 */
export async function extractFileMetadata(filePath: string): Promise<BasicFileMetadata> {
  try {
    const stats = await fs.stat(filePath)
    const filename = path.basename(filePath)
    const extension = path.extname(filename).toLowerCase().substring(1)
    
    const checksum = await generateChecksum(filePath)

    return {
      filename,
      size: stats.size,
      extension,
      lastModified: stats.mtime,
      checksum
    }
  } catch (error) {
    throw new Error(`Failed to extract file metadata: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generates SHA-256 checksum for file content
 */
export async function generateChecksum(filePath: string): Promise<string> {
  try {
    const fileBuffer = await fs.readFile(filePath)
    return createHash('sha256').update(fileBuffer).digest('hex')
  } catch (error) {
    throw new Error(`Failed to generate checksum: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Extracts audio duration using FFmpeg probe (mock implementation for testing)
 * In real implementation, this would use fluent-ffmpeg or similar
 */
export async function extractAudioDuration(filePath: string): Promise<number> {
  // This is a mock implementation for testing
  // In production, you would use:
  // const ffmpeg = require('fluent-ffmpeg')
  // return new Promise((resolve, reject) => {
  //   ffmpeg.ffprobe(filePath, (err, metadata) => {
  //     if (err) reject(err)
  //     const audioStream = metadata.streams.find(s => s.codec_type === 'audio')
  //     resolve(parseFloat(audioStream?.duration || '0'))
  //   })
  // })

  // For now, return a mock duration based on file size
  try {
    const stats = await fs.stat(filePath)
    // Rough approximation: 1MB ≈ 60 seconds for typical audio
    return Math.round((stats.size / 1024 / 1024) * 60 * 100) / 100
  } catch (error) {
    throw new Error(`Failed to extract audio duration: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Extracts comprehensive audio format information using FFmpeg probe
 * Mock implementation - in production would use actual FFmpeg
 */
export async function extractAudioFormat(filePath: string): Promise<AudioFormatInfo> {
  // Mock implementation for testing
  // In production, this would use fluent-ffmpeg
  
  try {
    const basicMetadata = await extractFileMetadata(filePath)
    const duration = await extractAudioDuration(filePath)

    // Mock format info based on file extension
    const formatMap: Record<string, Partial<AudioFormatInfo>> = {
      'mp3': {
        formatName: 'mp3',
        formatLongName: 'MP3 (MPEG audio layer 3)',
        codec: 'mp3',
        sampleRate: 44100,
        channels: 2,
        bitRate: 128000
      },
      'wav': {
        formatName: 'wav',
        formatLongName: 'WAV / WAVE (Waveform Audio)',
        codec: 'pcm_s16le',
        sampleRate: 44100,
        channels: 2,
        bitRate: 1411200
      },
      'm4a': {
        formatName: 'm4a',
        formatLongName: 'Apple iTunes ALAC/AAC-LC (.M4A) Audio',
        codec: 'aac',
        sampleRate: 44100,
        channels: 2,
        bitRate: 256000
      },
      'flac': {
        formatName: 'flac',
        formatLongName: 'raw FLAC',
        codec: 'flac',
        sampleRate: 44100,
        channels: 2,
        bitRate: 1000000
      },
      'ogg': {
        formatName: 'ogg',
        formatLongName: 'Ogg Vorbis',
        codec: 'vorbis',
        sampleRate: 44100,
        channels: 2,
        bitRate: 192000
      }
    }

    const formatDefaults = formatMap[basicMetadata.extension] || {
      formatName: 'unknown',
      formatLongName: 'Unknown Audio Format',
      codec: 'unknown',
      sampleRate: 44100,
      channels: 2,
      bitRate: 128000
    }

    return {
      formatName: formatDefaults.formatName!,
      formatLongName: formatDefaults.formatLongName!,
      duration,
      size: basicMetadata.size,
      bitRate: formatDefaults.bitRate!,
      codec: formatDefaults.codec!,
      sampleRate: formatDefaults.sampleRate!,
      channels: formatDefaults.channels!
    }
  } catch (error) {
    throw new Error(`Failed to extract audio format: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Extracts audio metadata including tags and technical information
 */
export async function extractAudioMetadata(filePath: string): Promise<AudioMetadata> {
  try {
    const formatInfo = await extractAudioFormat(filePath)
    const filename = path.basename(filePath, path.extname(filePath))

    // Mock metadata extraction - in production would parse actual audio tags
    const mockTags = extractMockTags(filename)

    return {
      duration: formatInfo.duration,
      sampleRate: formatInfo.sampleRate,
      channels: formatInfo.channels,
      bitRate: formatInfo.bitRate,
      codec: formatInfo.codec,
      formatLongName: formatInfo.formatLongName,
      ...mockTags
    }
  } catch (error) {
    throw new Error(`Failed to extract audio metadata: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Extract mock tags from filename (for testing purposes)
 */
function extractMockTags(filename: string): Partial<AudioMetadata> {
  const tags: Partial<AudioMetadata> = {}

  // Simple heuristics for demo purposes
  if (filename.toLowerCase().includes('podcast')) {
    tags.genre = 'Podcast'
  } else if (filename.toLowerCase().includes('music')) {
    tags.genre = 'Music'
  } else if (filename.toLowerCase().includes('meeting')) {
    tags.genre = 'Business'
  }

  // Extract potential title from filename
  const cleanTitle = filename
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())

  if (cleanTitle.length > 0) {
    tags.title = cleanTitle
  }

  tags.date = new Date().getFullYear().toString()

  return tags
}

/**
 * Validate that a file exists and is readable
 */
export async function validateFileAccess(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath, fs.constants.R_OK)
    return true
  } catch {
    return false
  }
}

/**
 * Get file MIME type from file content (basic implementation)
 */
export async function detectMimeType(filePath: string): Promise<string> {
  try {
    // Read first few bytes to detect file signature
    const buffer = await fs.readFile(filePath, { encoding: null, flag: 'r' })
    const header = buffer.subarray(0, 12)

    // Basic MIME type detection based on file signatures
    if (header[0] === 0xFF && header[1] === 0xFB) {
      return 'audio/mpeg' // MP3
    } else if (header.subarray(0, 4).toString() === 'RIFF' && 
               header.subarray(8, 12).toString() === 'WAVE') {
      return 'audio/wav' // WAV
    } else if (header.subarray(4, 8).toString() === 'ftyp') {
      return 'audio/mp4' // M4A
    } else if (header.subarray(0, 4).toString() === 'fLaC') {
      return 'audio/flac' // FLAC
    } else if (header.subarray(0, 4).toString() === 'OggS') {
      return 'audio/ogg' // OGG
    }

    // Fallback to extension-based detection
    const extension = path.extname(filePath).toLowerCase()
    const mimeMap: Record<string, string> = {
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.m4a': 'audio/mp4',
      '.flac': 'audio/flac',
      '.ogg': 'audio/ogg'
    }

    return mimeMap[extension] || 'application/octet-stream'
  } catch (error) {
    throw new Error(`Failed to detect MIME type: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Calculate estimated transcription time based on audio duration
 */
export function estimateTranscriptionTime(audioDurationSeconds: number): number {
  // Rough estimate: transcription takes about 1/10th of audio duration
  // This varies based on model, hardware, and audio quality
  return Math.ceil(audioDurationSeconds / 10)
}

/**
 * Calculate audio quality score based on technical parameters
 */
export function calculateAudioQualityScore(metadata: AudioFormatInfo): number {
  let score = 0

  // Sample rate scoring (higher is better)
  if (metadata.sampleRate >= 48000) score += 0.3
  else if (metadata.sampleRate >= 44100) score += 0.25
  else if (metadata.sampleRate >= 22050) score += 0.15
  else score += 0.05

  // Bit rate scoring (higher is generally better for quality)
  if (metadata.bitRate >= 320000) score += 0.3
  else if (metadata.bitRate >= 256000) score += 0.25
  else if (metadata.bitRate >= 192000) score += 0.2
  else if (metadata.bitRate >= 128000) score += 0.15
  else score += 0.1

  // Channels scoring (stereo preferred for most content)
  if (metadata.channels === 2) score += 0.2
  else if (metadata.channels === 1) score += 0.15
  else score += 0.1

  // Format scoring (lossless formats get bonus)
  if (metadata.codec === 'flac') score += 0.2
  else if (metadata.codec === 'pcm_s16le') score += 0.15
  else score += 0.1

  return Math.min(1.0, Math.max(0.0, score))
}