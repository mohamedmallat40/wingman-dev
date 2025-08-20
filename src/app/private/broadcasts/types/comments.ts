import type { UserSummary } from '@/types';

// Core comment interface matching API response
export interface Comment {
  readonly id: string;
  readonly response: string; // API returns 'response' field
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner: {
    readonly id: string;
    readonly email: string;
    readonly kind: string;
    readonly isMailVerified: boolean;
    readonly userName: string | null;
    readonly firstName: string;
    readonly lastName: string;
    readonly profileImage: string | null;
    readonly aboutMe: string | null;
    readonly city: string | null;
    readonly region: string | null;
    readonly profession: string | null;
    readonly workType: string;
    readonly statusAviability: string;
    readonly hourlyRate: number;
    readonly dailyRate: number;
    readonly experienceYears: number;
    readonly language: string;
    readonly created_at: string;
    readonly updated_at: string;
  };
  readonly taggedUsers: readonly any[]; // Tagged users in the comment
  readonly depth: number; // Nesting depth from API
  readonly replies: readonly Comment[]; // Nested replies

  // Computed/additional fields for UI
  readonly content?: string; // For compatibility
  readonly authorId?: string; // For compatibility
  readonly author?: UserSummary; // For compatibility
  readonly postId?: string; // For compatibility
  readonly parentId?: string; // For nested replies
  readonly isEdited?: boolean; // Computed from createdAt !== updatedAt
  readonly likesCount?: number; // May not be in API yet
  readonly repliesCount?: number; // Computed from replies.length
  readonly isLiked?: boolean; // Current user's like status
  readonly mentions?: readonly UserSummary[]; // @mentioned users
}

// Comment creation payload
export interface CreateCommentPayload {
  readonly response: string; // API expects 'response' not 'content'
  readonly postId: string;
  readonly parentId?: string;
  readonly taggedUsers?: readonly string[]; // User IDs for mentioned users
}

// Legacy alias for service compatibility
export interface CreateCommentData extends CreateCommentPayload {}

// Comment update payload
export interface UpdateCommentPayload {
  readonly response: string; // API expects 'response' not 'content'
  readonly taggedUsers?: readonly string[]; // User IDs for mentioned users
}

// Legacy alias for service compatibility
export interface UpdateCommentData extends UpdateCommentPayload {}

// Comment filters for API
export interface CommentFilters {
  readonly postId: string;
  readonly parentId?: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: 'newest' | 'oldest' | 'popular';
}

// Comment list response
export interface CommentListResponse {
  readonly comments: readonly Comment[];
  readonly total: number;
  readonly hasMore: boolean;
  readonly nextOffset?: number;
}

// Comment action types
export type CommentAction = 'like' | 'unlike' | 'reply' | 'edit' | 'delete' | 'report';

// Comment UI state
export interface CommentUIState {
  readonly isExpanded: boolean;
  readonly isReplying: boolean;
  readonly isEditing: boolean;
  readonly showReplies: boolean;
  readonly replyInputValue: string;
  readonly editInputValue: string;
}

// Component props interfaces
export interface CommentSectionProps {
  readonly postId: string;
  readonly initialComments?: readonly Comment[];
  readonly totalComments?: number;
  readonly className?: string;
  readonly maxDepth?: number; // Maximum nesting depth
  readonly enableMentions?: boolean;
  readonly enableRichText?: boolean;
}

export interface CommentItemProps {
  readonly comment: Comment;
  readonly onAction: (action: CommentAction, comment: Comment) => void;
  readonly onReply: (parentId: string, content: string, mentions?: string[]) => void;
  readonly onEdit: (commentId: string, content: string, mentions?: string[]) => void;
  readonly className?: string;
  readonly maxDepth?: number;
  readonly currentDepth?: number;
  readonly enableMentions?: boolean;
  readonly enableRichText?: boolean;
}

export interface CommentInputProps {
  readonly onSubmit: (content: string, mentions?: string[]) => void;
  readonly placeholder?: string;
  readonly autoFocus?: boolean;
  readonly className?: string;
  readonly enableMentions?: boolean;
  readonly enableRichText?: boolean;
  readonly isLoading?: boolean;
  readonly maxLength?: number;
  readonly initialValue?: string;
  readonly showCancel?: boolean;
  readonly onCancel?: () => void;
}

export interface CommentActionsProps {
  readonly comment: Comment;
  readonly onAction: (action: CommentAction) => void;
  readonly showReplyButton?: boolean;
  readonly showEditButton?: boolean;
  readonly showDeleteButton?: boolean;
  readonly className?: string;
}

// Hook return types
export interface UseCommentsReturn {
  readonly comments: readonly Comment[];
  readonly isLoading: boolean;
  readonly isLoadingMore: boolean;
  readonly error: Error | null;
  readonly hasMore: boolean;
  readonly total: number;
  readonly actions: {
    readonly loadMore: () => Promise<void>;
    readonly refresh: () => Promise<void>;
    readonly createComment: (payload: CreateCommentPayload) => Promise<Comment>;
    readonly updateComment: (id: string, payload: UpdateCommentPayload) => Promise<Comment>;
    readonly deleteComment: (id: string) => Promise<void>;
    readonly likeComment: (id: string) => Promise<void>;
    readonly unlikeComment: (id: string) => Promise<void>;
    readonly loadInitialComments: () => Promise<void>;
  };
}

export interface UseCommentUIReturn {
  readonly uiState: Record<string, CommentUIState>;
  readonly actions: {
    readonly toggleExpanded: (commentId: string) => void;
    readonly setReplying: (commentId: string, isReplying: boolean) => void;
    readonly setEditing: (commentId: string, isEditing: boolean) => void;
    readonly toggleShowReplies: (commentId: string) => void;
    readonly setReplyInput: (commentId: string, value: string) => void;
    readonly setEditInput: (commentId: string, value: string) => void;
    readonly resetUI: (commentId: string) => void;
  };
}

// Mention detection and parsing
export interface MentionMatch {
  readonly username: string;
  readonly userId: string;
  readonly startIndex: number;
  readonly endIndex: number;
}

export interface ParsedComment {
  readonly text: string;
  readonly mentions: readonly MentionMatch[];
  readonly formattedText: string; // HTML with mentions highlighted
}

// Real-time updates
export interface CommentUpdateEvent {
  readonly type: 'comment_created' | 'comment_updated' | 'comment_deleted' | 'comment_liked';
  readonly postId: string;
  readonly comment?: Comment;
  readonly commentId?: string;
  readonly userId?: string;
}

// Performance optimization
export interface CommentVirtualizationConfig {
  readonly itemHeight: number;
  readonly overscan: number;
  readonly threshold: number;
}

// Accessibility
export interface CommentA11yProps {
  readonly commentId: string;
  readonly authorName: string;
  readonly createdAt: string;
  readonly content: string;
  readonly likesCount: number;
  readonly repliesCount: number;
  readonly isLiked: boolean;
  readonly depth: number;
}
