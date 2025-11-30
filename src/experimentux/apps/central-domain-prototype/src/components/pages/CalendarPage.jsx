/**
 * CalendarPage Component
 *
 * Displays a calendar view with events.
 * Features month/week/day/year toggle and event details slide-out.
 * Multi-day events display as continuous spanning bars.
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  MapPin, Users, DollarSign, ArrowRight
} from 'lucide-react';
import { theme } from '../../config/theme';

// Event data
const EVENTS = [
  {
    id: 'cpa-convention-2025',
    title: '2025 CPA Annual National Convention',
    startDate: new Date(2025, 5, 12), // June 12, 2025
    endDate: new Date(2025, 5, 14), // June 14, 2025
    venue: "St. John's Convention Centre",
    city: "St. John's, NL",
    participants: 847,
    revenue: 425000,
    color: theme.colors.primary[500],
    status: 'upcoming'
  }
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const VIEW_OPTIONS = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' }
];

export function CalendarPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // June 2025
  const [viewMode, setViewMode] = useState('month');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [slideOutOpen, setSlideOutOpen] = useState(false);

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        isPrevMonth: true
      });
    }

    // Current month
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i)
      });
    }

    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        isNextMonth: true
      });
    }

    return days;
  }, [currentDate]);

  // Get event position info for a specific date
  const getEventInfoForDate = (date) => {
    if (!date) return [];

    return EVENTS.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      // Normalize dates to midnight for comparison
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const startOnly = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
      const endOnly = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());
      return dateOnly >= startOnly && dateOnly <= endOnly;
    }).map(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const startOnly = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
      const endOnly = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());

      const isStart = dateOnly.getTime() === startOnly.getTime();
      const isEnd = dateOnly.getTime() === endOnly.getTime();
      const isMiddle = !isStart && !isEnd;
      const dayOfWeek = date.getDay();
      const isWeekStart = dayOfWeek === 0; // Sunday
      const isWeekEnd = dayOfWeek === 6; // Saturday

      return {
        ...event,
        isStart,
        isEnd,
        isMiddle,
        isWeekStart,
        isWeekEnd,
        // Show label only on start day or when it's the start of a new week
        showLabel: isStart || (isWeekStart && !isStart)
      };
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setSlideOutOpen(true);
  };

  const handleViewProfile = () => {
    if (selectedEvent) {
      navigate(`/events/${selectedEvent.id}/profile`);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const month = MONTHS[startDate.getMonth()];
    return `${month} ${startDate.getDate()} - ${endDate.getDate()}, ${startDate.getFullYear()}`;
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 48px'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <CalendarIcon size={28} strokeWidth={1.5} style={{ opacity: 0.5 }} />
          <h1 style={{
            fontSize: theme.typography.fontSize['3xl'],
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            letterSpacing: theme.typography.letterSpacing.tight,
            margin: 0
          }}>
            Calendar
          </h1>
        </div>

        {/* View Toggle */}
        <div style={{
          display: 'flex',
          background: theme.colors.background.tertiary,
          borderRadius: theme.borderRadius.lg,
          padding: '4px'
        }}>
          {VIEW_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => setViewMode(option.id)}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: viewMode === option.id ? theme.colors.background.elevated : 'transparent',
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: viewMode === option.id ? theme.colors.text.primary : theme.colors.text.tertiary,
                boxShadow: viewMode === option.id ? theme.shadows.sm : 'none',
                transition: `all ${theme.transitions.fast}`
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      {/* Month Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: `1px solid ${theme.colors.border.subtle}`
      }}>
        <button
          onClick={handlePrevMonth}
          style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${theme.colors.border.default}`,
            background: theme.colors.background.elevated,
            borderRadius: theme.borderRadius.md,
            cursor: 'pointer',
            color: theme.colors.text.secondary
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <h2 style={{
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.text.primary,
          margin: 0
        }}>
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>

        <button
          onClick={handleNextMonth}
          style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${theme.colors.border.default}`,
            background: theme.colors.background.elevated,
            borderRadius: theme.borderRadius.md,
            cursor: 'pointer',
            color: theme.colors.text.secondary
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div style={{
        background: theme.colors.background.elevated,
        borderRadius: theme.borderRadius.xl,
        border: `1px solid ${theme.colors.border.default}`,
        overflow: 'hidden'
      }}>
        {/* Day Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: `1px solid ${theme.colors.border.default}`,
          background: theme.colors.background.tertiary
        }}>
          {DAYS.map((day) => (
            <div
              key={day}
              style={{
                padding: '12px',
                textAlign: 'center',
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)'
        }}>
          {calendarDays.map((day, index) => {
            const eventInfos = day.fullDate ? getEventInfoForDate(day.fullDate) : [];
            const isToday = day.fullDate &&
              day.fullDate.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                style={{
                  minHeight: '100px',
                  padding: '8px',
                  paddingBottom: '4px',
                  borderRight: (index + 1) % 7 !== 0 ? `1px solid ${theme.colors.border.subtle}` : 'none',
                  borderBottom: index < 35 ? `1px solid ${theme.colors.border.subtle}` : 'none',
                  background: day.isCurrentMonth ? 'transparent' : theme.colors.background.tertiary,
                  opacity: day.isCurrentMonth ? 1 : 0.5,
                  position: 'relative'
                }}
              >
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: isToday ? theme.typography.fontWeight.bold : theme.typography.fontWeight.normal,
                  color: isToday ? theme.colors.primary[500] : theme.colors.text.secondary,
                  marginBottom: '4px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  background: isToday ? theme.colors.primary[50] : 'transparent'
                }}>
                  {day.date}
                </div>

                {/* Multi-day Events */}
                {eventInfos.map((eventInfo) => (
                  <motion.div
                    key={eventInfo.id}
                    whileHover={{ opacity: 0.9 }}
                    onClick={() => handleEventClick(eventInfo)}
                    style={{
                      position: 'relative',
                      height: '24px',
                      marginTop: '4px',
                      marginLeft: eventInfo.isStart ? 0 : '-8px',
                      marginRight: eventInfo.isEnd ? 0 : '-8px',
                      paddingLeft: eventInfo.isStart ? '8px' : '0',
                      paddingRight: eventInfo.isEnd ? '8px' : '0',
                      background: eventInfo.color,
                      borderRadius: eventInfo.isStart && eventInfo.isEnd
                        ? theme.borderRadius.md
                        : eventInfo.isStart
                          ? `${theme.borderRadius.md} 0 0 ${theme.borderRadius.md}`
                          : eventInfo.isEnd
                            ? `0 ${theme.borderRadius.md} ${theme.borderRadius.md} 0`
                            : '0',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      zIndex: 1
                    }}
                  >
                    {eventInfo.showLabel && (
                      <span style={{
                        fontSize: theme.typography.fontSize.xs,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: 'white',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {eventInfo.title}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Slide-Out Panel */}
      <AnimatePresence>
        {slideOutOpen && selectedEvent && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSlideOutOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(2px)',
                zIndex: theme.zIndex.modalBackdrop
              }}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '420px',
                background: theme.colors.background.elevated,
                borderLeft: `1px solid ${theme.colors.border.default}`,
                boxShadow: '-16px 0 48px rgba(0, 0, 0, 0.08)',
                zIndex: theme.zIndex.modal,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div style={{
                padding: '24px',
                borderBottom: `1px solid ${theme.colors.border.default}`,
                background: `linear-gradient(135deg, ${selectedEvent.color}10 0%, ${theme.colors.background.tertiary} 100%)`
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: selectedEvent.color,
                    borderRadius: theme.borderRadius.lg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <CalendarIcon size={24} />
                  </div>
                  <button
                    onClick={() => setSlideOutOpen(false)}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: theme.colors.neutral[100],
                      border: 'none',
                      borderRadius: theme.borderRadius.md,
                      cursor: 'pointer',
                      color: theme.colors.text.secondary,
                      fontSize: '18px'
                    }}
                  >
                    ✕
                  </button>
                </div>

                <h2 style={{
                  fontSize: theme.typography.fontSize.xl,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.primary,
                  margin: 0,
                  marginBottom: '8px',
                  lineHeight: theme.typography.lineHeight.tight
                }}>
                  {selectedEvent.title}
                </h2>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary
                }}>
                  <CalendarIcon size={14} />
                  <span>{formatDateRange(selectedEvent.startDate, selectedEvent.endDate)}</span>
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
                {/* Venue */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '24px',
                  padding: '16px',
                  background: theme.colors.background.tertiary,
                  borderRadius: theme.borderRadius.lg
                }}>
                  <MapPin size={20} style={{ color: theme.colors.text.tertiary, marginTop: '2px' }} />
                  <div>
                    <div style={{
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.primary,
                      marginBottom: '4px'
                    }}>
                      {selectedEvent.venue}
                    </div>
                    <div style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.tertiary
                    }}>
                      {selectedEvent.city}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    padding: '20px',
                    background: theme.colors.background.tertiary,
                    borderRadius: theme.borderRadius.lg,
                    textAlign: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <Users size={18} style={{ color: theme.colors.primary[500] }} />
                      <span style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.text.tertiary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Participants
                      </span>
                    </div>
                    <div style={{
                      fontSize: theme.typography.fontSize['2xl'],
                      fontWeight: theme.typography.fontWeight.bold,
                      color: theme.colors.text.primary
                    }}>
                      {selectedEvent.participants.toLocaleString()}
                    </div>
                  </div>

                  <div style={{
                    padding: '20px',
                    background: theme.colors.background.tertiary,
                    borderRadius: theme.borderRadius.lg,
                    textAlign: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <DollarSign size={18} style={{ color: theme.colors.success[500] }} />
                      <span style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.text.tertiary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Revenue
                      </span>
                    </div>
                    <div style={{
                      fontSize: theme.typography.fontSize['2xl'],
                      fontWeight: theme.typography.fontWeight.bold,
                      color: theme.colors.text.primary
                    }}>
                      {formatCurrency(selectedEvent.revenue)}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: theme.colors.primary[50],
                  borderRadius: theme.borderRadius.full,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.primary[600],
                  fontWeight: theme.typography.fontWeight.medium,
                  textTransform: 'capitalize'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    background: theme.colors.primary[500],
                    borderRadius: '50%'
                  }} />
                  {selectedEvent.status}
                </div>
              </div>

              {/* Footer */}
              <div style={{
                padding: '20px 24px',
                borderTop: `1px solid ${theme.colors.border.default}`,
                background: theme.colors.background.tertiary
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleViewProfile}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: theme.colors.primary[500],
                    color: 'white',
                    border: 'none',
                    borderRadius: theme.borderRadius.lg,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.semibold,
                    cursor: 'pointer'
                  }}
                >
                  View Profile
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
