import type { Comment, CreateCommentData, UpdateCommentData } from '../types/comments';

import { API_ROUTES } from '@/lib/api-routes';
import wingManApi from '@/lib/axios';

// ===== COMMENTS API =====

/**
 * Get comments for a specific post
 */
export const getComments = async (postId: string, params: { page?: number; limit?: number; sortBy?: string } = {}) => {
  const { page = 1, limit = 20, sortBy = 'newest' } = params;
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy
  });

  const response = await wingManApi.get(`${API_ROUTES.comments.byPost(postId)}?${queryParams}`);
  return response.data;
};

/**
 * Create a new comment
 */
export const createComment = async (commentData: CreateCommentData) => {
  // Extract postId from commentData to construct the correct endpoint
  const postId = commentData.postId;
  const response = await wingManApi.post(API_ROUTES.comments.create(postId), commentData);
  return response.data;
};

/**
 * Update an existing comment/reply
 */
export const updateComment = async (replyId: string, commentData: UpdateCommentData) => {
  const response = await wingManApi.patch(API_ROUTES.comments.update(replyId), commentData);
  return response.data;
};

/**
 * Delete a comment/reply
 */
export const deleteComment = async (replyId: string) => {
  const response = await wingManApi.delete(API_ROUTES.comments.delete(replyId));
  return response.data;
};

/**
 * Like a comment
 */
export const likeComment = async (commentId: string) => {
  const response = await wingManApi.post(API_ROUTES.comments.like(commentId));
  return response.data;
};

/**
 * Unlike a comment
 */
export const unlikeComment = async (commentId: string) => {
  const response = await wingManApi.delete(API_ROUTES.comments.like(commentId));
  return response.data;
};

/**
 * Get comment replies
 */
export const getCommentReplies = async (commentId: string, params: { page?: number; limit?: number } = {}) => {
  const { page = 1, limit = 10 } = params;
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });

  const response = await wingManApi.get(`${API_ROUTES.comments.replies(commentId)}?${queryParams}`);
  return response.data;
};