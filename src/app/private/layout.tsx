import React from 'react';

import type { PropsWithChildren } from 'react';

import PrivateNavBar from '@/app/private/private-navbar';
import AuthGuard from '@/components/providers/client/auth-gaurd';

type TRootLayout = PropsWithChildren;

export default function PrivateLayout({ children }: Readonly<TRootLayout>) {
  return (
    <AuthGuard>
      <div className='flex h-dvh w-full flex-col items-center'>
        <div className='grid min-h-[100vh] w-full grid-cols-1 grid-rows-[auto_1fr_auto] overflow-x-hidden'>
          <PrivateNavBar />
          <main className='flex flex-1 flex-col items-center justify-center'>{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
