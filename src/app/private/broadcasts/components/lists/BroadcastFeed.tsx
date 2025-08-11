'use client';

import React, { useState, useEffect } from 'react';

import { Card, CardBody, Button, Chip, Avatar, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { type BroadcastPost, type Topic } from '../../types';
import { generateEnhancedMockPosts } from '../../data/enhanced-posts';
import PostCard from '../cards/PostCard';
import BroadcastFeedSkeleton from '../states/BroadcastFeedSkeleton';

interface BroadcastFeedProps {
  selectedTopics: Topic[];
  selectedSubcast?: string | null;
  className?: string;
}

const BroadcastFeed: React.FC<BroadcastFeedProps> = ({
  selectedTopics,
  selectedSubcast,
  className = ''
}) => {
  const t = useTranslations('broadcasts');
  const [posts, setPosts] = useState<BroadcastPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState(5);

  useEffect(() => {
    // Simulate API call
    const loadPosts = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredPosts = generateEnhancedMockPosts();
      
      // Filter by selected subcast
      if (selectedSubcast) {
        filteredPosts = filteredPosts.filter(post => 
          post.subcast?.id === selectedSubcast
        );
      }
      
      // Filter by selected topics
      if (selectedTopics.length > 0) {
        const topicNames = selectedTopics.map(t => t.name.toLowerCase());
        filteredPosts = filteredPosts.filter(post =>
          post.tags.some(tag => topicNames.includes(tag.toLowerCase())) ||
          topicNames.includes(post.category.toLowerCase())
        );
      }
      
      setPosts(filteredPosts);
      setIsLoading(false);
    };

    loadPosts();
  }, [selectedTopics, selectedSubcast]);

  const handleLoadMore = () => {
    setVisiblePosts(prev => prev + 5);
  };

  const handlePostLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            engagement: {
              ...post.engagement,
              likes: post.isLiked 
                ? post.engagement.likes - 1 
                : post.engagement.likes + 1
            }
          }
        : post
    ));
  };

  const handlePostBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isBookmarked: !post.isBookmarked,
            engagement: {
              ...post.engagement,
              bookmarks: post.isBookmarked 
                ? post.engagement.bookmarks - 1 
                : post.engagement.bookmarks + 1
            }
          }
        : post
    ));
  };

  if (isLoading) {
    return <BroadcastFeedSkeleton />;
  }

  if (posts.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
        <div className='bg-primary/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
          <Icon icon='solar:satellite-linear' className='text-primary h-8 w-8' />
        </div>
        <h3 className='text-foreground mb-2 text-xl font-semibold'>{t('feed.empty.title')}</h3>
        <p className='text-foreground-500 mb-6 max-w-md leading-relaxed'>
          {t('feed.empty.description')}
        </p>
        <Button 
          color='primary' 
          startContent={<Icon icon='solar:refresh-linear' className='h-4 w-4' />}
          onPress={() => window.location.reload()}
        >
          {t('feed.empty.refresh')}
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Feed Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-foreground text-2xl font-bold'>{t('feed.title')}</h2>
          <p className='text-foreground-500'>
            {t('feed.subtitle', { count: posts.length })}
          </p>
        </div>
        
        {selectedSubcast && (
          <Chip 
            color='primary' 
            variant='flat'
            startContent={<Icon icon='solar:bookmark-linear' className='h-3 w-3' />}
          >
            Filtered by subcast
          </Chip>
        )}
      </div>

      {/* Posts Feed */}
      <div className='space-y-6'>
        <AnimatePresence>
          {posts.slice(0, visiblePosts).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <PostCard
                post={post}
                onLike={() => handlePostLike(post.id)}
                onBookmark={() => handlePostBookmark(post.id)}
                onComment={() => console.log('Comment on:', post.id)}
                onShare={() => console.log('Share:', post.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More */}
      {visiblePosts < posts.length && (
        <div className='flex justify-center py-8'>
          <Button
            color='primary'
            variant='flat'
            size='lg'
            onPress={handleLoadMore}
            startContent={<Icon icon='solar:arrow-down-linear' className='h-4 w-4' />}
            className='min-w-48'
          >
            {t('feed.loadMore')} ({posts.length - visiblePosts} more)
          </Button>
        </div>
      )}
    </div>
  );
};

export default BroadcastFeed;