'use client';

import React, { useState } from 'react';

import { Avatar, Button, Card, CardBody, CardHeader, Chip, Divider, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import useBasicProfile from '@root/modules/profile/hooks/use-basic-profile';
import { useTranslations } from 'next-intl';

import { getImageUrl } from '@/lib/utils/utilities';

import { useDeletePost } from '../../hooks/useBroadcasts';
import { useLinkPreviewForPost } from '../../hooks/useLinkPreviewForPost';
import { type BroadcastPost } from '../../types';
import { DeleteConfirmationModal } from '../modals/DeleteConfirmationModal';
import { PostAttachmentModal } from '../modals/PostAttachmentModal';
import { LinkPreview } from '../ui/LinkPreview';
import { CommentSection } from '../comments';
import { useSmartCountFormat } from '../../utils/timeFormatting';

// Utility functions
const formatTimeAgo = (timestamp: string, t: any): string => {
  const now = new Date();
  const postTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - postTime.getTime()) / 1000);

  if (diffInSeconds < 60) return t('post.time.now');
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return t('post.time.minutesAgo', { minutes });
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return t('post.time.hoursAgo', { hours });
  }
  const days = Math.floor(diffInSeconds / 86400);
  return t('post.time.daysAgo', { days });
};

const getFileType = (filename: string): 'image' | 'video' | 'file' => {
  const extension = filename.toLowerCase().split('.').pop() || '';
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];

  if (imageExtensions.includes(extension)) return 'image';
  if (videoExtensions.includes(extension)) return 'video';
  return 'file';
};

const getFileIcon = (filename: string): string => {
  const extension = filename.toLowerCase().split('.').pop() || '';
  const iconMap: Record<string, string> = {
    pdf: 'solar:file-text-linear',
    doc: 'solar:file-text-linear',
    docx: 'solar:file-text-linear',
    xls: 'solar:file-text-linear',
    xlsx: 'solar:file-text-linear',
    ppt: 'solar:file-text-linear',
    pptx: 'solar:file-text-linear',
    zip: 'solar:archive-linear',
    rar: 'solar:archive-linear',
    '7z': 'solar:archive-linear',
    txt: 'solar:document-linear'
  };

  return iconMap[extension] || 'solar:file-linear';
};

interface PostCardProps {
  post: BroadcastPost;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onClick?: (postId: string) => void;
  onEdit?: (post: BroadcastPost) => void;
  isLoading?: boolean;
  className?: string;
}

const PostCard: React.FC<PostCardProps> = React.memo(
  ({
    post,
    onLike,
    onBookmark,
    onComment,
    onShare,
    onClick,
    onEdit,
    isLoading = false,
    className = ''
  }) => {
    const t = useTranslations('broadcasts');
    const tComments = useTranslations('comments.stats');
    const { formatCount } = useSmartCountFormat();
    const [isExpanded, setIsExpanded] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [showComments, setShowComments] = useState(false);

    // Get current user profile
    const { profile: currentUser } = useBasicProfile();
    const deletePost = useDeletePost();

    // Get link previews for post content and dedicated link
    const { linkPreviews } = useLinkPreviewForPost(post.description || '', post.link);

    // Safety checks for post data
    if (!post || !post.id) {
      return null;
    }

    const {
      safeDescription,
      safeTitle,
      safeOwner,
      safeTopics,
      safeSkills,
      safeAttachments,
      safeCreatedAt,
      shouldTruncate,
      displayContent,
      postIcon,
      postTypeColor
    } = React.useMemo(() => {
      const safeDescription = post.description || '';
      const safeTitle = post.title || t('fallbacks.untitledPost');
      const safeOwner = post.owner || {
        firstName: t('fallbacks.unknownUser'),
        lastName: '',
        profileImage: null,
        userName: null,
        isMailVerified: false
      };
      const safeTopics = post.topics || [];
      const safeSkills = post.skills || [];
      const safeAttachments = post.attachments || post.media || [];
      const safeCreatedAt = post.createdAt || new Date().toISOString();

      const shouldTruncate = safeDescription.length > 280;
      const displayContent =
        isExpanded || !shouldTruncate ? safeDescription : `${safeDescription.substring(0, 280)}...`;

      const postIcon =
        safeAttachments.length > 0 ? 'solar:gallery-linear' : 'solar:broadcast-linear';
      const postTypeColor = 'primary';

      return {
        safeDescription,
        safeTitle,
        safeOwner,
        safeTopics,
        safeSkills,
        safeAttachments,
        safeCreatedAt,
        shouldTruncate,
        displayContent,
        postIcon,
        postTypeColor
      };
    }, [post, isExpanded]);

    // Handle image click to open modal
    const handleImageClick = (imageIndex: number) => {
      setModalIndex(imageIndex);
      setModalOpen(true);
    };

    // Get only images for the modal
    const imageAttachments = React.useMemo(
      () => safeAttachments.filter((file) => getFileType(file) === 'image'),
      [safeAttachments]
    );

    // Check if current user owns this post
    const isOwnPost = React.useMemo(() => {
      return currentUser?.id === safeOwner.id;
    }, [currentUser?.id, safeOwner.id]);

    // Handle delete post
    const handleDeletePost = React.useCallback(() => {
      setDeleteModalOpen(true);
    }, []);

    // Handle delete confirmation
    const handleConfirmDelete = React.useCallback(() => {
      deletePost.mutate(post.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
        },
        onError: () => {
          setDeleteModalOpen(false);
        }
      });
    }, [deletePost, post.id]);

    // Handle edit post
    const handleEditPost = React.useCallback(() => {
      onEdit?.(post);
    }, [onEdit, post]);

    return (
      <>
        <PostAttachmentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          attachments={imageAttachments}
          currentIndex={modalIndex}
          onIndexChange={setModalIndex}
          postTitle={safeTitle}
        />

        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          isLoading={deletePost.isPending}
          title={t('post.delete.title')}
          description={t('post.delete.description', { title: safeTitle })}
        />

        <Card
          className={`border-divider/50 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
          role='article'
          aria-label={`Post by ${safeOwner.firstName} ${safeOwner.lastName}: ${safeTitle}`}
        >
          <CardHeader className='pb-3'>
            <div className='flex w-full items-start gap-3'>
              {/* Author Avatar */}
              <div className='relative'>
                <Avatar
                  src={safeOwner.profileImage ? getImageUrl(safeOwner.profileImage) : undefined}
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
                  <time
                    className='text-foreground-500 text-sm'
                    dateTime={safeCreatedAt}
                    title={new Date(safeCreatedAt).toLocaleString()}
                  >
                    {formatTimeAgo(safeCreatedAt, t)}
                  </time>
                </div>

                <div className='mt-1 flex flex-wrap items-center gap-2'>
                  <Chip
                    size='sm'
                    color={postTypeColor as any}
                    variant='flat'
                    startContent={<Icon icon={postIcon} className='h-3 w-3' />}
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
                          startContent={
                            topic.icon ? (
                              <Icon icon={topic.icon} className='h-3 w-3 text-white' />
                            ) : undefined
                          }
                          style={{
                            backgroundColor: topic.color || '#6366f1',
                            color: 'white'
                          }}
                          className='font-medium text-white'
                        >
                          {topic.title || t('fallbacks.untitledTopic')}
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
                {isOwnPost ? (
                  // Edit/Delete actions for own posts
                  <>
                    <Tooltip content={t('tooltips.editPost')}>
                      <Button
                        isIconOnly
                        size='sm'
                        variant='light'
                        color='primary'
                        onPress={handleEditPost}
                        className='min-w-unit-8 h-unit-8'
                      >
                        <Icon icon='solar:pen-linear' className='h-4 w-4' />
                      </Button>
                    </Tooltip>
                    <Tooltip content={t('tooltips.deletePost')}>
                      <Button
                        isIconOnly
                        size='sm'
                        variant='light'
                        color='danger'
                        onPress={handleDeletePost}
                        className='min-w-unit-8 h-unit-8'
                      >
                        <Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' />
                      </Button>
                    </Tooltip>
                  </>
                ) : (
                  // Bookmark action for other posts
                  <Tooltip content={t('tooltips.bookmark')}>
                    <Button
                      isIconOnly
                      size='sm'
                      variant='light'
                      color='default'
                      onPress={() => onBookmark(post.id)}
                      className='min-w-unit-8 h-unit-8'
                    >
                      <Icon icon='solar:bookmark-linear' className='h-4 w-4' />
                    </Button>
                  </Tooltip>
                )}
              </div>
            </div>
          </CardHeader>

          <CardBody className='pt-0'>
            {/* Post Title */}
            {safeTitle && (
              <h2
                className='text-foreground mb-3 text-lg leading-tight font-bold'
                id={`post-title-${post.id}`}
              >
                {safeTitle}
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
                  {isExpanded ? t('content.expandText.showLess') : t('content.expandText.showMore')}
                </Button>
              )}
            </div>

            {/* Link Previews */}
            {linkPreviews.length > 0 && (
              <div className='mb-4 w-full space-y-3'>
                {linkPreviews.map((linkMetadata) => (
                  <LinkPreview
                    key={linkMetadata.url}
                    metadata={linkMetadata}
                    showRemoveButton={false}
                    compact={false}
                  />
                ))}
              </div>
            )}

            {/* Attachments Content */}
            {safeAttachments.length > 0 && (
              <div className='mb-4 overflow-hidden rounded-lg'>
                {(() => {
                  const images = safeAttachments.filter((file) => getFileType(file) === 'image');
                  const videos = safeAttachments.filter((file) => getFileType(file) === 'video');
                  const files = safeAttachments.filter((file) => getFileType(file) === 'file');

                  return (
                    <div className='space-y-3'>
                      {/* Images */}
                      {images.length > 0 && (
                        <div>
                          {images.length === 1 && (
                            <div
                              className='group relative w-full cursor-pointer'
                              onClick={() => handleImageClick(0)}
                            >
                              <img
                                src={`https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:wingman/public/${images[0]}`}
                                alt={safeTitle}
                                className='w-full rounded-lg object-cover transition-transform group-hover:scale-[1.02]'
                                style={{
                                  aspectRatio: 'auto',
                                  maxHeight: '400px',
                                  height: 'auto'
                                }}
                                loading='lazy'
                                onError={(e) => {
                                  const img = e.target as HTMLImageElement;
                                  img.style.display = 'none';
                                }}
                                onLoad={(e) => {
                                  const img = e.target as HTMLImageElement;
                                  const aspectRatio = img.naturalWidth / img.naturalHeight;

                                  if (aspectRatio > 2.5) {
                                    img.style.aspectRatio = '2.5';
                                    img.style.objectFit = 'cover';
                                  } else if (aspectRatio < 0.5) {
                                    img.style.aspectRatio = '0.6';
                                    img.style.objectFit = 'cover';
                                  } else {
                                    img.style.aspectRatio = `${aspectRatio}`;
                                    img.style.objectFit = 'contain';
                                  }
                                }}
                              />
                              {/* Hover overlay */}
                              <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-colors group-hover:bg-black/10'>
                                <div className='rounded-full bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100'>
                                  <Icon icon='solar:eye-bold' className='h-4 w-4 text-white' />
                                </div>
                              </div>
                            </div>
                          )}
                          {images.length > 1 && (
                            <div className='grid grid-cols-2 gap-2'>
                              {images.slice(0, 4).map((filename, index) => (
                                <div
                                  key={index}
                                  className='group relative aspect-square cursor-pointer'
                                  onClick={() => handleImageClick(index)}
                                >
                                  <img
                                    src={`https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:wingman/public/${filename}`}
                                    alt={`${safeTitle} - Image ${index + 1}`}
                                    className='h-full w-full rounded-lg object-cover transition-transform group-hover:scale-[1.02]'
                                    loading='lazy'
                                    onError={(e) => {
                                      const img = e.target as HTMLImageElement;
                                      img.parentElement?.remove();
                                    }}
                                  />
                                  {/* Hover overlay */}
                                  <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-colors group-hover:bg-black/20'>
                                    <div className='rounded-full bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100'>
                                      <Icon icon='solar:eye-bold' className='h-3 w-3 text-white' />
                                    </div>
                                  </div>
                                  {index === 3 && images.length > 4 && (
                                    <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-black/50'>
                                      <span className='font-semibold text-white'>
                                        +{images.length - 4}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Videos */}
                      {videos.length > 0 && (
                        <div className='space-y-2'>
                          {videos.map((filename, index) => (
                            <div key={index} className='relative w-full'>
                              <video
                                src={`https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:wingman/public/${filename}`}
                                className='w-full rounded-lg'
                                controls
                                preload='metadata'
                                style={{
                                  maxHeight: '400px',
                                  height: 'auto'
                                }}
                                onError={(e) => {
                                  const video = e.target as HTMLVideoElement;
                                  video.style.display = 'none';
                                }}
                              >
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Files */}
                      {files.length > 0 && (
                        <div className='space-y-2'>
                          {files.map((filename, index) => (
                            <div
                              key={index}
                              className='bg-default-100 flex items-center rounded-lg p-3'
                            >
                              <Icon
                                icon={getFileIcon(filename)}
                                className='text-default-500 mr-3 h-6 w-6'
                              />
                              <div className='min-w-0 flex-1'>
                                <p className='text-foreground truncate text-sm font-medium'>
                                  {filename.split('/').pop()}
                                </p>
                                <p className='text-foreground-500 text-xs'>
                                  {filename.toLowerCase().split('.').pop()?.toUpperCase()} file
                                </p>
                              </div>
                              <Button
                                as='a'
                                href={`https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:wingman/public/${filename}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                download
                                size='sm'
                                variant='flat'
                                color='primary'
                                className='ml-3'
                              >
                                <Icon icon='solar:download-linear' className='h-4 w-4' />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
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
                    {skill.key || t('fallbacks.unknownSkill')}
                  </Chip>
                ))}
                {safeSkills.length > 5 && (
                  <Chip size='sm' variant='flat' className='text-foreground-500 bg-default/10'>
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
                    <Icon icon='solar:heart-linear' className='h-4 w-4' aria-hidden='true' />
                  }
                  onPress={() => onLike(post.id)}
                  className='h-auto min-w-0 px-3 py-2'
                  aria-label={`Like post by ${safeOwner.firstName} ${safeOwner.lastName}`}
                >
                  Like
                </Button>

                <Button
                  size='sm'
                  variant={showComments ? 'flat' : 'light'}
                  color={showComments ? 'primary' : 'default'}
                  startContent={
                    <Icon 
                      icon={showComments ? 'solar:chat-round-dots-bold' : 'solar:chat-round-linear'} 
                      className='h-4 w-4' 
                      aria-hidden='true' 
                    />
                  }
                  onPress={() => setShowComments(!showComments)}
                  className='h-auto min-w-0 px-3 py-2 transition-all duration-200'
                  aria-label={`${showComments ? 'Hide' : 'Show'} comments on post by ${safeOwner.firstName} ${safeOwner.lastName}`}
                >
                  {showComments ? 'Hide Comments' : 'Comments'}
                  {(post.replyCount || post.commentsCount || 0) > 0 && (
                    <span className='text-foreground-500 ml-1 text-xs'>
                      ({formatCount(post.replyCount || post.commentsCount || 0)})
                    </span>
                  )}
                </Button>

                <Button
                  size='sm'
                  variant='light'
                  startContent={
                    <Icon icon='solar:share-linear' className='h-4 w-4' aria-hidden='true' />
                  }
                  onPress={() => onShare(post.id)}
                  className='h-auto min-w-0 px-3 py-2'
                  aria-label={`Share post by ${safeOwner.firstName} ${safeOwner.lastName}`}
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

            {/* Comments Section */}
            {showComments && (
              <div className='mt-6 border-default-200 border-t pt-6'>
                <CommentSection
                  postId={post.id}
                  totalComments={post.replyCount || post.commentsCount || 0}
                  maxDepth={3}
                  enableMentions={true}
                  enableRichText={false}
                  className='w-full'
                />
              </div>
            )}
          </CardBody>
        </Card>
      </>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for memo optimization
    return (
      prevProps.post.id === nextProps.post.id &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.className === nextProps.className &&
      // Check if post content has changed
      JSON.stringify(prevProps.post) === JSON.stringify(nextProps.post)
    );
  }
);

export default PostCard;
