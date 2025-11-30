/**
 * FacetSelector Component
 *
 * Dropdown menu for switching between facets.
 * Apple-inspired minimal design with grouped sections.
 */

import PropTypes from 'prop-types';
import { Check } from 'lucide-react';
import { theme } from '../../config/theme';

export function FacetSelector({ activeFacet, onSelect, facets }) {
  // Group facets by category
  const dataFacets = ['summary', 'list', 'analytics', 'timeline'];
  const structureFacets = ['fields', 'actions'];

  const renderFacetItem = (facetId) => {
    const facet = facets[facetId];
    const isActive = activeFacet === facetId;
    const Icon = facet.icon;

    return (
      <button
        key={facetId}
        onClick={(e) => { e.stopPropagation(); onSelect(facetId); }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: '100%',
          padding: '10px 12px',
          border: 'none',
          borderRadius: theme.borderRadius.md,
          background: isActive ? theme.colors.background.tertiary : 'transparent',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text.primary,
          textAlign: 'left',
          transition: `all ${theme.transitions.fast}`
        }}
        onMouseOver={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = theme.colors.interactive.hover;
          }
        }}
        onMouseOut={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent';
          }
        }}
      >
        <span style={{
          width: '20px',
          display: 'flex',
          justifyContent: 'center',
          opacity: 0.7
        }}>
          <Icon size={16} strokeWidth={1.5} />
        </span>
        <span style={{ flex: 1 }}>{facet.label}</span>
        {isActive && (
          <Check size={14} strokeWidth={2} style={{ color: theme.colors.primary[500] }} />
        )}
      </button>
    );
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '100%',
        left: 0,
        marginBottom: '6px',
        background: theme.colors.background.elevated,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows.lg,
        border: `1px solid ${theme.colors.border.default}`,
        padding: '8px',
        minWidth: '180px',
        zIndex: theme.zIndex.dropdown,
        animation: 'selectorSlideUp 150ms ease-out'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Data Section */}
      <div style={{ marginBottom: '4px' }}>
        <div style={{
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: theme.colors.text.tertiary,
          padding: '6px 12px 4px'
        }}>
          Data
        </div>
        {dataFacets.map(renderFacetItem)}
      </div>

      {/* Divider */}
      <div style={{
        height: '1px',
        background: theme.colors.border.subtle,
        margin: '6px 0'
      }} />

      {/* Structure Section */}
      <div>
        <div style={{
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: theme.colors.text.tertiary,
          padding: '6px 12px 4px'
        }}>
          Structure
        </div>
        {structureFacets.map(renderFacetItem)}
      </div>

      <style>{`
        @keyframes selectorSlideUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

FacetSelector.propTypes = {
  activeFacet: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  facets: PropTypes.object.isRequired
};
