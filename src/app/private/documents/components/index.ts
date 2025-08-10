// ============================================================================
// DOCUMENT COMPONENTS - ORGANIZED EXPORTS
// ============================================================================

// Card Components
export * from './cards';

// Modal Components
export * from './modals';

// Navigation Components
export * from './navigation';

// State Components
export * from './states';

// Filter Components
export * from './filters';

// List Components
export * from './lists';

// Re-export types for convenience
export type { IDocument, DocumentType, DocumentFilters, ViewMode } from '../types';

// Legacy exports for backward compatibility
export { default as DocumentCard, DocumentCardSkeleton } from './cards/DocumentCard';
export { default as DocumentUploadModal } from './modals/DocumentUploadModal';
export { default as DocumentShareModal } from './modals/DocumentShareModal';
export { default as DocumentTabs } from './navigation/DocumentTabs';

// New exports
export { default as DocumentFiltersPanel } from './filters/DocumentFiltersPanel';
export { default as DocumentListContainer } from './lists/DocumentListContainer';
