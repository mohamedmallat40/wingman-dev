import type {
  CommentData,
  CreatePostData,
  FeedParams,
  SearchParams,
  UpdatePostData
} from '../services/broadcast.service';

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addComment,
  createPost,
  deleteComment,
  deleteDraft,
  deletePost,
  getBroadcastFeed,
  getDrafts,
  getPostAnalytics,
  getPostById,
  getPostComments,
  getTopicById,
  getTopics,
  getTrendingPosts,
  getUserAnalytics,
  saveDraft,
  searchPosts,
  sharePost,
  subscribeToTopic,
  togglePostBookmark,
  togglePostLike,
  trackPostView,
  unsubscribeFromTopic,
  updateComment,
  updatePost,
  voteComment
} from '../services/broadcast.service';
import { type BroadcastPost } from '../types';

// ===== FEED HOOKS =====

/**
 * Hook for fetching broadcast feed with infinite scroll
 */
export const useBroadcastFeed = (params: Omit<FeedParams, 'page'> = {}) => {
  return useInfiniteQuery({
    queryKey: ['broadcasts', 'feed', params],
    queryFn: ({ pageParam = 1 }) => getBroadcastFeed({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false
  });
};

/**
 * Hook for fetching trending posts
 */
export const useTrendingPosts = (limit = 10) => {
  return useQuery({
    queryKey: ['broadcasts', 'trending', limit],
    queryFn: () => getTrendingPosts(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  });
};

/**
 * Hook for fetching a specific post
 */
export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ['broadcasts', 'post', postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 10 // 10 minutes
  });
};

/**
 * Hook for searching posts
 */
export const useSearchPosts = (searchParams: SearchParams) => {
  return useQuery({
    queryKey: ['broadcasts', 'search', searchParams],
    queryFn: () => searchPosts(searchParams),
    enabled: !!searchParams.query.trim(),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

// ===== POST MANAGEMENT HOOKS =====

/**
 * Hook for creating a new post
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: CreatePostData) => createPost(postData),
    onSuccess: (newPost) => {
      // Invalidate and refetch feed queries
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'feed'] });
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'trending'] });

      // Add the new post to existing cache
      queryClient.setQueryData(['broadcasts', 'post', newPost.id], newPost);
    },
    onError: (error) => {
      // Error is handled by UI error state
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
    mutationFn: ({ postId, updateData }: { postId: string; updateData: UpdatePostData }) =>
      updatePost(postId, updateData),
    onSuccess: (updatedPost) => {
      // Update specific post in cache
      queryClient.setQueryData(['broadcasts', 'post', updatedPost.id], updatedPost);

      // Invalidate feed queries
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'feed'] });
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'trending'] });
    },
    onError: (error) => {
      // Error is handled by UI error state
    }
  });
};

/**
 * Hook for deleting a post
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: (_, postId) => {
      // Remove post from cache
      queryClient.removeQueries({ queryKey: ['broadcasts', 'post', postId] });

      // Invalidate feed queries
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'feed'] });
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'trending'] });
    },
    onError: (error) => {
      // Error is handled by UI error state
    }
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
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['broadcasts', 'post', postId] });

      // Snapshot previous value
      const previousPost = queryClient.getQueryData<BroadcastPost>(['broadcasts', 'post', postId]);

      // Optimistically update the cache
      if (previousPost) {
        const updatedPost = {
          ...previousPost,
          isLiked: !previousPost.isLiked,
          engagement: {
            ...previousPost.engagement,
            likes: previousPost.isLiked
              ? previousPost.engagement.likes - 1
              : previousPost.engagement.likes + 1
          }
        };

        queryClient.setQueryData(['broadcasts', 'post', postId], updatedPost);
      }

      return { previousPost };
    },
    onError: (error, postId, context) => {
      // Revert optimistic update on error
      if (context?.previousPost) {
        queryClient.setQueryData(['broadcasts', 'post', postId], context.previousPost);
      }
      // Error is handled by UI error state
    },
    onSettled: (_, __, postId) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'post', postId] });
    }
  });
};

/**
 * Hook for bookmarking/unbookmarking posts
 */
export const useBookmarkPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => togglePostBookmark(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['broadcasts', 'post', postId] });

      const previousPost = queryClient.getQueryData<BroadcastPost>(['broadcasts', 'post', postId]);

      if (previousPost) {
        const updatedPost = {
          ...previousPost,
          isBookmarked: !previousPost.isBookmarked,
          engagement: {
            ...previousPost.engagement,
            bookmarks: previousPost.isBookmarked
              ? previousPost.engagement.bookmarks - 1
              : previousPost.engagement.bookmarks + 1
          }
        };

        queryClient.setQueryData(['broadcasts', 'post', postId], updatedPost);
      }

      return { previousPost };
    },
    onError: (error, postId, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(['broadcasts', 'post', postId], context.previousPost);
      }
      // Error is handled by UI error state
    },
    onSettled: (_, __, postId) => {
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'post', postId] });
    }
  });
};

/**
 * Hook for sharing posts
 */
export const useSharePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      shareData
    }: {
      postId: string;
      shareData?: { message?: string; platform?: string };
    }) => sharePost(postId, shareData),
    onSuccess: (_, { postId }) => {
      // Update share count optimistically
      const post = queryClient.getQueryData<BroadcastPost>(['broadcasts', 'post', postId]);
      if (post) {
        queryClient.setQueryData(['broadcasts', 'post', postId], {
          ...post,
          engagement: {
            ...post.engagement,
            shares: post.engagement.shares + 1
          }
        });
      }
    },
    onError: (error) => {
      // Error is handled by UI error state
    }
  });
};

/**
 * Hook for tracking post views
 */
export const useTrackPostView = () => {
  return useMutation({
    mutationFn: (postId: string) => trackPostView(postId),
    onError: (error) => {
      // Error tracking failure is non-critical
    }
  });
};

// ===== COMMENTS HOOKS =====

/**
 * Hook for fetching post comments
 */
export const usePostComments = (postId: string) => {
  return useInfiniteQuery({
    queryKey: ['broadcasts', 'comments', postId],
    queryFn: ({ pageParam = 1 }) => getPostComments(postId, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    enabled: !!postId,
    staleTime: 1000 * 60 * 5
  });
};

/**
 * Hook for adding comments
 */
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentData }: { postId: string; commentData: CommentData }) =>
      addComment(postId, commentData),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'comments', postId] });

      // Update comment count
      const post = queryClient.getQueryData<BroadcastPost>(['broadcasts', 'post', postId]);
      if (post) {
        queryClient.setQueryData(['broadcasts', 'post', postId], {
          ...post,
          engagement: {
            ...post.engagement,
            comments: post.engagement.comments + 1
          }
        });
      }
    },
    onError: (error) => {
      // Error is handled by UI error state
    }
  });
};

/**
 * Hook for updating comments
 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      updateComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'comments'] });
    },
    onError: (error) => {
      // Error is handled by UI error state
    }
  });
};

/**
 * Hook for deleting comments
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'comments'] });
    },
    onError: (error) => {
      // Error is handled by UI error state
    }
  });
};

/**
 * Hook for voting on comments
 */
export const useVoteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, voteType }: { commentId: string; voteType: 'up' | 'down' }) =>
      voteComment(commentId, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'comments'] });
    },
    onError: (error) => {
      // Error is handled by UI error state
    }
  });
};

// ===== TOPICS HOOKS =====

/**
 * Hook for fetching topics
 */
export const useTopics = () => {
  return useQuery({
    queryKey: ['broadcasts', 'topics'],
    queryFn: async () => {
      const result = await getTopics();
      return result;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: false
  });
};

/**
 * Hook for fetching specific topic
 */
export const useTopic = (topicId: string) => {
  return useQuery({
    queryKey: ['broadcasts', 'topic', topicId],
    queryFn: () => getTopicById(topicId),
    enabled: !!topicId,
    staleTime: 1000 * 60 * 10
  });
};

/**
 * Hook for subscribing to topics
 */
export const useSubscribeToTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topicId: string) => subscribeToTopic(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'topics'] });
    },
    onError: (error) => {
      // Error is handled by UI error state
    }
  });
};

/**
 * Hook for unsubscribing from topics
 */
export const useUnsubscribeFromTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topicId: string) => unsubscribeFromTopic(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'topics'] });
    },
    onError: (error) => {
      // Error is handled by UI error state
    }
  });
};

// ===== DRAFTS HOOKS =====

/**
 * Hook for fetching user drafts
 */
export const useDrafts = () => {
  return useQuery({
    queryKey: ['broadcasts', 'drafts'],
    queryFn: getDrafts,
    staleTime: 1000 * 60 * 5
  });
};

/**
 * Hook for saving drafts
 */
export const useSaveDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draftData: Parameters<typeof saveDraft>[0]) => saveDraft(draftData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'drafts'] });
    },
    onError: (error) => {
      // Error is handled by UI error state
    },
    retry: false
  });
};

/**
 * Hook for deleting drafts
 */
export const useDeleteDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draftId: string) => deleteDraft(draftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broadcasts', 'drafts'] });
    },
    onError: (error) => {
      // Error is handled by UI error state
    }
  });
};

// ===== ANALYTICS HOOKS =====

/**
 * Hook for fetching user analytics
 */
export const useUserAnalytics = (timeRange = '30d') => {
  return useQuery({
    queryKey: ['broadcasts', 'analytics', 'user', timeRange],
    queryFn: () => getUserAnalytics(timeRange),
    staleTime: 1000 * 60 * 10
  });
};

/**
 * Hook for fetching post analytics
 */
export const usePostAnalytics = (postId: string) => {
  return useQuery({
    queryKey: ['broadcasts', 'analytics', 'post', postId],
    queryFn: () => getPostAnalytics(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5
  });
};
