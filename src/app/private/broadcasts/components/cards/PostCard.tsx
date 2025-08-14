'use client';

import React, { useState } from 'react';

import { Avatar, Button, Card, CardBody, CardHeader, Chip, Divider, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { type BroadcastPost } from '../../types';

// Utility functions
const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const postTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - postTime.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const formatEngagementCount = (count: number): string => {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
};

interface PostCardProps {
  post: BroadcastPost;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onClick?: (postId: string) => void;
  isLoading?: boolean;
  className?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onBookmark,
  onComment,
  onShare,
  onClick,
  isLoading = false,
  className = ''
}) => {
  const t = useTranslations('broadcasts');
  const [isExpanded, setIsExpanded] = useState(false);

  // Safety checks for post data
  if (!post || !post.id) {
    return null;
  }

  const safeDescription = post.description || '';
  const safeTitle = post.title || 'Untitled Post';
  const safeOwner = post.owner || { firstName: 'Unknown', lastName: 'User', profileImage: null, userName: null, isMailVerified: false };
  const safeTopics = post.topics || [];
  const safeSkills = post.skills || [];
  const safeMedia = post.media || [];
  const safeCreatedAt = post.createdAt || new Date().toISOString();

  const shouldTruncate = safeDescription.length > 280;
  const displayContent =
    isExpanded || !shouldTruncate ? safeDescription : `${safeDescription.substring(0, 280)}...`;

  const getPostIcon = () => {
    // Determine icon based on media content or default to broadcast
    if (safeMedia.length > 0) {
      return 'solar:gallery-linear';
    }
    return 'solar:broadcast-linear';
  };

  const getPostTypeColor = () => {
    // Default color for broadcast posts
    return 'primary';
  };

  return (
    <Card
      className={`border-divider/50 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
    >
      <CardHeader className='pb-3'>
        <div className='flex w-full items-start gap-3'>
          {/* Author Avatar */}
          <div className='relative'>
            <Avatar
              src={safeOwner.profileImage || undefined}
              name={`${safeOwner.firstName} ${safeOwner.lastName}`}
              size='md'
              className='ring-primary/20 ring-offset-background ring-2 ring-offset-2'
            />
            {safeOwner.isMailVerified && (
              <div className='bg-primary absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white'>
                <Icon icon='solar:verified-check-bold' className='h-3 w-3 text-white' />
              </div>
            )}
          </div>

          {/* Author Info & Post Metadata */}
          <div className='min-w-0 flex-1'>
            <div className='flex flex-wrap items-center gap-2'>
              <h3 className='text-foreground truncate font-semibold'>
                {safeOwner.firstName} {safeOwner.lastName}
              </h3>
              {safeOwner.userName && (
                <span className='text-foreground-500'>@{safeOwner.userName}</span>
              )}
              <span className='text-foreground-400'>·</span>
              <time className='text-foreground-500 text-sm'>{formatTimeAgo(safeCreatedAt)}</time>
            </div>

            <div className='mt-1 flex flex-wrap items-center gap-2'>
              <Chip
                size='sm'
                color={getPostTypeColor() as any}
                variant='flat'
                startContent={<Icon icon={getPostIcon()} className='h-3 w-3' />}
              >
                Broadcast
              </Chip>

              {safeTopics.length > 0 && (
                <>
                  {safeTopics.slice(0, 2).map((topic) => (
                    <Chip
                      key={topic.id}
                      size='sm'
                      variant='flat'
                      startContent={topic.icon ? <Icon icon={topic.icon} className='h-3 w-3 text-white' /> : undefined}
                      style={{ 
                        backgroundColor: topic.color || '#6366f1',
                        color: 'white'
                      }}
                      className='text-white font-medium'
                    >
                      {topic.title || 'Untitled Topic'}
                    </Chip>
                  ))}
                  {safeTopics.length > 2 && (
                    <Chip size='sm' variant='bordered'>
                      +{safeTopics.length - 2} more
                    </Chip>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className='flex items-center gap-1'>
            <Tooltip content='Bookmark'>
              <Button
                isIconOnly
                size='sm'
                variant='light'
                color='default'
                onPress={() => onBookmark(post.id)}
                className='min-w-unit-8 h-unit-8'
              >
                <Icon
                  icon='solar:bookmark-linear'
                  className='h-4 w-4'
                />
              </Button>
            </Tooltip>
          </div>
        </div>
      </CardHeader>

      <CardBody className='pt-0'>
        {/* Post Title */}
        {safeTitle && (
          <h2 className='text-foreground mb-3 text-lg leading-tight font-bold'>{safeTitle}</h2>
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
        {safeMedia.length > 0 && (
          <div className='mb-4 overflow-hidden rounded-lg'>
            {safeMedia.length === 1 && (
              <div className='relative w-full'>
                <img
                  src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${safeMedia[0]}`}
                  alt={safeTitle}
                  className='w-full rounded-lg object-cover'
                  style={{
                    aspectRatio: 'auto',
                    maxHeight: '400px',
                    height: 'auto'
                  }}
                  loading='lazy'
                  onError={(e) => {
                    // Hide broken images
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                  }}
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement;
                    const aspectRatio = img.naturalWidth / img.naturalHeight;
                    
                    // Apply smart aspect ratio constraints
                    if (aspectRatio > 2.5) {
                      // Very wide images - limit height
                      img.style.aspectRatio = '2.5';
                      img.style.objectFit = 'cover';
                    } else if (aspectRatio < 0.5) {
                      // Very tall images - limit height
                      img.style.aspectRatio = '0.6';
                      img.style.objectFit = 'cover';
                    } else {
                      // Normal aspect ratios - show full image
                      img.style.aspectRatio = `${aspectRatio}`;
                      img.style.objectFit = 'contain';
                    }
                  }}
                />
              </div>
            )}
            {safeMedia.length > 1 && (
              <div className='grid grid-cols-2 gap-2'>
                {safeMedia.slice(0, 4).map((filename, index) => (
                  <div key={index} className='relative aspect-square'>
                    <img
                      src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${filename}`}
                      alt={`${safeTitle} - Image ${index + 1}`}
                      className='w-full h-full rounded-lg object-cover'
                      loading='lazy'
                      onError={(e) => {
                        // Hide broken images
                        const img = e.target as HTMLImageElement;
                        img.parentElement?.remove();
                      }}
                    />
                    {index === 3 && safeMedia.length > 4 && (
                      <div className='absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg'>
                        <span className='text-white font-semibold'>+{safeMedia.length - 4}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Skills */}
        {safeSkills.length > 0 && (
          <div className='mb-4 flex flex-wrap gap-2'>
            {safeSkills.slice(0, 5).map((skill) => (
              <Chip
                key={skill.id}
                size='sm'
                variant='flat'
                className='text-secondary-700 bg-secondary/10 hover:bg-secondary/20 cursor-pointer transition-colors'
              >
                {skill.key || 'Unknown Skill'}
              </Chip>
            ))}
            {safeSkills.length > 5 && (
              <Chip
                size='sm'
                variant='flat'
                className='text-foreground-500 bg-default/10'
              >
                +{safeSkills.length - 5} more
              </Chip>
            )}
          </div>
        )}

        <Divider className='mb-4' />

        {/* Engagement Actions */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1'>
            <Button
              size='sm'
              variant='light'
              color='default'
              startContent={
                <Icon
                  icon='solar:heart-linear'
                  className='h-4 w-4'
                />
              }
              onPress={() => onLike(post.id)}
              className='h-auto min-w-0 px-3 py-2'
            >
              Like
            </Button>

            <Button
              size='sm'
              variant='light'
              startContent={<Icon icon='solar:chat-round-linear' className='h-4 w-4' />}
              onPress={() => onComment(post.id)}
              className='h-auto min-w-0 px-3 py-2'
            >
              Comment
            </Button>

            <Button
              size='sm'
              variant='light'
              startContent={<Icon icon='solar:share-linear' className='h-4 w-4' />}
              onPress={() => onShare(post.id)}
              className='h-auto min-w-0 px-3 py-2'
            >
              Share
            </Button>
          </div>

          <div className='text-foreground-400 flex items-center gap-4 text-sm'>
            <span className='flex items-center gap-1'>
              <Icon icon='solar:calendar-linear' className='h-4 w-4' />
              {new Date(safeCreatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PostCard;
