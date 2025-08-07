import React from 'react';

import type { PropsWithChildren } from 'react';

import PrivateNavBar from '@/app/private/private-navbar';
import AuthGuard from '@/components/providers/client/auth-gaurd';

type TRootLayout = PropsWithChildren;

export default function PrivateLayout({ children }: Readonly<TRootLayout>) {
  return (
    <AuthGuard>
      <div className='flex h-screen w-full flex-col'>
        <PrivateNavBar />
        <main className='scroll-hidden flex-1'>{children}</main>
      </div>
    </AuthGuard>
  );
}
