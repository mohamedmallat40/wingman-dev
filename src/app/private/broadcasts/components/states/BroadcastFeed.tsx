'use client';

import React, { useEffect, useRef, useState } from 'react';

import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
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
}

interface BroadcastFeedProps {
  selectedTopics: Array<{ id: string; name: string; icon: string; category: string }>;
  selectedSubcast?: string | null;
}

// Mock data generator
const generateMockPosts = (
  topics: BroadcastFeedProps['selectedTopics'],
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
    }
  ];

  const posts: BroadcastPost[] = [
    {
      id: '1',
      type: 'video',
      title: 'The Future of AI in Web Development',
      content:
        'Exploring how artificial intelligence is revolutionizing the way we build websites and applications. From automated code generation to intelligent design systems...',
      author: authors[0],
      timestamp: '2 hours ago',
      tags: ['AI', 'Web Development', 'Technology'],
      category: 'tech',
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
      engagement: { likes: 342, comments: 28, shares: 15, bookmarks: 67 }
    },
    {
      id: '2',
      type: 'article',
      title: 'Building Resilient Design Systems at Scale',
      content:
        "Learn how to create design systems that can adapt and scale with your growing product. We'll cover component architecture, token management, and team collaboration strategies that have proven successful across multiple organizations.",
      author: authors[3],
      timestamp: '4 hours ago',
      tags: ['Design Systems', 'UI/UX', 'Scalability'],
      category: 'design',
      subcast: {
        id: 'design-trends',
        name: 'Design Trends',
        icon: 'solar:palette-linear'
      },
      engagement: { likes: 189, comments: 34, shares: 22, bookmarks: 91 }
    },
    {
      id: '3',
      type: 'image',
      title: 'Mobile App UI Trends for 2024',
      content:
        "A comprehensive look at the emerging mobile design trends that are shaping user experiences. From glassmorphism to micro-interactions, here's what to expect.",
      author: authors[3],
      timestamp: '6 hours ago',
      tags: ['Mobile Design', 'UI Trends', '2024'],
      category: 'design',
      subcast: {
        id: 'mobile-first',
        name: 'Mobile First',
        icon: 'solar:smartphone-linear'
      },
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800'
      },
      engagement: { likes: 267, comments: 18, shares: 31, bookmarks: 45 }
    },
    {
      id: '4',
      type: 'article',
      title: 'Content Marketing Strategy That Actually Works',
      content:
        'Stop creating content that nobody reads. This comprehensive guide shows you how to build a content marketing strategy that drives real business results. Based on case studies from 50+ successful campaigns.',
      author: authors[4],
      timestamp: '8 hours ago',
      tags: ['Content Marketing', 'Strategy', 'Growth'],
      category: 'marketing',
      subcast: {
        id: 'marketing-mastery',
        name: 'Marketing Mastery',
        icon: 'solar:megaphone-linear'
      },
      engagement: { likes: 421, comments: 56, shares: 78, bookmarks: 123 }
    },
    {
      id: '5',
      type: 'quote',
      title: 'Startup Wisdom',
      content:
        '"The best time to plant a tree was 20 years ago. The second best time is now. The same applies to starting your business." - Ancient Chinese Proverb adapted for entrepreneurs',
      author: authors[1],
      timestamp: '12 hours ago',
      tags: ['Entrepreneurship', 'Motivation', 'Business'],
      category: 'business',
      subcast: {
        id: 'startup-stories',
        name: 'Startup Stories',
        icon: 'solar:rocket-linear'
      },
      engagement: { likes: 156, comments: 12, shares: 89, bookmarks: 34 }
    },
    {
      id: '6',
      type: 'video',
      title: 'DevOps Best Practices for 2024',
      content:
        'A deep dive into modern DevOps practices including CI/CD pipelines, containerization, and cloud-native architectures. Perfect for teams looking to optimize their deployment workflows.',
      author: authors[2],
      timestamp: '1 day ago',
      tags: ['DevOps', 'Cloud', 'Best Practices'],
      category: 'tech',
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
      engagement: { likes: 298, comments: 41, shares: 19, bookmarks: 87 }
    }
  ];

  // Filter posts based on selected subcast or topics
  let filteredPosts = posts;

  // If a specific subcast is selected, filter by that subcast
  if (selectedSubcast) {
    filteredPosts = posts.filter((post) => post.subcast?.id === selectedSubcast);
  } else {
    // Otherwise, filter by selected topics
    filteredPosts = posts.filter((post) =>
      topics.some(
        (topic) =>
          post.tags.some(
            (tag) =>
              tag.toLowerCase().includes(topic.name.toLowerCase()) ||
              topic.name.toLowerCase().includes(tag.toLowerCase())
          ) || post.category === topic.category
      )
    );
  }

  return filteredPosts;
};

const PostCard: React.FC<{
  post: BroadcastPost;
  onEngagement: (postId: string, action: string) => void;
  tActions: any;
  tPost: any;
}> = ({ post, onEngagement, tActions, tPost }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
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
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
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
    switch (post.type) {
      case 'video':
        return 'danger';
      case 'image':
        return 'secondary';
      case 'article':
        return 'primary';
      case 'poll':
        return 'warning';
      case 'quote':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
      className='w-full'
    >
      <Card className='border-default-200 dark:border-default-700 bg-content1 mx-auto max-w-3xl overflow-hidden transition-all duration-300 hover:shadow-lg'>
        <CardBody className='p-0'>
          {/* Header */}
          <div className='p-4 pb-4 sm:p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Avatar
                  src={post.author.avatar}
                  name={post.author.name}
                  size='md'
                  className='ring-primary/20 ring-2'
                />
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center gap-2'>
                    <h4 className='text-foreground truncate font-semibold'>{post.author.name}</h4>
                    {post.author.verified && (
                      <Icon
                        icon='solar:verified-check-bold'
                        className='text-primary h-4 w-4 flex-shrink-0'
                      />
                    )}
                  </div>
                  <div className='text-foreground-500 flex items-center gap-2 text-sm'>
                    <span>{post.author.handle}</span>
                    <div className='bg-foreground-400 h-1 w-1 rounded-full' />
                    <span>{post.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <Chip
                  startContent={<Icon icon={getPostIcon()} className='h-3 w-3' />}
                  color={getPostColor()}
                  size='sm'
                  variant='flat'
                  className='text-xs font-medium'
                >
                  {tPost(`types.${post.type}`)}
                </Chip>

                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly variant='light' size='sm'>
                      <Icon icon='solar:menu-dots-linear' className='h-4 w-4' />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem key='save' startContent={<Icon icon='solar:bookmark-linear' />}>
                      {tActions('bookmark')}
                    </DropdownItem>
                    <DropdownItem key='share' startContent={<Icon icon='solar:share-linear' />}>
                      {tActions('share')}
                    </DropdownItem>
                    <DropdownItem
                      key='report'
                      className='text-danger'
                      startContent={<Icon icon='solar:flag-linear' />}
                    >
                      {tActions('reportPost')}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>

            {/* Subcast Badge */}
            {post.subcast && (
              <div className='mb-3 flex items-center gap-2'>
                <div className='bg-secondary/10 rounded-lg p-1.5'>
                  <Icon icon={post.subcast.icon} className='text-secondary h-3 w-3' />
                </div>
                <span className='text-secondary text-xs font-medium'>{post.subcast.name}</span>
              </div>
            )}

            {/* Title and Content */}
            <h3 className='text-foreground mb-3 line-clamp-2 text-xl font-bold'>{post.title}</h3>
            <p className='text-foreground-600 mb-4 line-clamp-3 leading-relaxed'>{post.content}</p>

            {/* Tags */}
            <div className='mb-4 flex flex-wrap gap-2'>
              {post.tags.map((tag, index) => (
                <Chip
                  key={index}
                  size='sm'
                  variant='flat'
                  className='bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors'
                  startContent={<Icon icon='solar:hashtag-linear' className='h-2.5 w-2.5' />}
                >
                  {tag}
                </Chip>
              ))}
            </div>
          </div>

          {/* Media */}
          {post.media && (
            <div className='bg-default-100 dark:bg-default-50 relative'>
              {post.media.type === 'video' ? (
                <div className='relative aspect-video'>
                  <video
                    ref={videoRef}
                    className='h-full w-full object-cover'
                    poster={post.media.thumbnail}
                    muted
                    loop
                    playsInline
                  >
                    <source src={post.media.url} type='video/mp4' />
                  </video>

                  <div className='absolute inset-0 flex items-center justify-center'>
                    <Button
                      isIconOnly
                      color='primary'
                      variant='shadow'
                      size='lg'
                      className='bg-black/20 backdrop-blur-sm transition-all hover:bg-black/40'
                      onPress={handleVideoToggle}
                    >
                      <Icon
                        icon={isVideoPlaying ? 'solar:pause-bold' : 'solar:play-bold'}
                        className='h-8 w-8 text-white'
                      />
                    </Button>
                  </div>

                  {post.media.duration && (
                    <div className='absolute right-2 bottom-2 rounded bg-black/60 px-2 py-1 text-xs text-white'>
                      {post.media.duration}
                    </div>
                  )}
                </div>
              ) : (
                <div className='aspect-video'>
                  <img
                    src={post.media.url}
                    alt={post.title}
                    className='h-full w-full object-cover'
                  />
                </div>
              )}
            </div>
          )}

          {/* Engagement */}
          <div className='border-default-200 border-t p-4 pt-4 sm:p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-wrap items-center gap-4 sm:gap-6'>
                <button
                  onClick={() => onEngagement(post.id, 'like')}
                  className={`group flex items-center gap-2 transition-colors ${
                    post.isLiked ? 'text-danger' : 'text-foreground-500 hover:text-danger'
                  }`}
                >
                  <Icon
                    icon={post.isLiked ? 'solar:heart-bold' : 'solar:heart-linear'}
                    className='h-5 w-5 transition-transform group-hover:scale-110'
                  />
                  <span className='text-xs font-medium sm:text-sm'>
                    {formatCount(post.engagement.likes)}
                  </span>
                </button>

                <button
                  onClick={() => onEngagement(post.id, 'comment')}
                  className='text-foreground-500 hover:text-primary group flex items-center gap-2 transition-colors'
                >
                  <Icon
                    icon='solar:chat-round-linear'
                    className='h-5 w-5 transition-transform group-hover:scale-110'
                  />
                  <span className='text-xs font-medium sm:text-sm'>
                    {formatCount(post.engagement.comments)}
                  </span>
                </button>

                <button
                  onClick={() => onEngagement(post.id, 'share')}
                  className='text-foreground-500 hover:text-secondary group flex items-center gap-2 transition-colors'
                >
                  <Icon
                    icon='solar:share-linear'
                    className='h-5 w-5 transition-transform group-hover:scale-110'
                  />
                  <span className='text-xs font-medium sm:text-sm'>
                    {formatCount(post.engagement.shares)}
                  </span>
                </button>
              </div>

              <button
                onClick={() => onEngagement(post.id, 'bookmark')}
                className={`transition-colors ${
                  post.isBookmarked ? 'text-warning' : 'text-foreground-500 hover:text-warning'
                }`}
              >
                <Icon
                  icon={post.isBookmarked ? 'solar:bookmark-bold' : 'solar:bookmark-linear'}
                  className='h-5 w-5 transition-transform hover:scale-110'
                />
              </button>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default function BroadcastFeed({ selectedTopics, selectedSubcast }: BroadcastFeedProps) {
  const t = useTranslations('broadcasts.feed');
  const tPost = useTranslations('broadcasts.post');
  const tActions = useTranslations('broadcasts.actions');
  const [posts, setPosts] = useState<BroadcastPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const mockPosts = generateMockPosts(selectedTopics, selectedSubcast);
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedTopics, selectedSubcast]);

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

  if (loading) {
    return (
      <div className='space-y-6'>
        {[...Array(3)].map((_, index) => (
          <Card key={index} className='border-default-200'>
            <CardBody className='p-6'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='bg-default-200 h-12 w-12 animate-pulse rounded-full' />
                <div className='flex-1 space-y-2'>
                  <div className='bg-default-200 h-4 w-1/4 animate-pulse rounded' />
                  <div className='bg-default-200 h-3 w-1/6 animate-pulse rounded' />
                </div>
              </div>
              <div className='mb-4 space-y-2'>
                <div className='bg-default-200 h-6 w-3/4 animate-pulse rounded' />
                <div className='bg-default-200 h-4 animate-pulse rounded' />
                <div className='bg-default-200 h-4 w-5/6 animate-pulse rounded' />
              </div>
              <div className='bg-default-200 mb-4 h-48 animate-pulse rounded-lg' />
              <div className='flex gap-4'>
                <div className='bg-default-200 h-8 w-16 animate-pulse rounded' />
                <div className='bg-default-200 h-8 w-16 animate-pulse rounded' />
                <div className='bg-default-200 h-8 w-16 animate-pulse rounded' />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className='py-12 text-center'>
        <div className='bg-primary/10 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full'>
          <Icon icon='solar:inbox-linear' className='text-primary h-12 w-12' />
        </div>
        <h3 className='text-foreground mb-2 text-xl font-semibold'>{t('noPostsFound')}</h3>
        <p className='text-foreground-600 mx-auto max-w-md'>{t('noPostsFoundDescription')}</p>
      </div>
    );
  }

  return (
    <div className='space-y-6 sm:space-y-8'>
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <PostCard
              post={post}
              onEngagement={handleEngagement}
              tActions={tActions}
              tPost={tPost}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Load More */}
      <div className='py-8 text-center'>
        <Button
          color='primary'
          variant='bordered'
          size='lg'
          startContent={<Icon icon='solar:refresh-linear' className='h-4 w-4' />}
          className='px-8'
        >
          {t('loadMore')}
        </Button>
      </div>
    </div>
  );
}
