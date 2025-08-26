# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-08-26-file-upload-interface/spec.md

> Created: 2025-08-26
> Version: 1.0.0

## Technical Requirements

### Next.js App Router Implementation
- **Framework**: Next.js 15.5.0 with App Router architecture
- **Language**: TypeScript with strict type checking
- **Build Tool**: Turbopack for development optimization
- **React Version**: 19.1.0
- **Pages Structure**: 
  - `/` - Main upload interface
  - `/api/upload` - Server-side upload handling API route
  - `/api/transcribe` - Transcription processing endpoint

### Drag-and-Drop UI Components
- **Styling Framework**: Tailwind CSS v4
- **Component Architecture**:
  - `DropZone` component with visual feedback states
  - `FilePreview` component for uploaded files
  - `ProgressBar` component for upload/processing status
  - `TranscriptionResults` component for displaying output
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### File Validation System
- **Supported Formats**: MP3, WAV, M4A, FLAC
- **File Size Limits**: 100MB maximum per file
- **Validation Rules**:
  - MIME type verification
  - File extension validation
  - Audio format detection using file headers
  - Duration limits (up to 2 hours per file)
- **Error Handling**: User-friendly error messages with retry options

### Progress Tracking
- **Upload Progress**: Real-time progress bars using XMLHttpRequest
- **Processing Status**: WebSocket connection for transcription progress
- **State Management**: React state with progress percentages
- **Visual Indicators**: 
  - Spinner animations during processing
  - Success/error states with appropriate icons
  - Estimated time remaining calculations

### SQLite Integration
- **Database Schema**:
  ```sql
  CREATE TABLE uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    duration REAL,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    transcription_status TEXT DEFAULT 'pending',
    transcription_result TEXT,
    output_format TEXT DEFAULT 'srt'
  );
  ```
- **ORM**: Prisma for type-safe database operations
- **Migrations**: Automated database schema management
- **Connection**: SQLite file-based database for local development

### Client-Side Processing Architecture
- **File Handling**: Browser File API for local file operations
- **Audio Processing**: Web Audio API for duration detection
- **Format Conversion**: FFmpeg WebAssembly for browser-based conversion
- **Memory Management**: Chunked processing for large files
- **Error Recovery**: Automatic retry mechanisms with exponential backoff

## Approach

### Architecture Pattern
- **Client-Server Separation**: Browser handles UI and basic validation, server processes transcription
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Component-Based Design**: Reusable React components with TypeScript interfaces
- **API-First Design**: RESTful endpoints for all server operations

### Data Flow
1. User drags/selects audio file
2. Client-side validation and preview generation
3. File upload with progress tracking
4. Server-side processing with parakeet-mlx
5. Real-time status updates via WebSocket
6. Results display and download options

### State Management
- **Local State**: React useState for UI components
- **Server State**: Custom hooks for API data fetching
- **File State**: Context provider for upload management
- **Progress State**: Real-time updates via WebSocket connection

### Performance Optimizations
- **Lazy Loading**: Components loaded on demand
- **File Streaming**: Chunked uploads for large files
- **Caching**: Browser cache for processed results
- **Compression**: Gzip compression for API responses

## External Dependencies

### Core Dependencies
- **@ffmpeg/ffmpeg**: ^0.12.10
  - WebAssembly-based FFmpeg for browser audio processing
  - Format conversion and audio analysis
  - No server-side processing required

- **react-dropzone**: ^14.2.3
  - Drag-and-drop file selection interface
  - Multiple file support with validation
  - Accessibility features built-in

- **@prisma/client**: ^5.7.1
  - Type-safe database operations
  - Automated migrations and schema management
  - SQLite adapter for local development

### Additional File Handling Libraries
- **file-type**: ^19.0.0
  - Reliable file type detection from buffer
  - MIME type validation for uploaded files

- **react-audio-player**: ^0.17.0
  - Audio preview functionality
  - Playback controls for uploaded files

- **socket.io-client**: ^4.7.4
  - Real-time progress updates during transcription
  - WebSocket connection management

### Development Dependencies
- **@types/node**: ^20.10.6
- **@typescript-eslint/eslint-plugin**: ^6.16.0
- **@typescript-eslint/parser**: ^6.16.0
- **eslint**: ^8.56.0
- **eslint-config-next**: 15.5.0
- **typescript**: ^5.3.3

### Runtime Dependencies
- **parakeet-mlx**: Latest version
  - Server-side transcription processing
  - MLX-optimized models for Apple Silicon
  - Multiple output format support (SRT, TXT, VTT, JSON)

- **multer**: ^1.4.5-lts.1
  - Multipart file upload handling
  - Temporary file storage management

- **ws**: ^8.16.0
  - WebSocket server for real-time updates
  - Progress notification system