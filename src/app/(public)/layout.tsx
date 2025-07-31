import React from 'react';

import type { PropsWithChildren } from 'react';

import PublicGuard from '@/components/providers/client/public-gaurd';

import BasicNavbar from './components/basic-navbar';

type TRootLayout = PropsWithChildren;

export default function PublicLayout({ children }: Readonly<TRootLayout>) {
  return (
    <PublicGuard>
      <div className='bg-background relative flex h-full w-full flex-col overflow-hidden'>
        <BasicNavbar />
        <main className='container mx-auto flex flex-1 flex-col items-center justify-center overflow-hidden px-8'>
          {children}
        </main>
      </div>
    </PublicGuard>
  );
}
