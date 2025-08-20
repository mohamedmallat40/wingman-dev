import { useCallback } from 'react';

import type { BroadcastPost } from '../types';

import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook to update broadcast data across different queries
 * Useful for updating comment counts, upvote counts, etc.
 */
export const useBroadcastUpdates = () => {
  const queryClient = useQueryClient();

  // Update comment count for a specific post
  const updateCommentCount = useCallback(
    (postId: string, increment: number = 1) => {
      // Only update specific feed queries to reduce performance impact
      queryClient.setQueriesData({ queryKey: ['broadcasts', 'feed'] }, (old: any) => {
        if (!old?.pages) return old;

        let hasChanges = false;
        const updatedPages = old.pages.map((page: any) => {
          if (!page.data) return page;

          const updatedData = page.data.map((post: BroadcastPost) => {
            if (post.id === postId) {
              hasChanges = true;
              return {
                ...post,
                replyCount: Math.max(0, (post.replyCount || 0) + increment),
                commentsCount: Math.max(0, (post.commentsCount || 0) + increment)
              };
            }
            return post;
          });

          return { ...page, data: updatedData };
        });

        return hasChanges ? { ...old, pages: updatedPages } : old;
      });

      // Update single post query more specifically
      queryClient.setQueryData(['broadcasts', 'post', postId], (old: BroadcastPost | undefined) => {
        if (!old) return old;
        return {
          ...old,
          replyCount: Math.max(0, (old.replyCount || 0) + increment),
          commentsCount: Math.max(0, (old.commentsCount || 0) + increment)
        };
      });
    },
    [queryClient]
  );

  // Update upvote count for a specific post
  const updateUpvoteCount = useCallback(
    (postId: string, increment: number = 1, isUpvoted: boolean) => {
      queryClient.setQueriesData({ queryKey: ['broadcasts'] }, (old: any) => {
        if (!old) return old;

        // Handle paginated response structure
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data?.map((post: BroadcastPost) =>
                post.id === postId
                  ? {
                      ...post,
                      upvotes: Math.max(0, (post.upvotes || 0) + increment),
                      isUpvoted: isUpvoted
                    }
                  : post
              )
            }))
          };
        }

        // Handle direct data array
        if (old.data && Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.map((post: BroadcastPost) =>
              post.id === postId
                ? {
                    ...post,
                    upvotes: Math.max(0, (post.upvotes || 0) + increment),
                    isUpvoted: isUpvoted
                  }
                : post
            )
          };
        }

        return old;
      });

      // Also update single post queries
      queryClient.setQueriesData(
        { queryKey: ['broadcast', postId] },
        (old: BroadcastPost | undefined) => {
          if (!old) return old;

          return {
            ...old,
            upvotes: Math.max(0, (old.upvotes || 0) + increment),
            isUpvoted: isUpvoted
          };
        }
      );
    },
    [queryClient]
  );

  return {
    updateCommentCount,
    updateUpvoteCount
  };
};
