'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook for debouncing search input to prevent excessive API calls
 * @param searchQuery - The current search query
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 * @returns Debounced search query
 */
export const useDebouncedSearch = (searchQuery: string, delay: number = 300) => {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, delay);

    // Cleanup function to cancel the timeout if searchQuery changes
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, delay]);

  return debouncedQuery;
};

/**
 * Advanced debounced search hook with additional features
 */
export const useAdvancedDebouncedSearch = (
  searchQuery: string,
  options: {
    delay?: number;
    minLength?: number;
    immediate?: boolean;
  } = {}
) => {
  const { delay = 300, minLength = 1, immediate = false } = options;
  const [debouncedQuery, setDebouncedQuery] = useState(immediate ? searchQuery : '');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Don't search if query is too short
    if (searchQuery.length < minLength && searchQuery.length > 0) {
      setDebouncedQuery('');
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, delay, minLength]);

  return {
    debouncedQuery,
    isSearching,
    hasMinimumLength: searchQuery.length >= minLength
  };
};
