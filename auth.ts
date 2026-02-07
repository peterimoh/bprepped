import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import * as argon from 'argon2';
import { prisma } from '@/lib/prisma';

export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  SERVER_ERROR = 'SERVER_ERROR',
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email) {
            throw new Error('No account found');
          }

          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            return { error: AuthErrorCode.ACCOUNT_NOT_FOUND } as any;
          }

          if (!user.isActive) {
            return { error: AuthErrorCode.ACCOUNT_LOCKED } as any;
          }

          const isHashVerified = await argon.verify(
            user.password as string,
            credentials.password || ''
          );

          if (!isHashVerified) {
            return { error: AuthErrorCode.INVALID_CREDENTIALS } as any;
          }

          return user;
        } catch (e) {
          return { error: AuthErrorCode.SERVER_ERROR } as any;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user as typeof user & {
          password?: string;
        };
        token.user = userWithoutPassword as any;
        // Explicitly set token.role for middleware compatibility
        token.role = userWithoutPassword.role || undefined;
        token.id = String(userWithoutPassword.id);
        token.email = userWithoutPassword.email || '';
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user && token.user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } =
          token.user as typeof token.user & { password?: string };
        session.user = userWithoutPassword as any;
        // Ensure role is set on session.user
        if (token.role) {
          session.user.role = token.role;
        }
      }
      return session;
    },

    async signIn({ user }) {
      if (user?.error) {
        switch (user?.error) {
          case AuthErrorCode.ACCOUNT_NOT_FOUND:
            throw new Error('No account found');
          case AuthErrorCode.SERVER_ERROR:
            throw new Error('internal server error');
          case AuthErrorCode.ACCOUNT_LOCKED:
            throw new Error('Account disabled, contact support');
          case AuthErrorCode.INVALID_CREDENTIALS:
            throw new Error('invalid email or password');
          default:
            throw new Error('Authentication error');
        }
      } else {
        return true;
      }
    },
  },
};
