'use client';

import React, { useState } from 'react';

import type { CommentAction, CommentItemProps } from '../../types/comments';

import { Avatar, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import useBasicProfile from '@root/modules/profile/hooks/use-basic-profile';

import { getImageUrl } from '@/lib/utils/utilities';

import { useCommentUI } from '../../hooks/useCommentUI';
import { useMentionFormatting, useSmartTimeFormat } from '../../utils/timeFormatting';
import { CommentInput } from './CommentInput';
import { DeleteConfirmModal } from './DeleteConfirmModal';

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
  const { profile: currentUser } = useBasicProfile();
  const { uiState, actions: uiActions } = useCommentUI();
  const { formatTimeAgo } = useSmartTimeFormat();
  const { formatMentionsToHTML } = useMentionFormatting();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
  const isOwner = currentUser?.id === comment.owner?.id;

  // Format content with mentions - safely handle undefined content
  const safeContent = comment.response || comment.content || '';
  const formattedContent = formatMentionsToHTML(safeContent);

  // Map API owner to our author format
  const safeAuthor = comment.owner && comment.owner.firstName && comment.owner.lastName
    ? {
        id: comment.owner.id,
        username:
          comment.owner.userName ||
          `${comment.owner.firstName.toLowerCase()}_${comment.owner.lastName.toLowerCase()}`,
        displayName: `${comment.owner.firstName} ${comment.owner.lastName}`,
        avatarUrl: comment.owner.profileImage ? getImageUrl(comment.owner.profileImage) : null
      }
    : currentUser && comment.owner?.id === currentUser.id
    ? {
        id: currentUser.id,
        username: currentUser.userName || `${currentUser.firstName?.toLowerCase()}_${currentUser.lastName?.toLowerCase()}`,
        displayName: `${currentUser.firstName} ${currentUser.lastName}`,
        avatarUrl: currentUser.profileImage ? getImageUrl(currentUser.profileImage) : null
      }
    : {
        id: comment.authorId || comment.owner?.id || 'unknown',
        username: 'unknown',
        displayName: 'Unknown User',
        avatarUrl: null
      };

  // Compute derived values
  const isEdited = comment.createdAt !== comment.updatedAt;
  const repliesCount = comment.repliesCount || comment.replies?.length || 0;

  const handleAction = (action: CommentAction) => {
    if (action === 'delete') {
      setShowDeleteModal(true);
    } else if (action === 'edit') {
      // Set the edit input value to the current comment content and enable editing mode
      uiActions.setEditInput(comment.id, safeContent);
      uiActions.setEditing(comment.id, true);
    } else {
      onAction(action, comment);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onAction('delete', comment);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setIsDeleting(false);
    }
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
    <div className={`${className} relative`}>
      {/* Thread lines for nested comments */}
      {isNested && (
        <div
          className='absolute'
          style={{
            left: `${(currentDepth - 1) * 40 + 15.5}px`, // Parent avatar center position (adjusted for 1px line)
            top: '0px',
            width: `${24.5}px`, // Extend to current comment area
            height: '24px', // Connect to horizontal line
            borderLeft: '1px solid rgb(212 212 212)',
            borderBottom: '1px solid rgb(212 212 212)',
            borderBottomLeftRadius: '3px'
          }}
        ></div>
      )}

      {/* Continuous vertical line for replies (if comment has replies) */}
      {hasReplies && commentUI.showReplies && (
        <div
          className='absolute'
          style={{
            left: `${currentDepth * 40 + 15.5}px`, // Current avatar center position (adjusted for 1px line)
            top: '50px', // Start below current comment
            width: '1px',
            height: 'calc(100% - 90px)', // Extend to bottom of replies, accounting for hide button
            backgroundColor: 'rgb(212 212 212)' // Same as border-default-300
          }}
        ></div>
      )}

      {/* Main Comment */}
      <div className={`flex gap-3 py-2`} style={{ marginLeft: `${currentDepth * 40}px` }}>
        {/* Avatar - only show when not editing */}
        {!commentUI.isEditing && (
          <Avatar
            src={safeAuthor.avatarUrl || undefined}
            name={safeAuthor.displayName}
            size='sm'
            className='h-8 w-8 flex-shrink-0'
            showFallback
            fallback={<Icon icon='solar:user-linear' className='text-default-500 h-4 w-4' />}
          />
        )}

        {/* Content */}
        <div className='min-w-0 flex-1'>
          {commentUI.isEditing ? (
            <div className='mb-2'>
              <CommentInput
                onSubmit={handleEditSubmit}
                onCancel={handleCancelEdit}
                initialValue={commentUI.editInputValue || safeContent}
                placeholder='Edit your comment...'
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
              <div className='text-sm leading-5'>
                <span className='text-foreground mr-2 font-semibold'>{safeAuthor.displayName}</span>
                <span
                  className='text-foreground break-words'
                  dangerouslySetInnerHTML={{ __html: formattedContent }}
                />
              </div>

              {/* Comment Meta */}
              <div className='text-default-500 mt-1 flex items-center gap-4 text-xs'>
                <time
                  dateTime={comment.createdAt}
                  className='cursor-pointer hover:underline'
                  title={new Date(comment.createdAt).toLocaleString()}
                >
                  {formatTimeAgo(comment.createdAt)}
                </time>

                {(comment.likesCount || 0) > 0 && (
                  <span className='font-medium'>
                    {comment.likesCount} {comment.likesCount === 1 ? 'like' : 'likes'}
                  </span>
                )}

                {canReply && (
                  <button
                    onClick={() => uiActions.setReplying(comment.id, true)}
                    className='hover:text-default-700 font-medium transition-colors'
                  >
                    Reply
                  </button>
                )}

                {isEdited && <span className='italic'>edited</span>}
              </div>

              {/* Actions Row */}
              <div className='mt-2 flex items-center gap-4'>
                {isOwner && (
                  <button
                    onClick={() => handleAction('delete')}
                    className='text-default-500 hover:text-danger transition-colors'
                    title='Delete comment'
                  >
                    <Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' />
                  </button>
                )}

                <button
                  onClick={() => uiActions.setReplying(comment.id, true)}
                  className='text-default-500 hover:text-default-700 transition-colors'
                >
                  <Icon icon='solar:chat-round-linear' className='h-4 w-4' />
                </button>

                {isOwner && (
                  <button
                    onClick={() => handleAction('edit')}
                    className='text-default-500 hover:text-default-700 transition-colors'
                    title='Edit comment'
                  >
                    <Icon icon='solar:pen-linear' className='h-4 w-4' />
                  </button>
                )}
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
                className='mt-3'
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
            <div className='relative mt-3'>
              {/* Vertical line from avatar down - extends to connect with horizontal */}
              <div
                className='absolute'
                style={{
                  left: `${currentDepth * 40 + 16}px`, // Back to original working position
                  top: '-25px', // Start well above to connect to comment
                  width: '1px',
                  height: '31px', // Long enough to reach horizontal line
                  backgroundColor: 'rgb(212 212 212)'
                }}
              ></div>

              {/* Horizontal line from avatar center to text start */}
              <div
                className='absolute'
                style={{
                  left: `${currentDepth * 40 + 16}px`, // Back to original position
                  top: '6px', // At text baseline level
                  width: '25px', // Back to original width
                  height: '1px',
                  backgroundColor: 'rgb(212 212 212)'
                }}
              ></div>

              <div style={{ marginLeft: `${currentDepth * 40 + 44}px` }}>
                <button
                  onClick={() => uiActions.toggleShowReplies(comment.id)}
                  className='text-default-500 hover:text-default-700 flex items-center text-xs transition-colors'
                >
                  <span className='font-medium'>
                    View {comment.replies.length}{' '}
                    {comment.replies.length === 1 ? 'reply' : 'replies'}
                  </span>
                </button>
              </div>
            </div>
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
              <div className='relative mt-2'>
                {/* Vertical line from parent avatar down - extends to connect with horizontal */}
                <div
                  className='absolute'
                  style={{
                    left: `${currentDepth * 40 + 16}px`, // Back to original working position
                    top: '-25px', // Start well above to connect to replies
                    width: '1px',
                    height: '31px', // Long enough to reach horizontal line
                    backgroundColor: 'rgb(212 212 212)'
                  }}
                ></div>

                {/* Horizontal line from parent avatar to next level text */}
                <div
                  className='absolute'
                  style={{
                    left: `${currentDepth * 40 + 16}px`, // Back to original position
                    top: '6px', // At text baseline level
                    width: '65px', // Back to original width
                    height: '1px',
                    backgroundColor: 'rgb(212 212 212)'
                  }}
                ></div>

                <div style={{ marginLeft: `${(currentDepth + 1) * 40 + 44}px` }}>
                  <button className='text-default-500 hover:text-default-700 flex items-center text-xs transition-colors'>
                    <span className='font-medium'>
                      Load {(comment.repliesCount || 0) - (comment.replies?.length || 0)} more
                      replies
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Hide Replies Button */}
            {hasReplies && (
              <div className='relative mt-2'>
                {/* Vertical line from avatar down - extends to connect with horizontal */}
                <div
                  className='absolute'
                  style={{
                    left: `${currentDepth * 40 + 16}px`, // Back to original working position
                    top: '-25px', // Start well above to connect to replies
                    width: '1px',
                    height: '31px', // Long enough to reach horizontal line
                    backgroundColor: 'rgb(212 212 212)'
                  }}
                ></div>

                {/* Horizontal line from avatar center to text start */}
                <div
                  className='absolute'
                  style={{
                    left: `${currentDepth * 40 + 16}px`, // Back to original position
                    top: '6px', // At text baseline level
                    width: '25px', // Back to original width
                    height: '1px',
                    backgroundColor: 'rgb(212 212 212)'
                  }}
                ></div>

                <div style={{ marginLeft: `${currentDepth * 40 + 44}px` }}>
                  <button
                    onClick={() => uiActions.toggleShowReplies(comment.id)}
                    className='text-default-500 hover:text-default-700 flex items-center text-xs transition-colors'
                  >
                    <span className='font-medium'>
                      Hide {comment.replies.length}{' '}
                      {comment.replies.length === 1 ? 'reply' : 'replies'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
};
