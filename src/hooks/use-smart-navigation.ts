'use client';

import { useDisclosure } from '@heroui/react';
import { useRouter } from 'next/navigation';

import { useAuth } from './use-auth';

export function useSmartNavigation() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const loginModal = useDisclosure();

  const navigateToPrivate = (path: string, fallbackAction?: () => void) => {
    // Don't navigate if still checking auth
    if (isLoading) {
      // Optional: Show loading indicator or do nothing
      return;
    }

    if (isAuthenticated) {
      // User is authenticated, navigate to private route
      router.push(path);
    } else {
      // User is not authenticated, show login modal or execute fallback
      if (fallbackAction) {
        fallbackAction();
      } else {
        loginModal.onOpen();
      }
    }
  };

  const navigateToPublic = (path: string) => {
    // Public routes can be navigated immediately
    if (path.startsWith('#')) {
      // Handle anchor links - ensure we're in browser
      if (typeof window !== 'undefined') {
        const element = document.querySelector(path);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      router.push(path);
    }
  };

  const handleSuccessfulLogin = (redirectPath?: string) => {
    loginModal.onClose();
    if (redirectPath) {
      router.push(redirectPath);
    }
  };

  return {
    navigateToPrivate,
    navigateToPublic,
    loginModal,
    handleSuccessfulLogin,
    isAuthenticated,
    isLoading
  };
}
