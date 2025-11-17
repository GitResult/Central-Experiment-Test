import React, { useState, useEffect, useMemo } from 'react';
import { Plus, X, Eye, EyeOff, Search, ChevronRight, Settings, Play, Download, Calendar, Save, Grid3x3, List, Filter, Users, Mail, MapPin, Database, Crown, DollarSign, Share2, ChevronDown, Check, ArrowUpDown, Hash, UserPlus, UserMinus, Building2, Map, Globe, Award, Target, HelpCircle, TrendingUp, Briefcase, GraduationCap, School, Star, Gift, Receipt, Heart, FileText, CreditCard, Users2, Megaphone, BookOpen, Newspaper, UserCheck, ChevronUp, Lightbulb, Sparkles, Clock, Edit2 } from 'lucide-react';
import { updateDemoState } from '../../redux/demo/actions';
import { connect } from 'react-redux';
import ReportViewComponent from './ReportViewComponent.tsx';
import ReportList from './report-list.tsx';
import AppReportPhrase from './AppReportPhrase.jsx';

const getIconComponent = (iconName) => {
  const iconMap = {
    Database, Plus, X, Eye, EyeOff, Search, ChevronRight, Settings, Play,
    Download, Calendar, Save, Grid3x3, List, Filter, Users, Mail, MapPin,
    Crown, DollarSign, Share2, ChevronDown, Check, ArrowUpDown, Hash,
    UserPlus, UserMinus, Building2, Map, Globe, Award, Target, HelpCircle,
    TrendingUp, Briefcase, GraduationCap, School, Star, Gift, Receipt,
    Heart, FileText, CreditCard, Users2, Megaphone, BookOpen, Newspaper, UserCheck
  };
  return iconMap[iconName] || Database;
};

const AnimationStyles = () => (
  <style>{`
    @keyframes barRise { 0% { opacity: 0; transform: translateY(12px) scaleY(0.6); } 60% { opacity: 1; transform: translateY(-4px) scaleY(1.02); } 100% { opacity: 0.85; transform: translateY(0) scaleY(1); } }
    @keyframes drawLine { from { stroke-dashoffset: 280; } to { stroke-dashoffset: 0; } }
    @keyframes dotAppear { 0% { opacity: 0; transform: translateY(6px); } 60% { opacity: 1; transform: translateY(-2px); } 100% { opacity: 0.9; transform: translateY(0); } }
    @keyframes slicePop { 0% { opacity: 0; transform: scale(0.8) rotate(-6deg); } 60% { opacity: 1; transform: scale(1.05) rotate(2deg); } 100% { opacity: 0.85; transform: scale(1) rotate(0deg); } }
    @keyframes abstractFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes abstractFadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(20px); } }
    @keyframes slideInDown { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }
    @keyframes slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
    .animate-slideIn { animation: slideInDown 300ms cubic-bezier(0.2, 0.8, 0.2, 1); }
    .animate-slideInRight { animation: slideInRight 300ms cubic-bezier(0.2, 0.8, 0.2, 1); }
    .animate-slideUp { animation: slideUp 400ms cubic-bezier(0.2, 0.8, 0.2, 1); }
    .bar-animate { animation: barRise 1400ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .bar-animate-delay-1 { animation-delay: 80ms; }
    .bar-animate-delay-2 { animation-delay: 160ms; }
    .line-animate { animation: drawLine 1100ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards 120ms; }
    .dot-animate { animation: dotAppear 800ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .dot-animate-delay-1 { animation-delay: 120ms; }
    .dot-animate-delay-2 { animation-delay: 240ms; }
    .dot-animate-delay-3 { animation-delay: 360ms; }
    .dot-animate-delay-4 { animation-delay: 480ms; }
    .slice-animate { animation: slicePop 900ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards 280ms; }
    .slice-animate-delay-1 { animation-delay: 320ms; }
    .slice-animate-delay-2 { animation-delay: 360ms; }
    .abstract-container-in { animation: abstractFadeIn 400ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .abstract-container-out { animation: abstractFadeOut 400ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .welcome-card { transition: all 200ms cubic-bezier(0.2, 0.8, 0.2, 1); }
    .welcome-card:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); border-color: #3B82F6; }
    .welcome-card:hover svg { color: #3B82F6; }
  `}</style>
);

const ReportBuilder = (props) => {
  const { updateDemoStateAction, isPhraseActive } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [stage, setStage] = useState('welcome');
  const [showAbstract, setShowAbstract] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [selections, setSelections] = useState([]);
  const [toast, setToast] = useState(null);
  const [reportTitle, setReportTitle] = useState('New Report');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [valueSearchTerm, setValueSearchTerm] = useState('');
  const [editingSelection, setEditingSelection] = useState(null);
  const [proximityLocation, setProximityLocation] = useState('');
  const [proximityRadius, setProximityRadius] = useState(25);
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [activePanel, setActivePanel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilters, setSectionFilters] = useState([]);
  const [showLeftFilterPanel, setShowLeftFilterPanel] = useState(false);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [bulkSelected, setBulkSelected] = useState([]);
  const [fieldsPanel, setFieldsPanel] = useState(null);
  const [fieldsPanelTab, setFieldsPanelTab] = useState('fields');

  const [showPreview, setShowPreview] = useState(false);


  const [categories, setCategories] = useState({});
  const [sampleValues, setSampleValues] = useState({});
  const [categoryFields, setCategoryFields] = useState({});
  const [defaultFields, setDefaultFields] = useState([]);
  const [sectionIcons, setSectionIcons] = useState({});
  const sectionColors = {
    "Starting Data": {
      "header": "text-blue-700",
      "icon": "text-blue-400",
      "bg": "bg-blue-50",
      "border": "border-blue-200"
    },
    "Location": {
      "header": "text-green-700",
      "icon": "text-green-400",
      "bg": "bg-green-50",
      "border": "border-green-200"
    },
    "Membership": {
      "header": "text-purple-700",
      "icon": "text-purple-400",
      "bg": "bg-purple-50",
      "border": "border-purple-200"
    },
    "Demographics": {
      "header": "text-orange-700",
      "icon": "text-orange-400",
      "bg": "bg-orange-50",
      "border": "border-orange-200"
    },
    "Commerce": {
      "header": "text-emerald-700",
      "icon": "text-emerald-400",
      "bg": "bg-emerald-50",
      "border": "border-emerald-200"
    },
    "Communities": {
      "header": "text-pink-700",
      "icon": "text-pink-400",
      "bg": "bg-pink-50",
      "border": "border-pink-200"
    },
    "Communications": {
      "header": "text-indigo-700",
      "icon": "text-indigo-400",
      "bg": "bg-indigo-50",
      "border": "border-indigo-200"
    }
  };
  const [categoryIcons, setCategoryIcons] = useState({});


  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     const jsonUrl = `${process.env.PUBLIC_URL}/data/reports/newReport.json`;
  //     const response = await fetch(jsonUrl);
  //     const data = await response.json();
  //     console.log("data::::", data);

  //     setCategories(data.categories);
  //     setSampleValues(data.sample_values);
  //     setCategoryFields(data.category_fields);
  //     setDefaultFields(data.default_fields);
  //     setSectionIcons(data.section_icons);
  //     // setSectionColors(data.section_colors);
  //     setCategoryIcons(data.category_icons);
  //     setIsLoading(false);
  //   };
  //   fetchData();

  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const jsonUrl = `${process.env.PUBLIC_URL}/data/reports/newReport.json`;
      const response = await fetch(jsonUrl);
      const data = await response.json();
      // console.log("data::::", data);


      const updatedSampleValues = { ...data.sample_values };
      Object.entries(data.categories).forEach(([section, cats]) => {
        cats.forEach(cat => {
          if (!updatedSampleValues[cat]) {
            updatedSampleValues[cat] = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6'];
          }
        });
      });

      setCategories(data.categories);
      setSampleValues(updatedSampleValues);
      setCategoryFields(data.category_fields);
      setDefaultFields(data.default_fields);
      setSectionIcons(data.section_icons);
      setCategoryIcons(data.category_icons);
      setIsLoading(false);
    };
    fetchData();

  }, []);

  useEffect(() => {
    if (stage === 'welcome') {
      setShowAbstract(true);
      setTimeout(() => setShowAbstract(false), 1600);
      setTimeout(() => setShowPanel(true), 1700);
    }
  }, [stage]);

  // Memoize the record count calculation so it's consistent across all displays
  // MUST be before any conditional returns to satisfy React Hooks rules
  const estimatedRecordCount = useMemo(() => {
    const activeFilters = selections.filter(s => s.type === 'filter');
    if (activeFilters.length === 0) return 7100;
    let result = 7100;
    activeFilters.forEach(() => { result = Math.floor(result * (0.3 + Math.random() * 0.4)); });
    return Math.max(50, result);
  }, [selections]);

  // Render AppReportPhrase when phrase mode is active
  if (isPhraseActive) {
    return <AppReportPhrase />;
  }

  const addSelection = (category, value, type = 'filter') => {
    setSelections([...selections, { id: Date.now(), category, value, type, connector: selections.length > 0 ? 'AND' : null }]);
  };

  const removeSelection = (id) => setSelections(selections.filter(s => s.id !== id));
  const showToast = (message) => { setToast(message); setTimeout(() => setToast(null), 2000); };

  const handleCategorySelect = (category, section) => {
    const values = sampleValues[category] || [];

    // If category only has one value, auto-select it
    if (values.length === 1 && category !== 'Proximity' && category !== 'Joined/Renewed') {
      if (section === 'Starting Data') {
        addField(category, values[0]);
      } else {
        addFilter(category, values[0]);
      }
      return;
    }

    // Open panel for this category
    setSelectedCategory(category);
    setValueSearchTerm('');
  };

  const handleValueSelect = (category, value) => setSelectedValue({ category, value });

  const handleEditSelection = (selection) => {
    // Set the selection being edited
    setEditingSelection(selection);
    // Open the category panel for this selection's category
    setSelectedCategory(selection.category);
    setValueSearchTerm('');
  };

  const addFilter = (category, value) => {
    if (editingSelection) {
      // Update existing selection, preserving its type
      setSelections(selections.map(s =>
        s.id === editingSelection.id
          ? { ...s, category, value }
          : s
      ));
      showToast(`Selection updated: ${value}`);
      setEditingSelection(null);
      setSelectedCategory(null);
    } else {
      // Add new selection
      addSelection(category, value, 'filter');
      showToast(`Filter added: ${value}`);
    }
  };

  const addField = (category, value) => {
    addSelection(category, value || 'All Values', 'field');
    showToast(`Field added: ${category}`);
  };

  const applyDateRange = (type) => {
    const labels = { last30: 'Last 30 days', last60: 'Last 60 days', last90: 'Last 90 days', first30: 'First 30 days of membership', first60: 'First 60 days of membership', first90: 'First 90 days of membership' };
    addFilter('Joined/Renewed', labels[type]);
    setSelectedCategory(null);
  };

  const applyProximityFilter = () => {
    if (proximityLocation) {
      addFilter('Proximity', `Within ${proximityRadius} miles of ${proximityLocation}`);
      setSelectedCategory(null);
      setProximityLocation('');
      setProximityRadius(25);
    }
  };

  const getValueCount = (category, value) => {
    const hash = (category + value).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.floor(300 + (hash % 3000));
  };

  const getCategoryTotal = (category) => {
    const values = sampleValues[category] || [];
    return values.reduce((sum, val) => sum + getValueCount(category, val), 0);
  };

  const getFilteredFields = () => {
    const allFields = Object.entries(categories).flatMap(([section, categories]) =>
      categories.map(cat => ({ section, category: cat }))
    );

    let filtered = allFields;
    if (sectionFilters.length > 0) {
      filtered = filtered.filter(f => sectionFilters.includes(f.section));
    }

    if (searchTerm) {
      filtered = filtered.filter(f =>
        f.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.section.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const toggleSectionFilter = (section) => {
    setSectionFilters(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const toggleBulkSelect = (category) => {
    setBulkSelected(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const applyBulkAction = (action) => {
    bulkSelected.forEach(category => {
      if (action === 'field') {
        addSelection(category, 'All Values', 'field');
      } else if (action === 'filter') {
        const values = sampleValues[category] || [];
        if (values.length > 0) {
          addSelection(category, values[0], 'filter');
        }
      }
    });
    setBulkSelected([]);
    setBulkSelectMode(false);
    showToast(`${action === 'field' ? 'Fields' : 'Filters'} added for ${bulkSelected.length} categories`);
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-115px)] bg-white flex flex-col relative overflow-hidden">
        <AnimationStyles />
        <div className="flex-1 flex items-center justify-center p-8">
          <h1 className="text-5xl font-light mb-12 text-gray-900">Loading Report Builder</h1>
        </div>
      </div>
    );
  }

  if (stage === 'welcome') {
    return (
      <div className="min-h-[calc(100vh-115px)] bg-white flex flex-col relative overflow-hidden">
        <AnimationStyles />
        {toast && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slideIn">
            <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">{toast}</span>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <h1 className="text-5xl font-light mb-12 text-gray-900">New Report</h1>
          <p className="text-xl text-gray-600 mb-16 text-center max-w-2xl">Browse, select or use the phrase experience to tailor your results.</p>

          <div className="grid grid-cols-3 gap-8 mb-12 max-w-4xl w-full">
            <button onClick={() => setStage('browse')} className="welcome-card p-8 rounded-2xl border border-gray-200 bg-white">
              <Grid3x3 className="w-12 h-12 mx-auto mb-4 text-gray-400" strokeWidth={1.5} />
              <h3 className="text-xl font-medium mb-2 text-gray-900">Browse</h3>
              <p className="text-sm text-gray-500">Categories to select</p>
            </button>

            <button onClick={() => setStage('select')} className="welcome-card p-8 rounded-2xl border border-gray-200 bg-white">
              <List className="w-12 h-12 mx-auto mb-4 text-gray-400" strokeWidth={1.5} />
              <h3 className="text-xl font-medium mb-2 text-gray-900">Select</h3>
              <p className="text-sm text-gray-500">From a list of fields</p>
            </button>

            <button
              onClick={() => {
                updateDemoStateAction({ isPhraseActive: !isPhraseActive })
              }}
              className="welcome-card p-8 rounded-2xl border border-gray-200 bg-white focus-visible:outline-none">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" strokeWidth={1.5} />
              <h3 className="text-xl font-medium mb-2 text-gray-900">Phrase</h3>
              <p className="text-sm text-gray-500">Based on terms to use</p>
            </button>
          </div>
        </div>

        <div className={`absolute left-0 right-0 bottom-10 flex justify-center items-end pointer-events-none z-10 ${showAbstract ? 'abstract-container-in' : 'abstract-container-out'}`}>
          <svg width="700" height="200" viewBox="0 0 700 200" className="drop-shadow-lg scale-50">
            <g transform="translate(80, 0)">
              <rect x="0" y="100" width="32" height="80" rx="6" fill="#60A5FA" opacity="0" className={showAbstract ? 'bar-animate' : ''} />
              <rect x="45" y="70" width="32" height="110" rx="6" fill="#34D399" opacity="0" className={showAbstract ? 'bar-animate bar-animate-delay-1' : ''} />
              <rect x="90" y="50" width="32" height="130" rx="6" fill="#FBBF24" opacity="0" className={showAbstract ? 'bar-animate bar-animate-delay-2' : ''} />
            </g>
            <g transform="translate(230, 0)">
              <polyline points="0,130 60,100 120,120 180,60 240,90" fill="none" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="280" strokeDashoffset="280" className={showAbstract ? 'line-animate' : ''} />
              <circle cx="0" cy="130" r="5" fill="#60A5FA" opacity="0" className={showAbstract ? 'dot-animate' : ''} />
              <circle cx="60" cy="100" r="5" fill="#60A5FA" opacity="0" className={showAbstract ? 'dot-animate dot-animate-delay-1' : ''} />
              <circle cx="120" cy="120" r="5" fill="#60A5FA" opacity="0" className={showAbstract ? 'dot-animate dot-animate-delay-2' : ''} />
              <circle cx="180" cy="60" r="5" fill="#60A5FA" opacity="0" className={showAbstract ? 'dot-animate dot-animate-delay-3' : ''} />
              <circle cx="240" cy="90" r="5" fill="#60A5FA" opacity="0" className={showAbstract ? 'dot-animate dot-animate-delay-4' : ''} />
            </g>
            <g transform="translate(580, 110)">
              <path d="M 0,0 L 35,0 A 35,35 0 0,1 -17.5,30.3 Z" fill="#60A5FA" opacity="0" className={showAbstract ? 'slice-animate' : ''} />
              <path d="M 0,0 L -17.5,30.3 A 35,35 0 0,1 -35,0 Z" fill="#34D399" opacity="0" className={showAbstract ? 'slice-animate slice-animate-delay-1' : ''} />
              <path d="M 0,0 L -35,0 A 35,35 0 0,1 17.5,-30.3 Z" fill="#FBBF24" opacity="0" className={showAbstract ? 'slice-animate slice-animate-delay-2' : ''} />
              <path d="M 0,0 L 17.5,-30.3 A 35,35 0 0,1 35,0 Z" fill="#F87171" opacity="0" className={showAbstract ? 'slice-animate slice-animate-delay-2' : ''} />
            </g>
          </svg>
        </div>

        <div className={`absolute ${showPreview ? "bottom-[533px]" : "bottom-0"} ease-in-out inset-x-0 bg-white border-t border-gray-200 shadow-2xl transition-all duration-700 z-20 ${showPanel ? 'translate-y-0' : 'translate-y-full'}`} style={{ height: '88px' }}>
          <div className="flex h-full bg-white items-center justify-between px-6">

            <div className="flex items-center space-x-4">
              <ChevronUp
                size={18}
                onClick={() => setShowPreview(!showPreview)}
                className={`cursor-pointer text-gray-400/50 ${showPreview ? 'rotate-180' : ''}`}
              />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Filter className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">New Report</div>
                  <div className="text-xs text-gray-500">JD • {selections.length} selections</div>
                </div>
              </div>
            </div>

            <button disabled className="p-4 rounded-full bg-gray-200 text-gray-400 cursor-not-allowed">
              <Play className="w-6 h-6" strokeWidth={1.5} fill="currentColor" />
            </button>
          </div>

          {/* Report VIEW Content */}
          <ReportViewComponent selections={selections} />

        </div>
      </div>
    );
  }

  if (stage === 'browse') {
    // Convert selections to natural language query
    const buildNaturalLanguageQuery = () => {
      if (selections.length === 0) return '';

      const startingDataCategories = ['Current Members', 'New Members', 'Lapsed Members', 'Contacts', '2024 Members', '2023 Members', '2022 Members', '2021 Members', '2020 Members', '2019 Members'];
      const yearCohorts = ['2024 Members', '2023 Members', '2022 Members', '2021 Members', '2020 Members', '2019 Members'];

      let query = '';
      let hasStartingData = false;
      let isYearCohort = false;

      // Find starting data
      const startingDataSel = selections.find(s => startingDataCategories.includes(s.category));
      if (startingDataSel) {
        hasStartingData = true;
        isYearCohort = yearCohorts.includes(startingDataSel.category);

        if (isYearCohort) {
          query = startingDataSel.category.replace(' Members', ' members');
        } else {
          query = startingDataSel.category.toLowerCase();
        }
      }

      // Group remaining selections by type
      const memberTypeSel = selections.find(s => s.category === 'Membership Type');
      const tenureSel = selections.find(s => s.category === 'Tenure');
      const occupationSel = selections.find(s => s.category === 'Occupation');
      const degreeSel = selections.find(s => s.category === 'Degree');
      const provinceSel = selections.find(s => s.category === 'Province/State');
      const renewalMonthSel = selections.find(s => s.category === 'Renewal Month');
      const renewalYearSel = selections.find(s => s.category === 'Renewal Year');

      // Build query parts
      const parts = [];

      if (tenureSel) {
        parts.push(`that have been members for the ${tenureSel.value.toLowerCase()}`);
      }

      if (memberTypeSel) {
        // Extract acronym from "ECY1 - Member Early Career Year 1" format, or use full value if no hyphen
        const memberTypeDisplay = memberTypeSel.value.includes(' - ')
          ? memberTypeSel.value.split(' - ')[0]
          : memberTypeSel.value;
        parts.push(`that are member type ${memberTypeDisplay}`);
      }

      if (occupationSel) {
        parts.push(`and occupation is ${occupationSel.value.toLowerCase()}`);
      }

      if (degreeSel) {
        parts.push(`with a Degree: ${degreeSel.value}`);
      }

      if (provinceSel) {
        parts.push(`from province/state ${provinceSel.value}`);
      }

      if (renewalMonthSel || renewalYearSel) {
        let renewalPart = 'who renewed in';
        if (renewalMonthSel) {
          renewalPart += ` ${renewalMonthSel.value}`;
        }
        if (renewalYearSel) {
          renewalPart += ` ${renewalYearSel.value}`;
        }
        parts.push(renewalPart);
      }

      // Combine all parts
      if (parts.length > 0) {
        query += ' ' + parts.join(' ');
      }

      return query.trim();
    };

    // Get suggested next steps based on current selections
    const getSuggestedNextSteps = () => {
      // Check all selections regardless of type (field or filter)
      const allSelections = selections;
      const startingDataCategories = ['Current Members', 'New Members', 'Lapsed Members', 'Contacts', '2024 Members', '2023 Members', '2022 Members', '2021 Members', '2020 Members', '2019 Members'];

      if (allSelections.length === 0) {
        return {
          title: "Start building your query",
          suggestions: [
            { category: "Current Members", section: "Starting Data", reason: "Most common starting point", icon: "Users" },
            { category: "2024 Members", section: "Starting Data", reason: "Filter by specific year", icon: "Calendar" },
            { category: "New Members", section: "Starting Data", reason: "Recent additions", icon: "UserPlus" }
          ]
        };
      }

      // Check if user has selected a starting data category (can be field or filter)
      const hasStartingData = allSelections.some(s => startingDataCategories.includes(s.category));

      // Stage 1: After selecting starting data, suggest refining filters
      if (hasStartingData && allSelections.length === 1) {
        return {
          title: "Refine your selection",
          suggestions: [
            { category: "Membership Type", section: "Membership", reason: "Filter by member type (ECY1, STU1, etc.)", icon: "Crown" },
            { category: "Province/State", section: "Location", reason: "Filter by location", icon: "MapPin" },
            { category: "Tenure", section: "Membership", reason: "Filter by membership duration", icon: "Clock" },
            { category: "Occupation", section: "Demographics", reason: "Filter by occupation", icon: "Briefcase" }
          ]
        };
      }

      // Stage 2: After adding member type, suggest demographics
      const hasMemberType = allSelections.some(s => s.category === 'Membership Type');
      const hasOccupation = allSelections.some(s => s.category === 'Occupation');
      const hasDegree = allSelections.some(s => s.category === 'Degree');
      const hasProvince = allSelections.some(s => s.category === 'Province/State');
      const hasTenure = allSelections.some(s => s.category === 'Tenure');

      if (hasMemberType && !hasOccupation && !hasDegree) {
        return {
          title: "Common next filters",
          suggestions: [
            { category: "Occupation", section: "Demographics", reason: "Often combined with member type", icon: "Briefcase" },
            { category: "Degree", section: "Demographics", reason: "Filter by education level", icon: "GraduationCap" },
            { category: "Province/State", section: "Location", reason: "Add location filter", icon: "MapPin" }
          ]
        };
      }

      // Stage 3: After adding occupation, suggest degree and location
      if (hasOccupation && !hasDegree && !hasProvince) {
        return {
          title: "Complete your demographic filters",
          suggestions: [
            { category: "Degree", section: "Demographics", reason: "Add education requirement", icon: "GraduationCap" },
            { category: "Province/State", section: "Location", reason: "Add location requirement", icon: "MapPin" }
          ]
        };
      }

      // Stage 4: After degree, suggest location
      if (hasDegree && !hasProvince) {
        return {
          title: "Add location filter",
          suggestions: [
            { category: "Province/State", section: "Location", reason: "Complete with location requirement", icon: "MapPin" }
          ]
        };
      }

      // Stage 5: For year-based cohorts, suggest renewal filters
      const hasYearCohort = allSelections.some(s => ['2024 Members', '2023 Members', '2022 Members', '2021 Members', '2020 Members', '2019 Members'].includes(s.category));
      const hasRenewalMonth = allSelections.some(s => s.category === 'Renewal Month');

      if (hasYearCohort && !hasRenewalMonth && allSelections.length <= 2) {
        return {
          title: "Analyze renewal patterns",
          suggestions: [
            { category: "Renewal Month", section: "Membership", reason: "Filter by renewal timing", icon: "Calendar" },
            { category: "Renewal Year", section: "Membership", reason: "Filter by renewal year", icon: "Calendar" }
          ]
        };
      }

      // Default: Suggest additional filters that haven't been added
      const suggestions = [];
      if (!hasTenure && hasStartingData) {
        suggestions.push({ category: "Tenure", section: "Membership", reason: "Filter by membership duration", icon: "Clock" });
      }
      if (!hasMemberType) {
        suggestions.push({ category: "Membership Type", section: "Membership", reason: "Filter by member type", icon: "Crown" });
      }
      if (!hasOccupation) {
        suggestions.push({ category: "Occupation", section: "Demographics", reason: "Filter by occupation", icon: "Briefcase" });
      }
      if (!hasDegree) {
        suggestions.push({ category: "Degree", section: "Demographics", reason: "Filter by education", icon: "GraduationCap" });
      }
      if (!hasProvince) {
        suggestions.push({ category: "Province/State", section: "Location", reason: "Filter by location", icon: "MapPin" });
      }

      if (suggestions.length > 0) {
        return {
          title: "Additional filters you can add",
          suggestions: suggestions.slice(0, 4)
        };
      }

      // Final stage: Always suggest additional categories not yet used
      const hasCareerStage = allSelections.some(s => s.category === 'Career Stage');
      const hasWorkplace = allSelections.some(s => s.category === 'Workplace Setting');
      const hasEducationReceived = allSelections.some(s => s.category === 'Education Received');
      const hasAreaOfInterest = allSelections.some(s => s.category === 'Area of Interest');
      const hasCodeOfEthics = allSelections.some(s => s.category === 'Code of Ethics');
      const hasPrimaryReason = allSelections.some(s => s.category === 'Primary Reason for Joining');

      const additionalSuggestions = [];

      if (!hasRenewalMonth && hasStartingData) {
        additionalSuggestions.push({ category: "Renewal Month", section: "Membership", reason: "Filter by renewal timing", icon: "Calendar" });
      }
      if (!hasCareerStage) {
        additionalSuggestions.push({ category: "Career Stage", section: "Demographics", reason: "Filter by career progression", icon: "TrendingUp" });
      }
      if (!hasWorkplace) {
        additionalSuggestions.push({ category: "Workplace Setting", section: "Demographics", reason: "Filter by work environment", icon: "Building2" });
      }
      if (!hasEducationReceived) {
        additionalSuggestions.push({ category: "Education Received", section: "Demographics", reason: "Filter by completed education", icon: "GraduationCap" });
      }
      if (!hasAreaOfInterest) {
        additionalSuggestions.push({ category: "Area of Interest", section: "Demographics", reason: "Filter by specialization", icon: "Star" });
      }
      if (!hasCodeOfEthics) {
        additionalSuggestions.push({ category: "Code of Ethics", section: "Membership", reason: "Filter by ethics compliance", icon: "Award" });
      }
      if (!hasPrimaryReason) {
        additionalSuggestions.push({ category: "Primary Reason for Joining", section: "Membership", reason: "Filter by motivation", icon: "Target" });
      }

      return {
        title: additionalSuggestions.length > 0 ? "Refine further with these filters" : "All common filters applied!",
        suggestions: additionalSuggestions.length > 0 ? additionalSuggestions.slice(0, 4) : [
          { category: "Career Stage", section: "Demographics", reason: "Add career stage filter", icon: "TrendingUp" },
          { category: "Workplace Setting", section: "Demographics", reason: "Add workplace filter", icon: "Building2" }
        ]
      };
    };

    const suggestedSteps = getSuggestedNextSteps();

    // Common query templates
    const queryTemplates = [
      {
        name: "Current members for past 5 years",
        filters: [
          { category: "Current Members", value: "All Current Members" },
          { category: "Tenure", value: "Past 5 years" }
        ]
      },
      {
        name: "ECY1 members in BC",
        filters: [
          { category: "Current Members", value: "All Current Members" },
          { category: "Membership Type", value: "ECY1 - Member Early Career Year 1" },
          { category: "Province/State", value: "BC" }
        ]
      },
      {
        name: "Practitioners with Masters in BC",
        filters: [
          { category: "Current Members", value: "All Current Members" },
          { category: "Occupation", value: "Practitioner" },
          { category: "Degree", value: "Masters" },
          { category: "Province/State", value: "BC" }
        ]
      },
      {
        name: "2019 members who renewed in Dec-Jan",
        filters: [
          { category: "2019 Members", value: "All 2019 Members" },
          { category: "Renewal Month", value: "December" }
        ]
      }
    ];

    return (
      <div className="max-h-[calc(100vh-115px)] overflow-y-auto bg-gray-50 flex flex-col">
        {/* {"[[BROWSE]]"} */}
        <AnimationStyles />
        {toast && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slideIn">
            <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl"><span className="text-sm font-medium">{toast}</span></div>
          </div>
        )}

        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setStage('welcome')} className="text-blue-500 hover:text-blue-600 text-sm">← Back</button>
            <h1 className="text-2xl font-light">New Report - Browse</h1>
            <button onClick={() => setStage('select')} className="ml-4 text-sm text-gray-500 hover:text-blue-500">Try Select mode →</button>
          </div>
        </div>

        {/* Query Builder Panel */}
        {selections.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200 px-8 py-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Your Query</h3>
                  <span className="text-xs text-gray-500">({selections.length} selection{selections.length !== 1 ? 's' : ''})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selections.map((sel, idx) => {
                    const Icon = sel.type === 'filter' ? Filter : Eye;
                    const isEditing = editingSelection?.id === sel.id;
                    return (
                      <div key={sel.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                        isEditing
                          ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg'
                          : sel.type === 'filter'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'bg-purple-100 text-purple-900 border border-purple-300'
                      }`}>
                        <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                        <span className="font-medium">{sel.category}</span>
                        <span className="text-xs opacity-75">= {sel.value}</span>
                        <div className="flex items-center gap-1 ml-1">
                          <button
                            onClick={() => handleEditSelection(sel)}
                            className="hover:bg-white/80 hover:shadow-sm rounded p-1 transition-all"
                            title="Edit selection value"
                          >
                            <Edit2 className="w-3.5 h-3.5" strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => {
                              removeSelection(sel.id);
                              if (editingSelection?.id === sel.id) {
                                setEditingSelection(null);
                                setSelectedCategory(null);
                              }
                            }}
                            className="hover:bg-white/80 hover:shadow-sm rounded p-1 transition-all"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{estimatedRecordCount.toLocaleString()}</div>
                <div className="text-xs text-gray-600">estimated records</div>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Next Steps Panel */}
        {selections.length > 0 && suggestedSteps.suggestions.length > 0 && (
          <div className="bg-amber-50 border-b border-amber-200 px-8 py-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{suggestedSteps.title}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {suggestedSteps.suggestions.map((suggestion, idx) => {
                    const SuggestionIcon = getIconComponent(suggestion.icon);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleCategorySelect(suggestion.category, suggestion.section)}
                        className="flex items-start gap-2 p-3 bg-white rounded-lg hover:bg-amber-100 transition-colors border border-amber-200 text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <SuggestionIcon className="w-4 h-4 text-amber-700" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900">{suggestion.category}</div>
                          <div className="text-xs text-gray-600 mt-0.5">{suggestion.reason}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={1.5} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Query Templates Panel */}
        {selections.length === 0 && (
          <div className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-900">Quick Start Templates</h3>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {queryTemplates.map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    template.filters.forEach(filter => {
                      addFilter(filter.category, filter.value);
                    });
                    showToast(`Applied template: ${template.name}`);
                  }}
                  className="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all text-left group"
                >
                  <div className="text-sm font-medium text-gray-900 group-hover:text-blue-900 mb-1">{template.name}</div>
                  <div className="text-xs text-gray-500">{template.filters.length} filters</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto pb-32 bg-white">
          {Object.entries(categories).map(([section, categories], sectionIdx) => {
            const isStartingData = section === 'Starting Data';
            const isThreeColumn = categories.length >= 6;

            return (
              <div key={section}>
                <div className="px-8 py-4"><h2 className="text-xl font-semibold text-black">{section}</h2></div>

                <div className={`px-8 pb-8 ${isStartingData ? 'flex flex-wrap gap-3' : isThreeColumn ? 'grid grid-cols-3 gap-4' : 'grid grid-cols-5 gap-6'}`}>
                  {categories.map((category) => {
                    const CategoryIcon = getIconComponent(categoryIcons[category]);
                    const isSelected = selections.some(s => s.category === category);

                    if (isStartingData) {
                      return (
                        <button
                          key={category}
                          onClick={() => handleCategorySelect(category, section)}
                          className={`px-6 py-3 rounded-full transition-colors group relative ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                          style={{ backgroundColor: isSelected ? '#dbeafe' : '#f3f4f6' }}
                          onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#dbeafe'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isSelected ? '#dbeafe' : '#f3f4f6'; }}
                        >
                          <span className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{category}</span>
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-0.5">
                              <Check className="w-3 h-3" strokeWidth={3} />
                            </div>
                          )}
                          {!isSelected && (
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Plus className="w-3 h-3 text-gray-600" strokeWidth={2} />
                            </div>
                          )}
                        </button>
                      );
                    }

                    if (isThreeColumn) {
                      const hoverColors = { 'Location': '#dcfce7', 'Membership': '#f3e8ff', 'Demographics': '#fed7aa', 'Commerce': '#d1fae5', 'Communities': '#fce7f3', 'Communications': '#e0e7ff' };
                      return (
                        <div
                          key={category}
                          onClick={() => handleCategorySelect(category, section)}
                          className={`flex items-start gap-3 p-4 bg-white rounded-lg cursor-pointer transition-all hover:shadow-md group relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = hoverColors[section] || '#dbeafe'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${sectionColors[section]?.bg.replace('50', '100')}`}>
                            <CategoryIcon className={`w-5 h-5 ${sectionColors[section]?.icon.replace('400', '600')}`} strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm">{category}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{sampleValues[category]?.length || 6} options</div>
                          </div>
                          {isSelected ? (
                            <div className="bg-blue-500 text-white rounded-full p-0.5 flex-shrink-0">
                              <Check className="w-3 h-3" strokeWidth={3} />
                            </div>
                          ) : (
                            <button onClick={(e) => { e.stopPropagation(); addField(category); }} className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity" title="Add as field">
                              <Plus className="w-4 h-4 text-gray-600 hover:text-gray-900" strokeWidth={2} />
                            </button>
                          )}
                        </div>
                      );
                    }

                    const hoverColors = { 'Location': '#dcfce7', 'Membership': '#f3e8ff', 'Demographics': '#fed7aa', 'Commerce': '#d1fae5', 'Communities': '#fce7f3', 'Communications': '#e0e7ff' };
                    const iconHoverColors = { 'Location': '#16a34a', 'Membership': '#9333ea', 'Demographics': '#ea580c', 'Commerce': '#059669', 'Communities': '#db2777', 'Communications': '#4f46e5' };

                    return (
                      <div key={category} onClick={() => handleCategorySelect(category, section)} className={`group cursor-pointer relative ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg' : ''}`}>
                        <div
                          className="aspect-square rounded-lg mb-3 relative overflow-hidden transition-all duration-200 flex items-center justify-center"
                          style={{ backgroundColor: isSelected ? hoverColors[section] || '#dbeafe' : '#e5e7eb' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = hoverColors[section] || '#dbeafe'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isSelected ? (hoverColors[section] || '#dbeafe') : '#e5e7eb'; }}
                        >
                          <CategoryIcon
                            className="w-12 h-12 text-gray-300 transition-all duration-200 group-hover:scale-110"
                            strokeWidth={1.5}
                            style={{ color: isSelected ? (iconHoverColors[section] || '#3b82f6') : '#d1d5db' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = iconHoverColors[section] || '#3b82f6'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = isSelected ? (iconHoverColors[section] || '#3b82f6') : '#d1d5db'; }}
                          />
                          {isSelected && (
                            <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full p-0.5">
                              <Check className="w-3 h-3" strokeWidth={3} />
                            </div>
                          )}
                          {!isSelected && (
                            <button onClick={(e) => { e.stopPropagation(); addField(category); }} className="absolute bottom-2 right-2 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white shadow-lg" title="Add as field">
                              <Plus className="w-4 h-4 text-gray-700" strokeWidth={2} />
                            </button>
                          )}
                        </div>
                        <div>
                          <div className={`font-medium text-sm transition-colors ${isSelected ? 'text-blue-900 font-semibold' : 'text-gray-900 group-hover:text-black'}`}>{category}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{sampleValues[category]?.length || 6} options</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {sectionIdx < Object.entries(categories).length - 1 && <div className="mx-8 border-t border-gray-200"></div>}
              </div>
            );
          })}
        </div>

        {selectedCategory && (
          <div style={{ position: 'absolute', top: 0, right: selectedValue ? '280px' : '0px', height: '100%', width: '480px', backgroundColor: 'white', borderLeft: '1px solid #E5E7EB', boxShadow: '-10px 0 25px -5px rgba(0, 0, 0, 0.1)', zIndex: 40, transition: 'right 300ms ease-in-out', display: 'flex', flexDirection: 'column' }}>
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedCategory}</h3>
                  {editingSelection && (
                    <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                      <Edit2 className="w-3 h-3" strokeWidth={2} />
                      Editing: {editingSelection.value}
                    </p>
                  )}
                </div>
                <button onClick={() => {
                  setSelectedCategory(null);
                  setSelectedValue(null);
                  setEditingSelection(null);
                }} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              {selectedCategory !== 'Proximity' && selectedCategory !== 'Joined/Renewed' && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
                  <input type="text" value={valueSearchTerm} onChange={(e) => setValueSearchTerm(e.target.value)} placeholder="Search values..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
              )}
            </div>

            <div className="flex-1 overflow-auto p-6 bg-white">
              {selectedCategory === 'Proximity' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
                      <input type="text" value={proximityLocation} onChange={(e) => setProximityLocation(e.target.value)} placeholder="Enter address or city..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-4 h-48 flex items-center justify-center border border-gray-200">
                    <div className="text-center">
                      <Map className="w-12 h-12 mx-auto mb-2 text-gray-400" strokeWidth={1.5} />
                      <p className="text-sm text-gray-500">Map preview</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Radius: {proximityRadius} miles</label>
                    <input type="range" min="1" max="100" value={proximityRadius} onChange={(e) => setProximityRadius(parseInt(e.target.value))} className="w-full" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1"><span>1 mi</span><span>100 mi</span></div>
                  </div>

                  <button onClick={applyProximityFilter} disabled={!proximityLocation} className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${proximityLocation ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>Apply Filter</button>
                </div>
              ) : selectedCategory === 'Joined/Renewed' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs text-gray-500 mb-1 block">Start Date</label><input type="date" value={dateRangeStart} onChange={(e) => setDateRangeStart(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" /></div>
                      <div><label className="text-xs text-gray-500 mb-1 block">End Date</label><input type="date" value={dateRangeEnd} onChange={(e) => setDateRangeEnd(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" /></div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Relative to Today</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {['last30', 'last60', 'last90'].map(type => (
                        <button key={type} onClick={() => applyDateRange(type)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-colors">
                          {type === 'last30' ? 'Last 30 days' : type === 'last60' ? 'Last 60 days' : 'Last 90 days'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Relative to Membership</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {['first30', 'first60', 'first90'].map(type => (
                        <button key={type} onClick={() => applyDateRange(type)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-500 transition-colors">
                          {type === 'first30' ? 'First 30 days' : type === 'first60' ? 'First 60 days' : 'First 90 days'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(dateRangeStart && dateRangeEnd) && (
                    <button onClick={() => { addFilter('Joined/Renewed', `${dateRangeStart} to ${dateRangeEnd}`); setSelectedCategory(null); setDateRangeStart(''); setDateRangeEnd(''); }} className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">Apply Custom Range</button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <input type="checkbox" className="rounded" />
                    <span className="flex-1 text-sm font-medium text-gray-700">Any value (no filter)</span>
                    <button onClick={() => addField(selectedCategory)} className="opacity-70 hover:opacity-100 transition-opacity" title="Show as field">
                      <Eye className="w-4 h-4 text-purple-500" strokeWidth={1.5} />
                    </button>
                  </div>

                  {(sampleValues[selectedCategory] || []).filter(val => !valueSearchTerm || val.toLowerCase().includes(valueSearchTerm.toLowerCase())).map((value, i) => {
                    // Check if this exact filter is already selected (must match category, value, and type)
                    const isFilterSelected = selections.some(s =>
                      s.type === 'filter' &&
                      s.category === selectedCategory &&
                      s.value === value
                    );
                    // Check if this is the value being edited
                    const isEditingThisValue = editingSelection && editingSelection.value === value;

                    return (
                      <div key={`${selectedCategory}-${value}-${i}`} className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group ${
                        isEditingThisValue
                          ? 'bg-amber-50 border-2 border-amber-400'
                          : selectedValue?.value === value
                            ? 'bg-blue-50 border border-blue-200'
                            : ''
                      }`}>
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={isFilterSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              // Add filter only if it doesn't exist
                              if (!isFilterSelected) {
                                addFilter(selectedCategory, value);
                              }
                            } else {
                              // Remove filter when unchecked - find exact match
                              const filterToRemove = selections.find(s =>
                                s.type === 'filter' &&
                                s.category === selectedCategory &&
                                s.value === value
                              );
                              if (filterToRemove) {
                                removeSelection(filterToRemove.id);
                              }
                            }
                          }}
                        />
                        <button onClick={() => handleValueSelect(selectedCategory, value)} className="flex-1 text-sm text-left text-blue-600 hover:text-blue-700 hover:underline transition-all cursor-pointer">{value}</button>
                        <button onClick={() => addField(selectedCategory, value)} className="opacity-0 group-hover:opacity-100 transition-opacity" title="Show as field">
                          <Eye className="w-4 h-4 text-purple-500 hover:text-purple-600" strokeWidth={1.5} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedValue && (
          <div className="absolute top-0 h-full flex flex-col" style={{ right: '0px', width: '320px', backgroundColor: '#F9FAFB', borderLeft: '2px solid #E5E7EB', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', zIndex: 50, animation: 'slideInRight 300ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
            <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <button onClick={() => setSelectedValue(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <ChevronRight className="w-5 h-5 rotate-180" strokeWidth={1.5} />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 truncate">{selectedValue.value}</h3>
                  <p className="text-xs text-gray-500 truncate">{selectedValue.category}</p>
                </div>
                <button onClick={() => setSelectedValue(null)} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex gap-1 border-b border-gray-200">
                <button className="px-3 py-1.5 text-xs font-medium text-blue-600 border-b-2 border-blue-600 -mb-px">Overview</button>
                <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900">Timeline</button>
                <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900">More</button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4" style={{ backgroundColor: '#F9FAFB' }}>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-white rounded-lg border border-blue-100 shadow-sm">
                    <div className="text-xl font-bold text-blue-600">1,247</div>
                    <div className="text-xs text-gray-600 mt-0.5">Total Members</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-green-100 shadow-sm">
                    <div className="text-xl font-bold text-green-600">17.6%</div>
                    <div className="text-xs text-gray-600 mt-0.5">Of Total</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                  <h4 className="text-xs font-semibold text-gray-900 mb-1.5">Description</h4>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    This value represents members in the category &quot;{selectedValue.category}&quot; with the specific attribute &quot;{selectedValue.value}&quot;. Use this filter to narrow your report results to only include records matching this criteria.
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                  <h4 className="text-xs font-semibold text-gray-900 mb-2">Quick Actions</h4>
                  <div className="space-y-1.5">
                    <button onClick={() => { addFilter(selectedValue.category, selectedValue.value); setSelectedValue(null); }} className="w-full flex items-center gap-2 p-2.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors border border-blue-100">
                      <Filter className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-xs font-medium text-blue-900">Add as Filter</span>
                    </button>
                    <button onClick={() => { addField(selectedValue.category, selectedValue.value); setSelectedValue(null); }} className="w-full flex items-center gap-2 p-2.5 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors border border-purple-100">
                      <Eye className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-xs font-medium text-purple-900">Add as Field</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`absolute ${showPreview ? "bottom-[533px]" : "bottom-0"} ease-in-out transition-all duration-700 inset-x-0 bg-white border-t border-gray-200 shadow-2xl z-30`} style={{ height: '88px' }}>
          <div className="h-full flex items-center justify-between px-4">

            <div className="flex items-center gap-4">
              <ChevronUp
                size={18}
                onClick={() => setShowPreview(!showPreview)}
                className={`cursor-pointer text-gray-400/50 ${showPreview ? 'rotate-180' : ''}`}
              />

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
                </div>
                <div className="flex-1 max-w-2xl">
                  <div className="text-sm font-semibold text-gray-900">{reportTitle}</div>
                  <div className="text-xs text-gray-500">JD • {estimatedRecordCount.toLocaleString()} records</div>
                  {buildNaturalLanguageQuery() && (
                    <div className="text-xs text-blue-700 mt-1 font-medium italic">
                      "{buildNaturalLanguageQuery()}"
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Export"><Download className="w-5 h-5 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} /></button>
              <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Schedule"><Calendar className="w-5 h-5 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} /></button>
              <button disabled={selections.length === 0} className={`p-4 rounded-full transition-all mx-2 ${selections.length > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`} title="Run Report">
                <Play className="w-6 h-6" strokeWidth={1.5} fill="currentColor" />
              </button>
              <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Save As"><Save className="w-5 h-5 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} /></button>
              <button onClick={() => setActivePanel('more')} className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="More Settings"><Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} /></button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setActivePanel('fields')} className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Fields">
                <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
                {selections.filter(s => s.type === 'field').length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{selections.filter(s => s.type === 'field').length}</div>
                )}
              </button>

              <button onClick={() => setActivePanel('filters')} className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Filters">
                <Filter className="w-4 h-4 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
                {selections.filter(s => s.type === 'filter').length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{selections.filter(s => s.type === 'filter').length}</div>
                )}
              </button>
            </div>
          </div>


          {/* Report VIEW Content */}
          <ReportViewComponent selections={selections} />
        </div>

        {activePanel && (
          <>
            <div className="absolute inset-0 bg-black bg-opacity-20 z-40" onClick={() => setActivePanel(null)} />

            <div className="absolute right-0 top-0 h-full w-[390px] bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col animate-slideInRight">
              <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{activePanel === 'fields' ? 'Fields Configuration' : activePanel === 'filters' ? 'Filters Builder' : 'More Options'}</h3>
                  <button onClick={() => setActivePanel(null)} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" strokeWidth={1.5} /></button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#F9FAFB' }}>
                {activePanel === 'fields' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Manage which fields appear in your report output. Drag to reorder.</p>
                    {selections.filter(s => s.type === 'field').length === 0 ? (
                      <div className="text-center py-8 text-gray-400"><Eye className="w-12 h-12 mx-auto mb-2 opacity-20" strokeWidth={1.5} /><p className="text-sm">No fields selected</p></div>
                    ) : (
                      <div className="space-y-2">
                        {selections.filter(s => s.type === 'field').map((sel) => (
                          <div key={sel.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200">
                            <div className="cursor-move text-gray-400">::</div>
                            <Eye className="w-4 h-4 text-purple-600 flex-shrink-0" strokeWidth={1.5} />
                            <div className="flex-1"><div className="text-sm font-semibold text-gray-900">{sel.category}</div><div className="text-xs text-gray-600">{sel.value}</div></div>
                            <button onClick={() => removeSelection(sel.id)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" strokeWidth={1.5} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activePanel === 'filters' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Build complex filter logic with AND/OR conditions.</p>
                    {selections.filter(s => s.type === 'filter').length === 0 ? (
                      <div className="text-center py-8 text-gray-400"><Filter className="w-12 h-12 mx-auto mb-2 opacity-20" strokeWidth={1.5} /><p className="text-sm">No filters applied</p></div>
                    ) : (
                      <div className="space-y-2">
                        {selections.filter(s => s.type === 'filter').map((sel) => (
                          <div key={sel.id} className="p-3 bg-white rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 flex-1">
                                <Filter className="w-4 h-4 text-blue-600 flex-shrink-0" strokeWidth={1.5} />
                                <div className="flex-1"><div className="text-sm font-semibold text-gray-900">{sel.category}</div><div className="text-xs text-gray-600">{sel.value}</div></div>
                              </div>
                              <button onClick={() => removeSelection(sel.id)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" strokeWidth={1.5} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activePanel === 'more' && (
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors text-left">
                      <Settings className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                      <div><div className="text-sm font-medium text-gray-900">Settings</div><div className="text-xs text-gray-500">Report name and configuration</div></div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors text-left">
                      <Download className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                      <div><div className="text-sm font-medium text-gray-900">Export</div><div className="text-xs text-gray-500">Download as CSV, Excel, or PDF</div></div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  if (stage === 'select') {
    const filteredFields = getFilteredFields();
    const TOP_VALUES_DISPLAY = 5;

    return (
      <ReportList onStateChange={(state: string) => {
        console.log(state);
        setStage(state);
      }} />
    )

    // return (
    //   <div className="max-h-[calc(100vh-115px)] overflow-y-auto bg-gray-50 flex flex-col">
    //     {/* {"[[SELECT]]"} */}
    //     <AnimationStyles />
    //     {toast && (
    //       <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slideIn">
    //         <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl"><span className="text-sm font-medium">{toast}</span></div>
    //       </div>
    //     )}

    //     <div className="bg-white border-b border-gray-200 px-8 py-3">
    //       <div className="flex items-center justify-between mb-3">
    //         <div className="flex items-center gap-4">
    //           <button onClick={() => setStage('welcome')} className="text-blue-500 hover:text-blue-600 text-sm">← Back</button>
    //           <h1 className="text-2xl font-light">New Report - Select</h1>
    //           <button onClick={() => setStage('browse')} className="ml-4 text-sm text-gray-500 hover:text-blue-500">Try Browse mode →</button>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="bg-white border-b border-gray-200 px-8 py-4">
    //       <div className="flex items-center gap-3">
    //         <button onClick={() => setShowLeftFilterPanel(!showLeftFilterPanel)} className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${showLeftFilterPanel || sectionFilters.length > 0 ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}>
    //           <Filter className="w-4 h-4" strokeWidth={1.5} />
    //           <span className="text-sm font-medium">Filter</span>
    //           {sectionFilters.length > 0 && <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">{sectionFilters.length}</span>}
    //         </button>

    //         <div className="relative flex-1 max-w-2xl">
    //           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
    //           <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search fields, categories, or values..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
    //           {searchTerm && (
    //             <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2">
    //               <X className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
    //             </button>
    //           )}
    //         </div>

    //         <button onClick={() => { setBulkSelectMode(!bulkSelectMode); setBulkSelected([]); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${bulkSelectMode ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
    //           {bulkSelectMode ? '✓ Bulk Select' : 'Bulk Select'}
    //         </button>
    //       </div>

    //       {bulkSelectMode && bulkSelected.length > 0 && (
    //         <div className="flex items-center gap-2 mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
    //           <span className="text-sm font-medium text-green-900">{bulkSelected.length} selected</span>
    //           <button onClick={() => applyBulkAction('field')} className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600">Add as Fields</button>
    //           <button onClick={() => applyBulkAction('filter')} className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">Add as Filters</button>
    //           <button onClick={() => setBulkSelected([])} className="ml-auto text-sm text-gray-600 hover:text-gray-800">Clear</button>
    //         </div>
    //       )}
    //     </div>

    //     <div className="flex-1 flex overflow-hidden">
    //       {showLeftFilterPanel && (
    //         <div className="w-64 bg-white border-r border-gray-200 overflow-auto">
    //           <div className="p-4">
    //             <div className="flex items-center justify-between mb-4">
    //               <h3 className="font-semibold text-gray-900">Sections</h3>
    //               <button onClick={() => setShowLeftFilterPanel(false)} className="text-gray-400 hover:text-gray-600">
    //                 <X className="w-4 h-4" strokeWidth={1.5} />
    //               </button>
    //             </div>

    //             <div className="space-y-1">
    //               {Object.keys(categories).map(section => {
    //                 const colors = sectionColors[section];
    //                 const SectionIcon = sectionIcons[section];
    //                 const isActive = sectionFilters.includes(section);

    //                 return (
    //                   <button key={section} onClick={() => toggleSectionFilter(section)} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? `${colors.bg} border-2 ${colors.border}` : 'hover:bg-gray-50 border-2 border-transparent'}`}>
    //                     <SectionIcon className={`w-5 h-5 ${colors?.icon}`} strokeWidth={1.5} />
    //                     <span className={`text-sm font-medium flex-1 text-left ${colors.header}`}>{section}</span>
    //                     {isActive && <Check className="w-4 h-4 text-blue-500" strokeWidth={2} />}
    //                   </button>
    //                 );
    //               })}
    //             </div>
    //           </div>
    //         </div>
    //       )}

    //       <div className="flex-1 overflow-auto p-8 pb-32">
    //         {filteredFields.length === 0 ? (
    //           <div className="text-center py-16">
    //             <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" strokeWidth={1} />
    //             <p className="text-gray-500 text-lg">No fields found</p>
    //           </div>
    //         ) : (
    //           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
    //             {filteredFields.map((field, idx) => {
    //               const values = sampleValues[field.category] || [];
    //               const colors = sectionColors[field.section];
    //               const CategoryIcon = categoryIcons[field.category] || Database;
    //               const displayValues = values.slice(0, TOP_VALUES_DISPLAY);
    //               const hasMore = values.length > TOP_VALUES_DISPLAY;
    //               const isBulkSelected = bulkSelected.includes(field.category);
    //               const totalCount = getCategoryTotal(field.category);

    //               return (
    //                 <div key={idx} className={`bg-white rounded-lg transition-all hover:shadow-lg ${isBulkSelected ? 'ring-2 ring-green-400' : ''}`}>
    //                   <div className="px-4 py-3 border-b border-gray-100">
    //                     <div className="flex items-start gap-3">
    //                       {bulkSelectMode && (
    //                         <input type="checkbox" checked={isBulkSelected} onChange={() => toggleBulkSelect(field.category)} className="rounded mt-1" />
    //                       )}
    //                       <div className="flex-1 min-w-0">
    //                         <button
    //                           onClick={(e) => {
    //                             e.stopPropagation();
    //                             setFieldsPanel({ category: field.category, section: field.section, values });
    //                             setFieldsPanelTab('fields');
    //                           }}
    //                           className="text-left w-full group"
    //                         >
    //                           <div className="flex items-center gap-2">
    //                             <CategoryIcon className={`w-4 h-4 ${colors?.icon} flex-shrink-0`} strokeWidth={1.5} />
    //                             <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{field.category}</h4>
    //                           </div>
    //                           <p className="text-xs text-gray-500 mt-1">{values.length} values • {totalCount.toLocaleString()} records</p>
    //                         </button>
    //                       </div>
    //                       {!bulkSelectMode && (
    //                         <button onClick={() => { addSelection(field.category, 'All Values', 'field'); showToast(`${field.category} added`); }} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0" title="Add as field">
    //                           <Plus className="w-4 h-4 text-gray-600" strokeWidth={2} />
    //                         </button>
    //                       )}
    //                     </div>
    //                   </div>

    //                   <div className="p-4">
    //                     <div className="space-y-2">
    //                       {displayValues.map((value, vIdx) => {
    //                         const count = getValueCount(field.category, value);
    //                         const percentage = ((count / totalCount) * 100).toFixed(1);

    //                         return (
    //                           <div key={vIdx} className="group">
    //                             <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
    //                               <button
    //                                 onClick={(e) => {
    //                                   e.stopPropagation();
    //                                   setFieldsPanel({ category: field.category, section: field.section, values });
    //                                   setFieldsPanelTab('values');
    //                                 }}
    //                                 className="flex-1 text-left min-w-0"
    //                               >
    //                                 <div className="text-sm text-gray-900 hover:text-blue-600 transition-colors truncate">{value}</div>
    //                                 <div className="flex items-center gap-2 mt-1">
    //                                   <div className="text-xs font-medium text-gray-600">{count.toLocaleString()}</div>
    //                                   <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
    //                                     <div className={`h-full ${colors.bg.replace('bg-', 'bg-').replace('-50', '-400')}`} style={{ width: `${percentage}%` }} />
    //                                   </div>
    //                                   <div className="text-xs text-gray-500">{percentage}%</div>
    //                                 </div>
    //                               </button>
    //                               {!bulkSelectMode && (
    //                                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
    //                                   <button onClick={() => { addSelection(field.category, value, 'filter'); showToast(`Filter: ${value}`); }} className="p-1.5 hover:bg-blue-50 rounded transition-colors flex-shrink-0" title="Add as filter">
    //                                     <Filter className="w-3 h-3 text-blue-600" strokeWidth={2} />
    //                                   </button>
    //                                   <button onClick={() => { addSelection(field.category, value, 'field'); showToast(`Field: ${field.category}`); }} className="p-1.5 hover:bg-purple-50 rounded transition-colors flex-shrink-0" title="Add as field">
    //                                     <Eye className="w-3 h-3 text-purple-600" strokeWidth={2} />
    //                                   </button>
    //                                 </div>
    //                               )}
    //                             </div>
    //                           </div>
    //                         );
    //                       })}

    //                       {hasMore && (
    //                         <button
    //                           onClick={(e) => {
    //                             e.stopPropagation();
    //                             setFieldsPanel({ category: field.category, section: field.section, values });
    //                             setFieldsPanelTab('values');
    //                           }}
    //                           className="w-full text-center py-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition-colors"
    //                         >
    //                           View all {values.length} options →
    //                         </button>
    //                       )}
    //                     </div>
    //                   </div>
    //                 </div>
    //               );
    //             })}
    //           </div>
    //         )}
    //       </div>
    //     </div>

    //     {fieldsPanel && (
    //       <>
    //         <div className="absolute inset-0 bg-black bg-opacity-20 z-40" onClick={() => setFieldsPanel(null)} />

    //         <div className="absolute right-0 top-0 h-full w-[480px] bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col animate-slideInRight">
    //           <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
    //             <div className="flex items-center justify-between mb-4">
    //               <div className="flex items-center gap-2">
    //                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${sectionColors[fieldsPanel.section]?.bg || 'bg-gray-100'}`}>
    //                   {(() => {
    //                     const Icon = categoryIcons[fieldsPanel.category] || Database;
    //                     return <Icon className={`w-4 h-4 ${sectionColors[fieldsPanel.section]?.icon || 'text-gray-600'}`} strokeWidth={1.5} />;
    //                   })()}
    //                 </div>
    //                 <div>
    //                   <h3 className="text-lg font-semibold text-gray-900">{fieldsPanel.category}</h3>
    //                   <p className="text-xs text-gray-500">{fieldsPanel.section}</p>
    //                 </div>
    //               </div>
    //               <button onClick={() => setFieldsPanel(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
    //                 <X className="w-5 h-5" strokeWidth={1.5} />
    //               </button>
    //             </div>

    //             <div className="flex gap-1 border-b border-gray-200 mb-4">
    //               <button
    //                 onClick={() => setFieldsPanelTab('fields')}
    //                 className={`px-4 py-2 text-sm font-medium transition-colors ${fieldsPanelTab === 'fields' ? 'text-blue-600 border-b-2 border-blue-600 -mb-px' : 'text-gray-600 hover:text-gray-900'}`}
    //               >
    //                 Fields
    //               </button>
    //               <button
    //                 onClick={() => setFieldsPanelTab('values')}
    //                 className={`px-4 py-2 text-sm font-medium transition-colors ${fieldsPanelTab === 'values' ? 'text-blue-600 border-b-2 border-blue-600 -mb-px' : 'text-gray-600 hover:text-gray-900'}`}
    //               >
    //                 Values
    //               </button>
    //             </div>

    //             <div className="relative">
    //               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
    //               <input type="text" placeholder={fieldsPanelTab === 'fields' ? "Search fields..." : "Search values..."} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
    //             </div>
    //           </div>

    //           <div className="flex-1 overflow-auto p-6 bg-gray-50">
    //             {fieldsPanelTab === 'fields' ? (
    //               <div className="space-y-3">
    //                 {(categoryFields[fieldsPanel.category] || defaultFields).map((fieldName, idx) => (
    //                   <div key={idx} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors p-3">
    //                     <div className="flex items-center gap-2">
    //                       <button className="cursor-move text-gray-400 hover:text-gray-600" title="Drag to reorder">
    //                         <span className="text-lg">⋮⋮</span>
    //                       </button>
    //                       <div className="flex-1 min-w-0">
    //                         <div className="font-medium text-sm text-gray-900 truncate">{fieldName}</div>
    //                       </div>
    //                       <button onClick={() => addSelection(fieldsPanel.category, fieldName, 'field')} className="p-1.5 rounded transition-colors bg-purple-50 text-purple-600 hover:bg-purple-100" title="Show field">
    //                         <Eye className="w-4 h-4" strokeWidth={1.5} />
    //                       </button>
    //                       <button onClick={() => addSelection(fieldsPanel.category, fieldName, 'filter')} className="p-1.5 rounded transition-colors text-gray-400 hover:bg-gray-100" title="Add filter">
    //                         <Filter className="w-4 h-4" strokeWidth={1.5} />
    //                       </button>
    //                     </div>
    //                   </div>
    //                 ))}
    //               </div>
    //             ) : (
    //               <div className="space-y-2">
    //                 {(fieldsPanel.values || []).map((value, idx) => {
    //                   const count = getValueCount(fieldsPanel.category, value);
    //                   const totalCount = getCategoryTotal(fieldsPanel.category);
    //                   const percentage = ((count / totalCount) * 100).toFixed(1);

    //                   return (
    //                     <div key={idx} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors p-3">
    //                       <div className="flex items-center gap-3">
    //                         <div className="flex-1 min-w-0">
    //                           <div className="font-medium text-sm text-gray-900 truncate">{value}</div>
    //                           <div className="flex items-center gap-2 mt-1">
    //                             <div className="text-xs font-medium text-gray-600">{count.toLocaleString()}</div>
    //                             <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
    //                               <div className={`h-full ${sectionColors[fieldsPanel.section]?.bg.replace('-50', '-400') || 'bg-blue-400'}`} style={{ width: `${percentage}%` }} />
    //                             </div>
    //                             <div className="text-xs text-gray-500">{percentage}%</div>
    //                           </div>
    //                         </div>
    //                         <div className="flex gap-1 flex-shrink-0">
    //                           <button onClick={() => { addSelection(fieldsPanel.category, value, 'filter'); showToast(`Filter: ${value}`); }} className="p-1.5 hover:bg-blue-50 rounded transition-colors" title="Add as filter">
    //                             <Filter className="w-3.5 h-3.5 text-blue-600" strokeWidth={2} />
    //                           </button>
    //                           <button onClick={() => { addSelection(fieldsPanel.category, value, 'field'); showToast(`Field: ${fieldsPanel.category}`); }} className="p-1.5 hover:bg-purple-50 rounded transition-colors" title="Add as field">
    //                             <Eye className="w-3.5 h-3.5 text-purple-600" strokeWidth={2} />
    //                           </button>
    //                         </div>
    //                       </div>
    //                     </div>
    //                   );
    //                 })}
    //               </div>
    //             )}
    //           </div>

    //           <div className="p-4 border-t border-gray-200 bg-white flex gap-2">
    //             <button onClick={() => setFieldsPanel(null)} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">Done</button>
    //           </div>
    //         </div>
    //       </>
    //     )}

    //     <div className={`absolute ${showPreview ? "bottom-[533px]" : "bottom-0"} ease-in-out transition-all duration-700 inset-x-0 bg-white border-t border-gray-200 shadow-2xl z-30`} style={{ height: '88px' }}>
    //       <div className="h-full flex items-center justify-between px-4">

    //         <div className="flex items-center gap-4">
    //           <ChevronUp
    //             size={18}
    //             onClick={() => setShowPreview(!showPreview)}
    //             className={`cursor-pointer text-gray-400/50 ${showPreview ? 'rotate-180' : ''}`}
    //           />

    //           <div className="flex items-center gap-3">
    //             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
    //               <Users className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
    //             </div>
    //             <div>
    //               <div className="text-sm font-semibold text-gray-900">{reportTitle}</div>
    //               <div className="text-xs text-gray-500">JD • {calculateFilterImpact().toLocaleString()} records</div>
    //             </div>
    //           </div>
    //         </div>

    //         <div className="flex items-center gap-2">
    //           <button disabled={selections.length === 0} className={`p-4 rounded-full transition-all mx-2 ${selections.length > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`} title="Run Report">
    //             <Play className="w-6 h-6" strokeWidth={1.5} fill="currentColor" />
    //           </button>
    //         </div>

    //         <div className="flex items-center gap-2">
    //           <button onClick={() => setActivePanel('fields')} className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Fields">
    //             <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
    //             {selections.filter(s => s.type === 'field').length > 0 && (
    //               <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{selections.filter(s => s.type === 'field').length}</div>
    //             )}
    //           </button>

    //           <button onClick={() => setActivePanel('filters')} className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Filters">
    //             <Filter className="w-4 h-4 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
    //             {selections.filter(s => s.type === 'filter').length > 0 && (
    //               <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{selections.filter(s => s.type === 'filter').length}</div>
    //             )}
    //           </button>
    //         </div>
    //       </div>


    //       {/* Report VIEW Content */}
    //       <ReportViewComponent selections={selections} />
    //     </div>

    //     {activePanel && (
    //       <>
    //         <div className="absolute inset-0 bg-black bg-opacity-20 z-40" onClick={() => setActivePanel(null)} />

    //         <div className="absolute right-0 top-0 h-full w-[390px] bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col animate-slideInRight">
    //           <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
    //             <div className="flex items-center justify-between">
    //               <h3 className="text-lg font-semibold text-gray-900">{activePanel === 'fields' ? 'Fields Configuration' : 'Filters Builder'}</h3>
    //               <button onClick={() => setActivePanel(null)} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" strokeWidth={1.5} /></button>
    //             </div>
    //           </div>

    //           <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#F9FAFB' }}>
    //             {activePanel === 'fields' && (
    //               <div className="space-y-4">
    //                 <p className="text-sm text-gray-600">Manage which fields appear in your report output.</p>
    //                 {selections.filter(s => s.type === 'field').length === 0 ? (
    //                   <div className="text-center py-8 text-gray-400"><Eye className="w-12 h-12 mx-auto mb-2 opacity-20" strokeWidth={1.5} /><p className="text-sm">No fields selected</p></div>
    //                 ) : (
    //                   <div className="space-y-2">
    //                     {selections.filter(s => s.type === 'field').map((sel) => (
    //                       <div key={sel.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200">
    //                         <Eye className="w-4 h-4 text-purple-600 flex-shrink-0" strokeWidth={1.5} />
    //                         <div className="flex-1"><div className="text-sm font-semibold text-gray-900">{sel.category}</div><div className="text-xs text-gray-600">{sel.value}</div></div>
    //                         <button onClick={() => removeSelection(sel.id)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" strokeWidth={1.5} /></button>
    //                       </div>
    //                     ))}
    //                   </div>
    //                 )}
    //               </div>
    //             )}

    //             {activePanel === 'filters' && (
    //               <div className="space-y-4">
    //                 <p className="text-sm text-gray-600">Build complex filter logic.</p>
    //                 {selections.filter(s => s.type === 'filter').length === 0 ? (
    //                   <div className="text-center py-8 text-gray-400"><Filter className="w-12 h-12 mx-auto mb-2 opacity-20" strokeWidth={1.5} /><p className="text-sm">No filters applied</p></div>
    //                 ) : (
    //                   <div className="space-y-2">
    //                     {selections.filter(s => s.type === 'filter').map((sel) => (
    //                       <div key={sel.id} className="p-3 bg-white rounded-lg border border-blue-200">
    //                         <div className="flex items-center justify-between">
    //                           <div className="flex items-center gap-2 flex-1">
    //                             <Filter className="w-4 h-4 text-blue-600 flex-shrink-0" strokeWidth={1.5} />
    //                             <div className="flex-1"><div className="text-sm font-semibold text-gray-900">{sel.category}</div><div className="text-xs text-gray-600">{sel.value}</div></div>
    //                           </div>
    //                           <button onClick={() => removeSelection(sel.id)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" strokeWidth={1.5} /></button>
    //                         </div>
    //                       </div>
    //                     ))}
    //                   </div>
    //                 )}
    //               </div>
    //             )}
    //           </div>
    //         </div>
    //       </>
    //     )}
    //   </div>
    // );
  }

  return null;
};


const mapActionToProps = {
  updateDemoStateAction: updateDemoState
};

const mapStateToProps = ({ demo }) => {
  const { isPhraseActive } = demo;
  return { isPhraseActive };
};

export default connect(mapStateToProps, mapActionToProps)(ReportBuilder);