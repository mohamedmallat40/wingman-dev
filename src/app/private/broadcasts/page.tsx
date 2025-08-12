'use client';

import React, { useState } from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import DashboardLayout from '@/components/layouts/dashboard-layout';

import BroadcastFeed from './components/lists/BroadcastFeed';
import ContentCreator from './components/modals/ContentCreator';
import NotificationCenter from './components/modals/NotificationCenter';
import LiveActivityBar from './components/navigation/LiveActivityBar';
import SubcastSidebar from './components/navigation/SubcastSidebar';

export default function BroadcastsPage() {
  const t = useTranslations('broadcasts');
  const tNav = useTranslations('navigation');

  const [activeSubcast, setActiveSubcast] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showContentCreator, setShowContentCreator] = useState(false);

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
          </div>
        }
      >
        <div className='mx-auto flex w-full gap-6 xl:w-[90%] 2xl:w-[80%]'>
          {/* Left Sidebar - Subcast */}
          <div className='hidden w-80 flex-shrink-0 overflow-visible lg:block'>
            <div className='sticky top-4 overflow-visible'>
              <SubcastSidebar
                onSubcastToggle={handleSubcastToggle}
                onSubcastSelect={handleSubcastSelect}
                selectedSubcast={activeSubcast}
              />
            </div>
          </div>

          {/* Main Content - Feed */}
          <div className='min-w-0 flex-1'>
            <div className='py-6'>
              <BroadcastFeed
                selectedSubcast={activeSubcast}
              />
            </div>
          </div>

          {/* Right Sidebar - Quick Actions & Trending (on larger screens) */}
          <div className='hidden w-64 flex-shrink-0 xl:block'>
            <div className='sticky top-4 space-y-4'>
              {/* Quick Actions Card */}
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
                    Create Post
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

              {/* Trending Topics Mini Card */}
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

              {/* Active Users Mini Card */}
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
