import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { appRouter, type AppRouter } from '@/server/api/routers/_app';

const prisma = new PrismaClient();

describe('projects.getAll Contract Test', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return array of all projects', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.projects.getAll();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    if (result.length > 0) {
      expect(result[0]).toEqual({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    }
  });

  it('should return exactly 3 sample projects', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.projects.getAll();

    expect(result).toHaveLength(3);
  });

  it('should include projects with unique names', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.projects.getAll();

    const names = result.map(project => project.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it('should handle optional description field', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.projects.getAll();

    result.forEach(project => {
      expect(typeof project.description === 'string' || project.description === null).toBe(true);
    });
  });

  it('should not require authentication', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null, // No authenticated user
    });

    // Should not throw authentication error
    const result = await caller.projects.getAll();
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
    const result = await caller.projects.getAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return projects sorted consistently', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result1 = await caller.projects.getAll();
    const result2 = await caller.projects.getAll();

    expect(result1.map(p => p.id)).toEqual(result2.map(p => p.id));
  });

  it('should return projects with valid CUID IDs', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      prisma,
      user: null,
    });

    const result = await caller.projects.getAll();

    result.forEach(project => {
      expect(project.id).toMatch(/^cm[a-z0-9]{24}$/);
    });
  });
});