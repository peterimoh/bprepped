'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Roles } from '@/lib/types';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      router.push('/login');
      return;
    }

    if (session.user.role !== Roles.Admin && session.user.role !== Roles.SuperAdmin) {
      router.push('/dashboard'); // Redirect to dashboard for non-admin users
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || (session.user.role !== Roles.Admin && session.user.role !== Roles.SuperAdmin)) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
