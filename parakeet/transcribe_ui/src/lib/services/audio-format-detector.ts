import type {
  SupportedFormat,
  FormatDetectionResult,
  AudioMetadata,
  AudioFileValidation,
  AudioValidationRules
} from '../../types/audio'
import { FormatDetectionError } from '../../types/audio'

/**
 * Audio format detection and validation service
 * Provides client-side audio format detection using file extensions and magic numbers
 */
export class AudioFormatDetector {
  private readonly supportedFormats: Record<SupportedFormat, {
    mimeType: string
    extensions: string[]
    magicNumbers: { bytes: number[], offset: number }[]
  }> = {
    mp3: {
      mimeType: 'audio/mpeg',
      extensions: ['mp3'],
      magicNumbers: [
        { bytes: [0x49, 0x44, 0x33], offset: 0 }, // ID3v2 tag
        { bytes: [0xFF, 0xFB], offset: 0 },        // MPEG-1 Layer 3
        { bytes: [0xFF, 0xF3], offset: 0 },        // MPEG-1 Layer 3
        { bytes: [0xFF, 0xF2], offset: 0 },        // MPEG-1 Layer 3
      ]
    },
    wav: {
      mimeType: 'audio/wav',
      extensions: ['wav', 'wave'],
      magicNumbers: [
        { bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 }, // RIFF
        { bytes: [0x57, 0x41, 0x56, 0x45], offset: 8 }  // WAVE (at offset 8)
      ]
    },
    m4a: {
      mimeType: 'audio/mp4',
      extensions: ['m4a', 'mp4', 'aac'],
      magicNumbers: [
        { bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 }, // ftyp box
        { bytes: [0x4D, 0x34, 0x41, 0x20], offset: 8 }  // M4A identifier
      ]
    },
    flac: {
      mimeType: 'audio/flac',
      extensions: ['flac'],
      magicNumbers: [
        { bytes: [0x66, 0x4C, 0x61, 0x43], offset: 0 }  // fLaC
      ]
    },
    ogg: {
      mimeType: 'audio/ogg',
      extensions: ['ogg', 'oga'],
      magicNumbers: [
        { bytes: [0x4F, 0x67, 0x67, 0x53], offset: 0 }  // OggS
      ]
    }
  }

  private readonly defaultValidationRules: AudioValidationRules = {
    maxFileSize: 300 * 1024 * 1024, // 300MB
    maxDuration: 7200, // 2 hours in seconds
    minDuration: 0.1, // 0.1 seconds
    supportedFormats: ['mp3', 'wav', 'm4a', 'flac', 'ogg'],
    requireValidHeaders: true,
    allowCorruptedFiles: false
  }

  /**
   * Detect audio format by file extension
   */
  detectByExtension(fileName: string): {
    format: SupportedFormat | null
    mimeType: string | null
    isSupported: boolean
  } {
    const extension = this.extractFileExtension(fileName)
    if (!extension) {
      return { format: null, mimeType: null, isSupported: false }
    }

    for (const [format, config] of Object.entries(this.supportedFormats)) {
      if (config.extensions.includes(extension)) {
        return {
          format: format as SupportedFormat,
          mimeType: config.mimeType,
          isSupported: true
        }
      }
    }

    return { format: null, mimeType: null, isSupported: false }
  }

  /**
   * Detect audio format by magic number (file header)
   */
  async detectByMagicNumber(data: Uint8Array): Promise<{
    format: SupportedFormat | null
    confidence: number
  }> {
    if (!data || data.length < 12) {
      return { format: null, confidence: 0 }
    }

    for (const [format, config] of Object.entries(this.supportedFormats)) {
      for (const magicNumber of config.magicNumbers) {
        if (this.matchesMagicNumber(data, magicNumber)) {
          // Special handling for WAV files (need both RIFF and WAVE)
          if (format === 'wav') {
            const hasRIFF = this.matchesMagicNumber(data, { bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 })
            const hasWAVE = this.matchesMagicNumber(data, { bytes: [0x57, 0x41, 0x56, 0x45], offset: 8 })
            if (hasRIFF && hasWAVE) {
              return { format: format as SupportedFormat, confidence: 0.95 }
            }
          } else {
            return { format: format as SupportedFormat, confidence: 0.9 }
          }
        }
      }
    }

    return { format: null, confidence: 0 }
  }

  /**
   * Comprehensive format detection combining extension and magic number
   */
  async detectFormat(fileName: string, data: Uint8Array): Promise<FormatDetectionResult> {
    const extensionResult = this.detectByExtension(fileName)
    const magicNumberResult = await this.detectByMagicNumber(data)

    let format: SupportedFormat | null = null
    let confidence = 0
    let detectionMethod: 'extension' | 'magic_number' | 'combined' = 'extension'

    // Combine results for best accuracy
    if (extensionResult.format === magicNumberResult.format && extensionResult.format) {
      // Both methods agree - highest confidence
      format = extensionResult.format
      confidence = 0.95
      detectionMethod = 'combined'
    } else if (magicNumberResult.format && magicNumberResult.confidence > 0.8) {
      // Trust magic number over extension if high confidence
      format = magicNumberResult.format
      confidence = magicNumberResult.confidence
      detectionMethod = 'magic_number'
    } else if (extensionResult.format) {
      // Fall back to extension
      format = extensionResult.format
      confidence = 0.6
      detectionMethod = 'extension'
    }

    // Extract additional metadata for detected format
    let metadata: Partial<AudioMetadata> = {}
    if (format) {
      metadata = await this.extractBasicMetadata(data, format)
    }

    return {
      format,
      mimeType: format ? this.supportedFormats[format].mimeType : null,
      confidence,
      detectionMethod,
      isSupported: format !== null,
      metadata
    }
  }

  /**
   * Validate audio file against rules
   */
  async validateAudioFile(
    fileName: string,
    data: Uint8Array,
    rules: Partial<AudioValidationRules> = {}
  ): Promise<AudioFileValidation> {
    const validationRules: AudioValidationRules = {
      ...this.defaultValidationRules,
      ...rules
    }

    const errors: string[] = []
    const warnings: string[] = []

    try {
      // File size validation
      if (data.length > validationRules.maxFileSize) {
        errors.push(
          `File size (${this.formatBytes(data.length)}) exceeds maximum allowed size (${this.formatBytes(validationRules.maxFileSize)})`
        )
      }

      if (data.length === 0) {
        errors.push('File is empty')
        return {
          isValid: false,
          errors,
          warnings
        }
      }

      // Format detection and validation
      const formatResult = await this.detectFormat(fileName, data)
      
      if (!formatResult.format) {
        errors.push('Could not detect audio format')
      } else if (!validationRules.supportedFormats.includes(formatResult.format)) {
        errors.push(`Format '${formatResult.format}' is not supported`)
      }

      // Header validation
      if (validationRules.requireValidHeaders && formatResult.confidence < 0.7) {
        errors.push('File appears to have invalid or corrupted headers')
      }

      // Extract and validate metadata
      let metadata: AudioMetadata | undefined
      if (formatResult.format) {
        try {
          metadata = await this.extractMetadata(data, formatResult.format)
          
          // Duration validation
          if (metadata.duration > validationRules.maxDuration) {
            errors.push(`Duration (${this.formatDuration(metadata.duration)}) exceeds maximum allowed (${this.formatDuration(validationRules.maxDuration)})`)
          }
          
          if (metadata.duration < validationRules.minDuration) {
            errors.push(`Duration (${this.formatDuration(metadata.duration)}) is below minimum required (${this.formatDuration(validationRules.minDuration)})`)
          }

          // Quality warnings
          if (metadata.bitrate && metadata.bitrate < 64000) {
            warnings.push('Low bitrate detected - audio quality may be poor')
          }

          if (metadata.sampleRate && metadata.sampleRate < 16000) {
            warnings.push('Low sample rate detected - audio quality may be limited')
          }

        } catch (error) {
          warnings.push('Could not extract complete metadata from file')
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        detectedFormat: formatResult.format || undefined,
        metadata
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown validation error'
      errors.push(`Validation error: ${errorMessage}`)
      
      return {
        isValid: false,
        errors,
        warnings
      }
    }
  }

  /**
   * Extract basic metadata from audio file
   */
  async extractMetadata(data: Uint8Array, format: SupportedFormat): Promise<AudioMetadata> {
    const metadata: AudioMetadata = {
      format,
      size: data.length,
      duration: 0,
      bitrate: 0,
      sampleRate: 0,
      channels: 0,
      hasMetadata: false
    }

    try {
      // Format-specific metadata extraction
      switch (format) {
        case 'mp3':
          return await this.extractMP3Metadata(data, metadata)
        case 'wav':
          return await this.extractWAVMetadata(data, metadata)
        case 'flac':
          return await this.extractFLACMetadata(data, metadata)
        case 'm4a':
          return await this.extractM4AMetadata(data, metadata)
        case 'ogg':
          return await this.extractOGGMetadata(data, metadata)
        default:
          return metadata
      }
    } catch (error) {
      console.warn(`Failed to extract metadata for ${format}:`, error)
      return metadata
    }
  }

  /**
   * Extract basic metadata without format-specific parsing
   */
  private async extractBasicMetadata(data: Uint8Array, format: SupportedFormat): Promise<Partial<AudioMetadata>> {
    return {
      format,
      size: data.length,
      hasMetadata: await this.hasMetadata(data, format)
    }
  }

  /**
   * Check if file has metadata tags
   */
  private async hasMetadata(data: Uint8Array, format: SupportedFormat): Promise<boolean> {
    switch (format) {
      case 'mp3':
        // Check for ID3 tags
        return data.length > 3 && 
               data[0] === 0x49 && data[1] === 0x44 && data[2] === 0x33 // ID3v2
      case 'flac':
        // FLAC always has metadata blocks
        return true
      case 'm4a':
        // Check for metadata atoms
        return data.length > 8
      default:
        return false
    }
  }

  /**
   * Extract MP3-specific metadata
   */
  private async extractMP3Metadata(data: Uint8Array, metadata: AudioMetadata): Promise<AudioMetadata> {
    // Check for ID3v2 tag
    if (data.length > 10 && data[0] === 0x49 && data[1] === 0x44 && data[2] === 0x33) {
      metadata.hasMetadata = true
      metadata.hasID3 = true
      metadata.version = `ID3v2.${data[3]}.${data[4]}`
    }

    // Estimate duration based on file size and average bitrate
    const estimatedBitrate = 128000 // Default assumption
    metadata.estimatedBitrate = estimatedBitrate
    metadata.estimatedDuration = (data.length * 8) / estimatedBitrate // seconds
    metadata.bitrate = estimatedBitrate
    metadata.sampleRate = 44100 // Common default
    metadata.channels = 2 // Stereo default

    return metadata
  }

  /**
   * Extract WAV-specific metadata
   */
  private async extractWAVMetadata(data: Uint8Array, metadata: AudioMetadata): Promise<AudioMetadata> {
    if (data.length < 44) return metadata // Minimum WAV header size

    // Read WAV header
    const view = new DataView(data.buffer, data.byteOffset)
    
    try {
      // Check for RIFF/WAVE
      const riff = String.fromCharCode(...data.slice(0, 4))
      const wave = String.fromCharCode(...data.slice(8, 12))
      
      if (riff === 'RIFF' && wave === 'WAVE') {
        // Read format chunk
        metadata.sampleRate = view.getUint32(24, true)
        metadata.channels = view.getUint16(22, true)
        metadata.bitrate = view.getUint32(28, true) * 8
        
        // Calculate duration
        const dataSize = view.getUint32(40, true)
        const bytesPerSecond = view.getUint32(28, true)
        metadata.duration = bytesPerSecond > 0 ? dataSize / bytesPerSecond : 0
      }
    } catch (error) {
      console.warn('Failed to parse WAV header:', error)
    }

    return metadata
  }

  /**
   * Extract FLAC-specific metadata
   */
  private async extractFLACMetadata(data: Uint8Array, metadata: AudioMetadata): Promise<AudioMetadata> {
    if (data.length < 34) return metadata // Minimum FLAC header size

    try {
      // FLAC signature: fLaC
      if (data[0] === 0x66 && data[1] === 0x4C && data[2] === 0x61 && data[3] === 0x43) {
        metadata.hasMetadata = true
        
        // Read STREAMINFO block (simplified)
        const view = new DataView(data.buffer, data.byteOffset + 8)
        metadata.sampleRate = (view.getUint32(10, false) >> 12) & 0xFFFFF
        metadata.channels = ((view.getUint32(12, false) >> 9) & 0x7) + 1
        
        // FLAC is lossless
        metadata.bitrate = 0 // Variable for FLAC
      }
    } catch (error) {
      console.warn('Failed to parse FLAC header:', error)
    }

    return metadata
  }

  /**
   * Extract M4A-specific metadata
   */
  private async extractM4AMetadata(data: Uint8Array, metadata: AudioMetadata): Promise<AudioMetadata> {
    // M4A/MP4 parsing is complex - simplified version
    metadata.estimatedBitrate = 128000 // Default assumption
    metadata.sampleRate = 44100
    metadata.channels = 2
    metadata.hasMetadata = true

    return metadata
  }

  /**
   * Extract OGG-specific metadata
   */
  private async extractOGGMetadata(data: Uint8Array, metadata: AudioMetadata): Promise<AudioMetadata> {
    // OGG parsing is complex - simplified version
    if (data.length > 4 && 
        data[0] === 0x4F && data[1] === 0x67 && data[2] === 0x67 && data[3] === 0x53) {
      metadata.hasMetadata = true
      metadata.estimatedBitrate = 128000 // Default assumption
      metadata.sampleRate = 44100
      metadata.channels = 2
    }

    return metadata
  }

  /**
   * Helper: Extract file extension from filename
   */
  private extractFileExtension(fileName: string): string | null {
    const lastDot = fileName.lastIndexOf('.')
    if (lastDot === -1 || lastDot === fileName.length - 1) {
      return null
    }
    return fileName.substring(lastDot + 1).toLowerCase()
  }

  /**
   * Helper: Check if data matches magic number pattern
   */
  private matchesMagicNumber(
    data: Uint8Array, 
    magicNumber: { bytes: number[], offset: number }
  ): boolean {
    if (data.length < magicNumber.offset + magicNumber.bytes.length) {
      return false
    }

    for (let i = 0; i < magicNumber.bytes.length; i++) {
      if (data[magicNumber.offset + i] !== magicNumber.bytes[i]) {
        return false
      }
    }

    return true
  }

  /**
   * Helper: Format bytes for human reading
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * Helper: Format duration for human reading
   */
  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  /**
   * Get list of all supported formats
   */
  getSupportedFormats(): SupportedFormat[] {
    return Object.keys(this.supportedFormats) as SupportedFormat[]
  }

  /**
   * Get MIME type for format
   */
  getMimeType(format: SupportedFormat): string | null {
    return this.supportedFormats[format]?.mimeType || null
  }

  /**
   * Check if format is supported
   */
  isFormatSupported(format: string): format is SupportedFormat {
    return format in this.supportedFormats
  }
}