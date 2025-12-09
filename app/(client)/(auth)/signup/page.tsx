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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { PhoneInput } from '@/components/ui/phone-input';
import { CountryDropdown } from '@/components/ui/country-dropdown';
import { Logo } from '@/components/ui/logo';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  first_name: z.string().min(3, {
    message: 'First name is required',
  }),
  last_name: z.string().min(3, {
    message: 'Last name is required',
  }),
  email: z.string().email().min(3),
  phone: z.string().min(6, { message: 'Phone number is required' }),
  country: z.string().min(1),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
});

type FormData = z.infer<typeof FormSchema>;

export default function Signup() {
  const router = useRouter();
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

  const onSubmit = async (value): Promise<void> => {
    console.log(form);
  };

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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={'space-y-6'}
            autoComplete="off"
          >
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

            <Button type="submit" className="w-full" disabled={hasError}>
              Create Account
            </Button>
          </form>
          <div className="mt-4 space-y-2 text-center text-sm">
            <div>
              <button
                type="button"
                onClick={() => router.push('/login')}
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
