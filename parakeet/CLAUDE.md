# Parakeet - Audio Transcription Project

## Project Configuration

- TypeScript?
- ESLint
- Tailwind CSS?
- code inside a `src/` directory
- App Router
- Turbopack? 
- sqlite db
- ffmpeg
- parakeet-mlx {path_to_audio} --model {mlx-community/parakeet-tdt-0.6b-v3} --output-format {format}

## Project Overview

This project implements an audio transcription system using Nvidia's Parakeet ASR models optimized for Apple Silicon via MLX. It consists of a Next.js web interface for transcription tasks and integrates with the parakeet-mlx Python library.

## Directory Structure

```
/parakeet/
├── audio/                  # Sample audio files
│   ├── call_1_rus.mp3
│   ├── call_2_rus.mp3
│   ├── pod_1_eng.mp3
│   ├── pod_2_eng.mp3
│   └── vitamin.mp3
├── transcribe_ui/          # Next.js web application
│   ├── src/
│   │   └── app/
│   │       ├── favicon.ico
│   │       ├── globals.css
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── public/
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── postcss.config.mjs
└── transcripts/            # Generated transcription files
    ├── call_1_rus.srt
    ├── call_2_rus.srt
    ├── call_2_rus.txt
    ├── pod_1_eng.srt
    ├── pod_2_eng.srt
    └── vitamin.srt
```

## Technology Stack

### Frontend (transcribe_ui)
- **Framework**: Next.js 15.5.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Turbopack
- **React**: 19.1.0

### Backend Integration
- **ASR Engine**: parakeet-mlx (Nvidia Parakeet models for Apple Silicon)
- **Audio Processing**: MLX framework
- **Output Formats**: SRT, TXT, VTT, JSON

## Features

- Web-based audio transcription interface
- Support for multiple audio formats (MP3, WAV)
- Real-time transcription capabilities
- Multiple output formats (SRT subtitles, plain text)
- Optimized for Apple Silicon via MLX
- Configurable transcription settings

## Development Commands

```bash
# Navigate to UI directory
cd transcribe_ui

# Install dependencies
npm install

# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start
```


- best practices are in this doc @.agent-os/standards/best-practices.md