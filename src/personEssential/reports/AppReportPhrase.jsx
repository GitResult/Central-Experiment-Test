import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Sparkles, Play, ChevronRight, X, Check,
  TrendingUp, Users, Calendar, DollarSign, MapPin,
  Crown, Award, Mail, Database, Info, Lightbulb,
  ArrowRight, Plus, Zap, Target, Filter, ArrowUpDown, Download,
  Edit2, Trash2, Settings, Save, Eye, Grid3x3, Hash, FileUp,
  GraduationCap, Briefcase, Clock, CalendarClock
} from 'lucide-react';
import { connect } from 'react-redux';
import { updateDemoState } from '../../redux/demo/actions';
import { getSuggestionsForPhrase as getPhraseSuggestions } from './personEssentialPhraseConfig';
import { getBrowseModeData } from './phraseBuilderData';

const AnimationStyles = () => (
  <style>{`
    @keyframes phraseSlideIn {
      0% { opacity: 0; transform: translateY(-5px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    @keyframes chipPop {
      0% { opacity: 0; transform: scale(0.8); }
      60% { opacity: 1; transform: scale(1.05); }
      100% { opacity: 1; transform: scale(1); }
    }

    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
      50% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0); }
    }

    @keyframes slideInFromRight {
      from { opacity: 0; transform: translateX(10px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .phrase-slide-in {
      animation: phraseSlideIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }

    .chip-pop {
      animation: chipPop 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }

    .pulse-glow {
      animation: pulseGlow 2s infinite;
    }

    .slide-in-right {
      animation: slideInFromRight 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }

    .fade-in {
      animation: fadeIn 0.4s ease-in forwards;
    }

    .slide-up {
      animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }

    .chip-hover {
      transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .chip-hover:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }
  `}</style>
);

// Comprehensive options for each filter type
const FILTER_OPTIONS = {
  locations: [
    'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa',
    'Edmonton', 'Winnipeg', 'Quebec City', 'Hamilton', 'Halifax',
    'London', 'Victoria', 'Saskatoon', 'Regina', 'Kitchener'
  ],
  timeframes: [
    { label: 'Last 7 days', value: 'last_7_days' },
    { label: 'Last 30 days', value: 'last_30_days' },
    { label: 'Last 90 days', value: 'last_90_days' },
    { label: 'This month', value: 'this_month' },
    { label: 'This quarter', value: 'this_quarter' },
    { label: 'This year', value: 'this_year' },
    { label: 'Last year', value: 'last_year' },
    { label: 'Custom date range', value: 'custom' }
  ],
  attributes: [
    { label: 'orders', icon: DollarSign, color: 'green' },
    { label: 'events', icon: Calendar, color: 'purple' },
    { label: 'donations', icon: Award, color: 'orange' },
    { label: 'emails', icon: Mail, color: 'blue' },
    { label: 'phone calls', icon: Users, color: 'indigo' }
  ],
  membershipTypes: [
    'Individual', 'Professional', 'Corporate', 'Student', 
    'Senior', 'Family', 'Lifetime', 'Honorary'
  ],
  statuses: [
    { label: 'Current', color: 'green' },
    { label: 'Active', color: 'blue' },
    { label: 'Lapsed', color: 'red' },
    { label: 'Pending', color: 'yellow' },
    { label: 'Suspended', color: 'orange' }
  ],
  sortOptions: [
    { label: 'by revenue (high to low)', value: 'revenue_desc' },
    { label: 'by revenue (low to high)', value: 'revenue_asc' },
    { label: 'by date (newest first)', value: 'date_desc' },
    { label: 'by date (oldest first)', value: 'date_asc' },
    { label: 'by name (A-Z)', value: 'name_asc' },
    { label: 'by name (Z-A)', value: 'name_desc' }
  ],
  limitOptions: [
    { label: 'Top 10', value: 10 },
    { label: 'Top 25', value: 25 },
    { label: 'Top 50', value: 50 },
    { label: 'Top 100', value: 100 },
    { label: 'Top 500', value: 500 },
    { label: 'All records', value: -1 }
  ],
  comparisonOperators: [
    { label: 'greater than', symbol: '>' },
    { label: 'less than', symbol: '<' },
    { label: 'equals', symbol: '=' },
    { label: 'between', symbol: '≈' }
  ],
  amountValues: [
    '$100', '$500', '$1,000', '$2,500', '$5,000', '$10,000', '$25,000', '$50,000'
  ],
  occupations: [
    'Practitioner', 'Educator', 'Researcher', 'Administrator',
    'Consultant', 'Manager', 'Director', 'Specialist', 'Coordinator'
  ],
  degrees: [
    'Masters', 'Bachelors', 'Doctorate', 'PhD', 'MBA', 'Certificate', 'Diploma', 'Associate'
  ],
  consecutiveMembershipYearsValues: [
    'past 1 year', 'past 2 years', 'past 3 years', 'past 5 years',
    'past 10 years', 'past 15 years', 'past 20 years', 'more than 5 years'
  ],
  provinces: [
    'ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL', 'YT', 'NT', 'NU',
    'Ontario', 'British Columbia', 'Alberta', 'Quebec', 'Manitoba', 'Saskatchewan'
  ],
  renewalMonths: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  renewalYears: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017']
};

const PHRASE_TEMPLATES = [
  {
    id: 'current-recent-orders',
    label: 'Current members with recent orders',
    chips: [
      { text: 'Current', type: 'cohort', icon: Users, color: 'blue' },
      { text: 'members', type: 'entity', icon: Crown, color: 'purple' },
      { text: 'that have', type: 'connector', color: 'gray' },
      { text: 'orders', type: 'attribute', icon: DollarSign, color: 'green' },
      { text: 'last 30 days', type: 'timeframe', icon: Calendar, color: 'orange' }
    ],
    description: 'Active members who made purchases recently',
    category: 'Commerce',
    popularity: 95
  },
  {
    id: 'top-customers-revenue',
    label: 'Top 10 customers by revenue this quarter',
    chips: [
      { text: 'Top', type: 'modifier', color: 'indigo' },
      { text: '10', type: 'number', color: 'indigo' },
      { text: 'customers', type: 'entity', icon: Users, color: 'blue' },
      { text: 'by revenue', type: 'sort', icon: TrendingUp, color: 'green' },
      { text: 'this quarter', type: 'timeframe', icon: Calendar, color: 'orange' }
    ],
    description: 'Highest spending customers in Q1',
    category: 'Commerce',
    popularity: 88
  },
  {
    id: 'new-members-location',
    label: 'New members in Toronto',
    chips: [
      { text: 'New', type: 'cohort', icon: Plus, color: 'emerald' },
      { text: 'members', type: 'entity', icon: Crown, color: 'purple' },
      { text: 'in', type: 'connector', color: 'gray' },
      { text: 'Toronto', type: 'location', icon: MapPin, color: 'red' }
    ],
    description: 'Recently joined members from Toronto area',
    category: 'Demographics',
    popularity: 76
  },
  {
    id: 'current-members-5-years',
    label: 'Current members that have been members for the past 5 years',
    chips: [
      { text: 'Current', type: 'cohort', icon: Users, color: 'blue' },
      { text: 'members', type: 'entity', icon: Crown, color: 'purple' },
      { text: 'that have been', type: 'connector', icon: Clock, color: 'gray' },
      { text: 'members', type: 'entityType', icon: Crown, color: 'purple' },
      { text: 'for', type: 'connector', icon: Clock, color: 'gray' },
      { text: 'past 5 years', type: 'consecutiveMembershipYears', icon: Clock, color: 'blue' }
    ],
    description: 'Members with 5 consecutive years of membership',
    category: 'Membership',
    popularity: 90
  },
  {
    id: 'current-ecy1-practitioner-masters-bc',
    label: 'Current members that are ECY1 and occupation is practitioner with a Degree: Masters from province/state BC',
    chips: [
      { text: 'Current', type: 'cohort', icon: Users, color: 'blue' },
      { text: 'members', type: 'entity', icon: Crown, color: 'purple' },
      { text: 'that are', type: 'connector', icon: Filter, color: 'gray' },
      { text: 'ECY1', type: 'membershipType', icon: Crown, color: 'purple' },
      { text: 'and', type: 'connector', icon: Plus, color: 'gray' },
      { text: 'occupation is', type: 'connector', icon: Briefcase, color: 'gray' },
      { text: 'Practitioner', type: 'occupation', icon: Briefcase, color: 'teal' },
      { text: 'with a Degree:', type: 'connector', icon: GraduationCap, color: 'gray' },
      { text: 'Masters', type: 'degree', icon: GraduationCap, color: 'indigo' },
      { text: 'from province/state', type: 'connector', icon: MapPin, color: 'gray' },
      { text: 'BC', type: 'province', icon: MapPin, color: 'red' }
    ],
    description: 'ECY1 practitioners with Masters degree from BC',
    category: 'Demographics',
    popularity: 85
  },
  {
    id: '2019-renewed-december',
    label: '2019 members who renewed in December 2019 or January 2020 for Member Year 2020',
    chips: [
      { text: '2019', type: 'yearCohort', icon: Calendar, color: 'indigo' },
      { text: 'members', type: 'entity', icon: Crown, color: 'purple' },
      { text: 'who renewed in', type: 'connector', icon: CalendarClock, color: 'gray' },
      { text: 'December', type: 'renewalMonth', icon: Calendar, color: 'orange' },
      { text: '2019', type: 'renewalYear', icon: Calendar, color: 'orange' }
    ],
    description: '2019 members who renewed in December 2019',
    category: 'Membership',
    popularity: 80
  }
];

const STARTING_POINTS = [
  { id: 'current', label: 'Current Members', icon: Users, color: 'blue', description: 'Active membership status' },
  { id: 'new', label: 'New Members', icon: Plus, color: 'emerald', description: 'Recently joined' },
  { id: 'previous', label: 'Previous Members', icon: Clock, color: 'orange', description: 'Former members' },
  { id: 'lapsed', label: 'Lapsed Members', icon: X, color: 'red', description: 'Expired membership' },
  { id: 'all', label: 'All Contacts', icon: Database, color: 'gray', description: 'Complete database' }
];

const CONTEXTUAL_SUGGESTIONS = {
  'Current Members': {
    next: [
      { text: 'that have', type: 'connector', color: 'gray' },
      { text: 'with status', type: 'connector', color: 'gray' },
      { text: 'in location', type: 'connector', color: 'gray' },
      { text: 'with type', type: 'connector', color: 'gray' }
    ]
  },
  'New Members': {
    next: [
      { text: 'joined in', type: 'timeframe', icon: Calendar, color: 'orange' },
      { text: 'in location', type: 'connector', color: 'gray' },
      { text: 'with type', type: 'connector', color: 'gray' }
    ]
  },
  'All Contacts': {
    next: [
      { text: 'that have', type: 'connector', color: 'gray' },
      { text: 'with status', type: 'connector', color: 'gray' },
      { text: 'in location', type: 'connector', color: 'gray' }
    ]
  },
  'Lapsed Members': {
    next: [
      { text: 'that have', type: 'connector', color: 'gray' },
      { text: 'in location', type: 'connector', color: 'gray' },
      { text: 'with type', type: 'connector', color: 'gray' }
    ]
  },
  'that have': {
    next: FILTER_OPTIONS.attributes.map(attr => ({ 
      text: attr.label, 
      type: 'attribute',
      icon: attr.icon,
      color: attr.color
    }))
  },
  'with status': {
    next: FILTER_OPTIONS.statuses.map(status => ({ 
      text: status.label, 
      type: 'status',
      color: status.color
    }))
  },
  'with type': {
    next: FILTER_OPTIONS.membershipTypes.map(type => ({ 
      text: type, 
      type: 'membershipType',
      color: 'purple',
      icon: Crown
    }))
  },
  'in location': {
    next: FILTER_OPTIONS.locations.slice(0, 8).map(loc => ({ 
      text: loc, 
      type: 'location',
      icon: MapPin,
      color: 'red'
    }))
  },
  'from': {
    next: FILTER_OPTIONS.locations.slice(0, 8).map(loc => ({ 
      text: loc, 
      type: 'location',
      icon: MapPin,
      color: 'red'
    }))
  },
  'orders': {
    next: [
      { text: 'in timeframe', type: 'connector', color: 'gray' },
      { text: 'greater than', type: 'connector', color: 'gray' },
      { text: 'equals', type: 'connector', color: 'gray' }
    ]
  },
  'events': {
    next: [
      { text: 'in timeframe', type: 'connector', color: 'gray' },
      { text: 'greater than', type: 'connector', color: 'gray' }
    ]
  },
  'donations': {
    next: [
      { text: 'in timeframe', type: 'connector', color: 'gray' },
      { text: 'greater than', type: 'connector', color: 'gray' }
    ]
  },
  'emails': {
    next: [
      { text: 'in timeframe', type: 'connector', color: 'gray' },
      { text: 'greater than', type: 'connector', color: 'gray' }
    ]
  },
  'phone calls': {
    next: [
      { text: 'in timeframe', type: 'connector', color: 'gray' },
      { text: 'greater than', type: 'connector', color: 'gray' }
    ]
  },
  'in timeframe': {
    next: FILTER_OPTIONS.timeframes.slice(0, 6).map(tf => ({ 
      text: tf.label, 
      type: 'timeframe',
      icon: Calendar,
      color: 'orange'
    }))
  },
  'greater than': {
    next: FILTER_OPTIONS.amountValues.slice(0, 6).map(amt => ({ 
      text: amt, 
      type: 'value',
      color: 'green'
    }))
  },
  'equals': {
    next: FILTER_OPTIONS.amountValues.slice(0, 6).map(amt => ({ 
      text: amt, 
      type: 'value',
      color: 'green'
    }))
  },
  'and': {
    next: [
      { text: 'that have', type: 'connector', color: 'gray' },
      { text: 'in location', type: 'connector', color: 'gray' },
      { text: 'with status', type: 'connector', color: 'gray' }
    ]
  },
  'sorted by': {
    next: FILTER_OPTIONS.sortOptions.slice(0, 4).map(s => ({
      text: s.label,
      type: 'sort',
      color: 'purple'
    }))
  }
};

// Main Component
const PhraseModeReport = (props) => {
  const { updateDemoStateAction, isPhraseActive } = props;
  
  const [stage, setStage] = useState('intro');
  const [phraseChips, setPhraseChips] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [previewCount, setPreviewCount] = useState(null);
  const [animatingExample, setAnimatingExample] = useState(0);
  const [visibleChipsCount, setVisibleChipsCount] = useState(0);
  const [editingChipId, setEditingChipId] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [optionsModalData, setOptionsModalData] = useState(null);
  const inputRef = useRef(null);

  // 3-Column Selection State (from Contact List Search)
  const [activeColumn, setActiveColumn] = useState(0);
  const [columnSelections, setColumnSelections] = useState([null, null, null]);
  const [columnIndices, setColumnIndices] = useState([0, 0, 0]);
  const [lockedSuggestions, setLockedSuggestions] = useState(null);
  const [selectionRoundStart, setSelectionRoundStart] = useState(0);
  const [previewChips, setPreviewChips] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [showAllExamples, setShowAllExamples] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    if (stage === 'intro') {
      const interval = setInterval(() => {
        setAnimatingExample(prev => (prev + 1) % PHRASE_TEMPLATES.length);
        setVisibleChipsCount(0);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'intro') {
      const currentExample = PHRASE_TEMPLATES[animatingExample];
      const totalChips = currentExample.chips.length;
      
      setVisibleChipsCount(0);
      
      const timers = [];
      for (let i = 0; i < totalChips; i++) {
        const timer = setTimeout(() => {
          setVisibleChipsCount(i + 1);
        }, (i + 1) * 500);
        timers.push(timer);
      }
      
      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [animatingExample, stage]);

  useEffect(() => {
    if (phraseChips.length === 0) return;
    
    const lastChip = phraseChips[phraseChips.length - 1];
    const contextKey = lastChip.text;
    
    // Check contextual suggestions first
    if (CONTEXTUAL_SUGGESTIONS[contextKey]) {
      setSuggestions(CONTEXTUAL_SUGGESTIONS[contextKey].next);
    } 
    // Check by chip type if no text match
    else if (lastChip.type === 'status') {
      // After a status, suggest logical next steps (not timeframes/amounts)
      setSuggestions([
        { text: 'that have', type: 'connector' },
        { text: 'in location', type: 'connector' }
      ]);
    }
    else if (lastChip.type === 'membershipType') {
      // After a membership type, suggest logical next steps
      setSuggestions([
        { text: 'that have', type: 'connector' },
        { text: 'in location', type: 'connector' }
      ]);
    }
    else if (lastChip.type === 'location') {
      // After location, suggest what to filter by
      setSuggestions([
        { text: 'that have', type: 'connector' },
        { text: 'with status', type: 'connector' }
      ]);
    }
    else if (lastChip.type === 'entity') {
      setSuggestions([
        { text: 'that have', type: 'connector' },
        { text: 'with status', type: 'connector' },
        { text: 'in location', type: 'connector' },
        { text: 'with type', type: 'connector' }
      ]);
    } 
    else if (lastChip.type === 'attribute') {
      setSuggestions([
        { text: 'in timeframe', type: 'timeframe' },
        { text: 'greater than', type: 'comparison' }
      ]);
    }
    else if (lastChip.type === 'timeframe' || lastChip.type === 'value') {
      // After timeframe or value, suggest adding more filters or sorting
      setSuggestions([
        { text: 'and', type: 'connector' },
        { text: 'sorted by', type: 'sort' }
      ]);
    }
    else {
      // Default suggestions
      setSuggestions([]);
    }
  }, [phraseChips]);

  useEffect(() => {
    if (phraseChips.length > 0) {
      const baseCount = 7100;
      const filters = phraseChips.filter(c => ['attribute', 'timeframe', 'location'].includes(c.type)).length;
      const estimated = Math.floor(baseCount * Math.pow(0.4, filters));
      setPreviewCount(Math.max(50, estimated));
    }
  }, [phraseChips]);

  const toast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // Handle 3-column selection (from Contact List Search)
  const handleColumnSelection = (columnIdx, suggestion, allSuggestions) => {
    const newSelections = [...columnSelections];

    // Auto-select first items from previous columns if not already selected
    for (let i = 0; i < columnIdx; i++) {
      if (!newSelections[i] && allSuggestions[i].length > 0) {
        newSelections[i] = allSuggestions[i][0];
      }
    }

    // Select the clicked item
    newSelections[columnIdx] = suggestion;
    setColumnSelections(newSelections);

    // Check if we're in a hierarchical selection (Member Stats)
    const isHierarchicalSelection = newSelections[0]?.id === 'member_stats' || newSelections[0]?.label === 'Member Stats';

    // Check if we're in Query 2/3 category selection (Member Type, Occupation, Degree, Province/State, Member Year)
    const query2Categories = ['member_type', 'occupation', 'degree', 'province_state', 'member_year'];
    const isQuery2CategorySelection = newSelections[0]?.id && query2Categories.includes(newSelections[0].id);

    // Check if we're in renewal target year merging (for + category + value)
    const isRenewalTargetYearMerging = columnIdx === 2 &&
                                        lockedSuggestions.context === 'renewal_target_year' &&
                                        newSelections[0]?.id === 'for' &&
                                        newSelections[1]?.type === 'category' &&
                                        newSelections[2]?.type === 'value';

    // Add chips cumulatively based on which column was clicked
    const chipsToAdd = [];

    if (isHierarchicalSelection) {
      // For hierarchical selections, merge into a single chip progressively
      let chipText = newSelections[0].label; // Start with "Member Stats"

      if (columnIdx >= 1 && newSelections[1]) {
        chipText += ': ' + newSelections[1].label; // Add ": Consecutive Membership Years"
      }

      if (columnIdx >= 2 && newSelections[2]) {
        chipText += '= ' + newSelections[2].label; // Add "= 5"
      }

      // Add the merged hierarchical chip (previousChips will be prepended later)
      // Determine the appropriate type and ID based on what's been selected
      let chipType = 'category';
      let chipId = 'member_stats';

      if (columnIdx >= 2 && newSelections[2]) {
        // Final value selected - this completes the selection
        chipType = 'value';
        chipId = 'member_stats_complete';
      } else if (columnIdx >= 1 && newSelections[1]) {
        // Subcategory selected - show values next
        chipType = 'subcategory';
        chipId = newSelections[1].id || 'consecutive_membership_years';
      }

      chipsToAdd.push({
        id: chipId,
        text: chipText,
        label: chipText,
        type: chipType,
        icon: newSelections[0].icon,
        color: newSelections[0].color || 'blue',
        isHierarchical: true,
        subcategory: newSelections[1]?.label,
        value: newSelections[2]?.label
      });
    } else if (isQuery2CategorySelection && columnIdx === 1 && newSelections[1]) {
      // For Query 2 categories: merge category + value into single chip
      // Only when selecting from Column 2 (columnIdx === 1), not Column 3
      // Format: "Member Type = ECY1 - Member Early Career Year 1"
      const chipText = newSelections[0].label + ' = ' + newSelections[1].label;

      chipsToAdd.push({
        id: newSelections[0].id + '_merged',
        text: chipText,
        label: chipText,
        type: 'value',
        icon: newSelections[0].icon,
        color: newSelections[0].color || 'blue',
        valueType: newSelections[1].valueType,
        categoryId: newSelections[0].id,
        categoryLabel: newSelections[0].label,
        valueLabel: newSelections[1].label,
        isMergedCategory: true
      });
    } else if (isRenewalTargetYearMerging) {
      // RENEWAL CONTEXT: Merge "for" + category from Column 2 + value from Column 3
      // Pattern: [for] + [Member Year] + [2020] → [for] + [Member Year = 2020]

      // Add "for" connector first
      chipsToAdd.push({
        id: newSelections[0].id,
        text: newSelections[0].label,
        label: newSelections[0].label,
        type: newSelections[0].type,
        icon: newSelections[0].icon,
        color: newSelections[0].color || 'gray'
      });

      // Then add merged category + value chip
      const chipText = newSelections[1].label + ' = ' + newSelections[2].label;
      chipsToAdd.push({
        id: newSelections[1].id + '_merged',
        text: chipText,
        label: chipText,
        type: 'value',
        icon: newSelections[1].icon,
        color: newSelections[1].color || 'blue',
        valueType: newSelections[2].valueType,
        categoryId: newSelections[1].id,
        categoryLabel: newSelections[1].label,
        valueLabel: newSelections[2].label,
        isMergedCategory: true
      });
    } else {
      // Non-hierarchical: add chips for each selection

      // Special case: If clicking Column 3 (columnIdx === 2) with a connector, and Column 1 is a query2 category
      // that's already in a merged chip, only add the Column 3 connector, not Column 1 and 2
      const isColumn3ConnectorAfterMergedCategory =
        columnIdx === 2 &&
        newSelections[0]?.type === 'category' &&
        query2Categories.includes(newSelections[0]?.id) &&
        (newSelections[2]?.type === 'connector' || newSelections[2]?.type === 'logical_connector');

      if (isColumn3ConnectorAfterMergedCategory) {
        // Only add the connector from Column 3, skip Column 1 and 2 (already in merged chip)
        const sel = newSelections[2];
        chipsToAdd.push({
          id: sel.id || (Date.now() + Math.random()),
          text: sel.label,
          label: sel.label,
          type: sel.type || 'connector',
          icon: sel.icon,
          color: sel.color || 'gray',
          valueType: sel.valueType,
          enablesMultiSelect: sel.enablesMultiSelect,
          order: sel.order
        });
      } else {
        // Normal case: add chips for each selection
        for (let i = 0; i <= columnIdx; i++) {
          if (newSelections[i]) {
            const sel = newSelections[i];
            chipsToAdd.push({
              id: sel.id || (Date.now() + i + Math.random()),
              text: sel.label,
              label: sel.label,
              type: sel.type || 'connector',
              icon: sel.icon,
              color: sel.color || 'gray',
              valueType: sel.valueType,
              enablesMultiSelect: sel.enablesMultiSelect,
              order: sel.order
            });
          }
        }
      }
    }

    // Replace chips from current selection round instead of appending
    const previousChips = isHierarchicalSelection ?
      phraseChips.slice(0, selectionRoundStart) :
      phraseChips.slice(0, selectionRoundStart);
    let newChipState = [...previousChips, ...chipsToAdd];

    // SPECIAL CASE: Query 3 month-year merging
    // After selecting second+ month-year in renewal context, merge all month-years into single chip
    // Pattern: [monthYear][or][in][monthYear] → [monthYear or monthYear]
    const lastAddedChip = chipsToAdd[chipsToAdd.length - 1];
    if (lastAddedChip && lastAddedChip.valueType === 'monthYear') {
      // Check if there's a previous month-year with "or" pattern
      const monthYearChips = [];
      let foundPattern = false;

      // Scan backwards to collect all month-years connected by "or"/"in"
      for (let i = newChipState.length - 1; i >= 0; i--) {
        const chip = newChipState[i];

        if (chip.valueType === 'monthYear') {
          monthYearChips.unshift(chip); // Add to beginning to maintain order
        } else if (chip.id === 'or' || chip.id === 'in') {
          // Found connector, continue looking
          foundPattern = true;
        } else if (chip.type === 'action' && chip.id === 'renewed') {
          // Reached the Renewed action, stop scanning
          break;
        } else if (foundPattern) {
          // Found a chip that's not part of the pattern, stop
          break;
        }
      }

      // If we found multiple month-years, merge them
      if (monthYearChips.length >= 2) {
        // Create merged chip text: "December 2019 or January 2020"
        const mergedText = monthYearChips.map(mc => mc.text || mc.label).join(' or ');

        // Create merged month-year chip
        const mergedChip = {
          id: 'merged_month_year_' + Date.now(),
          text: mergedText,
          label: mergedText,
          type: 'value',
          valueType: 'monthYear',
          isMergedMonthYear: true,
          monthYears: monthYearChips.map(mc => mc.text || mc.label)
        };

        // Remove all month-year chips and their connectors from the state
        // Keep everything before the first month-year, then add the merged chip
        const firstMonthYearIndex = newChipState.findIndex(c =>
          monthYearChips.some(mc => mc.id === c.id || mc.text === c.text)
        );

        if (firstMonthYearIndex !== -1) {
          // Keep chips before first month-year, add merged chip, keep chips after last month-year
          const beforePattern = newChipState.slice(0, firstMonthYearIndex);
          const afterLastMonthYear = newChipState.slice(newChipState.length); // Nothing after, we just added it

          // Filter out month-year chips, "or" and "in" connectors from the pattern
          const chipsToRemove = new Set([
            ...monthYearChips.map(mc => mc.id),
            'or', 'in'
          ]);

          // Rebuild chip state: before pattern + merged chip
          newChipState = [
            ...beforePattern,
            mergedChip
          ];
        }
      }
    }

    setPhraseChips(newChipState);
    setInputValue('');

    // Update locked suggestions based on the NEW chip state (after adding selections)
    // This ensures columns 2 and 3 populate correctly as selections are made
    const updatedSuggestions = getPhraseSuggestions(newChipState);
    setLockedSuggestions(updatedSuggestions);

    // If this was the 3rd column (column 2), reset everything for next round
    if (columnIdx === 2) {
      setColumnSelections([null, null, null]);
      setColumnIndices([0, 0, 0]);
      setPreviewChips([]);

      // Set start position for next selection round
      if (isHierarchicalSelection || isQuery2CategorySelection) {
        // For hierarchical and Query 2 merged categories, we added only 1 merged chip
        setSelectionRoundStart(previousChips.length + 1);
      } else if (isRenewalTargetYearMerging) {
        // For renewal target year, we added 2 chips: [for] + [Member Year = 2020]
        setSelectionRoundStart(previousChips.length + 2);
      } else {
        setSelectionRoundStart(selectionRoundStart + chipsToAdd.length);
      }

      // Use awaitingSelection from suggestions to set correct activeColumn
      // This allows flows to continue (e.g., Column 3 active) instead of always resetting to Column 1
      if (updatedSuggestions.awaitingSelection) {
        const columnMap = { 'column1': 0, 'column2': 1, 'column3': 2 };
        setActiveColumn(columnMap[updatedSuggestions.awaitingSelection] || 0);
      } else {
        setActiveColumn(0);
      }
      // Locked suggestions already updated above with the new chip state
    } else if (columnIdx === 1 && isQuery2CategorySelection) {
      // Special case: When creating a merged chip from Column 2, update selectionRoundStart
      // so that the merged chip is preserved when clicking Column 3
      setSelectionRoundStart(previousChips.length + 1);
      setActiveColumn(columnIdx + 1);
    } else {
      // Otherwise, move to next column
      setActiveColumn(columnIdx + 1);
    }
  };

  const addChip = (chip) => {
    const newChip = { ...chip, id: chip.id || Date.now() };  // Preserve original ID if it exists

    // Check if this chip text requires options selection
    if (chip.text === 'in location') {
      showOptionsSelector('location', { ...newChip, type: 'location', icon: MapPin, color: 'red' });
    } else if (chip.text === 'with status') {
      showOptionsSelector('status', { ...newChip, type: 'status', color: 'blue' });
    } else if (chip.text === 'with type') {
      showOptionsSelector('membershipType', { ...newChip, type: 'membershipType', color: 'purple', icon: Crown });
    } else if (chip.text === 'in timeframe') {
      showOptionsSelector('timeframe', { ...newChip, type: 'timeframe', icon: Calendar, color: 'orange' });
    } else if (chip.text === 'greater than' || chip.text === 'equals') {
      showOptionsSelector('amount', { ...newChip, type: 'comparison', color: 'green' });
    } else if (chip.text === 'occupation is') {
      showOptionsSelector('occupation', { ...newChip, type: 'occupation', icon: Briefcase, color: 'teal' });
    } else if (chip.text === 'with a Degree:') {
      showOptionsSelector('degree', { ...newChip, type: 'degree', icon: GraduationCap, color: 'indigo' });
    } else if (chip.text === 'from province/state') {
      showOptionsSelector('province', { ...newChip, type: 'province', icon: MapPin, color: 'red' });
    } else if (chip.text === 'for' && phraseChips.some(c => c.text === 'that have been')) {
      showOptionsSelector('consecutiveMembershipYears', { ...newChip, type: 'consecutiveMembershipYears', icon: Clock, color: 'blue' });
    } else if (chip.text === 'who renewed in') {
      showOptionsSelector('renewalMonth', { ...newChip, type: 'renewalMonth', icon: Calendar, color: 'orange' });
    } else if (chip.type === 'location') {
      showOptionsSelector('location', newChip);
    } else if (chip.type === 'timeframe') {
      showOptionsSelector('timeframe', newChip);
    } else if (chip.type === 'comparison') {
      showOptionsSelector('amount', newChip);
    } else {
      setPhraseChips([...phraseChips, newChip]);
      setInputValue('');
      setSuggestions([]);
      toast(`Added: ${chip.text}`);
    }
  };

  const showOptionsSelector = (optionType, chip) => {
    let options = [];
    let title = '';
    
    switch(optionType) {
      case 'location':
        options = FILTER_OPTIONS.locations;
        title = 'Select Location';
        break;
      case 'timeframe':
        options = FILTER_OPTIONS.timeframes.map(t => t.label);
        title = 'Select Timeframe';
        break;
      case 'amount':
        options = FILTER_OPTIONS.amountValues;
        title = 'Select Amount';
        break;
      case 'sort':
        options = FILTER_OPTIONS.sortOptions.map(s => s.label);
        title = 'Select Sort Option';
        break;
      case 'limit':
        options = FILTER_OPTIONS.limitOptions.map(l => l.label);
        title = 'Select Limit';
        break;
      case 'status':
        options = FILTER_OPTIONS.statuses.map(s => s.label);
        title = 'Select Status';
        break;
      case 'membershipType':
        options = FILTER_OPTIONS.membershipTypes;
        title = 'Select Membership Type';
        break;
      case 'attribute':
        options = FILTER_OPTIONS.attributes.map(a => a.label);
        title = 'Select Attribute';
        break;
      case 'connector':
        options = ['that have', 'with status', 'in location', 'with type', 'from'];
        title = 'Change Connector';
        break;
      case 'occupation':
        options = FILTER_OPTIONS.occupations;
        title = 'Select Occupation';
        break;
      case 'degree':
        options = FILTER_OPTIONS.degrees;
        title = 'Select Degree';
        break;
      case 'province':
        options = FILTER_OPTIONS.provinces;
        title = 'Select Province/State';
        break;
      case 'consecutiveMembershipYears':
        options = FILTER_OPTIONS.consecutiveMembershipYearsValues;
        title = 'Select Consecutive Membership Years';
        break;
      case 'renewalMonth':
        options = FILTER_OPTIONS.renewalMonths;
        title = 'Select Renewal Month';
        break;
      case 'renewalYear':
        options = FILTER_OPTIONS.renewalYears;
        title = 'Select Renewal Year';
        break;
      default:
        options = [];
    }
    
    setOptionsModalData({ type: optionType, options, title, chip });
    setShowOptionsModal(true);
  };

  const selectOption = (option) => {
    if (!optionsModalData) return;
    
    const chip = optionsModalData.chip;
    let finalChip = { ...chip };
    
    // Handle limit options - special logic for Top chips
    if (optionsModalData.type === 'limit') {
      if (option === 'All records') {
        // Remove any existing "Top" chips
        const filteredChips = phraseChips.filter(c => c.type !== 'limit' && c.type !== 'modifier' && c.type !== 'number');
        setPhraseChips(filteredChips);
        toast('Removed limit - showing all records');
        setShowOptionsModal(false);
        setOptionsModalData(null);
        setEditingChipId(null);
        return;
      } else {
        // Extract number from option (e.g., "Top 10" -> "10")
        const match = option.match(/Top (\d+)/);
        if (match) {
          const number = match[1];
          
          // Remove any existing Top/limit chips
          const filteredChips = phraseChips.filter(c => 
            c.type !== 'limit' && c.type !== 'modifier' && c.type !== 'number'
          );
          
          // Create Top and number chips
          const topChip = {
            text: 'Top',
            type: 'modifier',
            color: 'indigo',
            id: Date.now()
          };
          
          const numberChip = {
            text: number,
            type: 'number',
            color: 'indigo',
            id: Date.now() + 1
          };
          
          // Add Top chips at the beginning
          setPhraseChips([topChip, numberChip, ...filteredChips]);
          toast(`Limited to top ${number} records`);
          setShowOptionsModal(false);
          setOptionsModalData(null);
          setEditingChipId(null);
          return;
        }
      }
    }
    
    // Handle connector changes
    if (optionsModalData.type === 'connector') {
      finalChip = {
        ...chip,
        text: option,
        type: 'connector',
        color: 'gray',
        icon: undefined
      };
    }
    // Handle merged category chips - maintain merged structure
    else if (chip.isMergedCategory && ['memberType', 'occupation', 'degree', 'province', 'memberYear'].includes(optionsModalData.type)) {
      // Update merged chip with new value while preserving structure
      const newText = chip.categoryLabel + ' = ' + option;
      finalChip = {
        ...chip,
        text: newText,
        label: newText,
        valueLabel: option
        // Keep: isMergedCategory, categoryId, categoryLabel, type, icon, color
      };
    }
    // Handle status changes
    else if (optionsModalData.type === 'status') {
      const statusOption = FILTER_OPTIONS.statuses.find(s => s.label === option);
      finalChip = {
        ...chip,
        text: option,
        type: 'status',
        color: statusOption ? statusOption.color : 'blue',
        icon: undefined
      };
    }
    // Handle membership type changes
    else if (optionsModalData.type === 'membershipType') {
      finalChip = {
        ...chip,
        text: option,
        type: 'membershipType',
        color: 'purple',
        icon: Crown
      };
    }
    // Handle attribute changes
    else if (optionsModalData.type === 'attribute') {
      const attrOption = FILTER_OPTIONS.attributes.find(a => a.label === option);
      finalChip = {
        ...chip,
        text: option,
        type: 'attribute',
        color: attrOption ? attrOption.color : 'green',
        icon: attrOption ? attrOption.icon : undefined
      };
    }
    // Handle occupation changes
    else if (optionsModalData.type === 'occupation') {
      finalChip = {
        ...chip,
        text: option,
        type: 'occupation',
        color: 'teal',
        icon: Briefcase
      };
    }
    // Handle degree changes
    else if (optionsModalData.type === 'degree') {
      finalChip = {
        ...chip,
        text: option,
        type: 'degree',
        color: 'indigo',
        icon: GraduationCap
      };
    }
    // Handle province changes
    else if (optionsModalData.type === 'province') {
      finalChip = {
        ...chip,
        text: option,
        type: 'province',
        color: 'red',
        icon: MapPin
      };
    }
    // Handle consecutive membership years changes
    else if (optionsModalData.type === 'consecutiveMembershipYears') {
      finalChip = {
        ...chip,
        text: option,
        type: 'consecutiveMembershipYears',
        color: 'blue',
        icon: Clock
      };
    }
    // Handle renewal month changes
    else if (optionsModalData.type === 'renewalMonth') {
      finalChip = {
        ...chip,
        text: option,
        type: 'renewalMonth',
        color: 'orange',
        icon: Calendar
      };
    }
    // Handle renewal year changes
    else if (optionsModalData.type === 'renewalYear') {
      finalChip = {
        ...chip,
        text: option,
        type: 'renewalYear',
        color: 'orange',
        icon: Calendar
      };
    }
    // Handle all other types
    else {
      finalChip = {
        ...chip,
        text: option
      };
    }
    
    finalChip.id = editingChipId || Date.now();
    
    if (editingChipId) {
      // Replace existing chip
      setPhraseChips(phraseChips.map(c => 
        c.id === editingChipId ? finalChip : c
      ));
      setEditingChipId(null);
      toast(`Updated to: ${option}`);
    } else {
      // Add new chip
      setPhraseChips([...phraseChips, finalChip]);
      toast(`Added: ${option}`);
    }
    
    setShowOptionsModal(false);
    setOptionsModalData(null);
    setInputValue('');
    setSuggestions([]);
  };

  const editChip = (chipId) => {
    const chip = phraseChips.find(c => c.id === chipId);
    if (!chip) return;

    setEditingChipId(chipId);

    // Determine option type based on chip type and text
    let optionType = 'custom';
    let options = [];
    let title = '';

    // Handle merged category chips (from suggestion panel)
    if (chip.isMergedCategory) {
      const categoryId = chip.categoryId;

      if (categoryId === 'member_type') {
        const memberTypes = getBrowseModeData('memberTypes');
        options = memberTypes.map(mt => mt.label);
        title = 'Change Member Type';
        optionType = 'memberType';
      } else if (categoryId === 'occupation') {
        const occupations = getBrowseModeData('occupations');
        options = occupations.map(o => o.label);
        title = 'Change Occupation';
        optionType = 'occupation';
      } else if (categoryId === 'degree') {
        const degrees = getBrowseModeData('degrees');
        options = degrees.map(d => d.label);
        title = 'Change Degree';
        optionType = 'degree';
      } else if (categoryId === 'province_state') {
        const provinces = getBrowseModeData('provinces');
        options = provinces.map(p => p.label);
        title = 'Change Province/State';
        optionType = 'province';
      } else if (categoryId === 'member_year') {
        const memberYears = getBrowseModeData('memberYears');
        options = memberYears.map(my => my.label);
        title = 'Change Member Year';
        optionType = 'memberYear';
      }

      if (options.length > 0) {
        setOptionsModalData({ type: optionType, options, title, chip });
        setShowOptionsModal(true);
        return;
      }
    }

    // Connector chips - can be changed to other connectors
    if (chip.type === 'connector') {
      options = ['that have', 'with status', 'in location', 'with type', 'from'];
      title = 'Change Connector';
      optionType = 'connector';
      setOptionsModalData({ type: optionType, options, title, chip });
      setShowOptionsModal(true);
      return;
    }
    // Location chips
    else if (chip.type === 'location' || FILTER_OPTIONS.locations.includes(chip.text)) {
      optionType = 'location';
      showOptionsSelector('location', chip);
      return;
    }
    // Timeframe chips
    else if (chip.type === 'timeframe' || FILTER_OPTIONS.timeframes.some(t => t.label === chip.text)) {
      optionType = 'timeframe';
      showOptionsSelector('timeframe', chip);
      return;
    }
    // Amount/value chips
    else if (chip.type === 'value' || FILTER_OPTIONS.amountValues.includes(chip.text)) {
      optionType = 'amount';
      showOptionsSelector('amount', chip);
      return;
    }
    // Status chips - NOW EDITABLE
    else if (chip.type === 'status' || FILTER_OPTIONS.statuses.some(s => s.label === chip.text)) {
      options = FILTER_OPTIONS.statuses.map(s => s.label);
      title = 'Change Status';
      optionType = 'status';
      setOptionsModalData({ type: optionType, options, title, chip });
      setShowOptionsModal(true);
      return;
    }
    // Membership type chips
    else if (chip.type === 'membershipType' || FILTER_OPTIONS.membershipTypes.includes(chip.text)) {
      options = FILTER_OPTIONS.membershipTypes;
      title = 'Change Membership Type';
      optionType = 'membershipType';
      setOptionsModalData({ type: optionType, options, title, chip });
      setShowOptionsModal(true);
      return;
    }
    // Attribute chips
    else if (chip.type === 'attribute' && ['orders', 'events', 'donations', 'emails', 'phone calls'].includes(chip.text)) {
      options = FILTER_OPTIONS.attributes.map(a => a.label);
      title = 'Change Attribute';
      optionType = 'attribute';
      setOptionsModalData({ type: optionType, options, title, chip });
      setShowOptionsModal(true);
      return;
    }
    // Sort chips
    else if (chip.type === 'sort' || FILTER_OPTIONS.sortOptions.some(s => s.label === chip.text)) {
      optionType = 'sort';
      showOptionsSelector('sort', chip);
      return;
    }
    // Limit chips
    else if (chip.type === 'limit' || FILTER_OPTIONS.limitOptions.some(l => l.label === chip.text)) {
      optionType = 'limit';
      showOptionsSelector('limit', chip);
      return;
    }
    // Occupation chips
    else if (chip.type === 'occupation' || FILTER_OPTIONS.occupations.includes(chip.text)) {
      optionType = 'occupation';
      showOptionsSelector('occupation', chip);
      return;
    }
    // Degree chips
    else if (chip.type === 'degree' || FILTER_OPTIONS.degrees.includes(chip.text)) {
      optionType = 'degree';
      showOptionsSelector('degree', chip);
      return;
    }
    // Province chips
    else if (chip.type === 'province' || FILTER_OPTIONS.provinces.includes(chip.text)) {
      optionType = 'province';
      showOptionsSelector('province', chip);
      return;
    }
    // Consecutive Membership Years chips
    else if (chip.type === 'consecutiveMembershipYears' || FILTER_OPTIONS.consecutiveMembershipYearsValues.includes(chip.text)) {
      optionType = 'consecutiveMembershipYears';
      showOptionsSelector('consecutiveMembershipYears', chip);
      return;
    }
    // Renewal month chips
    else if (chip.type === 'renewalMonth' || FILTER_OPTIONS.renewalMonths.includes(chip.text)) {
      optionType = 'renewalMonth';
      showOptionsSelector('renewalMonth', chip);
      return;
    }
    // Renewal year chips
    else if (chip.type === 'renewalYear' || FILTER_OPTIONS.renewalYears.includes(chip.text)) {
      optionType = 'renewalYear';
      showOptionsSelector('renewalYear', chip);
      return;
    }
  };

  const removeChip = (chipId) => {
    // Find the index of the chip being deleted
    const chipIndex = phraseChips.findIndex(c => c.id === chipId);

    if (chipIndex === -1) return; // Chip not found

    // Cascading deletion: Keep only chips before the deleted chip
    const remainingChips = phraseChips.slice(0, chipIndex);
    setPhraseChips(remainingChips);

    // Restore suggestion panel to state matching remaining chips
    const updatedSuggestions = getPhraseSuggestions(remainingChips);
    setLockedSuggestions(updatedSuggestions);

    // Reset selection state for clean continuation
    setColumnSelections([null, null, null]);
    setColumnIndices([0, 0, 0]);
    setActiveColumn(0);
    setPreviewChips([]);

    // Update selection round start to end of remaining chips
    setSelectionRoundStart(remainingChips.length);

    const deletedCount = phraseChips.length - chipIndex;
    toast(`Removed ${deletedCount} chip(s)`);
  };

  const loadTemplate = (template) => {
    setSelectedTemplate(template);
    setPhraseChips(template.chips.map((chip, idx) => ({ ...chip, id: chip.id || (Date.now() + idx) })));  // Preserve original IDs
    setStage('building');
    toast(`Template loaded: ${template.label}`);
  };

  const startFromScratch = (startingPoint) => {
    let chips = [];

    // Special handling for cohort starting points (Current/Previous/New/Lapsed Members)
    // These need to be split into two chips: cohort + entity type
    if (startingPoint.label === 'Current Members') {
      chips = [
        {
          text: 'Current',
          label: 'Current',
          type: 'timeframe',  // Changed from 'cohort' to match data structure
          icon: startingPoint.icon,
          color: startingPoint.color,
          id: 'current'  // Use string ID instead of timestamp
        },
        {
          text: 'Members',
          label: 'Members',
          type: 'subject',  // Changed from 'entity' to match data structure
          icon: Crown,
          color: 'purple',
          id: 'members'  // Use string ID instead of timestamp
        }
      ];

      // Initialize column selection state to show these in columns 1-2
      const initialSuggestions = getPhraseSuggestions(chips);
      setLockedSuggestions(initialSuggestions);
      setColumnSelections([
        { label: 'Current', type: 'timeframe', icon: startingPoint.icon, color: startingPoint.color, id: 'current' },
        { label: 'Members', type: 'subject', icon: Crown, color: 'purple', id: 'members' },
        null
      ]);
      setSelectionRoundStart(0);
      setActiveColumn(2);
    } else if (startingPoint.label === 'Previous Members') {
      chips = [
        {
          text: 'Previous',
          label: 'Previous',
          type: 'timeframe',  // Changed from 'cohort' to match data structure
          icon: startingPoint.icon,
          color: startingPoint.color,
          id: 'previous'  // Use string ID instead of timestamp
        },
        {
          text: 'Members',
          label: 'Members',
          type: 'subject',  // Changed from 'entity' to match data structure
          icon: Crown,
          color: 'purple',
          id: 'members'  // Use string ID instead of timestamp
        }
      ];

      // Initialize column selection state to show these in columns 1-2
      const initialSuggestions = getPhraseSuggestions(chips);
      setLockedSuggestions(initialSuggestions);
      setColumnSelections([
        { label: 'Previous', type: 'timeframe', icon: startingPoint.icon, color: startingPoint.color, id: 'previous' },
        { label: 'Members', type: 'subject', icon: Crown, color: 'purple', id: 'members' },
        null
      ]);
      setSelectionRoundStart(0);
      setActiveColumn(2);
    } else if (startingPoint.label === 'New Members') {
      chips = [
        {
          text: 'New',
          label: 'New',
          type: 'timeframe',  // Changed from 'cohort' to match data structure
          icon: startingPoint.icon,
          color: startingPoint.color,
          id: 'new'  // Use string ID instead of timestamp
        },
        {
          text: 'Members',
          label: 'Members',
          type: 'subject',  // Changed from 'entity' to match data structure
          icon: Crown,
          color: 'purple',
          id: 'members'  // Use string ID instead of timestamp
        }
      ];

      // Initialize column selection state to show these in columns 1-2
      const initialSuggestions = getPhraseSuggestions(chips);
      setLockedSuggestions(initialSuggestions);
      setColumnSelections([
        { label: 'New', type: 'timeframe', icon: startingPoint.icon, color: startingPoint.color, id: 'new' },
        { label: 'Members', type: 'subject', icon: Crown, color: 'purple', id: 'members' },
        null
      ]);
      setSelectionRoundStart(0);
      setActiveColumn(2);
    } else if (startingPoint.label === 'Lapsed Members') {
      chips = [
        {
          text: 'Lapsed',
          label: 'Lapsed',
          type: 'timeframe',  // Changed from 'cohort' to match data structure
          icon: startingPoint.icon,
          color: startingPoint.color,
          id: 'lapsed'  // Use string ID instead of timestamp
        },
        {
          text: 'Members',
          label: 'Members',
          type: 'subject',  // Changed from 'entity' to match data structure
          icon: Crown,
          color: 'purple',
          id: 'members'  // Use string ID instead of timestamp
        }
      ];

      // Initialize column selection state to show these in columns 1-2
      const initialSuggestions = getPhraseSuggestions(chips);
      setLockedSuggestions(initialSuggestions);
      setColumnSelections([
        { label: 'Lapsed', type: 'timeframe', icon: startingPoint.icon, color: startingPoint.color, id: 'lapsed' },
        { label: 'Members', type: 'subject', icon: Crown, color: 'purple', id: 'members' },
        null
      ]);
      setSelectionRoundStart(0);
      setActiveColumn(2);
    } else {
      // Default behavior for other starting points (All Contacts, year cohorts, etc.)
      chips = [{
        text: startingPoint.label,
        type: 'entity',
        icon: startingPoint.icon,
        color: startingPoint.color,
        id: Date.now()
      }];

      // Reset column selection state for single-chip starting points
      setLockedSuggestions(null);
      setColumnSelections([null, null, null]);
      setSelectionRoundStart(chips.length);
      setActiveColumn(0);
    }

    setPhraseChips(chips);
    setStage('building');
    setInputValue('');
    toast(`Starting with: ${startingPoint.label}`);

    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const runReport = () => {
    setStage('results');
    toast('Report generated successfully!');
  };

  const [showPreview, setShowPreview] = useState(true);

  const resetReport = () => {
    setPhraseChips([]);
    setStage('intro');
    setSelectedTemplate(null);
    setInputValue('');
    setShowAllExamples(false);
  };

  const generateNaturalQuery = () => {
    if (phraseChips.length === 0) return '';

    const statusCategories = ['Current', 'Previous', 'New', 'Lapsed'];
    let query = '';
    let i = 0;
    let isQuery3 = false;
    let isInRenewalContext = false;

    // Check if this is Query 3: Previous + Members + for + Member Year
    if (phraseChips.length >= 4 &&
        phraseChips[0].text === 'Previous' &&
        phraseChips[1].text === 'Members' &&
        phraseChips[2].text === 'for' &&
        phraseChips[3].isMergedCategory &&
        phraseChips[3].categoryId === 'member_year') {
      isQuery3 = true;
      // Extract year from "Member Year = 2019"
      const yearValue = phraseChips[3].valueLabel;
      query = yearValue + ' members';
      i = 4; // Skip first 4 chips
    }
    // Check for timeframe + Members pattern (Query 1 & 2)
    else if (i < phraseChips.length && statusCategories.includes(phraseChips[i].text)) {
      const timeframe = phraseChips[i].text;
      i++;

      if (i < phraseChips.length && phraseChips[i].text === 'Members') {
        // Format as "Current members" (lowercase 'members')
        query = timeframe + ' members';
        i++;
      } else {
        query = timeframe;
      }
    }

    // Process remaining chips
    while (i < phraseChips.length) {
      const chip = phraseChips[i];

      // Handle connector chips
      if (chip.type === 'connector') {
        const connectorText = chip.text?.toLowerCase();

        // Handle "that have"
        if (connectorText === 'that have') {
          i++;

          // Check if next chip is an action (Query 3: Renewed)
          if (i < phraseChips.length && phraseChips[i].type === 'action') {
            const action = phraseChips[i].text.toLowerCase();
            query += ' who ' + action;
            isInRenewalContext = true;
            i++;
            continue;
          }
          // Check if next chip is hierarchical Member Stats (Query 1)
          else if (i < phraseChips.length && phraseChips[i].isHierarchical) {
            const memberStatsChip = phraseChips[i];

            // Extract the number from "Member Stats: Consecutive Membership Years= 5"
            const match = memberStatsChip.text.match(/Consecutive Membership Years=\s*(\d+)/);
            if (match) {
              const years = match[1];
              query += ' that have been members for the past ' + years + ' years';
            } else {
              query += ' ' + memberStatsChip.text;
            }
            i++;
            continue;
          }
        }
        // Handle "that are" (Query 2)
        else if (connectorText === 'that are') {
          // Include "that are" in the output
          query += ' that are';
        }
        // Handle "in" connector (Query 3 renewal months)
        else if (connectorText === 'in' && isInRenewalContext) {
          query += ' in';
        }
        // Handle "for" connector in renewal target year context
        else if (connectorText === 'for' && i < phraseChips.length - 1) {
          // Look ahead to see if it's "for Member Year"
          const nextChip = phraseChips[i + 1];
          if (nextChip && nextChip.isMergedCategory && nextChip.categoryId === 'member_year') {
            query += ' for Member Year ' + nextChip.valueLabel;
            i += 2; // Skip "for" and the member year chip
            continue;
          }
        }
        i++;
        continue;
      }

      // Handle action connector chips (Query 3: "in", "from", "for")
      if (chip.type === 'action_connector') {
        if (chip.text === 'in') {
          query += ' in';
        }
        i++;
        continue;
      }

      // Handle logical connectors (And/Or)
      if (chip.type === 'logical_connector') {
        // Check what comes after this connector
        const nextChip = i + 1 < phraseChips.length ? phraseChips[i + 1] : null;

        // Skip "and" before degree and province_state in Query 2 (they have their own formatting)
        if (nextChip && nextChip.isMergedCategory &&
            (nextChip.categoryId === 'degree' || nextChip.categoryId === 'province_state')) {
          i++;
          continue;
        }

        // Use lowercase "and"/"or"
        query += ' ' + chip.text.toLowerCase();
        i++;
        continue;
      }

      // Skip if already processed (hierarchical chips handled with "that have")
      if (chip.isHierarchical) {
        i++;
        continue;
      }

      // Handle Query 2/3 merged category chips
      if (chip.isMergedCategory) {
        const categoryId = chip.categoryId;
        const valueLabel = chip.valueLabel;

        if (categoryId === 'member_type') {
          // Extract short form from "ECY1 - Member Early Career Year 1" -> "ECY1"
          const shortForm = valueLabel.split(' - ')[0].trim();
          query += ' ' + shortForm;
        } else if (categoryId === 'occupation') {
          // Format: "and occupation is practitioner"
          const value = valueLabel.toLowerCase();
          query += ' and occupation is ' + value;
        } else if (categoryId === 'degree') {
          // Format: "with a Degree: Masters"
          query += ' with a Degree: ' + valueLabel;
        } else if (categoryId === 'province_state') {
          // Format: "from province/state BC"
          query += ' from province/state ' + valueLabel;
        } else if (categoryId === 'member_year') {
          // Skip member year in merged chips (already handled in "for" logic)
          i++;
          continue;
        } else {
          // Default: just add the value
          query += ' ' + valueLabel;
        }
        i++;
        continue;
      }

      // Handle month-year values (Query 3)
      if (chip.valueType === 'monthYear') {
        query += ' ' + chip.text;
        i++;
        continue;
      }

      // Add other chips as-is
      if (chip.text !== 'Members' || i > 1) {
        query += ' ' + chip.text;
      }
      i++;
    }

    return query.trim();
  };

  const renderAnimatedExamples = () => {
    const currentExample = PHRASE_TEMPLATES[animatingExample];

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 text-center fade-in">
          {currentExample.description}
        </p>
        <div className="flex flex-wrap gap-1 justify-center items-center min-h-[60px]">
          {currentExample.chips.map((chip, idx) => {
            const isVisible = idx < visibleChipsCount;

            return isVisible ? (
              <div
                key={`chip-${animatingExample}-${idx}`}
                className="chip-pop"
              >
                <PhraseChip chip={chip} size="sm" readOnly />
              </div>
            ) : null;
          })}
        </div>
      </div>
    );
  };

  // Intro Stage
  if (stage === 'intro') {
    return (
      <div className="max-h-screen min-h-screen h-full overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col w-full">
        
        <div className="w-full h-full">
          <AnimationStyles />
        </div>
        
        <div className="border-b border-gray-200 bg-white px-8 py-6">
          <div className="flex items-center gap-3">

            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-blue-600" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Phrase Mode</h1>
              <p className="text-sm text-gray-600">Build reports using natural language phrases</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 mt-0">
          <div className="max-w-4xl w-full mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-light text-gray-900 mb-3">
                Describe the data you need
              </h2>
              <p className="text-base text-gray-600">
                Use phrases to build your query naturally—no need to know database structure
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">Phrase Preview</span>
                </div>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  {showPreview ? 'Hide' : 'Show'}
                  <ChevronRight className={`w-3 h-3 transition-transform ${showPreview ? 'rotate-90' : ''}`} />
                </button>
              </div>
              
              {showPreview && (
                <div className="px-4 pb-4 min-h-[100px] flex flex-col items-center justify-center">
                  {renderAnimatedExamples()}
                </div>
              )}
            </div>
          </div>

          <div className="max-w-6xl w-full mb-8">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Start with an Example</h3>
              <p className="text-sm text-gray-600">Pre-built phrases you can modify</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(showAllExamples ? PHRASE_TEMPLATES : PHRASE_TEMPLATES.slice(0, 3)).map((template) => (
                <button
                  key={template.id}
                  onClick={() => loadTemplate(template)}
                  className="bg-white rounded-xl shadow-sm p-4 text-left transition-all hover:shadow-md hover:-translate-y-1 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Target className="w-4 h-4 text-blue-600" strokeWidth={2} />
                    </div>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {template.category}
                    </span>
                  </div>

                  <h4 className="font-medium text-gray-900 mb-2 text-sm">{template.label}</h4>

                  <div className="flex flex-wrap gap-1">
                    {template.chips.slice(0, 4).map((chip, idx) => (
                      <PhraseChip key={idx} chip={chip} size="sm" readOnly />
                    ))}
                    {template.chips.length > 4 && (
                      <div className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                        +{template.chips.length - 4}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Show More / Hide Link */}
            {PHRASE_TEMPLATES.length > 3 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowAllExamples(!showAllExamples)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {showAllExamples ? (
                    <>
                      <span>Hide</span>
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </>
                  ) : (
                    <>
                      <span>Show More</span>
                      <ChevronRight className="w-4 h-4 -rotate-90" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="max-w-6xl w-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Start from Scratch</h3>
              <p className="text-sm text-gray-600">Begin by selecting your starting point</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {STARTING_POINTS.map((point) => {
                const IconComponent = point.icon;
                return (
                  <button
                    key={point.id}
                    onClick={() => startFromScratch(point)}
                    className="bg-white rounded-xl shadow-sm p-4 text-center transition-all hover:shadow-md hover:-translate-y-1 group"
                  >
                    <div className={`w-10 h-10 mx-auto mb-2 bg-${point.color}-50 rounded-lg flex items-center justify-center group-hover:bg-${point.color}-100 transition-colors`}>
                      <IconComponent className={`w-5 h-5 text-${point.color}-600`} strokeWidth={2} />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1 text-sm">{point.label}</h4>
                    <p className="text-xs text-gray-600">{point.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {showToast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 slide-in-right">
            <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  

  // Building Stage
  if (stage === 'building') {
    return (
      <div className="max-h-screen min-h-screen h-full overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col w-full">
        
        {/* bottom bar - matching Browse/List mode format */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-30" style={{ height: '88px' }}>
          <div className="h-full flex items-center justify-between px-1 sm:px-4 gap-1 sm:gap-2">
            {/* Left section - Info */}
            <div className="flex items-center gap-1 sm:gap-3 flex-1 min-w-0 overflow-hidden" style={{ flex: '1 1 auto' }}>
              <div className="hidden sm:flex w-12 h-12 bg-blue-100 rounded-lg items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
              </div>

              {/* Text content - stacked on mobile, inline on desktop */}
              <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                {/* Title and meta - inline */}
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">New Report</span>
                  <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">JD • {previewCount !== null ? previewCount.toLocaleString() : '7100'} records</span>
                </div>

                {/* Natural query - separate line, blue italic, truncated */}
                {phraseChips.length > 0 && (
                  <div className="text-[9px] sm:text-xs text-blue-700 font-medium italic truncate leading-tight mt-0.5">
                    "{generateNaturalQuery()}"
                  </div>
                )}
              </div>

              {phraseChips.length > 0 && (
                <button
                  onClick={() => {
                    setPhraseChips([]);
                    setInputValue('');
                  }}
                  className="p-1 sm:p-1.5 hover:bg-red-50 active:bg-red-50 rounded-lg transition-colors group flex-shrink-0"
                  title="Clear all"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-red-500" strokeWidth={1.5} />
                </button>
              )}

              {/* Play button on mobile - inline with content */}
              <button
                onClick={runReport}
                disabled={phraseChips.length === 0}
                className={`sm:hidden p-2 rounded-full transition-all flex-shrink-0 ${phraseChips.length > 0 ? 'bg-blue-500 text-white active:bg-blue-600' : 'bg-gray-200 text-gray-400'}`}
                title="Run"
              >
                <Play className="w-4 h-4" strokeWidth={1.5} fill="currentColor" />
              </button>
            </div>

            {/* Right section - Actions (desktop only) */}
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0" style={{ flex: '0 0 auto' }}>
              <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Load Query">
                <FileUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
              </button>
              <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Export">
                <Download className="w-5 h-5 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
              </button>
              <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Schedule">
                <Calendar className="w-5 h-5 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
              </button>
              <button
                onClick={runReport}
                disabled={phraseChips.length === 0}
                className={`p-4 rounded-full transition-all mx-2 ${phraseChips.length > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                title="Run Report"
              >
                <Play className="w-6 h-6" strokeWidth={1.5} fill="currentColor" />
              </button>
              <button
                disabled={phraseChips.length === 0}
                className={`p-2.5 rounded-lg transition-colors group ${phraseChips.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                title="Save Query"
              >
                <Save className="w-5 h-5 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
              </button>
              <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="More Settings">
                <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
              </button>
            </div>

            {/* Far right section - Field/Filter/Sort/Grouping/Limits */}
            <div className="flex items-center gap-2" style={{ flex: '0 0 auto' }}>
              <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Fields">
                <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
              </button>
              <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Filters">
                <Filter className="w-4 h-4 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
              </button>
              <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Sort">
                <ArrowUpDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
              </button>
              <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Grouping">
                <Grid3x3 className="w-4 h-4 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
              </button>
              <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Row Limits">
                <Hash className="w-4 h-4 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
        
        <AnimationStyles />

        <div className="flex-1 pb-32 relative">
          {/* Combined Input + Build Your Phrase Panel - full width on focus or when has chips */}
          <div className="w-full bg-white py-6">
            <div className={`mx-auto px-8 transition-all duration-300 ${isInputFocused || phraseChips.length > 0 ? 'max-w-full' : 'max-w-3xl'}`}>
              {/* Input field with phrase chips inside - now as global search bar */}
              <div className="bg-white rounded-xl border-2 border-blue-200 p-3 mb-2 shadow-sm">
                <div className="flex items-center gap-2">
                  {/* Centered, smaller Search icon */}
                  <div className="flex items-center justify-center flex-shrink-0">
                    <Search className="w-3.5 h-3.5 text-gray-400" />
                  </div>

                  {/* Phrase chips and input in same container */}
                  <div className="flex-1 flex flex-wrap items-center gap-1 min-h-[36px]">
                    {phraseChips.map((chip) => (
                      <div key={chip.id} className="chip-pop">
                        <PhraseChip
                          chip={chip}
                          size="sm"
                          onRemove={() => removeChip(chip.id)}
                          onEdit={() => editChip(chip.id)}
                          showRemove={true}
                          showEdit={true}
                        />
                      </div>
                    ))}

                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        setSelectedSuggestionIndex(0); // Reset selection when typing
                      }}
                      onKeyDown={(e) => {
                        const phraseSuggestions = lockedSuggestions || getPhraseSuggestions(phraseChips);
                        const allSuggestions = [
                          phraseSuggestions.current || [],
                          phraseSuggestions.next || [],
                          phraseSuggestions.future || []
                        ];
                        const currentColumnSuggestions = allSuggestions[activeColumn] || [];

                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          const newIndex = Math.min(columnIndices[activeColumn] + 1, currentColumnSuggestions.length - 1);
                          const newIndices = [...columnIndices];
                          newIndices[activeColumn] = newIndex;
                          setColumnIndices(newIndices);
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          const newIndex = Math.max(columnIndices[activeColumn] - 1, 0);
                          const newIndices = [...columnIndices];
                          newIndices[activeColumn] = newIndex;
                          setColumnIndices(newIndices);
                        } else if (e.key === 'ArrowRight') {
                          e.preventDefault();
                          if (activeColumn < 2) {
                            setActiveColumn(activeColumn + 1);
                          }
                        } else if (e.key === 'ArrowLeft') {
                          e.preventDefault();
                          if (activeColumn > 0) {
                            setActiveColumn(activeColumn - 1);
                          }
                        } else if (e.key === 'Tab') {
                          e.preventDefault();
                          setActiveColumn((activeColumn + 1) % 3);
                        } else if (e.key === 'Enter') {
                          e.preventDefault();
                          const selectedSuggestion = currentColumnSuggestions[columnIndices[activeColumn]];
                          if (selectedSuggestion) {
                            handleColumnSelection(activeColumn, selectedSuggestion, allSuggestions);
                          }
                        } else if (e.key === 'Escape') {
                          setInputValue('');
                          setColumnSelections([null, null, null]);
                          setColumnIndices([0, 0, 0]);
                          setActiveColumn(0);
                          setLockedSuggestions(null);
                          setSelectionRoundStart(0);
                          setPreviewChips([]);
                        } else if (e.key === 'Backspace' && inputValue === '' && phraseChips.length > 0) {
                          removeChip(phraseChips[phraseChips.length - 1].id);
                        }
                      }}
                      placeholder={phraseChips.length === 0 ? "Start building your phrase..." : "Continue typing or select..."}
                      className="flex-1 min-w-[120px] px-2 py-1.5 bg-transparent border-none text-sm focus:outline-none placeholder:text-gray-400 placeholder:italic"
                    />
                  </div>

                  {inputValue && (
                    <button
                      onClick={() => addChip({ text: inputValue, type: 'custom', color: 'gray' })}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm flex-shrink-0"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  )}
                </div>
              </div>

              {/* Clear link - right aligned below input */}
              {phraseChips.length > 0 && (
                <div className="flex justify-end mb-3">
                  <button
                    onClick={() => {
                      setPhraseChips([]);
                      setInputValue('');
                      setLockedSuggestions(null);
                      setColumnSelections([null, null, null]);
                      setColumnIndices([0, 0, 0]);
                      setActiveColumn(0);
                      setSelectionRoundStart(0);
                      setPreviewChips([]);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium underline transition-colors"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Build Your Phrase Section */}
              <div className="max-w-4xl">
              {/* 3-Column Progressive Selection UI */}
              <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-semibold text-gray-700">Build Your Phrase</span>
                </div>
                <div className="text-[10px] text-gray-400">
                  ↑↓ • ←→ • Enter • Tab
                </div>
              </div>

              {/* 3-Column Grid */}
              <div className="grid grid-cols-3 gap-2">
                {(() => {
                  // Use locked suggestions if available, otherwise get fresh
                  const phraseSuggestions = lockedSuggestions || getPhraseSuggestions(phraseChips);
                  const allSuggestions = [
                    inputValue
                      ? (phraseSuggestions.current || []).filter(s =>
                          s.label?.toLowerCase().startsWith(inputValue.toLowerCase())
                        )
                      : (phraseSuggestions.current || []).slice(0, 6),
                    (phraseSuggestions.next || []).slice(0, 6),
                    (phraseSuggestions.future || []).slice(0, 6)
                  ];
                  const columnTitles = [
                    phraseChips.length === 0 ? 'Start with' : 'Select',
                    'Then',
                    'After that'
                  ];

                  return allSuggestions.map((columnSuggestions, columnIdx) => {
                    const isActive = activeColumn === columnIdx;
                    const isSelected = columnSelections[columnIdx] !== null;
                    const isDisabled = isSelected;

                    return (
                      <div
                        key={columnIdx}
                        className={`transition-all ${
                          isDisabled
                            ? 'opacity-30 pointer-events-none'
                            : isActive
                            ? 'opacity-100'
                            : 'opacity-40'
                        }`}
                      >
                        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          <span>{columnTitles[columnIdx]}</span>
                        </div>
                        <div className="space-y-1.5">
                          {columnSuggestions.map((suggestion, idx) => {
                            const Icon = suggestion.icon;
                            const isHighlighted = isActive && idx === columnIndices[columnIdx];
                            const isChosen = isSelected && columnSelections[columnIdx]?.label === suggestion.label;

                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  // Set this column as active and select this item
                                  setActiveColumn(columnIdx);
                                  const newIndices = [...columnIndices];
                                  newIndices[columnIdx] = idx;
                                  setColumnIndices(newIndices);
                                  handleColumnSelection(columnIdx, suggestion, allSuggestions);
                                }}
                                className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-all text-left ${
                                  isHighlighted
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'bg-gray-50 hover:bg-blue-50 text-gray-900 hover:text-blue-700'
                                }`}
                              >
                                {Icon && <Icon className="w-3 h-3 flex-shrink-0" />}
                                <span className="truncate">{suggestion.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

              {/* Quick Actions - Filter, Sort, Limit - Bigger, better-looking buttons */}
              <div className="flex items-center justify-center gap-3 mt-4 pb-6">
                <button
                  onClick={() => {
                    addChip({ text: 'that have', type: 'connector', color: 'gray' });
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition-all text-sm font-semibold text-gray-700 hover:text-blue-700 hover:scale-105"
                >
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <Filter className="w-4 h-4 text-blue-600" strokeWidth={2} />
                  </div>
                  <span>Add Filter</span>
                </button>
                <button
                  onClick={() => {
                    showOptionsSelector('sort', { text: 'sorted by', type: 'sort', color: 'purple' });
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-md transition-all text-sm font-semibold text-gray-700 hover:text-purple-700 hover:scale-105"
                >
                  <div className="p-1.5 bg-purple-50 rounded-lg">
                    <ArrowUpDown className="w-4 h-4 text-purple-600" strokeWidth={2} />
                  </div>
                  <span>Sort</span>
                </button>
                <button
                  onClick={() => {
                    showOptionsSelector('limit', { text: 'limited to', type: 'limit', color: 'indigo' });
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all text-sm font-semibold text-gray-700 hover:text-indigo-700 hover:scale-105"
                >
                  <div className="p-1.5 bg-indigo-50 rounded-lg">
                    <Target className="w-4 h-4 text-indigo-600" strokeWidth={2} />
                  </div>
                  <span>Limit</span>
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Options Modal */}
        {showOptionsModal && optionsModalData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden slide-up">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{optionsModalData.title}</h3>
                  <button
                    onClick={() => {
                      setShowOptionsModal(false);
                      setOptionsModalData(null);
                      setEditingChipId(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {optionsModalData.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectOption(option)}
                      className="px-4 py-3 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-700 transition-all text-center"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {showToast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 slide-in-right">
            <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Results Stage
  if (stage === 'results') {
    return (
      <div className="max-h-screen min-h-screen h-full overflow-y-auto bg-gray-50 flex flex-col">

        {/* bottom bar */}
        {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-30" style={{ height: '88px' }}>
          <div className="h-full flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Phrase Mode Report</div>
                <div className="text-xs text-gray-500">
                  {stage !== 'building' ? "": previewCount !== null ? `~${previewCount.toLocaleString()} records` : 'Building query...'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={runReport}
                disabled={phraseChips.length === 0} 
                className={`p-4 rounded-full transition-all mx-2 ${phraseChips.length > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`} 
                title="Run Report"
              >
                <Play className="w-6 h-6" strokeWidth={1.5} fill="currentColor" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500">
                {phraseChips.length} {phraseChips.length === 1 ? 'chip' : 'chips'}
              </div>
            </div>
          </div>
        </div> */}

        <AnimationStyles />
        
        <div className="border-b border-gray-200 bg-white px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setStage('building')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Report Results</h1>
                <div className="flex flex-wrap gap-2 mt-1">
                  {phraseChips.map((chip) => (
                    <PhraseChip key={chip.id} chip={chip} size="xs" readOnly />
                  ))}
                </div>
                <div className="text-xs text-gray-600 mt-2 italic">
                  Query: {generateNaturalQuery()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setStage('building')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Refine</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatsCard
                label="Total Records"
                value={previewCount?.toLocaleString() || '0'}
                icon={Database}
                color="blue"
              />
              <StatsCard
                label="Filters Applied"
                value={phraseChips.filter(c => ['attribute', 'timeframe', 'location'].includes(c.type)).length}
                icon={Filter}
                color="purple"
              />
              <StatsCard
                label="Generated"
                value="Just now"
                icon={Calendar}
                color="green"
              />
              <StatsCard
                label="Est. Value"
                value="$125K"
                icon={DollarSign}
                color="emerald"
              />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Matching Records</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Showing results based on your phrase criteria
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.from({ length: Math.min(10, previewCount || 10) }).map((_, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">M{10001 + idx}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {['John Smith', 'Sarah Johnson', 'Michael Chen', 'Emma Davis', 'James Wilson', 
                            'Lisa Anderson', 'David Martinez', 'Mary Taylor', 'Robert Thomas', 'Jennifer Lee'][idx]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {['john.smith@example.com', 'sarah.j@example.com', 'mchen@example.com', 'emma.d@example.com',
                            'james.w@example.com', 'lisa.a@example.com', 'david.m@example.com', 'mary.t@example.com',
                            'robert.t@example.com', 'jennifer.l@example.com'][idx]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            idx % 3 === 0 ? 'bg-green-100 text-green-800' : 
                            idx % 3 === 1 ? 'bg-blue-100 text-blue-800' : 
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {idx % 3 === 0 ? 'Current' : idx % 3 === 1 ? 'Active' : 'Member'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(2024, 0, 1 + idx * 10).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {['Toronto, ON', 'Vancouver, BC', 'Montreal, QC', 'Calgary, AB', 'Ottawa, ON',
                            'Edmonton, AB', 'Toronto, ON', 'Vancouver, BC', 'Montreal, QC', 'Calgary, AB'][idx]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing 1 to {Math.min(10, previewCount || 10)} of {previewCount?.toLocaleString() || '0'} results
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showToast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 slide-in-right">
            <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

// PhraseChip Component
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

// QuickAction Component
const QuickAction = ({ icon: Icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all text-left group"
  >
    <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4 group-hover:bg-blue-100 transition-colors">
      <Icon className="w-6 h-6 text-blue-600" strokeWidth={2} />
    </div>
    <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </button>
);

// StatsCard Component
const StatsCard = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    emerald: 'bg-emerald-50 text-emerald-600'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};


const mapActionToProps = {
  updateDemoStateAction: updateDemoState
};

const mapStateToProps = ({ demo }) => {
  const { isPhraseActive } = demo;
  return { isPhraseActive };
};

export default connect(mapStateToProps, mapActionToProps)(PhraseModeReport);