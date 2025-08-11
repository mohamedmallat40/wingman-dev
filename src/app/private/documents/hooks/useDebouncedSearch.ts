import { useCallback, useEffect, useState } from 'react';

interface DebouncedSearchOptions {
  delay?: number;
  minLength?: number;
}

export default function useDebouncedSearch(
  initialValue: string = '',
  options: DebouncedSearchOptions = {}
) {
  const { delay = 300, minLength = 2 } = options;

  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);

    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsSearching(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  const shouldSearch = debouncedValue.length >= minLength || debouncedValue.length === 0;

  const clearSearch = useCallback(() => {
    setValue('');
    setDebouncedValue('');
  }, []);

  const setSearchValue = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  return {
    searchValue: value,
    debouncedSearchValue: shouldSearch ? debouncedValue : '',
    isSearching: isSearching && value.length >= minLength,
    setSearchValue,
    clearSearch,
    shouldSearch
  };
}
