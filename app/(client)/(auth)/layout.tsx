import AuthLayout from '@/components/layouts/auth-layout';
import { Toaster } from '@/components/ui/toaster';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/auth';

export default async function Layout({ children }: React.PropsWithChildren) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return <AuthLayout>{children}</AuthLayout>;
}
