/**
 * USBSearch Component
 *
 * Unified search interface with advanced visualizations and filtering capabilities.
 * Provides an animated, interactive search experience with multiple visualization
 * modes including bar charts, line graphs, and pie charts.
 *
 * Features:
 * - Advanced search filters and operators
 * - Multiple visualization modes (bar, line, pie charts)
 * - Animated search experience with smooth transitions
 * - Export functionality for search results
 * - Grid and list view modes
 * - Real-time data filtering
 *
 * @component
 * @returns {React.Component} USBSearch component
 */

import React, { useState, useEffect } from 'react';
import { Plus, X, Eye, EyeOff, Search, ChevronRight, Settings, Play, Download, Calendar, Save, Grid3x3, List, Filter, Users, Mail, MapPin, Database, Crown, DollarSign, Share2 } from 'lucide-react';

// Add keyframe animations as a style tag
const AnimationStyles = () => (
  <style>{`
    @keyframes barRise {
      0% { opacity: 0; transform: translateY(12px) scaleY(0.6); }
      60% { opacity: 1; transform: translateY(-4px) scaleY(1.02); }
      100% { opacity: 0.85; transform: translateY(0) scaleY(1); }
    }
    
    @keyframes drawLine {
      from { stroke-dashoffset: 280; }
      to { stroke-dashoffset: 0; }
    }
    
    @keyframes dotAppear {
      0% { opacity: 0; transform: translateY(6px); }
      60% { opacity: 1; transform: translateY(-2px); }
      100% { opacity: 0.9; transform: translateY(0); }
    }
    
    @keyframes slicePop {
      0% { opacity: 0; transform: scale(0.8) rotate(-6deg); }
      60% { opacity: 1; transform: scale(1.05) rotate(2deg); }
      100% { opacity: 0.85; transform: scale(1) rotate(0deg); }
    }
    
    @keyframes abstractFadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes abstractFadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(20px); }
    }
    
    @keyframes dotPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }
    
    @keyframes badgePulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes slideInDown {
      from { 
        opacity: 0; 
        transform: translate(-50%, -20px);
      }
      to { 
        opacity: 1; 
        transform: translate(-50%, 0);
      }
    }
    
    .animate-slideIn {
      animation: slideInDown 300ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    
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
    
    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      position: absolute;
      top: 6px;
      right: 6px;
      animation: dotPulse 2s infinite;
    }
    
    .rotate-90 {
      transform: rotate(90deg);
    }
    
    /* Micro-interaction classes */
    .btn-hover {
      transition: all 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
      position: relative;
    }
    
    .btn-hover:hover:not(:disabled) {
      transform: translateY(-2px) scale(1.05);
    }
    
    .btn-hover:active:not(:disabled) {
      transform: translateY(0) scale(0.95);
    }
    
    .btn-hover:hover:not(:disabled) svg {
      color: #2563EB;
    }
    
    .tooltip-container {
      position: relative;
    }
    
    .btn-primary-hover {
      transition: all 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    
    .btn-primary-hover:hover:not(:disabled) {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
    }
    
    .btn-primary-hover:active:not(:disabled) {
      transform: translateY(0) scale(0.95);
    }
    
    .queue-badge {
      transition: transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    
    .btn-hover:hover .queue-badge {
      animation: badgePulse 600ms ease-in-out;
    }
    
    /* Welcome card hover effects */
    .welcome-card {
      transition: all 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    
    .welcome-card:hover:not(:disabled) {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      border-color: #3B82F6;
    }
    
    .welcome-card:active:not(:disabled) {
      transform: translateY(-2px) scale(0.98);
    }
    
    .welcome-card:hover:not(:disabled) svg {
      color: #3B82F6;
    }
    
    .opacity-3 {
      opacity: 0.03;
    }
    
    .tooltip {
      position: absolute;
      bottom: calc(100% + 12px);
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 150ms ease;
      z-index: 10000;
    }
    
    .tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-top-color: rgba(0, 0, 0, 0.9);
    }
    
    .tooltip-visible {
      opacity: 1;
    }
  `}</style>
);

const CATEGORIES = {
  'Starting Data': ['Current Members', 'New Members', 'Lapsed Members', 'Contacts', 'Other'],
  'Location': ['Proximity', 'In City', 'In Region', 'In Country'],
  'Membership': ['Membership Type', 'Code of Ethics', 'Primary Reason for Joining', 'Reason Not Full Member/Affiliate'],
  'Demographics': ['Career Stage', 'Occupation', 'Workplace Setting', 'Education Received', 'Education Current', 'Area of Interest'],
  'Commerce': ['Membership Benefits', 'Membership Discounts', 'Donation', 'Invoices', 'Payments'],
  'Communities': ['Committees', 'Events', 'Sections', 'Regulatory Body', 'Professional Associations'],
  'Communications': ['Journals', 'Psygnature', 'CPA National Convention', 'CPA Member Benefit', 'Psychology in the News', 'Psynopsis Magazine', 'Volunteer Availability']
};

const SAMPLE_VALUES = {
  'Membership Type': ['Fellow', 'Life Fellow', 'Life Member', 'Member', 'International Affiliate', 'Member Early Career Year 1', 'Member Early Career Year 2', 'Section Associate'],
  'Career Stage': ['Student', 'Early Career Year 1', 'Early Career Year 2', 'Early Career', 'Mid to Late Career', 'Late Career'],
  'In City': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
  'In Region': ['Ontario', 'British Columbia', 'Quebec', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador', 'Prince Edward Island'],
  'In Country': ['Canada', 'United States', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'China', 'India', 'Brazil'],
  'Current Members': ['All Current Members'],
  'New Members': ['Members joined in last 30 days', 'Members joined in last 90 days', 'Members joined this year'],
  'Lapsed Members': ['Lapsed in last 6 months', 'Lapsed in last year', 'Lapsed more than 1 year ago'],
  'Contacts': ['All Contacts', 'Prospects', 'Past Members', 'Event Attendees'],
  'Occupation': ['Researcher', 'Practitioner', 'Educator/Supervisor', 'Consultant', 'Advocacy', 'Administrator', 'Student', 'Other'],
  'Workplace Setting': ['Adjunct Faculty', 'Assistant Professor', 'Associate Professor', 'Full Professor', 'Lecturer/Instructor', 'Visiting Faculty', 'Teaching Assistant', 'Research Assistant', 'Does not apply'],
  'Education Received': ['Bachelors', 'Masters', 'Doctorate', 'Post-Doctorate', 'N/A (do not yet have a degree)'],
  'Education Current': ['Bachelors', 'Masters', 'Doctorate', 'Post Doc', 'N/A - Finished schooling'],
  'Area of interest': ['Addiction', 'Brain & Cognitive Science', 'Clinical', 'Clinical Neuropsychology', 'Community', 'Counselling', 'Criminal Justice', 'Developmental', 'Environmental', 'Family', 'Health', 'History/Philosophy', 'Industrial/Organizational'],
  'Membership Benefits': ['Conference Discount', 'Journal Access', 'Networking Events', 'Webinar Series', 'Mentorship Program', 'Career Resources', 'Insurance Discount'],
  'Membership Discounts': ['Early Bird Registration', 'Group Discount', 'Student Discount', 'Senior Discount', 'Multi-Year Discount'],
  'Donation': ['$1-$99', '$100-$499', '$500-$999', '$1000-$4999', '$5000+', 'No donations'],
  'Invoices': ['Paid in Full', 'Partially Paid', 'Outstanding', 'Overdue', 'Cancelled'],
  'Payments': ['Credit Card', 'Bank Transfer', 'Check', 'PayPal', 'Wire Transfer'],
  'Committees': ['Ethics Committee', 'Program Committee', 'Finance Committee', 'Membership Committee', 'Communications Committee', 'Governance Committee'],
  'Events': ['Annual Conference 2024', 'Regional Symposium', 'Workshop Series', 'Webinar Program', 'Networking Reception', 'Training Seminar'],
  'Sections': ['Students in Psychology', 'Clinical Psychology', 'Community Psychology', 'Counselling Psychology', 'Developmental Psychology', 'Health Psychology', 'Industrial and Organizational Psychology', 'Social and Personality Psychology'],
  'Regulatory Body': ['Registered to practice in Canada by a regulatory body of psychology', 'Registered to practice in Canada, with a regulatory body, but as a non-practicing psychologist', 'Registered to practice, but not with a regulatory body of psychology', 'Not registered'],
  'Professional Associations': ['Canadian Psychological Association', 'American Psychological Association', 'British Psychological Society', 'Australian Psychological Society', 'International Association of Applied Psychology'],
  'Journals': ['Print Only', 'Electronic Only', 'Print and Electronic', 'None'],
  'Psygnature': ['Subscribed', 'Unsubscribed'],
  'CPA National Convention': ['Attending', 'Not Attending', 'Maybe Attending'],
  'CPA Member Benefit': ['Opted In', 'Opted Out'],
  'Psychology in the News': ['Subscribed', 'Unsubscribed'],
  'Psynopsis Magazine': ['Opted-in', 'Opted-out'],
  'Volunteer Availability': ['Available', 'Not Available', 'Conditionally Available'],
  'Code of Ethics': ['Signed', 'Not Signed', 'Pending Review'],
  'Primary reason for joining': ['Professional Development', 'Networking', 'Publications', 'Advocacy', 'Research Access', 'Continuing Education', 'Career Advancement'],
  'Reason Not Full Member/Affiliate': ['Cost', 'Time Constraints', 'Geographic Distance', 'Eligibility Requirements', 'Other']
};

const TEMPLATES = [
  { name: 'New Members This Month', icon: '👥', desc: 'Recent member additions' },
  { name: 'Lapsed Member Analysis', icon: '📊', desc: 'Members who left' },
  { name: 'Section Membership Overview', icon: '📍', desc: 'Distribution by sections' }
];

const SECTION_ICONS = {
  'Starting Data': 'Database',
  'Location': 'MapPin',
  'Membership': 'Crown',
  'Demographics': 'Users',
  'Commerce': 'DollarSign',
  'Communities': 'Share2',
  'Communications': 'Mail'
};

const SECTION_COLORS = {
  'Starting Data': {
    header: 'text-blue-700',
    icon: 'text-blue-400',
    bg: 'bg-blue-50'
  },
  'Location': {
    header: 'text-green-700',
    icon: 'text-green-400',
    bg: 'bg-green-50'
  },
  'Membership': {
    header: 'text-purple-700',
    icon: 'text-purple-400',
    bg: 'bg-purple-50'
  },
  'Demographics': {
    header: 'text-orange-700',
    icon: 'text-orange-400',
    bg: 'bg-orange-50'
  },
  'Commerce': {
    header: 'text-emerald-700',
    icon: 'text-emerald-400',
    bg: 'bg-emerald-50'
  },
  'Communities': {
    header: 'text-pink-700',
    icon: 'text-pink-400',
    bg: 'bg-pink-50'
  },
  'Communications': {
    header: 'text-indigo-700',
    icon: 'text-indigo-400',
    bg: 'bg-indigo-50'
  }
};

const getSectionIcon = (section) => {
  const iconName = SECTION_ICONS[section];
  const iconMap = {
    'Database': Database,
    'MapPin': MapPin,
    'Crown': Crown,
    'Users': Users,
    'DollarSign': DollarSign,
    'Share2': Share2,
    'Mail': Mail
  };
  return iconMap[iconName] || Filter;
};

const getSectionColors = (section) => {
  return SECTION_COLORS[section] || {
    header: 'text-gray-700',
    icon: 'text-gray-400',
    bg: 'bg-gray-50'
  };
};

const ReportBuilder = () => {
  const [stage, setStage] = useState('welcome'); // welcome, browse, select
  const [showAbstract, setShowAbstract] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selections, setSelections] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bottomPanelExpanded, setBottomPanelExpanded] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [sortEnabled, setSortEnabled] = useState(false);
  const [groupEnabled, setGroupEnabled] = useState(false);
  const [vizEnabled, setVizEnabled] = useState(false);
  const [toast, setToast] = useState(null);
  const [showFieldPanel, setShowFieldPanel] = useState(true);

  useEffect(() => {
    if (stage === 'welcome') {
      // Start abstract animation immediately
      setShowAbstract(true);
      // After intro duration, fade out abstract (1600ms)
      setTimeout(() => setShowAbstract(false), 1600);
      // Slide panel up with 100ms overlap (1700ms)
      setTimeout(() => setShowPanel(true), 1700);
    }
  }, [stage]);

  useEffect(() => {
    if (selections.length > 0 && !bottomPanelExpanded) {
      setBottomPanelExpanded(true);
    }
  }, [selections]);

  const addSelection = (category, value, type = 'filter') => {
    const newSelection = {
      id: Date.now(),
      category,
      value,
      type, // 'filter' or 'field'
      connector: selections.length > 0 ? 'AND' : null
    };
    setSelections([...selections, newSelection]);
  };

  const removeSelection = (id) => {
    setSelections(selections.filter(s => s.id !== id));
  };

  const toggleConnector = (id) => {
    setSelections(selections.map(s => 
      s.id === id ? { ...s, connector: s.connector === 'AND' ? 'OR' : 'AND' } : s
    ));
  };

  const generateNaturalLanguage = () => {
    if (selections.length === 0) return 'No filters applied';
    
    const filters = selections.filter(s => s.type === 'filter');
    if (filters.length === 0) return 'Showing all records';
    
    let query = 'Show ';
    filters.forEach((s, i) => {
      if (i > 0 && s.connector) {
        query += ` ${s.connector} `;
      }
      query += `${s.value}`;
    });
    
    return query;
  };
  
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };
  
  const handleCategoryClick = (category) => {
    const values = SAMPLE_VALUES[category];
    
    // Auto-select if only one value
    if (values && values.length === 1) {
      addSelection(category, values[0], 'filter');
      showToast(`${category} added`);
      return;
    }
    
    // Otherwise show the panel
    setSelectedCategory(category);
  };

  const getFilteredFields = () => {
    const allFields = Object.entries(CATEGORIES).flatMap(([section, categories]) =>
      categories.map(cat => ({ section, category: cat }))
    );
    
    if (!searchTerm) return allFields;
    
    return allFields.filter(f => 
      f.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.section.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Welcome Stage
  if (stage === 'welcome') {
    return (
      <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
        <AnimationStyles />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <h1 className="text-5xl font-light mb-12 text-gray-900">New Report</h1>
          <p className="text-xl text-gray-600 mb-16 text-center max-w-2xl">
            Browse, select or use the phrase experience to tailor your results.
          </p>
          
          <div className="grid grid-cols-3 gap-8 mb-12 max-w-4xl w-full">
            <button
              onClick={() => setStage('browse')}
              className="group welcome-card p-8 rounded-2xl border border-gray-200 hover:border-blue-500 bg-white"
            >
              <Grid3x3 className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" strokeWidth={1.5} />
              <h3 className="text-xl font-medium mb-2 text-gray-900">Browse</h3>
              <p className="text-sm text-gray-500">Categories to select</p>
            </button>
            
            <button
              onClick={() => setStage('select')}
              className="group welcome-card p-8 rounded-2xl border border-gray-200 hover:border-blue-500 bg-white"
            >
              <List className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" strokeWidth={1.5} />
              <h3 className="text-xl font-medium mb-2 text-gray-900">Select</h3>
              <p className="text-sm text-gray-500">From a list of fields</p>
            </button>
            
            <button
              className="group p-8 rounded-2xl border border-gray-200 bg-white opacity-60 cursor-not-allowed"
              disabled
            >
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" strokeWidth={1.5} />
              <h3 className="text-xl font-medium mb-2 text-gray-900">Phrase</h3>
              <p className="text-sm text-gray-500">Based on terms to use</p>
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-blue-500 hover:text-blue-600 text-sm mr-6 transition-all duration-200 hover:underline"
            >
              Load a template
            </button>
            <button className="text-blue-500 hover:text-blue-600 text-sm mr-6 transition-all duration-200 hover:underline">
              Open existing report
            </button>
            <button className="text-blue-500 hover:text-blue-600 text-sm transition-all duration-200 hover:underline">
              Start from scratch
            </button>
          </div>

          {showTemplates && (
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-3xl">
              {TEMPLATES.map((template, i) => (
                <button
                  key={i}
                  className="p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow transition-all duration-200 text-left transform hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                >
                  <div className="text-2xl mb-2">{template.icon}</div>
                  <div className="font-medium text-sm mb-1">{template.name}</div>
                  <div className="text-xs text-gray-500">{template.desc}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Abstract Chart Animation - Positioned at Bottom */}
        <div 
          className={`fixed left-0 right-0 bottom-32 flex justify-center items-end pointer-events-none z-10 ${
            showAbstract ? 'abstract-container-in' : 'abstract-container-out'
          }`}
          style={{ 
            opacity: showAbstract ? 1 : 0,
            transition: showAbstract ? 'none' : 'opacity 300ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        >
          <svg 
            width="700" 
            height="200" 
            viewBox="0 0 700 200" 
            className="drop-shadow-lg"
          >
            {/* Bar Chart */}
            <g transform="translate(80, 0)">
              <rect 
                x="0" y="100" width="32" height="80" rx="6"
                fill="#60A5FA" 
                opacity="0"
                className={showAbstract ? 'bar-animate' : ''}
              />
              <rect 
                x="45" y="70" width="32" height="110" rx="6"
                fill="#34D399"
                opacity="0"
                className={showAbstract ? 'bar-animate bar-animate-delay-1' : ''}
              />
              <rect 
                x="90" y="50" width="32" height="130" rx="6"
                fill="#FBBF24"
                opacity="0"
                className={showAbstract ? 'bar-animate bar-animate-delay-2' : ''}
              />
            </g>

            {/* Line Chart */}
            <g transform="translate(230, 0)">
              <polyline
                points="0,130 60,100 120,120 180,60 240,90"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="280"
                strokeDashoffset="280"
                className={showAbstract ? 'line-animate' : ''}
              />
              <circle cx="0" cy="130" r="5" fill="#60A5FA" opacity="0" className={showAbstract ? 'dot-animate' : ''} />
              <circle cx="60" cy="100" r="5" fill="#60A5FA" opacity="0" className={showAbstract ? 'dot-animate dot-animate-delay-1' : ''} />
              <circle cx="120" cy="120" r="5" fill="#60A5FA" opacity="0" className={showAbstract ? 'dot-animate dot-animate-delay-2' : ''} />
              <circle cx="180" cy="60" r="5" fill="#60A5FA" opacity="0" className={showAbstract ? 'dot-animate dot-animate-delay-3' : ''} />
              <circle cx="240" cy="90" r="5" fill="#60A5FA" opacity="0" className={showAbstract ? 'dot-animate dot-animate-delay-4' : ''} />
            </g>

            {/* Pie Chart */}
            <g transform="translate(580, 110)">
              {/* Slice 1 - 40% */}
              <path
                d="M 0,0 L 35,0 A 35,35 0 0,1 -17.5,30.3 Z"
                fill="#60A5FA"
                opacity="0"
                className={showAbstract ? 'slice-animate' : ''}
              />
              {/* Slice 2 - 35% */}
              <path
                d="M 0,0 L -17.5,30.3 A 35,35 0 0,1 -35,0 Z"
                fill="#34D399"
                opacity="0"
                className={showAbstract ? 'slice-animate slice-animate-delay-1' : ''}
              />
              {/* Slice 3 - 25% */}
              <path
                d="M 0,0 L -35,0 A 35,35 0 0,1 17.5,-30.3 Z"
                fill="#FBBF24"
                opacity="0"
                className={showAbstract ? 'slice-animate slice-animate-delay-2' : ''}
              />
              {/* Slice 4 - complete circle */}
              <path
                d="M 0,0 L 17.5,-30.3 A 35,35 0 0,1 35,0 Z"
                fill="#F87171"
                opacity="0"
                className={showAbstract ? 'slice-animate slice-animate-delay-2' : ''}
              />
            </g>
          </svg>
        </div>

        {/* Bottom Panel Slide In */}
        <div
          className={`fixed bottom-0 left-0 right-0 border-t border-gray-200 shadow-2xl transition-transform duration-700 ease-out z-20 ${
            showPanel ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{ 
            height: '88px',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-8">
            {/* Left: Report Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Filter className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">New Report</div>
                <div className="text-xs text-gray-600">{selections.length} field{selections.length !== 1 ? 's' : ''} selected</div>
              </div>
            </div>
            
            {/* Center: Controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSortEnabled(!sortEnabled)}
                data-tooltip="Sort fields"
                className="relative p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 btn-hover"
              >
                <Settings className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                {sortEnabled && <div className="status-dot bg-green-500" />}
              </button>
              
              <button 
                onClick={() => setGroupEnabled(!groupEnabled)}
                data-tooltip="Group results"
                className="relative p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 btn-hover"
              >
                <Filter className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                {groupEnabled && <div className="status-dot bg-orange-500" />}
              </button>
              
              <button 
                onClick={() => setVizEnabled(!vizEnabled)}
                data-tooltip="Add visualization"
                className="relative p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 btn-hover"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                {vizEnabled && <div className="status-dot bg-purple-500" />}
              </button>
              
              <button 
                onClick={() => setShowPreview(!showPreview)}
                data-tooltip={selections.length > 0 ? "Preview results" : ""}
                disabled={selections.length === 0}
                className={`relative p-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white btn-primary-hover disabled:opacity-50 disabled:cursor-not-allowed ${
                  showPreview ? 'rotate-90' : ''
                }`}
              >
                <Play className="w-5 h-5 transition-transform duration-300" strokeWidth={1.5} />
              </button>
            </div>
            
            {/* Right: Queue & Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowQueue(!showQueue)}
                data-tooltip="View all fields & filters"
                className="relative p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 btn-hover"
              >
                <List className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                {selections.length > 0 && (
                  <div className="queue-badge absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {selections.length}
                  </div>
                )}
              </button>
              
              <button 
                disabled={selections.length === 0}
                data-tooltip={selections.length > 0 ? "Execute report (⌘↵)" : ""}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium btn-primary-hover ${
                  selections.length > 0
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Run Report
              </button>
            </div>
          </div>
        </div>
        
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slideIn">
            <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">{toast}</span>
            </div>
          </div>
        )}
        
        {/* Queue/Fields Panel */}
        {showQueue && (
          <div className="fixed bottom-28 right-8 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Report Fields & Filters</h3>
              <button
                onClick={() => setShowQueue(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {selections.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <List className="w-12 h-12 mx-auto mb-2 opacity-20" strokeWidth={1.5} />
                  <p className="text-sm">No fields or filters selected yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selections.map((sel, i) => (
                    <div key={sel.id}>
                      {sel.connector && i > 0 && (
                        <div className="text-center my-2">
                          <button
                            onClick={() => toggleConnector(sel.id)}
                            className="px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          >
                            {sel.connector}
                          </button>
                        </div>
                      )}
                      <div className={`p-3 rounded-lg border ${
                        sel.type === 'field' 
                          ? 'bg-purple-50 border-purple-200' 
                          : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2 flex-1">
                            {sel.type === 'field' ? (
                              <Eye className="w-4 h-4 text-purple-600 flex-shrink-0" strokeWidth={1.5} />
                            ) : (
                              <Filter className="w-4 h-4 text-blue-600 flex-shrink-0" strokeWidth={1.5} />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-gray-900">{sel.category}</div>
                              <div className="text-xs text-gray-600 truncate">{sel.value}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeSelection(sel.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                          >
                            <X className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {sel.type === 'field' ? 'Shown in output' : 'Filter applied'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="text-xs text-gray-600 mb-2">
                {selections.filter(s => s.type === 'field').length} field(s) • {selections.filter(s => s.type === 'filter').length} filter(s)
              </div>
              {selections.length > 0 && (
                <button
                  onClick={() => setSelections([])}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Browse Mode
  if (stage === 'browse') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setStage('welcome')}
                className="text-blue-500 hover:text-blue-600 text-sm transition-colors hover:underline"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-light">New Report - Browse</h1>
              <button
                onClick={() => setStage('select')}
                className="ml-4 text-sm text-gray-500 hover:text-blue-500 transition-colors hover:underline"
              >
                Try Select mode →
              </button>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {generateNaturalLanguage()}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8 pb-32">
          {Object.entries(CATEGORIES).map(([section, categories]) => {
            const SectionIcon = getSectionIcon(section);
            const colors = getSectionColors(section);
            return (
              <div key={section} className="mb-12">
                <h2 className={`text-lg font-medium mb-4 ${colors.header}`}>{section}</h2>
                <div className="grid grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      onMouseEnter={() => setHoveredCard(category)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className="relative p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 text-left group transform hover:scale-105 hover:-translate-y-1 active:scale-95 overflow-hidden"
                    >
                      <div className="font-medium text-gray-900 mb-1 relative z-10">{category}</div>
                      <div className="text-xs text-gray-500 relative z-10">{section}</div>
                      
                      {/* Decorative Icon - Bottom Right */}
                      <SectionIcon 
                        className={`absolute bottom-1.5 right-1.5 w-10 h-10 ${colors.icon} opacity-3 pointer-events-none`}
                        strokeWidth={1}
                      />
                      
                      {hoveredCard === category && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-5 rounded-xl flex items-center justify-center z-20">
                          <Plus className="w-8 h-8 text-blue-500" strokeWidth={1.5} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Slide-out Panel */}
        {selectedCategory && (
          <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-2xl z-50 animate-slideIn">
            <div className="flex flex-col h-full">
              {/* Panel Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">{selectedCategory}</h3>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
                  <input
                    type="text"
                    placeholder="Search values..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Values List */}
              <div className="flex-1 overflow-auto p-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <input type="checkbox" className="rounded" />
                    <span className="flex-1 text-sm font-medium text-gray-700">Include results with any value</span>
                  </div>
                  
                  {(SAMPLE_VALUES[selectedCategory] || ['Value 1', 'Value 2', 'Value 3']).map((value, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group">
                      <input
                        type="checkbox"
                        className="rounded"
                        onChange={(e) => {
                          if (e.target.checked) {
                            addSelection(selectedCategory, value, 'filter');
                          }
                        }}
                      />
                      <button className="flex-1 text-sm text-left text-gray-900 hover:text-blue-500">
                        {value}
                      </button>
                      <button
                        onClick={() => addSelection(selectedCategory, value, 'field')}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="w-4 h-4 text-gray-400 hover:text-blue-500" strokeWidth={1.5} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Control Panel */}
        <div
          className={`fixed bottom-0 left-0 right-0 border-t border-gray-200 shadow-2xl transition-all duration-300 ${
            bottomPanelExpanded ? 'h-48' : 'h-24'
          }`}
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Drag Handle */}
          <button
            onClick={() => setBottomPanelExpanded(!bottomPanelExpanded)}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors"
          />

          <div className="h-full flex flex-col p-6">
            {/* Selections */}
            {bottomPanelExpanded && (
              <div className="flex-1 overflow-auto mb-4">
                <div className="flex flex-wrap gap-2">
                  {selections.map((sel, i) => (
                    <React.Fragment key={sel.id}>
                      {sel.connector && (
                        <button
                          onClick={() => toggleConnector(sel.id)}
                          className="px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          {sel.connector}
                        </button>
                      )}
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm">
                        <span className="font-medium">{sel.category}:</span>
                        <span>{sel.value}</span>
                        {sel.type === 'field' && <Eye className="w-3 h-3" strokeWidth={1.5} />}
                        <button
                          onClick={() => removeSelection(sel.id)}
                          className="ml-1 hover:text-blue-900"
                        >
                          <X className="w-3 h-3" strokeWidth={1.5} />
                        </button>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Three-Section Controls */}
            <div className="flex items-center justify-between">
              {/* Left: Report Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Filter className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">New Report</div>
                  <div className="text-xs text-gray-600">
                    {selections.length} filter{selections.length !== 1 ? 's' : ''} • ~{Math.max(1250, 5000 - selections.length * 300)} results
                  </div>
                </div>
              </div>
              
              {/* Center: Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSortEnabled(!sortEnabled)}
                  data-tooltip="Sort fields"
                  className="relative p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 btn-hover"
                >
                  <Settings className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  {sortEnabled && <div className="status-dot bg-green-500" />}
                </button>
                
                <button 
                  onClick={() => setGroupEnabled(!groupEnabled)}
                  data-tooltip="Group results"
                  className="relative p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 btn-hover"
                >
                  <Filter className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  {groupEnabled && <div className="status-dot bg-orange-500" />}
                </button>
                
                <button 
                  onClick={() => setVizEnabled(!vizEnabled)}
                  data-tooltip="Add visualization"
                  className="relative p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 btn-hover"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  {vizEnabled && <div className="status-dot bg-purple-500" />}
                </button>
                
                <button 
                  onClick={() => setShowPreview(!showPreview)}
                  data-tooltip={selections.length > 0 ? "Preview results" : ""}
                  disabled={selections.length === 0}
                  className={`relative p-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white btn-primary-hover disabled:opacity-50 disabled:cursor-not-allowed ${
                    showPreview ? 'rotate-90' : ''
                  }`}
                >
                  <Play className="w-5 h-5 transition-transform duration-300" strokeWidth={1.5} />
                </button>
              </div>
              
              {/* Right: Queue & Actions */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowQueue(!showQueue)}
                  data-tooltip="View all fields & filters"
                  className="relative p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 btn-hover"
                >
                  <List className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  {selections.length > 0 && (
                    <div className="queue-badge absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {selections.length}
                    </div>
                  )}
                </button>
                
                <button 
                  disabled={selections.length === 0}
                  data-tooltip={selections.length > 0 ? "Execute report (⌘↵)" : ""}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium btn-primary-hover ${
                    selections.length > 0
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Run Report
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Queue/Fields Panel */}
        {showQueue && (
          <div className="fixed bottom-32 right-8 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Report Fields & Filters</h3>
              <button
                onClick={() => setShowQueue(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {selections.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <List className="w-12 h-12 mx-auto mb-2 opacity-20" strokeWidth={1.5} />
                  <p className="text-sm">No fields or filters selected yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selections.map((sel, i) => (
                    <div key={sel.id}>
                      {sel.connector && i > 0 && (
                        <div className="text-center my-2">
                          <button
                            onClick={() => toggleConnector(sel.id)}
                            className="px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          >
                            {sel.connector}
                          </button>
                        </div>
                      )}
                      <div className={`p-3 rounded-lg border ${
                        sel.type === 'field' 
                          ? 'bg-purple-50 border-purple-200' 
                          : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2 flex-1">
                            {sel.type === 'field' ? (
                              <Eye className="w-4 h-4 text-purple-600 flex-shrink-0" strokeWidth={1.5} />
                            ) : (
                              <Filter className="w-4 h-4 text-blue-600 flex-shrink-0" strokeWidth={1.5} />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-gray-900">{sel.category}</div>
                              <div className="text-xs text-gray-600 truncate">{sel.value}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeSelection(sel.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                          >
                            <X className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {sel.type === 'field' ? 'Shown in output' : 'Filter applied'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="text-xs text-gray-600 mb-2">
                {selections.filter(s => s.type === 'field').length} field(s) • {selections.filter(s => s.type === 'filter').length} filter(s)
              </div>
              {selections.length > 0 && (
                <button
                  onClick={() => setSelections([])}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Select Mode
  if (stage === 'select') {
    const filteredFields = getFilteredFields();
    const shownFields = selections.filter(s => s.type === 'field');
    const filters = selections.filter(s => s.type === 'filter');

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setStage('welcome')}
                className="text-blue-500 hover:text-blue-600 text-sm transition-colors hover:underline"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-light">New Report - Select</h1>
              <button
                onClick={() => setStage('browse')}
                className="ml-4 text-sm text-gray-500 hover:text-blue-500 transition-colors hover:underline"
              >
                Try Browse mode →
              </button>
            </div>
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search all fields..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {generateNaturalLanguage()}
          </div>
        </div>

        {/* Main Content with Right Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Fields Grid */}
          <div className="flex-1 overflow-auto p-8 pb-32">
            <div className="grid grid-cols-3 gap-4">
              {filteredFields.map((field, i) => {
                const SectionIcon = getSectionIcon(field.section);
                const colors = getSectionColors(field.section);
                return (
                  <button
                    key={i}
                    onClick={() => addSelection(field.category, 'All Values', 'field')}
                    className="relative p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 text-left group transform hover:scale-105 hover:-translate-y-1 active:scale-95 overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2 relative z-10">
                      <div className="font-medium text-gray-900">{field.category}</div>
                      <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" strokeWidth={1.5} />
                    </div>
                    <div className="text-xs text-gray-500 relative z-10">{field.section}</div>
                    
                    {/* Decorative Icon - Bottom Right */}
                    <SectionIcon 
                      className={`absolute bottom-1 right-1 w-8 h-8 ${colors.icon} opacity-3 pointer-events-none`}
                      strokeWidth={1}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Shopping Cart */}
          <div className="w-80 bg-white border-l border-gray-200 shadow-xl flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium mb-2">Current Selection</h3>
              <p className="text-sm text-gray-500">Drag to reorder fields and filters</p>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {/* Fields Shown */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4" strokeWidth={1.5} />
                  Fields Shown ({shownFields.length})
                </h4>
                <div className="space-y-2">
                  {shownFields.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No fields selected</p>
                  ) : (
                    shownFields.map((sel) => (
                      <div key={sel.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{sel.category}</span>
                          <button
                            onClick={() => removeSelection(sel.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>
                        <select className="w-full text-xs border border-gray-300 rounded px-2 py-1">
                          <option>All values</option>
                        </select>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Filters */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" strokeWidth={1.5} />
                  Filters ({filters.length})
                </h4>
                <div className="space-y-2">
                  {filters.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No filters applied</p>
                  ) : (
                    filters.map((sel) => (
                      <div key={sel.id}>
                        {sel.connector && (
                          <button
                            onClick={() => toggleConnector(sel.id)}
                            className="w-full mb-1 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            {sel.connector}
                          </button>
                        )}
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{sel.category}</span>
                            <button
                              onClick={() => removeSelection(sel.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                          </div>
                          <div className="text-xs text-gray-600">{sel.value}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Control Panel */}
        <div
          className={`fixed bottom-0 left-0 right-0 border-t border-gray-200 shadow-2xl transition-all duration-300 ${
            bottomPanelExpanded ? 'h-48' : 'h-24'
          }`}
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <button
            onClick={() => setBottomPanelExpanded(!bottomPanelExpanded)}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors"
          />

          <div className="h-full flex flex-col p-6">
            {bottomPanelExpanded && (
              <div className="flex-1 mb-4">
                <div className="text-sm text-gray-600 mb-2">Preview (First 5 rows)</div>
                <div className="bg-gray-50 rounded border border-gray-200 p-3 text-xs text-gray-500">
                  Preview table would appear here with selected fields...
                </div>
              </div>
            )}

            {/* Three-Section Controls */}
            <div className="flex items-center justify-between">
              {/* Left: Report Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Filter className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">New Report</div>
                  <div className="text-xs text-gray-600">
                    {shownFields.length} field{shownFields.length !== 1 ? 's' : ''} • {filters.length} filter{filters.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              
              {/* Center: Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSortEnabled(!sortEnabled)}
                  data-tooltip="Sort fields"
                  className="relative p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 btn-hover"
                >
                  <Settings className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  {sortEnabled && <div className="status-dot bg-green-500" />}
                </button>
                
                <button 
                  onClick={() => setGroupEnabled(!groupEnabled)}
                  data-tooltip="Group results"
                  className="relative p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 btn-hover"
                >
                  <Filter className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  {groupEnabled && <div className="status-dot bg-orange-500" />}
                </button>
                
                <button 
                  onClick={() => setVizEnabled(!vizEnabled)}
                  data-tooltip="Add visualization"
                  className="relative p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 btn-hover"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  {vizEnabled && <div className="status-dot bg-purple-500" />}
                </button>
                
                <button 
                  onClick={() => setShowPreview(!showPreview)}
                  data-tooltip={selections.length > 0 ? "Preview results" : ""}
                  disabled={selections.length === 0}
                  className={`relative p-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white btn-primary-hover disabled:opacity-50 disabled:cursor-not-allowed ${
                    showPreview ? 'rotate-90' : ''
                  }`}
                >
                  <Play className="w-5 h-5 transition-transform duration-300" strokeWidth={1.5} />
                </button>
              </div>
              
              {/* Right: Queue & Actions */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowQueue(!showQueue)}
                  data-tooltip="View all fields & filters"
                  className="relative p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 btn-hover"
                >
                  <List className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                  {selections.length > 0 && (
                    <div className="queue-badge absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {selections.length}
                    </div>
                  )}
                </button>
                
                <button 
                  disabled={selections.length === 0}
                  data-tooltip={selections.length > 0 ? "Execute report (⌘↵)" : ""}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium btn-primary-hover ${
                    selections.length > 0
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Run Report
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slideIn">
            <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">{toast}</span>
            </div>
          </div>
        )}
        
        {/* Queue/Fields Panel */}
        {showQueue && (
          <div className="fixed bottom-32 right-8 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Report Fields & Filters</h3>
              <button
                onClick={() => setShowQueue(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {selections.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <List className="w-12 h-12 mx-auto mb-2 opacity-20" strokeWidth={1.5} />
                  <p className="text-sm">No fields or filters selected yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selections.map((sel, i) => (
                    <div key={sel.id}>
                      {sel.connector && i > 0 && (
                        <div className="text-center my-2">
                          <button
                            onClick={() => toggleConnector(sel.id)}
                            className="px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          >
                            {sel.connector}
                          </button>
                        </div>
                      )}
                      <div className={`p-3 rounded-lg border ${
                        sel.type === 'field' 
                          ? 'bg-purple-50 border-purple-200' 
                          : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2 flex-1">
                            {sel.type === 'field' ? (
                              <Eye className="w-4 h-4 text-purple-600 flex-shrink-0" strokeWidth={1.5} />
                            ) : (
                              <Filter className="w-4 h-4 text-blue-600 flex-shrink-0" strokeWidth={1.5} />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-gray-900">{sel.category}</div>
                              <div className="text-xs text-gray-600 truncate">{sel.value}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeSelection(sel.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                          >
                            <X className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {sel.type === 'field' ? 'Shown in output' : 'Filter applied'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="text-xs text-gray-600 mb-2">
                {selections.filter(s => s.type === 'field').length} field(s) • {selections.filter(s => s.type === 'filter').length} filter(s)
              </div>
              {selections.length > 0 && (
                <button
                  onClick={() => setSelections([])}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default ReportBuilder;