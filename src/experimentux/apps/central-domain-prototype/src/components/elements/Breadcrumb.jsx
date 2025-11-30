/**
 * Breadcrumb Element
 * Hierarchical navigation breadcrumbs
 */

import PropTypes from 'prop-types';
import { ChevronRight, Home } from 'lucide-react';
import { theme } from '../../config/theme';

export function Breadcrumb({ data, settings }) {
  const { items = [] } = data;
  const { showHome = true, separator = 'chevron' } = settings.breadcrumb || {};

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary
  };

  const itemStyle = (isCurrent) => ({
    display: 'inline-flex',
    alignItems: 'center',
    color: isCurrent ? theme.colors.text.primary : theme.colors.text.secondary,
    fontWeight: isCurrent ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal,
    textDecoration: 'none',
    transition: `color ${theme.transitions.fast}`,
    cursor: isCurrent ? 'default' : 'pointer',
    ':hover': {
      color: !isCurrent ? theme.colors.text.primary : undefined
    }
  });

  const separatorStyle = {
    display: 'flex',
    alignItems: 'center',
    color: theme.colors.text.tertiary
  };

  const SeparatorIcon = separator === 'chevron' ? ChevronRight : null;

  return (
    <nav aria-label="Breadcrumb" style={containerStyle}>
      {showHome && (
        <>
          <a href="/" style={itemStyle(false)}>
            <Home size={14} strokeWidth={2} />
          </a>
          <span style={separatorStyle}>
            {SeparatorIcon ? <SeparatorIcon size={14} strokeWidth={2} /> : '/'}
          </span>
        </>
      )}
      {items.map((item, index) => {
        const isCurrent = item.current || index === items.length - 1;
        const isLast = index === items.length - 1;

        return (
          <span key={index} style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
            {item.href && !isCurrent ? (
              <a href={item.href} style={itemStyle(isCurrent)}>
                {item.label}
              </a>
            ) : (
              <span style={itemStyle(isCurrent)} aria-current={isCurrent ? 'page' : undefined}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <span style={separatorStyle}>
                {SeparatorIcon ? <SeparatorIcon size={14} strokeWidth={2} /> : '/'}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

Breadcrumb.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        href: PropTypes.string,
        current: PropTypes.bool
      })
    ).isRequired
  }).isRequired,
  settings: PropTypes.shape({
    breadcrumb: PropTypes.shape({
      showHome: PropTypes.bool,
      separator: PropTypes.oneOf(['chevron', 'slash'])
    })
  }).isRequired
};
