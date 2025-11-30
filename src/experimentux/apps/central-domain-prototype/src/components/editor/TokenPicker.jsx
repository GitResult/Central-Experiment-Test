/**
 * TokenPicker Component
 * Autocomplete input for theme tokens with fuzzy matching
 * Helps users discover and use theme tokens easily
 */

import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../config/theme';
import {
  fuzzyMatchTokens,
  getPopularTokens,
  tokenCategories,
  formatTokenLabel,
  validateToken,
  parseTokenTemplate,
} from '../../utils/themeTokenMatcher';

export function TokenPicker({
  value,
  onChange,
  context = null,
  placeholder = 'Search theme tokens...',
  showPreview = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Parse current value to extract token path
  const currentTokenPath = parseTokenTemplate(value);

  // Get matches based on query
  const matches = query.trim()
    ? fuzzyMatchTokens(query, {
        category: activeCategory,
        maxResults: 8,
      })
    : getPopularTokens(context)
        .slice(0, 8)
        .map((path) => ({
          path,
          template: `{{theme.${path}}}`,
          score: 1.0,
        }));

  // Handle input change
  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSelectedIndex(0);

    // Auto-open dropdown when typing
    if (newQuery.trim() && !isOpen) {
      setIsOpen(true);
    }
  };

  // Handle token selection
  const handleSelectToken = (token) => {
    onChange(token.template);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % matches.length);
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + matches.length) % matches.length);
        break;

      case 'Enter':
        e.preventDefault();
        if (matches[selectedIndex]) {
          handleSelectToken(matches[selectedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setQuery('');
        break;

      default:
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Validate current token
  const isValid = currentTokenPath ? validateToken(currentTokenPath) : true;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={query || value || ''}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: `${theme.spacing['2']} ${theme.spacing['3']}`,
          fontSize: theme.typography.fontSize.sm,
          color: isValid ? theme.colors.text.primary : theme.colors.error[500],
          backgroundColor: theme.colors.background.primary,
          border: `1px solid ${
            isValid ? theme.colors.border.default : theme.colors.error[500]
          }`,
          borderRadius: theme.borderRadius.md,
          outline: 'none',
        }}
      />

      {/* Token preview */}
      {showPreview && currentTokenPath && (
        <div
          style={{
            marginTop: theme.spacing['2'],
            padding: theme.spacing['2'],
            background: theme.colors.neutral[50],
            borderRadius: theme.borderRadius.sm,
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.secondary,
          }}
        >
          <div style={{ fontWeight: theme.typography.fontWeight.medium }}>
            Preview: {formatTokenLabel(currentTokenPath)}
          </div>
          <div style={{ marginTop: theme.spacing['1'], fontFamily: 'monospace' }}>
            {String(value)}
          </div>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && matches.length > 0 && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: theme.spacing['1'],
            background: theme.colors.background.primary,
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius.md,
            boxShadow: theme.shadows.lg,
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          {/* Category filters */}
          {!activeCategory && (
            <div
              style={{
                padding: theme.spacing['2'],
                borderBottom: `1px solid ${theme.colors.border.light}`,
                display: 'flex',
                gap: theme.spacing['1'],
                flexWrap: 'wrap',
              }}
            >
              {tokenCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: `${theme.spacing['1']} ${theme.spacing['2']}`,
                    fontSize: theme.typography.fontSize.xs,
                    background: theme.colors.neutral[100],
                    border: 'none',
                    borderRadius: theme.borderRadius.sm,
                    cursor: 'pointer',
                    color: theme.colors.text.secondary,
                  }}
                  title={cat.description}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Active category badge */}
          {activeCategory && (
            <div
              style={{
                padding: theme.spacing['2'],
                borderBottom: `1px solid ${theme.colors.border.light}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: theme.typography.fontSize.sm }}>
                {tokenCategories.find((c) => c.id === activeCategory)?.name}
              </span>
              <button
                onClick={() => setActiveCategory(null)}
                style={{
                  padding: theme.spacing['1'],
                  fontSize: theme.typography.fontSize.xs,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: theme.colors.text.secondary,
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Token list */}
          <div>
            {matches.map((token, index) => (
              <div
                key={token.path}
                onClick={() => handleSelectToken(token)}
                onMouseEnter={() => setSelectedIndex(index)}
                style={{
                  padding: theme.spacing['3'],
                  cursor: 'pointer',
                  background:
                    selectedIndex === index
                      ? theme.colors.primary[50]
                      : 'transparent',
                  borderLeft:
                    selectedIndex === index
                      ? `3px solid ${theme.colors.primary[500]}`
                      : '3px solid transparent',
                }}
              >
                <div
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.text.primary,
                    fontFamily: 'monospace',
                  }}
                >
                  {token.path}
                </div>
                <div
                  style={{
                    marginTop: theme.spacing['1'],
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.tertiary,
                  }}
                >
                  {token.template}
                </div>
                {token.score < 1 && (
                  <div
                    style={{
                      marginTop: theme.spacing['1'],
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.text.tertiary,
                    }}
                  >
                    Match: {Math.round(token.score * 100)}%
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Help text */}
          <div
            style={{
              padding: theme.spacing['2'],
              borderTop: `1px solid ${theme.colors.border.light}`,
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              textAlign: 'center',
            }}
          >
            ↑↓ Navigate • Enter Select • Esc Close
          </div>
        </div>
      )}
    </div>
  );
}

TokenPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  context: PropTypes.oneOf([
    'color',
    'background',
    'fontSize',
    'fontWeight',
    'spacing',
    'borderRadius',
    null,
  ]),
  placeholder: PropTypes.string,
  showPreview: PropTypes.bool,
};
