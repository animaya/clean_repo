import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure, protectedProcedure, ownerOnlyProcedure } from '@/server/api/trpc';

export const commentsRouter = createTRPCRouter({
  /**
   * Add comment to task (requires active session)
   * Based on contract: lines 100-104
   */
  create: protectedProcedure
    .input(
      z.object({
        taskId: z.string().cuid(),
        content: z.string().min(1).max(2000),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { taskId, content } = input;

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

      const comment = await ctx.prisma.comment.create({
        data: {
          content,
          taskId,
          userId: ctx.user.id,
        },
        include: {
          user: true,
        },
      });

      return comment;
    }),

  /**
   * Update own comment only
   * Based on contract: lines 106-110
   */
  update: ownerOnlyProcedure((input, ctx) => {
    // We need to fetch the comment to get the userId for ownership check
    return ctx.prisma.comment
      .findUnique({ where: { id: input.commentId } })
      .then((comment) => comment?.userId || null);
  })
    .input(
      z.object({
        commentId: z.string().cuid(),
        content: z.string().min(1).max(2000),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { commentId, content } = input;

      // Check if comment exists
      const existingComment = await ctx.prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!existingComment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Comment not found',
        });
      }

      // Ownership is already checked by the middleware
      const updatedComment = await ctx.prisma.comment.update({
        where: { id: commentId },
        data: { content },
        include: {
          user: true,
        },
      });

      return updatedComment;
    }),

  /**
   * Delete own comment only
   * Based on contract: lines 112-116
   */
  delete: ownerOnlyProcedure((input, ctx) => {
    // We need to fetch the comment to get the userId for ownership check
    return ctx.prisma.comment
      .findUnique({ where: { id: input.commentId } })
      .then((comment) => comment?.userId || null);
  })
    .input(
      z.object({
        commentId: z.string().cuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { commentId } = input;

      // Check if comment exists
      const existingComment = await ctx.prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!existingComment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Comment not found',
        });
      }

      // Ownership is already checked by the middleware
      await ctx.prisma.comment.delete({
        where: { id: commentId },
      });

      return {
        success: true,
      };
    }),

  /**
   * Get all comments for a task
   * Based on contract: lines 118-122
   */
  getByTask: publicProcedure
    .input(
      z.object({
        taskId: z.string().cuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { taskId } = input;

      const comments = await ctx.prisma.comment.findMany({
        where: {
          taskId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      return comments;
    }),
});