# Phrase Pattern Tests - Browse Mode

This document contains 20 test query patterns to verify the phrase format is maintained correctly in Browse Mode.

## Original 3 Required Patterns

### Pattern 1: Current members that have been members for the past 5 years
**Expected Phrase Format:**
```
[Current] [Members] [that have been] [members] [for] [past 5 years]
```
**Alternative with Member Stats Card:**
```
[Current Members] [Member Stats: Consecutive Membership Years= 5]
```

**Steps to Create:**
1. Click "Current Members" card in Starting Data
2. **Option A - Phrase Mode:**
   - Click "members" entity
   - Click "that have been" connector
   - Select "members" entity type
   - Click "for" connector
   - Select "past 5 years"

3. **Option B - Member Stats Card:**
   - Click "Member Stats" card
   - Click "Consecutive Membership Years"
   - Check "Past 5 years" (creates: `Member Stats: Consecutive Membership Years= 5`)

---

### Pattern 2: Current members that are member type ECY1 and occupation is practitioner with a Degree: Masters from province/state BC
**Expected Phrase Format:**
```
[Current] [Members] [that are] [Member Type= Members] [And] [Member Type= ECY1 - Member Early Career Year 1] [And] [Occupation= Practitioner] [And] [Degree= Masters] [And] [Province/State= BC]
```

**Steps to Create:**
1. Click "Current Members" card
2. Click "members" entity
3. Click "with type" connector → Select "ECY1 - Member Early Career Year 1"
4. Click "and" connector
5. Click "occupation is" connector → Select "Practitioner"
6. Click "and" connector
7. Click "with a Degree:" connector → Select "Masters"
8. Click "and" connector
9. Click "from province/state" connector → Select "BC"

---

### Pattern 3: 2019 members who renewed in December 2019 and January 2020
**Expected Phrase Format:**
```
[2019] [Members] [who renewed in] [December] [2019] [And] [who renewed in] [January] [2020]
```

**Alternative Format:**
```
[Previous] [Members] [for] [Member Year= 2019] [that are] [Member Type= All] [that] [Renewed] [in] [December 2019, January 2020] [for] [Member Year 2020]
```

**Steps to Create:**
1. Click "2019" year cohort
2. Click "members" entity
3. Click "who renewed in" connector → Select "December"
4. Select year "2019"
5. Click "and" connector
6. Click "who renewed in" connector → Select "January"
7. Select year "2020"

---

## Additional 17 Complex Test Patterns

### Pattern 4: All contacts that are professionals with engagement score high
**Expected Phrase Format:**
```
[All Contacts] [professionals] [Member Stats: Engagement Score= High]
```

**Steps:**
1. Click "All Contacts" (or "Contacts") in Starting Data
2. In Phrase Mode: Select "professionals" entity type
3. Click "Member Stats" card → "Engagement Score" → Check "High"

---

### Pattern 5: New members joined in last 30 days from Toronto
**Expected Phrase Format:**
```
[New Members] [in location] [Toronto]
```

**Steps:**
1. Click "New Members" card
2. Click "in location" connector
3. Select "Toronto" from list

---

### Pattern 6: Current members with orders in last 90 days greater than $5,000
**Expected Phrase Format:**
```
[Current] [Members] [that have] [orders] [in timeframe] [Last 90 days] [greater than] [$5,000]
```

**Steps:**
1. Click "Current Members" → "members"
2. Click "that have" → "orders"
3. Click "in timeframe" → "Last 90 days"
4. Click "greater than" → "$5,000"

---

### Pattern 7: Lapsed members that have been members for past 10 years with type Professional
**Expected Phrase Format:**
```
[Lapsed] [Members] [that have been] [members] [for] [past 10 years] [and] [with type] [Professional]
```

**Steps:**
1. Click "Lapsed Members" → "members"
2. Click "that have been" → "members" → "for" → "past 10 years"
3. Click "and" → "with type" → "Professional"

---

### Pattern 8: 2023 members that are students from province BC with degree Masters
**Expected Phrase Format:**
```
[2023] [students] [from province/state] [BC] [and] [with a Degree:] [Masters]
```

**Steps:**
1. Click "2023" year cohort → "students"
2. Click "from province/state" → "BC"
3. Click "and" → "with a Degree:" → "Masters"

---

### Pattern 9: Current members with donations in this year greater than $1,000
**Expected Phrase Format:**
```
[Current] [Members] [that have] [donations] [in timeframe] [This year] [greater than] [$1,000]
```

**Steps:**
1. Click "Current Members" → "members"
2. Click "that have" → "donations"
3. Click "in timeframe" → "This year"
4. Click "greater than" → "$1,000"

---

### Pattern 10: Top 50 members by revenue sorted by revenue (high to low)
**Expected Phrase Format:**
```
[Top] [50] [Members] [that have] [orders] [sorted by] [by revenue (high to low)]
```

**Steps:**
1. Select limit → "Top 50"
2. Click "Current Members" → "members"
3. Click "that have" → "orders"
4. Click "sorted by" → "by revenue (high to low)"

---

### Pattern 11: All contacts that are donors with status Active
**Expected Phrase Format:**
```
[All Contacts] [donors] [with status] [Active]
```

**Steps:**
1. Click "All Contacts" / "Contacts"
2. Select "donors" entity type
3. Click "with status" → "Active"

---

### Pattern 12: New members with membership type Student from Ontario
**Expected Phrase Format:**
```
[New Members] [with type] [Student] [and] [from province/state] [Ontario]
```

**Steps:**
1. Click "New Members"
2. Click "with type" → "Student"
3. Click "and" → "from province/state" → "Ontario"

---

### Pattern 13: Current members occupation is Researcher with events in last 30 days
**Expected Phrase Format:**
```
[Current] [Members] [occupation is] [Researcher] [and] [that have] [events] [in timeframe] [Last 30 days]
```

**Steps:**
1. Click "Current Members" → "members"
2. Click "occupation is" → "Researcher"
3. Click "and" → "that have" → "events"
4. Click "in timeframe" → "Last 30 days"

---

### Pattern 14: 2020 members who renewed in March or April
**Expected Phrase Format:**
```
[2020] [Members] [who renewed in] [March] [and] [who renewed in] [April]
```
*Note: Using OR logic requires selecting both with checkboxes*

**Steps:**
1. Click "2020" year cohort → "members"
2. Click "who renewed in" → Select "March"
3. Click "and" → "who renewed in" → Select "April"

---

### Pattern 15: Lapsed members with tenure past 15 years that have donations
**Expected Phrase Format:**
```
[Lapsed] [Members] [that have been] [members] [for] [past 15 years] [and] [that have] [donations]
```

**Steps:**
1. Click "Lapsed Members" → "members"
2. Click "that have been" → "members" → "for" → "past 15 years"
3. Click "and" → "that have" → "donations"

---

### Pattern 16: Current members consecutive membership years custom 7 years with type Corporate
**Expected Phrase Format:**
```
[Current Members] [Member Stats: Consecutive Membership Years= 7] [and] [with type] [Corporate]
```

**Steps:**
1. Click "Current Members"
2. Click "Member Stats" → "Consecutive Membership Years"
3. Enter "7" in custom year field and check the box
4. Click "and" (in Browse Mode or Phrase Mode)
5. Click "with type" → "Corporate"

---

### Pattern 17: All contacts professionals for past 3 years occupation Educator from Quebec
**Expected Phrase Format:**
```
[All Contacts] [professionals] [that have been] [professionals] [for] [past 3 years] [and] [occupation is] [Educator] [and] [from province/state] [Quebec]
```

**Steps:**
1. Click "All Contacts"
2. Select "professionals"
3. Click "that have been" → "professionals" → "for" → "past 3 years"
4. Click "and" → "occupation is" → "Educator"
5. Click "and" → "from province/state" → "Quebec"

---

### Pattern 18: Current members with membership type ECY1 or ECY2 or ECY3
**Expected Phrase Format:**
```
[Current] [Members] [with type] [ECY1 or ECY2 or ECY3]
```
*Note: OR logic created by selecting multiple values with checkboxes*

**Steps:**
1. Click "Current Members" → "members"
2. Click "with type"
3. Check boxes for: "ECY1", "ECY2", "ECY3" (creates OR condition)

---

### Pattern 19: New members joined this year with degree Doctorate occupation Administrator
**Expected Phrase Format:**
```
[New Members] [with a Degree:] [Doctorate] [and] [occupation is] [Administrator]
```

**Steps:**
1. Click "New Members"
2. Click "with a Degree:" → "Doctorate"
3. Click "and" → "occupation is" → "Administrator"

---

### Pattern 20: 2024 members volunteers with emails in last 7 days
**Expected Phrase Format:**
```
[2024] [volunteers] [that have] [emails] [in timeframe] [Last 7 days]
```

**Steps:**
1. Click "2024" year cohort
2. Select "volunteers" entity
3. Click "that have" → "emails"
4. Click "in timeframe" → "Last 7 days"

---

## Format Verification Checklist

### ✅ Member Stats Format
- [ ] `[Member Stats: Consecutive Membership Years= 5]` (extracts number from "Past 5 years")
- [ ] `[Member Stats: Consecutive Membership Years= 7]` (custom year input)
- [ ] Format uses "= " with space after equals sign
- [ ] Category displays as "Member Stats:" prefix

### ✅ Phrase Mode Format
- [ ] Entity selection: `[Current]`, `[New]`, `[Lapsed]`, `[All Contacts]`
- [ ] Entity types: `[members]`, `[professionals]`, `[students]`, `[donors]`, `[volunteers]`
- [ ] Connectors: `[that have been]`, `[that have]`, `[with type]`, `[and]`, `[occupation is]`
- [ ] Values with categories: `[Member Type= ECY1]`, `[Province/State= BC]`, `[Degree= Masters]`

### ✅ Year Cohort Format
- [ ] `[2019]`, `[2020]`, `[2021]`, `[2022]`, `[2023]`, `[2024]`
- [ ] Followed by entity type: `[2023] [students]`
- [ ] Renewal connectors: `[who renewed in] [December]`

### ✅ Complex Query Format
- [ ] Consecutive membership years: `[that have been] [members] [for] [past 5 years]`
- [ ] Multiple filters with AND: `[and] [occupation is] [Researcher]`
- [ ] Attributes with timeframes: `[that have] [orders] [in timeframe] [Last 90 days]`
- [ ] Comparisons: `[greater than] [$5,000]`
- [ ] Sorting: `[sorted by] [by revenue (high to low)]`
- [ ] Limits: `[Top] [50]`

### ✅ Filter Selection Display
- [ ] Browse Mode selections show in "Your Selections" area
- [ ] Each filter displays with proper category prefix
- [ ] AND/OR connectors display correctly
- [ ] Edit functionality maintains format
- [ ] Delete functionality works correctly

---

## Testing Notes

1. **Member Stats Card**: Located in "Starting Data" category as a pill-shaped card
2. **Two-Level Panels**: Click Member Stats → Opens first panel → Click Consecutive Membership Years → Opens second panel
3. **Checkbox Selection**: Clicking checkbox immediately adds filter and closes panels
4. **Custom Years**: Enter number (1-50) in input field, then check the checkbox
5. **Format Consistency**: All filters maintain the `[Category: Field= Value]` format
6. **Number Extraction**: "Past 5 years" automatically extracts "5" for the value
7. **Navigation**: Back arrows allow moving between panels without losing state
8. **Toast Notifications**: Confirm when filters are added successfully

---

## Expected Behavior

### ✅ Browse Mode
- Member Stats card appears in Starting Data section
- Clicking opens first panel with 4 options
- Only Consecutive Membership Years is functional (others show "coming soon")
- Second panel shows 8 preset year ranges + custom input
- Checkboxes add filters immediately
- Format: `Member Stats: Consecutive Membership Years= [number]`

### ✅ Phrase Mode
- All 3 original phrase patterns work correctly
- Progressive suggestion system guides user through phrase building
- Connectors appear contextually based on previous selections
- Entity types, values, and connectors maintain proper format
- "that have been" connector enables consecutive membership years flow

### ✅ Integration
- Browse Mode filters can combine with Phrase Mode queries
- AND connectors work between different filter types
- Multiple filters of same category use OR logic (when checkboxes used)
- Edit functionality allows changing filter values
- Delete removes individual filters without affecting others

---

## New Connectors Added

### 6 Enhanced Connectors for Phrase Building

The phrase building system now includes 6 additional connectors for more flexible query construction:

#### 1. **"That are"** 🎯
Shows membership types and statuses after entity selection.

**Example Usage:**
```
[Current] [Members] [that are] [Professional]
[All Contacts] [that are] [ECY1 - Member Early Career Year 1]
```

**Flow:**
- Select entity (Current, New, Lapsed, etc.)
- Select entity type (members, professionals, students)
- Click "that are" → Shows membership types
- Select type → Continue with "and" or other connectors

---

#### 2. **"With"** ⚙️
Generic connector with sub-options for type, status, or attribute.

**Example Usage:**
```
[Current] [Members] [with] [type] [Student]
[Current] [Members] [with] [status] [Active]
[Current] [Members] [with] [attribute] [orders]
```

**Sub-options:**
- **type** → Shows membership types (ECY1, Professional, etc.)
- **status** → Shows statuses (Active, Inactive, etc.)
- **attribute** → Shows attributes (orders, events, donations)

**Flow:**
- Select "with" connector
- Choose sub-option (type/status/attribute)
- Select value from displayed options

---

#### 3. **"In"** 📍
Generic connector with sub-options for location or timeframe.

**Example Usage:**
```
[Current] [Members] [in] [location] [Toronto]
[Current] [Members] [in] [timeframe] [Last 90 days]
```

**Sub-options:**
- **location** → Shows cities/provinces (Toronto, BC, Ontario, etc.)
- **timeframe** → Shows time periods (Last 30 days, This year, etc.)

**Flow:**
- Select "in" connector
- Choose sub-option (location/timeframe)
- Select value from displayed options

---

#### 4. **"That"** 🔗
General purpose connector with multiple follow-up options.

**Example Usage:**
```
[Current] [Members] [that] [have] [orders]
[Current] [Members] [that] [are] [Professional]
[Current] [Members] [that] [renewed] [in December]
[Current] [Members] [that] [joined] [in 2023]
```

**Options after "that":**
- **have** → Shows attributes (orders, events, donations, emails)
- **are** → Shows membership types
- **renewed** → Action for renewal date filters
- **joined** → Action for join date filters

**Flow:**
- Select "that" connector
- Choose action (have/are/renewed/joined)
- Continue with specific values

---

#### 5. **"For"** ⏰
Generic time period connector (distinct from consecutive membership years).

**Example Usage:**
```
[Current] [Members] [for] [past 5 years]
[Current] [Members] [for] [custom period]
```

**Shows:**
- All consecutive membership year values
- "custom period" option for user-defined ranges

**Note:** This is a generic "for" connector that can be used outside the "that have been → members → for" flow.

**Flow:**
- Select "for" connector
- Choose time period or custom period
- Continue with "and" or other connectors

---

#### 6. **"That have been"** 🕐
Existing connector maintained for consecutive membership years flow.

**Example Usage:**
```
[Current] [Members] [that have been] [members] [for] [past 5 years]
```

**Flow:**
- Select "that have been" connector
- Select entity type (members, professionals, etc.)
- Click "for" connector
- Select consecutive membership years value

---

## Connector Usage Matrix

| Connector | Context | Shows | Use Case |
|-----------|---------|-------|----------|
| **that are** | After entity | Membership types | Filter by member type |
| **with** | After entity | type/status/attribute | Generic filtering |
| **in** | After entity | location/timeframe | Spatial/temporal filters |
| **that** | After entity | have/are/renewed/joined | Action-based queries |
| **for** | After entity | Time periods | Duration filters |
| **that have been** | After entity | Entity types → consecutive years | Tenure queries |

---

## Example Queries with New Connectors

### Using "That are"
```
[Current] [Members] [that are] [Professional] [and] [occupation is] [Researcher]
```

### Using "With"
```
[Current] [Members] [with] [type] [Student] [and] [in] [location] [Toronto]
```

### Using "In"
```
[Current] [Members] [in] [location] [BC] [and] [with] [status] [Active]
```

### Using "That"
```
[Current] [Members] [that] [have] [orders] [in timeframe] [Last 90 days]
```

### Using "For"
```
[Current] [Members] [for] [past 3 years] [and] [occupation is] [Practitioner]
```

### Combining Multiple New Connectors
```
[Current] [Members] [that are] [Professional] [with] [status] [Active] [in] [location] [Ontario] [that] [have] [donations] [greater than] [$1,000]
```

---

## Testing New Connectors

### ✅ Checklist for Each Connector

**"That are":**
- [ ] Shows membership types after entity selection
- [ ] Integrates with "and" connector
- [ ] Maintains purple color theme for membership types

**"With":**
- [ ] Shows sub-options: type, status, attribute
- [ ] Each sub-option displays appropriate values
- [ ] Works with all entity types

**"In":**
- [ ] Shows sub-options: location, timeframe
- [ ] Location shows cities and provinces
- [ ] Timeframe shows date ranges

**"That":**
- [ ] Shows 4 options: have, are, renewed, joined
- [ ] Each option leads to appropriate next steps
- [ ] Works in various query contexts

**"For":**
- [ ] Shows time period values
- [ ] Includes "custom period" option
- [ ] Doesn't conflict with "that have been → for" flow

**"That have been":**
- [ ] Existing functionality maintained
- [ ] Still triggers consecutive membership years flow
- [ ] Backward compatible with all existing queries

---

## Progressive Suggestions

All new connectors integrate with the 3-column progressive suggestion system:

**Current Column:** Shows immediately available options
**Next Column:** Shows preview of next step options
**Future Column:** Shows potential future options

Example flow with new connectors:
1. Select "Current Members" → Shows entity types
2. Select "members" → Shows **all 10 connectors** including new ones
3. Select "with" → Shows sub-options (type/status/attribute)
4. Select "type" → Shows membership types
5. Select "ECY1" → Shows "and" connector and next suggestions

---

## Connector Icons

| Connector | Icon | Color Context |
|-----------|------|---------------|
| that are | Filter | Purple (membership) |
| with | Settings | Various |
| in | MapPin | Red (location), Orange (time) |
| that | ChevronRight | Contextual |
| for | Clock | Blue (time) |
| that have been | Clock | Blue (tenure) |

All icons are from the lucide-react icon library.

