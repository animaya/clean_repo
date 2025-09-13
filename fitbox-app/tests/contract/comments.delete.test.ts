import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { appRouter, type AppRouter } from '@/server/api/routers/_app';
import { TRPCError } from '@trpc/server';

const prisma = new PrismaClient();

describe('comments.delete Contract Test', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should delete own comment and return success', async () => {
    const validCommentId = 'cm123456789abcdef';

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

    const result = await caller.comments.delete({
      commentId: validCommentId
    });

    expect(result).toEqual({
      success: true
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

    // Invalid comment ID
    await expect(
      caller.comments.delete({
        commentId: 'invalid-id'
      })
    ).rejects.toThrow(TRPCError);

    // Empty comment ID
    await expect(
      caller.comments.delete({
        commentId: ''
      })
    ).rejects.toThrow(TRPCError);

    // Missing fields
    await expect(
      caller.comments.delete({} as any)
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
      caller.comments.delete({
        commentId: validCommentId
      })
    ).rejects.toThrow(TRPCError);
  });

  it('should return FORBIDDEN error when trying to delete other user comment', async () => {
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
      caller.comments.delete({
        commentId: otherUserCommentId
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
      caller.comments.delete({
        commentId: 'cm999999999nonexist'
      })
    ).rejects.toThrow(TRPCError);
  });

  it('should delete comment from database', async () => {
    const validCommentId = 'cm123456789abcdef';

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

    await caller.comments.delete({
      commentId: validCommentId
    });

    const commentsAfter = await prisma.comment.count();
    expect(commentsAfter).toBe(commentsBefore - 1);

    // Verify the comment no longer exists
    const deletedComment = await prisma.comment.findUnique({
      where: { id: validCommentId }
    });

    expect(deletedComment).toBeNull();
  });

  it('should only accept CUID format comment IDs', async () => {
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

    // Invalid formats should throw validation error
    await expect(
      caller.comments.delete({
        commentId: '123'
      })
    ).rejects.toThrow(TRPCError);

    await expect(
      caller.comments.delete({
        commentId: 'not-a-cuid'
      })
    ).rejects.toThrow(TRPCError);

    await expect(
      caller.comments.delete({
        commentId: 'uuid-format-id-1234-5678'
      })
    ).rejects.toThrow(TRPCError);
  });

  it('should handle concurrent deletion attempts gracefully', async () => {
    const validCommentId = 'cm123456789abcdef';

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

    // First deletion should succeed
    const result1 = await caller.comments.delete({
      commentId: validCommentId
    });
    expect(result1.success).toBe(true);

    // Second deletion should fail with NOT_FOUND
    await expect(
      caller.comments.delete({
        commentId: validCommentId
      })
    ).rejects.toThrow(TRPCError);
  });

  it('should return boolean success field', async () => {
    const validCommentId = 'cm123456789abcdef';

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

    const result = await caller.comments.delete({
      commentId: validCommentId
    });

    expect(typeof result.success).toBe('boolean');
    expect(result.success).toBe(true);
    expect(Object.keys(result)).toEqual(['success']);
  });
});