'use client';

import React from 'react';

import type { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { getQueryClient } from '@/components/providers/client/query-client';

type TTanstackQueryProvider = PropsWithChildren;

export default function TanstackQueryProvider({ children }: Readonly<TTanstackQueryProvider>) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
