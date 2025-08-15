'use client';

import React, { useEffect, useMemo } from 'react';

import { Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { useBookmarkPost, useBroadcastFeed, useLikePost, useTrackPostView } from '../../hooks';
import { useBroadcastFilters, useBroadcastStore } from '../../store/useBroadcastStore';
import PostCard from '../cards/PostCard';
import BroadcastFeedSkeleton from '../states/BroadcastFeedSkeleton';

interface BroadcastFeedProps {
  selectedTopic?: string | null;
  className?: string;
}

const BroadcastFeed: React.FC<BroadcastFeedProps> = ({ selectedTopic, className = '' }) => {
  const t = useTranslations('broadcasts');
  const filters = useBroadcastFilters();
  const { setSelectedPost } = useBroadcastStore();

  // Hooks for API operations
  const likePost = useLikePost();
  const bookmarkPost = useBookmarkPost();
  const trackView = useTrackPostView();

  // Real-time connection

  // Feed query parameters
  const feedParams = useMemo(
    () => {
      const topics = [];
      if (selectedTopic) topics.push(selectedTopic);
      if (filters.topicId) topics.push(filters.topicId);
      
      return {
        topics: topics.length > 0 ? topics : undefined
      };
    },
    [selectedTopic, filters.topicId]
  );

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

  const handlePostLike = React.useCallback((postId: string) => {
    likePost.mutate(postId);
  }, [likePost]);

  const handlePostBookmark = React.useCallback((postId: string) => {
    bookmarkPost.mutate(postId);
  }, [bookmarkPost]);

  const handlePostView = React.useCallback((postId: string) => {
    trackView.mutate(postId);
  }, [trackView]);

  const handlePostClick = React.useCallback((postId: string) => {
    setSelectedPost(postId);
    handlePostView(postId);
  }, [setSelectedPost, handlePostView]);

  if (isLoading) {
    return <BroadcastFeedSkeleton />;
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
        <div className='bg-danger/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
          <Icon icon='solar:danger-circle-linear' className='text-danger h-8 w-8' />
        </div>
        <h3 className='text-foreground mb-2 text-xl font-semibold'>Unable to load feed</h3>
        <p className='text-foreground-500 mb-6 max-w-md leading-relaxed'>
          Something went wrong while loading your broadcast feed. Please try again.
        </p>
        <Button
          color='primary'
          startContent={<Icon icon='solar:refresh-linear' className='h-4 w-4' />}
          onPress={() => window.location.reload()}
        >
          Retry
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
        <h3 className='text-foreground mb-2 text-xl font-semibold'>Your feed is empty</h3>
        <p className='text-foreground-500 mb-6 max-w-md leading-relaxed'>
          No posts match your current filters. Try adjusting your filters or check back later!
        </p>
        <Button
          color='primary'
          startContent={<Icon icon='solar:refresh-linear' className='h-4 w-4' />}
          onPress={() => window.location.reload()}
        >
          Refresh Feed
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Topic Filter Indicator */}
      {(selectedTopic || filters.topicId) && (
        <div className='mb-6 flex justify-start'>
          <Chip
            color='primary'
            variant='flat'
            startContent={<Icon icon='solar:bookmark-linear' className='h-3 w-3' />}
          >
            Filtered by topic
          </Chip>
        </div>
      )}

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
                onLike={() => handlePostLike(post.id)}
                onBookmark={() => handlePostBookmark(post.id)}
                onComment={() => handlePostClick(post.id)}
                onShare={() => {/* Share functionality would be implemented here */}}
                onClick={() => handlePostClick(post.id)}
                isLoading={likePost.isPending || bookmarkPost.isPending}
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
            {isFetchingNextPage ? 'Loading...' : 'Load More Posts'}
          </Button>
        </div>
      )}

      {!hasNextPage && posts.length > 0 && (
        <div className='flex justify-center py-8'>
          <p className='text-foreground-500 text-sm'>
            🎉 You've reached the end! Check back later for more content.
          </p>
        </div>
      )}
    </div>
  );
};

export default BroadcastFeed;
