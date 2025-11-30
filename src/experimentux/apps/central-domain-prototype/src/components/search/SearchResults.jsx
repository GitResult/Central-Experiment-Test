/**
 * Search Results
 * Displays search results with highlighting and keyboard navigation
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../config/theme';
import SearchHighlight from './SearchHighlight';

export function SearchResults({
  results,
  query,
  onSelect,
  isLoading = false,
  emptyMessage = 'No results found',
  renderItem,
  maxHeight = '400px'
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (results.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            onSelect?.(results[selectedIndex]);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex, onSelect]);

  if (isLoading) {
    return (
      <div
        style={{
          padding: theme.spacing[6],
          textAlign: 'center',
          color: theme.colors.text.tertiary,
          fontSize: theme.typography.fontSize.sm
        }}
      >
        Searching...
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div
        style={{
          padding: theme.spacing[6],
          textAlign: 'center',
          color: theme.colors.text.tertiary,
          fontSize: theme.typography.fontSize.sm
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      style={{
        maxHeight,
        overflowY: 'auto',
        backgroundColor: theme.colors.background.elevated,
        borderRadius: theme.borderRadius.md,
        boxShadow: theme.shadows.lg,
        border: `1px solid ${theme.colors.border.default}`
      }}
    >
      {results.map((result, index) => (
        <SearchResultItem
          key={result.id || index}
          result={result}
          query={query}
          isSelected={index === selectedIndex}
          onSelect={() => onSelect?.(result)}
          renderItem={renderItem}
        />
      ))}
    </div>
  );
}

SearchResults.propTypes = {
  results: PropTypes.array.isRequired,
  query: PropTypes.string,
  onSelect: PropTypes.func,
  isLoading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  renderItem: PropTypes.func,
  maxHeight: PropTypes.string
};

function SearchResultItem({ result, query, isSelected, onSelect, renderItem }) {
  if (renderItem) {
    return renderItem(result, query, isSelected, onSelect);
  }

  // Default rendering
  const title = result.item?.title || result.title || result.name || 'Untitled';
  const description = result.item?.description || result.description || '';

  return (
    <div
      onClick={onSelect}
      style={{
        padding: theme.spacing[3],
        cursor: 'pointer',
        backgroundColor: isSelected ? theme.colors.interactive.selected : 'transparent',
        borderBottom: `1px solid ${theme.colors.border.subtle}`,
        transition: `background-color ${theme.transitions.fast}`
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = theme.colors.interactive.hover;
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <div
        style={{
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.text.primary,
          marginBottom: description ? theme.spacing[1] : 0
        }}
      >
        <SearchHighlight text={title} query={query} />
      </div>
      {description && (
        <div
          style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
            lineHeight: theme.typography.lineHeight.snug
          }}
        >
          <SearchHighlight text={description} query={query} />
        </div>
      )}
    </div>
  );
}

SearchResultItem.propTypes = {
  result: PropTypes.object.isRequired,
  query: PropTypes.string,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  renderItem: PropTypes.func
};

export default SearchResults;
