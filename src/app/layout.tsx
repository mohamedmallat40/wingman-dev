import '../styles/globals.scss';
import '../styles/globals.css';

import React from 'react';

import type { Metadata, Viewport } from 'next';
import type { PropsWithChildren } from 'react';

import config from '_config';

import HeaderContainer from '@/components/header-container/header-container';
import PrivateNavBar from '@/components/private-navbar';
import RootProvider from '@/components/providers/root';
import SecondNavBar from '@/components/public-navbar';
import QuickActions from '@/components/quick-actions/quick-actions';

import PublicLayout from './public/layout';

export const metadata: Metadata = {
  title: config.metadata.title,
  description: config.metadata.description,
  keywords: config.metadata.keywords,
  icons: '/favicon.svg'
};

export const viewport: Viewport = {
  themeColor: '#008000'
};

type TRootLayout = PropsWithChildren;

export default function RootLayout({ children }: Readonly<TRootLayout>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <RootProvider>
          <div className='grid min-h-[100dvh] grid-rows-[auto_1fr_auto]'>
            <PublicLayout />
            <PrivateNavBar />
            {/* <SecondNavBar /> */}
            {/* <HeaderContainer /> */}
            {children}
          </div>
        </RootProvider>
      </body>
    </html>
  );
}
