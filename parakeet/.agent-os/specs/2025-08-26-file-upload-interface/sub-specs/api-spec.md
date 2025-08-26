# API Specification

This is the API specification for the spec detailed in @.agent-os/specs/2025-08-26-file-upload-interface/spec.md

> Created: 2025-08-26
> Version: 1.0.0

## API Overview

The File Upload Interface requires a comprehensive set of RESTful API endpoints to handle file uploads, format conversion, progress tracking, and file management. All endpoints follow Next.js App Router conventions with proper TypeScript types and error handling.

## Base Configuration

- **Base URL**: `/api`
- **Content-Type**: `application/json` (except file uploads: `multipart/form-data`)
- **Authentication**: None (local application)
- **Rate Limiting**: 100 requests per minute per client
- **Max File Size**: 100MB per file
- **Supported Formats**: MP3, WAV, M4A, FLAC, OGG, WMA

## API Endpoints

### 1. File Upload Endpoint

**POST** `/api/upload`

Handles multipart file uploads with validation and temporary storage.

#### Request Headers
```typescript
{
  'Content-Type': 'multipart/form-data'
}
```

#### Request Body (multipart/form-data)
```typescript
{
  files: File[];           // Array of audio files
  sessionId?: string;      // Optional session identifier
  convertFormat?: string;  // Target format (default: 'wav')
  outputQuality?: string;  // Quality setting ('low'|'medium'|'high')
}
```

#### Response (200 OK)
```typescript
{
  success: true;
  sessionId: string;
  uploads: Array<{
    id: string;
    filename: string;
    originalName: string;
    fileSize: number;
    duration: number;
    mimeType: string;
    status: 'uploaded';
    uploadedAt: string;
  }>;
}
```

#### Response (400 Bad Request)
```typescript
{
  success: false;
  error: string;
  details?: {
    invalidFiles: Array<{
      filename: string;
      reason: string;
    }>;
  };
}
```

#### Example Request
```bash
curl -X POST /api/upload \
  -F "files=@audio1.mp3" \
  -F "files=@audio2.wav" \
  -F "sessionId=sess_123456" \
  -F "convertFormat=wav"
```

---

### 2. URL Import Endpoint

**POST** `/api/upload/url`

Downloads and imports audio files from remote URLs.

#### Request Body
```typescript
{
  urls: string[];          // Array of audio file URLs
  sessionId?: string;      // Optional session identifier
  convertFormat?: string;  // Target format (default: 'wav')
  outputQuality?: string;  // Quality setting
}
```

#### Response (200 OK)
```typescript
{
  success: true;
  sessionId: string;
  imports: Array<{
    url: string;
    status: 'downloading' | 'completed' | 'failed';
    fileId?: string;
    filename?: string;
    error?: string;
  }>;
}
```

#### Example Request
```typescript
fetch('/api/upload/url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    urls: ['https://example.com/audio.mp3'],
    sessionId: 'sess_123456',
    convertFormat: 'wav'
  })
});
```

---

### 3. Upload Progress Tracking

**GET** `/api/upload/progress/:sessionId`

Server-Sent Events endpoint for real-time upload and download progress.

#### URL Parameters
- `sessionId`: Session identifier from upload request

#### Response (text/event-stream)
```typescript
// Event stream format
data: {
  "type": "upload_progress",
  "fileId": "file_123",
  "filename": "audio.mp3",
  "progress": 75,
  "bytesUploaded": 7500000,
  "totalBytes": 10000000,
  "speed": "2.1 MB/s",
  "eta": "5s"
}

data: {
  "type": "upload_complete",
  "fileId": "file_123",
  "filename": "audio.mp3",
  "fileSize": 10000000,
  "duration": 180.5
}

data: {
  "type": "error",
  "fileId": "file_123",
  "filename": "audio.mp3",
  "error": "File size exceeds limit"
}
```

#### Example Usage
```typescript
const eventSource = new EventSource(`/api/upload/progress/${sessionId}`);
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle progress updates
};
```

---

### 4. Format Conversion Endpoint

**POST** `/api/convert`

Triggers FFmpeg-based audio format conversion for uploaded files.

#### Request Body
```typescript
{
  fileIds: string[];       // Array of uploaded file IDs
  targetFormat: string;    // Target format (wav, mp3, flac, etc.)
  quality?: string;        // Quality preset ('low'|'medium'|'high')
  sampleRate?: number;     // Target sample rate (8000, 16000, 44100, 48000)
  channels?: number;       // Mono (1) or Stereo (2)
  bitrate?: string;        // For lossy formats (128k, 192k, 256k, 320k)
}
```

#### Response (200 OK)
```typescript
{
  success: true;
  conversionJobs: Array<{
    jobId: string;
    fileId: string;
    originalFilename: string;
    targetFormat: string;
    status: 'queued';
    createdAt: string;
  }>;
}
```

#### Example Request
```typescript
fetch('/api/convert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fileIds: ['file_123', 'file_456'],
    targetFormat: 'wav',
    quality: 'high',
    sampleRate: 16000,
    channels: 1
  })
});
```

---

### 5. Conversion Status Endpoint

**GET** `/api/convert/status/:fileId`

Checks the status of format conversion jobs.

#### URL Parameters
- `fileId`: Uploaded file identifier

#### Response (200 OK)
```typescript
{
  success: true;
  fileId: string;
  conversionJobs: Array<{
    jobId: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    progress: number;        // 0-100
    originalFormat: string;
    targetFormat: string;
    outputPath?: string;     // Available when completed
    error?: string;          // Available when failed
    startedAt?: string;
    completedAt?: string;
    processingTime?: number; // Seconds
  }>;
}
```

---

### 6. File Management - List Files

**GET** `/api/files`

Retrieves a list of uploaded and processed files.

#### Query Parameters
```typescript
{
  page?: number;           // Page number (default: 1)
  limit?: number;          // Items per page (default: 20, max: 100)
  status?: string;         // Filter by status
  format?: string;         // Filter by format
  sortBy?: string;         // Sort field (uploadedAt, filename, fileSize)
  sortOrder?: 'asc' | 'desc'; // Sort direction
}
```

#### Response (200 OK)
```typescript
{
  success: true;
  files: Array<{
    id: string;
    filename: string;
    originalName: string;
    fileSize: number;
    duration: number;
    format: string;
    mimeType: string;
    status: 'uploaded' | 'converting' | 'converted' | 'transcribing' | 'completed' | 'failed';
    uploadedAt: string;
    convertedAt?: string;
    transcribedAt?: string;
    outputFormats: string[]; // Available output formats
    transcriptionStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  }>;
  pagination: {
    page: number;
    limit: number;
    totalFiles: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

---

### 7. File Management - Get File Details

**GET** `/api/files/:id`

Retrieves detailed information about a specific file.

#### URL Parameters
- `id`: File identifier

#### Response (200 OK)
```typescript
{
  success: true;
  file: {
    id: string;
    filename: string;
    originalName: string;
    fileSize: number;
    duration: number;
    format: string;
    mimeType: string;
    status: string;
    uploadedAt: string;
    metadata: {
      sampleRate: number;
      channels: number;
      bitrate: string;
      codec: string;
    };
    conversions: Array<{
      id: string;
      targetFormat: string;
      status: string;
      outputPath?: string;
      createdAt: string;
      completedAt?: string;
    }>;
    transcriptions: Array<{
      id: string;
      format: string;      // srt, txt, vtt, json
      status: string;
      outputPath?: string;
      createdAt: string;
      completedAt?: string;
    }>;
  };
}
```

---

### 8. File Management - Delete Files

**DELETE** `/api/files/:id`

Removes uploaded files and associated conversions/transcriptions.

#### URL Parameters
- `id`: File identifier

#### Query Parameters
```typescript
{
  deleteConversions?: boolean; // Delete converted files (default: true)
  deleteTranscriptions?: boolean; // Delete transcription files (default: true)
}
```

#### Response (200 OK)
```typescript
{
  success: true;
  deletedFile: {
    id: string;
    filename: string;
    deletedAt: string;
  };
  deletedConversions: number;
  deletedTranscriptions: number;
}
```

---

### 9. Batch File Operations

**POST** `/api/files/batch`

Performs batch operations on multiple files.

#### Request Body
```typescript
{
  operation: 'delete' | 'convert' | 'transcribe';
  fileIds: string[];
  options?: {
    targetFormat?: string;    // For convert operation
    outputFormat?: string;    // For transcribe operation
    deleteConversions?: boolean; // For delete operation
  };
}
```

#### Response (200 OK)
```typescript
{
  success: true;
  operation: string;
  results: Array<{
    fileId: string;
    status: 'success' | 'failed';
    jobId?: string;          // For convert/transcribe operations
    error?: string;          // For failed operations
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}
```

---

### 10. System Status Endpoint

**GET** `/api/status`

Provides system status and health information.

#### Response (200 OK)
```typescript
{
  success: true;
  system: {
    status: 'healthy' | 'degraded' | 'down';
    uptime: number;          // Seconds
    version: string;
    lastUpdated: string;
  };
  storage: {
    totalSpace: number;      // Bytes
    usedSpace: number;       // Bytes
    availableSpace: number;  // Bytes
    fileCount: number;
  };
  processing: {
    activeJobs: number;
    queuedJobs: number;
    completedToday: number;
    failedToday: number;
  };
  dependencies: {
    ffmpeg: {
      available: boolean;
      version?: string;
    };
    parakeetMlx: {
      available: boolean;
      version?: string;
    };
    database: {
      connected: boolean;
      migrations: 'up-to-date' | 'pending';
    };
  };
}
```

## Error Handling

### Standard Error Response Format
```typescript
{
  success: false;
  error: string;           // Human-readable error message
  code?: string;           // Machine-readable error code
  details?: any;           // Additional error context
  timestamp: string;       // ISO 8601 timestamp
  requestId?: string;      // For debugging purposes
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Invalid request parameters or file format
- `FILE_TOO_LARGE`: File exceeds maximum size limit
- `UNSUPPORTED_FORMAT`: Audio format not supported
- `CONVERSION_FAILED`: FFmpeg conversion process failed
- `STORAGE_ERROR`: File system storage issues
- `RATE_LIMITED`: Too many requests from client
- `INTERNAL_ERROR`: Unexpected server error

### HTTP Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Requested resource not found
- `413 Payload Too Large`: File size exceeds limits
- `415 Unsupported Media Type`: Invalid audio format
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server processing error
- `503 Service Unavailable`: System temporarily unavailable

## WebSocket Events

### Real-time Progress Updates

**Connection**: `/api/socket`

#### Event Types
```typescript
// File upload progress
{
  type: 'upload_progress';
  sessionId: string;
  fileId: string;
  progress: number;        // 0-100
  bytesUploaded: number;
  totalBytes: number;
  speed: string;           // "2.1 MB/s"
  eta: string;            // "30s"
}

// Conversion progress
{
  type: 'conversion_progress';
  jobId: string;
  fileId: string;
  progress: number;        // 0-100
  stage: 'analyzing' | 'converting' | 'finalizing';
  eta: string;
}

// Transcription progress
{
  type: 'transcription_progress';
  jobId: string;
  fileId: string;
  progress: number;        // 0-100
  stage: 'preprocessing' | 'transcribing' | 'postprocessing';
  eta: string;
}

// Job completion
{
  type: 'job_complete';
  jobId: string;
  fileId: string;
  jobType: 'upload' | 'conversion' | 'transcription';
  outputPath?: string;
  duration: number;        // Processing time in seconds
}

// Error events
{
  type: 'error';
  jobId?: string;
  fileId?: string;
  error: string;
  code: string;
}
```

## Rate Limiting

### Limits per Client IP
- **File Uploads**: 10 files per minute
- **API Requests**: 100 requests per minute
- **WebSocket Connections**: 5 concurrent connections
- **Total Storage**: 1GB per client session

### Implementation
```typescript
// Rate limiting headers in responses
{
  'X-RateLimit-Limit': '100',
  'X-RateLimit-Remaining': '95',
  'X-RateLimit-Reset': '1640995200', // Unix timestamp
  'X-RateLimit-RetryAfter': '60'     // Seconds (when limited)
}
```

## Security Considerations

### File Validation
- MIME type verification against file headers
- File extension whitelist enforcement
- Malicious file pattern detection
- Size and duration limits enforcement

### Input Sanitization
- URL validation for remote imports
- Filename sanitization for storage
- Path traversal prevention
- SQL injection protection via parameterized queries

### Resource Protection
- Temporary file cleanup after processing
- Memory usage monitoring and limits
- Disk space monitoring and cleanup
- Process timeout enforcement for conversions