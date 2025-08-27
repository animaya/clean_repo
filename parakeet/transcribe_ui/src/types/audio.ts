// Audio processing and conversion types

export type SupportedFormat = 'mp3' | 'wav' | 'm4a' | 'flac' | 'ogg'

export type ConversionQuality = 'lowest' | 'low' | 'standard' | 'high' | 'highest'

export interface ConversionOptions {
  inputFormat: SupportedFormat
  outputFormat: SupportedFormat
  bitrate: string // e.g., '128k', '320k'
  sampleRate: number // e.g., 44100, 48000
  channels: number // 1 for mono, 2 for stereo
  quality: ConversionQuality
  normalize?: boolean
  fadeIn?: number // seconds
  fadeOut?: number // seconds
}

export interface AudioMetadata {
  format: string
  size: number
  duration: number // seconds
  bitrate: number // bits per second
  sampleRate: number // Hz
  channels: number
  codec?: string
  title?: string
  artist?: string
  album?: string
  year?: string
  genre?: string
  hasMetadata?: boolean
  estimatedDuration?: number
  estimatedBitrate?: number
  hasID3?: boolean
  version?: string
}

export interface ConversionResult {
  success: boolean
  outputData?: Uint8Array
  outputFileName?: string
  metadata?: AudioMetadata
  processingTime?: number
  error?: string
}

export interface ConversionProgress {
  percentage: number // 0-100
  currentStep: string
  estimatedTimeRemaining: number // seconds
}

export interface FormatDetectionResult {
  format: SupportedFormat | null
  mimeType: string | null
  confidence: number // 0-1
  detectionMethod: 'extension' | 'magic_number' | 'combined'
  isSupported: boolean
  metadata?: Partial<AudioMetadata>
}

export interface ConversionJob {
  id: string
  inputFile: Uint8Array
  inputFileName: string
  options: ConversionOptions
  status: 'pending' | 'processing' | 'completed' | 'failed'
  priority: number // 1 = highest priority
  progress?: ConversionProgress
  result?: ConversionResult
  errorMessage?: string
  createdAt: Date
  updatedAt: Date
  startedAt?: Date
  completedAt?: Date
}

export interface QueueStats {
  total: number
  pending: number
  processing: number
  completed: number
  failed: number
}

// FFmpeg specific types
export interface FFmpegCommand {
  input: string
  output: string
  options: string[]
}

export interface FFmpegProgress {
  frames: number
  fps: number
  stream_0_0_q: number
  bitrate: string
  total_size: number
  out_time_us: number
  out_time_ms: number
  out_time: string
  dup_frames: number
  drop_frames: number
  speed: number
  progress: 'continue' | 'end'
}

// Audio file validation types
export interface AudioFileValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  detectedFormat?: SupportedFormat
  metadata?: AudioMetadata
}

export interface AudioValidationRules {
  maxFileSize: number // bytes
  maxDuration: number // seconds
  minDuration: number // seconds
  supportedFormats: SupportedFormat[]
  requireValidHeaders: boolean
  allowCorruptedFiles: boolean
}

// Progress tracking types
export interface ProgressTracker {
  onProgress: (callback: (progress: ConversionProgress) => void) => void
  offProgress: (callback: (progress: ConversionProgress) => void) => void
  updateProgress: (progress: Partial<ConversionProgress>) => void
}

// Error types
export class ConversionError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ConversionError'
  }
}

export class FormatDetectionError extends Error {
  constructor(
    message: string,
    public fileName: string,
    public details?: any
  ) {
    super(message)
    this.name = 'FormatDetectionError'
  }
}

export class QueueError extends Error {
  constructor(
    message: string,
    public jobId?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'QueueError'
  }
}

// Export errors for easy importing
export { ConversionError as AudioConversionError }
export { QueueError as AudioQueueError }