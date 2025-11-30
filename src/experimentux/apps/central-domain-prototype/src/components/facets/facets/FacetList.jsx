/**
 * FacetList Component
 *
 * Displays top values grouped by key dimensions with horizontal bar indicators.
 * Features:
 * - Horizontal progress bars showing relative counts
 * - Clickable counts to view records in slide-out
 * - Multi-select filtering when bars are selected
 * - Responds to timeline filter for date-based slicing
 */

import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarOff, Search } from 'lucide-react';
import { theme } from '../../../config/theme';
import { useListFilterStore } from '../../../store/listFilterStore';
import { useTimelineFilterStore } from '../../../store/timelineFilterStore';
import { AnimatedNumber } from '../../common/AnimatedNumber';

// Helper to parse date range strings like "Apr 7-13" or "May 26-Jun 1"
const MONTH_MAP = {
  'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
  'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
};

function parseDateRange(dateRange, year = 2025) {
  if (!dateRange) return null;

  // Try to extract month and day from the start of the range
  // Formats: "Apr 7-13", "May 26-Jun 1", "Jun 12"
  const match = dateRange.match(/([A-Za-z]+)\s+(\d+)/);
  if (match) {
    const month = MONTH_MAP[match[1]];
    const day = parseInt(match[2], 10);
    if (month !== undefined && !isNaN(day)) {
      return new Date(year, month, day);
    }
  }
  return null;
}

export function FacetList({ data, cardId = 'default' }) {
  const { list, timeline } = data;
  const [hoveredItem, setHoveredItem] = useState(null);

  const {
    selectedFilters,
    toggleFilter,
    clearCardFilters,
    openSlideOut,
    clearFilter,
    getCrossCardRatio
  } = useListFilterStore();

  // Subscribe to timeline filter store
  const {
    isFilterActive: isTimelineFilterActive,
    rangeStart,
    rangeEnd,
    weeks: timelineWeeks,
    resetRange
  } = useTimelineFilterStore();

  // Get filters for this card
  const cardFilters = selectedFilters.filter(f => f.cardId === cardId);
  const isCardFiltered = cardFilters.length > 0;
  const selectedItemNames = cardFilters.map(f => f.itemName);

  // Check if OTHER cards have filters (cross-card filtering)
  const otherCardFilters = selectedFilters.filter(f => f.cardId !== cardId);
  const hasCrossCardFilter = otherCardFilters.length > 0;

  // Calculate timeline filter ratio based on date range selection
  // Maps the global timeline filter to this card's data
  const timelineFilterRatio = useMemo(() => {
    if (!isTimelineFilterActive || !timeline || timeline.length === 0) {
      return 1;
    }

    // Get the selected date range from the timeline filter
    const selectedStartDate = new Date(timelineWeeks[rangeStart]?.startDate);
    const selectedEndDate = new Date(timelineWeeks[rangeEnd]?.endDate);

    // Parse collection timeline dates and calculate overlap
    let totalCount = 0;
    let filteredCount = 0;

    timeline.forEach(week => {
      totalCount += week.count;

      // Parse the dateRange string (e.g., "Apr 7-13" or "May 26-Jun 1")
      const dateRange = week.dateRange;
      if (dateRange) {
        // Extract approximate date for comparison (use start of range)
        const weekDate = parseDateRange(dateRange, 2025);
        if (weekDate && weekDate >= selectedStartDate && weekDate <= selectedEndDate) {
          filteredCount += week.count;
        }
      }
    });

    // If no overlap detected, use a proportional fallback based on week selection
    if (filteredCount === 0 && totalCount > 0) {
      const selectedWeeksCount = rangeEnd - rangeStart + 1;
      const totalWeeksCount = timelineWeeks.length;
      return selectedWeeksCount / totalWeeksCount;
    }

    return totalCount > 0 ? filteredCount / totalCount : 1;
  }, [isTimelineFilterActive, timeline, rangeStart, rangeEnd, timelineWeeks]);

  // Calculate cross-filter ratio based on selected items in other cards
  // Uses the stored ratio from the selected items to proportionally filter other cards
  const crossFilterRatio = hasCrossCardFilter && !isCardFiltered
    ? getCrossCardRatio(cardId)
    : 1;

  // Combined filter ratio (timeline filter takes precedence, then cross-card)
  const effectiveFilterRatio = isTimelineFilterActive
    ? timelineFilterRatio
    : hasCrossCardFilter && !isCardFiltered
      ? crossFilterRatio
      : 1;

  // Check if any filter is active
  const hasAnyFilter = isTimelineFilterActive || hasCrossCardFilter;

  if (!list || list.length === 0) {
    return (
      <div style={{
        height: '140px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.text.tertiary,
        fontSize: theme.typography.fontSize.sm
      }}>
        No list data available
      </div>
    );
  }

  // Find max count for scaling bars
  const maxCount = Math.max(...list.map(item => item.count));

  const handleBarClick = (e, item) => {
    e.stopPropagation(); // Prevent modal from opening
    // Pass the item's percentage as a ratio (0-1) for cross-card filtering
    toggleFilter(cardId, item.name, item.color, item.pct / 100);
  };

  const handleCountClick = (e, item) => {
    e.stopPropagation();
    // Generate mock records for the slide-out
    const mockRecords = generateMockRecords(item.name, item.count);
    openSlideOut({
      itemName: item.name,
      itemColor: item.color,
      count: item.count,
      records: mockRecords
    });
  };

  const handleClearFilters = (e) => {
    e.stopPropagation();
    clearCardFilters(cardId);
  };

  return (
    <div>
      {/* Section Title with inline clear option */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.medium,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: theme.colors.text.tertiary
          }}>
            By Type
          </span>

          {/* Filter indicator - shows when timeline or cross-card filter is active */}
          <AnimatePresence>
            {(isTimelineFilterActive || (hasCrossCardFilter && !isCardFiltered)) && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  fontSize: '10px',
                  color: theme.colors.primary[500],
                  background: theme.colors.primary[50],
                  padding: '2px 6px',
                  borderRadius: theme.borderRadius.sm,
                  fontWeight: theme.typography.fontWeight.medium
                }}
              >
                {isTimelineFilterActive ? 'Date Filtered' : 'Filtered'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Clear filter - inline */}
        <AnimatePresence>
          {(isCardFiltered || isTimelineFilterActive || hasCrossCardFilter) && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (isCardFiltered) {
                  handleClearFilters({ stopPropagation: () => {} });
                }
                if (isTimelineFilterActive) {
                  resetRange();
                }
                if (hasCrossCardFilter) {
                  clearFilter();
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                padding: '2px 6px',
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.tertiary,
                borderRadius: theme.borderRadius.sm
              }}
            >
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '14px',
                height: '14px',
                borderRadius: theme.borderRadius.full,
                background: theme.colors.neutral[100],
                fontSize: '9px'
              }}>
                ✕
              </span>
              {isCardFiltered ? 'Clear' : isTimelineFilterActive ? 'Reset Date' : 'Clear All'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* List Items with Bar Indicators */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <AnimatePresence>
          {list.slice(0, 5).map((item, index) => {
            const isSelected = selectedItemNames.includes(item.name);
            const isDimmed = isCardFiltered && !isSelected;
            const isHovered = hoveredItem === index;

            // Apply filter ratio when timeline or cross-card filters are active
            const isFiltered = (isTimelineFilterActive || hasCrossCardFilter) && !isCardFiltered;
            const displayCount = isFiltered
              ? Math.round(item.count * effectiveFilterRatio)
              : item.count;
            const barWidth = (displayCount / maxCount) * 100;

            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: isDimmed ? 0.25 : 1,
                  y: 0,
                  scale: isDimmed ? 0.98 : 1
                }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                  delay: index * 0.03
                }}
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  borderRadius: theme.borderRadius.md,
                  overflow: 'hidden'
                }}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={(e) => handleBarClick(e, item)}
              >
                {/* Background bar indicator */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: 1,
                    opacity: isSelected ? 0.2 : isHovered ? 0.12 : 0.08
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                    delay: index * 0.05
                  }}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${barWidth}%`,
                    background: item.color || theme.colors.primary[500],
                    transformOrigin: 'left',
                    borderRadius: theme.borderRadius.md
                  }}
                />

                {/* Content row */}
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    fontSize: theme.typography.fontSize.sm,
                    zIndex: 1
                  }}
                >
                  {/* Left: Color dot and name */}
                  <motion.span
                    animate={{
                      x: isSelected ? 4 : 0,
                      fontWeight: isSelected ? 500 : 400
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: isSelected ? theme.colors.text.primary : theme.colors.text.secondary
                    }}
                  >
                    <motion.span
                      animate={{
                        scale: isSelected ? 1.5 : isHovered ? 1.2 : 1
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25
                      }}
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '2px',
                        background: item.color || theme.colors.neutral[400],
                        flexShrink: 0
                      }}
                    />
                    <span>{item.name}</span>
                  </motion.span>

                  {/* Right: Count and percentage */}
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {/* Clickable count badge with animated number */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleCountClick(e, item)}
                      style={{
                        background: isHovered || isSelected
                          ? theme.colors.neutral[100]
                          : isFiltered
                            ? theme.colors.primary[50]
                            : 'transparent',
                        border: 'none',
                        borderRadius: theme.borderRadius.sm,
                        padding: '2px 8px',
                        cursor: 'pointer',
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: isSelected
                          ? theme.colors.primary[600]
                          : isFiltered
                            ? theme.colors.primary[500]
                            : theme.colors.text.secondary,
                        transition: `all ${theme.transitions.fast}`,
                        fontFamily: theme.typography.fontFamily.mono
                      }}
                    >
                      <AnimatedNumber value={displayCount} />
                    </motion.button>

                    {/* Percentage with animation */}
                    <motion.span
                      animate={{
                        opacity: isDimmed ? 0.3 : 0.6
                      }}
                      style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.text.tertiary,
                        fontFamily: theme.typography.fontFamily.mono,
                        minWidth: '36px',
                        textAlign: 'right'
                      }}
                    >
                      <AnimatedNumber
                        value={isFiltered ? Math.round(item.pct * effectiveFilterRatio) : item.pct}
                        format="percentage"
                      />
                    </motion.span>
                  </span>
                </div>

                {/* Selection indicator bar on left edge */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      exit={{ scaleY: 0, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30
                      }}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '20%',
                        bottom: '20%',
                        width: '3px',
                        background: item.color || theme.colors.primary[500],
                        borderRadius: '0 2px 2px 0'
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Low results hint - appears when filtering results in very few items */}
      <AnimatePresence>
        {isTimelineFilterActive && effectiveFilterRatio < 0.15 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              marginTop: '12px',
              padding: '12px 14px',
              background: `${theme.colors.primary[500]}08`,
              borderRadius: theme.borderRadius.md,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <CalendarOff size={16} strokeWidth={1.5} style={{ color: theme.colors.primary[400], flexShrink: 0 }} />
            <span style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.secondary,
              lineHeight: 1.4
            }}>
              Few records in this period.{' '}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetRange}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: theme.colors.primary[500],
                  fontWeight: theme.typography.fontWeight.medium,
                  cursor: 'pointer',
                  fontSize: 'inherit',
                  textDecoration: 'underline',
                  textDecorationStyle: 'dotted',
                  textUnderlineOffset: '2px'
                }}
              >
                Expand date range
              </motion.button>
              {' '}to see more.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Generate mock records for the slide-out view
function generateMockRecords(typeName, count) {
  const firstNames = ['Sarah', 'James', 'Emily', 'Michael', 'Jessica', 'David', 'Amanda', 'Christopher', 'Ashley', 'Matthew', 'Jennifer', 'Daniel', 'Elizabeth', 'Andrew', 'Nicole'];
  const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin'];
  const companies = ['Acme Corp', 'TechStart Inc', 'Global Systems', 'DataFlow', 'CloudNet', 'InnovateTech', 'FutureWorks', 'NextGen Labs', 'Pioneer Digital', 'Quantum Solutions'];

  const records = [];
  const recordCount = Math.min(count, 50); // Cap at 50 for performance

  for (let i = 0; i < recordCount; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const regDate = new Date(2025, Math.floor(Math.random() * 9), Math.floor(Math.random() * 28) + 1);

    records.push({
      id: `REG-${String(1000 + i).padStart(4, '0')}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s/g, '')}.com`,
      company,
      type: typeName,
      registeredAt: regDate.toISOString(),
      status: Math.random() > 0.1 ? 'confirmed' : 'pending'
    });
  }

  return records;
}

FacetList.propTypes = {
  data: PropTypes.shape({
    list: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      count: PropTypes.number,
      pct: PropTypes.number,
      color: PropTypes.string
    }))
  }).isRequired,
  cardId: PropTypes.string
};
