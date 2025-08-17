'use client';

import { useMemo } from 'react';

import { TalentPoolFilters } from '../types';

export const useFilterMemoization = (filters: TalentPoolFilters) => {
  // Memoize active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.keys(filters).filter((key) => {
      const value = filters[key as keyof TalentPoolFilters];
      return (
        value !== undefined && value !== null && (Array.isArray(value) ? value.length > 0 : true)
      );
    }).length;
  }, [filters]);

  // Memoize filter description for accessibility/SEO
  const filterDescription = useMemo(() => {
    const activeFilters: string[] = [];

    if (filters.search || filters.name) {
      activeFilters.push(`Search: "${filters.search || filters.name}"`);
    }
    if (filters.statusAviability) {
      activeFilters.push(`statusAviability: ${filters.statusAviability}`);
    }
    if (filters.country?.length) {
      activeFilters.push(`Countries: ${filters.country.length} selected`);
    }
    if (filters.profession) {
      activeFilters.push(`Profession: ${filters.profession}`);
    }
    if (filters.experienceLevel?.length) {
      activeFilters.push(`Experience: ${filters.experienceLevel.length} levels`);
    }
    if (filters.skills?.length) {
      activeFilters.push(`Skills: ${filters.skills.length} selected`);
    }

    return activeFilters.length > 0
      ? `Filtered by: ${activeFilters.join(', ')}`
      : 'No filters applied';
  }, [filters]);

  // Memoize whether filters are empty
  const hasActiveFilters = useMemo(() => activeFiltersCount > 0, [activeFiltersCount]);

  // Memoize filter validation
  const isValidFilterState = useMemo(() => {
    // Add validation logic here if needed
    return true;
  }, [filters]);

  return {
    activeFiltersCount,
    filterDescription,
    hasActiveFilters,
    isValidFilterState
  };
};
