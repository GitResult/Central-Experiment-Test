/**
 * Person Essential Phrase Search Configuration - NEW 3-COLUMN SYSTEM
 *
 * Contains all constants and logic for the 3-column phrase search feature in PersonEssential reports.
 * This system presents 3 columns simultaneously, where each column updates based on previous selections.
 *
 * Column Structure:
 * - Column 1: Categories/Timeframes/Actions/Connectors
 * - Column 2: Sub-categories/Values (context-dependent on Column 1)
 * - Column 3: Connectors/Values (context-dependent on Column 2)
 *
 * After completing a selection from Column 3, a NEW set of 3 columns appears.
 */

import {
  Users, Crown, Award, Mail, Calendar, DollarSign, MapPin,
  TrendingUp, Check, Plus, ChevronRight, Sparkles, X, Clock,
  GraduationCap, Briefcase, CalendarClock, UserMinus, Filter,
  Settings, Star, UserPlus
} from 'lucide-react';

import {
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
  isHierarchical
} from './phraseBuilderData';

// Re-export for backwards compatibility
export { TIMEFRAMES, YEAR_COHORTS, SUBJECTS, FILTER_CATEGORIES, ACTIONS, BROWSE_MODE_DATA };

// Legacy exports for backwards compatibility
export const STARTING_POINTS = [...TIMEFRAMES, ...YEAR_COHORTS];
export const ENTITY_TYPES = SUBJECTS;
export const FILTER_OPTIONS = BROWSE_MODE_DATA;

/**
 * 3-Column System Logic
 * Returns three columns of suggestions based on the current phrase chips
 *
 * @param {Array} chips - Current phrase chips
 * @returns {Object} Object with column1, column2, column3 arrays
 */
export const getThreeColumnsForPhrase = (chips) => {
  // ============================================================================
  // SET 1: Initial Selection (Timeframe → Subject → Connector)
  // ============================================================================

  // Stage 0: Empty query - Show all 3 columns pre-populated (anticipatory)
  if (chips.length === 0) {
    return {
      column1: [...TIMEFRAMES, ...YEAR_COHORTS].map(t => ({
        label: t.label,
        type: t.type,
        icon: t.icon,
        color: t.color,
        id: t.id
      })),
      column2: SUBJECTS.map(s => ({
        label: s.label,
        type: s.type,
        icon: s.icon,
        color: s.color,
        id: s.id
      })),
      column3: INITIAL_CONNECTORS.map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        id: c.id
      })),
      awaitingSelection: 'column1',
      context: 'initial'
    };
  }

  const lastChip = chips[chips.length - 1];
  const lastChipText = lastChip.text || lastChip.label;
  const lastChipType = lastChip.type;

  // Stage 1: After selecting timeframe/yearCohort - Show subjects in Column 2
  if (lastChipType === 'timeframe' || lastChipType === 'yearCohort') {
    // Check if this is the most recent chip (still in Set 1)
    if (chips.length === 1) {
      return {
        column1: [...TIMEFRAMES, ...YEAR_COHORTS].map((t, idx) => ({
          label: t.label,
          type: t.type,
          icon: t.icon,
          color: t.color,
          id: t.id,
          selected: t.label === lastChipText
        })),
        column2: SUBJECTS.map(s => ({
          label: s.label,
          type: s.type,
          icon: s.icon,
          color: s.color,
          id: s.id
        })),
        column3: [],
        awaitingSelection: 'column2',
        context: 'after_timeframe'
      };
    }
  }

  // Stage 2: After selecting subject - Show connectors in Column 3
  if (lastChipType === 'subject' && chips.length === 2) {
    return {
      column1: [...TIMEFRAMES, ...YEAR_COHORTS].map((t, idx) => ({
        label: t.label,
        type: t.type,
        icon: t.icon,
        color: t.color,
        id: t.id,
        selected: t.label === chips[0].text
      })),
      column2: SUBJECTS.map(s => ({
        label: s.label,
        type: s.type,
        icon: s.icon,
        color: s.color,
        id: s.id,
        selected: s.label === lastChipText
      })),
      column3: INITIAL_CONNECTORS.map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        id: c.id
      })),
      awaitingSelection: 'column3',
      context: 'after_subject'
    };
  }

  // ============================================================================
  // SET 2+: Filter Selection (After initial connector)
  // ============================================================================

  // After "that have" connector - NEW SET: Show all 3 columns pre-populated (anticipatory)
  if (lastChipText === 'that have' && chips.length === 3) {
    // Get subcategories for the first filter category (Member Stats)
    const firstCategory = FILTER_CATEGORIES[0];
    const subCats = firstCategory.isHierarchical ? getSubCategories(firstCategory.id) : [];

    // Get values for the first subcategory
    const firstSubCat = subCats.length > 0 ? subCats[0] : null;
    const values = firstSubCat && firstSubCat.values ? firstSubCat.values : [];

    return {
      column1: FILTER_CATEGORIES.map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        color: c.color,
        id: c.id
      })),
      column2: subCats.map(sc => ({
        label: sc.label,
        type: sc.type,
        id: sc.id
      })),
      column3: values.map(v => ({
        label: String(v),
        type: 'value',
        valueType: 'number'
      })),
      awaitingSelection: 'column1',
      context: 'filter_selection'
    };
  }

  // After "that are" connector - NEW SET: Show Member Type ONLY AND ANTICIPATE ALL 3 COLUMNS
  if (lastChipText === 'that are' && chips.length === 3) {
    const filteredCategories = FILTER_CATEGORIES.filter(c => c.id === 'member_type');
    const memberTypes = getBrowseModeData('memberTypes');

    return {
      column1: filteredCategories.map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        color: c.color,
        id: c.id
      })),
      column2: memberTypes.map(mt => ({
        label: mt.label,
        type: 'value',
        valueType: 'memberType',
        id: mt.id
      })),
      column3: LOGICAL_CONNECTORS.map(lc => ({
        label: lc.label,
        type: lc.type,
        icon: lc.icon,
        id: lc.id
      })),
      awaitingSelection: 'column1',
      context: 'that_are_filter'
    };
  }

  // After "for" connector - NEW SET: Show Member Year and Member Type AND ANTICIPATE ALL 3 COLUMNS
  if (lastChipText === 'for' && chips.length === 3) {
    const memberYears = getBrowseModeData('memberYears');

    return {
      column1: [
        FILTER_CATEGORIES.find(c => c.id === 'member_year'),
        FILTER_CATEGORIES.find(c => c.id === 'member_type')
      ].filter(Boolean).map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        color: c.color,
        id: c.id
      })),
      column2: memberYears.map(my => ({
        label: my.label,
        type: 'value',
        valueType: 'memberYear',
        id: my.id
      })),
      column3: [
        {
          label: 'that have',
          type: 'connector',
          icon: ChevronRight,
          id: 'that_have'
        },
        {
          label: 'and',
          type: 'logical_connector',
          icon: Plus,
          id: 'and'
        }
      ],
      awaitingSelection: 'column1',
      context: 'for_filter'
    };
  }

  // After selecting "Member Stats" category - Show sub-categories in Column 2
  if (lastChipType === 'category' && lastChip.id === 'member_stats') {
    const subCats = getSubCategories('member_stats');
    return {
      column1: FILTER_CATEGORIES.map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        color: c.color,
        id: c.id,
        selected: c.id === 'member_stats'
      })),
      column2: subCats.map(sc => ({
        label: sc.label,
        type: sc.type,
        id: sc.id
      })),
      column3: [],
      awaitingSelection: 'column2',
      context: 'member_stats_subcategory'
    };
  }

  // After selecting "Consecutive Membership Years" subcategory - Show values in Column 3
  if (lastChipType === 'subcategory' && lastChip.id === 'consecutive_membership_years') {
    const subCats = getSubCategories('member_stats');
    const selectedSubCat = subCats.find(sc => sc.id === 'consecutive_membership_years');
    return {
      column1: FILTER_CATEGORIES.map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        color: c.color,
        id: c.id,
        selected: c.id === 'member_stats'
      })),
      column2: subCats.map(sc => ({
        label: sc.label,
        type: sc.type,
        id: sc.id,
        selected: sc.id === 'consecutive_membership_years'
      })),
      column3: selectedSubCat.values.map(v => ({
        label: String(v),
        type: 'value',
        valueType: 'number'
      })),
      awaitingSelection: 'column3',
      context: 'consecutive_years_value'
    };
  }

  // After selecting a number value (from Member Stats) - Show ALL CONNECTORS in Column 1 AND ANTICIPATE ALL 3 COLUMNS
  if (lastChipType === 'value' && lastChip.valueType === 'number') {
    // Get first category's subcategories for anticipation
    const firstCategory = FILTER_CATEGORIES[0];
    const subCats = firstCategory && firstCategory.isHierarchical ? getSubCategories(firstCategory.id) : [];

    // Get first subcategory's values for anticipation
    const firstSubCat = subCats.length > 0 ? subCats[0] : null;
    const values = firstSubCat && firstSubCat.values ? firstSubCat.values : [];

    // Combine logical connectors with "that have" to give more flexibility
    const allConnectors = [
      ...LOGICAL_CONNECTORS,
      ...INITIAL_CONNECTORS.filter(c => c.id === 'that_have')
    ];

    return {
      column1: allConnectors.map(lc => ({
        label: lc.label,
        type: lc.type,
        icon: lc.icon,
        id: lc.id
      })),
      column2: FILTER_CATEGORIES.map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        color: c.color,
        id: c.id
      })),
      column3: subCats.map(sc => ({
        label: sc.label,
        type: sc.type,
        id: sc.id
      })),
      awaitingSelection: 'column1',
      context: 'after_number_value'
    };
  }

  // After selecting "Member Type" category - Show member types from browse mode in Column 2
  // AND anticipate connectors in Column 3 (since member types have no children)
  if (lastChipType === 'category' && lastChip.id === 'member_type') {
    const memberTypes = getBrowseModeData('memberTypes');
    return {
      column1: FILTER_CATEGORIES.map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        color: c.color,
        id: c.id,
        selected: c.id === 'member_type'
      })),
      column2: memberTypes.map(mt => ({
        label: mt.label,
        type: 'value',
        valueType: 'memberType',
        id: mt.id
      })),
      column3: LOGICAL_CONNECTORS.map(lc => ({
        label: lc.label,
        type: lc.type,
        icon: lc.icon,
        id: lc.id
      })),
      awaitingSelection: 'column2',
      context: 'member_type_value'
    };
  }

  // After selecting a member type value - Show "And"/"Or" connectors in Column 3
  if (lastChipType === 'value' && lastChip.valueType === 'memberType') {
    // Find the previous category selection
    const memberTypeChipIndex = chips.findIndex(c => c.id === 'member_type');
    const memberTypes = getBrowseModeData('memberTypes');

    return {
      column1: FILTER_CATEGORIES.map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        color: c.color,
        id: c.id,
        selected: c.id === 'member_type'
      })),
      column2: memberTypes.map(mt => ({
        label: mt.label,
        type: 'value',
        valueType: 'memberType',
        id: mt.id,
        selected: mt.label === lastChipText
      })),
      column3: LOGICAL_CONNECTORS.map(lc => ({
        label: lc.label,
        type: lc.type,
        icon: lc.icon,
        id: lc.id
      })),
      awaitingSelection: 'column3',
      context: 'after_member_type_value'
    };
  }

  // After selecting "Member Year" category - Show years from browse mode in Column 2
  if (lastChipType === 'category' && lastChip.id === 'member_year') {
    const memberYears = getBrowseModeData('memberYears');
    return {
      column1: [
        FILTER_CATEGORIES.find(c => c.id === 'member_year'),
        FILTER_CATEGORIES.find(c => c.id === 'member_type')
      ].filter(Boolean).map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        color: c.color,
        id: c.id,
        selected: c.id === 'member_year'
      })),
      column2: memberYears.map(my => ({
        label: my.label,
        type: 'value',
        valueType: 'memberYear',
        id: my.id
      })),
      column3: [],
      awaitingSelection: 'column2',
      context: 'member_year_value'
    };
  }

  // After selecting a member year value - Show "that have" connector in Column 3
  if (lastChipType === 'value' && lastChip.valueType === 'memberYear') {
    const memberYears = getBrowseModeData('memberYears');

    return {
      column1: [
        FILTER_CATEGORIES.find(c => c.id === 'member_year'),
        FILTER_CATEGORIES.find(c => c.id === 'member_type')
      ].filter(Boolean).map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        color: c.color,
        id: c.id,
        selected: c.id === 'member_year'
      })),
      column2: memberYears.map(my => ({
        label: my.label,
        type: 'value',
        valueType: 'memberYear',
        id: my.id,
        selected: my.label === lastChipText
      })),
      column3: [
        {
          label: 'that have',
          type: 'connector',
          icon: ChevronRight,
          id: 'that_have',
          order: 1
        },
        {
          label: 'and',
          type: 'logical_connector',
          icon: Plus,
          id: 'and',
          order: 2
        }
      ],
      awaitingSelection: 'column3',
      context: 'after_member_year_value'
    };
  }

  // After "And" or "Or" connector - NEW SET: Show available filter categories AND ANTICIPATE ALL 3 COLUMNS
  // Column 2 and 3 should show items based on FIRST item in Column 1
  if (lastChipType === 'logical_connector') {
    // Determine which categories are still available based on context
    const availableCategories = FILTER_CATEGORIES.filter(c => {
      // Customize based on query context
      return true; // For now, show all
    });

    // Get subcategories and values for the first category (Member Stats)
    const firstCategory = availableCategories[0];
    const subCats = firstCategory && firstCategory.isHierarchical ? getSubCategories(firstCategory.id) : [];

    // Get values for the first subcategory
    const firstSubCat = subCats.length > 0 ? subCats[0] : null;
    const values = firstSubCat && firstSubCat.values ? firstSubCat.values : [];

    return {
      column1: availableCategories.map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        color: c.color,
        id: c.id
      })),
      column2: subCats.map(sc => ({
        label: sc.label,
        type: sc.type,
        id: sc.id
      })),
      column3: values.map(v => ({
        label: String(v),
        type: 'value',
        valueType: 'number'
      })),
      awaitingSelection: 'column1',
      context: 'after_logical_connector'
    };
  }

  // After selecting "Occupation" category - Show occupations from browse mode in Column 2
  // AND anticipate connectors in Column 3 (since occupations have no children)
  if (lastChipType === 'category' && lastChip.id === 'occupation') {
    const occupations = getBrowseModeData('occupations');
    return {
      column1: FILTER_CATEGORIES.map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        color: c.color,
        id: c.id,
        selected: c.id === 'occupation'
      })),
      column2: occupations.map(o => ({
        label: o.label,
        type: 'value',
        valueType: 'occupation',
        id: o.id
      })),
      column3: LOGICAL_CONNECTORS.map(lc => ({
        label: lc.label,
        type: lc.type,
        icon: lc.icon,
        id: lc.id
      })),
      awaitingSelection: 'column2',
      context: 'occupation_value'
    };
  }

  // After selecting an occupation value - Show "And"/"Or" connectors in Column 3
  if (lastChipType === 'value' && lastChip.valueType === 'occupation') {
    const occupations = getBrowseModeData('occupations');

    return {
      column1: FILTER_CATEGORIES.map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        color: c.color,
        id: c.id,
        selected: c.id === 'occupation'
      })),
      column2: occupations.map(o => ({
        label: o.label,
        type: 'value',
        valueType: 'occupation',
        id: o.id,
        selected: o.label === lastChipText
      })),
      column3: LOGICAL_CONNECTORS.map(lc => ({
        label: lc.label,
        type: lc.type,
        icon: lc.icon,
        id: lc.id
      })),
      awaitingSelection: 'column3',
      context: 'after_occupation_value'
    };
  }

  // After selecting "Degree" category - Show degrees from browse mode in Column 2
  // AND anticipate connectors in Column 3 (since degrees have no children)
  if (lastChipType === 'category' && lastChip.id === 'degree') {
    const degrees = getBrowseModeData('degrees');
    return {
      column1: FILTER_CATEGORIES.map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        color: c.color,
        id: c.id,
        selected: c.id === 'degree'
      })),
      column2: degrees.map(d => ({
        label: d.label,
        type: 'value',
        valueType: 'degree',
        id: d.id
      })),
      column3: LOGICAL_CONNECTORS.map(lc => ({
        label: lc.label,
        type: lc.type,
        icon: lc.icon,
        id: lc.id
      })),
      awaitingSelection: 'column2',
      context: 'degree_value'
    };
  }

  // After selecting a degree value - Show "And"/"Or" connectors in Column 3
  if (lastChipType === 'value' && lastChip.valueType === 'degree') {
    const degrees = getBrowseModeData('degrees');

    return {
      column1: FILTER_CATEGORIES.map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        color: c.color,
        id: c.id,
        selected: c.id === 'degree'
      })),
      column2: degrees.map(d => ({
        label: d.label,
        type: 'value',
        valueType: 'degree',
        id: d.id,
        selected: d.label === lastChipText
      })),
      column3: LOGICAL_CONNECTORS.map(lc => ({
        label: lc.label,
        type: lc.type,
        icon: lc.icon,
        id: lc.id
      })),
      awaitingSelection: 'column3',
      context: 'after_degree_value'
    };
  }

  // After selecting "Province/State" category - Show provinces from browse mode in Column 2
  // AND anticipate connectors in Column 3 (since provinces have no children)
  if (lastChipType === 'category' && lastChip.id === 'province_state') {
    const provinces = getBrowseModeData('provinces');
    return {
      column1: FILTER_CATEGORIES.map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        color: c.color,
        id: c.id,
        selected: c.id === 'province_state'
      })),
      column2: provinces.map(p => ({
        label: p.label,
        type: 'value',
        valueType: 'province',
        id: p.id
      })),
      column3: LOGICAL_CONNECTORS.map(lc => ({
        label: lc.label,
        type: lc.type,
        icon: lc.icon,
        id: lc.id
      })),
      awaitingSelection: 'column2',
      context: 'province_value'
    };
  }

  // After selecting a province value - Query can be complete or continue with "And"
  if (lastChipType === 'value' && lastChip.valueType === 'province') {
    const provinces = getBrowseModeData('provinces');

    return {
      column1: FILTER_CATEGORIES.map(c => ({
        label: c.label,
        type: c.type,
        icon: c.icon,
        color: c.color,
        id: c.id,
        selected: c.id === 'province_state'
      })),
      column2: provinces.map(p => ({
        label: p.label,
        type: 'value',
        valueType: 'province',
        id: p.id,
        selected: p.label === lastChipText
      })),
      column3: [
        {
          label: 'And',
          type: 'logical_connector',
          icon: Plus,
          id: 'and'
        },
        {
          label: '(Query Complete)',
          type: 'complete',
          icon: Check,
          id: 'complete'
        }
      ],
      awaitingSelection: 'column3',
      context: 'after_province_value'
    };
  }

  // ============================================================================
  // SPECIAL CASE: Renewed Action Flow
  // ============================================================================

  // After "that have" connector in renewal context - Show "Renewed" action ONLY
  // Column 2 and 3 should be EMPTY until user selects an action
  if (lastChipText === 'that have' && chips.length > 3) {
    // Check if we're in a Member Year context
    const hasMemberYear = chips.some(c => c.valueType === 'memberYear');
    if (hasMemberYear) {
      return {
        column1: ACTIONS.map(a => ({
          label: a.label,
          type: a.type,
          icon: a.icon,
          color: a.color,
          id: a.id
        })),
        column2: [], // Empty until action is selected
        column3: [], // Empty until action connector is selected
        awaitingSelection: 'column1',
        context: 'action_selection'
      };
    }
  }

  // After selecting "Renewed" action - Show action connectors in Column 2
  if (lastChipType === 'action' && lastChip.id === 'renewed') {
    const actionConnectors = getActionConnectors('renewed');
    return {
      column1: ACTIONS.map(a => ({
        label: a.label,
        type: a.type,
        icon: a.icon,
        color: a.color,
        id: a.id,
        selected: a.id === 'renewed'
      })),
      column2: actionConnectors.map(ac => ({
        label: ac.label,
        type: ac.type,
        id: ac.id,
        enablesMultiSelect: ac.enablesMultiSelect
      })),
      column3: [],
      awaitingSelection: 'column2',
      context: 'renewed_connector'
    };
  }

  // After selecting "in" action connector - Show month+year combinations in Column 3
  if (lastChipType === 'action_connector' && lastChip.id === 'in') {
    // Get the member year from chips
    const memberYearChip = chips.find(c => c.valueType === 'memberYear');
    const baseYear = memberYearChip ? parseInt(memberYearChip.text) : 2019;

    const monthYearOptions = generateMonthYearOptions(baseYear - 1, 6); // Generate 6 months starting from December of previous year
    const actionConnectors = getActionConnectors('renewed');

    return {
      column1: ACTIONS.map(a => ({
        label: a.label,
        type: a.type,
        icon: a.icon,
        color: a.color,
        id: a.id,
        selected: a.id === 'renewed'
      })),
      column2: actionConnectors.map(ac => ({
        label: ac.label,
        type: ac.type,
        id: ac.id,
        enablesMultiSelect: ac.enablesMultiSelect,
        selected: ac.id === 'in'
      })),
      column3: monthYearOptions.map(my => ({
        label: my.label,
        type: 'value',
        valueType: 'monthYear',
        id: my.id
      })),
      awaitingSelection: 'column3',
      context: 'renewal_month_year'
    };
  }

  // After selecting a month+year value with "in" - Show "or" and "for" options ONLY
  // Column 2 and 3 should be EMPTY until user selects from Column 1
  if (lastChipType === 'value' && lastChip.valueType === 'monthYear') {
    // Check if there's an "in" connector before this
    const hasInConnector = chips.some(c => c.id === 'in');

    if (hasInConnector) {
      return {
        column1: [
          {
            label: 'or',
            type: 'logical_connector',
            icon: Plus,
            id: 'or',
            order: 1
          },
          {
            label: 'for',
            type: 'connector',
            icon: Clock,
            id: 'for',
            order: 2
          }
        ],
        column2: [], // Empty until "or" or "for" is selected
        column3: [], // Empty until column 2 is populated and selected
        awaitingSelection: 'column1',
        context: 'after_renewal_month_year'
      };
    }
  }

  // After selecting "or" in renewal context - Show month+year options again in Column 2
  if (lastChipType === 'logical_connector' && lastChip.id === 'or') {
    const hasPreviousMonthYear = chips.filter(c => c.valueType === 'monthYear').length > 0;

    if (hasPreviousMonthYear) {
      const memberYearChip = chips.find(c => c.valueType === 'memberYear');
      const baseYear = memberYearChip ? parseInt(memberYearChip.text) : 2019;
      const monthYearOptions = generateMonthYearOptions(baseYear - 1, 6);

      return {
        column1: [
          {
            label: 'or',
            type: 'logical_connector',
            icon: Plus,
            id: 'or',
            order: 1,
            selected: true
          },
          {
            label: 'for',
            type: 'connector',
            icon: Clock,
            id: 'for',
            order: 2
          }
        ],
        column2: monthYearOptions.map(my => ({
          label: my.label,
          type: 'value',
          valueType: 'monthYear',
          id: my.id
        })),
        column3: [],
        awaitingSelection: 'column2',
        context: 'renewal_or_month_year'
      };
    }
  }

  // After selecting second month+year with "or" - Show "for" in Column 3
  if (lastChipType === 'value' && lastChip.valueType === 'monthYear' && chips.filter(c => c.valueType === 'monthYear').length === 2) {
    const memberYearChip = chips.find(c => c.valueType === 'memberYear');
    const baseYear = memberYearChip ? parseInt(memberYearChip.text) : 2019;
    const monthYearOptions = generateMonthYearOptions(baseYear - 1, 6);

    return {
      column1: [
        {
          label: 'or',
          type: 'logical_connector',
          icon: Plus,
          id: 'or',
          order: 1,
          selected: true
        },
        {
          label: 'for',
          type: 'connector',
          icon: Clock,
          id: 'for',
          order: 2
        }
      ],
      column2: monthYearOptions.map(my => ({
        label: my.label,
        type: 'value',
        valueType: 'monthYear',
        id: my.id,
        selected: my.label === lastChipText
      })),
      column3: [
        {
          label: 'for',
          type: 'connector',
          icon: Clock,
          id: 'for'
        }
      ],
      awaitingSelection: 'column3',
      context: 'after_second_renewal_month'
    };
  }

  // After "for" connector in renewal target year context - Show Member Year category ONLY
  // Column 2 and 3 should be EMPTY until user selects Member Year
  if (lastChipText === 'for' && chips.filter(c => c.valueType === 'monthYear').length > 0) {
    return {
      column1: [
        {
          label: 'Member Year',
          type: 'category',
          icon: Calendar,
          color: 'indigo',
          id: 'member_year'
        }
      ],
      column2: [], // Empty until Member Year category is selected
      column3: [], // Empty until year value is selected
      awaitingSelection: 'column1',
      context: 'renewal_target_year'
    };
  }

  // ============================================================================
  // DEFAULT FALLBACK
  // ============================================================================

  // Default fallback - Show available categories
  return {
    column1: FILTER_CATEGORIES.map(c => ({
      label: c.label,
      type: c.type,
      icon: c.icon,
      color: c.color,
      id: c.id
    })),
    column2: [],
    column3: [],
    awaitingSelection: 'column1',
    context: 'default'
  };
};

// Legacy function for backwards compatibility
export const getSuggestionsForPhrase = (chips) => {
  const result = getThreeColumnsForPhrase(chips);

  // Convert 3-column format to old format
  return {
    current: result.column1 || [],
    next: result.column2 || [],
    future: result.column3 || []
  };
};
