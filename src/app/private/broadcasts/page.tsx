'use client';

import React, { useState } from 'react';

import type { CreatePostData } from './services/broadcast.service';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import DashboardLayout from '@/components/layouts/dashboard-layout';

import { BroadcastFilters } from './components/filters';
import BroadcastFeed from './components/lists/BroadcastFeed';
import EnhancedContentCreator from './components/modals/EnhancedContentCreator';
import NotificationCenter from './components/modals/NotificationCenter';
import LiveActivityBar from './components/navigation/LiveActivityBar';
import SubcastSidebar from './components/navigation/SubcastSidebar';
import { useCreatePost } from './hooks';
import { useBroadcastStore, useUnreadNotificationsCount } from './store/useBroadcastStore';

export default function BroadcastsPage() {
  const t = useTranslations('broadcasts');
  const tNav = useTranslations('navigation');

  const {
    filters,
    ui,
    setTopic,
    openContentCreator,
    closeContentCreator,
    openNotificationCenter,
    closeNotificationCenter
  } = useBroadcastStore();

  const unreadCount = useUnreadNotificationsCount();
  const createPost = useCreatePost();

  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleTopicToggle = (topicId: string) => {
    // Handle topic toggle logic here
  };

  const handleTopicSelect = (topicId: string | null) => {
    setActiveTopic(topicId);
    setTopic(topicId);
  };

  const handleCreatePost = () => {
    openContentCreator();
  };

  const handlePublishPost = async (postData: CreatePostData) => {
    try {
      await createPost.mutateAsync(postData);
      closeContentCreator();
    } catch (error) {
      // Post publish error is handled by the mutation's onError
    }
  };

  const handleSaveDraft = (draftData: any) => {
    // Handle draft saving logic here
  };

  return (
    <>
      {/* Live Activity Bar */}
      <LiveActivityBar
        onNotificationClick={() => openNotificationCenter()}
        unreadCount={unreadCount}
      />

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
            {/* Filter Toggle */}
            <Button
              variant='flat'
              size='sm'
              startContent={<Icon icon='solar:filter-linear' className='h-4 w-4' />}
              onPress={() => setShowFilters(!showFilters)}
            >
              {t('feed.filterPlaceholder.sort')}
            </Button>

            {/* Create Post Button */}
            <Button
              color='primary'
              size='sm'
              startContent={<Icon icon='solar:pen-new-square-linear' className='h-4 w-4' />}
              onPress={handleCreatePost}
              isLoading={createPost.isPending}
            >
              {t('feed.createPost')}
            </Button>
          </div>
        }
      >
        <div className='mx-auto flex w-full gap-6 xl:w-[90%] 2xl:w-[80%]'>
          <div className='hidden w-80 flex-shrink-0 overflow-visible lg:block'>
            <div className='sticky top-4 space-y-4 overflow-visible'>
              <SubcastSidebar
                onSubcastToggle={handleTopicToggle}
                onSubcastSelect={handleTopicSelect}
                selectedSubcast={activeTopic}
              />

              {/* Filters Panel */}
              {showFilters && (
                <BroadcastFilters isOpen={showFilters} onClose={() => setShowFilters(false)} />
              )}
            </div>
          </div>

          <div className='min-w-0 flex-1'>
            <div className='py-6'>
              <BroadcastFeed selectedTopic={activeTopic} />
            </div>
          </div>

          <div className='hidden w-64 flex-shrink-0 xl:block'>
            <div className='sticky top-4 space-y-4'>
              <div className='bg-content1 border-default-200 rounded-lg border p-4'>
                <h3 className='text-foreground mb-3 text-sm font-semibold'>Quick Actions</h3>
                <div className='space-y-3'>
                  <Button
                    variant='flat'
                    size='sm'
                    fullWidth
                    startContent={
                      <Icon icon='solar:pen-new-square-linear' className='h-4 w-4 text-blue-600' />
                    }
                    onPress={handleCreatePost}
                    className='justify-start border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                  >
                    {t('feed.createPost')}
                  </Button>
                  <Button
                    variant='flat'
                    size='sm'
                    fullWidth
                    startContent={
                      <Icon icon='solar:bookmark-linear' className='h-4 w-4 text-emerald-600' />
                    }
                    className='justify-start border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  >
                    Saved Posts
                  </Button>
                  <Button
                    variant='flat'
                    size='sm'
                    fullWidth
                    startContent={
                      <Icon
                        icon='solar:users-group-rounded-linear'
                        className='h-4 w-4 text-rose-600'
                      />
                    }
                    className='justify-start border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                  >
                    Following
                  </Button>
                </div>
              </div>

              <div className='bg-content1 border-default-200 rounded-lg border p-4'>
                <h3 className='text-foreground mb-3 flex items-center gap-2 text-sm font-semibold'>
                  <Icon icon='solar:fire-linear' className='text-warning h-4 w-4' />
                  Trending
                </h3>
                <div className='space-y-2'>
                  {['React 19', 'AI First', 'Design Systems', 'Remote Work'].map((topic, index) => (
                    <div key={topic} className='flex items-center justify-between'>
                      <span className='text-foreground-600 text-sm'>{topic}</span>
                      <span className='text-success text-xs'>
                        +{(Math.random() * 50 + 10).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='bg-content1 border-default-200 rounded-lg border p-4'>
                <h3 className='text-foreground mb-3 flex items-center gap-2 text-sm font-semibold'>
                  <div className='bg-success h-2 w-2 animate-pulse rounded-full' />
                  Active Now
                </h3>
                <div className='flex -space-x-2'>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className='bg-primary border-background h-8 w-8 rounded-full border-2'
                      style={{
                        backgroundImage: `url(https://i.pravatar.cc/150?img=${i})`,
                        backgroundSize: 'cover'
                      }}
                    />
                  ))}
                  <div className='bg-default-200 border-background flex h-8 w-8 items-center justify-center rounded-full border-2'>
                    <span className='text-xs font-medium'>+12</span>
                  </div>
                </div>
                <p className='text-foreground-500 mt-2 text-xs'>17 users active in the last hour</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      <NotificationCenter
        isOpen={ui.notificationCenterOpen}
        onClose={() => closeNotificationCenter()}
      />

      <EnhancedContentCreator
        isOpen={ui.contentCreatorOpen}
        onClose={() => closeContentCreator()}
        onPublish={handlePublishPost}
        onSaveDraft={handleSaveDraft}
      />
    </>
  );
}
