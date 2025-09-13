import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/session';
import { type User } from '@prisma/client';

/**
 * Replace this with an object if you want to pass things to `createTRPCContext`.
 */
interface CreateContextOptions {
  req: NextRequest | Request;
  res?: Response;
}

/**
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: CreateContextOptions) => {
  const { req } = opts;

  // Extract session token from cookies
  let sessionToken: string | null = null;

  // Handle both NextRequest and standard Request objects
  if ('cookies' in req && typeof req.cookies.get === 'function') {
    // NextRequest (App Router)
    const cookieValue = req.cookies.get('session');
    sessionToken = cookieValue?.value || null;
  } else {
    // Standard Request (API Routes)
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const cookies = parseCookies(cookieHeader);
      sessionToken = cookies.session || null;
    }
  }

  // Validate session and get user
  let user: User | null = null;
  if (sessionToken) {
    try {
      // Verify JWT token
      const payload = await verifyJWT(sessionToken);

      if (payload && typeof payload === 'object' && 'userId' in payload) {
        // Check if session exists in database and is not expired
        const session = await prisma.session.findUnique({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (session) {
          user = session.user;
        }
      }
    } catch (error) {
      // Invalid or expired token - user remains null
      console.warn('Invalid session token:', error);
    }
  }

  return {
    prisma,
    user,
    req,
    res: opts.res,
  };
};

/**
 * Parse cookies from cookie header string
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

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createContext = async (opts: CreateNextContextOptions) => {
  return createTRPCContext({
    req: opts.req,
    res: opts.res,
  });
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;