// Base types
export interface DocumentTag {
  id: string;
  name: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
}

export interface DocumentStatus {
  id: string;
  name: string;
}

export interface SharedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  avatar?: string;
  role?: 'AGENCY' | 'FREELANCER' | 'COMPANY' | 'ADMIN';
  profilePicture?: string;
}

export interface IDocument {
  id: string;
  documentName: string;
  fileName: string;
  createdAt: string;
  createdBy?: string;
  sharedWith: SharedUser[];
  tags: DocumentTag[];
  type: DocumentCategory | null;
  status: DocumentStatus | null;
}

// Document operations
export interface DocumentShareData {
  documentId: string;
  userIds: string[];
  permissions?: 'read' | 'write' | 'admin';
}

export interface DocumentUploadData {
  file: File;
  documentName: string;
  tags?: string[];
  type?: string;
}

export type DocumentType = 'all-documents' | 'shared-with-me';

export type ViewMode = 'list' | 'grid';

// Component props
export interface DocumentEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: string;
  onAction?: () => void;
  onUpload?: () => void;
  illustration?: string;
  className?: string;
}

export interface DocumentCardProps {
  document: IDocument;
  viewMode: ViewMode;
  onSelect?: (document: IDocument) => void;
  onShare?: (document: IDocument) => void;
  onDelete?: (document: IDocument) => void;
  onDownload?: (document: IDocument) => void;
}

export interface DocumentViewerProps {
  document: IDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

// Filter and search types
export interface DocumentFiltersState {
  search: string;
  name: string;
  tags: string[];
  type: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

// API response types
export interface DocumentApiResponse {
  data: IDocument[];
  total: number;
  page: number;
  limit: number;
}

export interface DocumentShareResponse {
  success: boolean;
  message: string;
  data?: IDocument;
}

export interface DocumentFilters {
  search?: string;
  name?: string;
  tags?: string[];
  type?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}
