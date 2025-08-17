// ============================================================================
// DOCUMENT UTILITIES - HELPER FUNCTIONS
// ============================================================================

import type { DocumentFilters, IDocument } from '../types';

import { getBaseUrl } from '@/lib/utils/utilities';

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(k));

  return Number.parseFloat((bytes / Math.pow(k, index)).toFixed(2)) + ' ' + sizes[index];
};

/**
 * Get file icon based on file type or name
 */
export const getFileIcon = (file: File | { name: string; type?: string }): string => {
  const fileName = file.name.toLowerCase();
  const fileType = ('type' in file ? file.type?.toLowerCase() : '') || '';

  // PDF files
  if (fileName.endsWith('.pdf') || fileType.includes('pdf')) {
    return 'solar:file-text-bold';
  }

  // Word documents
  if (fileName.endsWith('.doc') || fileName.endsWith('.docx') || fileType.includes('word')) {
    return 'solar:document-bold';
  }

  // Excel files
  if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx') || fileType.includes('sheet')) {
    return 'solar:calculator-bold';
  }

  // PowerPoint files
  if (
    fileName.endsWith('.ppt') ||
    fileName.endsWith('.pptx') ||
    fileType.includes('presentation')
  ) {
    return 'solar:presentation-graph-bold';
  }

  // Images
  if (/\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(fileName) || fileType.includes('image')) {
    return 'solar:gallery-bold';
  }

  // Text files
  if (fileName.endsWith('.txt') || fileType.includes('text')) {
    return 'solar:document-text-bold';
  }

  // Default
  return 'solar:file-bold';
};

/**
 * Get document status color based on status name
 */
export const getDocumentStatusColor = (
  status: string
): 'success' | 'warning' | 'danger' | 'primary' | 'secondary' | 'default' => {
  const statusLower = status.toLowerCase();

  if (statusLower.includes('issued') || statusLower.includes('approved')) {
    return 'success';
  }

  if (statusLower.includes('pending') || statusLower.includes('review')) {
    return 'warning';
  }

  if (
    statusLower.includes('rejected') ||
    statusLower.includes('overdue') ||
    statusLower.includes('disputed')
  ) {
    return 'danger';
  }

  if (statusLower.includes('draft')) {
    return 'secondary';
  }

  if (statusLower.includes('archived') || statusLower.includes('cancelled')) {
    return 'default';
  }

  return 'primary';
};

/**
 * Get document type color based on type name
 */
export const getDocumentTypeColor = (
  type: string
): 'success' | 'warning' | 'danger' | 'primary' | 'secondary' | 'default' => {
  const typeLower = type.toLowerCase();

  if (typeLower.includes('invoice')) {
    return 'success';
  }

  if (typeLower.includes('quote') || typeLower.includes('proposal')) {
    return 'warning';
  }

  if (typeLower.includes('contract')) {
    return 'danger';
  }

  if (typeLower.includes('template')) {
    return 'secondary';
  }

  return 'primary';
};

/**
 * Filter documents based on filters
 */
export const filterDocuments = (
  documents: IDocument[],
  filters: DocumentFilters,
  searchQuery: string
): IDocument[] => {
  return documents.filter((document) => {
    // Search by document name (case-insensitive)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const documentName = document.documentName.toLowerCase() || '';

      if (!documentName.includes(query)) {
        return false;
      }
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      const documentTagIds = document.tags?.map((tag) => tag.id) || [];
      const hasMatchingTag = filters.tags.some((filterTagId) =>
        documentTagIds.includes(filterTagId)
      );

      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  });
};

export const debounce = <T extends (...arguments_: readonly unknown[]) => unknown>(
  function_: T,
  wait: number
): ((...arguments_: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...arguments_: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => function_.apply(null, arguments_), wait);
  };
};
/**
 * Sort documents by various criteria
 */
export const sortDocuments = (
  documents: IDocument[],
  sortBy: 'name' | 'date' | 'type' | 'status' = 'date',
  sortOrder: 'asc' | 'desc' = 'desc'
): IDocument[] => {
  return [...documents].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name': {
        comparison = a.documentName.localeCompare(b.documentName);
        break;
      }
      case 'date': {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      }
      case 'type': {
        const aType = a.category?.name || '';
        const bType = b.category?.name || '';
        comparison = aType.localeCompare(bType);
        break;
      }
      case 'status': {
        const aStatus = a.status?.name || '';
        const bStatus = b.status?.name || '';
        comparison = aStatus.localeCompare(bStatus);
        break;
      }
      default: {
        comparison = 0;
      }
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
};

/**
 * Get active filters count
 */
export const getActiveFiltersCount = (filters: DocumentFilters): number => {
  return Object.values(filters).filter(
    (value) =>
      value !== undefined &&
      value !== null &&
      (Array.isArray(value) ? value.length > 0 : value !== '')
  ).length;
};

/**
 * Generate document preview URL - same as profile images
 */
export const getDocumentPreviewUrl = (document: IDocument): string => {
  if (!document.fileName) return '';

  // Use the same pattern as profile images: ${getBaseUrl()}/upload/${fileName}
  return `${getBaseUrl()}/upload/${document.fileName}`;
};

/**
 * Generate document download URL - same as profile images
 */
export const getDocumentDownloadUrl = (document: IDocument): string => {
  if (!document.fileName) return '';

  // Use the same pattern as profile images: ${getBaseUrl()}/upload/${fileName}
  return `${getBaseUrl()}/upload/${document.fileName}`;
};

/**
 * Check if user can edit document
 */
export const canEditDocument = (document: IDocument, userId?: string): boolean => {
  // Add your permission logic here
  // For now, return true if user ID matches creator or if user is in shared list
  if (!userId) return false;

  return (
    document.ownerId === userId || document.sharedWith.some((share) => share.userId === userId)
  );
};

/**
 * Check if user can share document
 */
export const canShareDocument = (document: IDocument, userId?: string): boolean => {
  // Add your permission logic here
  // For now, return true if user ID matches creator
  if (!userId) return false;

  return document.ownerId === userId;
};

/**
 * Format document created date
 */
export const formatDocumentDate = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - d.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    return d.toLocaleDateString();
  }
};
