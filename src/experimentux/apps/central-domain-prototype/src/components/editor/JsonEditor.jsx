/**
 * JsonEditor Component
 * Advanced JSON editor for directly editing page structure
 * Features syntax highlighting, validation, and error detection
 */

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useEditorStore } from '../../store/editorStore';
import { validatePage } from '../../utils/elementValidation';
import { theme } from '../../config/theme';
import { Code, Check, AlertTriangle, X, Download, Upload } from 'lucide-react';

/**
 * JsonEditor Component
 */
export function JsonEditor({ isOpen, onClose }) {
  const currentPage = useEditorStore((state) => state.currentPage);
  const loadPage = useEditorStore((state) => state.loadPage);

  const [jsonText, setJsonText] = useState('');
  const [parseError, setParseError] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const textareaRef = useRef(null);

  // Initialize with current page JSON
  useEffect(() => {
    if (isOpen) {
      setJsonText(JSON.stringify(currentPage, null, 2));
      setHasChanges(false);
      setParseError(null);
      setValidationResult(null);
    }
  }, [isOpen, currentPage]);

  // Validate JSON as user types
  useEffect(() => {
    if (!jsonText) return;

    try {
      const parsed = JSON.parse(jsonText);
      setParseError(null);

      // Validate the page structure
      const result = validatePage(parsed);
      setValidationResult(result);
    } catch (error) {
      setParseError(error.message);
      setValidationResult(null);
    }
  }, [jsonText]);

  // Handle text change
  const handleChange = (e) => {
    setJsonText(e.target.value);
    setHasChanges(true);
  };

  // Apply changes
  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const result = validatePage(parsed);

      if (result.isValid || confirm('Page has validation warnings. Apply anyway?')) {
        loadPage(parsed);
        setHasChanges(false);
        onClose();
      }
    } catch (error) {
      alert(`Cannot apply changes: ${error.message}`);
    }
  };

  // Format JSON
  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
    } catch (error) {
      // Keep current text if parsing fails
    }
  };

  // Download JSON
  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentPage.name || 'page'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Upload JSON
  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setJsonText(event.target.result);
          setHasChanges(true);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Reset to current page
  const handleReset = () => {
    if (hasChanges && !confirm('Discard changes and reset to current page?')) {
      return;
    }
    setJsonText(JSON.stringify(currentPage, null, 2));
    setHasChanges(false);
    setParseError(null);
    setValidationResult(null);
  };

  if (!isOpen) return null;

  const hasErrors = parseError || (validationResult && !validationResult.isValid);
  const hasWarnings = validationResult && validationResult.warnings.length > 0;

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
          maxWidth: '1200px',
          background: theme.colors.background.primary,
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.shadows.xl,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: theme.spacing['4'],
            borderBottom: `1px solid ${theme.colors.border.default}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: theme.colors.neutral[50],
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing['3'] }}>
            <Code size={24} color={theme.colors.primary[600]} />
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.primary,
                }}
              >
                JSON Editor
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                }}
              >
                Edit page structure as JSON
              </p>
            </div>
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
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer',
              color: theme.colors.text.secondary,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div
          style={{
            padding: theme.spacing['3'],
            borderBottom: `1px solid ${theme.colors.border.default}`,
            display: 'flex',
            gap: theme.spacing['2'],
          }}
        >
          <button
            onClick={handleFormat}
            disabled={!!parseError}
            style={{
              padding: `${theme.spacing['2']} ${theme.spacing['3']}`,
              background: theme.colors.background.secondary,
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.md,
              cursor: parseError ? 'not-allowed' : 'pointer',
              fontSize: theme.typography.fontSize.sm,
              color: parseError ? theme.colors.text.disabled : theme.colors.text.primary,
              opacity: parseError ? 0.5 : 1,
            }}
          >
            Format
          </button>

          <button
            onClick={handleReset}
            style={{
              padding: `${theme.spacing['2']} ${theme.spacing['3']}`,
              background: theme.colors.background.secondary,
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary,
            }}
          >
            Reset
          </button>

          <div style={{ flex: 1 }} />

          <button
            onClick={handleUpload}
            style={{
              padding: `${theme.spacing['2']} ${theme.spacing['3']}`,
              background: theme.colors.background.secondary,
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing['2'],
            }}
          >
            <Upload size={16} />
            Import
          </button>

          <button
            onClick={handleDownload}
            style={{
              padding: `${theme.spacing['2']} ${theme.spacing['3']}`,
              background: theme.colors.background.secondary,
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing['2'],
            }}
          >
            <Download size={16} />
            Export
          </button>
        </div>

        {/* Editor */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Text area */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <textarea
              ref={textareaRef}
              value={jsonText}
              onChange={handleChange}
              spellCheck={false}
              style={{
                flex: 1,
                padding: theme.spacing['4'],
                fontFamily: 'monospace',
                fontSize: theme.typography.fontSize.sm,
                lineHeight: '1.6',
                color: theme.colors.text.primary,
                background: theme.colors.background.primary,
                border: 'none',
                outline: 'none',
                resize: 'none',
                whiteSpace: 'pre',
                overflowWrap: 'normal',
                overflowX: 'auto',
              }}
            />
          </div>

          {/* Validation panel */}
          {(parseError || validationResult) && (
            <div
              style={{
                width: '400px',
                borderLeft: `1px solid ${theme.colors.border.default}`,
                background: theme.colors.neutral[50],
                overflow: 'auto',
                padding: theme.spacing['4'],
              }}
            >
              {/* Parse error */}
              {parseError && (
                <div
                  style={{
                    padding: theme.spacing['3'],
                    background: `${theme.colors.error[500]}10`,
                    borderLeft: `4px solid ${theme.colors.error[500]}`,
                    borderRadius: theme.borderRadius.md,
                    marginBottom: theme.spacing['4'],
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing['2'],
                      marginBottom: theme.spacing['2'],
                    }}
                  >
                    <AlertTriangle size={18} color={theme.colors.error[500]} />
                    <span
                      style={{
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.semibold,
                        color: theme.colors.error[500],
                      }}
                    >
                      Syntax Error
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.primary,
                      fontFamily: 'monospace',
                    }}
                  >
                    {parseError}
                  </div>
                </div>
              )}

              {/* Validation errors */}
              {validationResult && validationResult.errors.length > 0 && (
                <div
                  style={{
                    marginBottom: theme.spacing['4'],
                  }}
                >
                  <div
                    style={{
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.error[500],
                      marginBottom: theme.spacing['2'],
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing['2'],
                    }}
                  >
                    <AlertTriangle size={18} />
                    Validation Errors ({validationResult.errors.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing['2'] }}>
                    {validationResult.errors.map((error, index) => (
                      <div
                        key={index}
                        style={{
                          padding: theme.spacing['2'],
                          background: theme.colors.background.primary,
                          border: `1px solid ${theme.colors.error[500]}`,
                          borderRadius: theme.borderRadius.sm,
                          fontSize: theme.typography.fontSize.xs,
                          color: theme.colors.text.primary,
                        }}
                      >
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Validation warnings */}
              {validationResult && validationResult.warnings.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.warning[500],
                      marginBottom: theme.spacing['2'],
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing['2'],
                    }}
                  >
                    <AlertTriangle size={18} />
                    Warnings ({validationResult.warnings.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing['2'] }}>
                    {validationResult.warnings.map((warning, index) => (
                      <div
                        key={index}
                        style={{
                          padding: theme.spacing['2'],
                          background: theme.colors.background.primary,
                          border: `1px solid ${theme.colors.warning[500]}`,
                          borderRadius: theme.borderRadius.sm,
                          fontSize: theme.typography.fontSize.xs,
                          color: theme.colors.text.primary,
                        }}
                      >
                        {warning}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success state */}
              {validationResult && validationResult.isValid && validationResult.warnings.length === 0 && (
                <div
                  style={{
                    padding: theme.spacing['3'],
                    background: `${theme.colors.success[500]}10`,
                    borderLeft: `4px solid ${theme.colors.success[500]}`,
                    borderRadius: theme.borderRadius.md,
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing['2'],
                  }}
                >
                  <Check size={18} color={theme.colors.success[500]} />
                  <span
                    style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.success[500],
                      fontWeight: theme.typography.fontWeight.medium,
                    }}
                  >
                    Valid JSON structure
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: theme.spacing['4'],
            borderTop: `1px solid ${theme.colors.border.default}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: theme.colors.neutral[50],
          }}
        >
          <div
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
            }}
          >
            {hasChanges && (
              <span style={{ color: theme.colors.warning[500] }}>● Unsaved changes</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: theme.spacing['2'] }}>
            <button
              onClick={() => {
                if (!hasChanges || confirm('Discard changes and close?')) {
                  onClose();
                }
              }}
              style={{
                padding: `${theme.spacing['2']} ${theme.spacing['4']}`,
                background: theme.colors.background.secondary,
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.primary,
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleApply}
              disabled={!!parseError}
              style={{
                padding: `${theme.spacing['2']} ${theme.spacing['4']}`,
                background: parseError
                  ? theme.colors.neutral[300]
                  : hasErrors
                  ? theme.colors.warning[500]
                  : theme.colors.primary[600],
                border: 'none',
                borderRadius: theme.borderRadius.md,
                cursor: parseError ? 'not-allowed' : 'pointer',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.background.primary,
                opacity: parseError ? 0.5 : 1,
              }}
            >
              {hasErrors ? 'Apply Anyway' : 'Apply Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

JsonEditor.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
