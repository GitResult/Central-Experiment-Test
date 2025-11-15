import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart3, Edit3, Filter, Eye, Target, TrendingUp, Users, AlertCircle, CheckCircle2, X,
  MapPin, Zap, DollarSign, AlertTriangle, Activity, Percent, LineChart, Plus, MoreVertical,
  Loader2, Clock, Settings, ArrowUp, ArrowDown, Minus, GripVertical
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
  PieChart, Pie, LineChart as RechartsLineChart, Line, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar as RechartsRadar, ComposedChart
} from 'recharts';
import {
  DndContext,
  DragOverlay,
  pointerWithin,
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
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CompareModeDemo = () => {
  const [step, setStep] = useState(0);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [showMemberTypeChart, setShowMemberTypeChart] = useState(false);
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

  // Chart configuration states
  const [chartAggregation, setChartAggregation] = useState('count');
  const [selectedMemberTypes, setSelectedMemberTypes] = useState(['MEMBER', 'STUDENT Affiliate']);
  const [chartType, setChartType] = useState('bar');
  const [changeType, setChangeType] = useState('absolute');
  const [showPreviousYear, setShowPreviousYear] = useState(true);
  const [showForecast, setShowForecast] = useState(false);
  const [comparisonPeriod, setComparisonPeriod] = useState('yoy');
  const [baseYear, setBaseYear] = useState('2024');
  const [compareToYear, setCompareToYear] = useState('2023');
  const [granularity, setGranularity] = useState('annually');
  const [selectedMetric, setSelectedMetric] = useState('count');

  // Individual chart panels for canvas (+ sizes)
  const [showRevenueTrendPanel, setShowRevenueTrendPanel] = useState(false);
  const [showPerformancePanel, setShowPerformancePanel] = useState(false);
  const [showMemberRadarPanel, setShowMemberRadarPanel] = useState(false);
  const [selectedMemberForRadar, setSelectedMemberForRadar] = useState(null);
  const [showHeatmapPanel, setShowHeatmapPanel] = useState(false);
  const [showRenewalTrendPanel, setShowRenewalTrendPanel] = useState(false);

  const [memberTypeSize, setMemberTypeSize] = useState('S');
  const [revenueTrendSize, setRevenueTrendSize] = useState('S');
  const [performanceSize, setPerformanceSize] = useState('S');
  const [heatmapSize, setHeatmapSize] = useState('S');
  const [renewalTrendSize, setRenewalTrendSize] = useState('S');

  const [hoveredEngagementRow, setHoveredEngagementRow] = useState(null);

  // Chart preview slideout states
  const [showChartPreviewSlideout, setShowChartPreviewSlideout] = useState(false);
  const [previewChartType, setPreviewChartType] = useState(null);

  // Configuration slideout (nested)
  const [showChartConfigSlideout, setShowChartConfigSlideout] = useState(false);
  const [showMemberTypeSelector, setShowMemberTypeSelector] = useState(false);

  // Revenue chart states
  const [revenueChartType, setRevenueChartType] = useState('bar');
  const [selectedRevenueYears, setSelectedRevenueYears] = useState(['2024', '2025', '2026']);
  const [selectedRevenueMemberTypes, setSelectedRevenueMemberTypes] = useState(['Premium', 'Standard', 'Student', 'Corporate']);
  const [showForecastConfidence, setShowForecastConfidence] = useState(false);
  const [revenueQuickView, setRevenueQuickView] = useState('executive');
  const [revenueOverlayMode, setRevenueOverlayMode] = useState('overlay');

  // Revenue Performance slideout parity
  const [performanceOverlayMode, setPerformanceOverlayMode] = useState('overlay');
  const [performanceIncludeGoal, setPerformanceIncludeGoal] = useState(true);
  const [performanceYears, setPerformanceYears] = useState(['2025']);

  // Heatmap style
  const [selectedHeatmapVariation, setSelectedHeatmapVariation] = useState('classic');

  // Renewal Trend slideout parity
  const [renewalDeltaAsPct, setRenewalDeltaAsPct] = useState(true);
  const [renewalYears, setRenewalYears] = useState(['2024', '2025', '2026']);
  const [renewalSelectedTypes, setRenewalSelectedTypes] = useState([]);

  // NEW: Chart panels state for drag & drop
  const [chartPanels, setChartPanels] = useState([]);
  const [activeChartId, setActiveChartId] = useState(null);
  const gridRef = useRef(null);
  const resizingRef = useRef({ id: null, startX: 0, startSize: 'M' });

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  );

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

  // Renewal trend data by member type
  const renewalTrendDataByType = {
    'MEMBER': [
      { month: 'Dec', y2024: 1200, y2025: 1300, y2026: 1400 },
      { month: 'Jan', y2024: 2400, y2025: 2500, y2026: 2650 },
      { month: 'Feb', y2024: 2500, y2025: 2600, y2026: 2750 },
      { month: 'Mar', y2024: 2600, y2025: 2700, y2026: 2850 },
      { month: 'Apr', y2024: 2700, y2025: 2800, y2026: 2950 },
      { month: 'May', y2024: 2800, y2025: 2900, y2026: 3050 },
      { month: 'Jun', y2024: 2900, y2025: 3000, y2026: 3150 },
      { month: 'Jul', y2024: 3000, y2025: 3100, y2026: 3250 },
      { month: 'Aug', y2024: 3050, y2025: 3150, y2026: 3300 },
      { month: 'Sep', y2024: 3100, y2025: 3200, y2026: 3350 },
      { month: 'Oct', y2024: 3150, y2025: null, y2026: 3400 },
      { month: 'Nov', y2024: 3200, y2025: null, y2026: 3450 },
    ],
    'STUDENT Affiliate': [
      { month: 'Dec', y2024: 800, y2025: 900, y2026: 980 },
      { month: 'Jan', y2024: 1500, y2025: 1600, y2026: 1700 },
      { month: 'Feb', y2024: 1550, y2025: 1650, y2026: 1750 },
      { month: 'Mar', y2024: 1600, y2025: 1700, y2026: 1800 },
      { month: 'Apr', y2024: 1650, y2025: 1750, y2026: 1850 },
      { month: 'May', y2024: 1700, y2025: 1800, y2026: 1900 },
      { month: 'Jun', y2024: 1750, y2025: 1850, y2026: 1950 },
      { month: 'Jul', y2024: 1800, y2025: 1900, y2026: 2000 },
      { month: 'Aug', y2024: 1850, y2025: 1950, y2026: 2050 },
      { month: 'Sep', y2024: 1900, y2025: 2000, y2026: 2100 },
      { month: 'Oct', y2024: 1950, y2025: null, y2026: 2150 },
      { month: 'Nov', y2024: 2000, y2025: null, y2026: 2200 },
    ],
    'Member Early Career Year 1': [
      { month: 'Dec', y2024: 180, y2025: 190, y2026: 200 },
      { month: 'Jan', y2024: 350, y2025: 370, y2026: 390 },
      { month: 'Feb', y2024: 360, y2025: 380, y2026: 400 },
      { month: 'Mar', y2024: 370, y2025: 390, y2026: 410 },
      { month: 'Apr', y2024: 380, y2025: 400, y2026: 420 },
      { month: 'May', y2024: 390, y2025: 410, y2026: 430 },
      { month: 'Jun', y2024: 400, y2025: 420, y2026: 440 },
      { month: 'Jul', y2024: 410, y2025: 430, y2026: 450 },
      { month: 'Aug', y2024: 420, y2025: 440, y2026: 460 },
      { month: 'Sep', y2024: 430, y2025: 450, y2026: 470 },
      { month: 'Oct', y2024: 440, y2025: null, y2026: 480 },
      { month: 'Nov', y2024: 450, y2025: null, y2026: 490 },
    ],
    'Fellow': [
      { month: 'Dec', y2024: 90, y2025: 95, y2026: 100 },
      { month: 'Jan', y2024: 175, y2025: 180, y2026: 190 },
      { month: 'Feb', y2024: 180, y2025: 185, y2026: 195 },
      { month: 'Mar', y2024: 185, y2025: 190, y2026: 200 },
      { month: 'Apr', y2024: 190, y2025: 195, y2026: 205 },
      { month: 'May', y2024: 195, y2025: 200, y2026: 210 },
      { month: 'Jun', y2024: 200, y2025: 205, y2026: 215 },
      { month: 'Jul', y2024: 205, y2025: 210, y2026: 220 },
      { month: 'Aug', y2024: 210, y2025: 215, y2026: 225 },
      { month: 'Sep', y2024: 215, y2025: 220, y2026: 230 },
      { month: 'Oct', y2024: 220, y2025: null, y2026: 235 },
      { month: 'Nov', y2024: 225, y2025: null, y2026: 240 },
    ],
  };

  // Calculate combined renewal trend based on selected types
  const getFilteredRenewalTrendData = () => {
    const typesToInclude = renewalSelectedTypes.length > 0 
      ? renewalSelectedTypes 
      : Object.keys(renewalTrendDataByType);

    const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    
    return months.map((month, idx) => {
      let sum2024 = 0;
      let sum2025 = 0;
      let sum2026 = 0;

      typesToInclude.forEach(type => {
        if (renewalTrendDataByType[type]) {
          const data = renewalTrendDataByType[type][idx];
          sum2024 += data.y2024 || 0;
          sum2025 += data.y2025 || 0;
          sum2026 += data.y2026 || 0;
        }
      });

      const delta = sum2025 && sum2024 ? sum2025 - sum2024 : null;
      const deltaPct = sum2025 && sum2024 ? ((sum2025 - sum2024) / sum2024) * 100 : null;

      return {
        month,
        y2024: sum2024,
        y2025: sum2025 || null,
        y2026: sum2026,
        delta,
        deltaPct
      };
    });
  };

  const renewalTrendData = getFilteredRenewalTrendData();

  const cumulativeRevenueData = [
    { month: 'Jan', prev2024: 820000, actual2025: 890000, forecast2025: 920000, future2026: 980000, goal: 950000 },
    { month: 'Feb', prev2024: 850000, actual2025: 920000, forecast2025: 950000, future2026: 1020000, goal: 980000 },
    { month: 'Mar', prev2024: 880000, actual2025: 950000, forecast2025: 980000, future2026: 1060000, goal: 1010000 },
    { month: 'Apr', prev2024: 910000, actual2025: 980000, forecast2025: 1010000, future2026: 1100000, goal: 1040000 },
    { month: 'May', prev2024: 940000, actual2025: 1010000, forecast2025: 1040000, future2026: 1140000, goal: 1070000 },
    { month: 'Jun', prev2024: 970000, actual2025: 1040000, forecast2025: 1070000, future2026: 1180000, goal: 1100000 },
    { month: 'Jul', prev2024: 1000000, actual2025: 1070000, forecast2025: 1100000, future2026: 1220000, goal: 1130000 },
    { month: 'Aug', prev2024: 1030000, actual2025: 1100000, forecast2025: 1130000, future2026: 1260000, goal: 1160000 },
    { month: 'Sep', prev2024: 1060000, actual2025: 1130000, forecast2025: 1160000, future2026: 1300000, goal: 1190000 },
    { month: 'Oct', prev2024: 1090000, actual2025: null, forecast2025: 1190000, future2026: 1340000, goal: 1220000 },
    { month: 'Nov', prev2024: 1120000, actual2025: null, forecast2025: 1220000, future2026: 1380000, goal: 1250000 },
    { month: 'Dec', prev2024: 1150000, actual2025: null, forecast2025: 1250000, future2026: 1420000, goal: 1280000 },
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
  }, [compareMode, showMemberTypeChart, filteredToProfessional, isAnySlideoutOpen, isConfigOpen, showPerformancePanel, showRevenueTrendPanel, showHeatmapPanel, showRenewalTrendPanel, chartPanels]);

  useEffect(() => {
    if (!compareMode) return;

    const handleResize = () => updateMarkerPositions();
    const handleScroll = () => updateMarkerPositions();

    const timer = setTimeout(() => updateMarkerPositions(), 350);

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
      clearTimeout(timer);
    };
  }, [compareMode, isAnySlideoutOpen, isConfigOpen, showMemberTypeChart, showRevenueTrendPanel, showPerformancePanel, showHeatmapPanel, showRenewalTrendPanel, chartPanels]);

  useEffect(() => {
    const timer = setTimeout(() => updateMarkerPositions(), 100);
    return () => clearTimeout(timer);
  }, [showMemberTypeChart, showRevenueTrendPanel, showPerformancePanel, showHeatmapPanel, showRenewalTrendPanel, memberTypeSize, revenueTrendSize, performanceSize, heatmapSize, renewalTrendSize, chartPanels]);

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
    setPreviewChartType('memberType');
    setShowChartPreviewSlideout(true);
    setStep(2);
  };
  
  const handleProfessionalBarClick = () => {
    setFilteredToProfessional(true);
    setStep(3);
    setTimeout(() => setStep(4), 800);
  };

  const handleVolunteerMarkerClick = () => {
    setPreviewChartType('volunteer');
    setShowChartPreviewSlideout(true);
    setStep(5);
  };

  const handleRevenueMarkerClick = () => {
    setPreviewChartType('revenue');
    setShowChartPreviewSlideout(true);
  };

  const handlePerformanceMarkerClick = () => {
    setPreviewChartType('performance');
    setShowChartPreviewSlideout(true);
  };

  const handleHeatmapMarkerClick = () => {
    setPreviewChartType('heatmap');
    setShowChartPreviewSlideout(true);
  };

  const handleRenewalTrendMarkerClick = () => {
    setPreviewChartType('renewalTrend');
    setShowChartPreviewSlideout(true);
  };

  const handleEngagementClick = (member) => {
    setSelectedMemberForRadar(member);
    setPreviewChartType('radar');
    setShowChartPreviewSlideout(true);
  };

  // NEW: Add chart to canvas
  const handleAddMemberTypeToCanvas = () => {
    const newPanel = {
      id: `memberType-${Date.now()}`,
      type: 'memberType',
      size: 'M'
    };
    setChartPanels([...chartPanels, newPanel]);
    setShowMemberTypeChart(true);
    setShowChartPreviewSlideout(false);
    setShowChartConfigSlideout(false);
  };

  const handleAddRevenueToCanvas = () => {
    const newPanel = {
      id: `revenue-${Date.now()}`,
      type: 'revenue',
      size: 'M'
    };
    setChartPanels([...chartPanels, newPanel]);
    setShowRevenueTrendPanel(true);
    setShowChartPreviewSlideout(false);
    setShowChartConfigSlideout(false);
  };

  const handleAddPerformanceToCanvas = () => {
    const newPanel = {
      id: `performance-${Date.now()}`,
      type: 'performance',
      size: 'M'
    };
    setChartPanels([...chartPanels, newPanel]);
    setShowPerformancePanel(true);
    setShowChartPreviewSlideout(false);
    setShowChartConfigSlideout(false);
  };

  const handleAddHeatmapToCanvas = () => {
    const newPanel = {
      id: `heatmap-${Date.now()}`,
      type: 'heatmap',
      size: 'M'
    };
    setChartPanels([...chartPanels, newPanel]);
    setShowHeatmapPanel(true);
    setShowChartPreviewSlideout(false);
  };

  const handleAddRenewalTrendToCanvas = () => {
    const newPanel = {
      id: `renewalTrend-${Date.now()}`,
      type: 'renewalTrend',
      size: 'M'
    };
    setChartPanels([...chartPanels, newPanel]);
    setShowRenewalTrendPanel(true);
    setShowChartPreviewSlideout(false);
    setShowChartConfigSlideout(false);
  };

  const handleAddMarker = () => {
    setMarkerPlacementMode(true);
    setShowMarkerSlideout(true);
    setShowChartPreviewSlideout(false);
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
      setShowMarkerDetailSlideout(true);
      setStep(7);
    }
  };

  const handleMarkerClick = () => {
    setShowMarkerDetailSlideout(true);
  };

  const handleGenerateTasks = () => { setTasksGenerated(true); setStep(8); };
  const handleAssignAgents = () => { setAgentsAssigned(true); setStep(9); };
  const handleApproveAndProceed = () => {
    setShowMarkerDetailSlideout(false);
    setShowAgentSlideout(true);
    setStep(10);
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

  // NEW: Resize handlers
  function onResizeStart(id, size, e) {
    const t = e.currentTarget;
    t.setPointerCapture?.(e.pointerId);
    resizingRef.current = { id, startX: e.clientX, startSize: size };
    window.addEventListener('pointermove', onResizeMove);
    window.addEventListener('pointerup', onResizeEnd, { once: true });
  }

  function onResizeMove(e) {
    const { id, startX, startSize } = resizingRef.current || {};
    if (!id) return;
    
    const deltaX = e.clientX - startX;
    
    // Determine new size based on drag distance
    let newSize = startSize;
    if (deltaX > 100) {
      // Dragging right - increase size
      if (startSize === 'S') newSize = 'M';
      else if (startSize === 'M') newSize = 'L';
    } else if (deltaX < -100) {
      // Dragging left - decrease size
      if (startSize === 'L') newSize = 'M';
      else if (startSize === 'M') newSize = 'S';
    }
    
    if (newSize !== startSize) {
      // Update the appropriate size state
      setChartPanels(prev => prev.map(panel => 
        panel.id === id ? { ...panel, size: newSize } : panel
      ));
      
      // Also update individual size states
      const panel = chartPanels.find(p => p.id === id);
      if (panel) {
        if (panel.type === 'memberType') setMemberTypeSize(newSize);
        else if (panel.type === 'revenue') setRevenueTrendSize(newSize);
        else if (panel.type === 'performance') setPerformanceSize(newSize);
        else if (panel.type === 'heatmap') setHeatmapSize(newSize);
        else if (panel.type === 'renewalTrend') setRenewalTrendSize(newSize);
      }
      
      resizingRef.current.startSize = newSize;
      resizingRef.current.startX = e.clientX;
    }
  }

  function onResizeEnd() {
    resizingRef.current = { id: null, startX: 0, startSize: 'M' };
    window.removeEventListener('pointermove', onResizeMove);
  }

  // NEW: Drag handlers
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

  // NEW: Sortable chart card component
  function SortableChartCard({ panel }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ 
      id: panel.id 
    });
    
    const style = { 
      transform: CSS.Transform.toString(transform),
      opacity: isDragging ? 0.5 : 1,
    };

    const getSize = () => {
      if (panel.type === 'memberType') return memberTypeSize;
      if (panel.type === 'revenue') return revenueTrendSize;
      if (panel.type === 'performance') return performanceSize;
      if (panel.type === 'heatmap') return heatmapSize;
      if (panel.type === 'renewalTrend') return renewalTrendSize;
      return 'M';
    };

    const setSize = (newSize) => {
      if (panel.type === 'memberType') setMemberTypeSize(newSize);
      else if (panel.type === 'revenue') setRevenueTrendSize(newSize);
      else if (panel.type === 'performance') setPerformanceSize(newSize);
      else if (panel.type === 'heatmap') setHeatmapSize(newSize);
      else if (panel.type === 'renewalTrend') setRenewalTrendSize(newSize);
      
      setChartPanels(prev => prev.map(p => 
        p.id === panel.id ? { ...p, size: newSize } : p
      ));
    };

    const removePanel = () => {
      setChartPanels(prev => prev.filter(p => p.id !== panel.id));
      if (panel.type === 'memberType') setShowMemberTypeChart(false);
      else if (panel.type === 'revenue') setShowRevenueTrendPanel(false);
      else if (panel.type === 'performance') setShowPerformancePanel(false);
      else if (panel.type === 'heatmap') setShowHeatmapPanel(false);
      else if (panel.type === 'renewalTrend') setShowRenewalTrendPanel(false);
    };

    const currentSize = getSize();

    return (
      <div 
        ref={setNodeRef}
        style={style}
        className={`${colSpanFor(currentSize)} relative group`}
      >
        <div className="bg-white rounded-lg shadow-sm p-6 relative">
          {/* Drag handle */}
          <div
            className="absolute top-4 left-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>

          {/* Resize handle */}
          <div
            className="absolute top-1/2 -right-3 -translate-y-1/2 w-2 h-8 rounded-full bg-gray-300/90 hover:bg-gray-400 border border-white shadow cursor-ew-resize z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onResizeStart(panel.id, currentSize, e);
            }}
          />

          {/* Chart content */}
          {panel.type === 'memberType' && (
            <MemberTypeChart 
              size={currentSize}
              onSizeChange={setSize}
              onRemove={removePanel}
            />
          )}
          {panel.type === 'revenue' && (
            <RevenueChart 
              size={currentSize}
              onSizeChange={setSize}
              onRemove={removePanel}
            />
          )}
          {panel.type === 'performance' && (
            <PerformanceChart 
              size={currentSize}
              onSizeChange={setSize}
              onRemove={removePanel}
            />
          )}
          {panel.type === 'heatmap' && (
            <HeatmapChart 
              size={currentSize}
              onSizeChange={setSize}
              onRemove={removePanel}
            />
          )}
          {panel.type === 'renewalTrend' && (
            <RenewalTrendChart 
              size={currentSize}
              onSizeChange={setSize}
              onRemove={removePanel}
            />
          )}
        </div>
      </div>
    );
  }

  // NEW: Individual chart components
  function MemberTypeChart({ size, onSizeChange, onRemove }) {
    return (
      <>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3 ml-8">
            <h3 className="text-base font-semibold text-gray-900">Member Type Comparison</h3>
            <SizePicker value={size} onChange={onSizeChange} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPreviewChartType('memberType');
                setShowChartPreviewSlideout(true);
                setShowChartConfigSlideout(true);
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

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartDataToDisplay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="type" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const item = memberTypeData.find(d => d.type === data.type);
                  const change = item ? ((item['2025'] - item['2024']) / item['2024']) * 100 : 0;
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                      <div className="font-semibold text-sm mb-2">{data.type}</div>
                      {payload.map((entry, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          <span className="font-medium">{entry.dataKey}: </span>
                          <span className="font-semibold">{chartAggregation === 'percentage' ? `${entry.value}%` : entry.value}</span>
                          {entry.dataKey === '2025' && item && (
                            <span className={`ml-2 font-bold ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                              ({change > 0 ? '+' : ''}{change.toFixed(1)}%)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
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
                const color = change > 5 ? '#22c55e' : change > 0 ? '#86efac' : change === 0 ? '#94a3b8' : change > -5 ? '#fecaca' : '#fca5a5';
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-green-700 font-medium mb-1">MEMBER</div>
            <div className="text-sm font-semibold text-green-900">+3.7%</div>
            <div className="text-xs text-green-600">4,438 → 4,604</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-xs text-red-700 font-medium mb-1">Bachelor Gap Year</div>
            <div className="text-sm font-semibold text-red-900">-21.1%</div>
            <div className="text-xs text-red-600">57 → 45</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-green-700 font-medium mb-1">Section Associate</div>
            <div className="text-sm font-semibold text-green-900">+16.9%</div>
            <div className="text-xs text-green-600">71 → 83</div>
          </div>
        </div>
      </>
    );
  }

  function RevenueChart({ size, onSizeChange, onRemove }) {
    return (
      <>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3 ml-8">
            <h3 className="text-base font-semibold text-gray-900">Cumulative Revenue Trend</h3>
            <SizePicker value={size} onChange={onSizeChange} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { 
                setPreviewChartType('revenue'); 
                setShowChartPreviewSlideout(true);
                setShowChartConfigSlideout(true);
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

        <ResponsiveContainer width="100%" height={350}>
          {revenueChartType === 'bar' ? (
            <BarChart data={cumulativeRevenueData} barGap={revenueOverlayMode === 'overlay' ? '-30%' : 4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => `$${v ? v.toLocaleString() : 'N/A'}`} />
              <Legend />
              {selectedRevenueYears.includes('2024') && (
                <Bar dataKey="prev2024" fill="#86efac" name="Previous (2024)" radius={[4, 4, 0, 0]} barSize={revenueOverlayMode==='overlay'?60:undefined} />
              )}
              {selectedRevenueYears.includes('2025') && (
                <Bar dataKey="actual2025" fill="#22c55e" name="Current Actual (2025)" radius={[4, 4, 0, 0]} barSize={revenueOverlayMode==='overlay'?36:undefined} />
              )}
              {selectedRevenueYears.includes('2025') && (
                <Bar dataKey="forecast2025" fill="#22c55e" fillOpacity={0.5} name="Current Forecast (2025)" radius={[4, 4, 0, 0]} />
              )}
              {selectedRevenueYears.includes('2026') && (
                <Bar dataKey="future2026" fill="#94a3b8" fillOpacity={0.5} name="Future Forecast (2026)" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          ) : (
            <RechartsLineChart data={cumulativeRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => `${v ? v.toLocaleString() : 'N/A'}`} />
              <Legend />
              {selectedRevenueYears.includes('2024') && (
                <Line type="monotone" dataKey="prev2024" stroke="#86efac" strokeWidth={2} name="Previous (2024)" />
              )}
              {selectedRevenueYears.includes('2025') && (
                <Line type="monotone" dataKey="actual2025" stroke="#22c55e" strokeWidth={2} name="Current Actual (2025)" />
              )}
              {selectedRevenueYears.includes('2025') && (
                <Line type="monotone" dataKey="forecast2025" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Current Forecast (2025)" />
              )}
              {selectedRevenueYears.includes('2026') && (
                <Line type="monotone" dataKey="future2026" stroke="#94a3b8" strokeWidth={2} strokeDasharray="8 8" name="Future Forecast (2026)" />
              )}
            </RechartsLineChart>
          )}
        </ResponsiveContainer>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-green-700 font-medium">YTD Revenue</div>
            <div className="text-base font-bold text-green-900">$1.13M</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-700 font-medium">YoY Growth</div>
            <div className="text-base font-bold text-blue-900">+6.6%</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-xs text-purple-700 font-medium">Forecast EOY</div>
            <div className="text-base font-bold text-purple-900">$1.25M</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-xs text-slate-700 font-medium">2026 Projection</div>
            <div className="text-base font-bold text-slate-900">$1.42M</div>
          </div>
        </div>
      </>
    );
  }

  function PerformanceChart({ size, onSizeChange, onRemove }) {
    return (
      <>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3 ml-8">
            <h3 className="text-base font-semibold text-purple-900">Revenue Performance vs Goal</h3>
            <SizePicker value={size} onChange={onSizeChange} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { 
                setPreviewChartType('performance'); 
                setShowChartPreviewSlideout(true);
                setShowChartConfigSlideout(true);
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

        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={cumulativeRevenueData} barGap={performanceOverlayMode === 'overlay' ? '-40%' : 4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
            <Tooltip formatter={(v) => `${v ? v.toLocaleString() : 'N/A'}`} />
            <Legend />
            {performanceIncludeGoal && (
              <Bar dataKey="goal" fill="#ddd6fe" name="Goal" radius={[4, 4, 4, 4]} barSize={performanceOverlayMode==='overlay'?60:50} />
            )}
            <Bar dataKey="actual2025" fill="#9333ea" name="Actual" radius={[4, 4, 4, 4]} barSize={performanceOverlayMode==='overlay'?36:30} />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-xs text-purple-700 font-medium">YTD Actual</div>
            <div className="text-lg font-bold text-purple-900">$1.13M</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-xs text-purple-700 font-medium">YTD Goal</div>
            <div className="text-lg font-bold text-purple-900">$1.19M</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <div className="text-xs text-orange-700 font-medium">Gap</div>
            <div className="text-lg font-bold text-orange-900">-$60K</div>
          </div>
        </div>
      </>
    );
  }

  function HeatmapChart({ size, onSizeChange, onRemove }) {
    return (
      <>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3 ml-8">
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
                setShowChartPreviewSlideout(true);
                setShowChartConfigSlideout(true);
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

        {selectedHeatmapVariation === 'classic' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-700 p-3 border-b bg-gray-50">Member Type</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b bg-gray-50">2024</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b bg-gray-50">2025</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b bg-gray-50">Diff</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b bg-gray-50">%</th>
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
          </div>
        )}

        {selectedHeatmapVariation === 'percentage' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-700 p-3 border-b bg-gray-50">Member Type</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b bg-gray-50">Percentage Change</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b bg-gray-50">2024 → 2025</th>
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
          </div>
        )}

        {selectedHeatmapVariation === 'trend' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-700 p-3 border-b bg-gray-50">Member Type</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b bg-gray-50">Trend</th>
                  <th className="text-center text-xs font-semibold text-gray-700 p-3 border-b bg-gray-50">%</th>
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
          </div>
        )}

        {selectedHeatmapVariation === 'compact' && (
          <div className="space-y-2">
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

        <div className="mt-6 flex items-center flex-wrap gap-3 text-xs">
          <span className="font-medium text-gray-700">Color Scale:</span>
          <div className="flex items-center gap-1"><div className="w-4 h-4 rounded" style={{background:'#fca5a5'}}></div><span className="text-gray-600">-25%+</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-4 rounded" style={{background:'#fecaca'}}></div><span className="text-gray-600">-15 to -25%</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-4 rounded" style={{background:'#fee2e2'}}></div><span className="text-gray-600">-1 to -5%</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-4 rounded" style={{background:'#f1f5f9'}}></div><span className="text-gray-600">0%</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-4 rounded" style={{background:'#dcfce7'}}></div><span className="text-gray-600">+1 to +5%</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-4 rounded" style={{background:'#bbf7d0'}}></div><span className="text-gray-600">+5 to +10%</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-4 rounded" style={{background:'#86efac'}}></div><span className="text-gray-600">+10%+</span></div>
        </div>
      </>
    );
  }

  function RenewalTrendChart({ size, onSizeChange, onRemove }) {
    return (
      <>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3 ml-8">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Cumulative Renewal Trend</h3>
              <p className="text-xs text-gray-600 mt-1">Year-over-year renewal progression with delta</p>
            </div>
            <SizePicker value={size} onChange={onSizeChange} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { 
                setPreviewChartType('renewalTrend'); 
                setShowChartPreviewSlideout(true);
                setShowChartConfigSlideout(true);
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

        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={renewalTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v) => renewalDeltaAsPct && v != null ? `${v}%` : v} />
            <Tooltip formatter={(v, n) => (n === (renewalDeltaAsPct ? 'YoY Delta %' : 'YoY Delta') ? (v != null ? (renewalDeltaAsPct ? `${v}%` : v) : 'N/A') : v)} />
            <Legend />
            {renewalYears.includes('2024') && (
              <Line yAxisId="left" type="monotone" dataKey="y2024" stroke="#94a3b8" strokeWidth={2.5} name="2024 (Previous)" dot={{ r: 4 }} />
            )}
            {renewalYears.includes('2025') && (
              <Line yAxisId="left" type="monotone" dataKey="y2025" stroke="#3b82f6" strokeWidth={2.5} name="2025 (Current)" dot={{ r: 4 }} />
            )}
            {renewalYears.includes('2026') && (
              <Line yAxisId="left" type="monotone" dataKey="y2026" stroke="#3b82f6" strokeWidth={2.5} strokeDasharray="8 8" name="2026 (Projection)" dot={{ r: 3 }} />
            )}
            <Bar
              yAxisId="right"
              dataKey={renewalDeltaAsPct ? 'deltaPct' : 'delta'}
              name={renewalDeltaAsPct ? 'YoY Delta %' : 'YoY Delta'}
              fill="#10b981"
              fillOpacity={0.3}
              radius={[4, 4, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-700 font-medium">2025 YTD</div>
            <div className="text-base font-bold text-blue-900">7,100</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-xs text-slate-700 font-medium">2024 Same</div>
            <div className="text-base font-bold text-slate-900">6,800</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-green-700 font-medium">Growth</div>
            <div className="text-base font-bold text-green-900">+300 (+4.4%)</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-xs text-purple-700 font-medium">2026 Projected</div>
            <div className="text-base font-bold text-purple-900">7,700</div>
          </div>
        </div>
      </>
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

        {compareMode && getMarkerButton('MEMBER TYPE', 'slate', BarChart3, '📊 Comparison', handleMemberTypeClick, step === 1, 'comparison')}
        {compareMode && getMarkerButton('RENEWAL DATE', 'blue', TrendingUp, '📈 Renewal Trend', handleRenewalTrendMarkerClick, false, 'trend')}
        {compareMode && !filteredToProfessional && getMarkerButton('STATUS', 'red', AlertTriangle, '⚠️ Alert Heatmap', handleHeatmapMarkerClick, false, 'alert')}
        {compareMode && getMarkerButton('ENGAGEMENT', 'amber', Activity, '🔗 Correlation', handleVolunteerMarkerClick, step === 4, 'correlation')}
        {compareMode && getMarkerButton('REVENUE', 'green', DollarSign, '💰 Financial', handleRevenueMarkerClick, false, 'financial', -20)}
        {compareMode && getMarkerButton('REVENUE', 'purple', Percent, '🎯 Performance', handlePerformanceMarkerClick, false, 'performance', 20)}

        {/* Header */}
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
          {/* Guidance card */}
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="text-sm text-slate-900">
              {step === 0 && "👋 Click Compare mode (target icon in toolbar below)"}
              {step === 1 && "✨ Click markers: Member Type, Revenue (2 circles!), Status, Engagement, Renewal"}
              {step === 2 && "📊 Try different markers"}
              {step === 3 && "🔍 Filtering..."}
              {step === 4 && "⚡ Explore all markers - drag charts to reorder, resize with handles"}
              {step === 5 && "💡 Click 'Add marker to page'"}
              {step === 6 && "📍 Click anywhere, then Save"}
              {step === 7 && "🎯 Click the yellow pin"}
              {step === 8 && "📋 Click 'Assign to Agentic Team'"}
              {step === 9 && "✅ Click 'Approve to Proceed'"}
              {step >= 10 && agentProgress < 100 && "⚙️ Building program..."}
              {step >= 10 && agentProgress === 100 && "🎉 Done! Click Engagement scores for radar charts"}
            </div>
          </div>

          {/* NEW: Draggable Chart Panels */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={chartPanels.map(p => p.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-12 gap-6 mb-6" ref={gridRef} style={{ willChange: 'auto' }}>
                {chartPanels.map((panel) => (
                  <SortableChartCard key={panel.id} panel={panel} />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeChartId ? (
                <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 w-[600px] opacity-80">
                  <div className="flex items-center gap-2 mb-2">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <span className="font-semibold">Moving chart…</span>
                  </div>
                  <div className="h-3 w-2/3 bg-gray-100 rounded" />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {/* Base table */}
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
                        onClick={() => { setSelectedMemberForRadar(member); setPreviewChartType('radar'); setShowChartPreviewSlideout(true); }}
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

        {/* Toolbar */}
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

      {/* Chart Preview Slideout - KEEPING ALL EXISTING CODE */}
      {showChartPreviewSlideout && (
        <div
          className="fixed inset-y-0 right-0 w-[32rem] bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-[200] slideout-panel transition-all duration-300"
          style={{ transform: isConfigOpen ? 'translateX(-32rem)' : 'translateX(0)' }}
        >
          {previewChartType !== 'volunteer' && previewChartType !== 'radar' && (
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
                    <p className="text-xs text-purple-700">12-Dimension Engagement Profile (Revenue at 12 o'clock)</p>
                  </div>
                </div>
                <button onClick={() => setShowChartPreviewSlideout(false)} className="text-purple-600 hover:text-purple-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Member Type Preview */}
            {previewChartType === 'memberType' && (
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Member Type Comparison</h3>
                    <p className="text-xs text-gray-600 mt-1">2024 vs 2025 by Member Type</p>
                  </div>
                  <button
                    onClick={() => setShowChartConfigSlideout(true)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-white rounded"
                    title="Configure chart"
                  >
                    <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>
                <div className="p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartDataToDisplay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="type" tick={{ fontSize: 10, angle: -45, textAnchor: 'end' }} height={100} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            const item = memberTypeData.find(d => d.type === data.type);
                            const change = item ? ((item['2025'] - item['2024']) / item['2024']) * 100 : 0;
                            return (
                              <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                                <div className="font-semibold text-sm mb-2">{data.type}</div>
                                {payload.map((entry, index) => (
                                  <div key={index} className="text-xs text-gray-600">
                                    <span className="font-medium">{entry.dataKey}: </span>
                                    <span className="font-semibold">{chartAggregation === 'percentage' ? `${entry.value}%` : entry.value}</span>
                                    {entry.dataKey === '2025' && item && (
                                      <span className={`ml-2 font-bold ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                        ({change > 0 ? '+' : ''}{change.toFixed(1)}%)
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <Bar dataKey="2024" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                      <Bar
                        dataKey="2025"
                        fill="#64748b"
                        radius={[4, 4, 0, 0]}
                        onClick={(data) => {
                          if (data.type === 'MEMBER') {
                            setShowChartPreviewSlideout(false);
                            setShowChartConfigSlideout(false);
                            handleProfessionalBarClick();
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {chartDataToDisplay.map((entry, index) => {
                          const item = memberTypeData.find(d => d.type === entry.type);
                          const change = item ? ((item['2025'] - item['2024']) / item['2024']) * 100 : 0;
                          const color = change > 5 ? '#22c55e' : change > 0 ? '#86efac' : change === 0 ? '#94a3b8' : change > -5 ? '#fecaca' : '#fca5a5';
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={handleAddMemberTypeToCanvas}
                    className="w-full px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add to page
                  </button>
                </div>
              </div>
            )}

            {/* Volunteer preview */}
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

            {/* Revenue preview - KEEPING ALL EXISTING CODE */}
            {previewChartType === 'revenue' && (
              <div className="border border-green-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-green-50 border-b border-green-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-green-900">Cumulative Revenue Analysis</h3>
                    <p className="text-xs text-green-700 mt-1">Monthly revenue progression with forecast</p>
                  </div>
                  <button
                    onClick={() => setShowChartConfigSlideout(true)}
                    className="text-green-700 hover:text-green-900 transition-colors p-1 hover:bg-green-100 rounded"
                    title="Configure chart"
                  >
                    <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="p-4">
                  <ResponsiveContainer width="100%" height={280}>
                    {revenueChartType === 'bar' ? (
                      <BarChart data={cumulativeRevenueData} barGap={revenueOverlayMode==='overlay' ? '-30%' : 4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                        <Tooltip formatter={(v) => `${v ? v.toLocaleString() : 'N/A'}`} />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        {selectedRevenueYears.includes('2024') && (<Bar dataKey="prev2024" fill="#86efac" name="2024" radius={[4, 4, 0, 0]} barSize={revenueOverlayMode==='overlay'?60:undefined} />)}
                        {selectedRevenueYears.includes('2025') && (<Bar dataKey="actual2025" fill="#22c55e" name="2025 Actual" radius={[4, 4, 0, 0]} barSize={revenueOverlayMode==='overlay'?36:undefined} />)}
                        {selectedRevenueYears.includes('2025') && (<Bar dataKey="forecast2025" fill="#22c55e" fillOpacity={0.5} name="2025 Forecast" radius={[4, 4, 0, 0]} />)}
                        {selectedRevenueYears.includes('2026') && (<Bar dataKey="future2026" fill="#94a3b8" fillOpacity={0.5} name="2026 Forecast" radius={[4, 4, 0, 0]} />)}
                      </BarChart>
                    ) : (
                      <RechartsLineChart data={cumulativeRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                        <Tooltip formatter={(v) => `${v ? v.toLocaleString() : 'N/A'}`} />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        {selectedRevenueYears.includes('2024') && (<Line type="monotone" dataKey="prev2024" stroke="#86efac" strokeWidth={2} name="2024" />)}
                        {selectedRevenueYears.includes('2025') && (<Line type="monotone" dataKey="actual2025" stroke="#22c55e" strokeWidth={2} name="2025 Actual" />)}
                        {selectedRevenueYears.includes('2025') && (<Line type="monotone" dataKey="forecast2025" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="2025 Forecast" />)}
                        {selectedRevenueYears.includes('2026') && (<Line type="monotone" dataKey="future2026" stroke="#94a3b8" strokeWidth={2} strokeDasharray="8 8" name="2026 Forecast" />)}
                      </RechartsLineChart>
                    )}
                  </ResponsiveContainer>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={handleAddRevenueToCanvas}
                    className="w-full px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add to page
                  </button>
                </div>
              </div>
            )}

            {/* Performance preview */}
            {previewChartType === 'performance' && (
              <div className="border border-purple-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-purple-50 border-b border-purple-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-purple-900">Revenue Performance vs Goal</h3>
                    <p className="text-xs text-purple-700 mt-1">Monthly actual vs projected target</p>
                  </div>
                  <button
                    onClick={() => setShowChartConfigSlideout(true)}
                    className="text-purple-700 hover:text-purple-900 transition-colors p-1 hover:bg-purple-100 rounded"
                    title="Configure chart"
                  >
                    <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={cumulativeRevenueData} barGap={performanceOverlayMode==='overlay' ? '-40%' : 4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                      <Tooltip formatter={(v) => `${v ? v.toLocaleString() : 'N/A'}`} />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      {performanceIncludeGoal && (<Bar dataKey="goal" fill="#ddd6fe" name="Goal" radius={[4, 4, 4, 4]} barSize={performanceOverlayMode==='overlay'?60:50} />)}
                      <Bar dataKey="actual2025" fill="#9333ea" name="Actual" radius={[4, 4, 4, 4]} barSize={performanceOverlayMode==='overlay'?36:30} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={handleAddPerformanceToCanvas}
                    className="w-full px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add to page
                  </button>
                </div>
              </div>
            )}

            {/* Heatmap preview - KEEPING FULL TABLE */}
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
                    <Plus className="w-4 h-4" />
                    Add to page
                  </button>
                </div>
              </div>
            )}

            {/* Renewal Trend preview */}
            {previewChartType === 'renewalTrend' && (
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-blue-900">Cumulative Renewal Trend</h3>
                    <p className="text-xs text-blue-700 mt-1">Year-over-year progression with delta bars</p>
                  </div>
                  <button
                    onClick={() => setShowChartConfigSlideout(true)}
                    className="text-blue-700 hover:text-blue-900 transition-colors p-1 hover:bg-blue-100 rounded"
                    title="Configure chart"
                  >
                    <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="p-4">
                  <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart data={renewalTrendData.slice(0,10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 9 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9 }} tickFormatter={(v) => (renewalDeltaAsPct && v!=null) ? `${v}%` : v} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '9px' }} />
                      {renewalYears.includes('2024') && <Line yAxisId="left" type="monotone" dataKey="y2024" stroke="#94a3b8" strokeWidth={2} name="2024" dot={{ r: 3 }} />}
                      {renewalYears.includes('2025') && <Line yAxisId="left" type="monotone" dataKey="y2025" stroke="#3b82f6" strokeWidth={2}  name="2025" dot={{ r: 3 }} />}
                      {renewalYears.includes('2026') && <Line yAxisId="left" type="monotone" dataKey="y2026" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6 6" name="2026" dot={{ r: 2 }} />}
                      <Bar yAxisId="right" dataKey={renewalDeltaAsPct?'deltaPct':'delta'} fill="#10b981" fillOpacity={0.3} name={renewalDeltaAsPct?'Delta %':'Delta'} radius={[3,3,0,0]} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={handleAddRenewalTrendToCanvas}
                    className="w-full px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add to page
                  </button>
                </div>
              </div>
            )}

            {/* Radar preview - KEEPING ALL EXISTING CODE */}
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

      {/* Configuration Slideouts - KEEPING ALL EXISTING CODE */}
      {showChartConfigSlideout && (
        <div className="fixed inset-y-0 right-0 w-[32rem] bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-[210] slideout-panel">
          
          {previewChartType === 'memberType' && (
            <>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-slate-600" />
                    <h2 className="text-lg font-semibold">Chart Configuration</h2>
                  </div>
                  <button onClick={() => setShowChartConfigSlideout(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-slate-600" strokeWidth={1.5} />
                    <h3 className="text-sm font-semibold text-gray-900">Display</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Chart Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500" value={chartType} onChange={(e) => setChartType(e.target.value)}>
                        <option value="bar">Bar</option>
                        <option value="line">Line</option>
                        <option value="area">Area</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Change Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500" value={changeType} onChange={(e) => setChangeType(e.target.value)}>
                        <option value="absolute">Absolute</option>
                        <option value="percentage">Percentage Change</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Overlay</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={showPreviousYear} onChange={(e) => setShowPreviousYear(e.target.checked)} className="rounded border-gray-300" />
                          <span className="text-sm text-gray-700">Previous Year</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={showForecast} onChange={(e) => setShowForecast(e.target.checked)} className="rounded border-gray-300" />
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
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500" value={comparisonPeriod} onChange={(e) => setComparisonPeriod(e.target.value)}>
                        <option value="yoy">YoY (Year over Year)</option>
                        <option value="qoq">QoQ (Quarter over Quarter)</option>
                        <option value="mom">MoM (Month over Month)</option>
                        <option value="custom">Custom Range</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Base Year</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500" value={baseYear} onChange={(e) => setBaseYear(e.target.value)}>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                          <option value="2022">2022</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Compare To</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500" value={compareToYear} onChange={(e) => setCompareToYear(e.target.value)}>
                          <option value="2023">2023</option>
                          <option value="2022">2022</option>
                          <option value="2021">2021</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Granularity</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500" value={granularity} onChange={(e) => setGranularity(e.target.value)}>
                        <option value="annually">Annually</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="monthly">Monthly</option>
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
                            <button onClick={() => setSelectedMemberTypes(memberTypeData.map(m => m.type))} className="text-xs text-blue-600 hover:text-blue-800">Select All</button>
                            <button onClick={() => setSelectedMemberTypes([])} className="text-xs text-blue-600 hover:text-blue-800">Clear All</button>
                          </div>
                          <div className="space-y-1.5">
                            {memberTypeData.map((item) => (
                              <label key={item.type} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1.5 rounded">
                                <input
                                  type="checkbox"
                                  checked={selectedMemberTypes.includes(item.type)}
                                  onChange={(e) => {
                                    if (e.target.checked) setSelectedMemberTypes([...selectedMemberTypes, item.type]);
                                    else setSelectedMemberTypes(selectedMemberTypes.filter(t => t !== item.type));
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
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500" value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
                        <option value="count">Member Count</option>
                        <option value="revenue">Revenue</option>
                        <option value="engagement">Engagement Score</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Aggregation</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500" value={chartAggregation} onChange={(e) => setChartAggregation(e.target.value)}>
                        <option value="count">Count</option>
                        <option value="percentage">Percentage</option>
                        <option value="sum">Sum</option>
                        <option value="average">Average</option>
                      </select>
                      {chartAggregation === 'percentage' && <p className="mt-2 text-xs text-slate-600">Shows each member type as a % of total members for that year</p>}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <button onClick={() => setShowChartConfigSlideout(false)} className="w-full py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors">
                    Apply Configuration
                  </button>
                </div>
              </div>
            </>
          )}

          {previewChartType === 'revenue' && (
            <>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold">Revenue Configuration</h2>
                  </div>
                  <button onClick={() => setShowChartConfigSlideout(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Chart Type</label>
                  <div className="flex gap-2">
                    <button onClick={() => setRevenueChartType('bar')} className={`flex-1 px-3 py-2 text-xs rounded-lg ${revenueChartType==='bar'?'bg-green-600 text-white':'bg-white text-gray-700 border border-gray-300'}`}><BarChart3 className="w-4 h-4 inline mr-1" />Bar</button>
                    <button onClick={() => setRevenueChartType('line')} className={`flex-1 px-3 py-2 text-xs rounded-lg ${revenueChartType==='line'?'bg-green-600 text-white':'bg-white text-gray-700 border border-gray-300'}`}><LineChart className="w-4 h-4 inline mr-1" />Line</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Display Mode</label>
                  <div className="flex gap-2">
                    <button onClick={() => setRevenueOverlayMode('overlay')} className={`flex-1 px-3 py-2 text-xs rounded-lg ${revenueOverlayMode==='overlay'?'bg-green-600 text-white':'bg-white text-gray-700 border border-gray-300'}`}>Bar within Bar</button>
                    <button onClick={() => setRevenueOverlayMode('side')} className={`flex-1 px-3 py-2 text-xs rounded-lg ${revenueOverlayMode==='side'?'bg-green-600 text-white':'bg-white text-gray-700 border border-gray-300'}`}>Side by Side</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Years to Compare</label>
                  <div className="space-y-2">
                    {['2024','2025','2026'].map(y => (
                      <label key={y} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedRevenueYears.includes(y)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedRevenueYears([...selectedRevenueYears, y]);
                            else setSelectedRevenueYears(selectedRevenueYears.filter(v => v !== y));
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-xs text-gray-700">{y}{y==='2024'?' (Previous)':y==='2025'?' (Current)':' (Forecast)'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-green-600" strokeWidth={1.5} />
                    <h3 className="text-sm font-semibold text-gray-900">Display</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Change Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" value={changeType} onChange={(e) => setChangeType(e.target.value)}>
                        <option value="absolute">Absolute</option>
                        <option value="percentage">Percentage Change</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Overlay</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={showPreviousYear} onChange={(e) => setShowPreviousYear(e.target.checked)} className="rounded border-gray-300" />
                          <span className="text-sm text-gray-700">Previous Year</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={showForecast} onChange={(e) => setShowForecast(e.target.checked)} className="rounded border-gray-300" />
                          <span className="text-sm text-gray-700">Forecast</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-green-600" strokeWidth={1.5} />
                    <h3 className="text-sm font-semibold text-gray-900">Period</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Comparison</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" value={comparisonPeriod} onChange={(e) => setComparisonPeriod(e.target.value)}>
                        <option value="yoy">YoY (Year over Year)</option>
                        <option value="qoq">QoQ (Quarter over Quarter)</option>
                        <option value="mom">MoM (Month over Month)</option>
                        <option value="custom">Custom Range</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Base Year</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" value={baseYear} onChange={(e) => setBaseYear(e.target.value)}>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                          <option value="2022">2022</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Compare To</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" value={compareToYear} onChange={(e) => setCompareToYear(e.target.value)}>
                          <option value="2023">2023</option>
                          <option value="2022">2022</option>
                          <option value="2021">2021</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Granularity</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" value={granularity} onChange={(e) => setGranularity(e.target.value)}>
                        <option value="annually">Annually</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-green-600" strokeWidth={1.5} />
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
                          {selectedRevenueMemberTypes.length === 0
                            ? 'All types selected'
                            : selectedRevenueMemberTypes.length === 4
                              ? 'All types selected'
                              : `${selectedRevenueMemberTypes.length} type${selectedRevenueMemberTypes.length !== 1 ? 's' : ''} selected`}
                        </span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showMemberTypeSelector && (
                        <div className="mt-2 p-3 border border-gray-200 rounded-lg bg-gray-50 max-h-60 overflow-y-auto">
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-300">
                            <button onClick={() => setSelectedRevenueMemberTypes(['Premium', 'Standard', 'Student', 'Corporate'])} className="text-xs text-blue-600 hover:text-blue-800">Select All</button>
                            <button onClick={() => setSelectedRevenueMemberTypes([])} className="text-xs text-blue-600 hover:text-blue-800">Clear All</button>
                          </div>
                          <div className="space-y-1.5">
                            {['Premium', 'Standard', 'Student', 'Corporate'].map((type) => (
                              <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1.5 rounded">
                                <input
                                  type="checkbox"
                                  checked={selectedRevenueMemberTypes.includes(type)}
                                  onChange={(e) => {
                                    if (e.target.checked) setSelectedRevenueMemberTypes([...selectedRevenueMemberTypes, type]);
                                    else setSelectedRevenueMemberTypes(selectedRevenueMemberTypes.filter(t => t !== type));
                                  }}
                                  className="rounded border-gray-300"
                                />
                                <span className="text-xs text-gray-700 flex-1">{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Metric</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
                        <option value="count">Member Count</option>
                        <option value="revenue">Revenue</option>
                        <option value="engagement">Engagement Score</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Aggregation</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" value={chartAggregation} onChange={(e) => setChartAggregation(e.target.value)}>
                        <option value="count">Count</option>
                        <option value="percentage">Percentage</option>
                        <option value="sum">Sum</option>
                        <option value="average">Average</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <button onClick={() => setShowChartConfigSlideout(false)} className="w-full py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors">
                    Apply Configuration
                  </button>
                </div>
              </div>
            </>
          )}

          {previewChartType === 'performance' && (
            <>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-semibold">Performance Configuration</h2>
                  </div>
                  <button onClick={() => setShowChartConfigSlideout(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Display Mode</label>
                  <div className="flex gap-2">
                    <button onClick={() => setPerformanceOverlayMode('overlay')} className={`flex-1 px-3 py-2 text-xs rounded-lg ${performanceOverlayMode==='overlay'?'bg-purple-600 text-white':'bg-white text-gray-700 border border-gray-300'}`}>Bar within Bar</button>
                    <button onClick={() => setPerformanceOverlayMode('side')} className={`flex-1 px-3 py-2 text-xs rounded-lg ${performanceOverlayMode==='side'?'bg-purple-600 text-white':'bg-white text-gray-700 border border-gray-300'}`}>Side by Side</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Overlays</label>
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" className="rounded border-gray-300" checked={performanceIncludeGoal} onChange={(e)=>setPerformanceIncludeGoal(e.target.checked)} />
                    <span className="text-gray-700">Show Goal</span>
                  </label>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <button onClick={() => setShowChartConfigSlideout(false)} className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-sm font-medium rounded-lg transition-colors">
                    Apply Configuration
                  </button>
                </div>
              </div>
            </>
          )}

          {previewChartType === 'renewalTrend' && (
            <>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold">Renewal Trend Configuration</h2>
                  </div>
                  <button onClick={() => setShowChartConfigSlideout(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Delta Metric</label>
                  <div className="flex gap-2">
                    <button onClick={() => setRenewalDeltaAsPct(true)} className={`flex-1 px-3 py-2 text-xs rounded-lg ${renewalDeltaAsPct?'bg-blue-600 text-white':'bg-white text-gray-700 border border-gray-300'}`}>Percentage</button>
                    <button onClick={() => setRenewalDeltaAsPct(false)} className={`flex-1 px-3 py-2 text-xs rounded-lg ${!renewalDeltaAsPct?'bg-blue-600 text-white':'bg-white text-gray-700 border border-gray-300'}`}>Count</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Years</label>
                  <div className="space-y-2">
                    {['2024','2025','2026'].map(y => (
                      <label key={y} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={renewalYears.includes(y)}
                          onChange={(e)=>{ if (e.target.checked) setRenewalYears([...renewalYears, y]); else setRenewalYears(renewalYears.filter(v=>v!==y)); }}
                        />
                        <span className="text-xs text-gray-700">{y}{y==='2026'?' (Projection)':''}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
                    <h3 className="text-sm font-semibold text-gray-900">Display</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Chart Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={chartType} onChange={(e) => setChartType(e.target.value)}>
                        <option value="bar">Bar</option>
                        <option value="line">Line</option>
                        <option value="area">Area</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Change Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={changeType} onChange={(e) => setChangeType(e.target.value)}>
                        <option value="absolute">Absolute</option>
                        <option value="percentage">Percentage Change</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Overlay</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={showPreviousYear} onChange={(e) => setShowPreviousYear(e.target.checked)} className="rounded border-gray-300" />
                          <span className="text-sm text-gray-700">Previous Year</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={showForecast} onChange={(e) => setShowForecast(e.target.checked)} className="rounded border-gray-300" />
                          <span className="text-sm text-gray-700">Forecast</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
                    <h3 className="text-sm font-semibold text-gray-900">Period</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Comparison</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={comparisonPeriod} onChange={(e) => setComparisonPeriod(e.target.value)}>
                        <option value="yoy">YoY (Year over Year)</option>
                        <option value="qoq">QoQ (Quarter over Quarter)</option>
                        <option value="mom">MoM (Month over Month)</option>
                        <option value="custom">Custom Range</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Base Year</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={baseYear} onChange={(e) => setBaseYear(e.target.value)}>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                          <option value="2022">2022</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Compare To</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={compareToYear} onChange={(e) => setCompareToYear(e.target.value)}>
                          <option value="2023">2023</option>
                          <option value="2022">2022</option>
                          <option value="2021">2021</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Granularity</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={granularity} onChange={(e) => setGranularity(e.target.value)}>
                        <option value="annually">Annually</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
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
                          {renewalSelectedTypes.length === 0
                            ? 'All types selected'
                            : renewalSelectedTypes.length === Object.keys(renewalTrendDataByType).length
                              ? 'All types selected'
                              : `${renewalSelectedTypes.length} type${renewalSelectedTypes.length !== 1 ? 's' : ''} selected`}
                        </span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showMemberTypeSelector && (
                        <div className="mt-2 p-3 border border-gray-200 rounded-lg bg-gray-50 max-h-60 overflow-y-auto">
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-300">
                            <button onClick={() => setRenewalSelectedTypes(Object.keys(renewalTrendDataByType))} className="text-xs text-blue-600 hover:text-blue-800">Select All</button>
                            <button onClick={() => setRenewalSelectedTypes([])} className="text-xs text-blue-600 hover:text-blue-800">Clear All</button>
                          </div>
                          <div className="space-y-1.5">
                            {Object.keys(renewalTrendDataByType).map((type) => (
                              <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1.5 rounded">
                                <input
                                  type="checkbox"
                                  checked={renewalSelectedTypes.includes(type)}
                                  onChange={(e) => {
                                    if (e.target.checked) setRenewalSelectedTypes([...renewalSelectedTypes, type]);
                                    else setRenewalSelectedTypes(renewalSelectedTypes.filter(t => t !== type));
                                  }}
                                  className="rounded border-gray-300"
                                />
                                <span className="text-xs text-gray-700 flex-1">{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Metric</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
                        <option value="count">Member Count</option>
                        <option value="revenue">Revenue</option>
                        <option value="engagement">Engagement Score</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Aggregation</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={chartAggregation} onChange={(e) => setChartAggregation(e.target.value)}>
                        <option value="count">Count</option>
                        <option value="percentage">Percentage</option>
                        <option value="sum">Sum</option>
                        <option value="average">Average</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <button onClick={() => setShowChartConfigSlideout(false)} className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors">
                    Apply Configuration
                  </button>
                </div>
              </div>
            </>
          )}

          {previewChartType === 'heatmap' && (
            <>
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
            </>
          )}
        </div>
      )}

      {/* Marker Slideouts - KEEPING ALL EXISTING CODE */}
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
        
        /* Prevent flickering during transitions */
        [style*="marginRight"] {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          will-change: margin-right;
        }
        
        /* Smooth chart rendering */
        .recharts-surface {
          will-change: auto;
          transform: translateZ(0);
        }
        
        /* Prevent layout shifts */
        .grid {
          contain: layout;
        }
        
        /* Stabilize charts during updates */
        .recharts-wrapper {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        /* Prevent repaints during animations */
        .bg-white {
          transform: translateZ(0);
        }
        
        /* Smooth transitions for all interactive elements */
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