/**
 * Search Input
 * Universal search input with autocomplete and history
 */

import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { theme } from '../../config/theme';
import SearchResults from './SearchResults';
import useSearchHistory from './hooks/useSearchHistory';

export function SearchInput({
  placeholder = 'Search...',
  value,
  onChange,
  onSelect,
  results = [],
  isLoading = false,
  showHistory = true,
  historyNamespace = 'global',
  renderItem,
  size = 'md',
  autoFocus = false,
  className,
  style
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory(historyNamespace);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    onChange?.(e.target.value);
    setShowResults(true);
  };

  const handleSelect = (result) => {
    const selectedValue = result.item?.title || result.title || result.name || '';
    onChange?.(selectedValue);
    addToHistory(selectedValue);
    onSelect?.(result);
    setShowResults(false);
  };

  const handleHistorySelect = (query) => {
    onChange?.(query);
    setShowResults(false);
  };

  const handleClear = () => {
    onChange?.('');
    inputRef.current?.focus();
    setShowResults(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowResults(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay to allow click events on results
    setTimeout(() => {
      if (containerRef.current && !containerRef.current.contains(document.activeElement)) {
        setShowResults(false);
      }
    }, 200);
  };

  const inputHeight = {
    sm: theme.components.input.height.sm,
    md: theme.components.input.height.md,
    lg: theme.components.input.height.lg
  }[size];

  const inputPadding = {
    sm: theme.components.input.padding.sm,
    md: theme.components.input.padding.md,
    lg: theme.components.input.padding.lg
  }[size];

  const hasQuery = value && value.length > 0;
  const hasResults = results.length > 0;
  const showHistoryResults = showHistory && !hasQuery && history.length > 0;

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', width: '100%', ...style }}>
      {/* Input */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Search
          size={18}
          color={theme.colors.text.tertiary}
          style={{
            position: 'absolute',
            left: theme.spacing[3],
            pointerEvents: 'none'
          }}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value || ''}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoFocus={autoFocus}
          style={{
            width: '100%',
            height: inputHeight,
            paddingLeft: `calc(${theme.spacing[3]} + 18px + ${theme.spacing[2]})`,
            paddingRight: hasQuery ? `calc(${theme.spacing[3]} + 18px + ${theme.spacing[2]})` : inputPadding,
            border: `1px solid ${isFocused ? theme.colors.border.focus : theme.colors.border.default}`,
            borderRadius: theme.borderRadius.md,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.primary,
            backgroundColor: theme.colors.background.primary,
            outline: 'none',
            transition: `all ${theme.transitions.fast}`,
            boxShadow: isFocused ? theme.shadows.focus : 'none'
          }}
        />
        {hasQuery && (
          <button
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: theme.spacing[3],
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: theme.spacing[1],
              borderRadius: theme.borderRadius.sm,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.text.tertiary,
              transition: `all ${theme.transitions.fast}`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.interactive.hover;
              e.currentTarget.style.color = theme.colors.text.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = theme.colors.text.tertiary;
            }}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Results */}
      {showResults && (hasResults || showHistoryResults) && (
        <div
          style={{
            position: 'absolute',
            top: `calc(100% + ${theme.spacing[2]})`,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.dropdown
          }}
        >
          {hasResults ? (
            <SearchResults
              results={results}
              query={value}
              onSelect={handleSelect}
              isLoading={isLoading}
              renderItem={renderItem}
            />
          ) : showHistoryResults ? (
            <HistoryResults
              history={history}
              onSelect={handleHistorySelect}
              onRemove={removeFromHistory}
              onClear={clearHistory}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  results: PropTypes.array,
  isLoading: PropTypes.bool,
  showHistory: PropTypes.bool,
  historyNamespace: PropTypes.string,
  renderItem: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object
};

function HistoryResults({ history, onSelect, onRemove, onClear }) {
  return (
    <div
      style={{
        backgroundColor: theme.colors.background.elevated,
        borderRadius: theme.borderRadius.md,
        boxShadow: theme.shadows.lg,
        border: `1px solid ${theme.colors.border.default}`,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.colors.border.subtle}`,
          backgroundColor: theme.colors.background.secondary
        }}
      >
        <div
          style={{
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: theme.typography.letterSpacing.wide
          }}
        >
          Recent Searches
        </div>
        <button
          onClick={onClear}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
            padding: theme.spacing[1]
          }}
        >
          Clear all
        </button>
      </div>
      {history.map((query, index) => (
        <div
          key={index}
          style={{
            padding: theme.spacing[3],
            cursor: 'pointer',
            borderBottom: index < history.length - 1 ? `1px solid ${theme.colors.border.subtle}` : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: `background-color ${theme.transitions.fast}`
          }}
          onClick={() => onSelect(query)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.interactive.hover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
            <Clock size={14} color={theme.colors.text.tertiary} />
            <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.primary }}>
              {query}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(query);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: theme.spacing[1],
              borderRadius: theme.borderRadius.sm,
              display: 'flex',
              alignItems: 'center',
              color: theme.colors.text.tertiary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.interactive.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Remove from history"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}

HistoryResults.propTypes = {
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired
};

export default SearchInput;
