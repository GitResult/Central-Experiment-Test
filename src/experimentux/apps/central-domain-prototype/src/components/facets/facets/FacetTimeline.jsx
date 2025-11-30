/**
 * FacetTimeline Component
 *
 * Displays chronological activity grouped by week.
 * Allows selecting week ranges to filter data across cards.
 * Responds to timeline filter for date-based slicing.
 */

import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../../config/theme';
import { useListFilterStore } from '../../../store/listFilterStore';
import { useTimelineFilterStore } from '../../../store/timelineFilterStore';

const TIMELINE_COLOR = '#7C5CFA';

// Helper to parse date range strings like "Apr 7-13" or "May 26-Jun 1"
const MONTH_MAP = {
  'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
  'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
};

function parseDateRange(dateRange, year = 2025) {
  if (!dateRange) return null;
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

export function FacetTimeline({ data, cardId = 'default' }) {
  const { timeline, list } = data;
  const [hoveredWeek, setHoveredWeek] = useState(null);

  const {
    selectedFilters,
    toggleFilter,
    clearCardFilters,
    clearFilter
  } = useListFilterStore();

  // Subscribe to timeline filter store
  const {
    isFilterActive: isTimelineFilterActive,
    rangeStart,
    rangeEnd,
    weeks: timelineWeeks,
    resetRange
  } = useTimelineFilterStore();

  // Get timeline filters for this card
  const cardFilters = selectedFilters.filter(f => f.cardId === cardId);
  const isCardFiltered = cardFilters.length > 0;
  const selectedWeeks = cardFilters.map(f => f.itemName);

  // Check if OTHER cards have filters (cross-card filtering)
  const otherCardFilters = selectedFilters.filter(f => f.cardId !== cardId);
  const hasCrossCardFilter = otherCardFilters.length > 0;

  // Calculate which weeks are within the global timeline filter range
  const weeksInFilterRange = useMemo(() => {
    if (!isTimelineFilterActive || !timeline || timeline.length === 0) {
      return new Set(timeline?.map(w => w.label) || []);
    }

    const selectedStartDate = new Date(timelineWeeks[rangeStart]?.startDate);
    const selectedEndDate = new Date(timelineWeeks[rangeEnd]?.endDate);

    const inRangeWeeks = new Set();
    timeline.forEach(week => {
      const weekDate = parseDateRange(week.dateRange, 2025);
      if (weekDate && weekDate >= selectedStartDate && weekDate <= selectedEndDate) {
        inRangeWeeks.add(week.label);
      }
    });

    return inRangeWeeks;
  }, [isTimelineFilterActive, timeline, rangeStart, rangeEnd, timelineWeeks]);

  // Calculate cross-filter ratio based on selected list items
  let crossFilterRatio = 1;
  if (hasCrossCardFilter && !isCardFiltered && list && list.length > 0) {
    const selectedItemNames = otherCardFilters.map(f => f.itemName);
    const totalListCount = list.reduce((sum, item) => sum + item.count, 0);
    const selectedItemsCount = list
      .filter(item => selectedItemNames.includes(item.name))
      .reduce((sum, item) => sum + item.count, 0);
    crossFilterRatio = totalListCount > 0 ? selectedItemsCount / totalListCount : 0.5;
  }

  // Check if any filter is active
  const hasAnyFilter = isTimelineFilterActive || hasCrossCardFilter;

  if (!timeline || timeline.length === 0) {
    return (
      <div style={{
        height: '140px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.text.tertiary,
        fontSize: theme.typography.fontSize.sm
      }}>
        No timeline data available
      </div>
    );
  }

  // Find max count for scaling bars
  const maxCount = Math.max(...timeline.map(item => item.count));

  const handleWeekClick = (e, week) => {
    e.stopPropagation();
    toggleFilter(cardId, week.label, TIMELINE_COLOR);
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
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.medium,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: theme.colors.text.tertiary
          }}>
            By Week
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
                  color: TIMELINE_COLOR,
                  background: `${TIMELINE_COLOR}15`,
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

        {/* Clear filter */}
        <AnimatePresence>
          {(isCardFiltered || isTimelineFilterActive || hasCrossCardFilter) && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
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

      {/* Week Items with Bar Chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {timeline.slice(0, 6).map((week, index) => {
          const isSelected = selectedWeeks.includes(week.label);
          const isInTimelineRange = weeksInFilterRange.has(week.label);
          const isOutOfRange = isTimelineFilterActive && !isInTimelineRange;
          const isDimmed = (isCardFiltered && !isSelected) || isOutOfRange;
          const isHovered = hoveredWeek === index;

          // Apply cross-filter ratio from actual list selection data
          const displayCount = hasCrossCardFilter && !isCardFiltered
            ? Math.round(week.count * crossFilterRatio)
            : week.count;
          const barWidth = (displayCount / maxCount) * 100;

          return (
            <motion.div
              key={week.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: isDimmed ? 0.3 : 1,
                x: 0,
                scale: isDimmed ? 0.98 : 1
              }}
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
              onMouseEnter={() => setHoveredWeek(index)}
              onMouseLeave={() => setHoveredWeek(null)}
              onClick={(e) => handleWeekClick(e, week)}
            >
              {/* Background bar */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: 1,
                  opacity: isSelected ? 0.25 : isHovered ? 0.15 : 0.1
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
                  background: TIMELINE_COLOR,
                  transformOrigin: 'left',
                  borderRadius: theme.borderRadius.md
                }}
              />

              {/* Content row */}
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                fontSize: theme.typography.fontSize.sm,
                zIndex: 1
              }}>
                {/* Left: Week label */}
                <motion.span
                  animate={{
                    x: isSelected ? 4 : 0,
                    fontWeight: isSelected ? 500 : 400
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: isSelected ? theme.colors.text.primary : theme.colors.text.secondary,
                    fontSize: theme.typography.fontSize.xs
                  }}
                >
                  <motion.span
                    animate={{
                      scale: isSelected ? 1.4 : isHovered ? 1.2 : 1
                    }}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: TIMELINE_COLOR,
                      flexShrink: 0
                    }}
                  />
                  <span>{week.label}</span>
                  <span style={{
                    color: theme.colors.text.tertiary,
                    fontSize: '10px'
                  }}>
                    {week.dateRange}
                  </span>
                </motion.span>

                {/* Right: Count */}
                <motion.span
                  style={{
                    background: isHovered || isSelected
                      ? `${TIMELINE_COLOR}15`
                      : (hasAnyFilter && !isCardFiltered && !isOutOfRange)
                        ? `${TIMELINE_COLOR}10`
                        : 'transparent',
                    borderRadius: theme.borderRadius.sm,
                    padding: '2px 8px',
                    fontSize: theme.typography.fontSize.xs,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: isSelected
                      ? TIMELINE_COLOR
                      : (hasAnyFilter && !isCardFiltered && !isOutOfRange)
                        ? TIMELINE_COLOR
                        : theme.colors.text.secondary,
                    fontFamily: theme.typography.fontFamily.mono
                  }}
                >
                  {displayCount}
                </motion.span>
              </div>

              {/* Selection indicator */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    exit={{ scaleY: 0, opacity: 0 }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '20%',
                      bottom: '20%',
                      width: '3px',
                      background: TIMELINE_COLOR,
                      borderRadius: '0 2px 2px 0'
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

FacetTimeline.propTypes = {
  data: PropTypes.shape({
    timeline: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      dateRange: PropTypes.string,
      count: PropTypes.number
    })),
    list: PropTypes.array
  }).isRequired,
  cardId: PropTypes.string
};
