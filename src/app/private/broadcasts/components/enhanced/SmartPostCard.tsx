'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Textarea,
  useDisclosure
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { BroadcastPost, Comment } from '../../types';

interface SmartPostCardProps {
  post: BroadcastPost;
  layout: 'card' | 'compact' | 'magazine';
  onEngagement: (postId: string, action: string) => void;
  showImages: boolean;
  autoPlay: boolean;
  onShare?: (postId: string, platform: string) => void;
  onComment?: (postId: string, comment: string, parentId?: string) => void;
  onVoteComment?: (postId: string, commentId: string, vote: 'up' | 'down', parentId?: string) => void;
  className?: string;
}

const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const getPostIcon = (type: string) => {
  switch (type) {
    case 'video':
      return 'solar:videocamera-record-linear';
    case 'image':
      return 'solar:gallery-linear';
    case 'gallery':
      return 'solar:gallery-minimalistic-linear';
    case 'article':
      return 'solar:document-text-linear';
    case 'poll':
      return 'solar:chart-2-linear';
    case 'quote':
      return 'solar:quote-down-linear';
    case 'link':
      return 'solar:link-linear';
    default:
      return 'solar:document-text-linear';
  }
};

const getPostColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'danger';
    case 'normal':
      return 'primary';
    case 'low':
      return 'default';
    default:
      return 'primary';
  }
};

// Video Player Component
const VideoPlayer: React.FC<{
  media: BroadcastPost['media'];
  autoPlay: boolean;
  isShort?: boolean;
}> = ({ media, autoPlay, isShort }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!media) return null;

  return (
    <div className={`relative bg-black ${isShort ? 'aspect-[9/16] max-h-[600px]' : 'aspect-video'} overflow-hidden rounded-lg`}>
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        poster={media.thumbnail}
        muted={isMuted}
        loop
        playsInline
        autoPlay={autoPlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={Array.isArray(media.url) ? media.url[0] : media.url} type="video/mp4" />
      </video>

      {/* Video Controls */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
        <Button
          isIconOnly
          color="primary"
          variant="shadow"
          size="lg"
          className="bg-black/60 backdrop-blur-sm"
          onPress={handlePlayToggle}
        >
          <Icon
            icon={isPlaying ? 'solar:pause-bold' : 'solar:play-bold'}
            className="h-8 w-8 text-white"
          />
        </Button>
      </div>

      {/* Video Info */}
      <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
        {media.duration && (
          <div className="rounded bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
            {media.duration}
          </div>
        )}
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          className="bg-black/60 text-white backdrop-blur-sm"
          onPress={handleMuteToggle}
        >
          <Icon icon={isMuted ? 'solar:volume-cross-linear' : 'solar:volume-loud-linear'} className="h-4 w-4" />
        </Button>
      </div>

      {isShort && (
        <div className="absolute top-2 right-2">
          <Chip size="sm" color="warning" variant="shadow">
            <Icon icon="solar:video-frame-play-vertical-linear" className="h-3 w-3 mr-1" />
            Short
          </Chip>
        </div>
      )}
    </div>
  );
};

// Gallery Component
const ImageGallery: React.FC<{
  images: string[];
  title: string;
}> = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const getGridClass = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-2';
    return 'grid-cols-2';
  };

  return (
    <>
      <div className={`grid gap-2 ${getGridClass(images.length)} aspect-video rounded-lg overflow-hidden`}>
        {images.slice(0, 4).map((image, index) => (
          <div
            key={index}
            className={`relative cursor-pointer overflow-hidden ${
              images.length === 3 && index === 0 ? 'row-span-2' : ''
            }`}
            onClick={() => {
              setSelectedImage(index);
              onOpen();
            }}
          >
            <Image
              src={image}
              alt={`${title} - Image ${index + 1}`}
              className="h-full w-full object-cover hover:scale-105 transition-transform"
              removeWrapper
            />
            {index === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-xl font-bold">+{images.length - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Gallery Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-between items-center">
                <span>{title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground-500">{selectedImage + 1} of {images.length}</span>
                </div>
              </ModalHeader>
              <ModalBody className="p-0">
                <div className="relative aspect-video bg-black">
                  <Image
                    src={images[selectedImage]}
                    alt={`${title} - Image ${selectedImage + 1}`}
                    className="h-full w-full object-contain"
                    removeWrapper
                  />
                  {images.length > 1 && (
                    <>
                      <Button
                        isIconOnly
                        variant="flat"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white"
                        onPress={() => setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)}
                      >
                        <Icon icon="solar:alt-arrow-left-linear" className="h-6 w-6" />
                      </Button>
                      <Button
                        isIconOnly
                        variant="flat"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white"
                        onPress={() => setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)}
                      >
                        <Icon icon="solar:alt-arrow-right-linear" className="h-6 w-6" />
                      </Button>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 ${
                          index === selectedImage ? 'border-primary' : 'border-transparent'
                        }`}
                        onClick={() => setSelectedImage(index)}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="h-16 w-24 object-cover"
                          removeWrapper
                        />
                      </div>
                    ))}
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

// Poll Component
const PollWidget: React.FC<{
  poll: BroadcastPost['poll'];
  onVote: (optionId: string) => void;
}> = ({ poll, onVote }) => {
  if (!poll) return null;

  return (
    <div className="space-y-3 p-4 bg-default-50 rounded-lg">
      <h4 className="font-medium text-foreground">{poll.question}</h4>
      <div className="space-y-2">
        {poll.options.map((option) => (
          <button
            key={option.id}
            onClick={() => !poll.userVoted && onVote(option.id)}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              poll.userVoted === option.id
                ? 'border-primary bg-primary/10'
                : poll.userVoted
                ? 'border-default-200 bg-default-50 cursor-not-allowed'
                : 'border-default-200 hover:border-primary hover:bg-default-100'
            }`}
            disabled={!!poll.userVoted}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{option.text}</span>
              {poll.userVoted && (
                <span className="text-sm text-foreground-500">{option.percentage}%</span>
              )}
            </div>
            {poll.userVoted && (
              <Progress 
                value={option.percentage} 
                color={poll.userVoted === option.id ? 'primary' : 'default'}
                size="sm"
              />
            )}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm text-foreground-500">
        <span>{formatCount(poll.totalVotes)} votes</span>
        {poll.endsAt && <span>Ends {poll.endsAt}</span>}
      </div>
    </div>
  );
};

// Link Preview Component
const LinkPreview: React.FC<{
  link: BroadcastPost['link'];
}> = ({ link }) => {
  if (!link) return null;

  return (
    <Link href={link.url} target="_blank" className="block">
      <Card className="border-default-200 hover:border-primary transition-colors">
        <CardBody className="p-0">
          <div className="flex">
            {link.image && (
              <div className="w-24 h-24 flex-shrink-0">
                <Image
                  src={link.image}
                  alt={link.title}
                  className="h-full w-full object-cover"
                  removeWrapper
                />
              </div>
            )}
            <div className="flex-1 p-3">
              <div className="text-xs text-primary mb-1">{link.domain}</div>
              <h4 className="text-sm font-medium line-clamp-2 mb-1">{link.title}</h4>
              <p className="text-xs text-foreground-500 line-clamp-2">{link.description}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
};

// Comment Component
const CommentItem: React.FC<{
  comment: Comment;
  postId: string;
  onVote: (commentId: string, vote: 'up' | 'down', parentId?: string) => void;
  onReply: (parentId: string) => void;
  isReply?: boolean;
  parentId?: string;
}> = ({ comment, postId, onVote, onReply, isReply = false, parentId }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleVote = (vote: 'up' | 'down') => {
    onVote(comment.id, vote, parentId);
  };

  const score = comment.votes.upvotes - comment.votes.downvotes;

  return (
    <div className={`${isReply ? 'ml-8 pl-4 border-l-2 border-default-200' : ''}`}>
      <div className="flex gap-3">
        <Avatar src={comment.author.avatar} size="sm" className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <Card className="border-default-200">
            <CardBody className="p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {comment.author.name}
                  </span>
                  {comment.author.verified && (
                    <Icon icon="solar:verified-check-bold" className="h-3 w-3 text-primary" />
                  )}
                  {comment.isAuthor && (
                    <Chip size="sm" color="primary" variant="flat" className="h-4 text-xs">
                      Author
                    </Chip>
                  )}
                  {comment.isPinned && (
                    <Chip size="sm" color="warning" variant="flat" className="h-4 text-xs">
                      Pinned
                    </Chip>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground-500">
                  <span>{comment.timestamp}</span>
                  {comment.isEdited && <span>(edited)</span>}
                </div>
              </div>
              <p className="text-sm text-foreground mb-3">{comment.content}</p>
              <div className="flex items-center gap-4">
                {/* Vote buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleVote('up')}
                    className={`flex items-center gap-1 text-xs transition-colors p-1 rounded ${
                      comment.votes.userVote === 'up' 
                        ? 'text-success bg-success/10' 
                        : 'text-foreground-500 hover:text-success hover:bg-success/10'
                    }`}
                  >
                    <Icon icon="solar:arrow-up-linear" className="h-3 w-3" />
                  </button>
                  <span className={`text-xs font-medium px-1 ${score > 0 ? 'text-success' : score < 0 ? 'text-danger' : 'text-foreground-500'}`}>
                    {score}
                  </span>
                  <button
                    onClick={() => handleVote('down')}
                    className={`flex items-center gap-1 text-xs transition-colors p-1 rounded ${
                      comment.votes.userVote === 'down' 
                        ? 'text-danger bg-danger/10' 
                        : 'text-foreground-500 hover:text-danger hover:bg-danger/10'
                    }`}
                  >
                    <Icon icon="solar:arrow-down-linear" className="h-3 w-3" />
                  </button>
                </div>
                {!isReply && (
                  <button
                    onClick={() => setShowReplyInput(true)}
                    className="text-xs text-foreground-500 hover:text-primary transition-colors"
                  >
                    Reply
                  </button>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Reply input */}
          {showReplyInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 ml-4 pl-4 border-l-2 border-default-200"
            >
              <div className="flex gap-2">
                <Avatar size="sm" src="https://i.pravatar.cc/150?img=9" />
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder={`Reply to ${comment.author.name}...`}
                    value={replyContent}
                    onValueChange={setReplyContent}
                    minRows={1}
                    maxRows={3}
                    size="sm"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => {
                        setShowReplyInput(false);
                        setReplyContent('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      color="primary"
                      onPress={() => {
                        onReply(comment.id);
                        setShowReplyInput(false);
                        setReplyContent('');
                      }}
                      isDisabled={!replyContent.trim()}
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  onVote={onVote}
                  onReply={onReply}
                  isReply={true}
                  parentId={comment.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function SmartPostCard({
  post,
  layout,
  onEngagement,
  showImages,
  autoPlay,
  onShare,
  onComment,
  onVoteComment,
  className = ''
}: SmartPostCardProps) {
  const t = useTranslations('broadcasts.feed');
  const tPost = useTranslations('broadcasts.post');
  const tActions = useTranslations('broadcasts.actions');
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [mockComments, setMockComments] = useState<Comment[]>([
    {
      id: '1',
      author: {
        name: 'Sarah Chen',
        avatar: 'https://i.pravatar.cc/150?img=1',
        verified: true,
        handle: '@sarahchen'
      },
      content: 'This is exactly what I was looking for! Thanks for sharing.',
      timestamp: '2 hours ago',
      votes: { upvotes: 12, downvotes: 1, userVote: 'up' },
      isPinned: true,
      replies: [
        {
          id: '1-1',
          author: {
            name: 'Marcus Rodriguez',
            avatar: 'https://i.pravatar.cc/150?img=2',
            handle: '@marcusr'
          },
          content: 'Completely agree! Really helpful content.',
          timestamp: '1 hour ago',
          votes: { upvotes: 5, downvotes: 0, userVote: null }
        }
      ]
    }
  ]);

  const getLayoutClasses = () => {
    switch (layout) {
      case 'compact':
        return 'max-w-full';
      case 'magazine':
        return 'max-w-4xl';
      case 'card':
      default:
        return 'max-w-3xl';
    }
  };

  const shouldShowExpandedContent = () => {
    return isExpanded || layout === 'magazine' || post.content.length < 200;
  };

  const handlePollVote = (optionId: string) => {
    onEngagement(post.id, `poll_vote_${optionId}`);
  };

  const handleCommentVote = (commentId: string, vote: 'up' | 'down', parentId?: string) => {
    onVoteComment?.(post.id, commentId, vote, parentId);
    // Update local state for immediate feedback
    setMockComments(prev => prev.map(comment => {
      if (parentId) {
        // Handle reply vote
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies?.map(reply => {
              if (reply.id === commentId) {
                const currentVote = reply.votes.userVote;
                const newVote = currentVote === vote ? null : vote;
                return {
                  ...reply,
                  votes: {
                    upvotes: reply.votes.upvotes + (newVote === 'up' ? 1 : 0) - (currentVote === 'up' ? 1 : 0),
                    downvotes: reply.votes.downvotes + (newVote === 'down' ? 1 : 0) - (currentVote === 'down' ? 1 : 0),
                    userVote: newVote
                  }
                };
              }
              return reply;
            })
          };
        }
        return comment;
      } else {
        // Handle main comment vote
        if (comment.id === commentId) {
          const currentVote = comment.votes.userVote;
          const newVote = currentVote === vote ? null : vote;
          return {
            ...comment,
            votes: {
              upvotes: comment.votes.upvotes + (newVote === 'up' ? 1 : 0) - (currentVote === 'up' ? 1 : 0),
              downvotes: comment.votes.downvotes + (newVote === 'down' ? 1 : 0) - (currentVote === 'down' ? 1 : 0),
              userVote: newVote
            }
          };
        }
        return comment;
      }
    }));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        avatar: 'https://i.pravatar.cc/150?img=9',
        handle: '@you'
      },
      content: newComment,
      timestamp: 'just now',
      votes: { upvotes: 0, downvotes: 0, userVote: null }
    };

    setMockComments(prev => [...prev, comment]);
    setNewComment('');
    onComment?.(post.id, newComment);
  };

  const handleReply = (parentId: string) => {
    // Implementation would be similar to handleAddComment but for replies
    console.log('Reply to:', parentId);
  };

  const renderMedia = () => {
    if (!showImages || !post.media) return null;

    switch (post.media.type) {
      case 'video':
        return (
          <VideoPlayer 
            media={post.media} 
            autoPlay={autoPlay} 
            isShort={post.media.isShort}
          />
        );
      case 'image':
        return (
          <div className={`${layout === 'magazine' ? 'aspect-[16/10]' : post.media.aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-video'} rounded-lg overflow-hidden`}>
            <Image
              src={Array.isArray(post.media.url) ? post.media.url[0] : post.media.url}
              alt={post.title}
              className="h-full w-full object-cover hover:scale-105 transition-transform"
              removeWrapper
            />
          </div>
        );
      case 'gallery':
        return (
          <ImageGallery 
            images={Array.isArray(post.media.url) ? post.media.url : [post.media.url]} 
            title={post.title}
          />
        );
      default:
        return null;
    }
  };

  if (layout === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full mb-3 ${className}`}
      >
        <Card className="border-default-200 shadow-sm">
          <CardBody className="p-4">
            <div className="flex gap-4">
              {showImages && post.media && (
                <div className="flex-shrink-0">
                  <div className="h-16 w-24 rounded-md bg-default-100 overflow-hidden">
                    <Image
                      src={post.media.thumbnail || (Array.isArray(post.media.url) ? post.media.url[0] : post.media.url)}
                      alt={post.title}
                      className="h-full w-full object-cover"
                      removeWrapper
                    />
                  </div>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar src={post.author.avatar} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium truncate">{post.author.name}</span>
                        {post.author.verified && (
                          <Icon icon="solar:verified-check-bold" className="text-primary h-3 w-3" />
                        )}
                      </div>
                      <span className="text-xs text-foreground-500">{post.timestamp}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {post.isTrending && (
                      <Chip size="sm" color="warning" variant="flat" className="text-xs">
                        <Icon icon="solar:fire-linear" className="h-2 w-2 mr-1" />
                        Trending
                      </Chip>
                    )}
                    <Chip size="sm" color={getPostColor(post.priority || 'normal')} variant="flat" className="text-xs">
                      {post.type}
                    </Chip>
                  </div>
                </div>
                <h3 className="text-foreground font-semibold text-sm line-clamp-2 mb-1">
                  {post.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-foreground-500">
                  <span className="flex items-center gap-1">
                    <Icon icon="solar:heart-linear" className="h-3 w-3" />
                    {formatCount(post.engagement.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon="solar:chat-round-linear" className="h-3 w-3" />
                    {formatCount(post.engagement.comments)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon="solar:eye-linear" className="h-3 w-3" />
                    {formatCount(post.engagement.views)}
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
      className={`w-full ${layout === 'compact' ? 'mb-3' : 'mb-6'} ${className}`}
    >
      <Card className={`border-default-200 dark:border-default-700 bg-content1 mx-auto overflow-hidden transition-all duration-300 hover:shadow-lg ${getLayoutClasses()} shadow-medium`}>
        <CardHeader className={`${layout === 'magazine' ? 'px-8 pt-8' : 'p-4 sm:p-6'} pb-4`}>
          <div className="w-full">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  src={post.author.avatar}
                  name={post.author.name}
                  size="md"
                  className="ring-primary/20 ring-2"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-foreground truncate font-semibold">{post.author.name}</h4>
                    {post.author.verified && (
                      <Icon
                        icon="solar:verified-check-bold"
                        className="text-primary h-4 w-4 flex-shrink-0"
                      />
                    )}
                  </div>
                  <div className="text-foreground-500 flex items-center gap-2 text-sm">
                    <span>{post.author.handle}</span>
                    <div className="bg-foreground-400 h-1 w-1 rounded-full" />
                    <span>{post.timestamp}</span>
                    {post.readTime && (
                      <>
                        <div className="bg-foreground-400 h-1 w-1 rounded-full" />
                        <span>{post.readTime} min read</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {post.isTrending && (
                  <Chip
                    startContent={<Icon icon="solar:fire-linear" className="h-3 w-3" />}
                    color="warning"
                    size="sm"
                    variant="flat"
                    className="text-xs font-medium"
                  >
                    Trending
                  </Chip>
                )}
                <Chip
                  startContent={<Icon icon={getPostIcon(post.type)} className="h-3 w-3" />}
                  color={getPostColor(post.priority || 'normal')}
                  size="sm"
                  variant="flat"
                  className="text-xs font-medium"
                >
                  {post.type}
                </Chip>

                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly variant="light" size="sm">
                      <Icon icon="solar:menu-dots-linear" className="h-4 w-4" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    classNames={{
                      content: "bg-background text-foreground border border-default-200"
                    }}
                  >
                    <DropdownItem
                      key="save"
                      startContent={<Icon icon="solar:bookmark-linear" />}
                      className="text-foreground hover:bg-default-100"
                      onPress={() => onEngagement(post.id, 'bookmark')}
                    >
                      Bookmark
                    </DropdownItem>
                    <DropdownItem
                      key="copy"
                      startContent={<Icon icon="solar:copy-linear" />}
                      className="text-foreground hover:bg-default-100"
                      onPress={() => {
                        const shareUrl = post.shareUrl || `${window.location.origin}/broadcasts/post/${post.id}`;
                        navigator.clipboard.writeText(shareUrl);
                      }}
                    >
                      Copy link
                    </DropdownItem>
                    <DropdownItem
                      key="share"
                      startContent={<Icon icon="solar:share-linear" />}
                      className="text-foreground hover:bg-default-100"
                      onPress={() => onShare?.(post.id, 'share')}
                    >
                      Share
                    </DropdownItem>
                    <DropdownItem
                      key="report"
                      className="text-danger hover:bg-danger/10"
                      startContent={<Icon icon="solar:flag-linear" />}
                    >
                      Report
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>

            {/* Subcast Badge */}
            {post.subcast && (
              <div className="mb-3 flex items-center gap-2">
                <div className="bg-secondary/10 rounded-lg p-1.5">
                  <Icon icon={post.subcast.icon} className="text-secondary h-3 w-3" />
                </div>
                <span className="text-secondary text-xs font-medium">{post.subcast.name}</span>
              </div>
            )}

            {/* Title and Content */}
            <h3 className={`text-foreground mb-3 font-bold ${layout === 'magazine' ? 'text-2xl line-clamp-3' : 'text-xl line-clamp-2'}`}>
              {post.title}
            </h3>
            
            <div className="text-foreground-600 leading-relaxed">
              {shouldShowExpandedContent() ? (
                <p className={layout === 'magazine' ? 'text-lg' : ''}>{post.content}</p>
              ) : (
                <p className="line-clamp-3">{post.content}</p>
              )}
              
              {!shouldShowExpandedContent() && post.content.length > 200 && (
                <Button
                  variant="light"
                  size="sm"
                  className="mt-2 h-auto p-0 text-primary"
                  onPress={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? 'Read less' : 'Read more'}
                </Button>
              )}
            </div>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Chip
                  key={index}
                  size="sm"
                  variant="flat"
                  className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors"
                  startContent={<Icon icon="solar:hashtag-linear" className="h-2.5 w-2.5" />}
                >
                  {tag}
                </Chip>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-0">
          {/* Media */}
          {renderMedia()}

          {/* Poll */}
          {post.poll && (
            <div className="p-4">
              <PollWidget poll={post.poll} onVote={handlePollVote} />
            </div>
          )}

          {/* Link Preview */}
          {post.link && (
            <div className="p-4">
              <LinkPreview link={post.link} />
            </div>
          )}

          {/* Quote styling */}
          {post.type === 'quote' && (
            <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-l-4 border-primary">
              <Icon icon="solar:quote-down-linear" className="h-8 w-8 text-primary/60 mb-2" />
              <p className="text-lg italic text-foreground-700">{post.content}</p>
            </div>
          )}
        </CardBody>

        <CardFooter className={`border-default-200 border-t ${layout === 'magazine' ? 'px-8 pb-8' : 'p-4 sm:p-6'} pt-4`}>
          <div className="w-full space-y-4">
            {/* Engagement */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <button
                  onClick={() => onEngagement(post.id, 'like')}
                  className={`group flex items-center gap-2 transition-colors ${
                    post.isLiked ? 'text-danger' : 'text-foreground-500 hover:text-danger'
                  }`}
                >
                  <Icon
                    icon={post.isLiked ? 'solar:heart-bold' : 'solar:heart-linear'}
                    className="h-5 w-5 transition-transform group-hover:scale-110"
                  />
                  <span className="text-xs font-medium sm:text-sm">
                    {formatCount(post.engagement.likes)}
                  </span>
                </button>

                <button
                  onClick={() => setShowComments(!showComments)}
                  className="text-foreground-500 hover:text-primary group flex items-center gap-2 transition-colors"
                >
                  <Icon
                    icon="solar:chat-round-linear"
                    className="h-5 w-5 transition-transform group-hover:scale-110"
                  />
                  <span className="text-xs font-medium sm:text-sm">
                    {formatCount(post.engagement.comments)}
                  </span>
                </button>

                <button
                  onClick={() => onShare?.(post.id, 'share')}
                  className="text-foreground-500 hover:text-secondary group flex items-center gap-2 transition-colors"
                >
                  <Icon
                    icon="solar:share-linear"
                    className="h-5 w-5 transition-transform group-hover:scale-110"
                  />
                  <span className="text-xs font-medium sm:text-sm">
                    {formatCount(post.engagement.shares)}
                  </span>
                </button>

                <div className="text-foreground-400 flex items-center gap-2">
                  <Icon icon="solar:eye-linear" className="h-5 w-5" />
                  <span className="text-xs font-medium sm:text-sm">
                    {formatCount(post.engagement.views)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onEngagement(post.id, 'bookmark')}
                className={`transition-colors ${
                  post.isBookmarked ? 'text-warning' : 'text-foreground-500 hover:text-warning'
                }`}
              >
                <Icon
                  icon={post.isBookmarked ? 'solar:bookmark-bold' : 'solar:bookmark-linear'}
                  className="h-5 w-5 transition-transform hover:scale-110"
                />
              </button>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
              {showComments && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 border-t border-default-200 pt-4"
                >
                  {/* Comment input */}
                  <div className="flex gap-3">
                    <Avatar
                      src="https://i.pravatar.cc/150?img=9"
                      size="sm"
                      className="flex-shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Share your thoughts..."
                        value={newComment}
                        onValueChange={setNewComment}
                        minRows={1}
                        maxRows={4}
                        className="resize-none"
                        classNames={{
                          input: "text-sm"
                        }}
                      />
                      {newComment.trim() && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            onPress={() => setNewComment('')}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            color="primary"
                            onPress={handleAddComment}
                          >
                            Comment
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comments list */}
                  <div className="space-y-4">
                    {mockComments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        postId={post.id}
                        onVote={handleCommentVote}
                        onReply={handleReply}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
