// Import types for legacy aliases
import type { Category, Status, Tag, UserSummary } from '@/types';
import type {
  CreateDocumentPayload,
  Document,
  DocumentFilters,
  DocumentListResponse,
  DocumentType,
  ShareDocumentPayload,
  ViewMode
} from './types/index';

/**
 * @deprecated Use types from ./types/index.ts instead
 * This file is kept for backward compatibility and will be removed in a future version
 */

// Re-export new types for backward compatibility
export * from './types/index';

// Legacy type aliases - will be removed
/** @deprecated Use Document instead */
export type IDocument = Document;

/** @deprecated Use UserSummary instead */
export type SharedUser = UserSummary;

/** @deprecated Use Tag instead */
export type DocumentTag = Tag;

/** @deprecated Use Category instead */
export type DocumentCategory = Category;

/** @deprecated Use Status instead */
export type DocumentStatus = Status;

/** @deprecated Use ShareDocumentPayload instead */
export type DocumentShareData = ShareDocumentPayload;

/** @deprecated Use CreateDocumentPayload instead */
export type DocumentUploadData = CreateDocumentPayload;

/** @deprecated Use DocumentFilters instead */
export type DocumentFiltersState = DocumentFilters;

/** @deprecated Use DocumentListResponse instead */
export type DocumentApiResponse = DocumentListResponse;

/** @deprecated Use ApiResponse<Document> instead */
export interface DocumentShareResponse {
  success: boolean;
  message: string;
  data?: Document;
}
