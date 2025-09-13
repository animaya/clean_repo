import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { appRouter, type AppRouter } from '@/server/api/routers/_app';
import { TRPCError } from '@trpc/server';

const prisma = new PrismaClient();

describe('comments.create Contract Test', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create comment and return comment with user data', async () => {
    const validTaskId = 'cm123456789abcdef';
    const commentContent = 'This is a test comment';

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

    const result = await caller.comments.create({
      taskId: validTaskId,
      content: commentContent
    });

    expect(result).toEqual({
      id: expect.any(String),
      content: commentContent,
      taskId: validTaskId,
      userId: mockUser.id,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      user: {
        id: mockUser.id,
        name: mockUser.name,
        role: mockUser.role,
        email: mockUser.email,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
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
      caller.comments.create({
        taskId: 'invalid-id',
        content: 'Valid content'
      })
    ).rejects.toThrow(TRPCError);

    // Empty content
    await expect(
      caller.comments.create({
        taskId: 'cm123456789abcdef',
        content: ''
      })
    ).rejects.toThrow(TRPCError);

    // Content too long (over 2000 characters)
    await expect(
      caller.comments.create({
        taskId: 'cm123456789abcdef',
        content: 'a'.repeat(2001)
      })
    ).rejects.toThrow(TRPCError);

    // Missing fields
    await expect(
      caller.comments.create({} as any)
    ).rejects.toThrow(TRPCError);
  });

  it('should require active session', async () => {
    const validTaskId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null, // No authenticated user
    });

    await expect(
      caller.comments.create({
        taskId: validTaskId,
        content: 'This should fail'
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
      caller.comments.create({
        taskId: 'cm999999999nonexist',
        content: 'Valid content'
      })
    ).rejects.toThrow(TRPCError);
  });

  it('should accept content up to 2000 characters', async () => {
    const validTaskId = 'cm123456789abcdef';
    const maxContent = 'a'.repeat(2000);

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

    const result = await caller.comments.create({
      taskId: validTaskId,
      content: maxContent
    });

    expect(result.content).toBe(maxContent);
  });

  it('should create comment in database', async () => {
    const validTaskId = 'cm123456789abcdef';
    const commentContent = 'Database test comment';

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

    const commentsBefore = await prisma.comment.count();

    const result = await caller.comments.create({
      taskId: validTaskId,
      content: commentContent
    });

    const commentsAfter = await prisma.comment.count();
    expect(commentsAfter).toBe(commentsBefore + 1);

    // Verify the comment was created with correct data
    const createdComment = await prisma.comment.findUnique({
      where: { id: result.id }
    });

    expect(createdComment?.content).toBe(commentContent);
    expect(createdComment?.taskId).toBe(validTaskId);
    expect(createdComment?.userId).toBe(mockUser.id);
  });

  it('should handle special characters in content', async () => {
    const validTaskId = 'cm123456789abcdef';
    const specialContent = 'Comment with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';

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

    const result = await caller.comments.create({
      taskId: validTaskId,
      content: specialContent
    });

    expect(result.content).toBe(specialContent);
  });
});