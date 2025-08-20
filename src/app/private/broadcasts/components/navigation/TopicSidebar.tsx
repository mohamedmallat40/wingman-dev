'use client';

import React, { useEffect, useMemo, useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Input,
  Tab,
  Tabs,
  Tooltip
} from '@heroui/react';
import { Icon } from '@iconify/react';
// Removed framer-motion for better performance
import { useTranslations } from 'next-intl';

import { useFollowTopic, useTopics, useUnfollowTopic } from '../../hooks';
import { useSmartCountFormat } from '../../utils/timeFormatting';

interface Subcast {
  id: string;
  name: string;
  description: string;
  icon: string;
  followerCount: number;
  postCount: number;
  isFollowing: boolean;
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

interface TopicSidebarProps {
  selectedSubcasts?: string[];
  onSubcastToggle?: (subcastId: string) => void;
  onSubcastSelect?: (subcastId: string | null, subcastData?: any) => void;
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
  const t = useTranslations('broadcasts');
  const { formatCount } = useSmartCountFormat();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  // Fetch topics from API
  const { data: topicsData, isLoading: topicsLoading, error: topicsError } = useTopics();
  const [subcasts, setSubcasts] = useState<Subcast[]>([]);

  // Follow/unfollow mutations
  const followMutation = useFollowTopic();
  const unfollowMutation = useUnfollowTopic();

  // Track which topic is currently being processed
  const [loadingTopicId, setLoadingTopicId] = useState<string | null>(null);

  // Update subcasts when API data comes in
  useEffect(() => {
    if (topicsData) {
      if (Array.isArray(topicsData)) {
        // Transform API topics to match Subcast interface
        const transformedTopics: Subcast[] = topicsData.map((topic: any) => ({
          id: topic.id,
          name: topic.title || topic.name, // API uses 'title' or 'name'
          description: topic.description || 'No description available',
          icon: topic.icon || 'solar:satellite-linear',
          followerCount: topic.followerCount || 0,
          postCount: topic.broadcastCount || topic.postCount || 0,
          isFollowing: topic.isFollowed || topic.isFollowing || false,
          color: topic.color || '#3B82F6',
          isVerified: true, // Default to verified
          trending: false, // Default to not trending
          tags: [], // Default empty tags
          key: topic.key // Store the key field if needed
        }));
        setSubcasts(transformedTopics);
      } else if (topicsData.data && Array.isArray(topicsData.data)) {
        // Handle nested data structure
        const transformedTopics: Subcast[] = topicsData.data.map((topic: any) => ({
          id: topic.id,
          name: topic.title || topic.name,
          description: topic.description || 'No description available',
          icon: topic.icon || 'solar:satellite-linear',
          followerCount: topic.followerCount || 0,
          postCount: topic.broadcastCount || topic.postCount || 0,
          isFollowing: topic.isFollowed || topic.isFollowing || false,
          color: topic.color || '#3B82F6',
          isVerified: true,
          trending: false,
          tags: [],
          key: topic.key
        }));
        setSubcasts(transformedTopics);
      }
    }
  }, [topicsData, topicsLoading, topicsError]);

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
    // Find the current subcast to determine if we should follow or unfollow
    const subcast = subcasts.find((s) => s.id === subcastId);
    if (!subcast) return;

    // Set loading state for this specific topic
    setLoadingTopicId(subcastId);

    if (subcast.isFollowing) {
      // Unfollow the topic
      unfollowMutation.mutate(subcastId, {
        onSuccess: () => {
          setLoadingTopicId(null);
        },
        onError: (error) => {
          console.error('Failed to unfollow topic:', error);
          setLoadingTopicId(null);
        }
      });
    } else {
      // Follow the topic
      followMutation.mutate(subcastId, {
        onSuccess: () => {
          setLoadingTopicId(null);
        },
        onError: (error) => {
          console.error('Failed to follow topic:', error);
          setLoadingTopicId(null);
        }
      });
    }

    onSubcastToggle?.(subcastId);
  };


  const followingCount = subcasts.filter((s) => s.isFollowing).length;

  // Show skeleton loading state
  if (topicsLoading) {
    return (
      <div className={`flex h-full flex-col ${className}`}>
        <div className='bg-content1 border-default-200 h-full rounded-lg border p-4'>
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
        </div>
      </div>
    );
  }

  // Show error state
  if (topicsError) {
    return (
      <div className={`flex h-full flex-col ${className}`}>
        <div className='bg-content1 border-default-200 h-full rounded-lg border p-4'>
          <div className='flex h-full items-center justify-center'>
            <div className='text-center'>
              <Icon
                icon='solar:danger-circle-linear'
                className='text-danger mx-auto mb-2 h-8 w-8'
              />
              <p className='text-foreground-500 text-sm'>{t('errors.loadTopics')}</p>
              <p className='text-foreground-400 mt-1 text-xs'>{t('errors.tryAgainLater')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-full flex-col ${className}`}>
      <div className='bg-content1/80 backdrop-blur-xl border-default-200/50 h-full rounded-[20px] border shadow-[0px_8px_30px_rgba(0,0,0,0.08)] p-6'>
        {/* Header */}
        <div className='mb-6'>
          <div className='mb-4 flex items-center gap-3'>
            <div className='bg-primary/10 rounded-[12px] p-2.5 border border-primary/20'>
              <Icon icon='solar:chat-dots-linear' className='text-primary h-5 w-5' />
            </div>
            <div>
              <h2 className='text-foreground font-bold text-lg tracking-tight'>{t('topics.title')}</h2>
              <p className='text-foreground-500 text-sm font-medium'>
                {t('topics.followingCount', { count: followingCount })}
              </p>
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
          <Tab key='all' title={t('topics.all')} />
          <Tab key='following' title={t('topics.following')} />
          <Tab key='trending' title={t('topics.trending')} />
        </Tabs>

        {/* Search */}
        <div className='mb-4'>
          <Input
            placeholder={t('topics.searchPlaceholder')}
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={
              <Icon icon='solar:magnifer-linear' className='text-default-400 h-4 w-4' />
            }
            endContent={
              searchQuery && (
                <Button isIconOnly size='sm' variant='light' onPress={() => setSearchQuery('')}>
                  <Icon icon='solar:close-circle-linear' className='h-4 w-4' />
                </Button>
              )
            }
            size='sm'
            classNames={{
              inputWrapper:
                'bg-default-100/50 dark:bg-default-50/50 border-default-200 hover:border-primary/50 focus-within:border-primary rounded-[12px] backdrop-blur-sm'
            }}
          />
        </div>


        {/* Topics List */}
        <div className='mt-4 flex-1 overflow-x-visible overflow-y-auto'>
          <div className='space-y-6 px-1 pt-6 pb-4'>
            {filteredSubcasts.map((subcast, index) => (
              <div
                key={subcast.id}
                className='relative my-3 animate-in fade-in slide-in-from-left-1 duration-300'
                style={{
                  animationDelay: `${index * 100}ms`,
                  overflow: 'visible'
                }}
              >
                  <Card
                    className={`relative w-full cursor-pointer border transition-all duration-300 hover:z-20 hover:-translate-y-2 hover:scale-[1.02] min-h-[120px] rounded-[16px] backdrop-blur-sm ${
                      selectedSubcast === subcast.id
                        ? 'border-primary/30 bg-primary/10 ring-primary/20 shadow-[0px_16px_40px_rgba(59,130,246,0.15)] ring-2'
                        : subcast.isFollowing
                          ? 'border-primary/20 bg-primary/5 shadow-[0px_8px_30px_rgba(0,0,0,0.08)]'
                          : 'border-default-200/50 hover:border-primary/30 hover:bg-primary/5 hover:shadow-[0px_16px_40px_rgba(0,0,0,0.12)]'
                    }`}
                  >
                    <div 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSubcastSelect?.(subcast.id, subcast);
                      }}
                      className="w-full h-full cursor-pointer"
                    >
                    <CardBody className='p-4'>
                      <div className='flex items-start gap-3'>
                        {/* Icon with badges */}
                        <div className='relative flex-shrink-0'>
                          <div
                            className={`rounded-[12px] p-2.5 border ${
                              selectedSubcast === subcast.id
                                ? 'bg-primary/20 border-primary/30'
                                : subcast.isFollowing
                                  ? 'bg-primary/15 border-primary/25'
                                  : 'bg-opacity-10 border-default-200/50'
                            }`}
                            style={{
                              backgroundColor:
                                selectedSubcast === subcast.id || subcast.isFollowing
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
                                color:
                                  selectedSubcast === subcast.id || subcast.isFollowing
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
                              <Tooltip
                                content={
                                  subcast.isFollowing
                                    ? t('tooltips.unfollow')
                                    : t('tooltips.follow')
                                }
                                placement='top'
                                delay={500}
                                closeDelay={0}
                                className='text-xs'
                              >
                                <Button
                                  isIconOnly
                                  size='sm'
                                  variant={subcast.isFollowing ? 'solid' : 'flat'}
                                  color={subcast.isFollowing ? 'success' : 'primary'}
                                  className={`min-w-unit-7 h-7 w-7 transition-all duration-200 ${
                                    subcast.isFollowing
                                      ? 'bg-success/20 text-success hover:bg-success/30 border-success/30 border'
                                      : 'bg-primary/10 text-primary hover:bg-primary/20 border-primary/30 border'
                                  }`}
                                  isLoading={loadingTopicId === subcast.id}
                                  isDisabled={loadingTopicId === subcast.id}
                                  onPress={() => {
                                    handleFollowToggle(subcast.id);
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  {!loadingTopicId || loadingTopicId !== subcast.id ? (
                                    <Icon
                                      icon={
                                        subcast.isFollowing
                                          ? 'solar:check-circle-bold'
                                          : 'solar:add-circle-linear'
                                      }
                                      className='h-4 w-4'
                                    />
                                  ) : null}
                                </Button>
                              </Tooltip>
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
                    </div>
                  </Card>
              </div>
            ))}
          </div>

          {filteredSubcasts.length === 0 && !topicsLoading && (
            <div className='py-8 text-center'>
              <div className='bg-default-100 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full'>
                <Icon icon='solar:inbox-linear' className='text-default-400 h-6 w-6' />
              </div>
              <p className='text-foreground-500 text-sm'>
                {subcasts.length === 0 ? t('topics.noTopicsAvailable') : t('topics.noTopicsMatch')}
              </p>
              {subcasts.length === 0 && (
                <p className='text-foreground-400 mt-1 text-xs'>{t('topics.topicsWillAppear')}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
