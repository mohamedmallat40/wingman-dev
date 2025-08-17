/**
 * @deprecated Use types from ./types/index.ts instead
 * This file is kept for backward compatibility and will be removed in a future version
 */

// Re-export new types for backward compatibility
export * from './types/index';

// Import types for legacy aliases
import type { 
  Document, 
  DocumentType,
  ViewMode,
  DocumentFilters,
  DocumentListResponse,
  ShareDocumentPayload,
  CreateDocumentPayload
} from './types/index';
import type { UserSummary, Tag, Category, Status } from '@/types';

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
