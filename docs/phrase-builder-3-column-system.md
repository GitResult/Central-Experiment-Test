# 3-Column Phrase Builder System - Comprehensive Documentation

## Overview

The phrase builder uses a **3-column simultaneous display system** where users progressively build queries by making selections across three columns. After completing a selection from Column 3, a NEW set of 3 columns appears based on the context.

## Core Concept

### Column Structure
- **Column 1:** Primary Categories (Timeframes, Subjects, Filter Categories, Actions, Connectors)
- **Column 2:** Sub-categories or Values (context-dependent on Column 1 selection)
- **Column 3:** Connectors, Values, or Actions (context-dependent on Column 2 selection)

### Progressive Selection Flow
1. User selects from Column 1 → Column 2 updates with relevant options
2. User selects from Column 2 → Column 3 updates with relevant options
3. User selects from Column 3 → **NEW set of 3 columns appears**
4. Repeat until query is complete

---

## Base Query 1: Member Stats Query

### Final Phrase
```
[Current][Members] [that have][Member Stats: Consecutive Membership Years= 5]
```

### Selection Flow

#### Set 1: Initial Selection
| Column 1 (Timeframes) | Column 2 (Subjects) | Column 3 (Connectors) |
|----------------------|-------------------|---------------------|
| **Current** (selected) | - | - |
| Previous | - | - |
| New | - | - |
| Lapsed | - | - |

After selecting "Current":

| Column 1 | Column 2 (Subjects) | Column 3 |
|----------|-------------------|----------|
| Current ✓ | **Members** (selected) | - |
| | Orders | - |
| | Events | - |
| | Donations | - |
| | Emails | - |

After selecting "Members":

| Column 1 | Column 2 | Column 3 (Connectors) |
|----------|----------|---------------------|
| Current ✓ | Members ✓ | **that have** (selected) |
| | | that are |
| | | for |

#### Set 2: Filter Selection
After selecting "that have", NEW 3-column set appears:

| Column 1 (Categories) | Column 2 | Column 3 |
|---------------------|----------|----------|
| **Member Stats** (selected) | - | - |
| Member Type | - | - |
| Occupation | - | - |
| Degree | - | - |

After selecting "Member Stats":

| Column 1 | Column 2 (Stat Types) | Column 3 |
|----------|---------------------|----------|
| Member Stats ✓ | **Consecutive Membership Years** (selected) | - |
| | Total Revenue | - |
| | Event Attendance | - |
| | Donation Count | - |
| | (other member stat items from browse mode) | - |

After selecting "Consecutive Membership Years":

| Column 1 | Column 2 | Column 3 (Values) |
|----------|----------|-----------------|
| Member Stats ✓ | Consecutive Membership Years ✓ | 1 |
| | | 2 |
| | | 3 |
| | | **5** (selected) |
| | | 10 |
| | | 15 |

**Query Complete:** `[Current][Members] [that have][Member Stats: Consecutive Membership Years= 5]`

---

## Base Query 2: Multi-Filter Query

### Final Phrase
```
[Current][Members][that are][Member Type = ECY1 - Member Early Career Year 1] [And] [Occupation = Practitioner] [AND] [Degree = Masters] [And] [Province/State = BC]
```

### Selection Flow

#### Set 1: Initial Selection
(Same as Query 1, but Column 3 selects "that are")

| Column 1 | Column 2 | Column 3 (Connectors) |
|----------|----------|---------------------|
| Current ✓ | Members ✓ | that have |
| | | **that are** (selected) |
| | | for |

#### Set 2: Member Type Filter
After selecting "that are", NEW 3-column set appears:

| Column 1 (Categories) | Column 2 | Column 3 |
|---------------------|----------|----------|
| Member Stats | - | - |
| **Member Type** (selected) | - | - |
| Occupation | - | - |
| Degree | - | - |

After selecting "Member Type":

| Column 1 | Column 2 (Member Types from Browse Mode) | Column 3 |
|----------|---------------------------------------|----------|
| Member Type ✓ | **ECY1 - Member Early Career Year 1** (selected) | - |
| | ECY2 - Member Early Career Year 2 | - |
| | STU1 - Student Year 1 | - |
| | PROF1 - Professional Year 1 | - |
| | (other member types from browse mode) | - |

After selecting "ECY1":

| Column 1 | Column 2 | Column 3 (Connectors) |
|----------|----------|---------------------|
| Member Type ✓ | ECY1 ✓ | **And** (selected) |
| | | Or |

#### Set 3: Occupation Filter
After selecting "And", NEW 3-column set appears:

| Column 1 (Categories) | Column 2 | Column 3 |
|---------------------|----------|----------|
| **Occupation** (selected) | - | - |
| Degree | - | - |
| Province/State | - | - |

After selecting "Occupation":

| Column 1 | Column 2 (Occupations from Browse Mode) | Column 3 |
|----------|---------------------------------------|----------|
| Occupation ✓ | **Practitioner** (selected) | - |
| | Educator | - |
| | Researcher | - |
| | Administrator | - |
| | (other occupations from browse mode) | - |

After selecting "Practitioner":

| Column 1 | Column 2 | Column 3 (Connectors) |
|----------|----------|---------------------|
| Occupation ✓ | Practitioner ✓ | **And** (selected) |
| | | Or |

#### Set 4: Degree Filter
After selecting "And", NEW 3-column set appears:

| Column 1 (Categories) | Column 2 | Column 3 |
|---------------------|----------|----------|
| **Degree** (selected) | - | - |
| Province/State | - | - |

After selecting "Degree":

| Column 1 | Column 2 (Degrees from Browse Mode) | Column 3 |
|----------|-----------------------------------|----------|
| Degree ✓ | Bachelors | - |
| | **Masters** (selected) | - |
| | Doctorate | - |
| | PhD | - |
| | (other degrees from browse mode) | - |

After selecting "Masters":

| Column 1 | Column 2 | Column 3 (Connectors) |
|----------|----------|---------------------|
| Degree ✓ | Masters ✓ | **And** (selected) |
| | | Or |

#### Set 5: Province/State Filter
After selecting "And", NEW 3-column set appears:

| Column 1 (Categories) | Column 2 | Column 3 |
|---------------------|----------|----------|
| **Province/State** (selected) | - | - |
| Occupation | - | - |
| City | - | - |

After selecting "Province/State":

| Column 1 | Column 2 (Provinces from Browse Mode) | Column 3 |
|----------|-------------------------------------|----------|
| Province/State ✓ | ON | - |
| | **BC** (selected) | - |
| | AB | - |
| | QC | - |
| | (other provinces from browse mode) | - |

**Query Complete:** `[Current][Members][that are][Member Type = ECY1] [And] [Occupation = Practitioner] [AND] [Degree = Masters] [And] [Province/State = BC]`

---

## Base Query 3: Renewal Query

### Final Phrase
```
[Previous] [Members] [for] [Member Year = 2019] [that have] [Renewed] [in][December 2019 or January 2020] [for] [Member Year 2020]
```

### Selection Flow

#### Set 1: Initial Selection

| Column 1 (Timeframes) | Column 2 | Column 3 |
|----------------------|----------|----------|
| Current | - | - |
| **Previous** (selected) | - | - |
| New | - | - |
| Lapsed | - | - |

After selecting "Previous":

| Column 1 | Column 2 (Subjects) | Column 3 |
|----------|-------------------|----------|
| Previous ✓ | **Members** (selected) | - |
| | Orders | - |
| | Events | - |
| | Donations | - |

After selecting "Members":

| Column 1 | Column 2 | Column 3 (Connectors) |
|----------|----------|---------------------|
| Previous ✓ | Members ✓ | that have |
| | | **for** (selected, 2nd entry) |
| | | that are |

#### Set 2: Member Year Filter
After selecting "for", NEW 3-column set appears:

| Column 1 (Categories) | Column 2 | Column 3 |
|---------------------|----------|----------|
| **Member Year** (selected, 1st entry) | - | - |
| Member Type (2nd entry) | - | - |

After selecting "Member Year":

| Column 1 | Column 2 (Years from Browse Mode) | Column 3 |
|----------|----------------------------------|----------|
| Member Year ✓ | **2019** (selected, 1st entry) | - |
| | 2020 | - |
| | 2021 | - |
| | 2022 | - |
| | (other years from browse mode) | - |

After selecting "2019":

| Column 1 | Column 2 | Column 3 (Connectors) |
|----------|----------|---------------------|
| Member Year ✓ | 2019 ✓ | **that have** (selected, 1st entry in this phase) |
| | | and |
| | | or |

#### Set 3: Renewed Action
After selecting "that have", NEW 3-column set appears:

| Column 1 (Actions) | Column 2 | Column 3 |
|-------------------|----------|----------|
| **Renewed** (selected, 1st entry) | - | - |
| Joined | - | - |
| Donated | - | - |

After selecting "Renewed":

| Column 1 | Column 2 (Renewed Connectors) | Column 3 |
|----------|------------------------------|----------|
| Renewed ✓ | **in** (selected, 1st entry) | - |
| | from (2nd entry) | - |
| | for (3rd entry) | - |

After selecting "in":

| Column 1 | Column 2 | Column 3 (Month+Year Values) |
|----------|----------|----------------------------|
| Renewed ✓ | in ✓ | **December 2019** (selected, 1st entry) |
| | | January 2020 (2nd entry) |
| | | February 2020 |
| | | March 2020 |
| | | April 2020 |
| | | May 2020 |

#### Set 4: Or Logic (Multi-Month Selection)
After selecting "December 2019", NEW 3-column set appears:

**Note:** "or" appears as 1st entry in Column 1 because "in" enables multi-select with "or" logic

| Column 1 (Connectors) | Column 2 | Column 3 |
|---------------------|----------|----------|
| **or** (selected, 1st entry - enabled by "in") | - | - |
| for (2nd entry) | - | - |

After selecting "or":

| Column 1 | Column 2 (Month+Year Values) | Column 3 |
|----------|----------------------------|----------|
| or ✓ | **January 2020** (selected, 1st entry) | - |
| | February 2020 (2nd entry) | - |
| | March 2020 | - |
| | April 2020 | - |
| | May 2020 | - |
| | June 2020 | - |

After selecting "January 2020":

| Column 1 | Column 2 | Column 3 (Connectors) |
|----------|----------|---------------------|
| or ✓ | January 2020 ✓ | **for** (selected, 1st entry) |
| | | and |

#### Set 5: Target Member Year
After selecting "for", NEW 3-column set appears:

| Column 1 (Categories) | Column 2 | Column 3 |
|---------------------|----------|----------|
| **Member Year** (selected, 1st entry) | - | - |

After selecting "Member Year":

| Column 1 | Column 2 (Years from Browse Mode) | Column 3 |
|----------|----------------------------------|----------|
| Member Year ✓ | 2019 | - |
| | **2020** (selected) | - |
| | 2021 | - |
| | 2022 | - |

**Query Complete:** `[Previous] [Members] [for] [Member Year = 2019] [that have] [Renewed] [in][December 2019 or January 2020] [for] [Member Year 2020]`

---

## System Logic Patterns

### 1. Column Types by Context

#### Column 1 Options
- **Timeframes:** Current, Previous, New, Lapsed
- **Subjects:** Members, Orders, Events, Donations, Emails
- **Filter Categories:** Member Stats, Member Type, Occupation, Degree, Province/State, Member Year
- **Actions:** Renewed, Joined, Donated
- **Connectors:** and, or, for

#### Column 2 Options (Context-Dependent)
- **After Timeframe:** Subjects
- **After Subject:** Connectors
- **After Category:** Sub-categories or Values from Browse Mode
- **After Action:** Action-specific connectors
- **After Connector:** Next category or values

#### Column 3 Options (Context-Dependent)
- **After Subject:** Connectors (that have, that are, for)
- **After Sub-category:** Values
- **After Value:** Connectors (and, or)
- **After Action Connector:** Values

### 2. Browse Mode Data Integration

Data pulled from Browse Mode includes:
- **Member Types:** ECY1, ECY2, STU1, PROF1, etc.
- **Occupations:** Practitioner, Educator, Researcher, Administrator, etc.
- **Degrees:** Masters, Bachelors, Doctorate, PhD, MBA, Certificate, etc.
- **Provinces:** ON, BC, AB, QC, etc.
- **Years:** 2019, 2020, 2021, 2022, 2023, 2024, etc.
- **Months:** January, February, March, etc.
- **Member Stats Sub-categories:** Consecutive Membership Years, Total Revenue, etc.

### 3. Hierarchical Categories

**Member Stats** is a hierarchical category:
- Level 1: Member Stats (category)
- Level 2: Consecutive Membership Years, Total Revenue, etc. (sub-categories)
- Level 3: Specific values (1, 2, 3, 5, 10, 15, etc.)

### 4. Special Actions and Connectors

**Renewed** action has specific connectors:
- **in:** Enables "or" logic for multiple months
- **from:** Enables date range selection
- **for:** Links to target member year

**"in" connector with Renewed:**
- Enables multi-select with "or" logic
- After selecting first month, "or" appears in Column 1 of next set
- Can chain multiple months: "December 2019 or January 2020"

### 5. Connector Placement Rules

Connectors appear in different columns based on context:

| Context | Column | Examples |
|---------|--------|----------|
| After Subject | Column 3 | that have, that are, for |
| After Value | Column 3 | and, or |
| After "And" | Column 1 | Resets to show new filter categories |
| With Renewed | Column 2 | in, from, for |
| With Multi-select | Column 1 | or (for additional values) |

### 6. Entry Order Priority

First entries in each column are the most common/recommended selections:

**Query 1 - Column 3 after Members:**
- 1st entry: "that have" (most common for member queries)

**Query 2 - Column 1 after "that are":**
- 1st entry: "Member Stats"
- 2nd entry: "Member Type"

**Query 3 - Column 3 after Members:**
- 1st entry: "that have"
- 2nd entry: "for" (used in this query)

**Query 3 - Column 1 after "for":**
- 1st entry: "Member Year"
- 2nd entry: "Member Type"

**Query 3 - Column 3 after Year:**
- 1st entry: "that have" (in this selection phase)

---

## Implementation Requirements

### Data Structure

```javascript
{
  // Current query state
  chips: [
    { text: 'Current', type: 'cohort' },
    { text: 'Members', type: 'entity' },
    { text: 'that have', type: 'connector' }
  ],

  // Current 3-column set
  currentColumns: {
    column1: [
      { label: 'Member Stats', type: 'category', order: 1 },
      { label: 'Member Type', type: 'category', order: 2 }
    ],
    column2: [], // Updates when column1 selection is made
    column3: []  // Updates when column2 selection is made
  },

  // Context for determining next column set
  context: {
    lastAction: 'connector',
    lastCategory: null,
    enabledFeatures: ['multiSelect'], // e.g., for "or" logic with Renewed
    browseMode: 'members' // For loading relevant browse mode data
  }
}
```

### Logic Flow

```
getColumnsForContext(chips) {
  const context = analyzeChips(chips);

  if (context.awaitingNewSet) {
    return generateNewColumnSet(context);
  }

  if (context.awaitingColumn2) {
    return generateColumn2Options(context.column1Selection);
  }

  if (context.awaitingColumn3) {
    return generateColumn3Options(context.column2Selection);
  }
}

generateNewColumnSet(context) {
  // Determine what Column 1 options to show based on query context
  // Examples:
  // - After "that have" → Show filter categories
  // - After "And" → Show remaining filter categories
  // - After "that have" + "Renewed" + "in" + month → Show "or" and "for"
}

generateColumn2Options(column1Selection) {
  // Load data from Browse Mode based on category
  if (column1Selection === 'Member Type') {
    return fetchFromBrowseMode('memberTypes'); // ECY1, ECY2, etc.
  }
  if (column1Selection === 'Occupation') {
    return fetchFromBrowseMode('occupations'); // Practitioner, etc.
  }
  // ... etc.
}

generateColumn3Options(column2Selection) {
  // Determine connectors or values for Column 3
  // Context-dependent logic
}
```

---

## Key Differences from Current Implementation

### Current System
- Uses progressive single-line suggestion flow
- Shows current/next/future preview levels
- Linear progression without true 3-column simultaneous display

### Required System
- **True 3-column simultaneous display**
- All 3 columns visible at once (though Column 2 and 3 update based on selections)
- After Column 3 selection, **entirely new 3-column set appears**
- Context-aware column population based on query state
- Browse Mode data integration for values
- Hierarchical category support (Member Stats → Sub-categories)
- Special action handling (Renewed with "or" logic)
- Connector placement varies by context

---

## Testing Checklist

- [ ] Query 1: Member Stats with Consecutive Membership Years
- [ ] Query 2: Multi-filter with And connectors
- [ ] Query 3: Renewal query with "or" logic and multiple date selections
- [ ] Browse Mode data integration for all categories
- [ ] Column 1, 2, 3 update correctly based on selections
- [ ] New 3-column set appears after Column 3 selection
- [ ] Entry order priority matches specification (1st, 2nd entries)
- [ ] Hierarchical categories work (Member Stats → sub-categories)
- [ ] Special actions work (Renewed → in/from/for)
- [ ] "or" logic enables multi-select for months
- [ ] Connector placement correct in all contexts
