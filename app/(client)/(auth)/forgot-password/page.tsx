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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Logo } from '@/components/ui/logo';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof FormSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (value): Promise<void> => {
    console.log(form);
  };

  return (
    <Card className="relative z-10 w-full max-w-md border-2 bg-white shadow-elevated">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Logo />
        </div>
        <CardTitle className="text-2xl">Forgot Password?</CardTitle>
        <CardDescription>
          Enter your email address and we&#39;ll send you a link to reset your
          password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={'space-y-6'}
            autoComplete="off"
          >
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

            <Button type="submit" className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Send Reset Link
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="mx-auto flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
