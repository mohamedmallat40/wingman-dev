'use client';

import React from 'react';

import type { FC } from 'react';

import PageHeader from '@/components/page-header/page-header';
import SectionContainer from '@/components/section-container/section-container';

const HeaderContainer: FC = () => (
  <SectionContainer>
    <PageHeader
      title='Dashboard'
      description='   Connect with top experts to solve your digital challenges or share your expertise with
            others.'
    ></PageHeader>
  </SectionContainer>
);

export default HeaderContainer;
