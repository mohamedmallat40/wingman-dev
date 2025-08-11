'use client';

import React, { useState, useRef } from 'react';

import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
  useDisclosure,
  Tooltip
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface Reaction {
  type: 'like' | 'love' | 'wow' | 'laugh' | 'sad' | 'angry';
  count: number;
  hasReacted: boolean;
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified?: boolean;
    handle: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
  isLiked?: boolean;
  isPinned?: boolean;
  isAuthor?: boolean;
}

interface PostInteractionsProps {
  postId: string;
  initialReactions?: Reaction[];
  initialComments?: Comment[];
  onReaction?: (postId: string, reaction: string) => void;
  onComment?: (postId: string, comment: string, parentId?: string) => void;
  onShare?: (postId: string, platform: string) => void;
  className?: string;
}

const REACTION_EMOJIS = {
  like: '👍',
  love: '❤️',
  wow: '😮',
  laugh: '😂',
  sad: '😢',
  angry: '😠'
};

const REACTION_COLORS = {
  like: 'primary',
  love: 'danger',
  wow: 'warning',
  laugh: 'warning',
  sad: 'default',
  angry: 'danger'
};

// Mock data
const MOCK_REACTIONS: Reaction[] = [
  { type: 'like', count: 89, hasReacted: true },
  { type: 'love', count: 23, hasReacted: false },
  { type: 'wow', count: 12, hasReacted: false },
  { type: 'laugh', count: 8, hasReacted: false },
  { type: 'sad', count: 2, hasReacted: false },
  { type: 'angry', count: 1, hasReacted: false }
];

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?img=1',
      verified: true,
      handle: '@sarahchen'
    },
    content: 'This is exactly what I was looking for! The integration examples are really helpful. Thanks for sharing!',
    timestamp: '2 hours ago',
    likes: 12,
    isLiked: true,
    isPinned: true,
    replies: [
      {
        id: '1-1',
        author: {
          name: 'Marcus Rodriguez',
          avatar: 'https://i.pravatar.cc/150?img=2',
          handle: '@marcusr'
        },
        content: 'Completely agree! I\'ve been struggling with this exact issue.',
        timestamp: '1 hour ago',
        likes: 3,
        isLiked: false
      }
    ]
  },
  {
    id: '2',
    author: {
      name: 'Dr. Emily Watson',
      avatar: 'https://i.pravatar.cc/150?img=3',
      verified: true,
      handle: '@emilytech'
    },
    content: 'Great post! Have you considered the performance implications of this approach? Would love to see some benchmarks.',
    timestamp: '3 hours ago',
    likes: 8,
    isLiked: false
  },
  {
    id: '3',
    author: {
      name: 'Alex Turner',
      avatar: 'https://i.pravatar.cc/150?img=4',
      handle: '@alexdesigns',
      isAuthor: true
    },
    content: 'Thanks everyone for the positive feedback! I\'ll be doing a follow-up post next week with more advanced techniques.',
    timestamp: '1 hour ago',
    likes: 15,
    isLiked: false,
    isAuthor: true
  }
];

const SHARE_PLATFORMS = [
  { id: 'twitter', name: 'Twitter', icon: 'solar:twitter-linear', color: '#1DA1F2' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'solar:linkedin-linear', color: '#0077B5' },
  { id: 'facebook', name: 'Facebook', icon: 'solar:facebook-linear', color: '#1877F2' },
  { id: 'copy', name: 'Copy Link', icon: 'solar:copy-linear', color: '#6B7280' },
  { id: 'email', name: 'Email', icon: 'solar:letter-linear', color: '#EF4444' },
  { id: 'embed', name: 'Embed', icon: 'solar:code-linear', color: '#8B5CF6' }
];

export default function PostInteractions({
  postId,
  initialReactions = MOCK_REACTIONS,
  initialComments = MOCK_COMMENTS,
  onReaction,
  onComment,
  onShare,
  className = ''
}: PostInteractionsProps) {
  const t = useTranslations('broadcasts.interactions');
  
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  
  const { isOpen: isShareOpen, onOpen: onShareOpen, onOpenChange: onShareOpenChange } = useDisclosure();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const totalReactions = reactions.reduce((sum, reaction) => sum + reaction.count, 0);
  const userReaction = reactions.find(r => r.hasReacted);
  const displayedComments = showAllComments ? comments : comments.slice(0, 3);

  const handleReaction = (reactionType: string) => {
    setReactions(prev => prev.map(reaction => {
      if (reaction.type === reactionType) {
        return {
          ...reaction,
          count: reaction.hasReacted ? reaction.count - 1 : reaction.count + 1,
          hasReacted: !reaction.hasReacted
        };
      }
      // Remove previous reaction
      if (reaction.hasReacted) {
        return {
          ...reaction,
          count: reaction.count - 1,
          hasReacted: false
        };
      }
      return reaction;
    }));
    
    setShowReactionPicker(false);
    onReaction?.(postId, reactionType);
  };

  const handleComment = () => {
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
      likes: 0,
      isLiked: false
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
    onComment?.(postId, newComment);
  };

  const handleReply = (parentId: string) => {
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      author: {
        name: 'You',
        avatar: 'https://i.pravatar.cc/150?img=9',
        handle: '@you'
      },
      content: replyContent,
      timestamp: 'just now',
      likes: 0,
      isLiked: false
    };

    setComments(prev => prev.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    }));

    setReplyContent('');
    setReplyingTo(null);
    onComment?.(postId, replyContent, parentId);
  };

  const handleLikeComment = (commentId: string, isReply = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(prev => prev.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies?.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  isLiked: !reply.isLiked
                };
              }
              return reply;
            })
          };
        }
        return comment;
      }));
    } else {
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked
          };
        }
        return comment;
      }));
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  const handleShare = (platform: string) => {
    const postUrl = `${window.location.origin}/broadcasts/post/${postId}`;
    const title = 'Check out this interesting post on Wingman';

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      case 'copy':
        copyToClipboard(postUrl);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      case 'embed':
        copyToClipboard(`<iframe src="${postUrl}/embed" width="100%" height="400"></iframe>`);
        break;
    }

    onShare?.(postId, platform);
    onShareOpenChange();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Reactions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Main reaction button */}
          <Popover
            isOpen={showReactionPicker}
            onOpenChange={setShowReactionPicker}
            placement="top"
            showArrow
          >
            <PopoverTrigger>
              <Button
                variant={userReaction ? 'solid' : 'flat'}
                color={userReaction ? REACTION_COLORS[userReaction.type] as any : 'default'}
                size="sm"
                startContent={
                  userReaction ? (
                    <span className="text-lg">{REACTION_EMOJIS[userReaction.type]}</span>
                  ) : (
                    <Icon icon="solar:heart-linear" className="h-4 w-4" />
                  )
                }
                className="gap-2"
              >
                {formatCount(totalReactions)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-2">
              <div className="flex gap-2">
                {Object.entries(REACTION_EMOJIS).map(([type, emoji]) => {
                  const reaction = reactions.find(r => r.type === type);
                  return (
                    <Tooltip key={type} content={`${type} (${reaction?.count || 0})`}>
                      <Button
                        isIconOnly
                        variant={reaction?.hasReacted ? 'solid' : 'flat'}
                        color={reaction?.hasReacted ? REACTION_COLORS[type as keyof typeof REACTION_COLORS] as any : 'default'}
                        size="sm"
                        onPress={() => handleReaction(type)}
                        className="text-lg hover:scale-110 transition-transform"
                      >
                        {emoji}
                      </Button>
                    </Tooltip>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* Comment button */}
          <Button
            variant="flat"
            size="sm"
            startContent={<Icon icon="solar:chat-round-linear" className="h-4 w-4" />}
            onPress={() => commentInputRef.current?.focus()}
          >
            {comments.length}
          </Button>

          {/* Share button */}
          <Button
            variant="flat"
            size="sm"
            startContent={<Icon icon="solar:share-linear" className="h-4 w-4" />}
            onPress={onShareOpen}
          >
            Share
          </Button>
        </div>

        {/* Reaction summary */}
        {totalReactions > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              {reactions
                .filter(r => r.count > 0)
                .slice(0, 3)
                .map((reaction, index) => (
                  <div
                    key={reaction.type}
                    className="w-6 h-6 rounded-full bg-white border-2 border-background flex items-center justify-center text-sm"
                    style={{ zIndex: 10 - index }}
                  >
                    {REACTION_EMOJIS[reaction.type]}
                  </div>
                ))}
            </div>
            <span className="text-sm text-foreground-500 ml-1">
              {formatCount(totalReactions)}
            </span>
          </div>
        )}
      </div>

      {/* Comment Section */}
      <div className="space-y-4">
        {/* Comment input */}
        <div className="flex gap-3">
          <Avatar
            src="https://i.pravatar.cc/150?img=9"
            size="sm"
            className="flex-shrink-0"
          />
          <div className="flex-1 space-y-2">
            <Textarea
              ref={commentInputRef}
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
                  onPress={handleComment}
                >
                  Comment
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Comments list */}
        <AnimatePresence>
          {displayedComments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <div className="flex gap-3">
                <Avatar
                  src={comment.author.avatar}
                  size="sm"
                  className="flex-shrink-0"
                />
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
                        <span className="text-xs text-foreground-500 flex-shrink-0">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-3">{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            comment.isLiked ? 'text-danger' : 'text-foreground-500 hover:text-danger'
                          }`}
                        >
                          <Icon
                            icon={comment.isLiked ? 'solar:heart-bold' : 'solar:heart-linear'}
                            className="h-3 w-3"
                          />
                          {comment.likes > 0 && formatCount(comment.likes)}
                        </button>
                        <button
                          onClick={() => setReplyingTo(comment.id)}
                          className="text-xs text-foreground-500 hover:text-primary transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Reply input */}
                  {replyingTo === comment.id && (
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
                                setReplyingTo(null);
                                setReplyContent('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              color="primary"
                              onPress={() => handleReply(comment.id)}
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
                    <div className="mt-3 ml-4 pl-4 border-l-2 border-default-200 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <Avatar src={reply.author.avatar} size="sm" />
                          <div className="flex-1">
                            <Card className="border-default-200">
                              <CardBody className="p-3">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{reply.author.name}</span>
                                    <span className="text-xs text-foreground-500">{reply.timestamp}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-foreground mb-2">{reply.content}</p>
                                <button
                                  onClick={() => handleLikeComment(reply.id, true, comment.id)}
                                  className={`flex items-center gap-1 text-xs transition-colors ${
                                    reply.isLiked ? 'text-danger' : 'text-foreground-500 hover:text-danger'
                                  }`}
                                >
                                  <Icon
                                    icon={reply.isLiked ? 'solar:heart-bold' : 'solar:heart-linear'}
                                    className="h-3 w-3"
                                  />
                                  {reply.likes > 0 && formatCount(reply.likes)}
                                </button>
                              </CardBody>
                            </Card>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Load more comments */}
        {comments.length > 3 && !showAllComments && (
          <Button
            variant="flat"
            size="sm"
            onPress={() => setShowAllComments(true)}
            className="w-full"
          >
            View {comments.length - 3} more comments
          </Button>
        )}
      </div>

      {/* Share Modal */}
      <Modal isOpen={isShareOpen} onOpenChange={onShareOpenChange} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Share this post</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-3">
                  {SHARE_PLATFORMS.map((platform) => (
                    <Button
                      key={platform.id}
                      variant="flat"
                      className="h-16 flex-col gap-2"
                      onPress={() => handleShare(platform.id)}
                    >
                      <Icon
                        icon={platform.icon}
                        className="h-6 w-6"
                        style={{ color: platform.color }}
                      />
                      <span className="text-sm">{platform.name}</span>
                    </Button>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
