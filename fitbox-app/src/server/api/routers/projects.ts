import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const projectsRouter = createTRPCRouter({
  /**
   * Get all 3 sample projects
   * Based on contract: lines 54-58
   */
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      const projects = await ctx.prisma.project.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      });

      return projects;
    }),

  /**
   * Get specific project details
   * Based on contract: lines 60-64
   */
  getById: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;

      const project = await ctx.prisma.project.findUnique({
        where: { id },
      });

      return project;
    }),
});