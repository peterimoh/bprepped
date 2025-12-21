import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import type { Session } from 'next-auth';
import { UnAuthorizedError } from './custom-error';

/**
 * Gets the current session for API routes.
 * Returns the session if authenticated, or null if not authenticated.
 * Use this when you need to handle unauthenticated requests differently.
 */
export async function getApiSession(): Promise<Session | null> {
  return await getServerSession(authOptions);
}

/**
 * Requires authentication for API routes.
 * Returns the session if authenticated, or throws UnAuthorizedError if not.
 * Use this when the route must be protected.
 *
 * @throws {UnAuthorizedError} If the user is not authenticated
 *
 * @example
 * ```ts
 * export async function GET() {
 *   try {
 *     const session = await requireAuth();
 *     // Use session.user here
 *   } catch (e) {
 *     return formatRequestError(e);
 *   }
 * }
 * ```
 */
export async function requireAuth(): Promise<Session> {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new UnAuthorizedError('unauthorized');
  }

  return session;
}

/**
 * Type guard to check if the result from requireAuth is a NextResponse (error).
 */
export function isAuthError(
  result: Session | NextResponse<{ error: string }>
): result is NextResponse<{ error: string }> {
  return result instanceof NextResponse;
}
