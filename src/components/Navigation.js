/**
 * Navigation Component
 *
 * Main navigation page providing access to all available components in the application.
 * Acts as a central hub with component descriptions and easy navigation.
 *
 * Features:
 * - Grid layout of all available components
 * - Component descriptions and feature lists
 * - Visual icons for each component
 * - Responsive design
 * - Search/filter functionality
 *
 * @component
 * @param {Function} onNavigate - Callback function to handle navigation to components
 * @returns {React.Component} Navigation component
 */

import React, { useState, useRef } from 'react';
import {
  BarChart3, Users, Search, FileText, TrendingUp,
  Database, Maximize2, Cpu, Home, Sparkles, Briefcase, ListFilter, X,
  Clock, MapPin, Check, Plus, ChevronRight
} from 'lucide-react';

// Import suggestion logic from GlobalPhraseCommand
const STARTING_POINTS = [
  { id: 'current', label: 'Current', icon: Users, color: 'blue', type: 'cohort', filterHint: { status: 'Active' } },
  { id: 'all', label: 'All Contacts', icon: Users, color: 'gray', type: 'cohort', filterHint: {} },
  { id: 'lapsed', label: 'Lapsed', icon: X, color: 'red', type: 'cohort', filterHint: { status: 'Inactive' } },
  { id: 'pending', label: 'Pending', icon: Clock, color: 'yellow', type: 'cohort', filterHint: { status: 'Pending' } }
];

const ENTITY_TYPES = [
  { label: 'members', type: 'MEMBER', color: 'blue', icon: Users },
  { label: 'students', type: 'STUDENT', color: 'emerald', icon: Users },
  { label: 'professionals', type: 'PROFESSIONAL', color: 'purple', icon: Sparkles },
  { label: 'volunteers', type: 'VOLUNTEER', color: 'orange', icon: Users }
];

const FILTER_OPTIONS = {
  provinces: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan'],
  cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton', 'Ottawa'],
  tenureValues: ['1 year', '2 years', '3 years', '5 years', '10 years', '15 years'],
  tenureComparisons: ['or more', 'or less', 'exactly']
};

// Progressive suggestion logic with 3 levels
const getSuggestionsForPhrase = (chips) => {
  if (chips.length === 0) {
    return {
      current: STARTING_POINTS,
      next: ENTITY_TYPES.map(et => ({ ...et, label: et.label, preview: true })),
      future: [
        { label: 'for', icon: Clock, preview: true },
        { label: 'in', icon: MapPin, preview: true },
        { label: 'with', icon: Check, preview: true }
      ]
    };
  }

  const lastChip = chips[chips.length - 1];

  if (lastChip.type === 'cohort') {
    return {
      current: ENTITY_TYPES,
      next: [
        { label: 'that have been', icon: ChevronRight, preview: true },
        { label: 'for', icon: Clock, preview: true },
        { label: 'in', icon: MapPin, preview: true }
      ],
      future: FILTER_OPTIONS.tenureValues.slice(0, 4).map(t => ({ label: t, preview: true }))
    };
  }

  if (lastChip.type === 'entityType') {
    return {
      current: [
        { label: 'for', icon: Clock, type: 'connector' },
        { label: 'in', icon: MapPin, type: 'connector' },
        { label: 'with', icon: Check, type: 'connector' }
      ],
      next: FILTER_OPTIONS.tenureValues.slice(0, 6).map(t => ({ label: t, preview: true })),
      future: FILTER_OPTIONS.tenureComparisons.map(c => ({ label: c, preview: true }))
    };
  }

  if (lastChip.text === 'for') {
    return {
      current: FILTER_OPTIONS.tenureValues.map(t => ({ label: t, type: 'value', valueType: 'tenure' })),
      next: FILTER_OPTIONS.tenureComparisons.map(c => ({ label: c, preview: true })),
      future: [{ label: 'and', icon: Plus, preview: true }]
    };
  }

  if (lastChip.valueType === 'tenure' && !chips.find(c => c.valueType === 'tenureComparison')) {
    return {
      current: FILTER_OPTIONS.tenureComparisons.map(c => ({ label: c, type: 'value', valueType: 'tenureComparison' })),
      next: [{ label: 'and', icon: Plus, preview: true }],
      future: [{ label: 'in', preview: true }]
    };
  }

  if (lastChip.text === 'in') {
    return {
      current: [
        { label: 'province', icon: MapPin, type: 'connector' },
        { label: 'city', icon: MapPin, type: 'connector' }
      ],
      next: FILTER_OPTIONS.provinces.slice(0, 6).map(p => ({ label: p, preview: true })),
      future: [{ label: 'and', preview: true }]
    };
  }

  if (lastChip.text === 'province') {
    return {
      current: FILTER_OPTIONS.provinces.map(p => ({ label: p, type: 'value', valueType: 'province' })),
      next: [{ label: 'and', preview: true }],
      future: [{ label: 'in', preview: true }]
    };
  }

  if (lastChip.type === 'value' || lastChip.valueType === 'tenureComparison') {
    return {
      current: [{ label: 'and', icon: Plus, type: 'connector' }],
      next: [
        { label: 'in', preview: true },
        { label: 'with', preview: true },
        { label: 'for', preview: true }
      ],
      future: FILTER_OPTIONS.provinces.slice(0, 4).map(p => ({ label: p, preview: true }))
    };
  }

  if (lastChip.text === 'and') {
    return {
      current: [
        { label: 'in', icon: MapPin, type: 'connector' },
        { label: 'with', icon: Check, type: 'connector' }
      ],
      next: FILTER_OPTIONS.provinces.slice(0, 4).map(p => ({ label: p, preview: true })),
      future: [{ label: 'and', preview: true }]
    };
  }

  return { current: [], next: [], future: [] };
};

const Navigation = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPhraseMode, setIsPhraseMode] = useState(false);
  const [phraseChips, setPhraseChips] = useState([]);
  const [phraseSearchText, setPhraseSearchText] = useState('');
  const phraseInputRef = useRef(null);

  const components = [
    {
      id: 'board-packet',
      name: 'Board Meeting',
      description: 'Board meeting management with PDF viewing, annotations, markers, and document collaboration.',
      icon: Briefcase,
      color: 'bg-slate-600',
      features: ['PDF Viewing', 'Markers & Annotations', 'Document Upload', 'Meeting Management']
    },
    {
      id: 'compare-mode',
      name: 'Compare Mode Demo',
      description: 'Main comparison interface with interactive data tables, visual markers, and AI-powered chat panel.',
      icon: BarChart3,
      color: 'bg-blue-500',
      features: ['Visual Markers', 'AI Chat', 'Drag & Drop Tasks', 'Data Visualization']
    },
    {
      id: 'staff-details',
      name: 'Staff Details',
      description: 'Staff management interface with drag-and-drop notes, tasks, and customizable dashboard widgets.',
      icon: Users,
      color: 'bg-purple-500',
      features: ['Drag & Drop', 'Custom Widgets', 'Staff Cards', 'Templates']
    },
    {
      id: 'usb-search',
      name: 'USB Search',
      description: 'Unified search interface with advanced visualizations, filters, and animated search experience.',
      icon: Search,
      color: 'bg-green-500',
      features: ['Advanced Filters', 'Multiple Charts', 'Animations', 'Export Data']
    },
    {
      id: 'report-phrase',
      name: 'Report Phrase',
      description: 'Phrase-based search system with intelligent filtering and comprehensive result management.',
      icon: FileText,
      color: 'bg-orange-500',
      features: ['Phrase Search', 'Quick Actions', 'Analytics', 'Search History']
    },
    {
      id: 'performance-listing',
      name: 'Performance Listing',
      description: 'Performance analytics dashboard with member charts, revenue panels, and metrics tracking.',
      icon: TrendingUp,
      color: 'bg-red-500',
      features: ['Member Charts', 'Revenue Panels', 'Agents', 'Real-time Metrics']
    },
    {
      id: 'record-listing-basic',
      name: 'Record Listing Basic',
      description: 'Basic record listing with visual markers and essential data management features.',
      icon: Database,
      color: 'bg-cyan-500',
      features: ['Record Table', 'Visual Markers', 'Filtering', 'Charts']
    },
    {
      id: 'record-listing-resizable',
      name: 'Record Listing Resizable',
      description: 'Enhanced record listing with resizable panels and improved layout controls.',
      icon: Maximize2,
      color: 'bg-indigo-500',
      features: ['Resizable Panels', 'Heatmap', 'Agent Progress', 'All Basic Features']
    },
    {
      id: 'record-listing-advanced',
      name: 'Record Listing Advanced',
      description: 'Full-featured listing with heatmap visualization, AI chat, and automated task generation.',
      icon: Cpu,
      color: 'bg-pink-500',
      features: ['AI Chat', 'Heatmap', 'Task Generation', 'All Resizable Features']
    },
    {
      id: 'contact-list',
      name: 'Contact List',
      description: 'Advanced contact management with filtering, interactive charts, maps, and comprehensive analytics.',
      icon: ListFilter,
      color: 'bg-emerald-500',
      features: ['Advanced Filtering', 'Interactive Charts', 'Map Visualization', 'Export Data']
    }
  ];

  const filteredComponents = components.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Home className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Central USB Search</h1>
          </div>
          <p className="text-gray-600 ml-11">Select a component to explore its features</p>
        </div>
      </div>

      {/* Global Inline Phrase Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`transition-all duration-300 ${isPhraseMode ? 'w-full' : 'max-w-2xl mx-auto'}`}>
          {/* Search Bar with Chips */}
          <div
            className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-300 ${
              isPhraseMode ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2 flex-wrap p-4">
              <Search className="text-gray-400 w-5 h-5 flex-shrink-0" />

              {/* Phrase Chips */}
              {phraseChips.map((chip, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm font-medium"
                >
                  {chip.icon && <chip.icon className="w-3.5 h-3.5" />}
                  <span>{chip.text}</span>
                  <button
                    onClick={() => setPhraseChips(phraseChips.filter((_, i) => i !== idx))}
                    className="hover:bg-blue-200 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Search Input */}
              <input
                ref={phraseInputRef}
                type="text"
                placeholder={phraseChips.length === 0 ? "Search by name, id, email or build a phrase..." : "Continue phrase..."}
                value={isPhraseMode ? phraseSearchText : searchTerm}
                onChange={(e) => {
                  if (isPhraseMode) {
                    setPhraseSearchText(e.target.value);
                  } else {
                    setSearchTerm(e.target.value);
                  }
                }}
                onFocus={() => setIsPhraseMode(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsPhraseMode(false);
                    setPhraseSearchText('');
                  } else if (e.key === 'Backspace' && phraseSearchText === '' && phraseChips.length > 0) {
                    setPhraseChips(phraseChips.slice(0, -1));
                  }
                }}
                className="flex-1 outline-none text-sm py-2 bg-transparent min-w-[200px]"
              />

              {/* Close Button when in phrase mode */}
              {isPhraseMode && (
                <button
                  onClick={() => {
                    setIsPhraseMode(false);
                    setPhraseSearchText('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Inline 3-Level Progressive Disclosure Panel */}
            {isPhraseMode && (
              <div className="border-t border-gray-200 bg-white/60 backdrop-blur-md">
                <div className="p-4">
                  <h3 className="text-xs font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Build Your Phrase
                  </h3>

                  {/* 3-Column Suggestion Rail */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Level 1: Current (100% opacity) */}
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        {phraseChips.length === 0 ? 'Start with' : 'Select'}
                      </div>
                      <div className="space-y-1.5">
                        {getSuggestionsForPhrase(phraseChips).current.slice(0, 6).map((suggestion, idx) => {
                          const Icon = suggestion.icon;
                          return (
                            <button
                              key={idx}
                              onClick={() => {
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
                                setPhraseSearchText('');
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-gray-900 rounded-lg text-sm font-medium transition-all text-left"
                            >
                              {Icon && <Icon className="w-4 h-4" />}
                              <span>{suggestion.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Level 2: Next (50% opacity) */}
                    <div className="opacity-50 hover:opacity-75 transition-opacity">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Then
                      </div>
                      <div className="space-y-1.5">
                        {getSuggestionsForPhrase(phraseChips).next.slice(0, 6).map((suggestion, idx) => {
                          const Icon = suggestion.icon;
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                const newChip = {
                                  id: Date.now(),
                                  text: suggestion.label,
                                  type: suggestion.type || (suggestion.icon ? 'connector' : 'value'),
                                  valueType: suggestion.valueType,
                                  icon: suggestion.icon
                                };
                                setPhraseChips([...phraseChips, newChip]);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 bg-white/50 hover:bg-white/80 text-gray-700 hover:text-gray-900 rounded-lg text-sm font-medium transition-all text-left"
                            >
                              {Icon && <Icon className="w-4 h-4" />}
                              <span>{suggestion.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Level 3: Future (25% opacity) */}
                    <div className="opacity-25 hover:opacity-50 transition-opacity">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        After that
                      </div>
                      <div className="space-y-1.5">
                        {getSuggestionsForPhrase(phraseChips).future.slice(0, 6).map((suggestion, idx) => {
                          const Icon = suggestion.icon;
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                const newChip = {
                                  id: Date.now(),
                                  text: suggestion.label,
                                  type: suggestion.type || (suggestion.icon ? 'connector' : 'value'),
                                  valueType: suggestion.valueType,
                                  icon: suggestion.icon
                                };
                                setPhraseChips([...phraseChips, newChip]);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100/50 hover:bg-gray-100/80 text-gray-600 hover:text-gray-800 rounded-lg text-sm font-medium transition-all text-left"
                            >
                              {Icon && <Icon className="w-4 h-4" />}
                              <span>{suggestion.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {phraseChips.length > 0 && (
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setPhraseChips([]);
                          setPhraseSearchText('');
                        }}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={() => {
                          console.log('Apply phrase filters:', phraseChips);
                          onNavigate('contact-list');
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Apply Phrase Filter
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">Esc</kbd> to close
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Component Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component) => {
            const Icon = component.icon;
            return (
              <button
                key={component.id}
                onClick={() => onNavigate(component.id)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 text-left group"
              >
                {/* Icon Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`${component.color} rounded-lg p-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {component.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {component.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {component.features.slice(0, 3).map((feature, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors"
                    >
                      {feature}
                    </span>
                  ))}
                  {component.features.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      +{component.features.length - 3} more
                    </span>
                  )}
                </div>

                {/* Hover indicator */}
                <div className="mt-4 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Open Component</span>
                  <Sparkles className="w-4 h-4 ml-2" />
                </div>
              </button>
            );
          })}
        </div>

        {/* No Results */}
        {filteredComponents.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No components found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Central USB Search v1.0.0 - {components.length} Components Available
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
