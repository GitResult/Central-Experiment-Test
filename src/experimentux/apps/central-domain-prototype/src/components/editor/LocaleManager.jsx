/**
 * LocaleManager Component
 * Internationalization and localization management interface
 * Manage locales, translations, and multi-language content
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../config/theme';
import { Globe, Plus, Download, Upload, Trash2, Check, X, Edit2 } from 'lucide-react';

/**
 * Default locales
 */
const defaultLocales = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
];

/**
 * Sample translation structure
 */
const sampleTranslations = {
  'en-US': {
    'app.title': 'My Application',
    'app.welcome': 'Welcome to our application',
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'button.submit': 'Submit',
    'button.cancel': 'Cancel',
  },
  'es-ES': {
    'app.title': 'Mi Aplicación',
    'app.welcome': 'Bienvenido a nuestra aplicación',
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
    'button.submit': 'Enviar',
    'button.cancel': 'Cancelar',
  },
  'fr-FR': {
    'app.title': 'Mon Application',
    'app.welcome': 'Bienvenue dans notre application',
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'button.submit': 'Soumettre',
    'button.cancel': 'Annuler',
  },
};

/**
 * LocaleManager Component
 */
export function LocaleManager({ isOpen, onClose }) {
  const [activeLocales, setActiveLocales] = useState(['en-US', 'es-ES']);
  const [defaultLocale, setDefaultLocale] = useState('en-US');
  const [selectedLocale, setSelectedLocale] = useState('en-US');
  const [translations, setTranslations] = useState(sampleTranslations);
  const [editingKey, setEditingKey] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [newKey, setNewKey] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setHasChanges(false);
    }
  }, [isOpen]);

  // Add locale
  const handleAddLocale = (localeCode) => {
    if (!activeLocales.includes(localeCode)) {
      setActiveLocales([...activeLocales, localeCode]);
      setTranslations({
        ...translations,
        [localeCode]: {},
      });
      setHasChanges(true);
    }
  };

  // Remove locale
  const handleRemoveLocale = (localeCode) => {
    if (localeCode === defaultLocale) {
      alert('Cannot remove default locale');
      return;
    }
    if (confirm(`Remove locale ${localeCode}? All translations will be lost.`)) {
      setActiveLocales(activeLocales.filter((code) => code !== localeCode));
      const newTranslations = { ...translations };
      delete newTranslations[localeCode];
      setTranslations(newTranslations);
      if (selectedLocale === localeCode) {
        setSelectedLocale(defaultLocale);
      }
      setHasChanges(true);
    }
  };

  // Add translation key
  const handleAddKey = () => {
    if (!newKey.trim()) return;

    const updatedTranslations = { ...translations };
    activeLocales.forEach((locale) => {
      if (!updatedTranslations[locale]) {
        updatedTranslations[locale] = {};
      }
      updatedTranslations[locale][newKey] = '';
    });

    setTranslations(updatedTranslations);
    setNewKey('');
    setHasChanges(true);
  };

  // Delete translation key
  const handleDeleteKey = (key) => {
    if (confirm(`Delete translation key "${key}" from all locales?`)) {
      const updatedTranslations = { ...translations };
      activeLocales.forEach((locale) => {
        if (updatedTranslations[locale]) {
          delete updatedTranslations[locale][key];
        }
      });
      setTranslations(updatedTranslations);
      setHasChanges(true);
    }
  };

  // Update translation
  const handleUpdateTranslation = (locale, key, value) => {
    const updatedTranslations = {
      ...translations,
      [locale]: {
        ...translations[locale],
        [key]: value,
      },
    };
    setTranslations(updatedTranslations);
    setHasChanges(true);
  };

  // Start editing
  const handleStartEdit = (key) => {
    setEditingKey(key);
    setEditingValue(translations[selectedLocale]?.[key] || '');
  };

  // Save edit
  const handleSaveEdit = () => {
    if (editingKey) {
      handleUpdateTranslation(selectedLocale, editingKey, editingValue);
      setEditingKey(null);
      setEditingValue('');
    }
  };

  // Export translations
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(translations, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'translations.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import translations
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
            setTranslations(imported);
            setActiveLocales(Object.keys(imported));
            setHasChanges(true);
          } catch (error) {
            alert(`Failed to import translations: ${error.message}`);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Apply changes
  const handleApply = () => {
    // TODO: Apply translations to application
    console.log('Applying translations:', translations);
    console.log('Default locale:', defaultLocale);
    setHasChanges(false);
    onClose();
  };

  if (!isOpen) return null;

  const allTranslationKeys = new Set();
  Object.values(translations).forEach((locale) => {
    Object.keys(locale).forEach((key) => allTranslationKeys.add(key));
  });
  const translationKeys = Array.from(allTranslationKeys).sort();

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
            <Globe size={24} color={theme.colors.primary[600]} />
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.primary,
                }}
              >
                Locale Manager
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                }}
              >
                Manage translations and multi-language content
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
            onClick={handleImport}
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
            onClick={handleExport}
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

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left sidebar - Locales */}
          <div
            style={{
              width: '300px',
              borderRight: `1px solid ${theme.colors.border.default}`,
              background: theme.colors.neutral[50],
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: theme.spacing['3'],
                borderBottom: `1px solid ${theme.colors.border.default}`,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.primary,
                }}
              >
                Active Locales
              </h3>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: theme.spacing['2'] }}>
              {activeLocales.map((code) => {
                const locale = defaultLocales.find((l) => l.code === code);
                const isDefault = code === defaultLocale;
                const isSelected = code === selectedLocale;

                return (
                  <div
                    key={code}
                    onClick={() => setSelectedLocale(code)}
                    style={{
                      padding: theme.spacing['3'],
                      marginBottom: theme.spacing['2'],
                      background: isSelected
                        ? theme.colors.primary[100]
                        : theme.colors.background.primary,
                      border: isSelected
                        ? `2px solid ${theme.colors.primary[500]}`
                        : `1px solid ${theme.colors.border.default}`,
                      borderRadius: theme.borderRadius.md,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing['2'],
                    }}
                  >
                    <span style={{ fontSize: theme.typography.fontSize.xl }}>{locale?.flag}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: theme.typography.fontSize.sm,
                          fontWeight: theme.typography.fontWeight.medium,
                          color: theme.colors.text.primary,
                        }}
                      >
                        {locale?.name || code}
                      </div>
                      <div
                        style={{
                          fontSize: theme.typography.fontSize.xs,
                          color: theme.colors.text.secondary,
                          fontFamily: 'monospace',
                        }}
                      >
                        {code}
                      </div>
                    </div>
                    {isDefault && (
                      <span
                        style={{
                          padding: `${theme.spacing['1']} ${theme.spacing['2']}`,
                          background: theme.colors.primary[600],
                          color: theme.colors.background.primary,
                          borderRadius: theme.borderRadius.sm,
                          fontSize: theme.typography.fontSize.xs,
                          fontWeight: theme.typography.fontWeight.medium,
                        }}
                      >
                        Default
                      </span>
                    )}
                    {!isDefault && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLocale(code);
                        }}
                        style={{
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: theme.borderRadius.sm,
                          cursor: 'pointer',
                          color: theme.colors.error[500],
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                padding: theme.spacing['3'],
                borderTop: `1px solid ${theme.colors.border.default}`,
              }}
            >
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddLocale(e.target.value);
                    e.target.value = '';
                  }
                }}
                style={{
                  width: '100%',
                  padding: theme.spacing['2'],
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.primary,
                  background: theme.colors.background.primary,
                  border: `1px solid ${theme.colors.border.default}`,
                  borderRadius: theme.borderRadius.md,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">Add Locale...</option>
                {defaultLocales
                  .filter((l) => !activeLocales.includes(l.code))
                  .map((locale) => (
                    <option key={locale.code} value={locale.code}>
                      {locale.flag} {locale.name}
                    </option>
                  ))}
              </select>

              <button
                onClick={() => setDefaultLocale(selectedLocale)}
                disabled={selectedLocale === defaultLocale}
                style={{
                  width: '100%',
                  marginTop: theme.spacing['2'],
                  padding: theme.spacing['2'],
                  background: theme.colors.background.secondary,
                  border: `1px solid ${theme.colors.border.default}`,
                  borderRadius: theme.borderRadius.md,
                  cursor: selectedLocale === defaultLocale ? 'not-allowed' : 'pointer',
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.primary,
                  opacity: selectedLocale === defaultLocale ? 0.5 : 1,
                }}
              >
                Set as Default
              </button>
            </div>
          </div>

          {/* Right panel - Translations */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div
              style={{
                padding: theme.spacing['3'],
                borderBottom: `1px solid ${theme.colors.border.default}`,
                display: 'flex',
                gap: theme.spacing['2'],
              }}
            >
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddKey();
                  }
                }}
                placeholder="New translation key (e.g., button.save)"
                style={{
                  flex: 1,
                  padding: theme.spacing['2'],
                  fontSize: theme.typography.fontSize.sm,
                  fontFamily: 'monospace',
                  color: theme.colors.text.primary,
                  background: theme.colors.background.primary,
                  border: `1px solid ${theme.colors.border.default}`,
                  borderRadius: theme.borderRadius.md,
                  outline: 'none',
                }}
              />
              <button
                onClick={handleAddKey}
                disabled={!newKey.trim()}
                style={{
                  padding: `${theme.spacing['2']} ${theme.spacing['3']}`,
                  background: theme.colors.primary[600],
                  color: theme.colors.background.primary,
                  border: 'none',
                  borderRadius: theme.borderRadius.md,
                  cursor: newKey.trim() ? 'pointer' : 'not-allowed',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  opacity: newKey.trim() ? 1 : 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing['2'],
                }}
              >
                <Plus size={16} />
                Add Key
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: theme.spacing['4'] }}>
              {translationKeys.length === 0 ? (
                <div
                  style={{
                    padding: theme.spacing['8'],
                    textAlign: 'center',
                    color: theme.colors.text.tertiary,
                  }}
                >
                  No translation keys yet. Add your first key above.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing['3'] }}>
                  {translationKeys.map((key) => (
                    <div
                      key={key}
                      style={{
                        padding: theme.spacing['3'],
                        background: theme.colors.neutral[50],
                        border: `1px solid ${theme.colors.border.default}`,
                        borderRadius: theme.borderRadius.md,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: theme.spacing['2'],
                        }}
                      >
                        <span
                          style={{
                            fontSize: theme.typography.fontSize.sm,
                            fontWeight: theme.typography.fontWeight.semibold,
                            color: theme.colors.text.primary,
                            fontFamily: 'monospace',
                          }}
                        >
                          {key}
                        </span>
                        <button
                          onClick={() => handleDeleteKey(key)}
                          style={{
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: theme.borderRadius.sm,
                            cursor: 'pointer',
                            color: theme.colors.error[500],
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {editingKey === key ? (
                        <div style={{ display: 'flex', gap: theme.spacing['2'] }}>
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveEdit();
                              } else if (e.key === 'Escape') {
                                setEditingKey(null);
                              }
                            }}
                            autoFocus
                            style={{
                              flex: 1,
                              padding: theme.spacing['2'],
                              fontSize: theme.typography.fontSize.sm,
                              color: theme.colors.text.primary,
                              background: theme.colors.background.primary,
                              border: `1px solid ${theme.colors.border.default}`,
                              borderRadius: theme.borderRadius.sm,
                              outline: 'none',
                            }}
                          />
                          <button
                            onClick={handleSaveEdit}
                            style={{
                              padding: theme.spacing['2'],
                              background: theme.colors.success[500],
                              color: theme.colors.background.primary,
                              border: 'none',
                              borderRadius: theme.borderRadius.sm,
                              cursor: 'pointer',
                            }}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setEditingKey(null)}
                            style={{
                              padding: theme.spacing['2'],
                              background: theme.colors.neutral[300],
                              color: theme.colors.text.primary,
                              border: 'none',
                              borderRadius: theme.borderRadius.sm,
                              cursor: 'pointer',
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => handleStartEdit(key)}
                          style={{
                            padding: theme.spacing['2'],
                            background: theme.colors.background.primary,
                            border: `1px solid ${theme.colors.border.default}`,
                            borderRadius: theme.borderRadius.sm,
                            cursor: 'text',
                            display: 'flex',
                            alignItems: 'center',
                            gap: theme.spacing['2'],
                          }}
                        >
                          <span
                            style={{
                              flex: 1,
                              fontSize: theme.typography.fontSize.sm,
                              color: translations[selectedLocale]?.[key]
                                ? theme.colors.text.primary
                                : theme.colors.text.tertiary,
                            }}
                          >
                            {translations[selectedLocale]?.[key] || 'Click to add translation...'}
                          </span>
                          <Edit2 size={14} color={theme.colors.text.tertiary} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
              style={{
                padding: `${theme.spacing['2']} ${theme.spacing['4']}`,
                background: theme.colors.primary[600],
                border: 'none',
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.background.primary,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing['2'],
              }}
            >
              <Check size={16} />
              Apply Translations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

LocaleManager.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
