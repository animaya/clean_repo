import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'
import type {
  ConversionOptions,
  ConversionResult,
  ConversionProgress,
  AudioMetadata,
  SupportedFormat,
  ProgressTracker
} from '../../types/audio'
import { ConversionError } from '../../types/audio'

/**
 * FFmpeg WebAssembly-based audio conversion service
 * Provides client-side audio format conversion capabilities
 */
export class FFmpegConversionService implements ProgressTracker {
  private static instance: FFmpegConversionService | null = null
  private ffmpeg: FFmpeg
  private isInitialized = false
  private progressCallbacks: Set<(progress: ConversionProgress) => void> = new Set()
  private currentProgress: ConversionProgress = {
    percentage: 0,
    currentStep: 'Initializing',
    estimatedTimeRemaining: 0
  }

  private constructor() {
    this.ffmpeg = new FFmpeg()
  }

  /**
   * Get singleton instance of FFmpeg conversion service
   */
  static async getInstance(): Promise<FFmpegConversionService> {
    if (!FFmpegConversionService.instance) {
      FFmpegConversionService.instance = new FFmpegConversionService()
      await FFmpegConversionService.instance.initialize()
    }
    return FFmpegConversionService.instance
  }

  /**
   * Initialize FFmpeg WebAssembly
   */
  private async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      this.updateProgress({
        percentage: 10,
        currentStep: 'Loading FFmpeg WebAssembly',
        estimatedTimeRemaining: 30
      })

      // Load FFmpeg WebAssembly from CDN
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
      this.ffmpeg.on('log', ({ message }) => {
        console.log('[FFmpeg]', message)
      })

      this.ffmpeg.on('progress', ({ progress, time }) => {
        const percentage = Math.round(progress * 100)
        const estimatedTotal = this.estimateConversionTime()
        const timeElapsed = time / 1000000 // Convert microseconds to seconds
        const estimatedRemaining = Math.max(0, estimatedTotal - timeElapsed)

        this.updateProgress({
          percentage,
          currentStep: 'Converting audio',
          estimatedTimeRemaining: estimatedRemaining
        })
      })

      await this.ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      })

      this.isInitialized = true
      
      this.updateProgress({
        percentage: 20,
        currentStep: 'FFmpeg initialized',
        estimatedTimeRemaining: 0
      })

      console.log('FFmpeg WebAssembly initialized successfully')
    } catch (error) {
      console.error('Failed to initialize FFmpeg:', error)
      throw new ConversionError(
        'Failed to initialize FFmpeg WebAssembly',
        'FFMPEG_INIT_ERROR',
        { originalError: error }
      )
    }
  }

  /**
   * Convert audio file from one format to another
   */
  async convertAudio(
    inputData: Uint8Array,
    inputFileName: string,
    options: ConversionOptions
  ): Promise<ConversionResult> {
    const startTime = Date.now()

    try {
      if (!this.isInitialized) {
        await this.initialize()
      }

      // Validate input
      this.validateConversionOptions(options)
      this.validateInputData(inputData, inputFileName)

      this.updateProgress({
        percentage: 25,
        currentStep: 'Preparing input file',
        estimatedTimeRemaining: this.estimateConversionTime()
      })

      // Generate unique file names to avoid conflicts
      const timestamp = Date.now()
      const inputFileNameTemp = `input_${timestamp}.${options.inputFormat}`
      const outputFileNameTemp = `output_${timestamp}.${options.outputFormat}`
      const outputFileName = inputFileName.replace(
        new RegExp(`\\.${options.inputFormat}$`, 'i'),
        `.${options.outputFormat}`
      )

      // Write input file to FFmpeg filesystem
      await this.ffmpeg.writeFile(inputFileNameTemp, inputData)

      this.updateProgress({
        percentage: 30,
        currentStep: 'Building conversion command',
        estimatedTimeRemaining: this.estimateConversionTime()
      })

      // Build FFmpeg command
      const command = this.buildFFmpegCommand(
        inputFileNameTemp,
        outputFileNameTemp,
        options
      )

      console.log('FFmpeg command:', command.join(' '))

      this.updateProgress({
        percentage: 40,
        currentStep: 'Starting conversion',
        estimatedTimeRemaining: this.estimateConversionTime()
      })

      // Execute conversion
      await this.ffmpeg.exec(command)

      this.updateProgress({
        percentage: 90,
        currentStep: 'Reading converted file',
        estimatedTimeRemaining: 2
      })

      // Read converted file
      const outputData = await this.ffmpeg.readFile(outputFileNameTemp)
      const outputUint8Array = outputData instanceof Uint8Array ? outputData : new Uint8Array(outputData as unknown as ArrayBuffer)

      // Extract metadata from converted file
      const metadata = await this.extractMetadata(outputUint8Array, options.outputFormat)

      // Cleanup temporary files
      await this.cleanupTempFiles([inputFileNameTemp, outputFileNameTemp])

      const processingTime = Date.now() - startTime

      this.updateProgress({
        percentage: 100,
        currentStep: 'Conversion completed',
        estimatedTimeRemaining: 0
      })

      const result: ConversionResult = {
        success: true,
        outputData: outputUint8Array,
        outputFileName,
        metadata,
        processingTime
      }

      console.log(`Conversion completed in ${processingTime}ms:`, {
        inputSize: inputData.length,
        outputSize: outputUint8Array.length,
        format: `${options.inputFormat} → ${options.outputFormat}`
      })

      return result

    } catch (error) {
      console.error('Conversion failed:', error)
      
      const processingTime = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown conversion error'

      return {
        success: false,
        error: errorMessage,
        processingTime
      }
    }
  }

  /**
   * Build FFmpeg command array based on conversion options
   */
  private buildFFmpegCommand(
    inputFile: string,
    outputFile: string,
    options: ConversionOptions
  ): string[] {
    const command: string[] = [
      '-i', inputFile,
      '-y', // Overwrite output file
    ]

    // Audio codec selection based on output format
    const codecMap: Record<SupportedFormat, string> = {
      mp3: 'libmp3lame',
      wav: 'pcm_s16le',
      m4a: 'aac',
      flac: 'flac',
      ogg: 'libvorbis'
    }

    const codec = codecMap[options.outputFormat]
    if (codec) {
      command.push('-c:a', codec)
    }

    // Bitrate (not applicable for lossless formats like FLAC)
    if (options.outputFormat !== 'flac' && options.bitrate) {
      command.push('-b:a', options.bitrate)
    }

    // Sample rate
    if (options.sampleRate) {
      command.push('-ar', options.sampleRate.toString())
    }

    // Channels
    if (options.channels) {
      command.push('-ac', options.channels.toString())
    }

    // Quality settings
    if (options.quality === 'highest') {
      if (options.outputFormat === 'mp3') {
        command.push('-q:a', '0') // Highest quality for MP3
      } else if (options.outputFormat === 'ogg') {
        command.push('-q:a', '10') // Highest quality for OGG
      }
    } else if (options.quality === 'lowest') {
      if (options.outputFormat === 'mp3') {
        command.push('-q:a', '9') // Lowest quality for MP3
      } else if (options.outputFormat === 'ogg') {
        command.push('-q:a', '0') // Lowest quality for OGG
      }
    }

    // Audio filters
    const filters: string[] = []

    if (options.normalize) {
      filters.push('loudnorm')
    }

    if (options.fadeIn && options.fadeIn > 0) {
      filters.push(`afade=t=in:ss=0:d=${options.fadeIn}`)
    }

    if (options.fadeOut && options.fadeOut > 0) {
      filters.push(`afade=t=out:st=${Math.max(0, 60 - options.fadeOut)}:d=${options.fadeOut}`)
    }

    if (filters.length > 0) {
      command.push('-af', filters.join(','))
    }

    // Output file
    command.push(outputFile)

    return command
  }

  /**
   * Validate conversion options
   */
  private validateConversionOptions(options: ConversionOptions): void {
    const supportedFormats: SupportedFormat[] = ['mp3', 'wav', 'm4a', 'flac', 'ogg']
    
    if (!supportedFormats.includes(options.inputFormat)) {
      throw new ConversionError(
        `Unsupported input format: ${options.inputFormat}`,
        'UNSUPPORTED_INPUT_FORMAT',
        { format: options.inputFormat, supported: supportedFormats }
      )
    }

    if (!supportedFormats.includes(options.outputFormat)) {
      throw new ConversionError(
        `Unsupported output format: ${options.outputFormat}`,
        'UNSUPPORTED_OUTPUT_FORMAT',
        { format: options.outputFormat, supported: supportedFormats }
      )
    }

    if (options.inputFormat === options.outputFormat) {
      throw new ConversionError(
        'Input and output formats cannot be the same',
        'SAME_FORMAT_ERROR',
        { format: options.inputFormat }
      )
    }

    // Validate bitrate format
    if (options.bitrate && !/^\d+k?$/i.test(options.bitrate)) {
      throw new ConversionError(
        `Invalid bitrate format: ${options.bitrate}. Use format like '128k' or '320000'`,
        'INVALID_BITRATE',
        { bitrate: options.bitrate }
      )
    }

    // Validate sample rate
    const validSampleRates = [8000, 16000, 22050, 44100, 48000, 96000, 192000]
    if (options.sampleRate && !validSampleRates.includes(options.sampleRate)) {
      throw new ConversionError(
        `Invalid sample rate: ${options.sampleRate}. Supported rates: ${validSampleRates.join(', ')}`,
        'INVALID_SAMPLE_RATE',
        { sampleRate: options.sampleRate, valid: validSampleRates }
      )
    }

    // Validate channels
    if (options.channels && ![1, 2].includes(options.channels)) {
      throw new ConversionError(
        `Invalid channel count: ${options.channels}. Only mono (1) and stereo (2) are supported`,
        'INVALID_CHANNELS',
        { channels: options.channels }
      )
    }
  }

  /**
   * Validate input data
   */
  private validateInputData(data: Uint8Array, fileName: string): void {
    if (!data || data.length === 0) {
      throw new ConversionError(
        'Invalid or empty file data',
        'EMPTY_FILE',
        { fileName, size: data?.length || 0 }
      )
    }

    // Check for minimum file size (basic header check)
    if (data.length < 100) {
      throw new ConversionError(
        'File too small to be a valid audio file',
        'FILE_TOO_SMALL',
        { fileName, size: data.length, minimum: 100 }
      )
    }

    // Maximum file size check (300MB)
    const maxSize = 300 * 1024 * 1024
    if (data.length > maxSize) {
      throw new ConversionError(
        `File too large. Maximum size is ${maxSize / 1024 / 1024}MB`,
        'FILE_TOO_LARGE',
        { fileName, size: data.length, maximum: maxSize }
      )
    }
  }

  /**
   * Extract metadata from converted file
   */
  private async extractMetadata(data: Uint8Array, format: SupportedFormat): Promise<AudioMetadata> {
    // For now, return basic metadata. In a full implementation,
    // this would use FFprobe or similar to extract detailed metadata
    return {
      format,
      size: data.length,
      duration: 0, // Would be extracted from FFprobe
      bitrate: this.estimateBitrate(data, format),
      sampleRate: 44100, // Would be extracted
      channels: 2, // Would be extracted
      hasMetadata: false
    }
  }

  /**
   * Estimate bitrate based on file size and format
   */
  private estimateBitrate(data: Uint8Array, format: SupportedFormat): number {
    // Rough estimation - in real implementation would use FFprobe
    const sizeInKB = data.length / 1024
    const estimatedDurationMinutes = 3 // Rough estimate
    
    if (format === 'flac') {
      return Math.round((sizeInKB * 8) / (estimatedDurationMinutes * 60)) // kbps
    } else if (format === 'wav') {
      return 1411 // Standard CD quality
    } else {
      return 128 // Default for compressed formats
    }
  }

  /**
   * Estimate conversion time based on file size and target format
   */
  private estimateConversionTime(): number {
    // Basic estimation - would be more sophisticated in practice
    return Math.random() * 10 + 5 // 5-15 seconds estimate
  }

  /**
   * Clean up temporary files from FFmpeg filesystem
   */
  private async cleanupTempFiles(fileNames: string[]): Promise<void> {
    for (const fileName of fileNames) {
      try {
        await this.ffmpeg.deleteFile(fileName)
      } catch (error) {
        console.warn(`Failed to cleanup temporary file ${fileName}:`, error)
        // Don't throw - cleanup failures shouldn't break the conversion
      }
    }
  }

  /**
   * Progress tracking implementation
   */
  onProgress(callback: (progress: ConversionProgress) => void): void {
    this.progressCallbacks.add(callback)
  }

  offProgress(callback: (progress: ConversionProgress) => void): void {
    this.progressCallbacks.delete(callback)
  }

  updateProgress(progress: Partial<ConversionProgress>): void {
    this.currentProgress = {
      ...this.currentProgress,
      ...progress
    }

    // Notify all listeners
    this.progressCallbacks.forEach(callback => {
      try {
        callback(this.currentProgress)
      } catch (error) {
        console.error('Error in progress callback:', error)
      }
    })
  }

  /**
   * Get current progress
   */
  getCurrentProgress(): ConversionProgress {
    return { ...this.currentProgress }
  }

  /**
   * Reset progress to initial state
   */
  resetProgress(): void {
    this.currentProgress = {
      percentage: 0,
      currentStep: 'Ready',
      estimatedTimeRemaining: 0
    }
  }

  /**
   * Terminate FFmpeg instance and cleanup resources
   */
  async terminate(): Promise<void> {
    try {
      await this.ffmpeg.terminate()
      this.isInitialized = false
      this.progressCallbacks.clear()
      FFmpegConversionService.instance = null
      console.log('FFmpeg instance terminated')
    } catch (error) {
      console.error('Error terminating FFmpeg:', error)
    }
  }
}