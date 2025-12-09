'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
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
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Logo } from '@/components/ui/logo';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { IsManagement } from '@/lib/is-management';
import { Path } from '@/lib/path';
import { useLogin } from '@/lib/api-hooks/auth';

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

type FormData = z.infer<typeof FormSchema>;

export default function Login() {
  const router = useRouter();
  const { isPending, isError, error, mutate } = useLogin();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (value): Promise<void> => {
    const result = await mutate(value, {
      onSuccess: async () => {
        toast({ title: 'Welcome Back' });

        const finalSession = await getSession();
        const { user } = finalSession;
        const isAdmin = await IsManagement(user);

        if (isAdmin) {
          router.push(Path.Admin.Root);
          await router.refresh();
        } else {
          router.push(Path.Client.Protected.Root);
          await router.refresh();
        }
      },
    });
  };

  const hasError = Object.entries(form.formState.errors).length > 0;

  return (
    <Card className="relative z-10 w-full max-w-md border-2 bg-white shadow-elevated">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Logo />
        </div>

        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to continue building your resume
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-6'}>
            {isError && (
              <Alert
                variant={'destructive'}
                className={
                  'border-transparent bg-red-200 py-3 text-sm text-red-500'
                }
              >
                <AlertDescription className={'capitalize'}>
                  Error: {error.message}
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@host.com" {...field} />
                  </FormControl>
                  <FormMessage>{field.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
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
              disabled={isPending || hasError}
            >
              {isPending ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 space-y-2 text-center text-sm">
            <button
              type="button"
              onClick={() => router.push(Path.Client.Auth.ForgotPassword)}
              className="text-primary hover:underline"
            >
              Forgot your password?
            </button>

            <div>
              <button
                type="button"
                onClick={() => router.push(Path.Client.Auth.Signup)}
                className="text-primary hover:underline"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
