import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { appRouter, type AppRouter } from '@/server/api/routers/_app';
import { TRPCError } from '@trpc/server';

const prisma = new PrismaClient();

describe('tasks.updatePosition Contract Test', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should update task position and status, return updated task', async () => {
    const validTaskId = 'cm123456789abcdef';
    const newStatus = 'IN_PROGRESS';
    const newPosition = 5;

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.tasks.updatePosition({
      taskId: validTaskId,
      newStatus: newStatus,
      newPosition: newPosition
    });

    expect(result).toEqual({
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      status: newStatus,
      position: newPosition,
      projectId: expect.any(String),
      assignedUserId: expect.any(String),
      assignedUser: expect.any(Object),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    expect(result.status).toBe(newStatus);
    expect(result.position).toBe(newPosition);
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
      caller.tasks.updatePosition({
        taskId: 'invalid-id',
        newStatus: 'TODO',
        newPosition: 0
      })
    ).rejects.toThrow(TRPCError);

    // Invalid status
    await expect(
      caller.tasks.updatePosition({
        taskId: 'cm123456789abcdef',
        newStatus: 'INVALID_STATUS' as any,
        newPosition: 0
      })
    ).rejects.toThrow(TRPCError);

    // Negative position
    await expect(
      caller.tasks.updatePosition({
        taskId: 'cm123456789abcdef',
        newStatus: 'TODO',
        newPosition: -1
      })
    ).rejects.toThrow(TRPCError);

    // Non-integer position
    await expect(
      caller.tasks.updatePosition({
        taskId: 'cm123456789abcdef',
        newStatus: 'TODO',
        newPosition: 3.5
      })
    ).rejects.toThrow(TRPCError);

    // Missing fields
    await expect(
      caller.tasks.updatePosition({} as any)
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
        caller.tasks.updatePosition({
          taskId: validTaskId,
          newStatus: status,
          newPosition: 0
        })
      ).resolves.toBeTruthy();
    }
  });

  it('should accept position 0 (minimum value)', async () => {
    const validTaskId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.tasks.updatePosition({
      taskId: validTaskId,
      newStatus: 'TODO',
      newPosition: 0
    });

    expect(result.position).toBe(0);
  });

  it('should return NOT_FOUND error for non-existent task', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    await expect(
      caller.tasks.updatePosition({
        taskId: 'cm999999999nonexist',
        newStatus: 'TODO',
        newPosition: 0
      })
    ).rejects.toThrow(TRPCError);
  });

  it('should update both status and position in database', async () => {
    const validTaskId = 'cm123456789abcdef';
    const newStatus = 'DONE';
    const newPosition = 10;

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    // Update position and status
    await caller.tasks.updatePosition({
      taskId: validTaskId,
      newStatus: newStatus,
      newPosition: newPosition
    });

    // Verify the task was updated in database
    const updatedTask = await prisma.task.findUnique({
      where: { id: validTaskId }
    });

    expect(updatedTask?.status).toBe(newStatus);
    expect(updatedTask?.position).toBe(newPosition);
  });

  it('should handle drag-and-drop within same column', async () => {
    const validTaskId = 'cm123456789abcdef';
    const sameStatus = 'TODO';
    const newPosition = 7;

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.tasks.updatePosition({
      taskId: validTaskId,
      newStatus: sameStatus,
      newPosition: newPosition
    });

    expect(result.status).toBe(sameStatus);
    expect(result.position).toBe(newPosition);
  });

  it('should handle drag-and-drop between different columns', async () => {
    const validTaskId = 'cm123456789abcdef';
    const newStatus = 'IN_REVIEW';
    const newPosition = 3;

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.tasks.updatePosition({
      taskId: validTaskId,
      newStatus: newStatus,
      newPosition: newPosition
    });

    expect(result.status).toBe(newStatus);
    expect(result.position).toBe(newPosition);
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
      caller.tasks.updatePosition({
        taskId: validTaskId,
        newStatus: 'TODO',
        newPosition: 0
      })
    ).resolves.toBeTruthy();
  });
});