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
