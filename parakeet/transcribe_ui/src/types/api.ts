export type SupportedAudioFormat = 'mp3' | 'wav' | 'm4a' | 'flac' | 'ogg' | 'wma';

export type UploadStatus = 'uploaded' | 'converting' | 'converted' | 'conversion_failed' | 'ready_for_transcription';

export type ErrorCode = 'VALIDATION_ERROR' | 'FILE_TOO_LARGE' | 'UNSUPPORTED_FORMAT' | 'CONVERSION_FAILED' | 'STORAGE_ERROR' | 'RATE_LIMITED' | 'INTERNAL_ERROR';

export interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  code?: ErrorCode;
  details?: any;
  timestamp?: string;
  requestId?: string;
  data?: T;
}

export interface UploadedFileInfo {
  id: string;
  filename: string;
  originalName: string;
  fileSize: number;
  duration: number;
  mimeType: string;
  status: UploadStatus;
  uploadedAt: string;
}

export interface UploadResponse extends ApiResponse {
  sessionId: string;
  uploads: UploadedFileInfo[];
}

export interface UrlImportInfo {
  url: string;
  status: 'downloading' | 'completed' | 'failed';
  fileId?: string;
  filename?: string;
  error?: string;
}

export interface UrlImportResponse extends ApiResponse {
  sessionId: string;
  imports: UrlImportInfo[];
}

export interface ValidationError {
  filename: string;
  reason: string;
}

export interface ValidationErrorResponse extends ApiResponse {
  details: {
    invalidFiles: ValidationError[];
  };
}

export interface UploadProgressEvent {
  type: 'upload_progress';
  fileId: string;
  filename: string;
  progress: number;
  bytesUploaded: number;
  totalBytes: number;
  speed: string;
  eta: string;
}

export interface UploadCompleteEvent {
  type: 'upload_complete';
  fileId: string;
  filename: string;
  fileSize: number;
  duration: number;
}

export interface ErrorEvent {
  type: 'error';
  fileId: string;
  filename: string;
  error: string;
}

export type ProgressEvent = UploadProgressEvent | UploadCompleteEvent | ErrorEvent;

export interface RateLimitHeaders {
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Reset': string;
  'X-RateLimit-RetryAfter'?: string;
}