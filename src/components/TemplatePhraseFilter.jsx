/**
 * TemplatePhraseFilter Component
 *
 * Template-based phrase filtering matching ReportPhrase UX pattern.
 * Users build filters by clicking tokens in a sentence-like structure.
 *
 * Features:
 * - Template-based with predefined phrase patterns
 * - Token/slot UI matching ReportPhrase styling
 * - Popover editors for each token
 * - Deterministic mapping to filters
 * - Visual consistency with existing Phrase implementation
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, ChevronDown, Calendar, Users, MapPin, Award, Clock } from 'lucide-react';

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
  `}</style>
);

// Token/Chip component matching ReportPhrase styling
const PhraseToken = ({ token, value, onClick, readOnly = false }) => {
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

  const IconComponent = token.icon;

  return (
    <button
      onClick={readOnly ? undefined : onClick}
      disabled={readOnly}
      className={`
        inline-flex items-center gap-2 rounded-lg border-2 font-medium px-4 py-2 text-sm
        ${colorClasses[token.color] || colorClasses.blue}
        ${!readOnly && 'chip-hover cursor-pointer'}
        ${readOnly && 'cursor-default'}
      `}
    >
      {IconComponent && <IconComponent className="w-4 h-4" strokeWidth={2} />}
      <span>{value || token.defaultLabel}</span>
      {!readOnly && <ChevronDown className="w-3.5 h-3.5 ml-1" />}
    </button>
  );
};

// Static text component
const StaticText = ({ text }) => (
  <span className="text-gray-600 font-medium text-sm px-1">{text}</span>
);

// Popover for token editing
const TokenPopover = ({ token, currentValue, onSelect, onClose, anchorRef }) => {
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target) &&
          anchorRef.current && !anchorRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, anchorRef]);

  if (!anchorRef.current) return null;

  const rect = anchorRef.current.getBoundingClientRect();

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 bg-white rounded-lg shadow-2xl border-2 border-blue-200 p-3 min-w-[200px] max-h-[300px] overflow-y-auto"
      style={{
        top: `${rect.bottom + 8}px`,
        left: `${rect.left}px`,
      }}
    >
      {token.uiType === 'select' && (
        <div className="space-y-1">
          {token.options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                onClose();
              }}
              className={`
                w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${currentValue === option.value
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100 text-gray-700'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {token.uiType === 'number' && (
        <div className="space-y-3">
          <input
            type="number"
            value={currentValue || token.defaultValue || ''}
            onChange={(e) => onSelect(parseInt(e.target.value) || 0)}
            min={token.min || 0}
            max={token.max || 100}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex gap-2">
            {[1, 5, 10].map(inc => (
              <button
                key={inc}
                onClick={() => {
                  const newValue = Math.max(token.min || 0, (currentValue || 0) + inc);
                  onSelect(newValue);
                }}
                className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                +{inc}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Phrase template definitions
const PHRASE_TEMPLATES = [
  {
    id: 'membersByTenure',
    label: 'Members by tenure',
    icon: Clock,
    segments: [
      {
        type: 'token',
        tokenId: 'status',
        label: 'Status',
        icon: Users,
        color: 'emerald',
        uiType: 'select',
        defaultValue: 'Active',
        defaultLabel: 'Current',
        options: [
          { value: 'Active', label: 'Current' },
          { value: 'Inactive', label: 'Lapsed' },
          { value: 'Pending', label: 'Pending' },
          { value: 'All', label: 'All' }
        ]
      },
      { type: 'static', text: 'members that have been members for' },
      {
        type: 'token',
        tokenId: 'tenureValue',
        label: 'Duration',
        icon: Calendar,
        color: 'blue',
        uiType: 'number',
        defaultValue: 5,
        defaultLabel: '5',
        min: 0,
        max: 50
      },
      {
        type: 'token',
        tokenId: 'tenureUnit',
        label: 'Unit',
        color: 'blue',
        uiType: 'select',
        defaultValue: 'years',
        defaultLabel: 'years',
        options: [
          { value: 'years', label: 'years' },
          { value: 'months', label: 'months' }
        ]
      },
      {
        type: 'token',
        tokenId: 'comparison',
        label: 'Comparison',
        color: 'purple',
        uiType: 'select',
        defaultValue: 'gte',
        defaultLabel: 'or more',
        options: [
          { value: 'gte', label: 'or more' },
          { value: 'lte', label: 'or less' },
          { value: 'eq', label: 'exactly' }
        ]
      }
    ],
    toFilters: (values) => {
      const filters = [];

      // Status filter
      if (values.status && values.status !== 'All') {
        filters.push({
          field: 'status',
          operator: 'eq',
          value: values.status,
          label: `Status: ${values.status}`
        });
      }

      // Add type filter for members
      filters.push({
        field: 'type',
        operator: 'eq',
        value: 'MEMBER',
        label: 'Type: Member'
      });

      // Tenure filter
      const duration = parseInt(values.tenureValue) || 5;
      const unit = values.tenureUnit || 'years';
      const comparison = values.comparison || 'gte';

      // Convert to years if needed
      const yearsValue = unit === 'months' ? duration / 12 : duration;

      const opLabel = comparison === 'gte' ? '≥' : comparison === 'lte' ? '≤' : '=';
      filters.push({
        field: 'tenureYears',
        operator: comparison,
        value: yearsValue,
        label: `Tenure: ${opLabel} ${duration} ${unit}`
      });

      return filters;
    }
  },
  {
    id: 'membersByLocation',
    label: 'Members by location',
    icon: MapPin,
    segments: [
      {
        type: 'token',
        tokenId: 'status',
        label: 'Status',
        icon: Users,
        color: 'emerald',
        uiType: 'select',
        defaultValue: 'Active',
        defaultLabel: 'Current',
        options: [
          { value: 'Active', label: 'Current' },
          { value: 'Inactive', label: 'Lapsed' },
          { value: 'All', label: 'All' }
        ]
      },
      {
        type: 'token',
        tokenId: 'memberType',
        label: 'Type',
        icon: Users,
        color: 'blue',
        uiType: 'select',
        defaultValue: 'MEMBER',
        defaultLabel: 'members',
        options: [
          { value: 'MEMBER', label: 'members' },
          { value: 'STUDENT', label: 'students' },
          { value: 'All', label: 'all contacts' }
        ]
      },
      { type: 'static', text: 'in' },
      {
        type: 'token',
        tokenId: 'location',
        label: 'Location',
        icon: MapPin,
        color: 'red',
        uiType: 'select',
        defaultValue: 'California',
        defaultLabel: 'California',
        options: [
          { value: 'California', label: 'California' },
          { value: 'Texas', label: 'Texas' },
          { value: 'Washington', label: 'Washington' },
          { value: 'Oregon', label: 'Oregon' },
          { value: 'Colorado', label: 'Colorado' }
        ]
      }
    ],
    toFilters: (values) => {
      const filters = [];

      if (values.status && values.status !== 'All') {
        filters.push({
          field: 'status',
          operator: 'eq',
          value: values.status,
          label: `Status: ${values.status}`
        });
      }

      if (values.memberType && values.memberType !== 'All') {
        filters.push({
          field: 'type',
          operator: 'eq',
          value: values.memberType,
          label: `Type: ${values.memberType}`
        });
      }

      filters.push({
        field: 'location',
        operator: 'eq',
        value: values.location,
        label: `Location: ${values.location}`
      });

      return filters;
    }
  },
  {
    id: 'membershipLevel',
    label: 'By membership level',
    icon: Award,
    segments: [
      {
        type: 'token',
        tokenId: 'membershipLevel',
        label: 'Level',
        icon: Award,
        color: 'purple',
        uiType: 'select',
        defaultValue: 'Premium',
        defaultLabel: 'Premium',
        options: [
          { value: 'Premium', label: 'Premium' },
          { value: 'Professional', label: 'Professional' },
          { value: 'Student', label: 'Student' }
        ]
      },
      { type: 'static', text: 'members' }
    ],
    toFilters: (values) => {
      return [
        {
          field: 'membershipLevel',
          operator: 'eq',
          value: values.membershipLevel,
          label: `Level: ${values.membershipLevel}`
        },
        {
          field: 'type',
          operator: 'eq',
          value: 'MEMBER',
          label: 'Type: Member'
        }
      ];
    }
  }
];

const TemplatePhraseFilter = ({ onApply, onClear, className = '' }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(PHRASE_TEMPLATES[0]);
  const [tokenValues, setTokenValues] = useState({});
  const [openPopover, setOpenPopover] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const tokenRefs = useRef({});

  // Initialize default values for current template
  useEffect(() => {
    if (selectedTemplate) {
      const defaults = {};
      selectedTemplate.segments.forEach(segment => {
        if (segment.type === 'token') {
          defaults[segment.tokenId] = segment.defaultValue;
        }
      });
      setTokenValues(defaults);
    }
  }, [selectedTemplate]);

  // Auto-apply filters when values change
  useEffect(() => {
    if (selectedTemplate && Object.keys(tokenValues).length > 0) {
      const filters = selectedTemplate.toFilters(tokenValues);
      setAppliedFilters(filters);
      onApply(filters, tokenValues);
    }
  }, [tokenValues, selectedTemplate]);

  const handleTokenClick = (tokenId) => {
    setOpenPopover(openPopover === tokenId ? null : tokenId);
  };

  const handleTokenValueChange = (tokenId, value) => {
    setTokenValues(prev => ({
      ...prev,
      [tokenId]: value
    }));
  };

  const handleClear = () => {
    // Reset to defaults
    const defaults = {};
    selectedTemplate.segments.forEach(segment => {
      if (segment.type === 'token') {
        defaults[segment.tokenId] = segment.defaultValue;
      }
    });
    setTokenValues(defaults);
    setAppliedFilters([]);
    setOpenPopover(null);
    onClear();
  };

  const getTokenDisplayValue = (token) => {
    const value = tokenValues[token.tokenId];

    if (token.uiType === 'select') {
      const option = token.options.find(opt => opt.value === value);
      return option ? option.label : token.defaultLabel;
    }

    return value?.toString() || token.defaultLabel;
  };

  return (
    <div className={`phrase-filter-template ${className}`}>
      <AnimationStyles />

      {/* Template Selector */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">Phrase Template:</span>
        </div>
        <div className="flex gap-2">
          {PHRASE_TEMPLATES.map(template => {
            const Icon = template.icon;
            return (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${selectedTemplate.id === template.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {template.label}
              </button>
            );
          })}
        </div>
        {appliedFilters.length > 0 && (
          <button
            onClick={handleClear}
            className="ml-auto flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Phrase Display */}
      <div className="bg-white rounded-xl border-2 border-blue-200 p-6 mb-4">
        <div className="flex flex-wrap items-center gap-3 min-h-[48px]">
          {selectedTemplate.segments.map((segment, index) => {
            if (segment.type === 'static') {
              return <StaticText key={index} text={segment.text} />;
            }

            if (segment.type === 'token') {
              return (
                <div key={segment.tokenId} className="chip-pop" ref={el => tokenRefs.current[segment.tokenId] = el}>
                  <PhraseToken
                    token={segment}
                    value={getTokenDisplayValue(segment)}
                    onClick={() => handleTokenClick(segment.tokenId)}
                  />
                  {openPopover === segment.tokenId && (
                    <TokenPopover
                      token={segment}
                      currentValue={tokenValues[segment.tokenId]}
                      onSelect={(value) => handleTokenValueChange(segment.tokenId, value)}
                      onClose={() => setOpenPopover(null)}
                      anchorRef={{ current: tokenRefs.current[segment.tokenId] }}
                    />
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>

      {/* Applied Filters Display */}
      {appliedFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Applied Filters:
          </span>
          {appliedFilters.map((filter, index) => (
            <div
              key={index}
              className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium border-2 border-indigo-200 rounded-lg"
            >
              {filter.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplatePhraseFilter;
