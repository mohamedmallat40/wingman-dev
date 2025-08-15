'use client';

import React from 'react';

import {
  Button,
  Card,
  CardBody,
  Chip
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface Topic {
  id: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
  followerCount?: number;
  broadcastCount?: number;
  isFollowed?: boolean;
  isVerified?: boolean;
  trending?: boolean;
}

interface TopicCardProps {
  topic: Topic;
  isSelected?: boolean;
  onFollow?: (topicId: string) => void;
  onSelect?: (topicId: string) => void;
  index?: number;
  className?: string;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  isSelected = false,
  onFollow,
  onSelect,
  index = 0,
  className = ''
}) => {
  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFollow?.(topic.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={className}
    >
      <Card
        className={`relative w-full cursor-pointer border transition-all duration-200 hover:z-10 hover:scale-[1.02] ${
          isSelected
            ? 'border-primary bg-primary/10 ring-primary/20 shadow-md ring-2'
            : topic.isFollowed
              ? 'border-primary/30 bg-primary/5 shadow-sm'
              : 'border-default-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg'
        }`}
        isPressable
        onPress={() => onSelect?.(topic.id)}
      >
        <CardBody className='p-3'>
          <div className='flex items-start gap-3'>
            {/* Icon with badges */}
            <div className='relative flex-shrink-0'>
              <div
                className={`rounded-lg p-2 ${
                  isSelected
                    ? 'bg-primary/30'
                    : topic.isFollowed
                      ? 'bg-primary/20'
                      : 'bg-opacity-10'
                }`}
                style={{
                  backgroundColor: isSelected || topic.isFollowed 
                    ? undefined 
                    : `${topic.color}1A`
                }}
              >
                <Icon
                  icon={topic.icon || 'solar:hashtag-linear'}
                  className={`h-4 w-4 ${
                    isSelected || topic.isFollowed
                      ? 'text-primary'
                      : 'text-current'
                  }`}
                  style={{
                    color: isSelected || topic.isFollowed 
                      ? undefined 
                      : topic.color
                  }}
                />
              </div>

              {/* Badges */}
              <div className='absolute -top-1 -right-1 flex flex-col gap-1'>
                {topic.isVerified && (
                  <div className='bg-primary rounded-full p-0.5'>
                    <Icon
                      icon='solar:verified-check-bold'
                      className='h-2 w-2 text-white'
                    />
                  </div>
                )}
                {topic.trending && (
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
                  {topic.title}
                </h4>
                <div className='flex items-center gap-1'>
                  {isSelected && (
                    <Icon
                      icon='solar:eye-bold'
                      className='text-primary h-3 w-3 flex-shrink-0'
                    />
                  )}
                  <Button
                    size='sm'
                    variant={topic.isFollowed ? 'solid' : 'flat'}
                    color={topic.isFollowed ? 'success' : 'default'}
                    className={`h-6 min-w-16 px-2 text-xs transition-colors ${
                      topic.isFollowed
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-default-100 text-default-600 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                    onPress={handleFollowToggle}
                  >
                    {topic.isFollowed ? 'Following' : 'Follow'}
                  </Button>
                </div>
              </div>

              <p className='text-foreground-500 mb-2 line-clamp-2 text-xs'>
                {topic.description}
              </p>

              {/* Stats */}
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-1'>
                  <Icon
                    icon='solar:users-group-rounded-linear'
                    className='text-foreground-400 h-3 w-3'
                  />
                  <span className='text-foreground-500 text-xs font-medium'>
                    {formatCount(topic.followerCount || 0)}
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <Icon
                    icon='solar:document-text-linear'
                    className='text-foreground-400 h-3 w-3'
                  />
                  <span className='text-foreground-500 text-xs font-medium'>
                    {formatCount(topic.broadcastCount || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};