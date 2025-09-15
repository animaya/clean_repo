# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Taskify is a modern kanban-style task management application built with Next.js 14, tRPC, Prisma, and PostgreSQL. The project follows a full-stack TypeScript architecture with end-to-end type safety.

## Essential Commands

### Development
```bash
npm run dev              # Start Next.js development server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues automatically
npm run prettier         # Check code formatting
npm run prettier:fix     # Fix formatting issues
npm run type-check       # Run TypeScript type checking
```

### Testing
```bash
npm run test             # Run unit tests with Vitest
npm run test:ui          # Run tests with Vitest UI
npm run test:run         # Run tests once (CI mode)
npm run test:e2e         # Run Playwright end-to-end tests
npm run test:e2e:ui      # Run E2E tests with UI
npm run test:performance # Run performance tests
npm run test:accessibility # Run accessibility tests
npm run test:all         # Run all test suites
```

### Database
```bash
npx prisma studio        # Open Prisma Studio (database browser)
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema changes to database
npx prisma migrate dev   # Create and apply migration
npx prisma db seed       # Run database seed script
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **API**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: Zustand stores
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit
- **Testing**: Vitest (unit), Playwright (E2E)

### Core Architecture Patterns

#### tRPC API Architecture
The API is organized into domain-specific routers in `src/server/api/routers/`:
- `auth.ts` - Authentication and sessions
- `users.ts` - User management
- `projects.ts` - Project CRUD operations
- `tasks.ts` - Task management and kanban operations
- `comments.ts` - Task comments

Main tRPC setup:
- `src/server/api/trpc.ts` - Core tRPC configuration with middleware
- `src/server/api/_app.ts` - Main router combining all sub-routers
- `src/server/api/context.ts` - Request context setup

#### Authentication System
- Session-based authentication using JWT tokens
- Middleware-based protection: `publicProcedure`, `protectedProcedure`, `ownerOnlyProcedure`
- User sessions stored in database with expiration
- Session token validation in tRPC context

#### State Management Architecture
Zustand stores are organized by domain:
- `src/store/auth.ts` - Authentication state with persistence
- `src/store/kanban.ts` - Kanban board state and drag-drop logic
- `src/store/ui.ts` - UI state (modals, loading states)

#### Database Schema
Key entities (see `prisma/schema.prisma`):
- **User**: Authentication and profile data with role-based access
- **Project**: Task organization containers
- **Task**: Core entities with status, position, and assignments
- **Comment**: Threaded discussions on tasks
- **Session**: Authentication tokens with expiration

#### Frontend Component Structure
- `src/components/kanban/` - Kanban board components
- `src/components/` - Shared UI components and modals
- `src/app/` - Next.js App Router pages and layouts

## Development Guidelines

### Database Operations
- Always use Prisma for database operations
- Use transactions for multi-table operations
- Include proper error handling and rollbacks
- Follow the existing indexing strategy for performance

### tRPC Procedures
- Use appropriate procedure types:
  - `publicProcedure` for unauthenticated endpoints
  - `protectedProcedure` for authenticated users
  - `ownerOnlyProcedure` for resource ownership validation
- Always validate inputs with Zod schemas
- Include proper error handling with meaningful messages

### State Management
- Use Zustand stores for complex state logic
- Keep component state minimal - prefer stores for shared state
- Use optimistic updates for better UX in kanban operations
- Persist important state (like auth) using Zustand persistence

### Testing Strategy
- Unit tests for utilities, stores, and tRPC procedures
- Integration tests for complex workflows
- E2E tests for critical user journeys
- Performance and accessibility tests for quality assurance

### Code Organization
- Group related functionality in domain folders
- Use TypeScript interfaces consistently across client/server
- Follow existing naming conventions for files and exports
- Keep components focused and composable

## Performance Considerations

- Kanban board uses optimistic updates for drag-and-drop
- Database queries are optimized with proper indexes
- tRPC batching is enabled for efficient API calls
- Use React Query (via tRPC) for caching and background refetching

## Common Pitfalls

- Always run migrations before schema changes
- Ensure proper error boundaries for kanban drag operations
- Validate user ownership before allowing task/comment modifications
- Handle session expiration gracefully in the frontend
- Use proper TypeScript types - avoid `any` types