import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSession, signIn } from 'next-auth/react';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  ok: boolean;
  error?: string;
  status?: number;
}

export interface LoginError {
  message: string;
  code?: string;
}

export interface RegisterCredentials {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  country: string;
}

export interface RegisterResponse {
  message: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    createdAt: string;
  };
}

export interface RegisterError {
  error: string;
  type: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, LoginError, LoginCredentials>({
    mutationFn: async (
      credentials: LoginCredentials
    ): Promise<LoginResponse> => {
      try {
        const response = await signIn('credentials', {
          email: credentials.email,
          password: credentials.password,
          redirect: false,
        });

        if (response.error) {
          throw {
            message: response.error,
            code: 'LOGIN_ERROR',
          };
        }

        await getSession();

        return {
          ok: response.ok || false,
          error: response.error || undefined,
          status: response.status,
        };
      } catch (error) {
        if (error && typeof error === 'object' && 'message' in error) {
          throw error;
        }

        throw {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
          code: 'UNEXPECTED_ERROR',
        };
      }
    },
  });
}

export function useRegister() {
  return useMutation<RegisterResponse, RegisterError, RegisterCredentials>({
    mutationFn: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
          throw data as RegisterError;
        }

        return data as RegisterResponse;
      } catch (e) {
        console.error('Registration error:', e);
        throw e;
      }
    },
  });
}
