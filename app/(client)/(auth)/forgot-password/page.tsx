'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/ui/logo';
import { useRouter } from 'next/navigation';
import { Path } from '@/lib/path';
import { useForgotPassword } from '@/lib/api-hooks/auth';

const FormSchema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof FormSchema>;

function SuccessAlert() {
  const router = useRouter();
  return (
    <CardContent className="pt-6 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center py-4">
          <Logo disabled />
        </div>
        <p className="text-sm text-muted-foreground">
          If your email exists in our system, you will receive a password reset
          link shortly.
        </p>

        <Button
          variant="outline"
          onClick={() => router.push(Path.Client.Auth.Login)}
          className="mt-4"
        >
          Back to Login
        </Button>
      </div>
    </CardContent>
  );
}

export default function ForgotPassword() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  });
  const { isPending, isError, error, mutate, isSuccess } = useForgotPassword();

  const onSubmit = (value) => {
    mutate({ email: value.email });
  };

  const hasError = Object.entries(form.formState.errors).length > 0;

  return (
    <Card className="relative z-10 w-full max-w-md border-2 bg-white shadow-elevated">
      {!isSuccess ? (
        <>
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <Logo />
            </div>
            <CardTitle className="text-2xl">Forgot Password?</CardTitle>
            <CardDescription>
              Enter your email address and we&#39;ll send you a link to reset
              your password
            </CardDescription>
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
                      Error: {error.error}
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

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending || hasError}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Reset Link
                </Button>
              </form>

              <div className="mt-4 text-center text-sm">
                <button
                  type="button"
                  onClick={() => router.push(Path.Client.Auth.Login)}
                  className="mx-auto flex items-center gap-2 text-primary hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </button>
              </div>
            </Form>
          </CardContent>
        </>
      ) : (
        <SuccessAlert />
      )}
    </Card>
  );
}
