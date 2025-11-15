/**
 * IncrementalPhraseFilter Component
 *
 * Incremental phrase builder with granular chips matching ReportPhrase UX pattern.
 * Users build complex multi-criteria filters by adding chips incrementally.
 *
 * Features:
 * - Granular chip structure: Each word/concept is a separate chip
 * - Example: [Current] [members] [for] [5 years] [or more]
 * - Full keyboard support: Type to search, ↑↓ to navigate, Enter to select
 * - Start with cohort selection (Current, All Contacts, Lapsed, Pending)
 * - Immediately select entity type (members, students, professionals, volunteers)
 * - Add multiple conditions with contextual suggestions
 * - Chain criteria with "and" connectors
 * - Edit/remove individual chips
 * - Visual consistency with ReportPhrase
 * - Deterministic filter mapping
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, X, Plus, Zap, Users, MapPin, Award, Clock,
  Calendar, Filter, Check, Edit2
} from 'lucide-react';

// Animation styles matching ReportPhrase
const AnimationStyles = () => (
  <style>{`
    @keyframes chipPop {
      0% { opacity: 0; transform: scale(0.8); }
      60% { opacity: 1; transform: scale(1.05); }
      100% { opacity: 1; transform: scale(1); }
    }

    .chip-pop {
      animation: chipPop 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .chip-hover {
      transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .chip-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .slide-in {
      animation: slideIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
  `}</style>
);

// PhraseChip Component (matching ReportPhrase)
const PhraseChip = ({ chip, onRemove, onEdit, showRemove = false, showEdit = false, size = 'md', readOnly = false }) => {
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  };

  const IconComponent = chip.icon;

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-lg border-2 font-medium
        ${sizeClasses[size]}
        ${colorClasses[chip.color] || colorClasses.gray}
        ${!readOnly && 'chip-hover'}
      `}
    >
      {IconComponent && (
        <IconComponent className="w-4 h-4" strokeWidth={2} />
      )}
      <span>{chip.text}</span>
      {showEdit && onEdit && !readOnly && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="ml-1 hover:bg-white/50 rounded p-0.5 transition-colors"
          title="Edit"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      )}
      {showRemove && onRemove && !readOnly && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-white/50 rounded p-0.5 transition-colors"
          title="Remove"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

// Options selector modal with keyboard navigation
const OptionsSelector = ({ title, options, onSelect, onClose }) => {
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter options based on search text
  const filteredOptions = options.filter(option => {
    const displayText = typeof option === 'string' ? option : option.label || option.value;
    return displayText.toLowerCase().includes(searchText.toLowerCase());
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Reset selected index when filtered options change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchText]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredOptions.length > 0) {
      e.preventDefault();
      const selectedOption = filteredOptions[selectedIndex];
      const displayText = typeof selectedOption === 'string' ? selectedOption : selectedOption.label || selectedOption.value;
      onSelect(displayText);
      onClose();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 slide-in">
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl border-2 border-blue-200 p-6 max-w-lg w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search input */}
        <div className="mb-4">
          <input
            ref={inputRef}
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type to search..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchText && (
            <div className="mt-2 text-sm text-gray-500">
              {filteredOptions.length} result{filteredOptions.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Options list */}
        <div className="grid grid-cols-1 gap-2 overflow-y-auto flex-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, idx) => {
              const displayText = typeof option === 'string' ? option : option.label || option.value;
              const Icon = option.icon;
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    onSelect(displayText);
                    onClose();
                  }}
                  className={`px-4 py-3 text-left rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-blue-100 border-2 border-blue-400 text-blue-800'
                      : 'bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {displayText}
                </button>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-400">
              No results found for "{searchText}"
            </div>
          )}
        </div>

        {/* Keyboard hints */}
        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-gray-100 rounded">↑↓</kbd> Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
};

// Starting points - simplified to just the cohort
const STARTING_POINTS = [
  { id: 'current', label: 'Current', icon: Users, color: 'blue', type: 'cohort', filterHint: { status: 'Active' } },
  { id: 'all', label: 'All Contacts', icon: Users, color: 'gray', type: 'cohort', filterHint: {} },
  { id: 'lapsed', label: 'Lapsed', icon: X, color: 'red', type: 'cohort', filterHint: { status: 'Inactive' } },
  { id: 'pending', label: 'Pending', icon: Clock, color: 'yellow', type: 'cohort', filterHint: { status: 'Pending' } }
];

// Entity types that can follow "that have been"
const ENTITY_TYPES = [
  { label: 'members', type: 'MEMBER', color: 'blue', icon: Users },
  { label: 'students', type: 'STUDENT', color: 'emerald', icon: Users },
  { label: 'professionals', type: 'PROFESSIONAL', color: 'purple', icon: Award },
  { label: 'volunteers', type: 'VOLUNTEER', color: 'orange', icon: Users }
];

// Filter options
const FILTER_OPTIONS = {
  provinces: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador', 'Prince Edward Island'],
  cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
  membershipLevels: ['Premium', 'Professional', 'Student', 'Senior', 'Family', 'Corporate'],
  tenureValues: ['1 year', '2 years', '3 years', '5 years', '10 years', '15 years', '20 years'],
  tenureComparisons: ['or more', 'or less', 'exactly'],
  statuses: ['Active', 'Inactive', 'Pending', 'Suspended', 'Honorary'],
  educationLevels: ['High School', 'College Diploma', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate', 'Professional Certification'],
  donationStatus: ['Regular Donor', 'Major Donor', 'Monthly Donor', 'Legacy Donor', 'First-time Donor', 'Lapsed Donor'],
  donationAmounts: ['$100+', '$500+', '$1,000+', '$5,000+', '$10,000+', '$25,000+'],
  eventParticipation: ['Frequent Attendee', 'Occasional Attendee', 'Speaker', 'Sponsor', 'Volunteer', 'Never Attended'],
  committeeRoles: ['Committee Chair', 'Committee Member', 'Board Member', 'Advisory Board', 'Task Force Member'],
  awards: ['Volunteer of the Year', 'Leadership Award', 'Community Service Award', 'Lifetime Achievement', 'Innovation Award', 'Excellence Award']
};

// Contextual suggestions based on last chip
const CONTEXTUAL_SUGGESTIONS = {
  // After cohort (Current, All Contacts, Lapsed, Pending) -> immediately select entity type
  'Current': {
    needsValue: 'entityType',
    next: []
  },
  'All Contacts': {
    needsValue: 'entityType',
    next: []
  },
  'Lapsed': {
    needsValue: 'entityType',
    next: []
  },
  'Pending': {
    needsValue: 'entityType',
    next: []
  },

  // After entity type (members, students, professionals, volunteers)
  'members': {
    next: [
      { text: 'for', type: 'connector', color: 'gray' },
      { text: 'in', type: 'connector', color: 'gray' },
      { text: 'with', type: 'connector', color: 'gray' }
    ]
  },
  'students': {
    next: [
      { text: 'for', type: 'connector', color: 'gray' },
      { text: 'in', type: 'connector', color: 'gray' },
      { text: 'with', type: 'connector', color: 'gray' }
    ]
  },
  'professionals': {
    next: [
      { text: 'for', type: 'connector', color: 'gray' },
      { text: 'in', type: 'connector', color: 'gray' },
      { text: 'with', type: 'connector', color: 'gray' }
    ]
  },
  'volunteers': {
    next: [
      { text: 'for', type: 'connector', color: 'gray' },
      { text: 'in', type: 'connector', color: 'gray' },
      { text: 'with', type: 'connector', color: 'gray' }
    ]
  },

  // After "for" -> show tenure values
  'for': {
    needsValue: 'tenure',
    next: []
  },

  // After "in" -> needs specification
  'in': {
    next: [
      { text: 'province', type: 'connector', color: 'gray' },
      { text: 'city', type: 'connector', color: 'gray' }
    ]
  },

  // After "in province" -> show province values
  'province': {
    needsValue: 'province',
    next: []
  },

  // After "in city" -> show city values
  'city': {
    needsValue: 'city',
    next: []
  },

  // After "with" -> needs specification
  'with': {
    next: [
      { text: 'status', type: 'connector', color: 'gray' },
      { text: 'membership level', type: 'connector', color: 'gray' },
      { text: 'education level', type: 'connector', color: 'gray' },
      { text: 'donation status', type: 'connector', color: 'gray' },
      { text: 'event participation', type: 'connector', color: 'gray' },
      { text: 'committee role', type: 'connector', color: 'gray' },
      { text: 'award', type: 'connector', color: 'gray' }
    ]
  },

  // After "with status" -> show status values
  'status': {
    needsValue: 'status',
    next: []
  },

  // After "with membership level" -> show membership level values
  'membership level': {
    needsValue: 'membershipLevel',
    next: []
  },

  // After "with education level" -> show education level values
  'education level': {
    needsValue: 'educationLevel',
    next: []
  },

  // After "with donation status" -> show donation status values
  'donation status': {
    needsValue: 'donationStatus',
    next: []
  },

  // After "with event participation" -> show event participation values
  'event participation': {
    needsValue: 'eventParticipation',
    next: []
  },

  // After "with committee role" -> show committee role values
  'committee role': {
    needsValue: 'committeeRole',
    next: []
  },

  // After "with award" -> show award values
  'award': {
    needsValue: 'award',
    next: []
  },

  // After "who donated" -> show donation amounts
  'who donated': {
    needsValue: 'donationAmount',
    next: []
  },

  // After values -> chain more or finish
  '_afterValue': {
    next: [
      { text: 'and', type: 'connector', color: 'gray', icon: Plus }
    ]
  },

  // After "and"
  'and': {
    next: [
      { text: 'in', type: 'connector', color: 'gray' },
      { text: 'with', type: 'connector', color: 'gray' },
      { text: 'for', type: 'connector', color: 'gray' }
    ]
  }
};

const IncrementalPhraseFilter = ({ onApply, onClear, className = '' }) => {
  const [phraseChips, setPhraseChips] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [optionsModalData, setOptionsModalData] = useState(null);
  const [pendingChip, setPendingChip] = useState(null);

  // Update suggestions based on last chip
  useEffect(() => {
    if (phraseChips.length === 0) {
      setSuggestions([]);
      return;
    }

    const lastChip = phraseChips[phraseChips.length - 1];
    const contextKey = lastChip.text;

    if (CONTEXTUAL_SUGGESTIONS[contextKey]) {
      const context = CONTEXTUAL_SUGGESTIONS[contextKey];

      // If this connector needs a value selection, show modal
      if (context.needsValue && !lastChip.hasValue) {
        showValueSelector(context.needsValue, lastChip);
        setSuggestions([]);
      } else {
        setSuggestions(context.next || []);
      }
    } else if (lastChip.hasValue || lastChip.type === 'value') {
      // After a value chip, suggest chaining
      setSuggestions(CONTEXTUAL_SUGGESTIONS['_afterValue'].next);
    } else {
      setSuggestions([]);
    }
  }, [phraseChips]);

  // Convert phrase chips to filters
  useEffect(() => {
    if (phraseChips.length > 0) {
      const filters = phraseChipsToFilters(phraseChips);
      onApply(filters);
    }
  }, [phraseChips, onApply]);

  const showValueSelector = (valueType, connectorChip) => {
    let options = [];
    let title = '';

    switch(valueType) {
      case 'entityType':
        options = ENTITY_TYPES.map(et => ({ label: et.label, ...et }));
        title = 'Select Entity Type';
        break;
      case 'province':
        options = FILTER_OPTIONS.provinces;
        title = 'Select Province';
        break;
      case 'city':
        options = FILTER_OPTIONS.cities;
        title = 'Select City';
        break;
      case 'membershipLevel':
        options = FILTER_OPTIONS.membershipLevels;
        title = 'Select Membership Level';
        break;
      case 'tenure':
        options = FILTER_OPTIONS.tenureValues;
        title = 'Select Tenure';
        break;
      case 'status':
        options = FILTER_OPTIONS.statuses;
        title = 'Select Status';
        break;
      case 'educationLevel':
        options = FILTER_OPTIONS.educationLevels;
        title = 'Select Education Level';
        break;
      case 'donationStatus':
        options = FILTER_OPTIONS.donationStatus;
        title = 'Select Donation Status';
        break;
      case 'donationAmount':
        options = FILTER_OPTIONS.donationAmounts;
        title = 'Select Donation Amount';
        break;
      case 'eventParticipation':
        options = FILTER_OPTIONS.eventParticipation;
        title = 'Select Event Participation';
        break;
      case 'committeeRole':
        options = FILTER_OPTIONS.committeeRoles;
        title = 'Select Committee Role';
        break;
      case 'award':
        options = FILTER_OPTIONS.awards;
        title = 'Select Award';
        break;
      default:
        return;
    }

    setOptionsModalData({ title, options, valueType, connectorChip });
    setShowOptionsModal(true);
  };

  const handleValueSelected = (value) => {
    const { valueType, connectorChip, valueChip: previousValueChip, editingChipId } = optionsModalData;

    // Handle editing existing chip
    if (editingChipId) {
      if (valueType === 'entityType') {
        const selectedEntity = ENTITY_TYPES.find(et => et.label === value);
        const updatedChips = phraseChips.map(chip =>
          chip.id === editingChipId
            ? {
                ...chip,
                text: selectedEntity.label,
                entityTypeValue: selectedEntity.type,
                color: selectedEntity.color,
                icon: selectedEntity.icon
              }
            : chip
        );
        setPhraseChips(updatedChips);
      } else {
        // Update value chip
        const updatedChips = phraseChips.map(chip =>
          chip.id === editingChipId
            ? {
                ...chip,
                text: value,
                color: getColorForValueType(valueType),
                icon: getIconForValueType(valueType)
              }
            : chip
        );
        setPhraseChips(updatedChips);
      }
      return;
    }

    // Handle tenure comparison (or more, or less, exactly)
    if (valueType === 'tenureComparison') {
      const comparisonChip = {
        id: Date.now(),
        text: value,
        type: 'value',
        valueType: 'tenureComparison',
        color: 'blue',
        hasValue: true
      };
      setPhraseChips([...phraseChips, comparisonChip]);
      return;
    }

    // Handle entity type selection differently
    if (valueType === 'entityType') {
      const selectedEntity = ENTITY_TYPES.find(et => et.label === value);
      const entityChip = {
        id: Date.now(),
        text: selectedEntity.label,
        type: 'entityType',
        entityTypeValue: selectedEntity.type,
        color: selectedEntity.color,
        icon: selectedEntity.icon
      };

      // If there's a connector chip (not a cohort), mark it as having value
      if (connectorChip && connectorChip.type === 'connector') {
        const updatedChips = phraseChips.map(chip =>
          chip.id === connectorChip.id ? { ...chip, hasValue: true } : chip
        );
        setPhraseChips([...updatedChips, entityChip]);
      } else {
        // Entity type comes right after cohort (or no connector)
        setPhraseChips([...phraseChips, entityChip]);
      }
      return;
    }

    // Create value chip for other types
    const valueChip = {
      id: Date.now(),
      text: value,
      type: 'value',
      valueType: valueType,
      color: getColorForValueType(valueType),
      icon: getIconForValueType(valueType),
      hasValue: true
    };

    // Mark connector as having value and add value chip
    const updatedChips = phraseChips.map(chip =>
      chip.id === connectorChip.id ? { ...chip, hasValue: true } : chip
    );

    setPhraseChips([...updatedChips, valueChip]);

    // If tenure, need comparison
    if (valueType === 'tenure') {
      setTimeout(() => {
        setOptionsModalData({
          title: 'Select Comparison',
          options: FILTER_OPTIONS.tenureComparisons,
          valueType: 'tenureComparison',
          valueChip: valueChip
        });
        setShowOptionsModal(true);
      }, 100);
    }
  };

  const getColorForValueType = (valueType) => {
    const colors = {
      province: 'red',
      city: 'orange',
      membershipLevel: 'purple',
      tenure: 'blue',
      tenureComparison: 'blue',
      status: 'emerald',
      educationLevel: 'indigo',
      donationStatus: 'green',
      donationAmount: 'green',
      eventParticipation: 'yellow',
      committeeRole: 'purple',
      award: 'yellow'
    };
    return colors[valueType] || 'gray';
  };

  const getIconForValueType = (valueType) => {
    const icons = {
      province: MapPin,
      city: MapPin,
      membershipLevel: Award,
      tenure: Clock,
      status: Check,
      educationLevel: Award,
      donationStatus: Award,
      donationAmount: Award,
      eventParticipation: Calendar,
      committeeRole: Users,
      award: Award
    };
    return icons[valueType];
  };

  const addChip = (chip) => {
    const newChip = {
      ...chip,
      id: Date.now()
    };

    setPhraseChips([...phraseChips, newChip]);
  };

  const removeChip = (chipId) => {
    setPhraseChips(phraseChips.filter(c => c.id !== chipId));
  };

  const editChip = (chipId) => {
    const chipToEdit = phraseChips.find(c => c.id === chipId);
    if (!chipToEdit) return;

    // Only allow editing value chips and entity type chips
    if (chipToEdit.type === 'value') {
      // Show the appropriate value selector based on valueType
      let options = [];
      let title = '';

      switch(chipToEdit.valueType) {
        case 'province':
          options = FILTER_OPTIONS.provinces;
          title = 'Edit Province';
          break;
        case 'city':
          options = FILTER_OPTIONS.cities;
          title = 'Edit City';
          break;
        case 'membershipLevel':
          options = FILTER_OPTIONS.membershipLevels;
          title = 'Edit Membership Level';
          break;
        case 'tenure':
          options = FILTER_OPTIONS.tenureValues;
          title = 'Edit Tenure';
          break;
        case 'status':
          options = FILTER_OPTIONS.statuses;
          title = 'Edit Status';
          break;
        case 'educationLevel':
          options = FILTER_OPTIONS.educationLevels;
          title = 'Edit Education Level';
          break;
        case 'donationStatus':
          options = FILTER_OPTIONS.donationStatus;
          title = 'Edit Donation Status';
          break;
        case 'donationAmount':
          options = FILTER_OPTIONS.donationAmounts;
          title = 'Edit Donation Amount';
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
        case 'tenureComparison':
          options = FILTER_OPTIONS.tenureComparisons;
          title = 'Edit Comparison';
          break;
        default:
          return;
      }

      setOptionsModalData({
        title,
        options,
        valueType: chipToEdit.valueType,
        editingChipId: chipId
      });
      setShowOptionsModal(true);
    } else if (chipToEdit.type === 'entityType') {
      // Show entity type selector
      setOptionsModalData({
        title: 'Edit Entity Type',
        options: ENTITY_TYPES.map(et => ({ label: et.label, ...et })),
        valueType: 'entityType',
        editingChipId: chipId
      });
      setShowOptionsModal(true);
    }
  };

  const handleClear = () => {
    setPhraseChips([]);
    setSuggestions([]);
    onClear();
  };

  const handleStartingPoint = (startingPoint) => {
    const chip = {
      id: Date.now(),
      text: startingPoint.label,
      type: startingPoint.type,
      color: startingPoint.color,
      icon: startingPoint.icon,
      filterHint: startingPoint.filterHint
    };
    setPhraseChips([chip]);
  };

  return (
    <div className={`incremental-phrase-filter ${className}`}>
      <AnimationStyles />

      <div className="bg-white rounded-xl border-2 border-blue-200 p-6 mb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Build Your Phrase</span>
          </div>
          {phraseChips.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Phrase Chips */}
        <div className="flex flex-wrap gap-3 mb-6 min-h-[60px]">
          {phraseChips.map((chip) => {
            // Only show edit button for value chips and entity type chips
            const canEdit = chip.type === 'value' || chip.type === 'entityType';

            return (
              <div key={chip.id} className="chip-pop">
                <PhraseChip
                  chip={chip}
                  onRemove={() => removeChip(chip.id)}
                  onEdit={canEdit ? () => editChip(chip.id) : undefined}
                  showRemove={true}
                  showEdit={canEdit}
                  size="md"
                />
              </div>
            );
          })}

          {phraseChips.length === 0 && (
            <div className="text-gray-400 italic">Choose a starting point below...</div>
          )}
        </div>

        {/* Starting Points (only show if no chips) */}
        {phraseChips.length === 0 && (
          <div className="mb-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Start with
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {STARTING_POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <button
                    key={point.id}
                    onClick={() => handleStartingPoint(point)}
                    className="p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-left transition-all group"
                  >
                    <div className={`p-2 bg-${point.color}-100 rounded-lg w-fit mb-2 group-hover:bg-${point.color}-200 transition-colors`}>
                      <Icon className={`w-4 h-4 text-${point.color}-600`} strokeWidth={2} />
                    </div>
                    <div className="text-sm font-medium text-gray-900">{point.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4 slide-in">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700">Next Steps</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => addChip(suggestion)}
                className="px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-700 transition-all text-left flex items-center gap-2"
              >
                {suggestion.icon && <suggestion.icon className="w-4 h-4" />}
                {suggestion.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Options Modal */}
      {showOptionsModal && optionsModalData && (
        <OptionsSelector
          title={optionsModalData.title}
          options={optionsModalData.options}
          onSelect={handleValueSelected}
          onClose={() => setShowOptionsModal(false)}
        />
      )}
    </div>
  );
};

// Convert phrase chips to filter conditions
function phraseChipsToFilters(chips) {
  const filters = [];

  // Get cohort filters (Current, All Contacts, Lapsed, Pending)
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

  // Get entity type filter (members, students, professionals, volunteers)
  const entityTypeChip = chips.find(c => c.type === 'entityType');
  if (entityTypeChip && entityTypeChip.entityTypeValue) {
    filters.push({
      field: 'type',
      operator: 'eq',
      value: entityTypeChip.entityTypeValue,
      label: `Type: ${entityTypeChip.text}`
    });
  }

  // Process value chips
  let i = 0;
  while (i < chips.length) {
    const chip = chips[i];

    if (chip.type === 'value') {
      if (chip.valueType === 'province') {
        filters.push({
          field: 'province',
          operator: 'eq',
          value: chip.text,
          label: `Province: ${chip.text}`
        });
      } else if (chip.valueType === 'city') {
        filters.push({
          field: 'city',
          operator: 'eq',
          value: chip.text,
          label: `City: ${chip.text}`
        });
      } else if (chip.valueType === 'membershipLevel') {
        filters.push({
          field: 'membershipLevel',
          operator: 'eq',
          value: chip.text,
          label: `Level: ${chip.text}`
        });
      } else if (chip.valueType === 'status') {
        filters.push({
          field: 'status',
          operator: 'eq',
          value: chip.text,
          label: `Status: ${chip.text}`
        });
      } else if (chip.valueType === 'educationLevel') {
        filters.push({
          field: 'educationLevel',
          operator: 'eq',
          value: chip.text,
          label: `Education: ${chip.text}`
        });
      } else if (chip.valueType === 'donationStatus') {
        filters.push({
          field: 'donationStatus',
          operator: 'eq',
          value: chip.text,
          label: `Donation: ${chip.text}`
        });
      } else if (chip.valueType === 'donationAmount') {
        filters.push({
          field: 'donationAmount',
          operator: 'gte',
          value: chip.text,
          label: `Donated: ${chip.text}`
        });
      } else if (chip.valueType === 'eventParticipation') {
        filters.push({
          field: 'eventParticipation',
          operator: 'eq',
          value: chip.text,
          label: `Events: ${chip.text}`
        });
      } else if (chip.valueType === 'committeeRole') {
        filters.push({
          field: 'committeeRole',
          operator: 'eq',
          value: chip.text,
          label: `Committee: ${chip.text}`
        });
      } else if (chip.valueType === 'award') {
        filters.push({
          field: 'award',
          operator: 'eq',
          value: chip.text,
          label: `Award: ${chip.text}`
        });
      } else if (chip.valueType === 'tenure') {
        // Next chip should be comparison
        const comparisonChip = chips[i + 1];
        const years = parseInt(chip.text.split(' ')[0]);
        let operator = 'gte';

        if (comparisonChip && comparisonChip.valueType === 'tenureComparison') {
          if (comparisonChip.text === 'or less') operator = 'lte';
          else if (comparisonChip.text === 'exactly') operator = 'eq';
          i++; // Skip comparison chip
        }

        const opSymbol = operator === 'gte' ? '≥' : operator === 'lte' ? '≤' : '=';
        filters.push({
          field: 'tenureYears',
          operator,
          value: years,
          label: `Tenure: ${opSymbol} ${years} years`
        });
      }
    }

    i++;
  }

  return filters;
}

export default IncrementalPhraseFilter;
