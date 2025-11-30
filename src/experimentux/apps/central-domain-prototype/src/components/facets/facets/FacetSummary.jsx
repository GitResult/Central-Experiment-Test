/**
 * FacetSummary Component
 *
 * Displays overview with key metrics and status distribution.
 * Responds to timeline filter for date-based slicing.
 */

import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../../config/theme';
import { useTimelineFilterStore } from '../../../store/timelineFilterStore';

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

// Helper to parse numeric values from strings like "$425K" or "78%"
function parseStatValue(value) {
  if (!value) return null;
  // Remove currency symbols, commas, and parse
  const cleaned = value.replace(/[$,]/g, '');
  // Check for K suffix
  if (cleaned.endsWith('K')) {
    return parseFloat(cleaned.slice(0, -1)) * 1000;
  }
  // Check for % suffix
  if (cleaned.endsWith('%')) {
    return { type: 'percentage', value: parseFloat(cleaned.slice(0, -1)) };
  }
  // Try to parse as number
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

// Helper to format value back to display format
function formatStatValue(original, filtered) {
  if (!original || filtered === null) return original;

  // If it's a currency value
  if (original.startsWith('$')) {
    if (filtered >= 1000) {
      return `$${Math.round(filtered / 1000)}K`;
    }
    return `$${Math.round(filtered)}`;
  }

  // If it's a percentage, don't filter (percentages stay the same)
  if (original.endsWith('%')) {
    return original;
  }

  // Plain number
  return String(Math.round(filtered));
}

export function FacetSummary({ data }) {
  const { summary, timeline } = data;

  // Subscribe to timeline filter store
  const {
    isFilterActive: isTimelineFilterActive,
    rangeStart,
    rangeEnd,
    weeks: timelineWeeks,
    resetRange
  } = useTimelineFilterStore();

  // Calculate timeline filter ratio
  const timelineFilterRatio = useMemo(() => {
    if (!isTimelineFilterActive || !timeline || timeline.length === 0) {
      return 1;
    }

    const selectedStartDate = new Date(timelineWeeks[rangeStart]?.startDate);
    const selectedEndDate = new Date(timelineWeeks[rangeEnd]?.endDate);

    let totalCount = 0;
    let filteredCount = 0;

    timeline.forEach(week => {
      totalCount += week.count;
      const dateRange = week.dateRange;
      if (dateRange) {
        const weekDate = parseDateRange(dateRange, 2025);
        if (weekDate && weekDate >= selectedStartDate && weekDate <= selectedEndDate) {
          filteredCount += week.count;
        }
      }
    });

    if (filteredCount === 0 && totalCount > 0) {
      const selectedWeeksCount = rangeEnd - rangeStart + 1;
      const totalWeeksCount = timelineWeeks.length;
      return selectedWeeksCount / totalWeeksCount;
    }

    return totalCount > 0 ? filteredCount / totalCount : 1;
  }, [isTimelineFilterActive, timeline, rangeStart, rangeEnd, timelineWeeks]);

  // Calculate filtered stats
  const filteredStats = useMemo(() => {
    if (!summary?.stats || !isTimelineFilterActive) {
      return summary?.stats || [];
    }

    return summary.stats.map(stat => {
      const parsed = parseStatValue(stat.value);

      // Skip percentage values
      if (parsed && typeof parsed === 'object' && parsed.type === 'percentage') {
        return stat;
      }

      if (typeof parsed === 'number') {
        const filtered = parsed * timelineFilterRatio;
        return {
          ...stat,
          value: formatStatValue(stat.value, filtered)
        };
      }

      return stat;
    });
  }, [summary?.stats, isTimelineFilterActive, timelineFilterRatio]);

  if (!summary) {
    return (
      <div style={{
        height: '140px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.text.tertiary,
        fontSize: theme.typography.fontSize.sm
      }}>
        No summary data available
      </div>
    );
  }

  return (
    <div>
      {/* Filter indicator */}
      <AnimatePresence>
        {isTimelineFilterActive && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                fontSize: '10px',
                color: theme.colors.primary[500],
                background: theme.colors.primary[50],
                padding: '2px 6px',
                borderRadius: theme.borderRadius.sm,
                fontWeight: theme.typography.fontWeight.medium
              }}
            >
              Date Filtered
            </motion.span>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetRange}
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
              Reset
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Row */}
      <div style={{
        display: 'flex',
        gap: '32px',
        marginBottom: '20px'
      }}>
        {filteredStats.map((stat, index) => (
          <motion.div
            key={index}
            animate={{
              opacity: isTimelineFilterActive ? 1 : 1
            }}
          >
            <motion.div
              animate={{
                color: isTimelineFilterActive ? theme.colors.primary[600] : theme.colors.text.primary
              }}
              style={{
                fontSize: theme.typography.fontSize['2xl'],
                fontWeight: theme.typography.fontWeight.semibold,
                letterSpacing: theme.typography.letterSpacing.tight,
                lineHeight: 1.1
              }}
            >
              {stat.value}
            </motion.div>
            <div style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              marginTop: '4px'
            }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      {summary.segments && (
        <>
          <div style={{
            height: '8px',
            background: theme.colors.background.tertiary,
            borderRadius: theme.borderRadius.full,
            overflow: 'hidden',
            display: 'flex'
          }}>
            {summary.segments.map((segment, index) => (
              <motion.div
                key={index}
                animate={{
                  width: `${segment.pct}%`,
                  opacity: isTimelineFilterActive ? 0.7 : 1
                }}
                style={{
                  height: '100%',
                  background: segment.color,
                  transition: `width ${theme.transitions.slow}`
                }}
              />
            ))}
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px 20px',
            marginTop: '12px'
          }}>
            {summary.segments.map((segment, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.secondary,
                  cursor: 'pointer'
                }}
              >
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  background: segment.color
                }} />
                <span>{segment.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

FacetSummary.propTypes = {
  data: PropTypes.shape({
    summary: PropTypes.shape({
      stats: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string
      })),
      segments: PropTypes.arrayOf(PropTypes.shape({
        pct: PropTypes.number,
        color: PropTypes.string,
        label: PropTypes.string
      }))
    }),
    timeline: PropTypes.array
  }).isRequired
};
