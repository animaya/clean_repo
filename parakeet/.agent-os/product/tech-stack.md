# Technical Stack

> Last Updated: 2025-08-26
> Version: 1.0.0

## Application Framework

- **Framework:** Next.js
- **Version:** 15.5.0
- **Features:** App Router, Server Components, Turbopack

## Database

- **Primary Database:** SQLite
- **Purpose:** Local data storage, transcription history, user preferences
- **Benefits:** Zero-configuration, embedded, serverless

## JavaScript

- **Framework:** React 19.1.0
- **Language:** TypeScript
- **Build Tool:** Turbopack (Next.js 15 integrated)

## CSS Framework

- **Framework:** Tailwind CSS v4
- **Configuration:** Integrated with Next.js build system
- **Features:** Utility-first styling, responsive design

## ASR Engine

- **Core Technology:** parakeet-mlx
- **Models:** Nvidia Parakeet ASR models
- **Optimization:** MLX framework for Apple Silicon
- **Processing:** Local, privacy-preserving transcription

## Audio Processing

- **Library:** FFmpeg integration
- **Supported Formats:** MP3, WAV, M4A, FLAC
- **Features:** Format conversion, audio validation, preprocessing

## Development Tools

- **Package Manager:** npm
- **Linting:** ESLint (configured)
- **Type Checking:** TypeScript strict mode
- **Development Server:** Next.js with Turbopack

## Deployment Architecture

- **Environment:** Local/Desktop application model
- **Processing:** Client-side with MLX acceleration
- **Storage:** Local file system with SQLite
- **Security:** No cloud dependencies, complete data privacy

## Performance Optimizations

- **Hardware Acceleration:** Apple Neural Engine via MLX
- **Memory Management:** Efficient model loading and caching
- **Streaming:** Real-time processing with progress feedback
- **Batch Processing:** Queue management for multiple files