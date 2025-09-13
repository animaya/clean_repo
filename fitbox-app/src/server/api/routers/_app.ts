import { createTRPCRouter } from '@/server/api/trpc';
import { authRouter } from './auth';
import { usersRouter } from './users';
import { projectsRouter } from './projects';
import { tasksRouter } from './tasks';
import { commentsRouter } from './comments';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 * Based on contract specification lines 5-16
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  users: usersRouter,
  projects: projectsRouter,
  tasks: tasksRouter,
  comments: commentsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;