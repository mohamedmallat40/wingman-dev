'use client';

import React, { useEffect } from 'react';

import type { PropsWithChildren } from 'react';

import useUserStore from '@root/modules/auth/store/use-user-store';
import { useRouter } from 'next/navigation';

import PrivateNavBar from '@/app/private/private-navbar';
import AuthGuard from '@/components/providers/client/auth-gaurd';

import OnboardingFlow from './onboarding/page';

type TRootLayout = PropsWithChildren;

export default function PrivateLayout({ children }: Readonly<TRootLayout>) {
  const { user } = useUserStore();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      const currentPath = globalThis.location.pathname;

      if (!user.stepper && currentPath !== '/private/onboarding') {
        router.replace('/private/onboarding');
      } else if (user.stepper && currentPath === '/private/onboarding') {
        router.replace('/private/dashboard');
      }
    }
    console.log(user);
  }, [user, router]);

  return (
    <AuthGuard>
      <div className='flex h-screen w-full flex-col'>
        {user?.stepper ? <PrivateNavBar /> : null}
        <main className='scroll-hidden flex-1'>{children}</main>
      </div>
    </AuthGuard>
  );
}
