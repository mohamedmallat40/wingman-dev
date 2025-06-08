
import PrivateNavBar from '@/app/private/private-navbar';
import AuthGuard from '@/components/providers/client/auth-gaurd';
import React, { PropsWithChildren } from 'react';



type TRootLayout = PropsWithChildren;

export default function PrivateLayout({ children }: Readonly<TRootLayout>) {
  return (
    <AuthGuard>

      <div className='relative flex h-dvh w-full flex-col overflow-hidden bg-background px-44'>
        <div className='grid min-h-[100vh] grid-rows-[auto_1fr_auto]'>

          <PrivateNavBar />
          <main className=' flex flex-1 flex-col items-center justify-center overflow-hidden '>
            
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
