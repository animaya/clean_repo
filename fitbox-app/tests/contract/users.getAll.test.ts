import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { appRouter, type AppRouter } from '@/server/api/routers/_app';

const prisma = new PrismaClient();

describe('users.getAll Contract Test', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return array of all users', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.users.getAll();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    if (result.length > 0) {
      expect(result[0]).toEqual({
        id: expect.any(String),
        name: expect.any(String),
        role: expect.stringMatching(/^(PRODUCT_MANAGER|ENGINEER)$/),
        email: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    }
  });

  it('should return exactly 5 predefined users', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.users.getAll();

    expect(result).toHaveLength(5);
  });

  it('should include both PRODUCT_MANAGER and ENGINEER roles', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.users.getAll();

    const roles = result.map(user => user.role);
    expect(roles).toContain('PRODUCT_MANAGER');
    expect(roles).toContain('ENGINEER');
  });

  it('should return users with unique emails', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.users.getAll();

    const emails = result.map(user => user.email);
    const uniqueEmails = new Set(emails);
    expect(uniqueEmails.size).toBe(emails.length);
  });

  it('should not require authentication', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null, // No authenticated user
    });

    // Should not throw authentication error
    const result = await caller.users.getAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should not accept input parameters', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    // This should work without any input parameters
    const result = await caller.users.getAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return users sorted consistently', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result1 = await caller.users.getAll();
    const result2 = await caller.users.getAll();

    expect(result1.map(u => u.id)).toEqual(result2.map(u => u.id));
  });
});