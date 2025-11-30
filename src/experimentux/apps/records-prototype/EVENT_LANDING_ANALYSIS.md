# Event Landing Page - Zone Structure Analysis

## Design Reference
**File**: `/central-ux-experiments/html-prototypes/Event-Landing-Adobe-Summit.png`

**Page Type**: Event Landing Page (Adobe Summit style)

---

## Zone Breakdown

### 1. **Navigation Zone** (Header)
- **Container Width**: `full` (edge-to-edge)
- **Background**: White
- **Elements**:
  - Logo (left-aligned)
  - Navigation links (center)
  - Action buttons (right-aligned: "Want to start", "Sign in")

```javascript
{
  id: 'nav',
  type: 'header',
  visible: true,
  containerWidth: 'full',
  padding: { x: 0, y: 0 },
  background: '#ffffff',
  rows: [
    {
      id: 'nav-row',
      columns: [
        { id: 'logo-col', span: 3, elements: [{ type: 'logo', data: { src: 'adobe-summit-logo.svg' } }] },
        { id: 'nav-col', span: 6, elements: [{ type: 'navigation', data: { links: [...] } }] },
        { id: 'actions-col', span: 3, elements: [{ type: 'action-buttons', data: { buttons: [...] } }] }
      ]
    }
  ]
}
```

---

### 2. **Hero Zone** (Full-width dark)
- **Container Width**: `full` (edge-to-edge)
- **Background**: Dark gradient (#1a1a1a → #2d2d2d)
- **Height**: ~600px
- **Elements**:
  - Event tagline ("Adobe Summit: The biggest...")
  - Large headline ("Discover what's next...")
  - Event details (date, location)
  - Body copy
  - CTA button ("Register")
  - Hero image (3D graphic, right-aligned)

```javascript
{
  id: 'hero',
  type: 'hero',
  visible: true,
  containerWidth: 'full',
  padding: { x: 0, y: 0 },
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
  rows: [
    {
      id: 'hero-row',
      columns: [
        {
          id: 'hero-content',
          span: 7,
          elements: [
            { type: 'eyebrow', data: { text: 'Adobe Summit: The biggest...' } },
            { type: 'headline', settings: { fontSize: '4xl', color: 'white' }, data: { text: 'Discover what\'s next...' } },
            { type: 'event-details', data: { date: 'April 22-25, 2026', location: 'Las Vegas...' } },
            { type: 'paragraph', settings: { color: 'neutral-300' }, data: { text: 'Join the future...' } },
            { type: 'cta-button', data: { text: 'Register', variant: 'primary' } }
          ]
        },
        {
          id: 'hero-image',
          span: 5,
          elements: [
            { type: 'image', settings: { objectFit: 'contain' }, data: { src: 'hero-3d-graphic.png' } }
          ]
        }
      ]
    }
  ]
}
```

---

### 3. **Speakers Section** (White background)
- **Container Width**: `wide` (1200px)
- **Background**: White
- **Elements**:
  - Section heading ("Our inspiring speakers...")
  - Speaker card grid (6 columns, responsive)

```javascript
{
  id: 'speakers',
  type: 'body',
  visible: true,
  containerWidth: 'wide',
  padding: { x: 8, y: 12 },
  background: '#ffffff',
  rows: [
    {
      id: 'speakers-heading',
      columns: [
        {
          id: 'heading-col',
          span: 12,
          elements: [
            { type: 'heading', settings: { level: 2, align: 'center' }, data: { text: 'Our inspiring speakers...' } }
          ]
        }
      ]
    },
    {
      id: 'speakers-grid',
      columns: [
        {
          id: 'speakers-col',
          span: 12,
          elements: [
            {
              type: 'speaker-grid',
              settings: { columns: 6, gap: 4 },
              data: {
                speakers: [
                  { name: 'Saturnino Borges', title: 'CEO', company: 'EY', photo: '...' },
                  { name: 'Lexi Reese', title: 'CMO', company: 'Gucci', photo: '...' },
                  // ... more speakers
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

---

### 4. **Sponsors Strip** (Light gray)
- **Container Width**: `wide`
- **Background**: Light gray (#f5f5f5)
- **Elements**:
  - Text ("Thank you to our 2025...")
  - Logo grid (horizontal, centered)

```javascript
{
  id: 'sponsors-strip',
  type: 'body',
  visible: true,
  containerWidth: 'wide',
  padding: { x: 8, y: 8 },
  background: '#f5f5f5',
  rows: [
    {
      id: 'sponsors-row',
      columns: [
        {
          id: 'sponsors-text',
          span: 4,
          elements: [
            { type: 'text', data: { text: 'Thank you to our 2025 Diamond sponsors...' } }
          ]
        },
        {
          id: 'sponsors-logos',
          span: 8,
          elements: [
            {
              type: 'logo-grid',
              settings: { columns: 7, gap: 4, align: 'center' },
              data: {
                logos: [
                  { name: 'EY', src: 'ey-logo.svg' },
                  { name: 'GE', src: 'ge-logo.svg' },
                  { name: 'IBM', src: 'ibm-logo.svg' },
                  // ... more logos
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

---

### 5. **Content Grid Section** (Mixed cards)
- **Container Width**: `wide`
- **Background**: White
- **Layout**: 2-column grid with various card types
- **Elements**:
  - Video card ("Learn from industry leaders")
  - Info card ("Earn your Adobe certification")
  - CTA card ("Arrive early for preconference")
  - Feature card ("Experience AI in action")
  - Stats card ("Make the case to attend", with chart)
  - Info card ("Join us online")

```javascript
{
  id: 'content-grid',
  type: 'body',
  visible: true,
  containerWidth: 'wide',
  padding: { x: 8, y: 12 },
  background: '#ffffff',
  rows: [
    {
      id: 'content-row-1',
      columns: [
        {
          id: 'card-1',
          span: 6,
          elements: [
            {
              type: 'content-card',
              settings: { variant: 'video', background: 'dark' },
              data: {
                title: 'Learn from industry leaders',
                description: '...',
                media: { type: 'video', thumbnail: '...', videoUrl: '...' },
                cta: { text: 'Browse sessions', url: '...' }
              }
            }
          ]
        },
        {
          id: 'card-2',
          span: 6,
          elements: [
            {
              type: 'content-card',
              settings: { variant: 'info', background: 'light' },
              data: {
                title: 'Earn your Adobe certification for free',
                description: '...',
                cta: { text: 'View courses', url: '...' }
              }
            }
          ]
        }
      ]
    },
    {
      id: 'content-row-2',
      columns: [
        {
          id: 'card-3',
          span: 6,
          elements: [
            {
              type: 'content-card',
              settings: { variant: 'cta', background: 'light' },
              data: {
                title: 'Arrive early for preconference training',
                description: '...',
                cta: { text: 'Learn more', url: '...' }
              }
            }
          ]
        },
        {
          id: 'card-4',
          span: 6,
          elements: [
            {
              type: 'content-card',
              settings: { variant: 'feature', background: 'dark' },
              data: {
                title: 'Experience AI in action',
                description: '...',
                media: { type: 'image', src: '...' }
              }
            }
          ]
        }
      ]
    },
    {
      id: 'content-row-3',
      columns: [
        {
          id: 'card-5',
          span: 6,
          elements: [
            {
              type: 'content-card',
              settings: { variant: 'stats', background: 'light' },
              data: {
                title: 'Make the case to attend Adobe Summit',
                description: '...',
                chart: { type: 'line', data: [...] },
                cta: { text: 'Download kit', url: '...' }
              }
            }
          ]
        },
        {
          id: 'card-6',
          span: 6,
          elements: [
            {
              type: 'content-card',
              settings: { variant: 'info', background: 'light' },
              data: {
                title: 'Join us online',
                description: '...',
                cta: { text: 'Register for free', url: '...' }
              }
            }
          ]
        }
      ]
    }
  ]
}
```

---

### 6. **Sponsors Section**
- **Container Width**: `wide`
- **Background**: Light gray
- **Elements**:
  - Heading ("Get to know our 2025...")
  - Sponsor logo/link

```javascript
{
  id: 'sponsors-section',
  type: 'body',
  visible: true,
  containerWidth: 'wide',
  padding: { x: 8, y: 8 },
  background: '#f5f5f5',
  rows: [
    {
      id: 'sponsors-heading-row',
      columns: [
        {
          id: 'sponsors-heading',
          span: 12,
          elements: [
            { type: 'heading', settings: { level: 3 }, data: { text: 'Get to know our 2025 Diamond sponsors' } }
          ]
        }
      ]
    },
    {
      id: 'sponsors-logo-row',
      columns: [
        {
          id: 'sponsor-logo',
          span: 12,
          elements: [
            { type: 'logo-link', data: { name: 'Accenture', logo: '...', url: '...' } }
          ]
        }
      ]
    }
  ]
}
```

---

### 7. **Footer Zone**
- **Container Width**: `full`
- **Background**: Dark gray
- **Elements**:
  - Multi-column link grid
  - Social icons
  - Copyright text
  - Legal links

```javascript
{
  id: 'footer',
  type: 'footer',
  visible: true,
  containerWidth: 'full',
  padding: { x: 8, y: 12 },
  background: '#2d2d2d',
  rows: [
    {
      id: 'footer-links-row',
      columns: [
        { id: 'about-col', span: 3, elements: [{ type: 'footer-links', data: { heading: 'About Adobe', links: [...] } }] },
        { id: 'connect-col', span: 3, elements: [{ type: 'footer-links', data: { heading: 'Connect with us', links: [...] } }] },
        { id: 'resources-col', span: 3, elements: [{ type: 'footer-links', data: { heading: 'Resources', links: [...] } }] },
        { id: 'social-col', span: 3, elements: [{ type: 'social-icons', data: { icons: ['facebook', 'twitter', 'linkedin'] } }] }
      ]
    },
    {
      id: 'footer-legal-row',
      columns: [
        {
          id: 'legal-col',
          span: 12,
          elements: [
            { type: 'footer-legal', data: { copyright: '...', links: [...] } }
          ]
        }
      ]
    }
  ]
}
```

---

## New Element Types Required

To fully support this page, we'd need these additional element types in the registry:

### Structure Elements
- ✅ `logo` - Company/event logo
- ✅ `navigation` - Navigation menu with links
- ✅ `action-buttons` - CTA button group
- 🆕 `hero` - Full-width hero section with background
- 🆕 `eyebrow` - Small text above headline

### Content Elements
- 🆕 `headline` - Large display headline
- 🆕 `event-details` - Date, location, format info
- ✅ `paragraph` - Body copy
- 🆕 `cta-button` - Call-to-action button
- ✅ `heading` - Section heading (h2, h3, etc.)
- ✅ `image` - Image with settings

### Complex Elements
- 🆕 `speaker-grid` - Grid of speaker cards
- 🆕 `logo-grid` - Horizontal logo grid
- 🆕 `content-card` - Multi-variant card (video, info, stats, feature)
- 🆕 `footer-links` - Footer column with links
- 🆕 `social-icons` - Social media icon links
- 🆕 `footer-legal` - Copyright and legal links

---

## Layout Preset: Event Landing

```javascript
// apps/records-prototype/src/layouts/presets.js
export const LAYOUT_PRESETS = {
  // ... existing presets

  'event-landing': {
    id: 'event-landing',
    name: 'Event Landing Page',
    description: 'Full-featured event landing page with hero, speakers, and content grid',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    zones: [
      {
        id: 'nav',
        type: 'header',
        visible: true,
        containerWidth: 'full',
        padding: { x: 0, y: 0 },
        rows: [
          // Navigation row with logo, links, buttons
        ]
      },
      {
        id: 'hero',
        type: 'hero',
        visible: true,
        containerWidth: 'full',
        padding: { x: 0, y: 0 },
        background: 'dark',
        rows: [
          // Hero content row
        ]
      },
      {
        id: 'speakers',
        type: 'body',
        visible: true,
        containerWidth: 'wide',
        padding: { x: 8, y: 12 },
        rows: []  // User adds speaker grid
      },
      {
        id: 'sponsors-strip',
        type: 'body',
        visible: true,
        containerWidth: 'wide',
        padding: { x: 8, y: 8 },
        background: '#f5f5f5',
        rows: []
      },
      {
        id: 'content-grid',
        type: 'body',
        visible: true,
        containerWidth: 'wide',
        padding: { x: 8, y: 12 },
        rows: []  // User adds content cards
      },
      {
        id: 'footer',
        type: 'footer',
        visible: true,
        containerWidth: 'full',
        padding: { x: 8, y: 12 },
        background: '#2d2d2d',
        rows: []
      }
    ],
    features: {
      insertMethod: 'both',
      showSlashHint: false,
      allowZoneToggle: true
    }
  }
};
```

---

## Key Insights

### 1. **Flexible Zone System Handles Complex Layouts**
This event landing page has 7 distinct zones with different:
- Container widths (full, wide)
- Backgrounds (white, dark, light gray)
- Padding values
- Content structures

The unified zone system supports all of this through configuration.

### 2. **Element Registry Scales**
Adding 10+ new element types (speaker-grid, content-card, logo-grid, etc.) is straightforward:
```javascript
ElementRegistry['speaker-grid'] = {
  component: SpeakerGridElement,
  category: 'event',
  icon: '...',
  description: 'Grid of speaker cards with photos and bios'
};
```

### 3. **No Artificial Limitations**
This page is neither:
- A "database page" ❌
- A "record page" ❌
- Any predefined "mode" ❌

It's a **custom layout** built from configurable zones and reusable elements. ✅

### 4. **Layout Presets Provide Starting Points**
Users can:
1. Choose "Event Landing Page" preset
2. Get a pre-configured zone structure
3. Customize zones, add/remove elements
4. Save as their own custom layout

---

## Comparison to Old Architecture

### ❌ **Old System (Two Parallel Architectures)**
- Can't build this page (not a database page, not a record page)
- Would need to hardcode a third page type
- ~500 more lines of duplicated code
- Inflexible zone structure

### ✅ **New System (Unified Zones)**
- Configure 7 zones with different settings
- Add 10+ element types to registry
- Create layout preset for reusability
- All existing features still work (slash commands, drag-drop, etc.)

---

## Recommendation

This event landing page is a **perfect validation** of the unified zone architecture:

1. **It can be built** with the proposed system
2. **It demonstrates flexibility** (7 zones, multiple backgrounds, varying widths)
3. **It requires new element types** (good test of registry extensibility)
4. **It proves the need** for the refactoring (old system can't handle this)

**Next Step**: Use this as a **reference implementation** during Phase 1-2 of the refactoring to ensure the system handles real-world complexity.
