import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc';

export const tasksRouter = createTRPCRouter({
  /**
   * Get all tasks for a project with comments included
   * Based on contract: lines 68-72
   */
  getByProject: publicProcedure
    .input(
      z.object({
        projectId: z.string().cuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { projectId } = input;

      const tasks = await ctx.prisma.task.findMany({
        where: {
          projectId,
        },
        include: {
          assignedUser: true,
          comments: {
            include: {
              user: true,
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: [
          { status: 'asc' },
          { position: 'asc' },
        ],
      });

      return tasks;
    }),

  /**
   * Update task status (for column changes)
   * Based on contract: lines 74-78
   */
  updateStatus: publicProcedure
    .input(
      z.object({
        taskId: z.string().cuid(),
        status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { taskId, status } = input;

      const task = await ctx.prisma.task.findUnique({
        where: { id: taskId },
      });

      if (!task) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Task not found or access denied',
        });
      }

      const updatedTask = await ctx.prisma.task.update({
        where: { id: taskId },
        data: { status },
        include: {
          assignedUser: true,
        },
      });

      return updatedTask;
    }),

  /**
   * Update task position within or between columns (drag & drop)
   * Based on contract: lines 80-84
   */
  updatePosition: publicProcedure
    .input(
      z.object({
        taskId: z.string().cuid(),
        newStatus: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']),
        newPosition: z.number().int().min(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { taskId, newStatus, newPosition } = input;

      const task = await ctx.prisma.task.findUnique({
        where: { id: taskId },
      });

      if (!task) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Task not found or access denied',
        });
      }

      const updatedTask = await ctx.prisma.task.update({
        where: { id: taskId },
        data: {
          status: newStatus,
          position: newPosition,
        },
        include: {
          assignedUser: true,
        },
      });

      return updatedTask;
    }),

  /**
   * Assign or unassign user from task
   * Based on contract: lines 86-90
   */
  assignUser: protectedProcedure
    .input(
      z.object({
        taskId: z.string().cuid(),
        userId: z.string().cuid().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { taskId, userId } = input;

      // Check if task exists
      const task = await ctx.prisma.task.findUnique({
        where: { id: taskId },
      });

      if (!task) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Task not found or access denied',
        });
      }

      // If userId is provided, check if user exists
      if (userId) {
        const user = await ctx.prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User assignment failed - user may not exist',
          });
        }
      }

      const updatedTask = await ctx.prisma.task.update({
        where: { id: taskId },
        data: {
          assignedUserId: userId || null,
        },
        include: {
          assignedUser: true,
        },
      });

      return updatedTask;
    }),

  /**
   * Get single task with all comments
   * Based on contract: lines 92-96
   */
  getById: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;

      const task = await ctx.prisma.task.findUnique({
        where: { id },
        include: {
          assignedUser: true,
          comments: {
            include: {
              user: true,
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

      return task;
    }),
});