'use client';

import React, { useState } from 'react';

import { Button, Badge } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import DashboardLayout from '@/components/layouts/dashboard-layout';

import { BroadcastOnboarding } from './components';
import { useBroadcastPreferences } from './hooks';
import type { Topic } from './types';

// Enhanced components
import EnhancedBroadcastFeed from './components/enhanced/EnhancedBroadcastFeed';
import EnhancedSubcastSidebar from './components/enhanced/EnhancedSubcastSidebar';
import NotificationCenter from './components/enhanced/NotificationCenter';
import LiveActivityBar from './components/enhanced/LiveActivityBar';
import ContentCreator from './components/enhanced/ContentCreator';

export default function BroadcastsPage() {
  const t = useTranslations('broadcasts');
  const tActions = useTranslations('broadcasts.actions');
  const tNav = useTranslations('navigation');
  
  const { preferences, isLoaded, completeOnboarding, resetPreferences } = useBroadcastPreferences();
  const [selectedSubcast, setSelectedSubcast] = useState<string | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isContentCreatorOpen, setIsContentCreatorOpen] = useState(false);
  const [unreadNotifications] = useState(8);

  const handleOnboardingComplete = (selectedTopics: Topic[]) => {
    completeOnboarding(selectedTopics);
  };

  const handleReset = () => {
    resetPreferences();
  };

  const handleSubcastToggle = (subcastId: string) => {
    console.log('Toggle subcast:', subcastId);
  };

  const handleSubcastSelect = (subcastId: string | null) => {
    setSelectedSubcast(subcastId);
  };

  const handleCreatePost = () => {
    setIsContentCreatorOpen(true);
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
    <>
      {/* Live Activity Bar */}
      <LiveActivityBar onNotificationClick={() => setIsNotificationOpen(true)} />

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
            {/* Create Post Button */}
            <Button
              color='primary'
              size='sm'
              startContent={<Icon icon='solar:pen-new-square-linear' className='h-4 w-4' />}
              onPress={handleCreatePost}
            >
              Create Post
            </Button>

            {/* Settings Dropdown */}
            <Button
              variant='flat'
              size='sm'
              startContent={<Icon icon='solar:settings-linear' className='h-4 w-4' />}
              onPress={handleReset}
            >
              {tActions('resetTopics')}
            </Button>
          </div>
        }
      >
        <div className='mx-auto flex w-full xl:w-[90%] 2xl:w-[80%] gap-6'>
          {/* Left Sidebar - Enhanced Subcast */}
          <div className='w-80 flex-shrink-0 hidden lg:block overflow-visible'>
            <div className='sticky top-4 overflow-visible'>
              <EnhancedSubcastSidebar
                onSubcastToggle={handleSubcastToggle}
                onSubcastSelect={handleSubcastSelect}
                selectedSubcast={selectedSubcast}
              />
            </div>
          </div>

          {/* Main Content - Enhanced Feed */}
          <div className='min-w-0 flex-1'>
            <div className='py-6'>
              <EnhancedBroadcastFeed
                selectedTopics={preferences.selectedTopics}
                selectedSubcast={selectedSubcast}
              />
            </div>
          </div>

          {/* Right Sidebar - Quick Actions & Trending (on larger screens) */}
          <div className='w-64 flex-shrink-0 hidden xl:block'>
            <div className='sticky top-4 space-y-4'>
              {/* Quick Actions Card */}
              <div className="bg-content1 border border-default-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="flat"
                    size="sm"
                    fullWidth
                    startContent={<Icon icon="solar:pen-new-square-linear" className="h-4 w-4 text-blue-600" />}
                    onPress={handleCreatePost}
                    className="justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                  >
                    Create Post
                  </Button>
                  <Button
                    variant="flat"
                    size="sm"
                    fullWidth
                    startContent={<Icon icon="solar:bookmark-linear" className="h-4 w-4 text-emerald-600" />}
                    className="justify-start bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                  >
                    Saved Posts
                  </Button>
                  <Button
                    variant="flat"
                    size="sm"
                    fullWidth
                    startContent={<Icon icon="solar:users-group-rounded-linear" className="h-4 w-4 text-rose-600" />}
                    className="justify-start bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
                  >
                    Following
                  </Button>
                </div>
              </div>

              {/* Trending Topics Mini Card */}
              <div className="bg-content1 border border-default-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Icon icon="solar:fire-linear" className="h-4 w-4 text-warning" />
                  Trending
                </h3>
                <div className="space-y-2">
                  {['React 19', 'AI First', 'Design Systems', 'Remote Work'].map((topic, index) => (
                    <div key={topic} className="flex items-center justify-between">
                      <span className="text-sm text-foreground-600">{topic}</span>
                      <span className="text-xs text-success">+{(Math.random() * 50 + 10).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Users Mini Card */}
              <div className="bg-content1 border border-default-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  Active Now
                </h3>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-primary border-2 border-background"
                      style={{
                        backgroundImage: `url(https://i.pravatar.cc/150?img=${i})`,
                        backgroundSize: 'cover'
                      }}
                    />
                  ))}
                  <div className="w-8 h-8 rounded-full bg-default-200 border-2 border-background flex items-center justify-center">
                    <span className="text-xs font-medium">+12</span>
                  </div>
                </div>
                <p className="text-xs text-foreground-500 mt-2">17 users active in the last hour</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Modals and Overlays */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      <ContentCreator
        isOpen={isContentCreatorOpen}
        onClose={() => setIsContentCreatorOpen(false)}
        onPublish={(post) => {
          console.log('Published post:', post);
          setIsContentCreatorOpen(false);
        }}
        onSaveDraft={(draft) => {
          console.log('Saved draft:', draft);
        }}
      />
    </>
  );
}
