/**
 * TimelinePanel Component
 *
 * A bottom panel that slides up showing registrations by week
 * with a delightful dual-handle range slider for filtering.
 * Features quick date presets and keyboard navigation.
 */

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, RotateCcw, GripHorizontal, Zap } from 'lucide-react';
import { useTimelineFilterStore } from '../../store/timelineFilterStore';
import { theme } from '../../config/theme';
import { AnimatedNumber } from '../common/AnimatedNumber';

// Panel animation variants
const panelVariants = {
  hidden: {
    y: '100%',
    opacity: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40
    }
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 35,
      mass: 0.8
    }
  }
};

// Quick date presets
const DATE_PRESETS = [
  { id: 'last30', label: 'Last 30 Days', getRange: (weeks) => {
    const end = weeks.length - 1;
    const start = Math.max(0, end - 4); // ~5 weeks ≈ 30 days
    return { start, end };
  }},
  { id: 'quarter', label: 'This Quarter', getRange: (weeks) => {
    // Get the last quarter of data
    const end = weeks.length - 1;
    const start = Math.max(0, end - 12); // ~13 weeks = 1 quarter
    return { start, end };
  }},
  { id: 'peak', label: 'Peak Period', getRange: (weeks) => {
    // Find the weeks with highest registrations
    let maxSum = 0;
    let bestStart = 0;
    const windowSize = 4;

    for (let i = 0; i <= weeks.length - windowSize; i++) {
      const sum = weeks.slice(i, i + windowSize).reduce((s, w) => s + w.registrations, 0);
      if (sum > maxSum) {
        maxSum = sum;
        bestStart = i;
      }
    }
    return { start: bestStart, end: Math.min(bestStart + windowSize - 1, weeks.length - 1) };
  }},
  { id: 'all', label: 'All Time', getRange: (weeks) => ({ start: 0, end: weeks.length - 1 })}
];

export function TimelinePanel({ isOpen, onClose }) {
  const {
    weeks,
    rangeStart,
    rangeEnd,
    isFilterActive,
    setRangeStart,
    setRangeEnd,
    setRange,
    resetRange,
    isDragging,
    setDragging,
    getTotalRegistrations,
    getBreakdownTotals
  } = useTimelineFilterStore();

  const sliderRef = useRef(null);
  const panelRef = useRef(null);
  const [hoveredWeek, setHoveredWeek] = useState(null);
  const [sliderBounds, setSliderBounds] = useState({ left: 0, width: 0 });
  const [activePreset, setActivePreset] = useState(null);

  // Determine which preset matches current selection
  const currentPreset = useMemo(() => {
    for (const preset of DATE_PRESETS) {
      const { start, end } = preset.getRange(weeks);
      if (start === rangeStart && end === rangeEnd) {
        return preset.id;
      }
    }
    return null;
  }, [weeks, rangeStart, rangeEnd]);

  // Calculate slider bounds on mount and resize
  useEffect(() => {
    const updateBounds = () => {
      if (sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        setSliderBounds({ left: rect.left, width: rect.width });
      }
    };
    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      const step = e.shiftKey ? 4 : 1; // Shift for larger jumps

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (e.altKey) {
            // Move start handle
            setRangeStart(Math.max(0, rangeStart - step));
          } else {
            // Move entire range left
            const newStart = Math.max(0, rangeStart - step);
            const rangeSize = rangeEnd - rangeStart;
            setRange(newStart, newStart + rangeSize);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (e.altKey) {
            // Move end handle
            setRangeEnd(Math.min(weeks.length - 1, rangeEnd + step));
          } else {
            // Move entire range right
            const rangeSize = rangeEnd - rangeStart;
            const newEnd = Math.min(weeks.length - 1, rangeEnd + step);
            setRange(newEnd - rangeSize, newEnd);
          }
          break;
        case 'Escape':
          e.preventDefault();
          if (isFilterActive) {
            resetRange();
          } else {
            onClose();
          }
          break;
        case '[':
          e.preventDefault();
          // Shrink range from start
          if (rangeStart < rangeEnd - 1) {
            setRangeStart(rangeStart + 1);
          }
          break;
        case ']':
          e.preventDefault();
          // Shrink range from end
          if (rangeEnd > rangeStart + 1) {
            setRangeEnd(rangeEnd - 1);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, rangeStart, rangeEnd, weeks.length, setRangeStart, setRangeEnd, setRange, resetRange, isFilterActive, onClose]);

  // Convert pixel position to week index
  const positionToWeekIndex = useCallback((clientX) => {
    const relativeX = clientX - sliderBounds.left;
    const percentage = Math.max(0, Math.min(1, relativeX / sliderBounds.width));
    return Math.round(percentage * (weeks.length - 1));
  }, [sliderBounds, weeks.length]);

  // Handle mouse/touch move during drag
  const handleDrag = useCallback((clientX) => {
    if (!isDragging) return;

    const weekIndex = positionToWeekIndex(clientX);
    const { dragHandle } = useTimelineFilterStore.getState();

    if (dragHandle === 'start') {
      setRangeStart(Math.min(weekIndex, rangeEnd - 1));
    } else if (dragHandle === 'end') {
      setRangeEnd(Math.max(weekIndex, rangeStart + 1));
    } else if (dragHandle === 'range') {
      // Move entire range
      const rangeSize = rangeEnd - rangeStart;
      const newStart = Math.max(0, Math.min(weekIndex - Math.floor(rangeSize / 2), weeks.length - 1 - rangeSize));
      setRange(newStart, newStart + rangeSize);
    }
  }, [isDragging, positionToWeekIndex, rangeStart, rangeEnd, setRangeStart, setRangeEnd, setRange, weeks.length]);

  // Global mouse/touch event handlers
  useEffect(() => {
    const handleMouseMove = (e) => handleDrag(e.clientX);
    const handleTouchMove = (e) => handleDrag(e.touches[0].clientX);
    const handleEnd = () => setDragging(false, null);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleDrag, setDragging]);

  // Handle preset selection
  const handlePresetClick = (preset) => {
    const { start, end } = preset.getRange(weeks);
    setRange(start, end);
    setActivePreset(preset.id);
  };

  // Find max registrations for bar scaling
  const maxRegistrations = Math.max(...weeks.map(w => w.registrations));

  // Calculate positions
  const startPercent = (rangeStart / (weeks.length - 1)) * 100;
  const endPercent = (rangeEnd / (weeks.length - 1)) * 100;

  // Get totals for display
  const totalRegs = getTotalRegistrations();
  const breakdown = getBreakdownTotals();

  // Get month labels for x-axis
  const monthLabels = [];
  let currentMonth = '';
  weeks.forEach((week, index) => {
    if (week.monthLabel !== currentMonth) {
      currentMonth = week.monthLabel;
      monthLabels.push({ label: currentMonth, index });
    }
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Panel - No backdrop so user can see cards updating */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: theme.colors.background.elevated,
              borderRadius: '24px 24px 0 0',
              boxShadow: '0 -12px 48px rgba(0, 0, 0, 0.15), 0 -4px 16px rgba(0, 0, 0, 0.08)',
              border: `1px solid ${theme.colors.border.default}`,
              borderBottom: 'none',
              zIndex: theme.zIndex.modal,
              maxHeight: '340px',
              overflow: 'hidden'
            }}
          >
            {/* Drag Handle */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '12px 0 8px',
                cursor: 'grab'
              }}
            >
              <div style={{
                width: '40px',
                height: '4px',
                background: theme.colors.border.medium,
                borderRadius: '2px'
              }} />
            </div>

            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 32px 12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar size={20} strokeWidth={1.5} style={{ color: theme.colors.primary[500] }} />
                <h2 style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.primary,
                  margin: 0
                }}>
                  Registrations by Week
                </h2>
                {isFilterActive && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.primary[500],
                      background: theme.colors.primary[50],
                      padding: '4px 10px',
                      borderRadius: theme.borderRadius.full
                    }}
                  >
                    Filtered
                  </motion.span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Stats Summary with Animated Number */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '8px 16px',
                  background: theme.colors.background.tertiary,
                  borderRadius: theme.borderRadius.lg
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} strokeWidth={1.5} style={{ color: theme.colors.text.tertiary }} />
                    <AnimatedNumber
                      value={totalRegs}
                      style={{
                        fontSize: theme.typography.fontSize.lg,
                        fontWeight: theme.typography.fontWeight.semibold,
                        color: theme.colors.text.primary
                      }}
                    />
                    <span style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.text.tertiary
                    }}>
                      registrations
                    </span>
                  </div>
                </div>

                {/* Reset Button */}
                {isFilterActive && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetRange}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      border: 'none',
                      background: 'transparent',
                      borderRadius: theme.borderRadius.md,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.secondary
                    }}
                  >
                    <RotateCcw size={14} strokeWidth={1.5} />
                    Reset
                  </motion.button>
                )}

                {/* Close Button */}
                <button
                  onClick={onClose}
                  style={{
                    width: '36px',
                    height: '36px',
                    border: 'none',
                    background: theme.colors.background.tertiary,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.colors.text.secondary,
                    transition: `all ${theme.transitions.fast}`
                  }}
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Quick Presets Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 32px 16px'
            }}>
              <Zap size={14} strokeWidth={1.5} style={{ color: theme.colors.text.tertiary }} />
              <span style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.tertiary,
                fontWeight: theme.typography.fontWeight.medium,
                marginRight: '4px'
              }}>
                Quick:
              </span>
              {DATE_PRESETS.map((preset) => {
                const isActive = currentPreset === preset.id;
                return (
                  <motion.button
                    key={preset.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePresetClick(preset)}
                    style={{
                      padding: '6px 12px',
                      border: 'none',
                      background: isActive ? theme.colors.primary[500] : theme.colors.background.tertiary,
                      color: isActive ? '#FFFFFF' : theme.colors.text.secondary,
                      borderRadius: theme.borderRadius.full,
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.medium,
                      cursor: 'pointer',
                      transition: `all ${theme.transitions.fast}`
                    }}
                  >
                    {preset.label}
                  </motion.button>
                );
              })}

              {/* Keyboard hint */}
              <span style={{
                marginLeft: 'auto',
                fontSize: '10px',
                color: theme.colors.text.quaternary,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <kbd style={{
                  padding: '2px 5px',
                  background: theme.colors.background.tertiary,
                  borderRadius: '3px',
                  fontSize: '10px'
                }}>←→</kbd>
                <span>navigate</span>
                <kbd style={{
                  padding: '2px 5px',
                  background: theme.colors.background.tertiary,
                  borderRadius: '3px',
                  fontSize: '10px'
                }}>esc</kbd>
                <span>reset</span>
              </span>
            </div>

            {/* Chart Area */}
            <div style={{ padding: '0 32px 24px' }}>
              {/* Bar Chart */}
              <div
                ref={sliderRef}
                style={{
                  position: 'relative',
                  height: '120px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '2px',
                  marginBottom: '8px'
                }}
              >
                {weeks.map((week, index) => {
                  const isInRange = index >= rangeStart && index <= rangeEnd;
                  const isHovered = hoveredWeek === index;
                  const barHeight = (week.registrations / maxRegistrations) * 100;

                  return (
                    <motion.div
                      key={week.id}
                      style={{
                        flex: 1,
                        height: `${barHeight}%`,
                        minHeight: '4px',
                        background: isInRange
                          ? theme.colors.primary[500]
                          : theme.colors.neutral[200],
                        borderRadius: '3px 3px 0 0',
                        cursor: 'pointer',
                        position: 'relative',
                        opacity: isInRange ? 1 : 0.4,
                        transition: `opacity ${theme.transitions.fast}`
                      }}
                      initial={false}
                      animate={{
                        scale: isHovered ? 1.1 : 1,
                        y: isHovered ? -2 : 0
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      onMouseEnter={() => setHoveredWeek(index)}
                      onMouseLeave={() => setHoveredWeek(null)}
                      onClick={() => {
                        // Click to set single week or expand range
                        if (index < rangeStart) {
                          setRangeStart(index);
                        } else if (index > rangeEnd) {
                          setRangeEnd(index);
                        }
                      }}
                    >
                      {/* Tooltip */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.9 }}
                            style={{
                              position: 'absolute',
                              bottom: '100%',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              marginBottom: '8px',
                              padding: '8px 12px',
                              background: theme.colors.neutral[900],
                              color: theme.colors.text.inverse,
                              borderRadius: theme.borderRadius.md,
                              fontSize: theme.typography.fontSize.xs,
                              whiteSpace: 'nowrap',
                              zIndex: 10,
                              boxShadow: theme.shadows.lg
                            }}
                          >
                            <div style={{ fontWeight: theme.typography.fontWeight.semibold, marginBottom: '2px' }}>
                              {week.fullLabel}
                            </div>
                            <div style={{ opacity: 0.8 }}>
                              {week.registrations} registrations
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                {/* Range Slider Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none'
                }}>
                  {/* Selected Range Highlight */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: `${startPercent}%`,
                      width: `${endPercent - startPercent}%`,
                      background: `${theme.colors.primary[500]}08`,
                      borderLeft: `2px solid ${theme.colors.primary[500]}`,
                      borderRight: `2px solid ${theme.colors.primary[500]}`,
                      pointerEvents: 'auto',
                      cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setDragging(true, 'range');
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      setDragging(true, 'range');
                    }}
                  />

                  {/* Start Handle */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: `${startPercent}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '24px',
                      height: '32px',
                      background: theme.colors.background.elevated,
                      border: `2px solid ${theme.colors.primary[500]}`,
                      borderRadius: theme.borderRadius.md,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isDragging ? 'grabbing' : 'ew-resize',
                      pointerEvents: 'auto',
                      boxShadow: theme.shadows.md,
                      zIndex: 5
                    }}
                    whileHover={{ scale: 1.1, boxShadow: theme.shadows.lg }}
                    whileTap={{ scale: 0.95 }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragging(true, 'start');
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragging(true, 'start');
                    }}
                  >
                    <GripHorizontal size={12} strokeWidth={2} style={{ color: theme.colors.primary[500] }} />
                  </motion.div>

                  {/* End Handle */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: `${endPercent}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '24px',
                      height: '32px',
                      background: theme.colors.background.elevated,
                      border: `2px solid ${theme.colors.primary[500]}`,
                      borderRadius: theme.borderRadius.md,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isDragging ? 'grabbing' : 'ew-resize',
                      pointerEvents: 'auto',
                      boxShadow: theme.shadows.md,
                      zIndex: 5
                    }}
                    whileHover={{ scale: 1.1, boxShadow: theme.shadows.lg }}
                    whileTap={{ scale: 0.95 }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragging(true, 'end');
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragging(true, 'end');
                    }}
                  >
                    <GripHorizontal size={12} strokeWidth={2} style={{ color: theme.colors.primary[500] }} />
                  </motion.div>
                </div>
              </div>

              {/* Month Labels */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: `1px solid ${theme.colors.border.subtle}`
              }}>
                {monthLabels.map(({ label, index }) => (
                  <span
                    key={`${label}-${index}`}
                    style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.text.tertiary,
                      fontWeight: theme.typography.fontWeight.medium
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Selected Range Info */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '16px',
                padding: '12px 16px',
                background: theme.colors.background.tertiary,
                borderRadius: theme.borderRadius.lg
              }}>
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary
                }}>
                  <span style={{ fontWeight: theme.typography.fontWeight.medium }}>Selected: </span>
                  {weeks[rangeStart]?.fullLabel} — {weeks[rangeEnd]?.fullLabel}
                </div>

                {/* Breakdown Pills */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[
                    { label: 'Full', value: breakdown.full, color: theme.colors.primary[500] },
                    { label: 'Early', value: breakdown.early, color: theme.colors.success[500] },
                    { label: 'Student', value: breakdown.student, color: theme.colors.warning[500] },
                    { label: 'VIP', value: breakdown.vip, color: '#7C5CFA' }
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.text.secondary
                      }}
                    >
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '2px',
                        background: item.color
                      }} />
                      <span>{item.label}</span>
                      <span style={{ fontWeight: theme.typography.fontWeight.semibold }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

TimelinePanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};
