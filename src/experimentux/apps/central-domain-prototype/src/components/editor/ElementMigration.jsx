/**
 * ElementMigration Component
 * UI for migrating elements from 3-type to 4-type system
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileJson, ArrowRight, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { theme } from '../../config/theme';

export function ElementMigration({ isOpen, onClose }) {
  const [url, setUrl] = useState('');
  const [migrationResult, setMigrationResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Migration functions (client-side implementation)
  const migrateElement = (element, stats = { migrated: 0, warnings: [], errors: [] }) => {
    if (!element || typeof element !== 'object') {
      stats.errors.push('Invalid element');
      return element;
    }

    const oldType = element.type;
    let migrated = { ...element };

    switch (oldType) {
      case 'display':
        migrated = migrateDisplayElement(element);
        stats.migrated++;
        break;
      case 'input':
        migrated = migrateInputElement(element);
        stats.migrated++;
        break;
      case 'structure':
        migrated = migrateStructureElement(element, stats);
        stats.migrated++;
        break;
      case 'field':
      case 'record':
      case 'markup':
        stats.warnings.push(`Element already using new type: ${oldType}`);
        break;
      default:
        stats.errors.push(`Unknown element type: ${oldType}`);
        return element;
    }

    return migrated;
  };

  const migrateDisplayElement = (element) => {
    const migrated = { ...element };
    const hasDataBinding = element.data?.binding || element.settings?.dataBinding || element.data?.source;

    if (hasDataBinding) {
      migrated.type = 'record';
      migrated.settings = {
        ...element.settings,
        record: {
          recordType: element.settings?.displayType || 'display',
          fields: element.settings?.fields || [],
          ...(element.settings?.record || {}),
        },
      };
      delete migrated.settings.displayType;
    } else {
      migrated.type = 'markup';
      const markupType = inferMarkupType(element);
      migrated.settings = {
        ...element.settings,
        markup: {
          markupType,
          ...(element.settings?.markup || {}),
        },
      };
    }

    return migrated;
  };

  const migrateInputElement = (element) => {
    const migrated = { ...element };
    migrated.type = 'field';
    migrated.settings = {
      ...element.settings,
      field: {
        fieldType: element.settings?.inputType || 'text',
        label: element.settings?.label || '',
        placeholder: element.settings?.placeholder || '',
        required: element.settings?.required || false,
        ...(element.settings?.field || {}),
      },
    };
    delete migrated.settings.inputType;
    return migrated;
  };

  const migrateStructureElement = (element, stats) => {
    const migrated = { ...element };
    migrated.settings = migrated.settings || {};
    migrated.settings.structure = migrated.settings.structure || {
      structureType: element.settings?.containerType || 'div',
    };

    const containerTypeMap = {
      container: 'div',
      section: 'div',
      hero: 'card',
      nav: 'stack',
      header: 'div',
      footer: 'div',
    };

    const oldContainerType = element.settings?.containerType;
    if (oldContainerType && containerTypeMap[oldContainerType]) {
      migrated.settings.structure.structureType = containerTypeMap[oldContainerType];
    }

    delete migrated.settings.containerType;

    if (migrated.elements && Array.isArray(migrated.elements)) {
      migrated.elements = migrated.elements.map((child) => migrateElement(child, stats));
    }

    return migrated;
  };

  const inferMarkupType = (element) => {
    const settings = element.settings || {};
    if (settings.isButton || settings.action) return 'button';
    if (settings.isLink || settings.href) return 'link';
    if (settings.src) return 'image';
    if (settings.iconName) return 'icon';
    if (settings.isDivider) return 'divider';
    if (settings.level || settings.heading) return 'heading';
    return 'paragraph';
  };

  const migratePage = (pageData) => {
    const stats = { migrated: 0, warnings: [], errors: [] };
    const migrated = { ...pageData };

    if (migrated.zones && Array.isArray(migrated.zones)) {
      migrated.zones = migrated.zones.map((zone) => {
        const migratedZone = { ...zone };
        if (migratedZone.rows && Array.isArray(migratedZone.rows)) {
          migratedZone.rows = migratedZone.rows.map((row) => {
            const migratedRow = { ...row };
            if (migratedRow.columns && Array.isArray(migratedRow.columns)) {
              migratedRow.columns = migratedRow.columns.map((column) => {
                const migratedColumn = { ...column };
                if (migratedColumn.elements && Array.isArray(migratedColumn.elements)) {
                  migratedColumn.elements = migratedColumn.elements.map((element) =>
                    migrateElement(element, stats)
                  );
                }
                return migratedColumn;
              });
            }
            return migratedRow;
          });
        }
        return migratedZone;
      });
    }

    return { migrated, stats };
  };

  const convertHtmlToPageData = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const elements = [];

    // Extract main content elements
    const body = doc.body;

    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text) {
          return {
            type: 'markup',
            data: { content: text },
            settings: { markup: { markupType: 'paragraph' } }
          };
        }
        return null;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return null;

      const tagName = node.tagName.toLowerCase();

      // Headings
      if (/^h[1-6]$/.test(tagName)) {
        return {
          type: 'markup',
          data: { content: node.textContent.trim() },
          settings: {
            markup: {
              markupType: 'heading',
              level: parseInt(tagName[1])
            }
          }
        };
      }

      // Paragraphs
      if (tagName === 'p') {
        return {
          type: 'markup',
          data: { content: node.textContent.trim() },
          settings: { markup: { markupType: 'paragraph' } }
        };
      }

      // Images
      if (tagName === 'img') {
        return {
          type: 'markup',
          data: {
            content: node.alt || '',
            src: node.src
          },
          settings: { markup: { markupType: 'image' } }
        };
      }

      // Links/Buttons
      if (tagName === 'a' || tagName === 'button') {
        return {
          type: 'markup',
          data: {
            content: node.textContent.trim(),
            href: node.href || ''
          },
          settings: { markup: { markupType: 'button' } }
        };
      }

      // Input fields
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        return {
          type: 'field',
          settings: {
            field: {
              fieldType: node.type || 'text',
              label: node.labels?.[0]?.textContent || '',
              placeholder: node.placeholder || ''
            }
          }
        };
      }

      // Containers (div, section, article, etc.)
      if (['div', 'section', 'article', 'header', 'footer', 'nav'].includes(tagName)) {
        const childElements = Array.from(node.childNodes)
          .map(processNode)
          .filter(Boolean);

        if (childElements.length > 0) {
          return {
            type: 'structure',
            settings: {
              structure: {
                structureType: tagName === 'nav' ? 'nav' : 'card'
              }
            },
            elements: childElements
          };
        }
      }

      return null;
    };

    // Process all body children
    Array.from(body.childNodes).forEach(node => {
      const element = processNode(node);
      if (element) elements.push(element);
    });

    // Create page data structure
    return {
      id: `imported-${Date.now()}`,
      name: doc.title || 'Imported Page',
      type: 'Imported',
      zones: [
        {
          id: 'main-content',
          maxWidth: '2xl',
          padding: 6,
          rows: [
            {
              id: 'main-row',
              gap: 4,
              columns: [
                {
                  width: 'full',
                  elements: elements
                }
              ]
            }
          ]
        }
      ]
    };
  };

  const handleMigrate = async () => {
    if (!url) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Fetch content from URL
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      let pageData;

      // Check if it's JSON or HTML
      if (contentType?.includes('application/json')) {
        // It's a JSON file - parse directly
        pageData = await response.json();
      } else {
        // It's HTML - convert to page data
        const html = await response.text();
        pageData = convertHtmlToPageData(html);
      }

      // Apply migration to convert old types to new types
      const { migrated, stats } = migratePage(pageData);

      setMigrationResult({
        original: pageData,
        migrated,
        stats,
      });
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to fetch from URL. Make sure the URL is correct and accessible.');
      } else if (err instanceof SyntaxError) {
        setError('Invalid JSON format in the response');
      } else {
        setError(`Migration failed: ${err.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!migrationResult) return;

    const blob = new Blob([JSON.stringify(migrationResult.migrated, null, 2)], {
      type: 'application/json',
    });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;

    // Generate filename from the original URL or page ID
    const filename = migrationResult.migrated.id
      ? `${migrationResult.migrated.id}.migrated.json`
      : 'migrated-page.json';

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="element-migration-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="element-migration-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed z-50"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '600px',
              backgroundColor: theme.colors.background.primary,
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.shadows['2xl'],
              border: `1px solid ${theme.colors.border.default}`,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: theme.spacing[6],
                borderBottom: `1px solid ${theme.colors.border.default}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3] }}>
                <FileJson size={24} color={theme.colors.primary[500]} />
                <h2
                  style={{
                    fontSize: theme.typography.fontSize.xl,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text.primary,
                  }}
                >
                  Import & Convert
                </h2>
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: theme.spacing[2],
                  borderRadius: theme.borderRadius.md,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: theme.colors.text.secondary,
                  transition: `all ${theme.transitions.fast}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.background.secondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: theme.spacing[6] }}>
              {/* Info Banner */}
              <div
                style={{
                  padding: theme.spacing[4],
                  backgroundColor: theme.colors.primary[50],
                  border: `1px solid ${theme.colors.primary[200]}`,
                  borderRadius: theme.borderRadius.md,
                  marginBottom: theme.spacing[6],
                  display: 'flex',
                  gap: theme.spacing[3],
                }}
              >
                <Info size={20} color={theme.colors.primary[500]} style={{ flexShrink: 0 }} />
                <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
                  <strong style={{ color: theme.colors.text.primary }}>Converts websites and JSON files to page builder format:</strong>
                  <div style={{ marginTop: theme.spacing[2] }}>
                    <div>• Enter any website URL to import HTML content</div>
                    <div>• Or provide a JSON file URL to migrate existing pages</div>
                    <div>• Automatically converts to the 4-type element system</div>
                  </div>
                </div>
              </div>

              {/* URL Input */}
              <div style={{ marginBottom: theme.spacing[6] }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.text.primary,
                    marginBottom: theme.spacing[2],
                  }}
                >
                  Website or File URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError(null);
                    setMigrationResult(null);
                  }}
                  placeholder="https://example.com or https://example.com/page.json"
                  style={{
                    width: '100%',
                    padding: theme.spacing[3],
                    border: `1px solid ${theme.colors.border.default}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.primary,
                    backgroundColor: theme.colors.background.primary,
                    fontFamily: theme.typography.fontFamily.mono,
                  }}
                />
                <div
                  style={{
                    marginTop: theme.spacing[2],
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.tertiary,
                  }}
                >
                  Enter any website URL or a direct link to a JSON file
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div
                  style={{
                    padding: theme.spacing[4],
                    backgroundColor: theme.colors.error[50],
                    border: `1px solid ${theme.colors.error[200]}`,
                    borderRadius: theme.borderRadius.md,
                    marginBottom: theme.spacing[6],
                    display: 'flex',
                    gap: theme.spacing[3],
                    alignItems: 'flex-start',
                  }}
                >
                  <AlertCircle size={20} color={theme.colors.error[500]} style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.error[700] }}>
                    {error}
                  </div>
                </div>
              )}

              {/* Migration Results */}
              {migrationResult && (
                <div
                  style={{
                    padding: theme.spacing[4],
                    backgroundColor: theme.colors.success[50],
                    border: `1px solid ${theme.colors.success[200]}`,
                    borderRadius: theme.borderRadius.md,
                    marginBottom: theme.spacing[6],
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2], marginBottom: theme.spacing[3] }}>
                    <CheckCircle size={20} color={theme.colors.success[500]} />
                    <strong style={{ fontSize: theme.typography.fontSize.base, color: theme.colors.success[700] }}>
                      Conversion Complete!
                    </strong>
                  </div>
                  <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
                    <div>✓ Page: {migrationResult.migrated.name}</div>
                    <div>✓ Elements converted: {migrationResult.stats.migrated}</div>
                    {migrationResult.stats.warnings.length > 0 && (
                      <div>⚠ Warnings: {migrationResult.stats.warnings.length}</div>
                    )}
                    {migrationResult.stats.errors.length > 0 && (
                      <div>✗ Errors: {migrationResult.stats.errors.length}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: theme.spacing[3], justifyContent: 'flex-end' }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                    borderRadius: theme.borderRadius.md,
                    border: `1px solid ${theme.colors.border.default}`,
                    backgroundColor: theme.colors.background.primary,
                    color: theme.colors.text.primary,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    cursor: 'pointer',
                    transition: `all ${theme.transitions.fast}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.background.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.background.primary;
                  }}
                >
                  Cancel
                </button>

                {migrationResult && (
                  <button
                    onClick={handleDownload}
                    style={{
                      padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                      borderRadius: theme.borderRadius.md,
                      border: 'none',
                      backgroundColor: theme.colors.success[500],
                      color: 'white',
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      cursor: 'pointer',
                      transition: `all ${theme.transitions.fast}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.success[600];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.success[500];
                    }}
                  >
                    Download Page JSON
                  </button>
                )}

                {!migrationResult && (
                  <button
                    onClick={handleMigrate}
                    disabled={!url || isProcessing}
                    style={{
                      padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                      borderRadius: theme.borderRadius.md,
                      border: 'none',
                      backgroundColor: url && !isProcessing ? theme.colors.primary[500] : theme.colors.neutral[300],
                      color: 'white',
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      cursor: url && !isProcessing ? 'pointer' : 'not-allowed',
                      transition: `all ${theme.transitions.fast}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing[2],
                    }}
                    onMouseEnter={(e) => {
                      if (url && !isProcessing) {
                        e.currentTarget.style.backgroundColor = theme.colors.primary[600];
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (url && !isProcessing) {
                        e.currentTarget.style.backgroundColor = theme.colors.primary[500];
                      }
                    }}
                  >
                    {isProcessing ? 'Converting...' : 'Convert'}
                    {!isProcessing && <ArrowRight size={16} />}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

ElementMigration.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
