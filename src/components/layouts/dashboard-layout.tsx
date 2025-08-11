'use client';

import React from 'react';

import PageHeader from '@/components/page-header/page-header';
import FloatingSuccessManager from '@/components/success-manager/floating-success-manager';

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
  contentPadding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
}

const getContentPaddingClasses = (padding: string) => {
  switch (padding) {
    case 'none':
      return '';
    case 'sm':
      return 'p-4 sm:p-6';
    case 'md':
      return 'p-6 sm:p-8';
    case 'lg':
      return 'p-8 sm:p-12';
    case 'xl':
      return 'p-12 sm:p-16';
    default:
      return 'p-6 sm:p-8 lg:p-10';
  }
};

const getMaxWidthClasses = (maxWidth: string) => {
  switch (maxWidth) {
    case 'none':
      return 'w-full';
    case 'sm':
      return 'w-full max-w-screen-sm mx-auto';
    case 'md':
      return 'w-full max-w-screen-md mx-auto';
    case 'lg':
      return 'w-full max-w-screen-lg mx-auto';
    case 'xl':
      return 'w-full max-w-screen-xl mx-auto';
    case '2xl':
      return 'w-full max-w-screen-2xl mx-auto';
    case '3xl':
      return 'w-full max-w-[1920px] mx-auto';
    case '4xl':
      return 'w-full max-w-[2560px] mx-auto';
    case '5xl':
      return 'w-full max-w-[3840px] mx-auto';
    case '6xl':
      return 'w-full max-w-[5120px] mx-auto';
    case '7xl':
      return 'w-full max-w-[7680px] mx-auto';
    case 'full':
      return 'w-full';
    default:
      return 'w-full max-w-[85%] mx-auto xl:max-w-[75%] 2xl:max-w-[70%]';
  }
};

export default function DashboardLayout({
  children,
  pageTitle,
  pageDescription,
  pageIcon,
  pageBadge,
  breadcrumbs,
  headerActions,
  className = '',
  contentPadding = 'md',
  maxWidth = 'default'
}: DashboardLayoutProps) {
  return (
    <div className={`flex h-full w-full flex-col overflow-hidden bg-background ${className}`}>
      {/* Enhanced Page Header */}
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        icon={pageIcon}
        badge={pageBadge}
        breadcrumbs={breadcrumbs}
        actions={headerActions}
      />

      {/* Main Content Area with Professional Spacing */}
      <div className='flex flex-1 overflow-hidden'>
        <div className='flex-1 overflow-auto'>
          <div className='relative min-h-full'>
            {/* Subtle Background Pattern */}
            <div className='pointer-events-none absolute inset-0 overflow-hidden'>
              <div className='bg-primary/3 absolute -top-8 -left-8 h-40 w-40 rounded-full blur-3xl' />
              <div className='bg-secondary/3 absolute top-1/3 -right-8 h-32 w-32 rounded-full blur-3xl' />
              <div className='bg-primary/2 absolute bottom-1/4 left-1/3 h-36 w-36 rounded-full blur-3xl' />
              <div className='bg-secondary/2 absolute bottom-10 right-1/4 h-28 w-28 rounded-full blur-3xl' />
            </div>

            {/* Content Container with Enhanced Spacing */}
            <div className='relative z-10'>
              <div className={getMaxWidthClasses(maxWidth)}>
                <div className={getContentPaddingClasses(contentPadding)}>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Floating Success Manager */}
      <FloatingSuccessManager />
    </div>
  );
}
