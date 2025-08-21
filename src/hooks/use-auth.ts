'use client';

import { useCallback, useEffect, useState } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => {
    // Initialize with localStorage value immediately on client side
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('token');
        return !!token;
      } catch {
        return null;
      }
    }
    return null;
  });
  
  const [isLoading, setIsLoading] = useState(() => {
    // If we could check localStorage immediately, we're not loading
    return typeof window === 'undefined';
  });

  const checkAuth = useCallback(() => {
    try {
      // Ensure we're in the browser
      if (typeof window === 'undefined') {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    } catch (error) {
      // Handle case where localStorage is not available (SSR)
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Only check auth if we haven't already initialized it
    if (isAuthenticated === null) {
      checkAuth();
    } else {
      // We already have the auth state, just stop loading
      setIsLoading(false);
    }

    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuth, isAuthenticated]);

  return {
    isAuthenticated,
    isLoading,
    isLoggedIn: isAuthenticated === true,
    isLoggedOut: isAuthenticated === false
  };
}
