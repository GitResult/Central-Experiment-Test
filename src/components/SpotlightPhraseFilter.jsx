/**
 * SpotlightPhraseFilter Component
 *
 * Apple Spotlight-style phrase builder with progressive disclosure.
 * Shows 3 levels: current (active), next (grayed), future (more grayed)
 * Like phone keyboard suggesting next words.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Users, X, Clock, Award, MapPin, Check, Calendar, Plus,
  Sparkles, Save, ChevronRight
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
      next: ENTITY_TYPES.map(et => ({ ...et, label: et.label, disabled: true })),
      future: [
        { label: 'that have been', disabled: true },
        { label: 'for', disabled: true },
        { label: 'in', disabled: true }
      ]
    };
  }

  const lastChip = chips[chips.length - 1];

  // After cohort -> entity types
  if (lastChip.type === 'cohort') {
    return {
      current: ENTITY_TYPES,
      next: [
        { label: 'that have been', icon: ChevronRight, disabled: true },
        { label: 'for', icon: Clock, disabled: true },
        { label: 'in', icon: MapPin, disabled: true },
        { label: 'with', icon: Check, disabled: true }
      ],
      future: FILTER_OPTIONS.provinces.slice(0, 4).map(p => ({ label: p, disabled: true }))
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
      next: FILTER_OPTIONS.tenureValues.slice(0, 6).map(t => ({ label: t, disabled: true })),
      future: FILTER_OPTIONS.provinces.slice(0, 4).map(p => ({ label: p, disabled: true }))
    };
  }

  // After "for" -> tenure values
  if (lastChip.text === 'for') {
    return {
      current: FILTER_OPTIONS.tenureValues.map(t => ({ label: t, type: 'value', valueType: 'tenure' })),
      next: FILTER_OPTIONS.tenureComparisons.map(c => ({ label: c, disabled: true })),
      future: [{ label: 'and', disabled: true }]
    };
  }

  // After tenure value -> comparisons
  if (lastChip.valueType === 'tenure' && !chips.find(c => c.valueType === 'tenureComparison')) {
    return {
      current: FILTER_OPTIONS.tenureComparisons.map(c => ({ label: c, type: 'value', valueType: 'tenureComparison' })),
      next: [{ label: 'and', disabled: true }],
      future: [{ label: 'in', disabled: true }, { label: 'with', disabled: true }]
    };
  }

  // After "in" -> province/city
  if (lastChip.text === 'in') {
    return {
      current: [
        { label: 'province', icon: MapPin, type: 'connector' },
        { label: 'city', icon: MapPin, type: 'connector' }
      ],
      next: FILTER_OPTIONS.provinces.slice(0, 6).map(p => ({ label: p, disabled: true })),
      future: [{ label: 'and', disabled: true }]
    };
  }

  // After "province" -> province values
  if (lastChip.text === 'province') {
    return {
      current: FILTER_OPTIONS.provinces.map(p => ({ label: p, type: 'value', valueType: 'province' })),
      next: [{ label: 'and', disabled: true }],
      future: [{ label: 'with', disabled: true }]
    };
  }

  // After "city" -> city values
  if (lastChip.text === 'city') {
    return {
      current: FILTER_OPTIONS.cities.map(c => ({ label: c, type: 'value', valueType: 'city' })),
      next: [{ label: 'and', disabled: true }],
      future: [{ label: 'with', disabled: true }]
    };
  }

  // After value -> "and" to chain
  if (lastChip.type === 'value' || lastChip.valueType === 'tenureComparison') {
    return {
      current: [{ label: 'and', icon: Plus, type: 'connector' }],
      next: [
        { label: 'in', disabled: true },
        { label: 'with', disabled: true },
        { label: 'for', disabled: true }
      ],
      future: []
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
      next: FILTER_OPTIONS.provinces.slice(0, 4).map(p => ({ label: p, disabled: true })),
      future: []
    };
  }

  return { current: [], next: [], future: [] };
};

const SpotlightPhraseFilter = ({ onApply, onClear, onSave, className = '' }) => {
  const [phraseChips, setPhraseChips] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');

  const suggestions = getSuggestionsForPhrase(phraseChips);

  // Filter current suggestions by search text
  const filteredCurrent = searchText
    ? suggestions.current.filter(s =>
        s.label.toLowerCase().includes(searchText.toLowerCase())
      )
    : suggestions.current;

  // Auto-select if only one option
  useEffect(() => {
    if (searchText && filteredCurrent.length === 1) {
      setSelectedIndex(0);
    }
  }, [searchText, filteredCurrent]);

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
      setSearchText('');
      setSelectedIndex(0);
    } else if (e.key === 'Backspace' && searchText === '' && phraseChips.length > 0) {
      // Delete last chip on backspace when input is empty
      e.preventDefault();
      setPhraseChips(phraseChips.slice(0, -1));
    }
  };

  const handleSelect = (suggestion) => {
    if (suggestion.disabled) return;

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

    setPhraseChips([...phraseChips, newChip]);
  };

  const removeChip = (index) => {
    setPhraseChips(phraseChips.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    setPhraseChips([]);
    setSearchText('');
    onClear();
  };

  const handleSaveQuery = () => {
    if (saveName.trim()) {
      onSave?.({ name: saveName, chips: phraseChips });
      setShowSaveDialog(false);
      setSaveName('');
    }
  };

  // Auto-apply when chips change
  useEffect(() => {
    // Convert to filters and apply
    const filters = phraseChipsToFilters(phraseChips);
    onApply(filters);
  }, [phraseChips, onApply]);

  return (
    <div className={`spotlight-phrase-filter ${className}`}>
      {/* Main Search Input - Full Width */}
      <div className="relative">
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
          <Sparkles className="w-4 h-4 text-gray-400" />

          {/* Chips */}
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {phraseChips.map((chip, idx) => (
              <div
                key={chip.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium"
              >
                {chip.icon && <chip.icon className="w-3 h-3" />}
                <span>{chip.text}</span>
                <button
                  onClick={() => removeChip(idx)}
                  className="hover:bg-blue-200 rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Input */}
            <input
              ref={searchInputRef}
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={phraseChips.length === 0 ? "Start typing or select below..." : "Continue..."}
              className="flex-1 min-w-[200px] outline-none text-sm py-1"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {phraseChips.length > 0 && (
              <>
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600"
                  title="Save query"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClear}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600"
                  title="Clear"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Translucent Suggestions Panel - Fixed Height */}
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl z-50 p-4" style={{ minHeight: '200px', maxHeight: '300px' }}>
          {/* Level 1: Current (Active, Full Color) */}
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              {phraseChips.length === 0 ? 'Start with' : 'Select'}
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredCurrent.map((suggestion, idx) => {
                const Icon = suggestion.icon;
                const isSelected = idx === selectedIndex;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      handleSelect(suggestion);
                      setSearchText('');
                      setSelectedIndex(0);
                    }}
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                      ${isSelected
                        ? 'bg-blue-500 text-white shadow-md scale-105'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }
                    `}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {suggestion.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level 2: Next (Grayed 50%) */}
          {suggestions.next.length > 0 && (
            <div className="mb-4 opacity-50">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Then
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.next.slice(0, 8).map((suggestion, idx) => {
                  const Icon = suggestion.icon;
                  return (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium"
                    >
                      {Icon && <Icon className="w-3.5 h-3.5" />}
                      {suggestion.label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Level 3: Future (Grayed 75%) */}
          {suggestions.future.length > 0 && (
            <div className="opacity-25">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                After that
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.future.slice(0, 6).map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium"
                  >
                    {suggestion.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Save Query</h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Enter query name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuery}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
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

export default SpotlightPhraseFilter;
