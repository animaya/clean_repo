import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { appRouter, type AppRouter } from '@/server/api/routers/_app';
import { TRPCError } from '@trpc/server';

const prisma = new PrismaClient();

describe('tasks.assignUser Contract Test', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should assign user to task and return updated task', async () => {
    const validTaskId = 'cm123456789abcdef';
    const validUserId = 'cm987654321abcdef';

    const mockUser = {
      id: 'cm987654321abcdef',
      name: 'John Doe',
      role: 'PRODUCT_MANAGER' as const,
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const caller = appRouter.createCaller({
      req: {
        cookies: { session: 'valid-session-token' }
      } as any,
      res: {} as any,
      prisma,
      user: mockUser,
    });

    const result = await caller.tasks.assignUser({
      taskId: validTaskId,
      userId: validUserId
    });

    expect(result).toEqual({
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      status: expect.stringMatching(/^(TODO|IN_PROGRESS|IN_REVIEW|DONE)$/),
      position: expect.any(Number),
      projectId: expect.any(String),
      assignedUserId: validUserId,
      assignedUser: expect.objectContaining({
        id: validUserId,
        name: expect.any(String),
        role: expect.stringMatching(/^(PRODUCT_MANAGER|ENGINEER)$/),
        email: expect.any(String),
      }),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    expect(result.assignedUserId).toBe(validUserId);
  });

  it('should unassign user when userId is not provided', async () => {
    const validTaskId = 'cm123456789abcdef';

    const mockUser = {
      id: 'cm987654321abcdef',
      name: 'John Doe',
      role: 'PRODUCT_MANAGER' as const,
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const caller = appRouter.createCaller({
      req: {
        cookies: { session: 'valid-session-token' }
      } as any,
      res: {} as any,
      prisma,
      user: mockUser,
    });

    const result = await caller.tasks.assignUser({
      taskId: validTaskId
      // userId is optional and not provided
    });

    expect(result.assignedUserId).toBeNull();
    expect(result.assignedUser).toBeNull();
  });

  it('should validate input with Zod schema', async () => {
    const mockUser = {
      id: 'cm987654321abcdef',
      name: 'John Doe',
      role: 'PRODUCT_MANAGER' as const,
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const caller = appRouter.createCaller({
      req: {
        cookies: { session: 'valid-session-token' }
      } as any,
      res: {} as any,
      prisma,
      user: mockUser,
    });

    // Invalid task ID
    await expect(
      caller.tasks.assignUser({
        taskId: 'invalid-id',
        userId: 'cm123456789abcdef'
      })
    ).rejects.toThrow(TRPCError);

    // Invalid user ID
    await expect(
      caller.tasks.assignUser({
        taskId: 'cm123456789abcdef',
        userId: 'invalid-id'
      })
    ).rejects.toThrow(TRPCError);

    // Missing task ID
    await expect(
      caller.tasks.assignUser({} as any)
    ).rejects.toThrow(TRPCError);
  });

  it('should require active session', async () => {
    const validTaskId = 'cm123456789abcdef';
    const validUserId = 'cm987654321abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null, // No authenticated user
    });

    await expect(
      caller.tasks.assignUser({
        taskId: validTaskId,
        userId: validUserId
      })
    ).rejects.toThrow(TRPCError);
  });

  it('should return NOT_FOUND error for non-existent task', async () => {
    const mockUser = {
      id: 'cm987654321abcdef',
      name: 'John Doe',
      role: 'PRODUCT_MANAGER' as const,
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const caller = appRouter.createCaller({
      req: {
        cookies: { session: 'valid-session-token' }
      } as any,
      res: {} as any,
      prisma,
      user: mockUser,
    });

    await expect(
      caller.tasks.assignUser({
        taskId: 'cm999999999nonexist',
        userId: 'cm987654321abcdef'
      })
    ).rejects.toThrow(TRPCError);
  });

  it('should return error for non-existent user', async () => {
    const validTaskId = 'cm123456789abcdef';

    const mockUser = {
      id: 'cm987654321abcdef',
      name: 'John Doe',
      role: 'PRODUCT_MANAGER' as const,
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const caller = appRouter.createCaller({
      req: {
        cookies: { session: 'valid-session-token' }
      } as any,
      res: {} as any,
      prisma,
      user: mockUser,
    });

    await expect(
      caller.tasks.assignUser({
        taskId: validTaskId,
        userId: 'cm999999999nonexist'
      })
    ).rejects.toThrow(TRPCError);
  });

  it('should update assignment in database', async () => {
    const validTaskId = 'cm123456789abcdef';
    const validUserId = 'cm987654321abcdef';

    const mockUser = {
      id: 'cm987654321abcdef',
      name: 'John Doe',
      role: 'PRODUCT_MANAGER' as const,
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const caller = appRouter.createCaller({
      req: {
        cookies: { session: 'valid-session-token' }
      } as any,
      res: {} as any,
      prisma,
      user: mockUser,
    });

    // Assign user
    await caller.tasks.assignUser({
      taskId: validTaskId,
      userId: validUserId
    });

    // Verify the task was updated in database
    const updatedTask = await prisma.task.findUnique({
      where: { id: validTaskId }
    });

    expect(updatedTask?.assignedUserId).toBe(validUserId);
  });

  it('should handle reassignment to different user', async () => {
    const validTaskId = 'cm123456789abcdef';
    const userId1 = 'cm987654321abcdef';
    const userId2 = 'cm123987654abcdef';

    const mockUser = {
      id: 'cm987654321abcdef',
      name: 'John Doe',
      role: 'PRODUCT_MANAGER' as const,
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const caller = appRouter.createCaller({
      req: {
        cookies: { session: 'valid-session-token' }
      } as any,
      res: {} as any,
      prisma,
      user: mockUser,
    });

    // First assignment
    await caller.tasks.assignUser({
      taskId: validTaskId,
      userId: userId1
    });

    // Reassignment
    const result = await caller.tasks.assignUser({
      taskId: validTaskId,
      userId: userId2
    });

    expect(result.assignedUserId).toBe(userId2);
  });
});