import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { appRouter, type AppRouter } from '@/server/api/routers/_app';
import { createTRPCMsw } from 'msw-trpc';
import { TRPCError } from '@trpc/server';

const prisma = new PrismaClient();

describe('auth.selectUser Contract Test', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should accept valid userId and return user with session token', async () => {
    const validUserId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.auth.selectUser({ userId: validUserId });

    expect(result).toEqual({
      user: expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        role: expect.stringMatching(/^(PRODUCT_MANAGER|ENGINEER)$/),
        email: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
      sessionToken: expect.any(String),
      expiresAt: expect.any(Date),
    });

    expect(result.sessionToken).toHaveLength(128);
    expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('should validate input with Zod schema', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    await expect(
      caller.auth.selectUser({ userId: 'invalid-id' })
    ).rejects.toThrow(TRPCError);

    await expect(
      caller.auth.selectUser({ userId: '' })
    ).rejects.toThrow(TRPCError);

    await expect(
      caller.auth.selectUser({} as any)
    ).rejects.toThrow(TRPCError);
  });

  it('should return NOT_FOUND error for non-existent user', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    await expect(
      caller.auth.selectUser({ userId: 'cm999999999nonexist' })
    ).rejects.toThrow(TRPCError);
  });

  it('should create session record in database', async () => {
    const validUserId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const sessionsBefore = await prisma.session.count();
    await caller.auth.selectUser({ userId: validUserId });
    const sessionsAfter = await prisma.session.count();

    expect(sessionsAfter).toBe(sessionsBefore + 1);
  });

  it('should set HTTP-only cookie with session token', async () => {
    const validUserId = 'cm123456789abcdef';
    const mockRes = {
      cookies: [] as Array<{ name: string; value: string; options: any }>,
      cookie: function(name: string, value: string, options: any) {
        this.cookies.push({ name, value, options });
      }
    };

    const caller = appRouter.createCaller({
      req: {} as any,
      res: mockRes as any,
      prisma,
      user: null,
    });

    await caller.auth.selectUser({ userId: validUserId });

    expect(mockRes.cookies).toHaveLength(1);
    expect(mockRes.cookies[0].name).toBe('session');
    expect(mockRes.cookies[0].options.httpOnly).toBe(true);
    expect(mockRes.cookies[0].options.secure).toBe(true);
    expect(mockRes.cookies[0].options.sameSite).toBe('strict');
  });
});