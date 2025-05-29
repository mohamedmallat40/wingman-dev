
import PrivateNavBar from '@/app/dashboard/private-navbar';
import AuthGuard from '@/components/providers/client/auth-gaurd';
import React, { PropsWithChildren } from 'react';



type TRootLayout = PropsWithChildren;

export default function PublicLayout({ children }: Readonly<TRootLayout>) {
  return (
    <AuthGuard>
    <div className='relative flex h-dvh w-full flex-col overflow-hidden bg-background'>
              <div className='grid min-h-[100vh] grid-rows-[auto_1fr_auto]'>

      <PrivateNavBar />
      <main className='container mx-auto flex flex-1 flex-col items-center justify-center overflow-hidden px-8'>
        {children}
      </main>
      </div>
    </div>
    </AuthGuard>
  );
}
