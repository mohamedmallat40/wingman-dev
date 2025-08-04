'use client';

import { useEffect } from 'react';

import { LandingPage } from '@/components/landing';
import { useSmartNavigation } from '@/hooks/use-smart-navigation';

import { LoginModal } from './components/login';

const page = () => {
  const { loginModal } = useSmartNavigation();

  // Handle navigation with anchor links when page loads
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Small delay to ensure the page is fully rendered
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <>
      <LandingPage />

      {/* Login Modal for unauthenticated users */}
      <LoginModal
        isOpen={loginModal.isOpen}
        onOpenChange={loginModal.onOpenChange}
        onSwitchToRegister={() => {
          loginModal.onClose();
          // Navigate to register using router
          window.location.href = '/register';
        }}
      />
    </>
  );
};

export default page;
