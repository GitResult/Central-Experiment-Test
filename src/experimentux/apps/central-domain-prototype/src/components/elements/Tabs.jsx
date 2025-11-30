/**
 * Tabs Element
 * Tab navigation for content organization
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../config/theme';

export function Tabs({ data, settings, elements, renderElement }) {
  const { tabs = [] } = data;
  const { variant = 'line', size = 'md' } = settings.tabs || {};

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  const containerStyle = {
    width: '100%'
  };

  const tabListStyle = {
    display: 'flex',
    gap: variant === 'pills' ? theme.spacing[2] : '0',
    borderBottom: variant === 'line' ? `2px solid ${theme.colors.border.default}` : 'none',
    marginBottom: theme.spacing[6]
  };

  const sizeStyles = {
    sm: {
      fontSize: theme.typography.fontSize.sm,
      padding: `${theme.spacing[2]} ${theme.spacing[3]}`
    },
    md: {
      fontSize: theme.typography.fontSize.base,
      padding: `${theme.spacing[3]} ${theme.spacing[4]}`
    },
    lg: {
      fontSize: theme.typography.fontSize.lg,
      padding: `${theme.spacing[4]} ${theme.spacing[6]}`
    }
  };

  const sizing = sizeStyles[size] || sizeStyles.md;

  const getTabStyle = (isActive) => {
    const baseStyle = {
      position: 'relative',
      fontSize: sizing.fontSize,
      fontWeight: isActive ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium,
      color: isActive ? theme.colors.text.primary : theme.colors.text.secondary,
      padding: sizing.padding,
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      transition: `all ${theme.transitions.base}`,
      whiteSpace: 'nowrap'
    };

    if (variant === 'line') {
      return {
        ...baseStyle,
        borderBottom: `2px solid ${isActive ? theme.colors.primary[500] : 'transparent'}`,
        marginBottom: '-2px'
      };
    } else if (variant === 'pills') {
      return {
        ...baseStyle,
        backgroundColor: isActive ? theme.colors.primary[50] : 'transparent',
        color: isActive ? theme.colors.primary[700] : theme.colors.text.secondary,
        borderRadius: theme.borderRadius.md,
        ':hover': {
          backgroundColor: isActive ? theme.colors.primary[50] : theme.colors.interactive.hover
        }
      };
    } else if (variant === 'enclosed') {
      return {
        ...baseStyle,
        border: `1px solid ${isActive ? theme.colors.border.default : 'transparent'}`,
        borderBottom: isActive ? `1px solid ${theme.colors.background.primary}` : `1px solid ${theme.colors.border.default}`,
        borderTopLeftRadius: theme.borderRadius.md,
        borderTopRightRadius: theme.borderRadius.md,
        marginBottom: '-1px',
        backgroundColor: isActive ? theme.colors.background.primary : 'transparent'
      };
    }

    return baseStyle;
  };

  const contentStyle = {
    padding: variant === 'enclosed' ? theme.spacing[6] : '0',
    border: variant === 'enclosed' ? `1px solid ${theme.colors.border.default}` : 'none',
    borderRadius: variant === 'enclosed' ? theme.borderRadius.md : '0',
    backgroundColor: variant === 'enclosed' ? theme.colors.background.primary : 'transparent'
  };

  return (
    <div style={containerStyle}>
      <div style={tabListStyle} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            style={getTabStyle(activeTab === tab.id)}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.badge && (
              <span
                style={{
                  marginLeft: theme.spacing[2],
                  padding: `${theme.spacing[0.5]} ${theme.spacing[2]}`,
                  backgroundColor: activeTab === tab.id ? theme.colors.primary[100] : theme.colors.neutral[100],
                  color: activeTab === tab.id ? theme.colors.primary[700] : theme.colors.text.tertiary,
                  borderRadius: theme.borderRadius.full,
                  fontSize: theme.typography.fontSize.xs,
                  fontWeight: theme.typography.fontWeight.medium
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div style={contentStyle} role="tabpanel">
        {elements
          ?.filter((el) => el.data?.tabId === activeTab)
          .map((element, index) => renderElement?.(element, index))}
      </div>
    </div>
  );
}

Tabs.propTypes = {
  data: PropTypes.shape({
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    ).isRequired
  }).isRequired,
  settings: PropTypes.shape({
    tabs: PropTypes.shape({
      variant: PropTypes.oneOf(['line', 'pills', 'enclosed']),
      size: PropTypes.oneOf(['sm', 'md', 'lg'])
    })
  }).isRequired,
  elements: PropTypes.array,
  renderElement: PropTypes.func
};
