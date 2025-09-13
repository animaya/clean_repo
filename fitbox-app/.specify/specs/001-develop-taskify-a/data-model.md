# Data Model: Taskify

## Entity Definitions

### User
Represents team members with predefined roles.

**Fields**:
- `id`: String (CUID) - Primary key
- `name`: String - Display name  
- `role`: Enum - "PRODUCT_MANAGER" | "ENGINEER"
- `email`: String - Contact email (unique)
- `createdAt`: DateTime - Record creation timestamp
- `updatedAt`: DateTime - Last modification timestamp

**Relationships**:
- `assignedTasks`: Task[] - Tasks assigned to this user
- `comments`: Comment[] - Comments made by this user
- `sessions`: Session[] - Active sessions for this user

**Validation Rules**:
- Name must be 1-50 characters
- Email must be valid email format
- Role must be one of defined enum values
- Exactly 5 users total (1 PM, 4 engineers)

**State Transitions**: None (static user data)

### Project
Container for related tasks with sample data.

**Fields**:
- `id`: String (CUID) - Primary key
- `name`: String - Project display name
- `description`: String? - Optional project description
- `createdAt`: DateTime - Record creation timestamp  
- `updatedAt`: DateTime - Last modification timestamp

**Relationships**:
- `tasks`: Task[] - Tasks belonging to this project

**Validation Rules**:
- Name must be 1-100 characters
- Description max 500 characters if provided
- Exactly 3 sample projects total

**State Transitions**: None (static project data)

### Task
Work items that can be assigned, commented on, and moved between status columns.

**Fields**:
- `id`: String (CUID) - Primary key
- `title`: String - Task title
- `description`: String? - Optional task description
- `status`: Enum - "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE"
- `projectId`: String - Foreign key to Project
- `assignedUserId`: String? - Foreign key to User (optional)
- `position`: Int - Sort order within status column
- `createdAt`: DateTime - Record creation timestamp
- `updatedAt`: DateTime - Last modification timestamp

**Relationships**:
- `project`: Project - Parent project
- `assignedUser`: User? - Optional assigned user
- `comments`: Comment[] - Comments on this task

**Validation Rules**:
- Title must be 1-200 characters
- Description max 1000 characters if provided
- Status must be one of defined enum values
- Position must be non-negative integer
- AssignedUserId must exist in Users table if provided

**State Transitions**:
```
TODO → IN_PROGRESS → IN_REVIEW → DONE
  ↓         ↓           ↓         ↑
  ←---------←-----------←---------←
```
All transitions are bidirectional (tasks can move backward)

### Comment
User-generated content associated with tasks.

**Fields**:
- `id`: String (CUID) - Primary key
- `content`: String - Comment text content
- `taskId`: String - Foreign key to Task
- `userId`: String - Foreign key to User (comment author)
- `createdAt`: DateTime - Record creation timestamp
- `updatedAt`: DateTime - Last modification timestamp

**Relationships**:
- `task`: Task - Parent task
- `user`: User - Comment author

**Validation Rules**:
- Content must be 1-2000 characters
- TaskId must exist in Tasks table
- UserId must exist in Users table
- User can only edit/delete their own comments

**State Transitions**: None (simple CRUD operations)

### Session
Manages user sessions without traditional authentication.

**Fields**:
- `id`: String (CUID) - Primary key
- `token`: String - JWT session token (unique)
- `userId`: String - Foreign key to User
- `expiresAt`: DateTime - Session expiration time (2 hours from creation)
- `createdAt`: DateTime - Record creation timestamp

**Relationships**:
- `user`: User - Session owner

**Validation Rules**:
- Token must be unique and valid JWT format
- UserId must exist in Users table
- ExpiresAt must be exactly 2 hours from creation
- Expired sessions should be cleaned up

**State Transitions**:
```
ACTIVE → EXPIRED
```
Automatic transition when expiresAt < current time

## Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  PRODUCT_MANAGER
  ENGINEER
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  IN_REVIEW
  DONE
}

model User {
  id        String   @id @default(cuid())
  name      String   @db.VarChar(50)
  role      UserRole
  email     String   @unique @db.VarChar(255)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  assignedTasks Task[]
  comments      Comment[]
  sessions      Session[]

  @@map("users")
}

model Project {
  id          String   @id @default(cuid())
  name        String   @db.VarChar(100)
  description String?  @db.VarChar(500)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tasks Task[]

  @@map("projects")
}

model Task {
  id             String     @id @default(cuid())
  title          String     @db.VarChar(200)
  description    String?    @db.VarChar(1000)
  status         TaskStatus @default(TODO)
  position       Int        @default(0)
  projectId      String
  assignedUserId String?
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  project      Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assignedUser User?     @relation(fields: [assignedUserId], references: [id], onDelete: SetNull)
  comments     Comment[]

  @@index([projectId, status, position])
  @@map("tasks")
}

model Comment {
  id        String   @id @default(cuid())
  content   String   @db.VarChar(2000)
  taskId    String
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  task Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([taskId])
  @@map("comments")
}

model Session {
  id        String   @id @default(cuid())
  token     String   @unique @db.VarChar(500)
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])
  @@index([expiresAt])
  @@map("sessions")
}
```

## Key Design Decisions

### 1. CUID Primary Keys
- More secure than auto-incrementing integers
- URL-safe and collision-resistant
- Compatible with distributed systems

### 2. Cascade Delete Patterns
- Project deletion removes all tasks and comments
- Task deletion removes all comments
- User deletion removes sessions but preserves task history via SetNull

### 3. Positioning System
- Integer position field for drag-and-drop ordering
- Indexed with projectId and status for efficient queries
- Allows fine-grained control over task order

### 4. Session Management
- JWT tokens stored in database for revocation capability
- 2-hour expiration enforced at database level
- Cleanup job needed for expired sessions

### 5. Comment Ownership
- Comments linked to both task and user
- Enables edit/delete permission checks
- Preserves comment history even if user changes

## Sample Data Requirements

### Users (5 total)
1. Product Manager: "Sarah Chen" (sarah@taskify.com)
2. Engineer: "Alex Rivera" (alex@taskify.com)  
3. Engineer: "Jordan Kim" (jordan@taskify.com)
4. Engineer: "Taylor Swift" (taylor@taskify.com)
5. Engineer: "Morgan Davis" (morgan@taskify.com)

### Projects (3 total)
1. "E-commerce Platform" - Building new online store
2. "Mobile App Redesign" - Updating user interface  
3. "API Documentation" - Technical documentation project

### Tasks (Sample distribution)
- Each project: 8-12 tasks
- Status distribution: 40% TODO, 30% IN_PROGRESS, 20% IN_REVIEW, 10% DONE
- 60% of tasks should have assigned users
- Each task: 0-3 comments from different users