'use client';

import React from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

import DashboardLayout from '@/components/layouts/dashboard-layout';

export default function SolutionsPage() {
  const handleSubmitSolution = async () => {
    // Simulate solution submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Solution submitted!');
  };

  const handleViewSaved = () => {
    console.log('Viewing saved solutions...');
  };

  const actionItems = [
    {
      key: 'submit',
      label: 'Submit Solution',
      icon: 'solar:code-linear',
      color: 'primary' as const,
      variant: 'solid' as const,
      priority: 'primary' as const,
      tooltip: 'Submit a new code solution',
      onClick: handleSubmitSolution,
    },
    {
      key: 'saved',
      label: 'Saved',
      icon: 'solar:bookmark-linear',
      color: 'default' as const,
      variant: 'flat' as const,
      priority: 'secondary' as const,
      tooltip: 'View your saved solutions',
      onClick: handleViewSaved,
    },
    {
      key: 'filter',
      label: 'Filter',
      icon: 'solar:filter-linear',
      color: 'default' as const,
      variant: 'light' as const,
      priority: 'tertiary' as const,
      tooltip: 'Filter solutions',
      onClick: () => console.log('Opening filters...'),
    },
  ];

  return (
    <DashboardLayout
      pageTitle='Solutions'
      pageDescription='Browse code solutions and get your work reviewed'
      pageIcon='solar:code-square-linear'
      breadcrumbs={[
        { label: 'Home', href: '/private/dashboard', icon: 'solar:home-linear' },
        { label: 'Solutions' }
      ]}
      // Using actionItems for improved UX
      headerActions={
        <div className='flex items-center gap-2'>
          {actionItems.map((action, index) => (
            <Button
              key={action.key}
              color={action.color}
              variant={action.variant}
              size='sm'
              startContent={action.icon ? <Icon icon={action.icon} className='h-4 w-4' /> : undefined}
              onClick={() => action.onClick?.()}
              className="transition-all duration-200 hover:shadow-md"
            >
              {action.label}
            </Button>
          ))}
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
