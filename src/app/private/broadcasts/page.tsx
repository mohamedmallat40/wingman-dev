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
  const [currentView, setCurrentView] = useState<'all' | 'saved'>('all');

  // Get the selected topic object (prefer selectedTopicData from sidebar, fallback to API topics)
  const selectedTopicObject = useMemo(() => {
    if (selectedTopicData) return selectedTopicData;
    if (!activeTopic || !topics) return null;
    return topics.find((topic: any) => topic.id === activeTopic) || null;
  }, [activeTopic, topics, selectedTopicData]);

  const handleTopicToggle = (topicId: string) => {
    // Topic toggle functionality can be implemented here
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
    // Draft saving functionality can be implemented here
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

  const handleViewChange = (view: 'all' | 'saved') => {
    setCurrentView(view);
    // Clear topic filter when switching to saved view
    if (view === 'saved') {
      handleClearTopicFilter();
    }
  };

  // Dynamic page title and description based on current view
  const pageTitle = useMemo(() => {
    if (currentView === 'saved') return 'Saved Posts';
    if (selectedTopicObject) return selectedTopicObject.title || selectedTopicObject.name;
    return t('title');
  }, [currentView, selectedTopicObject, t]);

  const pageDescription = useMemo(() => {
    if (currentView === 'saved') return 'Your saved broadcasts for later reading';
    if (selectedTopicObject) return selectedTopicObject.description;
    return t('description');
  }, [currentView, selectedTopicObject, t]);

  const pageIcon = useMemo(() => {
    if (currentView === 'saved') return 'solar:archive-bold';
    if (selectedTopicObject) return selectedTopicObject.icon;
    return 'solar:satellite-linear';
  }, [currentView, selectedTopicObject]);

  return (
    <>
      <DashboardLayout
        pageTitle={pageTitle}
        pageIcon={pageIcon}
        breadcrumbs={[
          { label: tNav('home'), href: '/private/dashboard', icon: 'solar:home-linear' },
          {
            label: tNav('broadcasts'),
            href: '/private/broadcasts',
            icon: 'solar:satellite-linear'
          },
          ...(currentView === 'saved'
            ? [{ label: 'Saved Posts', icon: 'solar:archive-bold' }]
            : selectedTopicObject
            ? [{ label: selectedTopicObject.title || selectedTopicObject.name, icon: selectedTopicObject.icon }]
            : [])
        ]}
        pageDescription={pageDescription}
        headerActions={
          <div className='flex items-center gap-3'>
            {/* View Toggle Buttons */}
            <div className='flex items-center gap-0.5 rounded-xl bg-default-100 p-1 shadow-sm'>
              <Button
                size='sm'
                variant={currentView === 'all' ? 'solid' : 'light'}
                color={currentView === 'all' ? 'primary' : 'default'}
                onPress={() => handleViewChange('all')}
                startContent={<Icon icon='solar:satellite-linear' className='h-4 w-4' />}
                className={`h-9 min-w-0 px-4 font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                  currentView === 'all'
                    ? 'shadow-sm'
                    : 'hover:bg-default-200/50'
                }`}
              >
                All Posts
              </Button>
              <Button
                size='sm'
                variant={currentView === 'saved' ? 'solid' : 'light'}
                color={currentView === 'saved' ? 'primary' : 'default'}
                onPress={() => handleViewChange('saved')}
                startContent={<Icon icon='solar:archive-linear' className='h-4 w-4' />}
                className={`h-9 min-w-0 px-4 font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                  currentView === 'saved'
                    ? 'shadow-sm'
                    : 'hover:bg-default-200/50'
                }`}
              >
                Saved
              </Button>
            </div>

            {/* Create Post Button - only show in all posts view */}
            {currentView === 'all' && (
              <Button
                color='primary'
                size='sm'
                startContent={<Icon icon='solar:pen-new-square-linear' className='h-4 w-4' />}
                onPress={handleCreatePost}
                isLoading={false}
                className='h-9 px-4 font-medium shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200'
              >
                {t('feed.createPost')}
              </Button>
            )}
          </div>
        }
      >
        <div className='mx-auto flex w-full gap-6 px-4 sm:px-6 lg:gap-8 lg:px-8 xl:max-w-[85%] 2xl:max-w-[75%]'>
          {/* Left Sidebar */}
          <div className='hidden w-80 flex-shrink-0 lg:block'>
            <div className='sticky top-6 space-y-6'>
              <TopicSidebar
                onSubcastToggle={handleTopicToggle}
                onSubcastSelect={handleTopicSelect}
                selectedSubcast={activeTopic}
              />
            </div>
          </div>

          {/* Main Feed */}
          <div className='min-w-0 flex-1'>
            <div className='space-y-8 py-4 sm:py-6'>
              <BroadcastFeed 
                selectedTopic={currentView === 'all' ? activeTopic : null}
                currentView={currentView}
                onEditPost={handleEditPost}
                onViewChange={handleViewChange}
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='hidden w-80 flex-shrink-0 xl:block'>
            <div className='sticky top-6 space-y-4'>
              {/* Quick Actions */}
              <div className='bg-content1 border-default-200 rounded-xl border p-5 shadow-sm'>
                <h3 className='text-foreground mb-4 flex items-center gap-2 text-sm font-semibold'>
                  <Icon icon='solar:widget-4-linear' className='h-4 w-4 text-primary' />
                  {t('sidebar.quickActions')}
                </h3>
                <div className='space-y-3'>
                  <Button
                    variant='flat'
                    size='sm'
                    fullWidth
                    startContent={
                      <Icon icon='solar:pen-new-square-linear' className='h-4 w-4' />
                    }
                    onPress={handleCreatePost}
                    className='justify-start h-10 bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200'
                  >
                    {t('feed.createPost')}
                  </Button>
                  <Button
                    variant='light'
                    size='sm'
                    fullWidth
                    startContent={
                      <Icon icon='solar:archive-linear' className='h-4 w-4' />
                    }
                    onPress={() => handleViewChange('saved')}
                    className='justify-start h-10 hover:bg-default-100 transition-all duration-200'
                  >
                    {t('sidebar.savedPosts')}
                  </Button>
                  <Button
                    variant='light'
                    size='sm'
                    fullWidth
                    startContent={
                      <Icon icon='solar:users-group-rounded-linear' className='h-4 w-4' />
                    }
                    className='justify-start h-10 hover:bg-default-100 transition-all duration-200'
                  >
                    {t('sidebar.following')}
                  </Button>
                </div>
              </div>

              {/* Trending Topics */}
              <div className='bg-content1 border-default-200 rounded-xl border p-5 shadow-sm'>
                <h3 className='text-foreground mb-4 flex items-center gap-2 text-sm font-semibold'>
                  <Icon icon='solar:fire-linear' className='text-warning h-4 w-4' />
                  {t('sidebar.trending')}
                </h3>
                <div className='flex items-center justify-center py-8'>
                  <div className='text-center'>
                    <Icon icon='solar:hourglass-line-linear' className='h-8 w-8 text-default-400 mx-auto mb-2' />
                    <p className='text-foreground-500 text-sm font-medium'>Coming Soon</p>
                    <p className='text-foreground-400 text-xs mt-1'>Trending topics will appear here</p>
                  </div>
                </div>
              </div>

              {/* Active Users */}
              <div className='bg-content1 border-default-200 rounded-xl border p-5 shadow-sm'>
                <h3 className='text-foreground mb-4 flex items-center gap-2 text-sm font-semibold'>
                  <div className='bg-success h-2 w-2 animate-pulse rounded-full' />
                  {t('sidebar.activeNow')}
                </h3>
                <div className='flex items-center justify-center py-8'>
                  <div className='text-center'>
                    <Icon icon='solar:users-group-rounded-linear' className='h-8 w-8 text-default-400 mx-auto mb-2' />
                    <p className='text-foreground-500 text-sm font-medium'>Coming Soon</p>
                    <p className='text-foreground-400 text-xs mt-1'>Active users will appear here</p>
                  </div>
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
