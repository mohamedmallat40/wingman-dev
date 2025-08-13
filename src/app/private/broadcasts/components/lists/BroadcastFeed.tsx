'use client';

import React, { useEffect, useMemo } from 'react';

import { Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { useBookmarkPost, useBroadcastFeed, useLikePost, useTrackPostView } from '../../hooks';
import { useRealtimeBroadcasts } from '../../hooks/useRealtime';
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
  const { isConnected, activeUsers } = useRealtimeBroadcasts();

  // Feed query parameters
  const feedParams = useMemo(
    () => ({
      topicId: selectedTopic || filters.topicId || undefined,
      sortBy: filters.sortBy,
      category: filters.category || undefined
    }),
    [selectedTopic, filters.topicId, filters.sortBy, filters.category]
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
    return feedData.pages.flatMap((page) => page.data || []);
  }, [feedData]);

  const handlePostLike = (postId: string) => {
    likePost.mutate(postId);
  };

  const handlePostBookmark = (postId: string) => {
    bookmarkPost.mutate(postId);
  };

  const handlePostView = (postId: string) => {
    trackView.mutate(postId);
  };

  const handlePostClick = (postId: string) => {
    setSelectedPost(postId);
    handlePostView(postId);
  };

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
    <div className={`space-y-6 ${className}`}>
      {/* Feed Header */}
      <div className='flex items-center justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            <h2 className='text-foreground text-2xl font-bold'>Your Broadcast Feed</h2>
            {isConnected && (
              <div className='flex items-center gap-1'>
                <div className='bg-success h-2 w-2 animate-pulse rounded-full' />
                <span className='text-success text-sm'>Live</span>
              </div>
            )}
          </div>
          <p className='text-foreground-500'>
            Latest updates and content from the community
            {activeUsers > 0 && ` • ${activeUsers} users active`}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          {(selectedTopic || filters.topicId) && (
            <Chip
              color='primary'
              variant='flat'
              startContent={<Icon icon='solar:bookmark-linear' className='h-3 w-3' />}
            >
              Filtered by topic
            </Chip>
          )}
          {filters.category && (
            <Chip
              color='secondary'
              variant='flat'
              startContent={<Icon icon='solar:category-linear' className='h-3 w-3' />}
            >
              {filters.category}
            </Chip>
          )}
        </div>
      </div>

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
                onShare={() => console.log('Share:', post.id)}
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
