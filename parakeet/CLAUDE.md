# Parakeet - Audio Transcription System

## Project Overview

Modern audio transcription application using Nvidia's Parakeet ASR models via MLX. Features Next.js interface with WebSocket/SSE progress tracking, comprehensive file upload system, job queue management, and enterprise-grade database architecture.

## Technology Stack

- **Framework**: Next.js 15.5.0 with App Router & Turbopack
- **Language**: TypeScript with strict typing
- **UI**: Tailwind CSS v4 with responsive design
- **Database**: SQLite with Prisma ORM & comprehensive schema
- **Queue System**: BullMQ with Redis for job management
- **Real-time**: WebSocket + Server-Sent Events for progress
- **Testing**: Vitest with React Testing Library & jsdom
- **Audio Processing**: FFmpeg & parakeet-mlx integration

## Current Architecture

### System Flow
1. **Upload Interface** → Multi-file drag/drop, URL downloads, validation
2. **File Processing** → Format detection, conversion, metadata extraction
3. **Job Queue** → Redis-backed BullMQ with priority & retry logic
4. **Transcription** → parakeet-mlx with real-time progress tracking
5. **Results Management** → Transcript storage, audit trails, cleanup

### Architectural Patterns

#### Service Layer Architecture
- **API Routes** (`src/app/api/`) - Thin controllers handling HTTP requests/responses
- **Service Layer** (`src/lib/services/`) - Core business logic isolated from transport
- **Data Layer** (Prisma models) - Database operations with type safety
- **Utility Layer** (`src/lib/`) - Shared utilities and middleware

#### Event-Driven Architecture
- **Job Queue Pattern** - BullMQ for async transcription processing
- **Observer Pattern** - WebSocket/SSE for real-time progress updates
- **Event Sourcing** - Audit logs track all state changes
- **State Machine** - Validated transitions for file/job status

#### Repository Pattern
- **File Storage** - Abstracted storage operations with atomic writes
- **Database Access** - Prisma as repository layer with transaction support
- **Cache Layer** - Redis for job state and session management

#### Error Handling Strategy
- **Result Pattern** - Consistent error/success response structures
- **Circuit Breaker** - Retry logic with exponential backoff
- **Graceful Degradation** - Fallback mechanisms (SSE when WebSocket fails)
- **Error Boundaries** - React error boundaries for UI resilience

#### Security Patterns
- **Input Validation** - Multi-layer validation (client, API, service)
- **File Sandboxing** - Isolated processing with path validation
- **Rate Limiting** - Request throttling with sliding windows
- **Audit Trail** - Complete action logging for compliance

#### Concurrency Patterns  
- **Producer-Consumer** - Upload → Queue → Worker pattern
- **Distributed Locking** - Redis-based locks prevent race conditions
- **Atomic Operations** - Database transactions for consistency
- **Connection Pooling** - WebSocket connection management

### Key Services & Components

#### Core Components
- `src/app/page.tsx` - Main UI with upload interface and results display
- `src/components/UploadInterface.tsx` - Drag/drop file upload with preview
- `src/components/ProgressTracker.tsx` - Real-time progress with WebSocket
- `src/components/TranscriptionModal.tsx` - Full transcript viewer
- `src/components/FilePreview.tsx` - File status and metadata display

#### Upload System
- `src/app/api/upload/route.ts` - Main file upload endpoint
- `src/app/api/upload/url/route.ts` - URL download processing
- `src/app/api/upload/files/route.ts` - File validation and cleanup
- `src/lib/file-storage.ts` - Storage management with atomic operations
- `src/lib/file-validation.ts` - MIME type and security validation

#### Transcription System
- `src/app/api/transcribe/route.ts` - Job creation and status API
- `src/lib/services/parakeet-transcription.ts` - Core transcription service
- `src/lib/services/transcription-queue.ts` - BullMQ job management
- `src/lib/services/progress-tracking.ts` - Real-time progress updates

#### Real-time Communication
- `src/app/api/websocket/route.ts` - WebSocket server for progress
- `src/hooks/useWebSocket.ts` - Client WebSocket connection
- `src/hooks/useProgressState.ts` - Progress state management
- `src/lib/websocket-server.ts` - WebSocket connection handling

## Database Schema

### Core Models (Prisma)
```prisma
enum FileStatus {
  UPLOADED, VALIDATING, CONVERTING, CONVERTED, 
  READY_FOR_TRANSCRIPTION, PROCESSING, COMPLETED, FAILED, ARCHIVED
}

enum TranscriptionStatus {
  QUEUED, PROCESSING, COMPLETED, FAILED, CANCELLED, RETRYING
}

model UploadedFiles {
  id                    Int @id @default(autoincrement())
  filename              String
  originalFilename      String
  mimeType              String
  fileSize              Int
  filePath              String
  convertedFilePath     String?
  uploadMethod          UploadMethod @default(DRAG_DROP)
  sourceUrl             String?
  checksum              String? @unique
  status                FileStatus @default(UPLOADED)
  // ... metadata fields, relationships, indexes
}

model TranscriptionJobs {
  id                    Int @id @default(autoincrement())
  fileId                Int
  jobUuid               String @unique
  modelName             String @default("mlx-community/parakeet-tdt-0.6b-v3")
  outputFormat          OutputFormat @default(SRT)
  status                TranscriptionStatus @default(QUEUED)
  progressPercentage    Int @default(0)
  retryCount            Int @default(0)
  transcriptionText     String?
  confidenceScore       Float?
  // ... timing, error handling, relationships
}

model FileMetadata {
  id                    Int @id @default(autoincrement())
  fileId                Int @unique
  durationSeconds       Float?
  sampleRate            Int?
  channels              Int?
  codec                 String?
  languageDetected      String?
  audioQualityScore     Float?
  // ... audio analysis fields
}

model AuditLog {
  id                    Int @id @default(autoincrement())
  action                AuditAction
  entityType            String
  entityId              Int?
  oldValues             String? // JSON
  newValues             String? // JSON
  sessionId             String?
  // ... audit trail fields
}
```

## API Endpoints

### File Management
- `POST /api/upload` - Multi-file upload with validation
- `POST /api/upload/url` - URL download and processing  
- `GET /api/upload/files` - File listing and validation
- `DELETE /api/upload/files` - File deletion and cleanup
- `GET /api/upload/progress/[sessionId]` - SSE progress stream

### Transcription
- `POST /api/transcribe` - Create transcription jobs
- `GET /api/transcribe` - Get job status and results
- `DELETE /api/transcribe` - Cancel/delete jobs
- `GET /api/transcribe/jobs` - List all jobs
- `GET /api/transcribe/health` - Service health check

### System Management
- `GET /api/websocket` - WebSocket upgrade endpoint
- `POST /api/cleanup` - Manual cleanup operations

## Configuration

### Environment Variables (src/lib/config.ts)
```bash
# Core Configuration
DATABASE_URL="file:./dev.db"
UPLOADS_DIR="/tmp/uploads"
TEMP_DIR="/tmp"
MAX_FILE_SIZE="314572800"  # 300MB
MAX_FILES_PER_REQUEST="10"

# Redis & Queue
REDIS_URL="redis://localhost:6379"
TRANSCRIPTION_QUEUE_NAME="transcription"
MAX_CONCURRENT_JOBS="3"
JOB_RETRY_ATTEMPTS="3"
JOB_TIMEOUT="3600000"  # 1 hour

# Cleanup & Timeouts  
CLEANUP_UPLOAD_HOURS="24"
CLEANUP_JOB_DAYS="7"
CLEANUP_SESSION_DAYS="30"
FILE_LOCK_TIMEOUT="30000"
TRANSCRIPTION_TIMEOUT="3600"

# Rate Limiting
RATE_LIMIT_WINDOW="900000"  # 15 minutes
RATE_LIMIT_MAX="100"
```

## Development Commands

### Core Development
```bash
cd transcribe_ui

# Development
npm run dev              # Next.js dev server with Turbopack
npm run build            # Production build  
npm run start            # Production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Create migration
npm run db:seed          # Seed test data

# Testing
npm run test             # Run Vitest tests
npm run test:ui          # Vitest UI interface
npm run test:run         # Single test run
```

### Background Workers
```bash
# Queue Workers
npm run worker:transcription      # Start transcription worker
npm run worker:transcription:dev  # Start with hot reload
```

### Maintenance
```bash
# Cleanup Operations
npm run cleanup              # Full system cleanup
npm run cleanup:dry          # Show what would be cleaned
npm run cleanup:uploads      # Clean uploaded files only
npm run cleanup:temp         # Clean temporary files only

# Advanced cleanup options
npm run cleanup -- --upload-hours 6 --verbose
npm run cleanup -- --help
```

## Key Features

### File Upload System
- **Multi-format Support**: Audio/video files with automatic conversion
- **Drag & Drop Interface**: Modern file upload with preview
- **URL Downloads**: Support for direct audio/video URLs  
- **Validation**: File type, size, content verification
- **Deduplication**: Checksum-based duplicate detection
- **Session Management**: Upload session tracking with cleanup

### Transcription Pipeline
- **Job Queue**: Redis-backed BullMQ with priority scheduling
- **Multiple Models**: Support for different Parakeet ASR models
- **Format Options**: SRT, TXT, VTT, JSON output formats
- **Progress Tracking**: Real-time updates via WebSocket/SSE
- **Error Recovery**: Automatic retry with exponential backoff
- **Quality Metrics**: Confidence scoring and audio analysis

### Real-time Progress
- **WebSocket Integration**: Bi-directional real-time communication
- **SSE Fallback**: Server-Sent Events for progress updates
- **Stage Tracking**: Detailed progress through upload/conversion/transcription
- **Time Estimation**: Realistic completion time calculations
- **Multi-job Coordination**: Progress aggregation across multiple files

### Enterprise Features
- **Audit Logging**: Complete action trail with metadata
- **Status Transitions**: Validated state machine for file/job states
- **Atomic Operations**: File operations with rollback support
- **Distributed Locking**: Race condition prevention
- **Cleanup Coordination**: Automated maintenance with safety checks
- **Error Handling**: Comprehensive error classification and recovery

## Testing Architecture

### Test Coverage
- **Unit Tests**: Services, utilities, validation logic
- **Integration Tests**: API endpoints, database operations  
- **Component Tests**: React components with user interactions
- **E2E Tests**: Complete upload-to-transcription workflows
- **Performance Tests**: Load testing for queue and WebSocket systems

### Key Test Suites
```
src/test/
├── api/                 # API endpoint testing
├── components/          # React component testing  
├── services/            # Business logic testing
├── integration/         # Cross-system testing
├── database/           # Schema and query testing
├── websocket/          # Real-time communication testing
├── security/           # Security validation testing
└── utils/              # Utility function testing
```

## Common Operations

### Adding New Model Support
1. Update model constants in `src/lib/services/parakeet-transcription.ts`
2. Add model validation in API endpoints
3. Update transcription job schema if needed
4. Add integration tests for new model

### Debugging Transcription Issues
1. Check job status in database: `TranscriptionJobs` table
2. Review Redis queue: BullMQ dashboard or Redis CLI
3. Monitor WebSocket connections: Browser dev tools
4. Check file processing logs: Service error messages
5. Validate file format support: FFmpeg compatibility

### Performance Optimization
1. **Queue Tuning**: Adjust `MAX_CONCURRENT_JOBS` based on system resources
2. **Database**: Add indexes for frequent queries, optimize cleanup schedules
3. **WebSocket**: Monitor connection count, implement connection pooling
4. **File Storage**: Use faster storage for temp files, implement file streaming
5. **Caching**: Add Redis caching for frequently accessed job status

### Security Best Practices
- **File Validation**: Always verify MIME types against file content
- **Path Security**: Use `path.resolve()` and validate all file paths
- **URL Filtering**: Maintain blocklist for malicious/restricted domains  
- **Rate Limiting**: Configure per-endpoint limits with sliding windows
- **Audit Trail**: Log all file operations and transcription jobs
- **Data Cleanup**: Ensure complete removal of sensitive data

---

**Quick Start:**
1. `cd transcribe_ui && npm install`
2. `npm run db:push` (setup database)
3. `npm run dev` (start development server)
4. Start Redis server for job queue functionality
5. Ensure `parakeet-mlx` and `ffmpeg` are available in PATH

**Production Notes:**
- Run `npm run worker:transcription` as separate process
- Configure Redis persistence and backup
- Set up file storage with adequate space and cleanup schedules
- Monitor WebSocket connection limits and memory usage