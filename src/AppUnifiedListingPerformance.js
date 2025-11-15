import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, Edit3, Filter, Clock, Eye, Target, Focus, TrendingUp, Users, AlertCircle, CheckCircle2, Loader2, X, MapPin, ListTodo, Zap, MoreVertical, DollarSign, AlertTriangle, Activity, Percent } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line } from 'recharts';

const CompareModeDemo = () => {
  const [step, setStep] = useState(0);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [showMemberTypeChart, setShowMemberTypeChart] = useState(false);
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
  const [showRevenuePanel, setShowRevenuePanel] = useState(false);
  const [revenuePanelPosition, setRevenuePanelPosition] = useState({ x: window.innerWidth - 720, y: 100 });
  const [revenuePanelDimensions, setRevenuePanelDimensions] = useState({ width: 700, height: 600 });
  const [isDraggingRevenuePanel, setIsDraggingRevenuePanel] = useState(false);
  const [isResizingRevenuePanel, setIsResizingRevenuePanel] = useState(false);
  const [revenueDragOffset, setRevenueDragOffset] = useState({ x: 0, y: 0 });
  const [revenueResizeStart, setRevenueResizeStart] = useState({ width: 0, height: 0, mouseX: 0, mouseY: 0 });
  const [hoveredMemberRow, setHoveredMemberRow] = useState(null);
  const [showRowRadar, setShowRowRadar] = useState(false);
  const [radarPosition, setRadarPosition] = useState({ x: 0, y: 0 });

  const membershipRevenueData = [
    { type: 'CPA Fellow', y2019: 149, y2020: 140, y2021: 131, y2022: 115, oct2024: 103, oct2025: 103, diff: 0, pace: 100.0, new: 1, renew: 102, pricePerMember: 500 },
    { type: 'Bachelor Gap Year', y2019: 0, y2020: 0, y2021: 0, y2022: 0, oct2024: 57, oct2025: 45, diff: -12, pace: 78.9, new: 25, renew: 20, pricePerMember: 75 },
    { type: 'CPA Honorary Fellow', y2019: 35, y2020: 37, y2021: 37, y2022: 34, oct2024: 31, oct2025: 38, diff: -5, pace: 87.8, new: 0, renew: 38, pricePerMember: 0 },
    { type: 'CPA Honorary Member', y2019: 52, y2020: 53, y2021: 55, y2022: 57, oct2024: 93, oct2025: 82, diff: -11, pace: 88.2, new: 0, renew: 82, pricePerMember: 0 },
    { type: 'CPA Intl Affiliate', y2019: 40, y2020: 35, y2021: 45, y2022: 43, oct2024: 28, oct2025: 24, diff: -4, pace: 85.7, new: 5, renew: 19, pricePerMember: 150 },
    { type: 'CPA Intl Student', y2019: 3, y2020: 5, y2021: 12, y2022: 13, oct2024: 9, oct2025: 7, diff: -2, pace: 77.8, new: 0, renew: 1, pricePerMember: 75 },
    { type: 'CPA MEMBER', y2019: 4527, y2020: 4435, y2021: 4371, y2022: 4516, oct2024: 4438, oct2025: 4604, diff: 166, pace: 103.7, new: 227, renew: 4377, pricePerMember: 250 },
    { type: 'Early Career Yr1', y2019: 0, y2020: 143, y2021: 256, y2022: 232, oct2024: 234, oct2025: 225, diff: -9, pace: 96.2, new: 85, renew: 140, pricePerMember: 200 },
    { type: 'Early Career Yr2', y2019: 0, y2020: 0, y2021: 177, y2022: 239, oct2024: 220, oct2025: 224, diff: 4, pace: 101.8, new: 26, renew: 198, pricePerMember: 200 },
    { type: 'Parental Leave', y2019: 0, y2020: 32, y2021: 33, y2022: 26, oct2024: 27, oct2025: 21, diff: -6, pace: 77.8, new: 4, renew: 17, pricePerMember: 100 },
    { type: 'Retired Fellow', y2019: 19, y2020: 19, y2021: 16, y2022: 16, oct2024: 14, oct2025: 13, diff: -1, pace: 92.9, new: 0, renew: 13, pricePerMember: 100 },
    { type: 'Retired Member', y2019: 100, y2020: 97, y2021: 101, y2022: 97, oct2024: 85, oct2025: 70, diff: -15, pace: 82.4, new: 2, renew: 68, pricePerMember: 100 },
    { type: 'Special Affiliate', y2019: 95, y2020: 78, y2021: 93, y2022: 111, oct2024: 92, oct2025: 84, diff: -8, pace: 91.3, new: 29, renew: 55, pricePerMember: 150 },
    { type: 'STUDENT Affiliate', y2019: 1356, y2020: 1343, y2021: 1738, y2022: 1862, oct2024: 1466, oct2025: 1486, diff: 20, pace: 101.4, new: 624, renew: 862, pricePerMember: 75 },
    { type: 'Section Associate', y2019: 0, y2020: 0, y2021: 20, y2022: 33, oct2024: 71, oct2025: 83, diff: 12, pace: 116.9, new: 43, renew: 40, pricePerMember: 150 },
  ];

  const calculateRevenue = (item) => item.oct2025 * item.pricePerMember;

  const totalRevenue2025 = membershipRevenueData.reduce((sum, item) => sum + calculateRevenue(item), 0);
  const totalRevenue2024 = membershipRevenueData.reduce((sum, item) => sum + (item.oct2024 * item.pricePerMember), 0);
  const totalRevenue2022 = membershipRevenueData.reduce((sum, item) => sum + (item.y2022 * item.pricePerMember), 0);
  const totalRevenue2021 = membershipRevenueData.reduce((sum, item) => sum + (item.y2021 * item.pricePerMember), 0);
  const totalRevenue2020 = membershipRevenueData.reduce((sum, item) => sum + (item.y2020 * item.pricePerMember), 0);
  const totalRevenue2019 = membershipRevenueData.reduce((sum, item) => sum + (item.y2019 * item.pricePerMember), 0);

  const revenueTrendData = [
    { year: '2019', revenue: totalRevenue2019 },
    { year: '2020', revenue: totalRevenue2020 },
    { year: '2021', revenue: totalRevenue2021 },
    { year: '2022', revenue: totalRevenue2022 },
    { year: 'Oct-24', revenue: totalRevenue2024 },
    { year: 'Oct-25', revenue: totalRevenue2025 },
  ];

  const revenueByTypeData = membershipRevenueData
    .map(item => ({
      type: item.type,
      revenue: calculateRevenue(item),
      newRevenue: item.new * item.pricePerMember,
      renewRevenue: item.renew * item.pricePerMember,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  const members = [
    { name: 'Jennifer Walsh', type: 'MEMBER', joinDate: '2022-03', age: '35-50', status: 'Active', volunteer: 'Year 1', revenue: '$250' },
    { name: 'Marcus Chen', type: 'STUDENT Affiliate', joinDate: '2024-01', age: '22-34', status: 'Active', volunteer: 'Never', revenue: '$75' },
    { name: 'Sarah Kim', type: 'MEMBER', joinDate: '2019-06', age: '35-50', status: 'Expired', volunteer: 'Never', revenue: '$0' },
    { name: 'David Park', type: 'MEMBER', joinDate: '2020-11', age: '35-50', status: 'Expired', volunteer: 'Never', revenue: '$0' },
    { name: 'Lisa Wang', type: 'STUDENT Affiliate', joinDate: '2023-09', age: '22-34', status: 'Active', volunteer: 'Year 1', revenue: '$75' },
    { name: 'Robert Chen', type: 'Fellow', joinDate: '2021-05', age: '51-65', status: 'Active', volunteer: 'Year 2+', revenue: '$500' },
    { name: 'Emily Torres', type: 'MEMBER', joinDate: '2023-02', age: '35-50', status: 'Active', volunteer: 'Year 1', revenue: '$250' },
    { name: 'James Wilson', type: 'MEMBER', joinDate: '2022-08', age: '22-34', status: 'Expired', volunteer: 'Never', revenue: '$0' },
    { name: 'Maria Garcia', type: 'STUDENT Affiliate', joinDate: '2024-03', age: '22-34', status: 'Active', volunteer: 'Never', revenue: '$75' },
    { name: 'Thomas Brown', type: 'Member Early Career Year 1', joinDate: '2020-01', age: '22-34', status: 'Active', volunteer: 'Year 1', revenue: '$200' },
    { name: 'Amanda Rodriguez', type: 'MEMBER', joinDate: '2021-09', age: '35-50', status: 'Active', volunteer: 'Year 2+', revenue: '$250' },
    { name: 'Kevin Nguyen', type: 'STUDENT Affiliate', joinDate: '2023-11', age: '22-34', status: 'Active', volunteer: 'Year 1', revenue: '$75' },
    { name: 'Patricia Lee', type: 'MEMBER', joinDate: '2019-03', age: '51-65', status: 'Expired', volunteer: 'Never', revenue: '$0' },
    { name: 'Michael Anderson', type: 'Special Affiliate', joinDate: '2022-07', age: '35-50', status: 'Active', volunteer: 'Year 1', revenue: '$150' },
    { name: 'Jessica Martinez', type: 'MEMBER', joinDate: '2020-05', age: '35-50', status: 'Active', volunteer: 'Year 2+', revenue: '$250' },
    { name: 'Daniel Thompson', type: 'STUDENT Affiliate', joinDate: '2024-02', age: '22-34', status: 'Active', volunteer: 'Never', revenue: '$75' },
    { name: 'Laura Johnson', type: 'Retired Member', joinDate: '2018-12', age: '51-65', status: 'Active', volunteer: 'Never', revenue: '$100' },
    { name: 'Christopher White', type: 'Fellow', joinDate: '2021-08', age: '35-50', status: 'Active', volunteer: 'Year 1', revenue: '$500' },
    { name: 'Michelle Davis', type: 'Member Early Career Year 2', joinDate: '2023-04', age: '22-34', status: 'Active', volunteer: 'Year 1', revenue: '$200' },
    { name: 'Ryan Miller', type: 'STUDENT Affiliate', joinDate: '2023-10', age: '22-34', status: 'Active', volunteer: 'Year 1', revenue: '$75' },
  ];

  const displayMembers = filteredToProfessional ? members.filter(m => m.type === 'MEMBER') : members;

  const memberTypeData = [
    { type: 'MEMBER', '2024': 4438, '2025': 4604 },
    { type: 'STUDENT Affiliate', '2024': 1466, '2025': 1486 },
    { type: 'Member Early Career Year 1', '2024': 234, '2025': 225 },
    { type: 'Member Early Career Year 2', '2024': 220, '2025': 224 },
    { type: 'Fellow', '2024': 103, '2025': 103 },
    { type: 'Honorary Life Member - COMP', '2024': 93, '2025': 82 },
    { type: 'Special Affiliate', '2024': 92, '2025': 84 },
    { type: 'Retired Member', '2024': 85, '2025': 70 },
    { type: 'Section Associate', '2024': 71, '2025': 83 },
    { type: 'Bachelor Gap Year Affiliate', '2024': 57, '2025': 45 },
  ];

  const getMemberTypeDataWithPercentage = () => {
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
  };

  const chartDataToDisplay = getMemberTypeDataWithPercentage();

  const retentionPieData = [
    { name: 'Volunteered (85%)', value: 85, fill: '#22c55e' },
    { name: 'Never Volunteered (45%)', value: 45, fill: '#ef4444' },
  ];

  const toolbarIcons = [
    { id: 'chart', icon: BarChart3, label: 'Chart' },
    { id: 'compare', icon: Target, label: 'Compare' },
    { id: 'edit', icon: Edit3, label: 'Edit' },
    { id: 'filter', icon: Filter, label: 'Filter' },
    { id: 'view', icon: Eye, label: 'View' },
  ];

  useEffect(() => {
    if (compareMode && tableRef.current) {
      const headers = tableRef.current.querySelectorAll('th');
      const newPositions = {};
      
      headers.forEach((header) => {
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

  const handleProfessionalBarClick = () => {
    setFilteredToProfessional(true);
    setStep(3);
    setTimeout(() => setStep(4), 800);
  };

  const handleVolunteerMarkerClick = () => {
    setShowVolunteerSlideout(true);
    setStep(5);
  };

  const handleRevenuePerformanceClick = () => {
    setShowRevenuePanel(true);
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
        position: { x: tempMarkerPosition.x, y: tempMarkerPosition.y, baseY: baseY },
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

  const handleMarkerClick = () => {
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
      setDragOffset({ x: e.clientX - panelPosition.x, y: e.clientY - panelPosition.y });
    }
  };

  const handleLegendMouseDown = (e) => {
    if (e.target.closest('.legend-drag-handle')) {
      setIsDraggingLegend(true);
      setLegendDragOffset({ x: e.clientX - legendPosition.x, y: e.clientY - legendPosition.y });
    }
  };

  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({ width: panelDimensions.width, height: panelDimensions.height, mouseX: e.clientX, mouseY: e.clientY });
  };

  const handleRevenuePanelMouseDown = (e) => {
    if (e.target.closest('.revenue-panel-drag-handle')) {
      setIsDraggingRevenuePanel(true);
      setRevenueDragOffset({ x: e.clientX - revenuePanelPosition.x, y: e.clientY - revenuePanelPosition.y });
    }
  };

  const handleRevenueResizeMouseDown = (e) => {
    e.stopPropagation();
    setIsResizingRevenuePanel(true);
    setRevenueResizeStart({ width: revenuePanelDimensions.width, height: revenuePanelDimensions.height, mouseX: e.clientX, mouseY: e.clientY });
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

      if (isDraggingRevenuePanel) {
        const newX = Math.max(0, Math.min(window.innerWidth - 700, e.clientX - revenueDragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - revenueDragOffset.y));
        setRevenuePanelPosition({ x: newX, y: newY });
      }
      
      if (isResizingRevenuePanel) {
        const deltaX = e.clientX - revenueResizeStart.mouseX;
        const deltaY = e.clientY - revenueResizeStart.mouseY;
        const newWidth = Math.max(500, Math.min(1000, revenueResizeStart.width + deltaX));
        const newHeight = Math.max(400, Math.min(window.innerHeight * 0.9, revenueResizeStart.height + deltaY));
        setRevenuePanelDimensions({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsDraggingLegend(false);
      setIsResizing(false);
      setIsDraggingRevenuePanel(false);
      setIsResizingRevenuePanel(false);
    };

    if (isDragging || isResizing || isDraggingLegend || isDraggingRevenuePanel || isResizingRevenuePanel) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, isDraggingLegend, dragOffset, resizeStart, legendDragOffset, isDraggingRevenuePanel, isResizingRevenuePanel, revenueDragOffset, revenueResizeStart]);

  const togglePanelSize = () => {
    setPanelSize(prev => {
      if (prev === 'minimized') return 'normal';
      if (prev === 'normal') return 'maximized';
      return 'minimized';
    });
  };

  const getMarkerButton = (column, color, icon, title, onClick, shouldPulse = false, markerType = 'default') => {
    const Icon = icon;
    const position = markerPositions[column];
    
    if (!position) return null;

    const colorClasses = {
      slate: 'text-slate-600 border-slate-600 hover:bg-slate-50',
      purple: 'text-purple-600 border-purple-600 hover:bg-purple-50',
      amber: 'text-amber-600 border-amber-600 hover:bg-amber-50',
      green: 'text-green-600 border-green-600 hover:bg-green-50',
      blue: 'text-blue-600 border-blue-600 hover:bg-blue-50',
      red: 'text-red-600 border-red-600 hover:bg-red-50',
    };
    
    const markerStyles = {
      comparison: 'rounded-lg',
      trend: 'rounded-lg',
      alert: 'rounded-lg',
      correlation: 'rounded-lg',
      performance: 'rounded-full',
      financial: 'rounded-full',
    };
    
    const getRotation = () => {
      if (markerType === 'correlation') return 'rotate(45deg)';
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
          top: `${position.top}px`,
          transform: `translate(-50%, -50%) ${getRotation()}`,
          animation: shouldPulse ? 'pulseRing 2s infinite' : 'none',
        }}
        title={title}
      >
        <Icon className="w-4 h-4" strokeWidth={1.5} style={{ transform: getIconRotation() }} />
      </button>
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-50 font-sans" onClick={handlePageClick} ref={contentRef}>
      {showConfetti && <Confetti />}

      {markerPlacementMode && tempMarkerPosition && (
        <div className="absolute pointer-events-none z-[90]" style={{ left: tempMarkerPosition.x, top: tempMarkerPosition.y }}>
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

      {compareMode && getMarkerButton('MEMBER TYPE', 'slate', BarChart3, '📊 Comparison', handleMemberTypeClick, step === 1, 'comparison')}
      {compareMode && getMarkerButton('JOIN DATE', 'blue', TrendingUp, '📈 Trend', null, false, 'trend')}
      {compareMode && getMarkerButton('STATUS', filteredToProfessional ? 'purple' : 'red', filteredToProfessional ? Target : AlertTriangle, filteredToProfessional ? '🎯 Performance' : '⚠️ Alert', null, false, filteredToProfessional ? 'performance' : 'alert')}
      {compareMode && getMarkerButton('VOLUNTEER', 'amber', Activity, '🔗 Correlation', handleVolunteerMarkerClick, step === 4, 'correlation')}
      {compareMode && getMarkerButton('REVENUE', 'green', DollarSign, '💰 Financial', null, false, 'financial')}
      {compareMode && (
        <button
          onClick={handleRevenuePerformanceClick}
          className="fixed bg-white border-2 rounded-full p-2 shadow-lg transition-all hover:scale-110 z-[90] text-purple-600 border-purple-600 hover:bg-purple-50"
          style={{
            left: markerPositions['REVENUE'] ? `${markerPositions['REVENUE'].left + 40}px` : '0px',
            top: markerPositions['REVENUE'] ? `${markerPositions['REVENUE'].top}px` : '0px',
            transform: 'translate(-50%, -50%)',
          }}
          title="🎯 Performance: Revenue vs targets"
        >
          <Percent className="w-4 h-4" strokeWidth={1.5} />
        </button>
      )}

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg"></div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Members</h1>
              <p className="text-xs text-gray-500">
                {filteredToProfessional ? `${displayMembers.length} filtered` : '7,151 members'}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-400">Revenue Performance Demo</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 pb-20">
        <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="text-sm text-slate-900">
            {step === 0 && "👋 Click Compare mode (target icon in toolbar below)"}
            {step === 1 && "✨ Click the gray square above Member Type"}
            {step === 2 && "📊 Click the MEMBER bar (red)"}
            {step === 3 && "🔍 Filtering..."}
            {step === 4 && "⚡ Click the amber Volunteer marker"}
            {step === 5 && "💡 Click 'Add marker to page'"}
            {step === 6 && "📍 Click anywhere, then Save"}
            {step === 7 && "🎯 Click the yellow pin"}
            {step === 8 && "📋 Click 'Assign to Agentic Team'"}
            {step === 9 && "✅ Click 'Approve to Proceed'"}
            {step >= 10 && agentProgress < 100 && "⚙️ Building program..."}
            {step >= 10 && agentProgress === 100 && "🎉 Done! Try the purple Revenue Performance marker!"}
          </div>
        </div>

        {showMemberTypeChart && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-base font-semibold text-gray-900">Member Type Comparison</h3>
              <button onClick={() => setShowMemberTypeChart(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartDataToDisplay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="2024" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar 
                  dataKey="2025"
                  fill="#64748b"
                  radius={[4, 4, 0, 0]}
                  onClick={(data) => { if (data.type === 'MEMBER') handleProfessionalBarClick(); }}
                  style={{ cursor: 'pointer' }}
                >
                  {chartDataToDisplay.map((entry, index) => {
                    const item = memberTypeData.find(d => d.type === entry.type);
                    const change = item ? ((item['2025'] - item['2024']) / item['2024']) * 100 : 0;
                    const color = change > 5 ? '#22c55e' : change > 0 ? '#86efac' : change === 0 ? '#94a3b8' : change > -5 ? '#fca5a5' : '#ef4444';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full" ref={tableRef}>
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Join Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age Range</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volunteer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayMembers.map((member, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{member.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{member.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{member.joinDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{member.age}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${
                        member.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{member.volunteer}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{member.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="toolbar-glass rounded-full shadow-lg px-6 py-3 group">
          <div className="flex items-center gap-4">
            {toolbarIcons.map((item) => {
              const Icon = item.icon;
              const isCompare = item.id === 'compare';
              const isActive = compareMode && isCompare;
              const isHovered = hoveredIcon === item.id;
              
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
                    className={`p-2 rounded-lg transition-all ${
                      isActive ? 'bg-slate-50 scale-110 text-slate-700' : 'text-gray-400 hover:bg-gray-50 opacity-25 group-hover:opacity-100'
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

      {showRevenuePanel && (
        <div 
          className="fixed bg-white shadow-2xl border border-gray-300 rounded-lg overflow-hidden z-[150]"
          style={{
            left: `${revenuePanelPosition.x}px`,
            top: `${revenuePanelPosition.y}px`,
            width: `${revenuePanelDimensions.width}px`,
            height: `${revenuePanelDimensions.height}px`,
          }}
          onMouseDown={handleRevenuePanelMouseDown}
        >
          <div className="revenue-panel-drag-handle flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200 cursor-grab">
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-semibold">Revenue Performance</h2>
            </div>
            <button onClick={() => setShowRevenuePanel(false)} className="text-gray-500 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto" style={{ height: `${revenuePanelDimensions.height - 56}px` }}>
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Revenue Trend (2019-2025)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={revenueTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                  <Line type="monotone" dataKey="revenue" stroke="#9333ea" strokeWidth={2} dot={{ fill: '#9333ea', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Top Contributors</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueByTypeData.slice(0, 6)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                  <YAxis type="category" dataKey="type" tick={{ fontSize: 9 }} width={120} />
                  <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#9333ea" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">NEW vs RENEW</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueByTypeData.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="type" tick={{ fontSize: 9, angle: -45, textAnchor: 'end' }} height={80} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="newRevenue" stackId="a" fill="#22c55e" name="NEW" />
                  <Bar dataKey="renewRevenue" stackId="a" fill="#9333ea" name="RENEW" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Performance Heatmap</h3>
              <div className="grid grid-cols-5 gap-2">
                {membershipRevenueData.slice(0, 10).map((item) => {
                  const getPaceColor = (pace) => {
                    if (pace >= 110) return 'bg-green-600';
                    if (pace >= 100) return 'bg-green-500';
                    if (pace >= 95) return 'bg-green-400';
                    if (pace >= 90) return 'bg-yellow-400';
                    if (pace >= 80) return 'bg-orange-400';
                    return 'bg-red-400';
                  };
                  
                  return (
                    <div 
                      key={item.type}
                      className={`${getPaceColor(item.pace)} rounded p-2 text-white text-center cursor-pointer hover:scale-105 transition-transform`}
                      onMouseEnter={(e) => {
                        setHoveredMemberRow(item);
                        setShowRowRadar(true);
                        const rect = e.currentTarget.getBoundingClientRect();
                        setRadarPosition({ x: rect.right + 10, y: rect.top });
                      }}
                      onMouseLeave={() => {
                        setShowRowRadar(false);
                        setHoveredMemberRow(null);
                      }}
                    >
                      <div className="text-[9px] font-medium truncate">{item.type.split(' ').slice(0, 2).join(' ')}</div>
                      <div className="text-xs font-bold">{item.pace.toFixed(0)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-xs text-purple-700 font-medium">Total Revenue</div>
                <div className="text-base font-bold text-purple-900">${(totalRevenue2025/1000).toFixed(0)}K</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-xs text-green-700 font-medium">YoY Growth</div>
                <div className="text-base font-bold text-green-900">+{(((totalRevenue2025 - totalRevenue2024) / totalRevenue2024) * 100).toFixed(1)}%</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xs text-blue-700 font-medium">Avg PACE</div>
                <div className="text-base font-bold text-blue-900">
                  {(membershipRevenueData.reduce((sum, item) => sum + item.pace, 0) / membershipRevenueData.length).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
          
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-10"
            onMouseDown={handleRevenueResizeMouseDown}
            style={{ background: 'linear-gradient(135deg, transparent 50%, #cbd5e1 50%)' }}
          />
        </div>
      )}

      {showRowRadar && hoveredMemberRow && (
        <div 
          className="fixed bg-white shadow-2xl border-2 border-purple-300 rounded-lg p-4 z-[200]"
          style={{
            left: `${radarPosition.x}px`,
            top: `${radarPosition.y}px`,
            width: '280px',
            pointerEvents: 'none'
          }}
        >
          <div className="text-xs font-semibold text-center mb-3">{hoveredMemberRow.type}</div>
          <div style={{ width: '240px', height: '240px', margin: '0 auto' }}>
            <svg viewBox="0 0 240 240" className="w-full h-full">
              <circle cx="120" cy="120" r="100" fill="none" stroke="#f1f5f9" strokeWidth="1" />
              <circle cx="120" cy="120" r="75" fill="none" stroke="#f1f5f9" strokeWidth="1" />
              <circle cx="120" cy="120" r="50" fill="none" stroke="#f1f5f9" strokeWidth="1" />
              <circle cx="120" cy="120" r="25" fill="none" stroke="#f1f5f9" strokeWidth="1" />
              
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const angle = (i * 60 - 90) * (Math.PI / 180);
                const x = 120 + 100 * Math.cos(angle);
                const y = 120 + 100 * Math.sin(angle);
                return <line key={i} x1="120" y1="120" x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
              })}
              
              {(() => {
                const metrics = [
                  hoveredMemberRow.pace / 120 * 100,
                  hoveredMemberRow.oct2025 / Math.max(...membershipRevenueData.map(m => m.oct2025)) * 100,
                  (hoveredMemberRow.renew / (hoveredMemberRow.renew + hoveredMemberRow.new)) * 100,
                  (hoveredMemberRow.new / (hoveredMemberRow.renew + hoveredMemberRow.new)) * 100,
                  calculateRevenue(hoveredMemberRow) / Math.max(...membershipRevenueData.map(m => calculateRevenue(m))) * 100,
                  (hoveredMemberRow.diff >= 0 ? 100 : 50 + (hoveredMemberRow.diff / 20 * 50)),
                ];
                
                const points = metrics.map((value, i) => {
                  const angle = (i * 60 - 90) * (Math.PI / 180);
                  const radius = (value / 100) * 100;
                  return `${120 + radius * Math.cos(angle)},${120 + radius * Math.sin(angle)}`;
                }).join(' ');
                
                return (
                  <>
                    <polygon points={points} fill="rgba(147, 51, 234, 0.2)" stroke="#9333ea" strokeWidth="2" />
                    {metrics.map((value, i) => {
                      const angle = (i * 60 - 90) * (Math.PI / 180);
                      const radius = (value / 100) * 100;
                      return <circle key={i} cx={120 + radius * Math.cos(angle)} cy={120 + radius * Math.sin(angle)} r="3" fill="#9333ea" />;
                    })}
                  </>
                );
              })()}
              
              {['PACE', 'Members', 'Retention', 'New', 'Revenue', 'YoY'].map((label, i) => {
                const angle = (i * 60 - 90) * (Math.PI / 180);
                return (
                  <text 
                    key={i} 
                    x={120 + 115 * Math.cos(angle)} 
                    y={120 + 115 * Math.sin(angle)} 
                    fontSize="10" 
                    fill="#64748b" 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    fontWeight="600"
                  >
                    {label}
                  </text>
                );
              })}
            </svg>
          </div>
          <div className="mt-3 text-center text-xs">
            <span className="font-semibold">{hoveredMemberRow.oct2025}</span> members • 
            <span className="font-semibold"> {hoveredMemberRow.pace.toFixed(0)}%</span> PACE
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(71, 85, 105, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(71, 85, 105, 0); }
        }
        
        .toolbar-glass {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.08);
        }
        
        .toolbar-glass:hover {
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
        }
      `}</style>
    </div>
  );
};

const Confetti = () => {
  const particles = Array.from({ length: 50 });
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 5)],
            animation: `fall ${2 + Math.random() * 2}s linear forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(${Math.random() * 360}deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CompareModeDemo;