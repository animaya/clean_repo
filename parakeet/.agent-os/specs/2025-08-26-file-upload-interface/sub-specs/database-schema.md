# Database Schema

This is the database schema implementation for the spec detailed in @.agent-os/specs/2025-08-26-file-upload-interface/spec.md

> Created: 2025-08-26
> Version: 1.0.0

## Schema Changes

### Overview
The File Upload Interface requires a SQLite database schema to track uploaded files, their processing status, transcription jobs, and associated metadata. This schema supports the Phase 1 MVP requirements for file management and prepares for seamless transcription engine integration.

### Core Tables

#### uploaded_files
Primary table for tracking all uploaded audio files and their conversion status.

```sql
CREATE TABLE uploaded_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    original_format TEXT NOT NULL,
    converted_format TEXT,
    file_size INTEGER NOT NULL,
    converted_file_size INTEGER,
    file_path TEXT NOT NULL,
    converted_file_path TEXT,
    upload_method TEXT NOT NULL CHECK(upload_method IN ('drag_drop', 'url_download')),
    source_url TEXT,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    conversion_started_at DATETIME,
    conversion_completed_at DATETIME,
    status TEXT NOT NULL DEFAULT 'uploaded' CHECK(status IN ('uploaded', 'converting', 'converted', 'conversion_failed', 'ready_for_transcription')),
    error_message TEXT,
    checksum TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_uploaded_files_status ON uploaded_files(status);
CREATE INDEX idx_uploaded_files_upload_date ON uploaded_files(upload_date);
CREATE INDEX idx_uploaded_files_filename ON uploaded_files(filename);
```

#### transcription_jobs
Tracks transcription processing jobs linked to uploaded files.

```sql
CREATE TABLE transcription_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id INTEGER NOT NULL,
    job_uuid TEXT UNIQUE NOT NULL,
    model_name TEXT NOT NULL DEFAULT 'mlx-community/parakeet-tdt-0.6b-v3',
    output_format TEXT NOT NULL DEFAULT 'srt' CHECK(output_format IN ('srt', 'txt', 'vtt', 'json')),
    output_file_path TEXT,
    status TEXT NOT NULL DEFAULT 'queued' CHECK(status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
    progress_percentage INTEGER DEFAULT 0 CHECK(progress_percentage >= 0 AND progress_percentage <= 100),
    estimated_duration INTEGER,
    actual_duration INTEGER,
    error_message TEXT,
    transcription_text TEXT,
    word_count INTEGER,
    confidence_score REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    started_at DATETIME,
    completed_at DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES uploaded_files(id) ON DELETE CASCADE
);

CREATE INDEX idx_transcription_jobs_status ON transcription_jobs(status);
CREATE INDEX idx_transcription_jobs_file_id ON transcription_jobs(file_id);
CREATE INDEX idx_transcription_jobs_job_uuid ON transcription_jobs(job_uuid);
CREATE INDEX idx_transcription_jobs_created_at ON transcription_jobs(created_at);
```

#### file_metadata
Stores detailed audio file metadata extracted during processing.

```sql
CREATE TABLE file_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id INTEGER NOT NULL,
    duration_seconds REAL,
    sample_rate INTEGER,
    channels INTEGER,
    bit_rate INTEGER,
    codec TEXT,
    format_long_name TEXT,
    tags_title TEXT,
    tags_artist TEXT,
    tags_album TEXT,
    tags_date TEXT,
    tags_genre TEXT,
    language_detected TEXT,
    audio_quality_score REAL,
    noise_level TEXT CHECK(noise_level IN ('low', 'medium', 'high')),
    extracted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES uploaded_files(id) ON DELETE CASCADE
);

CREATE INDEX idx_file_metadata_file_id ON file_metadata(file_id);
CREATE INDEX idx_file_metadata_duration ON file_metadata(duration_seconds);
CREATE INDEX idx_file_metadata_language ON file_metadata(language_detected);
```

#### upload_sessions
Tracks user upload sessions for progress monitoring and batch operations.

```sql
CREATE TABLE upload_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_uuid TEXT UNIQUE NOT NULL,
    total_files INTEGER NOT NULL DEFAULT 0,
    completed_files INTEGER DEFAULT 0,
    failed_files INTEGER DEFAULT 0,
    total_size_bytes INTEGER DEFAULT 0,
    processed_size_bytes INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed', 'failed', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_upload_sessions_status ON upload_sessions(status);
CREATE INDEX idx_upload_sessions_session_uuid ON upload_sessions(session_uuid);
```

#### session_files
Links uploaded files to their upload sessions for batch tracking.

```sql
CREATE TABLE session_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    file_id INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES upload_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES uploaded_files(id) ON DELETE CASCADE,
    UNIQUE(session_id, file_id)
);

CREATE INDEX idx_session_files_session_id ON session_files(session_id);
CREATE INDEX idx_session_files_file_id ON session_files(file_id);
```

## Migrations

### Migration: 001_initial_schema.sql
Creates the core database schema for file upload and transcription management.

```sql
-- Migration: 001_initial_schema
-- Created: 2025-08-26
-- Description: Initial schema for file upload interface and transcription system

BEGIN TRANSACTION;

-- Create uploaded_files table
CREATE TABLE uploaded_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    original_format TEXT NOT NULL,
    converted_format TEXT,
    file_size INTEGER NOT NULL,
    converted_file_size INTEGER,
    file_path TEXT NOT NULL,
    converted_file_path TEXT,
    upload_method TEXT NOT NULL CHECK(upload_method IN ('drag_drop', 'url_download')),
    source_url TEXT,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    conversion_started_at DATETIME,
    conversion_completed_at DATETIME,
    status TEXT NOT NULL DEFAULT 'uploaded' CHECK(status IN ('uploaded', 'converting', 'converted', 'conversion_failed', 'ready_for_transcription')),
    error_message TEXT,
    checksum TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for uploaded_files
CREATE INDEX idx_uploaded_files_status ON uploaded_files(status);
CREATE INDEX idx_uploaded_files_upload_date ON uploaded_files(upload_date);
CREATE INDEX idx_uploaded_files_filename ON uploaded_files(filename);

-- Create transcription_jobs table
CREATE TABLE transcription_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id INTEGER NOT NULL,
    job_uuid TEXT UNIQUE NOT NULL,
    model_name TEXT NOT NULL DEFAULT 'mlx-community/parakeet-tdt-0.6b-v3',
    output_format TEXT NOT NULL DEFAULT 'srt' CHECK(output_format IN ('srt', 'txt', 'vtt', 'json')),
    output_file_path TEXT,
    status TEXT NOT NULL DEFAULT 'queued' CHECK(status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
    progress_percentage INTEGER DEFAULT 0 CHECK(progress_percentage >= 0 AND progress_percentage <= 100),
    estimated_duration INTEGER,
    actual_duration INTEGER,
    error_message TEXT,
    transcription_text TEXT,
    word_count INTEGER,
    confidence_score REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    started_at DATETIME,
    completed_at DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES uploaded_files(id) ON DELETE CASCADE
);

-- Create indexes for transcription_jobs
CREATE INDEX idx_transcription_jobs_status ON transcription_jobs(status);
CREATE INDEX idx_transcription_jobs_file_id ON transcription_jobs(file_id);
CREATE INDEX idx_transcription_jobs_job_uuid ON transcription_jobs(job_uuid);
CREATE INDEX idx_transcription_jobs_created_at ON transcription_jobs(created_at);

-- Create file_metadata table
CREATE TABLE file_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id INTEGER NOT NULL,
    duration_seconds REAL,
    sample_rate INTEGER,
    channels INTEGER,
    bit_rate INTEGER,
    codec TEXT,
    format_long_name TEXT,
    tags_title TEXT,
    tags_artist TEXT,
    tags_album TEXT,
    tags_date TEXT,
    tags_genre TEXT,
    language_detected TEXT,
    audio_quality_score REAL,
    noise_level TEXT CHECK(noise_level IN ('low', 'medium', 'high')),
    extracted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES uploaded_files(id) ON DELETE CASCADE
);

-- Create indexes for file_metadata
CREATE INDEX idx_file_metadata_file_id ON file_metadata(file_id);
CREATE INDEX idx_file_metadata_duration ON file_metadata(duration_seconds);
CREATE INDEX idx_file_metadata_language ON file_metadata(language_detected);

-- Create upload_sessions table
CREATE TABLE upload_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_uuid TEXT UNIQUE NOT NULL,
    total_files INTEGER NOT NULL DEFAULT 0,
    completed_files INTEGER DEFAULT 0,
    failed_files INTEGER DEFAULT 0,
    total_size_bytes INTEGER DEFAULT 0,
    processed_size_bytes INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed', 'failed', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for upload_sessions
CREATE INDEX idx_upload_sessions_status ON upload_sessions(status);
CREATE INDEX idx_upload_sessions_session_uuid ON upload_sessions(session_uuid);

-- Create session_files table
CREATE TABLE session_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    file_id INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES upload_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES uploaded_files(id) ON DELETE CASCADE,
    UNIQUE(session_id, file_id)
);

-- Create indexes for session_files
CREATE INDEX idx_session_files_session_id ON session_files(session_id);
CREATE INDEX idx_session_files_file_id ON session_files(file_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_uploaded_files_updated_at 
    AFTER UPDATE ON uploaded_files
BEGIN
    UPDATE uploaded_files SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_transcription_jobs_updated_at 
    AFTER UPDATE ON transcription_jobs
BEGIN
    UPDATE transcription_jobs SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_upload_sessions_updated_at 
    AFTER UPDATE ON upload_sessions
BEGIN
    UPDATE upload_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

COMMIT;
```

### Future Migration Considerations

#### Migration: 002_add_user_preferences.sql (Phase 2)
Future enhancement for user-specific transcription preferences and settings.

#### Migration: 003_add_batch_processing.sql (Phase 2)
Schema extensions for advanced batch processing and queue management features.

#### Migration: 004_add_audio_analysis.sql (Phase 3)
Enhanced audio analysis and quality metrics for improved transcription accuracy.

## Data Relationships

### Key Relationships
1. **uploaded_files → transcription_jobs**: One-to-many relationship allowing multiple transcription jobs per file (different formats/models)
2. **uploaded_files → file_metadata**: One-to-one relationship for detailed audio metadata
3. **upload_sessions → session_files → uploaded_files**: Many-to-many relationship for batch upload tracking
4. **transcription_jobs**: Self-contained with foreign key to uploaded_files for job management

### Cascade Behavior
- Deleting an uploaded file cascades to remove all associated transcription jobs, metadata, and session links
- Upload sessions maintain referential integrity through session_files junction table
- Transcription jobs store results independently to prevent data loss during file cleanup

## Performance Considerations

### Indexing Strategy
- Primary indexes on frequently queried status fields for quick filtering
- Composite indexes on upload dates and file metadata for reporting queries
- UUID indexes for external API access and job tracking

### Storage Optimization
- File paths stored as TEXT for flexibility across different storage backends
- Large text fields (transcription_text, error_message) only populated when needed
- Metadata extracted asynchronously to avoid blocking upload pipeline

### Cleanup Strategy
- Automated cleanup of old upload sessions and completed jobs
- File system synchronization with database records
- Archival strategy for long-term transcription history