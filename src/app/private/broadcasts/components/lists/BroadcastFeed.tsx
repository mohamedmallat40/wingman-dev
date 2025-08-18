'use client';

import React, { useEffect, useMemo } from 'react';

import { Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { useBookmarkPost, useBroadcastFeed, useTrackPostView, useUpvote } from '../../hooks';
import { useBroadcastFilters, useBroadcastStore } from '../../store/useBroadcastStore';
import { BroadcastPost } from '../../types';
import PostCard from '../cards/PostCard';
import BroadcastFeedSkeleton from '../states/BroadcastFeedSkeleton';

interface BroadcastFeedProps {
  selectedTopic?: string | null;
  onEditPost?: (post: BroadcastPost) => void;
  className?: string;
}

const BroadcastFeed: React.FC<BroadcastFeedProps> = ({
  selectedTopic,
  onEditPost,
  className = ''
}) => {
  const t = useTranslations('broadcasts');
  const router = useRouter();
  const filters = useBroadcastFilters();
  const { setSelectedPost } = useBroadcastStore();

  // Hooks for API operations
  const bookmarkPost = useBookmarkPost();
  const trackView = useTrackPostView();
  const { toggleUpvote, isLoading: isUpvoting } = useUpvote();

  // Real-time connection

  // Feed query parameters
  const feedParams = useMemo(() => {
    const topics = [];
    if (selectedTopic) topics.push(selectedTopic);
    if (filters.topicId) topics.push(filters.topicId);

    return {
      topics: topics.length > 0 ? topics : undefined
    };
  }, [selectedTopic, filters.topicId]);

  // Fetch feed with infinite scroll
  const {
    data: feedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useBroadcastFeed(feedParams);

  // Flatten posts from all pages
  const posts = useMemo(() => {
    if (!feedData?.pages) return [];
    return feedData.pages.flatMap((page: any) => page?.data || []);
  }, [feedData]);

  const handlePostBookmark = React.useCallback(
    (postId: string) => {
      bookmarkPost.mutate(postId);
    },
    [bookmarkPost]
  );

  const handlePostView = React.useCallback(
    (postId: string) => {
      trackView.mutate(postId);
    },
    [trackView]
  );

  const handlePostClick = React.useCallback(
    (postId: string) => {
      setSelectedPost(postId);
      handlePostView(postId);
      router.push(`/private/broadcasts/${postId}`);
    },
    [setSelectedPost, handlePostView, router]
  );

  const handlePostUpvote = React.useCallback(
    (postId: string, isCurrentlyUpvoted: boolean) => {
      toggleUpvote(postId, isCurrentlyUpvoted);
    },
    [toggleUpvote]
  );

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
        <div className='bg-primary/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
          <Icon icon='solar:satellite-linear' className='text-primary h-8 w-8' />
        </div>
        <h3 className='text-foreground mb-2 text-xl font-semibold'>{t('feed.emptyFeed.title')}</h3>
        <p className='text-foreground-500 mb-6 max-w-md leading-relaxed'>
          {t('feed.emptyFeed.description')}
        </p>
        <Button
          color='primary'
          startContent={<Icon icon='solar:refresh-linear' className='h-4 w-4' />}
          onPress={() => window.location.reload()}
        >
          {t('feed.refreshFeed')}
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Posts Feed */}
      <div className='space-y-6'>
        <AnimatePresence mode='popLayout'>
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: 'easeOut'
              }}
              layoutId={post.id}
            >
              <PostCard
                post={post}
                onBookmark={() => handlePostBookmark(post.id)}
                onComment={() => handlePostClick(post.id)}
                onShare={() => {
                  /* Share functionality would be implemented here */
                }}
                onUpvote={(postId, isCurrentlyUpvoted) =>
                  handlePostUpvote(postId, isCurrentlyUpvoted)
                }
                onClick={() => handlePostClick(post.id)}
                onEdit={onEditPost}
                isLoading={bookmarkPost.isPending || isUpvoting}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Infinite Scroll Load More */}
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
