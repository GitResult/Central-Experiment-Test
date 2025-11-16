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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState({ title: '', options: [], valueType: '' });
  const [editModalSearch, setEditModalSearch] = useState('');
  const [editModalSelectedIndex, setEditModalSelectedIndex] = useState(0);
  const [ghostText, setGhostText] = useState('');
  const searchInputRef = useRef(null);
  const editModalInputRef = useRef(null);

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
        // Toggle: close if open, but opening is handled by parent component
        // We can only close from here since we don't have an onOpen callback
        if (isOpen) {
          onClose();
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
    if (e.key === 'Tab' && ghostText) {
      e.preventDefault();
      // Accept ghost text
      setSearchText(searchText + ghostText);
      setGhostText('');
    } else if (e.key === 'ArrowDown') {
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
    const chip = phraseChips[index];
    setEditingChipIndex(index);

    if (chip.type === 'value') {
      let options = [];
      let title = '';

      switch(chip.valueType) {
        case 'province':
          options = FILTER_OPTIONS.provinces;
          title = 'Edit Province';
          break;
        case 'city':
          options = FILTER_OPTIONS.cities;
          title = 'Edit City';
          break;
        case 'tenure':
          options = FILTER_OPTIONS.tenureValues;
          title = 'Edit Tenure';
          break;
        case 'tenureComparison':
          options = FILTER_OPTIONS.tenureComparisons;
          title = 'Edit Comparison';
          break;
        case 'membershipLevel':
          options = FILTER_OPTIONS.membershipLevels;
          title = 'Edit Membership Level';
          break;
        case 'educationLevel':
          options = FILTER_OPTIONS.educationLevels;
          title = 'Edit Education Level';
          break;
        case 'donationStatus':
          options = FILTER_OPTIONS.donationStatus;
          title = 'Edit Donation Status';
          break;
        case 'eventParticipation':
          options = FILTER_OPTIONS.eventParticipation;
          title = 'Edit Event Participation';
          break;
        case 'committeeRole':
          options = FILTER_OPTIONS.committeeRoles;
          title = 'Edit Committee Role';
          break;
        case 'award':
          options = FILTER_OPTIONS.awards;
          title = 'Edit Award';
          break;
        default:
          return;
      }

      setEditModalData({ title, options, valueType: chip.valueType });
      setEditModalSearch('');
      setEditModalSelectedIndex(0);
      setShowEditModal(true);
    } else if (chip.type === 'entityType') {
      setEditModalData({
        title: 'Edit Entity Type',
        options: ENTITY_TYPES.map(et => et.label),
        valueType: 'entityType'
      });
      setEditModalSearch('');
      setEditModalSelectedIndex(0);
      setShowEditModal(true);
    } else if (chip.type === 'cohort') {
      setEditModalData({
        title: 'Edit Starting Point',
        options: STARTING_POINTS.map(sp => sp.label),
        valueType: 'cohort'
      });
      setEditModalSearch('');
      setEditModalSelectedIndex(0);
      setShowEditModal(true);
    }
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

  const handleEditModalKeyDown = (e) => {
    const filteredOptions = editModalData.options.filter(opt =>
      opt.toLowerCase().includes(editModalSearch.toLowerCase())
    );

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setEditModalSelectedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setEditModalSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredOptions.length > 0) {
      e.preventDefault();
      handleEditModalSelect(filteredOptions[editModalSelectedIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowEditModal(false);
      setEditingChipIndex(null);
    }
  };

  const handleEditModalSelect = (value) => {
    if (editingChipIndex === null) return;

    const oldChip = phraseChips[editingChipIndex];
    let newChip = { ...oldChip, text: value };

    // For entity types and cohorts, need to update other properties
    if (editModalData.valueType === 'entityType') {
      const entityType = ENTITY_TYPES.find(et => et.label === value);
      if (entityType) {
        newChip = {
          ...oldChip,
          text: value,
          icon: entityType.icon,
          color: entityType.color,
          entityTypeValue: entityType.type
        };
      }
    } else if (editModalData.valueType === 'cohort') {
      const cohort = STARTING_POINTS.find(sp => sp.label === value);
      if (cohort) {
        newChip = {
          ...oldChip,
          text: value,
          icon: cohort.icon,
          color: cohort.color,
          filterHint: cohort.filterHint
        };
      }
    }

    const newChips = [...phraseChips];
    newChips[editingChipIndex] = newChip;
    setPhraseChips(newChips);

    setShowEditModal(false);
    setEditingChipIndex(null);
  };

  // Focus edit modal input when opened
  useEffect(() => {
    if (showEditModal && editModalInputRef.current) {
      editModalInputRef.current.focus();
    }
  }, [showEditModal]);

  // Calculate ghost text based on current input
  useEffect(() => {
    if (searchText && filteredCurrent.length > 0) {
      const topSuggestion = filteredCurrent[0].label;
      if (topSuggestion.toLowerCase().startsWith(searchText.toLowerCase())) {
        setGhostText(topSuggestion.slice(searchText.length));
      } else {
        setGhostText('');
      }
    } else {
      setGhostText('');
    }
  }, [searchText, filteredCurrent]);

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

            {/* Input with Ghost Text */}
            <div className="relative flex-1 min-w-[200px]">
              {/* Ghost Text */}
              {ghostText && (
                <div className="absolute inset-0 pointer-events-none flex items-center">
                  <span className="text-sm text-gray-400 select-none">
                    {searchText}<span className="text-gray-300">{ghostText}</span>
                  </span>
                  <span className="ml-2 text-xs text-gray-400 italic">Press Tab</span>
                </div>
              )}
              {/* Actual Input */}
              <input
                ref={searchInputRef}
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={phraseChips.length === 0 ? "Start typing or select below..." : "Continue..."}
                className="w-full outline-none text-sm py-1 bg-transparent relative z-10"
                style={{ caretColor: 'auto' }}
              />
            </div>
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

      {/* Edit Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center"
          onClick={() => {
            setShowEditModal(false);
            setEditingChipIndex(null);
          }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{editModalData.title}</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingChipIndex(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="px-6 py-3 border-b border-gray-100">
              <input
                ref={editModalInputRef}
                type="text"
                value={editModalSearch}
                onChange={(e) => {
                  setEditModalSearch(e.target.value);
                  setEditModalSelectedIndex(0);
                }}
                onKeyDown={handleEditModalKeyDown}
                placeholder="Search..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Options List */}
            <div className="max-h-[400px] overflow-y-auto">
              {editModalData.options
                .filter(opt => opt.toLowerCase().includes(editModalSearch.toLowerCase()))
                .map((option, idx) => {
                  const isSelected = idx === editModalSelectedIndex;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleEditModalSelect(option)}
                      className={`
                        w-full px-6 py-3 text-left text-sm font-medium transition-all
                        ${isSelected
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-gray-50 text-gray-900'
                        }
                      `}
                    >
                      {option}
                    </button>
                  );
                })}
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

export default GlobalPhraseCommand;
