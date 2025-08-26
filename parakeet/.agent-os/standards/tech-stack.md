# Tech Stack

## Context

Global tech stack defaults for Agent OS projects, overridable in project-specific `.agent-os/product/tech-stack.md`.

- App Framework: Next.js 15.5.0+ (App Router)
- Language: TypeScript
- Runtime: Node.js 22 LTS
- Primary Database: SQLite
- JavaScript Framework: React 19.1.0+
- Build Tool: Turbopack
- Import Strategy: ES modules
- Package Manager: npm
- CSS Framework: TailwindCSS 4.0+
- UI Components: shadcn/ui components
- Font Provider: Google Fonts
- Font Loading: Self-hosted for performance
- Icons: Lucide React components
- Code Quality: ESLint
- Audio Processing: ffmpeg
- ASR Engine: parakeet-mlx (Nvidia Parakeet models for Apple Silicon)
- ML Framework: MLX (Apple Silicon optimization)
- Directory Structure: src/ based architecture
- Output Formats: SRT, TXT, VTT, JSON
- Application Hosting: Digital Ocean App Platform/Droplets
- Hosting Region: Primary region based on user base
- Database Hosting: Local SQLite for development
- Asset Storage: Local file system for audio/transcripts
- CI/CD Platform: GitHub Actions
- CI/CD Trigger: Push to main/staging branches
- Tests: Run before deployment
- Production Environment: main branch
- Staging Environment: staging branch
