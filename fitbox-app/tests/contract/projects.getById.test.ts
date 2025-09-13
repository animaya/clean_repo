import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { appRouter, type AppRouter } from '@/server/api/routers/_app';
import { TRPCError } from '@trpc/server';

const prisma = new PrismaClient();

describe('projects.getById Contract Test', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return project when valid ID provided', async () => {
    const validProjectId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.projects.getById({ id: validProjectId });

    expect(result).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should return null when project not found', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.projects.getById({ id: 'cm999999999nonexist' });

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
      caller.projects.getById({ id: 'invalid-id' })
    ).rejects.toThrow(TRPCError);

    await expect(
      caller.projects.getById({ id: '' })
    ).rejects.toThrow(TRPCError);

    await expect(
      caller.projects.getById({} as any)
    ).rejects.toThrow(TRPCError);
  });

  it('should handle optional description field', async () => {
    const validProjectId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.projects.getById({ id: validProjectId });

    if (result) {
      expect(typeof result.description === 'string' || result.description === null).toBe(true);
    }
  });

  it('should not require authentication', async () => {
    const validProjectId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null, // No authenticated user
    });

    // Should not throw authentication error
    await expect(
      caller.projects.getById({ id: validProjectId })
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
    const result = await caller.projects.getById({ id: 'cm999999999999999' });
    expect(result).toBeNull();

    // Invalid formats should throw validation error
    await expect(
      caller.projects.getById({ id: '123' })
    ).rejects.toThrow(TRPCError);

    await expect(
      caller.projects.getById({ id: 'not-a-cuid' })
    ).rejects.toThrow(TRPCError);
  });

  it('should return consistent data structure', async () => {
    const validProjectId = 'cm123456789abcdef';

    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.projects.getById({ id: validProjectId });

    if (result) {
      expect(Object.keys(result)).toEqual([
        'id', 'name', 'description', 'createdAt', 'updatedAt'
      ]);
    }
  });
});