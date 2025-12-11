'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import * as z from 'zod';
import { PasswordInput } from '@/components/ui/password-input';
import { Logo } from '@/components/ui/logo';
import { useRouter } from 'next/navigation';
import { Path } from '@/lib/path';
import { useValidateResetToken, useResetPassword } from '@/lib/api-hooks/auth';

const FormSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof FormSchema>;

function NoTokens() {
  return (
    <Card className="relative z-10 w-full max-w-md border-2 bg-white shadow-elevated">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Logo />
        </div>
        <CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
        <CardDescription>
          This password reset link is invalid or has expired.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 text-center">
        <Button
          variant="outline"
          onClick={() =>
            (window.location.href = Path.Client.Auth.ForgotPassword)
          }
          className="mt-4"
        >
          Request New Reset Link
        </Button>
      </CardContent>
    </Card>
  );
}

function TokenExpired() {
  return (
    <Card className="relative z-10 w-full max-w-md border-2 bg-white shadow-elevated">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Logo />
        </div>
        <CardTitle className="text-2xl">Link Expired</CardTitle>
        <CardDescription>
          This password reset link has expired. Please request a new one.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 text-center">
        <Button
          variant="outline"
          onClick={() =>
            (window.location.href = Path.Client.Auth.ForgotPassword)
          }
          className="mt-4"
        >
          Request New Reset Link
        </Button>
      </CardContent>
    </Card>
  );
}

function TokenInvalid() {
  return (
    <Card className="relative z-10 w-full max-w-md border-2 bg-white shadow-elevated">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Logo />
        </div>
        <CardTitle className="text-2xl">Invalid Token</CardTitle>
        <CardDescription>
          This password reset token is invalid. Please request a new one.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 text-center">
        <Button
          variant="outline"
          onClick={() =>
            (window.location.href = Path.Client.Auth.ForgotPassword)
          }
          className="mt-4"
        >
          Request New Reset Link
        </Button>
      </CardContent>
    </Card>
  );
}

function LoadingSpinner() {
  return (
    <Card className="relative z-10 w-full max-w-md border-2 bg-white shadow-elevated">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Logo />
        </div>
      </CardHeader>
      <CardContent className="pt-6 text-center">
        <div className="flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>

        <p className={'py-4'}>Loading...</p>
      </CardContent>
    </Card>
  );
}

export default function PasswordReset() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token');
  const { mutate: validateToken } = useValidateResetToken();
  const {
    mutate: resetPassword,
    isPending: isResetting,
    isError: isResetError,
    error: resetPasswordError,
  } = useResetPassword();
  const [tokenStatus, setTokenStatus] = useState<
    'expired' | 'invalid' | 'missing' | 'valid' | 'loading' | undefined
  >(() => (token ? 'loading' : 'missing'));

  useEffect(() => {
    if (!token) {
      return;
    }

    const verifyToken = async () => {
      setTokenStatus('loading');
      validateToken(
        {
          token,
        },
        {
          onSuccess: () => {
            setTokenStatus('valid');
          },
          onError(err) {
            switch (err.type) {
              case 'ExpiredTokenError':
                setTokenStatus('expired');
                break;
              case 'NotFoundError':
                setTokenStatus('invalid');
                break;
              default:
                setTokenStatus('invalid');
            }
          },
        }
      );
    };

    verifyToken();
  }, [token, validateToken]);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (value: FormData): Promise<void> => {
    if (!token) return;

    resetPassword(
      {
        token,
        password: value.password,
      },
      {
        onSuccess: () => {
          router.push(Path.Client.Auth.Login);
        },
      }
    );
  };

  const hasError = Object.entries(form.formState.errors).length > 0;

  if (tokenStatus === 'loading') {
    return <LoadingSpinner />;
  }

  if (tokenStatus === 'missing') {
    return <NoTokens />;
  }

  if (tokenStatus === 'expired') {
    return <TokenExpired />;
  }

  if (tokenStatus === 'invalid') {
    return <TokenInvalid />;
  }

  return (
    <Card className="relative z-10 w-full max-w-md border-2 bg-white shadow-elevated">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Logo />
        </div>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-6'}>
            {isResetError && (
              <Alert
                variant={'destructive'}
                className={
                  'border-transparent bg-red-200 py-3 text-sm text-red-500'
                }
              >
                <AlertDescription className={'capitalize'}>
                  {resetPasswordError.error}
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage>{field.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage>{field.message}</FormMessage>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={hasError || isResetting}
            >
              {isResetting ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => router.push(Path.Client.Auth.Login)}
              className="text-primary hover:underline"
            >
              Back to login
            </button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
