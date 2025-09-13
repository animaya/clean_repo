# Tasks: Taskify - Team Productivity Platform

**Input**: Design documents from `/Users/amirahmetzanov/go/fitbox-app/.specify/specs/001-develop-taskify-a/`
**Prerequisites**: plan.md (✓), research.md (✓), data-model.md (✓), contracts/ (✓), implementation-sequence.md (✓)

## Execution Flow (main)
```
1. Load plan.md from feature directory ✓
   → Extract: Next.js + TypeScript, tRPC, Prisma, @dnd-kit, Zustand
2. Load design documents ✓:
   → data-model.md: 5 entities (User, Project, Task, Comment, Session)
   → contracts/: 5 tRPC routers with 15 endpoints total
   → implementation-sequence.md: 5 phases with dependencies
3. Generate tasks by category ✓:
   → Setup: project structure, dependencies, database
   → Tests: 15 contract tests, 5 integration tests
   → Core: 5 routers, 3 stores, 8 components
   → Integration: session middleware, drag-and-drop
   → Polish: E2E tests, performance validation
4. Apply task rules ✓:
   → Contract tests marked [P] (different files)
   → Router implementation sequential (shared dependencies)
   → Component development marked [P] (independent)
5. Number tasks sequentially T001-T045 ✓
6. Generate dependency graph ✓
7. Parallel execution examples included ✓
8. Task completeness validated ✓
```

## Path Conventions
Using **Single Next.js Project** structure from plan.md:
- `src/` for application code
- `tests/` for all test files
- `prisma/` for database schema and migrations

## Phase 3.1: Setup & Dependencies

- [x] T001 Create Next.js 14 project structure with TypeScript configuration
- [x] T002 Initialize package.json with all dependencies: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, @trpc/server, @trpc/client, @trpc/react-query, @trpc/next, @prisma/client, prisma, zustand, @tanstack/react-query, tailwindcss, zod, jose
- [x] T003 [P] Configure ESLint, Prettier, and TypeScript strict mode
- [x] T004 [P] Set up Tailwind CSS configuration for drag-and-drop styling

## Phase 3.2: Database Foundation

- [x] T005 Create `prisma/schema.prisma` with complete schema from `data-model.md` lines 134-228 (User, Project, Task, Comment, Session models)
- [x] T006 Create `prisma/seed.ts` implementing sample data from `data-model.md` lines 260-276 (5 users, 3 projects, 24-36 tasks)
- [x] T007 Create `src/lib/prisma.ts` with singleton Prisma client configuration for Next.js
- [x] T008 Initialize PostgreSQL database and run initial migration

## Phase 3.3: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.4
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests - tRPC Endpoints
- [x] T009 [P] Contract test `auth.selectUser` mutation in `tests/contract/auth.selectUser.test.ts`
- [x] T010 [P] Contract test `auth.getCurrentUser` query in `tests/contract/auth.getCurrentUser.test.ts`
- [x] T011 [P] Contract test `auth.logout` mutation in `tests/contract/auth.logout.test.ts`
- [x] T012 [P] Contract test `users.getAll` query in `tests/contract/users.getAll.test.ts`
- [x] T013 [P] Contract test `users.getById` query in `tests/contract/users.getById.test.ts`
- [x] T014 [P] Contract test `projects.getAll` query in `tests/contract/projects.getAll.test.ts`
- [x] T015 [P] Contract test `projects.getById` query in `tests/contract/projects.getById.test.ts`
- [x] T016 [P] Contract test `tasks.getByProject` query in `tests/contract/tasks.getByProject.test.ts`
- [x] T017 [P] Contract test `tasks.updateStatus` mutation in `tests/contract/tasks.updateStatus.test.ts`
- [x] T018 [P] Contract test `tasks.updatePosition` mutation in `tests/contract/tasks.updatePosition.test.ts`
- [x] T019 [P] Contract test `tasks.assignUser` mutation in `tests/contract/tasks.assignUser.test.ts`
- [x] T020 [P] Contract test `comments.create` mutation in `tests/contract/comments.create.test.ts`
- [x] T021 [P] Contract test `comments.update` mutation in `tests/contract/comments.update.test.ts`
- [x] T022 [P] Contract test `comments.delete` mutation in `tests/contract/comments.delete.test.ts`

### Integration Tests - User Stories
- [x] T023 [P] Integration test user selection flow in `tests/integration/user-selection.test.ts` (from `quickstart.md` lines 64-68)
- [x] T024 [P] Integration test project navigation in `tests/integration/project-navigation.test.ts` (from `quickstart.md` lines 70-76)
- [x] T025 [P] Integration test Kanban drag-and-drop in `tests/integration/kanban-dragdrop.test.ts` (from `quickstart.md` lines 78-83)
- [x] T026 [P] Integration test task details and comments in `tests/integration/task-comments.test.ts` (from `quickstart.md` lines 85-108)
- [x] T027 [P] Integration test session persistence in `tests/integration/session-persistence.test.ts`

## Phase 3.4: Core Implementation (ONLY after tests are failing)

### tRPC API Layer
- [x] T028 Create `src/server/api/trpc.ts` with base tRPC configuration and session middleware
- [x] T029 Create `src/server/api/context.ts` with request context including session validation
- [x] T030 Create `src/app/api/trpc/[trpc]/route.ts` for Next.js tRPC integration
- [x] T031 Create `src/server/api/routers/auth.ts` implementing 3 auth endpoints from `contracts/signalr-spec.md` lines 18-36
- [x] T032 Create `src/server/api/routers/users.ts` implementing 2 user endpoints from `contracts/signalr-spec.md` lines 38-50
- [x] T033 Create `src/server/api/routers/projects.ts` implementing 2 project endpoints from `contracts/signalr-spec.md` lines 52-64
- [x] T034 Create `src/server/api/routers/tasks.ts` implementing 5 task endpoints from `contracts/signalr-spec.md` lines 66-96
- [x] T035 Create `src/server/api/routers/comments.ts` implementing 4 comment endpoints from `contracts/signalr-spec.md` lines 98-122
- [x] T036 Create `src/server/api/routers/_app.ts` assembling all routers from `contracts/signalr-spec.md` lines 5-16

### Frontend Foundation
- [x] T037 [P] Create `src/app/_trpc/client.ts` and `src/app/_trpc/provider.tsx` for tRPC client configuration
- [x] T038 [P] Create `src/store/auth.ts` Zustand store for session management
- [x] T039 [P] Create `src/store/kanban.ts` Zustand store for board state and drag-and-drop
- [x] T040 [P] Create `src/store/ui.ts` Zustand store for modals and loading states
- [x] T041 [P] Create `src/lib/session.ts` for JWT creation, validation, and cookie handling

## Phase 3.5: UI Components

- [x] T042 Create `src/app/page.tsx` user selection page with 5 predefined users
- [x] T043 Create `src/app/projects/page.tsx` project list page with 3 sample projects
- [x] T044 Create `src/app/projects/[id]/page.tsx` Kanban board with @dnd-kit drag-and-drop integration
- [x] T045 [P] Create `src/components/kanban/KanbanBoard.tsx` with 4 columns (To Do, In Progress, In Review, Done)
- [x] T046 [P] Create `src/components/kanban/TaskCard.tsx` with color coding for assigned tasks
- [x] T047 [P] Create `src/components/TaskModal.tsx` for task details with comment system
- [x] T048 [P] Create `src/components/CommentList.tsx` with edit/delete permissions based on ownership

## Phase 3.6: Integration & Polish

- [ ] T049 Implement optimistic updates for drag-and-drop operations using React Query patterns
- [ ] T050 Add error boundaries and loading states throughout the application
- [ ] T051 [P] Create E2E tests in `tests/e2e/user-journey.spec.ts` using Playwright
- [ ] T052 [P] Performance validation: ensure <200ms task updates and 60fps drag-and-drop
- [ ] T053 [P] Accessibility testing for drag-and-drop with screen readers
- [ ] T054 Run complete quickstart validation from `quickstart.md` lines 62-120

## Dependencies

### Critical Dependency Chains:
- **Database First**: T005 (schema) → T006 (seed) → T007 (client) → All other tasks
- **Tests Before Implementation**: T009-T027 (all tests) → T028-T048 (implementation)
- **tRPC Foundation**: T028-T030 (base) → T031-T036 (routers) → T037 (client) → T038-T041 (stores)
- **Components Last**: T037-T041 (stores) → T042-T048 (UI components)

### Sequential Dependencies:
- T005 blocks T006, T007, T008
- T028, T029, T030 block T031-T036
- T031-T036 block T037
- T037 blocks T038-T041
- T038-T041 block T042-T048
- T042-T048 block T049-T054

### Parallel Groups:
- **Setup**: T003, T004 (independent configuration)
- **Contract Tests**: T009-T022 (different files, no dependencies)
- **Integration Tests**: T023-T027 (different test scenarios)
- **Stores**: T038-T041 (independent state management)
- **Components**: T045-T048 (different UI components)
- **Polish**: T051-T053 (independent validation tasks)

## Parallel Execution Examples

### Phase 3.3 - All Contract Tests Together:
```bash
# Launch T009-T022 in parallel (14 contract tests):
Task: "Contract test auth.selectUser mutation in tests/contract/auth.selectUser.test.ts"
Task: "Contract test auth.getCurrentUser query in tests/contract/auth.getCurrentUser.test.ts"
Task: "Contract test users.getAll query in tests/contract/users.getAll.test.ts"
Task: "Contract test tasks.updatePosition mutation in tests/contract/tasks.updatePosition.test.ts"
# ... (all 14 contract tests can run simultaneously)
```

### Phase 3.3 - All Integration Tests Together:
```bash
# Launch T023-T027 in parallel (5 integration tests):
Task: "Integration test user selection flow in tests/integration/user-selection.test.ts"
Task: "Integration test Kanban drag-and-drop in tests/integration/kanban-dragdrop.test.ts"
Task: "Integration test session persistence in tests/integration/session-persistence.test.ts"
# ... (all 5 integration tests can run simultaneously)
```

### Phase 3.4 - Frontend Stores in Parallel:
```bash
# Launch T038-T041 together after T037 complete:
Task: "Create src/store/auth.ts Zustand store for session management"
Task: "Create src/store/kanban.ts Zustand store for board state"
Task: "Create src/store/ui.ts Zustand store for modals and loading"
Task: "Create src/lib/session.ts for JWT and cookie handling"
```

## Validation Checklist

### Contract Coverage:
- [x] All 15 tRPC endpoints have contract tests (T009-T022, T024)
- [x] All 5 entities have corresponding implementation tasks
- [x] All contract tests come before router implementation
- [x] All parallel tasks are truly independent (different files)

### Implementation Coverage:
- [x] Database schema and seeding (T005-T008)
- [x] Complete tRPC API with all routers (T028-T036)
- [x] Frontend state management (T037-T041)
- [x] Full UI component suite (T042-T048)
- [x] Integration and performance validation (T049-T054)

### Test-First Validation:
- [x] All implementation tasks come after corresponding tests
- [x] RED-GREEN-Refactor cycle enforced through task dependencies
- [x] Real PostgreSQL database used (no mocks)
- [x] Integration tests cover all user stories from quickstart.md

## Notes

- **[P] Tasks**: Different files, can run in parallel
- **Sequential Tasks**: Same files or dependencies, must run in order
- **TDD Enforcement**: Implementation phase (T028-T048) blocked until all tests (T009-T027) are written and failing
- **File Path Specificity**: Every task includes exact file path for implementation
- **Cross-Reference Validation**: All tasks reference specific lines in design documents

## Task Generation Rules Applied

1. **From Contracts**: Each of 15 tRPC endpoints → contract test task [P] → implementation task
2. **From Data Model**: Each of 5 entities → model creation → service integration
3. **From User Stories**: Each of 5 quickstart scenarios → integration test [P]
4. **From Implementation Sequence**: Clear phase dependencies and file-level tasks
5. **Ordering**: Setup → Tests → Database → API → Frontend → Integration → Polish

This task breakdown ensures complete TDD implementation of Taskify with clear dependencies, parallel execution opportunities, and validation at every step.