/**
 * Phrase Search Configuration
 *
 * Contains all constants and logic for the Apple Spotlight-style phrase search feature.
 * This includes starting points, entity types, filter options, and progressive suggestion logic.
 */

import { Users, X, Clock, MapPin, Check, Plus, ChevronRight, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';

// Starting point cohorts for phrase building
export const STARTING_POINTS = [
  { id: 'current', label: 'Current', icon: Users, color: 'blue', type: 'cohort', filterHint: { status: 'Active' } },
  { id: 'all', label: 'All Contacts', icon: Users, color: 'gray', type: 'cohort', filterHint: {} },
  { id: 'lapsed', label: 'Lapsed', icon: X, color: 'red', type: 'cohort', filterHint: { status: 'Inactive' } },
  { id: 'pending', label: 'Pending', icon: Clock, color: 'yellow', type: 'cohort', filterHint: { status: 'Pending' } }
];

// Entity types for filtering
export const ENTITY_TYPES = [
  { label: 'members', type: 'MEMBER', color: 'blue', icon: Users },
  { label: 'students', type: 'STUDENT', color: 'emerald', icon: Users },
  { label: 'professionals', type: 'PROFESSIONAL', color: 'purple', icon: Sparkles },
  { label: 'volunteers', type: 'VOLUNTEER', color: 'orange', icon: Users }
];

// Filter options for various categories
export const FILTER_OPTIONS = {
  provinces: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan'],
  cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton', 'Ottawa'],
  tenureValues: ['5 years', '1 year', '2 years', '10 years', '15 years', '3 years', 'Custom year...'],
  tenureComparisons: ['or more', 'or less', 'exactly'],
  statuses: ['Active', 'Inactive', 'Pending', 'On Hold', 'Cancelled'],
  engagementLevels: ['High', 'Medium', 'Low', 'Very High', 'Very Low', 'None']
};

/**
 * Progressive suggestion logic with 3 levels (Current, Next, Future)
 * Returns suggestions based on the current phrase chips
 *
 * @param {Array} chips - Current phrase chips
 * @returns {Object} Object with current, next, and future suggestion arrays
 */
export const getSuggestionsForPhrase = (chips) => {
  if (chips.length === 0) {
    return {
      current: STARTING_POINTS,
      next: ENTITY_TYPES.map(et => ({
        label: et.label,
        type: 'entityType',
        entityTypeValue: et.type,
        icon: et.icon,
        color: et.color,
        preview: true
      })),
      future: [
        { label: 'that have been', icon: ChevronRight, preview: true },
        { label: 'for', icon: Clock, preview: true },
        { label: 'in', icon: MapPin, preview: true },
        { label: 'with', icon: Check, preview: true }
      ]
    };
  }

  const lastChip = chips[chips.length - 1];

  // After selecting a cohort (Current, All Contacts, etc.)
  if (lastChip.type === 'cohort') {
    return {
      current: ENTITY_TYPES.map(et => ({
        label: et.label,
        type: 'entityType',
        entityTypeValue: et.type,
        icon: et.icon,
        color: et.color
      })),
      next: [
        { label: 'that have been', icon: ChevronRight, preview: true },
        { label: 'for', icon: Clock, preview: true },
        { label: 'in', icon: MapPin, preview: true },
        { label: 'with', icon: Check, preview: true }
      ],
      future: ENTITY_TYPES.slice(0, 3).map(et => ({ label: et.label, preview: true }))
    };
  }

  // After selecting an entity type (members, students, etc.)
  if (lastChip.type === 'entityType') {
    return {
      current: [
        { label: 'that have been', icon: ChevronRight, type: 'connector' },
        { label: 'for', icon: Clock, type: 'connector' },
        { label: 'in', icon: MapPin, type: 'connector' },
        { label: 'with', icon: Check, type: 'connector' }
      ],
      next: ENTITY_TYPES.slice(0, 4).map(et => ({ label: et.label, preview: true })),
      future: [{ label: 'for', icon: Clock, preview: true }]
    };
  }

  // After "that have been" -> show entity types (what they used to be)
  if (lastChip.text === 'that have been') {
    return {
      current: ENTITY_TYPES.map(et => ({
        label: et.label,
        type: 'entityType',
        entityTypeValue: et.type,
        icon: et.icon,
        color: et.color
      })),
      next: [{ label: 'for', icon: Clock, preview: true }],
      future: FILTER_OPTIONS.tenureValues.slice(0, 4).map(t => ({ label: t, preview: true }))
    };
  }

  if (lastChip.text === 'for') {
    return {
      current: FILTER_OPTIONS.tenureValues.map(t => ({ label: t, type: 'value', valueType: 'tenure' })),
      next: FILTER_OPTIONS.tenureComparisons.map(c => ({ label: c, preview: true })),
      future: [{ label: 'and', icon: Plus, preview: true }]
    };
  }

  if (lastChip.valueType === 'tenure' && !chips.find(c => c.valueType === 'tenureComparison')) {
    return {
      current: FILTER_OPTIONS.tenureComparisons.map(c => ({ label: c, type: 'value', valueType: 'tenureComparison' })),
      next: [{ label: 'and', icon: Plus, preview: true }],
      future: [{ label: 'in', preview: true }]
    };
  }

  if (lastChip.text === 'in') {
    return {
      current: [
        { label: 'province', icon: MapPin, type: 'connector' },
        { label: 'city', icon: MapPin, type: 'connector' }
      ],
      next: FILTER_OPTIONS.provinces.slice(0, 6).map(p => ({ label: p, preview: true })),
      future: [{ label: 'and', preview: true }]
    };
  }

  if (lastChip.text === 'province') {
    return {
      current: FILTER_OPTIONS.provinces.map(p => ({ label: p, type: 'value', valueType: 'province' })),
      next: [{ label: 'and', preview: true }],
      future: [{ label: 'in', preview: true }]
    };
  }

  // After "city" -> city values
  if (lastChip.text === 'city') {
    return {
      current: FILTER_OPTIONS.cities.map(c => ({ label: c, type: 'value', valueType: 'city' })),
      next: [{ label: 'and', preview: true }],
      future: [{ label: 'in', preview: true }]
    };
  }

  // After "with" -> additional filter options
  if (lastChip.text === 'with') {
    return {
      current: [
        { label: 'engagement', icon: TrendingUp, type: 'connector' },
        { label: 'status', icon: CheckCircle2, type: 'connector' }
      ],
      next: [{ label: 'and', preview: true }],
      future: [{ label: 'in', preview: true }]
    };
  }

  // After "status" -> status values
  if (lastChip.text === 'status') {
    return {
      current: FILTER_OPTIONS.statuses.map(s => ({ label: s, type: 'value', valueType: 'status' })),
      next: [{ label: 'and', icon: Plus, preview: true }],
      future: [{ label: 'in', icon: MapPin, preview: true }]
    };
  }

  // After "engagement" -> engagement level values
  if (lastChip.text === 'engagement') {
    return {
      current: FILTER_OPTIONS.engagementLevels.map(e => ({ label: e, type: 'value', valueType: 'engagement' })),
      next: [{ label: 'and', icon: Plus, preview: true }],
      future: [{ label: 'in', icon: MapPin, preview: true }]
    };
  }

  if (lastChip.type === 'value' || lastChip.valueType === 'tenureComparison') {
    return {
      current: [{ label: 'and', icon: Plus, type: 'connector' }],
      next: [
        { label: 'in', icon: MapPin, preview: true },
        { label: 'with', icon: Check, preview: true },
        { label: 'for', icon: Clock, preview: true }
      ],
      future: FILTER_OPTIONS.provinces.slice(0, 4).map(p => ({ label: p, preview: true }))
    };
  }

  if (lastChip.text === 'and') {
    return {
      current: [
        { label: 'in', icon: MapPin, type: 'connector' },
        { label: 'with', icon: Check, type: 'connector' },
        { label: 'for', icon: Clock, type: 'connector' }
      ],
      next: FILTER_OPTIONS.provinces.slice(0, 4).map(p => ({ label: p, preview: true })),
      future: [{ label: 'and', preview: true }]
    };
  }

  return { current: [], next: [], future: [] };
};
