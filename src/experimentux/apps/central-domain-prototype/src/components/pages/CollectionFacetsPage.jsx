/**
 * CollectionFacetsPage
 *
 * Showcases record collections with the six-facet card system.
 * Apple-inspired enterprise design.
 * Responds to timeline filter from Studio Dock.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Leaf, Calendar, Users, Building2, MapPin,
  Diamond, X, Clock, Filter
} from 'lucide-react';
import { theme } from '../../config/theme';
import { FacetCard } from '../facets/FacetCard';
import { RecordSlideOut } from '../facets/RecordSlideOut';
import { useTimelineFilterStore } from '../../store/timelineFilterStore';
import { useStudioDockStore } from '../../store/studioDockStore';
import { useListFilterStore } from '../../store/listFilterStore';

// Sample collection data for the 2025 Annual Conference
const COLLECTIONS = [
  {
    id: 'registration',
    title: 'Registration Types',
    type: 'Profile',
    count: '847 registrations',
    icon: <FileText size={22} strokeWidth={1.5} />,
    defaultFacet: 'summary',
    trend: { value: '12%', positive: true },
    updated: '2h ago',
    summary: {
      stats: [
        { value: '$425K', label: 'Total Revenue' },
        { value: '78%', label: 'Capacity' }
      ],
      segments: [
        { pct: 45, color: theme.colors.primary[500], label: 'Full $599' },
        { pct: 30, color: theme.colors.success[500], label: 'Early $449' },
        { pct: 15, color: theme.colors.warning[500], label: 'Student $199' },
        { pct: 10, color: '#7C5CFA', label: 'VIP $999' }
      ]
    },
    list: [
      { name: 'Full Conference', count: 381, pct: 45, color: theme.colors.primary[500] },
      { name: 'Early Bird', count: 254, pct: 30, color: theme.colors.success[500] },
      { name: 'Student', count: 127, pct: 15, color: theme.colors.warning[500] },
      { name: 'VIP', count: 85, pct: 10, color: '#7C5CFA' }
    ],
    chart: {
      bars: [20, 35, 45, 60, 55, 70, 85, 40],
      labels: ['Jan', 'Aug'],
      insight: 'Peak registration in July (+156 in 2 weeks)'
    },
    timeline: [
      { title: 'Sarah Chen registered (VIP)', time: '2 hours ago' },
      { title: '12 Early Bird converted to Full', time: 'Yesterday' },
      { title: 'Early Bird pricing ended', time: 'Jul 31, 2025' }
    ],
    fields: [
      { name: 'Name', type: 'Text', fill: 5 },
      { name: 'Email', type: 'Text', fill: 5 },
      { name: 'Type', type: 'Select', fill: 5 },
      { name: 'Company', type: 'Text', fill: 3 }
    ],
    automations: ['Welcome email on register', 'Slack alert for VIP']
  },
  {
    id: 'dietary',
    title: 'Dietary Restrictions',
    type: 'Profile',
    count: '312 attendees',
    icon: <Leaf size={22} strokeWidth={1.5} />,
    defaultFacet: 'list',
    trend: { value: '8%', positive: true },
    updated: '4h ago',
    summary: {
      stats: [
        { value: '37%', label: 'Have Restrictions' },
        { value: '8', label: 'Categories' }
      ],
      segments: [
        { pct: 35, color: theme.colors.success[500], label: 'Vegetarian' },
        { pct: 25, color: theme.colors.primary[500], label: 'Vegan' },
        { pct: 20, color: theme.colors.warning[500], label: 'Gluten-Free' },
        { pct: 20, color: theme.colors.error[500], label: 'Allergies' }
      ]
    },
    list: [
      { name: 'Vegetarian', count: 109, pct: 35, color: theme.colors.success[500] },
      { name: 'Vegan', count: 78, pct: 25, color: theme.colors.primary[500] },
      { name: 'Gluten-Free', count: 62, pct: 20, color: theme.colors.warning[500] },
      { name: 'Nut Allergy', count: 38, pct: 12, color: theme.colors.error[500] },
      { name: 'Kosher / Halal', count: 25, pct: 8, color: '#7C5CFA' }
    ],
    chart: {
      bars: [35, 25, 20, 12, 8],
      labels: ['Type', ''],
      insight: 'Vegetarian up 8% from last year'
    },
    timeline: [
      { title: 'Catering notified of counts', time: 'Today, 9:00 AM' },
      { title: '5 new allergies reported', time: 'Yesterday' },
      { title: 'Menu options finalized', time: 'Aug 1, 2025' }
    ],
    fields: [
      { name: 'Attendee', type: 'Related', fill: 5 },
      { name: 'Restriction', type: 'Select', fill: 5 },
      { name: 'Severity', type: 'Select', fill: 3 },
      { name: 'Notes', type: 'Text', fill: 2 }
    ],
    automations: ['Daily catering summary']
  },
  {
    id: 'sessions',
    title: 'Sessions',
    type: 'Activity',
    count: '42 sessions',
    icon: <Calendar size={22} strokeWidth={1.5} />,
    defaultFacet: 'analytics',
    trend: null,
    updated: '1h ago',
    summary: {
      stats: [
        { value: '42', label: 'Total Sessions' },
        { value: '3', label: 'Days' }
      ],
      segments: [
        { pct: 40, color: theme.colors.primary[500], label: 'Breakout' },
        { pct: 30, color: theme.colors.success[500], label: 'Workshop' },
        { pct: 20, color: theme.colors.warning[500], label: 'Keynote' },
        { pct: 10, color: '#7C5CFA', label: 'Panel' }
      ]
    },
    list: [
      { name: 'Technology', count: 14, pct: 33, color: theme.colors.primary[500] },
      { name: 'Leadership', count: 12, pct: 29, color: theme.colors.success[500] },
      { name: 'Innovation', count: 10, pct: 24, color: theme.colors.warning[500] },
      { name: 'Networking', count: 6, pct: 14, color: '#7C5CFA' }
    ],
    chart: {
      bars: [65, 85, 50],
      labels: ['Sep 15', 'Sep 17'],
      insight: 'Day 2 has highest session density'
    },
    timeline: [
      { title: '"AI in Practice" room changed', time: '1 hour ago' },
      { title: '2 speakers confirmed', time: 'Yesterday' },
      { title: 'Schedule published', time: 'Aug 15, 2025' }
    ],
    fields: [
      { name: 'Title', type: 'Text', fill: 5 },
      { name: 'Date/Time', type: 'Date', fill: 5 },
      { name: 'Speaker', type: 'Related', fill: 4 },
      { name: 'Room', type: 'Select', fill: 5 }
    ],
    automations: ['Speaker reminder (48h)', 'Room conflict alert']
  },
  {
    id: 'speakers',
    title: 'Speakers',
    type: 'Profile',
    count: '28 speakers',
    icon: <Users size={22} strokeWidth={1.5} />,
    defaultFacet: 'timeline',
    trend: { value: '40%', positive: true },
    updated: '3h ago',
    summary: {
      stats: [
        { value: '28', label: 'Total Speakers' },
        { value: '92%', label: 'Confirmed' }
      ],
      segments: [
        { pct: 92, color: theme.colors.success[500], label: 'Confirmed' },
        { pct: 8, color: theme.colors.warning[500], label: 'Pending' }
      ]
    },
    list: [
      { name: 'Keynote', count: 4, pct: 14, color: theme.colors.warning[500] },
      { name: 'Breakout', count: 16, pct: 57, color: theme.colors.primary[500] },
      { name: 'Workshop', count: 6, pct: 21, color: theme.colors.success[500] },
      { name: 'Panelist', count: 2, pct: 7, color: '#7C5CFA' }
    ],
    chart: {
      bars: [14, 57, 21, 7],
      labels: ['Type', ''],
      insight: '40% increase in speakers vs last year'
    },
    timeline: [
      { title: 'Dr. Maya Johnson confirmed', time: '3 hours ago' },
      { title: 'Bio submitted: Marcus Chen', time: 'Yesterday' },
      { title: 'AV requirements collected (24/28)', time: '2 days ago' },
      { title: 'Speaker portal opened', time: 'Jul 1, 2025' }
    ],
    fields: [
      { name: 'Name', type: 'Text', fill: 5 },
      { name: 'Company', type: 'Text', fill: 5 },
      { name: 'Bio', type: 'Text', fill: 4 },
      { name: 'Headshot', type: 'File', fill: 3 }
    ],
    automations: ['Bio reminder (7 days)', 'Travel confirmation']
  },
  {
    id: 'sponsors',
    title: 'Sponsors',
    type: 'Profile',
    count: '12 sponsors',
    icon: <Building2 size={22} strokeWidth={1.5} />,
    defaultFacet: 'fields',
    trend: { value: '25%', positive: true },
    updated: '1d ago',
    summary: {
      stats: [
        { value: '$180K', label: 'Total Sponsorship' },
        { value: '12', label: 'Partners' }
      ],
      segments: [
        { pct: 50, color: theme.colors.warning[500], label: 'Platinum' },
        { pct: 33, color: theme.colors.primary[500], label: 'Gold' },
        { pct: 17, color: theme.colors.success[500], label: 'Silver' }
      ]
    },
    list: [
      { name: 'Platinum', count: 2, pct: 50, color: theme.colors.warning[500] },
      { name: 'Gold', count: 4, pct: 33, color: theme.colors.primary[500] },
      { name: 'Silver', count: 6, pct: 17, color: theme.colors.success[500] }
    ],
    chart: {
      bars: [50, 33, 17],
      labels: ['Tier', ''],
      insight: 'Sponsorship revenue up 25% YoY'
    },
    timeline: [
      { title: 'TechCorp upgraded to Platinum', time: '1 day ago' },
      { title: 'Logo assets received (10/12)', time: '3 days ago' },
      { title: 'Booth assignments sent', time: 'Aug 1, 2025' }
    ],
    fields: [
      { name: 'Company', type: 'Text', fill: 5 },
      { name: 'Tier', type: 'Select', fill: 5 },
      { name: 'Amount', type: 'Money', fill: 5 },
      { name: 'Logo', type: 'File', fill: 4 },
      { name: 'Contact', type: 'Related', fill: 5 }
    ],
    automations: ['Invoice on signup', 'Benefits checklist']
  },
  {
    id: 'venues',
    title: 'Venue Rooms',
    type: 'Profile',
    count: '18 rooms',
    icon: <MapPin size={22} strokeWidth={1.5} />,
    defaultFacet: 'actions',
    trend: null,
    updated: '6h ago',
    summary: {
      stats: [
        { value: '18', label: 'Total Rooms' },
        { value: '94%', label: 'Utilized' }
      ],
      segments: [
        { pct: 40, color: theme.colors.primary[500], label: 'Breakout' },
        { pct: 25, color: theme.colors.success[500], label: 'Workshop' },
        { pct: 20, color: theme.colors.warning[500], label: 'Plenary' },
        { pct: 15, color: '#7C5CFA', label: 'Meeting' }
      ]
    },
    list: [
      { name: 'Breakout Rooms', count: 8, pct: 44, color: theme.colors.primary[500] },
      { name: 'Workshop Rooms', count: 4, pct: 22, color: theme.colors.success[500] },
      { name: 'Plenary Hall', count: 2, pct: 11, color: theme.colors.warning[500] },
      { name: 'Meeting Rooms', count: 4, pct: 22, color: '#7C5CFA' }
    ],
    chart: {
      bars: [44, 22, 11, 22],
      labels: ['Type', ''],
      insight: '94% room utilization across 3 days'
    },
    timeline: [
      { title: 'Room 104 AV check complete', time: '6 hours ago' },
      { title: 'Plenary seating confirmed', time: 'Yesterday' },
      { title: 'Floor plan finalized', time: 'Jul 15, 2025' }
    ],
    fields: [
      { name: 'Name', type: 'Text', fill: 5 },
      { name: 'Capacity', type: 'Number', fill: 5 },
      { name: 'Type', type: 'Select', fill: 5 },
      { name: 'AV Equipment', type: 'Select', fill: 4 },
      { name: 'Floor', type: 'Number', fill: 5 }
    ],
    automations: ['Setup reminder (2h)', 'Capacity alert']
  }
];

// Helper function to apply timeline filter to collection data
function applyTimelineFilter(collection, filterData) {
  if (!filterData.isActive || collection.id !== 'registration') {
    return collection;
  }

  const { totalRegistrations, breakdown, dateRange } = filterData;

  // Calculate filtered values
  const filteredCount = totalRegistrations;
  const revenue = (breakdown.full * 599) + (breakdown.early * 449) + (breakdown.student * 199) + (breakdown.vip * 999);
  const totalCapacity = 1100; // Conference capacity
  const capacityPct = Math.round((filteredCount / totalCapacity) * 100);

  // Calculate percentages for segments
  const total = breakdown.full + breakdown.early + breakdown.student + breakdown.vip;
  const fullPct = total > 0 ? Math.round((breakdown.full / total) * 100) : 0;
  const earlyPct = total > 0 ? Math.round((breakdown.early / total) * 100) : 0;
  const studentPct = total > 0 ? Math.round((breakdown.student / total) * 100) : 0;
  const vipPct = total > 0 ? Math.round((breakdown.vip / total) * 100) : 0;

  return {
    ...collection,
    count: `${filteredCount} registrations`,
    summary: {
      stats: [
        { value: `$${Math.round(revenue / 1000)}K`, label: 'Total Revenue' },
        { value: `${capacityPct}%`, label: 'Capacity' }
      ],
      segments: [
        { pct: fullPct, color: theme.colors.primary[500], label: 'Full $599' },
        { pct: earlyPct, color: theme.colors.success[500], label: 'Early $449' },
        { pct: studentPct, color: theme.colors.warning[500], label: 'Student $199' },
        { pct: vipPct, color: '#7C5CFA', label: 'VIP $999' }
      ]
    },
    list: [
      { name: 'Full Conference', count: breakdown.full, pct: fullPct, color: theme.colors.primary[500] },
      { name: 'Early Bird', count: breakdown.early, pct: earlyPct, color: theme.colors.success[500] },
      { name: 'Student', count: breakdown.student, pct: studentPct, color: theme.colors.warning[500] },
      { name: 'VIP', count: breakdown.vip, pct: vipPct, color: '#7C5CFA' }
    ]
  };
}

export function CollectionFacetsPage() {
  const [showAllPanelOpen, setShowAllPanelOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  // Timeline filter state
  const {
    isFilterActive,
    weeks,
    rangeStart,
    rangeEnd,
    getTotalRegistrations,
    getBreakdownTotals,
    getDateRange,
    resetRange
  } = useTimelineFilterStore();

  const openPanel = useStudioDockStore((state) => state.openPanel);

  // List filter state
  const { selectedFilters, clearFilter: clearListFilter } = useListFilterStore();

  // Compute filtered collections
  const filteredCollections = useMemo(() => {
    const filterData = {
      isActive: isFilterActive,
      totalRegistrations: getTotalRegistrations(),
      breakdown: getBreakdownTotals(),
      dateRange: getDateRange()
    };

    return COLLECTIONS.map(collection => applyTimelineFilter(collection, filterData));
  }, [isFilterActive, rangeStart, rangeEnd, getTotalRegistrations, getBreakdownTotals, getDateRange]);

  // Get date range label for filter indicator
  const dateRangeLabel = useMemo(() => {
    if (!isFilterActive) return '';
    const startWeek = weeks[rangeStart];
    const endWeek = weeks[rangeEnd];
    return `${startWeek?.fullLabel} — ${endWeek?.fullLabel}`;
  }, [isFilterActive, weeks, rangeStart, rangeEnd]);

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '32px 48px'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        paddingBottom: '24px',
        borderBottom: `1px solid ${theme.colors.border.subtle}`
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* Diamond Mark - subtle presence */}
          <div style={{ opacity: 0.5 }}>
            <Diamond size={28} strokeWidth={1.25} />
          </div>
          <h1 style={{
            fontSize: theme.typography.fontSize['3xl'],
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            letterSpacing: theme.typography.letterSpacing.tight,
            margin: 0
          }}>
            Collections
          </h1>
        </div>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* List Filter Indicators (Multi-select) */}
          <AnimatePresence>
            {selectedFilters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  background: theme.colors.background.tertiary,
                  border: `1px solid ${theme.colors.border.default}`,
                  borderRadius: theme.borderRadius.full,
                  fontSize: theme.typography.fontSize.sm
                }}
              >
                {/* Show color dots for each selected filter */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {selectedFilters.slice(0, 4).map((filter, index) => (
                    <motion.span
                      key={`${filter.cardId}-${filter.itemName}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ delay: index * 0.05 }}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '3px',
                        background: filter.itemColor || theme.colors.primary[500]
                      }}
                    />
                  ))}
                  {selectedFilters.length > 4 && (
                    <span style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.text.tertiary
                    }}>
                      +{selectedFilters.length - 4}
                    </span>
                  )}
                </div>
                <span style={{ color: theme.colors.text.secondary, fontWeight: theme.typography.fontWeight.medium }}>
                  {selectedFilters.length === 1
                    ? selectedFilters[0].itemName
                    : `${selectedFilters.length} selected`}
                </span>
                <button
                  onClick={clearListFilter}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px',
                    border: 'none',
                    background: theme.colors.neutral[200],
                    borderRadius: '50%',
                    cursor: 'pointer',
                    color: theme.colors.text.secondary,
                    marginLeft: '4px'
                  }}
                >
                  <X size={12} strokeWidth={2} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timeline Filter Indicator */}
          <AnimatePresence>
            {isFilterActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 14px',
                  background: theme.colors.primary[50],
                  border: `1px solid ${theme.colors.primary[200]}`,
                  borderRadius: theme.borderRadius.full,
                  fontSize: theme.typography.fontSize.sm
                }}
              >
                <Filter size={14} strokeWidth={1.5} style={{ color: theme.colors.primary[500] }} />
                <span style={{ color: theme.colors.primary[700], fontWeight: theme.typography.fontWeight.medium }}>
                  {dateRangeLabel}
                </span>
                <button
                  onClick={resetRange}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px',
                    border: 'none',
                    background: theme.colors.primary[200],
                    borderRadius: '50%',
                    cursor: 'pointer',
                    color: theme.colors.primary[600],
                    marginLeft: '4px'
                  }}
                >
                  <X size={12} strokeWidth={2} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timeline Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openPanel('timeline')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              border: `1px solid ${isFilterActive ? theme.colors.primary[300] : theme.colors.border.default}`,
              background: isFilterActive ? theme.colors.primary[50] : theme.colors.background.elevated,
              borderRadius: theme.borderRadius.lg,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: isFilterActive ? theme.colors.primary[600] : theme.colors.text.secondary,
              transition: `all ${theme.transitions.fast}`
            }}
          >
            <Clock size={16} strokeWidth={1.5} />
            <span>Timeline</span>
          </motion.button>

          {/* Event Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 18px',
            background: theme.colors.background.tertiary,
            borderRadius: theme.borderRadius.full,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              background: theme.colors.success[500],
              borderRadius: '50%'
            }} />
            <span>2025 Annual Conference — Chicago, IL</span>
          </div>
        </div>
      </header>

      {/* Card Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '24px'
      }}>
        {filteredCollections.map((collection) => (
          <motion.div
            key={collection.id}
            layout
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FacetCard
              collection={collection}
              defaultFacet={collection.defaultFacet}
              onPopOut={() => console.log('Pop out', collection.id)}
              onMenuClick={() => console.log('Menu for', collection.id)}
              onCardClick={() => {
                setSelectedCollection(collection);
                setShowAllPanelOpen(true);
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Show All Panel - Modal with blur backdrop */}
      {showAllPanelOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: theme.zIndex.modal,
            animation: 'overlayFadeIn 200ms ease-out'
          }}
          onClick={() => setShowAllPanelOpen(false)}
        >
          <div
            style={{
              background: theme.colors.background.elevated,
              borderRadius: theme.borderRadius['2xl'],
              padding: '32px',
              width: '90%',
              maxWidth: '680px',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: theme.shadows['2xl'],
              animation: 'panelSlideUp 300ms cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Panel Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '28px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Diamond size={22} strokeWidth={1.25} style={{ opacity: 0.5 }} />
                <h2 style={{
                  fontSize: theme.typography.fontSize.xl,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.primary,
                  margin: 0
                }}>
                  {selectedCollection?.title || 'Select Facet'}
                </h2>
              </div>
              <button
                onClick={() => setShowAllPanelOpen(false)}
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

            {/* Facet Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              {[
                { id: 'summary', label: 'Summary', desc: 'Overview with key metrics and status distribution' },
                { id: 'list', label: 'List', desc: 'Top values grouped by key dimensions' },
                { id: 'analytics', label: 'Analytics', desc: 'Charts, trends, and pattern insights' },
                { id: 'timeline', label: 'Timeline', desc: 'Chronological activity and changes' },
                { id: 'fields', label: 'Fields', desc: 'Schema structure and data quality' },
                { id: 'actions', label: 'Actions', desc: 'Operations and automations' }
              ].map((facet) => (
                <button
                  key={facet.id}
                  onClick={() => {
                    console.log('Selected facet:', facet.id);
                    setShowAllPanelOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '20px',
                    background: theme.colors.background.tertiary,
                    border: 'none',
                    borderRadius: theme.borderRadius.lg,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: `all ${theme.transitions.fast}`
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text.primary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em'
                  }}>
                    {facet.label}
                  </div>
                  <div style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.tertiary,
                    lineHeight: 1.4
                  }}>
                    {facet.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Record Slide Out */}
      <RecordSlideOut />

      {/* Animations */}
      <style>{`
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes panelSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
