// Export all comment components
export { CommentSection } from './CommentSection';
export { CommentItem } from './CommentItem';
export { CommentInput } from './CommentInput';
export { CommentActions } from './CommentActions';
export { CommentSkeleton } from './CommentSkeleton';

// Export types
export * from '../../types/comments';

// Export hooks
export { useComments } from '../../hooks/useComments';
export { useCommentUI } from '../../hooks/useCommentUI';

// Export services
export { commentService } from '../../services/commentService';