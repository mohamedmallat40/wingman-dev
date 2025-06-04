'use client';

import React from 'react';

import HeaderContainer from '@/app/private/dashboard/components/header-container/header-container'
import QuickActions from '@/app/private/dashboard/components/quick-actions/quick-actions';
import Container from '@/components/container/container';

export default function HomePage() {
  return (
    <Container>
      <HeaderContainer />
      <QuickActions />
    </Container>);
}
