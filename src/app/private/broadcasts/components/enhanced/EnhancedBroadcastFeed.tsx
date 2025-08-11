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

interface BroadcastPost {
  id: string;
  type: 'article' | 'video' | 'image' | 'poll' | 'quote';
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    handle: string;
  };
  timestamp: string;
  tags: string[];
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    bookmarks: number;
    views: number;
  };
  media?: {
    type: 'video' | 'image';
    url: string;
    thumbnail?: string;
    duration?: string;
  };
  isLiked?: boolean;
  isBookmarked?: boolean;
  category: string;
  subcast?: {
    id: string;
    name: string;
    icon: string;
  };
  priority?: 'low' | 'normal' | 'high';
  readTime?: number;
  isTrending?: boolean;
}

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

// Enhanced mock data with more features
const generateEnhancedMockPosts = (
  topics: EnhancedBroadcastFeedProps['selectedTopics'],
  selectedSubcast?: string | null
): BroadcastPost[] => {
  const authors = [
    {
      name: 'Sarah Chen',
      handle: '@sarahchen',
      avatar: 'https://i.pravatar.cc/150?img=1',
      verified: true
    },
    {
      name: 'Marcus Rodriguez',
      handle: '@marcusr',
      avatar: 'https://i.pravatar.cc/150?img=2',
      verified: false
    },
    {
      name: 'Dr. Emily Watson',
      handle: '@emilytech',
      avatar: 'https://i.pravatar.cc/150?img=3',
      verified: true
    },
    {
      name: 'Alex Turner',
      handle: '@alexdesigns',
      avatar: 'https://i.pravatar.cc/150?img=4',
      verified: false
    },
    {
      name: 'Lisa Park',
      handle: '@lisamarketing',
      avatar: 'https://i.pravatar.cc/150?img=5',
      verified: true
    },
    {
      name: 'David Kim',
      handle: '@daviddev',
      avatar: 'https://i.pravatar.cc/150?img=6',
      verified: true
    }
  ];

  const posts: BroadcastPost[] = [
    {
      id: '1',
      type: 'video',
      title: 'The Future of AI in Web Development: What Every Developer Needs to Know',
      content:
        'Exploring how artificial intelligence is revolutionizing the way we build websites and applications. From automated code generation to intelligent design systems, AI is transforming the developer experience and creating new possibilities for web development.',
      author: authors[0],
      timestamp: '2 hours ago',
      tags: ['AI', 'Web Development', 'Technology', 'Automation'],
      category: 'AI',
      priority: 'high',
      readTime: 8,
      isTrending: true,
      subcast: {
        id: 'ai-innovation',
        name: 'AI Innovation',
        icon: 'solar:cpu-linear'
      },
      media: {
        type: 'video',
        url: '/videos/ai-webdev.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        duration: '12:34'
      },
      engagement: { likes: 342, comments: 28, shares: 15, bookmarks: 67, views: 2847 }
    },
    {
      id: '2',
      type: 'article',
      title: 'Building Resilient Design Systems at Scale',
      content:
        "Learn how to create design systems that can adapt and scale with your growing product. We'll cover component architecture, token management, and team collaboration strategies that have proven successful across multiple organizations.",
      author: authors[3],
      timestamp: '4 hours ago',
      tags: ['Design Systems', 'UI/UX', 'Scalability', 'Components'],
      category: 'Design',
      priority: 'normal',
      readTime: 12,
      isTrending: false,
      subcast: {
        id: 'design-trends',
        name: 'Design Trends',
        icon: 'solar:palette-linear'
      },
      engagement: { likes: 189, comments: 34, shares: 22, bookmarks: 91, views: 1543 }
    },
    {
      id: '3',
      type: 'article',
      title: 'React 19: Game-Changing Features for Modern Development',
      content:
        'Discover the revolutionary features in React 19 that are reshaping how we build user interfaces. From server components to automatic batching, explore what makes this release a game-changer for developers worldwide.',
      author: authors[5],
      timestamp: '6 hours ago',
      tags: ['React', 'JavaScript', 'Frontend', 'Development'],
      category: 'Development',
      priority: 'high',
      readTime: 10,
      isTrending: true,
      subcast: {
        id: 'dev-life',
        name: 'Developer Life',
        icon: 'solar:code-square-linear'
      },
      engagement: { likes: 456, comments: 67, shares: 89, bookmarks: 123, views: 3421 }
    },
    {
      id: '4',
      type: 'image',
      title: 'Mobile App UI Trends for 2024: A Visual Guide',
      content:
        "A comprehensive look at the emerging mobile design trends that are shaping user experiences. From glassmorphism to micro-interactions, here's what to expect in mobile design this year.",
      author: authors[3],
      timestamp: '8 hours ago',
      tags: ['Mobile Design', 'UI Trends', '2024', 'UX'],
      category: 'Design',
      priority: 'normal',
      readTime: 5,
      isTrending: true,
      subcast: {
        id: 'mobile-first',
        name: 'Mobile First',
        icon: 'solar:smartphone-linear'
      },
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800'
      },
      engagement: { likes: 267, comments: 18, shares: 31, bookmarks: 45, views: 1876 }
    },
    {
      id: '5',
      type: 'article',
      title: 'Content Marketing Strategy That Actually Drives Results',
      content:
        'Stop creating content that nobody reads. This comprehensive guide shows you how to build a content marketing strategy that drives real business results. Based on case studies from 50+ successful campaigns.',
      author: authors[4],
      timestamp: '10 hours ago',
      tags: ['Content Marketing', 'Strategy', 'Growth', 'ROI'],
      category: 'Marketing',
      priority: 'normal',
      readTime: 15,
      isTrending: false,
      subcast: {
        id: 'marketing-mastery',
        name: 'Marketing Mastery',
        icon: 'solar:megaphone-linear'
      },
      engagement: { likes: 421, comments: 56, shares: 78, bookmarks: 123, views: 2976 }
    },
    {
      id: '6',
      type: 'quote',
      title: 'Startup Wisdom: The Power of Starting Now',
      content:
        '"The best time to plant a tree was 20 years ago. The second best time is now. The same applies to starting your business." - Ancient Chinese Proverb adapted for entrepreneurs',
      author: authors[1],
      timestamp: '12 hours ago',
      tags: ['Entrepreneurship', 'Motivation', 'Business', 'Startup'],
      category: 'Business',
      priority: 'low',
      readTime: 2,
      isTrending: false,
      subcast: {
        id: 'startup-stories',
        name: 'Startup Stories',
        icon: 'solar:rocket-linear'
      },
      engagement: { likes: 156, comments: 12, shares: 89, bookmarks: 34, views: 987 }
    },
    {
      id: '7',
      type: 'video',
      title: 'DevOps Best Practices: From Zero to Production',
      content:
        'A comprehensive guide to modern DevOps practices including CI/CD pipelines, containerization, and cloud-native architectures. Perfect for teams looking to optimize their deployment workflows and improve reliability.',
      author: authors[2],
      timestamp: '1 day ago',
      tags: ['DevOps', 'Cloud', 'Best Practices', 'CI/CD'],
      category: 'DevOps',
      priority: 'normal',
      readTime: 18,
      isTrending: false,
      subcast: {
        id: 'dev-life',
        name: 'Developer Life',
        icon: 'solar:code-square-linear'
      },
      media: {
        type: 'video',
        url: '/videos/devops-2024.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800',
        duration: '18:45'
      },
      engagement: { likes: 298, comments: 41, shares: 19, bookmarks: 87, views: 2134 }
    },
    {
      id: '8',
      type: 'poll',
      title: 'What\'s Your Favorite Frontend Framework in 2024?',
      content:
        'The frontend landscape is constantly evolving. We want to know which framework you\'re most excited about this year. Vote and share your thoughts in the comments!',
      author: authors[5],
      timestamp: '1 day ago',
      tags: ['Frontend', 'Frameworks', 'Poll', 'Community'],
      category: 'Development',
      priority: 'normal',
      readTime: 3,
      isTrending: true,
      subcast: {
        id: 'dev-community',
        name: 'Dev Community',
        icon: 'solar:users-group-rounded-linear'
      },
      engagement: { likes: 89, comments: 156, shares: 23, bookmarks: 12, views: 1456 }
    }
  ];

  // Filter posts based on selected subcast or topics
  let filteredPosts = posts;

  if (selectedSubcast) {
    filteredPosts = posts.filter((post) => post.subcast?.id === selectedSubcast);
  } else {
    filteredPosts = posts.filter((post) =>
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

  return filteredPosts;
};

// Enhanced Post Card Component
const EnhancedPostCard: React.FC<{
  post: BroadcastPost;
  layout: 'card' | 'compact' | 'magazine';
  onEngagement: (postId: string, action: string) => void;
  showImages: boolean;
  autoPlay: boolean;
  tActions: any;
  tPost: any;
}> = ({ post, layout, onEngagement, showImages, autoPlay, tActions, tPost }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getPostIcon = () => {
    switch (post.type) {
      case 'video':
        return 'solar:videocamera-record-linear';
      case 'image':
        return 'solar:gallery-linear';
      case 'article':
        return 'solar:document-text-linear';
      case 'poll':
        return 'solar:chart-2-linear';
      case 'quote':
        return 'solar:quote-down-linear';
      default:
        return 'solar:document-text-linear';
    }
  };

  const getPostColor = () => {
    switch (post.priority) {
      case 'high':
        return 'danger';
      case 'normal':
        return 'primary';
      case 'low':
        return 'default';
      default:
        return 'primary';
    }
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'compact':
        return 'max-w-full';
      case 'magazine':
        return 'max-w-4xl';
      case 'card':
      default:
        return 'max-w-3xl';
    }
  };

  const shouldShowExpandedContent = () => {
    return isExpanded || layout === 'magazine' || post.content.length < 200;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
      className={`w-full ${layout === 'compact' ? 'mb-3' : 'mb-6'}`}
    >
      <Card
        className={`border-default-200 dark:border-default-700 bg-content1 mx-auto overflow-hidden transition-all duration-300 hover:shadow-lg ${getLayoutClasses()} ${
          layout === 'compact' ? 'shadow-sm' : 'shadow-medium'
        }`}
      >
        <CardBody className={layout === 'compact' ? 'p-4' : 'p-0'}>
          {/* Compact Layout */}
          {layout === 'compact' && (
            <div className="flex gap-4">
              {showImages && post.media && (
                <div className="flex-shrink-0">
                  <div className="h-16 w-24 rounded-md bg-default-100 overflow-hidden">
                    <img
                      src={post.media.thumbnail || post.media.url}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar src={post.author.avatar} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium truncate">{post.author.name}</span>
                        {post.author.verified && (
                          <Icon icon="solar:verified-check-bold" className="text-primary h-3 w-3" />
                        )}
                      </div>
                      <span className="text-xs text-foreground-500">{post.timestamp}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {post.isTrending && (
                      <Chip size="sm" color="warning" variant="flat" className="text-xs">
                        <Icon icon="solar:fire-linear" className="h-2 w-2 mr-1" />
                        Trending
                      </Chip>
                    )}
                    <Chip size="sm" color={getPostColor()} variant="flat" className="text-xs">
                      {tPost(`types.${post.type}`)}
                    </Chip>
                  </div>
                </div>
                <h3 className="text-foreground font-semibold text-sm line-clamp-2 mb-1">
                  {post.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-foreground-500">
                  <span className="flex items-center gap-1">
                    <Icon icon="solar:heart-linear" className="h-3 w-3" />
                    {formatCount(post.engagement.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon="solar:chat-round-linear" className="h-3 w-3" />
                    {formatCount(post.engagement.comments)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon="solar:eye-linear" className="h-3 w-3" />
                    {formatCount(post.engagement.views)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Card and Magazine Layouts */}
          {layout !== 'compact' && (
            <>
              {/* Header */}
              <div className={`${layout === 'magazine' ? 'px-8 pt-8' : 'p-4 sm:p-6'} pb-4`}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={post.author.avatar}
                      name={post.author.name}
                      size="md"
                      className="ring-primary/20 ring-2"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-foreground truncate font-semibold">{post.author.name}</h4>
                        {post.author.verified && (
                          <Icon
                            icon="solar:verified-check-bold"
                            className="text-primary h-4 w-4 flex-shrink-0"
                          />
                        )}
                      </div>
                      <div className="text-foreground-500 flex items-center gap-2 text-sm">
                        <span>{post.author.handle}</span>
                        <div className="bg-foreground-400 h-1 w-1 rounded-full" />
                        <span>{post.timestamp}</span>
                        {post.readTime && (
                          <>
                            <div className="bg-foreground-400 h-1 w-1 rounded-full" />
                            <span>{post.readTime} min read</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.isTrending && (
                      <Chip
                        startContent={<Icon icon="solar:fire-linear" className="h-3 w-3" />}
                        color="warning"
                        size="sm"
                        variant="flat"
                        className="text-xs font-medium"
                      >
                        Trending
                      </Chip>
                    )}
                    <Chip
                      startContent={<Icon icon={getPostIcon()} className="h-3 w-3" />}
                      color={getPostColor()}
                      size="sm"
                      variant="flat"
                      className="text-xs font-medium"
                    >
                      {tPost(`types.${post.type}`)}
                    </Chip>

                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly variant="light" size="sm">
                          <Icon icon="solar:menu-dots-linear" className="h-4 w-4" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem key="save" startContent={<Icon icon="solar:bookmark-linear" />}>
                          {tActions('bookmark')}
                        </DropdownItem>
                        <DropdownItem key="share" startContent={<Icon icon="solar:share-linear" />}>
                          {tActions('share')}
                        </DropdownItem>
                        <DropdownItem
                          key="report"
                          className="text-danger"
                          startContent={<Icon icon="solar:flag-linear" />}
                        >
                          {tActions('reportPost')}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>

                {/* Subcast Badge */}
                {post.subcast && (
                  <div className="mb-3 flex items-center gap-2">
                    <div className="bg-secondary/10 rounded-lg p-1.5">
                      <Icon icon={post.subcast.icon} className="text-secondary h-3 w-3" />
                    </div>
                    <span className="text-secondary text-xs font-medium">{post.subcast.name}</span>
                  </div>
                )}

                {/* Title and Content */}
                <h3 className={`text-foreground mb-3 font-bold ${layout === 'magazine' ? 'text-2xl line-clamp-3' : 'text-xl line-clamp-2'}`}>
                  {post.title}
                </h3>
                
                <div className="text-foreground-600 leading-relaxed">
                  {shouldShowExpandedContent() ? (
                    <p className={layout === 'magazine' ? 'text-lg' : ''}>{post.content}</p>
                  ) : (
                    <p className="line-clamp-3">{post.content}</p>
                  )}
                  
                  {!shouldShowExpandedContent() && post.content.length > 200 && (
                    <Button
                      variant="light"
                      size="sm"
                      className="mt-2 h-auto p-0 text-primary"
                      onPress={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? 'Read less' : 'Read more'}
                    </Button>
                  )}
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      size="sm"
                      variant="flat"
                      className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors"
                      startContent={<Icon icon="solar:hashtag-linear" className="h-2.5 w-2.5" />}
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Media */}
              {showImages && post.media && (
                <div className="bg-default-100 dark:bg-default-50 relative">
                  {post.media.type === 'video' ? (
                    <div className="relative aspect-video">
                      <video
                        ref={videoRef}
                        className="h-full w-full object-cover"
                        poster={post.media.thumbnail}
                        muted
                        loop
                        playsInline
                        autoPlay={autoPlay}
                      >
                        <source src={post.media.url} type="video/mp4" />
                      </video>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          isIconOnly
                          color="primary"
                          variant="shadow"
                          size="lg"
                          className="bg-black/20 backdrop-blur-sm transition-all hover:bg-black/40"
                          onPress={handleVideoToggle}
                        >
                          <Icon
                            icon={isVideoPlaying ? 'solar:pause-bold' : 'solar:play-bold'}
                            className="h-8 w-8 text-white"
                          />
                        </Button>
                      </div>

                      {post.media.duration && (
                        <div className="absolute right-2 bottom-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                          {post.media.duration}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={layout === 'magazine' ? 'aspect-[16/10]' : 'aspect-video'}>
                      <img
                        src={post.media.url}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Engagement */}
              <div className={`border-default-200 border-t ${layout === 'magazine' ? 'px-8 pb-8' : 'p-4 sm:p-6'} pt-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <button
                      onClick={() => onEngagement(post.id, 'like')}
                      className={`group flex items-center gap-2 transition-colors ${
                        post.isLiked ? 'text-danger' : 'text-foreground-500 hover:text-danger'
                      }`}
                    >
                      <Icon
                        icon={post.isLiked ? 'solar:heart-bold' : 'solar:heart-linear'}
                        className="h-5 w-5 transition-transform group-hover:scale-110"
                      />
                      <span className="text-xs font-medium sm:text-sm">
                        {formatCount(post.engagement.likes)}
                      </span>
                    </button>

                    <button
                      onClick={() => onEngagement(post.id, 'comment')}
                      className="text-foreground-500 hover:text-primary group flex items-center gap-2 transition-colors"
                    >
                      <Icon
                        icon="solar:chat-round-linear"
                        className="h-5 w-5 transition-transform group-hover:scale-110"
                      />
                      <span className="text-xs font-medium sm:text-sm">
                        {formatCount(post.engagement.comments)}
                      </span>
                    </button>

                    <button
                      onClick={() => onEngagement(post.id, 'share')}
                      className="text-foreground-500 hover:text-secondary group flex items-center gap-2 transition-colors"
                    >
                      <Icon
                        icon="solar:share-linear"
                        className="h-5 w-5 transition-transform group-hover:scale-110"
                      />
                      <span className="text-xs font-medium sm:text-sm">
                        {formatCount(post.engagement.shares)}
                      </span>
                    </button>

                    <div className="text-foreground-400 flex items-center gap-2">
                      <Icon icon="solar:eye-linear" className="h-5 w-5" />
                      <span className="text-xs font-medium sm:text-sm">
                        {formatCount(post.engagement.views)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onEngagement(post.id, 'bookmark')}
                    className={`transition-colors ${
                      post.isBookmarked ? 'text-warning' : 'text-foreground-500 hover:text-warning'
                    }`}
                  >
                    <Icon
                      icon={post.isBookmarked ? 'solar:bookmark-bold' : 'solar:bookmark-linear'}
                      className="h-5 w-5 transition-transform hover:scale-110"
                    />
                  </button>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
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
      const mockPosts = generateEnhancedMockPosts(selectedTopics, selectedSubcast);
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
              >
                <SelectItem key="recent">Recent</SelectItem>
                <SelectItem key="popular">Popular</SelectItem>
                <SelectItem key="trending">Trending</SelectItem>
                <SelectItem key="comments">Most Discussed</SelectItem>
              </Select>

              <Select
                placeholder="Post type"
                selectedKeys={[filters.postType]}
                onSelectionChange={(keys) => handleFilterChange('postType', Array.from(keys)[0] as string)}
                className="w-32"
                size="sm"
              >
                <SelectItem key="all">All Types</SelectItem>
                <SelectItem key="article">Articles</SelectItem>
                <SelectItem key="video">Videos</SelectItem>
                <SelectItem key="image">Images</SelectItem>
                <SelectItem key="poll">Polls</SelectItem>
                <SelectItem key="quote">Quotes</SelectItem>
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
          <h3 className="text-foreground mb-2 text-xl font-semibold">{t('noPostsFound')}</h3>
          <p className="text-foreground-600 mx-auto max-w-md">{t('noPostsFoundDescription')}</p>
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
                <EnhancedPostCard
                  post={post}
                  layout={viewOptions.layout}
                  onEngagement={handleEngagement}
                  showImages={viewOptions.showImages}
                  autoPlay={viewOptions.autoPlay}
                  tActions={tActions}
                  tPost={tPost}
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
