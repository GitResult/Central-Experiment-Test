/**
 * useSearch Hook
 * Search logic with debouncing
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for search functionality with debouncing
 * @param {Function} searchFn - Search function to execute
 * @param {number} debounceMs - Debounce delay in milliseconds
 * @returns {Object} Search state and handlers
 */
export function useSearch(searchFn, debounceMs = 300) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    // Abort previous search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsSearching(true);
    setError(null);

    try {
      const searchResults = await searchFn(searchQuery, abortControllerRef.current.signal);
      setResults(searchResults || []);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
        setResults([]);
      }
    } finally {
      setIsSearching(false);
    }
  }, [searchFn]);

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(query);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debounceMs, performSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    error,
    clearSearch
  };
}

export default useSearch;
