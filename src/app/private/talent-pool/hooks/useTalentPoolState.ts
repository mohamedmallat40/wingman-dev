'use client';

import { useCallback, useState } from 'react';
import { TalentPoolFilters, TalentType } from '../types';

interface TalentPoolState {
  activeTab: TalentType;
  searchQuery: string;
  filters: TalentPoolFilters;
  showFilters: boolean;
  tabCounts: {
    freelancers: number;
    agencies: number;
    teams: number;
  };
}

const initialState: TalentPoolState = {
  activeTab: 'freelancers',
  searchQuery: '',
  filters: {},
  showFilters: false,
  tabCounts: {
    freelancers: 0,
    agencies: 0,
    teams: 0,
  },
};

export const useTalentPoolState = () => {
  const [state, setState] = useState<TalentPoolState>(initialState);

  // Tab management
  const setActiveTab = useCallback((tab: TalentType) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  // Search management
  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const handleSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        search: prev.searchQuery.trim() || undefined,
        name: prev.searchQuery.trim() || undefined,
      },
    }));
  }, []);

  // Filter management
  const setFilters = useCallback((newFilters: TalentPoolFilters) => {
    setState(prev => ({ ...prev, filters: newFilters }));
  }, []);

  const removeFilter = useCallback((filterKey: keyof TalentPoolFilters) => {
    setState(prev => {
      const newFilters = { ...prev.filters };
      delete newFilters[filterKey];
      return { ...prev, filters: newFilters };
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchQuery: '',
      filters: {},
    }));
  }, []);

  // Filters panel management
  const toggleFilters = useCallback(() => {
    setState(prev => ({ ...prev, showFilters: !prev.showFilters }));
  }, []);

  // Tab counts management
  const updateTabCount = useCallback((tab: TalentType, count: number) => {
    setState(prev => ({
      ...prev,
      tabCounts: { ...prev.tabCounts, [tab]: count },
    }));
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    setActiveTab,
    setSearchQuery,
    handleSearch,
    setFilters,
    removeFilter,
    clearAllFilters,
    toggleFilters,
    updateTabCount,
  };
};