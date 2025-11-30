/**
 * FieldElement Component
 * Renders field elements with full schema support (14 field types, 6 input types, 5 setting groups)
 */

import { useTheme } from '../../theme/ThemeProvider';
import { validateFieldElement } from '../../../schemas/fieldElementSchema';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

export function FieldElement({ data, settings, onChange }) {
  const { resolveToken, resolveAllTokens } = useTheme();
  const [value, setValue] = useState(data.value || '');
  const [errors, setErrors] = useState([]);

  // Resolve theme tokens in settings
  const resolvedSettings = resolveAllTokens(settings);

  // Extract field-specific settings
  const {
    fieldType = 'text',
    label = '',
    placeholder = '',
    required = false,
    inputType = 'dropdown',
    options = [],
    rows = 4,
  } = settings.field || {};

  // Extract base settings (Layout, Appearance, Typography)
  const {
    layout = {},
    appearance = {},
    typography = {},
    businessRules = {},
    data: dataSettings = {},
  } = resolvedSettings;

  // Validate on mount and when settings change
  useEffect(() => {
    const element = { type: 'field', data, settings };
    const validation = validateFieldElement(element);
    if (!validation.valid) {
      setErrors(validation.errors);
    }
  }, [data, settings]);

  // Handle value changes
  const handleChange = (newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange({ value: newValue });
    }
  };

  // Apply business rules (visibility)
  if (businessRules.visibility?.hidden) {
    return null;
  }

  // Container style with Layout + Appearance settings
  const containerStyle = {
    width: layout.width || '100%',
    marginTop: layout.spacing?.margin?.top || 0,
    marginBottom: layout.spacing?.margin?.bottom || resolveToken('{{theme.spacing.lg}}'),
    marginLeft: layout.spacing?.margin?.left || 0,
    marginRight: layout.spacing?.margin?.right || 0,
    paddingTop: layout.spacing?.padding?.top || 0,
    paddingBottom: layout.spacing?.padding?.bottom || 0,
    paddingLeft: layout.spacing?.padding?.left || 0,
    paddingRight: layout.spacing?.padding?.right || 0,
    background: appearance.background || 'transparent',
    borderRadius: appearance.borderRadius || 0,
    opacity: appearance.opacity !== undefined ? appearance.opacity : 1,
  };

  // Label style with Typography settings
  const labelStyle = {
    display: 'block',
    marginBottom: resolveToken('{{theme.spacing.xs}}'),
    fontSize: typography.fontSize || resolveToken('{{theme.typography.fontSize.sm}}'),
    fontWeight: typography.fontWeight || resolveToken('{{theme.typography.fontWeight.medium}}'),
    color: typography.color || resolveToken('{{theme.colors.text.primary}}'),
  };

  // Input style with Appearance + Typography
  const inputStyle = {
    width: '100%',
    padding: `${resolveToken('{{theme.spacing.sm}}')} ${resolveToken('{{theme.spacing.md}}')}`,
    fontSize: typography.fontSize || resolveToken('{{theme.typography.fontSize.base}}'),
    color: typography.color || resolveToken('{{theme.colors.text.primary}}'),
    backgroundColor: appearance.background || resolveToken('{{theme.colors.background.primary}}'),
    border: appearance.border?.width
      ? `${appearance.border.width} ${appearance.border.style} ${appearance.border.color}`
      : `1px solid ${resolveToken('{{theme.colors.border.default}}')}`,
    borderRadius: appearance.borderRadius || resolveToken('{{theme.borderRadius.md}}'),
    outline: 'none',
    transition: 'border-color 0.2s',
    boxShadow: appearance.shadow || 'none',
  };

  // Render different field types
  const renderFieldInput = () => {
    switch (fieldType) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        return (
          <input
            type={fieldType}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            style={inputStyle}
          />
        );

      case 'number':
      case 'range':
        return (
          <input
            type={fieldType}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            style={inputStyle}
          />
        );

      case 'date':
      case 'time':
        return (
          <input
            type={fieldType}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            required={required}
            style={inputStyle}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={rows}
            style={{
              ...inputStyle,
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
        );

      case 'selectSingle':
        return renderSelectInput(false);

      case 'selectMulti':
        return renderSelectInput(true);

      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value === true || value === 'true'}
            onChange={(e) => handleChange(e.target.checked)}
            required={required}
            style={{ margin: resolveToken('{{theme.spacing.sm}}') }}
          />
        );

      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => handleChange(e.target.files[0]?.name || '')}
            required={required}
            style={inputStyle}
          />
        );

      case 'color':
        return (
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => handleChange(e.target.value)}
            required={required}
            style={{ ...inputStyle, height: '40px' }}
          />
        );

      default:
        return <div style={{ color: resolveToken('{{theme.colors.error.500}}') }}>Unsupported field type: {fieldType}</div>;
    }
  };

  // Render select with different input types (dropdown, radio, pill, etc.)
  const renderSelectInput = (multi) => {
    switch (inputType) {
      case 'dropdown':
        return (
          <select
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            required={required}
            multiple={multi}
            style={inputStyle}
          >
            <option value="">{placeholder || 'Select an option'}</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt.value || opt}>
                {opt.label || opt}
              </option>
            ))}
          </select>
        );

      case 'radio':
      case 'pill':
      case 'button-group':
        return (
          <div style={{ display: 'flex', gap: resolveToken('{{theme.spacing.sm}}'), flexWrap: 'wrap' }}>
            {options.map((opt, idx) => (
              <label
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: inputType === 'pill' || inputType === 'button-group'
                    ? `${resolveToken('{{theme.spacing.xs}}')} ${resolveToken('{{theme.spacing.md}}')}`
                    : resolveToken('{{theme.spacing.xs}}'),
                  background: value === (opt.value || opt)
                    ? resolveToken('{{theme.colors.primary.100}}')
                    : resolveToken('{{theme.colors.background.secondary}}'),
                  border: `1px solid ${value === (opt.value || opt)
                    ? resolveToken('{{theme.colors.primary.500}}')
                    : resolveToken('{{theme.colors.border.default}}')}`,
                  borderRadius: inputType === 'pill'
                    ? resolveToken('{{theme.borderRadius.full}}')
                    : resolveToken('{{theme.borderRadius.md}}'),
                  cursor: 'pointer',
                }}
              >
                {inputType !== 'button-group' && (
                  <input
                    type="radio"
                    name={label}
                    value={opt.value || opt}
                    checked={value === (opt.value || opt)}
                    onChange={(e) => handleChange(e.target.value)}
                    style={{ marginRight: resolveToken('{{theme.spacing.xs}}') }}
                  />
                )}
                <span>{opt.label || opt}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox-group':
      case 'toggle':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: resolveToken('{{theme.spacing.sm}}') }}>
            {options.map((opt, idx) => (
              <label key={idx} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  value={opt.value || opt}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, e.target.value]
                      : currentValues.filter(v => v !== e.target.value);
                    handleChange(newValues);
                  }}
                  style={{ marginRight: resolveToken('{{theme.spacing.xs}}') }}
                />
                <span>{opt.label || opt}</span>
              </label>
            ))}
          </div>
        );

      default:
        return renderSelectInput(multi);
    }
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: resolveToken('{{theme.colors.error.500}}') }}> *</span>}
        </label>
      )}
      {renderFieldInput()}
      {errors.length > 0 && (
        <div style={{ color: resolveToken('{{theme.colors.error.500}}'), fontSize: resolveToken('{{theme.typography.fontSize.sm}}'), marginTop: resolveToken('{{theme.spacing.xs}}') }}>
          {errors.join(', ')}
        </div>
      )}
    </div>
  );
}

FieldElement.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.any,
  }).isRequired,
  settings: PropTypes.shape({
    field: PropTypes.object,
    layout: PropTypes.object,
    appearance: PropTypes.object,
    typography: PropTypes.object,
    businessRules: PropTypes.object,
    data: PropTypes.object,
  }).isRequired,
  onChange: PropTypes.func,
};
