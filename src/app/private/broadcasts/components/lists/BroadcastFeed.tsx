'use client';

import React, { useCallback, useMemo } from 'react';

import { Button } from '@heroui/react';
import { addToast } from '@heroui/toast';
import { Icon } from '@iconify/react';
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
  const { setSelectedPost } = useBroadcastStore();

  // Hooks for API operations
  const { toggleUpvote, isLoading: isUpvoting } = useUpvote();
  const savePost = useSavePost();
  const unsavePost = useUnsavePost();

  // Real-time connection

  // Feed query parameters - optimize memoization
  const feedParams = useMemo(() => {
    return selectedTopic ? { topics: [selectedTopic] } : {};
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

  // Flatten posts from all pages - optimized memoization
  const posts = useMemo(() => {
    if (!feedData?.pages?.length) return [];
    return feedData.pages.flatMap((page: any) => page?.data || []);
  }, [feedData?.pages]);

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
      const mutation = isCurrentlySaved ? unsavePost : savePost;
      const action = isCurrentlySaved ? 'unsave' : 'save';
      const successMessage = isCurrentlySaved ? 'Post removed from saved' : 'Post saved for later';
      const errorMessage = isCurrentlySaved ? 'Failed to unsave post' : 'Failed to save post';

      mutation.mutate(postId, {
        onSuccess: () => {
          addToast({
            title: t(`post.actions.${action}`),
            description: successMessage,
            color: isCurrentlySaved ? 'default' : 'success'
          });
        },
        onError: () => {
          addToast({
            title: 'Error',
            description: errorMessage,
            color: 'danger'
          });
        }
      });
    },
    [savePost, unsavePost, t]
  );

  const handleShare = useCallback(() => {
    // Share functionality can be implemented here
  }, []);

  if (isLoading) {
    return <BroadcastFeedSkeleton />;
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 text-center ${className}`}>
        <div className='bg-danger/10 mb-8 flex h-24 w-24 items-center justify-center rounded-full shadow-lg'>
          <Icon icon='solar:danger-circle-linear' className='text-danger h-10 w-10' />
        </div>
        <h3 className='text-foreground mb-3 text-2xl font-bold'>{t('feed.error.title')}</h3>
        <p className='text-foreground-500 mb-8 max-w-md text-base leading-relaxed'>
          {t('feed.error.description')}
        </p>
        <Button
          color='primary'
          size='lg'
          startContent={<Icon icon='solar:refresh-linear' className='h-5 w-5' />}
          onPress={() => window.location.reload()}
          className='h-12 px-8 font-semibold shadow-md hover:shadow-lg transition-all duration-300'
        >
          {t('feed.retry')}
        </Button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 text-center ${className}`}>
        <div className={`mb-8 flex h-24 w-24 items-center justify-center rounded-full shadow-lg ${
          currentView === 'saved' ? 'bg-default-100' : 'bg-primary/10'
        }`}>
          <Icon 
            icon={currentView === 'saved' ? 'solar:archive-linear' : 'solar:satellite-linear'} 
            className={`h-10 w-10 ${
              currentView === 'saved' ? 'text-default-400' : 'text-primary'
            }`} 
          />
        </div>
        <h3 className='text-foreground mb-3 text-2xl font-bold'>
          {currentView === 'saved' ? 'No saved posts yet' : t('feed.emptyFeed.title')}
        </h3>
        <p className='text-foreground-500 mb-8 max-w-md text-base leading-relaxed'>
          {currentView === 'saved' 
            ? 'Save broadcasts to read them later. Look for the archive button on any post.'
            : t('feed.emptyFeed.description')
          }
        </p>
        <Button
          color='primary'
          size='lg'
          startContent={<Icon 
            icon={currentView === 'saved' ? 'solar:satellite-linear' : 'solar:refresh-linear'} 
            className='h-5 w-5' 
          />}
          onPress={() => currentView === 'saved' 
            ? onViewChange?.('all')
            : window.location.reload()
          }
          className='h-12 px-8 font-semibold shadow-md hover:shadow-lg transition-all duration-300'
        >
          {currentView === 'saved' ? 'Browse Broadcasts' : t('feed.refreshFeed')}
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Posts Feed */}
      <div className='space-y-8'>
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="opacity-100"
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
        <div className='flex justify-center py-12'>
          <Button
            color='primary'
            variant='flat'
            size='lg'
            onPress={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            startContent={
              !isFetchingNextPage && <Icon icon='solar:arrow-down-linear' className='h-5 w-5' />
            }
            className='min-w-48 h-12 px-8 font-semibold shadow-md hover:shadow-lg transition-all duration-300'
          >
            {isFetchingNextPage ? t('feed.loading') : t('feed.loadMore')}
          </Button>
        </div>
      )}

      {!hasNextPage && posts.length > 0 && (
        <div className='flex justify-center py-12'>
          <div className='text-center'>
            <Icon icon='solar:check-circle-linear' className='h-8 w-8 text-success mx-auto mb-2' />
            <p className='text-foreground-500 text-sm font-medium'>{t('feed.noMorePosts')}</p>
            <p className='text-foreground-400 text-xs mt-1'>You've reached the end</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BroadcastFeed;
