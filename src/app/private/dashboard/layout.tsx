
'use client';
import HeaderContainer from '@/app/private/dashboard/components/header-container/header-container';
import QuickActions from '@/app/private/dashboard/components/quick-actions/quick-actions';
import TabsRouting from '@/app/private/dashboard/components/tabs/tabs-routing';
import Container from '@/components/container/container';
import HeaderPage from '@/components/header-page/header-page';
import SectionContainer from '@/components/section-container/section-container';
import React, { PropsWithChildren } from 'react';



type TRootLayout = PropsWithChildren;

export default function DashboardLayout({ children }: Readonly<TRootLayout>) {
  return (
    <Container>
        <HeaderPage title='Dashboard' description='Connect with top experts to solve your digital challenges or share your expertise with others.' />
    <QuickActions />
    <TabsRouting />

    <SectionContainer className='my-4 py-8' >
        {children}
    </SectionContainer>
  </Container>);
  
}
