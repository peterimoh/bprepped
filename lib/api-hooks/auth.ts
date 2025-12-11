import { useMutation } from '@tanstack/react-query';
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

export interface ForgotPasswordResponse {
  message: string;
}

export interface ForgotPasswordError {
  error: string;
  type: string;
}

export interface ValidateResetTokenResponse {
  message: string;
}

export interface ValidateResetTokenError {
  error: string;
  type: string;
}

export interface ResetPasswordCredentials {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ResetPasswordError {
  error: string;
  type: string;
}

export function useLogin() {
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

        if (!response) {
          throw {
            message: 'No response from server',
            code: 'UNEXPECTED_ERROR',
          } as const;
        }

        if (response.error) {
          throw {
            message: response.error,
            code: 'LOGIN_ERROR',
          } as const;
        }

        await getSession();

        return {
          ok: response.ok ?? false,
          error: response.error ?? undefined,
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
    mutationFn: async (
      credentials: RegisterCredentials
    ): Promise<RegisterResponse> => {
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
        throw e;
      }
    },
  });
}

export function useForgotPassword() {
  return useMutation<
    ForgotPasswordResponse,
    ForgotPasswordError,
    { email: string }
  >({
    mutationFn: async ({ email }) => {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = (await response.json()) as
        | ForgotPasswordResponse
        | ForgotPasswordError;

      if (!response.ok) {
        throw data as ForgotPasswordError;
      }

      return data as ForgotPasswordResponse;
    },
  });
}

export function useValidateResetToken() {
  return useMutation<
    ValidateResetTokenResponse,
    ValidateResetTokenError,
    { token: string }
  >({
    mutationFn: async ({ token }) => {
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
        }),
      });

      const data = (await response.json()) as
        | ValidateResetTokenResponse
        | ValidateResetTokenError;

      if (!response.ok) {
        throw data as ValidateResetTokenError;
      }

      return data as ValidateResetTokenResponse;
    },
  });
}

export function useResetPassword() {
  return useMutation<
    ResetPasswordResponse,
    ResetPasswordError,
    ResetPasswordCredentials
  >({
    mutationFn: async ({ token, password }) => {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = (await response.json()) as
        | ResetPasswordResponse
        | ResetPasswordError;

      if (!response.ok) {
        throw data as ResetPasswordError;
      }

      return data as ResetPasswordResponse;
    },
  });
}
