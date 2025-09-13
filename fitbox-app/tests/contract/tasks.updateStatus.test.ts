import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { appRouter, type AppRouter } from '@/server/api/routers/_app';
import { TRPCError } from '@trpc/server';

const prisma = new PrismaClient();

describe('tasks.updateStatus Contract Test', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should update task status and return updated task', async () => {
    const validTaskId = 'cm123456789abcdef';
    const newStatus = 'IN_PROGRESS';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.tasks.updateStatus({
      taskId: validTaskId,
      status: newStatus
    });

    expect(result).toEqual({
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      status: newStatus,
      position: expect.any(Number),
      projectId: expect.any(String),
      assignedUserId: expect.any(String),
      assignedUser: expect.any(Object),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    expect(result.status).toBe(newStatus);
  });

  it('should validate input with Zod schema', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    // Invalid task ID
    await expect(
      caller.tasks.updateStatus({
        taskId: 'invalid-id',
        status: 'TODO'
      })
    ).rejects.toThrow(TRPCError);

    // Invalid status
    await expect(
      caller.tasks.updateStatus({
        taskId: 'cm123456789abcdef',
        status: 'INVALID_STATUS' as any
      })
    ).rejects.toThrow(TRPCError);

    // Missing fields
    await expect(
      caller.tasks.updateStatus({} as any)
    ).rejects.toThrow(TRPCError);
  });

  it('should accept all valid status values', async () => {
    const validTaskId = 'cm123456789abcdef';
    const validStatuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'] as const;

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    for (const status of validStatuses) {
      await expect(
        caller.tasks.updateStatus({
          taskId: validTaskId,
          status: status
        })
      ).resolves.toBeTruthy();
    }
  });

  it('should return NOT_FOUND error for non-existent task', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    await expect(
      caller.tasks.updateStatus({
        taskId: 'cm999999999nonexist',
        status: 'TODO'
      })
    ).rejects.toThrow(TRPCError);
  });

  it('should update the task in database', async () => {
    const validTaskId = 'cm123456789abcdef';
    const newStatus = 'DONE';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    // Update status
    await caller.tasks.updateStatus({
      taskId: validTaskId,
      status: newStatus
    });

    // Verify the task was updated in database
    const updatedTask = await prisma.task.findUnique({
      where: { id: validTaskId }
    });

    expect(updatedTask?.status).toBe(newStatus);
  });

  it('should maintain task position when only changing status', async () => {
    const validTaskId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    // Get original position
    const originalTask = await prisma.task.findUnique({
      where: { id: validTaskId }
    });
    const originalPosition = originalTask?.position;

    // Update status
    const result = await caller.tasks.updateStatus({
      taskId: validTaskId,
      status: 'IN_REVIEW'
    });

    // Position should remain the same
    expect(result.position).toBe(originalPosition);
  });

  it('should not require authentication', async () => {
    const validTaskId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null, // No authenticated user
    });

    // Should not throw authentication error
    await expect(
      caller.tasks.updateStatus({
        taskId: validTaskId,
        status: 'TODO'
      })
    ).resolves.toBeTruthy();
  });
});