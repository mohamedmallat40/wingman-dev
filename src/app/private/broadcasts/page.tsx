'use client';

import React, { useMemo, useState } from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import DashboardLayout from '@/components/layouts/dashboard-layout';

import BroadcastFeed from './components/lists/BroadcastFeed';
import ContentCreator from './components/modals/ContentCreator';
import TopicSidebar from './components/navigation/TopicSidebar';
import { useFollowTopic, useTopics, useUnfollowTopic } from './hooks';
import { useBroadcastStore } from './store/useBroadcastStore';
import { BroadcastPost } from './types';

export default function BroadcastsPage() {
  const t = useTranslations('broadcasts');
  const tNav = useTranslations('navigation');

  const {
    filters,
    ui,
    setTopic,
    openContentCreator,
    closeContentCreator
  } = useBroadcastStore();
  const followTopic = useFollowTopic();
  const unfollowTopic = useUnfollowTopic();
  const { data: topics } = useTopics();

  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [selectedTopicData, setSelectedTopicData] = useState<any>(null);
  const [sidebarView, setSidebarView] = useState<'topics'>('topics');
  const [editingPost, setEditingPost] = useState<BroadcastPost | null>(null);

  // Get the selected topic object (prefer selectedTopicData from sidebar, fallback to API topics)
  const selectedTopicObject = useMemo(() => {
    if (selectedTopicData) return selectedTopicData;
    if (!activeTopic || !topics) return null;
    return topics.find((topic: any) => topic.id === activeTopic) || null;
  }, [activeTopic, topics, selectedTopicData]);

  const handleTopicToggle = (topicId: string) => {
    // Handle topic toggle logic here
  };

  const handleTopicSelect = (topicId: string | null, topicData?: any) => {
    setActiveTopic(topicId);
    setSelectedTopicData(topicData);
    setTopic(topicId);
  };

  const handleCreatePost = () => {
    openContentCreator();
  };

  const handleSaveDraft = (draftData: Partial<BroadcastPost>) => {
    // Handle draft saving logic here
  };

  const handleEditPost = (post: BroadcastPost) => {
    setEditingPost(post);
    openContentCreator();
  };

  const handleTopicFollow = () => {
    if (selectedTopicObject) {
      followTopic.mutate(selectedTopicObject.id);
    }
  };

  const handleTopicUnfollow = () => {
    if (selectedTopicObject) {
      unfollowTopic.mutate(selectedTopicObject.id);
    }
  };

  const handleClearTopicFilter = () => {
    setActiveTopic(null);
    setSelectedTopicData(null);
    setTopic(null);
  };

  return (
    <>
      <DashboardLayout
        pageTitle={selectedTopicObject ? (selectedTopicObject.title || selectedTopicObject.name) : t('title')}
        pageIcon={selectedTopicObject ? selectedTopicObject.icon : 'solar:satellite-linear'}
        breadcrumbs={[
          { label: tNav('home'), href: '/private/dashboard', icon: 'solar:home-linear' },
          {
            label: tNav('broadcasts'),
            href: '/private/broadcasts',
            icon: 'solar:satellite-linear'
          },
          ...(selectedTopicObject
            ? [{ label: selectedTopicObject.title || selectedTopicObject.name, icon: selectedTopicObject.icon }]
            : [])
        ]}
        pageDescription={selectedTopicObject ? selectedTopicObject.description : t('description')}
        headerActions={
          <div className='flex items-center gap-2'>
            {/* Create Post Button */}
            <Button
              color='primary'
              size='sm'
              startContent={<Icon icon='solar:pen-new-square-linear' className='h-4 w-4' />}
              onPress={handleCreatePost}
              isLoading={false}
            >
              {t('feed.createPost')}
            </Button>
          </div>
        }
      >
        <div className='mx-auto flex w-full gap-6 xl:w-[90%] 2xl:w-[80%]'>
          <div className='hidden w-80 flex-shrink-0 overflow-visible lg:block'>
            <div className='sticky top-4 space-y-4 overflow-visible'>
              <TopicSidebar
                onSubcastToggle={handleTopicToggle}
                onSubcastSelect={handleTopicSelect}
                selectedSubcast={activeTopic}
              />
            </div>
          </div>

          <div className='min-w-0 flex-1'>
            <div className='space-y-6 py-6'>
              <BroadcastFeed selectedTopic={activeTopic} onEditPost={handleEditPost} />
            </div>
          </div>

          <div className='hidden w-64 flex-shrink-0 xl:block'>
            <div className='sticky top-4 space-y-4'>
              {/* Quick Actions */}
              <div className='bg-content1 border-default-200 rounded-lg border p-4'>
                <h3 className='text-foreground mb-3 text-sm font-semibold'>
                  {t('sidebar.quickActions')}
                </h3>
                <div className='space-y-2'>
                  <Button
                    variant='light'
                    size='sm'
                    fullWidth
                    startContent={
                      <Icon icon='solar:pen-new-square-linear' className='h-4 w-4 text-primary-600' />
                    }
                    onPress={handleCreatePost}
                    className='justify-start hover:bg-primary-50 text-primary-700'
                  >
                    {t('feed.createPost')}
                  </Button>
                  <Button
                    variant='light'
                    size='sm'
                    fullWidth
                    startContent={
                      <Icon icon='solar:bookmark-linear' className='h-4 w-4 text-default-500' />
                    }
                    className='justify-start hover:bg-default-100'
                  >
                    {t('sidebar.savedPosts')}
                  </Button>
                  <Button
                    variant='light'
                    size='sm'
                    fullWidth
                    startContent={
                      <Icon icon='solar:users-group-rounded-linear' className='h-4 w-4 text-default-500' />
                    }
                    className='justify-start hover:bg-default-100'
                  >
                    {t('sidebar.following')}
                  </Button>
                </div>
              </div>

              {/* Trending Topics */}
              <div className='bg-content1 border-default-200 rounded-lg border p-4'>
                <h3 className='text-foreground mb-3 flex items-center gap-2 text-sm font-semibold'>
                  <Icon icon='solar:fire-linear' className='text-warning h-4 w-4' />
                  {t('sidebar.trending')}
                </h3>
                <div className='space-y-2'>
                  <div className='text-foreground-500 text-sm text-center py-4'>
                    Coming Soon
                  </div>
                </div>
              </div>

              {/* Active Users */}
              <div className='bg-content1 border-default-200 rounded-lg border p-4'>
                <h3 className='text-foreground mb-3 flex items-center gap-2 text-sm font-semibold'>
                  <div className='bg-success h-2 w-2 animate-pulse rounded-full' />
                  {t('sidebar.activeNow')}
                </h3>
                <div className='text-foreground-500 text-sm text-center py-4'>
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      <ContentCreator
        isOpen={ui.contentCreatorOpen}
        onClose={() => {
          closeContentCreator();
          setEditingPost(null);
        }}
        onSaveDraft={handleSaveDraft}
        initialData={editingPost || undefined}
      />
    </>
  );
}
