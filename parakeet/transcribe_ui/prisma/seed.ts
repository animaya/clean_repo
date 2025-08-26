import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean up existing data (for development)
  console.log('🧹 Cleaning up existing data...')
  await prisma.sessionFiles.deleteMany()
  await prisma.uploadSessions.deleteMany()
  await prisma.fileMetadata.deleteMany()
  await prisma.transcriptionJobs.deleteMany()
  await prisma.uploadedFiles.deleteMany()

  // Create sample upload sessions
  console.log('📦 Creating upload sessions...')
  const session1 = await prisma.uploadSessions.create({
    data: {
      sessionUuid: 'session-demo-001',
      totalFiles: 2,
      completedFiles: 2,
      failedFiles: 0,
      totalSizeBytes: 5120000,
      processedSizeBytes: 5120000,
      status: 'completed',
      completedAt: new Date()
    }
  })

  const session2 = await prisma.uploadSessions.create({
    data: {
      sessionUuid: 'session-demo-002',
      totalFiles: 1,
      completedFiles: 0,
      failedFiles: 0,
      totalSizeBytes: 2048000,
      processedSizeBytes: 0,
      status: 'active'
    }
  })

  // Create sample uploaded files
  console.log('📁 Creating uploaded files...')
  const file1 = await prisma.uploadedFiles.create({
    data: {
      filename: 'sample-podcast-episode-001.mp3',
      originalFilename: 'My Awesome Podcast Episode.mp3',
      originalFormat: 'mp3',
      convertedFormat: 'wav',
      fileSize: 2560000,
      convertedFileSize: 2800000,
      filePath: '/uploads/2024/08/26/sample-podcast-episode-001.mp3',
      convertedFilePath: '/uploads/2024/08/26/sample-podcast-episode-001.wav',
      uploadMethod: 'drag_drop',
      uploadDate: new Date('2024-08-26T10:30:00Z'),
      conversionStartedAt: new Date('2024-08-26T10:31:00Z'),
      conversionCompletedAt: new Date('2024-08-26T10:32:00Z'),
      status: 'converted',
      checksum: 'sha256:abc123def456ghi789jkl012mno345pqr678stu901vwx234yz'
    }
  })

  const file2 = await prisma.uploadedFiles.create({
    data: {
      filename: 'meeting-recording-q3-review.wav',
      originalFilename: 'Q3 Business Review Meeting.wav',
      originalFormat: 'wav',
      fileSize: 2560000,
      filePath: '/uploads/2024/08/26/meeting-recording-q3-review.wav',
      uploadMethod: 'drag_drop',
      uploadDate: new Date('2024-08-26T14:15:00Z'),
      status: 'ready_for_transcription',
      checksum: 'sha256:def456ghi789jkl012mno345pqr678stu901vwx234yz567abc'
    }
  })

  const file3 = await prisma.uploadedFiles.create({
    data: {
      filename: 'webinar-audio-download.mp3',
      originalFilename: 'AI Innovation Webinar.mp3',
      originalFormat: 'mp3',
      fileSize: 2048000,
      filePath: '/uploads/2024/08/26/webinar-audio-download.mp3',
      uploadMethod: 'url_download',
      sourceUrl: 'https://example.com/webinar-audio.mp3',
      uploadDate: new Date('2024-08-26T16:45:00Z'),
      status: 'uploaded',
      checksum: 'sha256:ghi789jkl012mno345pqr678stu901vwx234yz567abc123def'
    }
  })

  // Link files to sessions
  console.log('🔗 Linking files to sessions...')
  await prisma.sessionFiles.create({
    data: {
      sessionId: session1.id,
      fileId: file1.id,
      orderIndex: 0
    }
  })

  await prisma.sessionFiles.create({
    data: {
      sessionId: session1.id,
      fileId: file2.id,
      orderIndex: 1
    }
  })

  await prisma.sessionFiles.create({
    data: {
      sessionId: session2.id,
      fileId: file3.id,
      orderIndex: 0
    }
  })

  // Create file metadata
  console.log('📊 Creating file metadata...')
  await prisma.fileMetadata.create({
    data: {
      fileId: file1.id,
      durationSeconds: 1847.3,
      sampleRate: 44100,
      channels: 2,
      bitRate: 128000,
      codec: 'mp3',
      formatLongName: 'MP3 (MPEG audio layer 3)',
      tagsTitle: 'My Awesome Podcast Episode',
      tagsArtist: 'Podcast Host',
      tagsAlbum: 'Tech Talks Podcast',
      tagsDate: '2024',
      tagsGenre: 'Technology',
      languageDetected: 'en',
      audioQualityScore: 0.92,
      noiseLevel: 'low'
    }
  })

  await prisma.fileMetadata.create({
    data: {
      fileId: file2.id,
      durationSeconds: 3600.0,
      sampleRate: 48000,
      channels: 1,
      bitRate: 256000,
      codec: 'pcm_s16le',
      formatLongName: 'WAV / WAVE (Waveform Audio)',
      languageDetected: 'en',
      audioQualityScore: 0.98,
      noiseLevel: 'medium'
    }
  })

  await prisma.fileMetadata.create({
    data: {
      fileId: file3.id,
      durationSeconds: 2700.5,
      sampleRate: 44100,
      channels: 2,
      bitRate: 192000,
      codec: 'mp3',
      formatLongName: 'MP3 (MPEG audio layer 3)',
      tagsTitle: 'AI Innovation Webinar',
      tagsArtist: 'Tech Conference',
      tagsDate: '2024',
      languageDetected: 'en',
      audioQualityScore: 0.89,
      noiseLevel: 'low'
    }
  })

  // Create transcription jobs
  console.log('⚙️ Creating transcription jobs...')
  await prisma.transcriptionJobs.create({
    data: {
      fileId: file1.id,
      jobUuid: 'job-transcription-001',
      modelName: 'mlx-community/parakeet-tdt-0.6b-v3',
      outputFormat: 'srt',
      outputFilePath: '/transcripts/sample-podcast-episode-001.srt',
      status: 'completed',
      progressPercentage: 100,
      estimatedDuration: 300,
      actualDuration: 287,
      transcriptionText: 'Welcome to another episode of Tech Talks Podcast...',
      wordCount: 2847,
      confidenceScore: 0.94,
      startedAt: new Date('2024-08-26T10:35:00Z'),
      completedAt: new Date('2024-08-26T10:39:47Z')
    }
  })

  await prisma.transcriptionJobs.create({
    data: {
      fileId: file2.id,
      jobUuid: 'job-transcription-002',
      modelName: 'mlx-community/parakeet-tdt-0.6b-v3',
      outputFormat: 'txt',
      status: 'queued',
      progressPercentage: 0
    }
  })

  await prisma.transcriptionJobs.create({
    data: {
      fileId: file3.id,
      jobUuid: 'job-transcription-003',
      modelName: 'mlx-community/parakeet-tdt-0.6b-v3',
      outputFormat: 'vtt',
      status: 'processing',
      progressPercentage: 45,
      estimatedDuration: 420,
      startedAt: new Date('2024-08-26T17:00:00Z')
    }
  })

  console.log('✅ Database seeding completed successfully!')

  // Print summary
  const fileCount = await prisma.uploadedFiles.count()
  const sessionCount = await prisma.uploadSessions.count()
  const jobCount = await prisma.transcriptionJobs.count()
  const metadataCount = await prisma.fileMetadata.count()

  console.log(`📈 Summary:`)
  console.log(`   • ${fileCount} uploaded files`)
  console.log(`   • ${sessionCount} upload sessions`)
  console.log(`   • ${jobCount} transcription jobs`)
  console.log(`   • ${metadataCount} metadata records`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })