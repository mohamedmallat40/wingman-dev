import { useCallback, useState } from 'react';

import { DocumentFilters, DocumentType } from '../types';

interface DocumentState {
  activeTab: DocumentType;
  searchQuery: string;
  filters: DocumentFilters;
  showFilters: boolean;
  viewMode: 'list' | 'grid';
  documentsCount: { [key in DocumentType]: number };
}

const initialState: DocumentState = {
  activeTab: 'all-documents',
  searchQuery: '',
  filters: {},
  showFilters: false,
  viewMode: 'grid',
  documentsCount: {
    'all-documents': 0,
    'shared-with-me': 0,
    'my-documents': 0,
    recent: 0,
    archived: 0
  }
};

export default function useDocumentState() {
  const [state, setState] = useState<DocumentState>(initialState);

  const setActiveTab = useCallback((tab: DocumentType) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setFilters = useCallback((filters: DocumentFilters) => {
    setState((prev) => ({ ...prev, filters }));
  }, []);

  const toggleFilters = useCallback(() => {
    setState((prev) => ({ ...prev, showFilters: !prev.showFilters }));
  }, []);

  const setViewMode = useCallback((mode: 'list' | 'grid') => {
    setState((prev) => ({ ...prev, viewMode: mode }));
  }, []);

  const updateDocumentCount = useCallback((tab: DocumentType, count: number) => {
    setState((prev) => ({
      ...prev,
      documentsCount: {
        ...prev.documentsCount,
        [tab]: count
      }
    }));
  }, []);

  const handleSearch = useCallback(() => {
    // Search logic is handled by the filteredDocuments useMemo in the parent component
  }, [state.searchQuery]);

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    setActiveTab,
    setSearchQuery,
    setFilters,
    toggleFilters,
    setViewMode,
    updateDocumentCount,
    handleSearch,
    resetState
  };
}
