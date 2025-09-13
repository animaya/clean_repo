# Taskify Quickstart Guide

## Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL database running locally or remote
- Git for version control

## Quick Setup

### 1. Environment Configuration

Create `.env.local` file:
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/taskify_db"

# Session Management  
SESSION_SECRET="your-super-secret-jwt-key-change-in-production"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Install Dependencies

```bash
npm install

# Key packages that will be installed:
# - next@14+ (App Router)
# - @trpc/server @trpc/client @trpc/react-query @trpc/next
# - @prisma/client prisma
# - @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities  
# - zustand
# - @tanstack/react-query
# - tailwindcss
# - zod (validation)
# - jose (JWT handling)
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Seed with sample data
npx prisma db seed
```

### 4. Start Development

```bash
npm run dev
# Opens http://localhost:3000
```

## User Journey Testing

### Step 1: User Selection
1. **Access**: Open http://localhost:3000
2. **Expected**: See 5 user cards (1 PM: Sarah Chen, 4 Engineers: Alex, Jordan, Taylor, Morgan)
3. **Action**: Click on any user card
4. **Expected**: Navigate to projects page with selected user in session

### Step 2: Project Navigation  
1. **Expected**: See 3 project cards:
   - "E-commerce Platform"
   - "Mobile App Redesign" 
   - "API Documentation"
2. **Action**: Click on "E-commerce Platform"
3. **Expected**: Navigate to Kanban board view

### Step 3: Kanban Board Interaction
1. **Expected**: See 4 columns: "To Do", "In Progress", "In Review", "Done"
2. **Expected**: See task cards distributed across columns
3. **Expected**: Tasks assigned to current user appear in different color
4. **Action**: Drag a task from "To Do" to "In Progress"
5. **Expected**: Task moves smoothly, status updates, position saves

### Step 4: Task Details & Comments
1. **Action**: Click on any task card
2. **Expected**: Task modal opens with:
   - Task title and description
   - Current status and assigned user
   - Comment section at bottom
3. **Action**: Add comment "Testing the comment system"
4. **Expected**: Comment appears immediately with your user's name
5. **Action**: Edit your comment (pencil icon)
6. **Expected**: Edit mode allows text modification
7. **Expected**: Other users' comments have no edit/delete options

### Step 5: Task Assignment
1. **In task modal**: Click "Assign User" dropdown
2. **Expected**: See all 5 users in dropdown  
3. **Action**: Select different user
4. **Expected**: Task assignment updates, assignee name displays
5. **Action**: Close modal, return to board
6. **Expected**: Task card color changes (no longer your task)

### Step 6: Status Changes
1. **In task modal**: Change status dropdown from "In Progress" to "In Review"
2. **Expected**: Status updates immediately
3. **Action**: Close modal
4. **Expected**: Task appears in "In Review" column at correct position

### Step 7: Session Persistence
1. **Action**: Navigate back to projects (breadcrumb or back button)
2. **Expected**: Same user still selected, no re-selection required
3. **Action**: Refresh browser page
4. **Expected**: Still logged in as same user (2-hour session)
5. **Action**: Open new tab to same URL
6. **Expected**: Redirected to projects (session maintained)

## Development Validation

### Component Structure Test
```bash
# Verify component files exist
ls src/components/kanban/
ls src/components/tasks/  
ls src/components/comments/

# Expected files:
# - KanbanBoard.tsx
# - TaskCard.tsx
# - CommentList.tsx
# - etc.
```

### API Contract Test
```bash
# Test tRPC endpoints
curl -X POST http://localhost:3000/api/trpc/users.getAll
# Expected: Array of 5 users

curl -X POST http://localhost:3000/api/trpc/projects.getAll  
# Expected: Array of 3 projects
```

### Database Verification
```bash
npx prisma studio
# Opens database browser at http://localhost:5555
# Verify tables: users, projects, tasks, comments, sessions
# Verify sample data is populated
```

## Performance Benchmarks

### Drag & Drop Performance
- **Target**: 60fps during drag operations
- **Test**: Drag task between columns rapidly
- **Expected**: Smooth animation, no lag or stuttering

### API Response Times
- **Target**: <200ms for task status updates
- **Test**: Network tab during task operations
- **Expected**: Fast response times, optimistic updates

### Session Management
- **Target**: 2-hour session duration
- **Test**: Leave app idle, return after time intervals
- **Expected**: Session active for exactly 2 hours

## Troubleshooting

### Database Connection Issues
```bash
# Verify PostgreSQL is running
sudo service postgresql status

# Test connection
psql -d taskify_db -c "SELECT version();"
```

### tRPC Type Errors
```bash
# Regenerate tRPC types
npm run build

# Clear Next.js cache
rm -rf .next/
```

### Drag & Drop Not Working
- Check browser console for @dnd-kit errors
- Verify touch-action CSS is properly configured
- Test with mouse vs touch device

### Session Issues
- Check HTTP-only cookie is set in browser dev tools
- Verify JWT_SECRET is configured in .env.local
- Check session table in database for active sessions

## Success Criteria Checklist

- [ ] All 5 users appear on selection screen
- [ ] User selection creates valid 2-hour session
- [ ] All 3 projects display correctly
- [ ] Kanban board shows all 4 columns
- [ ] Drag & drop works smoothly between columns
- [ ] Task status updates persist to database
- [ ] Assigned tasks display in different color
- [ ] Task modal opens with full details
- [ ] Comments can be added, edited (own only), deleted (own only)
- [ ] Task assignment works for all users
- [ ] Session persists across page refreshes
- [ ] Session expires after exactly 2 hours
- [ ] No authentication required anywhere
- [ ] All interactions feel responsive (<200ms)

## Next Steps

After successful quickstart validation:
1. Run integration tests: `npm run test:integration`
2. Run E2E tests: `npm run test:e2e`  
3. Performance testing with multiple users
4. Accessibility testing with screen reader
5. Cross-browser compatibility testing

This quickstart guide ensures all core Taskify functionality works correctly in development environment.