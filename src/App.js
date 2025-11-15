import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart3, Edit3, Filter, Eye, Target, Users, AlertCircle, CheckCircle2, X,
  MapPin, Zap, Activity
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar as RechartsRadar
} from 'recharts';
import {
  DndContext,
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
  const [currentMarkerType, setCurrentMarkerType] = useState(null);
  const [tasksGenerated, setTasksGenerated] = useState(false);
  const tableRef = useRef(null);
  const contentRef = useRef(null);
  const [markerPositions, setMarkerPositions] = useState({});
  
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [proposedTasks, setProposedTasks] = useState([]);
  const [tasksApproved, setTasksApproved] = useState(false);
  const [taskProgress, setTaskProgress] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [activeDragTaskId, setActiveDragTaskId] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const chatMessagesEndRef = useRef(null);

  const [showChartPreviewSlideout, setShowChartPreviewSlideout] = useState(false);
  const [previewChartType, setPreviewChartType] = useState(null);
  const [showChartConfigSlideout, setShowChartConfigSlideout] = useState(false);
  const [selectedMemberForRadar, setSelectedMemberForRadar] = useState(null);
  
  // Phase 4: Record Collection Editor States
  const [showContactDetail, setShowContactDetail] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showParticipantEdit, setShowParticipantEdit] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showCentralSidebar, setShowCentralSidebar] = useState(false);
  const [availableFieldTypes] = useState([
    { id: 'text', label: 'Text', icon: '📝', type: 'text' },
    { id: 'number', label: 'Number', icon: '🔢', type: 'number' },
    { id: 'date', label: 'Date', icon: '📅', type: 'date' },
    { id: 'select', label: 'Select Single', icon: '📋', type: 'select' },
    { id: 'multiselect', label: 'Select Multiple', icon: '☑️', type: 'multiselect' },
    { id: 'textarea', label: 'Multi-line Text', icon: '📄', type: 'textarea' },
  ]);
  const [participantFields, setParticipantFields] = useState([
    { id: 'name', label: 'Name', type: 'text', required: true, locked: true, value: '' },
    { id: 'role', label: 'Role', type: 'text', required: true, locked: true, value: '' },
    { id: 'status', label: 'Status', type: 'select', required: true, locked: true, value: 'Active', options: ['Active', 'Inactive', 'Pending'] },
  ]);
  const [fieldBeingConfigured, setFieldBeingConfigured] = useState(null);
  const [activeDragFieldId, setActiveDragFieldId] = useState(null);

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

  const members = [
    { id: 'M001', name: 'Jennifer Walsh', type: 'MEMBER', joinDate: '2022-03', renewalDate: '2025-03', status: 'Active', volunteer: 'Year 1', revenue: '$250', engagement: 82, email: 'jennifer.walsh@email.com', phone: '555-0123' },
    { id: 'M002', name: 'Marcus Chen', type: 'STUDENT Affiliate', joinDate: '2024-01', renewalDate: '2026-01', status: 'Active', volunteer: 'Never', revenue: '$75', engagement: 45, email: 'marcus.chen@email.com', phone: '555-0124' },
    { id: 'M003', name: 'Sarah Kim', type: 'MEMBER', joinDate: '2019-06', renewalDate: '2024-06', status: 'Expired', volunteer: 'Never', revenue: '$0', engagement: 28, email: 'sarah.kim@email.com', phone: '555-0125' },
    { id: 'M004', name: 'David Park', type: 'MEMBER', joinDate: '2020-11', renewalDate: '2024-11', status: 'Expired', volunteer: 'Never', revenue: '$0', engagement: 31, email: 'david.park@email.com', phone: '555-0126' },
    { id: 'M005', name: 'Lisa Wang', type: 'STUDENT Affiliate', joinDate: '2023-09', renewalDate: '2025-09', status: 'Active', volunteer: 'Year 1', revenue: '$75', engagement: 76, email: 'lisa.wang@email.com', phone: '555-0127' },
    { id: 'M006', name: 'Robert Chen', type: 'Fellow', joinDate: '2021-05', renewalDate: '2026-05', status: 'Active', volunteer: 'Year 2+', revenue: '$500', engagement: 94, email: 'robert.chen@email.com', phone: '555-0128' },
    { id: 'M007', name: 'Emily Torres', type: 'MEMBER', joinDate: '2023-02', renewalDate: '2026-02', status: 'Active', volunteer: 'Year 1', revenue: '$250', engagement: 88, email: 'emily.torres@email.com', phone: '555-0129' },
    { id: 'M008', name: 'James Wilson', type: 'MEMBER', joinDate: '2022-08', renewalDate: '2024-08', status: 'Expired', volunteer: 'Never', revenue: '$0', engagement: 22, email: 'james.wilson@email.com', phone: '555-0130' },
    { id: 'M009', name: 'Maria Garcia', type: 'STUDENT Affiliate', joinDate: '2024-03', renewalDate: '2026-03', status: 'Active', volunteer: 'Never', revenue: '$75', engagement: 52, email: 'maria.garcia@email.com', phone: '555-0131' },
    { id: 'M010', name: 'Thomas Brown', type: 'Member Early Career Year 1', joinDate: '2020-01', renewalDate: '2025-01', status: 'Active', volunteer: 'Year 1', revenue: '$200', engagement: 71, email: 'thomas.brown@email.com', phone: '555-0132' },
    { id: 'M011', name: 'Amanda Rodriguez', type: 'MEMBER', joinDate: '2021-09', renewalDate: '2025-09', status: 'Active', volunteer: 'Year 2+', revenue: '$250', engagement: 92, email: 'amanda.rodriguez@email.com', phone: '555-0133' },
    { id: 'M012', name: 'Kevin Nguyen', type: 'STUDENT Affiliate', joinDate: '2023-11', renewalDate: '2025-11', status: 'Active', volunteer: 'Year 1', revenue: '$75', engagement: 68, email: 'kevin.nguyen@email.com', phone: '555-0134' },
    { id: 'M013', name: 'Patricia Lee', type: 'MEMBER', joinDate: '2019-03', renewalDate: '2023-03', status: 'Expired', volunteer: 'Never', revenue: '$0', engagement: 19, email: 'patricia.lee@email.com', phone: '555-0135' },
    { id: 'M014', name: 'Michael Anderson', type: 'Special Affiliate', joinDate: '2022-07', renewalDate: '2025-07', status: 'Active', volunteer: 'Year 1', revenue: '$150', engagement: 79, email: 'michael.anderson@email.com', phone: '555-0136' },
    { id: 'M015', name: 'Jessica Martinez', type: 'MEMBER', joinDate: '2020-05', renewalDate: '2025-05', status: 'Active', volunteer: 'Year 2+', revenue: '$250', engagement: 90, email: 'jessica.martinez@email.com', phone: '555-0137' },
    { id: 'M016', name: 'Daniel Thompson', type: 'STUDENT Affiliate', joinDate: '2024-02', renewalDate: '2026-02', status: 'Active', volunteer: 'Never', revenue: '$75', engagement: 48, email: 'daniel.thompson@email.com', phone: '555-0138' },
    { id: 'M017', name: 'Laura Johnson', type: 'Retired Member', joinDate: '2018-12', renewalDate: '2025-12', status: 'Active', volunteer: 'Never', revenue: '$100', engagement: 35, email: 'laura.johnson@email.com', phone: '555-0139' },
    { id: 'M018', name: 'Christopher White', type: 'Fellow', joinDate: '2021-08', renewalDate: '2026-08', status: 'Active', volunteer: 'Year 1', revenue: '$500', engagement: 86, email: 'christopher.white@email.com', phone: '555-0140' },
    { id: 'M019', name: 'Michelle Davis', type: 'Member Early Career Year 2', joinDate: '2023-04', renewalDate: '2025-04', status: 'Active', volunteer: 'Year 1', revenue: '$200', engagement: 74, email: 'michelle.davis@email.com', phone: '555-0141' },
    { id: 'M020', name: 'Ryan Miller', type: 'STUDENT Affiliate', joinDate: '2023-10', renewalDate: '2025-10', status: 'Active', volunteer: 'Year 1', revenue: '$75', engagement: 65, email: 'ryan.miller@email.com', phone: '555-0142' },
  ];

  const committeeParticipants = {
    'M001': [
      { 
        id: 'CP001', 
        committee: 'Marketing Committee', 
        role: 'Chair', 
        status: 'Active',
        electionType: 'General',
        termNo: 2,
        startDate: '2023-01-15',
        endDate: '2025-01-15',
        note: 'Leading digital transformation initiative'
      },
      { 
        id: 'CP002', 
        committee: 'Events Committee', 
        role: 'Member', 
        status: 'Active',
        electionType: '',
        termNo: null,
        startDate: '',
        endDate: '',
        note: ''
      },
    ],
    'M006': [
      { 
        id: 'CP003', 
        committee: 'Finance Committee', 
        role: 'Vice Chair', 
        status: 'Active',
        electionType: 'Special',
        termNo: 1,
        startDate: '2024-06-01',
        endDate: '2026-06-01',
        note: 'Budget planning specialist'
      },
    ],
    'M011': [
      { 
        id: 'CP004', 
        committee: 'Membership Committee', 
        role: 'Secretary', 
        status: 'Active',
        electionType: 'General',
        termNo: 3,
        startDate: '2022-03-10',
        endDate: '2025-03-10',
        note: 'Retention program lead'
      },
      { 
        id: 'CP005', 
        committee: 'Education Committee', 
        role: 'Member', 
        status: 'Inactive',
        electionType: '',
        termNo: null,
        startDate: '',
        endDate: '',
        note: ''
      },
    ],
  };

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

  // Calculate total slideout width for proper spacing
  const getSlideoutWidth = () => {
    let count = 0;
    if (showContactDetail) count++;
    if (showParticipantEdit) count++;
    if (showChartConfigSlideout) count++;
    return count * 32; // 32rem per panel
  };

  const getContactDetailTransform = () => {
    let offset = 0;
    if (showParticipantEdit) offset += 32;
    if (showChartConfigSlideout) offset += 32;
    return offset;
  };

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
  const isAnySlideoutOpen = showChartPreviewSlideout || showMarkerSlideout || showMarkerDetailSlideout || showParticipantEdit;

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
  }, [compareMode, filteredToProfessional]);

  useEffect(() => {
    if (!compareMode) return;
    const handleResize = () => updateMarkerPositions();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [compareMode]);
  
  const handleRemoveTask = (taskId) => {
    setProposedTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'removed' } : task
    ));
  };
  
  const handleAddTask = () => {
    const newTask = {
      id: `task-${Date.now()}`,
      text: 'New task',
      details: 'Click to edit details',
      status: 'pending',
      editable: true
    };
    setProposedTasks(prev => [...prev, newTask]);
    setEditingTaskId(newTask.id);
  };
  
  const handleTaskDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragTaskId(null);
    
    if (!over || active.id === over.id) return;
    
    setProposedTasks((tasks) => {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      return arrayMove(tasks, oldIndex, newIndex);
    });
  };
  
  const handleApproveTasksFromChat = () => {
    setTasksApproved(true);
    handleApproveAndProceed();
  };
  
  const handleRejectTasks = () => {
    setChatMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      type: 'assistant',
      content: 'Tasks rejected. Would you like me to generate alternative approaches?',
      timestamp: new Date()
    }]);
  };
  
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = {
      id: `msg-user-${Date.now()}`,
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsAITyping(true);
    
    setTimeout(() => {
      setIsAITyping(false);
      const aiMessage = {
        id: `msg-ai-${Date.now()}`,
        type: 'assistant',
        content: "I understand your question. Since this is a demo, I'm showing the volunteer activation workflow. In a live system, I would provide specific answers based on your program data and help you refine the action plan further.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAITyping]);

  const handleCompareClick = () => {
    setCompareMode(true);
    setStep(1);
  };

  const handleVolunteerMarkerClick = () => {
    setPreviewChartType('volunteer');
    setShowChartPreviewSlideout(true);
    setCurrentMarkerType('volunteer');
    setStep(2);
  };

  const handleEngagementClick = (member) => {
    setSelectedMemberForRadar(member);
    setPreviewChartType('radar');
    setShowChartPreviewSlideout(true);
  };

  // Phase 4: Record Collection Handlers
  const handleEditMember = (member) => {
    setSelectedContact(member);
    setShowContactDetail(true);
    setStep(9);
  };

  const handleAddNewParticipant = () => {
    // Create empty participant
    const newParticipant = {
      id: `CP-NEW-${Date.now()}`,
      committee: '',
      role: '',
      status: 'Active',
      electionType: '',
      termNo: null,
      startDate: '',
      endDate: '',
      note: ''
    };
    
    setSelectedParticipant(newParticipant);
    
    // Reset fields with empty values
    const fieldsWithData = participantFields.map(field => {
      if (field.id === 'name') return { ...field, value: selectedContact?.name || '' };
      if (field.id === 'role') return { ...field, value: '' };
      if (field.id === 'status') return { ...field, value: 'Active' };
      return { ...field, value: '' };
    });
    
    setParticipantFields(fieldsWithData);
    setShowParticipantEdit(true);
  };

  const handleEditParticipant = (participant) => {
    setSelectedParticipant(participant);
    
    const fieldsWithData = participantFields.map(field => {
      if (field.id === 'name') return { ...field, value: selectedContact?.name || '' };
      if (field.id === 'role') return { ...field, value: participant.role };
      if (field.id === 'status') return { ...field, value: participant.status };
      if (field.id === 'electionType') return { ...field, value: participant.electionType || '' };
      if (field.id === 'termNo') return { ...field, value: participant.termNo || '' };
      if (field.id === 'startDate') return { ...field, value: participant.startDate || '' };
      if (field.id === 'endDate') return { ...field, value: participant.endDate || '' };
      if (field.id === 'note') return { ...field, value: participant.note || '' };
      return field;
    });
    
    setParticipantFields(fieldsWithData);
    setShowParticipantEdit(true);
    setStep(10);
  };

  const handleCustomizeFields = () => {
    setShowCentralSidebar(true);
    setStep(11);
  };

  const handleAddField = (fieldType) => {
    const newField = {
      id: `custom-${Date.now()}`,
      label: `${fieldType.label}`,
      type: fieldType.type,
      required: false,
      locked: false,
      value: '',
      options: fieldType.type === 'select' || fieldType.type === 'multiselect' ? ['Option 1', 'Option 2', 'Option 3'] : undefined
    };
    
    setParticipantFields([...participantFields, newField]);
    setFieldBeingConfigured(newField);
    setShowChartConfigSlideout(true);
  };

  const handleRemoveField = (fieldId) => {
    setParticipantFields(participantFields.filter(f => f.id !== fieldId));
  };

  const handleFieldDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragFieldId(null);
    
    if (!over || active.id === over.id) return;
    
    setParticipantFields((fields) => {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      return arrayMove(fields, oldIndex, newIndex);
    });
  };

  const handleUpdateFieldConfig = (fieldId, updates) => {
    setParticipantFields(participantFields.map(f => 
      f.id === fieldId ? { ...f, ...updates } : f
    ));
  };

  const handleSaveFieldStructure = () => {
    setShowCentralSidebar(false);
    setShowChartConfigSlideout(false);
    setFieldBeingConfigured(null);
    setStep(12);
  };

  const handleSaveParticipant = () => {
    setShowParticipantEdit(false);
    
    setShowChatPanel(true);
    setChatMessages(prev => [...prev, {
      id: `msg-save-${Date.now()}`,
      type: 'assistant',
      content: '✅ Committee Participant updated successfully!\n\nCustom fields are now available for all committee participants in this collection.',
      timestamp: new Date()
    }]);
    
    setStep(13);
  };

  const handleCloseContactDetail = () => {
    setShowContactDetail(false);
    setSelectedContact(null);
    setShowParticipantEdit(false);
    setSelectedParticipant(null);
    setShowCentralSidebar(false);
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
      const newMarker = {
        id: Date.now(),
        position: { x: tempMarkerPosition.x, y: tempMarkerPosition.y },
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

  const handleGenerateTasks = () => { 
    setTasksGenerated(true); 
    setStep(5); 
    
    const initialTasks = [
      { 
        id: 'task-1', 
        text: 'Create onboarding volunteer program',
        details: 'Target: First-year MEMBERs',
        status: 'pending',
        editable: true
      },
      { 
        id: 'task-2', 
        text: 'Send personalized volunteer invitations',
        details: 'Timing: Within 30 days of joining',
        status: 'pending',
        editable: true
      },
      { 
        id: 'task-3', 
        text: 'Track and measure volunteer engagement',
        details: 'Monitor retention improvements',
        status: 'pending',
        editable: true
      }
    ];
    
    setProposedTasks(initialTasks);
    setShowChatPanel(true);
    setChatMessages([
      {
        id: 'msg-1',
        type: 'assistant',
        content: "I've analyzed the volunteer correlation data and created an action plan to address the First-Year Volunteer Activation Gap. Below are the proposed tasks:",
        timestamp: new Date()
      }
    ]);
  };
  
  const handleApproveAndProceed = () => {
    setShowMarkerDetailSlideout(false);
    setShowChatPanel(true);
    setTasksApproved(true);
    setStep(7);
    
    setChatMessages(prev => [...prev, {
      id: `msg-approve-${Date.now()}`,
      type: 'assistant',
      content: 'Tasks approved! Beginning execution...',
      timestamp: new Date()
    }]);
    
    const tasks = proposedTasks.filter(t => t.status !== 'removed');
    let completedCount = 0;
    
    tasks.forEach((task, index) => {
      setTimeout(() => {
        setTaskProgress(prev => ({
          ...prev,
          [task.id]: { status: 'in-progress', progress: 0 }
        }));
        
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 10;
          if (progress >= 100) {
            clearInterval(progressInterval);
            setTaskProgress(prev => ({
              ...prev,
              [task.id]: { status: 'completed', progress: 100 }
            }));
            
            completedCount++;
            
            setChatMessages(prev => [...prev, {
              id: `msg-complete-${task.id}`,
              type: 'assistant',
              content: `✓ Completed: ${task.text}`,
              timestamp: new Date()
            }]);
            
            if (completedCount === tasks.length) {
              setTimeout(() => {
                setChatMessages(prev => [...prev, {
                  id: 'msg-final',
                  type: 'assistant',
                  content: '✅ All tasks completed!\n\nFirst-Year Volunteer Activation program is now live and running.',
                  timestamp: new Date()
                }]);
              }, 800);
            }
          } else {
            setTaskProgress(prev => ({
              ...prev,
              [task.id]: { status: 'in-progress', progress }
            }));
          }
        }, 100);
      }, index * 2000);
    });
  };

  const getMarkerButton = (column, color, icon, title, onClick, shouldPulse = false, markerType = 'default', offsetX = 0) => {
    const Icon = icon;
    const position = markerPositions[column];
    if (!position) return null;

    const colorClasses = {
      amber: 'text-amber-600 border-amber-600 hover:bg-amber-50',
      red: 'text-red-600 border-red-600 hover:bg-red-50',
      green: 'text-green-600 border-green-600 hover:bg-green-50',
      purple: 'text-purple-600 border-purple-600 hover:bg-purple-50',
    };

    const markerStyles = {
      correlation: 'rounded-lg',
      alert: 'rounded-lg',
      journey: 'rounded-full',
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
        style={{ left: `${position.left + offsetX}px`, top: `${position.top}px`, transform: `translate(-50%, -50%) ${getRotation()}`, animation: shouldPulse ? 'pulseRing 2s infinite' : 'none' }}
        title={title}
      >
        <Icon className="w-4 h-4" strokeWidth={1.5} style={{ transform: getIconRotation() }} />
      </button>
    );
  };

  function DraggableTask({ task, index }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: task.id,
      disabled: task.status === 'removed' || tasksApproved
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      opacity: isDragging ? 0.5 : 1,
    };

    const isInProgress = taskProgress[task.id]?.status === 'in-progress';
    const isCompleted = taskProgress[task.id]?.status === 'completed';
    const progress = taskProgress[task.id]?.progress || 0;
    const isJourneyStep = task.isJourney;

    if (task.status === 'removed') {
      return (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-50">
          <div className="flex items-start gap-2">
            <X className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-500 line-through">{task.text}</p>
              <p className="text-xs text-gray-400 line-through">{task.details}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div 
        ref={setNodeRef}
        style={style}
        className={`p-3 rounded-lg border transition-all ${
          isCompleted 
            ? 'bg-green-50 border-green-200' 
            : isInProgress 
              ? 'bg-blue-50 border-blue-200' 
              : isJourneyStep
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-gray-50 border-gray-200'
        } ${isDragging ? 'shadow-lg' : ''}`}
      >
        <div className="flex items-start gap-2">
          {!tasksApproved && (
            <div 
              {...attributes} 
              {...listeners}
              className="cursor-grab active:cursor-grabbing mt-0.5"
            >
              <div className="w-4 h-4 text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="5" r="1" fill="currentColor"/>
                  <circle cx="9" cy="12" r="1" fill="currentColor"/>
                  <circle cx="9" cy="19" r="1" fill="currentColor"/>
                  <circle cx="15" cy="5" r="1" fill="currentColor"/>
                  <circle cx="15" cy="12" r="1" fill="currentColor"/>
                  <circle cx="15" cy="19" r="1" fill="currentColor"/>
                </svg>
              </div>
            </div>
          )}
          
          {isCompleted && (
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          )}
          {isInProgress && (
            <Activity className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5 animate-pulse" />
          )}
          {!isInProgress && !isCompleted && (
            <div className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 ${
              isJourneyStep ? 'border-emerald-400 bg-emerald-100' : 'border-gray-300'
            }`}>
              {isJourneyStep && <span className="text-[8px] text-emerald-600 font-bold leading-none">→</span>}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            {editingTaskId === task.id ? (
              <input
                autoFocus
                type="text"
                value={task.text}
                onChange={(e) => setProposedTasks(prev => prev.map(t => 
                  t.id === task.id ? { ...t, text: e.target.value } : t
                ))}
                onBlur={() => setEditingTaskId(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setEditingTaskId(null);
                  if (e.key === 'Escape') setEditingTaskId(null);
                }}
                className="w-full text-sm font-medium px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p 
                className={`text-sm font-medium cursor-pointer hover:text-blue-600 ${
                  isCompleted ? 'text-green-900' : isInProgress ? 'text-blue-900' : isJourneyStep ? 'text-emerald-900' : 'text-gray-900'
                }`}
                onClick={() => !tasksApproved && setEditingTaskId(task.id)}
              >
                {task.text}
              </p>
            )}
            <p className={`text-xs mt-0.5 flex items-center gap-1 ${
              isCompleted ? 'text-green-700' : isInProgress ? 'text-blue-700' : isJourneyStep ? 'text-emerald-700' : 'text-gray-600'
            }`}>
              {isJourneyStep && <span className="text-emerald-600">→</span>}
              {task.details}
            </p>
            
            {isInProgress && (
              <div className="mt-2">
                <div className="w-full bg-blue-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          
          {!tasksApproved && !isInProgress && !isCompleted && (
            <button
              onClick={() => handleRemoveTask(task.id)}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Remove task"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  function DraggableField({ field, index }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: field.id,
      disabled: field.locked
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      opacity: isDragging ? 0.5 : 1,
    };

    const fieldTypeIcons = {
      text: '📝',
      number: '🔢',
      date: '📅',
      select: '📋',
      multiselect: '☑️',
      textarea: '📄',
    };

    return (
      <div 
        ref={setNodeRef}
        style={style}
        className={`p-3 rounded-lg border transition-all ${
          field.locked 
            ? 'bg-gray-100 border-gray-300 opacity-60' 
            : 'bg-white border-gray-200 hover:border-blue-300'
        } ${isDragging ? 'shadow-lg' : ''}`}
      >
        <div className="flex items-center gap-2">
          {!field.locked && (
            <div 
              {...attributes} 
              {...listeners}
              className="cursor-grab active:cursor-grabbing"
            >
              <div className="w-4 h-4 text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="5" r="1" fill="currentColor"/>
                  <circle cx="9" cy="12" r="1" fill="currentColor"/>
                  <circle cx="9" cy="19" r="1" fill="currentColor"/>
                  <circle cx="15" cy="5" r="1" fill="currentColor"/>
                  <circle cx="15" cy="12" r="1" fill="currentColor"/>
                  <circle cx="15" cy="19" r="1" fill="currentColor"/>
                </svg>
              </div>
            </div>
          )}
          
          {field.locked && (
            <div className="w-4 h-4 text-gray-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
          )}
          
          <span className="text-sm">{fieldTypeIcons[field.type]}</span>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </p>
              {field.locked && (
                <span className="text-[9px] px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded uppercase font-semibold">
                  System
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 capitalize">{field.type}</p>
          </div>
          
          {!field.locked && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setFieldBeingConfigured(field);
                  setShowChartConfigSlideout(true);
                }}
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                title="Configure field"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleRemoveField(field.id)}
                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                title="Remove field"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 font-sans" onClick={handlePageClick}>
      <div
        ref={contentRef}
        className="transition-all duration-300 ease-in-out relative"
        style={{ 
          marginLeft: showCentralSidebar ? '20rem' : '0',
          marginRight: `${getSlideoutWidth()}rem`
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
              {step === 4 && "🎯 Click 'Generate Action Plan' in the yellow pin details"}
              {step === 5 && "💬 Chat opens! Try editing/reordering tasks (optional)"}
              {step === 6 && "✅ Click 'Approve & Execute' to watch automation"}
              {step >= 7 && !tasksApproved && "✅ Click 'Approve' to execute tasks"}
              {step >= 7 && tasksApproved && taskProgress['task-3']?.status !== 'completed' && "⚙️ Building volunteer program..."}
              {step >= 7 && taskProgress['task-3']?.status === 'completed' && "🎉 Done! Click Edit icon on any member row to view details"}
              {step === 9 && "👤 Contact detail loaded. Click 'Edit' on Events Committee (missing custom fields)"}
              {step === 10 && "✨ Click 'Customize Fields' button at top"}
              {step === 11 && "🎨 Click field types in sidebar to add. Try 'Select Single' first, then edit it"}
              {step === 12 && "📝 Fill in the new fields with data, then click 'Save Participant'"}
              {step === 13 && "🎊 Complete! Custom fields now available for all committee participants"}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm mt-6">
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
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                        onClick={() => handleEngagementClick(member)}
                      >
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          member.engagement >= 80 ? 'bg-green-100 text-green-800' :
                          member.engagement >= 60 ? 'bg-blue-100 text-blue-800' :
                          member.engagement >= 40 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {member.engagement}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{member.revenue}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleEditMember(member)}
                          className="inline-flex items-center justify-center p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </td>
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

      {/* Chart Preview Slideout */}
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

            {tasksGenerated && (
              <button onClick={handleApproveAndProceed} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 mt-4">
                <CheckCircle2 className="w-4 h-4" />
                Approve & Execute
              </button>
            )}
          </div>
        </div>
      )}

      {showChatPanel && (
        <div className="fixed bottom-6 right-6 w-[440px] bg-white shadow-2xl rounded-xl border border-slate-200 z-[100] chat-panel flex flex-col overflow-hidden" 
             style={{ height: '620px', maxHeight: 'calc(100vh - 100px)' }}>
          
          <div className="flex-shrink-0 px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800">AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-xs text-slate-600">Active</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowChatPanel(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1.5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50">
            {chatMessages.map((message, msgIndex) => {
              const isUser = message.type === 'user';
              const shouldShowTaskListAfter = msgIndex === 0 && proposedTasks.length > 0;
              
              return (
                <React.Fragment key={message.id}>
                  <div className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : ''}`}>
                    {!isUser && (
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={`flex-1 ${isUser ? 'max-w-[80%]' : 'max-w-[85%]'}`}>
                      <div className={`rounded-xl px-4 py-2.5 shadow-sm ${
                        isUser 
                          ? 'bg-indigo-600 text-white ml-auto' 
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                      </div>
                      <div className={`text-[10px] text-slate-400 mt-1 ${isUser ? 'text-right mr-2' : 'ml-2'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  
                  {shouldShowTaskListAfter && (
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 max-w-[85%]">
                        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                              {tasksApproved ? 'Task Execution' : 'Proposed Tasks'}
                            </h4>
                            {!tasksApproved && (
                              <button
                                onClick={handleAddTask}
                                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                              >
                                <span className="text-base leading-none">+</span>
                              </button>
                            )}
                          </div>
                          
                          {!tasksApproved ? (
                            <DndContext
                              sensors={sensors}
                              collisionDetection={closestCenter}
                              onDragStart={(e) => setActiveDragTaskId(e.active.id)}
                              onDragEnd={handleTaskDragEnd}
                            >
                              <SortableContext
                                items={proposedTasks.map(t => t.id)}
                                strategy={rectSortingStrategy}
                              >
                                <div className="space-y-2">
                                  {proposedTasks.map((task, index) => (
                                    <DraggableTask key={task.id} task={task} index={index} />
                                  ))}
                                </div>
                              </SortableContext>
                            </DndContext>
                          ) : (
                            <div className="space-y-2">
                              {proposedTasks
                                .filter(task => task.status !== 'removed')
                                .map((task, index) => (
                                  <DraggableTask key={task.id} task={task} index={index} />
                                ))}
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 ml-2">
                          {tasksApproved ? 'Processing...' : 'Just now'}
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
            
            {isAITyping && (
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatMessagesEndRef} />
          </div>

          {proposedTasks.length > 0 && !tasksApproved ? (
            <div className="flex-shrink-0 px-4 py-3 border-t border-slate-200 bg-white">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRejectTasks}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm border border-slate-200"
                >
                  Reject
                </button>
                <button
                  onClick={handleApproveTasksFromChat}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium text-sm flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-shrink-0 px-4 py-3 border-t border-slate-200 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                    chatInput.trim()
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showContactDetail && selectedContact && (
        <div 
          className="fixed right-0 top-0 h-full w-[32rem] bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-[105] slideout-panel"
          style={{ 
            transform: `translateX(-${getContactDetailTransform()}rem)`,
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
              <button onClick={handleCloseContactDetail} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                    {selectedContact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedContact.name}</h2>
                    <p className="text-sm text-gray-600 mt-1">{selectedContact.type}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedContact.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedContact.status}
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📧</span>
                  <span>{selectedContact.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📞</span>
                  <span>{selectedContact.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Join Date</p>
                  <p className="text-sm font-medium text-gray-900">{selectedContact.joinDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Renewal Date</p>
                  <p className="text-sm font-medium text-gray-900">{selectedContact.renewalDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Engagement</p>
                  <p className="text-sm font-medium text-gray-900">{selectedContact.engagement}/100</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Revenue</p>
                  <p className="text-sm font-medium text-gray-900">{selectedContact.revenue}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Committee Participants</h3>
                <button 
                  onClick={handleAddNewParticipant}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Add New
                </button>
              </div>
              <div className="space-y-3">
                {committeeParticipants[selectedContact.id]?.map((participant) => (
                  <div key={participant.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">{participant.committee}</h4>
                        <div className="space-y-1.5">
                          <div>
                            <span className="text-xs text-gray-500">Role: </span>
                            <span className="text-xs font-medium text-gray-900">{participant.role}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Status: </span>
                            <span className={`text-xs font-medium ${
                              participant.status === 'Active' ? 'text-green-700' : 'text-gray-500'
                            }`}>
                              {participant.status}
                            </span>
                          </div>
                          {participant.electionType && (
                            <>
                              <div>
                                <span className="text-xs text-gray-500">Election: </span>
                                <span className="text-xs font-medium text-gray-900">{participant.electionType}</span>
                                <span className="text-xs text-gray-500 ml-2">Term: </span>
                                <span className="text-xs font-medium text-gray-900">{participant.termNo}</span>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Period: </span>
                                <span className="text-xs font-medium text-gray-900">{participant.startDate} - {participant.endDate}</span>
                              </div>
                            </>
                          )}
                          {!participant.electionType && (
                            <div>
                              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                Missing: Election Type, Term, Dates
                              </span>
                            </div>
                          )}
                          {participant.note && (
                            <p className="text-xs text-gray-600 mt-1 italic">{participant.note}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleEditParticipant(participant)}
                        className="ml-3 px-3 py-1.5 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-xs font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCentralSidebar && (
        <div className="fixed left-0 top-0 h-full w-[20rem] bg-white shadow-2xl border-r border-gray-200 z-[100] sidebar-panel overflow-y-auto">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Edit3 className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Customize Fields</h2>
              </div>
              <button onClick={() => setShowCentralSidebar(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-600">Add, remove, or reorder fields for this collection</p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Available Field Types</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableFieldTypes.map((fieldType) => (
                  <button
                    key={fieldType.id}
                    onClick={() => handleAddField(fieldType)}
                    className="flex items-center gap-2 p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all group"
                  >
                    <span className="text-xl">{fieldType.icon}</span>
                    <span className="text-xs font-medium text-gray-700 group-hover:text-purple-900">{fieldType.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Current Fields</h3>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={(e) => setActiveDragFieldId(e.active.id)}
                onDragEnd={handleFieldDragEnd}
              >
                <SortableContext
                  items={participantFields.map(f => f.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="space-y-2">
                    {participantFields.map((field, index) => (
                      <DraggableField key={field.id} field={field} index={index} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowCentralSidebar(false);
                    setShowChartConfigSlideout(false);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveFieldStructure}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                >
                  Save Structure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showParticipantEdit && selectedParticipant && (
        <div 
          className="fixed right-0 top-0 h-full w-[32rem] bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-[110] slideout-panel"
          style={{ 
            transform: showChartConfigSlideout ? 'translateX(-32rem)' : 'translateX(0)',
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Edit Participant</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedParticipant.committee}</p>
              </div>
              <button onClick={() => setShowParticipantEdit(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={handleCustomizeFields}
              className="w-full px-4 py-2 bg-white text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
            >
              <span className="text-lg">✨</span>
              Customize Fields
            </button>
          </div>

          <div className="p-6 space-y-4">
            {participantFields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                  {field.locked && (
                    <span className="ml-2 text-[9px] px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded uppercase font-semibold">
                      System
                    </span>
                  )}
                </label>
                
                {field.type === 'text' && (
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => handleUpdateFieldConfig(field.id, { value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    disabled={field.locked && field.id === 'name'}
                  />
                )}
                
                {field.type === 'number' && (
                  <input
                    type="number"
                    value={field.value}
                    onChange={(e) => handleUpdateFieldConfig(field.id, { value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
                
                {field.type === 'date' && (
                  <input
                    type="date"
                    value={field.value}
                    onChange={(e) => handleUpdateFieldConfig(field.id, { value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
                
                {field.type === 'select' && (
                  <select
                    value={field.value}
                    onChange={(e) => handleUpdateFieldConfig(field.id, { value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {field.options?.map((option, idx) => (
                      <option key={idx} value={option}>{option}</option>
                    ))}
                  </select>
                )}
                
                {field.type === 'multiselect' && (
                  <select
                    multiple
                    value={Array.isArray(field.value) ? field.value : []}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      handleUpdateFieldConfig(field.id, { value: selected });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    size={3}
                  >
                    {field.options?.map((option, idx) => (
                      <option key={idx} value={option}>{option}</option>
                    ))}
                  </select>
                )}
                
                {field.type === 'textarea' && (
                  <textarea
                    value={field.value}
                    onChange={(e) => handleUpdateFieldConfig(field.id, { value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 bg-white p-6 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => setShowParticipantEdit(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveParticipant}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Save Participant
              </button>
            </div>
          </div>
        </div>
      )}

      {showChartConfigSlideout && fieldBeingConfigured && (
        <div 
          className="fixed right-0 top-0 h-full w-[32rem] bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-[120] slideout-panel"
        >
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Field Properties</h2>
                <p className="text-sm text-gray-600 mt-1">Configure {fieldBeingConfigured.label}</p>
              </div>
              <button onClick={() => {
                setShowChartConfigSlideout(false);
                setFieldBeingConfigured(null);
              }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field Label</label>
              <input
                type="text"
                value={fieldBeingConfigured.label}
                onChange={(e) => {
                  const updatedField = { ...fieldBeingConfigured, label: e.target.value };
                  setFieldBeingConfigured(updatedField);
                  handleUpdateFieldConfig(fieldBeingConfigured.id, { label: e.target.value });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter field label"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fieldBeingConfigured.required}
                  onChange={(e) => {
                    const updatedField = { ...fieldBeingConfigured, required: e.target.checked };
                    setFieldBeingConfigured(updatedField);
                    handleUpdateFieldConfig(fieldBeingConfigured.id, { required: e.target.checked });
                  }}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">Required field</span>
              </label>
            </div>

            {(fieldBeingConfigured.type === 'select' || fieldBeingConfigured.type === 'multiselect') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                <div className="space-y-2">
                  {fieldBeingConfigured.options?.map((option, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(fieldBeingConfigured.options || [])];
                          newOptions[idx] = e.target.value;
                          const updatedField = { ...fieldBeingConfigured, options: newOptions };
                          setFieldBeingConfigured(updatedField);
                          handleUpdateFieldConfig(fieldBeingConfigured.id, { options: newOptions });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder={`Option ${idx + 1}`}
                      />
                      <button
                        onClick={() => {
                          const newOptions = fieldBeingConfigured.options?.filter((_, i) => i !== idx);
                          const updatedField = { ...fieldBeingConfigured, options: newOptions };
                          setFieldBeingConfigured(updatedField);
                          handleUpdateFieldConfig(fieldBeingConfigured.id, { options: newOptions });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newOptions = [...(fieldBeingConfigured.options || []), `Option ${(fieldBeingConfigured.options?.length || 0) + 1}`];
                      const updatedField = { ...fieldBeingConfigured, options: newOptions };
                      setFieldBeingConfigured(updatedField);
                      handleUpdateFieldConfig(fieldBeingConfigured.id, { options: newOptions });
                    }}
                    className="w-full px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            )}

            {fieldBeingConfigured.type === 'text' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder</label>
                <input
                  type="text"
                  value={fieldBeingConfigured.placeholder || ''}
                  onChange={(e) => {
                    const updatedField = { ...fieldBeingConfigured, placeholder: e.target.value };
                    setFieldBeingConfigured(updatedField);
                    handleUpdateFieldConfig(fieldBeingConfigured.id, { placeholder: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter placeholder text"
                />
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white p-6 border-t border-gray-200">
            <button
              onClick={() => {
                setShowChartConfigSlideout(false);
                setFieldBeingConfigured(null);
              }}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
            >
              Done
            </button>
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
        
        [style*="marginRight"],
        [style*="marginLeft"],
        [style*="marginBottom"] {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          will-change: margin-right, margin-left, margin-bottom;
        }
        
        .recharts-surface {
          will-change: auto;
          transform: translateZ(0);
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
        
        .chat-panel {
          animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes slideInUp {
          from {
            transform: translateY(100%) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .sidebar-panel {
          animation: slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .slideout-panel {
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default CompareModeDemo;