'use client';

import React, { useState } from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';

import AssistantSidebar from '@/components/assistant/assistant-sidebar';
import PageHeader from '@/components/page-header/page-header';

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
  showAssistant?: boolean;
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
  showAssistant = true,
  className = ''
}: DashboardLayoutProps) {
  const [isAssistantCollapsed, setIsAssistantCollapsed] = useState(true);
  const [showAssistantMobile, setShowAssistantMobile] = useState(false);

  return (
    <div className={`flex h-full w-full flex-col ${className}`}>
      {/* Page Header */}
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        icon={pageIcon}
        badge={pageBadge}
        breadcrumbs={breadcrumbs}
        actions={
          <div className='flex items-center gap-3'>
            {headerActions}
            {showAssistant && (
              <>
                {/* Mobile Assistant Toggle */}
                <Button
                  isIconOnly
                  variant='flat'
                  color='primary'
                  className='lg:hidden'
                  onPress={() => setShowAssistantMobile(!showAssistantMobile)}
                >
                  <Icon icon='solar:chat-round-linear' className='h-5 w-5' />
                </Button>

                {/* Desktop Assistant Toggle */}
                <Button
                  isIconOnly
                  variant='flat'
                  color='primary'
                  className='hidden lg:flex'
                  onPress={() => setIsAssistantCollapsed(!isAssistantCollapsed)}
                >
                  <Icon
                    icon={
                      isAssistantCollapsed ? 'solar:chat-round-linear' : 'solar:minimize-linear'
                    }
                    className='h-5 w-5'
                  />
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* Main Content Area */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Content */}
        <div className='flex-1 overflow-auto'>
          <div className='relative min-h-full'>
            {/* Background Pattern */}
            <div className='pointer-events-none absolute inset-0 overflow-hidden'>
              <div className='bg-primary/5 absolute -top-4 -left-4 h-32 w-32 rounded-full blur-2xl' />
              <div className='bg-secondary/5 absolute top-1/3 -right-4 h-24 w-24 rounded-full blur-2xl' />
              <div className='bg-primary/3 absolute bottom-1/4 left-1/3 h-28 w-28 rounded-full blur-2xl' />
            </div>

            {/* Content */}
            <div className='relative z-10'>{children}</div>
          </div>
        </div>

        {/* Desktop Assistant Sidebar */}
        {showAssistant && (
          <div className='hidden lg:flex'>
            <motion.div
              initial={false}
              animate={{
                width: isAssistantCollapsed ? 'auto' : 400,
                opacity: 1
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='border-divider/50 bg-background/50 flex-shrink-0 border-l backdrop-blur-sm'
            >
              <div className='h-full p-4'>
                <AssistantSidebar
                  isCollapsed={isAssistantCollapsed}
                  onToggleCollapse={() => setIsAssistantCollapsed(!isAssistantCollapsed)}
                  className='h-full'
                />
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Mobile Assistant Overlay */}
      <AnimatePresence>
        {showAssistant && showAssistantMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='bg-background/80 fixed inset-0 z-40 backdrop-blur-sm lg:hidden'
              onClick={() => setShowAssistantMobile(false)}
            />

            {/* Assistant Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className='bg-background fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm shadow-2xl lg:hidden'
            >
              <div className='flex h-full flex-col'>
                {/* Mobile Header */}
                <div className='border-divider flex items-center justify-between border-b p-4'>
                  <h3 className='text-lg font-semibold'>Assistant</h3>
                  <Button
                    isIconOnly
                    variant='light'
                    size='sm'
                    onPress={() => setShowAssistantMobile(false)}
                  >
                    <Icon icon='solar:close-linear' className='h-5 w-5' />
                  </Button>
                </div>

                {/* Assistant Content */}
                <div className='flex-1 p-4'>
                  <AssistantSidebar className='h-full' isCollapsed={false} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
