/**
 * Document viewer specific types
 */

import type { Document } from './document';

// Viewer mode types
export type DocumentViewerMode = 'preview' | 'fullscreen' | 'embedded' | 'modal';

// Zoom levels for document viewer
export type ZoomLevel =
  | 'fit-width'
  | 'fit-height'
  | 'actual-size'
  | 25
  | 50
  | 75
  | 100
  | 125
  | 150
  | 175
  | 200
  | 250
  | 300;

// Rotation angles
export type RotationAngle = 0 | 90 | 180 | 270;

// Viewer state management
export interface DocumentViewerState {
  readonly document: Document | null;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly zoomLevel: ZoomLevel;
  readonly rotation: RotationAngle;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly mode: DocumentViewerMode;
  readonly annotations: readonly Annotation[];
  readonly highlights: readonly Highlight[];
}

// Annotation types
export interface Annotation {
  readonly id: string;
  readonly type: AnnotationType;
  readonly page: number;
  readonly position: Position;
  readonly content: string;
  readonly author: string;
  readonly createdAt: string;
  readonly color?: string;
}

export type AnnotationType = 'comment' | 'highlight' | 'note' | 'stamp' | 'drawing';

export interface Position {
  readonly x: number;
  readonly y: number;
  readonly width?: number;
  readonly height?: number;
}

// Highlight types
export interface Highlight {
  readonly id: string;
  readonly page: number;
  readonly text: string;
  readonly position: Position;
  readonly color: string;
  readonly author: string;
  readonly createdAt: string;
  readonly note?: string;
}

// Viewer configuration
export interface DocumentViewerConfig {
  readonly showToolbar: boolean;
  readonly showSidebar: boolean;
  readonly showAnnotations: boolean;
  readonly allowAnnotations: boolean;
  readonly allowDownload: boolean;
  readonly allowPrint: boolean;
  readonly allowFullscreen: boolean;
  readonly theme: 'light' | 'dark' | 'auto';
  readonly language: string;
  readonly autoSave: boolean;
  readonly enableSearch: boolean;
  readonly enableNavigation: boolean;
}

// Search functionality
export interface DocumentSearchResult {
  readonly page: number;
  readonly text: string;
  readonly position: Position;
  readonly context: string;
}

export interface DocumentSearchState {
  readonly query: string;
  readonly results: readonly DocumentSearchResult[];
  readonly currentResultIndex: number;
  readonly isSearching: boolean;
  readonly totalMatches: number;
}

// Viewer action types
export type ViewerAction =
  | { type: 'LOAD_DOCUMENT'; payload: Document }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_ZOOM'; payload: ZoomLevel }
  | { type: 'SET_ROTATION'; payload: RotationAngle }
  | { type: 'SET_MODE'; payload: DocumentViewerMode }
  | { type: 'ADD_ANNOTATION'; payload: Annotation }
  | { type: 'UPDATE_ANNOTATION'; payload: { id: string; changes: Partial<Annotation> } }
  | { type: 'DELETE_ANNOTATION'; payload: string }
  | { type: 'ADD_HIGHLIGHT'; payload: Highlight }
  | { type: 'DELETE_HIGHLIGHT'; payload: string }
  | { type: 'SEARCH'; payload: string }
  | { type: 'CLEAR_SEARCH' }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean };

// Component props for viewer components
export interface DocumentPreviewProps {
  readonly document: Document;
  readonly config?: Partial<DocumentViewerConfig>;
  readonly onError?: (error: string) => void;
  readonly className?: string;
}

export interface DocumentToolbarProps {
  readonly state: DocumentViewerState;
  readonly config: DocumentViewerConfig;
  readonly onPageChange: (page: number) => void;
  readonly onZoomChange: (zoom: ZoomLevel) => void;
  readonly onRotationChange: (rotation: RotationAngle) => void;
  readonly onModeChange: (mode: DocumentViewerMode) => void;
  readonly onDownload?: () => void;
  readonly onPrint?: () => void;
  readonly onShare?: () => void;
  readonly className?: string;
}

export interface DocumentSidebarProps {
  readonly state: DocumentViewerState;
  readonly onPageSelect: (page: number) => void;
  readonly onAnnotationSelect: (annotation: Annotation) => void;
  readonly onHighlightSelect: (highlight: Highlight) => void;
  readonly className?: string;
}

export interface AnnotationToolProps {
  readonly type: AnnotationType;
  readonly isActive: boolean;
  readonly onSelect: (type: AnnotationType) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

export interface SearchBarProps {
  readonly searchState: DocumentSearchState;
  readonly onSearch: (query: string) => void;
  readonly onNext: () => void;
  readonly onPrevious: () => void;
  readonly onClear: () => void;
  readonly className?: string;
}
