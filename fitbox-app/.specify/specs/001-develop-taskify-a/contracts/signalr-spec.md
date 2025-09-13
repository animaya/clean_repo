# tRPC Contract Specifications

## tRPC Router Structure

```typescript
// Server-side router type definitions
export const appRouter = router({
  auth: authRouter,
  users: usersRouter,
  projects: projectsRouter,
  tasks: tasksRouter,
  comments: commentsRouter,
});

export type AppRouter = typeof appRouter;
```

## Auth Router

### `auth.selectUser`
**Type**: `mutation`
**Input**: `{ userId: string }`
**Output**: `{ user: User; sessionToken: string; expiresAt: Date }`
**Purpose**: Create session for selected user (no password required)

### `auth.getCurrentUser`
**Type**: `query`
**Input**: None (uses session token from cookie)
**Output**: `User | null`
**Purpose**: Get current session user information

### `auth.logout`
**Type**: `mutation`
**Input**: None
**Output**: `{ success: boolean }`
**Purpose**: Clear session and cookie

## Users Router

### `users.getAll`
**Type**: `query`
**Input**: None
**Output**: `User[]`
**Purpose**: Get all 5 predefined users for selection screen

### `users.getById`
**Type**: `query`  
**Input**: `{ id: string }`
**Output**: `User | null`
**Purpose**: Get specific user by ID

## Projects Router

### `projects.getAll`
**Type**: `query`
**Input**: None
**Output**: `Project[]`
**Purpose**: Get all 3 sample projects

### `projects.getById`
**Type**: `query`
**Input**: `{ id: string }`
**Output**: `Project | null`
**Purpose**: Get specific project details

## Tasks Router

### `tasks.getByProject`
**Type**: `query`
**Input**: `{ projectId: string }`
**Output**: `TaskWithComments[]`
**Purpose**: Get all tasks for a project with comments included

### `tasks.updateStatus`
**Type**: `mutation`
**Input**: `{ taskId: string; status: TaskStatus }`
**Output**: `Task`
**Purpose**: Update task status (for column changes)

### `tasks.updatePosition`
**Type**: `mutation`
**Input**: `{ taskId: string; newStatus: TaskStatus; newPosition: number }`
**Output**: `Task`
**Purpose**: Update task position within or between columns (drag & drop)

### `tasks.assignUser`
**Type**: `mutation`
**Input**: `{ taskId: string; userId?: string }`
**Output**: `Task`
**Purpose**: Assign or unassign user from task

### `tasks.getById`
**Type**: `query`
**Input**: `{ id: string }`
**Output**: `TaskWithComments | null`
**Purpose**: Get single task with all comments

## Comments Router

### `comments.create`
**Type**: `mutation`
**Input**: `{ taskId: string; content: string }`
**Output**: `CommentWithUser`
**Purpose**: Add comment to task (requires active session)

### `comments.update`
**Type**: `mutation`
**Input**: `{ commentId: string; content: string }`
**Output**: `CommentWithUser`
**Purpose**: Update own comment only

### `comments.delete`
**Type**: `mutation`
**Input**: `{ commentId: string }`
**Output**: `{ success: boolean }`
**Purpose**: Delete own comment only

### `comments.getByTask`
**Type**: `query`
**Input**: `{ taskId: string }`
**Output**: `CommentWithUser[]`
**Purpose**: Get all comments for a task

## Type Definitions

```typescript
// Shared types used across routers
export interface User {
  id: string;
  name: string;
  role: 'PRODUCT_MANAGER' | 'ENGINEER';
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
  position: number;
  projectId: string;
  assignedUserId?: string;
  assignedUser?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskWithComments extends Task {
  comments: CommentWithUser[];
}

export interface CommentWithUser extends Comment {
  user: User;
}
```

## Input Validation (Zod Schemas)

```typescript
// Validation schemas for tRPC inputs
export const selectUserSchema = z.object({
  userId: z.string().cuid(),
});

export const getTasksByProjectSchema = z.object({
  projectId: z.string().cuid(),
});

export const updateTaskStatusSchema = z.object({
  taskId: z.string().cuid(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']),
});

export const updateTaskPositionSchema = z.object({
  taskId: z.string().cuid(),
  newStatus: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']),
  newPosition: z.number().int().min(0),
});

export const assignUserSchema = z.object({
  taskId: z.string().cuid(),
  userId: z.string().cuid().optional(),
});

export const createCommentSchema = z.object({
  taskId: z.string().cuid(),
  content: z.string().min(1).max(2000),
});

export const updateCommentSchema = z.object({
  commentId: z.string().cuid(),
  content: z.string().min(1).max(2000),
});

export const deleteCommentSchema = z.object({
  commentId: z.string().cuid(),
});
```

## Error Handling

### Standard tRPC Error Codes
- `UNAUTHORIZED`: No active session when required
- `FORBIDDEN`: Attempting to edit/delete other user's content
- `NOT_FOUND`: Resource (user, project, task, comment) not found
- `BAD_REQUEST`: Invalid input data
- `INTERNAL_SERVER_ERROR`: Database or server errors

### Custom Error Messages
- "Session expired, please select user again"
- "Cannot edit comments made by other users"
- "Cannot delete comments made by other users"
- "Task not found or access denied"
- "Project not found"
- "User assignment failed - user may not exist"

## Middleware Requirements

### Session Middleware
- Extracts JWT token from HTTP-only cookie
- Validates token and checks expiration
- Populates `ctx.user` for protected procedures
- Throws `UNAUTHORIZED` error if session invalid

### Protected Procedures
- All `comments.*` mutations require active session
- `tasks.assignUser` requires active session
- All other endpoints are public (no authentication needed)

## React Query Integration

### Query Keys
```typescript
// Standard query key patterns for React Query
const queryKeys = {
  users: {
    all: ['users'] as const,
    detail: (id: string) => ['users', id] as const,
  },
  projects: {
    all: ['projects'] as const,
    detail: (id: string) => ['projects', id] as const,
  },
  tasks: {
    byProject: (projectId: string) => ['tasks', 'project', projectId] as const,
    detail: (id: string) => ['tasks', id] as const,
  },
  comments: {
    byTask: (taskId: string) => ['comments', 'task', taskId] as const,
  },
};
```

### Optimistic Updates
- `tasks.updatePosition`: Optimistically move task in UI before server response
- `comments.create`: Optimistically add comment to list
- `tasks.assignUser`: Optimistically update assignment

### Cache Invalidation
- Task mutations invalidate `tasks.byProject` queries
- Comment mutations invalidate `comments.byTask` queries
- User assignment invalidates relevant task queries

This contract specification ensures type safety across the entire tRPC API while supporting all required Taskify functionality.