'use client';

import React from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

import DashboardLayout from '@/components/layouts/dashboard-layout';

export default function DocumentsPage() {
  return (
    <DashboardLayout
      pageTitle='Documents'
      pageDescription='Manage your documents and files'
      pageIcon='solar:document-text-linear'
      breadcrumbs={[
        { label: 'Home', href: '/private/dashboard', icon: 'solar:home-linear' },
        { label: 'Documents' }
      ]}
      headerActions={
        <div className='flex items-center gap-2'>
          <Button
            variant='flat'
            size='sm'
            startContent={<Icon icon='solar:archive-linear' className='h-4 w-4' />}
          >
            Archived
          </Button>
          <Button
            color='primary'
            size='sm'
            startContent={<Icon icon='solar:document-add-linear' className='h-4 w-4' />}
          >
            New Document
          </Button>
        </div>
      }
    >
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <Icon icon='solar:document-text-linear' className='text-primary mb-4 h-24 w-24' />
          <h2 className='mb-2 text-2xl font-bold'>Document Management</h2>
          <p className='text-default-600 mb-4'>Store and manage your important documents</p>
          <Button color='primary' startContent={<Icon icon='solar:document-add-linear' />}>
            Upload Document
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
