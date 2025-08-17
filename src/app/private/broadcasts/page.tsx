'use client';

import React, { useMemo, useState } from 'react';

import type { CreatePostData } from './types';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import DashboardLayout from '@/components/layouts/dashboard-layout';

import { BroadcastFilters } from './components/filters';
import { TopicFeedHeader } from './components/headers/TopicFeedHeader';
import BroadcastFeed from './components/lists/BroadcastFeed';
import ContentCreator from './components/modals/ContentCreator';
import NotificationCenter from './components/modals/NotificationCenter';
import LiveActivityBar from './components/navigation/LiveActivityBar';
import TopicSidebar from './components/navigation/TopicSidebar';
import { useCreatePost, useFollowTopic, useTopics, useUnfollowTopic, useUpdatePost } from './hooks';
import { useBroadcastStore, useUnreadNotificationsCount } from './store/useBroadcastStore';
import { BroadcastPost } from './types';

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
  const updatePost = useUpdatePost();
  const followTopic = useFollowTopic();
  const unfollowTopic = useUnfollowTopic();
  const { data: topics } = useTopics();

  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarView, setSidebarView] = useState<'topics' | 'filters'>('topics');
  const [editingPost, setEditingPost] = useState<BroadcastPost | null>(null);

  // Get the selected topic object
  const selectedTopicObject = useMemo(() => {
    if (!activeTopic || !topics) return null;
    return topics.find((topic: any) => topic.id === activeTopic) || null;
  }, [activeTopic, topics]);

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

  // Note: onPublish is no longer needed as ContentCreator handles the API calls internally
  // const handlePublishPost = async (postData: CreatePostData) => {
  //   try {
  //     if (editingPost) {
  //       // Update existing post
  //       await updatePost.mutateAsync({ postId: editingPost.id, postData });
  //     } else {
  //       // Create new post
  //       await createPost.mutateAsync(postData);
  //     }
  //     closeContentCreator();
  //     setEditingPost(null);
  //   } catch (error) {
  //     // Post publish error is handled by the mutation's onError
  //   }
  // };

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
    setTopic(null);
  };

  return (
    <>
      {/* Live Activity Bar */}
      <LiveActivityBar onNotificationClick={() => openNotificationCenter()} />

      <DashboardLayout
        pageTitle={selectedTopicObject ? selectedTopicObject.title : t('title')}
        pageIcon={selectedTopicObject ? selectedTopicObject.icon : 'solar:satellite-linear'}
        breadcrumbs={[
          { label: tNav('home'), href: '/private/dashboard', icon: 'solar:home-linear' },
          {
            label: tNav('broadcasts'),
            href: '/private/broadcasts',
            icon: 'solar:satellite-linear'
          },
          ...(selectedTopicObject
            ? [{ label: selectedTopicObject.title, icon: selectedTopicObject.icon }]
            : [])
        ]}
        pageDescription={selectedTopicObject ? selectedTopicObject.description : t('description')}
        headerActions={
          <div className='flex items-center gap-2'>
            {/* View Toggle */}
            <Button
              variant='flat'
              size='sm'
              startContent={
                <Icon
                  icon={sidebarView === 'topics' ? 'solar:filter-linear' : 'solar:satellite-linear'}
                  className='h-4 w-4'
                />
              }
              onPress={() => setSidebarView(sidebarView === 'topics' ? 'filters' : 'topics')}
            >
              {sidebarView === 'topics' ? t('page.filters') : t('page.topics')}
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
              <AnimatePresence mode='wait'>
                {sidebarView === 'topics' ? (
                  <motion.div
                    key='topics'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <TopicSidebar
                      onSubcastToggle={handleTopicToggle}
                      onSubcastSelect={handleTopicSelect}
                      selectedSubcast={activeTopic}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key='filters'
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <BroadcastFilters isOpen={true} onClose={() => setSidebarView('topics')} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className='min-w-0 flex-1'>
            <div className='space-y-6 py-6'>
              {/* Topic Feed Header */}
              {selectedTopicObject && (
                <TopicFeedHeader
                  topic={selectedTopicObject}
                  onFollow={handleTopicFollow}
                  onUnfollow={handleTopicUnfollow}
                  onClearFilter={handleClearTopicFilter}
                  isLoading={followTopic.isPending || unfollowTopic.isPending}
                />
              )}

              <BroadcastFeed selectedTopic={activeTopic} onEditPost={handleEditPost} />
            </div>
          </div>

          <div className='hidden w-64 flex-shrink-0 xl:block'>
            <div className='sticky top-4 space-y-4'>
              <div className='bg-content1 border-default-200 rounded-lg border p-4'>
                <h3 className='text-foreground mb-3 text-sm font-semibold'>
                  {t('sidebar.quickActions')}
                </h3>
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
                    {t('sidebar.savedPosts')}
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
                    {t('sidebar.following')}
                  </Button>
                </div>
              </div>

              <div className='bg-content1 border-default-200 rounded-lg border p-4'>
                <h3 className='text-foreground mb-3 flex items-center gap-2 text-sm font-semibold'>
                  <Icon icon='solar:fire-linear' className='text-warning h-4 w-4' />
                  {t('sidebar.trending')}
                </h3>
                <div className='space-y-2'>
                  {[
                    { topic: 'React 19', growth: '+42%' },
                    { topic: 'AI First', growth: '+28%' },
                    { topic: 'Design Systems', growth: '+35%' },
                    { topic: 'Remote Work', growth: '+18%' }
                  ].map((item, index) => (
                    <div key={item.topic} className='flex items-center justify-between'>
                      <span className='text-foreground-600 text-sm'>{item.topic}</span>
                      <span className='text-success text-xs'>{item.growth}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='bg-content1 border-default-200 rounded-lg border p-4'>
                <h3 className='text-foreground mb-3 flex items-center gap-2 text-sm font-semibold'>
                  <div className='bg-success h-2 w-2 animate-pulse rounded-full' />
                  {t('sidebar.activeNow')}
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
                <p className='text-foreground-500 mt-2 text-xs'>
                  {t('sidebar.usersActive', { count: 17 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      <NotificationCenter
        isOpen={ui.notificationCenterOpen}
        onClose={() => closeNotificationCenter()}
      />

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
