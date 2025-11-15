/**
 * RecordListingResizable Component
 *
 * Enhanced record listing interface featuring resizable panels and improved layout controls.
 * Builds upon the basic record listing by adding panel resize capabilities for a more
 * customizable user experience.
 *
 * Features:
 * - All RecordListingBasic features
 * - Resizable panels for flexible layouts
 * - Enhanced heatmap visualizations
 * - Improved marker placement controls
 * - Agent progress tracking
 * - Confetti celebrations on task completion
 *
 * @component
 * @returns {React.Component} RecordListingResizable component
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart3, Edit3, Filter, Eye, Target, TrendingUp, Users, AlertCircle, CheckCircle2, X,
  MapPin, Zap, AlertTriangle, Activity, ArrowUp, ArrowDown, Minus, GripVertical, MoreVertical
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar as RechartsRadar
} from 'recharts';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDraggable,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CompareModeDemo = () => {
  const [step, setStep] = useState(0);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [filteredToProfessional, setFilteredToProfessional] = useState(false);
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

  const [showHeatmapPanel, setShowHeatmapPanel] = useState(false);
  const [heatmapSize, setHeatmapSize] = useState('S');
  const [hoveredEngagementRow, setHoveredEngagementRow] = useState(null);

  const [showChartPreviewSlideout, setShowChartPreviewSlideout] = useState(false);
  const [previewChartType, setPreviewChartType] = useState(null);
  const [showChartConfigSlideout, setShowChartConfigSlideout] = useState(false);
  const [selectedHeatmapVariation, setSelectedHeatmapVariation] = useState('classic');
  const [selectedMemberForRadar, setSelectedMemberForRadar] = useState(null);

  const [chartPanels, setChartPanels] = useState([]);
  const [activeChartId, setActiveChartId] = useState(null);
  const gridRef = useRef(null);
  const resizingRef = useRef({ id: null, startX: 0, startY: 0, startSize: 'M', startHeight: 400, isResizing: false });

  const sensors = useSensors(
    useSensor(MouseSensor, { 
      activationConstraint: { 
        distance: 10,
        delay: 0
      } 
    }),
    useSensor(TouchSensor, { 
      activationConstraint: { 
        delay: 250, 
        tolerance: 5 
      } 
    }),
    useSensor(KeyboardSensor)
  );

  const statusAlertData = [
    { type: 'CPA Fellow', y2024: 103, y2025: 103, diff: 0, percentage: 0.00 },
    { type: 'Bachelor Gap Year', y2024: 57, y2025: 45, diff: -12, percentage: -26.67 },
    { type: 'CPA Honorary Fellow', y2024: 41, y2025: 36, diff: -5, percentage: -13.89 },
    { type: 'CPA Honorary Member', y2024: 93, y2025: 82, diff: -11, percentage: -13.41 },
    { type: 'CPA Intl Affiliate', y2024: 28, y2025: 24, diff: -4, percentage: -16.67 },
    { type: 'CPA Intl Student', y2024: 9, y2025: 7, diff: -2, percentage: -28.57 },
    { type: 'CPA MEMBER', y2024: 4438, y2025: 4604, diff: 166, percentage: 3.61 },
    { type: 'Early Career Yr1', y2024: 234, y2025: 225, diff: -9, percentage: -4.00 },
    { type: 'Early Career Yr2', y2024: 220, y2025: 224, diff: 4, percentage: 1.79 },
    { type: 'Parental Leave', y2024: 27, y2025: 21, diff: -6, percentage: -28.57 },
    { type: 'Retired Fellow', y2024: 14, y2025: 13, diff: -1, percentage: -7.69 },
    { type: 'Retired Member', y2024: 85, y2025: 70, diff: -15, percentage: -21.43 },
    { type: 'Special Affiliate', y2024: 92, y2025: 84, diff: -8, percentage: -9.52 },
    { type: 'STUDENT Affiliate', y2024: 1466, y2025: 1486, diff: 20, percentage: 1.35 },
    { type: 'CPA/APA Fellow', y2024: 1, y2025: 1, diff: 0, percentage: 0.00 },
    { type: 'CPA/APA Member', y2024: 16, y2025: 10, diff: -6, percentage: -60.00 },
    { type: 'Section Associate', y2024: 71, y2025: 83, diff: 12, percentage: 14.46 },
    { type: 'Complementary', y2024: 21, y2025: 20, diff: -1, percentage: -5.00 },
    { type: 'Campus/Student Rep', y2024: 11, y2025: 13, diff: 2, percentage: 15.38 },
  ];

  const members = [
    { id: 'M001', name: 'Jennifer Walsh', type: 'MEMBER', joinDate: '2022-03', renewalDate: '2025-03', status: 'Active', volunteer: 'Year 1', revenue: '$250', engagement: 82 },
    { id: 'M002', name: 'Marcus Chen', type: 'STUDENT Affiliate', joinDate: '2024-01', renewalDate: '2026-01', status: 'Active', volunteer: 'Never', revenue: '$75', engagement: 45 },
    { id: 'M003', name: 'Sarah Kim', type: 'MEMBER', joinDate: '2019-06', renewalDate: '2024-06', status: 'Expired', volunteer: 'Never', revenue: '$0', engagement: 28 },
    { id: 'M004', name: 'David Park', type: 'MEMBER', joinDate: '2020-11', renewalDate: '2024-11', status: 'Expired', volunteer: 'Never', revenue: '$0', engagement: 31 },
    { id: 'M005', name: 'Lisa Wang', type: 'STUDENT Affiliate', joinDate: '2023-09', renewalDate: '2025-09', status: 'Active', volunteer: 'Year 1', revenue: '$75', engagement: 76 },
    { id: 'M006', name: 'Robert Chen', type: 'Fellow', joinDate: '2021-05', renewalDate: '2026-05', status: 'Active', volunteer: 'Year 2+', revenue: '$500', engagement: 94 },
    { id: 'M007', name: 'Emily Torres', type: 'MEMBER', joinDate: '2023-02', renewalDate: '2026-02', status: 'Active', volunteer: 'Year 1', revenue: '$250', engagement: 88 },
    { id: 'M008', name: 'James Wilson', type: 'MEMBER', joinDate: '2022-08', renewalDate: '2024-08', status: 'Expired', volunteer: 'Never', revenue: '$0', engagement: 22 },
    { id: 'M009', name: 'Maria Garcia', type: 'STUDENT Affiliate', joinDate: '2024-03', renewalDate: '2026-03', status: 'Active', volunteer: 'Never', revenue: '$75', engagement: 52 },
    { id: 'M010', name: 'Thomas Brown', type: 'Member Early Career Year 1', joinDate: '2020-01', renewalDate: '2025-01', status: 'Active', volunteer: 'Year 1', revenue: '$200', engagement: 71 },
    { id: 'M011', name: 'Amanda Rodriguez', type: 'MEMBER', joinDate: '2021-09', renewalDate: '2025-09', status: 'Active', volunteer: 'Year 2+', revenue: '$250', engagement: 92 },
    { id: 'M012', name: 'Kevin Nguyen', type: 'STUDENT Affiliate', joinDate: '2023-11', renewalDate: '2025-11', status: 'Active', volunteer: 'Year 1', revenue: '$75', engagement: 68 },
    { id: 'M013', name: 'Patricia Lee', type: 'MEMBER', joinDate: '2019-03', renewalDate: '2023-03', status: 'Expired', volunteer: 'Never', revenue: '$0', engagement: 19 },
    { id: 'M014', name: 'Michael Anderson', type: 'Special Affiliate', joinDate: '2022-07', renewalDate: '2025-07', status: 'Active', volunteer: 'Year 1', revenue: '$150', engagement: 79 },
    { id: 'M015', name: 'Jessica Martinez', type: 'MEMBER', joinDate: '2020-05', renewalDate: '2025-05', status: 'Active', volunteer: 'Year 2+', revenue: '$250', engagement: 90 },
    { id: 'M016', name: 'Daniel Thompson', type: 'STUDENT Affiliate', joinDate: '2024-02', renewalDate: '2026-02', status: 'Active', volunteer: 'Never', revenue: '$75', engagement: 48 },
    { id: 'M017', name: 'Laura Johnson', type: 'Retired Member', joinDate: '2018-12', renewalDate: '2025-12', status: 'Active', volunteer: 'Never', revenue: '$100', engagement: 35 },
    { id: 'M018', name: 'Christopher White', type: 'Fellow', joinDate: '2021-08', renewalDate: '2026-08', status: 'Active', volunteer: 'Year 1', revenue: '$500', engagement: 86 },
    { id: 'M019', name: 'Michelle Davis', type: 'Member Early Career Year 2', joinDate: '2023-04', renewalDate: '2025-04', status: 'Active', volunteer: 'Year 1', revenue: '$200', engagement: 74 },
    { id: 'M020', name: 'Ryan Miller', type: 'STUDENT Affiliate', joinDate: '2023-10', renewalDate: '2025-10', status: 'Active', volunteer: 'Year 1', revenue: '$75', engagement: 65 },
  ];

  const getMemberRadarData = (member) => {
    const engagement = member.engagement || 50;
    const isVolunteer = member.volunteer !== 'Never';
    const revenueNum = parseInt(member.revenue.replace('$', '').replace(',', '')) || 0;

    const revenueContribution = { metric: 'Revenue Contribution', value: Math.min(95, (revenueNum / 500) * 100 + Math.random() * 10), category: 'financial' };

    const others = [
      { metric: 'Communications', value: engagement * 0.9 + Math.random() * 10, category: 'core' },
      { metric: 'Content', value: engagement * 0.85 + Math.random() * 15, category: 'core' },
      { metric: 'Events Participation', value: isVolunteer ? 75 + Math.random() * 15 : 30 + Math.random() * 20, category: 'core' },
      { metric: 'Community Activity', value: engagement * 0.8 + Math.random() * 15, category: 'core' },
      { metric: 'Volunteering', value: isVolunteer ? 80 + Math.random() * 15 : 10 + Math.random() * 15, category: 'leadership' },
      { metric: 'Leadership', value: isVolunteer ? 70 + Math.random() * 20 : 15 + Math.random() * 20, category: 'leadership' },
      { metric: 'Learning & Certification', value: 50 + Math.random() * 30, category: 'learning' },
      { metric: 'Feedback & Ideas', value: engagement * 0.6 + Math.random() * 25, category: 'learning' },
      { metric: 'Digital Engagement', value: engagement * 0.75 + Math.random() * 20, category: 'digital' },
      { metric: 'Advocacy', value: engagement * 0.65 + Math.random() * 25, category: 'digital' },
      { metric: 'Donation', value: 30 + Math.random() * 30, category: 'financial' },
    ];

    const currentData = [revenueContribution, ...others];
    const previousData = currentData.map(item => ({
      ...item,
      value: Math.max(0, item.value - 5 - Math.random() * 15)
    }));

    return { current: currentData, previous: previousData };
  };

  const getMetricColor = (category) => {
    const colors = {
      core: '#3b82f6',
      leadership: '#9333ea',
      learning: '#f97316',
      digital: '#14b8a6',
      financial: '#22c55e',
    };
    return colors[category] || '#64748b';
  };

  const displayMembers = filteredToProfessional ? members.filter(m => m.type === 'MEMBER') : members;

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

  const isPreviewOpen = showChartPreviewSlideout;
  const isConfigOpen = showChartConfigSlideout;
  const isBothOpen = isPreviewOpen && isConfigOpen;
  const isAnySlideoutOpen = showChartPreviewSlideout || showMarkerSlideout || showMarkerDetailSlideout || showAgentSlideout;

  const getStatusAlertCellColor = (percentage) => {
    if (percentage === 0 || percentage == null) return '#f1f5f9';
    if (percentage >= 10) return '#86efac';
    if (percentage >= 5) return '#bbf7d0';
    if (percentage >= 1) return '#dcfce7';
    if (percentage > -5) return '#fee2e2';
    if (percentage > -15) return '#fecaca';
    if (percentage > -25) return '#fca5a5';
    return '#fca5a5';
  };

  const getTrendIndicator = (percentage) => {
    if (percentage > 5) return { icon: ArrowUp, color: 'text-green-600', bg: 'bg-green-50' };
    if (percentage > 0) return { icon: ArrowUp, color: 'text-green-500', bg: 'bg-green-50' };
    if (percentage === 0) return { icon: Minus, color: 'text-gray-500', bg: 'bg-gray-50' };
    if (percentage > -10) return { icon: ArrowDown, color: 'text-orange-500', bg: 'bg-orange-50' };
    return { icon: ArrowDown, color: 'text-red-600', bg: 'bg-red-50' };
  };

  const updateMarkerPositions = () => {
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
  };

  useEffect(() => {
    updateMarkerPositions();
  }, [compareMode, filteredToProfessional, showHeatmapPanel]);

  useEffect(() => {
    if (!compareMode) return;

    const handleResize = () => updateMarkerPositions();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [compareMode, showHeatmapPanel]);

  useEffect(() => {
    const timer = setTimeout(() => updateMarkerPositions(), 100);
    return () => clearTimeout(timer);
  }, [showHeatmapPanel]);

  useEffect(() => {
    const chartHeight = showHeatmapPanel ? 500 : 0;
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
  }, [showHeatmapPanel]);

  const handleCompareClick = () => {
    setCompareMode(true);
    setStep(1);
  };

  const handleVolunteerMarkerClick = () => {
    setPreviewChartType('volunteer');
    setShowChartPreviewSlideout(true);
    setStep(2);
  };

  const handleHeatmapMarkerClick = () => {
    setPreviewChartType('heatmap');
    const heatmapExists = chartPanels.some(p => p.type === 'heatmap');
    if (heatmapExists) {
      setShowChartConfigSlideout(true);
      setShowChartPreviewSlideout(false);
    } else {
      setShowChartPreviewSlideout(true);
    }
  };

  const handleEngagementClick = (member) => {
    setSelectedMemberForRadar(member);
    setPreviewChartType('radar');
    setShowChartPreviewSlideout(true);
  };

  const handleAddHeatmapToCanvas = () => {
    const newPanel = {
      id: `heatmap-${Date.now()}`,
      type: 'heatmap',
      size: 'M',
      height: 400
    };
    setChartPanels([...chartPanels, newPanel]);
    setShowHeatmapPanel(true);
    setShowChartPreviewSlideout(false);
    setShowChartConfigSlideout(false);
  };

  const handleAddMarker = () => {
    setMarkerPlacementMode(true);
    setShowMarkerSlideout(true);
    setShowChartPreviewSlideout(false);
    setStep(3);
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
      const chartHeight = showHeatmapPanel ? 500 : 0;
      const baseY = showHeatmapPanel ? tempMarkerPosition.y - chartHeight : tempMarkerPosition.y;

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
      setShowMarkerDetailSlideout(true);
      setStep(4);
    }
  };

  const handleMarkerClick = () => {
    setShowMarkerDetailSlideout(true);
  };

  const handleGenerateTasks = () => { setTasksGenerated(true); setStep(5); };
  const handleAssignAgents = () => { setAgentsAssigned(true); setStep(6); };
  const handleApproveAndProceed = () => {
    setShowMarkerDetailSlideout(false);
    setShowAgentSlideout(true);
    setStep(7);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setAgentProgress(100);
      } else {
        setAgentProgress(currentProgress);
      }
    }, 100);
  };

  useEffect(() => {
    if (agentProgress === 100) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [agentProgress]);

  const getMarkerButton = (column, color, icon, title, onClick, shouldPulse = false, markerType = 'default', offsetX = 0) => {
    const Icon = icon;
    const position = markerPositions[column];
    if (!position) return null;

    const colorClasses = {
      amber: 'text-amber-600 border-amber-600 hover:bg-amber-50',
      red: 'text-red-600 border-red-600 hover:bg-red-50',
    };

    const markerStyles = {
      correlation: 'rounded-lg',
      alert: 'rounded-lg',
    };

    const getRotation = () => (markerType === 'correlation' ? 'rotate(45deg)' : 'rotate(0deg)');
    const getIconRotation = () => (markerType === 'correlation' ? 'rotate(-45deg)' : 'rotate(0deg)');

    return (
      <button
        onClick={onClick}
        className={`fixed bg-white border-2 ${markerStyles[markerType] || 'rounded-full'} p-2 shadow-lg transition-all hover:scale-110 z-[90] ${colorClasses[color]}`}
        style={{ left: `${position.left + offsetX}px`, top: `${position.top}px`, transform: `translate(-50%, -50%) ${getRotation()}`, animation: shouldPulse ? 'pulseRing 2s infinite' : 'none' }}
        title={title}
      >
        <Icon className="w-4 h-4" strokeWidth={1.5} style={{ transform: getIconRotation() }} />
      </button>
    );
  };

  const colSpanFor = (size) => {
    if (size === 'S') return 'col-span-12 md:col-span-6 lg:col-span-4';
    if (size === 'M') return 'col-span-12 md:col-span-6';
    return 'col-span-12';
  };

  const SizePicker = ({ value, onChange }) => (
    <div className="flex items-center gap-1">
      {['S','M','L'].map(s => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`px-2 py-1 text-[10px] rounded border ${value===s?'bg-slate-100 border-slate-400 text-slate-800':'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          title={s==='S'?'Small (third)':s==='M'?'Medium (half)':'Large (full)'}
        >
          {s}
        </button>
      ))}
    </div>
  );

  function onResizeStart(id, size, height, e) {
    e.preventDefault();
    e.stopPropagation();
    const t = e.currentTarget;
    t.setPointerCapture?.(e.pointerId);
    resizingRef.current = { id, startX: e.clientX, startY: e.clientY, startSize: size, startHeight: height, isResizing: true };
    window.addEventListener('pointermove', onResizeMove);
    window.addEventListener('pointerup', onResizeEnd, { once: true });
  }

  function onResizeMove(e) {
    const { id, startX, startY, startSize, startHeight, isResizing } = resizingRef.current || {};
    if (!id || !isResizing) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    // Width resize (S/M/L) - discrete jumps only
    let newSize = startSize;
    if (deltaX > 200) {
      // Dragging right - increase size
      if (startSize === 'S') {
        newSize = 'M';
        resizingRef.current.startSize = 'M';
        resizingRef.current.startX = e.clientX;
      } else if (startSize === 'M') {
        newSize = 'L';
        resizingRef.current.startSize = 'L';
        resizingRef.current.startX = e.clientX;
      }
    } else if (deltaX < -200) {
      // Dragging left - decrease size
      if (startSize === 'L') {
        newSize = 'M';
        resizingRef.current.startSize = 'M';
        resizingRef.current.startX = e.clientX;
      } else if (startSize === 'M') {
        newSize = 'S';
        resizingRef.current.startSize = 'S';
        resizingRef.current.startX = e.clientX;
      }
    }
    
    // Height resize (smooth, pixel-based)
    const newHeight = Math.max(350, Math.min(1000, startHeight + deltaY));
    
    // Only update if something changed
    const heightChanged = Math.abs(newHeight - startHeight) > 2;
    const sizeChanged = newSize !== startSize;
    
    if (sizeChanged || heightChanged) {
      setChartPanels(prev => prev.map(panel => 
        panel.id === id ? { ...panel, size: newSize, height: newHeight } : panel
      ));
      
      const panel = chartPanels.find(p => p.id === id);
      if (panel && panel.type === 'heatmap') {
        setHeatmapSize(newSize);
      }
      
      // Update height reference continuously for smooth resizing
      if (heightChanged) {
        resizingRef.current.startHeight = newHeight;
        resizingRef.current.startY = e.clientY;
      }
    }
  }

  function onResizeEnd() {
    resizingRef.current = { id: null, startX: 0, startY: 0, startSize: 'M', startHeight: 400, isResizing: false };
    window.removeEventListener('pointermove', onResizeMove);
  }

  function handleDragStart(event) {
    const { active } = event;
    setActiveChartId(active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveChartId(null);
    
    if (!over || active.id === over.id) return;
    
    setChartPanels((panels) => {
      const oldIndex = panels.findIndex((p) => p.id === active.id);
      const newIndex = panels.findIndex((p) => p.id === over.id);
      return arrayMove(panels, oldIndex, newIndex);
    });
  }

  function SortableChartCard({ panel }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ 
      id: panel.id 
    });
    
    const style = { 
      transform: CSS.Transform.toString(transform),
      opacity: isDragging ? 0.5 : 1,
    };

    const currentSize = panel.type === 'heatmap' ? heatmapSize : 'M';
    const currentHeight = panel.height || 400;

    const setSize = (newSize) => {
      if (panel.type === 'heatmap') setHeatmapSize(newSize);
      setChartPanels(prev => prev.map(p => 
        p.id === panel.id ? { ...p, size: newSize } : p
      ));
    };

    const removePanel = () => {
      setChartPanels(prev => prev.filter(p => p.id !== panel.id));
      if (panel.type === 'heatmap') setShowHeatmapPanel(false);
    };

    return (
      <div 
        ref={setNodeRef}
        style={style}
        className={`${colSpanFor(currentSize)} relative group`}
      >
        <div className="bg-white rounded-lg shadow-sm relative" style={{ height: `${currentHeight}px` }}>
          {/* Drag Handle - Top bar only */}
          <div
            className="absolute top-0 left-0 right-0 h-8 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-50 flex items-center px-2 bg-gradient-to-b from-gray-100 to-transparent"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 ml-1">Drag to reorder</span>
          </div>

          {/* Resize Handle - Bottom right corner */}
          <div
            className="absolute bottom-1 right-1 w-4 h-4 cursor-nwse-resize z-50 opacity-0 group-hover:opacity-100 transition-opacity"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onResizeStart(panel.id, currentSize, currentHeight, e);
            }}
            title="Resize width and height"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 10L10 15M15 5L5 15M15 0L0 15" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Chart Content */}
          <div className="p-6 h-full">
            {panel.type === 'heatmap' && (
              <HeatmapChart 
                size={currentSize}
                height={currentHeight}
                onSizeChange={setSize}
                onRemove={removePanel}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  function HeatmapChart({ size, height, onSizeChange, onRemove }) {
    const headerHeight = 80;
    const footerHeight = 60;
    const contentHeight = height - headerHeight - footerHeight - 48; // 48 for padding
    
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header - Fixed */}
        <div className="flex items-start justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Member Type Change Analysis</h3>
              <p className="text-xs text-gray-600 mt-1">2024 vs 2025 comparison by member type</p>
            </div>
            <SizePicker value={size} onChange={onSizeChange} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { 
                setPreviewChartType('heatmap'); 
                setShowChartConfigSlideout(true);
                setShowChartPreviewSlideout(false);
              }}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-50 rounded"
              title="Configure chart"
            >
              <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button onClick={onRemove} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div 
          style={{ 
            height: `${contentHeight}px`,
            minHeight: '200px',
            overflowY: 'auto', 
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch'
          }} 
          className="flex-shrink-0 scrollbar-thin"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {selectedHeatmapVariation === 'classic' && (
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-gray-50 z-10">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-700 p-3 border-b">Member Type</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b">2024</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b">2025</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b">Diff</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b">%</th>
                </tr>
              </thead>
              <tbody>
                {statusAlertData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="text-xs font-medium text-gray-700 p-3 border-b">{row.type}</td>
                    <td className="text-xs text-gray-700 p-3 border-b text-center">{row.y2024.toLocaleString()}</td>
                    <td className="text-xs text-gray-700 p-3 border-b text-center">{row.y2025.toLocaleString()}</td>
                    <td className="text-xs font-bold p-3 border-b text-center" style={{ backgroundColor: getStatusAlertCellColor(row.percentage) }}>
                      <span className={row.diff < 0 ? 'text-red-900' : row.diff > 0 ? 'text-green-900' : 'text-gray-700'}>
                        {row.diff > 0 ? '+' : ''}{row.diff}
                      </span>
                    </td>
                    <td className="text-xs font-bold p-3 border-b text-center" style={{ backgroundColor: getStatusAlertCellColor(row.percentage) }}>
                      <span className={row.percentage < 0 ? 'text-red-900' : row.percentage > 0 ? 'text-green-900' : 'text-gray-700'}>
                        {row.percentage > 0 ? '+' : ''}{row.percentage.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedHeatmapVariation === 'percentage' && (
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-gray-50 z-10">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-700 p-3 border-b">Member Type</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b">Percentage Change</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b">2024 → 2025</th>
                </tr>
              </thead>
              <tbody>
                {statusAlertData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="text-xs font-medium text-gray-700 p-3 border-b">{row.type}</td>
                    <td className="p-3 border-b">
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className="flex-1 h-8 rounded flex items-center justify-center font-bold text-xs"
                          style={{ backgroundColor: getStatusAlertCellColor(row.percentage), minWidth: '80px' }}
                        >
                          <span className={row.percentage < 0 ? 'text-red-900' : row.percentage > 0 ? 'text-green-900' : 'text-gray-700'}>
                            {row.percentage > 0 ? '+' : ''}{row.percentage.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs text-gray-600 p-3 border-b text-center">
                      {row.y2024} → {row.y2025}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedHeatmapVariation === 'trend' && (
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-gray-50 z-10">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-700 p-3 border-b">Member Type</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b">Trend</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b">%</th>
                </tr>
              </thead>
              <tbody>
                {statusAlertData.map((row, idx) => {
                  const trend = getTrendIndicator(row.percentage);
                  const TrendIcon = trend.icon;
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="text-xs font-medium text-gray-700 p-3 border-b">{row.type}</td>
                      <td className="p-3 border-b">
                        <div className="flex items-center justify-center">
                          <div className={`${trend.bg} rounded-full p-2`}>
                            <TrendIcon className={`w-4 h-4 ${trend.color}`} strokeWidth={2.5} />
                          </div>
                        </div>
                      </td>
                      <td className="text-xs font-bold p-3 border-b text-center">
                        <span className={row.percentage < 0 ? 'text-red-600' : row.percentage > 0 ? 'text-green-600' : 'text-gray-600'}>
                          {row.percentage > 0 ? '+' : ''}{row.percentage.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {selectedHeatmapVariation === 'compact' && (
            <div className="space-y-2 pr-2">
              {statusAlertData.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  style={{ backgroundColor: `${getStatusAlertCellColor(row.percentage)}20` }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-900 truncate">{row.type}</div>
                    <div className="text-[10px] text-gray-600">{row.y2024} → {row.y2025}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: getStatusAlertCellColor(row.percentage) }}>
                      <span className={row.diff < 0 ? 'text-red-900' : row.diff > 0 ? 'text-green-900' : 'text-gray-700'}>
                        {row.diff > 0 ? '+' : ''}{row.diff}
                      </span>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-bold min-w-[60px] text-center" style={{ backgroundColor: getStatusAlertCellColor(row.percentage) }}>
                      <span className={row.percentage < 0 ? 'text-red-900' : row.percentage > 0 ? 'text-green-900' : 'text-gray-700'}>
                        {row.percentage > 0 ? '+' : ''}{row.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer/Legend - Fixed */}
        <div className="mt-4 flex items-center flex-wrap gap-3 text-xs pt-4 border-t border-gray-200 flex-shrink-0">
          <span className="font-medium text-gray-700">Color Scale:</span>
          <div className="flex items-center gap-1"><div className="w-4 h-4 rounded" style={{background:'#fca5a5'}}></div><span className="text-gray-600">-25%+</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-4 rounded" style={{background:'#fecaca'}}></div><span className="text-gray-600">-15 to -25%</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-4 rounded" style={{background:'#fee2e2'}}></div><span className="text-gray-600">-1 to -5%</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-4 rounded" style={{background:'#f1f5f9'}}></div><span className="text-gray-600">0%</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-4 rounded" style={{background:'#dcfce7'}}></div><span className="text-gray-600">+1 to +5%</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-4 rounded" style={{background:'#bbf7d0'}}></div><span className="text-gray-600">+5 to +10%</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-4 rounded" style={{background:'#86efac'}}></div><span className="text-gray-600">+10%+</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 font-sans" onClick={handlePageClick}>
      {showConfetti && <Confetti />}

      <div
        ref={contentRef}
        className="transition-all duration-300 ease-in-out relative"
        style={{ 
          marginRight: isBothOpen 
            ? '64rem' 
            : (showChartPreviewSlideout || showMarkerSlideout || showMarkerDetailSlideout || showAgentSlideout)
              ? '32rem' 
              : '0' 
        }}
      >
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
            onClick={(e) => { e.stopPropagation(); handleMarkerClick(marker); }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <div className="bg-white border-2 border-amber-600 rounded-full p-2 shadow-lg hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        ))}

        {compareMode && !filteredToProfessional && getMarkerButton('STATUS', 'red', AlertTriangle, '⚠️ Alert Heatmap', handleHeatmapMarkerClick, false, 'alert')}
        {compareMode && getMarkerButton('ENGAGEMENT', 'amber', Activity, '🔗 Correlation', handleVolunteerMarkerClick, step === 1, 'correlation')}

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
            <div className="text-xs text-gray-400">Performance Dashboard Demo</div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 pb-20">
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="text-sm text-slate-900">
              {step === 0 && "👋 Click Compare mode (target icon in toolbar below)"}
              {step === 1 && "✨ Click Engagement marker (amber diamond) for volunteer correlation"}
              {step === 2 && "💡 Click 'Add marker to page'"}
              {step === 3 && "📍 Click anywhere, then Save"}
              {step === 4 && "🎯 Click the yellow pin"}
              {step === 5 && "📋 Click 'Assign to Agentic Team'"}
              {step === 6 && "✅ Click 'Approve to Proceed'"}
              {step >= 7 && agentProgress < 100 && "⚙️ Building program..."}
              {step >= 7 && agentProgress === 100 && "🎉 Done! Click Engagement scores for radar charts. Also try Status marker for heatmap!"}
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-12 gap-6 mb-6" ref={gridRef} style={{ willChange: 'auto' }}>
              {chartPanels.map((panel) => (
                <SortableChartCard key={panel.id} panel={panel} />
              ))}
            </div>
          </DndContext>

          <div className="bg-white rounded-lg shadow-sm mt-6" style={{ willChange: 'auto' }}>
            <div className="overflow-x-auto">
              <table className="w-full" ref={tableRef}>
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Join Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Renewal Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayMembers.map((member, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{member.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{member.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{member.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{member.joinDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{member.renewalDate}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${member.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {member.status}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-gray-900 font-medium cursor-pointer relative"
                        onMouseEnter={() => setHoveredEngagementRow(idx)}
                        onMouseLeave={() => setHoveredEngagementRow(null)}
                        onClick={() => handleEngagementClick(member)}
                      >
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          member.engagement >= 80 ? 'bg-green-100 text-green-800' :
                          member.engagement >= 60 ? 'bg-blue-100 text-blue-800' :
                          member.engagement >= 40 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {member.engagement}
                          {hoveredEngagementRow === idx && (
                            <Target className="w-3 h-3 ml-1 animate-pulse" strokeWidth={2} />
                          )}
                        </span>
                      </td>
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
      </div>

      {showChartPreviewSlideout && (
        <div
          className="fixed inset-y-0 right-0 w-[32rem] bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-[200] slideout-panel transition-all duration-300"
          style={{ transform: isConfigOpen ? 'translateX(-32rem)' : 'translateX(0)' }}
        >
          {previewChartType === 'volunteer' && (
            <div className="p-6 border-b border-amber-200 bg-amber-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-600" />
                  <div>
                    <h2 className="text-lg font-semibold text-amber-900">Volunteer Activity Correlation</h2>
                    <p className="text-xs text-amber-700">First-year impact on retention</p>
                  </div>
                </div>
                <button onClick={() => setShowChartPreviewSlideout(false)} className="text-amber-600 hover:text-amber-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {previewChartType === 'radar' && selectedMemberForRadar && (
            <div className="p-6 border-b border-purple-200 bg-purple-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <div>
                    <h2 className="text-lg font-semibold text-purple-900">{selectedMemberForRadar.name}</h2>
                    <p className="text-xs text-purple-700">12-Dimension Engagement Profile</p>
                  </div>
                </div>
                <button onClick={() => setShowChartPreviewSlideout(false)} className="text-purple-600 hover:text-purple-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {previewChartType === 'heatmap' && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-slate-600" />
                  <div>
                    <h2 className="text-lg font-semibold">Chart Preview</h2>
                    <p className="text-xs text-gray-600">Review before adding to page</p>
                  </div>
                </div>
                <button onClick={() => { setShowChartPreviewSlideout(false); setShowChartConfigSlideout(false); }} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="p-6 space-y-6">
            {previewChartType === 'volunteer' && (
              <div className="border border-amber-200 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div className="text-xs text-amber-900">
                        <div className="font-semibold mb-1">Key Insight</div>
                        <div>MEMBERs who volunteer in first year show 85% retention vs 45% for non-volunteers</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie data={retentionPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={5} dataKey="value">
                          {retentionPieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex items-center justify-center gap-3 text-xs">
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-gray-600">Volunteered</span></div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-gray-600">Never</span></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-medium text-gray-700 mb-2">5-Year Retention Breakdown</div>
                    <div>
                      <div className="flex items-center justify-between mb-1"><span className="text-xs text-gray-600">Volunteered in first year</span><span className="text-xs font-semibold text-green-600">85%</span></div>
                      <div className="h-8 bg-green-500 rounded flex items-center px-2 text-white text-[10px] font-medium" style={{ width: '85%' }}>1,420 of 1,670</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1"><span className="text-xs text-gray-600">Never volunteered</span><span className="text-xs font-semibold text-red-600">45%</span></div>
                      <div className="h-8 bg-red-500 rounded flex items-center px-2 text-white text-[10px] font-medium" style={{ width: '45%' }}>1,920 of 4,280</div>
                    </div>
                    <div className="bg-slate-50 rounded p-3 mt-3">
                      <div className="text-xs text-slate-700">
                        <div className="font-semibold mb-1">Retention gap: 40 percentage points</div>
                        <div className="text-[10px] text-slate-600 mt-1">Only 28% of new MEMBERs volunteer in their first year</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={handleAddMarker}
                    className="w-full px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Add marker to page
                  </button>
                </div>
              </div>
            )}

            {previewChartType === 'heatmap' && (
              <div className="space-y-6">
                {selectedHeatmapVariation === 'classic' && (
                  <div className="border border-red-200 rounded-lg overflow-hidden">
                    <div className="p-4 bg-red-50 border-b border-red-200 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-red-900">Classic Table Style</h3>
                        <p className="text-xs text-red-700 mt-1">Traditional table with color-coded cells</p>
                      </div>
                      <button
                        onClick={() => setShowChartConfigSlideout(true)}
                        className="text-red-700 hover:text-red-900 transition-colors p-1 hover:bg-red-100 rounded"
                        title="Configure chart"
                      >
                        <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
                      </button>
                    </div>
                    <div className="p-4 overflow-x-auto max-h-96">
                      <table className="w-full border-collapse text-xs">
                        <thead>
                          <tr>
                            <th className="text-left text-[9px] font-semibold text-gray-700 p-2 border-b border-gray-300 bg-gray-50 sticky top-0">Type</th>
                            <th className="text-center text-[9px] font-semibold text-gray-700 p-2 border-b border-gray-300 bg-gray-50 sticky top-0">2024</th>
                            <th className="text-center text-[9px] font-semibold text-gray-700 p-2 border-b border-gray-300 bg-gray-50 sticky top-0">2025</th>
                            <th className="text-center text-[9px] font-semibold text-gray-700 p-2 border-b border-gray-300 bg-gray-50 sticky top-0">%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {statusAlertData.map((row, idx) => (
                            <tr key={idx}>
                              <td className="text-[9px] font-medium text-gray-700 p-2 border-b border-gray-100 truncate max-w-[120px]">{row.type}</td>
                              <td className="text-[9px] text-gray-700 p-2 border-b border-gray-100 text-center">{row.y2024}</td>
                              <td className="text-[9px] text-gray-700 p-2 border-b border-gray-100 text-center">{row.y2025}</td>
                              <td className="p-2 border-b border-gray-100 text-center" style={{ backgroundColor: getStatusAlertCellColor(row.percentage) }}>
                                <span className={`text-[9px] font-bold ${row.percentage < 0 ? 'text-red-900' : row.percentage > 0 ? 'text-green-900' : 'text-gray-700'}`}>
                                  {row.percentage > 0 ? '+' : ''}{row.percentage.toFixed(1)}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedHeatmapVariation === 'percentage' && (
                  <div className="border border-red-200 rounded-lg overflow-hidden">
                    <div className="p-4 bg-red-50 border-b border-red-200 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-red-900">Percentage Focus Table</h3>
                        <p className="text-xs text-red-700 mt-1">Emphasizes percentage change with visual bars</p>
                      </div>
                      <button
                        onClick={() => setShowChartConfigSlideout(true)}
                        className="text-red-700 hover:text-red-900 transition-colors p-1 hover:bg-red-100 rounded"
                        title="Configure chart"
                      >
                        <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
                      </button>
                    </div>
                    <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                      {statusAlertData.map((row, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-24 text-[9px] text-gray-700 truncate font-medium">{row.type.split(' ')[0]}</div>
                          <div className="flex-1">
                            <div 
                              className="h-6 rounded flex items-center justify-center font-bold text-[9px]"
                              style={{ 
                                backgroundColor: getStatusAlertCellColor(row.percentage),
                                width: `${Math.min(100, Math.abs(row.percentage) * 5)}%`
                              }}
                            >
                              <span className={row.percentage < 0 ? 'text-red-900' : row.percentage > 0 ? 'text-green-900' : 'text-gray-700'}>
                                {row.percentage > 0 ? '+' : ''}{row.percentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedHeatmapVariation === 'trend' && (
                  <div className="border border-red-200 rounded-lg overflow-hidden">
                    <div className="p-4 bg-red-50 border-b border-red-200 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-red-900">Trend Indicators Table</h3>
                        <p className="text-xs text-red-700 mt-1">Visual trend arrows with data</p>
                      </div>
                      <button
                        onClick={() => setShowChartConfigSlideout(true)}
                        className="text-red-700 hover:text-red-900 transition-colors p-1 hover:bg-red-100 rounded"
                        title="Configure chart"
                      >
                        <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
                      </button>
                    </div>
                    <div className="p-4 overflow-x-auto max-h-96">
                      <table className="w-full border-collapse text-xs">
                        <thead>
                          <tr>
                            <th className="text-left text-[9px] font-semibold text-gray-700 p-2 border-b border-gray-300 bg-gray-50 sticky top-0">Type</th>
                            <th className="text-center text-[9px] font-semibold text-gray-700 p-2 border-b border-gray-300 bg-gray-50 sticky top-0">Trend</th>
                            <th className="text-center text-[9px] font-semibold text-gray-700 p-2 border-b border-gray-300 bg-gray-50 sticky top-0">%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {statusAlertData.map((row, idx) => {
                            const trend = getTrendIndicator(row.percentage);
                            const TrendIcon = trend.icon;
                            return (
                              <tr key={idx}>
                                <td className="text-[9px] font-medium text-gray-700 p-2 border-b border-gray-100 truncate max-w-[100px]">{row.type}</td>
                                <td className="p-2 border-b border-gray-100">
                                  <div className="flex items-center justify-center">
                                    <div className={`${trend.bg} rounded-full p-1`}>
                                      <TrendIcon className={`w-3 h-3 ${trend.color}`} strokeWidth={2.5} />
                                    </div>
                                  </div>
                                </td>
                                <td className="text-[9px] font-bold p-2 border-b border-gray-100 text-center">
                                  <span className={row.percentage < 0 ? 'text-red-600' : row.percentage > 0 ? 'text-green-600' : 'text-gray-600'}>
                                    {row.percentage > 0 ? '+' : ''}{row.percentage.toFixed(1)}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedHeatmapVariation === 'compact' && (
                  <div className="border border-red-200 rounded-lg overflow-hidden">
                    <div className="p-4 bg-red-50 border-b border-red-200 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-red-900">Compact Dashboard Table</h3>
                        <p className="text-xs text-red-700 mt-1">Condensed view with key metrics</p>
                      </div>
                      <button
                        onClick={() => setShowChartConfigSlideout(true)}
                        className="text-red-700 hover:text-red-900 transition-colors p-1 hover:bg-red-100 rounded"
                        title="Configure chart"
                      >
                        <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
                      </button>
                    </div>
                    <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                      {statusAlertData.map((row, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center gap-2 p-2 rounded border border-gray-200"
                          style={{ backgroundColor: `${getStatusAlertCellColor(row.percentage)}20` }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-[9px] font-semibold text-gray-900 truncate">{row.type}</div>
                            <div className="text-[8px] text-gray-600">{row.y2024} → {row.y2025}</div>
                          </div>
                          <div 
                            className="px-2 py-1 rounded text-[9px] font-bold"
                            style={{ backgroundColor: getStatusAlertCellColor(row.percentage) }}
                          >
                            <span className={row.percentage < 0 ? 'text-red-900' : row.percentage > 0 ? 'text-green-900' : 'text-gray-700'}>
                              {row.percentage > 0 ? '+' : ''}{row.percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200">
                  <button
                    onClick={handleAddHeatmapToCanvas}
                    className="w-full px-4 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Add to page
                  </button>
                </div>
              </div>
            )}

            {previewChartType === 'radar' && selectedMemberForRadar && (
              <div className="border border-purple-200 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-600 rounded"></div><span>Current Period</span></div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-400 rounded"></div><span>Previous Period</span></div>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={getMemberRadarData(selectedMemberForRadar).current}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis
                        dataKey="metric"
                        tick={(props) => {
                          const { x, y, payload, index } = props;
                          const data = getMemberRadarData(selectedMemberForRadar).current[index];
                          const color = getMetricColor(data.category);
                          return (
                            <text x={x} y={y} textAnchor={x > 200 ? 'start' : 'end'} fontSize={9} fill={color} fontWeight="600">
                              {payload.value}
                            </text>
                          );
                        }}
                      />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                      <RechartsRadar name="Previous" dataKey="value" data={getMemberRadarData(selectedMemberForRadar).previous} stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} />
                      <RechartsRadar name="Current" dataKey="value" data={getMemberRadarData(selectedMemberForRadar).current} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="mt-6 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Dimension Categories:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#3b82f6'}}></div>
                        <span className="text-xs font-medium text-gray-700">Core Engagement</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#9333ea'}}></div>
                        <span className="text-xs font-medium text-gray-700">Leadership</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#f97316'}}></div>
                        <span className="text-xs font-medium text-gray-700">Learning</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-teal-50 rounded">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#14b8a6'}}></div>
                        <span className="text-xs font-medium text-gray-700">Digital</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded col-span-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#22c55e'}}></div>
                        <span className="text-xs font-medium text-gray-700">Financial Impact</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2 bg-gray-50 rounded"><span className="text-gray-600">Overall Engagement:</span><span className="ml-2 font-semibold text-blue-600">{selectedMemberForRadar.engagement}/100</span></div>
                    <div className="p-2 bg-gray-50 rounded"><span className="text-gray-600">Status:</span><span className="ml-2 font-semibold">{selectedMemberForRadar.status}</span></div>
                    <div className="p-2 bg-gray-50 rounded"><span className="text-gray-600">Volunteer:</span><span className="ml-2 font-semibold">{selectedMemberForRadar.volunteer}</span></div>
                    <div className="p-2 bg-gray-50 rounded"><span className="text-gray-600">Revenue:</span><span className="ml-2 font-semibold">{selectedMemberForRadar.revenue}</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showChartConfigSlideout && previewChartType === 'heatmap' && (
        <div className="fixed inset-y-0 right-0 w-[32rem] bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-[210] slideout-panel">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-semibold">Heatmap Configuration</h2>
              </div>
              <button onClick={() => setShowChartConfigSlideout(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-3">Choose Table Style</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setSelectedHeatmapVariation('classic')} className={`px-3 py-2 text-xs rounded-lg ${selectedHeatmapVariation==='classic'?'bg-red-600 text-white':'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
                  📋 Classic Table
                </button>
                <button onClick={() => setSelectedHeatmapVariation('percentage')} className={`px-3 py-2 text-xs rounded-lg ${selectedHeatmapVariation==='percentage'?'bg-red-600 text-white':'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
                  📊 Percentage Focus
                </button>
                <button onClick={() => setSelectedHeatmapVariation('trend')} className={`px-3 py-2 text-xs rounded-lg ${selectedHeatmapVariation==='trend'?'bg-red-600 text-white':'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
                  📈 Trend Indicators
                </button>
                <button onClick={() => setSelectedHeatmapVariation('compact')} className={`px-3 py-2 text-xs rounded-lg ${selectedHeatmapVariation==='compact'?'bg-red-600 text-white':'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
                  📱 Compact Dashboard
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <button onClick={() => setShowChartConfigSlideout(false)} className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-medium rounded-lg transition-colors">
                Apply Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {showMarkerSlideout && (
        <div className="fixed right-0 top-0 h-full w-[32rem] bg-white shadow-2xl border-l border-gray-200 z-[100] slideout-panel overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Place Marker</h2>
              <button onClick={() => { setShowMarkerSlideout(false); setMarkerPlacementMode(false); setTempMarkerPosition(null); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">Click anywhere on the page to place your insight marker</p>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Marker Label</label>
              <input type="text" defaultValue="First-Year Volunteer Activation Gap" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea defaultValue="MEMBERs who volunteer in year 1 show 85% retention vs 45% for non-volunteers." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-24 resize-none" />
            </div>

            <button
              onClick={handleSaveMarker}
              disabled={!tempMarkerPosition}
              className={`w-full px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                tempMarkerPosition
                  ? 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Save Marker
            </button>
          </div>
        </div>
      )}

      {showMarkerDetailSlideout && (
        <div className="fixed right-0 top-0 h-full w-[32rem] bg-white shadow-2xl border-l border-gray-200 z-[100] slideout-panel overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Insight Details</h2>
              <button onClick={() => setShowMarkerDetailSlideout(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-base font-semibold mb-2">First-Year Volunteer Activation Gap</h3>
              <p className="text-sm text-gray-600">MEMBERs who volunteer in year 1 show 85% retention vs 45% for non-volunteers.</p>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3">Suggested Actions</h4>
              {!tasksGenerated ? (
                <button onClick={handleGenerateTasks} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  Generate Action Plan
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Create onboarding volunteer program</p>
                        <p className="text-xs text-gray-600">Target: First-year MEMBERs</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Send personalized volunteer invitations</p>
                        <p className="text-xs text-gray-600">Timing: Within 30 days of joining</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Track and measure volunteer engagement</p>
                        <p className="text-xs text-gray-600">Monitor retention improvements</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {tasksGenerated && !agentsAssigned && (
              <button onClick={handleAssignAgents} className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 mb-4">
                <Users className="w-4 h-4" />
                Assign to Agentic Team
              </button>
            )}

            {agentsAssigned && (
              <div className="mb-4">
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-900">Agentic Team Assigned</span>
                  </div>
                  <div className="space-y-2 text-xs text-purple-800">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-400 rounded-full"></div><span>Campaign Designer Agent</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-400 rounded-full"></div><span>Email Automation Agent</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-400 rounded-full"></div><span>Analytics Tracking Agent</span></div>
                  </div>
                </div>

                <button onClick={handleApproveAndProceed} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 mt-4">
                  <CheckCircle2 className="w-4 h-4" />
                  Approve & Proceed
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showAgentSlideout && (
        <div className="fixed right-0 top-0 h-full w-[32rem] bg-white shadow-2xl border-l border-gray-200 z-[100] slideout-panel overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Agentic Execution</h2>
              <button onClick={() => setShowAgentSlideout(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Building Program</span>
                <span className="text-sm font-semibold text-purple-600">{agentProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${agentProgress}%` }}></div>
              </div>
            </div>

            <div className="space-y-3">
              {agentProgress >= 20 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Campaign Created</p>
                      <p className="text-xs text-green-700">First-Year Volunteer Activation</p>
                    </div>
                  </div>
                </div>
              )}

              {agentProgress >= 40 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Email Templates Built</p>
                      <p className="text-xs text-green-700">3 personalized templates ready</p>
                    </div>
                  </div>
                </div>
              )}

              {agentProgress >= 60 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Automation Configured</p>
                      <p className="text-xs text-green-700">30-day trigger sequence</p>
                    </div>
                  </div>
                </div>
              )}

              {agentProgress >= 80 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Analytics Dashboard Set Up</p>
                      <p className="text-xs text-green-700">Tracking retention metrics</p>
                    </div>
                  </div>
                </div>
              )}

              {agentProgress === 100 && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-purple-900">Program Ready!</p>
                      <p className="text-xs text-purple-700">First-Year Volunteer Activation program is live and running</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
        
        [style*="marginRight"] {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          will-change: margin-right;
        }
        
        .recharts-surface {
          will-change: auto;
          transform: translateZ(0);
        }
        
        .grid {
          contain: layout;
        }
        
        .recharts-wrapper {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        .bg-white {
          transform: translateZ(0);
        }
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
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