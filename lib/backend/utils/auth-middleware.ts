import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import type { Session } from 'next-auth';
import { UnAuthorizedError } from '@/lib/backend';

export interface AuthUser {
  id: number;
  email: string;
  fullName: string | null;
  role: string | null;
  phone: string | null;
  bio: string | null;
  isActive: boolean;
  avatarUrl: string | null;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedSession extends Session {
  user: AuthUser;
}

/**
 * Retrieves the current session for API routes.
 *
 * @returns {Promise<Session | null>} The session if authenticated, or null otherwise.
 * @example
 * const session = await getApiSession();
 * if (session) {
 *   // do something
 * }
 */
export async function getApiSession(): Promise<Session | null> {
  return await getServerSession(authOptions);
}

/**
 * Protects an API route by requiring a valid session.
 *
 * @returns {Promise<AuthenticatedSession>} The authenticated session.
 * @throws {UnAuthorizedError} If the user is not authenticated or session is invalid.
 *
 * @example
 * export async function GET() {
 *   try {
 *     const session = await requireAuth();
 *     const userId = session.user.id;
 *     // ... business logic
 *   } catch (error) {
 *     return formatRequestError(error);
 *   }
 * }
 */
export async function requireAuth(): Promise<AuthenticatedSession> {
  const session = (await getServerSession(
    authOptions
  )) as AuthenticatedSession | null;

  if (!session?.user?.email) {
    throw new UnAuthorizedError('Authentication required');
  }

  return session;
}
