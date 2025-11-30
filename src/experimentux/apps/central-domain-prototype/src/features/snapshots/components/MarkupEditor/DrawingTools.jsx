/**
 * DrawingTools
 * Toolbar with shape buttons and color picker
 */

import PropTypes from 'prop-types';
import { MousePointer2, ArrowRight, Square, Circle, Minus, Type, Eye, EyeOff } from 'lucide-react';
import { theme } from '../../../../config/theme';

const COLORS = [
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0066FF' },
  { name: 'Green', value: '#10B981' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Black', value: '#000000' },
];

const TOOLS = [
  { id: 'select', icon: MousePointer2, label: 'Select (Move/Resize)' },
  { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'line', icon: Minus, label: 'Line' },
  { id: 'text', icon: Type, label: 'Text' },
];

const REDACTION_TOOLS = [
  { id: 'blur', icon: Eye, label: 'Blur (Reversible)', description: 'Blur sensitive information' },
  { id: 'blackbox', icon: EyeOff, label: 'Black Box (Permanent)', description: 'Permanently hide information' },
];

export function DrawingTools({ activeTool, activeColor, onSelectTool, onSelectColor }) {
  const isRedactionTool = activeTool === 'blur' || activeTool === 'blackbox';

  return (
    <div style={{ display: 'flex', gap: theme.spacing[2], alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Drawing Tool buttons */}
      <div style={{ display: 'flex', gap: theme.spacing[1] }}>
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              style={{
                padding: theme.spacing[2],
                backgroundColor: isActive ? '#0066FF' : 'transparent',
                color: isActive ? 'white' : theme.colors.text.primary,
                border: `1px solid ${isActive ? '#0066FF' : theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              title={tool.label}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = theme.colors.background.secondary;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      <div style={{
        borderLeft: `1px solid ${theme.colors.border.default}`,
        height: '32px',
      }} />

      {/* Redaction Tools */}
      <div style={{ display: 'flex', gap: theme.spacing[1] }}>
        {REDACTION_TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              style={{
                padding: theme.spacing[2],
                backgroundColor: isActive ? '#DC2626' : 'transparent',
                color: isActive ? 'white' : theme.colors.text.primary,
                border: `1px solid ${isActive ? '#DC2626' : theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              title={tool.label}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = theme.colors.background.secondary;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      <div style={{
        borderLeft: `1px solid ${theme.colors.border.default}`,
        height: '32px',
      }} />

      {/* Color picker (only shown for non-redaction tools) */}
      {!isRedactionTool && (
        <div style={{ display: 'flex', gap: theme.spacing[1] }}>
          {COLORS.map((color) => {
            const isActive = activeColor === color.value;

            return (
              <button
                key={color.value}
                onClick={() => onSelectColor(color.value)}
                style={{
                  width: '28px',
                  height: '28px',
                  backgroundColor: color.value,
                  border: isActive ? '3px solid #000' : '1px solid rgba(0,0,0,0.2)',
                  borderRadius: theme.borderRadius.full,
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                }}
                title={color.name}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              />
            );
          })}
        </div>
      )}

      {/* Redaction warning */}
      {isRedactionTool && (
        <div style={{
          padding: '6px 12px',
          backgroundColor: activeTool === 'blackbox' ? '#FEE2E2' : '#FEF3C7',
          borderRadius: theme.borderRadius.md,
          fontSize: theme.typography.fontSize.xs,
          color: activeTool === 'blackbox' ? '#991B1B' : '#92400E',
          fontWeight: theme.typography.fontWeight.medium,
        }}>
          {activeTool === 'blur' ? '⚠️ Blur: Can be reversed' : '🔒 Black Box: Permanent redaction'}
        </div>
      )}
    </div>
  );
}

DrawingTools.propTypes = {
  activeTool: PropTypes.string,
  activeColor: PropTypes.string.isRequired,
  onSelectTool: PropTypes.func.isRequired,
  onSelectColor: PropTypes.func.isRequired,
};
