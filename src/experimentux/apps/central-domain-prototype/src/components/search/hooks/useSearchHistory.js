/**
 * useSearchHistory Hook
 * Manage recent search history
 */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'search-history';
const MAX_HISTORY_ITEMS = 10;

/**
 * Hook for managing search history
 * @param {string} namespace - Optional namespace for separate histories
 * @returns {Object} History state and functions
 */
export function useSearchHistory(namespace = 'global') {
  const [history, setHistory] = useState([]);

  const storageKey = `${STORAGE_KEY}-${namespace}`;

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load search history:', err);
    }
  }, [storageKey]);

  // Save history to localStorage
  const saveHistory = useCallback((newHistory) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (err) {
      console.error('Failed to save search history:', err);
    }
  }, [storageKey]);

  // Add item to history
  const addToHistory = useCallback((query) => {
    if (!query || !query.trim()) return;

    const trimmedQuery = query.trim();

    setHistory(prev => {
      // Remove duplicate if exists
      const filtered = prev.filter(item => item !== trimmedQuery);

      // Add to beginning and limit size
      const newHistory = [trimmedQuery, ...filtered].slice(0, MAX_HISTORY_ITEMS);

      // Save to localStorage
      saveHistory(newHistory);

      return newHistory;
    });
  }, [saveHistory]);

  // Remove item from history
  const removeFromHistory = useCallback((query) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item !== query);
      saveHistory(newHistory);
      return newHistory;
    });
  }, [saveHistory]);

  // Clear all history
  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory
  };
}

export default useSearchHistory;
