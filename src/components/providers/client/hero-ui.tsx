'use client';

import React from 'react';

import type { PropsWithChildren } from 'react';

import { HeroUIProvider } from '@heroui/system';
import { ToastProvider } from '@heroui/react';
import { useRouter } from 'next/navigation'

type THeroUiProvider = PropsWithChildren;

export default function HeroUiProvider({ children }: Readonly<THeroUiProvider>) {
      const router = useRouter();

  return <HeroUIProvider navigate={router.push}>
          <ToastProvider
          placement='top-center'
          toastProps={{
                timeout: 3000,
                

          }} />

    {children}</HeroUIProvider>;
}
