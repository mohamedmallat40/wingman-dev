'use client';

import React, { useState } from 'react';

import type { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { getQueryClient } from '@/components/providers/client/query-client';

type TTanstackQueryProvider = PropsWithChildren;

export default function TanstackQueryProvider({ children }: Readonly<TTanstackQueryProvider>) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
