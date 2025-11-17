/**
 * Person Essential Phrase Search Configuration
 *
 * Contains all constants and logic for the phrase search feature in PersonEssential reports.
 * This includes starting points, entity types, filter options, and progressive suggestion logic.
 */

import {
  Users, Crown, Award, Mail, Calendar, DollarSign, MapPin,
  TrendingUp, Check, Plus, ChevronRight, Sparkles, X, Clock
} from 'lucide-react';

// Starting point cohorts for phrase building
export const STARTING_POINTS = [
  {
    id: 'current',
    label: 'Current',
    icon: Users,
    color: 'blue',
    type: 'entity',
    description: 'Active members'
  },
  {
    id: 'new',
    label: 'New',
    icon: Sparkles,
    color: 'green',
    type: 'entity',
    description: 'Recent additions'
  },
  {
    id: 'lapsed',
    label: 'Lapsed',
    icon: X,
    color: 'red',
    type: 'entity',
    description: 'Inactive members'
  },
  {
    id: 'all',
    label: 'All Contacts',
    icon: Users,
    color: 'gray',
    type: 'entity',
    description: 'Everyone'
  }
];

// Entity types for filtering
export const ENTITY_TYPES = [
  { label: 'Members', type: 'entity', color: 'purple', icon: Crown },
  { label: 'Donors', type: 'entity', color: 'orange', icon: Award },
  { label: 'Contacts', type: 'entity', color: 'blue', icon: Users }
];

// Filter options for various categories
export const FILTER_OPTIONS = {
  locations: [
    'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa',
    'Edmonton', 'Winnipeg', 'Quebec City', 'Hamilton', 'Halifax',
    'London', 'Victoria', 'Saskatoon', 'Regina', 'Kitchener'
  ],
  timeframes: [
    'Last 7 days', 'Last 30 days', 'Last 90 days',
    'This month', 'This quarter', 'This year', 'Last year'
  ],
  attributes: [
    { label: 'orders', icon: DollarSign, color: 'green' },
    { label: 'events', icon: Calendar, color: 'purple' },
    { label: 'donations', icon: Award, color: 'orange' },
    { label: 'emails', icon: Mail, color: 'blue' }
  ],
  membershipTypes: [
    'Individual', 'Professional', 'Corporate', 'Student',
    'Senior', 'Family', 'Lifetime', 'Honorary'
  ],
  statuses: ['Current', 'Active', 'Lapsed', 'Pending', 'Suspended'],
  sortOptions: [
    'by revenue (high to low)', 'by revenue (low to high)',
    'by date (newest first)', 'by date (oldest first)',
    'by name (A-Z)', 'by name (Z-A)'
  ],
  limitOptions: ['Top 10', 'Top 25', 'Top 50', 'Top 100', 'Top 500', 'All records'],
  comparisonOperators: ['greater than', 'less than', 'equals', 'between'],
  amountValues: ['$100', '$500', '$1,000', '$2,500', '$5,000', '$10,000', '$25,000', '$50,000']
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
      current: STARTING_POINTS.map(sp => ({
        label: sp.label,
        type: sp.type,
        icon: sp.icon,
        color: sp.color
      })),
      next: ENTITY_TYPES.map(et => ({
        label: et.label,
        type: et.type,
        icon: et.icon,
        color: et.color,
        preview: true
      })),
      future: [
        { label: 'that have', icon: ChevronRight, preview: true },
        { label: 'with status', icon: Check, preview: true },
        { label: 'in location', icon: MapPin, preview: true }
      ]
    };
  }

  const lastChip = chips[chips.length - 1];
  const lastChipText = lastChip.text || lastChip.label;

  // After selecting a starting point (Current, New, Lapsed, All Contacts)
  if (lastChip.type === 'entity' && STARTING_POINTS.some(sp => sp.label === lastChipText)) {
    return {
      current: ENTITY_TYPES.map(et => ({
        label: et.label,
        type: et.type,
        icon: et.icon,
        color: et.color
      })),
      next: [
        { label: 'that have', icon: ChevronRight, type: 'connector', preview: true },
        { label: 'with status', icon: Check, type: 'connector', preview: true },
        { label: 'in location', icon: MapPin, type: 'connector', preview: true }
      ],
      future: FILTER_OPTIONS.attributes.slice(0, 4).map(a => ({
        label: a.label,
        preview: true
      }))
    };
  }

  // After selecting an entity type (Members, Donors, Contacts)
  if (lastChip.type === 'entity' && ENTITY_TYPES.some(et => et.label === lastChipText)) {
    return {
      current: [
        { label: 'that have', icon: ChevronRight, type: 'connector' },
        { label: 'with status', icon: Check, type: 'connector' },
        { label: 'in location', icon: MapPin, type: 'connector' },
        { label: 'with type', icon: Crown, type: 'connector' }
      ],
      next: FILTER_OPTIONS.attributes.slice(0, 4).map(a => ({
        label: a.label,
        preview: true
      })),
      future: [
        { label: 'in timeframe', preview: true },
        { label: 'greater than', preview: true }
      ]
    };
  }

  // After "that have" -> show attributes
  if (lastChipText === 'that have') {
    return {
      current: FILTER_OPTIONS.attributes.map(a => ({
        label: a.label,
        type: 'attribute',
        icon: a.icon,
        color: a.color
      })),
      next: [
        { label: 'in timeframe', icon: Calendar, type: 'connector', preview: true },
        { label: 'greater than', icon: TrendingUp, type: 'connector', preview: true }
      ],
      future: FILTER_OPTIONS.timeframes.slice(0, 4).map(t => ({
        label: t,
        preview: true
      }))
    };
  }

  // After selecting an attribute (orders, events, donations, emails)
  if (lastChip.type === 'attribute') {
    return {
      current: [
        { label: 'in timeframe', icon: Calendar, type: 'connector' },
        { label: 'greater than', icon: TrendingUp, type: 'comparison' },
        { label: 'equals', icon: Check, type: 'comparison' }
      ],
      next: FILTER_OPTIONS.timeframes.slice(0, 6).map(t => ({
        label: t,
        preview: true
      })),
      future: [
        { label: 'and', icon: Plus, preview: true }
      ]
    };
  }

  // After "in timeframe" -> show timeframe values
  if (lastChipText === 'in timeframe') {
    return {
      current: FILTER_OPTIONS.timeframes.map(t => ({
        label: t,
        type: 'timeframe',
        icon: Calendar,
        color: 'orange'
      })),
      next: [
        { label: 'and', icon: Plus, preview: true },
        { label: 'sorted by', preview: true }
      ],
      future: [
        { label: 'that have', preview: true },
        { label: 'in location', preview: true }
      ]
    };
  }

  // After "in location" -> show location values
  if (lastChipText === 'in location') {
    return {
      current: FILTER_OPTIONS.locations.map(l => ({
        label: l,
        type: 'location',
        icon: MapPin,
        color: 'red'
      })),
      next: [
        { label: 'and', icon: Plus, preview: true },
        { label: 'with status', preview: true }
      ],
      future: FILTER_OPTIONS.statuses.slice(0, 4).map(s => ({
        label: s,
        preview: true
      }))
    };
  }

  // After "with status" -> show status values
  if (lastChipText === 'with status') {
    return {
      current: FILTER_OPTIONS.statuses.map(s => ({
        label: s,
        type: 'status',
        color: 'blue'
      })),
      next: [
        { label: 'and', icon: Plus, preview: true },
        { label: 'that have', preview: true }
      ],
      future: [
        { label: 'in location', preview: true },
        { label: 'with type', preview: true }
      ]
    };
  }

  // After "with type" -> show membership types
  if (lastChipText === 'with type') {
    return {
      current: FILTER_OPTIONS.membershipTypes.map(m => ({
        label: m,
        type: 'membershipType',
        icon: Crown,
        color: 'purple'
      })),
      next: [
        { label: 'and', icon: Plus, preview: true },
        { label: 'that have', preview: true }
      ],
      future: [
        { label: 'in location', preview: true }
      ]
    };
  }

  // After comparison operators (greater than, equals, etc.)
  if (lastChip.type === 'comparison' || FILTER_OPTIONS.comparisonOperators.includes(lastChipText)) {
    return {
      current: FILTER_OPTIONS.amountValues.map(a => ({
        label: a,
        type: 'value',
        color: 'green'
      })),
      next: [
        { label: 'and', icon: Plus, preview: true },
        { label: 'sorted by', preview: true }
      ],
      future: [
        { label: 'in location', preview: true },
        { label: 'with status', preview: true }
      ]
    };
  }

  // After timeframe, location, status, membershipType, or value
  if (['timeframe', 'location', 'status', 'membershipType', 'value'].includes(lastChip.type)) {
    return {
      current: [
        { label: 'and', icon: Plus, type: 'connector' },
        { label: 'sorted by', icon: TrendingUp, type: 'connector' }
      ],
      next: [
        { label: 'that have', icon: ChevronRight, preview: true },
        { label: 'in location', icon: MapPin, preview: true },
        { label: 'with status', icon: Check, preview: true }
      ],
      future: FILTER_OPTIONS.attributes.slice(0, 4).map(a => ({
        label: a.label,
        preview: true
      }))
    };
  }

  // After "and"
  if (lastChipText === 'and') {
    return {
      current: [
        { label: 'that have', icon: ChevronRight, type: 'connector' },
        { label: 'in location', icon: MapPin, type: 'connector' },
        { label: 'with status', icon: Check, type: 'connector' },
        { label: 'with type', icon: Crown, type: 'connector' }
      ],
      next: FILTER_OPTIONS.attributes.slice(0, 4).map(a => ({
        label: a.label,
        preview: true
      })),
      future: [
        { label: 'in timeframe', preview: true }
      ]
    };
  }

  // After "sorted by"
  if (lastChipText === 'sorted by') {
    return {
      current: FILTER_OPTIONS.sortOptions.map(s => ({
        label: s,
        type: 'sort',
        color: 'purple'
      })),
      next: [],
      future: []
    };
  }

  // Default fallback to allow continuous phrase building
  return {
    current: [
      { label: 'and', icon: Plus, type: 'connector' },
      { label: 'that have', icon: ChevronRight, type: 'connector' },
      { label: 'in location', icon: MapPin, type: 'connector' },
      { label: 'with status', icon: Check, type: 'connector' },
      { label: 'sorted by', icon: TrendingUp, type: 'connector' }
    ],
    next: FILTER_OPTIONS.attributes.slice(0, 4).map(a => ({
      label: a.label,
      preview: true
    })),
    future: [
      { label: 'in timeframe', preview: true },
      { label: 'greater than', preview: true }
    ]
  };
};
