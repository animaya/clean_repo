export type SupportedAudioFormat = 'mp3' | 'wav' | 'm4a' | 'flac' | 'ogg' | 'wma';

// Import standardized status types
import { FileStatus, TranscriptionStatus, SessionStatus, OutputFormat } from './status';

// Legacy alias for backward compatibility - will be removed
export type UploadStatus = FileStatus;

// Import standard error codes
import { ErrorCode as StandardErrorCode } from '../lib/error-handling';

// Re-export standard error codes for backwards compatibility
export type ErrorCode = StandardErrorCode;

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
  id: number; // Database primary key is always number
  filename: string;
  originalFilename: string; // Match database field name
  fileSize: number;
  duration: number;
  mimeType: string;
  status: FileStatus;
  uploadDate: string; // Match database field name - ISO string format
}

export interface UploadResponse extends ApiResponse {
  sessionId: string;
  uploads: UploadedFileInfo[];
}

export interface UrlImportInfo {
  url: string;
  status: 'downloading' | 'completed' | 'failed';
  fileId?: number; // Database ID is always number
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
  fileId: number; // Database ID is always number
  filename: string;
  progress: number;
  bytesUploaded: number;
  totalBytes: number;
  speed: string;
  eta: string;
}

export interface UploadCompleteEvent {
  type: 'upload_complete';
  fileId: number; // Database ID is always number
  filename: string;
  fileSize: number;
  duration: number;
}

export interface ErrorEvent {
  type: 'error';
  fileId: number; // Database ID is always number
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