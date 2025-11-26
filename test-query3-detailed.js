/**
 * Test Query 3 in Detail: Renewal Query with "or" logic
 * [Previous] [Members] [for] [Member Year = 2019] [that have] [Renewed] [in][December 2019 or January 2020] [for] [Member Year 2020]
 */

console.log('='.repeat(80));
console.log('DETAILED TEST: Query 3 - Renewal Query with "or" Logic');
console.log('='.repeat(80));
console.log();

console.log('Expected Flow:');
console.log('1. Select "Previous" → "Members" → "for" (2nd entry)');
console.log('2. NEW SET - Select "Member Year" (1st) → "2019" (1st) → "that have" (1st in this phase)');
console.log('3. NEW SET - Select "Renewed" (1st) → "in" (1st) → "December 2019" (1st)');
console.log('4. NEW SET - Select "or" (1st) → "January 2020" (1st) → "for"');
console.log('5. NEW SET - Select "Member Year" → "2020" - Query Complete');
console.log();

const scenarios = [
  {
    stage: 'Stage 1: After selecting "Previous"',
    chips: [
      { text: 'Previous', type: 'timeframe' }
    ],
    expected: {
      column1: 'Should show timeframes with "Previous" selected',
      column2: 'Should show subjects: Members, Orders, Events, Donations, Emails',
      column3: 'Should be empty',
      awaitingSelection: 'column2'
    }
  },
  {
    stage: 'Stage 2: After selecting "Members"',
    chips: [
      { text: 'Previous', type: 'timeframe' },
      { text: 'Members', type: 'subject' }
    ],
    expected: {
      column1: 'Should show "Previous" selected',
      column2: 'Should show "Members" selected',
      column3: 'Should show: that have (1st), that are, for (2nd entry)',
      awaitingSelection: 'column3',
      critical: 'CRITICAL: "for" MUST be available as 2nd entry in Column 3'
    }
  },
  {
    stage: 'Stage 3: After selecting "for" (NEW SET)',
    chips: [
      { text: 'Previous', type: 'timeframe' },
      { text: 'Members', type: 'subject' },
      { text: 'for', type: 'connector' }
    ],
    expected: {
      column1: 'Should show: Member Year (1st entry), Member Type (2nd entry)',
      column2: 'Should be empty',
      column3: 'Should be empty',
      awaitingSelection: 'column1',
      critical: 'CRITICAL: Only Member Year and Member Type should appear'
    }
  },
  {
    stage: 'Stage 4: After selecting "Member Year"',
    chips: [
      { text: 'Previous', type: 'timeframe' },
      { text: 'Members', type: 'subject' },
      { text: 'for', type: 'connector' },
      { text: 'Member Year', type: 'category', id: 'member_year' }
    ],
    expected: {
      column1: 'Should show "Member Year" selected',
      column2: 'Should show years: 2019 (1st), 2020, 2021, 2022, etc.',
      column3: 'Should be empty',
      awaitingSelection: 'column2',
      critical: 'CRITICAL: 2019 MUST be 1st entry in Column 2'
    }
  },
  {
    stage: 'Stage 5: After selecting "2019"',
    chips: [
      { text: 'Previous', type: 'timeframe' },
      { text: 'Members', type: 'subject' },
      { text: 'for', type: 'connector' },
      { text: 'Member Year', type: 'category', id: 'member_year' },
      { text: '2019', type: 'value', valueType: 'memberYear', id: '2019' }
    ],
    expected: {
      column1: 'Should show "Member Year" selected',
      column2: 'Should show "2019" selected',
      column3: 'Should show: that have (1st entry in this phase), and',
      awaitingSelection: 'column3',
      critical: 'CRITICAL: "that have" MUST be 1st entry in Column 3'
    }
  },
  {
    stage: 'Stage 6: After selecting "that have" (NEW SET)',
    chips: [
      { text: 'Previous', type: 'timeframe' },
      { text: 'Members', type: 'subject' },
      { text: 'for', type: 'connector' },
      { text: 'Member Year', type: 'category', id: 'member_year' },
      { text: '2019', type: 'value', valueType: 'memberYear', id: '2019' },
      { text: 'that have', type: 'connector' }
    ],
    expected: {
      column1: 'Should show actions: Renewed (1st), Joined, Donated',
      column2: 'Should be empty',
      column3: 'Should be empty',
      awaitingSelection: 'column1',
      critical: 'CRITICAL: "Renewed" MUST be 1st entry in Column 1'
    }
  },
  {
    stage: 'Stage 7: After selecting "Renewed"',
    chips: [
      { text: 'Previous', type: 'timeframe' },
      { text: 'Members', type: 'subject' },
      { text: 'for', type: 'connector' },
      { text: 'Member Year', type: 'category', id: 'member_year' },
      { text: '2019', type: 'value', valueType: 'memberYear', id: '2019' },
      { text: 'that have', type: 'connector' },
      { text: 'Renewed', type: 'action', id: 'renewed' }
    ],
    expected: {
      column1: 'Should show "Renewed" selected',
      column2: 'Should show Renewed connectors: in (1st), from (2nd), for (3rd)',
      column3: 'Should be empty',
      awaitingSelection: 'column2',
      critical: 'CRITICAL: "in" MUST be 1st entry in Column 2'
    }
  },
  {
    stage: 'Stage 8: After selecting "in"',
    chips: [
      { text: 'Previous', type: 'timeframe' },
      { text: 'Members', type: 'subject' },
      { text: 'for', type: 'connector' },
      { text: 'Member Year', type: 'category', id: 'member_year' },
      { text: '2019', type: 'value', valueType: 'memberYear', id: '2019' },
      { text: 'that have', type: 'connector' },
      { text: 'Renewed', type: 'action', id: 'renewed' },
      { text: 'in', type: 'action_connector', id: 'in' }
    ],
    expected: {
      column1: 'Should show "Renewed" selected',
      column2: 'Should show "in" selected',
      column3: 'Should show month+year: December 2019 (1st), January 2020, February 2020, etc.',
      awaitingSelection: 'column3',
      critical: 'CRITICAL: December 2019 MUST be 1st entry (generated based on baseYear - 1)'
    }
  },
  {
    stage: 'Stage 9: After selecting "December 2019" (NEW SET)',
    chips: [
      { text: 'Previous', type: 'timeframe' },
      { text: 'Members', type: 'subject' },
      { text: 'for', type: 'connector' },
      { text: 'Member Year', type: 'category', id: 'member_year' },
      { text: '2019', type: 'value', valueType: 'memberYear', id: '2019' },
      { text: 'that have', type: 'connector' },
      { text: 'Renewed', type: 'action', id: 'renewed' },
      { text: 'in', type: 'action_connector', id: 'in' },
      { text: 'December 2019', type: 'value', valueType: 'monthYear', id: 'december_2019' }
    ],
    expected: {
      column1: 'Should show: or (1st entry - enabled by "in"), for (2nd entry)',
      column2: 'Should be empty',
      column3: 'Should be empty',
      awaitingSelection: 'column1',
      critical: 'CRITICAL: "or" MUST be 1st entry (enabled by "in" connector for multi-select)'
    }
  },
  {
    stage: 'Stage 10: After selecting "or"',
    chips: [
      { text: 'Previous', type: 'timeframe' },
      { text: 'Members', type: 'subject' },
      { text: 'for', type: 'connector' },
      { text: 'Member Year', type: 'category', id: 'member_year' },
      { text: '2019', type: 'value', valueType: 'memberYear', id: '2019' },
      { text: 'that have', type: 'connector' },
      { text: 'Renewed', type: 'action', id: 'renewed' },
      { text: 'in', type: 'action_connector', id: 'in' },
      { text: 'December 2019', type: 'value', valueType: 'monthYear', id: 'december_2019' },
      { text: 'or', type: 'logical_connector', id: 'or' }
    ],
    expected: {
      column1: 'Should show "or" selected',
      column2: 'Should show month+year: January 2020 (1st), February 2020, etc.',
      column3: 'Should be empty',
      awaitingSelection: 'column2',
      critical: 'CRITICAL: January 2020 MUST be 1st entry in Column 2'
    }
  },
  {
    stage: 'Stage 11: After selecting "January 2020"',
    chips: [
      { text: 'Previous', type: 'timeframe' },
      { text: 'Members', type: 'subject' },
      { text: 'for', type: 'connector' },
      { text: 'Member Year', type: 'category', id: 'member_year' },
      { text: '2019', type: 'value', valueType: 'memberYear', id: '2019' },
      { text: 'that have', type: 'connector' },
      { text: 'Renewed', type: 'action', id: 'renewed' },
      { text: 'in', type: 'action_connector', id: 'in' },
      { text: 'December 2019', type: 'value', valueType: 'monthYear', id: 'december_2019' },
      { text: 'or', type: 'logical_connector', id: 'or' },
      { text: 'January 2020', type: 'value', valueType: 'monthYear', id: 'january_2020' }
    ],
    expected: {
      column1: 'Should show "or" selected',
      column2: 'Should show "January 2020" selected',
      column3: 'Should show: for',
      awaitingSelection: 'column3',
      critical: 'CRITICAL: "for" MUST be available in Column 3'
    }
  },
  {
    stage: 'Stage 12: After selecting "for" (NEW SET)',
    chips: [
      { text: 'Previous', type: 'timeframe' },
      { text: 'Members', type: 'subject' },
      { text: 'for', type: 'connector' },
      { text: 'Member Year', type: 'category', id: 'member_year' },
      { text: '2019', type: 'value', valueType: 'memberYear', id: '2019' },
      { text: 'that have', type: 'connector' },
      { text: 'Renewed', type: 'action', id: 'renewed' },
      { text: 'in', type: 'action_connector', id: 'in' },
      { text: 'December 2019', type: 'value', valueType: 'monthYear', id: 'december_2019' },
      { text: 'or', type: 'logical_connector', id: 'or' },
      { text: 'January 2020', type: 'value', valueType: 'monthYear', id: 'january_2020' },
      { text: 'for', type: 'connector' }
    ],
    expected: {
      column1: 'Should show: Member Year',
      column2: 'Should be empty',
      column3: 'Should be empty',
      awaitingSelection: 'column1',
      critical: 'CRITICAL: Only "Member Year" should appear in Column 1'
    }
  },
  {
    stage: 'Stage 13: Select "Member Year" → "2020" - Query Complete',
    description: 'Member Year in Col1, 2020 in Col2, Query Complete'
  }
];

console.log('='.repeat(80));
console.log('TEST SCENARIOS');
console.log('='.repeat(80));
console.log();

scenarios.forEach((scenario, index) => {
  console.log(`${index + 1}. ${scenario.stage}`);
  console.log('-'.repeat(80));
  if (scenario.description) {
    console.log(`   ${scenario.description}`);
  } else {
    console.log(`   Chips count: ${scenario.chips.length}`);
    console.log(`   Expected Column 1: ${scenario.expected.column1 || 'N/A'}`);
    console.log(`   Expected Column 2: ${scenario.expected.column2 || 'N/A'}`);
    console.log(`   Expected Column 3: ${scenario.expected.column3 || 'N/A'}`);
    console.log(`   Awaiting Selection: ${scenario.expected.awaitingSelection || 'N/A'}`);
    if (scenario.expected.critical) {
      console.log(`   ⚠️  ${scenario.expected.critical}`);
    }
  }
  console.log();
});

console.log('='.repeat(80));
console.log('KEY VERIFICATION POINTS FOR QUERY 3');
console.log('='.repeat(80));
console.log();
console.log('✓ Stage 2: "for" is 2nd entry in Column 3 after Members');
console.log('✓ Stage 3: After "for", only Member Year and Member Type appear');
console.log('✓ Stage 5: "that have" is 1st entry in Column 3 after year selection');
console.log('✓ Stage 6: "Renewed" appears in Column 1 as an action');
console.log('✓ Stage 7: Renewed shows action connectors: in, from, for');
console.log('✓ Stage 8: December 2019 is 1st entry (calculated from baseYear - 1)');
console.log('✓ Stage 9: "or" appears as 1st entry (enabled by "in" for multi-select)');
console.log('✓ Stage 11: After 2nd month selection, "for" appears in Column 3');
console.log('✓ Stage 12: Final "for" shows only "Member Year" in Column 1');
console.log();
console.log('Special Features:');
console.log('  • "in" connector enables "or" logic for multi-month selection');
console.log('  • Month+Year values are dynamically generated based on selected year');
console.log('  • Connector placement varies by context (for appears in different places)');
console.log('  • Entry order matters: "for" is 2nd entry after Members, but 1st elsewhere');
console.log();
console.log('If these points work, Query 3 is correctly implemented!');
console.log();
