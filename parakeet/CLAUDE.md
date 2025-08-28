# Parakeet - Audio Transcription Project

## Project Overview

A comprehensive audio transcription system using Nvidia's Parakeet ASR models optimized for Apple Silicon via MLX. Features a Next.js web interface with real-time progress tracking, file upload capabilities (including URL downloads), audio format conversion, and robust cleanup systems.

## Project Configuration

- **Framework**: Next.js 15.5.0 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Turbopack
- **Database**: SQLite with Prisma ORM
- **Testing**: Vitest + React Testing Library
- **Audio Processing**: FFmpeg, parakeet-mlx
- **Code Structure**: `src/` directory organization

## Architecture Overview

### Core System Flow
1. **File Upload** → Validation → Storage → Database Record
2. **URL Download** → Content Validation → File Processing
3. **Format Conversion** → FFmpeg (if needed) → Temp Files
4. **Transcription** → parakeet-mlx → Progress Tracking → Results
5. **Cleanup** → Temporary Files Removal → Database Maintenance

### Key Technologies
- **ASR Engine**: `parakeet-mlx` with model `mlx-community/parakeet-tdt-0.6b-v3`
- **Audio Conversion**: FFmpeg with WebAssembly support
- **Real-time Progress**: Server-Sent Events (SSE)
- **File Validation**: Magic byte detection, MIME type checking
- **Storage Management**: Configurable upload limits (300MB), automatic cleanup

## Directory Structure

```
/parakeet/
├── audio/                     # Sample audio files
├── transcripts/               # Generated transcription outputs
├── temp/                      # Temporary processing files
└── transcribe_ui/             # Main Next.js application
    ├── src/
    │   ├── app/                # Next.js app router
    │   │   ├── api/            # API routes
    │   │   │   ├── upload/     # File upload endpoints
    │   │   │   ├── transcribe/ # Transcription API
    │   │   │   └── cleanup/    # Maintenance endpoints
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── components/         # React components
    │   │   ├── AudioUploader.tsx
    │   │   ├── UploadInterface.tsx
    │   │   ├── UrlUpload.tsx
    │   │   ├── ProgressBar.tsx
    │   │   └── TranscriptionModal.tsx
    │   ├── lib/                # Utility libraries
    │   │   ├── services/       # Core business logic
    │   │   │   ├── parakeet-transcription.ts
    │   │   │   ├── ffmpeg-conversion.ts
    │   │   │   └── progress-tracking.ts
    │   │   ├── middleware/     # Validation & rate limiting
    │   │   ├── database-cleanup.ts
    │   │   ├── file-validation.ts
    │   │   └── storage-management.ts
    │   ├── types/              # TypeScript definitions
    │   └── test/               # Test suites
    ├── scripts/                # Maintenance scripts
    │   └── cleanup.ts
    ├── prisma/                 # Database schema
    └── package.json
```

## Key Components & Services

### File Upload System
- **Location**: `src/components/UploadInterface.tsx`, `src/app/api/upload/`
- **Features**: Drag & drop, URL downloads, format conversion, progress tracking
- **Validation**: File size (300MB), format detection, security checks
- **Storage**: `/tmp/uploads` (configurable via `UPLOADS_DIR`)

### URL Upload System  
- **Location**: `src/components/UrlUpload.tsx`, `src/app/api/upload/url/`
- **Supported**: Audio/video URLs, GitHub Pages, Wikimedia, direct file links
- **Blocked**: GitHub main, Kaggle, Google Drive, Dropbox (configurable)
- **Validation**: Content-Type checking, file size limits, hostname filtering

### Transcription Service
- **Location**: `src/lib/services/parakeet-transcription.ts`
- **Command**: `parakeet-mlx {path} --model {model} --output-format {format}`
- **Models**: `mlx-community/parakeet-tdt-0.6b-v3`, `mlx-community/parakeet-ctc-0.6b-v3`
- **Formats**: TXT, SRT, VTT, JSON
- **Features**: Video-to-audio conversion, progress callbacks, automatic cleanup

### Progress Tracking
- **Location**: `src/lib/services/progress-tracking.ts`, `src/app/page.tsx`
- **Method**: Server-Sent Events (SSE) with realistic time estimates
- **Calculation**: Based on file count, estimated duration, processing complexity
- **Updates**: Real-time progress with stage information (preparing, transcribing, processing)

### Cleanup System
- **Location**: `src/lib/database-cleanup.ts`, `scripts/cleanup.ts`
- **Auto-cleanup**: Temporary files after transcription, converted audio files
- **Manual**: CLI script with dry-run support, API endpoint
- **Schedule**: Configurable maintenance (24h uploads, 7d jobs, 30d sessions)

## Database Schema (Prisma)

### Key Models
```prisma
model UploadedFiles {
  id                 Int       @id @default(autoincrement())
  originalFilename   String
  filePath          String
  convertedFilePath String?
  fileSize          Int
  mimeType          String
  status            String    // uploaded, converted, processing, completed, failed, archived
  uploadDate        DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

model TranscriptionJobs {
  id              Int       @id @default(autoincrement())
  fileId          Int
  status          String    // pending, processing, completed, failed
  outputFilePath  String?
  processingTime  Float?
  confidence      Float?
  createdAt       DateTime  @default(now())
  completedAt     DateTime?
}

model UploadSessions {
  id           String   @id @default(uuid())
  sessionUuid  String   @unique @default(uuid())
  status       String   // active, completed, failed, cancelled
  totalFiles   Int      @default(0)
  createdAt    DateTime @default(now())
  completedAt  DateTime?
}
```

## API Endpoints

### File Operations
- `POST /api/upload` - Multipart file upload
- `POST /api/upload/url` - URL download and processing
- `GET /api/upload/progress/{sessionId}` - SSE progress stream

### Transcription
- `POST /api/transcribe` - Start transcription job
- `GET /api/transcribe?fileId=123` - Get transcription result

### Maintenance
- `POST /api/cleanup` - Manual cleanup trigger
- `GET /api/cleanup` - Cleanup statistics

## Environment Configuration

### Required Variables
```bash
# Database
DATABASE_URL="file:./dev.db"

# Storage (optional, defaults shown)
UPLOADS_DIR="/tmp/uploads"              # Upload storage location
TEMP_DIR="/tmp"                         # Temporary files
TRANSCRIPTS_DIR="../transcripts"        # Transcription outputs

# Limits
MAX_FILE_SIZE="314572800"               # 300MB in bytes
MAX_FILES_PER_REQUEST="10"              # Upload batch limit
```

### Optional Configuration
```bash
# Cleanup intervals
CLEANUP_UPLOAD_HOURS="24"               # Clean uploads after 24h
CLEANUP_JOB_DAYS="7"                    # Archive jobs after 7 days  
CLEANUP_SESSION_DAYS="30"               # Remove old sessions

# Performance
TRANSCRIPTION_TIMEOUT="3600"            # 1 hour max per file
RATE_LIMIT_WINDOW="900000"              # 15 minutes in ms
RATE_LIMIT_MAX="100"                    # Max requests per window
```

## Development Commands

### Core Development
```bash
cd transcribe_ui

# Development server
npm run dev                 # Start with Turbopack

# Testing
npm run test               # Run Vitest tests
npm run test:ui            # Vitest UI mode
npm run test:run           # Single test run

# Database
npm run db:generate        # Generate Prisma client
npm run db:push           # Push schema changes
npm run db:migrate        # Create migration
npm run db:seed           # Seed test data
```

### Maintenance & Cleanup
```bash
# Cleanup commands
npm run cleanup            # Full system cleanup
npm run cleanup:dry        # Show what would be cleaned
npm run cleanup:uploads    # Only uploaded files
npm run cleanup:temp       # Only temporary files

# Manual script options
npm run cleanup -- --help                    # Show help
npm run cleanup -- --upload-hours 6         # Custom cleanup timing
npm run cleanup -- --verbose                 # Detailed output
```

### Build & Deploy
```bash
npm run build             # Production build with Turbopack
npm run start            # Start production server
```

## File Processing Flow

### Upload Processing
1. **Validation**: File type, size, security checks
2. **Storage**: Save to `UPLOADS_DIR` with unique filename  
3. **Database**: Create record with metadata
4. **Session**: Update upload session progress
5. **Response**: Return file ID and metadata

### URL Download Processing  
1. **URL Validation**: Hostname filtering, content-type check
2. **Download**: Stream with size limits, timeout handling
3. **Content Validation**: Magic byte detection, format verification
4. **Storage**: Save as regular uploaded file
5. **Processing**: Same flow as direct uploads

### Transcription Processing
1. **File Retrieval**: Load from storage using file ID
2. **Format Check**: Detect if video conversion needed
3. **Conversion**: FFmpeg video-to-audio (if required)
4. **Transcription**: Execute parakeet-mlx command
5. **Progress**: SSE updates throughout process
6. **Cleanup**: Remove temporary files
7. **Response**: Return transcript and metadata

## Error Handling & Validation

### File Validation
- **Size Limits**: 300MB max file size
- **Format Detection**: Magic byte validation, not just extensions
- **Security**: Path traversal prevention, malicious file detection
- **Content Validation**: Verify audio/video content matches headers

### Error Types
- `ValidationError`: Invalid input, unsupported formats
- `StorageError`: Disk space, permissions
- `TranscriptionError`: Parakeet/FFmpeg failures
- `RateLimitError`: Too many requests
- `ConversionError`: Format conversion issues

### Progress Tracking
- **Realistic Estimates**: Based on file characteristics, not random
- **Error Recovery**: Graceful handling of transcription failures
- **User Feedback**: Clear error messages and recovery suggestions

## Cleanup & Maintenance

### Automatic Cleanup
- **Post-Transcription**: Temporary files cleaned immediately
- **Converted Audio**: Removed after successful transcription
- **Transcription Outputs**: Removed after content returned to client

### Manual Maintenance
```bash
# Check what needs cleaning
npm run cleanup:dry

# Clean specific types
npm run cleanup:uploads    # Files older than 24h
npm run cleanup:temp       # All temporary files

# Custom timing
npm run cleanup -- --upload-hours 6 --verbose
```

### Scheduled Maintenance
- **Database Records**: Mark completed uploads as 'archived'
- **Physical Files**: Remove after configured intervals
- **Database Optimization**: VACUUM operations
- **Orphaned Files**: Clean database records without files

## Testing Strategy

### Test Structure
- **Unit Tests**: Individual functions and utilities
- **Integration Tests**: API endpoints, file processing
- **Component Tests**: React components with user interactions
- **E2E Tests**: Complete upload-to-transcription workflows

### Key Test Files
- `src/test/api/upload.test.ts` - Upload API testing
- `src/test/components/UploadInterface.test.tsx` - UI testing
- `src/test/services/ffmpeg-conversion.test.ts` - Audio processing
- `src/test/integration/upload-flow.test.ts` - End-to-end workflows

## Common Operations

### Adding New Audio Format Support
1. Update `SUPPORTED_FORMATS` in `src/lib/middleware/validation.ts`
2. Add MIME type mappings in `getMimeTypesForExtension()`  
3. Update FFmpeg codec mapping in `ffmpeg-conversion.ts`
4. Add validation tests

### Debugging Upload Issues
1. Check file validation: `src/lib/middleware/validation.ts`
2. Verify storage permissions: `UPLOADS_DIR` environment
3. Review database records: Check upload sessions and file status
4. Examine cleanup logs: May have been auto-cleaned

### Performance Optimization
1. **File Processing**: Adjust FFmpeg parameters for speed/quality balance
2. **Database**: Monitor cleanup schedules, adjust retention policies
3. **Storage**: Configure appropriate `UPLOADS_DIR` with sufficient space
4. **Progress Updates**: Tune SSE update frequency for responsiveness

### Security Considerations
- **File Validation**: Always verify content matches declared type
- **URL Downloads**: Maintain hostname blocklist, validate content-types
- **Path Safety**: Use `path.resolve()` and validate all file paths
- **Rate Limiting**: Configured per endpoint with sliding window
- **Cleanup**: Ensure sensitive data is properly removed

---

**Important Notes:**
- Always run cleanup scripts in dry-run mode first: `npm run cleanup:dry`
- Test transcription with small files before processing large batches
- Monitor storage usage - 300MB per file can accumulate quickly
- Check parakeet-mlx installation: `which parakeet-mlx`
- Ensure FFmpeg available for video processing: `which ffmpeg`

**Best Practices**: See @.agent-os/standards/best-practices.md