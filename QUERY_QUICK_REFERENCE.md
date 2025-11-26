# Quick Reference: Orders, Events, Donations, Emails Queries

## ✅ Status: FULLY WORKING

All 4 attribute types are **fully supported** in the phrase building system.

---

## How to Build: Current → Members → That have → [Attribute]

### 3 Simple Steps:

```
1. Select "Current" → "Members"
2. Select "that have"
3. Select one of: orders, events, donations, emails
```

Then optionally add:
- **Timeframe filter:** "in timeframe" → (Last 7 days, Last 30 days, Last 90 days, This year, etc.)
- **Amount filter:** "greater than" → ($100, $500, $1,000, $5,000, etc.)

---

## 5 Complete Query Examples

### 1️⃣ Orders in Last 90 Days
```
[Current] [Members] [that have] [orders] [in timeframe] [Last 90 days]
```
**Use:** Find members with recent purchases

### 2️⃣ High-Value Orders
```
[Current] [Members] [that have] [orders] [greater than] [$5,000]
```
**Use:** Find big spenders

### 3️⃣ Recent Event Attendance
```
[Current] [Members] [that have] [events] [in timeframe] [Last 30 days]
```
**Use:** Find recently engaged members

### 4️⃣ Major Donors This Year
```
[Current] [Members] [that have] [donations] [in timeframe] [This year] [greater than] [$1,000]
```
**Use:** Find major donors for current year

### 5️⃣ Recent Email Recipients
```
[Current] [Members] [that have] [emails] [in timeframe] [Last 7 days]
```
**Use:** Find recently contacted members

---

## Available Options

### Attributes (Column 1 after "that have")
- 📦 **orders** (green)
- 📅 **events** (purple)
- 🎁 **donations** (orange)
- 📧 **emails** (blue)

### Timeframes (After "in timeframe")
- Last 7 days
- Last 30 days
- Last 90 days
- This month
- This quarter
- This year
- Last year

### Amounts (After "greater than")
- $100
- $500
- $1,000
- $2,500
- $5,000
- $10,000
- $25,000
- $50,000

---

## Combining Multiple Attributes

Use "and" to combine:

```
[Current] [Members] [that have] [orders] [in timeframe] [Last 90 days]
[and] [that have] [events] [in timeframe] [Last 30 days]
```

---

## System Verification

✅ **Test Results:** ALL TESTS PASSED
- ✅ "that have" connector available
- ✅ All 4 attributes present
- ✅ Timeframe filters working
- ✅ Amount filters working
- ✅ 3-column progressive system functional

---

## Files & Configuration

**Main Config:** `src/personEssential/reports/personEssentialPhraseConfig.js`
- Lines 293-310: "that have" logic
- Lines 313-329: Attribute selection logic
- Lines 132-137: Attribute definitions

**Full Documentation:** `ORDERS_EVENTS_DONATIONS_EMAILS_GUIDE.md`

**Test Verification:** `test-attribute-queries-simple.js`

---

## No Issues Found ✅

The system is **fully functional** and ready to use. All 4 attributes work correctly with:
- Timeframe filtering
- Amount/value comparison
- Multiple attribute combinations

**Last Verified:** 2025-11-25
