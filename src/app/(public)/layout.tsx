
import React, { PropsWithChildren } from 'react';



import BasicNavbar from './components/basic-navbar';
import PublicGuard from '@/components/providers/client/public-gaurd';
type TRootLayout = PropsWithChildren;

export default function PublicLayout({ children }: Readonly<TRootLayout>) {
  return (
    <PublicGuard>
    <div className='relative flex h-dvh w-full flex-col overflow-hidden bg-background'>
      <BasicNavbar />
      <main className='container mx-auto flex flex-1 flex-col items-center justify-center overflow-hidden px-8'>
        {children}
      </main>
    </div>
    </PublicGuard>
  );
}
