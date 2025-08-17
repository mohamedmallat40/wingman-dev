'use client';

import React, { useCallback, useEffect, useRef } from 'react';

import type { CommentSectionProps, CommentAction, Comment } from '../../types/comments';

import { Button, Card, CardBody, Divider, Skeleton, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { CommentInput } from './CommentInput';
import { CommentItem } from './CommentItem';
import { CommentSkeleton } from './CommentSkeleton';
import { useComments } from '../../hooks/useComments';
import { useCommentUI } from '../../hooks/useCommentUI';

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

  // Load comments when component mounts - only once per post
  useEffect(() => {
    if (loadedPostRef.current !== postId) {
      loadedPostRef.current = postId;
      loadInitialComments();
    }
  }, [postId, loadInitialComments]);

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
    async (parentId: string, content: string, mentions?: string[]) => {
      try {
        await createComment({
          content,
          postId,
          parentId,
          mentions
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
    async (commentId: string, content: string, mentions?: string[]) => {
      try {
        await updateComment(commentId, { content, mentions });
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
    async (content: string, mentions?: string[]) => {
      try {
        await createComment({
          content,
          postId,
          mentions
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
    const isRealError = !error.message.includes('404') && 
                       !error.message.includes('No comments') && 
                       !error.message.includes('not found');
    
    if (isRealError) {
      return (
        <Card className={`border-danger/20 ${className}`}>
          <CardBody className="py-8">
            <div className="text-center">
              <Icon 
                icon="solar:chat-round-unread-linear" 
                className="text-danger mx-auto mb-4 h-12 w-12" 
              />
              <h3 className="text-danger mb-2 text-lg font-semibold">
                {t('error.title')}
              </h3>
              <p className="text-foreground-500 mb-4 text-sm">
                {t('error.description')}
              </p>
              <Button
                color="danger"
                variant="flat"
                size="sm"
                onPress={refresh}
                startContent={<Icon icon="solar:refresh-linear" className="h-4 w-4" />}
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
      <div className="mb-6">
        <CommentInput
          onSubmit={handleNewComment}
          placeholder="Add a comment..."
          enableMentions={enableMentions}
          enableRichText={enableRichText}
          maxLength={2000}
        />
      </div>

      {/* Comments list - No scrollbars, just natural flow */}
      <div ref={scrollContainerRef} className="space-y-0">
        {/* Loading skeleton for initial load */}
        {isLoading && comments.length === 0 && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <CommentSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Comments */}
        <AnimatePresence mode="popLayout">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onAction={handleCommentAction}
              onReply={handleReply}
              onEdit={handleEdit}
              maxDepth={maxDepth}
              currentDepth={0}
              enableMentions={enableMentions}
              enableRichText={enableRichText}
            />
          ))}
        </AnimatePresence>

        {/* Load more trigger */}
        {hasMore && (
          <div ref={loadMoreTriggerRef} className="py-4">
            {isLoadingMore ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-default-300 border-t-primary rounded-full animate-spin"></div>
                <span className="text-default-500 text-sm">Loading more comments...</span>
              </div>
            ) : (
              <button
                onClick={loadMore}
                className="w-full py-3 text-sm text-default-500 hover:text-default-700 font-medium transition-colors"
              >
                Load more comments
              </button>
            )}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && comments.length === 0 && !error && (
          <div className="py-12 text-center">
            <Icon 
              icon="solar:chat-round-dots-linear" 
              className="text-default-300 h-12 w-12 mx-auto mb-4" 
            />
            <h4 className="text-default-500 mb-2 text-base font-medium">
              No comments yet
            </h4>
            <p className="text-default-400 text-sm">
              Be the first to share what you think!
            </p>
          </div>
        )}

        {/* End indicator */}
        {!hasMore && comments.length > 3 && (
          <div className="py-6 text-center">
            <p className="text-default-400 text-sm">
              You've reached the end
            </p>
          </div>
        )}
      </div>
    </div>
  );
};