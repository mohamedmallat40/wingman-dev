'use client';

import { useEffect } from 'react';

import { QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { getSkills } from '@/app/private/skills/services/skills.service';

export default function AuthGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/');
      return;
    }

    queryClient
      .prefetchQuery({
        queryKey: ['skills'],
        queryFn: getSkills,
        staleTime: 1000 * 60 * 15
      })
      .catch((error) => {
        console.error('Failed to prefetch skills:', error);
      });
  }, [router, queryClient]);

  // Always render children - redirect happens in useEffect
  // This ensures server and client render the same thing
  return <>{children}</>;
}
