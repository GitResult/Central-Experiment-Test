/**
 * StyleEditor Component
 * Visual style editor for element styling with intuitive controls
 * Uses visual controls for colors, spacing, typography, and more
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../config/theme';
import {
  ColorPicker,
  RangeSlider,
  SpacingControl,
  FontSizePicker,
  BorderRadiusPicker,
} from './VisualControls';
import { ChevronDown, ChevronRight } from 'lucide-react';

/**
 * Collapsible section for organizing style controls
 */
function StyleSection({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        marginBottom: theme.spacing['4'],
        border: `1px solid ${theme.colors.border.light}`,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: theme.spacing['3'],
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing['2'],
          background: theme.colors.neutral[50],
          border: 'none',
          cursor: 'pointer',
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.text.primary,
        }}
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {title}
      </button>

      {isOpen && (
        <div
          style={{
            padding: theme.spacing['4'],
            background: theme.colors.background.primary,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

StyleSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
};

/**
 * StyleEditor Component
 */
export function StyleEditor({ styles = {}, onChange }) {
  const handleStyleChange = (property, value) => {
    onChange({
      ...styles,
      [property]: value,
    });
  };

  return (
    <div style={{ padding: theme.spacing['4'] }}>
      {/* Layout & Sizing */}
      <StyleSection title="Layout & Sizing">
        {/* Width */}
        <div style={{ marginBottom: theme.spacing['3'] }}>
          <label
            style={{
              display: 'block',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing['2'],
            }}
          >
            Width
          </label>
          <div style={{ display: 'flex', gap: theme.spacing['2'] }}>
            {['auto', '100%', '50%', 'fit-content'].map((preset) => (
              <button
                key={preset}
                onClick={() => handleStyleChange('width', preset)}
                style={{
                  flex: 1,
                  padding: theme.spacing['2'],
                  fontSize: theme.typography.fontSize.xs,
                  background:
                    styles.width === preset
                      ? theme.colors.primary[100]
                      : theme.colors.background.secondary,
                  color:
                    styles.width === preset ? theme.colors.primary[700] : theme.colors.text.primary,
                  border:
                    styles.width === preset
                      ? `2px solid ${theme.colors.primary[500]}`
                      : `1px solid ${theme.colors.border.default}`,
                  borderRadius: theme.borderRadius.sm,
                  cursor: 'pointer',
                }}
              >
                {preset}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={styles.width || ''}
            onChange={(e) => handleStyleChange('width', e.target.value)}
            placeholder="Custom (e.g., 200px, 10rem)"
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

        {/* Height */}
        <div style={{ marginBottom: theme.spacing['3'] }}>
          <label
            style={{
              display: 'block',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing['2'],
            }}
          >
            Height
          </label>
          <input
            type="text"
            value={styles.height || ''}
            onChange={(e) => handleStyleChange('height', e.target.value)}
            placeholder="auto, 100px, 10rem, etc."
            style={{
              width: '100%',
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

        {/* Display */}
        <div style={{ marginBottom: theme.spacing['3'] }}>
          <label
            style={{
              display: 'block',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing['2'],
            }}
          >
            Display
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: theme.spacing['2'] }}>
            {['block', 'inline', 'flex', 'grid', 'inline-block', 'none'].map((preset) => (
              <button
                key={preset}
                onClick={() => handleStyleChange('display', preset)}
                style={{
                  padding: theme.spacing['2'],
                  fontSize: theme.typography.fontSize.xs,
                  background:
                    styles.display === preset
                      ? theme.colors.primary[100]
                      : theme.colors.background.secondary,
                  color:
                    styles.display === preset ? theme.colors.primary[700] : theme.colors.text.primary,
                  border:
                    styles.display === preset
                      ? `2px solid ${theme.colors.primary[500]}`
                      : `1px solid ${theme.colors.border.default}`,
                  borderRadius: theme.borderRadius.sm,
                  cursor: 'pointer',
                }}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </StyleSection>

      {/* Spacing */}
      <StyleSection title="Spacing">
        <SpacingControl
          label="Padding"
          value={styles.padding}
          onChange={(value) => handleStyleChange('padding', value)}
        />
        <SpacingControl
          label="Margin"
          value={styles.margin}
          onChange={(value) => handleStyleChange('margin', value)}
        />
      </StyleSection>

      {/* Typography */}
      <StyleSection title="Typography">
        <FontSizePicker
          label="Font Size"
          value={styles.fontSize}
          onChange={(value) => handleStyleChange('fontSize', value)}
        />

        {/* Font Weight */}
        <div style={{ marginBottom: theme.spacing['3'] }}>
          <label
            style={{
              display: 'block',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing['2'],
            }}
          >
            Font Weight
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: theme.spacing['2'] }}>
            {[
              { label: 'Normal', value: theme.typography.fontWeight.normal },
              { label: 'Medium', value: theme.typography.fontWeight.medium },
              { label: 'Semibold', value: theme.typography.fontWeight.semibold },
              { label: 'Bold', value: theme.typography.fontWeight.bold },
            ].map((weight) => (
              <button
                key={weight.label}
                onClick={() => handleStyleChange('fontWeight', weight.value)}
                style={{
                  padding: theme.spacing['2'],
                  fontSize: theme.typography.fontSize.xs,
                  background:
                    styles.fontWeight === weight.value
                      ? theme.colors.primary[100]
                      : theme.colors.background.secondary,
                  color:
                    styles.fontWeight === weight.value
                      ? theme.colors.primary[700]
                      : theme.colors.text.primary,
                  border:
                    styles.fontWeight === weight.value
                      ? `2px solid ${theme.colors.primary[500]}`
                      : `1px solid ${theme.colors.border.default}`,
                  borderRadius: theme.borderRadius.sm,
                  cursor: 'pointer',
                }}
              >
                {weight.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Align */}
        <div style={{ marginBottom: theme.spacing['3'] }}>
          <label
            style={{
              display: 'block',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing['2'],
            }}
          >
            Text Align
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: theme.spacing['2'] }}>
            {['left', 'center', 'right', 'justify'].map((align) => (
              <button
                key={align}
                onClick={() => handleStyleChange('textAlign', align)}
                style={{
                  padding: theme.spacing['2'],
                  fontSize: theme.typography.fontSize.xs,
                  background:
                    styles.textAlign === align
                      ? theme.colors.primary[100]
                      : theme.colors.background.secondary,
                  color:
                    styles.textAlign === align ? theme.colors.primary[700] : theme.colors.text.primary,
                  border:
                    styles.textAlign === align
                      ? `2px solid ${theme.colors.primary[500]}`
                      : `1px solid ${theme.colors.border.default}`,
                  borderRadius: theme.borderRadius.sm,
                  cursor: 'pointer',
                }}
              >
                {align}
              </button>
            ))}
          </div>
        </div>

        {/* Line Height */}
        <RangeSlider
          label="Line Height"
          value={parseFloat(styles.lineHeight) || 1.5}
          onChange={(value) => handleStyleChange('lineHeight', value.toString())}
          min={1}
          max={3}
          step={0.1}
        />
      </StyleSection>

      {/* Colors */}
      <StyleSection title="Colors">
        <ColorPicker
          label="Text Color"
          value={styles.color}
          onChange={(value) => handleStyleChange('color', value)}
        />
        <ColorPicker
          label="Background Color"
          value={styles.backgroundColor}
          onChange={(value) => handleStyleChange('backgroundColor', value)}
        />
      </StyleSection>

      {/* Borders */}
      <StyleSection title="Borders & Shadows">
        <BorderRadiusPicker
          label="Border Radius"
          value={styles.borderRadius}
          onChange={(value) => handleStyleChange('borderRadius', value)}
        />

        {/* Border Width */}
        <RangeSlider
          label="Border Width"
          value={parseInt(styles.borderWidth) || 0}
          onChange={(value) => handleStyleChange('borderWidth', `${value}px`)}
          min={0}
          max={10}
          step={1}
          unit="px"
        />

        {/* Border Color */}
        <ColorPicker
          label="Border Color"
          value={styles.borderColor}
          onChange={(value) => handleStyleChange('borderColor', value)}
        />

        {/* Border Style */}
        <div style={{ marginBottom: theme.spacing['3'] }}>
          <label
            style={{
              display: 'block',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing['2'],
            }}
          >
            Border Style
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: theme.spacing['2'] }}>
            {['solid', 'dashed', 'dotted', 'double', 'none'].map((style) => (
              <button
                key={style}
                onClick={() => handleStyleChange('borderStyle', style)}
                style={{
                  padding: theme.spacing['2'],
                  fontSize: theme.typography.fontSize.xs,
                  background:
                    styles.borderStyle === style
                      ? theme.colors.primary[100]
                      : theme.colors.background.secondary,
                  color:
                    styles.borderStyle === style ? theme.colors.primary[700] : theme.colors.text.primary,
                  border:
                    styles.borderStyle === style
                      ? `2px solid ${theme.colors.primary[500]}`
                      : `1px solid ${theme.colors.border.default}`,
                  borderRadius: theme.borderRadius.sm,
                  cursor: 'pointer',
                }}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Box Shadow */}
        <div style={{ marginBottom: theme.spacing['3'] }}>
          <label
            style={{
              display: 'block',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing['2'],
            }}
          >
            Box Shadow
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: theme.spacing['2'] }}>
            {[
              { label: 'None', value: 'none' },
              { label: 'SM', value: theme.shadows.sm },
              { label: 'MD', value: theme.shadows.md },
              { label: 'LG', value: theme.shadows.lg },
              { label: 'XL', value: theme.shadows.xl },
            ].map((shadow) => (
              <button
                key={shadow.label}
                onClick={() => handleStyleChange('boxShadow', shadow.value)}
                style={{
                  padding: theme.spacing['3'],
                  fontSize: theme.typography.fontSize.xs,
                  background:
                    styles.boxShadow === shadow.value
                      ? theme.colors.primary[100]
                      : theme.colors.background.secondary,
                  color:
                    styles.boxShadow === shadow.value
                      ? theme.colors.primary[700]
                      : theme.colors.text.primary,
                  border:
                    styles.boxShadow === shadow.value
                      ? `2px solid ${theme.colors.primary[500]}`
                      : `1px solid ${theme.colors.border.default}`,
                  borderRadius: theme.borderRadius.sm,
                  cursor: 'pointer',
                  boxShadow: shadow.value !== 'none' ? shadow.value : undefined,
                }}
              >
                {shadow.label}
              </button>
            ))}
          </div>
        </div>
      </StyleSection>

      {/* Effects */}
      <StyleSection title="Effects" defaultOpen={false}>
        {/* Opacity */}
        <RangeSlider
          label="Opacity"
          value={parseFloat(styles.opacity) || 1}
          onChange={(value) => handleStyleChange('opacity', value.toString())}
          min={0}
          max={1}
          step={0.1}
        />

        {/* Transform Scale */}
        <RangeSlider
          label="Scale"
          value={parseFloat(styles.transform?.match(/scale\(([\d.]+)\)/)?.[1]) || 1}
          onChange={(value) => handleStyleChange('transform', `scale(${value})`)}
          min={0.5}
          max={2}
          step={0.1}
        />
      </StyleSection>
    </div>
  );
}

StyleEditor.propTypes = {
  styles: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};
