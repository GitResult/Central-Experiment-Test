import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, MoreHorizontal, Plus, X, ChevronRight, Filter, Eye, EyeOff, Clock, BarChart3, FileDown, FileUp, GripVertical, Ellipsis, ChevronsLeft, Edit3, Target, Focus, TrendingUp, Users, AlertCircle, CheckCircle2, Loader2, MapPin, ListTodo, Zap, MoreVertical, TrendingDown, DollarSign, AlertTriangle, Activity, Percent, Sparkles, Check, Briefcase } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line } from 'recharts';
import 'leaflet/dist/leaflet.css';
import './contactList.css'
import Pagination from '../components/UI/pagination';

// Import from refactored modules
import { getSuggestionsForPhrase } from './phraseSearchConfig';
import { calculateYears, getFieldValue, evaluateFilter } from './contactListUtils';
import LeafletMapComponent from './components/LeafletMapComponent';
import { TaskItem, TaskListItem, DeliverableItem, Confetti } from './components/HelperComponents';

const UnifiedContactListing = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showActionsPanel, setShowActionsPanel] = useState(false);
  const [showFieldsPanel, setShowFieldsPanel] = useState(false);
  const [showSavePhrasePanel, setShowSavePhrasePanel] = useState(false);
  const [activeTab, setActiveTab] = useState('actions');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilterDetails, setShowFilterDetails] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [fieldsSubTab, setFieldsSubTab] = useState('byField');
  const [fieldFilters, setFieldFilters] = useState({});
  const [pageFilters, setPageFilters] = useState([]);
  const [phraseFilters, setPhraseFilters] = useState([]);
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [filterMode, setFilterMode] = useState('phrase'); // 'phrase' or 'fields'
  const [isPhraseMode, setIsPhraseMode] = useState(false);
  const [phraseChips, setPhraseChips] = useState([]);
  const [phraseSearchText, setPhraseSearchText] = useState('');
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  // 3-column selection states
  const [activeColumn, setActiveColumn] = useState(0); // 0 = current, 1 = next, 2 = future
  const [columnSelections, setColumnSelections] = useState([null, null, null]); // Track selection in each column
  const [columnIndices, setColumnIndices] = useState([0, 0, 0]); // Track navigation index in each column
  const [lockedSuggestions, setLockedSuggestions] = useState(null); // Lock suggestions until all 3 are selected
  const [selectionRoundStart, setSelectionRoundStart] = useState(0); // Track where current selection round started
  const [previewChips, setPreviewChips] = useState([]); // Preview chips shown when typing
  const [savedPhraseName, setSavedPhraseName] = useState('');
  const [savedPhraseDescription, setSavedPhraseDescription] = useState('');
  const [showLoadPhraseDropdown, setShowLoadPhraseDropdown] = useState(false);
  const [savedPhrases, setSavedPhrases] = useState([
    {
      id: 1,
      name: 'Active Members in Toronto',
      description: 'Current active members located in Toronto',
      chips: [
        { id: 1, text: 'Current', type: 'cohort', icon: Users, color: 'blue' },
        { id: 2, text: 'members', type: 'entityType', icon: Users, color: 'blue' },
        { id: 3, text: 'in', type: 'connector', icon: MapPin },
        { id: 4, text: 'city', type: 'connector', icon: MapPin },
        { id: 5, text: 'Toronto', type: 'value', valueType: 'city' }
      ]
    },
    {
      id: 2,
      name: 'Long-term Professionals',
      description: 'Professionals with 5+ years tenure',
      chips: [
        { id: 1, text: 'All Contacts', type: 'cohort', icon: Users, color: 'gray' },
        { id: 2, text: 'professionals', type: 'entityType', icon: Sparkles, color: 'purple' },
        { id: 3, text: 'for', type: 'connector', icon: Clock },
        { id: 4, text: '5 years', type: 'value', valueType: 'tenure' },
        { id: 5, text: 'or more', type: 'value', valueType: 'tenureComparison' }
      ]
    },
    {
      id: 3,
      name: 'High Engagement Students',
      description: 'Students with high engagement levels',
      chips: [
        { id: 1, text: 'Current', type: 'cohort', icon: Users, color: 'blue' },
        { id: 2, text: 'students', type: 'entityType', icon: Users, color: 'emerald' },
        { id: 3, text: 'with', type: 'connector', icon: Check },
        { id: 4, text: 'engagement', type: 'connector', icon: TrendingUp },
        { id: 5, text: 'High', type: 'value', valueType: 'engagement' }
      ]
    }
  ]);
  const phraseInputRef = useRef(null);
  const applyButtonRef = useRef(null);
  const [activeCharts, setActiveCharts] = useState([]);
  const [showColumnMenu, setShowColumnMenu] = useState(null);
  const [draggedChart, setDraggedChart] = useState(null);
  const [showUnmergeMenu, setShowUnmergeMenu] = useState(null);
  const [showChartTypeMenu, setShowChartTypeMenu] = useState(null);
  const [draggedField, setDraggedField] = useState(null);
  const [dragOverSummary, setDragOverSummary] = useState(null);
  const [recordSearchQuery, setRecordSearchQuery] = useState('');
  const [dropPosition, setDropPosition] = useState(null);
  const [resizingChart, setResizingChart] = useState(null);
  const [resizeStartX, setResizeStartX] = useState(null);
  const [resizeStartSpan, setResizeStartSpan] = useState(null);
  // View tabs state
  const [currentView, setCurrentView] = useState('all');
  const [showMoreViews, setShowMoreViews] = useState(false);
  const [viewContextMenu, setViewContextMenu] = useState(null);
  const [pinnedViews, setPinnedViews] = useState([]);
  const [showPinPanel, setShowPinPanel] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [startAndEnd, setStartAndEndIndexs] = useState({ startIndex: 0, endIndex: 10 });
  const [sampleData, setSampleData] = useState(null);
  const [step, setStep] = useState(0);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [showMemberTypeChart, setShowMemberTypeChart] = useState(false);
  const [showTrendChart, setShowTrendChart] = useState(false);
  const [filteredToProfessional, setFilteredToProfessional] = useState(false);
  const [showVolunteerSlideout, setShowVolunteerSlideout] = useState(false);
  const [showChartConfigSlideout, setShowChartConfigSlideout] = useState(false);
  const [chartAggregation, setChartAggregation] = useState('count');
  const [showMarkerSlideout, setShowMarkerSlideout] = useState(false);
  const [showMarkerDetailSlideout, setShowMarkerDetailSlideout] = useState(false);
  const [markerPlacementMode, setMarkerPlacementMode] = useState(false);
  const [tempMarkerPosition, setTempMarkerPosition] = useState(null);
  const [savedMarkers, setSavedMarkers] = useState([]);
  const [tasksGenerated, setTasksGenerated] = useState(false);
  const [agentsAssigned, setAgentsAssigned] = useState(false);
  const [showAgentSlideout, setShowAgentSlideout] = useState(false);
  const [agentProgress, setAgentProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const tableRef = useRef(null);
  const contentRef = useRef(null);
  const [markerPositions, setMarkerPositions] = useState({});
  const [panelPosition, setPanelPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight / 2 - 200 });
  const [panelSize, setPanelSize] = useState('normal');
  const [panelDimensions, setPanelDimensions] = useState({ width: 400, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, mouseX: 0, mouseY: 0 });
  const [legendPosition, setLegendPosition] = useState({ x: window.innerWidth - 360, y: window.innerHeight - 500 });
  const [legendMinimized, setLegendMinimized] = useState(false);
  const [isDraggingLegend, setIsDraggingLegend] = useState(false);
  const [legendDragOffset, setLegendDragOffset] = useState({ x: 0, y: 0 });
  const [selectedMemberTypes, setSelectedMemberTypes] = useState(['MEMBER', 'STUDENT Affiliate']);
  const [showMemberTypeSelector, setShowMemberTypeSelector] = useState(false);
  const [members, setMembers] = useState([]);
  const [memberTypeData, setMemberTypeData] = useState(null);
  const [retentionPieData, setRetentionPieData] = useState(null);
  const [renewalTrendData, setRenewalTrendData] = useState(null);

  const toolbarIcons = [
    { id: 'chart', icon: BarChart3, label: 'Chart' },
    { id: 'compare', icon: Target, label: 'Compare' },
    { id: 'edit', icon: Edit3, label: 'Edit' },
    { id: 'filter', icon: Filter, label: 'Filter' },
    { id: 'view', icon: Eye, label: 'View' },
  ];


  useEffect(() => {
    const loadSampleData = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/data/contact-list.json`);
        if (!response.ok) {
          throw new Error('Failed to load sample data');
        }
        const data = await response.json();

        // Add calculated fields like tenureYears to each member
        const membersWithTenure = data.members.map(member => ({
          ...member,
          tenureYears: calculateYears(member.joinDate),
          tenureBucket: (() => {
            const years = calculateYears(member.joinDate);
            if (years < 1) return '0-1 years';
            if (years < 2) return '1-2 years';
            if (years < 5) return '2-5 years';
            if (years < 10) return '5-10 years';
            return '10+ years';
          })()
        }));

        setFilteredContacts(membersWithTenure);
        setMembers(membersWithTenure);
        setMemberTypeData(data.memberTypeData);
        setRetentionPieData(data.retentionPieData);
        setRenewalTrendData(data.renewalTrendData);
        setSampleData({ ...data, members: membersWithTenure });
      } catch (error) {
        console.error('Error loading sample data:', error);
        setSampleData(null);
      }
    };

    loadSampleData();
  }, []);

  const displayMembers = filteredToProfessional
    ? members.filter(m => m.type === 'MEMBER')
    : members;

  const getMemberTypeDataWithPercentage = () => {
    if (sampleData) {
      const filteredData = selectedMemberTypes.length > 0
        ? memberTypeData.filter(item => selectedMemberTypes.includes(item.type))
        : memberTypeData;

      if (chartAggregation === 'percentage') {
        const total2024 = filteredData.reduce((sum, item) => sum + item['2024'], 0);
        const total2025 = filteredData.reduce((sum, item) => sum + item['2025'], 0);

        return filteredData.map(item => ({
          type: item.type,
          '2024': Math.round((item['2024'] / total2024) * 100),
          '2025': Math.round((item['2025'] / total2025) * 100),
        }));
      }
      return filteredData;
    }
    return [];
  };

  const chartDataToDisplay = getMemberTypeDataWithPercentage();

  useEffect(() => {
    if (compareMode && tableRef.current) {
      const headers = tableRef.current.querySelectorAll('th');
      const newPositions = {};

      headers.forEach((header, index) => {
        const rect = header.getBoundingClientRect();
        const colName = header.textContent.trim().toUpperCase();
        newPositions[colName] = {
          left: rect.left + rect.width / 2,
          top: rect.top - 8,
        };
      });

      setMarkerPositions(newPositions);
    }
  }, [compareMode, showMemberTypeChart, filteredToProfessional]);

  useEffect(() => {
    const chartHeight = showMemberTypeChart ? 500 : 0;
    setSavedMarkers(prevMarkers =>
      prevMarkers.map(marker => ({
        ...marker,
        position: {
          x: marker.position.x,
          y: marker.position.baseY !== undefined ? marker.position.baseY + chartHeight : marker.position.y,
          baseY: marker.position.baseY
        }
      }))
    );
  }, [showMemberTypeChart]);

  const handleCompareClick = () => {
    setCompareMode(true);
    setStep(1);
  };

  const handleMemberTypeClick = () => {
    setShowMemberTypeChart(true);
    setStep(2);
  };

  const handleTrendClick = () => {
    setShowTrendChart(true);
  };

  const handleProfessionalBarClick = () => {
    setFilteredToProfessional(true);
    setStep(3);
    setTimeout(() => setStep(4), 800);
  };

  const handleVolunteerMarkerClick = () => {
    setShowVolunteerSlideout(true);
    setStep(5);
  };

  const handleAddMarker = () => {
    setMarkerPlacementMode(true);
    setShowMarkerSlideout(true);
    setStep(6);
  };

  const handlePageClick = (e) => {
    if (markerPlacementMode && !e.target.closest('.slideout-panel') && contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top + contentRef.current.scrollTop;
      setTempMarkerPosition({ x: relativeX, y: relativeY });
    }
  };

  const handleSaveMarker = () => {
    if (tempMarkerPosition) {
      const chartHeight = showMemberTypeChart ? 500 : 0;
      const baseY = showMemberTypeChart ? tempMarkerPosition.y - chartHeight : tempMarkerPosition.y;

      const newMarker = {
        id: Date.now(),
        position: {
          x: tempMarkerPosition.x,
          y: tempMarkerPosition.y,
          baseY: baseY
        },
        label: 'First-Year Volunteer Activation Gap',
        description: 'MEMBERs who volunteer in year 1 show 85% retention vs 45% for non-volunteers.',
      };
      setSavedMarkers([...savedMarkers, newMarker]);
      setMarkerPlacementMode(false);
      setTempMarkerPosition(null);
      setShowMarkerSlideout(false);
      setShowVolunteerSlideout(false);
      setShowMarkerDetailSlideout(true);
      setStep(7);
    }
  };

  const handleMarkerClick = (marker) => {
    setShowMarkerDetailSlideout(true);
  };

  const handleGenerateTasks = () => {
    setTasksGenerated(true);
    setStep(8);
  };

  const handleAssignAgents = () => {
    setAgentsAssigned(true);
    setStep(9);
  };

  const handleApproveAndProceed = () => {
    setShowMarkerDetailSlideout(false);
    setShowAgentSlideout(true);
    setStep(10);

    const interval = setInterval(() => {
      setAgentProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  useEffect(() => {
    if (agentProgress === 100) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [agentProgress]);

  const handlePanelMouseDown = (e) => {
    if (e.target.closest('.panel-drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - panelPosition.x,
        y: e.clientY - panelPosition.y
      });
    }
  };

  const handleLegendMouseDown = (e) => {
    if (e.target.closest('.legend-drag-handle')) {
      setIsDraggingLegend(true);
      setLegendDragOffset({
        x: e.clientX - legendPosition.x,
        y: e.clientY - legendPosition.y
      });
    }
  };

  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      width: panelDimensions.width,
      height: panelDimensions.height,
      mouseX: e.clientX,
      mouseY: e.clientY
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y));
        setPanelPosition({ x: newX, y: newY });
      }

      if (isDraggingLegend) {
        const newX = Math.max(0, Math.min(window.innerWidth - 340, e.clientX - legendDragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - legendDragOffset.y));
        setLegendPosition({ x: newX, y: newY });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.mouseX;
        const deltaY = e.clientY - resizeStart.mouseY;
        const newWidth = Math.max(320, Math.min(800, resizeStart.width + deltaX));
        const newHeight = Math.max(200, Math.min(window.innerHeight * 0.9, resizeStart.height + deltaY));
        setPanelDimensions({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsDraggingLegend(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing || isDraggingLegend) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, isDraggingLegend, dragOffset, resizeStart, legendDragOffset]);

  const togglePanelSize = () => {
    setPanelSize(prev => {
      if (prev === 'minimized') return 'normal';
      if (prev === 'normal') return 'maximized';
      return 'minimized';
    });
  };

  const getBarColor = (type, year) => {
    if (year === '2023') return '#6ee7b7';

    const changes = {
      'Student': 3.8,
      'Professional': -15.4,
      'Corporate': 4.4
    };

    const change = changes[type];

    if (change > 5) return '#4ade80';
    if (change > 0) return '#bbf7d0';
    if (change > -5) return '#fca5a5';
    if (change > -10) return '#f87171';
    return '#ef4444';
  };

  const getMarkerButton = (column, color, icon, title, onClick, shouldPulse = false, markerType = 'default') => {
    const Icon = icon;
    const position = markerPositions[column];

    if (!position) return null;

    const colorClasses = {
      slate: 'text-slate-600 border-slate-600 hover:bg-slate-50',
      indigo: 'text-indigo-600 border-indigo-600 hover:bg-indigo-50',
      purple: 'text-purple-600 border-purple-600 hover:bg-purple-50',
      emerald: 'text-emerald-600 border-emerald-600 hover:bg-emerald-50',
      amber: 'text-amber-600 border-amber-600 hover:bg-amber-50',
      green: 'text-green-600 border-green-600 hover:bg-green-50',
      blue: 'text-blue-600 border-blue-600 hover:bg-blue-50',
      red: 'text-red-600 border-red-600 hover:bg-red-50',
      orange: 'text-orange-600 border-orange-600 hover:bg-orange-50',
      cyan: 'text-cyan-600 border-cyan-600 hover:bg-cyan-50',
    };

    const markerStyles = {
      comparison: 'rounded-lg',          // Square for structured comparison
      trend: 'rounded-lg',               // Triangle/arrow for direction
      alert: 'rounded-lg',               // Triangle for warning
      correlation: 'rounded-lg',         // Diamond for connection/intersection
      performance: 'rounded-full',       // Circle for target/goal
      financial: 'rounded-full',         // Circle for currency
    };

    const getRotation = () => {
      if (markerType === 'trend') return 'rotate(0deg)';
      if (markerType === 'correlation') return 'rotate(45deg)';
      if (markerType === 'alert') return 'rotate(0deg)';
      return 'rotate(0deg)';
    };

    const getIconRotation = () => {
      if (markerType === 'correlation') return 'rotate(-45deg)';
      return 'rotate(0deg)';
    };

    return (
      <button
        onClick={onClick}
        className={`fixed bg-white border-2 ${markerStyles[markerType] || 'rounded-full'} p-2 shadow-lg transition-all hover:scale-110 z-[90] ${colorClasses[color]}`}
        style={{
          left: `${position.left}px`,
          top: `${position.top + 60}px`,
          transform: `translate(-50%, -50%) ${getRotation()}`,
          animation: shouldPulse ? 'pulseRing 2s infinite' : 'none',
        }}
        title={title}
      >
        <Icon className="w-4 h-4" strokeWidth={1.5} style={{ transform: getIconRotation() }} />
      </button>
    );
  };
  // pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.ceil(filteredContacts.length / itemsPerPage);
  const handlePageNumberClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    const startIndex = ((pageNumber - 1 <= 0 ? 0 : pageNumber - 1) * itemsPerPage) % filteredContacts.length;
    const endIndex = startIndex + itemsPerPage;
    setStartAndEndIndexs({ startIndex: startIndex, endIndex: endIndex > filteredContacts.length ? filteredContacts.length : endIndex });
  };

  // drag & drop
  const [viewOrder, setViewOrder] = useState(['all', 'vip', 'recent', 'lapsed']);
  const [draggedView, setDraggedView] = useState(null);
  const [dropTargetView, setDropTargetView] = useState(null);
  const viewButtonRefs = useRef({});
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });

  // active filter badge
  const [activeFilters, setActiveFilters] = useState(new Map());
  const [showActiveFilters, setShowActiveFilters] = useState(false);

  // quick filter
  const [quickFilters, setQuickFilters] = useState({
    status: '',
    location: '',
    joinDate: '',
    recentActivity: ''
  });
  const [showQuickFilterDropdown, setShowQuickFilterDropdown] = useState(null);

  // View configurations - defines filters for each view
  const savedViews = {
    'all': {
      name: '🔖 All Members',
      filters: {},
      count: members.length
    },
    'vip': {
      name: '💼 VIP Members',
      filters: { status: 'Active' },
      count: members.filter(c => c.status === 'Active').length
    },
    'recent': {
      name: '🎯 Recent Signups',
      filters: { type: 'Student' },
      count: members.filter(c => c.type === 'Student').length
    },
    'lapsed': {
      name: '⚠️ Lapsed Recovery',
      filters: { status: 'Inactive' },
      count: members.filter(c => c.status === 'Inactive').length
    }
  };

  const allFields = [
    { name: 'Id', visible: true, type: 'text' },
    { name: 'Name', visible: true, type: 'text' },
    { name: 'Type', visible: true, type: 'select' },
    { name: 'Status', visible: true, type: 'select' },
    { name: 'Email', visible: true, type: 'email' },
    { name: 'Phone', visible: true, type: 'phone' },
    { name: 'Location', visible: false, type: 'text' },
    { name: 'Actions', visible: false, type: 'actions' },
    { name: 'Address Line 1', visible: false, type: 'text' },
    { name: 'Address Line 2', visible: false, type: 'text' },
    { name: 'City', visible: false, type: 'text' },
    { name: 'Province/State', visible: false, type: 'text' },
    { name: 'Country', visible: false, type: 'text' },
    { name: 'Postal/Zip Code', visible: false, type: 'text' },
    { name: 'Age', visible: false, type: 'number' },
    { name: 'Age Group', visible: false, type: 'select' },
    { name: 'Date of Birth', visible: false, type: 'date' },
    { name: 'Renewal Type', visible: false, type: 'select' },
    { name: 'Committees', visible: false, type: 'multi-select' },
    { name: 'Events', visible: false, type: 'multi-select' },
    { name: 'Join Date', visible: true, type: 'date' },
    { name: 'Renewal Date', visible: true, type: 'date' },
    { name: 'Engagement', visible: true, type: 'number' },
    { name: 'Revenue', visible: true, type: 'text' }
  ];

  const [fields, setFields] = useState(allFields);

  // Filter contacts based on current view
  useEffect(() => {
    const view = savedViews[currentView];
    if (!view) return;

    let filtered = [...members];

    // Apply view filters
    const filters = view.filters;
    Object.keys(filters).forEach(key => {
      const filterValue = filters[key];
      filtered = filtered.filter(contact => contact[key] === filterValue);
    });

    // Apply quick filters
    if (quickFilters.status) {
      filtered = filtered.filter(contact => contact.status === quickFilters.status);
    }
    if (quickFilters.location) {
      filtered = filtered.filter(contact => contact.location === quickFilters.location);
    }
    // Add more quick filter logic as needed

    setFilteredContacts(filtered);
  }, [currentView, quickFilters]);

  // new menu start

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setViewContextMenu(null);
      setShowMoreViews(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.relative')) {
        setShowQuickFilterDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // View tabs data with dynamic counts from savedViews
  const views = {
    all: { id: 'all', name: savedViews.all.name, count: savedViews.all.count },
    vip: { id: 'vip', name: savedViews.vip.name, count: savedViews.vip.count },
    recent: { id: 'recent', name: savedViews.recent.name, count: savedViews.recent.count },
    lapsed: { id: 'lapsed', name: savedViews.lapsed.name, count: savedViews.lapsed.count }
  };

  // View tab handlers
  // const selectViewTab = (viewId) => {
  //   setCurrentView(viewId);
  //   setViewContextMenu(null);
  // };
  const selectViewTab = (viewId) => {
    setCurrentView(viewId);
    setViewContextMenu(null);

    const view = savedViews[viewId];
    if (!view) return;

    // Convert view filters to Map and set active filters
    const filters = view.filters;
    const filterMap = new Map();

    Object.keys(filters).forEach(key => {
      filterMap.set(key, {
        value: filters[key],
        label: filters[key]
      });
    });

    setActiveFilters(filterMap);
    setShowActiveFilters(filterMap.size > 0);
  };

  const openViewContextMenu = (e, viewId) => {
    e.stopPropagation();
    setViewContextMenu(viewContextMenu === viewId ? null : viewId);
  };

  const toggleMoreViews = () => {
    setShowMoreViews(!showMoreViews);
  };

  const togglePinView = (viewId) => {
    setPinnedViews(prev =>
      prev.includes(viewId)
        ? prev.filter(id => id !== viewId)
        : [...prev, viewId]
    );
    setViewContextMenu(null);
  };

  // New menu data end

  const toggleFieldVisibility = (fieldName) => {
    setFields(fields.map(f =>
      f.name === fieldName ? { ...f, visible: !f.visible } : f
    ));
  };

  const editFilter = (filterType) => {
    // Open the fields panel
    setShowFieldsPanel(true);
    setActiveTab('fields');

    // Scroll to and focus on the specific field
    setTimeout(() => {
      const fieldElement = document.querySelector(`[data-field="${filterType}"]`);
      if (fieldElement) {
        fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = fieldElement.querySelector('input, select');
        if (input) {
          input.focus();
        }
      }
    }, 300);
  };

  const getFilterDisplayName = (filterType) => {
    const displayNames = {
      'status': 'Status',
      'type': 'Type',
      'location': 'Location',
      'agegroup': 'Age Group',
      'type': 'Renewal Type',
      'provincestate': 'Province/State',
      'email': 'Email',
      'phone': 'Phone',
      'name': 'Name',
      'joindate': 'Join Date',
      'renewaldate': 'Renewal Date',
      'engagement': 'EngageMent',
      'revenue': 'Revenue'
    };
    return displayNames[filterType] || filterType;
  };

  const addFilter = (filterType, filterValue) => {
    setSelectedFilters([...selectedFilters, { type: filterType, value: filterValue }]);
    setSearchFocused(false);
    setSearchValue('');
  };

  // const removeFilter = (index) => {
  //   setSelectedFilters(selectedFilters.filter((_, i) => i !== index));
  // };

  const removeFilter = (filterType) => {
    setActiveFilters(prev => {
      const newFilters = new Map(prev);
      newFilters.delete(filterType);
      setShowActiveFilters(newFilters.size > 0);
      return newFilters;
    });

    // Clear field filter
    setFieldFilters(prev => {
      const newFieldFilters = { ...prev };
      delete newFieldFilters[filterType];
      return newFieldFilters;
    });

    // If this was the last filter, switch back to "All Members" view
    if (activeFilters.size === 1) {
      setCurrentView('all');
    }
  };

  const toggleRecordSelection = (id) => {
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter(rid => rid !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  };

  const toggleAllRecords = () => {
    const filteredContacts = getFilteredContacts();
    const filteredIds = filteredContacts.map(c => c.id);
    const allFilteredSelected = filteredIds.every(id => selectedRecords.includes(id));

    if (allFilteredSelected) {
      setSelectedRecords(selectedRecords.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedRecords([...new Set([...selectedRecords, ...filteredIds])]);
    }
  };

  // const updateFieldFilter = (fieldName, value) => {
  //   setFieldFilters(prev => ({
  //     ...prev,
  //     [fieldName]: value
  //   }));
  // };

  const updateFieldFilter = (fieldName, value) => {
    setFieldFilters(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Also update active filters
    if (value && value !== '') {
      setActiveFilters(prev => {
        const newFilters = new Map(prev);
        newFilters.set(fieldName, {
          value: value,
          label: value
        });
        return newFilters;
      });
      setShowActiveFilters(true);
    } else {
      setActiveFilters(prev => {
        const newFilters = new Map(prev);
        newFilters.delete(fieldName);
        return newFilters;
      });
    }
  };

  const activeFieldFiltersCount = Object.values(fieldFilters).filter(v => v && v !== '').length;
  const activePageFiltersCount = pageFilters.filter(f => f.value && f.value !== '').length;

  const addPageFilter = (fieldName, fieldType) => {
    if (!pageFilters.find(f => f.fieldName === fieldName)) {
      setPageFilters([...pageFilters, { fieldName, fieldType, value: '' }]);
    }
  };

  const updatePageFilter = (fieldName, value) => {
    setPageFilters(pageFilters.map(f =>
      f.fieldName === fieldName ? { ...f, value } : f
    ));
  };

  const removePageFilter = (fieldName) => {
    setPageFilters(pageFilters.filter(f => f.fieldName !== fieldName));
  };

  const addChart = (fieldName) => {
    if (!activeCharts.find(c => c.id === fieldName)) {
      const defaultVisType = fieldName === 'Status' ? 'pie' : fieldName === 'Id' ? 'count' : 'bar';
      setActiveCharts([...activeCharts, { id: fieldName, type: 'single', field: fieldName, visualizationType: defaultVisType, columnSpan: 4 }]);
    }
    setShowColumnMenu(null);
  };

  const addMap = (fieldName) => {
    if (!activeCharts.find(c => c.id === `${fieldName}-map`)) {
      setActiveCharts([...activeCharts, { id: `${fieldName}-map`, type: 'map', field: fieldName, visualizationType: 'map', columnSpan: 12 }]);
    }
    setShowColumnMenu(null);
  };

  const addNewMap = (fieldName) => {
    console.log("Adding new map for field:", fieldName);
    if (!activeCharts.find(c => c.id === `${fieldName}-map`)) {
      setActiveCharts([...activeCharts, { id: `${fieldName}-map`, type: 'newMap', field: fieldName, visualizationType: 'map', columnSpan: 12 }]);
    }
    setShowColumnMenu(null);
  }

  const addSummary = (fieldName) => {
    if (!activeCharts.find(c => c.id === `${fieldName}-summary`)) {
      setActiveCharts([...activeCharts, { id: `${fieldName}-summary`, type: 'summary', field: fieldName, visualizationType: 'summary', crossTabField: null, columnSpan: 8 }]);
    }
    setShowColumnMenu(null);
  };

  const removeChart = (chartId) => {
    setActiveCharts(activeCharts.filter(c => c.id !== chartId));
  };

  const resizeChart = (chartId, newSpan) => {
    setActiveCharts(activeCharts.map(c =>
      c.id === chartId ? { ...c, columnSpan: newSpan } : c
    ));
  };

  const handleResizeStart = (e, chartId, currentSpan) => {
    e.stopPropagation();
    e.preventDefault();
    setResizingChart(chartId);
    setResizeStartX(e.clientX);
    setResizeStartSpan(currentSpan);
  };

  const handleResizeEnd = () => {
    setResizingChart(null);
    setResizeStartX(null);
    setResizeStartSpan(null);
  };

  // Add global mouse event listeners for resize
  React.useEffect(() => {
    if (resizingChart) {
      const handleMouseMove = (e) => {
        if (!resizingChart || resizeStartX === null) return;

        const deltaX = e.clientX - resizeStartX;
        const pixelsPerColumn = 60; // Drag 60 pixels to change by 1 column

        // Calculate how many columns to change based on distance dragged
        const columnChange = Math.round(deltaX / pixelsPerColumn);
        let newSpan = resizeStartSpan + columnChange;

        // Clamp between 4 and 12 columns
        newSpan = Math.max(4, Math.min(12, newSpan));

        // Only update if the span actually changed
        const currentChart = activeCharts.find(c => c.id === resizingChart);
        if (currentChart && newSpan !== currentChart.columnSpan) {
          setActiveCharts(charts => charts.map(c =>
            c.id === resizingChart ? { ...c, columnSpan: newSpan } : c
          ));
        }
      };

      const handleMouseUp = () => handleResizeEnd();

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [resizingChart, resizeStartX, resizeStartSpan, activeCharts]);

  const changeChartType = (chartId, newType) => {
    setActiveCharts(activeCharts.map(c =>
      c.id === chartId ? { ...c, visualizationType: newType } : c
    ));
    setShowChartTypeMenu(null);
  };

  const handleChartDragStart = (e, chartId) => {
    const chart = activeCharts.find(c => c.id === chartId);
    setDraggedChart(chartId);

    if (chart && chart.type === 'single' && (chart.field === 'Type' || chart.field === 'Status' || chart.field === 'Province/State' || chart.field === 'Age Group' || chart.field === 'Renewal Type' || chart.field === 'Location')) {
      setDraggedField(chart.field);
      e.dataTransfer.effectAllowed = 'copyMove';
    } else {
      setDraggedField(null);
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleChartDragOver = (e, chartId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const width = rect.width;

    // Define edge zones (20% on each side)
    const edgeThreshold = width * 0.2;

    // Check if we're in the left edge, right edge, or center
    if (relativeX < edgeThreshold) {
      setDropPosition({ chartId, position: 'before', mode: 'reorder' });
    } else if (relativeX > width - edgeThreshold) {
      setDropPosition({ chartId, position: 'after', mode: 'reorder' });
    } else {
      // Center area - check if we can merge
      const draggedChartData = activeCharts.find(c => c.id === draggedChart);
      const targetChart = activeCharts.find(c => c.id === chartId);

      if (draggedChartData?.type === 'single' && targetChart?.type === 'single' &&
        draggedChartData.field !== targetChart.field) {
        setDropPosition({ chartId, position: 'center', mode: 'merge' });
      } else {
        setDropPosition({ chartId, position: 'after', mode: 'reorder' });
      }
    }
  };

  const handleChartDragLeave = () => {
    setDropPosition(null);
  };

  const handleChartDrop = (e, targetChartId) => {
    e.preventDefault();

    if (draggedChart === targetChartId) {
      setDropPosition(null);
      setDraggedChart(null);
      setDraggedField(null);
      return;
    }

    const draggedIndex = activeCharts.findIndex(c => c.id === draggedChart);
    const targetIndex = activeCharts.findIndex(c => c.id === targetChartId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDropPosition(null);
      setDraggedChart(null);
      setDraggedField(null);
      return;
    }

    const draggedChartData = activeCharts[draggedIndex];
    const targetChartData = activeCharts[targetIndex];

    // Check if we're merging (only in center mode)
    if (dropPosition?.mode === 'merge' &&
      draggedChartData.type === 'single' && targetChartData.type === 'single' &&
      draggedChartData.field !== targetChartData.field) {
      // Create merged chart
      const mergedChart = {
        id: `${targetChartData.field}-by-${draggedChartData.field}`,
        type: 'merged',
        primaryField: targetChartData.field,
        secondaryField: draggedChartData.field,
        visualizationType: 'bar',
        columnSpan: 8
      };

      // Remove both charts and add merged one
      const newCharts = activeCharts.filter(c => c.id !== draggedChart && c.id !== targetChartId);
      newCharts.splice(targetIndex, 0, mergedChart);
      setActiveCharts(newCharts);
    } else {
      // Just reorder
      const newCharts = [...activeCharts];
      newCharts.splice(draggedIndex, 1);

      let insertIndex = targetIndex;
      if (draggedIndex < targetIndex) {
        insertIndex = targetIndex - 1;
      }

      if (dropPosition?.position === 'after') {
        insertIndex++;
      }

      newCharts.splice(insertIndex, 0, draggedChartData);
      setActiveCharts(newCharts);
    }

    setDropPosition(null);
    setDraggedChart(null);
    setDraggedField(null);
  };

  const unmergeChart = (chartId) => {
    const chart = activeCharts.find(c => c.id === chartId);
    if (chart && chart.type === 'merged') {
      const chartIndex = activeCharts.indexOf(chart);
      const newCharts = [...activeCharts];

      // Remove merged chart and add back the two single charts
      const primaryDefaultType = chart.primaryField === 'Status' ? 'pie' : chart.primaryField === 'Id' ? 'count' : 'bar';
      const secondaryDefaultType = chart.secondaryField === 'Status' ? 'pie' : chart.secondaryField === 'Id' ? 'count' : 'bar';

      newCharts.splice(chartIndex, 1,
        { id: chart.primaryField, type: 'single', field: chart.primaryField, visualizationType: primaryDefaultType, columnSpan: 4 },
        { id: chart.secondaryField, type: 'single', field: chart.secondaryField, visualizationType: secondaryDefaultType, columnSpan: 4 }
      );

      setActiveCharts(newCharts);
      setShowUnmergeMenu(null);
    }
  };

  const getChartData = (fieldName) => {
    const counts = {};
    const fieldKey = fieldName.toLowerCase().replace(/[\/\s]/g, '');
    const filteredContacts = getFilteredContacts();

    filteredContacts.forEach(contact => {
      const value = contact[fieldKey];
      if (value) {
        counts[value] = (counts[value] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value
    }));
  };

  const getMergedChartData = (primaryField, secondaryField) => {
    const grouped = {};
    const primaryKey = primaryField.toLowerCase().replace(/[\/\s]/g, '');
    const secondaryKey = secondaryField.toLowerCase().replace(/[\/\s]/g, '');
    const filteredContacts = getFilteredContacts();

    filteredContacts.forEach(contact => {
      const primary = contact[primaryKey];
      const secondary = contact[secondaryKey];

      if (!grouped[primary]) {
        grouped[primary] = {};
      }
      if (!grouped[primary][secondary]) {
        grouped[primary][secondary] = 0;
      }
      grouped[primary][secondary]++;
    });

    // Convert to format for stacked bar chart
    const result = [];
    Object.entries(grouped).forEach(([primary, secondaries]) => {
      const dataPoint = { name: primary };
      Object.entries(secondaries).forEach(([secondary, count]) => {
        dataPoint[secondary] = count;
      });
      result.push(dataPoint);
    });

    return result;
  };

  const getSecondaryKeys = (primaryField, secondaryField) => {
    const keys = new Set();
    const secondaryKey = secondaryField.toLowerCase().replace(/[\/\s]/g, '');
    const filteredContacts = getFilteredContacts();

    filteredContacts.forEach(contact => {
      keys.add(contact[secondaryKey]);
    });
    return Array.from(keys);
  };

  const getMapData = (fieldName) => {
    const counts = {};
    const fieldKey = fieldName.toLowerCase().replace(/[\/\s]/g, '');
    const filteredContacts = getFilteredContacts();

    filteredContacts.forEach(contact => {
      const value = contact[fieldKey];
      if (value) {
        counts[value] = (counts[value] || 0) + 1;
      }
    });
    return counts;
  };

  const getSummaryData = (fieldName, crossTabField = null) => {
    const filteredContacts = getFilteredContacts();
    const total = filteredContacts.length;

    if (!crossTabField) {
      // Simple summary
      const counts = {};
      const fieldKey = fieldName.toLowerCase().replace(/[\/\s]/g, '');

      filteredContacts.forEach(contact => {
        const value = contact[fieldKey];
        if (value) {
          counts[value] = (counts[value] || 0) + 1;
        }
      });

      return {
        rows: Object.entries(counts).map(([name, count]) => ({
          name,
          count,
          percentage: ((count / total) * 100).toFixed(1)
        })),
        total
      };
    } else {
      // Cross-tab summary
      const fieldKey = fieldName.toLowerCase().replace(/[\/\s]/g, '');
      const crossTabKey = crossTabField.toLowerCase().replace(/[\/\s]/g, '');
      const matrix = {};
      const columnValues = new Set();

      filteredContacts.forEach(contact => {
        const rowValue = contact[fieldKey];
        const colValue = contact[crossTabKey];

        if (rowValue && colValue) {
          if (!matrix[rowValue]) {
            matrix[rowValue] = {};
          }
          if (!matrix[rowValue][colValue]) {
            matrix[rowValue][colValue] = 0;
          }
          matrix[rowValue][colValue]++;
          columnValues.add(colValue);
        }
      });

      const columns = Array.from(columnValues);
      const rows = Object.entries(matrix).map(([rowName, colCounts]) => {
        const row = { name: rowName };
        let rowTotal = 0;
        columns.forEach(col => {
          row[col] = colCounts[col] || 0;
          rowTotal += row[col];
        });
        row.total = rowTotal;
        return row;
      });

      return {
        rows,
        columns,
        total
      };
    }
  };

  const handleFieldDragStart = (e, fieldName) => {
    setDraggedField(fieldName);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleSummaryDragOver = (e, summaryId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverSummary(summaryId);
  };

  const handleSummaryDragLeave = () => {
    setDragOverSummary(null);
  };

  const handleSummaryDrop = (e, summaryId) => {
    e.preventDefault();

    const allowedFields = ['Type', 'Status', 'Province/State', 'Age Group', 'Renewal Type'];
    if (!draggedField || !allowedFields.includes(draggedField)) {
      setDragOverSummary(null);
      setDraggedField(null);
      setDraggedChart(null);
      return;
    }

    const summary = activeCharts.find(c => c.id === summaryId);
    if (summary && draggedField === summary.field) {
      // Can't drop the same field onto itself
      setDragOverSummary(null);
      setDraggedField(null);
      setDraggedChart(null);
      return;
    }

    // Update the summary to include cross-tab
    setActiveCharts(activeCharts.map(chart => {
      if (chart.id === summaryId && chart.type === 'summary') {
        return { ...chart, crossTabField: draggedField };
      }
      return chart;
    }));

    setDragOverSummary(null);
    setDraggedField(null);
    setDraggedChart(null);
  };

  const getLocalFieldValue = (contact, fieldName) => {
    const fieldKey = fieldName.toLowerCase().replace(/[\/\s]/g, '');
    return contact[fieldKey];
  };

  const getFilteredContacts = (isPaginated) => {
    // Start with contacts already filtered by current view
    let filteredList = filteredContacts;

    // Apply phrase filters (highest priority - defines the cohort)
    if (phraseFilters.length > 0) {
      filteredList = filteredList.filter(contact =>
        phraseFilters.every(filter => evaluateFilter(contact, filter))
      );
    }

    // Apply search filter
    if (searchValue && searchValue.trim() !== '') {
      const searchLower = searchValue.toLowerCase();
      filteredList = filteredList.filter(contact => {
        return (
          contact.name?.toLowerCase().includes(searchLower) ||
          contact.id?.toLowerCase().includes(searchLower) ||
          contact.email?.toLowerCase().includes(searchLower) ||
          contact.phone?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply field and page filters
    if (Object.entries(fieldFilters).length > 0 || pageFilters.length > 0) {
      filteredList = filteredList.filter(contact => {
        // Apply field filters
        for (const [fieldName, filterValue] of Object.entries(fieldFilters)) {
          if (filterValue && filterValue !== '') {
            const contactValue = getLocalFieldValue(contact, fieldName);
            if (!contactValue || !contactValue.toString().toLowerCase().includes(filterValue.toLowerCase())) {
              return false;
            }
          }
        }

        // Apply page filters
        for (const pageFilter of pageFilters) {
          if (pageFilter.value && pageFilter.value !== '') {
            const contactValue = getLocalFieldValue(contact, pageFilter.fieldName);
            if (!contactValue || !contactValue.toString().toLowerCase().includes(pageFilter.value.toLowerCase())) {
              return false;
            }
          }
        }

        return true;
      });
    }

    if (isPaginated) {
      filteredList = filteredList.slice(startAndEnd.startIndex, startAndEnd.endIndex);
    }
    return filteredList;
  };

  const getColorForValue = (value) => {
    const colors = {
      'Full-Time': '#3b82f6',
      'Student': '#8b5cf6',
      'Retired': '#64748b',
      'Part-Time': '#06b6d4',
      'Affiliate': '#10b981',
      'Active': '#10b981',
      'Pending': '#f59e0b',
      'Inactive': '#64748b',
      'Ontario': '#ef4444',
      'Quebec': '#3b82f6',
      'British Columbia': '#10b981',
      'Alberta': '#f59e0b',
      'Manitoba': '#8b5cf6',
      'Saskatchewan': '#06b6d4',
      'Nova Scotia': '#ec4899',
      'New Brunswick': '#14b8a6',
      'Newfoundland and Labrador': '#f97316',
      'Prince Edward Island': '#84cc16',
      '18-24': '#06b6d4',
      '25-34': '#3b82f6',
      '35-44': '#8b5cf6',
      '45-54': '#ec4899',
      '55-64': '#f59e0b',
      '65+': '#ef4444',
      'N/A': '#94a3b8',
    };
    return colors[value] || '#94a3b8';
  };

  const ActiveFilterPills = () => {
    if (!showActiveFilters || activeFilters.size === 0) {
      return null;
    }

    return (
      <div className="flex items-center gap-2 flex-wrap mt-3">
        {Array.from(activeFilters.entries()).map(([type, filter]) => {
          const displayName = getFilterDisplayName(type);
          return (
            <div
              key={type}
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-200 hover:bg-blue-100 transition-colors rounded-full"
            >
              <button
                onClick={() => editFilter(type)}
                className="hover:text-blue-900 transition-colors"
                title="Edit filter"
              >
                ✏️
              </button>
              <span>{displayName}: {filter.label}</span>
              <button
                onClick={() => removeFilter(type)}
                className="hover:text-blue-900 transition-colors"
                title="Remove filter"
              >
                🗑️
              </button>
            </div>
          );
        })}
        {/* <button
          onClick={() => {
            setActiveFilters(new Map());
            setShowActiveFilters(false);
            setFieldFilters({});
            setCurrentView('all');
          }}
          className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Clear all filters
        </button> */}
      </div>
    );
  };

  const handleQuickFilterChange = (filterType, value) => {
    setQuickFilters(prev => ({
      ...prev,
      [filterType]: value
    }));

    // Also update active filters
    if (value) {
      setActiveFilters(prev => {
        const newFilters = new Map(prev);
        newFilters.set(filterType, {
          value: value,
          label: value
        });
        return newFilters;
      });
      setShowActiveFilters(true);
    } else {
      setActiveFilters(prev => {
        const newFilters = new Map(prev);
        newFilters.delete(filterType);
        return newFilters;
      });
    }

    setShowQuickFilterDropdown(null);
  };

  const toggleQuickFilterDropdown = (filterType) => {
    setShowQuickFilterDropdown(prev => prev === filterType ? null : filterType);
  };

  const clearQuickFilter = (filterType) => {
    setQuickFilters(prev => ({
      ...prev,
      [filterType]: ''
    }));

    setActiveFilters(prev => {
      const newFilters = new Map(prev);
      newFilters.delete(filterType);
      return newFilters;
    });
  };

  const quickFilterOptions = {
    status: ['Active', 'Inactive', 'Pending'],
    location: ['California', 'Texas', 'Washington', 'Oregon', 'Colorado'],
    joinDate: ['Last 30 days', 'Last 6 months', 'Last year', 'Last 2 years'],
    recentActivity: ['Active (30 days)', 'Active (90 days)', 'Inactive']
  };

  const QuickFilterDropdown = ({ filterType, options, value }) => {
    if (showQuickFilterDropdown !== filterType) return null;

    return (
      <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 min-w-[200px]">
        <div className="py-1">
          <button
            onClick={() => handleQuickFilterChange(filterType, '')}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            All
          </button>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleQuickFilterChange(filterType, option)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${value === option ? 'text-blue-600 font-semibold bg-blue-50' : 'text-slate-700'
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const [discussions, setDiscussions] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      const jsonUrl = `${process.env.PUBLIC_URL}/data/dockingItems.json`;
      const initialData = await fetch(jsonUrl);
      const data = await initialData.json();
      console.log(data);
      setDiscussions(data.contact_list);
    }

    fetchData();
  }, []);

  return sampleData && (
      <div className={`min-h-screen bg-slate-50 relative mt-8 transition-all duration-300 ${showSavePhrasePanel ? 'mr-96' : 'mr-0'}`} style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', cursor: resizingChart ? 'nwse-resize' : 'auto' }} onClick={handlePageClick} ref={contentRef}>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        ${resizingChart ? '* { user-select: none !important; }' : ''}
      `}</style>
        {showConfetti && <Confetti />}

        {markerPlacementMode && tempMarkerPosition && (
          <div
            className="absolute pointer-events-none z-[90]"
            style={{ left: tempMarkerPosition.x, top: tempMarkerPosition.y }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <div className="bg-white border-2 border-amber-500 rounded-full p-2 shadow-lg">
                <MapPin className="w-5 h-5 text-amber-500" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        )}

        {savedMarkers.map((marker) => (
          <div
            key={marker.id}
            className="absolute z-[90] cursor-pointer"
            style={{ left: marker.position.x, top: marker.position.y }}
            onClick={(e) => {
              e.stopPropagation();
              handleMarkerClick(marker);
            }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <div className="bg-white border-2 border-amber-600 rounded-full p-2 shadow-lg hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        ))}

        {/* Column Markers - Rendered at root level with fixed positioning */}
        {compareMode && getMarkerButton('TYPE', 'slate', BarChart3, '📊 Comparison: Compare member types', handleMemberTypeClick, step === 1, 'comparison')}
        {compareMode && getMarkerButton('JOIN DATE', 'blue', TrendingUp, '📈 Trend: Analyze membership growth over time', handleTrendClick, false, 'trend')}
        {compareMode && getMarkerButton('STATUS', filteredToProfessional ? 'purple' : 'red', filteredToProfessional ? Target : AlertTriangle, filteredToProfessional ? '🎯 Performance: Active vs expired rate' : '⚠️ Alert: Identify expired members (churn risk)', null, false, filteredToProfessional ? 'performance' : 'alert')}
        {compareMode && getMarkerButton('ENGAGEMENT', 'amber', Activity, '🔗 Correlation: Volunteer engagement vs retention', handleVolunteerMarkerClick, step === 4, 'correlation')}
        {compareMode && getMarkerButton('REVENUE', 'green', DollarSign, '💰 Financial: Revenue by member segment', null, false, 'financial')}
        {compareMode && filteredToProfessional && getMarkerButton('RENEWAL DATE', 'purple', BarChart3, '📊 Comparison: Compare by renewal date cohort', null, false, 'comparison')}

        {/* Header */}
        <div className="bg-white">
          <div className="max-w-[1600px] mx-auto px-8 py-5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200">
              <div className="flex items-center gap-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Contacts</h1>

                <div className="flex items-center gap-1">
                  <div className="bg-white">
                    <div className="flex items-center px-6 gap-2 overflow-x-auto overflow-y-visible scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

                      {/* Render tabs in the order specified by viewOrder state */}
                      {viewOrder.filter(viewId => viewId !== 'lapsed').map((viewId, index) => {
                        const view = views[viewId];
                        const isDragging = draggedView === viewId;
                        const isDropTarget = dropTargetView === viewId;
                        const currentIndex = viewOrder.indexOf(viewId);

                        return (
                          <div key={viewId} className="relative">
                            {/* Drop indicator before */}
                            {isDropTarget && draggedView !== viewId && (
                              <div className="absolute -left-1 top-0 bottom-0 w-1 bg-blue-500 rounded-full z-10"></div>
                            )}

                            <button
                              ref={(el) => viewButtonRefs.current[viewId] = el}
                              draggable
                              onDragStart={(e) => {
                                setDraggedView(viewId);
                                e.dataTransfer.effectAllowed = 'move';
                                e.currentTarget.style.opacity = '0.5';
                              }}
                              onDragEnd={(e) => {
                                setDraggedView(null);
                                setDropTargetView(null);
                                e.currentTarget.style.opacity = '1';
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                if (draggedView && draggedView !== viewId) {
                                  setDropTargetView(viewId);
                                }
                              }}
                              onDragLeave={(e) => {
                                if (e.currentTarget === e.target) {
                                  setDropTargetView(null);
                                }
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (draggedView && draggedView !== viewId) {
                                  // Reorder the views
                                  const newOrder = [...viewOrder];
                                  const draggedIndex = newOrder.indexOf(draggedView);
                                  const targetIndex = newOrder.indexOf(viewId);

                                  // Remove dragged item and insert at target position
                                  newOrder.splice(draggedIndex, 1);
                                  newOrder.splice(targetIndex, 0, draggedView);

                                  setViewOrder(newOrder);
                                }
                                setDraggedView(null);
                                setDropTargetView(null);
                              }}
                              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all ${currentView === viewId
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent'
                                } ${pinnedViews.includes(viewId) ? 'pl-8' : ''} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
                                } ${isDropTarget ? 'bg-blue-50' : ''}`}
                              onClick={() => selectViewTab(viewId)}
                            >
                              {pinnedViews.includes(viewId) && (
                                <span className="absolute top-2 -right-1 text-sm text-blue-500">📌</span>
                              )}
                              <div
                                className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openViewContextMenu(e, viewId);

                                  // Calculate dynamic position
                                  const buttonRect = viewButtonRefs.current[viewId]?.getBoundingClientRect();
                                  if (buttonRect) {
                                    setContextMenuPosition({
                                      top: buttonRect.bottom + 5,
                                      left: buttonRect.left
                                    });
                                  }
                                }}
                              >
                                <GripVertical className="w-4 h-4 text-slate-400 hover:cursor-pointer" />
                              </div>
                              <span>{view.name}</span>
                              <span className="text-xs text-slate-400">({view.count})</span>

                              {viewContextMenu === viewId && (
                                <div
                                  className="fixed text-black bg-white border border-slate-200 rounded-lg shadow-xl z-[9999] py-1 min-w-[150px]"
                                  style={{
                                    top: `${contextMenuPosition.top}px`,
                                    left: `${contextMenuPosition.left}px`
                                  }}
                                >
                                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 border-b border-gray-100">
                                    🔄 Duplicate view
                                  </button>
                                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 border-b border-gray-100">
                                    💾 Save view (overwrite)
                                  </button>
                                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 border-b border-gray-100">
                                    📝 Save as new page
                                  </button>
                                  <div className='border-t border-b pb-1 mt-1 border-gray-200'>
                                    <button
                                      onClick={() => togglePinView(viewId)}
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 border-b border-gray-100"
                                    >
                                      <span>📌</span>
                                      <span>{pinnedViews.includes(viewId) ? 'Unpin' : 'Pin'} to navigation</span>
                                    </button>
                                    <button
                                      onClick={() => setShowPinPanel(!showPinPanel)}
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 border-b border-gray-100"
                                    >
                                      <span>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="blue"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          style={{ width: '20px', height: '20px' }}
                                        >
                                          <path d="M12 17v5" />
                                          <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
                                        </svg>
                                      </span>
                                      <span>Pin as shortcut</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        // Move to the left
                                        if (currentIndex > 0) {
                                          const newOrder = [...viewOrder];
                                          [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
                                          setViewOrder(newOrder);
                                        }
                                      }}
                                      disabled={currentIndex === 0}
                                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 border-b border-gray-100 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                      ⬅️ Move to the left
                                    </button>
                                    <button
                                      onClick={() => {
                                        // Move to the right
                                        const visibleViews = viewOrder.filter(v => v !== 'lapsed');
                                        const visibleIndex = visibleViews.indexOf(viewId);
                                        if (visibleIndex < visibleViews.length - 1) {
                                          const newOrder = [...viewOrder];
                                          const actualCurrentIndex = newOrder.indexOf(viewId);
                                          const actualNextIndex = newOrder.indexOf(visibleViews[visibleIndex + 1]);
                                          [newOrder[actualCurrentIndex], newOrder[actualNextIndex]] = [newOrder[actualNextIndex], newOrder[actualCurrentIndex]];
                                          setViewOrder(newOrder);
                                        }
                                      }}
                                      disabled={viewOrder.filter(v => v !== 'lapsed').indexOf(viewId) === viewOrder.filter(v => v !== 'lapsed').length - 1}
                                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 border-b border-gray-100 ${viewOrder.filter(v => v !== 'lapsed').indexOf(viewId) === viewOrder.filter(v => v !== 'lapsed').length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                      ➡️ Move to the right
                                    </button>
                                  </div>
                                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2">
                                    🗑️ Trash View
                                  </button>
                                </div>
                              )}
                            </button>
                          </div>
                        );
                      })}

                      {/* More button with dropdown - keep as is */}
                      <button className="relative flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={(e) => {
                        e.stopPropagation();
                        setViewContextMenu(viewContextMenu === 'more' ? null : 'more');
                      }}>
                        <span>More</span>
                        <span className="text-xs">{viewContextMenu === 'more' ? '▲' : '▼'}</span>

                        {viewContextMenu === 'more' && (
                          <div className="fixed bg-white border border-slate-200 rounded-lg shadow-xl z-[9999] py-1 min-w-[200px]" style={{ top: '195px', left: '860px' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                selectViewTab('lapsed');
                              }}
                              className={`w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-between ${currentView === 'lapsed' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`}
                            >
                              <span className="flex items-center gap-2">
                                <span>{views.lapsed.name}</span>
                              </span>
                              <span className="text-xs text-slate-400 ml-2">({views.lapsed.count})</span>
                            </button>
                          </div>
                        )}
                      </button>

                      {/* Add New View Button */}
                      <div className="relative">
                        <button
                          className="flex items-center justify-center w-8 h-8 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors peer"
                          title="Save View"
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const tooltip = e.currentTarget.nextElementSibling;
                            if (tooltip) {
                              tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
                              tooltip.style.left = `${rect.left + rect.width / 2}px`;
                            }
                          }}
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                        <div className="fixed px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 peer-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[10000] -translate-x-1/2">
                          Save View
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-2.5 text-sm flex items-center gap-2">
                  {/* <Plus className="w-4 h-4 text-white" /> */}
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>New Contact</span>
                </span>
                <Ellipsis className='cursorPointer' size={18} />
                {/* <button
                onClick={() => setShowActionsPanel(!showActionsPanel)}
                className="p-2.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button> */}
              </div>
            </div>

            {/* new menu start */}

            {/* View Tabs */}

            {/* new menu end */}


            {/* Search bar start */}
            <div className="relative mt-4">
              {/* Inline Expandable Search Bar with Phrase Builder */}
              <div className={`transition-all duration-300 ${isPhraseMode || phraseChips.length > 0 ? 'w-full' : 'w-[650px]'} relative z-50`}>
                {/* Search Bar with Chips */}
                <div
                  className={`bg-white rounded-xl shadow-lg transition-all duration-300 ${
                    isPhraseMode ? '' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 flex-wrap p-4">
                    <Search className="text-gray-400 w-5 h-5 flex-shrink-0" />

                    {/* Load Query Button - Always Visible */}
                    <div className="relative">
                      <button
                        onClick={() => setShowLoadPhraseDropdown(!showLoadPhraseDropdown)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-medium transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Load Query
                      </button>

                      {/* Load Query Dropdown */}
                      {showLoadPhraseDropdown && (
                          <>
                            <div
                              className="fixed inset-0 z-30"
                              onClick={() => setShowLoadPhraseDropdown(false)}
                            />
                            <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-40 max-h-96 overflow-y-auto">
                              <div className="p-3 border-b border-slate-200">
                                <h3 className="text-sm font-semibold text-slate-900">Saved Queries</h3>
                                <p className="text-xs text-slate-500 mt-1">Select a query to load</p>
                              </div>
                              <div className="p-2">
                                {savedPhrases.length > 0 ? (
                                  savedPhrases.map((phrase) => (
                                    <button
                                      key={phrase.id}
                                      onClick={() => {
                                        setPhraseChips(phrase.chips.map(chip => ({ ...chip, id: Date.now() + Math.random() })));
                                        setShowLoadPhraseDropdown(false);
                                        setIsPhraseMode(true);
                                        setActiveColumn(0);
                                        setColumnSelections([null, null, null]);
                                        setColumnIndices([0, 0, 0]);
                                        setLockedSuggestions(null);
                                      }}
                                      className="w-full text-left px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-colors group"
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                          <div className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {phrase.name}
                                          </div>
                                          {phrase.description && (
                                            <div className="text-xs text-slate-500 mt-0.5">
                                              {phrase.description}
                                            </div>
                                          )}
                                          <div className="flex flex-wrap gap-1 mt-2">
                                            {phrase.chips.map((chip, idx) => (
                                              <div
                                                key={idx}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                                              >
                                                {chip.icon && <chip.icon className="w-3 h-3" />}
                                                <span>{chip.text}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0 mt-0.5" />
                                      </div>
                                    </button>
                                  ))
                                ) : (
                                  <div className="px-3 py-8 text-center">
                                    <p className="text-sm text-slate-500">No saved queries yet</p>
                                    <p className="text-xs text-slate-400 mt-1">Create a query and click Save</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                    </div>

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

                    {/* Preview Chips (greyed out) */}
                    {previewChips.map((chip, idx) => {
                      const Icon = chip.icon;
                      const isSelected = columnSelections[idx] !== null;
                      return (
                        <div
                          key={`preview-${idx}`}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-opacity ${
                            isSelected
                              ? 'bg-blue-100 text-blue-700 opacity-100'
                              : 'bg-gray-100 text-gray-400 opacity-60'
                          }`}
                        >
                          {Icon && <Icon className="w-3.5 h-3.5" />}
                          <span>{chip.label}</span>
                        </div>
                      );
                    })}

                    {/* Search Input with Autocomplete */}
                    <div className="flex-1 relative min-w-[200px]">
                      {/* Autocomplete suggestion overlay with 3-level preview */}
                      {isPhraseMode && phraseSearchText && (() => {
                        const suggestions = getSuggestionsForPhrase(phraseChips);
                        const currentSuggestions = suggestions.current;
                        const filteredSuggestions = currentSuggestions.filter(s =>
                          s.label.toLowerCase().startsWith(phraseSearchText.toLowerCase())
                        );
                        const firstMatch = filteredSuggestions[selectedSuggestionIndex];

                        if (firstMatch) {
                          // Get preview suggestions for next two levels
                          const nextSuggestion = suggestions.next && suggestions.next.length > 0 ? suggestions.next[0] : null;
                          const futureSuggestion = suggestions.future && suggestions.future.length > 0 ? suggestions.future[0] : null;

                          return (
                            <>
                              <div className="absolute inset-0 pointer-events-none flex items-center gap-1">
                                <span className="text-sm py-2 text-gray-900">
                                  {phraseSearchText}
                                  <span className="text-gray-400">{firstMatch.label.slice(phraseSearchText.length)}</span>
                                  {nextSuggestion && (
                                    <span className="text-gray-300"> {nextSuggestion.label}</span>
                                  )}
                                  {futureSuggestion && (
                                    <span className="text-gray-300"> {futureSuggestion.label}</span>
                                  )}
                                </span>
                              </div>
                              {nextSuggestion && futureSuggestion && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    // Add all three chips
                                    const chips = [firstMatch, nextSuggestion, futureSuggestion].map((suggestion, idx) => ({
                                      id: Date.now() + idx,
                                      text: suggestion.label,
                                      type: suggestion.type || 'connector',
                                      valueType: suggestion.valueType,
                                      icon: suggestion.icon,
                                      color: suggestion.color || 'gray',
                                      ...(suggestion.type === 'cohort' && { filterHint: suggestion.filterHint }),
                                      ...(suggestion.type === 'entityType' && { entityTypeValue: suggestion.entityTypeValue })
                                    }));
                                    setPhraseChips([...phraseChips, ...chips]);
                                    setPhraseSearchText('');
                                    setSelectedSuggestionIndex(0);
                                  }}
                                  title="Click here or press right arrow to select phrases"
                                  className="absolute left-0 top-0 h-full flex items-center ml-2 px-2 py-1 text-blue-500 hover:text-white hover:bg-blue-500 rounded transition-all cursor-pointer text-lg font-bold z-20"
                                  style={{ left: `${phraseSearchText.length + firstMatch.label.slice(phraseSearchText.length).length + (nextSuggestion ? nextSuggestion.label.length : 0) + (futureSuggestion ? futureSuggestion.label.length : 0) + 2}ch` }}
                                >
                                  →
                                </button>
                              )}
                            </>
                          );
                        }
                        return null;
                      })()}

                      <input
                        ref={phraseInputRef}
                        type="text"
                        placeholder={phraseChips.length === 0 ? "Search by Phrase" : "Continue phrase..."}
                        value={isPhraseMode ? phraseSearchText : searchValue}
                      onChange={(e) => {
                        if (isPhraseMode) {
                          setPhraseSearchText(e.target.value);
                          setSelectedSuggestionIndex(0); // Reset selection when typing

                          // Generate preview chips when typing in column 0
                          if (activeColumn === 0 && e.target.value && lockedSuggestions) {
                            const suggestions = lockedSuggestions;
                            const filteredCurrent = suggestions.current.filter(s =>
                              s.label.toLowerCase().startsWith(e.target.value.toLowerCase())
                            );

                            if (filteredCurrent.length > 0 && suggestions.next.length > 0 && suggestions.future.length > 0) {
                              const preview = [
                                filteredCurrent[0],
                                suggestions.next[0],
                                suggestions.future[0]
                              ];
                              setPreviewChips(preview);
                            } else {
                              setPreviewChips([]);
                            }
                          } else {
                            setPreviewChips([]);
                          }
                        } else {
                          setSearchValue(e.target.value);
                        }
                      }}
                      onFocus={() => {
                        setIsPhraseMode(true);
                        setSelectedSuggestionIndex(0);
                        setActiveColumn(0);
                        setColumnSelections([null, null, null]);
                        setColumnIndices([0, 0, 0]);
                        // Lock suggestions when entering phrase mode
                        if (!lockedSuggestions) {
                          setLockedSuggestions(getSuggestionsForPhrase(phraseChips));
                          // Mark where this selection round starts
                          setSelectionRoundStart(phraseChips.length);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (!isPhraseMode) return;

                        // Use locked suggestions (should already be set from onFocus)
                        const suggestions = lockedSuggestions || getSuggestionsForPhrase(phraseChips);

                        const allSuggestions = [
                          suggestions.current.slice(0, 6),
                          suggestions.next.slice(0, 6),
                          suggestions.future.slice(0, 6)
                        ];

                        // Filter current column suggestions based on search text
                        if (activeColumn === 0 && phraseSearchText) {
                          allSuggestions[0] = allSuggestions[0].filter(s =>
                            s.label.toLowerCase().startsWith(phraseSearchText.toLowerCase())
                          );
                        }

                        const currentColumnSuggestions = allSuggestions[activeColumn];

                        if (e.key === 'Tab' && phraseChips.length > 0) {
                          e.preventDefault();
                          applyButtonRef.current?.focus();
                        } else if (e.key === 'ArrowRight') {
                          // Move to next column (skip disabled columns)
                          e.preventDefault();
                          let nextCol = activeColumn + 1;
                          while (nextCol < 3 && columnSelections[nextCol] !== null) {
                            nextCol++;
                          }
                          if (nextCol < 3) {
                            setActiveColumn(nextCol);
                          }
                        } else if (e.key === 'ArrowLeft') {
                          // Move to previous column (skip disabled columns)
                          e.preventDefault();
                          let prevCol = activeColumn - 1;
                          while (prevCol >= 0 && columnSelections[prevCol] !== null) {
                            prevCol--;
                          }
                          if (prevCol >= 0) {
                            setActiveColumn(prevCol);
                          }
                        } else if (e.key === 'ArrowDown') {
                          // Navigate down within active column
                          e.preventDefault();
                          const newIndices = [...columnIndices];
                          newIndices[activeColumn] = Math.min(
                            newIndices[activeColumn] + 1,
                            currentColumnSuggestions.length - 1
                          );
                          setColumnIndices(newIndices);
                        } else if (e.key === 'ArrowUp') {
                          // Navigate up within active column
                          e.preventDefault();
                          const newIndices = [...columnIndices];
                          newIndices[activeColumn] = Math.max(0, newIndices[activeColumn] - 1);
                          setColumnIndices(newIndices);
                        } else if (e.key === 'Enter' && currentColumnSuggestions.length > 0) {
                          // Select item from active column and add chips cumulatively
                          e.preventDefault();
                          const selectedSuggestion = currentColumnSuggestions[columnIndices[activeColumn]];
                          const newSelections = [...columnSelections];

                          // Auto-select first items from previous columns if not already selected
                          for (let i = 0; i < activeColumn; i++) {
                            if (!newSelections[i] && allSuggestions[i].length > 0) {
                              newSelections[i] = allSuggestions[i][0];
                            }
                          }

                          // Select the current item
                          newSelections[activeColumn] = selectedSuggestion;
                          setColumnSelections(newSelections);

                          // Add chips cumulatively based on active column
                          // Column 0: add 1 chip, Column 1: add 2 chips, Column 2: add 3 chips
                          const chipsToAdd = [];
                          for (let i = 0; i <= activeColumn; i++) {
                            if (newSelections[i]) {
                              const suggestion = newSelections[i];
                              chipsToAdd.push({
                                id: Date.now() + i + Math.random(),
                                text: suggestion.label,
                                type: suggestion.type || 'connector',
                                valueType: suggestion.valueType,
                                icon: suggestion.icon,
                                color: suggestion.color || 'gray',
                                ...(suggestion.type === 'cohort' && { filterHint: suggestion.filterHint }),
                                ...(suggestion.type === 'entityType' && { entityTypeValue: suggestion.entityTypeValue })
                              });
                            }
                          }

                          // Replace chips from current selection round instead of appending
                          const previousChips = phraseChips.slice(0, selectionRoundStart);
                          setPhraseChips([...previousChips, ...chipsToAdd]);
                          setPhraseSearchText('');
                          setPreviewChips([]); // Clear preview chips after selection

                          // If this was the 3rd column (column 2), reset everything
                          if (activeColumn === 2) {
                            setColumnSelections([null, null, null]);
                            setColumnIndices([0, 0, 0]);
                            setActiveColumn(0);
                            setLockedSuggestions(null);
                            // Set start position for next selection round
                            setSelectionRoundStart(selectionRoundStart + chipsToAdd.length);
                          } else {
                            // Otherwise, move to next column
                            setActiveColumn(activeColumn + 1);
                          }
                        } else if (e.key === 'Escape') {
                          setIsPhraseMode(false);
                          setPhraseSearchText('');
                          setColumnSelections([null, null, null]);
                          setColumnIndices([0, 0, 0]);
                          setActiveColumn(0);
                          setLockedSuggestions(null);
                          setSelectionRoundStart(0);
                          setPreviewChips([]);
                        } else if (e.key === 'Backspace' && phraseSearchText === '' && phraseChips.length > 0) {
                          setPhraseChips(phraseChips.slice(0, -1));
                        }
                      }}
                      className="w-full outline-none text-sm py-2 bg-transparent relative z-10"
                    />
                    </div>

                    {/* Apply/Save/Close Buttons when in phrase mode */}
                    {isPhraseMode && (
                      <>
                        {phraseChips.length > 0 ? (
                          <>
                            <button
                              ref={applyButtonRef}
                              onClick={() => {
                                // Convert chips to phrase filters
                                const phraseText = phraseChips.map(chip => chip.text).join(' ');
                                setPhraseFilters([{ label: phraseText, chips: phraseChips }]);
                                setIsPhraseMode(false);
                                setPreviewChips([]);
                              }}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex-shrink-0"
                            >
                              Apply
                            </button>
                            <button
                              onClick={() => {
                                setShowSavePhrasePanel(true);
                              }}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex-shrink-0"
                            >
                              Save
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setIsPhraseMode(false);
                              setPhraseSearchText('');
                              setPreviewChips([]);
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {/* Inline 3-Level Progressive Disclosure Panel */}
                  {isPhraseMode && (
                    <div className="absolute left-1/2 -translate-x-1/2 w-screen bg-white">
                      <div className="max-w-[1600px] mx-auto px-8 py-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-semibold text-gray-600">
                            Build Your Phrase
                          </h3>
                          <div className="text-xs text-gray-400">
                            ↑↓ navigate • ←→ change column • Enter select
                          </div>
                        </div>

                        {/* 3-Column Suggestion Rail */}
                        <div className="grid grid-cols-3 gap-3">
                          {(() => {
                            // Use locked suggestions if available, otherwise get fresh
                            const suggestions = lockedSuggestions || getSuggestionsForPhrase(phraseChips);
                            const allSuggestions = [
                              phraseSearchText
                                ? suggestions.current.filter(s => s.label.toLowerCase().startsWith(phraseSearchText.toLowerCase()))
                                : suggestions.current.slice(0, 6),
                              suggestions.next.slice(0, 6),
                              suggestions.future.slice(0, 6)
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
                                      : 'opacity-30'
                                  }`}
                                >
                                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
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

                                            // Add chips cumulatively based on which column was clicked
                                            // Column 0: add 1 chip, Column 1: add 2 chips, Column 2: add 3 chips
                                            const chipsToAdd = [];
                                            for (let i = 0; i <= columnIdx; i++) {
                                              if (newSelections[i]) {
                                                const sel = newSelections[i];
                                                chipsToAdd.push({
                                                  id: Date.now() + i + Math.random(),
                                                  text: sel.label,
                                                  type: sel.type || 'connector',
                                                  valueType: sel.valueType,
                                                  icon: sel.icon,
                                                  color: sel.color || 'gray',
                                                  ...(sel.type === 'cohort' && { filterHint: sel.filterHint }),
                                                  ...(sel.type === 'entityType' && { entityTypeValue: sel.entityTypeValue })
                                                });
                                              }
                                            }

                                            // Replace chips from current selection round instead of appending
                                            const previousChips = phraseChips.slice(0, selectionRoundStart);
                                            setPhraseChips([...previousChips, ...chipsToAdd]);
                                            setPhraseSearchText('');
                                            setPreviewChips([]); // Clear preview chips after selection

                                            // If this was the 3rd column (column 2), reset everything
                                            if (columnIdx === 2) {
                                              setColumnSelections([null, null, null]);
                                              setColumnIndices([0, 0, 0]);
                                              setActiveColumn(0);
                                              setLockedSuggestions(null);
                                              // Set start position for next selection round
                                              setSelectionRoundStart(selectionRoundStart + chipsToAdd.length);
                                            } else {
                                              // Otherwise, move to next column
                                              setActiveColumn(columnIdx + 1);
                                            }
                                          }}
                                          className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-all text-left ${
                                            isHighlighted
                                              ? 'bg-blue-500 text-white'
                                              : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                                          }`}
                                        >
                                          {Icon && <Icon className="w-4 h-4" />}
                                          <span>{suggestion.label}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>

                        {/* Actions */}
                        {phraseChips.length > 0 && (
                          <div className="mt-4 flex items-center gap-2">
                            <button
                              onClick={() => {
                                setPhraseChips([]);
                                setPhraseSearchText('');
                                setLockedSuggestions(null);
                                setColumnSelections([null, null, null]);
                                setColumnIndices([0, 0, 0]);
                                setActiveColumn(0);
                                setSelectionRoundStart(0);
                                setPreviewChips([]);
                              }}
                              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                            >
                              Clear All
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

              {/* Translucent backdrop overlay for bottom part when search panel is open */}
              {isPhraseMode && (
                <div
                  className="fixed inset-x-0 bottom-0 bg-black/20 backdrop-blur-sm z-30"
                  style={{ top: '400px' }}
                  onClick={() => {
                    setIsPhraseMode(false);
                    setPhraseSearchText('');
                    setPreviewChips([]);
                  }}
                />
              )}

              {/* Show active phrase filters */}
              {phraseFilters.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-blue-700">Active Filters</span>
                    <button
                      onClick={() => setPhraseFilters([])}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-1">
                    {phraseFilters.map((filter, idx) => (
                      <div key={idx} className="text-xs text-blue-800 bg-white px-2 py-1 rounded">
                        {filter.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Filter Mode Toggle - Right Side */}
              <div className='flex justify-end items-center mt-3'>
                <div className="flex items-center gap-3">
                  {/* Filter Mode Toggle - Moved to far right */}
                  <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-300 p-0.5">
                    <button
                      onClick={() => setFilterMode('phrase')}
                      className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                        ${filterMode === 'phrase'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      By Phrase
                    </button>
                    <button
                      onClick={() => setFilterMode('fields')}
                      className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                        ${filterMode === 'fields'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Filter className="w-3.5 h-3.5" />
                      By Fields
                    </button>
                  </div>

                  <ChevronsLeft size={18} />
                  <Search size={18} />
                  <Ellipsis onClick={() => setShowFieldsPanel(true)} className='cursorPointer' size={18} />
                </div>
              </div>

              {/* Active Filter Pills (shown in Fields mode) */}
              {filterMode === 'fields' && <ActiveFilterPills />}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-[1600px] mx-auto py-6">
          <div className="flex gap-4">
            {pageFilters.length > 0 && (
              <div className="w-72 flex-shrink-0">
                <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-900">Filters</h3>
                    <button
                      onClick={() => setPageFilters([])}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Clear all
                    </button>
                  </div>
                  {pageFilters.map((filter) => (
                    <div key={filter.fieldName} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {filter.fieldName}
                        </label>
                        <button
                          onClick={() => removePageFilter(filter.fieldName)}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {filter.fieldType === 'select' || filter.fieldType === 'multi-select' ? (
                        <select
                          value={filter.value}
                          onChange={(e) => updatePageFilter(filter.fieldName, e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="">All</option>
                          {filter.fieldName === 'Type' && (
                            <>
                              <option value="Full-Time">Full-Time</option>
                              <option value="Student">Student</option>
                              <option value="Retired">Retired</option>
                              <option value="Part-Time">Part-Time</option>
                              <option value="Affiliate">Affiliate</option>
                            </>
                          )}
                          {filter.fieldName === 'Status' && (
                            <>
                              <option value="Active">Active</option>
                              <option value="Pending">Pending</option>
                              <option value="Inactive">Inactive</option>
                            </>
                          )}
                          {filter.fieldName === 'Age Group' && (
                            <>
                              <option value="18-24">18-24</option>
                              <option value="25-34">25-34</option>
                              <option value="35-44">35-44</option>
                              <option value="45-54">45-54</option>
                              <option value="55-64">55-64</option>
                              <option value="65+">65+</option>
                              <option value="N/A">N/A</option>
                            </>
                          )}
                          {filter.fieldName === 'Renewal Type' && (
                            <>
                              <option value="Full-Time">Full-Time</option>
                              <option value="Student">Student</option>
                              <option value="Retired">Retired</option>
                              <option value="Part-Time">Part-Time</option>
                              <option value="Affiliate">Affiliate</option>
                            </>
                          )}
                        </select>
                      ) : (
                        <input
                          type="text"
                          placeholder={`Filter ${filter.fieldName.toLowerCase()}...`}
                          value={filter.value}
                          onChange={(e) => updatePageFilter(filter.fieldName, e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-slate-400"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1">
              {activeCharts.length > 0 && (
                <div className="mb-4">
                  <div className="grid grid-cols-12 gap-4">
                    {activeCharts.map((chart) => {
                      const data = chart.field ? getChartData(chart.field) : [];
                      const isMapChart = chart.type === 'map';
                      const isNewMapChart = chart.type === 'newMap';
                      const isSummaryTable = chart.type === 'summary';
                      const summaryData = isSummaryTable ? getSummaryData(chart.field, chart.crossTabField) : null;
                      const span = chart.columnSpan || 4;
                      // Map span to Tailwind class
                      const spanClasses = {
                        4: 'col-span-4',
                        5: 'col-span-5',
                        6: 'col-span-6',
                        7: 'col-span-7',
                        8: 'col-span-8',
                        9: 'col-span-9',
                        10: 'col-span-10',
                        11: 'col-span-11',
                        12: 'col-span-12'
                      };
                      const columnSpanClass = spanClasses[span] || 'col-span-4';
                      const showDropBefore = dropPosition?.chartId === chart.id && dropPosition?.position === 'before' && dropPosition?.mode === 'reorder';
                      const showDropAfter = dropPosition?.chartId === chart.id && dropPosition?.position === 'after' && dropPosition?.mode === 'reorder';
                      const showMergeHighlight = dropPosition?.chartId === chart.id && dropPosition?.mode === 'merge';

                      return (
                        <div key={chart.id} className={`relative ${columnSpanClass}`}>
                          {/* Drop indicator before */}
                          {showDropBefore && (
                            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-blue-500 rounded-full z-10"></div>
                          )}

                          <div
                            className={`bg-white border-2 rounded-lg p-5 transition-all relative h-full ${showMergeHighlight ? 'border-purple-500 bg-purple-50 shadow-lg' :
                              dragOverSummary === chart.id ? 'border-green-500 bg-green-50' :
                                'border-slate-200'
                              } ${(isMapChart || isNewMapChart || isSummaryTable) ? 'cursor-grab active:cursor-grabbing' : ''}
                                                        `}
                            draggable={isMapChart || isNewMapChart || isSummaryTable}
                            title={(isMapChart || isNewMapChart || isSummaryTable) ? 'Drag to reorder' : ''}
                            onDragStart={(e) => {
                              if (isMapChart || isNewMapChart || isSummaryTable) {
                                handleChartDragStart(e, chart.id);
                              }
                            }}
                            onDragOver={(e) => {
                              const allowedFields = ['Type', 'Status', 'Province/State', 'Age Group', 'Renewal Type', 'Location'];
                              if (isSummaryTable && !chart.crossTabField && draggedChart && draggedField && allowedFields.includes(draggedField) && draggedField !== chart.field) {
                                e.preventDefault();
                                e.stopPropagation();
                                e.dataTransfer.dropEffect = 'copy';
                                setDragOverSummary(chart.id);
                              } else if (draggedChart && draggedChart !== chart.id) {
                                handleChartDragOver(e, chart.id);
                              }
                            }}
                            onDragLeave={(e) => {
                              if (isSummaryTable) {
                                handleSummaryDragLeave();
                              }
                              handleChartDragLeave();
                            }}
                            onDrop={(e) => {
                              if (isSummaryTable && draggedChart && draggedField) {
                                handleSummaryDrop(e, chart.id);
                              } else if (draggedChart) {
                                handleChartDrop(e, chart.id);
                              }
                            }}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                {(isMapChart || isNewMapChart || isSummaryTable) && (
                                  <GripVertical className="w-4 h-4 text-slate-400" />
                                )}
                                {!isMapChart && !isNewMapChart && !isSummaryTable && (
                                  <div className="relative">
                                    <div
                                      draggable
                                      onDragStart={(e) => {
                                        e.stopPropagation();
                                        handleChartDragStart(e, chart.id);
                                      }}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (chart.type === 'merged') {
                                          setShowUnmergeMenu(showUnmergeMenu === chart.id ? null : chart.id);
                                          setShowChartTypeMenu(null);
                                        } else {
                                          setShowChartTypeMenu(showChartTypeMenu === chart.id ? null : chart.id);
                                          setShowUnmergeMenu(null);
                                        }
                                      }}
                                      className="cursor-grab active:cursor-grabbing p-2 bg-slate-200 hover:bg-slate-300 rounded border border-slate-400"
                                      title={chart.type === 'merged' ? 'Drag to reorder | Click for options' : 'Drag to reorder or merge | Click to change chart type'}
                                    >
                                      <GripVertical className="w-4 h-4 text-slate-700" />
                                    </div>
                                    {showChartTypeMenu === chart.id && chart.type === 'single' && (
                                      <>
                                        <div
                                          className="fixed inset-0 z-10"
                                          onClick={() => setShowChartTypeMenu(null)}
                                        />
                                        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 min-w-[140px]">
                                          {chart.field !== 'Id' && (
                                            <>
                                              <button
                                                onClick={() => changeChartType(chart.id, 'bar')}
                                                className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 flex items-center gap-2 ${chart.visualizationType === 'bar' ? 'text-blue-600 bg-blue-50' : 'text-slate-700'}`}
                                              >
                                                Bar Chart
                                              </button>
                                              <button
                                                onClick={() => changeChartType(chart.id, 'pie')}
                                                className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 flex items-center gap-2 ${chart.visualizationType === 'pie' ? 'text-blue-600 bg-blue-50' : 'text-slate-700'}`}
                                              >
                                                Pie Chart
                                              </button>
                                            </>
                                          )}
                                          <button
                                            onClick={() => changeChartType(chart.id, 'count')}
                                            className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 flex items-center gap-2 ${chart.visualizationType === 'count' ? 'text-blue-600 bg-blue-50' : 'text-slate-700'}`}
                                          >
                                            Count
                                          </button>
                                        </div>
                                      </>
                                    )}
                                    {showUnmergeMenu === chart.id && chart.type === 'merged' && (
                                      <>
                                        <div
                                          className="fixed inset-0 z-10"
                                          onClick={() => setShowUnmergeMenu(null)}
                                        />
                                        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 min-w-[140px]">
                                          <button
                                            onClick={() => unmergeChart(chart.id)}
                                            className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                          >
                                            <X className="w-4 h-4" />
                                            Unmerge
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}
                                <h3 className="text-sm font-bold text-slate-900">
                                  {chart.type === 'merged' ? `${chart.primaryField} by ${chart.secondaryField}` :
                                    chart.type === 'map' ? `${chart.field} Map` :
                                      chart.type === 'newMap' ? `🗺️ ${chart.field} Distribution` :
                                        chart.type === 'summary' ? `${chart.field} Summary${chart.crossTabField ? ` by ${chart.crossTabField}` : ''}` :
                                          chart.field}
                                </h3>
                                {showMergeHighlight && (
                                  <span className="ml-2 px-2 py-1 text-xs font-bold bg-purple-100 text-purple-700 rounded animate-pulse">
                                    Merge charts
                                  </span>
                                )}
                                {isSummaryTable && !chart.crossTabField && !showMergeHighlight && (
                                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                                    Drop field or chart here
                                  </span>
                                )}
                                {(activeFieldFiltersCount > 0 || activePageFiltersCount > 0) && !showMergeHighlight && (
                                  <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded">
                                    Filtered
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => removeChart(chart.id)}
                                className="text-slate-400 hover:text-slate-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {chart.type === 'summary' ? (
                              <div className="overflow-auto">
                                {!chart.crossTabField ? (
                                  <table className="w-full">
                                    <thead>
                                      <tr className="border-b-2 border-slate-200">
                                        <th className="text-left py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider">
                                          {chart.field}
                                        </th>
                                        <th className="text-right py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider">
                                          Count
                                        </th>
                                        <th className="text-right py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider">
                                          Percentage
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {summaryData.rows.map((row, index) => (
                                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                                          <td className="py-3 px-4 text-sm font-medium text-slate-900">{row.name}</td>
                                          <td className="py-3 px-4 text-sm font-bold text-slate-900 text-right">{row.count}</td>
                                          <td className="py-3 px-4 text-sm text-slate-600 text-right">{row.percentage}%</td>
                                        </tr>
                                      ))}
                                      <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold">
                                        <td className="py-3 px-4 text-sm text-slate-900">TOTAL</td>
                                        <td className="py-3 px-4 text-sm text-slate-900 text-right">{summaryData.total}</td>
                                        <td className="py-3 px-4 text-sm text-slate-900 text-right">100%</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                ) : (
                                  <table className="w-full">
                                    <thead>
                                      <tr className="border-b-2 border-slate-200">
                                        <th className="text-left py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider">
                                          {chart.field}
                                        </th>
                                        {summaryData.columns.map((col, index) => (
                                          <th key={index} className="text-right py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            {col}
                                          </th>
                                        ))}
                                        <th className="text-right py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50">
                                          Total
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {summaryData.rows.map((row, index) => (
                                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                                          <td className="py-3 px-4 text-sm font-medium text-slate-900">{row.name}</td>
                                          {summaryData.columns.map((col, colIndex) => (
                                            <td key={colIndex} className="py-3 px-4 text-sm text-slate-700 text-right">
                                              {row[col] || 0}
                                            </td>
                                          ))}
                                          <td className="py-3 px-4 text-sm font-bold text-slate-900 text-right bg-slate-50">
                                            {row.total}
                                          </td>
                                        </tr>
                                      ))}
                                      <tr className="border-t-2 border-slate-300 bg-slate-100 font-bold">
                                        <td className="py-3 px-4 text-sm text-slate-900">TOTAL</td>
                                        {summaryData.columns.map((col, colIndex) => {
                                          const colTotal = summaryData.rows.reduce((sum, row) => sum + (row[col] || 0), 0);
                                          return (
                                            <td key={colIndex} className="py-3 px-4 text-sm text-slate-900 text-right">
                                              {colTotal}
                                            </td>
                                          );
                                        })}
                                        <td className="py-3 px-4 text-sm text-slate-900 text-right bg-slate-200">
                                          {summaryData.total}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            ) : chart.type === 'map' ? (
                              <div className="relative bg-slate-100 rounded-lg" style={{ height: '400px' }}>
                                <svg width="100%" height="400" viewBox="0 0 1200 400" className="rounded-lg">
                                  <rect width="1200" height="400" fill="#e2e8f0" />

                                  <path d="M 200,150 L 350,140 L 400,180 L 380,220 L 320,240 L 250,230 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
                                  <path d="M 400,180 L 500,160 L 580,190 L 560,240 L 480,260 L 400,240 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
                                  <path d="M 580,190 L 680,170 L 760,200 L 740,250 L 660,270 L 580,250 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
                                  <path d="M 760,200 L 860,180 L 940,210 L 920,260 L 840,280 L 760,260 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
                                  <path d="M 940,210 L 1040,190 L 1100,220 L 1080,270 L 1000,290 L 940,270 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />

                                  {(() => {
                                    const mapData = getMapData(chart.field);
                                    const locations = {
                                      'Ontario': { x: 700, y: 210 },
                                      'Quebec': { x: 850, y: 220 },
                                      'British Columbia': { x: 300, y: 190 },
                                      'Alberta': { x: 500, y: 200 },
                                      'Manitoba': { x: 600, y: 220 },
                                      'Saskatchewan': { x: 550, y: 210 },
                                    };

                                    return Object.entries(mapData).map(([location, count]) => {
                                      const pos = locations[location] || { x: 600, y: 200 };
                                      const radius = 20 + (count * 10);

                                      return (
                                        <g key={location}>
                                          <circle
                                            cx={pos.x}
                                            cy={pos.y}
                                            r={radius}
                                            fill="#3b82f6"
                                            opacity="0.6"
                                            stroke="#1e40af"
                                            strokeWidth="2"
                                          />
                                          <text
                                            x={pos.x}
                                            y={pos.y}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fill="white"
                                            fontSize="18"
                                            fontWeight="bold"
                                          >
                                            {count}
                                          </text>
                                          <text
                                            x={pos.x}
                                            y={pos.y + radius + 15}
                                            textAnchor="middle"
                                            fill="#1e293b"
                                            fontSize="12"
                                            fontWeight="600"
                                          >
                                            {location}
                                          </text>
                                        </g>
                                      );
                                    });
                                  })()}
                                </svg>

                                <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-slate-200">
                                  <div className="text-xs font-bold text-slate-700 mb-2">Legend</div>
                                  <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <div className="w-6 h-6 rounded-full bg-blue-500 opacity-60 border-2 border-blue-800 flex items-center justify-center text-white font-bold text-[10px]">
                                      #
                                    </div>
                                    <span>Contact count by location</span>
                                  </div>
                                </div>
                              </div>
                            ) : chart.type === 'newMap' ? (
                              <LeafletMapComponent
                                key={`leaflet-${chart.id}`}
                                chartId={chart.id}
                                mapData={getMapData(chart.field)}
                              />
                            ) : chart.type === 'merged' ? (
                              <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={getMergedChartData(chart.primaryField, chart.secondaryField)}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                  <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                  />
                                  <YAxis tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                                  <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                                  {getSecondaryKeys(chart.primaryField, chart.secondaryField).map((key) => (
                                    <Bar key={key} dataKey={key} stackId="a" fill={getColorForValue(key)} />
                                  ))}
                                </BarChart>
                              </ResponsiveContainer>
                            ) : chart.visualizationType === 'count' ? (
                              <div className="flex items-center justify-center h-[250px]">
                                <div className="text-center">
                                  <div className="text-6xl font-bold text-slate-900 mb-2">{getFilteredContacts().length}</div>
                                  <div className="text-sm font-medium text-slate-500">Total Records</div>
                                </div>
                              </div>
                            ) : chart.visualizationType === 'pie' ? (
                              <div className="flex items-center gap-6">
                                <ResponsiveContainer width="60%" height={250}>
                                  <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                                    <Pie
                                      data={data}
                                      cx="50%"
                                      cy="50%"
                                      labelLine={false}
                                      outerRadius={70}
                                      fill="#8884d8"
                                      dataKey="value"
                                    >
                                      {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getColorForValue(entry.name)} />
                                      ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                                  </PieChart>
                                </ResponsiveContainer>
                                <div className="flex-1 space-y-2">
                                  {data.map((item, index) => {
                                    const total = data.reduce((sum, d) => sum + d.value, 0);
                                    const percentage = ((item.value / total) * 100).toFixed(1);
                                    return (
                                      <div key={index} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getColorForValue(item.name) }} />
                                          <span className="font-medium text-slate-700">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <span className="font-bold text-slate-900">{item.value}</span>
                                          <span className="text-slate-500 min-w-[3rem] text-right">{percentage}%</span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : chart.visualizationType === 'bar' ? (
                              <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={data}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                  <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                  />
                                  <YAxis tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                                    {data.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={getColorForValue(entry.name)} />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            ) : null}

                            {/* Resize Handle */}
                            <div
                              draggable={false}
                              className="absolute bottom-2 right-2 w-8 h-8 cursor-nwse-resize group/resize hover:bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:border-slate-400 transition-all z-50"
                              style={{ pointerEvents: 'auto' }}
                              onMouseDown={(e) => {
                                handleResizeStart(e, chart.id, chart.columnSpan || 1);
                              }}
                              onDragStart={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                return false;
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                // Click cycles through sizes: 4 → 8 → 12 → 4
                                const currentSpan = chart.columnSpan || 4;
                                let nextSpan;
                                if (currentSpan === 4) nextSpan = 8;
                                else if (currentSpan === 8) nextSpan = 12;
                                else nextSpan = 4;
                                resizeChart(chart.id, nextSpan);
                              }}
                              title={`Current: ${chart.columnSpan || 4}/12 columns. Drag to resize or click to cycle.`}
                            >
                              <svg className="w-4 h-4 text-slate-400 group-hover/resize:text-slate-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                              </svg>
                            </div>
                          </div>

                          {/* Drop indicator after */}
                          {showDropAfter && (
                            <div className="absolute -right-2 top-0 bottom-0 w-1 bg-blue-500 rounded-full z-10"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  {/* Marker Legend Panel */}
                  {compareMode && (
                    <div
                      onMouseDown={handleLegendMouseDown}
                      style={{
                        position: 'fixed',
                        left: `${legendPosition.x}px`,
                        top: `${legendPosition.y}px`,
                        width: '340px',
                        maxHeight: legendMinimized ? '56px' : '360px',
                        zIndex: 200,
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                        transition: isDraggingLegend ? 'none' : 'max-height 0.2s ease',
                        cursor: isDraggingLegend ? 'grabbing' : 'default'
                      }}>
                      <div className="legend-drag-handle" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
                        borderBottom: '1px solid #e5e7eb',
                        cursor: 'grab'
                      }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>Data Markers</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLegendMinimized(!legendMinimized);
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#6b7280',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              borderRadius: '4px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title={legendMinimized ? 'Expand' : 'Minimize'}
                          >
                            {legendMinimized ? (
                              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            ) : (
                              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      {!legendMinimized && (
                        <div style={{ padding: '16px', maxHeight: '380px', overflowY: 'hidden' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '28px', height: '28px', border: '1px solid #475569', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <BarChart3 className="w-4 h-4 text-slate-600" strokeWidth={2} />
                              </div>
                              <div>
                                <div style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>Comparison</div>
                                <div style={{ color: '#6b7280', fontSize: '11px' }}>Compare segments side-by-side</div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '28px', height: '28px', border: '1px solid #2563eb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <TrendingUp className="w-4 h-4 text-blue-600" strokeWidth={2} />
                              </div>
                              <div>
                                <div style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>Trend</div>
                                <div style={{ color: '#6b7280', fontSize: '11px' }}>Growth, decline over time</div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '28px', height: '28px', border: '1px solid #dc2626', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <AlertTriangle className="w-4 h-4 text-red-600" strokeWidth={2} />
                              </div>
                              <div>
                                <div style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>Alert</div>
                                <div style={{ color: '#6b7280', fontSize: '11px' }}>Risks, opportunities, anomalies</div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '28px', height: '28px', border: '1px solid #d97706', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: 'rotate(45deg)' }}>
                                <Activity className="w-4 h-4 text-amber-600" strokeWidth={2} style={{ transform: 'rotate(-45deg)' }} />
                              </div>
                              <div>
                                <div style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>Correlation</div>
                                <div style={{ color: '#6b7280', fontSize: '11px' }}>Relationships between factors</div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '28px', height: '28px', border: '1px solid #9333ea', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Target className="w-4 h-4 text-purple-600" strokeWidth={2} />
                              </div>
                              <div>
                                <div style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>Performance</div>
                                <div style={{ color: '#6b7280', fontSize: '11px' }}>Goals, top/bottom performers</div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '28px', height: '28px', border: '1px solid #16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <DollarSign className="w-4 h-4 text-green-600" strokeWidth={2} />
                              </div>
                              <div>
                                <div style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>Financial</div>
                                <div style={{ color: '#6b7280', fontSize: '11px' }}>Revenue, costs, ROI</div>
                              </div>
                            </div>
                          </div>

                          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e5e7eb', fontSize: '11px', color: '#6b7280' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                              <span>Yellow pins = Saved insights</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-sm text-slate-900">
                    {step === 0 && "👋 Hover over the toolbar icons below, then click Compare mode (target icon) to begin"}
                    {step === 1 && "✨ Compare mode activated! Notice the Marker Legend (bottom-right) shows 6 marker types. Click the gray square (Comparison) above Member Type column"}
                    {step === 2 && "📊 Chart added! Click the Professional (red) bar to investigate"}
                    {step === 3 && "🔍 Filtering to Professional members..."}
                    {step === 4 && "⚡ The Volunteer Activity marker (circle = Correlation) is pulsing—click it to see the insight"}
                    {step === 5 && "💡 Insight panel opened! Click 'Add marker to page'"}
                    {step === 6 && "📍 Click anywhere on the page to place your marker, then click 'Save'"}
                    {step === 7 && "🎯 Marker saved! Click the marker pin to open details"}
                    {step === 8 && "📋 Tasks generated! Now click 'Assign to Agentic Team'"}
                    {step === 9 && "✅ Agents assigned! Click 'Approve to Proceed'"}
                    {step >= 10 && agentProgress < 100 && "⚙️ Agents are building your volunteer activation program..."}
                    {step >= 10 && agentProgress === 100 && "🎉 Complete! The system built a full program in minutes"}
                  </div>
                </div>

                {showMemberTypeChart && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
                        <h3 className="text-base font-semibold text-gray-900">Member Type Comparison</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowChartConfigSlideout(true)}
                          className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-50 rounded"
                          title="Configure chart"
                        >
                          <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => setShowMemberTypeChart(false)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartDataToDisplay}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="type" tick={{ fontSize: 12, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              fontSize: '12px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div style={{
                                    padding: '10px 12px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                  }}>
                                    <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#111827' }}>
                                      {data.type}
                                    </div>
                                    {payload.map((entry, index) => {
                                      const isCurrentYear = entry.dataKey === '2025';
                                      let changeDisplay = null;

                                      if (isCurrentYear && data['2024'] && data['2025']) {
                                        const change = ((data['2025'] - data['2024']) / data['2024']) * 100;
                                        const changeStr = change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
                                        const changeColor = change > 0 ? '#16a34a' : change < 0 ? '#dc2626' : '#64748b';
                                        changeDisplay = (
                                          <span style={{ marginLeft: '6px', color: changeColor, fontWeight: '700', fontSize: '11px' }}>
                                            ({changeStr})
                                          </span>
                                        );
                                      }

                                      return (
                                        <div key={index} style={{ fontSize: '12px', color: '#4b5563', marginTop: '3px' }}>
                                          <span style={{ color: entry.color, marginRight: '6px', fontSize: '10px' }}>●</span>
                                          <span style={{ fontWeight: '500' }}>{entry.dataKey}: </span>
                                          <span style={{ fontWeight: '600', color: '#111827' }}>
                                            {chartAggregation === 'percentage' ? `${entry.value}%` : entry.value}
                                          </span>
                                          {changeDisplay}
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                          <Bar dataKey="2024" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                          <Bar
                            dataKey="2025"
                            fill="#64748b"
                            radius={[4, 4, 0, 0]}
                            onClick={(data) => {
                              if (data.type === 'MEMBER') handleProfessionalBarClick();
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            {chartDataToDisplay.map((entry, index) => {
                              const item = memberTypeData.find(d => d.type === entry.type);
                              const change = item ? ((item['2025'] - item['2024']) / item['2024']) * 100 : 0;
                              let color = '#94a3b8';

                              if (change > 5) color = '#22c55e';
                              else if (change > 0) color = '#86efac';
                              else if (change === 0) color = '#94a3b8';
                              else if (change > -5) color = '#fca5a5';
                              else if (change > -10) color = '#f87171';
                              else color = '#ef4444';

                              return <Cell key={`cell-2025-${index}`} fill={color} />;
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-xs text-green-700 font-medium mb-1">MEMBER</div>
                        <div className="text-sm font-semibold text-green-900">+3.7%</div>
                        <div className="text-xs text-green-600">4,438 → 4,604</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-xs text-red-700 font-medium mb-1">Bachelor Gap Year Affiliate</div>
                        <div className="text-sm font-semibold text-red-900">-21.1%</div>
                        <div className="text-xs text-red-600">57 → 45</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-xs text-green-700 font-medium mb-1">Section Associate</div>
                        <div className="text-sm font-semibold text-green-900">+16.9%</div>
                        <div className="text-xs text-green-600">71 → 83</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-6 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Display:</span>
                          <span>Bar</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Period:</span>
                          <span>YoY</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Scope:</span>
                          <span>Count</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100" style={{ maxWidth: '100%' }}>
                  <style>{`
                  .table-scroll-container {
                    position: relative;
                  }
                  .scrollbar-thin::-webkit-scrollbar {
                    height: 8px;
                  }
                  .scrollbar-thin::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 4px;
                  }
                  .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                  }
                  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                  }
                `}</style>
                  <div className="table-scroll-container">
                    <table className="w-full" style={{ minWidth: '100%' }} ref={tableRef}>
                      <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                        <tr>
                          <th className="w-12 px-3 py-3 sticky left-0 bg-slate-50 z-10 border-r border-slate-200">
                            <input
                              type="checkbox"
                              checked={getFilteredContacts(true).length > 0 && getFilteredContacts(true).every(c => selectedRecords.includes(c.id))}
                              onChange={toggleAllRecords}
                              className="w-4 h-4 rounded border-slate-300"
                            />
                          </th>
                          {fields.filter(f => f.visible).map((field) => (
                            <th key={field.name} className="px-1 py-3 text-left" style={{ minWidth: field.name === 'Name' ? '200px' : field.name === 'Email' ? '180px' : '120px' }}>
                              <div className="flex items-center gap-2 group relative">
                                {field.type !== 'actions' && (
                                  <div className="relative">
                                    <button
                                      onClick={() => setShowColumnMenu(showColumnMenu === field.name ? null : field.name)}
                                      className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-slate-700 transition-all cursor-grab active:cursor-grabbing"
                                    >
                                      <GripVertical className="w-4 h-4" />
                                    </button>
                                    {showColumnMenu === field.name && (
                                      <>
                                        <div
                                          className="fixed inset-0 z-10"
                                          onClick={() => setShowColumnMenu(null)}
                                        />
                                        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 min-w-[160px]">
                                          {(field.name === 'Type' || field.name === 'Status' || field.name === 'Id') && (
                                            <button
                                              onClick={() => addChart(field.name)}
                                              className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                            >
                                              <BarChart3 className="w-4 h-4" />
                                              Add Chart
                                            </button>
                                          )}
                                          {(field.name === 'Location') && (
                                            <button
                                              onClick={() => addNewMap(field.name)}
                                              className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                            >
                                              {/* <BarChart3 className="w-4 h-4" /> */}
                                              🗺️ Add Map
                                            </button>
                                          )}
                                          {(field.name === 'Province/State' || field.name === 'Age Group' || field.name === 'Renewal Type') && (
                                            <>
                                              <button
                                                onClick={() => addChart(field.name)}
                                                className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                              >
                                                <BarChart3 className="w-4 h-4" />
                                                Add Chart
                                              </button>
                                              {field.name === 'Province/State' && (
                                                <button
                                                  onClick={() => addMap(field.name)}
                                                  className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                                >
                                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                  </svg>
                                                  Add Map
                                                </button>
                                              )}
                                              <button
                                                onClick={() => addSummary(field.name)}
                                                className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                              >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                Add Summary
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}
                                <span className="text-xs font-bold text-slate-700 tracking-wider">
                                  {field.name}
                                </span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {getFilteredContacts(true).map((contact, index) => (
                          <tr key={contact.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-3 py-2 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-100 transition-colors">
                              <input
                                type="checkbox"
                                checked={selectedRecords.includes(contact.id)}
                                onChange={() => toggleRecordSelection(contact.id)}
                                className="w-4 h-4 rounded border-slate-300"
                              />
                            </td>
                            {fields.filter(f => f.visible).map((field) => {
                              if (field.name === 'Actions') {
                                return (
                                  <td key={field.name} className="px-6 py-4">
                                    <button className="text-slate-500 hover:text-slate-900 transition-colors">
                                      <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                  </td>
                                );
                              }

                              const value = getFieldValue(contact, field.name);

                              if (field.name === 'Id') {
                                return (
                                  <td key={field.name} className="px-3 py-2 text-sm font-medium text-slate-500">
                                    {value}
                                  </td>
                                );
                              }

                              if (field.name === 'Name') {
                                return (
                                  <td key={field.name} className="px-3 py-2 text-sm font-bold text-slate-900">
                                    <span>{value}</span>
                                  </td>
                                );
                              }

                              if (field.name === 'Status') {
                                return (
                                  <td key={field.name} className="px-3 py-2">
                                    <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-lg ${value === 'Active' ? 'bg-green-100 text-green-800' :
                                      value === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                        'bg-slate-100 text-slate-700'
                                      }`}>
                                      {value}
                                    </span>
                                  </td>
                                );
                              }

                              return (
                                <td key={field.name} className="px-3 py-2 text-sm font-medium text-slate-700">
                                  {value || '-'}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-[1600px] mx-auto pb-6">
          <div className="bg-white border border-slate-200 rounded-lg px-3 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={getFilteredContacts(true).length > 0 && getFilteredContacts(true).every(c => selectedRecords.includes(c.id))}
                  onChange={toggleAllRecords}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span>{startAndEnd.startIndex + 1} - {startAndEnd.endIndex > filteredContacts.length ? filteredContacts.length : startAndEnd.endIndex}  of {filteredContacts.length} records</span>
                <span className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-slate-500" />
                  <span>
                    {(() => {
                      const filtered = getFilteredContacts();
                      const statusCounts = { Active: 0, Pending: 0, Other: 0 };
                      filtered.forEach(c => {
                        if (c.status === 'Active') statusCounts.Active++;
                        else if (c.status === 'Pending') statusCounts.Pending++;
                        else statusCounts.Other++;
                      });
                      return `${statusCounts.Active} Active, ${statusCounts.Pending} Pending, ${statusCounts.Other} Other`;
                    })()}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                  <Clock className="w-4 h-4" />
                  Timeline
                </button>
                <Pagination onPageChange={handlePageNumberClick} pageCount={pageCount} currentPage={currentPage}></Pagination>
                {/* <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Previous</button>
                <button className="px-4 py-2 text-sm font-bold bg-slate-900 text-white rounded-lg">1</button>
                <button className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Next</button>
              </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Slide-Out Panel */}
        {(showActionsPanel || showFieldsPanel) && (
          <>
            <div
              className="fixed inset-0 bg-slate-900 bg-opacity-20 z-40"
              style={{ pointerEvents: draggedField ? 'none' : 'auto' }}
              onClick={() => {
                if (!draggedField) {
                  setShowActionsPanel(false);
                  setShowFieldsPanel(false);
                }
              }}
            />
            <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-xl z-50 flex flex-col mt-16">
              <div className="border-b border-slate-200 bg-white">
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => {
                        setActiveTab('actions');
                        setShowActionsPanel(true);
                        setShowFieldsPanel(false);
                      }}
                      className={`text-sm font-bold pb-2 ${activeTab === 'actions' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700'
                        } transition-colors`}
                    >
                      Actions
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('fields');
                        setShowFieldsPanel(true);
                        setShowActionsPanel(false);
                      }}
                      className={`text-sm font-bold pb-2 ${activeTab === 'fields' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700'
                        } transition-colors`}
                    >
                      Fields
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('combos');
                      }}
                      className={`text-sm font-bold pb-2 ${activeTab === 'combos' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700'
                        } transition-colors`}
                    >
                      Combos
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setShowActionsPanel(false);
                      setShowFieldsPanel(false);
                    }}
                    className="text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {activeTab === 'actions' && (
                  <div className="p-6 space-y-8">
                    <div>
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Standard</h3>
                      <div className="space-y-1">
                        <button className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-colors">
                          <Plus className="w-5 h-5 text-slate-500" />
                          New Record
                        </button>
                        <button className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-colors">
                          <FileUp className="w-5 h-5 text-slate-500" />
                          Import Records
                        </button>
                        <button className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-colors">
                          <FileDown className="w-5 h-5 text-slate-500" />
                          Export Results
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Personalize</h3>
                      <div className="space-y-1">
                        <button className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-colors">
                          <Eye className="w-5 h-5 text-slate-500" />
                          Show/Hide Icons
                        </button>
                        <button className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-colors">
                          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                          Density Default
                        </button>
                        <button className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-colors">
                          <BarChart3 className="w-5 h-5 text-slate-500" />
                          Footer Insights Toggle
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Other</h3>
                      <div className="space-y-1">
                        <button className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-colors">
                          <Clock className="w-5 h-5 text-slate-500" />
                          View Timeline of Results
                        </button>
                        <button className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-colors">
                          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Compare Aggregations
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'combos' && (
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-sm text-slate-600 mb-4">Saved field and filter combinations for quick access</p>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setFields(fields.map(f => ({
                            ...f,
                            visible: ['Id', 'Name', 'Type', 'Status', 'Email', 'Phone', 'Actions'].includes(f.name)
                          })));
                          setShowActionsPanel(false);
                          setShowFieldsPanel(false);
                        }}
                        className="w-full text-left p-4 hover:bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-sm text-slate-900 mb-1">Commerce</div>
                            <div className="text-xs text-slate-600">Member type, status, and contact information for commerce tracking</div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setFields(fields.map(f => ({
                            ...f,
                            visible: ['Id', 'Name', 'Province/State', 'City', 'Committees', 'Events', 'Actions'].includes(f.name)
                          })));
                          setShowActionsPanel(false);
                          setShowFieldsPanel(false);
                        }}
                        className="w-full text-left p-4 hover:bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-sm text-slate-900 mb-1">Communities</div>
                            <div className="text-xs text-slate-600">Location, committee membership, and event participation</div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setFields(fields.map(f => ({
                            ...f,
                            visible: ['Id', 'Name', 'Email', 'Phone', 'Status', 'Actions'].includes(f.name)
                          })));
                          setShowActionsPanel(false);
                          setShowFieldsPanel(false);
                        }}
                        className="w-full text-left p-4 hover:bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-sm text-slate-900 mb-1">Communications</div>
                            <div className="text-xs text-slate-600">Email, phone, and communication preferences for outreach</div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setFields(fields.map(f => ({
                            ...f,
                            visible: ['Id', 'Name', 'Type', 'Status', 'Age Group', 'Province/State', 'Actions'].includes(f.name)
                          })));
                          setShowActionsPanel(false);
                          setShowFieldsPanel(false);
                        }}
                        className="w-full text-left p-4 hover:bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-sm text-slate-900 mb-1">Demographics</div>
                            <div className="text-xs text-slate-600">Age groups, member types, geographic distribution for analysis</div>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setFields(fields.map(f => ({
                            ...f,
                            visible: ['Id', 'Name', 'Email', 'Phone', 'Address Line 1', 'Address Line 2', 'City', 'Province/State', 'Country', 'Postal/Zip Code', 'Actions'].includes(f.name)
                          })));
                          setShowActionsPanel(false);
                          setShowFieldsPanel(false);
                        }}
                        className="w-full text-left p-4 hover:bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-sm text-slate-900 mb-1">Mailing Lists</div>
                            <div className="text-xs text-slate-600">Complete contact details including postal address for mailings</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'fields' && (
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-200">
                      <button
                        onClick={() => setFieldsSubTab('byField')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg ${fieldsSubTab === 'byField' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                          } transition-colors`}
                      >
                        By Field
                      </button>
                      <button
                        onClick={() => setFieldsSubTab('byRecord')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg ${fieldsSubTab === 'byRecord' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                          } transition-colors`}
                      >
                        By Record
                      </button>
                      <button
                        onClick={() => setFieldsSubTab('browse')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg ${fieldsSubTab === 'browse' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                          } transition-colors`}
                      >
                        Browse
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                      {fieldsSubTab === 'byField' && (
                        <>
                          <div className="mb-6">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Fields Shown</h3>
                            <div className="space-y-1.5">
                              {fields.filter(f => f.visible).map((field) => (
                                <div key={field.name} className="group">
                                  <div
                                    className="flex items-center justify-between px-2 py-1.5 hover:bg-slate-50 rounded-lg transition-colors"
                                    draggable={field.name === 'Type' || field.name === 'Status' || field.name === 'Province/State' || field.name === 'Age Group' || field.name === 'Renewal Type'}
                                    onDragStart={(e) => {
                                      if (field.name === 'Type' || field.name === 'Status' || field.name === 'Province/State' || field.name === 'Age Group' || field.name === 'Renewal Type') {
                                        handleFieldDragStart(e, field.name);
                                      }
                                    }}
                                    onDragEnd={() => {
                                      setDraggedField(null);
                                    }}
                                    style={{ cursor: (field.name === 'Type' || field.name === 'Status' || field.name === 'Province/State' || field.name === 'Age Group' || field.name === 'Renewal Type') ? 'grab' : 'default' }}
                                  >
                                    <div className="flex items-center gap-1.5">
                                      {(field.name === 'Type' || field.name === 'Status' || field.name === 'Province/State' || field.name === 'Age Group' || field.name === 'Renewal Type') && (
                                        <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                                      )}
                                      <span className="text-sm font-semibold text-slate-700">{field.name}</span>
                                      {(fieldFilters[field.name] && fieldFilters[field.name] !== '') && (
                                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                      )}
                                      {pageFilters.find(f => f.fieldName === field.name) && (
                                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {field.type !== 'actions' && (
                                        <button
                                          onClick={() => addPageFilter(field.name, field.type)}
                                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 transition-all"
                                          title="Add to page filters"
                                        >
                                          <Filter className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                      <button
                                        onClick={() => toggleFieldVisibility(field.name)}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-700 transition-all"
                                      >
                                        <EyeOff className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                  {field.type !== 'actions' && (
                                    <div className="px-2 pt-0.5 pb-1">
                                      {field.type === 'select' || field.type === 'multi-select' ? (
                                        <select
                                          value={fieldFilters[field.name] || ''}
                                          onChange={(e) => updateFieldFilter(field.name, e.target.value)}
                                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                                        >
                                          <option value="">All</option>
                                          {field.name === 'Type' && (
                                            <>
                                              <option value="Full-Time">Full-Time</option>
                                              <option value="Student">Student</option>
                                              <option value="Retired">Retired</option>
                                              <option value="Part-Time">Part-Time</option>
                                              <option value="Affiliate">Affiliate</option>
                                            </>
                                          )}
                                          {field.name === 'Status' && (
                                            <>
                                              <option value="Active">Active</option>
                                              <option value="Pending">Pending</option>
                                              <option value="Inactive">Inactive</option>
                                            </>
                                          )}
                                          {field.name === 'Age Group' && (
                                            <>
                                              <option value="18-24">18-24</option>
                                              <option value="25-34">25-34</option>
                                              <option value="35-44">35-44</option>
                                              <option value="45-54">45-54</option>
                                              <option value="55-64">55-64</option>
                                              <option value="65+">65+</option>
                                              <option value="N/A">N/A</option>
                                            </>
                                          )}
                                          {field.name === 'Renewal Type' && (
                                            <>
                                              <option value="Full-Time">Full-Time</option>
                                              <option value="Student">Student</option>
                                              <option value="Retired">Retired</option>
                                              <option value="Part-Time">Part-Time</option>
                                              <option value="Affiliate">Affiliate</option>
                                            </>
                                          )}
                                        </select>
                                      ) : (
                                        <input
                                          type="text"
                                          placeholder="Filter..."
                                          value={fieldFilters[field.name] || ''}
                                          onChange={(e) => updateFieldFilter(field.name, e.target.value)}
                                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-slate-400"
                                        />
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Fields Hidden</h3>
                            <div className="space-y-1.5">
                              {fields.filter(f => !f.visible).map((field) => (
                                <div key={field.name} className="group">
                                  <div className="flex items-center justify-between px-2 py-1.5 hover:bg-slate-50 rounded-lg transition-colors">
                                    <span className="text-sm font-medium text-slate-500">{field.name}</span>
                                    <button
                                      onClick={() => toggleFieldVisibility(field.name)}
                                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 transition-all"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-6 pt-6 border-t border-slate-200 space-y-2">
                            <button className="w-full text-left px-4 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              + Add Calculated Field
                            </button>
                            <button className="w-full text-left px-4 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              + Add Advanced Filters
                            </button>
                          </div>
                        </>
                      )}

                      {fieldsSubTab === 'byRecord' && (
                        <div>
                          <p className="text-sm text-slate-600 mb-4">Search for a record to select fields and filters</p>
                          <div className="mb-4">
                            <input
                              type="text"
                              placeholder="Search by name or ID..."
                              value={recordSearchQuery}
                              onChange={(e) => setRecordSearchQuery(e.target.value)}
                              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            />
                          </div>
                          {recordSearchQuery && (
                            <div className="space-y-2">
                              {filteredContacts
                                .filter(c =>
                                  c.name.toLowerCase().includes(recordSearchQuery.toLowerCase()) ||
                                  c.id.toLowerCase().includes(recordSearchQuery.toLowerCase())
                                )
                                .slice(0, 5)
                                .map((contact) => (
                                  <div key={contact.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                                    <div className="font-bold text-sm text-slate-900 mb-2">{contact.name}</div>
                                    <div className="text-xs text-slate-500 mb-3">{contact.id}</div>
                                    <div className="grid grid-cols-2 gap-2">
                                      {Object.entries(contact).filter(([key]) => key !== 'id' && key !== 'name').map(([key, value]) => (
                                        <button
                                          key={key}
                                          className="text-left px-2 py-1.5 text-xs bg-slate-50 hover:bg-blue-50 rounded border border-slate-200 hover:border-blue-300 transition-colors"
                                        >
                                          <div className="font-semibold text-slate-700 capitalize">{key}</div>
                                          <div className="text-slate-600 truncate">{value}</div>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      )}

                      {fieldsSubTab === 'browse' && (
                        <div className="grid grid-cols-2 gap-3">
                          {['Committees', 'Events', 'Donations', 'Activities', 'Groups', 'Tags'].map((category) => (
                            <button
                              key={category}
                              className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                            >
                              <div className="font-bold text-sm text-slate-900 mb-1">{category}</div>
                              <div className="text-xs text-slate-600">Browse {category.toLowerCase()}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Pin Panel */}
        {showPinPanel && (
          <>
            <div
              className="fixed inset-0 bg-slate-900 bg-opacity-20 z-40"
              onClick={() => setShowPinPanel(false)}
            />
            <div className="fixed top-12 right-0 w-96 h-full bg-white shadow-xl z-50 flex flex-col">
              <div className="border-b border-slate-200 bg-white">
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-6">
                    <h2 className="text-lg font-bold text-slate-900">Pin as Shortcut</h2>
                  </div>
                  <button
                    onClick={() => setShowPinPanel(false)}
                    className="text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-6">
                  <p className="text-sm text-slate-600 mb-4">
                    Select a number to pin this view as a shortcut for quick access.
                  </p>
                </div>
                <div>
                  <input className='border-2 border-gray-400 w-full p-2 rounded-lg' placeholder='Enter the number' type="number" name="number" id="number" />
                </div>
              </div>
            </div>
          </>
        )}


        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="toolbar-glass rounded-full shadow-lg px-6 py-3 transition-all duration-300 group">
            <div className="flex items-center gap-4">
              {toolbarIcons.map((item) => {
                const Icon = item.icon;
                const isCompare = item.id === 'compare';
                const isActive = compareMode && isCompare;
                const isHovered = hoveredIcon === item.id;

                const getIconColor = () => {
                  if (isActive) return 'text-slate-700';
                  if (!isHovered) return 'text-gray-400';

                  const hoverColors = {
                    chart: 'text-blue-900',
                    compare: 'text-slate-700',
                    edit: 'text-blue-600',
                    filter: 'text-orange-600',
                    view: 'text-purple-600',
                  };

                  return hoverColors[item.id] || 'text-gray-600';
                };

                return (
                  <div key={item.id} className="relative">
                    {isHovered && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {item.label}
                      </div>
                    )}
                    <button
                      onMouseEnter={() => setHoveredIcon(item.id)}
                      onMouseLeave={() => setHoveredIcon(null)}
                      onClick={isCompare ? handleCompareClick : undefined}
                      className={`p-2 rounded-lg transition-all duration-200 ${getIconColor()} ${isActive
                        ? 'bg-slate-50 scale-110 opacity-100'
                        : 'hover:bg-gray-50 opacity-25 group-hover:opacity-100'
                        } ${isHovered ? 'scale-125 -translate-y-1' : ''}`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {showVolunteerSlideout && (
          <div
            className="fixed bg-white shadow-2xl border border-gray-300 rounded-lg overflow-hidden z-[150]"
            style={{
              left: `${panelPosition.x}px`,
              top: `${panelPosition.y}px`,
              width: `${panelDimensions.width}px`,
              height: panelSize === 'minimized' ? '56px' : panelSize === 'maximized' ? '80vh' : `${panelDimensions.height}px`,
              transition: isDragging || isResizing ? 'none' : 'height 0.2s ease',
              cursor: isDragging ? 'grabbing' : 'default'
            }}
            onMouseDown={handlePanelMouseDown}
          >
            <div className="panel-drag-handle flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200 cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                <h2 className="text-base font-semibold text-gray-900">Volunteer Activity Correlation</h2>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={togglePanelSize}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-white/50 rounded"
                  title={panelSize === 'minimized' ? 'Expand' : panelSize === 'normal' ? 'Maximize' : 'Minimize'}
                >
                  {panelSize === 'minimized' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setShowVolunteerSlideout(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-white/50 rounded"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {panelSize !== 'minimized' && (
              <div className="p-6 overflow-y-auto" style={{ height: panelSize === 'maximized' ? 'calc(80vh - 56px)' : `${panelDimensions.height - 56}px` }}>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div className="text-sm text-amber-900">
                      <div className="font-semibold mb-1">Key Insight</div>
                      <div>First-year volunteer engagement is the strongest predictor of long-term retention for MEMBERs</div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-700 mb-3">5-Year Retention Rate Comparison</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={retentionPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {retentionPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-gray-600">Volunteered in Year 1</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-gray-600">Never Volunteered</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-4">MEMBERs - 5-Year Retention Rate</div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Volunteered in first year</span>
                          <span className="text-sm font-semibold text-green-600">85%</span>
                        </div>
                        <div className="h-12 bg-green-500 rounded flex items-center px-4 text-white text-sm font-medium" style={{ width: '85%' }}>
                          1,420 of 1,670
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Never volunteered</span>
                          <span className="text-sm font-semibold text-red-600">45%</span>
                        </div>
                        <div className="h-12 bg-red-500 rounded flex items-center px-4 text-white text-sm font-medium" style={{ width: '45%' }}>
                          1,920 of 4,280
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="text-sm text-slate-700">
                          <div className="font-semibold mb-1">Retention gap: 40 percentage points</div>
                          <div className="text-xs text-slate-600 mt-2">
                            Current reality: Only 28% of new MEMBERs volunteer in their first year
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {savedMarkers.length === 0 && step >= 5 && (
                    <button
                      onClick={handleAddMarker}
                      className="w-full py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" strokeWidth={1.5} />
                      Add marker to page
                    </button>
                  )}
                </div>
              </div>
            )}

            {panelSize === 'normal' && (
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-10"
                onMouseDown={handleResizeMouseDown}
                style={{
                  background: 'linear-gradient(135deg, transparent 50%, #cbd5e1 50%)',
                }}
                title="Drag to resize"
              />
            )}
          </div>
        )}

        {showMarkerSlideout && (
          <div className="slideout-panel fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-[150] mt-12 pt-12">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
                  <h2 className="text-lg font-semibold text-gray-900">Place Marker</h2>
                </div>
                <button
                  onClick={() => {
                    setShowMarkerSlideout(false);
                    setMarkerPlacementMode(false);
                    setTempMarkerPosition(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div className="text-sm text-slate-900">
                      <div className="font-semibold mb-2">Click anywhere on the page</div>
                      <div className="text-xs text-slate-600">
                        Position your marker where you'd like it to appear for future reference. Once placed, click Save to keep it there.
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Label</label>
                  <input
                    type="text"
                    defaultValue="First-Year Volunteer Activation Gap"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    defaultValue="MEMBERs who volunteer in year 1 show 85% retention vs 45% for non-volunteers. Currently only 28% volunteer in first year. Opportunity: Activate the untapped 72%."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    rows="4"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSaveMarker}
                    disabled={!tempMarkerPosition}
                    className={`w-full py-2.5 text-white text-sm font-medium rounded-lg transition-colors ${tempMarkerPosition
                      ? 'bg-slate-700 hover:bg-slate-800'
                      : 'bg-gray-300 cursor-not-allowed'
                      }`}
                  >
                    {tempMarkerPosition ? 'Save Marker' : 'Click on page to place marker'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showMarkerDetailSlideout && (
          <div className="slideout-panel fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-[150] mt-12 pt-12">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                  <h2 className="text-lg font-semibold text-gray-900">First-Year Volunteer Activation Gap</h2>
                </div>
                <button
                  onClick={() => setShowMarkerDetailSlideout(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-sm text-gray-700">
                    MEMBERs who volunteer in year 1 show 85% retention vs 45% for non-volunteers. Currently only 28% volunteer in first year. Opportunity: Activate the untapped 72%.
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ListTodo className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
                    <h3 className="text-base font-semibold text-gray-900">Tasks</h3>
                  </div>

                  {!tasksGenerated ? (
                    <div className="space-y-3">
                      <button
                        onClick={handleGenerateTasks}
                        className="w-full py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4" strokeWidth={1.5} />
                        Generate task list
                      </button>

                      <button
                        className="w-full py-2 text-slate-600 hover:text-slate-800 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
                      >
                        <span className="text-lg leading-none">+</span>
                        <span>Add task</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <TaskListItem text="Analyze volunteer onboarding best practices" agent={agentsAssigned ? "Strategy Agent" : null} />
                        <TaskListItem text="Draft personalized email sequence for first-year members" agent={agentsAssigned ? "Content Agent" : null} />
                        <TaskListItem text="Build 12-month volunteer activation journey map" agent={agentsAssigned ? "Journey Agent" : null} />
                        <TaskListItem text="Create volunteer interest survey with matching logic" agent={agentsAssigned ? "Form Agent" : null} />
                        <TaskListItem text="Configure success tracking dashboard" agent={agentsAssigned ? "Analytics Agent" : null} />
                      </div>

                      <div className="pt-2">
                        <button
                          className="w-full py-2 text-slate-600 hover:text-slate-800 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
                        >
                          <span className="text-lg leading-none">+</span>
                          <span>Add task</span>
                        </button>
                      </div>

                      <div className="pt-2">{!agentsAssigned ? (
                        <button
                          onClick={handleAssignAgents}
                          className="w-full py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Focus className="w-4 h-4" strokeWidth={1.5} />
                          Assign to Agentic Team
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                              <div className="text-sm text-slate-900">
                                <div className="font-semibold mb-1">Assigned to Agentic Team</div>
                                <div className="text-xs text-slate-600">
                                  5 agents ready to build your volunteer activation program
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={handleApproveAndProceed}
                            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
                            Approve to Proceed
                          </button>
                        </div>
                      )}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {showAgentSlideout && (
          <div className="slideout-panel fixed inset-y-0 right-0 w-[32rem] bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-[150]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
                    <Focus className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Agentic Team</h2>
                    <p className="text-sm text-gray-500">Building First-Year Volunteer Program</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAgentSlideout(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              {agentProgress < 100 ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                      <span className="text-sm text-gray-500">{agentProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-slate-600 to-slate-800 transition-all duration-300"
                        style={{ width: `${agentProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <TaskItem
                      label="Strategy Agent: Analyze volunteer onboarding best practices"
                      status={agentProgress > 20 ? 'complete' : 'active'}
                    />
                    <TaskItem
                      label="Content Agent: Draft personalized email sequence"
                      status={agentProgress > 40 ? 'complete' : agentProgress > 20 ? 'active' : 'queued'}
                    />
                    <TaskItem
                      label="Journey Agent: Build 12-month activation journey"
                      status={agentProgress > 60 ? 'complete' : agentProgress > 40 ? 'active' : 'queued'}
                    />
                    <TaskItem
                      label="Form Agent: Create volunteer interest survey"
                      status={agentProgress > 80 ? 'complete' : agentProgress > 60 ? 'active' : 'queued'}
                    />
                    <TaskItem
                      label="Analytics Agent: Configure success tracking dashboard"
                      status={agentProgress > 95 ? 'complete' : agentProgress > 80 ? 'active' : 'queued'}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-900">
                      <CheckCircle2 className="w-5 h-5" strokeWidth={1.5} />
                      <span className="font-semibold">Program Complete</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <DeliverableItem icon={<BarChart3 className="w-5 h-5 text-slate-600" strokeWidth={1.5} />} title="Email Sequence" subtitle="6 emails, personalized by career stage" />
                    <DeliverableItem icon={<ListTodo className="w-5 h-5 text-slate-600" strokeWidth={1.5} />} title="Volunteer Interest Survey" subtitle="8 questions, conditional logic" />
                    <DeliverableItem icon={<TrendingUp className="w-5 h-5 text-slate-600" strokeWidth={1.5} />} title="12-Month Activation Journey" subtitle="7 touchpoints, 3 decision branches" />
                    <DeliverableItem icon={<Target className="w-5 h-5 text-slate-600" strokeWidth={1.5} />} title="Success Dashboard" subtitle="Activation rate & retention tracking" />
                    <DeliverableItem icon={<Filter className="w-5 h-5 text-slate-600" strokeWidth={1.5} />} title="Implementation Guide" subtitle="12 pages, staff ready" />
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="text-sm text-slate-900 space-y-1">
                      <div className="font-semibold">Projected Impact</div>
                      <div>• Target: 28% → 50% first-year activation</div>
                      <div>• Est. additional renewals: +330 annually</div>
                      <div>• Revenue impact: +$82,500/year</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors">
                      Review Components
                    </button>
                    <button className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                      Activate Program
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {showChartConfigSlideout && (
          <div className="slideout-panel fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-[150] mt-12 pt-12">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
                  <h2 className="text-lg font-semibold text-gray-900">Chart Configuration</h2>
                </div>
                <button
                  onClick={() => setShowChartConfigSlideout(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-slate-600" strokeWidth={1.5} />
                    <h3 className="text-sm font-semibold text-gray-900">Display</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Chart Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
                        <option>Bar</option>
                        <option>Line</option>
                        <option>Area</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Change Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
                        <option>Absolute</option>
                        <option>Percentage Change</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Overlay</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked readOnly className="rounded border-gray-300" />
                          <span className="text-sm text-gray-700">Previous Year</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span className="text-sm text-gray-700">Forecast</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-slate-600" strokeWidth={1.5} />
                    <h3 className="text-sm font-semibold text-gray-900">Period</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Comparison</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
                        <option>YoY (Year over Year)</option>
                        <option>QoQ (Quarter over Quarter)</option>
                        <option>MoM (Month over Month)</option>
                        <option>Custom Range</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Base Year</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
                          <option>2024</option>
                          <option>2023</option>
                          <option>2022</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Compare To</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
                          <option>2023</option>
                          <option>2022</option>
                          <option>2021</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Granularity</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
                        <option>Annually</option>
                        <option>Quarterly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-slate-600" strokeWidth={1.5} />
                    <h3 className="text-sm font-semibold text-gray-900">Scope</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Member Types</label>
                      <button
                        onClick={() => setShowMemberTypeSelector(!showMemberTypeSelector)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <span className="text-gray-700">
                          {selectedMemberTypes.length === 0
                            ? 'All types selected'
                            : selectedMemberTypes.length === memberTypeData.length
                              ? 'All types selected'
                              : `${selectedMemberTypes.length} type${selectedMemberTypes.length !== 1 ? 's' : ''} selected`}
                        </span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showMemberTypeSelector && (
                        <div className="mt-2 p-3 border border-gray-200 rounded-lg bg-gray-50 max-h-60 overflow-y-auto">
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-300">
                            <button
                              onClick={() => setSelectedMemberTypes(memberTypeData.map(m => m.type))}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Select All
                            </button>
                            <button
                              onClick={() => setSelectedMemberTypes([])}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Clear All
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            {memberTypeData.map((item) => (
                              <label key={item.type} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1.5 rounded">
                                <input
                                  type="checkbox"
                                  checked={selectedMemberTypes.includes(item.type)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedMemberTypes([...selectedMemberTypes, item.type]);
                                    } else {
                                      setSelectedMemberTypes(selectedMemberTypes.filter(t => t !== item.type));
                                    }
                                  }}
                                  className="rounded border-gray-300"
                                />
                                <span className="text-xs text-gray-700 flex-1">{item.type}</span>
                                <span className="text-xs text-gray-500">{item['2025']}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Metric</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
                        <option>Member Count</option>
                        <option>Revenue</option>
                        <option>Engagement Score</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Aggregation</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        value={chartAggregation}
                        onChange={(e) => setChartAggregation(e.target.value)}
                      >
                        <option value="count">Count</option>
                        <option value="percentage">Percentage</option>
                        <option value="sum">Sum</option>
                        <option value="average">Average</option>
                      </select>
                      {chartAggregation === 'percentage' && (
                        <p className="mt-2 text-xs text-slate-600">
                          Shows each member type as a % of total members for that year
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Filters</label>
                      <div className="flex flex-wrap gap-2">
                        <button className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors">
                          + Region
                        </button>
                        <button className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors">
                          + Department
                        </button>
                        <button className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors">
                          + Campaign
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={() => setShowChartConfigSlideout(false)}
                    className="w-full py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Apply Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Query Panel - Push Panel */}
        {showSavePhrasePanel && (
          <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-xl z-50 flex flex-col border-l border-slate-200 mt-8">
              <div className="border-b border-slate-200 bg-white px-6 py-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">Save Query</h2>
                  <button
                    onClick={() => setShowSavePhrasePanel(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {/* Current Query Display */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                    Current Query
                  </label>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex flex-wrap gap-2">
                      {phraseChips.map((chip, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                        >
                          {chip.icon && <chip.icon className="w-3 h-3" />}
                          <span>{chip.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Name Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Filter Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={savedPhraseName}
                    onChange={(e) => setSavedPhraseName(e.target.value)}
                    placeholder="e.g., Active Members in Toronto"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Description Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description <span className="text-slate-400 text-xs font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={savedPhraseDescription}
                    onChange={(e) => setSavedPhraseDescription(e.target.value)}
                    placeholder="Add a description for this saved filter..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Info Box */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600">
                    <strong>Tip:</strong> Saved queries can be quickly accessed from your filters list and reused across sessions.
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-slate-200 p-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowSavePhrasePanel(false);
                      setSavedPhraseName('');
                      setSavedPhraseDescription('');
                    }}
                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (savedPhraseName.trim()) {
                        const newPhrase = {
                          id: Date.now(),
                          name: savedPhraseName,
                          description: savedPhraseDescription,
                          chips: phraseChips.map(chip => ({ ...chip }))
                        };
                        setSavedPhrases([...savedPhrases, newPhrase]);
                        setShowSavePhrasePanel(false);
                        setSavedPhraseName('');
                        setSavedPhraseDescription('');
                      }
                    }}
                    disabled={!savedPhraseName.trim()}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      savedPhraseName.trim()
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Save Filter
                  </button>
                </div>
              </div>
            </div>
        )}

        <style>{`
        @keyframes pulseRing {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(71, 85, 105, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(71, 85, 105, 0);
          }
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .toolbar-glass {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.08);
        }
        
        .toolbar-glass:hover,
        .toolbar-glass:focus-within {
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
        }
        
        .marker-legend-animate {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
      </div>
  );
};

export default UnifiedContactListing;
