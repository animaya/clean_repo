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

      console.log(`📥 API updatePosition called with:`, { taskId, newStatus, newPosition });

      const task = await ctx.prisma.task.findUnique({
        where: { id: taskId },
      });

      if (!task) {
        console.error(`❌ Task ${taskId} not found`);
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Task not found or access denied',
        });
      }

      console.log(`📄 Found task ${taskId}, current status: ${task.status}, updating to: ${newStatus}`);

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

      console.log(`✅ API successfully updated task ${taskId} to status ${updatedTask.status}`);

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
   * Create a new task
   */
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(200),
        description: z.string().max(1000).optional(),
        projectId: z.string().cuid(),
        status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']).default('TODO'),
        assignedUserId: z.string().cuid().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { title, description, projectId, status, assignedUserId } = input;

      // Check if project exists
      const project = await ctx.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      // If assignedUserId is provided, check if user exists
      if (assignedUserId) {
        const user = await ctx.prisma.user.findUnique({
          where: { id: assignedUserId },
        });

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Assigned user not found',
          });
        }
      }

      // Get the next position for the status
      const lastTask = await ctx.prisma.task.findFirst({
        where: { projectId, status },
        orderBy: { position: 'desc' },
      });

      const position = lastTask ? lastTask.position + 1 : 0;

      const newTask = await ctx.prisma.task.create({
        data: {
          title,
          description,
          projectId,
          status,
          position,
          assignedUserId,
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
      });

      return newTask;
    }),

  /**
   * Update an existing task
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        title: z.string().min(1).max(200).optional(),
        description: z.string().max(1000).optional(),
        status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']).optional(),
        assignedUserId: z.string().cuid().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, title, description, status, assignedUserId } = input;

      // Check if task exists
      const existingTask = await ctx.prisma.task.findUnique({
        where: { id },
      });

      if (!existingTask) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Task not found',
        });
      }

      // If assignedUserId is provided, check if user exists
      if (assignedUserId) {
        const user = await ctx.prisma.user.findUnique({
          where: { id: assignedUserId },
        });

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Assigned user not found',
          });
        }
      }

      // Update the task
      const updatedTask = await ctx.prisma.task.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(status !== undefined && { status }),
          ...(assignedUserId !== undefined && { assignedUserId }),
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
      });

      return updatedTask;
    }),

  /**
   * Delete task (only allowed for TODO status)
   */
  delete: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      // Check if task exists and get its current status
      const existingTask = await ctx.prisma.task.findUnique({
        where: { id },
        select: { id: true, status: true, projectId: true },
      });

      if (!existingTask) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Task not found',
        });
      }

      // Only allow deletion of tasks in TODO status
      if (existingTask.status !== 'TODO') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Tasks can only be deleted from the TODO stage',
        });
      }

      // Delete the task
      const deletedTask = await ctx.prisma.task.delete({
        where: { id },
      });

      return deletedTask;
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