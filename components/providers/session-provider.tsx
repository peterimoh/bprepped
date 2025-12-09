'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

export function Providers({ children }: { children: React.ReactNode }) {
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <SessionProvider
        refetchInterval={5 * 60 * 1000}
        refetchOnWindowFocus={true}
      >
        {children}
      </SessionProvider>
    </QueryClientProvider>
  );
}
