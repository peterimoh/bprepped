import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      email: string | null;
      role: string | null;
      fullName: string | null;
      phone: string | null;
      bio: string | null;
      isActive: boolean;
      avatarUrl: string | null;
      location: string | null;
      createdAt: Date;
      updatedAt: Date;
    } & Omit<DefaultSession['user'], 'id' | 'email'>;
  }

  interface User {
    id: number;
    email: string | null;
    role: string | null;
    fullName: string | null;
    phone: string | null;
    bio: string | null;
    isActive: boolean;
    avatarUrl: string | null;
    location: string | null;
    createdAt: Date;
    updatedAt: Date;
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    role?: string;
    user?: {
      id: number;
      email: string | null;
      role: string | null;
      fullName: string | null;
      phone: string | null;
      bio: string | null;
      isActive: boolean;
      avatarUrl: string | null;
      location: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
  }
}
