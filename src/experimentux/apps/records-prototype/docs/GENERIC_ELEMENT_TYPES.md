# Generic Element Types & Domain Architecture

**Date:** 2025-11-21
**Status:** ✅ Approved Architecture
**Purpose:** Define domain-based element architecture with four core types and clear storage intent

---

## Executive Summary

After comprehensive evaluation, we've established a **domain-based architecture** that clarifies storage intent and provides natural categorization:

**Two Core Domains:**
1. **data** - Elements persisted to database (stored, queryable)
2. **ui** - Elements for presentation only (ephemeral, not stored)

**Four Element Types:**
1. **field** (data domain) - Atomic data inputs stored in database
2. **record** (data domain) - Complex data structures stored in database
3. **markup** (ui domain) - Content presentation elements (text, buttons, icons)
4. **structure** (ui domain) - Layout and container elements (grids, cards, modals)

**Five Organized Setting Groups:**
1. **Layout** - Position, dimensions, alignment, spacing
2. **Appearance** - Colors, borders, shadows (theme-based, no hard-coded values)
3. **Data** - Binding, format, validation, slash commands
4. **Typography** - Fonts and text styling
5. **Business Rules** - Visibility, permissions, conditional logic, animation

**Key Architectural Decisions:**
- Domain determines storage: `data` domain persisted, `ui` domain ephemeral
- Implicit domain inference: type names imply domain (field/record = data, markup/structure = ui)
- Flexible nesting: structure can contain structures/field/record/markup (max depth: 3)
- Explicit binding modes: Data flow explicitly defined (static, bound-read, bound-write, bound-bidirectional)
- Semantic roles: Structures can declare semantic purpose (hero, navigation, footer, sidebar, etc.)
- Fuzzy token matching: CSS values map to closest theme tokens with confidence scores
- Subtype system: Each type has subtypes (fieldType, recordType, markupType, structureType)
- Clear team boundaries: Data team owns field/record, UI team owns markup/structure

---

## Domain-Based Architecture

### Philosophy

**Storage intent is fundamental:**
- **data domain** = Persisted to database, queryable, part of page data
- **ui domain** = Ephemeral presentation, not stored, purely visual

**Type categorization:**
- **field** = Atomic data inputs (text, email, select, etc.)
- **record** = Complex data structures (images, products, events, etc.)
- **markup** = Content presentation (titles, paragraphs, buttons, icons)
- **structure** = Layout containers (grids, cards, tabs, modals)

This four-type system provides:
✅ **Clear storage intent** - Domain tells you if it persists
✅ **Natural categorization** - Structure fits cleanly in UI domain
✅ **Scalable architecture** - Easy to add new subtypes within each type
✅ **Team boundaries** - Clear ownership (data team vs UI team)
✅ **Query optimization** - Efficient queries by domain

---

## Domain Taxonomy

```
DOMAIN: data (persisted to database)
├─ TYPE: field
│  └─ SUBTYPE: fieldType
│     - text, textarea, email, number, date, time
│     - selectSingle, selectMulti, checkbox
│     - tel, url, file, color, range
│
└─ TYPE: record
   └─ SUBTYPE: recordType
      Media: image, video, audio, file
      Data: metadata, data-table, chart, timeline
      Entities: person, organization, product, event, address, contact

DOMAIN: ui (ephemeral, not persisted)
├─ TYPE: markup
│  └─ SUBTYPE: markupType
│     Text: title, heading, paragraph, subtitle, label, quote, code
│     Interactive: button, link
│     Decorative: icon, divider, spacer
│
└─ TYPE: structure
   └─ SUBTYPE: structureType
      Basic: div, stack
      Layout: grid, flex
      Styled: card, panel
      Interactive: tabs, accordion, modal, drawer, carousel
      Advanced: canvas
```

---

## Hierarchy Visualization

```
Page
└─ Zone
   └─ Row
      └─ Column
         └─ Element (field | record | markup | structure)
            └─ [If type: structure] (depth 1)
               └─ Element (structure | field | record | markup)
                  └─ [If type: structure] (depth 2)
                     └─ Element (structure | record | markup)
                        └─ [If type: structure] (depth 3)
                           └─ Leaf Element (record | markup only)
                              ↑ Max nesting depth: 3
```

**Nesting Rules (Updated):**
- Zones contain Rows
- Rows contain Columns
- Columns contain Elements (field, record, markup, or structure)
- **Structure** can contain Elements including other structures up to depth 3
- **Depth restrictions:**
  - Depth 1: All types allowed (structure, field, record, markup)
  - Depth 2: structure, record, markup (no fields)
  - Depth 3: record, markup only (no fields, no further structures)
  - Depth 4+: Not allowed
- Field, record, markup without children are leaf nodes (cannot contain children)
- Covers 95% of real-world HTML nesting patterns

---

## 1. Field Element (Data Domain)

**Type:** `field`
**Domain:** `data` (persisted to database)
**Purpose:** Atomic data inputs that store user-entered values

### Field Types (Subtypes)

```javascript
fieldType:
  | 'text'           // Single-line text input
  | 'textarea'       // Multi-line text input
  | 'email'          // Email with validation
  | 'number'         // Numeric input
  | 'date'           // Date picker
  | 'time'           // Time picker
  | 'selectSingle'   // Single option selection
  | 'selectMulti'    // Multiple option selection
  | 'checkbox'       // Boolean checkbox
  | 'tel'            // Phone number
  | 'url'            // URL input
  | 'file'           // File upload
  | 'color'          // Color picker
  | 'range'          // Slider
```

### Input Type (UI Representation)

For selection fields (`selectSingle` and `selectMulti`), the `inputType` setting controls UI representation:

```javascript
inputType:
  | 'dropdown'       // Standard dropdown menu
  | 'radio'          // Radio button group (selectSingle only)
  | 'pill'           // Pill/tag selector
  | 'checkbox-group' // Checkbox group (selectMulti only)
  | 'toggle'         // Toggle switches
  | 'button-group'   // Button group selector
```

### Settings Structure

```javascript
{
  type: 'field',
  data: { value: any },
  settings: {
    // Common setting groups (inherited by all element types)
    layout: { ... },          // Layout – Position and structure
    appearance: { ... },      // Appearance – Colors, borders, shadows
    data: { ... },            // Data – Binding, format, validation
    typography: { ... },      // Typography – Fonts and text styling
    businessRules: { ... },   // Business Rules – Visibility, permissions

    // Field-specific settings
    field: {
      fieldType: string,      // ← Subtype
      label: string,
      placeholder: string,
      helpText: string,
      required: boolean,
      disabled: boolean,
      readonly: boolean,

      // For selectSingle and selectMulti
      options: Array<{ label: string, value: any }>,
      inputType: 'dropdown' | 'radio' | 'pill' | 'checkbox-group' | 'toggle' | 'button-group'
    }
  }
}
```

### Examples

```javascript
// Email field with validation
{
  id: 'email-field',
  type: 'field',
  data: { value: '' },
  settings: {
    layout: { width: 'full' },
    appearance: {
      border: {
        width: '1px',
        style: 'solid',
        color: '{{theme.colors.border.default}}'
      }
    },
    data: {
      bindingMode: 'bound-write',  // Explicit data flow: write user input to database
      binding: {
        source: 'form.contact',
        property: 'email',
        mode: 'write'
      },
      validation: {
        required: true,
        pattern: '^[^@]+@[^@]+\\.[^@]+$',
        errorMessage: '{{i18n.validation.invalidEmail}}'
      }
    },
    typography: {
      fontSize: '{{theme.typography.fontSize.base}}'
    },
    businessRules: {
      visibility: { hidden: false }
    },
    field: {
      fieldType: 'email',
      label: 'Email Address',
      placeholder: '{{i18n.fields.email.placeholder}}',
      required: true
    }
  }
}

// Single select dropdown
{
  type: 'field',
  data: { value: '' },
  settings: {
    field: {
      fieldType: 'selectSingle',
      label: 'Country',
      inputType: 'dropdown',
      options: [
        { label: 'United States', value: 'us' },
        { label: 'Canada', value: 'ca' },
        { label: 'Mexico', value: 'mx' }
      ]
    }
  }
}

// Single select as radio buttons
{
  type: 'field',
  data: { value: '' },
  settings: {
    field: {
      fieldType: 'selectSingle',
      label: 'Preferred Contact Method',
      inputType: 'radio',
      options: [
        { label: 'Email', value: 'email' },
        { label: 'Phone', value: 'phone' },
        { label: 'SMS', value: 'sms' }
      ]
    }
  }
}

// Multi select as checkbox group
{
  type: 'field',
  data: { value: [] },
  settings: {
    field: {
      fieldType: 'selectMulti',
      label: 'Interests',
      inputType: 'checkbox-group',
      options: [
        { label: 'Technology', value: 'tech' },
        { label: 'Design', value: 'design' },
        { label: 'Business', value: 'business' },
        { label: 'Marketing', value: 'marketing' }
      ]
    }
  }
}

// Multi select as pill selector
{
  type: 'field',
  data: { value: [] },
  settings: {
    field: {
      fieldType: 'selectMulti',
      label: 'Tags',
      inputType: 'pill',
      options: [
        { label: 'Urgent', value: 'urgent' },
        { label: 'Important', value: 'important' },
        { label: 'Review', value: 'review' }
      ]
    }
  }
}
```

---

## 2. Record Element (Data Domain)

**Type:** `record`
**Domain:** `data` (persisted to database)
**Purpose:** Complex data structures - media, entities, visualizations

### Record Types (Subtypes)

```javascript
recordType:
  // Media records
  | 'image'          // Image with metadata
  | 'video'          // Video embed/upload
  | 'audio'          // Audio player
  | 'file'           // File download link

  // Data display records
  | 'metadata'       // Metadata bar display
  | 'data-table'     // Data grid/table
  | 'chart'          // Data visualizations
  | 'timeline'       // Activity feed/history

  // Entity records
  | 'person'         // Person/profile information
  | 'organization'   // Company/organization
  | 'product'        // Product/service information
  | 'event'          // Event/meeting information
  | 'address'        // Address block
  | 'contact'        // Contact information
```

### Layout Options (Record Display)

Standard layout options control how record data is presented:

```javascript
layoutType:
  | 'link'           // Single actionable link
  | 'list'           // Vertical item list
  | 'card'           // Grouped block of information
  | 'grid'           // Tabular data view
  | 'visualizations' // Charts and graphs
  | 'custom'         // User-defined template
```

### Settings Structure

```javascript
{
  type: 'record',
  data: { ... },  // Varies by recordType
  settings: {
    // Common setting groups
    layout: { ... },          // Layout – Position and structure
    appearance: { ... },      // Appearance – Colors, borders, shadows
    data: { ... },            // Data – Binding, format, validation
    typography: { ... },      // Typography – Fonts and text styling
    businessRules: { ... },   // Business Rules – Visibility, permissions

    // Record-specific settings
    record: {
      recordType: string,     // ← Subtype
      layoutType: 'link' | 'list' | 'card' | 'grid' | 'visualizations' | 'custom',

      // For media types (image/video/audio)
      src: string,
      alt: string,
      caption: string,
      width: string,
      height: string,
      aspectRatio: string,
      objectFit: string,
      enableUpload: boolean,
      enableRepositioning: boolean,

      // For metadata type
      fields: Array<{
        label: string,
        value: any,
        type: 'date' | 'user' | 'status' | 'tag' | 'text'
      }>,

      // For data-table type
      columns: Array<{
        id: string,
        name: string,
        type: string,
        sortable: boolean,
        editable: boolean
      }>,
      rows: Array<Object>,
      features: {
        sorting: boolean,
        filtering: boolean,
        export: boolean,
        editing: boolean
      },

      // For chart type
      chartType: 'line' | 'bar' | 'pie' | 'scatter' | 'area',
      xAxis: { label: string, field: string },
      yAxis: { label: string, field: string },
      showLegend: boolean,
      interactive: boolean,

      // For person type
      showPhoto: boolean,
      showContact: boolean,
      showBio: boolean,

      // For organization type
      showLogo: boolean,
      showStats: boolean,

      // For product type
      showPrice: boolean,
      showRating: boolean,
      enablePurchase: boolean,

      // For event type
      showAttendees: boolean,
      allowRSVP: boolean,

      // For timeline type
      showIcons: boolean,
      groupByDate: boolean
    }
  }
}
```

### Examples

```javascript
// Image record
{
  type: 'record',
  data: {
    src: 'https://example.com/photo.jpg',
    alt: 'Product photo',
    caption: 'Our flagship product'
  },
  settings: {
    record: {
      recordType: 'image',
      width: '2/3',
      aspectRatio: '16/9',
      objectFit: 'cover'
    }
  }
}

// Cover image (with repositioning)
{
  type: 'record',
  data: {
    src: '',
    position: 50
  },
  settings: {
    layout: { width: 'full' },
    record: {
      recordType: 'image',
      height: '300px',
      enableRepositioning: true,
      enableUpload: true
    }
  }
}

// Product record
{
  type: 'record',
  data: {
    name: 'Widget Pro',
    image: 'https://example.com/widget.jpg',
    price: 29.99,
    currency: 'USD',
    description: 'Premium widget with advanced features',
    rating: 4.5
  },
  settings: {
    record: {
      recordType: 'product',
      layoutType: 'card',
      showPrice: true,
      showRating: true,
      enablePurchase: true
    }
  }
}

// Event record
{
  type: 'record',
  data: {
    title: 'Product Launch',
    startDate: '2024-03-15T10:00:00',
    endDate: '2024-03-15T12:00:00',
    location: 'Conference Room A',
    attendees: ['user1', 'user2']
  },
  settings: {
    record: {
      recordType: 'event',
      layoutType: 'card',
      showAttendees: true,
      allowRSVP: true
    }
  }
}

// Person record
{
  type: 'record',
  data: {
    name: 'Jane Smith',
    title: 'Senior Engineer',
    photo: 'https://example.com/jane.jpg',
    email: 'jane@example.com',
    bio: 'Passionate about building great software'
  },
  settings: {
    record: {
      recordType: 'person',
      layoutType: 'card',
      showPhoto: true,
      showContact: true,
      showBio: true
    }
  }
}

// Organization record
{
  type: 'record',
  data: {
    name: 'Acme Corp',
    logo: 'https://example.com/acme-logo.png',
    industry: 'Technology',
    website: 'https://acme.com',
    employees: 500
  },
  settings: {
    record: {
      recordType: 'organization',
      layoutType: 'card',
      showLogo: true,
      showStats: true
    }
  }
}

// Chart record
{
  type: 'record',
  data: {
    chartType: 'line',
    data: [
      { month: 'Jan', revenue: 10000 },
      { month: 'Feb', revenue: 12000 },
      { month: 'Mar', revenue: 15000 }
    ]
  },
  settings: {
    record: {
      recordType: 'chart',
      layoutType: 'visualizations',
      xAxis: { label: 'Month', field: 'month' },
      yAxis: { label: 'Revenue', field: 'revenue' },
      showLegend: true,
      interactive: true
    }
  }
}

// Timeline record
{
  type: 'record',
  data: {
    entries: [
      { date: '2024-01-15', user: 'Jane', action: 'Created project', icon: '🎯' },
      { date: '2024-01-16', user: 'John', action: 'Added documentation', icon: '📝' }
    ]
  },
  settings: {
    record: {
      recordType: 'timeline',
      layoutType: 'list',
      showIcons: true,
      groupByDate: true
    }
  }
}

// Data table record with grid layout
{
  type: 'record',
  data: {
    columns: [
      { id: 'name', name: 'Name', type: 'text', sortable: true },
      { id: 'email', name: 'Email', type: 'text', sortable: true }
    ],
    rows: [
      { name: 'John Doe', email: 'john@example.com' }
    ]
  },
  settings: {
    record: {
      recordType: 'data-table',
      layoutType: 'grid',
      features: {
        sorting: true,
        filtering: true,
        export: true
      }
    }
  }
}

// Metadata record with card layout
{
  type: 'record',
  data: {
    fields: [
      { label: 'Created', value: '2024-01-15', type: 'date' },
      { label: 'Author', value: 'John Doe', type: 'user' },
      { label: 'Status', value: 'published', type: 'status' }
    ]
  },
  settings: {
    record: {
      recordType: 'metadata',
      layoutType: 'card'
    },
    appearance: {
      background: '{{theme.colors.surface}}'
    }
  }
}
```

---

## 3. Markup Element (UI Domain)

**Type:** `markup`
**Domain:** `ui` (ephemeral, not persisted)
**Purpose:** Content presentation elements - text, buttons, icons

### Markup Types (Subtypes)

```javascript
markupType:
  // Text elements
  | 'title'          // Page titles (h1)
  | 'heading'        // Section headings (h2-h6)
  | 'paragraph'      // Body text
  | 'subtitle'       // Descriptions, captions
  | 'label'          // Small labels, tags
  | 'quote'          // Blockquote
  | 'code'           // Code block

  // Interactive elements
  | 'button'         // CTA button (navigation only)
  | 'link'           // Text hyperlink

  // Decorative elements
  | 'icon'           // Icon/emoji
  | 'divider'        // Horizontal rule separator
  | 'spacer'         // Vertical spacing block
```

### Settings Structure

```javascript
{
  type: 'markup',
  data: { content: string },  // null for spacer/divider
  settings: {
    // Common setting groups
    layout: { ... },          // Layout – Position and structure
    appearance: { ... },      // Appearance – Colors, borders, shadows
    data: { ... },            // Data – Binding, format, validation
    typography: { ... },      // Typography – Fonts and text styling
    businessRules: { ... },   // Business Rules – Visibility, permissions

    // Markup-specific settings
    markup: {
      markupType: string,     // ← Subtype

      // For text types (title, heading, paragraph, subtitle)
      editMode: 'always' | 'click' | 'double-click' | 'readonly',
      placeholder: string,
      textAlign: 'left' | 'center' | 'right' | 'justify',

      // For heading type
      level: 1 | 2 | 3 | 4 | 5 | 6,

      // For spacer type
      height: string,

      // For divider type
      thickness: string,
      dividerStyle: 'solid' | 'dashed' | 'dotted',

      // For button/link types
      url: string,
      target: '_self' | '_blank',
      variant: 'primary' | 'secondary' | 'ghost',

      // For icon type
      icon: string,
      size: 'sm' | 'md' | 'lg' | 'xl',
      pickerType: 'modal' | 'cycle' | 'none'
    }
  }
}
```

### Examples

```javascript
// Page title (always editable)
{
  id: 'page-title',
  type: 'markup',
  data: { content: 'Untitled' },
  settings: {
    layout: {
      width: 'full',
      spacing: { margin: { bottom: '{{theme.spacing.xs}}' } }
    },
    typography: {
      fontSize: '{{theme.typography.fontSize.4xl}}',
      fontWeight: '{{theme.typography.fontWeight.bold}}',
      color: '{{theme.colors.text.primary}}'
    },
    markup: {
      markupType: 'title',
      editMode: 'always',
      placeholder: '{{i18n.elements.title.placeholder}}'
    }
  }
}

// Subtitle/description
{
  type: 'markup',
  data: { content: '' },
  settings: {
    typography: {
      fontSize: '{{theme.typography.fontSize.base}}',
      color: '{{theme.colors.text.secondary}}'
    },
    markup: {
      markupType: 'subtitle',
      editMode: 'always',
      placeholder: '{{i18n.elements.description.placeholder}}'
    }
  }
}

// Section heading
{
  type: 'markup',
  data: { content: 'About Us' },
  settings: {
    typography: {
      fontSize: '{{theme.typography.fontSize.2xl}}',
      fontWeight: '{{theme.typography.fontWeight.semibold}}'
    },
    markup: {
      markupType: 'heading',
      level: 2,
      editMode: 'click'
    }
  }
}

// Divider
{
  type: 'markup',
  data: { content: null },
  settings: {
    layout: {
      spacing: {
        margin: {
          top: '{{theme.spacing.lg}}',
          bottom: '{{theme.spacing.lg}}'
        }
      }
    },
    appearance: {
      border: { color: '{{theme.colors.border.default}}' }
    },
    markup: {
      markupType: 'divider',
      thickness: '1px',
      dividerStyle: 'solid'
    }
  }
}

// Spacer
{
  type: 'markup',
  data: { content: null },
  settings: {
    markup: {
      markupType: 'spacer',
      height: '{{theme.spacing.2xl}}'
    }
  }
}

// Page icon (with emoji picker)
{
  type: 'markup',
  data: { content: '📄' },
  settings: {
    layout: {
      spacing: { margin: { bottom: '{{theme.spacing.sm}}' } }
    },
    markup: {
      markupType: 'icon',
      size: 'xl',
      pickerType: 'modal'
    }
  }
}

// Button
{
  type: 'markup',
  data: { content: 'Get Started' },
  settings: {
    markup: {
      markupType: 'button',
      variant: 'primary',
      url: '/signup',
      target: '_self'
    }
  }
}

// Paragraph
{
  type: 'markup',
  data: { content: 'This is body text...' },
  settings: {
    typography: {
      fontSize: '{{theme.typography.fontSize.base}}',
      lineHeight: '{{theme.typography.lineHeight.relaxed}}'
    },
    markup: {
      markupType: 'paragraph',
      editMode: 'click'
    }
  }
}
```

---

## 4. Structure Element (UI Domain)

**Type:** `structure`
**Domain:** `ui` (ephemeral, not persisted)
**Purpose:** Layout containers and structural elements

**Key Characteristic:** Structure elements can contain child elements including other structures (max nesting depth: 3 for realistic HTML layouts)

### Structure Types (Subtypes)

```javascript
structureType:
  // Basic containers
  | 'div'            // Generic block container
  | 'stack'          // Vertical spacing between children

  // Layout containers
  | 'grid'           // CSS Grid layout
  | 'flex'           // Flexbox layout

  // Styled containers
  | 'card'           // Card styling (padding + border + shadow)
  | 'panel'          // Panel with optional header

  // Interactive containers
  | 'tabs'           // Tabbed interface
  | 'accordion'      // Collapsible sections
  | 'modal'          // Overlay dialog
  | 'drawer'         // Slide-out panel
  | 'carousel'       // Horizontal slider

  // Advanced
  | 'canvas'         // Free-form positioning
```

### Settings Structure

```javascript
{
  type: 'structure',
  settings: {
    // Common setting groups
    layout: { ... },          // Layout – Position and structure
    appearance: { ... },      // Appearance – Colors, borders, shadows
    data: { ... },            // Data – Binding, format, validation
    typography: { ... },      // Typography – Fonts and text styling (for headers)
    businessRules: { ... },   // Business Rules – Visibility, permissions

    // Structure-specific settings
    structure: {
      structureType: string,  // ← Subtype
      semanticRole: 'content-group' | 'hero' | 'navigation' | 'footer' | 'sidebar' | null,  // NEW: Semantic purpose

      // For grid
      gridColumns: number,
      gridRows: number | 'auto',
      gap: string,            // Theme token: '{{theme.spacing.md}}'

      // For flex
      flexDirection: 'row' | 'column',
      flexWrap: 'wrap' | 'nowrap',
      justifyContent: 'start' | 'center' | 'end' | 'space-between' | 'space-around',
      alignItems: 'start' | 'center' | 'end' | 'stretch',
      gap: string,

      // For stack
      spacing: string,        // Theme token: '{{theme.spacing.md}}'

      // For panel
      header: {
        title: string,
        collapsible: boolean,
        defaultExpanded: boolean
      },

      // For tabs
      tabs: Array<{
        id: string,
        label: string,
        icon?: string
      }>,
      defaultTab: string,

      // For accordion
      allowMultiple: boolean,
      defaultExpanded: string[],

      // For modal
      trigger: string,        // Element ID that opens modal
      closeOnBackdrop: boolean,
      closeOnEscape: boolean,

      // For drawer
      position: 'left' | 'right' | 'top' | 'bottom',
      width: string,
      height: string,

      // For carousel
      autoPlay: boolean,
      interval: number,
      slidesPerView: number,
      showDots: boolean,
      showArrows: boolean,

      // For canvas
      enableFreePositioning: boolean
    }
  },

  // Child elements (can be field, record, markup, OR structure up to depth 3)
  elements: [
    { type: 'structure', ... },  // ✅ Nested structures allowed up to depth 3
    { type: 'field', ... },
    { type: 'record', ... },
    { type: 'markup', ... }
  ]
}
```

### Examples

```javascript
// Generic div container
{
  id: 'content-wrapper',
  type: 'structure',
  settings: {
    layout: {
      width: 'full',
      spacing: {
        padding: {
          top: '{{theme.spacing.lg}}',
          bottom: '{{theme.spacing.lg}}'
        }
      }
    },
    structure: {
      structureType: 'div'
    }
  },
  elements: [
    {
      type: 'markup',
      data: { content: 'Welcome' },
      settings: { markup: { markupType: 'title' } }
    }
  ]
}

// Card container
{
  id: 'product-card',
  type: 'structure',
  settings: {
    layout: {
      width: '1/3',
      spacing: {
        padding: {
          top: '{{theme.spacing.lg}}',
          right: '{{theme.spacing.lg}}',
          bottom: '{{theme.spacing.lg}}',
          left: '{{theme.spacing.lg}}'
        }
      }
    },
    appearance: {
      background: '{{theme.colors.surface}}',
      border: {
        width: '1px',
        style: 'solid',
        color: '{{theme.colors.border.default}}',
        radius: '{{theme.borderRadius.lg}}'
      },
      shadow: '{{theme.shadows.md}}'
    },
    structure: {
      structureType: 'card',
      semanticRole: 'content-group'
    }
  },
  elements: [
    {
      type: 'structure',  // Nested structure allowed (depth 2)
      settings: {
        structure: { structureType: 'flex', semanticRole: 'content-group' }
      },
      elements: [
        {
          type: 'record',
          data: { src: 'product.jpg' },
          settings: {
            record: { recordType: 'image', aspectRatio: '1/1' }
          }
        },
        {
          type: 'markup',
          data: { content: 'Widget Pro' },
          settings: {
            markup: { markupType: 'heading', level: 3 }
          }
        }
      ]
    },
    {
      type: 'markup',
      data: { content: 'Add to Cart' },
      settings: {
        markup: { markupType: 'button', variant: 'primary' }
      }
    }
  ]
}

// Grid container
{
  type: 'structure',
  settings: {
    layout: { width: 'full' },
    structure: {
      structureType: 'grid',
      gridColumns: 3,
      gridRows: 'auto',
      gap: '{{theme.spacing.lg}}'
    }
  },
  elements: [
    // 3 product cards
    { type: 'structure', settings: { structure: { structureType: 'card' } }, elements: [...] },
    { type: 'structure', settings: { structure: { structureType: 'card' } }, elements: [...] },
    { type: 'structure', settings: { structure: { structureType: 'card' } }, elements: [...] }
  ]
}

// Flex container
{
  type: 'structure',
  settings: {
    structure: {
      structureType: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '{{theme.spacing.md}}'
    }
  },
  elements: [
    {
      type: 'markup',
      data: { content: 'Logo' },
      settings: { markup: { markupType: 'heading', level: 1 } }
    },
    {
      type: 'markup',
      data: { content: 'Sign In' },
      settings: { markup: { markupType: 'button' } }
    }
  ]
}

// Stack container
{
  type: 'structure',
  settings: {
    structure: {
      structureType: 'stack',
      spacing: '{{theme.spacing.md}}'
    }
  },
  elements: [
    {
      type: 'field',
      settings: { field: { fieldType: 'text', label: 'Name' } }
    },
    {
      type: 'field',
      settings: { field: { fieldType: 'email', label: 'Email' } }
    },
    {
      type: 'markup',
      data: { content: 'Submit' },
      settings: { markup: { markupType: 'button', variant: 'primary' } }
    }
  ]
}

// Panel container
{
  type: 'structure',
  settings: {
    appearance: {
      border: {
        width: '1px',
        style: 'solid',
        color: '{{theme.colors.border.default}}'
      }
    },
    structure: {
      structureType: 'panel',
      header: {
        title: 'Settings',
        collapsible: true,
        defaultExpanded: true
      }
    }
  },
  elements: [
    // Panel content
  ]
}

// Tabs container
{
  type: 'structure',
  settings: {
    structure: {
      structureType: 'tabs',
      tabs: [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'details', label: 'Details', icon: '📝' }
      ],
      defaultTab: 'overview'
    }
  },
  elements: [
    // Tab content organized by tab id
  ]
}

// Modal container
{
  type: 'structure',
  settings: {
    layout: { width: 'fixed', fixedWidth: '500px' },
    appearance: {
      background: '{{theme.colors.background}}',
      border: { radius: '{{theme.borderRadius.lg}}' },
      shadow: '{{theme.shadows.2xl}}'
    },
    structure: {
      structureType: 'modal',
      trigger: 'open-modal-button',
      closeOnBackdrop: true,
      closeOnEscape: true
    }
  },
  elements: [
    // Modal content
  ]
}
```

---

## Five Setting Groups

All four element types inherit from these organized setting groups (in order):

1. **Layout** – Position and structure
2. **Appearance** – Colors, borders, shadows (theme-based)
3. **Data** – Binding, format, validation
4. **Typography** – Fonts and text styling
5. **Business Rules** – Visibility, permissions, conditional logic, animation

See ELEMENT_SETTINGS_ARCHITECTURE.md for complete settings specifications.

---

## Domain Helper Functions

```javascript
// Domain detection (implicit from type)
function getDomain(type) {
  const dataDomain = ['field', 'record'];
  const uiDomain = ['markup', 'structure'];

  if (dataDomain.includes(type)) return 'data';
  if (uiDomain.includes(type)) return 'ui';
  throw new Error(`Unknown type: ${type}`);
}

// Check if element should be persisted
function shouldPersist(element) {
  return getDomain(element.type) === 'data';
}

// Query all data domain elements
function getDataElements(page) {
  return getAllElements(page).filter(el => getDomain(el.type) === 'data');
}

// Query all UI domain elements
function getUIElements(page) {
  return getAllElements(page).filter(el => getDomain(el.type) === 'ui');
}

// Get all elements including nested (recursive for structure)
function getAllElements(container) {
  let elements = [];

  function traverse(items) {
    for (const item of items) {
      elements.push(item);
      if (item.type === 'structure' && item.elements) {
        traverse(item.elements);
      }
    }
  }

  if (container.zones) {
    container.zones.forEach(zone => {
      zone.rows?.forEach(row => {
        row.columns?.forEach(column => {
          traverse(column.elements || []);
        });
      });
    });
  }

  return elements;
}
```

---

## Validation Rules

```javascript
// Nesting validation
function validateNesting(element, depth = 0) {
  if (element.type === 'structure') {
    // Structure can contain field, record, markup (not structure)
    const allowedTypes = ['field', 'record', 'markup'];

    for (const child of element.elements || []) {
      if (!allowedTypes.includes(child.type)) {
        throw new Error(
          `Structure cannot contain type '${child.type}'. ` +
          `Allowed: ${allowedTypes.join(', ')}`
        );
      }

      // Recursive structures not allowed
      if (child.type === 'structure') {
        throw new Error(
          'Nested structures not allowed. ' +
          'Maximum nesting depth is 1: Column → Structure → Element'
        );
      }

      // Validate child recursively
      validateNesting(child, depth + 1);
    }
  }

  // field, record, markup cannot have elements property
  if (['field', 'record', 'markup'].includes(element.type)) {
    if (element.elements && element.elements.length > 0) {
      throw new Error(
        `Type '${element.type}' cannot contain child elements. ` +
        `Only 'structure' type can have children.`
      );
    }
  }

  // Validate max depth
  if (depth > 1) {
    throw new Error('Maximum element nesting depth exceeded (max: 1)');
  }
}

// Type-specific settings validation
function validateSettings(element) {
  const { type, settings } = element;

  // Ensure type-specific settings exist
  const settingsKey = type; // field, record, markup, or structure

  if (!settings[settingsKey]) {
    throw new Error(
      `Element type '${type}' requires settings.${settingsKey} property`
    );
  }

  // Ensure subtype is specified
  const subtypeKey = `${settingsKey}Type`; // fieldType, recordType, etc.

  if (!settings[settingsKey][subtypeKey]) {
    throw new Error(
      `Element type '${type}' requires settings.${settingsKey}.${subtypeKey} (subtype)`
    );
  }

  // Validate structure has elements array
  if (type === 'structure') {
    if (!Array.isArray(element.elements)) {
      throw new Error(
        "Element type 'structure' requires 'elements' array property"
      );
    }
  }
}

// Complete validation
function validateElement(element) {
  validateSettings(element);
  validateNesting(element);
}
```

---

## Migration from Current Architecture

```javascript
// Migration mapping from old 3-type to new 4-type
const migrationMap = {
  'field': {
    type: 'field',
    settingsKey: 'field',
    // No changes needed - already matches
  },
  'record': {
    type: 'record',
    settingsKey: 'record',
    // No changes needed - already matches
  },
  'ui': {
    type: 'markup',              // Rename: ui → markup
    settingsKey: 'markup',       // Rename: ui → markup
    subtypeKey: 'markupType'     // Rename: uiType → markupType
  },
  'container': {
    type: 'structure',           // New type for containers
    settingsKey: 'structure',
    subtypeKey: 'structureType'  // New: containerType → structureType
  }
};

// Migrate single element
function migrateElement(oldElement) {
  const migration = migrationMap[oldElement.type];

  if (!migration) {
    throw new Error(`Unknown element type: ${oldElement.type}`);
  }

  const newElement = {
    ...oldElement,
    type: migration.type
  };

  // Migrate settings
  if (oldElement.settings) {
    newElement.settings = { ...oldElement.settings };

    // Rename ui → markup settings
    if (oldElement.type === 'ui') {
      newElement.settings.markup = {
        ...oldElement.settings.ui,
        markupType: oldElement.settings.ui.uiType
      };
      delete newElement.settings.ui;
      delete newElement.settings.markup.uiType;
    }

    // Migrate container → structure settings
    if (oldElement.type === 'container') {
      newElement.settings.structure = {
        ...oldElement.settings.container,
        structureType: oldElement.settings.container.containerType || 'div'
      };
      delete newElement.settings.container;
      delete newElement.settings.structure.containerType;
    }
  }

  // Recursively migrate nested elements
  if (newElement.elements) {
    newElement.elements = newElement.elements.map(migrateElement);
  }

  return newElement;
}

// Migrate entire page
function migratePage(oldPage) {
  const newPage = { ...oldPage };

  if (newPage.zones) {
    newPage.zones = newPage.zones.map(zone => ({
      ...zone,
      rows: zone.rows?.map(row => ({
        ...row,
        columns: row.columns?.map(column => ({
          ...column,
          elements: column.elements?.map(migrateElement) || []
        }))
      }))
    }));
  }

  return newPage;
}
```

---

## Benefits Summary

### Domain-Based Architecture
✅ **Storage intent is explicit** - Domain tells you if element persists to database
✅ **Natural categorization** - Structure fits cleanly as UI domain type
✅ **Clear team boundaries** - Data team owns field/record, UI team owns markup/structure
✅ **Query optimization** - Efficient queries by domain for serialization
✅ **Scalable** - Easy to add new types within each domain
✅ **Future extensible** - Can add new domains (e.g., logic, integration)

### Four Element Types
✅ **Simple mental model** - Data (field, record), UI (markup, structure)
✅ **Clear purpose** - Each type has distinct role and capabilities
✅ **Consistent patterns** - Settings work the same across all types
✅ **Easy to learn** - Users quickly understand the four categories
✅ **Scalable** - Easy to add new subtypes within each type

### Five Setting Groups
✅ **Logical organization** - Related settings grouped together
✅ **No redundancy** - Single inheritance hierarchy
✅ **Clear names** - Layout, Appearance, Data, Typography, Business Rules
✅ **Behavioral grouping** - Makes sense for all element types
✅ **Consistent structure** - Every element follows same pattern

---

**Status:** ✅ **Approved Architecture** - Domain-based 4-type system ready for implementation.
