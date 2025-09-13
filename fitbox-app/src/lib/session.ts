import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import type { User } from '@/store/auth';

// JWT secret key
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

// Session duration: 7 days
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const COOKIE_NAME = 'taskify-session';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
};

export interface SessionPayload extends JWTPayload {
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  exp: number;
}

/**
 * Create a JWT token for a user session
 */
export async function createSession(user: User): Promise<string> {
  const payload: Omit<SessionPayload, 'iat' | 'exp'> = {
    userId: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  return token;
}

// Legacy function for backwards compatibility
export async function createJWT(userId: string): Promise<string> {
  const expirationTime = Math.floor((Date.now() + SESSION_DURATION) / 1000);

  return await new SignJWT({ userId, exp: expirationTime })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT token
 */
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as SessionPayload;
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}

// Legacy function for backwards compatibility
export async function verifyJWT(token: string): Promise<SessionPayload | null> {
  return verifySession(token);
}

/**
 * Get current session from cookies
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySession(token);
}

/**
 * Get session token from cookies (for server components)
 */
export function getSessionToken(): string | undefined {
  if (typeof window === 'undefined') {
    // Server-side: use cookies() helper
    try {
      const cookieStore = cookies();
      const sessionCookie = cookieStore.get(COOKIE_NAME);
      return sessionCookie?.value;
    } catch (error) {
      // cookies() not available in this context
      return undefined;
    }
  } else {
    // Client-side: parse document.cookie manually
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(cookie =>
      cookie.trim().startsWith(`${COOKIE_NAME}=`)
    );
    return sessionCookie?.split('=')[1];
  }
}

/**
 * Set session cookie
 */
export async function setSessionCookie(user: User): Promise<void> {
  const token = await createSession(user);
  const cookieStore = cookies();

  cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Legacy functions for backwards compatibility
export function setSessionCookieResponse(response: Response, token: string): void {
  const expirationDate = new Date(Date.now() + SESSION_DURATION);

  response.headers.set(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Expires=${expirationDate.toUTCString()}`
  );
}

export function clearSessionCookieResponse(response: Response): void {
  response.headers.set(
    'Set-Cookie',
    `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  );
}

/**
 * Refresh session if close to expiry
 */
export async function refreshSession(): Promise<SessionPayload | null> {
  const token = getSessionToken();
  if (!token) {
    return null;
  }

  const session = await verifySession(token);
  if (!session) {
    await clearSessionCookie();
    return null;
  }

  // Check if token is close to expiry (less than 1 day remaining)
  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = (session.exp || 0) - now;
  const oneDayInSeconds = 24 * 60 * 60;

  if (timeUntilExpiry < oneDayInSeconds) {
    // Refresh the token
    const user: User = {
      id: session.userId,
      email: session.email,
      name: session.name,
      avatar: session.avatar,
    };

    await setSessionCookie(user);
  }

  return session;
}

/**
 * Convert session payload to user object
 */
export function sessionToUser(session: SessionPayload): User {
  return {
    id: session.userId,
    email: session.email,
    name: session.name,
    avatar: session.avatar,
  };
}

/**
 * Get session expiration date
 */
export function getSessionExpiration(): Date {
  return new Date(Date.now() + SESSION_DURATION);
}