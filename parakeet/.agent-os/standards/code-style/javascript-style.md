# TypeScript Style Guide

## TypeScript Specific Guidelines

### Type Definitions
- Always define explicit types for function parameters and return values
- Use interfaces for object shapes: `interface AudioConfig { format: string; quality: number; }`
- Use type aliases for union types: `type OutputFormat = 'srt' | 'txt' | 'vtt' | 'json'`
- Export types from a dedicated `types.ts` file when shared across components

### React Component Types
- Use `React.FC<Props>` or explicit return types for components
- Define props interfaces in the same file as the component
- Use generics for reusable components: `<T extends AudioFormat>`

### Next.js Specific Patterns
- Use proper typing for API routes: `NextRequest` and `NextResponse`
- Type server actions with explicit parameter and return types
- Use `Metadata` export for page metadata
- Type dynamic route parameters: `{ params: { slug: string } }`

### Audio Processing Types
- Define specific types for audio formats and transcription options
- Use branded types for file paths and IDs to prevent mixing
- Type async operations with proper error handling

### ESLint Configuration
- Extend `@typescript-eslint/recommended`
- Enable strict mode in TypeScript configuration
- Use consistent import ordering (built-ins, external, internal)

## Code Organization

### File Structure
```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   └── features/       # Feature-specific components
├── lib/                # Utility functions and configurations
├── types/              # Shared type definitions
└── hooks/              # Custom React hooks
```

### Import/Export Patterns
- Use named exports for utilities and hooks
- Use default exports for React components and pages
- Group imports: React, Next.js, external libraries, internal modules
- Use absolute imports with path mapping in `tsconfig.json`
