# Element Settings Architecture

**Date:** 2025-11-21
**Status:** ✅ Approved Architecture
**Purpose:** Define settings-based element behavior for consistent UX across all page types

**Related Documents:**
- [Generic Element Types](./GENERIC_ELEMENT_TYPES.md) - **✅ Approved 4-type domain architecture (field, record, markup, structure)**

---

## Architectural Overview

This document works in tandem with GENERIC_ELEMENT_TYPES.md to define the complete element system:

| Document | Focus | Key Concepts |
|----------|-------|--------------|
| **GENERIC_ELEMENT_TYPES.md** | Element type structure | 4 types with 2 domains (data: field/record, ui: markup/structure) |
| **ELEMENT_SETTINGS_ARCHITECTURE.md** (this doc) | Cross-cutting concerns | Theme system, 5 setting groups, localization |

**Read both documents together** for the complete approved architecture.

---

## Executive Summary

This document establishes the foundational systems for element settings:

### Core Architecture Components

1. **Settings-based behavior** - Single element types configured via settings (not element proliferation)
2. **Domain-based types** - Two domains (data, ui) with four types (field, record, markup, structure)
3. **Theme system** - Global design tokens with inheritance: Global → Page → Element (§ Theme System Architecture)
4. **Five organized setting groups** - Common settings inherited by all elements (§ Shared Element Settings)
   - **Layout** - Position, structure, dimensions, alignment, spacing
   - **Appearance** - Colors, borders, shadows (theme-based, no hard-coded values)
   - **Data** - Binding, format, validation, slash commands
   - **Typography** - Fonts and text styling
   - **Business Rules** - Visibility, permissions, conditional logic, animation
5. **Localization** - i18n support with auto-detect and fallback chain (§ Localization Architecture)

### Key Architectural Decisions

✅ **Domain-based architecture** - Storage intent explicit: data domain (field/record) persisted, ui domain (markup/structure) ephemeral
✅ **Four element types** replace 3-type system: field, record, markup, structure
✅ **Five organized setting groups** provide consistent structure: Layout, Appearance, Data, Typography, Business Rules
✅ **Theme inheritance** follows Global → Page → Element chain with CSS variables + runtime resolution
✅ **No hard-coded colors** - all styling uses theme tokens with custom color support when necessary
✅ **Theme customization via UI** - users can create custom themes through visual interface
✅ **Locale auto-detection** with tiered fallback chain ending in en-US source locale
✅ **Manual migration required** - no backward compatibility with old element formats
✅ **Settings panel + JSON editing** - visual configuration with manual override option
✅ **Context-aware defaults** - editMode varies by context (page header vs content section)
✅ **Controlled nesting** - Structure can contain structures/field/record/markup (max depth: 3)
✅ **Explicit binding modes** - Data flow explicitly defined (static, bound-read, bound-write, bound-bidirectional)
✅ **Semantic roles** - Structures can declare semantic purpose (hero, navigation, footer, etc.)
✅ **Fuzzy token matching** - CSS values map to closest theme tokens with confidence scores

---

## Problem Statement

After migrating database pages to the UniversalPage system, the user experience degraded significantly:

### Issues Identified

1. **Title & Description Editing**
   - **Current:** Double-click to enter edit mode (awkward, amateur)
   - **Expected:** Always-editable input fields (Notion-style)

2. **Icon Picker**
   - **Current:** Cycles through 16 hardcoded emojis
   - **Expected:** Full emoji picker modal (emoji-picker-react library)

3. **Slash Commands**
   - **Current:** Empty zone placeholder with generic text
   - **Expected:** Dedicated input field that detects "/" keypress

4. **Layout Composition**
   - **Current:** No way to group elements, create cards, or build component-like structures
   - **Expected:** Container elements for cards, grids, modals, tabs

5. **Overall Feel**
   - **Current:** Feels like placeholder UI, unpolished
   - **Expected:** Professional, zero-friction editing like Notion/Coda

### Root Cause

Elements were designed with generic interaction patterns (double-click, click-to-cycle) and lacked compositional capabilities (no containers), rather than the polished, flexible experience users expect from modern document editors.

---

## Architectural Decision

**APPROACH: Settings-Based Element Behavior with Domain Categorization**

Instead of creating multiple element types (`title` vs `title-input`), we use **single element types** with **configurable settings** that control behavior, organized into **two clear domains** based on storage intent.

### Why This Approach?

✅ **Single Source of Truth** - One element type per concept, configured via settings
✅ **No Element Proliferation** - Avoids `title`, `title-input`, `title-display`, etc.
✅ **Clear Storage Intent** - Domain tells you if element persists (data) or is ephemeral (ui)
✅ **CMS-Standard Pattern** - Matches Webflow, Wix, Squarespace architecture
✅ **Settings Panel Ready** - Natural fit for visual configuration UI
✅ **Consistent Behavior** - Same element acts the same across all page types
✅ **Future-Proof** - Easy to add new interaction modes and subtypes via settings
✅ **Natural Container Home** - Structure fits cleanly in UI domain

---

## Domain-Based Type System

### Two Domains

**data domain** (persisted to database)
- `field` - Atomic data inputs
- `record` - Complex data structures

**ui domain** (ephemeral, not persisted)
- `markup` - Content presentation elements
- `structure` - Layout and container elements

### Benefits

✅ **Explicit storage intent** - Type name implies whether it persists
✅ **Query optimization** - Can efficiently query all persisted elements: `WHERE domain = 'data'`
✅ **Team boundaries** - Data team owns field/record, UI team owns markup/structure
✅ **Scalable** - Easy to add new subtypes within each domain
✅ **Future extensible** - Can add new domains (e.g., logic, integration)

See GENERIC_ELEMENT_TYPES.md for complete type specifications.

---

## Foundational Architecture

Before diving into element-specific settings, we need to establish three foundational systems that apply across all elements:

### 1. Theme System
### 2. Shared Element Settings
### 3. Localization Support

---

## Theme System Architecture

### Problem

Hard-coding colors, typography, and spacing in element settings creates:
- ❌ Inconsistent styling across pages
- ❌ Manual updates needed for every element when changing brand colors
- ❌ No support for dark mode or alternative themes
- ❌ Difficult to maintain design system consistency

### Solution: Theme Tokens

Elements reference **theme tokens** instead of hard-coded values. Tokens are defined globally and can be swapped to change the entire site's appearance.

### Theme Structure

```javascript
{
  id: 'default-theme',
  name: 'Default Theme',
  tokens: {
    // Colors
    colors: {
      primary: '#3B82F6',           // blue-500
      secondary: '#6B7280',         // gray-500
      accent: '#10B981',            // green-500
      background: '#FFFFFF',
      surface: '#F9FAFB',           // gray-50
      text: {
        primary: '#111827',         // gray-900
        secondary: '#6B7280',       // gray-500
        tertiary: '#9CA3AF',        // gray-400
        inverse: '#FFFFFF'
      },
      border: {
        default: '#E5E7EB',         // gray-200
        strong: '#D1D5DB',          // gray-300
        subtle: '#F3F4F6'           // gray-100
      },
      status: {
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      }
    },

    // Typography
    typography: {
      fontFamily: {
        sans: 'system-ui, -apple-system, sans-serif',
        serif: 'Georgia, serif',
        mono: 'Menlo, Monaco, monospace'
      },
      fontSize: {
        xs: '0.75rem',      // 12px
        sm: '0.875rem',     // 14px
        base: '1rem',       // 16px
        lg: '1.125rem',     // 18px
        xl: '1.25rem',      // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '1.875rem',  // 30px
        '4xl': '2.25rem',   // 36px
        '5xl': '3rem',      // 48px
        '6xl': '3.75rem'    // 60px
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
        loose: 2
      }
    },

    // Spacing
    spacing: {
      xs: '0.25rem',   // 4px
      sm: '0.5rem',    // 8px
      md: '1rem',      // 16px
      lg: '1.5rem',    // 24px
      xl: '2rem',      // 32px
      '2xl': '3rem',   // 48px
      '3xl': '4rem',   // 64px
      '4xl': '6rem',   // 96px
      '5xl': '8rem'    // 128px
    },

    // Borders
    borderRadius: {
      none: '0',
      sm: '0.125rem',   // 2px
      base: '0.25rem',  // 4px
      md: '0.375rem',   // 6px
      lg: '0.5rem',     // 8px
      xl: '0.75rem',    // 12px
      '2xl': '1rem',    // 16px
      full: '9999px'
    },

    // Shadows
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      base: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
    }
  }
}
```

### Dark Theme Example

```javascript
{
  id: 'dark-theme',
  name: 'Dark Theme',
  tokens: {
    colors: {
      background: '#111827',        // gray-900
      surface: '#1F2937',          // gray-800
      text: {
        primary: '#F9FAFB',        // gray-50
        secondary: '#D1D5DB',      // gray-300
        tertiary: '#9CA3AF'        // gray-400
      }
      // ... rest of tokens adapted for dark mode
    }
  }
}
```

### Theme Token References in Elements

Instead of hard-coded colors, elements reference theme tokens:

```javascript
// ❌ BAD: Hard-coded color
{
  type: 'markup',
  settings: {
    typography: {
      color: 'text-gray-900'  // Hard-coded, doesn't adapt to themes
    }
  }
}

// ✅ GOOD: Theme token reference
{
  type: 'markup',
  settings: {
    typography: {
      color: '{{theme.colors.text.primary}}'  // Adapts to active theme
    }
  }
}

// ✅ ALSO GOOD: Fuzzy match with metadata (HTML import)
{
  type: 'markup',
  settings: {
    typography: {
      color: {
        token: '{{theme.colors.text.primary}}',
        originalValue: '#111111',
        tokenValue: '#111827',
        confidence: 0.95,
        difference: '6px lighter',
        useOriginal: false  // Good match - use token
      }
    }
  }
}
```

### Theme Implementation

**Theme Provider Component:**

```jsx
// ThemeProvider.jsx
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children, initialTheme }) => {
  const [activeTheme, setActiveTheme] = useState(initialTheme);

  const resolveToken = (tokenPath) => {
    // Parse token path: "{{theme.colors.text.primary}}"
    const path = tokenPath.replace(/{{theme\.|}}$/g, '').split('.');
    return path.reduce((obj, key) => obj?.[key], activeTheme.tokens);
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme, resolveToken }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

**Element Usage:**

```jsx
// TitleElement.jsx (markup type)
const TitleElement = ({ data, settings, onUpdate }) => {
  const { resolveToken } = useTheme();

  // Resolve theme token or use literal value
  const color = settings.typography?.color?.startsWith('{{theme.')
    ? resolveToken(settings.typography.color)
    : settings.typography?.color;

  return <input className={color} />;
};
```

### Theme Switching

```javascript
// User clicks "Dark Mode" toggle
setActiveTheme(themes.dark);

// All elements automatically re-render with new theme tokens
// No manual updates needed!
```

### Fuzzy Token Matching (HTML Import)

When converting HTML to domain schema, CSS values are mapped to the closest theme token:

```javascript
function mapCSSToThemeToken(cssValue, themeCategory) {
  const tokens = theme[themeCategory];
  const parsed = parseCSSValue(cssValue); // '43px' → 43

  // Find closest match
  let closest = null;
  let minDistance = Infinity;

  for (const [key, value] of Object.entries(tokens)) {
    const tokenValue = parseCSSValue(value);
    const distance = Math.abs(tokenValue - parsed);

    if (distance < minDistance) {
      minDistance = distance;
      closest = key;
    }
  }

  // Calculate confidence (percentage match)
  const confidence = 1 - (minDistance / parsed);

  return {
    token: `{{theme.${themeCategory}.${closest}}}`,
    originalValue: cssValue,
    tokenValue: tokens[closest],
    confidence: confidence,
    difference: minDistance,
    useOriginal: confidence < 0.8  // Use custom value if poor match
  };
}

// Example: Mapping font size
mapCSSToThemeToken('43px', 'typography.fontSize')
// Returns:
{
  token: '{{theme.typography.fontSize.4xl}}',  // 48px
  originalValue: '43px',
  tokenValue: '48px',
  confidence: 0.88,  // 88% match
  difference: 5,
  useOriginal: false  // Good enough - use token
}

// Example: Poor match - keep custom value
mapCSSToThemeToken('67px', 'typography.fontSize')
// Returns:
{
  token: '{{theme.typography.fontSize.4xl}}',  // 48px
  originalValue: '67px',
  tokenValue: '48px',
  confidence: 0.72,  // 72% match (poor)
  difference: 19,
  useOriginal: true,  // Too different - keep custom
  suggestion: 'Consider adding: fontSize.5xl = 67px'
}
```

**Benefits of Fuzzy Matching:**
- ✅ Intelligent CSS → token conversion
- ✅ Confidence scores guide user decisions
- ✅ Suggests new tokens when needed
- ✅ Preserves custom values when appropriate
- ✅ Improves HTML import accuracy

---

## Shared Element Settings

### Problem

All elements need common properties:
- Layout (position, structure, dimensions, spacing)
- Appearance (colors, borders, shadows via theme tokens)
- Data (binding, validation, formatting, commands)
- Typography (fonts, text styling)
- Business Rules (visibility, permissions, conditional logic, animation)

Defining these individually for each element creates:
- ❌ Inconsistent property names across elements
- ❌ Duplicate setting definitions
- ❌ Harder to maintain and extend

### Solution: Five Organized Setting Groups

Define **common settings** organized into **5 logical groups** that all elements inherit. This structure aligns with the approved architecture documented in GENERIC_ELEMENT_TYPES.md.

**The Five Setting Groups (in order):**
1. **Layout** - Position and structure (dimensions, alignment, spacing)
2. **Appearance** - Colors, borders, shadows (theme-based, no hard-coded values)
3. **Data** - Binding, format, validation (includes slash command settings)
4. **Typography** - Fonts and text styling
5. **Business Rules** - Visibility, permissions, conditional logic, and animation

### Common Settings Schema

```javascript
{
  // 1. Layout Settings (applies to all elements)
  // Position and structure
  layout: {
    // Dimensions
    width: 'full' | 'auto' | 'fixed' | '1/2' | '1/3' | '2/3',
    fixedWidth: string,                       // e.g., '600px'
    height: 'auto' | 'fixed',
    fixedHeight: string,                      // e.g., '400px'

    // Alignment
    alignment: 'left' | 'center' | 'right',
    verticalAlignment: 'top' | 'middle' | 'bottom',

    // Display
    display: 'block' | 'inline' | 'flex' | 'grid',

    // Spacing
    spacing: {
      margin: {
        top: string,                          // Theme token or negative: '{{theme.spacing.md}}' or '-12px'
        right: string,
        bottom: string,
        left: string
      },
      padding: {
        top: string,
        right: string,
        bottom: string,
        left: string
      }
    },

    // Responsive (optional per-breakpoint overrides)
    responsive: {
      mobile: { width, height, spacing },     // Optional: mobile overrides
      tablet: { width, height, spacing },     // Optional: tablet overrides
      desktop: { width, height, spacing }     // Optional: desktop overrides
    }
  },

  // 2. Appearance Settings (applies to visual elements)
  // Colors, borders, shadows - THEME-BASED ONLY (no hard-coded values)
  appearance: {
    // Background
    background: string,                       // Theme token ONLY: '{{theme.colors.surface}}'

    // Border
    border: {
      width: string,                          // '0', '1px', '2px', etc.
      style: 'none' | 'solid' | 'dashed' | 'dotted',
      color: string,                          // Theme token ONLY: '{{theme.colors.border.default}}'
      radius: string                          // Theme token: '{{theme.borderRadius.md}}'
    },

    // Shadow
    shadow: string,                           // Theme token: '{{theme.shadows.md}}' or 'none'

    // Opacity
    opacity: number,                          // 0-1

    // Custom colors (evaluated when theme tokens insufficient)
    customColors: {
      background: string,                     // Hex/RGB when theme insufficient
      border: string,                         // Hex/RGB when theme insufficient
      text: string                            // Hex/RGB when theme insufficient
    }
  },

  // 3. Data Settings (applies to data-bound elements)
  // Binding, format, validation
  data: {
    // Binding mode (explicit data flow)
    bindingMode: 'static' | 'bound-read' | 'bound-write' | 'bound-bidirectional',

    // Binding configuration
    binding: {
      source: string,                         // Data source path (e.g., 'record.customer', 'collection.speakers')
      property: string,                       // Property to bind (e.g., 'email', 'name')
      transform: function,                    // Optional transform function
      mode: 'read' | 'write' | 'bidirectional'  // Data flow direction (redundant with bindingMode but explicit)
    },

    // Format
    format: {
      type: 'text' | 'number' | 'date' | 'currency' | 'custom',
      locale: string,                         // BCP 47 locale tag (optional, inherits from user profile)
      options: object                         // Intl.* options for formatting
    },

    // Validation (for field elements)
    validation: {
      required: boolean,
      min: number,
      max: number,
      minLength: number,
      maxLength: number,
      pattern: string,                        // Regex
      customValidator: function,
      errorMessage: string,                   // Locale key or literal
      showErrorIcon: boolean,
      showSuccessIcon: boolean
    },

    // Slash commands (for input elements)
    slashCommands: {
      enabled: boolean,                       // Enable slash command detection
      context: 'internal' | 'external' | 'both'  // Where commands apply
    }
  },

  // 4. Typography Settings (applies to text elements)
  // Fonts and text styling
  typography: {
    fontSize: string,                         // Theme token: '{{theme.typography.fontSize.xl}}'
    fontWeight: string,                       // Theme token: '{{theme.typography.fontWeight.bold}}'
    fontFamily: string,                       // Theme token: '{{theme.typography.fontFamily.sans}}'
    lineHeight: string,                       // Theme token: '{{theme.typography.lineHeight.normal}}'
    letterSpacing: string,
    textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize',
    color: string                             // Theme token: '{{theme.colors.text.primary}}'
  },

  // 5. Business Rules Settings (applies to all elements)
  // Visibility, permissions, conditional logic, and animation
  businessRules: {
    // Visibility rules
    visibility: {
      hidden: boolean,
      responsive: {
        hideOnMobile: boolean,
        hideOnTablet: boolean,
        hideOnDesktop: boolean
      }
    },

    // Permissions
    permissions: {
      view: string[],                         // Roles that can view
      edit: string[],                         // Roles that can edit
      delete: string[]                        // Roles that can delete
    },

    // Conditional display
    conditional: {
      show: boolean,
      dependsOn: string,                      // Element ID this depends on
      condition: function                     // Condition function
    },

    // Animation (moved from separate group)
    animation: {
      entrance: 'fade' | 'slide' | 'scale' | 'none',
      duration: number,                       // milliseconds
      delay: number,                          // milliseconds
      easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
    }
  }
}
```

### Element-Specific Settings

Each element **extends** the 5 common setting groups with its own specific properties. Element-specific settings are namespaced by element type (`field`, `record`, `markup`, `structure`).

```javascript
// Example: Markup Element (Title) = 5 Common Groups + Markup-Specific Settings
{
  // Common setting groups (inherited by all elements)
  layout: { ... },          // Group 1: Position and structure
  appearance: { ... },      // Group 2: Colors, borders, shadows
  data: { ... },            // Group 3: Binding, format, validation
  typography: { ... },      // Group 4: Fonts and text styling
  businessRules: { ... },   // Group 5: Visibility, permissions, conditional logic, animation

  // Markup-specific settings (namespaced)
  markup: {
    markupType: 'title',                          // Type within markup category
    editMode: 'always' | 'click' | 'double-click' | 'readonly',
    placeholder: string,                          // Locale key or literal
    textAlign: 'left' | 'center' | 'right'
  }
}

// Example: Field Element = 5 Common Groups + Field-Specific Settings
{
  // Common setting groups (inherited)
  layout: { ... },
  appearance: { ... },
  data: { ... },
  typography: { ... },
  businessRules: { ... },

  // Field-specific settings (namespaced)
  field: {
    fieldType: 'text' | 'textarea' | 'email' | 'number',  // text = single-line, textarea = multiline
    label: string,
    placeholder: string,
    helpText: string,
    required: boolean,
    disabled: boolean,
    readonly: boolean
  }
}

// Example: Record Element = 5 Common Groups + Record-Specific Settings
{
  // Common setting groups (inherited)
  layout: { ... },
  appearance: { ... },
  data: { ... },
  businessRules: { ... },

  // Record-specific settings (namespaced)
  record: {
    recordType: 'image',                      // Type within record category
    src: string,
    alt: string,
    caption: string,
    aspectRatio: string,
    objectFit: string,
    enableRepositioning: boolean
  }
}

// Example: Structure Element = 5 Common Groups + Structure-Specific Settings
{
  // Common setting groups (inherited)
  layout: { ... },
  appearance: { ... },
  data: { ... },
  typography: { ... },
  businessRules: { ... },

  // Structure-specific settings (namespaced)
  structure: {
    structureType: 'card',                    // Type within structure category
    semanticRole: 'content-group' | 'hero' | 'navigation' | 'footer' | 'sidebar' | null,  // NEW: Semantic purpose
    // Type-specific settings based on structureType
  }
}
```

### Settings Inheritance Pattern

All elements inherit from the 5 base setting groups, then add their type-specific settings.

**Inheritance Hierarchy (6 layers with flexible nesting):**
Page → Zone → Row → Column → Element → [Structure → Structure → Structure → Leaf Elements]

**Priority Order (highest to lowest):**
Deeply Nested Element > Parent Structure > Element > Column > Row > Zone > Page defaults

**Nesting Constraint (Updated):**
- **Max nesting depth: 3** (structure → structure → structure → leaf)
- Structure can contain: structure, field, record, markup
- Leaf elements (field, record, markup without children) cannot contain other elements
- At depth 3, only leaf elements (markup, record) allowed - no fields at deep nesting

**Nesting Rules by Depth:**
```javascript
{
  depth1: ['structure', 'markup', 'record', 'field'],  // All types allowed
  depth2: ['structure', 'markup', 'record'],           // No fields at depth 2
  depth3: ['markup', 'record'],                        // Only leaf elements at depth 3
  depth4: []                                           // Not allowed
}
```

```javascript
// Base settings (default for all elements)
const baseElementSettings = {
  // Group 1: Layout (position and structure)
  layout: {
    width: 'full',
    alignment: 'left',
    spacing: {
      margin: { top: '0', right: '0', bottom: '{{theme.spacing.sm}}', left: '0' },
      padding: { top: '0', right: '0', bottom: '0', left: '0' }
    }
  },

  // Group 2: Appearance (colors, borders, shadows via theme tokens)
  appearance: {
    background: '{{theme.colors.background}}',    // Theme token ONLY
    border: {
      width: '0',
      style: 'none',
      color: '{{theme.colors.border.default}}',   // Theme token ONLY
      radius: '0'
    },
    shadow: 'none',
    opacity: 1
  },

  // Group 3: Data (binding, format, validation)
  data: {
    binding: null,
    format: null,
    validation: {},
    slashCommands: {
      enabled: false,
      context: 'internal'
    }
  },

  // Group 4: Typography (fonts and text styling)
  typography: {
    fontSize: '{{theme.typography.fontSize.base}}',
    fontWeight: '{{theme.typography.fontWeight.normal}}',
    color: '{{theme.colors.text.primary}}',
    fontFamily: '{{theme.typography.fontFamily.sans}}',
    lineHeight: '{{theme.typography.lineHeight.normal}}'
  },

  // Group 5: Business Rules (visibility, permissions, conditional logic, animation)
  businessRules: {
    visibility: {
      hidden: false,
      responsive: { hideOnMobile: false, hideOnTablet: false, hideOnDesktop: false }
    },
    permissions: {
      view: ['*'],    // All roles by default
      edit: ['*'],
      delete: ['admin']
    },
    conditional: null,
    animation: {
      entrance: 'none',
      duration: 0,
      delay: 0,
      easing: 'ease'
    }
  }
};

// Markup element inherits base + adds markup-specific settings
const markupTitleSettings = {
  ...baseElementSettings,
  typography: {
    ...baseElementSettings.typography,
    fontSize: '{{theme.typography.fontSize.4xl}}',
    fontWeight: '{{theme.typography.fontWeight.bold}}'
  },
  markup: {
    markupType: 'title',
    editMode: 'always',                       // Context-aware default
    placeholder: '{{i18n.elements.title.placeholder}}'
  }
};

// Field element inherits base + adds field-specific settings
const fieldEmailSettings = {
  ...baseElementSettings,
  field: {
    fieldType: 'email',
    label: 'Email Address',
    placeholder: '{{i18n.fields.email.placeholder}}',
    required: true
  },
  data: {
    ...baseElementSettings.data,
    validation: {
      required: true,
      pattern: '^[^@]+@[^@]+\\.[^@]+$',
      errorMessage: '{{i18n.validation.invalidEmail}}'
    }
  }
};

// Structure element inherits base + adds structure-specific settings
const structureCardSettings = {
  ...baseElementSettings,
  layout: {
    ...baseElementSettings.layout,
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
    structureType: 'card'
  }
};
```

### Implementation: Settings Composition

```jsx
// Element renders with composed settings
const TitleElement = ({ data, settings, onUpdate }) => {
  const { resolveToken } = useTheme();

  // Merge default common settings with provided settings
  const finalSettings = {
    ...baseElementSettings,
    ...settings
  };

  // Resolve all theme tokens
  const resolvedSettings = resolveAllTokens(finalSettings, resolveToken);

  // Apply common settings
  const containerStyle = {
    width: resolvedSettings.layout.width === 'full' ? '100%' : 'auto',
    marginTop: resolvedSettings.spacing.margin.top,
    // ... other common styles
  };

  return (
    <div style={containerStyle}>
      <input className={resolvedSettings.typography.color} />
    </div>
  );
};
```

---

## Localization (i18n) Architecture

### Problem

Text in elements (placeholders, labels, error messages) needs to support multiple languages:
- Element placeholders: "Untitled", "Add a description..."
- Button labels: "Change", "Remove", "Add icon"
- Error messages: "Required field", "Invalid format"

Hard-coding English text makes internationalization impossible.

### Solution: Locale Keys

Use **locale keys** instead of literal strings. Keys are resolved at runtime based on active locale.

### Locale Structure

```javascript
{
  locale: 'en-US',
  name: 'English (United States)',
  translations: {
    // Element placeholders
    elements: {
      title: {
        placeholder: 'Untitled',
        emptyState: 'Click to add title'
      },
      description: {
        placeholder: 'Add a description...',
        emptyState: 'Click to add description'
      },
      pageIcon: {
        addButton: 'Add icon',
        changeButton: 'Change',
        removeButton: 'Remove'
      },
      coverImage: {
        placeholder: 'Click to upload cover image',
        changeButton: 'Change',
        removeButton: 'Remove',
        repositionHint: 'Drag to reposition'
      },
      slashInput: {
        placeholder: "Type '/' for blocks, or just start typing...",
        hint: 'Press / for quick insert'
      }
    },

    // Common UI strings
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      loading: 'Loading...'
    },

    // Validation messages
    validation: {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email',
      tooShort: 'Must be at least {{min}} characters',
      tooLong: 'Must be no more than {{max}} characters'
    }
  }
}
```

### Spanish Locale Example

```javascript
{
  locale: 'es-ES',
  name: 'Español (España)',
  translations: {
    elements: {
      title: {
        placeholder: 'Sin título',
        emptyState: 'Haz clic para añadir título'
      },
      description: {
        placeholder: 'Añade una descripción...',
        emptyState: 'Haz clic para añadir descripción'
      },
      pageIcon: {
        addButton: 'Añadir icono',
        changeButton: 'Cambiar',
        removeButton: 'Eliminar'
      }
      // ... rest of translations
    }
  }
}
```

### Locale Key References in Settings

```javascript
// ❌ BAD: Hard-coded English text
{
  type: 'markup',
  settings: {
    markup: {
      markupType: 'title',
      placeholder: 'Untitled'  // Only works in English
    }
  }
}

// ✅ GOOD: Locale key reference
{
  type: 'markup',
  settings: {
    markup: {
      markupType: 'title',
      placeholder: '{{i18n.elements.title.placeholder}}'  // Adapts to locale
    }
  }
}
```

### Locale Implementation

**Locale Provider Component:**

```jsx
// LocaleProvider.jsx
import React, { createContext, useContext, useState } from 'react';

const LocaleContext = createContext();

export const LocaleProvider = ({ children, initialLocale }) => {
  const [activeLocale, setActiveLocale] = useState(initialLocale);

  const t = (key, variables = {}) => {
    // Parse key: "{{i18n.elements.title.placeholder}}"
    const path = key.replace(/{{i18n\.|}}$/g, '').split('.');
    let translation = path.reduce((obj, k) => obj?.[k], activeLocale.translations);

    // Replace variables: "Must be at least {{min}} characters"
    if (variables && typeof translation === 'string') {
      Object.keys(variables).forEach(varKey => {
        translation = translation.replace(new RegExp(`{{${varKey}}}`, 'g'), variables[varKey]);
      });
    }

    return translation || key; // Fallback to key if translation missing
  };

  return (
    <LocaleContext.Provider value={{ activeLocale, setActiveLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
```

**Element Usage:**

```jsx
// TitleElement.jsx (markup type)
const TitleElement = ({ data, settings, onUpdate }) => {
  const { t } = useLocale();

  // Resolve locale key or use literal value
  const placeholder = settings.markup?.placeholder?.startsWith('{{i18n.')
    ? t(settings.markup.placeholder)
    : settings.markup?.placeholder;

  return (
    <input
      placeholder={placeholder}  // Automatically shows correct language
      // ...
    />
  );
};
```

### Locale Switching

```javascript
// User selects language from dropdown
setActiveLocale(locales['es-ES']);

// All elements automatically re-render with Spanish translations
```

### Content vs. UI Localization

**Two types of localization:**

1. **UI Localization (i18n keys)** - Element placeholders, buttons, messages
   - Defined in locale files
   - Referenced with `{{i18n.path.to.key}}`
   - Switches when user changes language

2. **Content Localization** - Actual page content (titles, descriptions, body text)
   - Stored in `data.content` per locale
   - Requires content duplication per language
   - Example:
   ```javascript
   {
     type: 'markup',
     data: {
       content: {
         'en-US': 'Welcome to our website',
         'es-ES': 'Bienvenido a nuestro sitio web',
         'fr-FR': 'Bienvenue sur notre site'
       }
     }
   }
   ```

---

## Architectural Decisions

This section documents the finalized decisions for all design questions, providing implementation guidance.

### Element Behavior Decisions

**1. Default Edit Mode**
- **Decision:** Context-aware defaults
- **Implementation:**
  - Page header titles: `editMode: 'always'` (Notion-style)
  - Content section titles: `editMode: 'click'`
  - Template/static content: `editMode: 'readonly'`
- **Rationale:** Different contexts require different interaction patterns

**2. Icon Overlap with Cover**
- **Decision:** Use layout negative margin setting
- **Implementation:** `layout.spacing.margin.top: '-32px'` for icon overlap
- **Rationale:** Leverages existing layout system, no special cases needed

**3. Empty Zone Detection**
- **Decision:** Control by explicit setting
- **Implementation:** Zone-level `features.showSlashHint: true/false`
- **Rationale:** Distinguishes "empty for now" vs "intentionally empty"

**4. Slash Command Context**
- **Decision:** Setting under data group
- **Implementation:**
  ```javascript
  data: {
    slashCommands: {
      enabled: true,
      context: 'internal' | 'external' | 'both'
    }
  }
  ```
- **Rationale:** Slash commands are data-related functionality, not UI behavior

**5. Multiline Descriptions**
- **Decision:** Separate field types
- **Implementation:**
  - `fieldType: 'text'` = single-line input
  - `fieldType: 'textarea'` = multiline input
- **Rationale:** Clear, explicit field type distinction

### Theme System Decisions

**6. Theme Token Migration**
- **Decision:** Remove all hard-coded colors immediately
- **Implementation:**
  - Primary: Use theme tokens only (`{{theme.colors.text.primary}}`)
  - Fallback: `appearance.customColors` when theme insufficient
  - Validation: Build-time check for hard-coded colors
- **Rationale:** Ensures consistent theming, prevents drift

**7. Theme Scope**
- **Decision:** Three-tier inheritance
- **Implementation:** Global → Page → Element
- **Priority:** Element overrides > Page overrides > Global theme
- **Rationale:** Flexibility with reasonable defaults, element overrides as exceptions

**8. Theme Customization**
- **Decision:** Allow users to create custom themes via UI
- **Implementation:**
  - Visual theme editor in settings
  - Save custom themes to user profile
  - Support theme inheritance (extend default with overrides)
- **Rationale:** Empowers users, supports branding needs

**9. CSS Generation**
- **Decision:** Hybrid approach
- **Implementation:**
  - Build-time: Generate CSS custom properties for static tokens
  - Runtime: Resolve dynamic tokens once per context, write to CSS variables
  - Resolution pipeline: Global → Page → Zone → Element
  - Cache hierarchy: Global → Page → Zone → Element
- **Rationale:** Performance optimization, minimal runtime overhead

### Settings Organization Decisions

**10. Settings Inheritance**
- **Decision:** Six-layer hierarchy with flexible nesting (depth: 3)
- **Implementation:**
  - Layers: Page → Zone → Row → Column → Element → [Structure → Structure → Structure → Leaf]
  - Priority: Deeply Nested Element > Parent Structure > Element > Column > Row → Zone → Page
  - Structure nesting limit: Max depth 3 (covers 95% of real-world HTML)
  - Depth restrictions: All types at depth 1, no fields at depth 2+, only leaf elements at depth 3
- **Rationale:** Real-world HTML has 3-5 levels of nesting; depth 3 balances flexibility with reasonable constraints
- **Validation:** HTML analysis confirmed 90% of layouts need 2-3 levels of structure nesting

**11. Responsive Settings**
- **Decision:** Yes, support per-breakpoint overrides (strictly optional)
- **Implementation:**
  ```javascript
  layout: {
    responsive: {
      mobile: { width: 'full', spacing: {...} },
      tablet: { width: '2/3', spacing: {...} },
      desktop: { width: '1/2', spacing: {...} }
    }
  }
  ```
- **Rationale:** Enables responsive design without element duplication

**12. Settings Validation**
- **Decision:** Hybrid validation approach
- **Implementation:**
  - Runtime: Validate all user input settings
  - Build-time: Validate static configs
  - Type checking: Runtime for dynamic, build-time for static
- **Rationale:** Catches errors early, prevents runtime failures

### Localization Decisions

**13. Default Locale Strategy**
- **Decision:** Auto-detect with tiered fallback
- **Implementation:**
  - Auto-detect: Browser/system language on first load
  - Fallback chain: Language + region → Language → en-US
  - Example: es-MX → es-ES → en-US
  - Manual selection: Always available in settings/profile
- **Rationale:** Best user experience with reliable fallback

**14. Content Translation Workflow**
- **Decision:** Side-by-side UI with visual flagging
- **Implementation:**
  - Split-screen editor for translating content per locale
  - Visual indicators for untranslated content
  - Machine translation: Future enhancement (no immediate API integration)
- **Rationale:** Efficient workflow, clear visibility of translation status

**15. RTL Language Support**
- **Decision:** Out of scope for now
- **Implementation:** Defer to future phase
- **Rationale:** Focus on core functionality first

**16. Locale-Specific Formatting**
- **Decision:** Use Intl API, store raw values
- **Implementation:**
  - Use `Intl.DateTimeFormat`, `Intl.NumberFormat`, etc.
  - Store raw values only (numbers, dates)
  - Apply locale from user profile or fallback chain
  - Validate locale tags (BCP 47)
  - Manual override available in settings
- **Rationale:** Standards-based, accessible, maintainable

### Implementation Strategy Decisions

**17. Phase Sequencing**
- **Decision:** Build all in parallel
- **Implementation:**
  - Team 1: Theme system (ThemeProvider, CSS generation)
  - Team 2: Settings architecture (5 groups, inheritance)
  - Team 3: Localization (LocaleProvider, i18n)
  - Weekly sync: Integration checkpoints
- **Rationale:** Faster delivery, parallel workstreams

**18. Backward Compatibility**
- **Decision:** Require manual migration, no old format support
- **Implementation:**
  - Migration tool: CLI script to convert old configs
  - Documentation: Clear migration guide
  - Deprecation: Remove old format support entirely
- **Rationale:** Clean break, no technical debt

**19. Settings Panel UI**
- **Decision:** Implement visual UI + manual JSON editing
- **Implementation:**
  - Visual panel: For most common settings
  - JSON editor: For advanced users and edge cases
  - Live preview: Show changes in real-time
- **Rationale:** Serves both casual and power users

**20. Performance Considerations**
- **Decision:** Hybrid resolution with caching
- **Implementation:**
  - Build-time: Emit CSS variables for static tokens
  - Runtime: Resolve dynamic tokens once per context
  - Write to CSS variables (root or container), not per element
  - Cache resolution results at each hierarchy level
- **Rationale:** Minimal runtime overhead, scales to large pages

---

## Complete Element Settings Schema

With themes, 5 organized setting groups, and localization, here's the complete settings structure for the approved 4-type domain architecture:

```javascript
// Markup Element (Title) - Complete Structure
{
  id: 'page-title',
  type: 'markup',                                         // UI domain type

  // Data (can be localized)
  data: {
    content: 'Welcome'  // or { 'en-US': 'Welcome', 'es-ES': 'Bienvenido' }
  },

  // Settings (5 common groups + markup-specific)
  settings: {
    // Group 1: Layout (position and structure)
    layout: {
      width: 'full',
      alignment: 'left',
      spacing: {
        margin: {
          bottom: '{{theme.spacing.sm}}'                  // Theme token
        }
      }
    },

    // Group 2: Appearance (theme-based colors, borders, shadows)
    appearance: {
      background: '{{theme.colors.background}}'           // Theme token ONLY
    },

    // Group 3: Data (binding, format, validation)
    data: {
      slashCommands: {
        enabled: true,
        context: 'internal'
      }
    },

    // Group 4: Typography (fonts and text styling)
    typography: {
      fontSize: '{{theme.typography.fontSize.4xl}}',      // Theme token
      fontWeight: '{{theme.typography.fontWeight.bold}}', // Theme token
      color: '{{theme.colors.text.primary}}'              // Theme token
    },

    // Group 5: Business Rules (visibility, permissions, conditional logic, animation)
    businessRules: {
      visibility: {
        hidden: false
      },
      animation: {
        entrance: 'fade',
        duration: 300
      }
    },

    // Markup-specific settings (namespaced)
    markup: {
      markupType: 'title',
      editMode: 'always',                                 // Context-aware default
      placeholder: '{{i18n.elements.title.placeholder}}'  // Locale key
    }
  }
}

// Field Element (Email) - Complete Structure
{
  id: 'email-field',
  type: 'field',                                          // Data domain type

  data: {
    value: ''
  },

  settings: {
    // Group 1: Layout
    layout: { width: 'full' },

    // Group 2: Appearance
    appearance: {
      border: {
        width: '1px',
        style: 'solid',
        color: '{{theme.colors.border.default}}'          // Theme token ONLY
      }
    },

    // Group 3: Data (validation in this group)
    data: {
      validation: {
        required: true,
        pattern: '^[^@]+@[^@]+\\.[^@]+$',
        errorMessage: '{{i18n.validation.invalidEmail}}'
      },
      format: {
        type: 'text',
        locale: 'en-US'                                   // Inherits from user profile
      }
    },

    // Group 4: Typography
    typography: {
      fontSize: '{{theme.typography.fontSize.base}}'
    },

    // Group 5: Business Rules
    businessRules: {
      visibility: { hidden: false },
      animation: { entrance: 'none' }
    },

    // Field-specific settings (namespaced)
    field: {
      fieldType: 'email',
      label: 'Email Address',
      placeholder: '{{i18n.fields.email.placeholder}}',
      required: true
    }
  }
}

// Record Element (Image) - Complete Structure
{
  id: 'cover-image',
  type: 'record',                                         // Data domain type

  data: {
    src: 'https://example.com/photo.jpg',
    alt: 'Cover photo',
    position: 50
  },

  settings: {
    // Group 1: Layout
    layout: {
      width: 'full',
      spacing: { margin: { bottom: '{{theme.spacing.lg}}' } }
    },

    // Group 2: Appearance
    appearance: {
      border: {
        radius: '{{theme.borderRadius.lg}}'
      }
    },

    // Group 3: Data
    data: {
      binding: null,
      validation: {}
    },

    // Group 4: Typography (not applicable for images)
    typography: {},

    // Group 5: Business Rules
    businessRules: {
      visibility: { hidden: false },
      animation: {
        entrance: 'fade',
        duration: 400
      }
    },

    // Record-specific settings (namespaced)
    record: {
      recordType: 'image',
      height: '300px',
      aspectRatio: '16/9',
      objectFit: 'cover',
      enableRepositioning: true,
      enableUpload: true
    }
  }
}

// Structure Element (Card) - Complete Structure
{
  id: 'product-card',
  type: 'structure',                                      // UI domain type

  settings: {
    // Group 1: Layout
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

    // Group 2: Appearance
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

    // Group 3: Data
    data: {},

    // Group 4: Typography
    typography: {},

    // Group 5: Business Rules
    businessRules: {
      animation: {
        entrance: 'fade',
        duration: 300
      }
    },

    // Structure-specific settings (namespaced)
    structure: {
      structureType: 'card'
    }
  },

  // Child elements (can be field, record, markup, OR structure up to depth 3)
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
```

---

## Benefits Summary

### Domain-Based Architecture
✅ **Storage intent is explicit** - Type name implies whether element persists to database
✅ **Query optimization** - Efficient queries by domain for serialization
✅ **Team boundaries** - Clear ownership (data team vs UI team)
✅ **Natural container home** - Structure fits cleanly in UI domain
✅ **Scalable** - Easy to add new subtypes within each domain
✅ **Future extensible** - Can add new domains (e.g., logic, integration)

### Four Element Types
✅ **Simple mental model** - Data (field, record), UI (markup, structure)
✅ **Clear purpose** - Each type has distinct role and capabilities
✅ **Consistent patterns** - Settings work the same across all types
✅ **Easy to learn** - Users quickly understand the four categories
✅ **Compositional power** - Structure enables cards, grids, modals, tabs

### Five Setting Groups
✅ **Logical organization** - Related settings grouped together
✅ **No redundancy** - Single inheritance hierarchy
✅ **Clear names** - Layout, Appearance, Data, Typography, Business Rules
✅ **Behavioral grouping** - Makes sense for all element types
✅ **Consistent structure** - Every element follows same pattern

### Theme System
✅ **No hard-coded colors** - All styling via theme tokens
✅ **Dark mode ready** - Switch themes instantly
✅ **Brand flexibility** - Easy to customize for different brands
✅ **Maintainable** - Change colors globally, not per-element

### Localization
✅ **Multi-language support** - Auto-detect with fallback chain
✅ **Professional workflow** - Side-by-side translation UI
✅ **Standards-based** - Uses Intl API for formatting
✅ **Accessible** - Proper locale handling for screen readers

---

## Next Steps

With the approved architecture fully documented and all design decisions finalized, implementation can proceed in parallel:

### Phase 1: Foundation Systems (Parallel Development)

1. **Theme System** - Implement ThemeProvider, CSS generation, token resolution
   - Build-time CSS variable generation for static tokens
   - Runtime resolution pipeline: Global → Page → Element
   - Visual theme editor UI with custom theme support

2. **Settings Architecture** - Implement 5-group structure with inheritance
   - Six-layer inheritance: Page → Zone → Row → Column → Element → [Structure → Element]
   - Priority resolution: Nested Element > Structure > Element > Column > Row > Zone > Page
   - Runtime and build-time validation

3. **Localization System** - Implement LocaleProvider with auto-detect and fallback
   - Browser/system language auto-detection
   - Tiered fallback chain ending in en-US
   - Side-by-side translation UI with visual flagging

### Phase 2: Element Migration

4. **Update Element Components** - Migrate to new 4-type domain architecture
   - Rename `ui` type to `markup` (ui → markup, uiType → markupType)
   - Add `structure` type with controlled nesting
   - Follow field/record patterns (already mostly correct)
   - Remove all hard-coded colors (theme tokens only)

5. **Migration CLI Tool** - Create script to convert old configs
   - No backward compatibility (clean break)
   - Clear migration guide and documentation

### Phase 3: Tooling & Testing

6. **Settings Panel UI** - Build visual configuration + JSON editor
   - Visual panel for common settings
   - Manual JSON editing for advanced users
   - Live preview of changes

7. **Testing & Validation** - Ensure correctness across all scenarios
   - Runtime validation for user input
   - Build-time validation for static configs
   - Performance testing with large pages (1000+ elements)

8. **Documentation** - Complete developer guides
   - Component migration examples
   - Theme customization guide
   - Settings architecture reference

### Phase 4: Deployment

9. **Rollout Strategy** - Deploy with monitoring
   - Manual migration required (no old format support)
   - Monitor performance metrics
   - User feedback collection

---

**Status:** ✅ **Finalized Architecture** - All design decisions documented. Ready for parallel implementation. See GENERIC_ELEMENT_TYPES.md for the complete 4-type domain specification and Architectural Decisions section above for all 20 design decisions.
