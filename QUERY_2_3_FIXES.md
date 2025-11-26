# Query 2 and Query 3 Suggestion Fixes

**Date:** 2025-11-26
**Status:** ✅ FIXED
**Purpose:** Fix premature suggestion changes in Query 2 and Query 3 flows

---

## Issues Identified

### Problem: Over-Anticipation of Columns

The query builder was showing suggestions in Column 2 and Column 3 before the user completed their selection in Column 1. This caused the "whole suggestions change for three group" issue, where:

1. Anticipated Column 2/3 suggestions were based on the first category (Member Stats)
2. When user selected a different category (e.g., Occupation), suggestions would completely change
3. This violated the principle of completing a 3-phrase group before moving to the next

### Specific Issues

1. **Query 2 - After "And"/"Or" Connector** (Line 474-510)
   - **Problem:** Column 2 showing Member Stats subcategories, Column 3 showing values
   - **User Impact:** When selecting "Occupation", suggestions completely change
   - **Expected:** Column 2 and 3 should be EMPTY until category is selected

2. **Query 3 - After First monthYear Selection** (Line 786-832)
   - **Problem:** Column 2 showing month+year options, Column 3 showing "for" connector
   - **User Impact:** Suggestions appear before user selects "or" or "for" in Column 1
   - **Expected:** Column 2 and 3 should be EMPTY until "or" or "for" is selected

3. **Query 3 - After "that have" in Renewal Context** (Line 690-723)
   - **Problem:** Column 2 showing action connectors, Column 3 showing month+year options
   - **User Impact:** Suggestions appear before user selects action
   - **Expected:** Column 2 and 3 should be EMPTY until action is selected

4. **Query 3 - After "for" in Renewal Target Year** (Line 873-910)
   - **Problem:** Column 2 showing member years, Column 3 showing connectors
   - **User Impact:** Suggestions appear before user selects "Member Year"
   - **Expected:** Column 2 and 3 should be EMPTY until category is selected

---

## Fixes Applied

### Fix 1: After Logical Connectors (And/Or)
**File:** `src/personEssential/reports/personEssentialPhraseConfig.js`
**Lines:** 474-496

**Before:**
```javascript
// Anticipated all 3 columns based on first category
column2: subCats.map(sc => ({ ... })),  // Member Stats subcategories
column3: values.map(v => ({ ... }))      // Member Stats values
```

**After:**
```javascript
// Empty until category is selected
column2: [],  // Empty until category is selected
column3: [],  // Empty until category and subcategory/value are selected
```

**Impact:** ✅ Query 2 now shows only filter categories after "And", Column 2/3 populate based on actual selection

---

### Fix 2: After First monthYear Selection
**File:** `src/personEssential/reports/personEssentialPhraseConfig.js`
**Lines:** 771-801

**Before:**
```javascript
// Anticipated Column 2 and 3
column2: monthYearOptions.map(my => ({ ... })),  // Month+year options
column3: [{ label: 'for', ... }]                 // "for" connector
```

**After:**
```javascript
// Empty until "or" or "for" is selected
column2: [],  // Empty until "or" or "for" is selected
column3: [],  // Empty until column 2 is populated and selected
```

**Impact:** ✅ Query 3 now shows only "or" and "for" in Column 1, Column 2/3 populate based on selection

---

### Fix 3: After "that have" in Renewal Context
**File:** `src/personEssential/reports/personEssentialPhraseConfig.js`
**Lines:** 675-695

**Before:**
```javascript
// Anticipated all 3 columns
column2: actionConnectors.map(ac => ({ ... })),  // Action connectors
column3: monthYearOptions.map(my => ({ ... }))   // Month+year options
```

**After:**
```javascript
// Empty until action is selected
column2: [],  // Empty until action is selected
column3: [],  // Empty until action connector is selected
```

**Impact:** ✅ Query 3 now shows only actions in Column 1, Column 2/3 populate after action selection

---

### Fix 4: After "for" in Renewal Target Year
**File:** `src/personEssential/reports/personEssentialPhraseConfig.js`
**Lines:** 873-891

**Before:**
```javascript
// Anticipated all 3 columns
column2: memberYears.map(my => ({ ... })),  // Member years
column3: [                                   // Connectors
  { label: 'that have', ... },
  { label: 'and', ... }
]
```

**After:**
```javascript
// Empty until Member Year is selected
column2: [],  // Empty until Member Year category is selected
column3: [],  // Empty until year value is selected
```

**Impact:** ✅ Query 3 now shows only "Member Year" in Column 1, Column 2/3 populate after selection

---

## Verification

### Query 1 (Basic Flow) - ✅ UNCHANGED
- Initial state: All 3 columns anticipated ✓
- After "that have": All 3 columns anticipated ✓
- Hierarchical selection (Member Stats) works correctly ✓

### Query 2 (Multi-Filter with And) - ✅ FIXED
- After "that are": Shows Member Type and Member Stats in Column 1 ✓
- After "And": Shows all filter categories in Column 1, Column 2/3 empty ✓
- After selecting category: Column 2 populates with appropriate values ✓
- After selecting value: Column 3 shows And/Or connectors ✓

### Query 3 (Renewal with Or) - ✅ FIXED
- After "for": Shows Member Year and Member Type in Column 1 ✓
- After "that have": Shows Renewed/Joined/Donated in Column 1, Column 2/3 empty ✓
- After first monthYear: Shows "or" and "for" in Column 1, Column 2/3 empty ✓
- After "or": Column 2 shows month+year options ✓
- After second "for": Shows "Member Year" in Column 1, Column 2/3 empty ✓

---

## Key Principle

**Sequential Column Population:**
- Column 1: Always shown with available options
- Column 2: Populates AFTER Column 1 selection (based on what was selected)
- Column 3: Populates AFTER Column 2 selection (based on what was selected)

**Exception:**
- Initial connector states (that have/that are/for when chips.length === 3) can anticipate all 3 columns because the suggestions are consistent regardless of timeframe/subject selection

---

## Testing Recommendations

1. **Query 2 Flow:**
   - Select: Current → Members → that are
   - Verify: Only Member Type and Member Stats in Column 1
   - Select: Member Type
   - Verify: Member types appear in Column 2, Column 3 empty
   - Select: ECY1
   - Verify: And/Or appears in Column 3
   - Select: And
   - Verify: All filter categories in Column 1, Column 2/3 empty
   - Select: Occupation
   - Verify: Occupations appear in Column 2 (NOT subcategories)

2. **Query 3 Flow:**
   - Select: Previous → Members → for → Member Year → 2019 → that have
   - Verify: Renewed/Joined/Donated in Column 1, Column 2/3 empty
   - Select: Renewed
   - Verify: in/from/for in Column 2, Column 3 empty
   - Select: in
   - Verify: December 2019/January 2020 in Column 3
   - Select: December 2019
   - Verify: "or" and "for" in Column 1, Column 2/3 empty
   - Select: or
   - Verify: Month+year in Column 2, Column 3 empty

---

## Conclusion

All over-anticipation issues have been fixed. The query builder now properly waits for user selections in Column 1 before populating Column 2 and 3, preventing the "whole suggestions change" issue that was occurring in Query 2 and Query 3 flows.
