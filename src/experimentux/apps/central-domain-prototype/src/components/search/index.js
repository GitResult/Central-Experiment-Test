/**
 * Search & Autocomplete System
 * Export all search components and hooks
 */

export { default as SearchInput } from './SearchInput';
export { default as SearchResults } from './SearchResults';
export { default as SearchHighlight } from './SearchHighlight';

// Hooks
export { default as useSearch } from './hooks/useSearch';
export { default as useFuzzySearch } from './hooks/useFuzzySearch';
export { default as useSearchHistory } from './hooks/useSearchHistory';
