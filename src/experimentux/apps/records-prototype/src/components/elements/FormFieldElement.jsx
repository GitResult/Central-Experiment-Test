import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * FormFieldElement
 *
 * Form input field with various types: text, textarea, select, checkbox, radio, etc.
 */
const FormFieldElement = ({ data, settings, onUpdate }) => {
  const [value, setValue] = useState(data.value || '');

  const handleChange = (newValue) => {
    setValue(newValue);
    onUpdate({ ...data, value: newValue });
  };

  const fieldType = data.fieldType || 'text';
  const label = data.label || 'Field Label';
  const placeholder = data.placeholder || '';
  const required = data.required || false;
  const options = data.options || [];

  const renderField = () => {
    switch (fieldType) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={settings.rows || 4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select an option...</option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value === true || value === 'true'}
              onChange={(e) => handleChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">{data.checkboxLabel || 'Checkbox'}</label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`radio-${index}`}
                  name={data.name || 'radio-group'}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleChange(e.target.value)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor={`radio-${index}`} className="ml-2 text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            min={data.min}
            max={data.max}
            step={data.step}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'email':
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'text':
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
    }
  };

  return (
    <div className="form-field-element mb-4">
      {fieldType !== 'checkbox' && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderField()}
      {data.helpText && (
        <p className="mt-1 text-sm text-gray-500">{data.helpText}</p>
      )}
    </div>
  );
};

FormFieldElement.propTypes = {
  data: PropTypes.shape({
    fieldType: PropTypes.oneOf(['text', 'textarea', 'select', 'checkbox', 'radio', 'number', 'email', 'date']),
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    required: PropTypes.bool,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
      })
    ),
    checkboxLabel: PropTypes.string,
    helpText: PropTypes.string,
    name: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number
  }),
  settings: PropTypes.shape({
    rows: PropTypes.number
  }),
  onUpdate: PropTypes.func.isRequired
};

FormFieldElement.defaultProps = {
  data: {
    fieldType: 'text',
    label: 'Field Label',
    value: '',
    required: false,
    options: []
  },
  settings: {
    rows: 4
  }
};

export default FormFieldElement;
