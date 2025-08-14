'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

export default function PublicGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/private/dashboard');
    }
  }, [router]);

  return <>{children}</>;
}
