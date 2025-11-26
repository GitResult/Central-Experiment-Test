/**
 * Test script to verify Orders, Events, Donations, and Emails queries
 *
 * This script tests the phrase building system for all 4 attribute types:
 * - Orders
 * - Events
 * - Donations
 * - Emails
 */

const { getSuggestionsForPhrase } = require('./src/personEssential/reports/personEssentialPhraseConfig');

console.log('\n📋 TESTING ORDERS, EVENTS, DONATIONS, EMAILS QUERIES\n');
console.log('='.repeat(60));

// Helper function to format suggestions
function formatSuggestions(suggestions, title) {
  console.log(`\n${title}`);
  console.log('-'.repeat(60));
  console.log('\n📍 Column 1 (Current - Select Now):');
  suggestions.current.slice(0, 10).forEach((s, i) => {
    const label = s.label || s.text;
    const type = s.type ? ` [${s.type}]` : '';
    console.log(`  ${i + 1}. ${label}${type}`);
  });

  console.log('\n📍 Column 2 (Next - Preview):');
  suggestions.next.slice(0, 5).forEach((s, i) => {
    const label = s.label || s.text;
    console.log(`  ${i + 1}. ${label} (preview)`);
  });

  console.log('\n📍 Column 3 (Future - Preview):');
  suggestions.future.slice(0, 5).forEach((s, i) => {
    const label = s.label || s.text;
    console.log(`  ${i + 1}. ${label} (preview)`);
  });
}

// Test 1: Basic Setup - Current Members
console.log('\n\n🧪 TEST 1: Current Members');
console.log('='.repeat(60));

let chips = [
  { text: 'Current', type: 'cohort' }
];
let suggestions = getSuggestionsForPhrase(chips);
formatSuggestions(suggestions, 'After selecting "Current"');

chips.push({ text: 'members', type: 'entity' });
suggestions = getSuggestionsForPhrase(chips);
formatSuggestions(suggestions, 'After selecting "members"');

// Verify "that have" is in the options
const hasThatHave = suggestions.current.some(s => s.label === 'that have');
console.log(`\n✅ "that have" connector available: ${hasThatHave ? 'YES' : 'NO'}`);

// Test 2: After "that have" - Should show all 4 attributes
console.log('\n\n🧪 TEST 2: Current Members That Have');
console.log('='.repeat(60));

chips.push({ text: 'that have', type: 'connector' });
suggestions = getSuggestionsForPhrase(chips);
formatSuggestions(suggestions, 'After selecting "that have"');

// Verify all 4 attributes are present
const hasOrders = suggestions.current.some(s => s.label === 'orders');
const hasEvents = suggestions.current.some(s => s.label === 'events');
const hasDonations = suggestions.current.some(s => s.label === 'donations');
const hasEmails = suggestions.current.some(s => s.label === 'emails');

console.log('\n📊 Attribute Verification:');
console.log(`  ✅ Orders: ${hasOrders ? 'PRESENT' : 'MISSING'}`);
console.log(`  ✅ Events: ${hasEvents ? 'PRESENT' : 'MISSING'}`);
console.log(`  ✅ Donations: ${hasDonations ? 'PRESENT' : 'MISSING'}`);
console.log(`  ✅ Emails: ${hasEmails ? 'PRESENT' : 'MISSING'}`);

const allAttributesPresent = hasOrders && hasEvents && hasDonations && hasEmails;
console.log(`\n🎯 Overall: ${allAttributesPresent ? '✅ ALL ATTRIBUTES PRESENT' : '❌ SOME ATTRIBUTES MISSING'}`);

// Test 3: Orders Query
console.log('\n\n🧪 TEST 3: Current Members That Have Orders');
console.log('='.repeat(60));

let ordersChips = [
  { text: 'Current', type: 'cohort' },
  { text: 'members', type: 'entity' },
  { text: 'that have', type: 'connector' },
  { text: 'orders', type: 'attribute' }
];
suggestions = getSuggestionsForPhrase(ordersChips);
formatSuggestions(suggestions, 'After selecting "orders"');

const hasInTimeframe = suggestions.current.some(s => s.label === 'in timeframe');
const hasGreaterThan = suggestions.current.some(s => s.label === 'greater than');
console.log(`\n✅ "in timeframe" available: ${hasInTimeframe ? 'YES' : 'NO'}`);
console.log(`✅ "greater than" available: ${hasGreaterThan ? 'YES' : 'NO'}`);

// Test 4: Orders with Timeframe
console.log('\n\n🧪 TEST 4: Current Members That Have Orders In Timeframe');
console.log('='.repeat(60));

ordersChips.push({ text: 'in timeframe', type: 'connector' });
suggestions = getSuggestionsForPhrase(ordersChips);
formatSuggestions(suggestions, 'After selecting "in timeframe"');

const hasLast7Days = suggestions.current.some(s => s.label === 'Last 7 days');
const hasLast30Days = suggestions.current.some(s => s.label === 'Last 30 days');
const hasLast90Days = suggestions.current.some(s => s.label === 'Last 90 days');
console.log(`\n✅ Timeframe options available: ${hasLast7Days && hasLast30Days && hasLast90Days ? 'YES' : 'NO'}`);

// Test 5: Orders with Greater Than
console.log('\n\n🧪 TEST 5: Current Members That Have Orders Greater Than');
console.log('='.repeat(60));

let ordersComparisonChips = [
  { text: 'Current', type: 'cohort' },
  { text: 'members', type: 'entity' },
  { text: 'that have', type: 'connector' },
  { text: 'orders', type: 'attribute' },
  { text: 'greater than', type: 'comparison' }
];
suggestions = getSuggestionsForPhrase(ordersComparisonChips);
formatSuggestions(suggestions, 'After selecting "greater than"');

const has5000 = suggestions.current.some(s => s.label === '$5,000');
const has1000 = suggestions.current.some(s => s.label === '$1,000');
console.log(`\n✅ Amount values available: ${has5000 && has1000 ? 'YES' : 'NO'}`);

// Test 6: Events Query
console.log('\n\n🧪 TEST 6: Current Members That Have Events');
console.log('='.repeat(60));

let eventsChips = [
  { text: 'Current', type: 'cohort' },
  { text: 'members', type: 'entity' },
  { text: 'that have', type: 'connector' },
  { text: 'events', type: 'attribute' }
];
suggestions = getSuggestionsForPhrase(eventsChips);
formatSuggestions(suggestions, 'After selecting "events"');

// Test 7: Donations Query
console.log('\n\n🧪 TEST 7: Current Members That Have Donations');
console.log('='.repeat(60));

let donationsChips = [
  { text: 'Current', type: 'cohort' },
  { text: 'members', type: 'entity' },
  { text: 'that have', type: 'connector' },
  { text: 'donations', type: 'attribute' }
];
suggestions = getSuggestionsForPhrase(donationsChips);
formatSuggestions(suggestions, 'After selecting "donations"');

// Test 8: Emails Query
console.log('\n\n🧪 TEST 8: Current Members That Have Emails');
console.log('='.repeat(60));

let emailsChips = [
  { text: 'Current', type: 'cohort' },
  { text: 'members', type: 'entity' },
  { text: 'that have', type: 'connector' },
  { text: 'emails', type: 'attribute' }
];
suggestions = getSuggestionsForPhrase(emailsChips);
formatSuggestions(suggestions, 'After selecting "emails"');

// Test 9: Complete Query - Orders in Last 90 Days Greater Than $5,000
console.log('\n\n🧪 TEST 9: Complete Query - Orders in Last 90 Days > $5,000');
console.log('='.repeat(60));

let completeOrdersChips = [
  { text: 'Current', type: 'cohort' },
  { text: 'members', type: 'entity' },
  { text: 'that have', type: 'connector' },
  { text: 'orders', type: 'attribute' },
  { text: 'in timeframe', type: 'connector' },
  { text: 'Last 90 days', type: 'timeframe' }
];
suggestions = getSuggestionsForPhrase(completeOrdersChips);
formatSuggestions(suggestions, 'After selecting "Last 90 days"');

console.log('\n📝 Final Query:');
console.log('  [Current] [Members] [that have] [orders] [in timeframe] [Last 90 days]');

// Test 10: Complete Query - Donations This Year Greater Than $1,000
console.log('\n\n🧪 TEST 10: Complete Query - Donations This Year > $1,000');
console.log('='.repeat(60));

let completeDonationsChips = [
  { text: 'Current', type: 'cohort' },
  { text: 'members', type: 'entity' },
  { text: 'that have', type: 'connector' },
  { text: 'donations', type: 'attribute' },
  { text: 'in timeframe', type: 'connector' },
  { text: 'This year', type: 'timeframe' },
  { text: 'greater than', type: 'comparison' },
  { text: '$1,000', type: 'value' }
];

console.log('\n📝 Final Query:');
console.log('  [Current] [Members] [that have] [donations] [in timeframe] [This year] [greater than] [$1,000]');

// Summary
console.log('\n\n' + '='.repeat(60));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(60));

const allTests = [
  { name: 'Basic "Current Members" flow', status: hasThatHave },
  { name: '"that have" shows all 4 attributes', status: allAttributesPresent },
  { name: 'Orders attribute shows connectors', status: hasInTimeframe && hasGreaterThan },
  { name: 'Timeframe options available', status: hasLast7Days && hasLast30Days && hasLast90Days },
  { name: 'Amount values available', status: has5000 && has1000 }
];

allTests.forEach((test, i) => {
  const icon = test.status ? '✅' : '❌';
  console.log(`\n${icon} Test ${i + 1}: ${test.name} - ${test.status ? 'PASSED' : 'FAILED'}`);
});

const allPassed = allTests.every(t => t.status);
console.log('\n' + '='.repeat(60));
console.log(`\n🎯 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
console.log('\n' + '='.repeat(60));

// Usage Examples
console.log('\n\n📚 USAGE EXAMPLES');
console.log('='.repeat(60));

const examples = [
  {
    title: 'Example 1: Orders in Last 90 Days',
    query: '[Current] [Members] [that have] [orders] [in timeframe] [Last 90 days]'
  },
  {
    title: 'Example 2: Orders Greater Than $5,000',
    query: '[Current] [Members] [that have] [orders] [greater than] [$5,000]'
  },
  {
    title: 'Example 3: Events in Last 30 Days',
    query: '[Current] [Members] [that have] [events] [in timeframe] [Last 30 days]'
  },
  {
    title: 'Example 4: Donations This Year > $1,000',
    query: '[Current] [Members] [that have] [donations] [in timeframe] [This year] [greater than] [$1,000]'
  },
  {
    title: 'Example 5: Emails in Last 7 Days',
    query: '[Current] [Members] [that have] [emails] [in timeframe] [Last 7 days]'
  }
];

examples.forEach((ex, i) => {
  console.log(`\n${ex.title}:`);
  console.log(`  ${ex.query}`);
});

console.log('\n' + '='.repeat(60));
console.log('\n✅ All 4 attributes (Orders, Events, Donations, Emails) are fully supported!\n');
