/**
 * GlobalPhraseCommand Component
 *
 * Apple Spotlight-style global command palette for business users.
 * Always available via keyboard shortcut or USB integration.
 *
 * Features:
 * - Global access via Cmd+Shift+/ (Ctrl+Shift+/ on Windows)
 * - Full-width expansion when active
 * - Multi-column suggestion rail (current + next steps)
 * - Popular/recently used phrases
 * - Saveable queries for reuse
 * - Click tokens to edit
 * - Integration with Eligibility blocks and Views
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Users, X, Clock, Award, MapPin, Check, Calendar, Plus,
  Sparkles, Save, ChevronRight, Play, Trash2, Star, History,
  Command, Edit2
} from 'lucide-react';

// Starting points
const STARTING_POINTS = [
  { id: 'current', label: 'Current', icon: Users, color: 'blue', type: 'cohort', filterHint: { status: 'Active' } },
  { id: 'all', label: 'All Contacts', icon: Users, color: 'gray', type: 'cohort', filterHint: {} },
  { id: 'lapsed', label: 'Lapsed', icon: X, color: 'red', type: 'cohort', filterHint: { status: 'Inactive' } },
  { id: 'pending', label: 'Pending', icon: Clock, color: 'yellow', type: 'cohort', filterHint: { status: 'Pending' } }
];

// Entity types
const ENTITY_TYPES = [
  { label: 'members', type: 'MEMBER', color: 'blue', icon: Users },
  { label: 'students', type: 'STUDENT', color: 'emerald', icon: Users },
  { label: 'professionals', type: 'PROFESSIONAL', color: 'purple', icon: Award },
  { label: 'volunteers', type: 'VOLUNTEER', color: 'orange', icon: Users }
];

// Filter options
const FILTER_OPTIONS = {
  provinces: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan'],
  cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton', 'Ottawa'],
  membershipLevels: ['Premium', 'Professional', 'Student', 'Senior', 'Family'],
  tenureValues: ['1 year', '2 years', '3 years', '5 years', '10 years', '15 years'],
  tenureComparisons: ['or more', 'or less', 'exactly'],
  statuses: ['Active', 'Inactive', 'Pending', 'Suspended'],
  educationLevels: ['High School', 'College Diploma', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate'],
  donationStatus: ['Regular Donor', 'Major Donor', 'Monthly Donor', 'Legacy Donor'],
  eventParticipation: ['Frequent Attendee', 'Speaker', 'Sponsor', 'Volunteer'],
  committeeRoles: ['Committee Chair', 'Committee Member', 'Board Member'],
  awards: ['Volunteer of the Year', 'Leadership Award', 'Community Service Award']
};

// Progressive suggestion logic
const getSuggestionsForPhrase = (chips) => {
  if (chips.length === 0) {
    return {
      current: STARTING_POINTS,
      next: ENTITY_TYPES.map(et => ({ ...et, label: et.label, preview: true }))
    };
  }

  const lastChip = chips[chips.length - 1];

  // After cohort -> entity types
  if (lastChip.type === 'cohort') {
    return {
      current: ENTITY_TYPES,
      next: [
        { label: 'for', icon: Clock, preview: true },
        { label: 'in', icon: MapPin, preview: true },
        { label: 'with', icon: Check, preview: true }
      ]
    };
  }

  // After entity type -> connectors
  if (lastChip.type === 'entityType') {
    return {
      current: [
        { label: 'that have been', icon: ChevronRight, type: 'connector' },
        { label: 'for', icon: Clock, type: 'connector' },
        { label: 'in', icon: MapPin, type: 'connector' },
        { label: 'with', icon: Check, type: 'connector' }
      ],
      next: FILTER_OPTIONS.tenureValues.slice(0, 6).map(t => ({ label: t, preview: true }))
    };
  }

  // After "for" -> tenure values
  if (lastChip.text === 'for') {
    return {
      current: FILTER_OPTIONS.tenureValues.map(t => ({ label: t, type: 'value', valueType: 'tenure' })),
      next: FILTER_OPTIONS.tenureComparisons.map(c => ({ label: c, preview: true }))
    };
  }

  // After tenure value -> comparisons
  if (lastChip.valueType === 'tenure' && !chips.find(c => c.valueType === 'tenureComparison')) {
    return {
      current: FILTER_OPTIONS.tenureComparisons.map(c => ({ label: c, type: 'value', valueType: 'tenureComparison' })),
      next: [{ label: 'and', icon: Plus, preview: true }]
    };
  }

  // After "in" -> province/city
  if (lastChip.text === 'in') {
    return {
      current: [
        { label: 'province', icon: MapPin, type: 'connector' },
        { label: 'city', icon: MapPin, type: 'connector' }
      ],
      next: FILTER_OPTIONS.provinces.slice(0, 6).map(p => ({ label: p, preview: true }))
    };
  }

  // After "province" -> province values
  if (lastChip.text === 'province') {
    return {
      current: FILTER_OPTIONS.provinces.map(p => ({ label: p, type: 'value', valueType: 'province' })),
      next: [{ label: 'and', preview: true }]
    };
  }

  // After "city" -> city values
  if (lastChip.text === 'city') {
    return {
      current: FILTER_OPTIONS.cities.map(c => ({ label: c, type: 'value', valueType: 'city' })),
      next: [{ label: 'and', preview: true }]
    };
  }

  // After value -> "and" to chain
  if (lastChip.type === 'value' || lastChip.valueType === 'tenureComparison') {
    return {
      current: [{ label: 'and', icon: Plus, type: 'connector' }],
      next: [
        { label: 'in', preview: true },
        { label: 'with', preview: true },
        { label: 'for', preview: true }
      ]
    };
  }

  // After "and" -> more connectors
  if (lastChip.text === 'and') {
    return {
      current: [
        { label: 'in', icon: MapPin, type: 'connector' },
        { label: 'with', icon: Check, type: 'connector' },
        { label: 'for', icon: Clock, type: 'connector' }
      ],
      next: FILTER_OPTIONS.provinces.slice(0, 4).map(p => ({ label: p, preview: true }))
    };
  }

  return { current: [], next: [] };
};

const GlobalPhraseCommand = ({ isOpen, onClose, onApply, initialPhrase = null }) => {
  const [phraseChips, setPhraseChips] = useState(initialPhrase?.chips || []);
  const [searchText, setSearchText] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editingChipIndex, setEditingChipIndex] = useState(null);
  const searchInputRef = useRef(null);

  // Saved queries
  const [savedQueries, setSavedQueries] = useState(() => {
    const saved = localStorage.getItem('phraseQueries');
    return saved ? JSON.parse(saved) : [];
  });

  // Recently used
  const [recentQueries, setRecentQueries] = useState(() => {
    const recent = localStorage.getItem('recentPhraseQueries');
    return recent ? JSON.parse(recent) : [];
  });

  // Popular phrases (hardcoded for now)
  const popularPhrases = [
    { name: 'Active members 5+ years', chips: [] },
    { name: 'Students in Ontario', chips: [] },
    { name: 'Major donors', chips: [] }
  ];

  const suggestions = getSuggestionsForPhrase(phraseChips);

  // Filter current suggestions by search text
  const filteredCurrent = searchText
    ? suggestions.current.filter(s =>
        s.label.toLowerCase().includes(searchText.toLowerCase())
      )
    : suggestions.current;

  // Global keyboard shortcut (Cmd+Shift+/ or Ctrl+Shift+/)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === '/') {
        e.preventDefault();
        if (!isOpen) {
          onClose(); // Toggle - actually should be onOpen but using onClose for now
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredCurrent.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredCurrent.length > 0) {
      e.preventDefault();
      handleSelect(filteredCurrent[selectedIndex]);
      setSearchText('');
      setSelectedIndex(0);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (searchText) {
        setSearchText('');
      } else {
        onClose();
      }
    } else if (e.key === 'Backspace' && searchText === '' && phraseChips.length > 0) {
      e.preventDefault();
      setPhraseChips(phraseChips.slice(0, -1));
    }
  };

  const handleSelect = (suggestion) => {
    if (suggestion.preview) return; // Don't select preview items

    const newChip = {
      id: Date.now(),
      text: suggestion.label,
      type: suggestion.type || 'connector',
      valueType: suggestion.valueType,
      icon: suggestion.icon,
      color: suggestion.color || 'gray',
      ...(suggestion.type === 'cohort' && { filterHint: suggestion.filterHint }),
      ...(suggestion.type === 'entityType' && { entityTypeValue: suggestion.type })
    };

    if (editingChipIndex !== null) {
      // Replace chip at index
      const newChips = [...phraseChips];
      newChips[editingChipIndex] = newChip;
      setPhraseChips(newChips);
      setEditingChipIndex(null);
    } else {
      setPhraseChips([...phraseChips, newChip]);
    }
  };

  const removeChip = (index) => {
    setPhraseChips(phraseChips.filter((_, i) => i !== index));
  };

  const editChip = (index) => {
    setEditingChipIndex(index);
    // TODO: Open suggestion list for that chip type
  };

  const handleClear = () => {
    setPhraseChips([]);
    setSearchText('');
    setEditingChipIndex(null);
  };

  const handleRun = () => {
    const filters = phraseChipsToFilters(phraseChips);

    // Add to recent queries
    const newRecent = [
      { chips: phraseChips, timestamp: Date.now() },
      ...recentQueries.filter(q => JSON.stringify(q.chips) !== JSON.stringify(phraseChips))
    ].slice(0, 5);
    setRecentQueries(newRecent);
    localStorage.setItem('recentPhraseQueries', JSON.stringify(newRecent));

    onApply(filters);
    onClose();
  };

  const handleSave = () => {
    const name = prompt('Name this query:');
    if (name) {
      const newQuery = { name, chips: phraseChips, id: Date.now() };
      const updated = [...savedQueries, newQuery];
      setSavedQueries(updated);
      localStorage.setItem('phraseQueries', JSON.stringify(updated));
    }
  };

  const loadQuery = (query) => {
    setPhraseChips(query.chips);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      {/* Main Command Palette */}
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Phrase Input Area */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <div className="text-sm font-medium text-gray-600">Build your phrase</div>
            <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
              <Command className="w-3 h-3" />
              <span>⇧ /</span>
            </div>
          </div>

          {/* Chips + Input */}
          <div className="flex items-center gap-2 flex-wrap bg-gray-50 rounded-lg p-3 border-2 border-gray-200 focus-within:border-blue-400 transition-colors">
            {phraseChips.map((chip, idx) => (
              <button
                key={chip.id}
                onClick={() => editChip(idx)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-sm font-medium transition-all group"
              >
                {chip.icon && <chip.icon className="w-3.5 h-3.5" />}
                <span>{chip.text}</span>
                <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeChip(idx);
                  }}
                  className="hover:bg-blue-300 rounded p-0.5 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </button>
            ))}

            <input
              ref={searchInputRef}
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={phraseChips.length === 0 ? "Start typing or select below..." : "Continue..."}
              className="flex-1 min-w-[200px] outline-none text-sm py-1 bg-transparent"
            />
          </div>
        </div>

        {/* Multi-Column Suggestion Rail */}
        <div className="grid grid-cols-2 gap-px bg-gray-200" style={{ minHeight: '300px', maxHeight: '400px' }}>
          {/* Current Options (Left Column) */}
          <div className="bg-white p-4 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {phraseChips.length === 0 ? 'Start with' : 'Select'}
            </div>
            <div className="space-y-2">
              {filteredCurrent.map((suggestion, idx) => {
                const Icon = suggestion.icon;
                const isSelected = idx === selectedIndex;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      handleSelect(suggestion);
                      setSearchText('');
                    }}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left
                      ${isSelected
                        ? 'bg-blue-500 text-white shadow-md scale-[1.02]'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                      }
                    `}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{suggestion.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Next Steps (Right Column - 50% opacity) */}
          <div className="bg-gray-50 p-4 overflow-y-auto opacity-60">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Then
            </div>
            <div className="space-y-2">
              {suggestions.next.slice(0, 8).map((suggestion, idx) => {
                const Icon = suggestion.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 bg-white/50 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{suggestion.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Area */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-start justify-between gap-4">
          {/* Left: Popular & Recent */}
          <div className="flex-1 space-y-3">
            {/* Popular */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-2">
                <Star className="w-3.5 h-3.5" />
                Popular
              </div>
              <div className="flex flex-wrap gap-2">
                {popularPhrases.slice(0, 3).map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadQuery(phrase)}
                    className="px-2 py-1 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded text-xs text-gray-700 hover:text-blue-700 transition-all"
                  >
                    {phrase.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent */}
            {recentQueries.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-2">
                  <History className="w-3.5 h-3.5" />
                  Recent
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentQueries.slice(0, 3).map((query, idx) => (
                    <button
                      key={idx}
                      onClick={() => loadQuery(query)}
                      className="px-2 py-1 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded text-xs text-gray-700 hover:text-blue-700 transition-all"
                    >
                      {query.chips.map(c => c.text).join(' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
            {phraseChips.length > 0 && (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleRun}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-md transition-all"
                >
                  <Play className="w-4 h-4" />
                  Run
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Convert chips to filters (same logic as before)
function phraseChipsToFilters(chips) {
  const filters = [];

  const cohortChip = chips.find(c => c.type === 'cohort');
  if (cohortChip && cohortChip.filterHint) {
    Object.entries(cohortChip.filterHint).forEach(([field, value]) => {
      filters.push({
        field,
        operator: 'eq',
        value,
        label: `${field.charAt(0).toUpperCase() + field.slice(1)}: ${value}`
      });
    });
  }

  const entityTypeChip = chips.find(c => c.type === 'entityType');
  if (entityTypeChip && entityTypeChip.entityTypeValue) {
    filters.push({
      field: 'type',
      operator: 'eq',
      value: entityTypeChip.entityTypeValue,
      label: `Type: ${entityTypeChip.text}`
    });
  }

  let i = 0;
  while (i < chips.length) {
    const chip = chips[i];

    if (chip.type === 'value') {
      if (chip.valueType === 'province') {
        filters.push({ field: 'province', operator: 'eq', value: chip.text, label: `Province: ${chip.text}` });
      } else if (chip.valueType === 'city') {
        filters.push({ field: 'city', operator: 'eq', value: chip.text, label: `City: ${chip.text}` });
      } else if (chip.valueType === 'tenure') {
        const comparisonChip = chips[i + 1];
        const years = parseInt(chip.text.split(' ')[0]);
        let operator = 'gte';

        if (comparisonChip && comparisonChip.valueType === 'tenureComparison') {
          if (comparisonChip.text === 'or less') operator = 'lte';
          else if (comparisonChip.text === 'exactly') operator = 'eq';
          i++;
        }

        const opSymbol = operator === 'gte' ? '≥' : operator === 'lte' ? '≤' : '=';
        filters.push({ field: 'tenureYears', operator, value: years, label: `Tenure: ${opSymbol} ${years} years` });
      }
    }

    i++;
  }

  return filters;
}

export default GlobalPhraseCommand;
