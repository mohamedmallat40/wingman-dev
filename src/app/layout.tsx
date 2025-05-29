import '../styles/globals.scss';
import '../styles/globals.css';

import React from 'react';

import type { Metadata, Viewport } from 'next';
import type { PropsWithChildren } from 'react';

import config from '_config';

import RootProvider from '@/components/providers/root';
import {NextIntlClientProvider} from 'next-intl';

import {getLocale} from 'next-intl/server';

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

export default async function RootLayout({ children }: Readonly<TRootLayout>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <RootProvider>
     
        <NextIntlClientProvider>{children}</NextIntlClientProvider>

        </RootProvider>
      </body>
    </html>
  );
}
