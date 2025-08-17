/**
 * Document upload specific types
 */

import type { CreateDocumentPayload, Document, SupportedFileType } from './document';

// Upload progress tracking
export interface UploadProgress {
  readonly fileId: string;
  readonly fileName: string;
  readonly progress: number;
  readonly status: UploadStatus;
  readonly error?: string;
  readonly estimatedTimeRemaining?: number;
  readonly uploadSpeed?: number;
}

export type UploadStatus = 
  | 'pending'
  | 'uploading'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

// Multi-file upload configuration
export interface BatchUploadConfig {
  readonly files: readonly File[];
  readonly defaultTags?: readonly string[];
  readonly defaultCategory?: string;
  readonly isPublic?: boolean;
  readonly onProgress?: (progress: readonly UploadProgress[]) => void;
  readonly onFileComplete?: (document: Document) => void;
  readonly onAllComplete?: (documents: readonly Document[]) => void;
  readonly onError?: (error: UploadError) => void;
}

// Upload validation result
export interface UploadValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly UploadValidationError[];
  readonly warnings: readonly UploadValidationWarning[];
}

export interface UploadValidationError {
  readonly type: 'file-size' | 'file-type' | 'file-name' | 'duplicate' | 'quota';
  readonly message: string;
  readonly fileName: string;
}

export interface UploadValidationWarning {
  readonly type: 'large-file' | 'low-quality' | 'metadata-missing';
  readonly message: string;
  readonly fileName: string;
}

// Upload constraints configuration
export interface UploadConstraints {
  readonly maxFileSize: number;
  readonly maxFilesPerBatch: number;
  readonly allowedFileTypes: readonly SupportedFileType[];
  readonly maxTotalSize: number;
  readonly requireDescription: boolean;
  readonly allowDuplicates: boolean;
}

// Upload error types
export interface UploadError {
  readonly code: 'UPLOAD_FAILED' | 'VALIDATION_ERROR' | 'QUOTA_EXCEEDED' | 'NETWORK_ERROR';
  readonly message: string;
  readonly fileName?: string;
  readonly details?: Record<string, unknown>;
}

// Document processing status
export interface DocumentProcessingStatus {
  readonly documentId: string;
  readonly status: 'pending' | 'processing' | 'completed' | 'failed';
  readonly progress: number;
  readonly steps: readonly ProcessingStep[];
  readonly error?: string;
}

export interface ProcessingStep {
  readonly name: string;
  readonly status: 'pending' | 'processing' | 'completed' | 'failed';
  readonly progress: number;
  readonly estimatedDuration?: number;
}

// Upload form data with validation
export interface DocumentUploadFormData extends CreateDocumentPayload {
  readonly acceptTerms: boolean;
  readonly notifyOnComplete: boolean;
  readonly compressionLevel?: 'none' | 'low' | 'medium' | 'high';
  readonly generateThumbnail: boolean;
  readonly extractMetadata: boolean;
}

// Upload component props
export interface DocumentUploadZoneProps {
  readonly onFilesSelected: (files: FileList) => void;
  readonly constraints?: Partial<UploadConstraints>;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly children?: React.ReactNode;
}

export interface UploadProgressBarProps {
  readonly progress: UploadProgress;
  readonly onCancel?: (fileId: string) => void;
  readonly onRetry?: (fileId: string) => void;
  readonly showDetails?: boolean;
  readonly className?: string;
}

export interface BatchUploadManagerProps {
  readonly uploads: readonly UploadProgress[];
  readonly onCancelAll?: () => void;
  readonly onRetryFailed?: () => void;
  readonly onClearCompleted?: () => void;
  readonly className?: string;
}