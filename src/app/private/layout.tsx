import React from 'react';

import type { PropsWithChildren } from 'react';

import PrivateNavBar from '@/app/private/private-navbar';
import AuthGuard from '@/components/providers/client/auth-gaurd';

type TRootLayout = PropsWithChildren;

export default function PrivateLayout({ children }: Readonly<TRootLayout>) {
  return (
    <AuthGuard>
      <div className='flex h-screen w-full flex-col overflow-hidden bg-background'>
        <PrivateNavBar />
        <main className='flex-1 overflow-hidden'>
          <div className='h-full w-full'>
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
