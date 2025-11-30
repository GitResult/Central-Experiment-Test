/**
 * FloatingPanel Component
 *
 * A Windows OS-like floating panel that can be moved, resized,
 * maximized, minimized, and closed. Used for pop-out card views.
 *
 * When maximized, displays a 3-pane split view:
 * - Left: Filter options
 * - Middle: Records list with search and multi-select
 * - Right: Record details (widest pane)
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../config/theme';
import {
  Minus, Square, X, Maximize2, Minimize2, Search,
  Mail, Building2, Calendar, CheckCircle, Clock,
  Phone, MapPin, CreditCard, User, Hash, Utensils,
  CheckSquare, Square as SquareIcon
} from 'lucide-react';

const MIN_WIDTH = 320;
const MIN_HEIGHT = 200;
const HEADER_HEIGHT = 40;

// Generate comprehensive mock records
function generateMockRecords(items) {
  const firstNames = ['Sarah', 'James', 'Emily', 'Michael', 'Jessica', 'David', 'Amanda', 'Christopher', 'Ashley', 'Matthew', 'Jennifer', 'Daniel', 'Elizabeth', 'Andrew', 'Nicole', 'Robert', 'Michelle', 'William', 'Stephanie', 'Richard'];
  const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark'];
  const companies = ['Acme Corp', 'TechStart Inc', 'Global Systems', 'DataFlow', 'CloudNet', 'InnovateTech', 'FutureWorks', 'NextGen Labs', 'Pioneer Digital', 'Quantum Solutions', 'Summit Partners', 'Vertex Analytics', 'Apex Financial', 'Core Dynamics', 'Prime Consulting'];
  const titles = ['Senior Analyst', 'Director', 'Manager', 'VP Operations', 'Consultant', 'Partner', 'Associate', 'Principal', 'Chief Accountant', 'Controller', 'CFO', 'Tax Manager', 'Audit Partner', 'Senior Associate', 'Staff Accountant'];
  const cities = ["Toronto, ON", "Vancouver, BC", "Calgary, AB", "Montreal, QC", "Ottawa, ON", "Edmonton, AB", "Winnipeg, MB", "Halifax, NS", "St. John's, NL", "Victoria, BC"];
  const dietaryOptions = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Kosher', 'Halal', 'Nut Allergy', 'Dairy-Free'];
  const sessions = ['Opening Keynote', 'AI in Accounting', 'Tax Updates 2025', 'Ethics Workshop', 'Closing Ceremony', 'Networking Lunch', 'Breakout: Audit Tech', 'Panel: Future of CPA'];

  const allRecords = [];

  items.forEach(item => {
    const recordCount = Math.min(item.count, 25);
    for (let i = 0; i < recordCount; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const title = titles[Math.floor(Math.random() * titles.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const regDate = new Date(2025, Math.floor(Math.random() * 5), Math.floor(Math.random() * 28) + 1);
      const dietary = dietaryOptions[Math.floor(Math.random() * dietaryOptions.length)];

      // Generate random sessions (2-5 sessions per attendee)
      const numSessions = Math.floor(Math.random() * 4) + 2;
      const attendeeSessions = [];
      const sessionsCopy = [...sessions];
      for (let j = 0; j < numSessions && sessionsCopy.length > 0; j++) {
        const idx = Math.floor(Math.random() * sessionsCopy.length);
        attendeeSessions.push(sessionsCopy.splice(idx, 1)[0]);
      }

      // Registration fee based on type
      const feeMap = {
        'Full Conference': 599,
        'Early Bird': 449,
        'Student': 199,
        'VIP': 999
      };
      const fee = feeMap[item.name] || 499;

      allRecords.push({
        id: `${item.name.replace(/\s/g, '-').toLowerCase()}-${i}`,
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s/g, '')}.com`,
        company,
        title,
        type: item.name,
        typeColor: item.color,
        registeredAt: regDate,
        status: Math.random() > 0.12 ? 'confirmed' : 'pending',
        phone: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        city,
        registrationId: `CPA-2025-${String(Math.floor(Math.random() * 90000) + 10000)}`,
        dietary,
        sessions: attendeeSessions,
        fee,
        paymentStatus: Math.random() > 0.08 ? 'paid' : 'pending',
        badge: Math.random() > 0.15 ? 'printed' : 'not printed',
        checkInStatus: Math.random() > 0.7 ? 'checked-in' : 'not checked-in',
        notes: Math.random() > 0.8 ? 'Requires wheelchair access' : ''
      });
    }
  });

  return allRecords;
}

export function FloatingPanel({
  isOpen,
  onClose,
  title,
  icon,
  children,
  collection,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 400, height: 500 },
  zIndex = 1000
}) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);

  // Split view state
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [focusedRecord, setFocusedRecord] = useState(null);
  const [allRecords, setAllRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Pane widths (resizable)
  const [leftPaneWidth, setLeftPaneWidth] = useState(220);
  const [middlePaneWidth, setMiddlePaneWidth] = useState(280);
  const [resizingPane, setResizingPane] = useState(null);
  const resizeStartX = useRef(0);
  const resizeStartWidths = useRef({ left: 0, middle: 0 });

  // Store pre-maximize state
  const preMaxState = useRef({ position, size });

  // Drag state
  const dragStart = useRef({ x: 0, y: 0 });
  const panelRef = useRef(null);

  // Generate records when collection changes
  useEffect(() => {
    if (collection?.list) {
      setAllRecords(generateMockRecords(collection.list));
    }
  }, [collection]);

  // Handle pane resize
  useEffect(() => {
    const handlePaneResize = (e) => {
      if (!resizingPane) return;

      const deltaX = e.clientX - resizeStartX.current;

      if (resizingPane === 'left') {
        const newLeftWidth = Math.max(180, Math.min(350, resizeStartWidths.current.left + deltaX));
        setLeftPaneWidth(newLeftWidth);
      } else if (resizingPane === 'middle') {
        const newMiddleWidth = Math.max(200, Math.min(500, resizeStartWidths.current.middle + deltaX));
        setMiddlePaneWidth(newMiddleWidth);
      }
    };

    const handlePaneResizeEnd = () => {
      setResizingPane(null);
    };

    if (resizingPane) {
      document.addEventListener('mousemove', handlePaneResize);
      document.addEventListener('mouseup', handlePaneResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handlePaneResize);
        document.removeEventListener('mouseup', handlePaneResizeEnd);
      };
    }
  }, [resizingPane]);

  const startPaneResize = (pane, e) => {
    e.preventDefault();
    setResizingPane(pane);
    resizeStartX.current = e.clientX;
    resizeStartWidths.current = { left: leftPaneWidth, middle: middlePaneWidth };
  };

  // Handle drag start
  const handleDragStart = useCallback((e) => {
    if (isMaximized) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  }, [isMaximized, position]);

  // Handle resize start
  const handleResizeStart = useCallback((e, direction) => {
    if (isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      posX: position.x,
      posY: position.y
    };
  }, [isMaximized, size, position]);

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - dragStart.current.x, window.innerWidth - 100));
        const newY = Math.max(0, Math.min(e.clientY - dragStart.current.y, window.innerHeight - HEADER_HEIGHT));
        setPosition({ x: newX, y: newY });
      } else if (isResizing && resizeDirection) {
        const deltaX = e.clientX - dragStart.current.x;
        const deltaY = e.clientY - dragStart.current.y;

        let newWidth = dragStart.current.width;
        let newHeight = dragStart.current.height;
        let newX = dragStart.current.posX;
        let newY = dragStart.current.posY;

        if (resizeDirection.includes('e')) {
          newWidth = Math.max(MIN_WIDTH, dragStart.current.width + deltaX);
        }
        if (resizeDirection.includes('w')) {
          const widthDelta = Math.min(deltaX, dragStart.current.width - MIN_WIDTH);
          newWidth = dragStart.current.width - widthDelta;
          newX = dragStart.current.posX + widthDelta;
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(MIN_HEIGHT, dragStart.current.height + deltaY);
        }
        if (resizeDirection.includes('n')) {
          const heightDelta = Math.min(deltaY, dragStart.current.height - MIN_HEIGHT);
          newHeight = dragStart.current.height - heightDelta;
          newY = dragStart.current.posY + heightDelta;
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, resizeDirection]);

  // Toggle maximize
  const handleMaximize = () => {
    if (isMinimized) {
      setIsMinimized(false);
      return;
    }

    if (isMaximized) {
      setPosition(preMaxState.current.position);
      setSize(preMaxState.current.size);
    } else {
      preMaxState.current = { position, size };
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    setIsMaximized(!isMaximized);
  };

  // Toggle minimize
  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMaximized) {
      setIsMaximized(false);
      setPosition(preMaxState.current.position);
      setSize(preMaxState.current.size);
    }
  };

  // Double-click title bar to maximize
  const handleTitleDoubleClick = () => {
    if (!isMinimized) {
      handleMaximize();
    }
  };

  // Filter toggle
  const toggleFilter = (itemName) => {
    setSelectedFilters(prev =>
      prev.includes(itemName)
        ? prev.filter(f => f !== itemName)
        : [...prev, itemName]
    );
    setSelectedRecords([]);
    setFocusedRecord(null);
  };

  // Record selection toggle
  const toggleRecordSelection = (record, e) => {
    e?.stopPropagation();
    setSelectedRecords(prev =>
      prev.some(r => r.id === record.id)
        ? prev.filter(r => r.id !== record.id)
        : [...prev, record]
    );
  };

  // Select all visible records
  const selectAllRecords = () => {
    if (selectedRecords.length === filteredRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords([...filteredRecords]);
    }
  };

  // Get filtered records
  const filteredRecords = allRecords.filter(r => {
    const matchesFilter = selectedFilters.length === 0 || selectedFilters.includes(r.type);
    const matchesSearch = searchQuery === '' ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Resize handle styles
  const getResizeHandleStyle = (direction) => {
    const base = {
      position: 'absolute',
      zIndex: 10
    };

    const styles = {
      n: { top: 0, left: 8, right: 8, height: 4, cursor: 'n-resize' },
      s: { bottom: 0, left: 8, right: 8, height: 4, cursor: 's-resize' },
      e: { right: 0, top: 8, bottom: 8, width: 4, cursor: 'e-resize' },
      w: { left: 0, top: 8, bottom: 8, width: 4, cursor: 'w-resize' },
      ne: { top: 0, right: 0, width: 12, height: 12, cursor: 'ne-resize' },
      nw: { top: 0, left: 0, width: 12, height: 12, cursor: 'nw-resize' },
      se: { bottom: 0, right: 0, width: 12, height: 12, cursor: 'se-resize' },
      sw: { bottom: 0, left: 0, width: 12, height: 12, cursor: 'sw-resize' }
    };

    return { ...base, ...styles[direction] };
  };

  const resizeDirections = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

  // Render detail field
  const DetailField = ({ icon: Icon, label, value, highlight, iconColor }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
      <Icon size={18} style={{ color: iconColor || theme.colors.text.tertiary, marginTop: '2px', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.text.tertiary,
          marginBottom: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {label}
        </div>
        <div style={{
          fontSize: theme.typography.fontSize.sm,
          color: highlight ? theme.colors.primary[600] : theme.colors.text.primary,
          fontWeight: highlight ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal,
          background: highlight ? `${focusedRecord?.typeColor}15` : 'transparent',
          padding: highlight ? '4px 8px' : 0,
          borderRadius: highlight ? theme.borderRadius.md : 0,
          display: 'inline-block'
        }}>
          {value}
        </div>
      </div>
    </div>
  );

  // Render the 3-pane split view for maximized state
  const renderSplitView = () => {
    const listItems = collection?.list || [];

    return (
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        cursor: resizingPane ? 'col-resize' : 'default'
      }}>
        {/* Left Pane - Filter Options */}
        <div style={{
          width: `${leftPaneWidth}px`,
          minWidth: `${leftPaneWidth}px`,
          borderRight: `1px solid ${theme.colors.border.default}`,
          background: theme.colors.background.tertiary,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px',
            borderBottom: `1px solid ${theme.colors.border.subtle}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.medium,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: theme.colors.text.tertiary
              }}>
                Filter by Type
              </span>
              {selectedFilters.length > 0 && (
                <button
                  onClick={() => setSelectedFilters([])}
                  style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.tertiary,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px 6px'
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
            {listItems.map((item) => {
              const isSelected = selectedFilters.includes(item.name);
              return (
                <motion.button
                  key={item.name}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleFilter(item.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 12px',
                    marginBottom: '4px',
                    border: 'none',
                    background: isSelected ? theme.colors.background.elevated : 'transparent',
                    borderRadius: theme.borderRadius.md,
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: isSelected ? theme.shadows.sm : 'none'
                  }}
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '2px',
                    background: item.color,
                    flexShrink: 0
                  }} />
                  <span style={{
                    flex: 1,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: isSelected ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal,
                    color: isSelected ? theme.colors.text.primary : theme.colors.text.secondary,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.name}
                  </span>
                  <span style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.tertiary,
                    fontFamily: theme.typography.fontFamily.mono
                  }}>
                    {item.count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Left Resize Handle */}
        <div
          onMouseDown={(e) => startPaneResize('left', e)}
          style={{
            width: '4px',
            cursor: 'col-resize',
            background: 'transparent',
            position: 'relative',
            zIndex: 5,
            marginLeft: '-2px',
            marginRight: '-2px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.primary[200]}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        />

        {/* Middle Pane - Records List */}
        <div style={{
          width: `${middlePaneWidth}px`,
          minWidth: `${middlePaneWidth}px`,
          borderRight: `1px solid ${theme.colors.border.default}`,
          background: theme.colors.background.primary,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Search Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: `1px solid ${theme.colors.border.subtle}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              background: theme.colors.background.tertiary,
              borderRadius: theme.borderRadius.full
            }}>
              <Search size={16} style={{ color: theme.colors.text.tertiary }} />
              <input
                type="text"
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.primary
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    color: theme.colors.text.tertiary
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Selection Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <button
                onClick={selectAllRecords}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.secondary,
                  padding: '4px 8px',
                  borderRadius: theme.borderRadius.sm
                }}
              >
                {selectedRecords.length === filteredRecords.length && filteredRecords.length > 0 ? (
                  <CheckSquare size={14} style={{ color: theme.colors.primary[500] }} />
                ) : (
                  <SquareIcon size={14} />
                )}
                {selectedRecords.length > 0
                  ? `${selectedRecords.length} selected`
                  : `Select all (${filteredRecords.length})`
                }
              </button>
              {selectedRecords.length > 0 && (
                <button
                  onClick={() => setSelectedRecords([])}
                  style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.tertiary,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Records List */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {filteredRecords.map((record) => {
              const isRecordSelected = selectedRecords.some(r => r.id === record.id);
              const isFocused = focusedRecord?.id === record.id;

              return (
                <motion.div
                  key={record.id}
                  whileHover={{ background: theme.colors.background.tertiary }}
                  onClick={() => setFocusedRecord(record)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: `1px solid ${theme.colors.border.subtle}`,
                    cursor: 'pointer',
                    background: isFocused
                      ? theme.colors.primary[50]
                      : isRecordSelected
                        ? theme.colors.neutral[50]
                        : 'transparent',
                    borderLeft: isFocused
                      ? `3px solid ${theme.colors.primary[500]}`
                      : '3px solid transparent'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    {/* Checkbox */}
                    <button
                      onClick={(e) => toggleRecordSelection(record, e)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px',
                        color: isRecordSelected ? theme.colors.primary[500] : theme.colors.text.tertiary
                      }}
                    >
                      {isRecordSelected ? <CheckSquare size={16} /> : <SquareIcon size={16} />}
                    </button>

                    {/* Avatar */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: theme.borderRadius.full,
                      background: theme.colors.neutral[200],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.secondary,
                      flexShrink: 0
                    }}>
                      {record.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: theme.colors.text.primary,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {record.name}
                      </div>
                      <div style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.text.tertiary,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {record.company}
                      </div>
                    </div>

                    {/* Type Badge */}
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: theme.borderRadius.full,
                      fontSize: '10px',
                      background: `${record.typeColor}15`,
                      color: record.typeColor,
                      fontWeight: theme.typography.fontWeight.medium,
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}>
                      {record.type}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Middle Resize Handle */}
        <div
          onMouseDown={(e) => startPaneResize('middle', e)}
          style={{
            width: '4px',
            cursor: 'col-resize',
            background: 'transparent',
            position: 'relative',
            zIndex: 5,
            marginLeft: '-2px',
            marginRight: '-2px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.primary[200]}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        />

        {/* Right Pane - Record Details (Widest) */}
        <div style={{
          flex: 1,
          minWidth: '400px',
          background: theme.colors.background.elevated,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {focusedRecord ? (
            <>
              {/* Detail Header */}
              <div style={{
                padding: '24px',
                borderBottom: `1px solid ${theme.colors.border.subtle}`,
                background: theme.colors.background.tertiary
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: theme.borderRadius.full,
                    background: theme.colors.neutral[200],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: theme.typography.fontSize.xl,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.text.secondary
                  }}>
                    {focusedRecord.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: theme.typography.fontSize.xl,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.text.primary,
                      margin: 0,
                      marginBottom: '4px'
                    }}>
                      {focusedRecord.name}
                    </h3>
                    <p style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.secondary,
                      margin: 0
                    }}>
                      {focusedRecord.title} at {focusedRecord.company}
                    </p>
                  </div>

                  {/* Status badges */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: theme.borderRadius.full,
                      fontSize: theme.typography.fontSize.xs,
                      background: focusedRecord.status === 'confirmed'
                        ? theme.colors.success[50]
                        : theme.colors.warning[50],
                      color: focusedRecord.status === 'confirmed'
                        ? theme.colors.success[600]
                        : theme.colors.warning[600],
                      fontWeight: theme.typography.fontWeight.medium,
                      textTransform: 'capitalize'
                    }}>
                      {focusedRecord.status === 'confirmed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {focusedRecord.status}
                    </span>
                  </div>
                </div>

                {/* Registration Type - Highlighted */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: theme.borderRadius.lg,
                  background: `${focusedRecord.typeColor}15`,
                  border: `2px solid ${focusedRecord.typeColor}`,
                }}>
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: focusedRecord.typeColor
                  }} />
                  <span style={{
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: focusedRecord.typeColor
                  }}>
                    {focusedRecord.type}
                  </span>
                  <span style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: focusedRecord.typeColor,
                    opacity: 0.8
                  }}>
                    ${focusedRecord.fee}
                  </span>
                </div>
              </div>

              {/* Detail Content - Scrollable */}
              <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '24px'
                }}>
                  {/* Left Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.text.tertiary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '-8px'
                    }}>
                      Contact Information
                    </div>

                    <DetailField icon={Mail} label="Email" value={focusedRecord.email} />
                    <DetailField icon={Phone} label="Phone" value={focusedRecord.phone} />
                    <DetailField icon={Building2} label="Company" value={focusedRecord.company} />
                    <DetailField icon={MapPin} label="Location" value={focusedRecord.city} />
                  </div>

                  {/* Right Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.text.tertiary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '-8px'
                    }}>
                      Registration Details
                    </div>

                    <DetailField
                      icon={Hash}
                      label="Registration ID"
                      value={focusedRecord.registrationId}
                    />
                    <DetailField
                      icon={Calendar}
                      label="Registered On"
                      value={focusedRecord.registeredAt.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    />
                    <DetailField
                      icon={CreditCard}
                      label="Payment Status"
                      value={focusedRecord.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      iconColor={focusedRecord.paymentStatus === 'paid' ? theme.colors.success[500] : theme.colors.warning[500]}
                    />
                    <DetailField
                      icon={Utensils}
                      label="Dietary Requirements"
                      value={focusedRecord.dietary}
                    />
                  </div>
                </div>

                {/* Sessions Section */}
                <div style={{ marginTop: '32px' }}>
                  <div style={{
                    fontSize: theme.typography.fontSize.xs,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text.tertiary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '16px'
                  }}>
                    Registered Sessions
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {focusedRecord.sessions.map((session, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: '6px 12px',
                          background: theme.colors.background.tertiary,
                          borderRadius: theme.borderRadius.md,
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.text.secondary,
                          border: `1px solid ${theme.colors.border.subtle}`
                        }}
                      >
                        {session}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div style={{
                  marginTop: '32px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px'
                }}>
                  <div style={{
                    padding: '16px',
                    background: theme.colors.background.tertiary,
                    borderRadius: theme.borderRadius.lg,
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.text.tertiary,
                      marginBottom: '4px'
                    }}>
                      Badge
                    </div>
                    <div style={{
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: focusedRecord.badge === 'printed'
                        ? theme.colors.success[600]
                        : theme.colors.text.secondary,
                      textTransform: 'capitalize'
                    }}>
                      {focusedRecord.badge}
                    </div>
                  </div>
                  <div style={{
                    padding: '16px',
                    background: theme.colors.background.tertiary,
                    borderRadius: theme.borderRadius.lg,
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.text.tertiary,
                      marginBottom: '4px'
                    }}>
                      Check-in
                    </div>
                    <div style={{
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: focusedRecord.checkInStatus === 'checked-in'
                        ? theme.colors.success[600]
                        : theme.colors.text.secondary,
                      textTransform: 'capitalize'
                    }}>
                      {focusedRecord.checkInStatus.replace('-', ' ')}
                    </div>
                  </div>
                  <div style={{
                    padding: '16px',
                    background: theme.colors.background.tertiary,
                    borderRadius: theme.borderRadius.lg,
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.text.tertiary,
                      marginBottom: '4px'
                    }}>
                      Total Paid
                    </div>
                    <div style={{
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.text.primary
                    }}>
                      ${focusedRecord.fee}.00
                    </div>
                  </div>
                </div>

                {/* Notes if any */}
                {focusedRecord.notes && (
                  <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    background: theme.colors.warning[50],
                    borderRadius: theme.borderRadius.lg,
                    border: `1px solid ${theme.colors.warning[200]}`
                  }}>
                    <div style={{
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.warning[700],
                      marginBottom: '4px'
                    }}>
                      Special Notes
                    </div>
                    <div style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.warning[800]
                    }}>
                      {focusedRecord.notes}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.text.tertiary,
              padding: '32px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: theme.borderRadius.full,
                background: theme.colors.neutral[100],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <User size={32} style={{ color: theme.colors.neutral[400] }} />
              </div>
              <div style={{
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.medium,
                marginBottom: '8px',
                color: theme.colors.text.secondary
              }}>
                No Record Selected
              </div>
              <div style={{
                fontSize: theme.typography.fontSize.sm,
                textAlign: 'center',
                maxWidth: '280px',
                lineHeight: theme.typography.lineHeight.relaxed
              }}>
                Select a record from the list to view full registration details
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: isMaximized ? 0 : position.x,
            y: isMaximized ? 0 : position.y,
            width: isMaximized ? window.innerWidth : size.width,
            height: isMinimized ? HEADER_HEIGHT : (isMaximized ? window.innerHeight : size.height)
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex,
            background: theme.colors.background.elevated,
            borderRadius: isMaximized ? 0 : theme.borderRadius.lg,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
            border: `1px solid ${theme.colors.border.default}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            userSelect: isDragging || isResizing || resizingPane ? 'none' : 'auto'
          }}
        >
          {/* Resize Handles */}
          {!isMaximized && !isMinimized && resizeDirections.map(dir => (
            <div
              key={dir}
              style={getResizeHandleStyle(dir)}
              onMouseDown={(e) => handleResizeStart(e, dir)}
            />
          ))}

          {/* Title Bar */}
          <div
            onMouseDown={handleDragStart}
            onDoubleClick={handleTitleDoubleClick}
            style={{
              height: HEADER_HEIGHT,
              minHeight: HEADER_HEIGHT,
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: theme.colors.background.tertiary,
              borderBottom: `1px solid ${theme.colors.border.subtle}`,
              cursor: isMaximized ? 'default' : 'move'
            }}
          >
            {/* Title */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flex: 1,
              overflow: 'hidden'
            }}>
              {icon && (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  color: theme.colors.text.secondary
                }}>
                  {icon}
                </span>
              )}
              <span style={{
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.text.primary,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {title}
              </span>
              {isMaximized && selectedRecords.length > 0 && (
                <span style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.primary[600],
                  background: theme.colors.primary[50],
                  padding: '2px 8px',
                  borderRadius: theme.borderRadius.full
                }}>
                  {selectedRecords.length} selected
                </span>
              )}
            </div>

            {/* Window Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              {/* Minimize */}
              <motion.button
                whileHover={{ background: theme.colors.neutral[200] }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMinimize}
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: theme.borderRadius.sm,
                  cursor: 'pointer',
                  color: theme.colors.text.secondary
                }}
              >
                <Minus size={14} />
              </motion.button>

              {/* Maximize/Restore */}
              <motion.button
                whileHover={{ background: theme.colors.neutral[200] }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMaximize}
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: theme.borderRadius.sm,
                  cursor: 'pointer',
                  color: theme.colors.text.secondary
                }}
              >
                {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </motion.button>

              {/* Close */}
              <motion.button
                whileHover={{ background: theme.colors.error[500], color: '#fff' }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: theme.borderRadius.sm,
                  cursor: 'pointer',
                  color: theme.colors.text.secondary
                }}
              >
                <X size={14} />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          {!isMinimized && (
            isMaximized && collection ? (
              renderSplitView()
            ) : (
              <div style={{
                flex: 1,
                overflow: 'auto',
                background: theme.colors.background.primary
              }}>
                {children}
              </div>
            )
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

FloatingPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  children: PropTypes.node,
  collection: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      count: PropTypes.number,
      color: PropTypes.string
    }))
  }),
  initialPosition: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  initialSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }),
  zIndex: PropTypes.number
};
