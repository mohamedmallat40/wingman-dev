import { useCallback, useState } from 'react';

import type { BroadcastPost } from '../types';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeUpvote, upvotePost } from '../services/broadcast.service';

export const useUpvote = () => {
  const queryClient = useQueryClient();
  const [isOptimisticUpdate, setIsOptimisticUpdate] = useState(false);

  // Upvote mutation
  const upvoteMutation = useMutation({
    mutationFn: upvotePost,
    onMutate: async (postId: string) => {
      setIsOptimisticUpdate(true);

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['broadcasts'] });

      // Snapshot the previous value
      const previousData = queryClient.getQueriesData({ queryKey: ['broadcasts'] });

      // Optimistically update all broadcast queries
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
                      isUpvoted: true,
                      upvotes: (post.upvotes || 0) + 1
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
                    isUpvoted: true,
                    upvotes: (post.upvotes || 0) + 1
                  }
                : post
            )
          };
        }

        return old;
      });

      return { previousData };
    },
    onError: (err, postId, context) => {
      // Revert the optimistic update
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error('Failed to upvote post:', err);
    },
    onSettled: () => {
      setIsOptimisticUpdate(false);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['broadcasts'] });
    }
  });

  // Remove upvote mutation
  const removeUpvoteMutation = useMutation({
    mutationFn: removeUpvote,
    onMutate: async (postId: string) => {
      setIsOptimisticUpdate(true);

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['broadcasts'] });

      // Snapshot the previous value
      const previousData = queryClient.getQueriesData({ queryKey: ['broadcasts'] });

      // Optimistically update all broadcast queries
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
                      isUpvoted: false,
                      upvotes: Math.max(0, (post.upvotes || 0) - 1)
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
                    isUpvoted: false,
                    upvotes: Math.max(0, (post.upvotes || 0) - 1)
                  }
                : post
            )
          };
        }

        return old;
      });

      return { previousData };
    },
    onError: (err, postId, context) => {
      // Revert the optimistic update
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error('Failed to remove upvote:', err);
    },
    onSettled: () => {
      setIsOptimisticUpdate(false);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['broadcasts'] });
    }
  });

  // Toggle upvote function
  const toggleUpvote = useCallback(
    (postId: string, isCurrentlyUpvoted: boolean) => {
      if (isCurrentlyUpvoted) {
        removeUpvoteMutation.mutate(postId);
      } else {
        upvoteMutation.mutate(postId);
      }
    },
    [upvoteMutation, removeUpvoteMutation]
  );

  return {
    toggleUpvote,
    isUpvoting: upvoteMutation.isPending,
    isRemovingUpvote: removeUpvoteMutation.isPending,
    isLoading: upvoteMutation.isPending || removeUpvoteMutation.isPending || isOptimisticUpdate,
    error: upvoteMutation.error || removeUpvoteMutation.error
  };
};
