import { beforeAll, afterEach, afterAll, beforeEach } from 'vitest'
import { PrismaClient } from '@prisma/client'
import '@testing-library/jest-dom'

// Setup React for testing
import React from 'react'
global.React = React

// Use unique database for each test run to avoid conflicts
const testDbName = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.db`

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:./${testDbName}`
    }
  }
})

beforeAll(async () => {
  // Create database schema for tests
  await prisma.$executeRaw`PRAGMA foreign_keys = ON;`

  // Create tables manually since we can't run migrations in tests
  await prisma.$executeRaw`
    CREATE TABLE uploaded_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      originalFilename TEXT NOT NULL,
      originalFormat TEXT NOT NULL,
      convertedFormat TEXT,
      fileSize INTEGER NOT NULL,
      convertedFileSize INTEGER,
      filePath TEXT NOT NULL,
      convertedFilePath TEXT,
      uploadMethod TEXT NOT NULL CHECK(uploadMethod IN ('drag_drop', 'url_download')),
      sourceUrl TEXT,
      uploadDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      conversionStartedAt DATETIME,
      conversionCompletedAt DATETIME,
      status TEXT NOT NULL DEFAULT 'uploaded' CHECK(status IN ('uploaded', 'converting', 'converted', 'conversion_failed', 'ready_for_transcription')),
      errorMessage TEXT,
      checksum TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );`

  await prisma.$executeRaw`
    CREATE TABLE upload_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionUuid TEXT UNIQUE NOT NULL,
      totalFiles INTEGER NOT NULL DEFAULT 0,
      completedFiles INTEGER DEFAULT 0,
      failedFiles INTEGER DEFAULT 0,
      totalSizeBytes INTEGER DEFAULT 0,
      processedSizeBytes INTEGER DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed', 'failed', 'cancelled')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      completedAt DATETIME,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );`

  await prisma.$executeRaw`
    CREATE TABLE transcription_jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fileId INTEGER NOT NULL,
      jobUuid TEXT UNIQUE NOT NULL,
      modelName TEXT NOT NULL DEFAULT 'mlx-community/parakeet-tdt-0.6b-v3',
      outputFormat TEXT NOT NULL DEFAULT 'srt' CHECK(outputFormat IN ('srt', 'txt', 'vtt', 'json')),
      outputFilePath TEXT,
      status TEXT NOT NULL DEFAULT 'queued' CHECK(status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
      progressPercentage INTEGER DEFAULT 0 CHECK(progressPercentage >= 0 AND progressPercentage <= 100),
      estimatedDuration INTEGER,
      actualDuration INTEGER,
      errorMessage TEXT,
      transcriptionText TEXT,
      wordCount INTEGER,
      confidenceScore REAL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      startedAt DATETIME,
      completedAt DATETIME,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (fileId) REFERENCES uploaded_files(id) ON DELETE CASCADE
    );`

  await prisma.$executeRaw`
    CREATE TABLE file_metadata (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fileId INTEGER NOT NULL,
      durationSeconds REAL,
      sampleRate INTEGER,
      channels INTEGER,
      bitRate INTEGER,
      codec TEXT,
      formatLongName TEXT,
      tagsTitle TEXT,
      tagsArtist TEXT,
      tagsAlbum TEXT,
      tagsDate TEXT,
      tagsGenre TEXT,
      languageDetected TEXT,
      audioQualityScore REAL,
      noiseLevel TEXT CHECK(noiseLevel IN ('low', 'medium', 'high')),
      extractedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (fileId) REFERENCES uploaded_files(id) ON DELETE CASCADE
    );`

  await prisma.$executeRaw`
    CREATE TABLE session_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionId INTEGER NOT NULL,
      fileId INTEGER NOT NULL,
      orderIndex INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sessionId) REFERENCES upload_sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (fileId) REFERENCES uploaded_files(id) ON DELETE CASCADE,
      UNIQUE(sessionId, fileId)
    );`

  // Create indexes
  await prisma.$executeRaw`CREATE INDEX idx_uploaded_files_status ON uploaded_files(status);`
  await prisma.$executeRaw`CREATE INDEX idx_uploaded_files_upload_date ON uploaded_files(uploadDate);`
  await prisma.$executeRaw`CREATE INDEX idx_uploaded_files_filename ON uploaded_files(filename);`
  
  await prisma.$executeRaw`CREATE INDEX idx_transcription_jobs_status ON transcription_jobs(status);`
  await prisma.$executeRaw`CREATE INDEX idx_transcription_jobs_file_id ON transcription_jobs(fileId);`
  await prisma.$executeRaw`CREATE INDEX idx_transcription_jobs_job_uuid ON transcription_jobs(jobUuid);`
  await prisma.$executeRaw`CREATE INDEX idx_transcription_jobs_created_at ON transcription_jobs(createdAt);`
  
  await prisma.$executeRaw`CREATE INDEX idx_file_metadata_file_id ON file_metadata(fileId);`
  await prisma.$executeRaw`CREATE INDEX idx_file_metadata_duration ON file_metadata(durationSeconds);`
  await prisma.$executeRaw`CREATE INDEX idx_file_metadata_language ON file_metadata(languageDetected);`
  
  await prisma.$executeRaw`CREATE INDEX idx_upload_sessions_status ON upload_sessions(status);`
  await prisma.$executeRaw`CREATE INDEX idx_upload_sessions_session_uuid ON upload_sessions(sessionUuid);`
  
  await prisma.$executeRaw`CREATE INDEX idx_session_files_session_id ON session_files(sessionId);`
  await prisma.$executeRaw`CREATE INDEX idx_session_files_file_id ON session_files(fileId);`

  // Create triggers for updated_at
  await prisma.$executeRaw`
    CREATE TRIGGER update_uploaded_files_updated_at 
        AFTER UPDATE ON uploaded_files
    BEGIN
        UPDATE uploaded_files SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;`

  await prisma.$executeRaw`
    CREATE TRIGGER update_transcription_jobs_updated_at 
        AFTER UPDATE ON transcription_jobs
    BEGIN
        UPDATE transcription_jobs SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;`

  await prisma.$executeRaw`
    CREATE TRIGGER update_upload_sessions_updated_at 
        AFTER UPDATE ON upload_sessions
    BEGIN
        UPDATE upload_sessions SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;`
})

afterEach(() => {
  // Cleanup after each test
})

afterAll(async () => {
  // Global cleanup after all tests
  await prisma.$disconnect()
})