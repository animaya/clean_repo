# Implementation Sequence with Cross-References

## Phase 1: Database Foundation (Must Complete First)

### 1.1 Prisma Schema Setup
**File**: `prisma/schema.prisma`  
**Reference**: `data-model.md` lines 134-228 (complete schema)  
**Task**: Copy exact schema from data-model.md, ensure all enums and relationships match  
**Validation**: Run `npx prisma validate`

### 1.2 Database Seed Data
**File**: `prisma/seed.ts`  
**Reference**: `data-model.md` lines 260-276 (sample data requirements)  
**Task**: Create 5 users, 3 projects, 24-36 tasks with specified distribution  
**Dependencies**: Requires 1.1 complete  
**Validation**: Run seed script, verify data in Prisma Studio

### 1.3 Prisma Client Configuration
**File**: `src/lib/prisma.ts`  
**Reference**: `data-model.md` lines 229-257 (design decisions context)  
**Task**: Set up singleton Prisma client with proper Next.js configuration  
**Dependencies**: Requires 1.1 complete

## Phase 2: tRPC API Layer (Requires Phase 1)

### 2.1 tRPC Base Configuration
**Files**: 
- `src/server/api/trpc.ts` (base tRPC setup)
- `src/server/api/context.ts` (request context with session)
- `src/app/api/trpc/[trpc]/route.ts` (Next.js integration)

**Reference**: 
- `contracts/signalr-spec.md` lines 236-247 (middleware requirements)
- `research.md` session management patterns

**Dependencies**: Requires 1.3 (Prisma client)

### 2.2 Auth Router Implementation  
**File**: `src/server/api/routers/auth.ts`  
**Reference**: `contracts/signalr-spec.md` lines 18-36 (3 auth endpoints)  
**Specific Requirements**:
- `selectUser`: Input `{ userId: string }`, Output `{ user: User; sessionToken: string; expiresAt: Date }`
- `getCurrentUser`: No input, Output `User | null`  
- `logout`: No input, Output `{ success: boolean }`

**Dependencies**: Requires 2.1 (tRPC base) + session management  
**Validation**: Create contract tests for each endpoint

### 2.3 Users Router Implementation
**File**: `src/server/api/routers/users.ts`  
**Reference**: `contracts/signalr-spec.md` lines 38-50 (2 user endpoints)  
**Dependencies**: Requires 1.3 (Prisma client) + 2.1 (tRPC base)

### 2.4 Projects Router Implementation  
**File**: `src/server/api/routers/projects.ts`  
**Reference**: `contracts/signalr-spec.md` lines 52-64 (2 project endpoints)  
**Dependencies**: Requires 1.3 (Prisma client) + 2.1 (tRPC base)

### 2.5 Tasks Router Implementation
**File**: `src/server/api/routers/tasks.ts`  
**Reference**: `contracts/signalr-spec.md` lines 66-96 (5 task endpoints)  
**Critical Implementation**: 
- `updatePosition`: Must handle drag-and-drop position logic from `data-model.md` lines 243-246
- `getByProject`: Must return `TaskWithComments[]` with proper joins

**Dependencies**: Requires 1.3 + 2.1 + session middleware for protected endpoints

### 2.6 Comments Router Implementation  
**File**: `src/server/api/routers/comments.ts`  
**Reference**: `contracts/signalr-spec.md` lines 98-122 (4 comment endpoints)  
**Critical Implementation**: 
- Ownership validation: Users can only edit/delete own comments (reference `data-model.md` lines 253-256)
- All mutations require active session

**Dependencies**: Requires 1.3 + 2.1 + 2.2 (session middleware)

### 2.7 Main Router Assembly
**File**: `src/server/api/routers/_app.ts`  
**Reference**: `contracts/signalr-spec.md` lines 5-16 (router structure)  
**Dependencies**: Requires 2.2-2.6 (all sub-routers)

## Phase 3: Frontend Foundation (Can Start After Phase 1)

### 3.1 tRPC Client Configuration  
**Files**:
- `src/app/_trpc/client.ts`
- `src/app/_trpc/provider.tsx`

**Reference**: `contracts/signalr-spec.md` lines 249-282 (React Query integration patterns)  
**Dependencies**: Requires 2.7 (complete tRPC API)

### 3.2 Zustand Stores
**Files**:
- `src/store/auth.ts` (current user, session management)
- `src/store/kanban.ts` (board state, drag-and-drop)
- `src/store/ui.ts` (modals, loading states)

**Reference**: `research.md` Zustand integration patterns with tRPC  
**Dependencies**: Requires 3.1 (tRPC client)

### 3.3 Session Management Utilities
**File**: `src/lib/session.ts`  
**Reference**: `contracts/signalr-spec.md` lines 236-247 + 2-hour requirement from `spec.md` line 73  
**Task**: JWT creation, validation, cookie handling  
**Dependencies**: Requires Phase 1 (database models)

## Phase 4: UI Components (Requires Phase 3)

### 4.1 User Selection Components
**Files**:
- `src/app/page.tsx` (user selection page)
- `src/components/UserCard.tsx`

**Reference**: 
- `quickstart.md` lines 64-68 (user selection flow)
- `data-model.md` lines 260-265 (5 specific users)

**Dependencies**: Requires 3.1 (tRPC client) + 3.2 (auth store)

### 4.2 Project List Components  
**Files**:
- `src/app/projects/page.tsx`
- `src/components/ProjectCard.tsx`

**Reference**: `quickstart.md` lines 70-76 (3 specific projects)  
**Dependencies**: Requires 3.1 + 3.2

### 4.3 Kanban Board Components
**Files**:
- `src/app/projects/[id]/page.tsx` (board page)
- `src/components/kanban/KanbanBoard.tsx`
- `src/components/kanban/Column.tsx` 
- `src/components/kanban/TaskCard.tsx`

**Reference**:
- `contracts/signalr-spec.md` lines 273-276 (optimistic updates for drag-and-drop)
- `quickstart.md` lines 78-83 (4 columns, color coding)
- `research.md` @dnd-kit integration patterns

**Critical Implementation**:
- Must integrate with `tasks.updatePosition` from contracts
- Must implement color coding for assigned tasks
- Must handle optimistic updates during drag operations

**Dependencies**: Requires 3.2 (kanban store) + 2.5 (tasks API)

### 4.4 Task Detail Modal
**Files**:
- `src/components/TaskModal.tsx`
- `src/components/CommentList.tsx`
- `src/components/CommentForm.tsx`

**Reference**: `quickstart.md` lines 85-108 (comment editing permissions)  
**Dependencies**: Requires 2.5 (tasks API) + 2.6 (comments API)

## Phase 5: Integration Testing (Requires All Previous Phases)

### 5.1 tRPC Contract Tests
**Files**: `tests/contract/*.test.ts` (one per router)  
**Reference**: Each contract from `contracts/signalr-spec.md`  
**Validation**: All endpoints return expected types with real database

### 5.2 User Journey Tests  
**Files**: `tests/e2e/*.spec.ts`  
**Reference**: `quickstart.md` lines 62-120 (complete user journeys)  
**Tools**: Playwright for E2E testing

### 5.3 Drag-and-Drop Integration Tests
**File**: `tests/integration/kanban.test.ts`  
**Reference**: `quickstart.md` lines 78-83 + optimistic update requirements  
**Validation**: Position changes persist, state updates correctly

## Missing Dependencies Analysis

Based on this sequence, here are the critical missing pieces:

1. **Session Middleware Implementation**: Referenced in contracts but not detailed
2. **@dnd-kit Integration Code**: Research mentions patterns but no concrete implementation
3. **Error Boundary Components**: Contracts define errors but no UI error handling
4. **Loading State Management**: Mentioned but not architected
5. **Optimistic Update Logic**: Described but not implemented

## Recommended Next Steps

1. Create detailed implementation templates for each file
2. Add specific code examples showing integration between layers
3. Define exact validation criteria for each phase
4. Create dependency verification scripts
5. Add rollback procedures for failed integrations