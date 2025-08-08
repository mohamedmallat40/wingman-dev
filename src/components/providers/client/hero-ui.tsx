'use client';

import React, { useCallback } from 'react';

import type { PropsWithChildren } from 'react';

import { HeroUIProvider } from '@heroui/system';
import { ToastProvider } from '@heroui/toast';
import { useRouter } from 'next/navigation';

type THeroUiProvider = PropsWithChildren;

export default function HeroUiProvider({ children }: Readonly<THeroUiProvider>) {
  const router = useRouter();

  const navigate = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  return (
    <HeroUIProvider navigate={navigate}>
      {children} <ToastProvider placement='top-center'></ToastProvider>
    </HeroUIProvider>
  );
}
