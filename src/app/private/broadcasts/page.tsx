'use client';

import React from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

import DashboardLayout from '@/components/layouts/dashboard-layout';

export default function BroadcastsPage() {
  return (
    <DashboardLayout
      pageTitle='Broadcasts'
      pageDescription='Send announcements and updates to your network'
      pageIcon='solar:dialog-2-linear'
      breadcrumbs={[
        { label: 'Home', href: '/private/dashboard', icon: 'solar:home-linear' },
        { label: 'Broadcasts', icon: 'solar:dialog-2-linear' }
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
            startContent={<Icon icon='solar:pen-linear' className='h-4 w-4' />}
          >
            New Broadcast
          </Button>
        </div>
      }
    >
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <Icon icon='solar:dialog-2-linear' className='text-primary mb-4 h-24 w-24' />
          <h2 className='mb-2 text-2xl font-bold'>Broadcast Center</h2>
          <p className='text-default-600 mb-4'>
            Create and manage announcements for your network
          </p>
          <Button color='primary' startContent={<Icon icon='solar:dialog-2-linear' />}>
            Create Broadcast
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}