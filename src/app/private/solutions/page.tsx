'use client';

import React from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

import DashboardLayout from '@/components/layouts/dashboard-layout';

export default function SolutionsPage() {
  return (
    <DashboardLayout
      pageTitle='Solutions'
      pageDescription='Browse code solutions and get your work reviewed'
      pageIcon='solar:code-square-linear'
      breadcrumbs={[
        { label: 'Home', href: '/private/dashboard', icon: 'solar:home-linear' },
        { label: 'Solutions' }
      ]}
      headerActions={
        <div className='flex items-center gap-2'>
          <Button
            variant='flat'
            size='sm'
            startContent={<Icon icon='solar:bookmark-linear' className='h-4 w-4' />}
          >
            Saved
          </Button>
          <Button
            color='primary'
            size='sm'
            startContent={<Icon icon='solar:code-linear' className='h-4 w-4' />}
          >
            Submit Solution
          </Button>
        </div>
      }
    >
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <Icon icon='solar:code-square-linear' className='text-primary mb-4 h-24 w-24' />
          <h2 className='mb-2 text-2xl font-bold'>Code Solutions</h2>
          <p className='text-default-600 mb-4'>Explore solutions and get code reviews</p>
          <Button color='primary' startContent={<Icon icon='solar:code-linear' />}>
            Browse Solutions
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
