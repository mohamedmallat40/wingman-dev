// Centralized exports for all talent pool hooks
export { useTalentPoolState } from './useTalentPoolState';
export { useFilterMemoization } from './useFilterMemoization';
export { useDebouncedSearch, useAdvancedDebouncedSearch } from './useDebouncedSearch';
export { useTabNavigation, useTalentPoolTabs, type TabConfig } from './useTabNavigation';
export { useSearchFilters, useTalentPoolSearchFilters } from './useSearchFilters';

// Re-export types for convenience
export type { TalentPoolFilters, TalentType } from '../types';