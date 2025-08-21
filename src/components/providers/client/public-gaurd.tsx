'use client';

import { useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PublicGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Use layoutEffect for immediate execution after hydration
  useLayoutEffect(() => {
    setIsHydrated(true);
    
    try {
      const token = localStorage.getItem('token');
      if (token) {
        setShouldRedirect(true);
        // Use setTimeout to avoid calling router during render
        setTimeout(() => {
          router.replace('/private/dashboard');
        }, 0);
        return;
      }
    } catch {
      // If localStorage fails, continue to render (probably not authenticated)
    }
  }, [router]);

  // During SSR or before hydration, render children to match server
  if (!isHydrated) {
    return <>{children}</>;
  }

  // After hydration, if user should redirect, render nothing
  if (shouldRedirect) {
    return null;
  }

  // User is definitely not authenticated, safe to render
  return <>{children}</>;
}
