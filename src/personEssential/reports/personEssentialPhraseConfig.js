/**
 * Person Essential Phrase Search Configuration
 *
 * Contains all constants and logic for the phrase search feature in PersonEssential reports.
 * This includes starting points, entity types, filter options, and progressive suggestion logic.
 */

import {
  Users, Crown, Award, Mail, Calendar, DollarSign, MapPin,
  TrendingUp, Check, Plus, ChevronRight, Sparkles, X, Clock,
  GraduationCap, Briefcase, CalendarClock
} from 'lucide-react';

// Starting point cohorts for phrase building
export const STARTING_POINTS = [
  {
    id: 'current',
    label: 'Current',
    icon: Users,
    color: 'blue',
    type: 'cohort',
    description: 'Active members'
  },
  {
    id: 'previous',
    label: 'Previous',
    icon: Clock,
    color: 'orange',
    type: 'cohort',
    description: 'Previous period members'
  },
  {
    id: 'new',
    label: 'New',
    icon: Sparkles,
    color: 'green',
    type: 'cohort',
    description: 'Recent additions'
  },
  {
    id: 'lapsed',
    label: 'Lapsed',
    icon: UserMinus,
    color: 'red',
    type: 'cohort',
    description: 'Inactive members'
  },
  {
    id: 'all',
    label: 'All Contacts',
    icon: Users,
    color: 'gray',
    type: 'entity',
    description: 'Everyone'
  },
  {
    id: '2024',
    label: '2024',
    icon: Calendar,
    color: 'indigo',
    type: 'yearCohort',
    description: '2024 members'
  },
  {
    id: '2023',
    label: '2023',
    icon: Calendar,
    color: 'indigo',
    type: 'yearCohort',
    description: '2023 members'
  },
  {
    id: '2022',
    label: '2022',
    icon: Calendar,
    color: 'indigo',
    type: 'yearCohort',
    description: '2022 members'
  },
  {
    id: '2021',
    label: '2021',
    icon: Calendar,
    color: 'indigo',
    type: 'yearCohort',
    description: '2021 members'
  },
  {
    id: '2020',
    label: '2020',
    icon: Calendar,
    color: 'indigo',
    type: 'yearCohort',
    description: '2020 members'
  },
  {
    id: '2019',
    label: '2019',
    icon: Calendar,
    color: 'indigo',
    type: 'yearCohort',
    description: '2019 members'
  }
];

// Entity types for filtering
export const ENTITY_TYPES = [
  { label: 'members', type: 'entity', color: 'purple', icon: Crown },
  { label: 'students', type: 'entity', color: 'emerald', icon: GraduationCap },
  { label: 'professionals', type: 'entity', color: 'blue', icon: Briefcase },
  { label: 'volunteers', type: 'entity', color: 'orange', icon: Users },
  { label: 'donors', type: 'entity', color: 'amber', icon: Award },
  { label: 'contacts', type: 'entity', color: 'gray', icon: Users }
];

// Filter options for various categories
export const FILTER_OPTIONS = {
  provinces: [
    'ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL', 'YT', 'NT', 'NU',
    'Ontario', 'British Columbia', 'Alberta', 'Quebec', 'Manitoba', 'Saskatchewan'
  ],
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
    'ECY1', 'ECY2', 'ECY3', 'STU1', 'STU2', 'CORP1', 'PROF1', 'PROF2',
    'Individual', 'Professional', 'Corporate', 'Student',
    'Senior', 'Family', 'Lifetime', 'Honorary'
  ],
  occupations: [
    'Practitioner', 'Educator', 'Researcher', 'Administrator',
    'Consultant', 'Manager', 'Director', 'Specialist', 'Coordinator'
  ],
  degrees: [
    'Masters', 'Bachelors', 'Doctorate', 'PhD', 'MBA', 'Certificate', 'Diploma', 'Associate'
  ],
  consecutiveMembershipYearsValues: [
    'past 1 year', 'past 2 years', 'past 3 years', 'past 5 years',
    'past 10 years', 'past 15 years', 'past 20 years', 'more than 5 years'
  ],
  renewalMonths: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  renewalYears: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'],
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

  // After selecting a cohort (Current, Previous, New, Lapsed)
  if (lastChip.type === 'cohort') {
    return {
      current: ENTITY_TYPES.map(et => ({
        label: et.label,
        type: 'entity',
        icon: et.icon,
        color: et.color
      })),
      next: [
        { label: 'that have been', icon: Clock, type: 'connector', preview: true },
        { label: 'that have', icon: ChevronRight, type: 'connector', preview: true },
        { label: 'with type', icon: Crown, type: 'connector', preview: true }
      ],
      future: FILTER_OPTIONS.attributes.slice(0, 4).map(a => ({
        label: a.label,
        preview: true
      }))
    };
  }

  // After selecting a year cohort (2019, 2020, etc.)
  if (lastChip.type === 'yearCohort') {
    return {
      current: ENTITY_TYPES.map(et => ({
        label: et.label,
        type: 'entity',
        icon: et.icon,
        color: et.color
      })),
      next: [
        { label: 'who renewed in', icon: CalendarClock, type: 'connector', preview: true },
        { label: 'that have been', icon: Clock, type: 'connector', preview: true },
        { label: 'with type', icon: Crown, type: 'connector', preview: true }
      ],
      future: FILTER_OPTIONS.renewalMonths.slice(0, 4).map(m => ({
        label: m,
        preview: true
      }))
    };
  }

  // After selecting a starting point (All Contacts)
  if (lastChip.type === 'entity' && STARTING_POINTS.some(sp => sp.label === lastChipText)) {
    return {
      current: ENTITY_TYPES.map(et => ({
        label: et.label,
        type: et.type,
        icon: et.icon,
        color: et.color
      })),
      next: [
        { label: 'that have been', icon: Clock, type: 'connector', preview: true },
        { label: 'that have', icon: ChevronRight, type: 'connector', preview: true },
        { label: 'with type', icon: Crown, type: 'connector', preview: true }
      ],
      future: ENTITY_TYPES.slice(0, 4).map(et => ({
        label: et.label,
        preview: true
      }))
    };
  }

  // After selecting an entity type (Members, Donors, Contacts)
  if (lastChip.type === 'entity' && ENTITY_TYPES.some(et => et.label === lastChipText)) {
    return {
      current: [
        { label: 'that are', icon: Filter, type: 'connector' },
        { label: 'that have been', icon: Clock, type: 'connector' },
        { label: 'that have', icon: ChevronRight, type: 'connector' },
        { label: 'that', icon: ChevronRight, type: 'connector' },
        { label: 'with', icon: Settings, type: 'connector' },
        { label: 'with status', icon: Check, type: 'connector' },
        { label: 'with type', icon: Crown, type: 'connector' },
        { label: 'in', icon: MapPin, type: 'connector' },
        { label: 'in location', icon: MapPin, type: 'connector' },
        { label: 'for', icon: Clock, type: 'connector' }
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

  // After "that have been" -> show entity types
  if (lastChipText === 'that have been') {
    return {
      current: ENTITY_TYPES.map(et => ({
        label: et.label,
        type: 'entityType',
        icon: et.icon,
        color: et.color
      })),
      next: [
        { label: 'for', icon: Clock, type: 'connector', preview: true }
      ],
      future: FILTER_OPTIONS.consecutiveMembershipYearsValues.slice(0, 4).map(t => ({
        label: t,
        preview: true
      }))
    };
  }

  // After entity type following "that have been" -> show "for"
  if (lastChip.type === 'entityType' && chips.some(c => c.text === 'that have been')) {
    return {
      current: [
        { label: 'for', icon: Clock, type: 'connector' }
      ],
      next: FILTER_OPTIONS.consecutiveMembershipYearsValues.slice(0, 6).map(t => ({
        label: t,
        preview: true
      })),
      future: [
        { label: 'and', icon: Plus, preview: true }
      ]
    };
  }

  // After "for" (in consecutive membership years context) -> show consecutive membership years values
  if (lastChipText === 'for' && chips.some(c => c.text === 'that have been')) {
    return {
      current: FILTER_OPTIONS.consecutiveMembershipYearsValues.map(t => ({
        label: t,
        type: 'consecutiveMembershipYears',
        icon: Clock,
        color: 'blue'
      })),
      next: [
        { label: 'and', icon: Plus, preview: true }
      ],
      future: [
        { label: 'with type', icon: Crown, preview: true },
        { label: 'occupation is', icon: Briefcase, preview: true }
      ]
    };
  }

  // After consecutive membership years value
  if (lastChip.type === 'consecutiveMembershipYears') {
    return {
      current: [
        { label: 'and', icon: Plus, type: 'connector' }
      ],
      next: [
        { label: 'with type', icon: Crown, preview: true },
        { label: 'occupation is', icon: Briefcase, preview: true },
        { label: 'from province/state', icon: MapPin, preview: true }
      ],
      future: FILTER_OPTIONS.membershipTypes.slice(0, 4).map(m => ({
        label: m,
        preview: true
      }))
    };
  }

  // After "that are" -> show membership types and statuses
  if (lastChipText === 'that are') {
    return {
      current: FILTER_OPTIONS.membershipTypes.map(m => ({
        label: m,
        type: 'membershipType',
        icon: Crown,
        color: 'purple'
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

  // After "with" -> show options for type, status, etc.
  if (lastChipText === 'with') {
    return {
      current: [
        { label: 'type', icon: Crown, type: 'subconnector' },
        { label: 'status', icon: Check, type: 'subconnector' },
        { label: 'attribute', icon: Star, type: 'subconnector' }
      ],
      next: FILTER_OPTIONS.membershipTypes.slice(0, 4).map(m => ({
        label: m,
        preview: true
      })),
      future: [
        { label: 'and', icon: Plus, preview: true }
      ]
    };
  }

  // After "in" -> show options for location, timeframe, etc.
  if (lastChipText === 'in') {
    return {
      current: [
        { label: 'location', icon: MapPin, type: 'subconnector' },
        { label: 'timeframe', icon: Calendar, type: 'subconnector' }
      ],
      next: FILTER_OPTIONS.locations.slice(0, 6).map(l => ({
        label: l,
        preview: true
      })),
      future: FILTER_OPTIONS.timeframes.slice(0, 4).map(t => ({
        label: t,
        preview: true
      }))
    };
  }

  // After "that" -> show general options
  if (lastChipText === 'that') {
    return {
      current: [
        { label: 'have', icon: ChevronRight, type: 'connector' },
        { label: 'are', icon: Filter, type: 'connector' },
        { label: 'renewed', icon: Calendar, type: 'action' },
        { label: 'joined', icon: UserPlus, type: 'action' }
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

  // After "for" (generic, not consecutive membership years context) -> show various time periods
  if (lastChipText === 'for' && !chips.some(c => c.text === 'that have been')) {
    return {
      current: [
        ...FILTER_OPTIONS.consecutiveMembershipYearsValues.map(t => ({
          label: t,
          type: 'timePeriod',
          icon: Clock,
          color: 'blue'
        })),
        { label: 'custom period', type: 'customPeriod', icon: Calendar, color: 'orange' }
      ],
      next: [
        { label: 'and', icon: Plus, preview: true }
      ],
      future: [
        { label: 'with type', preview: true },
        { label: 'in location', preview: true }
      ]
    };
  }

  // After "type" (subconnector from "with") -> show membership types
  if (lastChipText === 'type' && chips.some(c => c.text === 'with')) {
    return {
      current: FILTER_OPTIONS.membershipTypes.map(m => ({
        label: m,
        type: 'membershipType',
        icon: Crown,
        color: 'purple'
      })),
      next: [
        { label: 'and', icon: Plus, preview: true }
      ],
      future: [
        { label: 'occupation is', preview: true },
        { label: 'from province/state', preview: true }
      ]
    };
  }

  // After "status" (subconnector from "with") -> show statuses
  if (lastChipText === 'status' && chips.some(c => c.text === 'with')) {
    return {
      current: FILTER_OPTIONS.statuses.map(s => ({
        label: s,
        type: 'status',
        color: 'blue'
      })),
      next: [
        { label: 'and', icon: Plus, preview: true }
      ],
      future: [
        { label: 'that have', preview: true },
        { label: 'in location', preview: true }
      ]
    };
  }

  // After "attribute" (subconnector from "with") -> show attributes
  if (lastChipText === 'attribute' && chips.some(c => c.text === 'with')) {
    return {
      current: FILTER_OPTIONS.attributes.map(a => ({
        label: a.label,
        type: 'attribute',
        icon: a.icon,
        color: a.color
      })),
      next: [
        { label: 'in timeframe', icon: Calendar, preview: true }
      ],
      future: [
        { label: 'greater than', preview: true }
      ]
    };
  }

  // After "location" (subconnector from "in") -> show locations
  if (lastChipText === 'location' && chips.some(c => c.text === 'in')) {
    return {
      current: FILTER_OPTIONS.locations.map(l => ({
        label: l,
        type: 'location',
        icon: MapPin,
        color: 'red'
      })),
      next: [
        { label: 'and', icon: Plus, preview: true }
      ],
      future: [
        { label: 'with status', preview: true },
        { label: 'that have', preview: true }
      ]
    };
  }

  // After "timeframe" (subconnector from "in") -> show timeframes
  if (lastChipText === 'timeframe' && chips.some(c => c.text === 'in')) {
    return {
      current: FILTER_OPTIONS.timeframes.map(t => ({
        label: t,
        type: 'timeframe',
        icon: Calendar,
        color: 'orange'
      })),
      next: [
        { label: 'and', icon: Plus, preview: true }
      ],
      future: [
        { label: 'that have', preview: true },
        { label: 'in location', preview: true }
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
        { label: 'occupation is', icon: Briefcase, preview: true }
      ],
      future: [
        { label: 'from province/state', icon: MapPin, preview: true },
        { label: 'with a Degree:', icon: GraduationCap, preview: true }
      ]
    };
  }

  // After "occupation is" -> show occupation values
  if (lastChipText === 'occupation is') {
    return {
      current: FILTER_OPTIONS.occupations.map(o => ({
        label: o,
        type: 'occupation',
        icon: Briefcase,
        color: 'teal'
      })),
      next: [
        { label: 'with a Degree:', icon: GraduationCap, preview: true },
        { label: 'from province/state', icon: MapPin, preview: true }
      ],
      future: FILTER_OPTIONS.degrees.slice(0, 4).map(d => ({
        label: d,
        preview: true
      }))
    };
  }

  // After occupation value
  if (lastChip.type === 'occupation') {
    return {
      current: [
        { label: 'with a Degree:', icon: GraduationCap, type: 'connector' },
        { label: 'from province/state', icon: MapPin, type: 'connector' },
        { label: 'and', icon: Plus, type: 'connector' }
      ],
      next: FILTER_OPTIONS.degrees.slice(0, 6).map(d => ({
        label: d,
        preview: true
      })),
      future: [
        { label: 'from province/state', preview: true }
      ]
    };
  }

  // After "with a Degree:" -> show degree values
  if (lastChipText === 'with a Degree:') {
    return {
      current: FILTER_OPTIONS.degrees.map(d => ({
        label: d,
        type: 'degree',
        icon: GraduationCap,
        color: 'indigo'
      })),
      next: [
        { label: 'from province/state', icon: MapPin, preview: true },
        { label: 'and', icon: Plus, preview: true }
      ],
      future: FILTER_OPTIONS.provinces.slice(0, 4).map(p => ({
        label: p,
        preview: true
      }))
    };
  }

  // After degree value
  if (lastChip.type === 'degree') {
    return {
      current: [
        { label: 'from province/state', icon: MapPin, type: 'connector' },
        { label: 'and', icon: Plus, type: 'connector' }
      ],
      next: FILTER_OPTIONS.provinces.slice(0, 6).map(p => ({
        label: p,
        preview: true
      })),
      future: [
        { label: 'and', preview: true }
      ]
    };
  }

  // After "from province/state" -> show province codes
  if (lastChipText === 'from province/state') {
    return {
      current: FILTER_OPTIONS.provinces.map(p => ({
        label: p,
        type: 'province',
        icon: MapPin,
        color: 'red'
      })),
      next: [
        { label: 'and', icon: Plus, preview: true }
      ],
      future: []
    };
  }

  // After province value
  if (lastChip.type === 'province') {
    return {
      current: [
        { label: 'and', icon: Plus, type: 'connector' }
      ],
      next: [
        { label: 'occupation is', icon: Briefcase, preview: true },
        { label: 'who renewed in', icon: CalendarClock, preview: true }
      ],
      future: []
    };
  }

  // After "who renewed in" -> show months
  if (lastChipText === 'who renewed in') {
    return {
      current: FILTER_OPTIONS.renewalMonths.map(m => ({
        label: m,
        type: 'renewalMonth',
        icon: Calendar,
        color: 'orange'
      })),
      next: FILTER_OPTIONS.renewalYears.slice(0, 6).map(y => ({
        label: y,
        preview: true
      })),
      future: [
        { label: 'and', icon: Plus, preview: true }
      ]
    };
  }

  // After renewal month -> show year or "and"
  if (lastChip.type === 'renewalMonth') {
    return {
      current: FILTER_OPTIONS.renewalYears.map(y => ({
        label: y,
        type: 'renewalYear',
        icon: Calendar,
        color: 'orange'
      })),
      next: [
        { label: 'and', icon: Plus, preview: true }
      ],
      future: FILTER_OPTIONS.renewalMonths.slice(0, 4).map(m => ({
        label: m,
        preview: true
      }))
    };
  }

  // After renewal year
  if (lastChip.type === 'renewalYear') {
    return {
      current: [
        { label: 'and', icon: Plus, type: 'connector' }
      ],
      next: FILTER_OPTIONS.renewalMonths.slice(0, 6).map(m => ({
        label: m,
        preview: true
      })),
      future: []
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

  // After timeframe, location, status, membershipType, value, consecutiveMembershipYears, occupation, degree, province, renewalMonth, or renewalYear
  if (['timeframe', 'location', 'status', 'membershipType', 'value', 'consecutiveMembershipYears', 'occupation', 'degree', 'province'].includes(lastChip.type)) {
    return {
      current: [
        { label: 'and', icon: Plus, type: 'connector' },
        { label: 'sorted by', icon: TrendingUp, type: 'connector' }
      ],
      next: [
        { label: 'that have', icon: ChevronRight, preview: true },
        { label: 'occupation is', icon: Briefcase, preview: true },
        { label: 'with type', icon: Crown, preview: true }
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
        { label: 'with type', icon: Crown, type: 'connector' },
        { label: 'occupation is', icon: Briefcase, type: 'connector' },
        { label: 'with a Degree:', icon: GraduationCap, type: 'connector' },
        { label: 'from province/state', icon: MapPin, type: 'connector' },
        { label: 'who renewed in', icon: CalendarClock, type: 'connector' }
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
