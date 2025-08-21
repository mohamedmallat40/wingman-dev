'use client';

import React from 'react';

import PageHeader from '@/components/page-header/page-header';

// import FloatingSuccessManager from '@/components/success-manager/floating-success-manager';

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageDescription?: string;
  pageIcon?: string;
  pageBadge?: {
    text: string;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    variant?: 'flat' | 'solid' | 'bordered' | 'light' | 'faded' | 'shadow';
  };
  breadcrumbs?: Array<{
    label: string;
    href?: string;
    icon?: string;
  }>;
  headerActions?: React.ReactNode;
  className?: string;
}

export default function DashboardLayout({
  children,
  pageTitle,
  pageDescription,
  pageIcon,
  pageBadge,
  breadcrumbs,
  headerActions,
  className = ''
}: DashboardLayoutProps) {
  return (
    <div className={`flex h-full w-full flex-col ${className}`}>
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        icon={pageIcon}
        badge={pageBadge}
        breadcrumbs={breadcrumbs}
        actions={headerActions}
      />

      {/* Main Content Area */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Content */}
        <div className='flex-1 overflow-auto'>
          <div className='relative min-h-full'>
            {/* Simplified Background Pattern */}
            <div className='pointer-events-none absolute inset-0 overflow-hidden'>
              <div className='bg-primary/3 absolute -top-4 -left-4 h-32 w-32 rounded-full opacity-50' />
              <div className='bg-secondary/3 absolute top-1/3 -right-4 h-24 w-24 rounded-full opacity-30' />
            </div>

            {/* Content */}
            <div className='relative z-10'>{children}</div>
          </div>
        </div>
      </div>

      {/* Global Floating Success Manager - Hidden for now */}
      {/* <FloatingSuccessManager /> */}
    </div>
  );
}
