/**
 * InputCollector
 * Slideout panel for collecting user inputs before running automation
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { X, Play } from 'lucide-react';
import { theme } from '../../../config/theme';

export function InputCollector({ isOpen, onClose, inputsRequired, onStart }) {
  const [inputValues, setInputValues] = useState({});

  if (!isOpen) return null;

  const handleInputChange = (key, value) => {
    setInputValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleStart = () => {
    onStart?.(inputValues);
    onClose?.();
  };

  const allRequiredFilled = Object.keys(inputsRequired || {}).every(
    key => inputValues[key] !== undefined && inputValues[key] !== ''
  );

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme.colors.background.overlay,
          zIndex: theme.zIndex.modal + 10
        }}
      />

      {/* Slideout Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '400px',
          maxWidth: '90vw',
          backgroundColor: theme.colors.background.elevated,
          boxShadow: theme.shadows['2xl'],
          zIndex: theme.zIndex.modal + 11,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: theme.spacing[6],
            borderBottom: `1px solid ${theme.colors.border.default}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h2
              style={{
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                margin: 0,
                marginBottom: theme.spacing[1]
              }}
            >
              Setup Interactive Guide
            </h2>
            <p
              style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
                margin: 0
              }}
            >
              Provide some basic information to personalize the walkthrough
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: theme.spacing[2]
            }}
          >
            <X size={24} color={theme.colors.text.secondary} />
          </button>
        </div>

        {/* Form */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: theme.spacing[6]
          }}
        >
          {Object.entries(inputsRequired || {}).map(([key, config]) => (
            <div key={key} style={{ marginBottom: theme.spacing[4] }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: theme.spacing[2],
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.text.primary
                }}
              >
                {config.label}
              </label>

              {config.type === 'enum' ? (
                <select
                  value={inputValues[key] || ''}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  style={{
                    width: '100%',
                    padding: theme.spacing[3],
                    border: `1px solid ${theme.colors.border.default}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.sm,
                    fontFamily: theme.typography.fontFamily.sans,
                    color: theme.colors.text.primary,
                    backgroundColor: theme.colors.background.primary
                  }}
                >
                  <option value="">Select...</option>
                  {config.values?.map(value => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              ) : config.type === 'number' ? (
                <input
                  type="number"
                  value={inputValues[key] || ''}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  placeholder={config.placeholder || `Enter ${config.label.toLowerCase()}`}
                  style={{
                    width: '100%',
                    padding: theme.spacing[3],
                    border: `1px solid ${theme.colors.border.default}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.sm,
                    fontFamily: theme.typography.fontFamily.sans,
                    color: theme.colors.text.primary
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={inputValues[key] || ''}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  placeholder={config.placeholder || `Enter ${config.label.toLowerCase()}`}
                  style={{
                    width: '100%',
                    padding: theme.spacing[3],
                    border: `1px solid ${theme.colors.border.default}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.sm,
                    fontFamily: theme.typography.fontFamily.sans,
                    color: theme.colors.text.primary
                  }}
                />
              )}
            </div>
          ))}

          {Object.keys(inputsRequired || {}).length === 0 && (
            <p
              style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
                textAlign: 'center',
                padding: theme.spacing[6]
              }}
            >
              No inputs required. Click "Start Guide" to begin.
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: theme.spacing[6],
            borderTop: `1px solid ${theme.colors.border.default}`,
            display: 'flex',
            gap: theme.spacing[3],
            justifyContent: 'flex-end'
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
              backgroundColor: 'transparent',
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            disabled={!allRequiredFilled && Object.keys(inputsRequired || {}).length > 0}
            style={{
              padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
              backgroundColor: allRequiredFilled || Object.keys(inputsRequired || {}).length === 0
                ? theme.colors.primary[500]
                : theme.colors.neutral[300],
              border: 'none',
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.inverse,
              cursor: allRequiredFilled || Object.keys(inputsRequired || {}).length === 0
                ? 'pointer'
                : 'not-allowed',
              fontWeight: theme.typography.fontWeight.medium,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[2]
            }}
          >
            <Play size={16} />
            Start Guide
          </button>
        </div>

        <style>{`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </>
  );
}

InputCollector.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  inputsRequired: PropTypes.objectOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['string', 'number', 'enum']).isRequired,
      label: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      values: PropTypes.arrayOf(PropTypes.string) // For enum type
    })
  ),
  onStart: PropTypes.func
};

InputCollector.defaultProps = {
  inputsRequired: {},
  onStart: () => {}
};

export default InputCollector;
