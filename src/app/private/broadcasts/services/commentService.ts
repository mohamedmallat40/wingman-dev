import type { AxiosRequestConfig } from 'axios';
import type { 
  Comment, 
  CommentFilters, 
  CommentListResponse, 
  CreateCommentPayload, 
  UpdateCommentPayload 
} from '../types/comments';
import wingManApi from '@/lib/axios';

class CommentService {
  private readonly baseUrl = '/comments';

  // Get comments for a broadcast post
  async getComments(filters: CommentFilters, config?: AxiosRequestConfig): Promise<CommentListResponse> {
    const params = new URLSearchParams();
    
    if (filters.parentId) params.append('parentId', filters.parentId);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    // Use the broadcast-specific endpoint
    const endpoint = `/broadcast/${filters.postId}/reply${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await wingManApi.get<CommentListResponse>(endpoint, config);

    return response.data;
  }

  // Get a single comment
  async getComment(id: string, config?: AxiosRequestConfig): Promise<Comment> {
    const response = await wingManApi.get<Comment>(`${this.baseUrl}/${id}`, config);
    return response.data;
  }

  // Create a new comment
  async createComment(payload: CreateCommentPayload, config?: AxiosRequestConfig): Promise<Comment> {
    // Use the broadcast-specific endpoint for creating comments
    const endpoint = `/broadcast/${payload.postId}/reply`;
    
    // Prepare the request body with correct field names for the API
    const requestBody = {
      response: payload.content, // API expects 'response' not 'content'
      parentReplyId: payload.parentId || null, // Map parentId to parentReplyId, null for root comments
      mentions: payload.mentions || []
    };
    
    console.log('Creating comment:', { endpoint, requestBody });
    
    const response = await wingManApi.post<Comment>(endpoint, requestBody, config);
    return response.data;
  }

  // Update an existing comment
  async updateComment(
    id: string, 
    payload: UpdateCommentPayload, 
    config?: AxiosRequestConfig
  ): Promise<Comment> {
    // Map internal 'content' to API 'response' field
    const requestBody = {
      response: payload.content, // API expects 'response' not 'content'
      mentions: payload.mentions || []
    };
    
    const response = await wingManApi.patch<Comment>(`${this.baseUrl}/${id}`, requestBody, config);
    return response.data;
  }

  // Delete a comment
  async deleteComment(id: string, config?: AxiosRequestConfig): Promise<void> {
    await wingManApi.delete(`${this.baseUrl}/${id}`, config);
  }

  // Like a comment
  async likeComment(id: string, config?: AxiosRequestConfig): Promise<void> {
    await wingManApi.post(`${this.baseUrl}/${id}/like`, {}, config);
  }

  // Unlike a comment
  async unlikeComment(id: string, config?: AxiosRequestConfig): Promise<void> {
    await wingManApi.delete(`${this.baseUrl}/${id}/like`, config);
  }

  // Get replies for a comment
  async getReplies(
    postId: string,
    parentId: string, 
    filters?: Omit<CommentFilters, 'postId' | 'parentId'>,
    config?: AxiosRequestConfig
  ): Promise<CommentListResponse> {
    const params = new URLSearchParams();
    
    params.append('parentId', parentId);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);

    // Use the broadcast-specific endpoint for replies
    const endpoint = `/broadcast/${postId}/reply?${params.toString()}`;

    const response = await wingManApi.get<CommentListResponse>(endpoint, config);

    return response.data;
  }

  // Report a comment
  async reportComment(
    id: string, 
    reason: string, 
    config?: AxiosRequestConfig
  ): Promise<void> {
    await wingManApi.post(
      `${this.baseUrl}/${id}/report`, 
      { reason }, 
      config
    );
  }

  // Pin/unpin a comment (admin/moderator feature)
  async pinComment(id: string, config?: AxiosRequestConfig): Promise<Comment> {
    const response = await wingManApi.post<Comment>(`${this.baseUrl}/${id}/pin`, {}, config);
    return response.data;
  }

  async unpinComment(id: string, config?: AxiosRequestConfig): Promise<Comment> {
    const response = await wingManApi.delete<Comment>(`${this.baseUrl}/${id}/pin`, config);
    return response.data;
  }

  // Get comment statistics
  async getCommentStats(postId: string, config?: AxiosRequestConfig): Promise<{
    total: number;
    totalReplies: number;
    totalLikes: number;
    recentActivity: Date;
  }> {
    const response = await wingManApi.get(`${this.baseUrl}/stats/${postId}`, config);
    return response.data;
  }

  // Search comments
  async searchComments(
    query: string,
    filters?: Partial<CommentFilters>,
    config?: AxiosRequestConfig
  ): Promise<CommentListResponse> {
    const params = new URLSearchParams();
    
    params.append('q', query);
    if (filters?.postId) params.append('postId', filters.postId);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);

    const response = await wingManApi.get<CommentListResponse>(
      `${this.baseUrl}/search?${params.toString()}`,
      config
    );

    return response.data;
  }

  // Get mentions in comments
  async getMentions(
    userId: string,
    filters?: {
      limit?: number;
      offset?: number;
      unreadOnly?: boolean;
    },
    config?: AxiosRequestConfig
  ): Promise<CommentListResponse> {
    const params = new URLSearchParams();
    
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    if (filters?.unreadOnly) params.append('unreadOnly', 'true');

    const response = await wingManApi.get<CommentListResponse>(
      `${this.baseUrl}/mentions/${userId}?${params.toString()}`,
      config
    );

    return response.data;
  }

  // Mark mentions as read
  async markMentionsAsRead(
    userId: string,
    commentIds: string[],
    config?: AxiosRequestConfig
  ): Promise<void> {
    await wingManApi.post(
      `${this.baseUrl}/mentions/${userId}/mark-read`,
      { commentIds },
      config
    );
  }
}

export const commentService = new CommentService();