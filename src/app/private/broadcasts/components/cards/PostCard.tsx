'use client';

import React, { useState } from 'react';

import { 
  Card, 
  CardBody, 
  CardHeader,
  Button, 
  Avatar, 
  Chip,
  Tooltip,
  Divider
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { type BroadcastPost } from '../../types';
import { formatTimeAgo, formatEngagementCount } from '../../utils/broadcast-utils';

interface PostCardProps {
  post: BroadcastPost;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  className?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onBookmark,
  onComment,
  onShare,
  className = ''
}) => {
  const t = useTranslations('broadcasts');
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = post.content.length > 280;
  const displayContent = isExpanded || !shouldTruncate 
    ? post.content 
    : `${post.content.substring(0, 280)}...`;

  const getPostIcon = () => {
    switch (post.type) {
      case 'article': return 'solar:document-text-linear';
      case 'video': return 'solar:videocamera-linear';
      case 'image': return 'solar:camera-linear';
      case 'poll': return 'solar:chart-2-linear';
      case 'quote': return 'solar:quote-up-linear';
      case 'gallery': return 'solar:gallery-linear';
      case 'link': return 'solar:link-linear';
      default: return 'solar:document-linear';
    }
  };

  const getPostTypeColor = () => {
    switch (post.type) {
      case 'article': return 'primary';
      case 'video': return 'secondary';
      case 'image': return 'success';
      case 'poll': return 'warning';
      case 'quote': return 'default';
      case 'gallery': return 'success';
      case 'link': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Card className={`border-divider/50 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}>
      <CardHeader className='pb-3'>
        <div className='flex w-full items-start gap-3'>
          {/* Author Avatar */}
          <div className='relative'>
            <Avatar
              src={post.author.avatar}
              name={post.author.name}
              size='md'
              className='ring-primary/20 ring-offset-background ring-2 ring-offset-2'
            />
            {post.author.verified && (
              <div className='bg-primary absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white'>
                <Icon icon='solar:verified-check-bold' className='h-3 w-3 text-white' />
              </div>
            )}
          </div>

          {/* Author Info & Post Metadata */}
          <div className='min-w-0 flex-1'>
            <div className='flex flex-wrap items-center gap-2'>
              <h3 className='text-foreground truncate font-semibold'>
                {post.author.name}
              </h3>
              <span className='text-foreground-500'>@{post.author.handle}</span>
              <span className='text-foreground-400'>·</span>
              <time className='text-foreground-500 text-sm'>
                {formatTimeAgo(post.timestamp)}
              </time>
            </div>
            
            <div className='mt-1 flex flex-wrap items-center gap-2'>
              <Chip
                size='sm'
                color={getPostTypeColor() as any}
                variant='flat'
                startContent={<Icon icon={getPostIcon()} className='h-3 w-3' />}
              >
                {post.type}
              </Chip>
              
              {post.subcast && (
                <Chip
                  size='sm'
                  variant='bordered'
                  startContent={<Icon icon={post.subcast.icon} className='h-3 w-3' />}
                >
                  {post.subcast.name}
                </Chip>
              )}
              
              {post.isTrending && (
                <Chip
                  size='sm'
                  color='warning'
                  variant='flat'
                  startContent={<Icon icon='solar:fire-linear' className='h-3 w-3' />}
                >
                  Trending
                </Chip>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className='flex items-center gap-1'>
            <Tooltip content={post.isBookmarked ? 'Remove bookmark' : 'Bookmark'}>
              <Button
                isIconOnly
                size='sm'
                variant='light'
                color={post.isBookmarked ? 'warning' : 'default'}
                onPress={() => onBookmark(post.id)}
                className='min-w-unit-8 h-unit-8'
              >
                <Icon 
                  icon={post.isBookmarked ? 'solar:bookmark-bold' : 'solar:bookmark-linear'} 
                  className='h-4 w-4' 
                />
              </Button>
            </Tooltip>
          </div>
        </div>
      </CardHeader>

      <CardBody className='pt-0'>
        {/* Post Title */}
        {post.title && (
          <h2 className='text-foreground mb-3 text-lg font-bold leading-tight'>
            {post.title}
          </h2>
        )}

        {/* Post Content */}
        <div className='text-foreground-700 mb-4 leading-relaxed'>
          {displayContent}
          {shouldTruncate && (
            <Button
              size='sm'
              variant='light'
              onPress={() => setIsExpanded(!isExpanded)}
              className='text-primary ml-2 h-auto min-w-0 p-0 font-medium'
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </Button>
          )}
        </div>

        {/* Media Content */}
        {post.media && (
          <div className='mb-4 overflow-hidden rounded-lg'>
            {post.media.type === 'image' && (
              <img
                src={post.media.url as string}
                alt={post.title}
                className='h-auto w-full rounded-lg object-cover'
                loading='lazy'
              />
            )}
            {post.media.type === 'video' && (
              <div className='bg-default-100 relative aspect-video rounded-lg'>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Button
                    isIconOnly
                    color='primary'
                    size='lg'
                    className='h-16 w-16 rounded-full shadow-lg'
                  >
                    <Icon icon='solar:play-bold' className='h-6 w-6 text-white' />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className='mb-4 flex flex-wrap gap-2'>
            {post.tags.map((tag, index) => (
              <Chip
                key={index}
                size='sm'
                variant='flat'
                className='text-primary-700 bg-primary/10 hover:bg-primary/20 cursor-pointer transition-colors'
              >
                #{tag}
              </Chip>
            ))}
          </div>
        )}

        <Divider className='mb-4' />

        {/* Engagement Actions */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1'>
            <Button
              size='sm'
              variant='light'
              color={post.isLiked ? 'danger' : 'default'}
              startContent={
                <Icon 
                  icon={post.isLiked ? 'solar:heart-bold' : 'solar:heart-linear'} 
                  className='h-4 w-4' 
                />
              }
              onPress={() => onLike(post.id)}
              className='h-auto min-w-0 px-3 py-2'
            >
              {formatEngagementCount(post.engagement.likes)}
            </Button>

            <Button
              size='sm'
              variant='light'
              startContent={<Icon icon='solar:chat-round-linear' className='h-4 w-4' />}
              onPress={() => onComment(post.id)}
              className='h-auto min-w-0 px-3 py-2'
            >
              {formatEngagementCount(post.engagement.comments)}
            </Button>

            <Button
              size='sm'
              variant='light'
              startContent={<Icon icon='solar:share-linear' className='h-4 w-4' />}
              onPress={() => onShare(post.id)}
              className='h-auto min-w-0 px-3 py-2'
            >
              {formatEngagementCount(post.engagement.shares)}
            </Button>
          </div>

          <div className='text-foreground-400 flex items-center gap-4 text-sm'>
            <span className='flex items-center gap-1'>
              <Icon icon='solar:eye-linear' className='h-4 w-4' />
              {formatEngagementCount(post.engagement.views)}
            </span>
            {post.readTime && (
              <span className='flex items-center gap-1'>
                <Icon icon='solar:clock-circle-linear' className='h-4 w-4' />
                {post.readTime} min read
              </span>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PostCard;