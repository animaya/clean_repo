import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { appRouter, type AppRouter } from '@/server/api/routers/_app';
import { TRPCError } from '@trpc/server';

const prisma = new PrismaClient();

describe('comments.update Contract Test', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should update own comment and return updated comment with user data', async () => {
    const validCommentId = 'cm123456789abcdef';
    const updatedContent = 'This is an updated comment';

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

    const result = await caller.comments.update({
      commentId: validCommentId,
      content: updatedContent
    });

    expect(result).toEqual({
      id: validCommentId,
      content: updatedContent,
      taskId: expect.any(String),
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

    expect(result.content).toBe(updatedContent);
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

    // Invalid comment ID
    await expect(
      caller.comments.update({
        commentId: 'invalid-id',
        content: 'Valid content'
      })
    ).rejects.toThrow(TRPCError);

    // Empty content
    await expect(
      caller.comments.update({
        commentId: 'cm123456789abcdef',
        content: ''
      })
    ).rejects.toThrow(TRPCError);

    // Content too long (over 2000 characters)
    await expect(
      caller.comments.update({
        commentId: 'cm123456789abcdef',
        content: 'a'.repeat(2001)
      })
    ).rejects.toThrow(TRPCError);

    // Missing fields
    await expect(
      caller.comments.update({} as any)
    ).rejects.toThrow(TRPCError);
  });

  it('should require active session', async () => {
    const validCommentId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null, // No authenticated user
    });

    await expect(
      caller.comments.update({
        commentId: validCommentId,
        content: 'This should fail'
      })
    ).rejects.toThrow(TRPCError);
  });

  it('should return FORBIDDEN error when trying to edit other user comment', async () => {
    const otherUserCommentId = 'cm123456789abcdef';

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

    // Assuming this comment belongs to a different user
    await expect(
      caller.comments.update({
        commentId: otherUserCommentId,
        content: 'Cannot edit this'
      })
    ).rejects.toThrow(TRPCError);
  });

  it('should return NOT_FOUND error for non-existent comment', async () => {
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
      caller.comments.update({
        commentId: 'cm999999999nonexist',
        content: 'Valid content'
      })
    ).rejects.toThrow(TRPCError);
  });

  it('should accept content up to 2000 characters', async () => {
    const validCommentId = 'cm123456789abcdef';
    const maxContent = 'b'.repeat(2000);

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

    const result = await caller.comments.update({
      commentId: validCommentId,
      content: maxContent
    });

    expect(result.content).toBe(maxContent);
  });

  it('should update comment in database', async () => {
    const validCommentId = 'cm123456789abcdef';
    const updatedContent = 'Database update test';

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

    const result = await caller.comments.update({
      commentId: validCommentId,
      content: updatedContent
    });

    // Verify the comment was updated in database
    const updatedComment = await prisma.comment.findUnique({
      where: { id: validCommentId }
    });

    expect(updatedComment?.content).toBe(updatedContent);
    expect(updatedComment?.updatedAt.getTime()).toBeGreaterThan(updatedComment?.createdAt.getTime() || 0);
  });

  it('should preserve original comment metadata', async () => {
    const validCommentId = 'cm123456789abcdef';
    const updatedContent = 'Content change only';

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

    const result = await caller.comments.update({
      commentId: validCommentId,
      content: updatedContent
    });

    // ID, taskId, userId, and createdAt should remain unchanged
    expect(result.id).toBe(validCommentId);
    expect(result.userId).toBe(mockUser.id);
    expect(result.taskId).toBeTruthy();
    expect(result.createdAt).toBeTruthy();
  });

  it('should handle special characters in updated content', async () => {
    const validCommentId = 'cm123456789abcdef';
    const specialContent = 'Updated with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';

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

    const result = await caller.comments.update({
      commentId: validCommentId,
      content: specialContent
    });

    expect(result.content).toBe(specialContent);
  });
});