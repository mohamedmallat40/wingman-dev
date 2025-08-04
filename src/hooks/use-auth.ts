'use client';

import { useCallback, useEffect, useState } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

    checkAuth();

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
  }, [checkAuth]);

  return {
    isAuthenticated,
    isLoading,
    isLoggedIn: isAuthenticated === true,
    isLoggedOut: isAuthenticated === false
  };
}
