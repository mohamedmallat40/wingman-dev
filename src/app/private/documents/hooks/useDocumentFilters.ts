import { useMemo } from 'react';

import { DocumentFilters } from '../types';

interface FilterMemoization {
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  filterSummary: string[];
}

export default function useDocumentFilters(filters: DocumentFilters): FilterMemoization {
  return useMemo(() => {
    const activeFilters: string[] = [];

    // Count active filters
    if (filters.search && filters.search.trim()) {
      activeFilters.push(`Search: "${filters.search}"`);
    }

    if (filters.category) {
      activeFilters.push(`Category: ${filters.category}`);
    }

    if (filters.status) {
      activeFilters.push(`Status: ${filters.status}`);
    }

    if (filters.tags && filters.tags.length > 0) {
      activeFilters.push(`Tags: ${filters.tags.join(', ')}`);
    }

    return {
      activeFiltersCount: activeFilters.length,
      hasActiveFilters: activeFilters.length > 0,
      filterSummary: activeFilters
    };
  }, [filters]);
}
