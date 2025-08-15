import type {
  FeedParams
} from '../services/broadcast.service';

import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getBroadcastFeed,
  getTopics,
  togglePostBookmark,
  togglePostLike,
  trackPostView
} from '../services/broadcast.service';

// ===== FEED HOOKS =====

/**
 * Hook for fetching broadcast feed with infinite scroll
 */
export const useBroadcastFeed = (params: Omit<FeedParams, 'page'> = {}) => {
  return useInfiniteQuery({
    queryKey: ['broadcasts', 'feed', params],
    queryFn: ({ pageParam = 1 }) => getBroadcastFeed({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.hasNextPage) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
    retry: false
  });
};

// ===== ENGAGEMENT HOOKS =====

/**
 * Hook for liking/unliking posts
 */
export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => togglePostLike(postId),
    onSuccess: (response, postId) => {
      // Invalidate feed queries to refetch with updated like status
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'feed'] });
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'post', postId] });
    },
    onError: (error) => {
      // Error is handled by UI error state
    },
    retry: false
  });
};

/**
 * Hook for bookmarking/unbookmarking posts
 */
export const useBookmarkPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => togglePostBookmark(postId),
    onSuccess: (response, postId) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'feed'] });
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'post', postId] });
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'bookmarks'] });
    },
    onError: (error) => {
      // Error is handled by UI error state
    },
    retry: false
  });
};

/**
 * Hook for tracking post views
 */
export const useTrackPostView = () => {
  return useMutation({
    mutationFn: (postId: string) => trackPostView(postId),
    onError: (error) => {
      // Silently fail view tracking
    },
    retry: false
  });
};

// ===== TOPICS HOOKS =====

/**
 * Hook for fetching topics
 */
export const useTopics = () => {
  return useQuery({
    queryKey: ['broadcasts', 'topics'],
    queryFn: () => getTopics(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 1
  });
};