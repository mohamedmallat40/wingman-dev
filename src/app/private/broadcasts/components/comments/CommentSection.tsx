'use client';

import React, { useCallback, useEffect, useRef } from 'react';

import type { Comment, CommentAction, CommentSectionProps } from '../../types/comments';

import { Button, Card, CardBody, Divider, Skeleton, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
// Removed framer-motion for better performance
import { useTranslations } from 'next-intl';

import { useComments } from '../../hooks/useComments';
import { useCommentUI } from '../../hooks/useCommentUI';
import { CommentInput } from './CommentInput';
import { CommentItem } from './CommentItem';
import { CommentSkeleton } from './CommentSkeleton';

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  initialComments = [],
  totalComments = 0,
  className = '',
  maxDepth = 3,
  enableMentions = true,
  enableRichText = false
}) => {
  const t = useTranslations('comments');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  // Comments state management
  const {
    comments,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    total,
    actions: {
      loadMore,
      refresh,
      createComment,
      updateComment,
      deleteComment,
      likeComment,
      unlikeComment,
      loadInitialComments
    }
  } = useComments({ postId, initialComments, limit: 20, sortBy: 'newest' });

  // Track if we've loaded comments for this post to prevent duplicates
  const loadedPostRef = useRef<string | null>(null);

  // Load comments when component mounts - only once per post and only if no initial comments
  useEffect(() => {
    if (loadedPostRef.current !== postId && initialComments.length === 0) {
      loadedPostRef.current = postId;
      loadInitialComments();
    } else if (loadedPostRef.current !== postId) {
      // If we have initial comments, just mark as loaded to prevent duplicate fetching
      loadedPostRef.current = postId;
    }
  }, [postId, initialComments.length]); // Removed loadInitialComments from dependencies to prevent double calls

  // UI state management
  const { uiState, actions: uiActions } = useCommentUI();

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const trigger = loadMoreTriggerRef.current;
    if (!trigger || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  // Handle comment actions
  const handleCommentAction = useCallback(
    async (action: CommentAction, comment: Comment) => {
      try {
        switch (action) {
          case 'like':
            await (comment.isLiked ? unlikeComment(comment.id) : likeComment(comment.id));
            break;
          case 'delete':
            await deleteComment(comment.id);
            break;
          case 'reply':
            uiActions.setReplying(comment.id, true);
            break;
          case 'edit':
            uiActions.setEditing(comment.id, true);
            uiActions.setEditInput(comment.id, comment.response || comment.content || '');
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Failed to ${action} comment:`, error);
      }
    },
    [likeComment, unlikeComment, deleteComment, uiActions]
  );

  // Handle reply submission
  const handleReply = useCallback(
    async (parentId: string, content: string, taggedUsers?: string[]) => {
      try {
        await createComment({
          response: content, // API expects 'response' field
          postId,
          parentId,
          taggedUsers
        });
        uiActions.setReplying(parentId, false);
        uiActions.setReplyInput(parentId, '');
      } catch (error) {
        console.error('Failed to create reply:', error);
      }
    },
    [createComment, postId, uiActions]
  );

  // Handle comment edit
  const handleEdit = useCallback(
    async (commentId: string, content: string, taggedUsers?: string[]) => {
      try {
        await updateComment(commentId, { response: content, taggedUsers }); // API expects 'response' field
        uiActions.setEditing(commentId, false);
        uiActions.setEditInput(commentId, '');
      } catch (error) {
        console.error('Failed to update comment:', error);
      }
    },
    [updateComment, uiActions]
  );

  // Handle new comment submission
  const handleNewComment = useCallback(
    async (content: string, taggedUsers?: string[]) => {
      try {
        await createComment({
          response: content, // API expects 'response' field
          postId,
          taggedUsers
        });
      } catch (error) {
        console.error('Failed to create comment:', error);
      }
    },
    [createComment, postId]
  );

  // Scroll to top when new comments are added
  const scrollToTop = useCallback(() => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Error state - but be smart about it
  if (error && comments.length === 0 && total === 0) {
    // Only show error if we actually have a real error, not just "no comments"
    const isRealError =
      !error.message.includes('404') &&
      !error.message.includes('No comments') &&
      !error.message.includes('not found');

    if (isRealError) {
      return (
        <Card className={`border-danger/20 bg-danger/5 rounded-[16px] backdrop-blur-sm ${className}`}>
          <CardBody className='py-8'>
            <div className='text-center'>
              <div className='bg-danger/10 border-danger/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[16px] border'>
                <Icon
                  icon='solar:info-circle-linear'
                  className='text-danger h-8 w-8'
                />
              </div>
              <h3 className='text-danger mb-2 text-lg font-semibold tracking-tight'>{t('error.title')}</h3>
              <p className='text-foreground-500 mb-4 text-sm leading-relaxed'>{t('error.description')}</p>
              <Button
                color='danger'
                variant='flat'
                size='sm'
                onPress={refresh}
                startContent={<Icon icon='solar:refresh-circle-linear' className='h-4 w-4' />}
                className='rounded-[12px] font-medium'
              >
                {t('error.retry')}
              </Button>
            </div>
          </CardBody>
        </Card>
      );
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* New comment input */}
      <div className='mb-6'>
        <CommentInput
          onSubmit={handleNewComment}
          placeholder='Add a comment...'
          enableMentions={enableMentions}
          enableRichText={enableRichText}
          maxLength={2000}
        />
      </div>

      {/* Comments list - No scrollbars, just natural flow */}
      <div ref={scrollContainerRef} className='space-y-0'>
        {/* Loading skeleton for initial load */}
        {isLoading && comments.length === 0 && (
          <div className='space-y-4'>
            {Array.from({ length: 3 }).map((_, index) => (
              <CommentSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Comments */}
        <div>
          {comments.map((comment, index) => (
            <div
              key={comment.id}
              className="animate-in fade-in slide-in-from-top-1 duration-300"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <CommentItem
              comment={comment}
              onAction={handleCommentAction}
              onReply={handleReply}
              onEdit={handleEdit}
              maxDepth={maxDepth}
              currentDepth={0}
              enableMentions={enableMentions}
              enableRichText={enableRichText}
              />
            </div>
          ))}
        </div>

        {/* Load more trigger */}
        {hasMore && (
          <div ref={loadMoreTriggerRef} className='py-4'>
            {isLoadingMore ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='border-default-300 border-t-primary h-4 w-4 animate-spin rounded-full border-2'></div>
                <span className='text-default-500 text-sm'>Loading more comments...</span>
              </div>
            ) : (
              <button
                onClick={loadMore}
                className='text-default-500 hover:text-default-700 w-full py-3 text-sm font-medium transition-colors'
              >
                Load more comments
              </button>
            )}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && comments.length === 0 && !error && (
          <div className='py-12 text-center'>
            <div className='bg-primary/5 border-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[16px] border'>
              <Icon
                icon='solar:chat-dots-linear'
                className='text-primary h-8 w-8'
              />
            </div>
            <h4 className='text-foreground mb-2 text-base font-semibold tracking-tight'>No comments yet</h4>
            <p className='text-foreground-500 text-sm leading-relaxed'>Be the first to share what you think!</p>
          </div>
        )}

        {/* End indicator */}
        {!hasMore && comments.length > 3 && (
          <div className='py-6 text-center'>
            <p className='text-default-400 text-sm'>You've reached the end</p>
          </div>
        )}
      </div>
    </div>
  );
};
