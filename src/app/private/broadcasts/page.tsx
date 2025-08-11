'use client';

import React, { useState } from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import DashboardLayout from '@/components/layouts/dashboard-layout';

import { BroadcastOnboarding } from './components';
import BroadcastFeed from './components/lists/BroadcastFeed';
import ContentCreator from './components/modals/ContentCreator';
import NotificationCenter from './components/modals/NotificationCenter';
import LiveActivityBar from './components/navigation/LiveActivityBar';
import SubcastSidebar from './components/navigation/SubcastSidebar';
import { useBroadcastPreferences } from './hooks';
import { type Topic } from './types';

export default function BroadcastsPage() {
  const t = useTranslations('broadcasts');
  const tActions = useTranslations('broadcasts.actions');
  const tNav = useTranslations('navigation');

  const {
    preferences: broadcastPreferences,
    isLoaded: preferencesLoaded,
    completeOnboarding,
    resetPreferences
  } = useBroadcastPreferences();

  const [activeSubcast, setActiveSubcast] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showContentCreator, setShowContentCreator] = useState(false);
  const [unreadCount] = useState(8);

  const handleOnboardingComplete = (selectedTopics: Topic[]) => {
    completeOnboarding(selectedTopics);
  };

  const handlePreferencesReset = () => {
    resetPreferences();
  };

  const handleSubcastToggle = (subcastId: string) => {
    console.log('Toggle subcast:', subcastId);
  };

  const handleSubcastSelect = (subcastId: string | null) => {
    setActiveSubcast(subcastId);
  };

  const handleCreatePost = () => {
    setShowContentCreator(true);
  };

  const handlePublishPost = (postData: any) => {
    console.log('Published post:', postData);
    setShowContentCreator(false);
    // TODO: Add to feed
  };

  const handleSaveDraft = (draftData: any) => {
    console.log('Saved draft:', draftData);
    // TODO: Save to drafts
  };

  if (!preferencesLoaded) {
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

  if (broadcastPreferences.isFirstTime) {
    return <BroadcastOnboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      {/* Live Activity Bar */}
      <LiveActivityBar onNotificationClick={() => setShowNotifications(true)} />

      <DashboardLayout
        pageTitle={t('title')}
        pageIcon='solar:satellite-linear'
        breadcrumbs={[
          { label: tNav('home'), href: '/private/dashboard', icon: 'solar:home-linear' },
          { label: tNav('broadcasts'), icon: 'solar:satellite-linear' }
        ]}
        pageDescription={t('description')}
        contentPadding='none'
        maxWidth='full'
        headerActions={
          <div className='flex items-center gap-3'>
            {/* Create Post Button */}
            <Button
              color='primary'
              size='md'
              startContent={<Icon icon='solar:pen-new-square-linear' className='h-4 w-4' />}
              onPress={handleCreatePost}
              className='shadow-sm transition-all duration-200 hover:shadow-md'
            >
              Create Post
            </Button>

            {/* Settings Button */}
            <Button
              variant='flat'
              size='md'
              startContent={<Icon icon='solar:settings-linear' className='h-4 w-4' />}
              onPress={handlePreferencesReset}
              className='transition-all duration-200 hover:shadow-sm'
            >
              {tActions('resetTopics')}
            </Button>
          </div>
        }
      >
        <div className='flex h-full'>
          {/* Left Sidebar */}
          <div className='border-divider/30 hidden w-80 flex-shrink-0 border-r lg:block'>
            <div className='h-full overflow-y-auto'>
              <div className='sticky top-0 p-6'>
                <SubcastSidebar
                  onSubcastToggle={handleSubcastToggle}
                  onSubcastSelect={handleSubcastSelect}
                  selectedSubcast={activeSubcast}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex min-w-0 flex-1 flex-col'>
            <div className='flex-1 overflow-y-auto'>
              <div className='mx-auto max-w-4xl px-6 py-8 lg:px-8'>
                <BroadcastFeed
                  selectedTopics={broadcastPreferences.selectedTopics}
                  selectedSubcast={activeSubcast}
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='border-divider/30 hidden w-72 flex-shrink-0 border-l xl:block'>
            <div className='h-full overflow-y-auto'>
              <div className='space-y-6 p-6'>
                {/* Quick Actions Card */}
                <div className='bg-content1 border-default-200 rounded-xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md'>
                  <h3 className='text-foreground mb-4 flex items-center gap-2 text-base font-semibold'>
                    <Icon icon='solar:flash-linear' className='text-primary h-5 w-5' />
                    Quick Actions
                  </h3>
                  <div className='space-y-3'>
                    <Button
                      variant='flat'
                      size='md'
                      fullWidth
                      startContent={
                        <Icon icon='solar:pen-new-square-linear' className='text-primary h-4 w-4' />
                      }
                      onPress={handleCreatePost}
                      className='bg-primary/10 hover:bg-primary/20 text-primary h-auto justify-start py-3 transition-colors'
                    >
                      Create Post
                    </Button>
                    <Button
                      variant='flat'
                      size='md'
                      fullWidth
                      startContent={
                        <Icon icon='solar:bookmark-linear' className='text-success h-4 w-4' />
                      }
                      className='bg-success/10 hover:bg-success/20 text-success h-auto justify-start py-3 transition-colors'
                    >
                      Saved Posts
                    </Button>
                    <Button
                      variant='flat'
                      size='md'
                      fullWidth
                      startContent={
                        <Icon
                          icon='solar:users-group-rounded-linear'
                          className='text-secondary h-4 w-4'
                        />
                      }
                      className='bg-secondary/10 hover:bg-secondary/20 text-secondary h-auto justify-start py-3 transition-colors'
                    >
                      Following
                    </Button>
                  </div>
                </div>

                {/* Trending Topics Card */}
                <div className='bg-content1 border-default-200 rounded-xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md'>
                  <h3 className='text-foreground mb-4 flex items-center gap-2 text-base font-semibold'>
                    <Icon icon='solar:fire-linear' className='text-warning h-5 w-5' />
                    Trending
                  </h3>
                  <div className='space-y-3'>
                    {['React 19', 'AI First', 'Design Systems', 'Remote Work'].map(
                      (topic, index) => (
                        <div
                          key={topic}
                          className='hover:bg-default-50 flex items-center justify-between rounded-lg p-2 transition-colors'
                        >
                          <span className='text-foreground-700 text-sm font-medium'>{topic}</span>
                          <span className='text-success bg-success/10 rounded-full px-2 py-1 text-xs font-semibold'>
                            +{(Math.random() * 50 + 10).toFixed(0)}%
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Active Users Card */}
                <div className='bg-content1 border-default-200 rounded-xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md'>
                  <h3 className='text-foreground mb-4 flex items-center gap-2 text-base font-semibold'>
                    <div className='bg-success h-2.5 w-2.5 animate-pulse rounded-full' />
                    Active Now
                  </h3>
                  <div className='mb-4 flex -space-x-2'>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className='bg-primary border-background h-9 w-9 rounded-full border-2 shadow-sm'
                        style={{
                          backgroundImage: `url(https://i.pravatar.cc/150?img=${i})`,
                          backgroundSize: 'cover'
                        }}
                      />
                    ))}
                    <div className='bg-default-200 border-background flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-sm'>
                      <span className='text-xs font-semibold'>+12</span>
                    </div>
                  </div>
                  <p className='text-foreground-500 text-sm'>17 users active in the last hour</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Modals */}
      <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

      <ContentCreator
        isOpen={showContentCreator}
        onClose={() => setShowContentCreator(false)}
        onPublish={handlePublishPost}
        onSaveDraft={handleSaveDraft}
      />
    </>
  );
}
