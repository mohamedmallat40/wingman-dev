'use client';

import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { getSkills } from '@/app/private/skills/services/skills.service';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/');
      return;
    }

    // Prefetch skills data for the authenticated user
    queryClient.prefetchQuery({
      queryKey: ['skills'],
      queryFn: getSkills,
      staleTime: 1000 * 60 * 15 // 15 minutes
    });
  }, [router, queryClient]);

  // Always render children - redirect happens in useEffect
  // This ensures server and client render the same thing
  return <>{children}</>;
}
