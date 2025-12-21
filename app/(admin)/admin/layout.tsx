'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { IsManagement } from '@/lib/is-management';
import { Path } from '@/lib/path';
import { Providers } from '@/components/providers/session-provider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push(Path.Client.Auth.Login);
      return;
    }

    const isAdmin = IsManagement(session.user);
    if (!isAdmin) {
      router.push(Path.Client.Protected.Root);
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return <Providers>{children}</Providers>;
}
