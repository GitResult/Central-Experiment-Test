/**
 * IncrementalPhraseFilter Component
 *
 * Incremental phrase builder matching ReportPhrase UX pattern.
 * Users build complex multi-criteria filters by adding chips incrementally.
 *
 * Features:
 * - Start with entity selection (Current Members, All Contacts, etc.)
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

// Options selector modal
const OptionsSelector = ({ title, options, onSelect, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 slide-in">
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl border-2 border-blue-200 p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelect(typeof option === 'string' ? option : option.label || option.value);
                onClose();
              }}
              className="px-4 py-3 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-700 transition-all"
            >
              {typeof option === 'string' ? option : option.label || option.value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Starting points
const STARTING_POINTS = [
  { id: 'current', label: 'Current Members', icon: Users, color: 'blue', type: 'entity', filterHint: { status: 'Active', type: 'MEMBER' } },
  { id: 'all', label: 'All Contacts', icon: Users, color: 'gray', type: 'entity', filterHint: {} },
  { id: 'lapsed', label: 'Lapsed Members', icon: X, color: 'red', type: 'entity', filterHint: { status: 'Inactive', type: 'MEMBER' } },
  { id: 'students', label: 'Students', icon: Users, color: 'emerald', type: 'entity', filterHint: { type: 'STUDENT' } },
  { id: 'pending', label: 'Pending Members', icon: Clock, color: 'yellow', type: 'entity', filterHint: { status: 'Pending', type: 'MEMBER' } }
];

// Filter options
const FILTER_OPTIONS = {
  locations: ['California', 'Texas', 'Washington', 'Oregon', 'Colorado'],
  membershipLevels: ['Premium', 'Professional', 'Student'],
  tenureValues: ['1 year', '2 years', '3 years', '5 years', '10 years', '15 years'],
  tenureComparisons: ['or more', 'or less', 'exactly'],
  statuses: ['Active', 'Inactive', 'Pending'],
  types: ['Members', 'Students', 'All']
};

// Contextual suggestions based on last chip
const CONTEXTUAL_SUGGESTIONS = {
  // After entity
  'Current Members': {
    next: [
      { text: 'that have been members for', type: 'connector', color: 'gray' },
      { text: 'in location', type: 'connector', color: 'gray' },
      { text: 'with membership level', type: 'connector', color: 'gray' }
    ]
  },
  'All Contacts': {
    next: [
      { text: 'with status', type: 'connector', color: 'gray' },
      { text: 'in location', type: 'connector', color: 'gray' },
      { text: 'that have been members for', type: 'connector', color: 'gray' }
    ]
  },
  'Lapsed Members': {
    next: [
      { text: 'in location', type: 'connector', color: 'gray' },
      { text: 'that have been members for', type: 'connector', color: 'gray' },
      { text: 'with membership level', type: 'connector', color: 'gray' }
    ]
  },
  'Students': {
    next: [
      { text: 'in location', type: 'connector', color: 'gray' },
      { text: 'with status', type: 'connector', color: 'gray' }
    ]
  },
  'Pending Members': {
    next: [
      { text: 'in location', type: 'connector', color: 'gray' }
    ]
  },

  // After connectors -> value selection
  'that have been members for': {
    needsValue: 'tenure',
    next: []
  },
  'in location': {
    needsValue: 'location',
    next: []
  },
  'with membership level': {
    needsValue: 'membershipLevel',
    next: []
  },
  'with status': {
    needsValue: 'status',
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
      { text: 'in location', type: 'connector', color: 'gray' },
      { text: 'with membership level', type: 'connector', color: 'gray' },
      { text: 'that have been members for', type: 'connector', color: 'gray' },
      { text: 'with status', type: 'connector', color: 'gray' }
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
      case 'location':
        options = FILTER_OPTIONS.locations;
        title = 'Select Location';
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
      default:
        return;
    }

    setOptionsModalData({ title, options, valueType, connectorChip });
    setShowOptionsModal(true);
  };

  const handleValueSelected = (value) => {
    const { valueType, connectorChip } = optionsModalData;

    // Create value chip
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
      location: 'red',
      membershipLevel: 'purple',
      tenure: 'blue',
      tenureComparison: 'blue',
      status: 'emerald'
    };
    return colors[valueType] || 'gray';
  };

  const getIconForValueType = (valueType) => {
    const icons = {
      location: MapPin,
      membershipLevel: Award,
      tenure: Clock,
      status: Check
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
          {phraseChips.map((chip) => (
            <div key={chip.id} className="chip-pop">
              <PhraseChip
                chip={chip}
                onRemove={() => removeChip(chip.id)}
                showRemove={true}
                size="md"
              />
            </div>
          ))}

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

  // Get starting point filters
  const entityChip = chips.find(c => c.type === 'entity');
  if (entityChip && entityChip.filterHint) {
    Object.entries(entityChip.filterHint).forEach(([field, value]) => {
      filters.push({
        field,
        operator: 'eq',
        value,
        label: `${field.charAt(0).toUpperCase() + field.slice(1)}: ${value}`
      });
    });
  }

  // Process value chips
  let i = 0;
  while (i < chips.length) {
    const chip = chips[i];

    if (chip.type === 'value') {
      if (chip.valueType === 'location') {
        filters.push({
          field: 'location',
          operator: 'eq',
          value: chip.text,
          label: `Location: ${chip.text}`
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
