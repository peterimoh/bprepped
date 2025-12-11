'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { PhoneInput } from '@/components/ui/phone-input';
import { CountryDropdown } from '@/components/ui/country-dropdown';
import { Logo } from '@/components/ui/logo';
import { useRouter } from 'next/navigation';
import { IsManagement } from '@/lib/is-management';
import { Path } from '@/lib/path';
import {
  useRegister,
  useLogin,
  RegisterCredentials,
} from '@/lib/api-hooks/auth';

const FormSchema = z.object({
  first_name: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'First name can only contain letters, spaces, hyphens, and apostrophes'
    ),
  last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Last name can only contain letters, spaces, hyphens, and apostrophes'
    ),
  email: z.string().email('Please provide a valid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must not exceed 20 digits')
    .regex(/^[+]?[\d\s()-]+$/, 'Please provide a valid phone number'),
  country: z
    .string()
    .min(2, 'Country name must be at least 2 characters')
    .max(50, 'Country name must not exceed 50 characters'),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one special character',
    })
    .trim(),
});

type FormData = z.infer<typeof FormSchema>;

export default function Signup() {
  const router = useRouter();
  const { isPending, isError, error, mutate } = useRegister();
  const {
    isPending: isLoginPending,
    mutate: loginMutate,
    isError: isLoginError,
    error: loginError,
  } = useLogin();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      country: '',
    },
  });

  const hasError = Object.entries(form.formState.errors).length > 0;

  const onSubmit = async (value: RegisterCredentials): Promise<void> => {
    await mutate(
      { ...value },
      {
        onSuccess: async (data) => {
          await loginMutate(
            { email: value.email, password: value.password },
            {
              onSuccess: async () => {
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
            }
          );
        },
      }
    );
  };

  return (
    <Card className="relative z-10 w-full max-w-md border-2 bg-white shadow-elevated">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Logo />
        </div>

        <CardTitle className="text-2xl">Get Started</CardTitle>
        <CardDescription>Sign up to your account.</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={'space-y-6'}
            autoComplete="off"
          >
            {isError && (
              <Alert
                variant={'destructive'}
                className={
                  'border-transparent bg-red-200 py-3 text-sm text-red-500'
                }
              >
                <AlertDescription className={'capitalize'}>
                  {error?.type === 'ValidationError' && error?.details ? (
                    <div className="space-y-1">
                      {error.details.map((detail, index) => (
                        <div key={index}>
                          {detail.field}: {detail.message}
                        </div>
                      ))}
                    </div>
                  ) : (
                    `Error: ${error?.error || error?.message || 'Registration failed'}`
                  )}
                </AlertDescription>
              </Alert>
            )}

            {isLoginError && (
              <Alert
                variant={'destructive'}
                className={
                  'border-transparent bg-red-200 py-3 text-sm text-red-500'
                }
              >
                <AlertDescription className={'capitalize'}>
                  Error: {loginError.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-wrap gap-3 align-middle sm:flex-nowrap">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className={'w-full'}>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage>{field.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className={'w-full'}>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage>{field.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@host.com"
                      autoComplete="off"
                      {...field}
                    />
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
                    <PasswordInput
                      placeholder="••••••••"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{field.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput
                      placeholder="09012353982"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{field.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <CountryDropdown
                      defaultValue={field.value}
                      onChange={(country) => {
                        field.onChange(country.alpha3);
                      }}
                    />
                  </FormControl>
                  <FormMessage>{field.message}</FormMessage>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={hasError || isPending || isLoginPending}
            >
              {isPending || isLoginPending
                ? 'Creating Account...'
                : 'Create Account'}
            </Button>
          </form>
          <div className="mt-4 space-y-2 text-center text-sm">
            <div>
              <button
                type="button"
                onClick={() => router.push(Path.Client.Auth.Login)}
                className="text-primary hover:underline"
              >
                Already have an account? Sign in
              </button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
