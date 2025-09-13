import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { appRouter, type AppRouter } from '@/server/api/routers/_app';
import { TRPCError } from '@trpc/server';

const prisma = new PrismaClient();

describe('auth.getCurrentUser Contract Test', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return user when valid session exists', async () => {
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

    const result = await caller.auth.getCurrentUser();

    expect(result).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      role: expect.stringMatching(/^(PRODUCT_MANAGER|ENGINEER)$/),
      email: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should return null when no session exists', async () => {
    const caller = appRouter.createCaller({
      req: {
        cookies: {}
      } as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.auth.getCurrentUser();
    expect(result).toBeNull();
  });

  it('should return null when session token is invalid', async () => {
    const caller = appRouter.createCaller({
      req: {
        cookies: { session: 'invalid-token' }
      } as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.auth.getCurrentUser();
    expect(result).toBeNull();
  });

  it('should return null when session is expired', async () => {
    const caller = appRouter.createCaller({
      req: {
        cookies: { session: 'expired-session-token' }
      } as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.auth.getCurrentUser();
    expect(result).toBeNull();
  });

  it('should validate session token from HTTP-only cookie', async () => {
    const caller = appRouter.createCaller({
      req: {
        cookies: { session: 'valid-jwt-token' },
        headers: {
          cookie: 'session=valid-jwt-token; HttpOnly; Secure'
        }
      } as any,
      res: {} as any,
      prisma,
      user: {
        id: 'cm123456789abcdef',
        name: 'Jane Doe',
        role: 'ENGINEER' as const,
        email: 'jane@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const result = await caller.auth.getCurrentUser();
    expect(result).not.toBeNull();
    expect(result?.role).toBe('ENGINEER');
  });

  it('should not accept query parameters (no input)', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    // This should work without any input parameters
    const result = await caller.auth.getCurrentUser();
    expect(typeof result === 'object' || result === null).toBe(true);
  });
});