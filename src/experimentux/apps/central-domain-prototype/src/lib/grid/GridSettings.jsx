/**
 * Grid Settings
 * UI component for configuring grid settings
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../config/theme';
import { Grid3x3, Eye, EyeOff } from 'lucide-react';

export function GridSettings({
  gridSize = 20,
  onGridSizeChange,
  visible = true,
  onVisibilityChange,
  snapEnabled = true,
  onSnapEnabledChange
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      style={{
        backgroundColor: theme.colors.background.elevated,
        border: `1px solid ${theme.colors.border.default}`,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing[3],
        boxShadow: theme.shadows.sm
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isExpanded ? theme.spacing[3] : 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
          <Grid3x3 size={16} color={theme.colors.text.secondary} />
          <span
            style={{
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.primary
            }}
          >
            Grid Settings
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: theme.spacing[1],
            color: theme.colors.text.tertiary,
            fontSize: theme.typography.fontSize.xs
          }}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
          {/* Grid Size */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing[1]
              }}
            >
              Grid Size: {gridSize}px
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={gridSize}
              onChange={(e) => onGridSizeChange?.(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: theme.colors.primary[500]
              }}
            />
          </div>

          {/* Visibility Toggle */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[2],
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary
            }}
          >
            <input
              type="checkbox"
              checked={visible}
              onChange={(e) => onVisibilityChange?.(e.target.checked)}
              style={{
                accentColor: theme.colors.primary[500],
                width: '16px',
                height: '16px'
              }}
            />
            {visible ? <Eye size={14} /> : <EyeOff size={14} />}
            Show Grid
          </label>

          {/* Snap Toggle */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[2],
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary
            }}
          >
            <input
              type="checkbox"
              checked={snapEnabled}
              onChange={(e) => onSnapEnabledChange?.(e.target.checked)}
              style={{
                accentColor: theme.colors.primary[500],
                width: '16px',
                height: '16px'
              }}
            />
            Snap to Grid
          </label>
        </div>
      )}
    </div>
  );
}

GridSettings.propTypes = {
  gridSize: PropTypes.number,
  onGridSizeChange: PropTypes.func,
  visible: PropTypes.bool,
  onVisibilityChange: PropTypes.func,
  snapEnabled: PropTypes.bool,
  onSnapEnabledChange: PropTypes.func
};

export default GridSettings;
