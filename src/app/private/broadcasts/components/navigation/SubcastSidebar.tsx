'use client';

import React, { useMemo, useState } from 'react';

import { Avatar, Button, Card, CardBody, Chip, Divider, Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface Subcast {
  id: string;
  name: string;
  description: string;
  icon: string;
  followerCount: number;
  isFollowing: boolean;
  category: 'tech' | 'business' | 'design' | 'marketing' | 'lifestyle' | 'education';
  color: string;
}

// Mock data for subcasts
const MOCK_SUBCASTS: Subcast[] = [
  {
    id: 'ai-innovation',
    name: 'AI Innovation',
    description: 'Latest developments in artificial intelligence',
    icon: 'solar:cpu-linear',
    followerCount: 45832,
    isFollowing: true,
    category: 'tech',
    color: 'primary'
  },
  {
    id: 'startup-stories',
    name: 'Startup Stories',
    description: 'Entrepreneurial journeys and business insights',
    icon: 'solar:rocket-linear',
    followerCount: 32156,
    isFollowing: false,
    category: 'business',
    color: 'secondary'
  },
  {
    id: 'design-trends',
    name: 'Design Trends',
    description: 'Modern UI/UX and design inspiration',
    icon: 'solar:palette-linear',
    followerCount: 28943,
    isFollowing: true,
    category: 'design',
    color: 'success'
  },
  {
    id: 'marketing-mastery',
    name: 'Marketing Mastery',
    description: 'Growth hacking and marketing strategies',
    icon: 'solar:megaphone-linear',
    followerCount: 19847,
    isFollowing: false,
    category: 'marketing',
    color: 'warning'
  },
  {
    id: 'dev-life',
    name: 'Developer Life',
    description: 'Programming tips and developer culture',
    icon: 'solar:code-square-linear',
    followerCount: 18532,
    isFollowing: true,
    category: 'tech',
    color: 'primary'
  },
  {
    id: 'wellness-tech',
    name: 'Wellness & Tech',
    description: 'Health technology and lifestyle balance',
    icon: 'solar:heart-linear',
    followerCount: 15673,
    isFollowing: false,
    category: 'lifestyle',
    color: 'danger'
  },
  {
    id: 'learning-hub',
    name: 'Learning Hub',
    description: 'Educational resources and skill development',
    icon: 'solar:graduation-square-linear',
    followerCount: 14298,
    isFollowing: true,
    category: 'education',
    color: 'default'
  },
  {
    id: 'fintech-future',
    name: 'FinTech Future',
    description: 'Financial technology and blockchain',
    icon: 'solar:chart-linear',
    followerCount: 12847,
    isFollowing: false,
    category: 'business',
    color: 'secondary'
  },
  {
    id: 'mobile-first',
    name: 'Mobile First',
    description: 'Mobile app development and design',
    icon: 'solar:smartphone-linear',
    followerCount: 11234,
    isFollowing: true,
    category: 'tech',
    color: 'primary'
  },
  {
    id: 'creative-minds',
    name: 'Creative Minds',
    description: 'Graphic design and creative inspiration',
    icon: 'solar:magic-stick-3-linear',
    followerCount: 9876,
    isFollowing: false,
    category: 'design',
    color: 'success'
  }
];

interface SubcastSidebarProps {
  selectedSubcasts?: string[];
  onSubcastToggle?: (subcastId: string) => void;
  onSubcastSelect?: (subcastId: string | null) => void;
  selectedSubcast?: string | null;
  className?: string;
}

export default function SubcastSidebar({
  selectedSubcasts = [],
  onSubcastToggle,
  onSubcastSelect,
  selectedSubcast,
  className = ''
}: SubcastSidebarProps) {
  const t = useTranslations('broadcasts.sidebar');
  const tCategories = useTranslations('broadcasts.categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [subcasts, setSubcasts] = useState<Subcast[]>(MOCK_SUBCASTS);

  // Filter and sort subcasts
  const filteredSubcasts = useMemo(() => {
    let filtered = subcasts.filter(
      (subcast) =>
        subcast.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subcast.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort by follower count (descending)
    filtered.sort((a, b) => b.followerCount - a.followerCount);

    return filtered;
  }, [subcasts, searchQuery]);

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

    // Also notify parent component
    onSubcastToggle?.(subcastId);
  };

  const formatFollowerCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getCategoryLabel = (category: string): string => {
    const key = category.toLowerCase().replace(/\s+/g, '');
    return tCategories(key, { default: category });
  };

  const followingCount = subcasts.filter((s) => s.isFollowing).length;

  return (
    <div className={`flex h-full flex-col ${className}`}>
      <Card className='border-default-200 h-full rounded-none border-r shadow-none'>
        <CardBody className='flex h-full flex-col p-4'>
          {/* Header */}
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='bg-primary/10 rounded-full p-2'>
                <Icon icon='solar:satellite-linear' className='text-primary h-4 w-4' />
              </div>
              <div>
                <h2 className='text-foreground font-semibold'>{t('title')}</h2>
                <p className='text-foreground-500 text-xs'>
                  {t('following')} {followingCount}
                </p>
              </div>
            </div>
          </div>

          {/* All Posts Button */}
          <div className='mb-3'>
            <Button
              variant={selectedSubcast === null ? 'solid' : 'flat'}
              color={selectedSubcast === null ? 'primary' : 'default'}
              size='sm'
              fullWidth
              startContent={<Icon icon='solar:home-linear' className='h-4 w-4' />}
              onPress={() => onSubcastSelect?.(null)}
              className='justify-start'
            >
              {t('allSubcasts')}
            </Button>
          </div>

          {/* Search */}
          <div className='mb-4'>
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={
                <Icon icon='solar:magnifer-linear' className='text-default-400 h-4 w-4' />
              }
              size='sm'
              classNames={{
                inputWrapper:
                  'bg-default-100 dark:bg-default-50 border-default-300 hover:border-primary focus-within:border-primary',
                input: 'text-foreground text-sm'
              }}
            />
          </div>

          <Divider className='mb-4' />

          {/* Subcasts List */}
          <div className='flex-1 space-y-2 overflow-y-auto'>
            {filteredSubcasts.map((subcast, index) => (
              <motion.div
                key={subcast.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card
                  className={`w-full cursor-pointer border transition-all duration-200 hover:scale-[1.02] ${
                    selectedSubcast === subcast.id
                      ? 'border-primary bg-primary/10 ring-primary/20 shadow-md ring-2'
                      : subcast.isFollowing
                        ? 'border-primary/30 bg-primary/5 shadow-sm'
                        : 'border-default-200 hover:border-primary/50 hover:bg-primary/5'
                  }`}
                  isPressable
                  onPress={() => onSubcastSelect?.(subcast.id)}
                >
                  <CardBody className='p-3'>
                    <div className='flex items-start gap-3'>
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 rounded-lg p-2 ${
                          selectedSubcast === subcast.id
                            ? 'bg-primary/30'
                            : subcast.isFollowing
                              ? 'bg-primary/20'
                              : `bg-${subcast.color}/10`
                        }`}
                      >
                        <Icon
                          icon={subcast.icon}
                          className={`h-4 w-4 ${
                            selectedSubcast === subcast.id || subcast.isFollowing
                              ? 'text-primary'
                              : `text-${subcast.color}`
                          }`}
                        />
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
                              isIconOnly
                              size='sm'
                              variant={subcast.isFollowing ? 'solid' : 'bordered'}
                              color={subcast.isFollowing ? 'primary' : 'default'}
                              className='h-4 w-4 min-w-4'
                              onPress={(e) => {
                                e.stopPropagation();
                                handleFollowToggle(subcast.id);
                              }}
                            >
                              <Icon
                                icon={
                                  subcast.isFollowing ? 'solar:heart-bold' : 'solar:heart-linear'
                                }
                                className='h-2 w-2'
                              />
                            </Button>
                          </div>
                        </div>

                        <p className='text-foreground-500 mb-2 line-clamp-2 text-xs'>
                          {subcast.description}
                        </p>

                        {/* Stats */}
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-1'>
                            <Icon
                              icon='solar:users-group-rounded-linear'
                              className='text-foreground-400 h-3 w-3'
                            />
                            <span className='text-foreground-500 text-xs font-medium'>
                              {formatFollowerCount(subcast.followerCount)}
                            </span>
                          </div>

                          <Chip
                            size='sm'
                            variant='flat'
                            color={subcast.color as any}
                            className='h-5 px-2 text-xs'
                          >
                            {getCategoryLabel(subcast.category)}
                          </Chip>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className='border-default-200 mt-4 border-t pt-4'>
            <Button
              variant='flat'
              size='sm'
              fullWidth
              startContent={<Icon icon='solar:add-circle-linear' className='h-4 w-4' />}
              className='text-foreground-600 hover:text-primary hover:bg-primary/10'
            >
              {t('exploreSubcasts')}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
