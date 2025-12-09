import { DefaultSession } from 'next-auth';
import { Roles } from '@/lib/types';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: number;
    email: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    role?: string;
  }
}
