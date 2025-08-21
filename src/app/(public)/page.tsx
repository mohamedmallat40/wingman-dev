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

      <LoginModal
        isOpen={loginModal.isOpen}
        onOpenChange={loginModal.onOpenChange}
        onSwitchToRegister={() => {
          loginModal.onClose();
          window.location.href = '/register';
        }}
      />
    </>
  );
};

export default page;
