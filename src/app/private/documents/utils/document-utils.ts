// ============================================================================
// DOCUMENT UTILITIES - HELPER FUNCTIONS
// ============================================================================

import type { DocumentFilters, IDocument } from '../types';

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file icon based on file type or name
 */
export const getFileIcon = (file: File | { name: string; type?: string }): string => {
  const fileName = file.name.toLowerCase();
  const fileType = 'type' in file ? file.type?.toLowerCase() : '';

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
  if (fileName.match(/\.(jpg|jpeg|png|gif|bmp|svg)$/i) || fileType.includes('image')) {
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
  searchQuery: string = ''
): IDocument[] => {
  let filtered = documents;

  // Apply search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (doc) =>
        doc.documentName.toLowerCase().includes(query) ||
        doc.tags.some((tag) => tag.name.toLowerCase().includes(query)) ||
        doc.type.name.toLowerCase().includes(query) ||
        doc.status.name.toLowerCase().includes(query)
    );
  }

  // Apply type filter
  if (filters.type) {
    filtered = filtered.filter((doc) => doc.type.name === filters.type);
  }

  // Apply status filter
  if (filters.status) {
    filtered = filtered.filter((doc) => doc.status.name === filters.status);
  }

  // Apply tags filter
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((doc) =>
      filters.tags!.some((filterTag) => doc.tags.some((docTag) => docTag.name === filterTag))
    );
  }

  // Apply date range filter if provided
  if (filters.dateFrom || filters.dateTo) {
    filtered = filtered.filter((doc) => {
      const docDate = new Date(doc.createdAt);
      const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
      const to = filters.dateTo ? new Date(filters.dateTo) : null;

      if (from && docDate < from) return false;
      if (to && docDate > to) return false;

      return true;
    });
  }

  return filtered;
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
      case 'name':
        comparison = a.documentName.localeCompare(b.documentName);
        break;
      case 'date':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'type':
        comparison = a.type.name.localeCompare(b.type.name);
        break;
      case 'status':
        comparison = a.status.name.localeCompare(b.status.name);
        break;
      default:
        comparison = 0;
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
 * Generate document preview URL
 */
export const getDocumentPreviewUrl = (document: IDocument): string => {
  // This would typically generate a URL for document preview
  // For now, return a placeholder
  return `/api/documents/${document.id}/preview`;
};

/**
 * Generate document download URL
 */
export const getDocumentDownloadUrl = (document: IDocument): string => {
  // This would typically generate a URL for document download
  // For now, return a placeholder
  return `/api/documents/${document.id}/download`;
};

/**
 * Check if user can edit document
 */
export const canEditDocument = (document: IDocument, userId?: string): boolean => {
  // Add your permission logic here
  // For now, return true if user ID matches creator or if user is in shared list
  if (!userId) return false;

  return document.createdBy === userId || document.sharedWith.some((user) => user.id === userId);
};

/**
 * Check if user can share document
 */
export const canShareDocument = (document: IDocument, userId?: string): boolean => {
  // Add your permission logic here
  // For now, return true if user ID matches creator
  if (!userId) return false;

  return document.createdBy === userId;
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
