import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { appRouter, type AppRouter } from '@/server/api/routers/_app';
import { TRPCError } from '@trpc/server';

const prisma = new PrismaClient();

describe('users.getById Contract Test', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return user when valid ID provided', async () => {
    const validUserId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.users.getById({ id: validUserId });

    expect(result).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      role: expect.stringMatching(/^(PRODUCT_MANAGER|ENGINEER)$/),
      email: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should return null when user not found', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.users.getById({ id: 'cm999999999nonexist' });

    expect(result).toBeNull();
  });

  it('should validate input with Zod schema', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    await expect(
      caller.users.getById({ id: 'invalid-id' })
    ).rejects.toThrow(TRPCError);

    await expect(
      caller.users.getById({ id: '' })
    ).rejects.toThrow(TRPCError);

    await expect(
      caller.users.getById({} as any)
    ).rejects.toThrow(TRPCError);
  });

  it('should not require authentication', async () => {
    const validUserId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null, // No authenticated user
    });

    // Should not throw authentication error
    await expect(
      caller.users.getById({ id: validUserId })
    ).resolves.toBeTruthy();
  });

  it('should accept only CUID format IDs', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    // Valid CUID format but non-existent
    const result = await caller.users.getById({ id: 'cm999999999999999' });
    expect(result).toBeNull();

    // Invalid formats should throw validation error
    await expect(
      caller.users.getById({ id: '123' })
    ).rejects.toThrow(TRPCError);

    await expect(
      caller.users.getById({ id: 'not-a-cuid' })
    ).rejects.toThrow(TRPCError);
  });

  it('should return consistent data structure', async () => {
    const validUserId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.users.getById({ id: validUserId });

    if (result) {
      expect(Object.keys(result)).toEqual([
        'id', 'name', 'role', 'email', 'createdAt', 'updatedAt'
      ]);
    }
  });
});