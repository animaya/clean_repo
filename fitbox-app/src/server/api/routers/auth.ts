import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { createJWT, getSessionExpiration, setSessionCookie, clearSessionCookie } from '@/lib/session';

export const authRouter = createTRPCRouter({
  /**
   * Create session for selected user (no password required)
   * Based on contract: lines 20-24
   */
  selectUser: publicProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId } = input;

      // Find the user
      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // Create JWT token
      const sessionToken = await createJWT(userId);
      const expiresAt = getSessionExpiration();

      // Store session in database
      await ctx.prisma.session.create({
        data: {
          token: sessionToken,
          userId: userId,
          expiresAt: expiresAt,
        },
      });

      // Set HTTP-only cookie if response is available
      if (ctx.res) {
        setSessionCookie(ctx.res, sessionToken);
      }

      return {
        user,
        sessionToken,
        expiresAt,
      };
    }),

  /**
   * Get current session user information
   * Based on contract: lines 26-30
   */
  getCurrentUser: publicProcedure
    .query(async ({ ctx }) => {
      // User is already validated in context if session exists
      return ctx.user;
    }),

  /**
   * Clear session and cookie
   * Based on contract: lines 32-36
   */
  logout: publicProcedure
    .mutation(async ({ ctx }) => {
      // If user is logged in, clear their session from database
      if (ctx.user) {
        // Get session token from request to delete specific session
        let sessionToken: string | null = null;

        if ('cookies' in ctx.req && typeof ctx.req.cookies.get === 'function') {
          const cookieValue = ctx.req.cookies.get('session');
          sessionToken = cookieValue?.value || null;
        } else {
          const cookieHeader = ctx.req.headers.get('cookie');
          if (cookieHeader) {
            const cookies = parseCookies(cookieHeader);
            sessionToken = cookies.session || null;
          }
        }

        // Delete session from database if token exists
        if (sessionToken) {
          await ctx.prisma.session.deleteMany({
            where: {
              token: sessionToken,
              userId: ctx.user.id,
            },
          });
        }
      }

      // Clear session cookie if response is available
      if (ctx.res) {
        clearSessionCookie(ctx.res);
      }

      return {
        success: true,
      };
    }),
});

/**
 * Helper function to parse cookies from header string
 */
function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};

  cookieHeader.split(';').forEach((cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
}