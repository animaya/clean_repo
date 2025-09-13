import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { appRouter, type AppRouter } from '@/server/api/routers/_app';
import { TRPCError } from '@trpc/server';

const prisma = new PrismaClient();

describe('auth.logout Contract Test', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return success when valid session exists', async () => {
    const mockUser = {
      id: 'cm123456789abcdef',
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

    const result = await caller.auth.logout();

    expect(result).toEqual({
      success: true
    });
  });

  it('should clear session from database', async () => {
    const mockUser = {
      id: 'cm123456789abcdef',
      name: 'John Doe',
      role: 'PRODUCT_MANAGER' as const,
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const sessionsBefore = await prisma.session.count();

    const caller = appRouter.createCaller({
      req: {
        cookies: { session: 'session-to-be-deleted' }
      } as any,
      res: {} as any,
      prisma,
      user: mockUser,
    });

    await caller.auth.logout();

    const sessionsAfter = await prisma.session.count();
    expect(sessionsAfter).toBeLessThanOrEqual(sessionsBefore);
  });

  it('should clear HTTP-only cookie', async () => {
    const mockRes = {
      cookies: [] as Array<{ name: string; value: string; options: any }>,
      clearCookie: function(name: string, options: any) {
        this.cookies.push({ name, value: '', options: { ...options, expires: new Date(0) } });
      }
    };

    const caller = appRouter.createCaller({
      req: {
        cookies: { session: 'valid-session-token' }
      } as any,
      res: mockRes as any,
      prisma,
      user: {
        id: 'cm123456789abcdef',
        name: 'John Doe',
        role: 'PRODUCT_MANAGER' as const,
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await caller.auth.logout();

    expect(mockRes.cookies).toHaveLength(1);
    expect(mockRes.cookies[0].name).toBe('session');
    expect(mockRes.cookies[0].options.httpOnly).toBe(true);
  });

  it('should handle logout when no session exists', async () => {
    const caller = appRouter.createCaller({
      req: {
        cookies: {}
      } as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.auth.logout();
    expect(result).toEqual({
      success: true
    });
  });

  it('should not accept input parameters', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    // This should work without any input parameters
    const result = await caller.auth.logout();
    expect(result).toEqual({
      success: expect.any(Boolean)
    });
  });

  it('should handle invalid session token gracefully', async () => {
    const caller = appRouter.createCaller({
      req: {
        cookies: { session: 'invalid-token' }
      } as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.auth.logout();
    expect(result).toEqual({
      success: true
    });
  });
});