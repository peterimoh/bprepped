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
            return { error: AuthErrorCode.ACCOUNT_NOT_FOUND };
          }

          if (!user.isActive) {
            return { error: AuthErrorCode.ACCOUNT_LOCKED };
          }

          const isHashVerified = await argon.verify(
            user.password,
            credentials.password || ''
          );

          if (!isHashVerified) {
            return { error: AuthErrorCode.INVALID_CREDENTIALS };
          }

          return user;
        } catch (e) {
          return { error: AuthErrorCode.SERVER_ERROR };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
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
        }
      } else {
        return true;
      }
    },
  },
};
