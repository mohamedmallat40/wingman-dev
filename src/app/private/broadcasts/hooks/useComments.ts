import { useCallback, useEffect, useState } from 'react';
import type { 
  Comment, 
  CommentFilters, 
  CreateCommentPayload, 
  UpdateCommentPayload, 
  UseCommentsReturn 
} from '../types/comments';
import { commentService } from '../services/commentService';

interface UseCommentsProps {
  postId: string;
  initialComments?: readonly Comment[];
  limit?: number;
  sortBy?: 'newest' | 'oldest' | 'popular';
}

export const useComments = ({
  postId,
  initialComments = [],
  limit = 20,
  sortBy = 'newest'
}: UseCommentsProps): UseCommentsReturn => {
  // Ensure initialComments is always an array
  const safeInitialComments = Array.isArray(initialComments) ? initialComments : [];
  
  const [comments, setComments] = useState<readonly Comment[]>(safeInitialComments);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(safeInitialComments.length === 0);
  const [total, setTotal] = useState(safeInitialComments.length);
  const [offset, setOffset] = useState(safeInitialComments.length);

  // Load initial comments
  const loadComments = useCallback(async (refresh = false) => {
    if (refresh) {
      setIsLoading(true);
      setOffset(0);
    }

    try {
      const filters: CommentFilters = {
        postId,
        limit,
        offset: refresh ? 0 : offset,
        sortBy
      };

      const response = await commentService.getComments(filters);
      
      // Handle different response structures and edge cases
      const responseComments = Array.isArray(response?.comments) ? response.comments : 
                              Array.isArray(response) ? response : [];
      const responseTotal = typeof response?.total === 'number' ? response.total : responseComments.length;
      const responseHasMore = typeof response?.hasMore === 'boolean' ? response.hasMore : false;
      
      if (refresh) {
        setComments(responseComments);
        setOffset(responseComments.length);
      } else {
        setComments(prev => {
          const prevArray = Array.isArray(prev) ? prev : [];
          return [...prevArray, ...responseComments];
        });
        setOffset(prev => prev + responseComments.length);
      }

      setTotal(responseTotal);
      setHasMore(responseHasMore);
      setError(null);
    } catch (err) {
      console.error('Error loading comments:', err);
      // Don't set error for empty responses or 404s - these are normal for posts with no comments
      if (err instanceof Error && (err.message.includes('404') || err.message.includes('No comments'))) {
        setComments([]);
        setTotal(0);
        setHasMore(false);
        setError(null);
      } else {
        setError(err as Error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [postId, limit, offset, sortBy]);

  // Load more comments
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const filters: CommentFilters = {
        postId,
        limit,
        offset,
        sortBy
      };

      const response = await commentService.getComments(filters);
      
      // Handle different response structures and edge cases
      const responseComments = Array.isArray(response?.comments) ? response.comments : 
                              Array.isArray(response) ? response : [];
      const responseHasMore = typeof response?.hasMore === 'boolean' ? response.hasMore : false;
      
      setComments(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return [...prevArray, ...responseComments];
      });
      setOffset(prev => prev + responseComments.length);
      setHasMore(responseHasMore);
      setError(null);
    } catch (err) {
      console.error('Error loading more comments:', err);
      // Don't set error for empty responses - just stop loading more
      if (err instanceof Error && (err.message.includes('404') || err.message.includes('No comments'))) {
        setHasMore(false);
        setError(null);
      } else {
        setError(err as Error);
      }
    } finally {
      setIsLoadingMore(false);
    }
  }, [postId, limit, offset, sortBy, isLoadingMore, hasMore]);

  // Refresh comments
  const refresh = useCallback(async () => {
    await loadComments(true);
  }, [loadComments]);

  // Create comment - simple approach without optimistic updates
  const createComment = useCallback(async (payload: CreateCommentPayload): Promise<Comment> => {
    try {
      const newComment = await commentService.createComment(payload);
      
      if (payload.parentId) {
        // Add as reply to existing comment (recursively search)
        const addReplyRecursive = (comments: readonly Comment[]): readonly Comment[] => {
          return comments.map(comment => {
            if (comment.id === payload.parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment],
                repliesCount: (comment.repliesCount || 0) + 1
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: addReplyRecursive(comment.replies)
              };
            }
            return comment;
          });
        };
        
        setComments(prev => addReplyRecursive(prev));
      } else {
        // Add as top-level comment
        setComments(prev => [newComment, ...prev]);
        setTotal(prev => prev + 1);
      }

      return newComment;
    } catch (err) {
      console.error('Failed to create comment:', err);
      throw err;
    }
  }, []);

  // Update comment
  const updateComment = useCallback(async (id: string, payload: UpdateCommentPayload): Promise<Comment> => {
    try {
      const updatedComment = await commentService.updateComment(id, payload);
      
      // Update comment in state
      const updateCommentRecursive = (comments: readonly Comment[]): readonly Comment[] => {
        return comments.map(comment => {
          if (comment.id === id) {
            return updatedComment;
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: updateCommentRecursive(comment.replies)
            };
          }
          return comment;
        });
      };

      setComments(prev => updateCommentRecursive(prev));
      return updatedComment;
    } catch (err) {
      throw err;
    }
  }, []);

  // Delete comment
  const deleteComment = useCallback(async (id: string): Promise<void> => {
    try {
      await commentService.deleteComment(id);
      
      // Remove comment from state
      const removeCommentRecursive = (comments: readonly Comment[]): readonly Comment[] => {
        return comments.filter(comment => {
          if (comment.id === id) {
            return false;
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: removeCommentRecursive(comment.replies),
              repliesCount: comment.replies.filter(reply => reply.id !== id).length
            };
          }
          return true;
        }).map(comment => ({
          ...comment,
          replies: comment.replies ? removeCommentRecursive(comment.replies) : undefined
        }));
      };

      setComments(prev => removeCommentRecursive(prev));
      setTotal(prev => Math.max(0, prev - 1));
    } catch (err) {
      throw err;
    }
  }, []);

  // Like comment
  const likeComment = useCallback(async (id: string): Promise<void> => {
    // Optimistic update
    const updateLikeRecursive = (comments: readonly Comment[]): readonly Comment[] => {
      return comments.map(comment => {
        if (comment.id === id) {
          return {
            ...comment,
            isLiked: true,
            likesCount: comment.likesCount + 1
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateLikeRecursive(comment.replies)
          };
        }
        return comment;
      });
    };

    setComments(prev => updateLikeRecursive(prev));

    try {
      await commentService.likeComment(id);
    } catch (err) {
      // Revert optimistic update
      const revertLikeRecursive = (comments: readonly Comment[]): readonly Comment[] => {
        return comments.map(comment => {
          if (comment.id === id) {
            return {
              ...comment,
              isLiked: false,
              likesCount: Math.max(0, comment.likesCount - 1)
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: revertLikeRecursive(comment.replies)
            };
          }
          return comment;
        });
      };

      setComments(prev => revertLikeRecursive(prev));
      throw err;
    }
  }, []);

  // Unlike comment
  const unlikeComment = useCallback(async (id: string): Promise<void> => {
    // Optimistic update
    const updateUnlikeRecursive = (comments: readonly Comment[]): readonly Comment[] => {
      return comments.map(comment => {
        if (comment.id === id) {
          return {
            ...comment,
            isLiked: false,
            likesCount: Math.max(0, comment.likesCount - 1)
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateUnlikeRecursive(comment.replies)
          };
        }
        return comment;
      });
    };

    setComments(prev => updateUnlikeRecursive(prev));

    try {
      await commentService.unlikeComment(id);
    } catch (err) {
      // Revert optimistic update
      const revertUnlikeRecursive = (comments: readonly Comment[]): readonly Comment[] => {
        return comments.map(comment => {
          if (comment.id === id) {
            return {
              ...comment,
              isLiked: true,
              likesCount: comment.likesCount + 1
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: revertUnlikeRecursive(comment.replies)
            };
          }
          return comment;
        });
      };

      setComments(prev => revertUnlikeRecursive(prev));
      throw err;
    }
  }, []);

  // Manual load function that can be called explicitly
  const loadInitialComments = useCallback(async () => {
    if (isLoading) return; // Prevent multiple simultaneous requests
    
    setIsLoading(true);
    setError(null);
    
    try {
      const filters: CommentFilters = {
        postId,
        limit,
        offset: 0,
        sortBy
      };

      const response = await commentService.getComments(filters);
      
      // Handle different response structures and edge cases
      const responseComments = Array.isArray(response?.comments) ? response.comments : 
                              Array.isArray(response) ? response : [];
      const responseTotal = typeof response?.total === 'number' ? response.total : responseComments.length;
      const responseHasMore = typeof response?.hasMore === 'boolean' ? response.hasMore : false;
      
      setComments(responseComments);
      setOffset(responseComments.length);
      setTotal(responseTotal);
      setHasMore(responseHasMore);
    } catch (err) {
      console.error('Error loading comments:', err);
      // Don't set error for empty responses or 404s - these are normal for posts with no comments
      if (err instanceof Error && (err.message.includes('404') || err.message.includes('No comments'))) {
        setComments([]);
        setTotal(0);
        setHasMore(false);
        setError(null);
      } else {
        setError(err as Error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [postId, limit, sortBy, isLoading]);

  return {
    comments,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    total,
    actions: {
      loadMore,
      refresh: loadInitialComments, // Use the manual load function as refresh
      createComment,
      updateComment,
      deleteComment,
      likeComment,
      unlikeComment,
      loadInitialComments // Expose the manual load function
    }
  };
};