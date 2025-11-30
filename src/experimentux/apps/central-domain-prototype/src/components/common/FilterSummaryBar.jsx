/**
 * FilterSummaryBar Component
 *
 * A persistent, floating bar that shows active filter state.
 * Apple-inspired with subtle blur and smooth animations.
 */

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, X, Filter } from 'lucide-react';
import { theme } from '../../config/theme';
import { useTimelineFilterStore } from '../../store/timelineFilterStore';
import { useListFilterStore } from '../../store/listFilterStore';

export function FilterSummaryBar() {
  const {
    isFilterActive: isTimelineFilterActive,
    rangeStart,
    rangeEnd,
    weeks,
    resetRange
  } = useTimelineFilterStore();

  const {
    selectedFilters,
    clearFilter
  } = useListFilterStore();

  const hasListFilters = selectedFilters.length > 0;
  const hasAnyFilter = isTimelineFilterActive || hasListFilters;

  // Format date range for display
  const dateRangeLabel = useMemo(() => {
    if (!isTimelineFilterActive || !weeks.length) return '';

    const startWeek = weeks[rangeStart];
    const endWeek = weeks[rangeEnd];

    if (!startWeek || !endWeek) return '';

    const startDate = new Date(startWeek.startDate);
    const endDate = new Date(endWeek.endDate);

    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }, [isTimelineFilterActive, weeks, rangeStart, rangeEnd]);

  // Get unique card names from list filters
  const filterSummary = useMemo(() => {
    if (!hasListFilters) return '';

    const cardIds = [...new Set(selectedFilters.map(f => f.cardId))];
    const itemCount = selectedFilters.length;

    if (cardIds.length === 1 && itemCount === 1) {
      return selectedFilters[0].itemName;
    }

    return `${itemCount} filter${itemCount > 1 ? 's' : ''}`;
  }, [selectedFilters, hasListFilters]);

  const handleClearAll = () => {
    if (isTimelineFilterActive) resetRange();
    if (hasListFilters) clearFilter();
  };

  return (
    <AnimatePresence>
      {hasAnyFilter && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30
          }}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: theme.zIndex.tooltip,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: theme.borderRadius.full,
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.06)'
          }}
        >
          {/* Timeline filter chip */}
          <AnimatePresence mode="popLayout">
            {isTimelineFilterActive && (
              <motion.div
                key="timeline-chip"
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                layout
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: theme.colors.primary[50],
                  borderRadius: theme.borderRadius.full,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.primary[600]
                }}
              >
                <Calendar size={14} strokeWidth={2} />
                <span>{dateRangeLabel}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    resetRange();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: 'none',
                    background: theme.colors.primary[100],
                    cursor: 'pointer',
                    color: theme.colors.primary[600],
                    marginLeft: '2px'
                  }}
                >
                  <X size={12} strokeWidth={2.5} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* List filter chip */}
          <AnimatePresence mode="popLayout">
            {hasListFilters && (
              <motion.div
                key="list-chip"
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                layout
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: theme.colors.neutral[100],
                  borderRadius: theme.borderRadius.full,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.text.primary
                }}
              >
                <Filter size={14} strokeWidth={2} />
                <span>{filterSummary}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFilter();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: 'none',
                    background: theme.colors.neutral[200],
                    cursor: 'pointer',
                    color: theme.colors.text.secondary,
                    marginLeft: '2px'
                  }}
                >
                  <X size={12} strokeWidth={2.5} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Clear all button - shows when multiple filters active */}
          <AnimatePresence>
            {isTimelineFilterActive && hasListFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearAll}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: theme.borderRadius.full,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.text.tertiary,
                  cursor: 'pointer'
                }}
              >
                Clear All
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
