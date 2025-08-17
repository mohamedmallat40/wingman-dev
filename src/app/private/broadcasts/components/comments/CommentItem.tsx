'use client';

import React from 'react';

import type { CommentItemProps, CommentAction } from '../../types/comments';

import { Avatar, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { CommentInput } from './CommentInput';
import { useCommentUI } from '../../hooks/useCommentUI';
import { useSmartTimeFormat, useMentionFormatting } from '../../utils/timeFormatting';
import { getImageUrl } from '@/lib/utils/utilities';

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onAction,
  onReply,
  onEdit,
  className = '',
  maxDepth = 3,
  currentDepth = 0,
  enableMentions = true,
  enableRichText = false
}) => {
  const t = useTranslations('comments');
  const { uiState, actions: uiActions } = useCommentUI();
  const { formatTimeAgo } = useSmartTimeFormat();
  const { formatMentionsToHTML } = useMentionFormatting();
  
  const commentUI = uiState[comment.id] || {
    isExpanded: false,
    isReplying: false,
    isEditing: false,
    showReplies: true, // Show replies by default
    replyInputValue: '',
    editInputValue: ''
  };

  const canReply = currentDepth < maxDepth;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isNested = currentDepth > 0;

  // Format content with mentions - safely handle undefined content
  const safeContent = comment.response || comment.content || '';
  const formattedContent = formatMentionsToHTML(safeContent);
  
  // Map API owner to our author format
  const safeAuthor = comment.owner ? {
    id: comment.owner.id,
    username: comment.owner.userName || `${comment.owner.firstName.toLowerCase()}_${comment.owner.lastName.toLowerCase()}`,
    displayName: `${comment.owner.firstName} ${comment.owner.lastName}`,
    avatarUrl: comment.owner.profileImage ? getImageUrl(comment.owner.profileImage) : null
  } : {
    id: comment.authorId || 'unknown',
    username: 'unknown',
    displayName: 'Unknown User',
    avatarUrl: null
  };
  
  // Compute derived values
  const isEdited = comment.createdAt !== comment.updatedAt;
  const repliesCount = comment.repliesCount || comment.replies?.length || 0;

  const handleAction = (action: CommentAction) => {
    onAction(action, comment);
  };

  const handleReplySubmit = (content: string, mentions?: string[]) => {
    onReply(comment.id, content, mentions);
    uiActions.setReplying(comment.id, false);
  };

  const handleEditSubmit = (content: string, mentions?: string[]) => {
    onEdit(comment.id, content, mentions);
    uiActions.setEditing(comment.id, false);
  };

  const handleCancelReply = () => {
    uiActions.setReplying(comment.id, false);
    uiActions.setReplyInput(comment.id, '');
  };

  const handleCancelEdit = () => {
    uiActions.setEditing(comment.id, false);
    uiActions.setEditInput(comment.id, '');
  };

  return (
    <div className={`${className}`}>
      {/* Main Comment */}
      <div className={`flex gap-3 py-2`} style={{ marginLeft: `${currentDepth * 40}px` }}>
        {/* Avatar */}
        <Avatar
          src={safeAuthor.avatarUrl || undefined}
          name={safeAuthor.displayName}
          size="sm"
          className="flex-shrink-0 w-8 h-8"
          showFallback
          fallback={<Icon icon="solar:user-linear" className="text-default-500 w-4 h-4" />}
        />
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {commentUI.isEditing ? (
            <div className="mb-2">
              <CommentInput
                onSubmit={handleEditSubmit}
                onCancel={handleCancelEdit}
                initialValue={commentUI.editInputValue || safeContent}
                placeholder="Edit your comment..."
                enableMentions={enableMentions}
                enableRichText={enableRichText}
                autoFocus
                showCancel
                maxLength={2000}
              />
            </div>
          ) : (
            <>
              {/* Comment Text */}
              <div className="text-sm leading-5">
                <span className="font-semibold text-foreground mr-2">
                  {safeAuthor.displayName}
                </span>
                <span 
                  className="text-foreground break-words"
                  dangerouslySetInnerHTML={{ __html: formattedContent }}
                />
              </div>

              {/* Comment Meta */}
              <div className="flex items-center gap-4 mt-1 text-xs text-default-500">
                <time 
                  dateTime={comment.createdAt}
                  className="hover:underline cursor-pointer"
                  title={new Date(comment.createdAt).toLocaleString()}
                >
                  {formatTimeAgo(comment.createdAt)}
                </time>
                
                {(comment.likesCount || 0) > 0 && (
                  <span className="font-medium">
                    {comment.likesCount} {comment.likesCount === 1 ? 'like' : 'likes'}
                  </span>
                )}
                
                {canReply && (
                  <button
                    onClick={() => uiActions.setReplying(comment.id, true)}
                    className="font-medium hover:text-default-700 transition-colors"
                  >
                    Reply
                  </button>
                )}
                
                {isEdited && (
                  <span className="italic">edited</span>
                )}
              </div>

              {/* Like/Actions Row */}
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => handleAction('like')}
                  className={`flex items-center gap-1 transition-colors ${
                    comment.isLiked ? 'text-red-500' : 'text-default-500 hover:text-red-500'
                  }`}
                >
                  <Icon 
                    icon={comment.isLiked ? "solar:heart-bold" : "solar:heart-linear"}
                    className="w-4 h-4"
                  />
                </button>

                <button
                  onClick={() => uiActions.setReplying(comment.id, true)}
                  className="text-default-500 hover:text-default-700 transition-colors"
                >
                  <Icon icon="solar:chat-round-linear" className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleAction('edit')}
                  className="text-default-500 hover:text-default-700 transition-colors"
                >
                  <Icon icon="solar:pen-linear" className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* Reply Input - appears directly under the comment */}
          <AnimatePresence>
            {commentUI.isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3"
              >
                <CommentInput
                  onSubmit={handleReplySubmit}
                  onCancel={handleCancelReply}
                  placeholder={`Reply to ${safeAuthor.displayName}...`}
                  enableMentions={enableMentions}
                  enableRichText={enableRichText}
                  autoFocus
                  showCancel
                  maxLength={2000}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* View Replies Button */}
          {hasReplies && !commentUI.showReplies && (
            <button
              onClick={() => uiActions.toggleShowReplies(comment.id)}
              className="flex items-center gap-2 mt-3 text-xs text-default-500 hover:text-default-700 transition-colors"
            >
              <div className="w-6 h-px bg-default-300"></div>
              <span className="font-medium">
                View {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      <AnimatePresence>
        {hasReplies && commentUI.showReplies && comment.replies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onAction={onAction}
                onReply={onReply}
                onEdit={onEdit}
                maxDepth={maxDepth}
                currentDepth={currentDepth + 1}
                enableMentions={enableMentions}
                enableRichText={enableRichText}
              />
            ))}
            
            {/* Load more replies - only show if API indicates more replies exist */}
            {(comment.repliesCount || 0) > (comment.replies?.length || 0) && (
              <div 
                className="flex items-center gap-2 mt-2 text-xs text-default-500"
                style={{ marginLeft: `${(currentDepth + 1) * 40}px` }}
              >
                <div className="w-6 h-px bg-default-300"></div>
                <button className="font-medium hover:text-default-700 transition-colors">
                  Load {(comment.repliesCount || 0) - (comment.replies?.length || 0)} more replies
                </button>
              </div>
            )}

            {/* Hide Replies Button */}
            {hasReplies && (
              <button
                onClick={() => uiActions.toggleShowReplies(comment.id)}
                className="flex items-center gap-2 mt-2 text-xs text-default-500 hover:text-default-700 transition-colors"
                style={{ marginLeft: `${(currentDepth + 1) * 40}px` }}
              >
                <div className="w-6 h-px bg-default-300"></div>
                <span className="font-medium">Hide {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};