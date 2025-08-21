'use client';

import React, { useState, useEffect } from 'react';

import { Button, Card, CardBody, CardHeader, Chip, Divider, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import useBasicProfile from '@root/modules/profile/hooks/use-basic-profile';
import { useTranslations } from 'next-intl';

import { getImageUrl } from '@/lib/utils/utilities';

import { useDeletePost } from '../../hooks/useBroadcasts';
import { useLinkPreviewForPost } from '../../hooks/useLinkPreviewForPost';
import { type BroadcastPost } from '../../types';
import { useSmartCountFormat, useSmartTimeFormat } from '../../utils/timeFormatting';
import { CommentSection } from '../comments';
import { DeleteConfirmationModal } from '../modals/DeleteConfirmationModal';
import { PostAttachmentModal } from '../modals/PostAttachmentModal';
import { ShareModal } from '../modals/ShareModal';
import { LinkPreview } from '../ui/LinkPreview';
import OptimizedImage from '../ui/OptimizedImage';
import OptimizedVideo from '../ui/OptimizedVideo';


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
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onUpvote: (postId: string, isCurrentlyUpvoted: boolean) => void;
  onSave: (postId: string, isCurrentlySaved: boolean) => void;
  onClick?: (postId: string) => void;
  onEdit?: (post: BroadcastPost) => void;
  isLoading?: boolean;
  className?: string;
}

const PostCard: React.FC<PostCardProps> = React.memo(
  ({
    post,
    onComment,
    onShare,
    onUpvote,
    onSave,
    onClick,
    onEdit,
    isLoading = false,
    className = ''
  }) => {
    const t = useTranslations('broadcasts');
    const tComments = useTranslations('comments.stats');
    const { formatCount } = useSmartCountFormat();
    const { formatTimeAgo } = useSmartTimeFormat();
    const [isExpanded, setIsExpanded] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [localIsSaved, setLocalIsSaved] = useState(post.isSaved || false);
    const [showComments, setShowComments] = useState(false);

    // Update local state when post.isSaved changes
    useEffect(() => {
      setLocalIsSaved(post.isSaved || false);
    }, [post.isSaved]);

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

    // Memoize file type filtering for better performance
    const { imageAttachments, videoAttachments, fileAttachments } = React.useMemo(() => {
      const images = safeAttachments.filter((file) => getFileType(file) === 'image');
      const videos = safeAttachments.filter((file) => getFileType(file) === 'video');
      const files = safeAttachments.filter((file) => getFileType(file) === 'file');
      
      return {
        imageAttachments: images,
        videoAttachments: videos,
        fileAttachments: files
      };
    }, [safeAttachments]);

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

        <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} post={post} />

        <Card
          className={`border-default-200/50 bg-content1/80 rounded-[12px] sm:rounded-[20px] shadow-[0px_4px_16px_rgba(0,0,0,0.06)] sm:shadow-[0px_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.10)] sm:hover:shadow-[0px_16px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:border-primary/20 ${className}`}
          role='article'
          aria-label={`Post by ${safeOwner.firstName} ${safeOwner.lastName}: ${safeTitle}`}
        >
          <CardHeader className='pb-3 sm:pb-4'>
            <div className='flex w-full items-start gap-3 sm:gap-4'>
              {/* Author Avatar */}
              <div className='relative'>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-1 sm:ring-2 ring-primary/10 ring-offset-1 sm:ring-offset-2 ring-offset-background transition-all duration-200 hover:ring-primary/25">
                  {safeOwner.profileImage ? (
                    <OptimizedImage
                      src={getImageUrl(safeOwner.profileImage)}
                      alt={`${safeOwner.firstName} ${safeOwner.lastName}`}
                      fill
                      className="object-cover"
                      sizes="40px"
                      priority={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {`${safeOwner.firstName[0]}${safeOwner.lastName[0]}`}
                    </div>
                  )}
                </div>
                {safeOwner.isMailVerified && (
                  <div className='bg-success absolute -right-0.5 -bottom-0.5 sm:-right-1 sm:-bottom-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full border-1 sm:border-2 border-background shadow-sm'>
                    <Icon icon='solar:shield-check-bold' className='h-2 w-2 sm:h-3 sm:w-3 text-white' />
                  </div>
                )}
              </div>

              {/* Author Info & Post Metadata */}
              <div className='min-w-0 flex-1'>
                <div className='flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1'>
                  <h3 className='text-foreground truncate font-semibold text-sm sm:text-base'>
                    {safeOwner.firstName} {safeOwner.lastName}
                  </h3>
                  {safeOwner.userName && (
                    <span className='text-foreground-500 text-xs sm:text-sm'>@{safeOwner.userName}</span>
                  )}
                  <span className='text-foreground-400 text-xs sm:text-sm'>·</span>
                  <time
                    className='text-foreground-500 text-xs sm:text-sm'
                    dateTime={safeCreatedAt}
                    title={new Date(safeCreatedAt).toLocaleString()}
                  >
                    {formatTimeAgo(safeCreatedAt)}
                  </time>
                </div>

                <div className='flex flex-wrap items-center gap-1.5 sm:gap-2'>
                  <Chip
                    size='sm'
                    color={postTypeColor as any}
                    variant='flat'
                    startContent={<Icon icon='solar:chat-dots-linear' className='h-3 w-3' />}
                    className='font-medium bg-primary/10 text-primary border-primary/20'
                  >
                    {t('post.actions.broadcast')}
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
                          className='font-medium text-white shadow-sm'
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
                        className='min-w-unit-6 h-unit-6 sm:min-w-unit-8 sm:h-unit-8'
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
                        className='min-w-unit-6 h-unit-6 sm:min-w-unit-8 sm:h-unit-8'
                      >
                        <Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' />
                      </Button>
                    </Tooltip>
                  </>
                ) : (
                  // Save action for other posts
                  <Tooltip content={localIsSaved ? t('tooltips.unsave') : t('tooltips.save')}>
                    <Button
                      isIconOnly
                      size='sm'
                      variant='light'
                      color={localIsSaved ? 'primary' : 'default'}
                      onPress={() => {
                        // Toggle local state immediately
                        setLocalIsSaved(!localIsSaved);
                        // Call the save function
                        onSave(post.id, localIsSaved);
                      }}
                      className='min-w-unit-6 h-unit-6 sm:min-w-unit-8 sm:h-unit-8'
                    >
                      <Icon 
                        icon={localIsSaved ? 'solar:archive-bold' : 'solar:archive-linear'} 
                        className='h-4 w-4' 
                      />
                    </Button>
                  </Tooltip>
                )}
              </div>
            </div>
          </CardHeader>

          <CardBody className='pt-0 pb-4 sm:pb-6'>
            {/* Post Title */}
            {safeTitle && (
              <h2
                className='text-foreground mb-3 sm:mb-4 text-lg sm:text-xl leading-tight font-bold tracking-tight'
                id={`post-title-${post.id}`}
              >
                {safeTitle}
              </h2>
            )}

            {/* Post Content */}
            <div className='text-foreground-700 mb-4 sm:mb-5 leading-relaxed text-sm sm:text-base'>
              {displayContent}
              {shouldTruncate && (
                <Button
                  size='sm'
                  variant='light'
                  onPress={() => setIsExpanded(!isExpanded)}
                  className='text-primary ml-2 h-auto min-w-0 p-0 font-medium hover:text-primary-600 transition-colors'
                >
                  {isExpanded ? t('content.expandText.showLess') : t('content.expandText.showMore')}
                </Button>
              )}
            </div>

            {/* Link Previews */}
            {linkPreviews.length > 0 && (
              <div className='mb-5 w-full space-y-3'>
                {linkPreviews.map((linkMetadata, index) => (
                  <LinkPreview
                    key={`${post.id}-${linkMetadata.url}-${index}`}
                    metadata={linkMetadata}
                    showRemoveButton={false}
                    compact={false}
                  />
                ))}
              </div>
            )}

            {/* Attachments Content */}
            {safeAttachments.length > 0 && (
              <div className='mb-5'>
                {(() => {
                  const images = imageAttachments;
                  const videos = videoAttachments;
                  const files = fileAttachments;

                  return (
                    <div className='space-y-3'>
                      {/* Images - Simplified for now */}
                      {images.length > 0 && (
                        <div className="space-y-2">
                          {images.slice(0, 4).map((filename, index) => (
                            <div key={filename} className="relative w-full h-64 overflow-hidden rounded-lg">
                              <OptimizedImage
                                src={`https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:wingman/public/${filename}`}
                                alt={`${safeTitle} - Image ${index + 1}`}
                                className="cursor-pointer hover:scale-[1.02] transition-transform object-cover"
                                fill={true}
                                onClick={() => handleImageClick(index)}
                                priority={false}
                              loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Optimized Videos */}
                      {videos.length > 0 && (
                        <div className='space-y-2'>
                          {videos.map((filename, index) => (
                            <OptimizedVideo
                              key={filename}
                              src={`https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:wingman/public/${filename}`}
                              className="w-full"
                              style={{ maxHeight: '360px' }}
                              controls={true}
                              preload="metadata"
                              muted={true}
                            />
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
                                <Icon icon='solar:download-minimalistic-linear' className='h-4 w-4' />
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
              <div className='mb-4 sm:mb-5 flex flex-wrap gap-1.5 sm:gap-2'>
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

            <Divider className='mb-4 sm:mb-5' />

            {/* Engagement Actions */}
            <div className='flex items-center justify-between pt-1'>
              <div className='flex items-center gap-1 sm:gap-2'>
                <Button
                  size='sm'
                  variant={post.isUpvoted === true ? 'flat' : 'light'}
                  color={post.isUpvoted === true ? 'success' : 'default'}
                  startContent={
                    <Icon
                      icon={
                        post.isUpvoted === true ? 'solar:like-bold' : 'solar:like-linear'
                      }
                      className='h-4 w-4'
                      aria-hidden='true'
                    />
                  }
                  onPress={() => onUpvote(post.id, post.isUpvoted === true)}
                  className={`h-8 sm:h-9 min-w-0 px-2 sm:px-3 py-1.5 sm:py-2 font-medium rounded-[8px] sm:rounded-[12px] transition-all duration-200 hover:scale-105 active:scale-95 ${
                    post.isUpvoted === true
                      ? 'bg-success/10 text-success border-success/20 hover:bg-success/20 hover:shadow-sm'
                      : 'hover:bg-default-100 hover:shadow-sm'
                  }`}
                  aria-label={`${post.isUpvoted === true ? 'Remove upvote from' : 'Upvote'} post by ${safeOwner.firstName} ${safeOwner.lastName}`}
                >
                  <span className='hidden sm:inline'>
                    {post.isUpvoted === true ? t('post.actions.upvoted') : t('post.actions.upvote')}
                  </span>
                  {(post.upvotes || 0) > 0 && (
                    <span className='text-foreground-500 ml-0 sm:ml-1 text-xs'>
                      ({formatCount(post.upvotes || 0)})
                    </span>
                  )}
                </Button>

                <Button
                  size='sm'
                  variant={showComments ? 'flat' : 'light'}
                  color={showComments ? 'primary' : 'default'}
                  startContent={
                    <Icon
                      icon={showComments ? 'solar:chat-round-dots-bold' : 'solar:chat-round-dots-linear'}
                      className='h-4 w-4'
                      aria-hidden='true'
                    />
                  }
                  onPress={() => setShowComments(!showComments)}
                  className={`h-8 sm:h-9 min-w-0 px-2 sm:px-3 py-1.5 sm:py-2 font-medium rounded-[8px] sm:rounded-[12px] transition-all duration-200 hover:scale-105 active:scale-95 ${
                    showComments
                      ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:shadow-sm'
                      : 'hover:bg-default-100 hover:shadow-sm'
                  }`}
                  aria-label={`${showComments ? 'Hide' : 'Show'} comments on post by ${safeOwner.firstName} ${safeOwner.lastName}`}
                >
                  <span className='hidden sm:inline'>
                    {showComments ? t('post.actions.hideComments') : t('post.actions.comments')}
                  </span>
                  {(post.replyCount || post.commentsCount || 0) > 0 && (
                    <span className='text-foreground-500 ml-0 sm:ml-1 text-xs'>
                      ({formatCount(post.replyCount || post.commentsCount || 0)})
                    </span>
                  )}
                </Button>

                <Button
                  size='sm'
                  variant='light'
                  startContent={
                    <Icon icon='solar:export-linear' className='h-4 w-4' aria-hidden='true' />
                  }
                  onPress={() => setShareModalOpen(true)}
                  className='h-8 sm:h-9 min-w-0 px-2 sm:px-3 py-1.5 sm:py-2 font-medium rounded-[8px] sm:rounded-[12px] transition-all duration-200 hover:bg-default-100 hover:shadow-sm hover:scale-105 active:scale-95'
                  aria-label={`Share post by ${safeOwner.firstName} ${safeOwner.lastName}`}
                >
                  <span className='hidden sm:inline'>
                    {t('post.actions.share')}
                  </span>
                </Button>
              </div>

              <div className='flex items-center gap-2'>
                <Button
                  size='sm'
                  variant='light'
                  isIconOnly
                  startContent={
                    <Icon
                      icon={localIsSaved ? 'solar:bookmark-bold' : 'solar:bookmark-linear'}
                      className={`h-4 w-4 ${localIsSaved ? 'text-warning' : ''}`}
                      aria-hidden='true'
                    />
                  }
                  onPress={() => onSave(post.id, localIsSaved)}
                  className={`h-9 w-9 rounded-[12px] transition-all duration-200 hover:scale-110 active:scale-95 ${
                    localIsSaved
                      ? 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20 hover:shadow-sm'
                      : 'hover:bg-default-100 hover:shadow-sm'
                  }`}
                  aria-label={`${localIsSaved ? 'Remove from saved' : 'Save'} post by ${safeOwner.firstName} ${safeOwner.lastName}`}
                />

                <div className='text-foreground-400 flex items-center gap-1 text-sm'>
                  <Icon icon='solar:calendar-minimalistic-linear' className='h-4 w-4' />
                  <time dateTime={safeCreatedAt} title={new Date(safeCreatedAt).toLocaleString()}>
                    {new Date(safeCreatedAt).toLocaleDateString()}
                  </time>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className='border-default-200 mt-6 border-t pt-6'>
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
    // Optimized comparison - check only fields that affect rendering
    const prevPost = prevProps.post;
    const nextPost = nextProps.post;
    
    return (
      prevPost.id === nextPost.id &&
      prevPost.upvotes === nextPost.upvotes &&
      prevPost.isUpvoted === nextPost.isUpvoted &&
      prevPost.isSaved === nextPost.isSaved &&
      prevPost.replyCount === nextPost.replyCount &&
      prevPost.commentsCount === nextPost.commentsCount &&
      prevPost.title === nextPost.title &&
      prevPost.description === nextPost.description &&
      prevPost.createdAt === nextPost.createdAt &&
      prevPost.attachments?.length === nextPost.attachments?.length &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.className === nextProps.className
    );
  }
);

export default PostCard;
