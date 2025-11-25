/**
 * Phrase Builder Data Configuration
 *
 * This file contains all the data structures and browse mode integration data
 * for the 3-column phrase builder system.
 */

import {
  Users, Crown, Award, Mail, Calendar, DollarSign, MapPin,
  TrendingUp, Check, Plus, ChevronRight, Sparkles, X, Clock,
  GraduationCap, Briefcase, CalendarClock, UserMinus, Filter,
  Settings, Star, UserPlus, Activity
} from 'lucide-react';

// ============================================================================
// STARTING POINTS (Column 1 - Initial Selection)
// ============================================================================

export const TIMEFRAMES = [
  {
    id: 'current',
    label: 'Current',
    icon: Users,
    color: 'blue',
    type: 'timeframe',
    order: 1
  },
  {
    id: 'previous',
    label: 'Previous',
    icon: Clock,
    color: 'orange',
    type: 'timeframe',
    order: 2
  },
  {
    id: 'new',
    label: 'New',
    icon: Sparkles,
    color: 'green',
    type: 'timeframe',
    order: 3
  },
  {
    id: 'lapsed',
    label: 'Lapsed',
    icon: UserMinus,
    color: 'red',
    type: 'timeframe',
    order: 4
  }
];

export const YEAR_COHORTS = [
  { id: '2024', label: '2024', icon: Calendar, color: 'indigo', type: 'yearCohort' },
  { id: '2023', label: '2023', icon: Calendar, color: 'indigo', type: 'yearCohort' },
  { id: '2022', label: '2022', icon: Calendar, color: 'indigo', type: 'yearCohort' },
  { id: '2021', label: '2021', icon: Calendar, color: 'indigo', type: 'yearCohort' },
  { id: '2020', label: '2020', icon: Calendar, color: 'indigo', type: 'yearCohort' },
  { id: '2019', label: '2019', icon: Calendar, color: 'indigo', type: 'yearCohort' }
];

// ============================================================================
// SUBJECTS (Column 2 after Timeframe selection)
// ============================================================================

export const SUBJECTS = [
  { id: 'members', label: 'Members', icon: Crown, color: 'purple', type: 'subject', order: 1 },
  { id: 'orders', label: 'Orders', icon: DollarSign, color: 'green', type: 'subject', order: 2 },
  { id: 'events', label: 'Events', icon: Calendar, color: 'blue', type: 'subject', order: 3 },
  { id: 'donations', label: 'Donations', icon: Award, color: 'orange', type: 'subject', order: 4 },
  { id: 'emails', label: 'Emails', icon: Mail, color: 'indigo', type: 'subject', order: 5 }
];

// ============================================================================
// CONNECTORS (Column 3 after Subject selection)
// ============================================================================

export const INITIAL_CONNECTORS = [
  {
    id: 'that_have',
    label: 'that have',
    icon: ChevronRight,
    type: 'connector',
    order: 1,
    context: 'after_subject'
  },
  {
    id: 'that_are',
    label: 'that are',
    icon: Filter,
    type: 'connector',
    order: 2,
    context: 'after_subject'
  },
  {
    id: 'for',
    label: 'for',
    icon: Clock,
    type: 'connector',
    order: 3,
    context: 'after_subject'
  }
];

export const LOGICAL_CONNECTORS = [
  {
    id: 'and',
    label: 'And',
    icon: Plus,
    type: 'logical_connector',
    order: 1
  },
  {
    id: 'or',
    label: 'Or',
    icon: Plus,
    type: 'logical_connector',
    order: 2
  }
];

// ============================================================================
// FILTER CATEGORIES (Column 1 in Set 2+)
// ============================================================================

export const FILTER_CATEGORIES = [
  {
    id: 'member_stats',
    label: 'Member Stats',
    icon: Activity,
    color: 'blue',
    type: 'category',
    order: 1,
    isHierarchical: true,
    subCategories: [
      {
        id: 'consecutive_membership_years',
        label: 'Consecutive Membership Years',
        type: 'subcategory',
        valueType: 'number',
        values: [1, 2, 3, 5, 10, 15],
        order: 1
      },
      {
        id: 'total_revenue',
        label: 'Total Revenue',
        type: 'subcategory',
        valueType: 'currency',
        order: 2
      },
      {
        id: 'event_attendance',
        label: 'Event Attendance',
        type: 'subcategory',
        valueType: 'number',
        order: 3
      },
      {
        id: 'donation_count',
        label: 'Donation Count',
        type: 'subcategory',
        valueType: 'number',
        order: 4
      }
    ]
  },
  {
    id: 'member_type',
    label: 'Member Type',
    icon: Crown,
    color: 'purple',
    type: 'category',
    order: 2,
    browseMode: 'memberTypes'
  },
  {
    id: 'member_year',
    label: 'Member Year',
    icon: Calendar,
    color: 'indigo',
    type: 'category',
    order: 3,
    browseMode: 'memberYears'
  },
  {
    id: 'occupation',
    label: 'Occupation',
    icon: Briefcase,
    color: 'teal',
    type: 'category',
    order: 4,
    browseMode: 'occupations'
  },
  {
    id: 'degree',
    label: 'Degree',
    icon: GraduationCap,
    color: 'indigo',
    type: 'category',
    order: 5,
    browseMode: 'degrees'
  },
  {
    id: 'province_state',
    label: 'Province/State',
    icon: MapPin,
    color: 'red',
    type: 'category',
    order: 6,
    browseMode: 'provinces'
  }
];

// ============================================================================
// ACTIONS (Special filter types)
// ============================================================================

export const ACTIONS = [
  {
    id: 'renewed',
    label: 'Renewed',
    icon: CalendarClock,
    color: 'green',
    type: 'action',
    order: 1,
    actionConnectors: [
      {
        id: 'in',
        label: 'in',
        type: 'action_connector',
        order: 1,
        enablesMultiSelect: true, // Enables "or" logic
        valueType: 'month_year'
      },
      {
        id: 'from',
        label: 'from',
        type: 'action_connector',
        order: 2,
        valueType: 'date_range'
      },
      {
        id: 'for',
        label: 'for',
        type: 'action_connector',
        order: 3,
        valueType: 'year'
      }
    ]
  },
  {
    id: 'joined',
    label: 'Joined',
    icon: UserPlus,
    color: 'blue',
    type: 'action',
    order: 2
  },
  {
    id: 'donated',
    label: 'Donated',
    icon: Award,
    color: 'orange',
    type: 'action',
    order: 3
  }
];

// ============================================================================
// BROWSE MODE DATA (Values from database/browse mode)
// ============================================================================

export const BROWSE_MODE_DATA = {
  // Member Types from Browse Mode
  memberTypes: [
    { id: 'ecy1', label: 'ECY1 - Member Early Career Year 1', code: 'ECY1', order: 1 },
    { id: 'ecy2', label: 'ECY2 - Member Early Career Year 2', code: 'ECY2', order: 2 },
    { id: 'ecy3', label: 'ECY3 - Member Early Career Year 3', code: 'ECY3', order: 3 },
    { id: 'stu1', label: 'STU1 - Student Year 1', code: 'STU1', order: 4 },
    { id: 'stu2', label: 'STU2 - Student Year 2', code: 'STU2', order: 5 },
    { id: 'prof1', label: 'PROF1 - Professional Year 1', code: 'PROF1', order: 6 },
    { id: 'prof2', label: 'PROF2 - Professional Year 2', code: 'PROF2', order: 7 },
    { id: 'corp1', label: 'CORP1 - Corporate', code: 'CORP1', order: 8 },
    { id: 'individual', label: 'Individual', code: 'IND', order: 9 },
    { id: 'professional', label: 'Professional', code: 'PROF', order: 10 },
    { id: 'corporate', label: 'Corporate', code: 'CORP', order: 11 },
    { id: 'student', label: 'Student', code: 'STU', order: 12 },
    { id: 'senior', label: 'Senior', code: 'SEN', order: 13 },
    { id: 'family', label: 'Family', code: 'FAM', order: 14 },
    { id: 'lifetime', label: 'Lifetime', code: 'LIFE', order: 15 },
    { id: 'honorary', label: 'Honorary', code: 'HON', order: 16 }
  ],

  // Occupations from Browse Mode
  occupations: [
    { id: 'practitioner', label: 'Practitioner', order: 1 },
    { id: 'educator', label: 'Educator', order: 2 },
    { id: 'researcher', label: 'Researcher', order: 3 },
    { id: 'administrator', label: 'Administrator', order: 4 },
    { id: 'consultant', label: 'Consultant', order: 5 },
    { id: 'manager', label: 'Manager', order: 6 },
    { id: 'director', label: 'Director', order: 7 },
    { id: 'specialist', label: 'Specialist', order: 8 },
    { id: 'coordinator', label: 'Coordinator', order: 9 }
  ],

  // Degrees from Browse Mode
  degrees: [
    { id: 'masters', label: 'Masters', order: 1 },
    { id: 'bachelors', label: 'Bachelors', order: 2 },
    { id: 'doctorate', label: 'Doctorate', order: 3 },
    { id: 'phd', label: 'PhD', order: 4 },
    { id: 'mba', label: 'MBA', order: 5 },
    { id: 'certificate', label: 'Certificate', order: 6 },
    { id: 'diploma', label: 'Diploma', order: 7 },
    { id: 'associate', label: 'Associate', order: 8 }
  ],

  // Provinces from Browse Mode
  provinces: [
    { id: 'on', label: 'ON', fullName: 'Ontario', order: 1 },
    { id: 'bc', label: 'BC', fullName: 'British Columbia', order: 2 },
    { id: 'ab', label: 'AB', fullName: 'Alberta', order: 3 },
    { id: 'qc', label: 'QC', fullName: 'Quebec', order: 4 },
    { id: 'mb', label: 'MB', fullName: 'Manitoba', order: 5 },
    { id: 'sk', label: 'SK', fullName: 'Saskatchewan', order: 6 },
    { id: 'ns', label: 'NS', fullName: 'Nova Scotia', order: 7 },
    { id: 'nb', label: 'NB', fullName: 'New Brunswick', order: 8 },
    { id: 'pe', label: 'PE', fullName: 'Prince Edward Island', order: 9 },
    { id: 'nl', label: 'NL', fullName: 'Newfoundland and Labrador', order: 10 }
  ],

  // Member Years from Browse Mode (dynamic - generated from current year back)
  memberYears: [
    { id: '2024', label: '2024', order: 1 },
    { id: '2023', label: '2023', order: 2 },
    { id: '2022', label: '2022', order: 3 },
    { id: '2021', label: '2021', order: 4 },
    { id: '2020', label: '2020', order: 5 },
    { id: '2019', label: '2019', order: 6 },
    { id: '2018', label: '2018', order: 7 },
    { id: '2017', label: '2017', order: 8 }
  ],

  // Months for renewal queries
  months: [
    { id: 'january', label: 'January', order: 1 },
    { id: 'february', label: 'February', order: 2 },
    { id: 'march', label: 'March', order: 3 },
    { id: 'april', label: 'April', order: 4 },
    { id: 'may', label: 'May', order: 5 },
    { id: 'june', label: 'June', order: 6 },
    { id: 'july', label: 'July', order: 7 },
    { id: 'august', label: 'August', order: 8 },
    { id: 'september', label: 'September', order: 9 },
    { id: 'october', label: 'October', order: 10 },
    { id: 'november', label: 'November', order: 11 },
    { id: 'december', label: 'December', order: 12 }
  ]
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate month+year combinations for renewal queries
 * @param {number} baseYear - The base year (e.g., 2019)
 * @param {number} count - Number of months to generate (default 6)
 * @returns {Array} Array of month+year combinations
 */
export function generateMonthYearOptions(baseYear, count = 6) {
  const result = [];
  const months = BROWSE_MODE_DATA.months;

  // Start from December of baseYear
  let year = baseYear;
  let monthIndex = 11; // December is index 11

  for (let i = 0; i < count; i++) {
    result.push({
      id: `${months[monthIndex].id}_${year}`,
      label: `${months[monthIndex].label} ${year}`,
      month: months[monthIndex].label,
      year: year,
      order: i + 1
    });

    // Move to next month
    monthIndex++;
    if (monthIndex >= months.length) {
      monthIndex = 0;
      year++;
    }
  }

  return result;
}

/**
 * Get browse mode data for a specific category
 * @param {string} category - The category name (e.g., 'memberTypes')
 * @returns {Array} Array of browse mode data items
 */
export function getBrowseModeData(category) {
  return BROWSE_MODE_DATA[category] || [];
}

/**
 * Get sub-categories for a hierarchical category
 * @param {string} categoryId - The category ID (e.g., 'member_stats')
 * @returns {Array} Array of sub-categories
 */
export function getSubCategories(categoryId) {
  const category = FILTER_CATEGORIES.find(c => c.id === categoryId);
  return category?.subCategories || [];
}

/**
 * Get action connectors for a specific action
 * @param {string} actionId - The action ID (e.g., 'renewed')
 * @returns {Array} Array of action connectors
 */
export function getActionConnectors(actionId) {
  const action = ACTIONS.find(a => a.id === actionId);
  return action?.actionConnectors || [];
}

/**
 * Check if a category is hierarchical
 * @param {string} categoryId - The category ID
 * @returns {boolean} True if hierarchical
 */
export function isHierarchical(categoryId) {
  const category = FILTER_CATEGORIES.find(c => c.id === categoryId);
  return category?.isHierarchical || false;
}

/**
 * Get available filter categories based on context
 * @param {Object} context - Current query context
 * @returns {Array} Array of available filter categories
 */
export function getAvailableCategories(context) {
  // This can be enhanced to filter categories based on what's already been used
  return FILTER_CATEGORIES;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  TIMEFRAMES,
  YEAR_COHORTS,
  SUBJECTS,
  INITIAL_CONNECTORS,
  LOGICAL_CONNECTORS,
  FILTER_CATEGORIES,
  ACTIONS,
  BROWSE_MODE_DATA,
  generateMonthYearOptions,
  getBrowseModeData,
  getSubCategories,
  getActionConnectors,
  isHierarchical,
  getAvailableCategories
};
