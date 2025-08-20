'use client';

import React, { useCallback, useMemo, useState } from 'react';

import { Button, Chip } from '@heroui/react';
import { addToast } from '@heroui/toast';
import { Icon } from '@iconify/react';
// Removed framer-motion for better performance
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { useBroadcastFeed, useSavedPosts, useSavePost, useUnsavePost, useUpvote } from '../../hooks';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { BroadcastPost } from '../../types';
import PostCard from '../cards/PostCard';
import BroadcastFeedSkeleton from '../states/BroadcastFeedSkeleton';

interface BroadcastFeedProps {
  selectedTopic?: string | null;
  currentView?: 'all' | 'saved';
  onEditPost?: (post: BroadcastPost) => void;
  onViewChange?: (view: 'all' | 'saved') => void;
  className?: string;
}

const BroadcastFeed: React.FC<BroadcastFeedProps> = ({
  selectedTopic,
  currentView = 'all',
  onEditPost,
  onViewChange,
  className = ''
}) => {
  const t = useTranslations('broadcasts');
  const router = useRouter();
  const { filters, setSelectedPost } = useBroadcastStore();

  // Hooks for API operations
  const { toggleUpvote, isLoading: isUpvoting } = useUpvote();
  const savePost = useSavePost();
  const unsavePost = useUnsavePost();

  // Real-time connection

  // Feed query parameters
  const feedParams = useMemo(() => {
    const topics = [];
    if (selectedTopic) topics.push(selectedTopic);


    return {
      topics: topics.length > 0 ? topics : undefined
    };
  }, [selectedTopic]);

  // Fetch feeds conditionally based on current view
  const regularFeed = useBroadcastFeed(feedParams);
  const savedFeed = useSavedPosts({ 
    limit: 10, 
    enabled: currentView === 'saved'
  });

  // Use the appropriate feed based on current view
  const activeFeed = currentView === 'saved' ? savedFeed : regularFeed;

  const {
    data: feedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = activeFeed;

  // Flatten posts from all pages
  const posts = useMemo(() => {
    if (!feedData?.pages) return [];
    return feedData.pages.flatMap((page: any) => page?.data || []);
  }, [feedData]);

  // Simplified approach - no virtual scrolling for now

  const handlePostClick = useCallback(
    (postId: string) => {
      setSelectedPost(postId);
      router.push(`/private/broadcasts/${postId}`);
    },
    [setSelectedPost, router]
  );

  const handlePostUpvote = useCallback(
    (postId: string, isCurrentlyUpvoted: boolean) => {
      toggleUpvote(postId, isCurrentlyUpvoted);
    },
    [toggleUpvote]
  );

  const handleSave = useCallback(
    (postId: string, isCurrentlySaved: boolean) => {
      if (isCurrentlySaved) {
        unsavePost.mutate(postId, {
          onSuccess: () => {
            addToast({
              title: t('post.actions.unsave'),
              description: 'Post removed from saved',
              color: 'default'
            });
          },
          onError: () => {
            addToast({
              title: 'Error',
              description: 'Failed to unsave post',
              color: 'danger'
            });
          }
        });
      } else {
        savePost.mutate(postId, {
          onSuccess: () => {
            addToast({
              title: t('post.actions.save'),
              description: 'Post saved for later',
              color: 'success'
            });
          },
          onError: () => {
            addToast({
              title: 'Error',
              description: 'Failed to save post',
              color: 'danger'
            });
          }
        });
      }
    },
    [savePost, unsavePost, t]
  );

  const handleShare = useCallback(() => {
    // Share functionality implementation  
  }, []);

  if (isLoading) {
    return <BroadcastFeedSkeleton />;
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
        <div className='bg-danger/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
          <Icon icon='solar:danger-circle-linear' className='text-danger h-8 w-8' />
        </div>
        <h3 className='text-foreground mb-2 text-xl font-semibold'>{t('feed.error.title')}</h3>
        <p className='text-foreground-500 mb-6 max-w-md leading-relaxed'>
          {t('feed.error.description')}
        </p>
        <Button
          color='primary'
          startContent={<Icon icon='solar:refresh-linear' className='h-4 w-4' />}
          onPress={() => window.location.reload()}
        >
          {t('feed.retry')}
        </Button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
        <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
          currentView === 'saved' ? 'bg-default-100' : 'bg-primary/10'
        }`}>
          <Icon 
            icon={currentView === 'saved' ? 'solar:archive-linear' : 'solar:satellite-linear'} 
            className={`h-8 w-8 ${
              currentView === 'saved' ? 'text-default-400' : 'text-primary'
            }`} 
          />
        </div>
        <h3 className='text-foreground mb-2 text-xl font-semibold'>
          {currentView === 'saved' ? 'No saved posts yet' : t('feed.emptyFeed.title')}
        </h3>
        <p className='text-foreground-500 mb-6 max-w-md leading-relaxed'>
          {currentView === 'saved' 
            ? 'Save broadcasts to read them later. Look for the archive button on any post.'
            : t('feed.emptyFeed.description')
          }
        </p>
        <Button
          color='primary'
          startContent={<Icon 
            icon={currentView === 'saved' ? 'solar:satellite-linear' : 'solar:refresh-linear'} 
            className='h-4 w-4' 
          />}
          onPress={() => currentView === 'saved' 
            ? onViewChange?.('all')
            : window.location.reload()
          }
        >
          {currentView === 'saved' ? 'Browse Broadcasts' : t('feed.refreshFeed')}
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Regular Posts Feed */}
      <div className='space-y-6'>
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="animate-in fade-in slide-in-from-bottom-1 duration-300 ease-out"
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <PostCard
              post={post}
              onComment={() => handlePostClick(post.id)}
              onShare={handleShare}
              onUpvote={handlePostUpvote}
              onSave={handleSave}
              onClick={() => handlePostClick(post.id)}
              onEdit={onEditPost}
              isLoading={isUpvoting}
            />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className='flex justify-center py-8'>
          <Button
            color='primary'
            variant='flat'
            size='lg'
            onPress={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            startContent={
              !isFetchingNextPage && <Icon icon='solar:arrow-down-linear' className='h-4 w-4' />
            }
            className='min-w-48'
          >
            {isFetchingNextPage ? t('feed.loading') : t('feed.loadMore')}
          </Button>
        </div>
      )}

      {!hasNextPage && posts.length > 0 && (
        <div className='flex justify-center py-8'>
          <p className='text-foreground-500 text-sm'>{t('feed.noMorePosts')}</p>
        </div>
      )}
    </div>
  );
};

export default BroadcastFeed;
