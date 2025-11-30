/**
 * StructureElement Component
 * Renders structure elements with nesting support and depth validation
 * Supports 12 structure types with semantic HTML and full settings support
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../theme/ThemeProvider';

export function StructureElement({
  settings,
  elements,
  renderElement,
  depth = 0,
  validation
}) {
  const { resolveToken } = useTheme();

  // Extract settings from all groups
  const structure = settings.structure || {};
  const appearance = settings.appearance || {};
  const layout = settings.layout || {};
  const typography = settings.typography || {};
  const businessRules = settings.businessRules || {};

  const {
    structureType = 'div',
    semanticRole,
    activeTab = 0,
    accordionOpen = []
  } = structure;

  // Tab state for tabs structure
  const [currentTab, setCurrentTab] = useState(activeTab);

  // Accordion state for accordion structure
  const [openSections, setOpenSections] = useState(accordionOpen);

  // Depth validation - warn if nesting too deep
  const maxDepth = 3;
  if (depth > maxDepth) {
    console.warn(`StructureElement: Nesting depth ${depth} exceeds recommended maximum of ${maxDepth}`);
  }

  // Business rules - visibility
  if (businessRules.visible === false) {
    return null;
  }

  // Build base styles from all setting groups
  const baseStyle = {
    // Appearance settings
    background: appearance.background ? resolveToken(appearance.background) : undefined,
    border: appearance.border ? resolveToken(appearance.border) : undefined,
    borderRadius: appearance.borderRadius ? resolveToken(appearance.borderRadius) : undefined,
    boxShadow: appearance.shadow ? resolveToken(appearance.shadow) : undefined,
    opacity: appearance.opacity,

    // Layout settings
    padding: layout.padding ? resolveToken(layout.padding) : undefined,
    margin: layout.margin ? resolveToken(layout.margin) : undefined,
    gap: layout.gap ? resolveToken(layout.gap) : undefined,
    width: layout.width ? resolveToken(layout.width) : undefined,
    minWidth: layout.minWidth ? resolveToken(layout.minWidth) : undefined,
    maxWidth: layout.maxWidth ? resolveToken(layout.maxWidth) : undefined,
    height: layout.height ? resolveToken(layout.height) : undefined,
    minHeight: layout.minHeight ? resolveToken(layout.minHeight) : undefined,
    maxHeight: layout.maxHeight ? resolveToken(layout.maxHeight) : undefined,

    // Typography settings
    fontSize: typography.fontSize ? resolveToken(typography.fontSize) : undefined,
    fontWeight: typography.fontWeight ? resolveToken(typography.fontWeight) : undefined,
    lineHeight: typography.lineHeight ? resolveToken(typography.lineHeight) : undefined,
    textAlign: typography.textAlign,
    color: typography.color ? resolveToken(typography.color) : undefined,
  };

  // Remove undefined values
  Object.keys(baseStyle).forEach(key => {
    if (baseStyle[key] === undefined || baseStyle[key] === null) {
      delete baseStyle[key];
    }
  });

  // Render children elements with increased depth
  const renderChildren = () => {
    return elements?.map((element, index) =>
      renderElement(element, index, depth + 1)
    );
  };

  // Render validation errors if present
  const renderValidation = () => {
    if (!validation?.errors?.length) return null;

    return (
      <div style={{
        color: resolveToken('{{theme.colors.error.600}}'),
        fontSize: resolveToken('{{theme.typography.fontSize.sm}}'),
        marginTop: resolveToken('{{theme.spacing.2}}'),
        padding: resolveToken('{{theme.spacing.2}}'),
        background: resolveToken('{{theme.colors.error.50}}'),
        borderRadius: resolveToken('{{theme.borderRadius.md}}'),
        border: `1px solid ${resolveToken('{{theme.colors.error.200}}')}`,
      }}>
        {validation.errors.map((error, idx) => (
          <div key={idx}>{error}</div>
        ))}
      </div>
    );
  };

  // Get semantic HTML tag
  const getSemanticTag = () => {
    if (semanticRole) {
      const roleMap = {
        navigation: 'nav',
        header: 'header',
        footer: 'footer',
        main: 'main',
        aside: 'aside',
        section: 'section',
        article: 'article',
      };
      return roleMap[semanticRole] || 'div';
    }
    return 'div';
  };

  // Render based on structure type
  switch (structureType) {
    case 'div': {
      const Tag = getSemanticTag();
      return (
        <Tag style={baseStyle}>
          {renderChildren()}
          {renderValidation()}
        </Tag>
      );
    }

    case 'stack':
      return (
        <div
          style={{
            ...baseStyle,
            display: 'flex',
            flexDirection: layout.direction || 'column',
            gap: baseStyle.gap || resolveToken('{{theme.spacing.4}}'),
            alignItems: layout.align || 'stretch',
            justifyContent: layout.justify || 'flex-start',
          }}
        >
          {renderChildren()}
          {renderValidation()}
        </div>
      );

    case 'grid':
      return (
        <div
          style={{
            ...baseStyle,
            display: 'grid',
            gridTemplateColumns: layout.columns || 'repeat(auto-fit, minmax(250px, 1fr))',
            gridTemplateRows: layout.rows,
            gap: baseStyle.gap || resolveToken('{{theme.spacing.4}}'),
            alignItems: layout.align || 'stretch',
            justifyContent: layout.justify || 'stretch',
          }}
        >
          {renderChildren()}
          {renderValidation()}
        </div>
      );

    case 'flex':
      return (
        <div
          style={{
            ...baseStyle,
            display: 'flex',
            flexDirection: layout.direction || 'row',
            flexWrap: layout.wrap || 'nowrap',
            gap: baseStyle.gap || resolveToken('{{theme.spacing.4}}'),
            alignItems: layout.align || 'flex-start',
            justifyContent: layout.justify || 'flex-start',
          }}
        >
          {renderChildren()}
          {renderValidation()}
        </div>
      );

    case 'card':
      return (
        <div
          style={{
            ...baseStyle,
            background: baseStyle.background || resolveToken('{{theme.colors.background.primary}}'),
            border: baseStyle.border || `1px solid ${resolveToken('{{theme.colors.border.default}}')}`,
            borderRadius: baseStyle.borderRadius || resolveToken('{{theme.borderRadius.lg}}'),
            padding: baseStyle.padding || resolveToken('{{theme.spacing.6}}'),
            boxShadow: baseStyle.boxShadow || resolveToken('{{theme.shadows.sm}}'),
          }}
        >
          {renderChildren()}
          {renderValidation()}
        </div>
      );

    case 'panel':
      return (
        <div
          style={{
            ...baseStyle,
            background: baseStyle.background || resolveToken('{{theme.colors.surface}}'),
            border: baseStyle.border || `1px solid ${resolveToken('{{theme.colors.border.light}}')}`,
            borderRadius: baseStyle.borderRadius || resolveToken('{{theme.borderRadius.md}}'),
            padding: baseStyle.padding || resolveToken('{{theme.spacing.4}}'),
          }}
        >
          {renderChildren()}
          {renderValidation()}
        </div>
      );

    case 'tabs': {
      const tabElements = elements?.filter(el => el.type === 'structure' && el.settings?.structure?.structureType === 'div') || [];

      return (
        <div style={baseStyle}>
          {/* Tab buttons */}
          <div
            style={{
              display: 'flex',
              gap: resolveToken('{{theme.spacing.2}}'),
              borderBottom: `1px solid ${resolveToken('{{theme.colors.border.default}}')}`,
              marginBottom: resolveToken('{{theme.spacing.4}}'),
            }}
          >
            {tabElements.map((tab, index) => (
              <button
                key={index}
                onClick={() => setCurrentTab(index)}
                style={{
                  padding: `${resolveToken('{{theme.spacing.2}}')} ${resolveToken('{{theme.spacing.4}}')}`,
                  background: currentTab === index
                    ? resolveToken('{{theme.colors.primary.50}}')
                    : 'transparent',
                  color: currentTab === index
                    ? resolveToken('{{theme.colors.primary.700}}')
                    : resolveToken('{{theme.colors.text.secondary}}'),
                  border: 'none',
                  borderBottom: currentTab === index
                    ? `2px solid ${resolveToken('{{theme.colors.primary.500}}')}`
                    : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: resolveToken('{{theme.typography.fontSize.sm}}'),
                  fontWeight: currentTab === index
                    ? resolveToken('{{theme.typography.fontWeight.semibold}}')
                    : resolveToken('{{theme.typography.fontWeight.normal}}'),
                }}
              >
                {tab.settings?.structure?.label || `Tab ${index + 1}`}
              </button>
            ))}
          </div>

          {/* Active tab content */}
          <div>
            {tabElements[currentTab] && renderElement(tabElements[currentTab], currentTab, depth + 1)}
          </div>
          {renderValidation()}
        </div>
      );
    }

    case 'accordion': {
      const accordionElements = elements?.filter(el => el.type === 'structure' && el.settings?.structure?.structureType === 'div') || [];

      const toggleSection = (index) => {
        setOpenSections(prev =>
          prev.includes(index)
            ? prev.filter(i => i !== index)
            : [...prev, index]
        );
      };

      return (
        <div style={baseStyle}>
          {accordionElements.map((section, index) => {
            const isOpen = openSections.includes(index);

            return (
              <div
                key={index}
                style={{
                  borderBottom: `1px solid ${resolveToken('{{theme.colors.border.light}}')}`,
                }}
              >
                {/* Accordion header */}
                <button
                  onClick={() => toggleSection(index)}
                  style={{
                    width: '100%',
                    padding: resolveToken('{{theme.spacing.4}}'),
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: resolveToken('{{theme.typography.fontSize.base}}'),
                    fontWeight: resolveToken('{{theme.typography.fontWeight.medium}}'),
                    color: resolveToken('{{theme.colors.text.primary}}'),
                    textAlign: 'left',
                  }}
                >
                  <span>{section.settings?.structure?.label || `Section ${index + 1}`}</span>
                  <span style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}>
                    ▼
                  </span>
                </button>

                {/* Accordion content */}
                {isOpen && (
                  <div style={{ padding: resolveToken('{{theme.spacing.4}}') }}>
                    {renderElement(section, index, depth + 1)}
                  </div>
                )}
              </div>
            );
          })}
          {renderValidation()}
        </div>
      );
    }

    case 'modal':
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
            zIndex: 1000,
          }}
        >
          <div
            style={{
              ...baseStyle,
              background: baseStyle.background || resolveToken('{{theme.colors.background.primary}}'),
              borderRadius: baseStyle.borderRadius || resolveToken('{{theme.borderRadius.lg}}'),
              padding: baseStyle.padding || resolveToken('{{theme.spacing.6}}'),
              maxWidth: baseStyle.maxWidth || '600px',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: resolveToken('{{theme.shadows.xl}}'),
            }}
          >
            {renderChildren()}
            {renderValidation()}
          </div>
        </div>
      );

    case 'drawer':
      return (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: baseStyle.width || '400px',
            background: baseStyle.background || resolveToken('{{theme.colors.background.primary}}'),
            boxShadow: resolveToken('{{theme.shadows.xl}}'),
            padding: baseStyle.padding || resolveToken('{{theme.spacing.6}}'),
            overflow: 'auto',
            zIndex: 1000,
          }}
        >
          {renderChildren()}
          {renderValidation()}
        </div>
      );

    case 'carousel':
      return (
        <div
          style={{
            ...baseStyle,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: baseStyle.gap || resolveToken('{{theme.spacing.4}}'),
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
            }}
          >
            {elements?.map((element, index) => (
              <div
                key={index}
                style={{
                  scrollSnapAlign: 'start',
                  flexShrink: 0,
                  width: '100%',
                }}
              >
                {renderElement(element, index, depth + 1)}
              </div>
            ))}
          </div>
          {renderValidation()}
        </div>
      );

    case 'canvas':
      return (
        <div
          style={{
            ...baseStyle,
            background: baseStyle.background || resolveToken('{{theme.colors.surface}}'),
            padding: baseStyle.padding || resolveToken('{{theme.spacing.8}}'),
            minHeight: baseStyle.minHeight || '400px',
            borderRadius: baseStyle.borderRadius || resolveToken('{{theme.borderRadius.lg}}'),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderChildren()}
          {renderValidation()}
        </div>
      );

    default:
      return (
        <div style={baseStyle}>
          {renderChildren()}
          {renderValidation()}
        </div>
      );
  }
}

StructureElement.propTypes = {
  settings: PropTypes.shape({
    structure: PropTypes.shape({
      structureType: PropTypes.oneOf([
        'div', 'stack', 'grid', 'flex', 'card', 'panel',
        'tabs', 'accordion', 'modal', 'drawer', 'carousel', 'canvas'
      ]),
      semanticRole: PropTypes.oneOf([
        'navigation', 'header', 'footer', 'main', 'aside', 'section', 'article'
      ]),
      activeTab: PropTypes.number,
      accordionOpen: PropTypes.arrayOf(PropTypes.number),
      label: PropTypes.string,
    }),
    appearance: PropTypes.object,
    layout: PropTypes.object,
    typography: PropTypes.object,
    businessRules: PropTypes.object,
  }).isRequired,
  elements: PropTypes.array,
  renderElement: PropTypes.func.isRequired,
  depth: PropTypes.number,
  validation: PropTypes.shape({
    errors: PropTypes.arrayOf(PropTypes.string),
  }),
};
