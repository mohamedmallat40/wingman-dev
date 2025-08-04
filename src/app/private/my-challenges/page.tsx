'use client';

import React from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

import DashboardLayout from '@/components/layouts/dashboard-layout';

export default function MyChallengesPage() {
  return (
    <DashboardLayout
      pageTitle='My Challenges'
      pageDescription='Track your programming challenges and improve your skills'
      pageIcon='solar:cup-star-linear'
      breadcrumbs={[
        { label: 'Home', href: '/private/dashboard', icon: 'solar:home-linear' },
        { label: 'My Challenges' }
      ]}
      headerActions={
        <div className='flex items-center gap-2'>
          <Button
            variant='flat'
            size='sm'
            startContent={<Icon icon='solar:history-linear' className='h-4 w-4' />}
          >
            History
          </Button>
          <Button
            color='primary'
            size='sm'
            startContent={<Icon icon='solar:play-linear' className='h-4 w-4' />}
          >
            Start Challenge
          </Button>
        </div>
      }
    >
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <Icon icon='solar:cup-star-linear' className='text-primary mb-4 h-24 w-24' />
          <h2 className='mb-2 text-2xl font-bold'>My Challenges</h2>
          <p className='text-default-600 mb-4'>Your programming challenges will appear here</p>
          <Button color='primary' startContent={<Icon icon='solar:play-linear' />}>
            Start Your First Challenge
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
