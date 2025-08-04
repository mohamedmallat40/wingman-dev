'use client';

import React from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

import DashboardLayout from '@/components/layouts/dashboard-layout';

export default function CommunityPage() {
  return (
    <DashboardLayout
      pageTitle='Community'
      pageDescription='Connect with developers and join discussions'
      pageIcon='solar:users-group-rounded-linear'
      breadcrumbs={[
        { label: 'Home', href: '/private/dashboard', icon: 'solar:home-linear' },
        { label: 'Community' }
      ]}
      headerActions={
        <div className='flex items-center gap-2'>
          <Button
            variant='flat'
            size='sm'
            startContent={<Icon icon='solar:bell-linear' className='h-4 w-4' />}
          >
            Notifications
          </Button>
          <Button
            color='primary'
            size='sm'
            startContent={<Icon icon='solar:pen-linear' className='h-4 w-4' />}
          >
            New Post
          </Button>
        </div>
      }
    >
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <Icon icon='solar:users-group-rounded-linear' className='text-primary mb-4 h-24 w-24' />
          <h2 className='mb-2 text-2xl font-bold'>Developer Community</h2>
          <p className='text-default-600 mb-4'>
            Connect with fellow developers and share knowledge
          </p>
          <Button color='primary' startContent={<Icon icon='solar:users-group-rounded-linear' />}>
            Join Discussions
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
