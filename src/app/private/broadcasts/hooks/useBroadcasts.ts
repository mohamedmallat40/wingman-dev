import type {
  FeedParams,
  CreatePostData
} from '../types';

import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getBroadcastFeed,
  getTopics,
  followTopic,
  unfollowTopic,
  togglePostBookmark,
  togglePostLike,
  trackPostView,
  updatePost,
  deletePost
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

/**
 * Hook for updating a post
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, postData }: { postId: string; postData: CreatePostData }) => 
      updatePost(postId, postData),
    onSuccess: (response, { postId }) => {
      // Only invalidate feed queries - no need to invalidate individual post query
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'feed'] });
    },
    onError: (error) => {
      console.error('Failed to update post:', error);
    },
    retry: 1
  });
};

/**
 * Hook for deleting a post
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: (response, postId) => {
      // Invalidate feed queries to remove the deleted post
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'feed'] });
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'post', postId] });
    },
    onError: (error) => {
      console.error('Failed to delete post:', error);
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

/**
 * Hook for following a topic
 */
export const useFollowTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topicId: string) => followTopic(topicId),
    onSuccess: (response, topicId) => {
      // Update the topics cache to reflect the new follow status
      queryClient.setQueryData(['broadcasts', 'topics'], (oldData: any) => {
        if (!oldData) return oldData;
        
        return oldData.map((topic: any) => 
          topic.id === topicId 
            ? { ...topic, isFollowed: true, followerCount: topic.followerCount + 1 }
            : topic
        );
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'topics'] });
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'feed'] });
    },
    onError: (error) => {
      // Error handling can be done in the UI
      console.error('Failed to follow topic:', error);
    },
    retry: 1
  });
};

/**
 * Hook for unfollowing a topic
 */
export const useUnfollowTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topicId: string) => unfollowTopic(topicId),
    onSuccess: (response, topicId) => {
      // Update the topics cache to reflect the new follow status
      queryClient.setQueryData(['broadcasts', 'topics'], (oldData: any) => {
        if (!oldData) return oldData;
        
        return oldData.map((topic: any) => 
          topic.id === topicId 
            ? { ...topic, isFollowed: false, followerCount: Math.max(0, topic.followerCount - 1) }
            : topic
        );
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'topics'] });
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'feed'] });
    },
    onError: (error) => {
      // Error handling can be done in the UI
      console.error('Failed to unfollow topic:', error);
    },
    retry: 1
  });
};