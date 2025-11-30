# Replace Database Page with Universal Page System

**Objective**: Replace the existing inline database page implementation in `App.jsx` with the new Unified Page System, eliminating ~500 lines of duplicated code and leveraging the 15 reusable element components.

---

## 📋 Task Overview

**What to Replace**: The database page rendering logic in `src/App.jsx` (starting at line ~20407)

**Replace With**: UniversalPage component with proper config structure

**Expected Outcome**:
- Cleaner, more maintainable code
- Reusable element components
- Consistent architecture with future pages
- No loss of functionality (cover, icon, title, description, body elements)

---

## 🎯 Step 1: Understand Current Implementation

### Current Structure (lines 20407-20850 approx)

The existing database page has this structure:

```javascript
if (activePage.type === 'database') {
  const settings = activePage.settings || {};
  const cover = settings.cover || {};
  const header = settings.header || {};
  const body = settings.body || {};

  return (
    <div>
      {/* Cover Image Zone - Full width, drag to reposition */}
      {cover.enabled && cover.image && (
        <div className="...">
          <img src={cover.image} />
          {/* Change/Remove buttons */}
        </div>
      )}

      {/* Add Cover Button (when no cover) */}
      {!cover.enabled && (<button>Add cover</button>)}

      {/* Page Icon (overlaps cover if present) */}
      {header.icon && (
        <button>{header.icon}</button>
      )}

      {/* Header Zone - Title and Description */}
      <div className="px-12">
        <input value={header.title} placeholder="Untitled" />
        <input value={header.description} placeholder="Add a description..." />
      </div>

      {/* Body Zone - Content Elements */}
      <div className="px-12 mt-8 pb-24">
        {/* Slash input for adding elements */}
        {/* Render body.elements array */}
      </div>
    </div>
  );
}
```

### Key Features to Preserve

1. **Cover Image**:
   - Full-width, edge-to-edge
   - Drag to reposition (vertical position 0-100%)
   - Change/Remove buttons on hover
   - Add cover button when not present

2. **Page Icon**:
   - Emoji picker integration
   - Overlaps cover image when present
   - Add icon button when not present

3. **Header**:
   - Title input (updates page name)
   - Description input

4. **Body**:
   - Slash command (`/`) to add elements
   - Dynamic element rendering
   - Element editing (double-click)

5. **State Management**:
   - Updates stored in `customPages` array
   - Updates the page at `activePage.id`
   - Settings stored in `activePage.settings`

---

## 🔧 Step 2: Create Migration Function

Before replacing, create a function to convert old database page configs to unified format.

**Location**: Add to `src/utils/configMigration.js` (already exists)

**Function**: `migrateDatabasePageToUniversal(activePage)`

```javascript
/**
 * Convert old database page format to UniversalPage config
 * @param {Object} oldPage - Old database page with settings.cover/header/body
 * @returns {Object} UniversalPage config
 */
export const migrateDatabasePageToUniversal = (oldPage) => {
  const settings = oldPage.settings || {};
  const cover = settings.cover || {};
  const header = settings.header || {};
  const body = settings.body || {};

  const zones = [];
  let zoneIndex = 0;

  // Zone 1: Cover Image (if enabled)
  if (cover.enabled && cover.image) {
    zones.push({
      id: `zone-${zoneIndex++}`,
      width: 'full',
      padding: 'none',
      backgroundColor: 'transparent',
      borderBottom: 'none',
      visible: true,
      rows: [
        {
          id: `row-cover`,
          columns: [
            {
              id: `col-cover`,
              span: 12,
              elements: [
                {
                  id: `elem-cover`,
                  type: 'cover-image',
                  data: {
                    image: cover.image,
                    position: cover.verticalPosition || 50,
                    alt: 'Cover Image'
                  },
                  settings: {
                    height: '340px',
                    showControls: true
                  }
                }
              ]
            }
          ]
        }
      ]
    });
  }

  // Zone 2: Header (Icon + Title + Description)
  const headerElements = [];

  if (header.icon) {
    headerElements.push({
      id: `elem-icon`,
      type: 'page-icon',
      data: {
        icon: header.icon,
        size: 'large'
      },
      settings: {
        marginTop: cover.enabled ? '-39px' : '40px'
      }
    });
  }

  headerElements.push({
    id: `elem-title`,
    type: 'title',
    data: {
      text: header.title || 'Untitled'
    },
    settings: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      editable: true,
      placeholder: 'Untitled'
    }
  });

  if (header.description) {
    headerElements.push({
      id: `elem-description`,
      type: 'description',
      data: {
        text: header.description
      },
      settings: {
        editable: true,
        placeholder: 'Add a description...'
      }
    });
  }

  zones.push({
    id: `zone-${zoneIndex++}`,
    width: 'notion',  // 700px max width
    padding: 'large',
    backgroundColor: 'transparent',
    visible: true,
    rows: [
      {
        id: `row-header`,
        columns: [
          {
            id: `col-header`,
            span: 12,
            elements: headerElements
          }
        ]
      }
    ]
  });

  // Zone 3: Body Content
  const bodyElements = (body.elements || []).map(elem => {
    // Convert old element format to new format
    switch (elem.type) {
      case 'text':
        return {
          id: elem.id,
          type: 'text',
          data: { text: elem.content || '' },
          settings: { editable: true }
        };
      case 'heading':
        return {
          id: elem.id,
          type: 'heading',
          data: { text: elem.content || '', level: elem.level || 2 },
          settings: { editable: true }
        };
      // Add more element type conversions as needed
      default:
        return elem;
    }
  });

  zones.push({
    id: `zone-${zoneIndex++}`,
    width: 'notion',
    padding: 'large',
    backgroundColor: 'transparent',
    visible: true,
    rows: bodyElements.length > 0 ? [
      {
        id: `row-body`,
        columns: [
          {
            id: `col-body`,
            span: 12,
            elements: bodyElements
          }
        ]
      }
    ] : []
  });

  return {
    id: oldPage.id,
    name: oldPage.name,
    layoutPresetId: 'database-page',
    zones: zones,
    features: {
      showAddCover: !cover.enabled,
      showAddIcon: !header.icon,
      enableSlashCommand: true,
      enableElementEditing: true
    },
    metadata: {
      createdAt: oldPage.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      migratedFrom: 'database-page-legacy'
    }
  };
};
```

---

## 🔄 Step 3: Replace Rendering Logic

### Find the Section to Replace

**Location**: `src/App.jsx`, line ~20407

**Search for**:
```javascript
if (activePage.type === 'database') {
  const settings = activePage.settings || {};
  // ... ~450 lines of inline JSX ...
  return (
    <div className="animate-view-fade-in">
      {/* Cover, Icon, Header, Body */}
    </div>
  );
}
```

### Replace With

```javascript
if (activePage.type === 'database') {
  // Migrate old format to universal format on-the-fly
  // (Later, you can run batch migration to convert all pages permanently)
  const universalConfig = isUniversalPageConfig(activePage.settings?.universalConfig)
    ? activePage.settings.universalConfig
    : migrateDatabasePageToUniversal(activePage);

  return (
    <div className="animate-view-fade-in">
      <UniversalPage
        pageId={activePage.id}
        config={universalConfig}
        containerContext="page"
        onUpdate={(newConfig) => {
          // Update the page with new universal config
          setCustomPages(customPages.map(p =>
            p.id === activePage.id
              ? {
                  ...p,
                  name: newConfig.name || p.name,
                  settings: {
                    ...p.settings,
                    universalConfig: newConfig
                  }
                }
              : p
          ));
        }}
      />
    </div>
  );
}
```

### What This Does

1. **Checks** if the page already has a universal config
2. **Migrates** the old format if not (backward compatible!)
3. **Renders** using UniversalPage component
4. **Updates** state when page is edited
5. **Preserves** the page name when title changes

---

## 🧪 Step 4: Add Required Imports

At the top of `src/App.jsx`, ensure these imports exist:

```javascript
// Unified Page System Components
import UniversalPage from './components/UniversalPage/UniversalPage';
import { LAYOUT_PRESETS, createPageConfigFromPreset } from './components/layouts/presets';

// Migration utilities
import {
  migrateDatabasePageToUniversal,
  isUniversalPageConfig
} from './utils/configMigration';
```

**Note**: The first two imports already exist. You only need to add the migration imports.

---

## ✅ Step 5: Test the Replacement

### Test Checklist

1. **Existing Database Pages**:
   - [ ] Open an existing database page
   - [ ] Verify cover image displays (if present)
   - [ ] Verify icon displays (if present)
   - [ ] Verify title and description display
   - [ ] Verify body elements render correctly

2. **Editing Features**:
   - [ ] Double-click title to edit
   - [ ] Double-click description to edit
   - [ ] Double-click text elements to edit
   - [ ] Verify changes save to state

3. **Cover Image**:
   - [ ] Drag to reposition (if cover exists)
   - [ ] Click "Change" to update cover
   - [ ] Click "Remove" to delete cover
   - [ ] Click "Add cover" when no cover (if button visible)

4. **Page Icon**:
   - [ ] Click icon to change emoji
   - [ ] Click "Add icon" when no icon (if button visible)

5. **Body Content**:
   - [ ] Type `/` to open slash palette
   - [ ] Add new elements (text, heading, etc.)
   - [ ] Verify elements render in body zone

6. **State Management**:
   - [ ] Verify updates save to `customPages` array
   - [ ] Refresh page - verify data persists (if using localStorage)
   - [ ] Switch to another page and back - verify state preserved

---

## 🎨 Step 6: Handle Special Features

### Slash Command Integration

The UniversalPage component should have SlashPalette built-in. If you need to trigger it from the old flow:

**Existing code** (lines ~20600-20607):
```javascript
onChange={(e) => {
  if (e.target.value === '/') {
    setShowSlashPalette(true);
  }
}}
```

**New approach**: UniversalPage handles this internally. You can remove the `showSlashPalette` state and related code.

### Emoji Picker Integration

**Existing code**:
```javascript
const [showEmojiPicker, setShowEmojiPicker] = useState(false);

<button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
  {header.icon || '😊'}
</button>

{showEmojiPicker && (
  <EmojiPicker onEmojiClick={(emoji) => {
    // Update icon
  }} />
)}
```

**New approach**: The `page-icon` element handles emoji picking internally. However, if you want to keep the existing emoji picker modal:

1. Add an `onIconClick` handler to UniversalPage props
2. Show your emoji picker modal when triggered
3. Update the config when emoji selected

**Alternative**: Use the PageIconElement's built-in emoji picker (recommended for consistency).

### Cover Image Upload (Unsplash Modal)

**Existing code**:
```javascript
const [showUnsplashModal, setShowUnsplashModal] = useState(false);

<button onClick={() => setShowUnsplashModal(true)}>
  Change
</button>

{showUnsplashModal && <UnsplashModal />}
```

**New approach**: The `cover-image` element has built-in controls. To integrate with your existing Unsplash modal:

**Option 1**: Modify CoverImageElement to accept `onChangeClick` prop:
```javascript
// In CoverImageElement.jsx
<button onClick={() => onChangeClick?.()}>Change</button>

// In App.jsx
<UniversalPage
  onCoverChange={() => setShowUnsplashModal(true)}
  {...otherProps}
/>
```

**Option 2**: Use CoverImageElement's built-in upload (accepts file input or URL).

---

## 🗑️ Step 7: Clean Up Old Code

After successful replacement, you can remove:

### State Variables (lines ~4780-4800)

Remove these if no longer used:
```javascript
const [showEmojiPicker, setShowEmojiPicker] = useState(false);
const [showUnsplashModal, setShowUnsplashModal] = useState(false);
const [showRepositionModal, setShowRepositionModal] = useState(false);
const [showSlashPalette, setShowSlashPalette] = useState(false);
const [slashPalettePosition, setSlashPalettePosition] = useState({ x: 0, y: 0 });
const [isDraggingCover, setIsDraggingCover] = useState(false);
const [coverDragStartY, setCoverDragStartY] = useState(0);
const [coverDragStartPosition, setCoverDragStartPosition] = useState(50);
```

**Important**: Only remove these if they're not used by other page types or features.

### Helper Functions

Search for functions that were only used by database page and remove them.

---

## 📊 Step 8: Optional Batch Migration

Once you've verified the replacement works, you can permanently convert all existing database pages:

```javascript
// Run this once to migrate all pages
import { migrateDatabasePageToUniversal } from './utils/configMigration';

const migrateAllDatabasePages = () => {
  setCustomPages(customPages.map(page => {
    if (page.type === 'database' && !page.settings?.universalConfig) {
      const universalConfig = migrateDatabasePageToUniversal(page);
      return {
        ...page,
        settings: {
          ...page.settings,
          universalConfig: universalConfig
        }
      };
    }
    return page;
  }));
  console.log('Migration complete! All database pages converted to universal format.');
};

// Call this manually or add a UI button
migrateAllDatabasePages();
```

After migration, you can simplify the rendering code:

```javascript
if (activePage.type === 'database') {
  const config = activePage.settings.universalConfig;

  return (
    <div className="animate-view-fade-in">
      <UniversalPage
        pageId={activePage.id}
        config={config}
        containerContext="page"
        onUpdate={(newConfig) => {
          setCustomPages(customPages.map(p =>
            p.id === activePage.id
              ? { ...p, name: newConfig.name, settings: { ...p.settings, universalConfig: newConfig } }
              : p
          ));
        }}
      />
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### Issue 1: Elements Don't Display

**Symptom**: Page renders but elements are missing

**Solution**:
1. Check browser console for errors
2. Verify `config.zones` is an array
3. Verify each zone has `rows` array
4. Verify each row has `columns` array
5. Verify each column has `elements` array
6. Check element types are valid (see registry.js)

### Issue 2: Edits Don't Save

**Symptom**: Can edit elements but changes don't persist

**Solution**:
1. Verify `onUpdate` callback is provided to UniversalPage
2. Check that `onUpdate` is calling `setCustomPages`
3. Verify the page ID matches: `p.id === activePage.id`
4. Check React DevTools to see if state updates

### Issue 3: Cover Image Not Repositioning

**Symptom**: Can't drag cover image to reposition

**Solution**:
1. Check CoverImageElement has `showControls: true` in settings
2. Verify mouse event handlers are not being blocked
3. Check that `onUpdate` callback is working

### Issue 4: Migration Errors

**Symptom**: `migrateDatabasePageToUniversal` throws errors

**Solution**:
1. Check that `activePage` is not null/undefined
2. Verify `activePage.settings` exists (use `|| {}`)
3. Check that old element types are handled in migration
4. Add console.log to debug which field is missing

---

## 📚 Reference

### UniversalPage Props

```typescript
{
  pageId: string;              // Unique page identifier
  config: UniversalPageConfig; // Page configuration object
  containerContext: 'page' | 'frame'; // Rendering context
  onUpdate: (newConfig: UniversalPageConfig) => void; // Update callback
}
```

### UniversalPageConfig Structure

```typescript
{
  id: string;
  name: string;
  layoutPresetId?: string;
  zones: Array<{
    id: string;
    width: 'notion' | 'standard' | 'wide' | 'full';
    padding: 'none' | 'small' | 'medium' | 'large';
    backgroundColor?: string;
    borderBottom?: string;
    visible: boolean;
    rows: Array<{
      id: string;
      columns: Array<{
        id: string;
        span: number; // 1-12
        elements: Array<{
          id: string;
          type: string; // See element types below
          data: object;
          settings: object;
        }>;
      }>;
    }>;
  }>;
  features?: {
    showAddCover?: boolean;
    showAddIcon?: boolean;
    enableSlashCommand?: boolean;
    enableElementEditing?: boolean;
  };
  metadata?: {
    createdAt: string;
    updatedAt: string;
  };
}
```

### Available Element Types

- `cover-image` - Full-width cover with drag-to-reposition
- `page-icon` - Emoji icon with picker
- `title` - Large heading (editable)
- `description` - Subtitle text (editable)
- `text` - Body text (editable)
- `heading` - Section heading (h2, h3, etc.)
- `image` - Inline image
- `button` - Call-to-action button
- `content-card` - Card layout
- `breadcrumb` - Navigation breadcrumbs
- `data-grid` - Interactive table
- `metadata-bar` - Metadata display
- `form-field` - Form inputs
- `grid-layout` - Grid container
- `canvas-layout` - Canvas container

---

## ✅ Success Criteria

Your replacement is successful when:

1. ✅ All existing database pages render correctly
2. ✅ Cover images display and reposition
3. ✅ Icons display and can be changed
4. ✅ Titles and descriptions are editable
5. ✅ Body content renders with all elements
6. ✅ Slash command works to add new elements
7. ✅ Double-click editing works on text elements
8. ✅ Changes persist to state/localStorage
9. ✅ No console errors
10. ✅ ~450 lines of code removed from App.jsx
11. ✅ Build succeeds (`npm run build`)
12. ✅ All existing features work as before

---

## 🎯 Expected Impact

**Before**:
- ~450 lines of inline JSX in App.jsx
- Duplicate logic for cover/icon/title/description
- Hard to maintain and extend
- No reusable components

**After**:
- ~15 lines of rendering code in App.jsx
- Reusable element components
- Easy to add new element types
- Consistent with future page types
- Better performance (lazy loading)

---

## 📖 Next Steps After Completion

1. Test with real user data
2. Run batch migration to convert all pages
3. Remove old state variables and helpers
4. Update documentation
5. Consider replacing other page types (data-record, etc.)

---

**Questions?** See:
- `QUICK_START_UNIFIED_PAGES.md` - Element usage guide
- `TROUBLESHOOTING_UNDEFINED.md` - Debug guide
- `UNIFIED_PAGE_SYSTEM_COMPLETE.md` - Complete architecture docs
- `src/components/elements/registry.js` - All element types
- `demo.html` - Working examples

---

**Ready to start?** Begin with Step 2 and work through each step methodically. Test frequently and commit after each successful step!
