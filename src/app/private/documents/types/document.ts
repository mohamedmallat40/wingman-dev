/**
 * Document-related types with enhanced typing system
 */

import type {
  ApiResponse,
  BaseEntity,
  BaseFilters,
  Category,
  CreateDto,
  PaginatedResponse,
  Permission,
  SortConfig,
  Status,
  Tag,
  UpdateDto,
  UserSummary,
  ViewMode
} from '@/types';

// Re-export shared types that are used in this module
export type { ViewMode, Permission } from '@/types';

// Document type constants - using const assertion for better type safety
export const DOCUMENT_TYPES = {
  ALL_DOCUMENTS: 'all-documents',
  SHARED_WITH_ME: 'shared-with-me',
  MY_DOCUMENTS: 'my-documents',
  RECENT: 'recent',
  ARCHIVED: 'archived'
} as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[keyof typeof DOCUMENT_TYPES];

// Document status constants
export const DOCUMENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  DELETED: 'deleted'
} as const;

export type DocumentStatusType = (typeof DOCUMENT_STATUS)[keyof typeof DOCUMENT_STATUS];

// File type constants
export const SUPPORTED_FILE_TYPES = {
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS: 'application/vnd.ms-excel',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PPT: 'application/vnd.ms-powerpoint',
  PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  TXT: 'text/plain',
  CSV: 'text/csv',
  IMAGE: 'image/*'
} as const;

export type SupportedFileType = (typeof SUPPORTED_FILE_TYPES)[keyof typeof SUPPORTED_FILE_TYPES];

// Core Document interface
export interface Document extends BaseEntity {
  readonly documentName: string;
  readonly fileName: string;
  readonly fileSize: number;
  readonly fileType: string;
  readonly fileUrl?: string;
  readonly thumbnailUrl?: string;
  readonly description?: string;
  readonly ownerId: string;
  readonly owner: UserSummary;
  readonly sharedWith: readonly DocumentShare[];
  readonly tags: readonly Tag[];
  readonly category?: Category;
  readonly status: Status;
  readonly isPublic: boolean;
  readonly downloadCount: number;
  readonly viewCount: number;
  readonly lastAccessedAt?: string;
  readonly metadata?: DocumentMetadata;
}

// Document metadata for additional file information
export interface DocumentMetadata {
  readonly pageCount?: number;
  readonly wordCount?: number;
  readonly language?: string;
  readonly author?: string;
  readonly subject?: string;
  readonly keywords?: readonly string[];
  readonly createdWith?: string;
  readonly version?: string;
}

// Document sharing configuration
export interface DocumentShare extends BaseEntity {
  readonly documentId: string;
  readonly userId: string;
  readonly user: UserSummary;
  readonly permission: Permission;
  readonly expiresAt?: string;
  readonly sharedBy: string;
  readonly sharedAt: string;
  readonly lastAccessedAt?: string;
}

// Document creation payload
export interface CreateDocumentPayload {
  readonly file: File;
  readonly documentName: string;
  readonly description?: string;
  readonly tags?: readonly string[];
  readonly categoryId?: string;
  readonly isPublic?: boolean;
}

// Document update payload
export interface UpdateDocumentPayload {
  readonly documentName?: string;
  readonly description?: string;
  readonly tags?: readonly string[];
  readonly categoryId?: string;
  readonly isPublic?: boolean;
}

// Document sharing payload
export interface ShareDocumentPayload {
  readonly documentId: string;
  readonly userIds: readonly string[];
  readonly permission: Permission;
  readonly expiresAt?: string;
  readonly message?: string;
}

// Document filters with proper typing
export interface DocumentFilters extends BaseFilters {
  readonly fileType?: string;
  readonly fileSize?: {
    readonly min?: number;
    readonly max?: number;
  };
  readonly ownerId?: string;
  readonly isPublic?: boolean;
  readonly sharedWithMe?: boolean;
  readonly includeArchived?: boolean;
}

// Sort fields for documents
export type DocumentSortField =
  | 'createdAt'
  | 'updatedAt'
  | 'documentName'
  | 'fileName'
  | 'fileSize'
  | 'downloadCount'
  | 'viewCount'
  | 'lastAccessedAt';

export type DocumentSortConfig = SortConfig<DocumentSortField>;

// Document list response
export type DocumentListResponse = PaginatedResponse<Document>;

// Document upload response
export interface DocumentUploadResponse extends ApiResponse<Document> {
  readonly uploadId: string;
  readonly processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
}

// Document download configuration
export interface DocumentDownloadConfig {
  readonly documentId: string;
  readonly version?: string;
  readonly format?: 'original' | 'pdf' | 'thumbnail';
  readonly inline?: boolean;
}

// Component prop interfaces with proper naming
export interface DocumentCardProps {
  readonly document: Document;
  readonly viewMode: ViewMode;
  readonly isSelected?: boolean;
  readonly showActions?: boolean;
  readonly onSelect?: (document: Document) => void;
  readonly onShare?: (document: Document) => void;
  readonly onDelete?: (document: Document) => void;
  readonly onDownload?: (document: Document) => void;
  readonly onView?: (document: Document) => void;
  readonly className?: string;
}

export interface DocumentListProps {
  readonly documents: readonly Document[];
  readonly viewMode: ViewMode;
  readonly isLoading?: boolean;
  readonly selectedDocuments?: readonly string[];
  readonly onSelectionChange?: (selectedIds: readonly string[]) => void;
  readonly onDocumentAction?: (action: DocumentAction, document: Document) => void;
  readonly className?: string;
}

export interface DocumentFiltersProps {
  readonly filters: DocumentFilters;
  readonly onFiltersChange: (filters: DocumentFilters) => void;
  readonly availableCategories?: readonly Category[];
  readonly availableTags?: readonly Tag[];
  readonly isLoading?: boolean;
  readonly className?: string;
}

export interface DocumentViewerProps {
  readonly document: Document | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onDownload?: (document: Document) => void;
  readonly onShare?: (document: Document) => void;
  readonly onDelete?: (document: Document) => void;
  readonly className?: string;
}

export interface DocumentUploadModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onUploadComplete?: (document: Document) => void;
  readonly acceptedFileTypes?: readonly string[];
  readonly maxFileSize?: number;
  readonly className?: string;
}

export interface DocumentShareModalProps {
  readonly document: Document | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onShareComplete?: (shares: readonly DocumentShare[]) => void;
  readonly className?: string;
}

// Action types for document operations
export type DocumentAction =
  | 'view'
  | 'download'
  | 'share'
  | 'edit'
  | 'delete'
  | 'duplicate'
  | 'archive'
  | 'restore';

// Empty state configuration
export interface DocumentEmptyStateProps {
  readonly type: DocumentType;
  readonly title?: string;
  readonly description?: string;
  readonly actionLabel?: string;
  readonly actionIcon?: string;
  readonly illustration?: string;
  readonly onAction?: () => void;
  readonly onUpload?: () => void;
  readonly className?: string;
}

// Error state configuration
export interface DocumentErrorStateProps {
  readonly error: Error | string;
  readonly onRetry?: () => void;
  readonly className?: string;
}

// Hook return types
export interface UseDocumentsReturn {
  readonly documents: readonly Document[];
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
  };
  readonly filters: DocumentFilters;
  readonly sortConfig: DocumentSortConfig;
  readonly selectedDocuments: readonly string[];
  readonly actions: {
    readonly setFilters: (filters: DocumentFilters) => void;
    readonly setSortConfig: (config: DocumentSortConfig) => void;
    readonly setSelectedDocuments: (ids: readonly string[]) => void;
    readonly loadMore: () => Promise<void>;
    readonly refresh: () => Promise<void>;
    readonly uploadDocument: (payload: CreateDocumentPayload) => Promise<Document>;
    readonly updateDocument: (id: string, payload: UpdateDocumentPayload) => Promise<Document>;
    readonly deleteDocument: (id: string) => Promise<void>;
    readonly shareDocument: (payload: ShareDocumentPayload) => Promise<readonly DocumentShare[]>;
    readonly downloadDocument: (config: DocumentDownloadConfig) => Promise<void>;
  };
}
