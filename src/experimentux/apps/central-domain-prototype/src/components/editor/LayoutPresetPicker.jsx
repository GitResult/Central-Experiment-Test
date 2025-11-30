/**
 * LayoutPresetPicker Component
 * Modal dialog for browsing and selecting layout presets
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../theme/ThemeProvider';
import {
  presetCategories,
  getPresetsByCategory,
  applyPreset
} from '../../config/layoutPresets';

export function LayoutPresetPicker({ isOpen, onClose, onSelectPreset }) {
  const { resolveToken } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredPreset, setHoveredPreset] = useState(null);

  if (!isOpen) return null;

  const presets = getPresetsByCategory(selectedCategory);

  const handleSelectPreset = (preset) => {
    const newPage = applyPreset(preset);
    onSelectPreset(newPage);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: resolveToken('{{theme.colors.background.primary}}'),
          borderRadius: resolveToken('{{theme.borderRadius.xl}}'),
          boxShadow: resolveToken('{{theme.shadows.2xl}}'),
          width: '90%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: resolveToken('{{theme.spacing.6}}'),
            borderBottom: `1px solid ${resolveToken('{{theme.colors.border.default}}')}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: resolveToken('{{theme.typography.fontSize.2xl}}'),
                fontWeight: resolveToken('{{theme.typography.fontWeight.bold}}'),
                color: resolveToken('{{theme.colors.text.primary}}'),
                margin: 0,
              }}
            >
              Choose a Layout
            </h2>
            <p
              style={{
                fontSize: resolveToken('{{theme.typography.fontSize.sm}}'),
                color: resolveToken('{{theme.colors.text.secondary}}'),
                margin: `${resolveToken('{{theme.spacing.2}}')} 0 0 0`,
              }}
            >
              Start with a pre-configured layout template
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: resolveToken('{{theme.typography.fontSize.2xl}}'),
              color: resolveToken('{{theme.colors.text.secondary}}'),
              cursor: 'pointer',
              padding: resolveToken('{{theme.spacing.2}}'),
              borderRadius: resolveToken('{{theme.borderRadius.md}}'),
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = resolveToken('{{theme.colors.neutral.100}}');
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            �
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {/* Categories Sidebar */}
          <div
            style={{
              width: '200px',
              borderRight: `1px solid ${resolveToken('{{theme.colors.border.default}}')}`,
              padding: resolveToken('{{theme.spacing.4}}'),
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                fontSize: resolveToken('{{theme.typography.fontSize.xs}}'),
                fontWeight: resolveToken('{{theme.typography.fontWeight.semibold}}'),
                color: resolveToken('{{theme.colors.text.secondary}}'),
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: resolveToken('{{theme.spacing.2}}'),
              }}
            >
              Categories
            </div>
            {presetCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: resolveToken('{{theme.spacing.2}}'),
                  width: '100%',
                  padding: resolveToken('{{theme.spacing.2}}'),
                  background:
                    selectedCategory === category.id
                      ? resolveToken('{{theme.colors.primary.50}}')
                      : 'transparent',
                  border: 'none',
                  borderRadius: resolveToken('{{theme.borderRadius.md}}'),
                  color:
                    selectedCategory === category.id
                      ? resolveToken('{{theme.colors.primary.700}}')
                      : resolveToken('{{theme.colors.text.primary}}'),
                  fontSize: resolveToken('{{theme.typography.fontSize.sm}}'),
                  fontWeight:
                    selectedCategory === category.id
                      ? resolveToken('{{theme.typography.fontWeight.semibold}}')
                      : resolveToken('{{theme.typography.fontWeight.normal}}'),
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  marginBottom: resolveToken('{{theme.spacing.1}}'),
                }}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Presets Grid */}
          <div
            style={{
              flex: 1,
              padding: resolveToken('{{theme.spacing.6}}'),
              overflowY: 'auto',
            }}
          >
            {presets.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: resolveToken('{{theme.colors.text.secondary}}'),
                  fontSize: resolveToken('{{theme.typography.fontSize.base}}'),
                }}
              >
                No layouts found in this category
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: resolveToken('{{theme.spacing.4}}'),
                }}
              >
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    onMouseEnter={() => setHoveredPreset(preset.id)}
                    onMouseLeave={() => setHoveredPreset(null)}
                    style={{
                      border: `2px solid ${
                        hoveredPreset === preset.id
                          ? resolveToken('{{theme.colors.primary.500}}')
                          : resolveToken('{{theme.colors.border.default}}')
                      }`,
                      borderRadius: resolveToken('{{theme.borderRadius.lg}}'),
                      padding: resolveToken('{{theme.spacing.4}}'),
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background:
                        hoveredPreset === preset.id
                          ? resolveToken('{{theme.colors.primary.50}}')
                          : resolveToken('{{theme.colors.background.primary}}'),
                      transform:
                        hoveredPreset === preset.id
                          ? 'translateY(-2px)'
                          : 'translateY(0)',
                      boxShadow:
                        hoveredPreset === preset.id
                          ? resolveToken('{{theme.shadows.md}}')
                          : resolveToken('{{theme.shadows.sm}}'),
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: '100%',
                        height: '160px',
                        background: resolveToken('{{theme.colors.neutral.100}}'),
                        borderRadius: resolveToken('{{theme.borderRadius.md}}'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '48px',
                        marginBottom: resolveToken('{{theme.spacing.3}}'),
                      }}
                    >
                      {preset.thumbnail || '=�'}
                    </div>

                    {/* Info */}
                    <div>
                      <h3
                        style={{
                          fontSize: resolveToken('{{theme.typography.fontSize.base}}'),
                          fontWeight: resolveToken('{{theme.typography.fontWeight.semibold}}'),
                          color: resolveToken('{{theme.colors.text.primary}}'),
                          margin: 0,
                          marginBottom: resolveToken('{{theme.spacing.1}}'),
                        }}
                      >
                        {preset.name}
                      </h3>
                      <p
                        style={{
                          fontSize: resolveToken('{{theme.typography.fontSize.sm}}'),
                          color: resolveToken('{{theme.colors.text.secondary}}'),
                          margin: 0,
                          lineHeight: resolveToken('{{theme.typography.lineHeight.relaxed}}'),
                        }}
                      >
                        {preset.description}
                      </p>
                    </div>

                    {/* Zones count */}
                    <div
                      style={{
                        marginTop: resolveToken('{{theme.spacing.3}}'),
                        padding: `${resolveToken('{{theme.spacing.1}}')} ${resolveToken('{{theme.spacing.2}}')}`,
                        background: resolveToken('{{theme.colors.neutral.100}}'),
                        borderRadius: resolveToken('{{theme.borderRadius.md}}'),
                        fontSize: resolveToken('{{theme.typography.fontSize.xs}}'),
                        color: resolveToken('{{theme.colors.text.secondary}}'),
                        display: 'inline-block',
                      }}
                    >
                      {preset.zones?.length || 0} zone{preset.zones?.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: resolveToken('{{theme.spacing.4}}'),
            borderTop: `1px solid ${resolveToken('{{theme.colors.border.default}}')}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: resolveToken('{{theme.spacing.3}}'),
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: `${resolveToken('{{theme.spacing.2}}')} ${resolveToken('{{theme.spacing.4}}')}`,
              background: 'transparent',
              border: `1px solid ${resolveToken('{{theme.colors.border.default}}')}`,
              borderRadius: resolveToken('{{theme.borderRadius.md}}'),
              color: resolveToken('{{theme.colors.text.primary}}'),
              fontSize: resolveToken('{{theme.typography.fontSize.sm}}'),
              fontWeight: resolveToken('{{theme.typography.fontWeight.medium}}'),
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

LayoutPresetPicker.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectPreset: PropTypes.func.isRequired,
};
