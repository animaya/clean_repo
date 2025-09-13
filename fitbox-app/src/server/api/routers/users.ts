import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const usersRouter = createTRPCRouter({
  /**
   * Get all 5 predefined users for selection screen
   * Based on contract: lines 40-44
   */
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      const users = await ctx.prisma.user.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      });

      console.log('Server: users.getAll returning:', users);
      console.log('Server: users.getAll count:', users.length);

      return users;
    }),

  /**
   * Get specific user by ID
   * Based on contract: lines 46-50
   */
  getById: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;

      const user = await ctx.prisma.user.findUnique({
        where: { id },
      });

      return user;
    }),
});