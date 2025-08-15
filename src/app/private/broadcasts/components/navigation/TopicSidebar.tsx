'use client';

import React, { useEffect, useMemo, useState } from 'react';

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Input,
  Progress,
  Select,
  SelectItem,
  Tab,
  Tabs
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';

import { useTopics } from '../../hooks';

interface Subcast {
  id: string;
  name: string;
  description: string;
  icon: string;
  followerCount: number;
  postCount: number;
  isFollowing: boolean;
  category:
    | 'tech'
    | 'business'
    | 'design'
    | 'marketing'
    | 'lifestyle'
    | 'education'
    | 'AI'
    | 'sales';
  color: string;
  isVerified?: boolean;
  isPrivate?: boolean;
  lastActivity?: string;
  moderators?: Array<{
    name: string;
    avatar: string;
  }>;
  trending?: boolean;
  engagement?: {
    weeklyGrowth: number;
    activeUsers: number;
  };
  tags?: string[];
  key?: string | null; // Added key field from API
}

interface TrendingTopic {
  id: string;
  name: string;
  postCount: number;
  growth: number;
  category: string;
}

// Enhanced mock data
const ENHANCED_SUBCASTS: Subcast[] = [
  {
    id: 'ai-innovation',
    name: 'AI Innovation',
    description: 'Latest developments in artificial intelligence and machine learning',
    icon: 'solar:cpu-linear',
    followerCount: 45832,
    postCount: 1247,
    isFollowing: true,
    category: 'AI',
    color: 'primary',
    isVerified: true,
    trending: true,
    lastActivity: '2 hours ago',
    engagement: {
      weeklyGrowth: 12.5,
      activeUsers: 3400
    },
    tags: ['Machine Learning', 'Deep Learning', 'GPT', 'Computer Vision'],
    moderators: [
      { name: 'Dr. Sarah Chen', avatar: 'https://i.pravatar.cc/150?img=1' },
      { name: 'Alex Kumar', avatar: 'https://i.pravatar.cc/150?img=7' }
    ]
  },
  {
    id: 'startup-stories',
    name: 'Startup Stories',
    description: 'Entrepreneurial journeys, funding news, and business insights',
    icon: 'solar:rocket-linear',
    followerCount: 32156,
    postCount: 892,
    isFollowing: false,
    category: 'business',
    color: 'secondary',
    isVerified: true,
    trending: false,
    lastActivity: '45 minutes ago',
    engagement: {
      weeklyGrowth: 8.3,
      activeUsers: 2100
    },
    tags: ['Startups', 'Funding', 'Entrepreneurship', 'Business Strategy']
  },
  {
    id: 'design-trends',
    name: 'Design Trends',
    description: 'Modern UI/UX, design systems, and creative inspiration',
    icon: 'solar:palette-linear',
    followerCount: 28943,
    postCount: 634,
    isFollowing: true,
    category: 'design',
    color: 'success',
    isVerified: true,
    trending: true,
    lastActivity: '1 hour ago',
    engagement: {
      weeklyGrowth: 15.7,
      activeUsers: 1800
    },
    tags: ['UI/UX', 'Design Systems', 'Figma', 'Typography'],
    moderators: [{ name: 'Emily Rodriguez', avatar: 'https://i.pravatar.cc/150?img=3' }]
  },
  {
    id: 'marketing-mastery',
    name: 'Marketing Mastery',
    description: 'Growth hacking, digital marketing, and conversion strategies',
    icon: 'solar:megaphone-linear',
    followerCount: 19847,
    postCount: 523,
    isFollowing: false,
    category: 'marketing',
    color: 'warning',
    isVerified: false,
    trending: false,
    lastActivity: '3 hours ago',
    engagement: {
      weeklyGrowth: 5.2,
      activeUsers: 1200
    },
    tags: ['SEO', 'Content Marketing', 'Social Media', 'Analytics']
  },
  {
    id: 'dev-life',
    name: 'Developer Life',
    description: 'Programming tips, coding best practices, and developer culture',
    icon: 'solar:code-square-linear',
    followerCount: 18532,
    postCount: 789,
    isFollowing: true,
    category: 'tech',
    color: 'primary',
    isVerified: true,
    trending: true,
    lastActivity: '30 minutes ago',
    engagement: {
      weeklyGrowth: 9.8,
      activeUsers: 2400
    },
    tags: ['JavaScript', 'React', 'Node.js', 'Best Practices'],
    moderators: [
      { name: 'Marcus Kim', avatar: 'https://i.pravatar.cc/150?img=2' },
      { name: 'Lisa Park', avatar: 'https://i.pravatar.cc/150?img=5' }
    ]
  },
  {
    id: 'wellness-tech',
    name: 'Wellness & Tech',
    description: 'Health technology, productivity tools, and work-life balance',
    icon: 'solar:heart-linear',
    followerCount: 15673,
    postCount: 412,
    isFollowing: false,
    category: 'lifestyle',
    color: 'danger',
    isVerified: false,
    trending: false,
    lastActivity: '6 hours ago',
    engagement: {
      weeklyGrowth: 3.1,
      activeUsers: 890
    },
    tags: ['Health Tech', 'Productivity', 'Mental Health', 'Fitness']
  },
  {
    id: 'sales-academy',
    name: 'Sales Academy',
    description: 'Sales techniques, CRM strategies, and revenue optimization',
    icon: 'solar:graph-up-linear',
    followerCount: 22341,
    postCount: 567,
    isFollowing: true,
    category: 'sales',
    color: 'secondary',
    isVerified: true,
    trending: true,
    lastActivity: '1 hour ago',
    engagement: {
      weeklyGrowth: 11.2,
      activeUsers: 1650
    },
    tags: ['Sales', 'CRM', 'Lead Generation', 'Closing Techniques'],
    moderators: [{ name: 'John Peterson', avatar: 'https://i.pravatar.cc/150?img=8' }]
  },
  {
    id: 'learning-hub',
    name: 'Learning Hub',
    description: 'Educational resources, skill development, and career growth',
    icon: 'solar:graduation-square-linear',
    followerCount: 14298,
    postCount: 345,
    isFollowing: true,
    category: 'education',
    color: 'default',
    isVerified: false,
    trending: false,
    lastActivity: '4 hours ago',
    engagement: {
      weeklyGrowth: 4.7,
      activeUsers: 750
    },
    tags: ['Education', 'Courses', 'Certifications', 'Career Development']
  },
  {
    id: 'fintech-future',
    name: 'FinTech Future',
    description: 'Financial technology, blockchain, and digital payments',
    icon: 'solar:chart-linear',
    followerCount: 12847,
    postCount: 298,
    isFollowing: false,
    category: 'business',
    color: 'secondary',
    isVerified: true,
    trending: false,
    lastActivity: '2 hours ago',
    engagement: {
      weeklyGrowth: 6.9,
      activeUsers: 980
    },
    tags: ['FinTech', 'Blockchain', 'Cryptocurrency', 'Digital Banking']
  },
  {
    id: 'mobile-first',
    name: 'Mobile First',
    description: 'Mobile app development, responsive design, and mobile UX',
    icon: 'solar:smartphone-linear',
    followerCount: 11234,
    postCount: 421,
    isFollowing: true,
    category: 'tech',
    color: 'primary',
    isVerified: false,
    trending: true,
    lastActivity: '25 minutes ago',
    engagement: {
      weeklyGrowth: 13.4,
      activeUsers: 1100
    },
    tags: ['Mobile Development', 'React Native', 'Flutter', 'iOS']
  }
];

const TRENDING_TOPICS: TrendingTopic[] = [
  { id: '1', name: 'GPT-4 Integration', postCount: 234, growth: 45.2, category: 'AI' },
  { id: '2', name: 'React 19 Features', postCount: 189, growth: 32.1, category: 'Development' },
  { id: '3', name: 'Design Tokens', postCount: 156, growth: 28.7, category: 'Design' },
  { id: '4', name: 'Growth Hacking', postCount: 143, growth: 25.3, category: 'Marketing' },
  { id: '5', name: 'Remote Sales', postCount: 121, growth: 19.8, category: 'Sales' }
];

interface TopicSidebarProps {
  selectedSubcasts?: string[];
  onSubcastToggle?: (subcastId: string) => void;
  onSubcastSelect?: (subcastId: string | null) => void;
  selectedSubcast?: string | null;
  className?: string;
}

export default function TopicSidebar({
  selectedSubcasts = [],
  onSubcastToggle,
  onSubcastSelect,
  selectedSubcast,
  className = ''
}: TopicSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  // Fetch topics from API
  const { data: topicsData, isLoading: topicsLoading, error: topicsError } = useTopics();
  const [subcasts, setSubcasts] = useState<Subcast[]>([]);

  // Update subcasts when API data comes in
  useEffect(() => {
    if (topicsData && Array.isArray(topicsData)) {
      // Transform API topics to match Subcast interface
      const transformedTopics: Subcast[] = topicsData.map((topic: any) => ({
        id: topic.id,
        name: topic.title, // API uses 'title' not 'name'
        description: topic.description,
        icon: topic.icon,
        followerCount: topic.followerCount || 0,
        postCount: topic.broadcastCount || 0,
        isFollowing: topic.isFollowed || false,
        category: 'tech', // Default category since not provided
        color: topic.color || '#3B82F6',
        isVerified: true, // Default to verified
        trending: false, // Default to not trending
        tags: [], // Default empty tags
        key: topic.key // Store the key field if needed
      }));
      setSubcasts(transformedTopics);
    }
  }, [topicsData]);

  // Filter subcasts
  const filteredSubcasts = useMemo(() => {
    let filtered = subcasts.filter(
      (subcast) =>
        subcast.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subcast.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subcast.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Filter by tab
    switch (activeTab) {
      case 'following':
        filtered = filtered.filter((subcast) => subcast.isFollowing);
        break;
      case 'trending':
        filtered = filtered.filter((subcast) => subcast.trending);
        break;
      case 'all':
      default:
        break;
    }

    return filtered;
  }, [subcasts, searchQuery, activeTab]);

  const handleFollowToggle = (subcastId: string) => {
    setSubcasts((prevSubcasts) =>
      prevSubcasts.map((subcast) => {
        if (subcast.id === subcastId) {
          return {
            ...subcast,
            isFollowing: !subcast.isFollowing,
            followerCount: subcast.isFollowing
              ? subcast.followerCount - 1
              : subcast.followerCount + 1
          };
        }
        return subcast;
      })
    );

    onSubcastToggle?.(subcastId);
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

  const followingCount = subcasts.filter((s) => s.isFollowing).length;

  // Show skeleton loading state
  if (topicsLoading) {
    return (
      <div className={`flex h-full flex-col ${className}`}>
        <Card className='border-default-200 h-full rounded-none border-r shadow-none'>
          <CardBody className='flex h-full flex-col p-4'>
            {/* Header Skeleton */}
            <div className='mb-4'>
              <div className='mb-3 flex items-center gap-2'>
                <div className='bg-default-200 h-8 w-8 animate-pulse rounded-full p-2'></div>
                <div>
                  <div className='bg-default-200 mb-1 h-4 w-16 animate-pulse rounded'></div>
                  <div className='bg-default-200 h-3 w-20 animate-pulse rounded'></div>
                </div>
              </div>
            </div>

            {/* Search Skeleton */}
            <div className='mb-4'>
              <div className='bg-default-200 h-10 w-full animate-pulse rounded-lg'></div>
            </div>

            {/* Tabs Skeleton */}
            <div className='mb-4'>
              <div className='flex gap-2'>
                <div className='bg-default-200 h-8 w-20 animate-pulse rounded-full'></div>
                <div className='bg-default-200 h-8 w-16 animate-pulse rounded-full'></div>
                <div className='bg-default-200 h-8 w-14 animate-pulse rounded-full'></div>
              </div>
            </div>

            {/* Topics List Skeleton */}
            <div className='flex-1 overflow-hidden'>
              <div className='space-y-3'>
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className='border-default-200 animate-pulse'>
                    <CardBody className='p-3'>
                      <div className='flex items-start gap-3'>
                        {/* Icon skeleton */}
                        <div className='bg-default-200 h-10 w-10 flex-shrink-0 rounded-lg'></div>

                        <div className='min-w-0 flex-1'>
                          {/* Topic name skeleton */}
                          <div className='bg-default-200 mb-2 h-4 w-3/4 rounded'></div>

                          {/* Description skeleton */}
                          <div className='space-y-1'>
                            <div className='bg-default-200 h-3 w-full rounded'></div>
                            <div className='bg-default-200 h-3 w-2/3 rounded'></div>
                          </div>

                          {/* Stats skeleton */}
                          <div className='mt-2 flex items-center gap-4'>
                            <div className='bg-default-200 h-3 w-12 rounded'></div>
                            <div className='bg-default-200 h-3 w-16 rounded'></div>
                          </div>
                        </div>

                        {/* Follow button skeleton */}
                        <div className='bg-default-200 h-8 w-16 rounded-full'></div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Show error state
  if (topicsError) {
    return (
      <div className={`flex h-full flex-col ${className}`}>
        <Card className='border-default-200 h-full rounded-none border-r shadow-none'>
          <CardBody className='flex h-full flex-col p-4'>
            <div className='flex h-full items-center justify-center'>
              <div className='text-center'>
                <Icon
                  icon='solar:danger-circle-linear'
                  className='text-danger mx-auto mb-2 h-8 w-8'
                />
                <p className='text-foreground-500 text-sm'>Failed to load topics</p>
                <p className='text-foreground-400 mt-1 text-xs'>Please try again later</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className={`flex h-full flex-col ${className}`}>
      <Card className='border-default-200 h-full rounded-none border-r shadow-none'>
        <CardBody className='flex h-full flex-col p-4'>
          {/* Header */}
          <div className='mb-4'>
            <div className='mb-3 flex items-center gap-2'>
              <div className='bg-primary/10 rounded-full p-2'>
                <Icon icon='solar:satellite-linear' className='text-primary h-4 w-4' />
              </div>
              <div>
                <h2 className='text-foreground font-semibold'>Topics</h2>
                <p className='text-foreground-500 text-xs'>Following {followingCount}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            size='sm'
            variant='underlined'
            className='mb-4'
            classNames={{
              tabList: 'w-full',
              tab: 'px-2 py-1 text-xs text-foreground',
              tabContent: 'text-foreground group-data-[selected=true]:text-primary',
              cursor: 'bg-primary'
            }}
          >
            <Tab key='all' title='All' />
            <Tab key='following' title='Following' />
            <Tab key='trending' title='Trending' />
          </Tabs>

          {/* Search */}
          <div className='mb-4'>
            <Input
              placeholder='Search topics...'
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={
                <Icon icon='solar:magnifer-linear' className='text-default-400 h-4 w-4' />
              }
              endContent={
                searchQuery && (
                  <Button isIconOnly size='sm' variant='light' onPress={() => setSearchQuery('')}>
                    <Icon icon='solar:close-circle-linear' className='h-3 w-3' />
                  </Button>
                )
              }
              size='sm'
              classNames={{
                inputWrapper:
                  'bg-default-100 dark:bg-default-50 border-default-300 hover:border-primary focus-within:border-primary'
              }}
            />
          </div>

          {/* Trending Topics Section */}
          {activeTab === 'trending' && (
            <>
              <div className='mb-4'>
                <h3 className='text-foreground mb-3 flex items-center gap-2 text-sm font-semibold'>
                  <Icon icon='solar:fire-linear' className='text-warning h-4 w-4' />
                  Hot Topics
                </h3>
                <div className='space-y-2'>
                  {TRENDING_TOPICS.slice(0, 3).map((topic, index) => (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className='bg-warning/5 border-warning/20 hover:bg-warning/10 cursor-pointer rounded-lg border p-3 transition-colors'
                    >
                      <div className='mb-1 flex items-center justify-between'>
                        <span className='text-foreground text-sm font-medium'>{topic.name}</span>
                        <Chip size='sm' color='warning' variant='flat' className='text-xs'>
                          +{topic.growth}%
                        </Chip>
                      </div>
                      <div className='text-foreground-500 text-xs'>
                        {topic.postCount} posts • {topic.category}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <Divider className='mb-4' />
            </>
          )}

          {/* Topics List */}
          <div className='flex-1 overflow-x-visible overflow-y-auto'>
            <div className='space-y-2 px-1'>
              <AnimatePresence>
                {filteredSubcasts.map((subcast, index) => (
                  <motion.div
                    key={subcast.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Card
                      className={`relative w-full cursor-pointer border transition-all duration-200 hover:z-10 hover:scale-[1.02] ${
                        selectedSubcast === subcast.id
                          ? 'border-primary bg-primary/10 ring-primary/20 shadow-md ring-2'
                          : subcast.isFollowing
                            ? 'border-primary/30 bg-primary/5 shadow-sm'
                            : 'border-default-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg'
                      }`}
                      onClick={() => onSubcastSelect?.(subcast.id)}
                    >
                      <CardBody className='p-3'>
                        <div className='flex items-start gap-3'>
                          {/* Icon with badges */}
                          <div className='relative flex-shrink-0'>
                            <div
                              className={`rounded-lg p-2 ${
                                selectedSubcast === subcast.id
                                  ? 'bg-primary/30'
                                  : subcast.isFollowing
                                    ? 'bg-primary/20'
                                    : 'bg-opacity-10'
                              }`}
                              style={{
                                backgroundColor: selectedSubcast === subcast.id || subcast.isFollowing 
                                  ? undefined 
                                  : `${subcast.color}1A`
                              }}
                            >
                              <Icon
                                icon={subcast.icon}
                                className={`h-4 w-4 ${
                                  selectedSubcast === subcast.id || subcast.isFollowing
                                    ? 'text-primary'
                                    : 'text-current'
                                }`}
                                style={{
                                  color: selectedSubcast === subcast.id || subcast.isFollowing 
                                    ? undefined 
                                    : subcast.color
                                }}
                              />
                            </div>

                            {/* Badges */}
                            <div className='absolute -top-1 -right-1 flex flex-col gap-1'>
                              {subcast.isVerified && (
                                <div className='bg-primary rounded-full p-0.5'>
                                  <Icon
                                    icon='solar:verified-check-bold'
                                    className='h-2 w-2 text-white'
                                  />
                                </div>
                              )}
                              {subcast.trending && (
                                <div className='bg-warning rounded-full p-0.5'>
                                  <Icon icon='solar:fire-bold' className='h-2 w-2 text-white' />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className='min-w-0 flex-1'>
                            <div className='mb-1 flex items-center justify-between'>
                              <h4 className='text-foreground truncate text-sm font-medium'>
                                {subcast.name}
                              </h4>
                              <div className='flex items-center gap-1'>
                                {selectedSubcast === subcast.id && (
                                  <Icon
                                    icon='solar:eye-bold'
                                    className='text-primary h-3 w-3 flex-shrink-0'
                                  />
                                )}
                                <Button
                                  size='sm'
                                  variant={subcast.isFollowing ? 'solid' : 'flat'}
                                  color={subcast.isFollowing ? 'success' : 'default'}
                                  className={`h-6 min-w-16 px-2 text-xs transition-colors ${
                                    subcast.isFollowing
                                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                      : 'bg-default-100 text-default-600 hover:bg-emerald-50 hover:text-emerald-600'
                                  }`}
                                  onPress={(e) => {
                                    e?.stopPropagation?.();
                                    handleFollowToggle(subcast.id);
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  {subcast.isFollowing ? 'Following' : 'Follow'}
                                </Button>
                              </div>
                            </div>

                            <p className='text-foreground-500 mb-2 line-clamp-2 text-xs'>
                              {subcast.description}
                            </p>

                            {/* Simplified Stats */}
                            <div className='flex items-center gap-3'>
                              <div className='flex items-center gap-1'>
                                <Icon
                                  icon='solar:users-group-rounded-linear'
                                  className='text-foreground-400 h-3 w-3'
                                />
                                <span className='text-foreground-500 text-xs font-medium'>
                                  {formatCount(subcast.followerCount)}
                                </span>
                              </div>
                              <div className='flex items-center gap-1'>
                                <Icon
                                  icon='solar:document-text-linear'
                                  className='text-foreground-400 h-3 w-3'
                                />
                                <span className='text-foreground-500 text-xs font-medium'>
                                  {formatCount(subcast.postCount)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredSubcasts.length === 0 && !topicsLoading && (
              <div className='py-8 text-center'>
                <div className='bg-default-100 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full'>
                  <Icon icon='solar:inbox-linear' className='text-default-400 h-6 w-6' />
                </div>
                <p className='text-foreground-500 text-sm'>
                  {subcasts.length === 0 ? 'No topics available' : 'No topics match your filters'}
                </p>
                {subcasts.length === 0 && (
                  <p className='text-foreground-400 mt-1 text-xs'>
                    Topics will appear here once they're available
                  </p>
                )}
              </div>
            )}
          </div>

        </CardBody>
      </Card>
    </div>
  );
}
