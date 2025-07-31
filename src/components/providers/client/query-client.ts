// lib/react-query-client.ts
import { QueryClient } from '@tanstack/react-query';

let queryClient: QueryClient | null = null;

export function getQueryClient() {
  queryClient ??= new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false
      }
    }
  });

  return queryClient;
}
