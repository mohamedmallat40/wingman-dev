/**
 * Document filtering and search specific types
 */

import type { Category, DateRange, Tag, ViewMode } from '@/types';
import type {
  DocumentFilters,
  DocumentSortConfig,
  DocumentStatusType,
  DocumentType
} from './document';

// Extended filter types for advanced filtering
export interface AdvancedDocumentFilters extends DocumentFilters {
  readonly createdBy?: readonly string[];
  readonly sharedBy?: readonly string[];
  readonly accessedInLast?: number; // days
  readonly sizeRange?: FileSizeRange;
  readonly hasAnnotations?: boolean;
  readonly hasComments?: boolean;
  readonly isRecent?: boolean;
  readonly isFavorite?: boolean;
  readonly contentType?: ContentType;
  readonly language?: string;
  readonly rating?: RatingRange;
}

export interface FileSizeRange {
  readonly min?: number;
  readonly max?: number;
  readonly unit: 'bytes' | 'kb' | 'mb' | 'gb';
}

export interface RatingRange {
  readonly min: number;
  readonly max: number;
}

export type ContentType =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'spreadsheet'
  | 'presentation'
  | 'archive'
  | 'other';

// Search configuration
export interface SearchConfig {
  readonly searchInContent: boolean;
  readonly searchInComments: boolean;
  readonly searchInMetadata: boolean;
  readonly fuzzySearch: boolean;
  readonly highlightResults: boolean;
  readonly maxResults: number;
  readonly includeArchived: boolean;
}

// Saved filter presets
export interface FilterPreset {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly filters: AdvancedDocumentFilters;
  readonly sortConfig: DocumentSortConfig;
  readonly isDefault: boolean;
  readonly isShared: boolean;
  readonly createdBy: string;
  readonly createdAt: string;
  readonly usageCount: number;
}

// Quick filter options
export type QuickFilter =
  | 'recent'
  | 'shared-with-me'
  | 'my-documents'
  | 'favorites'
  | 'large-files'
  | 'images'
  | 'pdfs'
  | 'needs-review'
  | 'expiring-soon';

export interface QuickFilterDefinition {
  readonly key: QuickFilter;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly filters: Partial<AdvancedDocumentFilters>;
  readonly count?: number;
}

// Filter state management
export interface FilterState {
  readonly activeFilters: AdvancedDocumentFilters;
  readonly appliedPreset?: FilterPreset;
  readonly quickFilters: readonly QuickFilter[];
  readonly searchQuery: string;
  readonly searchConfig: SearchConfig;
  readonly isAdvancedMode: boolean;
  readonly hasActiveFilters: boolean;
  readonly resultCount: number;
}

// Filter change events
export type FilterChangeEvent =
  | { type: 'SET_FILTERS'; payload: Partial<AdvancedDocumentFilters> }
  | { type: 'RESET_FILTERS' }
  | { type: 'APPLY_PRESET'; payload: FilterPreset }
  | { type: 'SET_QUICK_FILTER'; payload: QuickFilter }
  | { type: 'REMOVE_QUICK_FILTER'; payload: QuickFilter }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SEARCH_CONFIG'; payload: Partial<SearchConfig> }
  | { type: 'TOGGLE_ADVANCED_MODE' };

// Component props for filter components
export interface AdvancedDocumentFiltersProps {
  readonly filterState: FilterState;
  readonly availableOptions: FilterOptions;
  readonly onFilterChange: (event: FilterChangeEvent) => void;
  readonly onSave?: (
    preset: Omit<FilterPreset, 'id' | 'createdAt' | 'usageCount'>
  ) => Promise<void>;
  readonly className?: string;
}

export interface FilterOptions {
  readonly categories: readonly Category[];
  readonly tags: readonly Tag[];
  readonly fileTypes: readonly string[];
  readonly users: readonly { id: string; name: string }[];
  readonly languages: readonly string[];
  readonly presets: readonly FilterPreset[];
}

export interface QuickFiltersProps {
  readonly availableFilters: readonly QuickFilterDefinition[];
  readonly activeFilters: readonly QuickFilter[];
  readonly onToggle: (filter: QuickFilter) => void;
  readonly showCounts?: boolean;
  readonly className?: string;
}

export interface AdvancedFiltersProps {
  readonly filters: AdvancedDocumentFilters;
  readonly options: FilterOptions;
  readonly onChange: (filters: Partial<AdvancedDocumentFilters>) => void;
  readonly onReset: () => void;
  readonly className?: string;
}

export interface FilterPresetsProps {
  readonly presets: readonly FilterPreset[];
  readonly activePreset?: FilterPreset;
  readonly onApply: (preset: FilterPreset) => void;
  readonly onSave: (preset: Omit<FilterPreset, 'id' | 'createdAt' | 'usageCount'>) => Promise<void>;
  readonly onDelete: (presetId: string) => Promise<void>;
  readonly onShare: (presetId: string) => Promise<void>;
  readonly className?: string;
}

export interface FilterSearchBarProps {
  readonly query: string;
  readonly config: SearchConfig;
  readonly suggestions: readonly string[];
  readonly isSearching: boolean;
  readonly onQueryChange: (query: string) => void;
  readonly onConfigChange: (config: Partial<SearchConfig>) => void;
  readonly onSearch: (query: string) => void;
  readonly onClear: () => void;
  readonly placeholder?: string;
  readonly className?: string;
}

export interface FilterChipsProps {
  readonly filters: AdvancedDocumentFilters;
  readonly onRemoveFilter: (filterKey: keyof AdvancedDocumentFilters, value?: unknown) => void;
  readonly onClearAll: () => void;
  readonly className?: string;
}

// Filter validation and suggestions
export interface FilterValidationResult {
  readonly isValid: boolean;
  readonly warnings: readonly string[];
  readonly suggestions: readonly FilterSuggestion[];
}

export interface FilterSuggestion {
  readonly type: 'optimization' | 'correction' | 'enhancement';
  readonly message: string;
  readonly suggestedFilters?: Partial<AdvancedDocumentFilters>;
}
