/**
 * PhraseFilter Component
 *
 * Smart phrase-based filtering with natural language input.
 * Converts phrases like "current members 5+ years" into structured filters.
 *
 * Features:
 * - Natural language input with pattern matching
 * - Visual chip representation of applied filters
 * - Edit/remove individual filter conditions
 * - Extensible pattern library
 * - No AI/backend required - pure client-side regex matching
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, Info, Check } from 'lucide-react';

/**
 * Calculate years between two dates
 */
const calculateYears = (startDate, endDate = new Date()) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const years = (end - start) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(years);
};

/**
 * Pattern matching library
 * Each pattern has:
 * - regex: Regular expression to match the phrase
 * - extract: Function to extract filter conditions from the match
 * - description: Human-readable description
 * - examples: Example phrases that match this pattern
 */
const PHRASE_PATTERNS = [
  {
    id: 'current-members-tenure',
    regex: /(?:current|active)\s+members?\s+(?:with|who have been|that have been)?\s*(?:members?\s+)?(?:for\s+)?(\d+)\s*\+?\s*years?(?:\s+or\s+more)?/i,
    extract: (match) => [
      { field: 'status', operator: 'eq', value: 'Active', label: 'Status: Active' },
      { field: 'type', operator: 'eq', value: 'MEMBER', label: 'Type: Member' },
      { field: 'tenureYears', operator: 'gte', value: parseInt(match[1]), label: `Tenure: ${match[1]}+ years` }
    ],
    description: 'Current members with minimum tenure',
    examples: ['current members 5+ years', 'active members who have been members for 5 years or more']
  },
  {
    id: 'status-filter',
    regex: /^(active|inactive|current|lapsed|pending)\s+(?:members?|contacts?)/i,
    extract: (match) => {
      const statusMap = {
        'active': 'Active',
        'current': 'Active',
        'inactive': 'Inactive',
        'lapsed': 'Inactive',
        'pending': 'Pending'
      };
      return [
        { field: 'status', operator: 'eq', value: statusMap[match[1].toLowerCase()], label: `Status: ${statusMap[match[1].toLowerCase()]}` }
      ];
    },
    description: 'Filter by member status',
    examples: ['active members', 'inactive contacts', 'pending members']
  },
  {
    id: 'member-type',
    regex: /^(student|member)s?\s*(?:only)?/i,
    extract: (match) => [
      { field: 'type', operator: 'eq', value: match[1].toUpperCase(), label: `Type: ${match[1].charAt(0).toUpperCase() + match[1].slice(1)}` }
    ],
    description: 'Filter by membership type',
    examples: ['students only', 'members', 'student']
  },
  {
    id: 'location-filter',
    regex: /(?:in|from)\s+(california|texas|washington|oregon|colorado)/i,
    extract: (match) => [
      { field: 'location', operator: 'eq', value: match[1].charAt(0).toUpperCase() + match[1].slice(1), label: `Location: ${match[1].charAt(0).toUpperCase() + match[1].slice(1)}` }
    ],
    description: 'Filter by location',
    examples: ['in California', 'from Texas', 'in Washington']
  },
  {
    id: 'tenure-only',
    regex: /(\d+)\s*\+?\s*years?(?:\s+or\s+more)?(?:\s+tenure)?/i,
    extract: (match) => [
      { field: 'tenureYears', operator: 'gte', value: parseInt(match[1]), label: `Tenure: ${match[1]}+ years` }
    ],
    description: 'Filter by tenure years',
    examples: ['5+ years', '10 years or more', '3 years tenure']
  },
  {
    id: 'recent-signups',
    regex: /(?:recent|new)\s+(?:signups?|members?|joins?)/i,
    extract: () => [
      { field: 'tenureYears', operator: 'lte', value: 1, label: 'Recent signups (≤1 year)' }
    ],
    description: 'Recent signups (within 1 year)',
    examples: ['recent signups', 'new members', 'recent joins']
  },
  {
    id: 'premium-members',
    regex: /(premium|vip|professional)\s+members?/i,
    extract: (match) => {
      const level = match[1].charAt(0).toUpperCase() + match[1].slice(1);
      return [
        { field: 'membershipLevel', operator: 'eq', value: level, label: `Level: ${level}` }
      ];
    },
    description: 'Filter by membership level',
    examples: ['premium members', 'VIP members', 'professional members']
  }
];

/**
 * Parse a phrase and extract filter conditions
 */
const parsePhrase = (phrase) => {
  if (!phrase || phrase.trim() === '') {
    return [];
  }

  const trimmedPhrase = phrase.trim();

  // Try each pattern
  for (const pattern of PHRASE_PATTERNS) {
    const match = trimmedPhrase.match(pattern.regex);
    if (match) {
      return pattern.extract(match);
    }
  }

  // No pattern matched
  return null;
};

/**
 * PhraseFilter Component
 */
const PhraseFilter = ({ onApply, onClear, className = '' }) => {
  const [inputValue, setInputValue] = useState('');
  const [filters, setFilters] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [parseError, setParseError] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  // Get example suggestions based on input
  const getSuggestions = () => {
    if (!inputValue || inputValue.length < 2) {
      return PHRASE_PATTERNS.slice(0, 5).map(p => p.examples[0]);
    }

    const searchLower = inputValue.toLowerCase();
    const matches = [];

    PHRASE_PATTERNS.forEach(pattern => {
      pattern.examples.forEach(example => {
        if (example.toLowerCase().includes(searchLower) && matches.length < 5) {
          matches.push(example);
        }
      });
    });

    return matches.length > 0 ? matches : PHRASE_PATTERNS.slice(0, 3).map(p => p.examples[0]);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setParseError(false);
    setShowSuggestions(value.length > 0);
  };

  // Handle phrase apply
  const handleApply = () => {
    if (!inputValue.trim()) {
      return;
    }

    const parsedFilters = parsePhrase(inputValue);

    if (parsedFilters === null) {
      setParseError(true);
      setShowSuggestions(true);
      return;
    }

    setFilters(parsedFilters);
    setParseError(false);
    setShowSuggestions(false);
    onApply(parsedFilters, inputValue);
  };

  // Handle clear
  const handleClear = () => {
    setInputValue('');
    setFilters([]);
    setParseError(false);
    setShowSuggestions(false);
    onClear();
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    const parsedFilters = parsePhrase(suggestion);
    if (parsedFilters) {
      setFilters(parsedFilters);
      onApply(parsedFilters, suggestion);
    }
  };

  // Handle removing individual filter chip
  const handleRemoveChip = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);

    if (newFilters.length === 0) {
      handleClear();
    } else {
      onApply(newFilters, inputValue);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApply();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className={`phrase-filter-container ${className}`}>
      {/* Input Area */}
      <div className="relative">
        <div className={`flex items-center gap-2 px-4 py-2.5 bg-white border-2 rounded-lg transition-all ${
          focused ? 'border-indigo-500 shadow-lg' : parseError ? 'border-red-400' : 'border-gray-200'
        }`}>
          <Sparkles className={`w-5 h-5 ${focused ? 'text-indigo-600' : 'text-gray-400'}`} />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onFocus={() => {
              setFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setFocused(false);
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder="Try: current members 5+ years, students in California, recent signups..."
            className="flex-1 outline-none text-sm text-gray-900 placeholder-gray-400"
          />
          {inputValue && (
            <>
              <button
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Clear phrase"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={handleApply}
                className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition-colors flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                Apply
              </button>
            </>
          )}
        </div>

        {/* Error Message */}
        {parseError && (
          <div className="absolute top-full left-0 right-0 mt-1 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Couldn't understand this phrase. Try one of the suggestions below.</span>
          </div>
        )}

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Example Phrases
              </div>
              {getSuggestions().map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Filter Chips */}
      {filters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-3 animate-slideIn">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Applied Filters:
          </span>
          {filters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium border border-indigo-200 rounded-full hover:bg-indigo-100 transition-colors"
            >
              <span>{filter.label}</span>
              <button
                onClick={() => handleRemoveChip(index)}
                className="hover:text-indigo-900 transition-colors"
                title="Remove filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      {filters.length === 0 && !focused && (
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          <span>Type naturally and press Enter, or click a suggestion</span>
        </div>
      )}
    </div>
  );
};

export default PhraseFilter;
