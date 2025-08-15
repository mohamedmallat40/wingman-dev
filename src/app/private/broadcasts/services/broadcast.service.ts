import { API_ROUTES } from '@/lib/api-routes';
import wingManApi from '@/lib/axios';

// ===== TYPES =====
export interface CreatePostData {
  title: string;
  description: string;
  topics: string[]; // Array of topic UUIDs
  skills: string[]; // Array of skill UUIDs
  attachments: string[]; // Array of filenames from successful uploads
}

export interface FeedParams {
  page?: number;
  limit?: number;
  topics?: string[]; // Array of topic IDs for filtering
}

// ===== POSTS API =====

/**
 * Get broadcast feed with pagination and topic filters
 */
export const getBroadcastFeed = async (params: FeedParams = {}) => {
  const { page = 1, limit = 10, topics } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });

  // Add multiple topics as separate query parameters
  if (topics && topics.length > 0) {
    topics.forEach((topicId) => {
      queryParams.append('topics', topicId);
    });
  }

  const response = await wingManApi.get(`${API_ROUTES.broadcasts.feed}?${queryParams}`);

  // Handle different response structures
  const responseData = response.data;

  // If response is directly an array, wrap it in pagination structure
  if (Array.isArray(responseData)) {
    return {
      data: responseData,
      currentPage: page,
      hasNextPage: responseData.length === limit, // Assume more pages if we got full limit
      totalPages: Math.ceil((responseData.length + (page - 1) * limit) / limit),
      totalItems: responseData.length + (page - 1) * limit
    };
  }

  // If response has data property, use it
  if (responseData.data && Array.isArray(responseData.data)) {
    return {
      data: responseData.data,
      currentPage: responseData.currentPage || page,
      hasNextPage: responseData.hasNextPage || responseData.data.length === limit,
      totalPages:
        responseData.totalPages ||
        Math.ceil((responseData.data.length + (page - 1) * limit) / limit),
      totalItems: responseData.totalItems || responseData.data.length + (page - 1) * limit
    };
  }

  // Fallback: return empty structure
  return {
    data: [],
    currentPage: page,
    hasNextPage: false,
    totalPages: 1,
    totalItems: 0
  };
};

/**
 * Create a new broadcast post
 */
export const createPost = async (postData: CreatePostData) => {
  // Send as JSON with only the required fields
  const response = await wingManApi.post(API_ROUTES.broadcasts.create, postData);
  return response.data;
};

/**
 * Update an existing broadcast post
 */
export const updatePost = async (postId: string, postData: CreatePostData) => {
  const response = await wingManApi.patch(`/broadcast/${postId}`, postData);
  return response.data;
};

/**
 * Delete a broadcast post
 */
export const deletePost = async (postId: string) => {
  const response = await wingManApi.delete(`/broadcast/${postId}`);
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
 * Track post view
 */
export const trackPostView = async (postId: string) => {
  const response = await wingManApi.post(`${API_ROUTES.broadcasts.posts}/${postId}/view`);
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
 * Follow a topic
 */
export const followTopic = async (topicId: string) => {
  const response = await wingManApi.post(`/broadcast/topics/${topicId}/follow`);
  return response.data;
};

/**
 * Unfollow a topic
 */
export const unfollowTopic = async (topicId: string) => {
  const response = await wingManApi.delete(`/broadcast/topics/${topicId}/follow`);
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
