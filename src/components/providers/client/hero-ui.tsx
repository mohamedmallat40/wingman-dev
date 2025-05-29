'use client';

import React from 'react';

import type { PropsWithChildren } from 'react';

import { HeroUIProvider } from '@heroui/system';
import { ToastProvider } from '@heroui/react';

type THeroUiProvider = PropsWithChildren;

export default function HeroUiProvider({ children }: Readonly<THeroUiProvider>) {
  return <HeroUIProvider>
          <ToastProvider
          placement='top-center'
          toastProps={{
                timeout: 3000,
                

          }} />

    {children}</HeroUIProvider>;
}
