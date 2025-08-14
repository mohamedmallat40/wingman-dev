import { API_ROUTES } from '@/lib/api-routes';
import wingManApi from '@/lib/axios';

import { type BroadcastPost, type Comment, type PostInteraction } from '../types';

// ===== TYPES =====
export interface CreatePostData {
  type: BroadcastPost['type'];
  title: string;
  content: string;
  category: string;
  tags?: string[];
  priority?: 'low' | 'normal' | 'high';
  topicId?: string;
  media?: {
    type: 'video' | 'image' | 'gallery';
    files?: File[];
    urls?: string[];
  };
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  tags?: string[];
  priority?: 'low' | 'normal' | 'high';
}

export interface FeedParams {
  page?: number;
  limit?: number;
  topicId?: string;
  sortBy?: 'newest' | 'trending' | 'popular';
  category?: string;
}

export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
  filters?: {
    type?: BroadcastPost['type'][];
    category?: string[];
    dateRange?: {
      from: string;
      to: string;
    };
    author?: string[];
    tags?: string[];
  };
}

export interface CommentData {
  content: string;
  parentId?: string; // for replies
}

// ===== POSTS API =====

/**
 * Get broadcast feed with pagination and filters
 */
export const getBroadcastFeed = async (params: FeedParams = {}) => {
  const { page = 1, limit = 10, topicId, sortBy = 'newest', category } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy
  });

  if (topicId) queryParams.append('topicId', topicId);
  if (category) queryParams.append('category', category);

  const response = await wingManApi.get(`${API_ROUTES.broadcasts.feed}?${queryParams}`);
  return response.data;
};

/**
 * Get trending posts
 */
export const getTrendingPosts = async (limit = 10) => {
  const response = await wingManApi.get(`${API_ROUTES.broadcasts.trending}?limit=${limit}`);
  return response.data;
};

/**
 * Get a specific post by ID
 */
export const getPostById = async (postId: string) => {
  const response = await wingManApi.get(`${API_ROUTES.broadcasts.posts}/${postId}`);
  return response.data;
};

/**
 * Create a new broadcast post
 */
export const createPost = async (postData: CreatePostData) => {
  // If there are files to upload, use FormData
  if (postData.media?.files && postData.media.files.length > 0) {
    const formData = new FormData();

    // Add basic post data
    formData.append('type', postData.type);
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('category', postData.category);

    if (postData.tags) {
      formData.append('tags', JSON.stringify(postData.tags));
    }

    if (postData.priority) {
      formData.append('priority', postData.priority);
    }

    if (postData.topicId) {
      formData.append('topicId', postData.topicId);
    }


    // Add media files
    postData.media.files.forEach((file, index) => {
      formData.append(`media_${index}`, file);
    });

    formData.append('mediaType', postData.media.type);

    const response = await wingManApi.post(API_ROUTES.broadcasts.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  }

  // For posts without file uploads
  const response = await wingManApi.post(API_ROUTES.broadcasts.create, postData);
  return response.data;
};

/**
 * Update a broadcast post
 */
export const updatePost = async (postId: string, updateData: UpdatePostData) => {
  const response = await wingManApi.put(`${API_ROUTES.broadcasts.posts}/${postId}`, updateData);
  return response.data;
};

/**
 * Delete a broadcast post
 */
export const deletePost = async (postId: string) => {
  const response = await wingManApi.delete(`${API_ROUTES.broadcasts.posts}/${postId}`);
  return response.data;
};

/**
 * Search posts
 */
export const searchPosts = async (searchParams: SearchParams) => {
  const response = await wingManApi.post(API_ROUTES.broadcasts.search, searchParams);
  return response.data;
};

// ===== ENGAGEMENT API =====

/**
 * Like/unlike a post
 */
export const togglePostLike = async (postId: string) => {
  const response = await wingManApi.post(`${API_ROUTES.broadcasts.like}/${postId}/like`);
  return response.data;
};

/**
 * Bookmark/unbookmark a post
 */
export const togglePostBookmark = async (postId: string) => {
  const response = await wingManApi.post(`${API_ROUTES.broadcasts.bookmark}/${postId}/bookmark`);
  return response.data;
};

/**
 * Share a post
 */
export const sharePost = async (
  postId: string,
  shareData?: { message?: string; platform?: string }
) => {
  const response = await wingManApi.post(
    `${API_ROUTES.broadcasts.share}/${postId}/share`,
    shareData
  );
  return response.data;
};

/**
 * Track post view
 */
export const trackPostView = async (postId: string) => {
  const response = await wingManApi.post(`${API_ROUTES.broadcasts.posts}/${postId}/view`);
  return response.data;
};

// ===== COMMENTS API =====

/**
 * Get comments for a post
 */
export const getPostComments = async (postId: string, page = 1, limit = 20) => {
  const response = await wingManApi.get(
    `${API_ROUTES.broadcasts.comment}/${postId}/comments?page=${page}&limit=${limit}`
  );
  return response.data;
};

/**
 * Add a comment to a post
 */
export const addComment = async (postId: string, commentData: CommentData) => {
  const response = await wingManApi.post(
    `${API_ROUTES.broadcasts.comment}/${postId}/comments`,
    commentData
  );
  return response.data;
};

/**
 * Update a comment
 */
export const updateComment = async (commentId: string, content: string) => {
  const response = await wingManApi.put(`/comments/${commentId}`, { content });
  return response.data;
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId: string) => {
  const response = await wingManApi.delete(`/comments/${commentId}`);
  return response.data;
};

/**
 * Vote on a comment (upvote/downvote)
 */
export const voteComment = async (commentId: string, voteType: 'up' | 'down') => {
  const response = await wingManApi.post(`/comments/${commentId}/vote`, { type: voteType });
  return response.data;
};

// ===== TOPICS API =====

/**
 * Get all topics (categories/channels)
 */
export const getTopics = async () => {
  const response = await wingManApi.get(API_ROUTES.broadcasts.topics);
  return response.data;
};

/**
 * Get topic details
 */
export const getTopicById = async (topicId: string) => {
  const response = await wingManApi.get(`${API_ROUTES.broadcasts.topics}/${topicId}`);
  return response.data;
};

/**
 * Subscribe to a topic
 */
export const subscribeToTopic = async (topicId: string) => {
  const response = await wingManApi.post(`${API_ROUTES.broadcasts.topics}/${topicId}/subscribe`);
  return response.data;
};

/**
 * Unsubscribe from a topic
 */
export const unsubscribeFromTopic = async (topicId: string) => {
  const response = await wingManApi.delete(`${API_ROUTES.broadcasts.topics}/${topicId}/subscribe`);
  return response.data;
};

// ===== ANALYTICS API =====

/**
 * Get user's broadcast analytics
 */
export const getUserAnalytics = async (timeRange = '30d') => {
  const response = await wingManApi.get(`/broadcasts/analytics?range=${timeRange}`);
  return response.data;
};

/**
 * Get post analytics
 */
export const getPostAnalytics = async (postId: string) => {
  const response = await wingManApi.get(`${API_ROUTES.broadcasts.posts}/${postId}/analytics`);
  return response.data;
};

// ===== DRAFTS API =====

/**
 * Save post as draft
 */
export const saveDraft = async (draftData: Partial<CreatePostData> & { id?: string }) => {
  if (draftData.id) {
    const response = await wingManApi.put(`/broadcasts/drafts/${draftData.id}`, draftData);
    return response.data;
  } else {
    const response = await wingManApi.post('/broadcasts/drafts', draftData);
    return response.data;
  }
};

/**
 * Get user's drafts
 */
export const getDrafts = async () => {
  const response = await wingManApi.get('/broadcasts/drafts');
  return response.data;
};

/**
 * Delete a draft
 */
export const deleteDraft = async (draftId: string) => {
  const response = await wingManApi.delete(`/broadcasts/drafts/${draftId}`);
  return response.data;
};
