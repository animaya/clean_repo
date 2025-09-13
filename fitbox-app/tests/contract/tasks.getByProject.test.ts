import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { appRouter, type AppRouter } from '@/server/api/routers/_app';
import { TRPCError } from '@trpc/server';

const prisma = new PrismaClient();

describe('tasks.getByProject Contract Test', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return array of tasks with comments for valid project', async () => {
    const validProjectId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.tasks.getByProject({ projectId: validProjectId });

    expect(Array.isArray(result)).toBe(true);

    if (result.length > 0) {
      expect(result[0]).toEqual({
        id: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        status: expect.stringMatching(/^(TODO|IN_PROGRESS|IN_REVIEW|DONE)$/),
        position: expect.any(Number),
        projectId: expect.any(String),
        assignedUserId: expect.any(String),
        assignedUser: expect.any(Object),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        comments: expect.any(Array),
      });

      // Verify comments structure
      if (result[0].comments.length > 0) {
        expect(result[0].comments[0]).toEqual({
          id: expect.any(String),
          content: expect.any(String),
          taskId: expect.any(String),
          userId: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          user: expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            role: expect.stringMatching(/^(PRODUCT_MANAGER|ENGINEER)$/),
            email: expect.any(String),
          }),
        });
      }
    }
  });

  it('should return empty array for project with no tasks', async () => {
    const emptyProjectId = 'cm999999999empty99';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.tasks.getByProject({ projectId: emptyProjectId });

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });

  it('should validate input with Zod schema', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    await expect(
      caller.tasks.getByProject({ projectId: 'invalid-id' })
    ).rejects.toThrow(TRPCError);

    await expect(
      caller.tasks.getByProject({ projectId: '' })
    ).rejects.toThrow(TRPCError);

    await expect(
      caller.tasks.getByProject({} as any)
    ).rejects.toThrow(TRPCError);
  });

  it('should include tasks with all status types', async () => {
    const validProjectId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.tasks.getByProject({ projectId: validProjectId });

    const statuses = result.map(task => task.status);
    const uniqueStatuses = new Set(statuses);

    // Should have multiple different statuses
    expect(uniqueStatuses.size).toBeGreaterThan(1);

    // All statuses should be valid enum values
    statuses.forEach(status => {
      expect(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']).toContain(status);
    });
  });

  it('should return tasks sorted by position within each status', async () => {
    const validProjectId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.tasks.getByProject({ projectId: validProjectId });

    // Group by status and check sorting
    const tasksByStatus = {
      TODO: result.filter(t => t.status === 'TODO'),
      IN_PROGRESS: result.filter(t => t.status === 'IN_PROGRESS'),
      IN_REVIEW: result.filter(t => t.status === 'IN_REVIEW'),
      DONE: result.filter(t => t.status === 'DONE'),
    };

    Object.values(tasksByStatus).forEach(tasks => {
      if (tasks.length > 1) {
        for (let i = 1; i < tasks.length; i++) {
          expect(tasks[i].position).toBeGreaterThanOrEqual(tasks[i - 1].position);
        }
      }
    });
  });

  it('should handle optional assignedUser field', async () => {
    const validProjectId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.tasks.getByProject({ projectId: validProjectId });

    result.forEach(task => {
      if (task.assignedUserId) {
        expect(task.assignedUser).toBeTruthy();
        expect(task.assignedUser?.id).toBe(task.assignedUserId);
      } else {
        expect(task.assignedUser).toBeNull();
      }
    });
  });

  it('should not require authentication', async () => {
    const validProjectId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null, // No authenticated user
    });

    // Should not throw authentication error
    const result = await caller.tasks.getByProject({ projectId: validProjectId });
    expect(Array.isArray(result)).toBe(true);
  });
});