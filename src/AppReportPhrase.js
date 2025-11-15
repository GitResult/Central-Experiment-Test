import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Sparkles, Play, ChevronRight, X, Check, 
  TrendingUp, Users, Calendar, DollarSign, MapPin,
  Crown, Award, Mail, Database, Info, Lightbulb,
  ArrowRight, Plus, Zap, Target, Filter, ArrowUpDown, Download,
  Edit2, Trash2, Settings
} from 'lucide-react';

const AnimationStyles = () => (
  <style>{`
    @keyframes phraseSlideIn {
      0% { opacity: 0; transform: translateY(-10px) scale(0.95); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    @keyframes chipPop {
      0% { opacity: 0; transform: scale(0.8); }
      60% { opacity: 1; transform: scale(1.05); }
      100% { opacity: 1; transform: scale(1); }
    }
    
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
      50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
    }
    
    @keyframes slideInFromRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .phrase-slide-in {
      animation: phraseSlideIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    
    .chip-pop {
      animation: chipPop 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    
    .pulse-glow {
      animation: pulseGlow 2s infinite;
    }
    
    .slide-in-right {
      animation: slideInFromRight 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    
    .fade-in {
      animation: fadeIn 0.4s ease-in;
    }
    
    .slide-up {
      animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
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
  ]
};

const PHRASE_TEMPLATES = [
  {
    id: 'current-recent-orders',
    label: 'Current members with recent orders',
    chips: [
      { text: 'Current', type: 'entity', icon: Users, color: 'blue' },
      { text: 'Members', type: 'entity', icon: Crown, color: 'purple' },
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
      { text: 'New', type: 'status', icon: Plus, color: 'emerald' },
      { text: 'Members', type: 'entity', icon: Users, color: 'blue' },
      { text: 'in', type: 'connector', color: 'gray' },
      { text: 'Toronto', type: 'location', icon: MapPin, color: 'red' }
    ],
    description: 'Recently joined members from Toronto area',
    category: 'Demographics',
    popularity: 76
  }
];

const STARTING_POINTS = [
  { id: 'current', label: 'Current Members', icon: Users, color: 'blue', description: 'Active membership status' },
  { id: 'new', label: 'New Members', icon: Plus, color: 'emerald', description: 'Recently joined' },
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
const PhraseModeReport = () => {
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

  const addChip = (chip) => {
    const newChip = { ...chip, id: Date.now() };
    
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
  };

  const removeChip = (chipId) => {
    setPhraseChips(phraseChips.filter(c => c.id !== chipId));
    toast('Chip removed');
  };

  const loadTemplate = (template) => {
    setSelectedTemplate(template);
    setPhraseChips(template.chips.map((chip, idx) => ({ ...chip, id: Date.now() + idx })));
    setStage('building');
    toast(`Template loaded: ${template.label}`);
  };

  const startFromScratch = (startingPoint) => {
    const chip = {
      text: startingPoint.label,
      type: 'entity',
      icon: startingPoint.icon,
      color: startingPoint.color,
      id: Date.now()
    };
    setPhraseChips([chip]);
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
  };

  const renderAnimatedExamples = () => {
    const currentExample = PHRASE_TEMPLATES[animatingExample];
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 text-center fade-in">
          {currentExample.description}
        </p>
        <div className="flex flex-wrap gap-2 justify-center items-center min-h-[60px]">
          {currentExample.chips.map((chip, idx) => {
            const isVisible = idx < visibleChipsCount;
            
            return isVisible ? (
              <div
                key={`chip-${animatingExample}-${idx}`}
                className="chip-pop"
              >
                <PhraseChip chip={chip} readOnly />
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
        <AnimationStyles />
        
        <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm px-8 py-6">
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

        <div className="flex-1 flex flex-col items-center justify-center p-6 -mt-12">
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
              {PHRASE_TEMPLATES.map((template) => (
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
          </div>

          <div className="max-w-6xl w-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Start from Scratch</h3>
              <p className="text-sm text-gray-600">Begin by selecting your starting point</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
        <AnimationStyles />
        
        <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={resetReport}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Build Your Phrase</h1>
                <p className="text-sm text-gray-600">
                  {selectedTemplate ? `From template: ${selectedTemplate.label}` : 'Custom query'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 pb-32">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-8 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">Your Phrase</span>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-6 min-h-[60px]">
                {phraseChips.map((chip) => (
                  <div key={chip.id} className="chip-pop">
                    <PhraseChip 
                      chip={chip} 
                      onRemove={() => removeChip(chip.id)}
                      onEdit={() => editChip(chip.id)}
                      showRemove={true}
                      showEdit={true}
                    />
                  </div>
                ))}
                
                {phraseChips.length === 0 && (
                  <div className="text-gray-400 italic">Start building your phrase...</div>
                )}
              </div>

              <div className="relative">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Continue typing or select a suggestion below..."
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  {inputValue && (
                    <button
                      onClick={() => addChip({ text: inputValue, type: 'custom', color: 'gray' })}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>

            {suggestions.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 slide-in-right">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-700">Next Steps</span>
                  <Info className="w-4 h-4 text-gray-400 ml-auto" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => addChip(suggestion)}
                      className="px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-700 transition-all text-left"
                    >
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickAction
                icon={Filter}
                title="Add Filter"
                description="Narrow down results"
                onClick={() => {
                  addChip({ text: 'that have', type: 'connector', color: 'gray' });
                }}
              />
              <QuickAction
                icon={ArrowUpDown}
                title="Sort Results"
                description="Order by criteria"
                onClick={() => {
                  showOptionsSelector('sort', { text: 'sorted by', type: 'sort', color: 'purple' });
                }}
              />
              <QuickAction
                icon={Target}
                title="Limit Results"
                description="Top N or percentage"
                onClick={() => {
                  showOptionsSelector('limit', { text: 'limited to', type: 'limit', color: 'indigo' });
                }}
              />
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-30" style={{ height: '88px' }}>
          <div className="h-full flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Phrase Mode Report</div>
                <div className="text-xs text-gray-500">
                  {previewCount !== null ? `~${previewCount.toLocaleString()} records` : 'Building query...'}
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
      <div className="min-h-screen bg-gray-50 flex flex-col">
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

export default PhraseModeReport;