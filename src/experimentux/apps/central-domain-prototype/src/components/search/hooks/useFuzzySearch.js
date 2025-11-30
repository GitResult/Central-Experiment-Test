/**
 * useFuzzySearch Hook
 * Fuzzy search using Fuse.js
 */

import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';

/**
 * Hook for fuzzy search functionality
 * @param {Array} data - Array of items to search
 * @param {Object} options - Fuse.js options
 * @returns {Object} Search state and functions
 */
export function useFuzzySearch(data, options = {}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Default Fuse.js options
  const fuseOptions = useMemo(() => ({
    threshold: 0.3,
    keys: ['name', 'title', 'description'],
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
    ...options
  }), [options]);

  // Create Fuse instance
  const fuse = useMemo(() => {
    if (!data || data.length === 0) return null;
    return new Fuse(data, fuseOptions);
  }, [data, fuseOptions]);

  // Perform search
  useEffect(() => {
    if (!query.trim() || !fuse) {
      setResults([]);
      return;
    }

    const searchResults = fuse.search(query);
    setResults(searchResults);
  }, [query, fuse]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return {
    query,
    setQuery,
    results,
    clearSearch,
    hasResults: results.length > 0
  };
}

export default useFuzzySearch;
