/**
 * Visual Controls for Settings Panel
 * Collection of visual input components for intuitive setting adjustments
 * Includes color pickers, sliders, spacing controls, and more
 */

import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../config/theme';
import { ChevronDown, Palette, Type, Maximize2, CornerDownRight } from 'lucide-react';

/**
 * ColorPicker - Visual color selection with preset swatches
 */
export function ColorPicker({ value, onChange, label, presets = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value || '#000000');
  const pickerRef = useRef(null);

  // Default color presets from theme
  const defaultPresets = [
    { label: 'Primary', color: theme.colors.primary[500] },
    { label: 'Text Primary', color: theme.colors.text.primary },
    { label: 'Text Secondary', color: theme.colors.text.secondary },
    { label: 'Success', color: theme.colors.success[500] },
    { label: 'Warning', color: theme.colors.warning[500] },
    { label: 'Error', color: theme.colors.error[500] },
    { label: 'Background', color: theme.colors.background.primary },
    { label: 'Gray 100', color: theme.colors.neutral[100] },
    { label: 'Gray 300', color: theme.colors.neutral[300] },
    { label: 'Gray 500', color: theme.colors.neutral[500] },
    { label: 'Gray 700', color: theme.colors.neutral[700] },
    { label: 'Gray 900', color: theme.colors.neutral[900] },
  ];

  const colorPresets = presets.length > 0 ? presets : defaultPresets;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div style={{ marginBottom: theme.spacing['3'] }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing['2'],
          }}
        >
          {label}
        </label>
      )}

      <div style={{ position: 'relative' }} ref={pickerRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '100%',
            padding: theme.spacing['2'],
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing['2'],
            background: theme.colors.background.primary,
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius.md,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: theme.borderRadius.sm,
              background: value || '#000000',
              border: `1px solid ${theme.colors.border.default}`,
            }}
          />
          <span
            style={{
              flex: 1,
              textAlign: 'left',
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary,
              fontFamily: 'monospace',
            }}
          >
            {value || 'Select color'}
          </span>
          <ChevronDown size={16} color={theme.colors.text.secondary} />
        </button>

        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: theme.spacing['1'],
              background: theme.colors.background.primary,
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.md,
              boxShadow: theme.shadows.lg,
              padding: theme.spacing['3'],
              zIndex: 1000,
            }}
          >
            {/* Color presets */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: theme.spacing['2'],
                marginBottom: theme.spacing['3'],
              }}
            >
              {colorPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onChange(preset.color);
                    setIsOpen(false);
                  }}
                  title={preset.label}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: theme.borderRadius.sm,
                    background: preset.color,
                    border:
                      value === preset.color
                        ? `2px solid ${theme.colors.primary[500]}`
                        : `1px solid ${theme.colors.border.default}`,
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>

            {/* Custom color input */}
            <div
              style={{
                borderTop: `1px solid ${theme.colors.border.light}`,
                paddingTop: theme.spacing['3'],
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing['2'],
                }}
              >
                Custom Color
              </label>
              <div style={{ display: 'flex', gap: theme.spacing['2'] }}>
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  style={{
                    width: '48px',
                    height: '36px',
                    border: `1px solid ${theme.colors.border.default}`,
                    borderRadius: theme.borderRadius.sm,
                    cursor: 'pointer',
                  }}
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onChange(customColor);
                      setIsOpen(false);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: theme.spacing['2'],
                    fontSize: theme.typography.fontSize.sm,
                    fontFamily: 'monospace',
                    color: theme.colors.text.primary,
                    background: theme.colors.background.secondary,
                    border: `1px solid ${theme.colors.border.default}`,
                    borderRadius: theme.borderRadius.sm,
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => {
                    onChange(customColor);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: `${theme.spacing['2']} ${theme.spacing['3']}`,
                    background: theme.colors.primary[600],
                    color: theme.colors.background.primary,
                    border: 'none',
                    borderRadius: theme.borderRadius.sm,
                    fontSize: theme.typography.fontSize.sm,
                    cursor: 'pointer',
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ColorPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  presets: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      color: PropTypes.string,
    })
  ),
};

/**
 * RangeSlider - Visual slider for numeric values
 */
export function RangeSlider({ value, onChange, label, min = 0, max = 100, step = 1, unit = '' }) {
  return (
    <div style={{ marginBottom: theme.spacing['3'] }}>
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing['2'],
          }}
        >
          <label
            style={{
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.primary,
            }}
          >
            {label}
          </label>
          <span
            style={{
              fontSize: theme.typography.fontSize.sm,
              fontFamily: 'monospace',
              color: theme.colors.text.secondary,
            }}
          >
            {value}
            {unit}
          </span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing['2'] }}>
        <span
          style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
          }}
        >
          {min}
        </span>
        <input
          type="range"
          value={value || min}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          style={{
            flex: 1,
            height: '4px',
            borderRadius: '2px',
            outline: 'none',
            cursor: 'pointer',
          }}
        />
        <span
          style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
          }}
        >
          {max}
        </span>
      </div>
    </div>
  );
}

RangeSlider.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  unit: PropTypes.string,
};

/**
 * SpacingControl - Visual spacing editor with directional controls
 */
export function SpacingControl({ value, onChange, label }) {
  // Parse spacing value (could be single value or object with top/right/bottom/left)
  const [spacing, setSpacing] = useState(
    typeof value === 'object' ? value : { top: value || 0, right: value || 0, bottom: value || 0, left: value || 0 }
  );
  const [isLinked, setIsLinked] = useState(true);

  const handleChange = (side, val) => {
    const newSpacing = isLinked
      ? { top: val, right: val, bottom: val, left: val }
      : { ...spacing, [side]: val };
    setSpacing(newSpacing);
    onChange(isLinked ? val : newSpacing);
  };

  return (
    <div style={{ marginBottom: theme.spacing['3'] }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing['2'],
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: theme.spacing['2'],
          padding: theme.spacing['3'],
          background: theme.colors.neutral[50],
          borderRadius: theme.borderRadius.md,
        }}
      >
        {/* Top */}
        <div style={{ gridColumn: '1 / -1' }}>
          <input
            type="number"
            value={spacing.top}
            onChange={(e) => handleChange('top', Number(e.target.value))}
            placeholder="Top"
            style={{
              width: '100%',
              padding: theme.spacing['2'],
              fontSize: theme.typography.fontSize.sm,
              textAlign: 'center',
              color: theme.colors.text.primary,
              background: theme.colors.background.primary,
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.sm,
              outline: 'none',
            }}
          />
        </div>

        {/* Left */}
        <div>
          <input
            type="number"
            value={spacing.left}
            onChange={(e) => handleChange('left', Number(e.target.value))}
            placeholder="Left"
            style={{
              width: '100%',
              padding: theme.spacing['2'],
              fontSize: theme.typography.fontSize.sm,
              textAlign: 'center',
              color: theme.colors.text.primary,
              background: theme.colors.background.primary,
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.sm,
              outline: 'none',
            }}
          />
        </div>

        {/* Right */}
        <div>
          <input
            type="number"
            value={spacing.right}
            onChange={(e) => handleChange('right', Number(e.target.value))}
            placeholder="Right"
            style={{
              width: '100%',
              padding: theme.spacing['2'],
              fontSize: theme.typography.fontSize.sm,
              textAlign: 'center',
              color: theme.colors.text.primary,
              background: theme.colors.background.primary,
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.sm,
              outline: 'none',
            }}
          />
        </div>

        {/* Bottom */}
        <div style={{ gridColumn: '1 / -1' }}>
          <input
            type="number"
            value={spacing.bottom}
            onChange={(e) => handleChange('bottom', Number(e.target.value))}
            placeholder="Bottom"
            style={{
              width: '100%',
              padding: theme.spacing['2'],
              fontSize: theme.typography.fontSize.sm,
              textAlign: 'center',
              color: theme.colors.text.primary,
              background: theme.colors.background.primary,
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.sm,
              outline: 'none',
            }}
          />
        </div>

        {/* Link toggle */}
        <div style={{ gridColumn: '1 / -1' }}>
          <button
            onClick={() => setIsLinked(!isLinked)}
            style={{
              width: '100%',
              padding: theme.spacing['1'],
              fontSize: theme.typography.fontSize.xs,
              color: isLinked ? theme.colors.primary[600] : theme.colors.text.secondary,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {isLinked ? '🔗 Linked' : '🔓 Unlinked'}
          </button>
        </div>
      </div>
    </div>
  );
}

SpacingControl.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

/**
 * FontSizePicker - Visual font size selector with presets
 */
export function FontSizePicker({ value, onChange, label }) {
  const fontSizes = [
    { label: 'XS', value: theme.typography.fontSize.xs },
    { label: 'SM', value: theme.typography.fontSize.sm },
    { label: 'Base', value: theme.typography.fontSize.base },
    { label: 'LG', value: theme.typography.fontSize.lg },
    { label: 'XL', value: theme.typography.fontSize.xl },
    { label: '2XL', value: theme.typography.fontSize['2xl'] },
    { label: '3XL', value: theme.typography.fontSize['3xl'] },
  ];

  return (
    <div style={{ marginBottom: theme.spacing['3'] }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing['2'],
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: theme.spacing['2'],
        }}
      >
        {fontSizes.map((size) => (
          <button
            key={size.label}
            onClick={() => onChange(size.value)}
            style={{
              padding: theme.spacing['2'],
              background:
                value === size.value ? theme.colors.primary[100] : theme.colors.background.secondary,
              color: value === size.value ? theme.colors.primary[700] : theme.colors.text.primary,
              border:
                value === size.value
                  ? `2px solid ${theme.colors.primary[500]}`
                  : `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.sm,
              fontSize: theme.typography.fontSize.xs,
              fontWeight: theme.typography.fontWeight.medium,
              cursor: 'pointer',
            }}
          >
            {size.label}
          </button>
        ))}
      </div>

      {/* Custom size input */}
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Custom (e.g., 16px, 1.5rem)"
        style={{
          width: '100%',
          marginTop: theme.spacing['2'],
          padding: theme.spacing['2'],
          fontSize: theme.typography.fontSize.sm,
          fontFamily: 'monospace',
          color: theme.colors.text.primary,
          background: theme.colors.background.primary,
          border: `1px solid ${theme.colors.border.default}`,
          borderRadius: theme.borderRadius.sm,
          outline: 'none',
        }}
      />
    </div>
  );
}

FontSizePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

/**
 * BorderRadiusPicker - Visual border radius selector
 */
export function BorderRadiusPicker({ value, onChange, label }) {
  const radii = [
    { label: 'None', value: '0' },
    { label: 'SM', value: theme.borderRadius.sm },
    { label: 'MD', value: theme.borderRadius.md },
    { label: 'LG', value: theme.borderRadius.lg },
    { label: 'XL', value: theme.borderRadius.xl },
    { label: 'Full', value: theme.borderRadius.full },
  ];

  return (
    <div style={{ marginBottom: theme.spacing['3'] }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing['2'],
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: theme.spacing['2'],
        }}
      >
        {radii.map((radius) => (
          <button
            key={radius.label}
            onClick={() => onChange(radius.value)}
            style={{
              padding: theme.spacing['3'],
              background:
                value === radius.value ? theme.colors.primary[100] : theme.colors.background.secondary,
              color: value === radius.value ? theme.colors.primary[700] : theme.colors.text.primary,
              border:
                value === radius.value
                  ? `2px solid ${theme.colors.primary[500]}`
                  : `1px solid ${theme.colors.border.default}`,
              borderRadius: radius.value,
              fontSize: theme.typography.fontSize.xs,
              fontWeight: theme.typography.fontWeight.medium,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: theme.spacing['1'],
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                background: theme.colors.neutral[400],
                borderRadius: radius.value,
              }}
            />
            <span>{radius.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

BorderRadiusPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};
