/**
 * ElementPicker - Apple-inspired elements palette
 */

import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import {
  Type, Square, Target, CreditCard, Tag, Star, User,
  Home, Layers, BarChart3, Table2, TrendingUp, FileText,
  Layout, Heading, Circle, Navigation, PanelTop, Clock, GripVertical,
  Music, Clock3
} from 'lucide-react';
import { theme } from '../../config/theme';

const ELEMENT_TYPES = {
  data: [
    {
      type: 'field',
      label: 'Field',
      icon: Type,
      color: theme.colors.neutral[600],
      description: 'Input field (text, email, textarea, select)',
      defaultData: { value: '' },
      defaultSettings: {
        field: {
          fieldType: 'text',
          label: 'Label',
          placeholder: 'Enter text...',
          required: false
        }
      }
    },
    {
      type: 'record',
      label: 'Record',
      icon: FileText,
      color: theme.colors.neutral[600],
      description: 'Display record data',
      defaultData: { content: 'Record data' },
      defaultSettings: {
        record: {
          recordType: 'display'
        }
      }
    },
    {
      type: 'chart',
      label: 'Chart',
      icon: BarChart3,
      color: theme.colors.charts.primary,
      description: 'Bar, line, pie charts',
      defaultData: { data: [] },
      defaultSettings: {
        chartType: 'bar',
        title: 'Chart Title'
      }
    },
    {
      type: 'datatable',
      label: 'Data Table',
      icon: Table2,
      color: theme.colors.charts.accent2,
      description: 'Tabular data display',
      defaultData: { rows: [], columns: [] },
      defaultSettings: {
        pagination: true,
        searchable: true
      }
    },
    {
      type: 'kpicard',
      label: 'KPI Card',
      icon: TrendingUp,
      color: theme.colors.charts.accent2,
      description: 'Key performance indicator card',
      defaultData: { value: '0', label: 'KPI' },
      defaultSettings: {
        trend: 'up',
        percentage: '+0%'
      }
    }
  ],
  ui: [
    {
      type: 'markup',
      label: 'Markup',
      icon: Heading,
      color: theme.colors.text.secondary,
      description: 'Text, headings, buttons',
      defaultData: { content: 'Text content' },
      defaultSettings: {
        markup: {
          markupType: 'paragraph'
        },
        typography: {
          fontSize: '{{theme.typography.fontSize.base}}'
        }
      }
    },
    {
      type: 'structure',
      label: 'Structure',
      icon: Layout,
      color: theme.colors.neutral[500],
      description: 'Card, hero, canvas, flex',
      defaultSettings: {
        structure: {
          structureType: 'card'
        },
        appearance: {
          background: '{{theme.colors.background}}',
          borderColor: '{{theme.colors.border.default}}'
        },
        layout: {
          padding: '{{theme.spacing.lg}}'
        }
      },
      elements: []
    },
    {
      type: 'hero',
      label: 'Hero',
      icon: Target,
      color: theme.colors.neutral[600],
      description: 'Hero section with title and CTA',
      defaultData: { title: 'Hero Title', subtitle: 'Subtitle' },
      defaultSettings: {
        alignment: 'center',
        background: '{{theme.colors.primary[500]}}'
      }
    },
    {
      type: 'card',
      label: 'Card',
      icon: CreditCard,
      color: theme.colors.neutral[600],
      description: 'Simple card container',
      defaultData: { title: 'Card Title', content: 'Card content' },
      defaultSettings: {
        padding: '{{theme.spacing[4]}}',
        borderRadius: '{{theme.borderRadius.lg}}'
      }
    },
    {
      type: 'badge',
      label: 'Badge',
      icon: Tag,
      color: theme.colors.neutral[500],
      description: 'Status badge or label',
      defaultData: { text: 'Badge' },
      defaultSettings: {
        variant: 'default',
        size: 'md'
      }
    },
    {
      type: 'icon',
      label: 'Icon',
      icon: Star,
      color: theme.colors.neutral[500],
      description: 'Icon element',
      defaultData: { iconName: 'star' },
      defaultSettings: {
        size: 24,
        color: '{{theme.colors.text.primary}}'
      }
    },
    {
      type: 'avatar',
      label: 'Avatar',
      icon: User,
      color: theme.colors.neutral[500],
      description: 'User avatar image',
      defaultData: { name: 'User', src: '' },
      defaultSettings: {
        size: 'md',
        shape: 'circle'
      }
    },
    {
      type: 'breadcrumb',
      label: 'Breadcrumb',
      icon: Navigation,
      color: theme.colors.text.tertiary,
      description: 'Navigation breadcrumb',
      defaultData: { items: [{ label: 'Home', url: '/' }] },
      defaultSettings: {
        separator: '/'
      }
    },
    {
      type: 'tabs',
      label: 'Tabs',
      icon: PanelTop,
      color: theme.colors.neutral[600],
      description: 'Tabbed interface',
      defaultData: { tabs: [{ label: 'Tab 1', content: 'Content 1' }] },
      defaultSettings: {
        variant: 'default'
      }
    },
    {
      type: 'timeline',
      label: 'Timeline',
      icon: Clock,
      color: theme.colors.charts.accent1,
      description: 'Timeline or steps',
      defaultData: { items: [{ title: 'Step 1', description: 'Description' }] },
      defaultSettings: {
        orientation: 'vertical'
      }
    },
    {
      type: 'spotify-player',
      label: 'Spotify Player',
      icon: Music,
      color: '#1DB954',
      description: 'Embedded Spotify music player',
      defaultData: {
        spotifyUrl: 'https://open.spotify.com/track/17i5jLpzndlQhbS4SrTd0B?si=c27a885021d24ad8',
        type: 'track',
        height: 352
      },
      defaultSettings: {
        layout: {
          width: '100%'
        },
        appearance: {
          background: theme.colors.background.primary,
          borderColor: theme.colors.border.subtle
        }
      }
    },
    {
      type: 'analog-clock',
      label: 'Analog Clock',
      icon: Clock3,
      color: theme.colors.text.primary,
      description: 'Elegant analog clock with date',
      defaultData: {
        showDate: true,
        showSeconds: true,
        timeZone: 'local',
        showAllCanadianZones: false
      },
      defaultSettings: {
        layout: {
          width: 'fit-content',
          size: '240'
        },
        appearance: {
          background: theme.colors.background.primary,
          borderColor: theme.colors.border.subtle
        }
      }
    }
  ]
};

function DraggableElement({ elementType, index }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `draggable-${elementType.type}-${elementType.label.toLowerCase().replace(/\s+/g, '-')}`,
    data: {
      type: 'palette-element',
      elementType: elementType.type,
      elementSubtype: elementType.label,
      defaultData: elementType.defaultData || {},
      defaultSettings: elementType.defaultSettings || {},
      elements: elementType.elements || []
    }
  });

  const Icon = elementType.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      whileHover={{ x: 4 }}
      className="group"
      style={{
        opacity: isDragging ? 0.5 : 1
      }}
    >
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="relative cursor-grab active:cursor-grabbing transition-all"
        style={{
          padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
          borderBottom: `1px solid ${theme.colors.border.default}`,
          transition: `all ${theme.transitions.base}`
        }}
      >
        <div className="flex items-start gap-3">
          {/* Drag handle */}
          <div
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              color: theme.colors.text.tertiary,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              paddingTop: '10px'
            }}
          >
            <GripVertical size={16} strokeWidth={2} />
          </div>

          {/* Icon */}
          <div
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Icon
              size={18}
              style={{
                color: elementType.color,
                strokeWidth: 2
              }}
            />
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing[1]
              }}
            >
              {elementType.label}
            </div>
            <div
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.tertiary,
                lineHeight: theme.typography.lineHeight.snug
              }}
            >
              {elementType.description}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

DraggableElement.propTypes = {
  elementType: PropTypes.shape({
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired
};

export function ElementPicker() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Elegant Apple-style scrollbar */}
      <style>{`
        .elegant-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .elegant-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .elegant-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme.colors.border.medium};
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .elegant-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme.colors.border.strong};
          border: 2px solid transparent;
          background-clip: padding-box;
        }
      `}</style>

      <div
        className="elegant-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <div>
          {/* Data Domain */}
          <div>
            <h3
              style={{
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.tertiary,
                textTransform: 'uppercase',
                letterSpacing: theme.typography.letterSpacing.wide,
                padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
                margin: 0,
                background: '#FFFFFF',
                position: 'sticky',
                top: 0,
                zIndex: 1
              }}
            >
              Data Domain
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {ELEMENT_TYPES.data.map((elementType, index) => (
                <DraggableElement key={elementType.type} elementType={elementType} index={index} />
              ))}
            </div>
          </div>

          {/* UI Domain */}
          <div>
            <h3
              style={{
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.tertiary,
                textTransform: 'uppercase',
                letterSpacing: theme.typography.letterSpacing.wide,
                padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
                margin: 0,
                background: '#FFFFFF',
                position: 'sticky',
                top: 0,
                zIndex: 1
              }}
            >
              UI Domain
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {ELEMENT_TYPES.ui.map((elementType, index) => (
                <DraggableElement key={elementType.type} elementType={elementType} index={index + ELEMENT_TYPES.data.length} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
