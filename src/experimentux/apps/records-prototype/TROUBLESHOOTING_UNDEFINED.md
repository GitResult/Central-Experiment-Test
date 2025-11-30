# Troubleshooting "undefined is returned"

**Issue**: Getting `undefined` when trying to view the demo
**Status**: Diagnosing...

---

## 🔍 Quick Diagnosis

Let's identify where the undefined is coming from:

### Step 1: Test in Browser Console

1. Start the dev server:
```bash
npm run dev
```

2. Open http://localhost:3003 in your browser

3. Open DevTools Console (F12) and run:

```javascript
// Test 1: Check if modules load
import('./src/components/layouts/demoPages.js').then(m => {
  console.log('✅ Demo pages module loaded');
  console.log('getAllDemoPages:', m.getAllDemoPages);
  console.log('getDemoPageById:', m.getDemoPageById);

  const allDemos = m.getAllDemoPages();
  console.log('All demos:', allDemos);
  console.log('Demo count:', allDemos.length);

  const simpleDemo = m.getDemoPageById('demo-simple');
  console.log('Simple demo:', simpleDemo);

  if (!simpleDemo) {
    console.error('❌ demo-simple not found!');
    console.log('Available IDs:', allDemos.map(d => d.id));
  } else {
    console.log('✅ demo-simple loaded successfully');
    console.log('Zones:', simpleDemo.zones?.length);
  }
});
```

### Step 2: Use Test Component

I've created `TestDemoPages.jsx` which has built-in debugging. To use it:

**Option A**: Temporarily replace main app

Edit `src/main.jsx` or `src/index.jsx`:

```javascript
import TestDemoPages from './TestDemoPages';

root.render(
  <StrictMode>
    <TestDemoPages />  {/* Instead of <App /> */}
  </StrictMode>
);
```

**Option B**: Access via demo.html

Open: http://localhost:3003/demo.html

This will show:
- ✅ If demos loaded successfully
- ❌ Error details if they didn't
- 📊 Debug information about each demo

---

## 🐛 Common Issues & Solutions

### Issue 1: getDemoPageById returns undefined

**Symptom**: `getDemoPageById('demo-simple')` returns `undefined`

**Cause**: ID mismatch or export issue

**Solution**:
```javascript
// Check the actual IDs:
import { getAllDemoPages } from './src/components/layouts/demoPages';
console.log(getAllDemoPages().map(d => d.id));
// Should show: ['demo-simple', 'demo-event-landing', 'demo-multi-column']
```

### Issue 2: config.zones is undefined

**Symptom**: UniversalPage renders but shows empty page

**Cause**: Demo page config is missing zones array

**Solution**: Check the demo config:
```javascript
import { getDemoPageById } from './src/components/layouts/demoPages';
const demo = getDemoPageById('demo-simple');
console.log('Has zones?', demo?.zones);
console.log('Zone count:', demo?.zones?.length);
```

### Issue 3: Import/Export mismatch

**Symptom**: Functions are undefined when imported

**Cause**: Named vs default exports

**Check**:
```javascript
// In demoPages.js - these are NAMED exports:
export const getAllDemoPages = () => [...]
export const getDemoPageById = (id) => {...}

// So import them with curly braces:
import { getAllDemoPages, getDemoPageById } from './components/layouts/demoPages';

// NOT:
import getAllDemoPages from './components/layouts/demoPages'; // ❌ Wrong
```

### Issue 4: UniversalPage component not found

**Symptom**: "Cannot find module UniversalPage"

**Solution**: Check import path:
```javascript
// Should be:
import UniversalPage from './components/UniversalPage/UniversalPage';

// Check file exists:
ls -la src/components/UniversalPage/UniversalPage.jsx
```

---

## 🔧 Debug Steps

### 1. Verify File Structure

```bash
cd /home/user/central-ux-experiments/apps/records-prototype

# Check all required files exist:
ls -la src/components/layouts/demoPages.js
ls -la src/components/UniversalPage/UniversalPage.jsx
ls -la src/components/UniversalPage/ZoneRenderer.jsx
ls -la src/components/UniversalPage/ElementRenderer.jsx
ls -la src/components/elements/registry.js
```

### 2. Test Demo Pages Directly

Create a simple test file:

```javascript
// test-demo.js
import { getAllDemoPages, getDemoPageById } from './src/components/layouts/demoPages.js';

console.log('=== TESTING DEMO PAGES ===');

const allDemos = getAllDemoPages();
console.log('Total demos:', allDemos.length);

allDemos.forEach(demo => {
  console.log(`\n📄 ${demo.name} (${demo.id})`);
  console.log(`   Preset: ${demo.layoutPresetId}`);
  console.log(`   Zones: ${demo.zones?.length || 0}`);
  console.log(`   Features: ${JSON.stringify(demo.features)}`);
});

console.log('\n=== TESTING getDemoPageById ===');
const testIds = ['demo-simple', 'demo-event-landing', 'demo-multi-column'];

testIds.forEach(id => {
  const demo = getDemoPageById(id);
  console.log(`${id}: ${demo ? '✅ Found' : '❌ Not found'}`);
  if (demo) {
    console.log(`   - Name: ${demo.name}`);
    console.log(`   - Zones: ${demo.zones.length}`);
  }
});
```

Run it:
```bash
node test-demo.js
```

### 3. Check Browser Network Tab

1. Open DevTools → Network tab
2. Reload page
3. Look for any failed requests (red)
4. Check if demoPages.js loads successfully

### 4. Check Console for Errors

Look for these errors:
- `Cannot find module` - Import path wrong
- `undefined is not a function` - Export/import mismatch
- `Cannot read property 'zones' of undefined` - Config undefined

---

## 📋 Verification Checklist

- [ ] Dev server running (`npm run dev`)
- [ ] Browser console shows no errors
- [ ] `getAllDemoPages()` returns array of 3 demos
- [ ] `getDemoPageById('demo-simple')` returns object (not undefined)
- [ ] Demo object has `zones` array
- [ ] Demo object has `id`, `name`, `layoutPresetId`
- [ ] UniversalPage component exists and imports correctly
- [ ] Element registry has all 15 elements

---

## 🚀 Working Example

Here's a minimal working example to copy-paste:

```javascript
import React from 'react';
import UniversalPage from './components/UniversalPage/UniversalPage';
import { getDemoPageById } from './components/layouts/demoPages';

function MinimalDemo() {
  // Get the demo config
  const demoConfig = getDemoPageById('demo-simple');

  // Debug logging
  console.log('Demo config:', demoConfig);

  // Error handling
  if (!demoConfig) {
    return <div style={{ padding: '2rem', color: 'red' }}>
      Error: Could not load demo-simple
    </div>;
  }

  if (!demoConfig.zones) {
    return <div style={{ padding: '2rem', color: 'red' }}>
      Error: Demo config missing zones: {JSON.stringify(demoConfig)}
    </div>;
  }

  // Success - render the demo
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Minimal Demo Test</h1>
      <p>Config loaded: {demoConfig.name}</p>
      <p>Zones: {demoConfig.zones.length}</p>

      <hr style={{ margin: '2rem 0' }} />

      <UniversalPage
        pageId="minimal-test"
        config={demoConfig}
        containerContext="page"
        onUpdate={(newConfig) => console.log('Updated:', newConfig)}
      />
    </div>
  );
}

export default MinimalDemo;
```

Save as `src/MinimalDemo.jsx` and render it in your app.

---

## 📞 What to Share

If still having issues, please share:

1. **Console output** from Step 1 above
2. **Browser console errors** (screenshot or copy-paste)
3. **Network tab** - any failed requests?
4. **Which option** you're trying (Option 1, 2, or 3 from HOW_TO_VIEW_DEMO.md)
5. **Code snippet** showing how you're trying to render the demo

---

## ✅ Expected Behavior

When working correctly, you should see:

**In Console**:
```
UniversalPage render: {
  pageId: "demo-simple",
  config: {
    id: "demo-simple",
    name: "Simple Demo",
    layoutPresetId: "database-page",
    zones: [Array(2)],
    features: {…}
  },
  containerContext: "page"
}
```

**On Screen**:
```
🚀 Welcome to Universal Page System
   A unified, flexible zone-based architecture

Key Features
The Unified Page System eliminates ~1,500 lines of duplicated code...

How It Works
Pages are composed of zones, which contain rows...
```

---

## 🔗 Next Steps

1. Run the console test from Step 1
2. Try the TestDemoPages component
3. Check for errors in browser console
4. Share results if still stuck

The issue is likely one of:
- Import/export mismatch
- File path incorrect
- Config not passed correctly to UniversalPage
- Build/bundle issue (try clearing cache: `rm -rf node_modules/.vite && npm run dev`)
