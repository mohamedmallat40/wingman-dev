'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Select,
  SelectItem,
  Switch,
  Tabs,
  Tab
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { BroadcastPost, Comment } from '../../types';
import { generateEnhancedMockPosts, generateMockComments } from '../../data/enhanced-posts';
import SmartPostCard from './SmartPostCard';

interface FilterOptions {
  search: string;
  postType: string;
  category: string;
  sortBy: string;
  timeframe: string;
  authorFilter: string;
}

interface ViewOptions {
  layout: 'card' | 'compact' | 'magazine';
  showImages: boolean;
  autoPlay: boolean;
  infiniteScroll: boolean;
}

interface EnhancedBroadcastFeedProps {
  selectedTopics: Array<{ id: string; name: string; category: string }>;
  selectedSubcast?: string | null;
}

// Enhanced mock data loading
const loadEnhancedMockPosts = (
  topics: EnhancedBroadcastFeedProps['selectedTopics'],
  selectedSubcast?: string | null
): BroadcastPost[] => {
  const allPosts = generateEnhancedMockPosts();

  // Filter posts based on selected subcast or topics
  let filteredPosts = allPosts;

  if (selectedSubcast) {
    // If a specific subcast is selected, filter by that subcast
    filteredPosts = allPosts.filter((post) => post.subcast?.id === selectedSubcast);
  } else if (topics && topics.length > 0) {
    // If specific topics are selected, filter by those topics
    filteredPosts = allPosts.filter((post) =>
      topics.some(
        (topic) =>
          post.tags.some(
            (tag) =>
              tag.toLowerCase().includes(topic.name.toLowerCase()) ||
              topic.name.toLowerCase().includes(tag.toLowerCase())
          ) ||
          post.category.toLowerCase() === topic.category.toLowerCase()
      )
    );
  }
  // If no subcast and no topics selected, show all posts

  return filteredPosts;
};

export default function EnhancedBroadcastFeed({
  selectedTopics,
  selectedSubcast
}: EnhancedBroadcastFeedProps) {
  const t = useTranslations('broadcasts.feed');
  const tPost = useTranslations('broadcasts.post');
  const tActions = useTranslations('broadcasts.actions');
  
  const [posts, setPosts] = useState<BroadcastPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    postType: 'all',
    category: 'all',
    sortBy: 'recent',
    timeframe: 'all',
    authorFilter: 'all'
  });
  const [viewOptions, setViewOptions] = useState<ViewOptions>({
    layout: 'card',
    showImages: true,
    autoPlay: false,
    infiniteScroll: true
  });

  // Load posts
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockPosts = loadEnhancedMockPosts(selectedTopics, selectedSubcast);
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedTopics, selectedSubcast]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...posts];

    // Apply filters
    if (filters.search) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          post.content.toLowerCase().includes(filters.search.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    if (filters.postType !== 'all') {
      filtered = filtered.filter((post) => post.type === filters.postType);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter((post) => post.category.toLowerCase() === filters.category.toLowerCase());
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.engagement.likes - a.engagement.likes);
        break;
      case 'trending':
        filtered.sort((a, b) => {
          if (a.isTrending && !b.isTrending) return -1;
          if (!a.isTrending && b.isTrending) return 1;
          return b.engagement.views - a.engagement.views;
        });
        break;
      case 'comments':
        filtered.sort((a, b) => b.engagement.comments - a.engagement.comments);
        break;
      case 'recent':
      default:
        // Keep original order (already sorted by recency)
        break;
    }

    return filtered;
  }, [posts, filters]);

  const handleEngagement = (postId: string, action: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          switch (action) {
            case 'like':
              return {
                ...post,
                isLiked: !post.isLiked,
                engagement: {
                  ...post.engagement,
                  likes: post.isLiked ? post.engagement.likes - 1 : post.engagement.likes + 1
                }
              };
            case 'bookmark':
              return {
                ...post,
                isBookmarked: !post.isBookmarked,
                engagement: {
                  ...post.engagement,
                  bookmarks: post.isBookmarked
                    ? post.engagement.bookmarks - 1
                    : post.engagement.bookmarks + 1
                }
              };
            default:
              return post;
          }
        }
        return post;
      })
    );
  };

  const handleShare = (postId: string, platform: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const shareUrl = post.shareUrl || `${window.location.origin}/broadcasts/post/${postId}`;
    const title = post.title;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        break;
      default:
        console.log('Share:', postId, platform);
    }
  };

  const handleComment = (postId: string, comment: string, parentId?: string) => {
    console.log('Add comment:', { postId, comment, parentId });
  };

  const handleVoteComment = (postId: string, commentId: string, vote: 'up' | 'down', parentId?: string) => {
    console.log('Vote on comment:', { postId, commentId, vote, parentId });
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleViewOptionChange = (key: keyof ViewOptions, value: any) => {
    setViewOptions((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="border-default-200">
            <CardBody className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-default-200 h-12 w-12 animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="bg-default-200 h-4 w-1/4 animate-pulse rounded" />
                  <div className="bg-default-200 h-3 w-1/6 animate-pulse rounded" />
                </div>
              </div>
              <div className="mb-4 space-y-2">
                <div className="bg-default-200 h-6 w-3/4 animate-pulse rounded" />
                <div className="bg-default-200 h-4 animate-pulse rounded" />
                <div className="bg-default-200 h-4 w-5/6 animate-pulse rounded" />
              </div>
              <div className="bg-default-200 mb-4 h-48 animate-pulse rounded-lg" />
              <div className="flex gap-4">
                <div className="bg-default-200 h-8 w-16 animate-pulse rounded" />
                <div className="bg-default-200 h-8 w-16 animate-pulse rounded" />
                <div className="bg-default-200 h-8 w-16 animate-pulse rounded" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Controls */}
      <Card className="border-default-200">
        <CardBody className="p-4">
          {/* Search and Main Controls */}
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <Input
                placeholder="Search posts, topics, or authors..."
                value={filters.search}
                onValueChange={(value) => handleFilterChange('search', value)}
                startContent={<Icon icon="solar:magnifer-linear" className="text-default-400 h-4 w-4" />}
                endContent={
                  filters.search && (
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => handleFilterChange('search', '')}
                    >
                      <Icon icon="solar:close-circle-linear" className="h-4 w-4" />
                    </Button>
                  )
                }
                className="max-w-md"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Select
                placeholder="Sort by"
                selectedKeys={[filters.sortBy]}
                onSelectionChange={(keys) => handleFilterChange('sortBy', Array.from(keys)[0] as string)}
                className="w-32"
                size="sm"
                classNames={{
                  trigger: "text-foreground",
                  value: "text-foreground",
                  popoverContent: "text-foreground bg-background"
                }}
              >
                <SelectItem key="recent" className="text-foreground">Recent</SelectItem>
                <SelectItem key="popular" className="text-foreground">Popular</SelectItem>
                <SelectItem key="trending" className="text-foreground">Trending</SelectItem>
                <SelectItem key="comments" className="text-foreground">Most Discussed</SelectItem>
              </Select>

              <Select
                placeholder="Post type"
                selectedKeys={[filters.postType]}
                onSelectionChange={(keys) => handleFilterChange('postType', Array.from(keys)[0] as string)}
                className="w-32"
                size="sm"
                classNames={{
                  trigger: "text-foreground",
                  value: "text-foreground",
                  popoverContent: "text-foreground bg-background"
                }}
              >
                <SelectItem key="all" className="text-foreground">All Types</SelectItem>
                <SelectItem key="article" className="text-foreground">Articles</SelectItem>
                <SelectItem key="video" className="text-foreground">Videos</SelectItem>
                <SelectItem key="image" className="text-foreground">Images</SelectItem>
                <SelectItem key="gallery" className="text-foreground">Galleries</SelectItem>
                <SelectItem key="poll" className="text-foreground">Polls</SelectItem>
                <SelectItem key="quote" className="text-foreground">Quotes</SelectItem>
                <SelectItem key="link" className="text-foreground">Links</SelectItem>
              </Select>
            </div>
          </div>

          {/* Layout and View Options */}
          <div className="flex flex-wrap items-center gap-4">
            <Tabs
              selectedKey={viewOptions.layout}
              onSelectionChange={(key) => handleViewOptionChange('layout', key)}
              size="sm"
              variant="bordered"
              classNames={{
                tab: "text-foreground",
                tabContent: "text-foreground group-data-[selected=true]:text-white",
                cursor: "bg-primary",
                panel: "text-foreground"
              }}
            >
              <Tab
                key="card"
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:widget-linear" className="h-4 w-4" />
                    Card
                  </div>
                }
              />
              <Tab
                key="compact"
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:list-linear" className="h-4 w-4" />
                    Compact
                  </div>
                }
              />
              <Tab
                key="magazine"
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:book-linear" className="h-4 w-4" />
                    Magazine
                  </div>
                }
              />
            </Tabs>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  size="sm"
                  isSelected={viewOptions.showImages}
                  onValueChange={(checked) => handleViewOptionChange('showImages', checked)}
                />
                <span className="text-sm text-foreground-600">Show media</span>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  size="sm"
                  isSelected={viewOptions.autoPlay}
                  onValueChange={(checked) => handleViewOptionChange('autoPlay', checked)}
                />
                <span className="text-sm text-foreground-600">Auto-play videos</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Posts List */}
      {filteredAndSortedPosts.length === 0 && !loading ? (
        <div className="py-12 text-center">
          <div className="bg-primary/10 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full">
            <Icon icon="solar:inbox-linear" className="text-primary h-12 w-12" />
          </div>
          <h3 className="text-foreground mb-2 text-xl font-semibold">No posts found</h3>
          <p className="text-foreground-600 mx-auto max-w-md">Try adjusting your filters or check back later for new content.</p>
        </div>
      ) : (
        <div className={`space-y-${viewOptions.layout === 'compact' ? '3' : '6'}`}>
          <AnimatePresence>
            {filteredAndSortedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <SmartPostCard
                  post={post}
                  layout={viewOptions.layout}
                  onEngagement={handleEngagement}
                  showImages={viewOptions.showImages}
                  autoPlay={viewOptions.autoPlay}
                  onShare={handleShare}
                  onComment={handleComment}
                  onVoteComment={handleVoteComment}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Load More */}
          {viewOptions.infiniteScroll && (
            <div className="py-8 text-center">
              <Button
                color="primary"
                variant="bordered"
                size="lg"
                startContent={<Icon icon="solar:refresh-linear" className="h-4 w-4" />}
                className="px-8"
              >
                {t('loadMore')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
