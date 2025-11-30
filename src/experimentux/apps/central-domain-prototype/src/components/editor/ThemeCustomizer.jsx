/**
 * ThemeCustomizer Component
 * Comprehensive theme customization interface
 * Allows editing colors, typography, spacing, and other theme tokens
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { theme as defaultTheme } from '../../config/theme';
import { ColorPicker, RangeSlider } from './VisualControls';
import { ChevronDown, ChevronRight, Download, Upload, RotateCcw, Check, X } from 'lucide-react';

/**
 * Collapsible theme section
 */
function ThemeSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        marginBottom: defaultTheme.spacing['3'],
        border: `1px solid ${defaultTheme.colors.border.light}`,
        borderRadius: defaultTheme.borderRadius.md,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: defaultTheme.spacing['3'],
          display: 'flex',
          alignItems: 'center',
          gap: defaultTheme.spacing['2'],
          background: defaultTheme.colors.gray[50],
          border: 'none',
          cursor: 'pointer',
          fontSize: defaultTheme.typography.fontSize.sm,
          fontWeight: defaultTheme.typography.fontWeight.semibold,
          color: defaultTheme.colors.text.primary,
        }}
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {title}
      </button>

      {isOpen && (
        <div
          style={{
            padding: defaultTheme.spacing['4'],
            background: defaultTheme.colors.background.primary,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

ThemeSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
};

/**
 * ThemeCustomizer Component
 */
export function ThemeCustomizer({ isOpen, onClose }) {
  const [customTheme, setCustomTheme] = useState(defaultTheme);
  const [hasChanges, setHasChanges] = useState(false);

  // Reset to default theme when opened
  useEffect(() => {
    if (isOpen) {
      setCustomTheme(defaultTheme);
      setHasChanges(false);
    }
  }, [isOpen]);

  // Update theme value
  const updateTheme = (path, value) => {
    const newTheme = JSON.parse(JSON.stringify(customTheme));
    const keys = path.split('.');
    let current = newTheme;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setCustomTheme(newTheme);
    setHasChanges(true);
  };

  // Get theme value by path
  const getThemeValue = (path) => {
    const keys = path.split('.');
    let current = customTheme;

    for (const key of keys) {
      if (current && typeof current === 'object') {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return current;
  };

  // Export theme as JSON
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(customTheme, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'custom-theme.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import theme from JSON
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target.result);
            setCustomTheme(imported);
            setHasChanges(true);
          } catch (error) {
            alert(`Failed to import theme: ${error.message}`);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Reset to default
  const handleReset = () => {
    if (confirm('Reset all theme customizations to default values?')) {
      setCustomTheme(defaultTheme);
      setHasChanges(false);
    }
  };

  // Apply theme
  const handleApply = () => {
    // TODO: Apply theme to ThemeProvider
    console.log('Applying custom theme:', customTheme);
    setHasChanges(false);
    onClose();
  };

  if (!isOpen) return null;

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
        zIndex: 10000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (!hasChanges || confirm('Discard changes and close?')) {
            onClose();
          }
        }
      }}
    >
      <div
        style={{
          width: '90vw',
          height: '90vh',
          maxWidth: '1000px',
          background: defaultTheme.colors.background.primary,
          borderRadius: defaultTheme.borderRadius.lg,
          boxShadow: defaultTheme.shadows.xl,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: defaultTheme.spacing['4'],
            borderBottom: `1px solid ${defaultTheme.colors.border.default}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: defaultTheme.colors.gray[50],
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: defaultTheme.typography.fontSize.lg,
                fontWeight: defaultTheme.typography.fontWeight.semibold,
                color: defaultTheme.colors.text.primary,
              }}
            >
              Theme Customizer
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: defaultTheme.typography.fontSize.sm,
                color: defaultTheme.colors.text.secondary,
                marginTop: defaultTheme.spacing['1'],
              }}
            >
              Customize colors, typography, spacing, and more
            </p>
          </div>

          <button
            onClick={() => {
              if (!hasChanges || confirm('Discard changes and close?')) {
                onClose();
              }
            }}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              borderRadius: defaultTheme.borderRadius.md,
              cursor: 'pointer',
              color: defaultTheme.colors.text.secondary,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div
          style={{
            padding: defaultTheme.spacing['3'],
            borderBottom: `1px solid ${defaultTheme.colors.border.default}`,
            display: 'flex',
            gap: defaultTheme.spacing['2'],
          }}
        >
          <button
            onClick={handleImport}
            style={{
              padding: `${defaultTheme.spacing['2']} ${defaultTheme.spacing['3']}`,
              background: defaultTheme.colors.background.secondary,
              border: `1px solid ${defaultTheme.colors.border.default}`,
              borderRadius: defaultTheme.borderRadius.md,
              cursor: 'pointer',
              fontSize: defaultTheme.typography.fontSize.sm,
              color: defaultTheme.colors.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: defaultTheme.spacing['2'],
            }}
          >
            <Upload size={16} />
            Import
          </button>

          <button
            onClick={handleExport}
            style={{
              padding: `${defaultTheme.spacing['2']} ${defaultTheme.spacing['3']}`,
              background: defaultTheme.colors.background.secondary,
              border: `1px solid ${defaultTheme.colors.border.default}`,
              borderRadius: defaultTheme.borderRadius.md,
              cursor: 'pointer',
              fontSize: defaultTheme.typography.fontSize.sm,
              color: defaultTheme.colors.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: defaultTheme.spacing['2'],
            }}
          >
            <Download size={16} />
            Export
          </button>

          <button
            onClick={handleReset}
            style={{
              padding: `${defaultTheme.spacing['2']} ${defaultTheme.spacing['3']}`,
              background: defaultTheme.colors.background.secondary,
              border: `1px solid ${defaultTheme.colors.border.default}`,
              borderRadius: defaultTheme.borderRadius.md,
              cursor: 'pointer',
              fontSize: defaultTheme.typography.fontSize.sm,
              color: defaultTheme.colors.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: defaultTheme.spacing['2'],
            }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: defaultTheme.spacing['4'],
          }}
        >
          {/* Primary Colors */}
          <ThemeSection title="Primary Colors" defaultOpen={true}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: defaultTheme.spacing['3'] }}>
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <ColorPicker
                  key={shade}
                  label={`Primary ${shade}`}
                  value={getThemeValue(`colors.primary.${shade}`)}
                  onChange={(value) => updateTheme(`colors.primary.${shade}`, value)}
                />
              ))}
            </div>
          </ThemeSection>

          {/* Status Colors */}
          <ThemeSection title="Status Colors">
            <ColorPicker
              label="Success"
              value={getThemeValue('colors.status.success')}
              onChange={(value) => updateTheme('colors.status.success', value)}
            />
            <ColorPicker
              label="Warning"
              value={getThemeValue('colors.status.warning')}
              onChange={(value) => updateTheme('colors.status.warning', value)}
            />
            <ColorPicker
              label="Error"
              value={getThemeValue('colors.status.error')}
              onChange={(value) => updateTheme('colors.status.error', value)}
            />
            <ColorPicker
              label="Info"
              value={getThemeValue('colors.status.info')}
              onChange={(value) => updateTheme('colors.status.info', value)}
            />
          </ThemeSection>

          {/* Text Colors */}
          <ThemeSection title="Text Colors">
            <ColorPicker
              label="Primary Text"
              value={getThemeValue('colors.text.primary')}
              onChange={(value) => updateTheme('colors.text.primary', value)}
            />
            <ColorPicker
              label="Secondary Text"
              value={getThemeValue('colors.text.secondary')}
              onChange={(value) => updateTheme('colors.text.secondary', value)}
            />
            <ColorPicker
              label="Tertiary Text"
              value={getThemeValue('colors.text.tertiary')}
              onChange={(value) => updateTheme('colors.text.tertiary', value)}
            />
            <ColorPicker
              label="Disabled Text"
              value={getThemeValue('colors.text.disabled')}
              onChange={(value) => updateTheme('colors.text.disabled', value)}
            />
          </ThemeSection>

          {/* Background Colors */}
          <ThemeSection title="Background Colors">
            <ColorPicker
              label="Primary Background"
              value={getThemeValue('colors.background.primary')}
              onChange={(value) => updateTheme('colors.background.primary', value)}
            />
            <ColorPicker
              label="Secondary Background"
              value={getThemeValue('colors.background.secondary')}
              onChange={(value) => updateTheme('colors.background.secondary', value)}
            />
            <ColorPicker
              label="Surface"
              value={getThemeValue('colors.surface')}
              onChange={(value) => updateTheme('colors.surface', value)}
            />
          </ThemeSection>

          {/* Border Colors */}
          <ThemeSection title="Border Colors">
            <ColorPicker
              label="Default Border"
              value={getThemeValue('colors.border.default')}
              onChange={(value) => updateTheme('colors.border.default', value)}
            />
            <ColorPicker
              label="Light Border"
              value={getThemeValue('colors.border.light')}
              onChange={(value) => updateTheme('colors.border.light', value)}
            />
            <ColorPicker
              label="Dark Border"
              value={getThemeValue('colors.border.dark')}
              onChange={(value) => updateTheme('colors.border.dark', value)}
            />
          </ThemeSection>

          {/* Typography */}
          <ThemeSection title="Typography">
            <h4
              style={{
                margin: 0,
                marginBottom: defaultTheme.spacing['3'],
                fontSize: defaultTheme.typography.fontSize.sm,
                fontWeight: defaultTheme.typography.fontWeight.semibold,
                color: defaultTheme.colors.text.primary,
              }}
            >
              Font Sizes
            </h4>
            {['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'].map((size) => (
              <div key={size} style={{ marginBottom: defaultTheme.spacing['3'] }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: defaultTheme.typography.fontSize.sm,
                    fontWeight: defaultTheme.typography.fontWeight.medium,
                    color: defaultTheme.colors.text.primary,
                    marginBottom: defaultTheme.spacing['2'],
                  }}
                >
                  {size.toUpperCase()}
                </label>
                <input
                  type="text"
                  value={getThemeValue(`typography.fontSize.${size}`)}
                  onChange={(e) => updateTheme(`typography.fontSize.${size}`, e.target.value)}
                  style={{
                    width: '100%',
                    padding: defaultTheme.spacing['2'],
                    fontSize: defaultTheme.typography.fontSize.sm,
                    fontFamily: 'monospace',
                    color: defaultTheme.colors.text.primary,
                    background: defaultTheme.colors.background.primary,
                    border: `1px solid ${defaultTheme.colors.border.default}`,
                    borderRadius: defaultTheme.borderRadius.sm,
                    outline: 'none',
                  }}
                />
              </div>
            ))}

            <h4
              style={{
                margin: 0,
                marginTop: defaultTheme.spacing['4'],
                marginBottom: defaultTheme.spacing['3'],
                fontSize: defaultTheme.typography.fontSize.sm,
                fontWeight: defaultTheme.typography.fontWeight.semibold,
                color: defaultTheme.colors.text.primary,
              }}
            >
              Font Weights
            </h4>
            {['normal', 'medium', 'semibold', 'bold'].map((weight) => (
              <div key={weight} style={{ marginBottom: defaultTheme.spacing['3'] }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: defaultTheme.typography.fontSize.sm,
                    fontWeight: defaultTheme.typography.fontWeight.medium,
                    color: defaultTheme.colors.text.primary,
                    marginBottom: defaultTheme.spacing['2'],
                  }}
                >
                  {weight.charAt(0).toUpperCase() + weight.slice(1)}
                </label>
                <input
                  type="text"
                  value={getThemeValue(`typography.fontWeight.${weight}`)}
                  onChange={(e) => updateTheme(`typography.fontWeight.${weight}`, e.target.value)}
                  style={{
                    width: '100%',
                    padding: defaultTheme.spacing['2'],
                    fontSize: defaultTheme.typography.fontSize.sm,
                    fontFamily: 'monospace',
                    color: defaultTheme.colors.text.primary,
                    background: defaultTheme.colors.background.primary,
                    border: `1px solid ${defaultTheme.colors.border.default}`,
                    borderRadius: defaultTheme.borderRadius.sm,
                    outline: 'none',
                  }}
                />
              </div>
            ))}
          </ThemeSection>

          {/* Spacing */}
          <ThemeSection title="Spacing Scale">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: defaultTheme.spacing['3'] }}>
              {['1', '2', '3', '4', '6', '8', '12', '16', '20', '24'].map((space) => (
                <div key={space} style={{ marginBottom: defaultTheme.spacing['3'] }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: defaultTheme.typography.fontSize.sm,
                      fontWeight: defaultTheme.typography.fontWeight.medium,
                      color: defaultTheme.colors.text.primary,
                      marginBottom: defaultTheme.spacing['2'],
                    }}
                  >
                    Spacing {space}
                  </label>
                  <input
                    type="text"
                    value={getThemeValue(`spacing.${space}`)}
                    onChange={(e) => updateTheme(`spacing.${space}`, e.target.value)}
                    style={{
                      width: '100%',
                      padding: defaultTheme.spacing['2'],
                      fontSize: defaultTheme.typography.fontSize.sm,
                      fontFamily: 'monospace',
                      color: defaultTheme.colors.text.primary,
                      background: defaultTheme.colors.background.primary,
                      border: `1px solid ${defaultTheme.colors.border.default}`,
                      borderRadius: defaultTheme.borderRadius.sm,
                      outline: 'none',
                    }}
                  />
                </div>
              ))}
            </div>
          </ThemeSection>

          {/* Border Radius */}
          <ThemeSection title="Border Radius">
            {['sm', 'md', 'lg', 'xl', 'full'].map((radius) => (
              <div key={radius} style={{ marginBottom: defaultTheme.spacing['3'] }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: defaultTheme.typography.fontSize.sm,
                    fontWeight: defaultTheme.typography.fontWeight.medium,
                    color: defaultTheme.colors.text.primary,
                    marginBottom: defaultTheme.spacing['2'],
                  }}
                >
                  {radius.toUpperCase()}
                </label>
                <input
                  type="text"
                  value={getThemeValue(`borderRadius.${radius}`)}
                  onChange={(e) => updateTheme(`borderRadius.${radius}`, e.target.value)}
                  style={{
                    width: '100%',
                    padding: defaultTheme.spacing['2'],
                    fontSize: defaultTheme.typography.fontSize.sm,
                    fontFamily: 'monospace',
                    color: defaultTheme.colors.text.primary,
                    background: defaultTheme.colors.background.primary,
                    border: `1px solid ${defaultTheme.colors.border.default}`,
                    borderRadius: defaultTheme.borderRadius.sm,
                    outline: 'none',
                  }}
                />
              </div>
            ))}
          </ThemeSection>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: defaultTheme.spacing['4'],
            borderTop: `1px solid ${defaultTheme.colors.border.default}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: defaultTheme.colors.gray[50],
          }}
        >
          <div
            style={{
              fontSize: defaultTheme.typography.fontSize.sm,
              color: defaultTheme.colors.text.secondary,
            }}
          >
            {hasChanges && (
              <span style={{ color: defaultTheme.colors.status.warning }}>● Unsaved changes</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: defaultTheme.spacing['2'] }}>
            <button
              onClick={() => {
                if (!hasChanges || confirm('Discard changes and close?')) {
                  onClose();
                }
              }}
              style={{
                padding: `${defaultTheme.spacing['2']} ${defaultTheme.spacing['4']}`,
                background: defaultTheme.colors.background.secondary,
                border: `1px solid ${defaultTheme.colors.border.default}`,
                borderRadius: defaultTheme.borderRadius.md,
                cursor: 'pointer',
                fontSize: defaultTheme.typography.fontSize.sm,
                color: defaultTheme.colors.text.primary,
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleApply}
              style={{
                padding: `${defaultTheme.spacing['2']} ${defaultTheme.spacing['4']}`,
                background: defaultTheme.colors.primary[600],
                border: 'none',
                borderRadius: defaultTheme.borderRadius.md,
                cursor: 'pointer',
                fontSize: defaultTheme.typography.fontSize.sm,
                fontWeight: defaultTheme.typography.fontWeight.medium,
                color: defaultTheme.colors.background.primary,
                display: 'flex',
                alignItems: 'center',
                gap: defaultTheme.spacing['2'],
              }}
            >
              <Check size={16} />
              Apply Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ThemeCustomizer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
