'use client';

import React from 'react';

import type { PropsWithChildren } from 'react';

import useUserStore from '@root/modules/auth/store/use-user-store';

import PrivateNavBar from '@/app/private/private-navbar';
import AuthGuard from '@/components/providers/client/auth-gaurd';

import OnboardingFlow from './onboarding/page';

type TRootLayout = PropsWithChildren;

export default function PrivateLayout({ children }: Readonly<TRootLayout>) {
  const { user } = useUserStore();

  return (
    <AuthGuard>
      <div className='flex h-screen w-full flex-col'>
        {user?.stepper ? (
          <>
            <PrivateNavBar />
            <main className='scroll-hidden flex-1'>{children}</main>
          </>
        ) : (
          <OnboardingFlow />
        )}
      </div>
    </AuthGuard>
  );
}
