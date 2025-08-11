'use client';

import React, { useState } from 'react';

import type { Topic } from './types';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import DashboardLayout from '@/components/layouts/dashboard-layout';

import { BroadcastFeed, BroadcastOnboarding, SubcastSidebar } from './components';
import { useBroadcastPreferences } from './hooks';

export default function BroadcastsPage() {
  const t = useTranslations('broadcasts');
  const tActions = useTranslations('broadcasts.actions');
  const tNav = useTranslations('navigation');
  const { preferences, isLoaded, completeOnboarding, resetPreferences } = useBroadcastPreferences();
  const [selectedSubcast, setSelectedSubcast] = useState<string | null>(null);

  const handleOnboardingComplete = (selectedTopics: Topic[]) => {
    completeOnboarding(selectedTopics);
  };

  const handleReset = () => {
    resetPreferences();
  };

  const handleSubcastToggle = (subcastId: string) => {
    // Handle subcast follow/unfollow logic here
    console.log('Toggle subcast:', subcastId);
  };

  const handleSubcastSelect = (subcastId: string | null) => {
    setSelectedSubcast(subcastId);
  };

  if (!isLoaded) {
    return (
      <DashboardLayout
        pageTitle={t('title')}
        pageIcon='solar:satellite-linear'
        breadcrumbs={[
          { label: tNav('home'), href: '/private/dashboard', icon: 'solar:home-linear' },
          { label: tNav('broadcasts'), icon: 'solar:satellite-linear' }
        ]}
        pageDescription={t('description')}
      >
        <div className='flex h-full items-center justify-center'>
          <div className='text-center'>
            <div className='bg-primary/20 mx-auto mb-6 h-16 w-16 animate-pulse rounded-full'></div>
            <div className='bg-default-200 mx-auto mb-4 h-6 w-48 animate-pulse rounded'></div>
            <div className='bg-default-200 mx-auto h-4 w-64 animate-pulse rounded'></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (preferences.isFirstTime) {
    return <BroadcastOnboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <DashboardLayout
      pageTitle={t('title')}
      pageIcon='solar:satellite-linear'
      breadcrumbs={[
        { label: tNav('home'), href: '/private/dashboard', icon: 'solar:home-linear' },
        { label: tNav('broadcasts'), icon: 'solar:satellite-linear' }
      ]}
      pageDescription={t('description')}
      headerActions={
        <div className='flex items-center gap-2'>
          <Button
            variant='flat'
            size='sm'
            startContent={<Icon icon='solar:settings-linear' className='h-4 w-4' />}
            onPress={handleReset}
          >
            {tActions('resetTopics')}
          </Button>
          <Button
            color='primary'
            size='sm'
            startContent={<Icon icon='solar:refresh-linear' className='h-4 w-4' />}
          >
            {tActions('refreshFeed')}
          </Button>
        </div>
      }
    >
      <div className='mx-auto flex w-full xl:w-[70%]'>
        {/* Left Sidebar - Subcast */}
        <div className='w-96 flex-shrink-0'>
          <div className=''>
            <SubcastSidebar
              onSubcastToggle={handleSubcastToggle}
              onSubcastSelect={handleSubcastSelect}
              selectedSubcast={selectedSubcast}
            />
          </div>
        </div>

        {/* Main Content - Posts */}
        <div className='min-w-0 flex-1'>
          <div className='px-4 py-8'>
            <BroadcastFeed
              selectedTopics={preferences.selectedTopics}
              selectedSubcast={selectedSubcast}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
