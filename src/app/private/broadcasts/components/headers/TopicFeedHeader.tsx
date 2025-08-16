'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { Avatar, Button, Card, CardBody, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  followerCount: number;
  broadcastCount: number;
  isFollowed: boolean;
}

interface TopicFeedHeaderProps {
  topic: Topic;
  onFollow: () => void;
  onUnfollow: () => void;
  onClearFilter: () => void;
  isLoading?: boolean;
  className?: string;
}

export const TopicFeedHeader: React.FC<TopicFeedHeaderProps> = ({
  topic,
  onFollow,
  onUnfollow,
  onClearFilter,
  isLoading = false,
  className = ''
}) => {
  const t = useTranslations('broadcasts');
  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-0 shadow-lg">
        <CardBody className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Topic Icon */}
              <div className="relative">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-xl shadow-lg"
                  style={{ backgroundColor: `${topic.color}20` }}
                >
                  <Icon
                    icon={topic.icon}
                    className="h-8 w-8"
                    style={{ color: topic.color }}
                  />
                </div>
                
                {/* Verified badge for topics */}
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                  <Icon icon="solar:verified-check-bold" className="h-3 w-3 text-white" />
                </div>
              </div>

              {/* Topic Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground truncate">
                    {topic.title}
                  </h1>
                  <Chip
                    size="sm"
                    variant="flat"
                    color="primary"
                    className="bg-primary/10 text-primary"
                  >
                    {t('topics.feedHeader.topicLabel')}
                  </Chip>
                </div>

                <p className="text-foreground-600 mb-4 line-clamp-2 leading-relaxed">
                  {topic.description}
                </p>

                {/* Topic Stats */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="solar:users-group-rounded-linear"
                      className="h-4 w-4 text-foreground-400"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {formatCount(topic.followerCount)} followers
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="solar:document-text-linear"
                      className="h-4 w-4 text-foreground-400"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {formatCount(topic.broadcastCount)} posts
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="flat"
                color="default"
                size="sm"
                startContent={<Icon icon="solar:close-circle-linear" className="h-4 w-4" />}
                onPress={onClearFilter}
                className="transition-all duration-200 hover:scale-105"
              >
                {t('topics.feedHeader.clearFilter')}
              </Button>
              
              <Button
                color={topic.isFollowed ? "success" : "primary"}
                variant={topic.isFollowed ? "flat" : "solid"}
                size="sm"
                isLoading={isLoading}
                startContent={
                  !isLoading && (
                    <Icon 
                      icon={topic.isFollowed ? "solar:check-circle-bold" : "solar:user-plus-linear"}
                      className="h-4 w-4" 
                    />
                  )
                }
                onPress={topic.isFollowed ? onUnfollow : onFollow}
                className="min-w-24 transition-all duration-200 hover:scale-105"
              >
                {topic.isFollowed ? t('topics.following') : t('topics.follow')}
              </Button>
            </div>
          </div>

          {/* Topic Feed Indicator */}
          <div className="mt-6 pt-4 border-t border-divider/50">
            <div className="flex items-center gap-2 text-sm text-foreground-500">
              <Icon icon="solar:filter-linear" className="h-4 w-4" />
              <span>{t('topics.feedHeader.showingPostsFrom', { topic: topic.title })}</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};