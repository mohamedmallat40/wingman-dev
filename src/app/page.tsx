'use client';

import React from 'react';

import HeaderContainer from '@/components/header-container/header-container';
import QuickActions from '@/components/quick-actions/quick-actions';

export default function HomePage() {
  return (
    <main className='flex h-full w-full flex-col items-center justify-start'>
      <HeaderContainer />
      <QuickActions />
    </main>
  );
}
