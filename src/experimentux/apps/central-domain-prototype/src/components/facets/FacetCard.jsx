/**
 * FacetCard Component
 *
 * A card that displays record collection data through six interchangeable facets.
 * Apple-inspired minimalist design with streamlined single-line header.
 *
 * The Six Facets:
 * - Summary: Overview with key metrics and status distribution
 * - List: Top values grouped by key dimensions
 * - Analytics: Charts, trends, and pattern insights
 * - Timeline: Chronological activity and changes
 * - Fields: Schema structure and data quality
 * - Actions: Operations and automations
 */

import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  LayoutGrid, List, BarChart3, Clock, Hexagon, Zap,
  ExternalLink, MoreVertical
} from 'lucide-react';
import { theme } from '../../config/theme';
import { FacetSummary } from './facets/FacetSummary';
import { FacetList } from './facets/FacetList';
import { FacetAnalytics } from './facets/FacetAnalytics';
import { FacetTimeline } from './facets/FacetTimeline';
import { FacetFields } from './facets/FacetFields';
import { FacetActions } from './facets/FacetActions';
import { FacetSelector } from './FacetSelector';

// Facet configuration
const FACETS = {
  summary: {
    id: 'summary',
    label: 'Summary',
    icon: LayoutGrid,
    color: theme.colors.neutral[500]
  },
  list: {
    id: 'list',
    label: 'List',
    icon: List,
    color: theme.colors.primary[500]
  },
  analytics: {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    color: theme.colors.warning[500]
  },
  timeline: {
    id: 'timeline',
    label: 'Timeline',
    icon: Clock,
    color: '#7C5CFA'
  },
  fields: {
    id: 'fields',
    label: 'Fields',
    icon: Hexagon,
    color: theme.colors.charts.accent2
  },
  actions: {
    id: 'actions',
    label: 'Actions',
    icon: Zap,
    color: theme.colors.error[500]
  }
};

export function FacetCard({
  collection,
  defaultFacet = 'summary',
  onPopOut,
  onMenuClick,
  onCardClick,
  noBorder = false
}) {
  const [activeFacet, setActiveFacet] = useState(defaultFacet);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const selectorRef = useRef(null);

  const currentFacet = FACETS[activeFacet];
  const FacetIcon = currentFacet.icon;

  // Close selector on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target)) {
        setSelectorOpen(false);
      }
    };
    if (selectorOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectorOpen]);

  // Render appropriate facet content
  const renderFacetContent = () => {
    const props = { data: collection };
    switch (activeFacet) {
      case 'summary': return <FacetSummary {...props} />;
      case 'list': return <FacetList {...props} cardId={collection.id} />;
      case 'analytics': return <FacetAnalytics {...props} />;
      case 'timeline': return <FacetTimeline {...props} cardId={collection.id} />;
      case 'fields': return <FacetFields {...props} />;
      case 'actions': return <FacetActions {...props} />;
      default: return <FacetSummary {...props} />;
    }
  };

  const handleFacetChange = (facetId) => {
    setActiveFacet(facetId);
    setSelectorOpen(false);
  };

  // Card styles based on noBorder prop
  const cardStyles = noBorder
    ? {
        background: '#FFFFFF',
        borderRadius: theme.borderRadius.xl,
        boxShadow: 'none',
        border: 'none',
        transition: `all ${theme.transitions.base}`,
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }
    : {
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)',
        borderRadius: theme.borderRadius.xl,
        boxShadow: isHovered ? theme.shadows.md : theme.shadows.sm,
        border: `1px solid ${isHovered ? theme.colors.border.medium : theme.colors.border.default}`,
        transition: `all ${theme.transitions.base}`,
        transform: isHovered ? 'translateY(-2px)' : 'none',
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      };

  return (
    <div
      style={cardStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onCardClick}
    >
      {/* Streamlined Header */}
      <div style={{
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        borderBottom: `1px solid ${theme.colors.border.subtle}`
      }}>
        {/* Record Type Icon */}
        <div style={{
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: collection.primaryColor || theme.colors.text.secondary,
          flexShrink: 0
        }}>
          {collection.icon}
        </div>

        {/* Collection Name */}
        <span style={{
          flex: 1,
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.text.primary,
          letterSpacing: theme.typography.letterSpacing.tight,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {collection.title}
        </span>

        {/* Action Icons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px'
        }}>
          {/* Facet Selector Icon */}
          <div
            ref={selectorRef}
            style={{ position: 'relative' }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setSelectorOpen(!selectorOpen); }}
              style={{
                width: '28px',
                height: '28px',
                border: 'none',
                background: selectorOpen ? `${currentFacet.color}15` : 'transparent',
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: selectorOpen ? currentFacet.color : theme.colors.text.tertiary,
                transition: `all ${theme.transitions.fast}`
              }}
              onMouseOver={(e) => {
                if (!selectorOpen) {
                  e.currentTarget.style.background = theme.colors.background.tertiary;
                  e.currentTarget.style.color = theme.colors.text.secondary;
                }
              }}
              onMouseOut={(e) => {
                if (!selectorOpen) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = theme.colors.text.tertiary;
                }
              }}
              title={`View: ${currentFacet.label}`}
            >
              <FacetIcon size={16} strokeWidth={1.5} />
            </button>

            {selectorOpen && (
              <FacetSelector
                activeFacet={activeFacet}
                onSelect={handleFacetChange}
                facets={FACETS}
              />
            )}
          </div>

          {/* Pop-out Icon */}
          <button
            onClick={(e) => { e.stopPropagation(); onPopOut?.(); }}
            style={{
              width: '28px',
              height: '28px',
              border: 'none',
              background: 'transparent',
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.text.tertiary,
              transition: `all ${theme.transitions.fast}`,
              opacity: isHovered ? 1 : 0
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = theme.colors.background.tertiary;
              e.currentTarget.style.color = theme.colors.text.secondary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = theme.colors.text.tertiary;
            }}
            title="Open in panel"
          >
            <ExternalLink size={15} strokeWidth={1.5} />
          </button>

          {/* Menu Icon */}
          <button
            onClick={(e) => { e.stopPropagation(); onMenuClick?.(); }}
            style={{
              width: '28px',
              height: '28px',
              border: 'none',
              background: 'transparent',
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.text.tertiary,
              transition: `all ${theme.transitions.fast}`,
              opacity: isHovered ? 1 : 0
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = theme.colors.background.tertiary;
              e.currentTarget.style.color = theme.colors.text.secondary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = theme.colors.text.tertiary;
            }}
            title="More options"
          >
            <MoreVertical size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Content Zone - Facet Content */}
      <div style={{
        padding: '16px 16px 20px',
        minHeight: '160px',
        flex: 1
      }}>
        <div
          key={activeFacet}
          style={{
            animation: 'facetFadeIn 250ms ease-out'
          }}
        >
          {renderFacetContent()}
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes facetFadeIn {
          from {
            opacity: 0;
            transform: translateX(8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

FacetCard.propTypes = {
  collection: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    count: PropTypes.string.isRequired,
    icon: PropTypes.node,
    primaryColor: PropTypes.string,
    trend: PropTypes.shape({
      value: PropTypes.string,
      positive: PropTypes.bool
    }),
    updated: PropTypes.string,
    summary: PropTypes.object,
    list: PropTypes.array,
    chart: PropTypes.object,
    timeline: PropTypes.array,
    fields: PropTypes.array,
    automations: PropTypes.array
  }).isRequired,
  defaultFacet: PropTypes.oneOf(['summary', 'list', 'analytics', 'timeline', 'fields', 'actions']),
  onPopOut: PropTypes.func,
  onMenuClick: PropTypes.func,
  onCardClick: PropTypes.func,
  noBorder: PropTypes.bool
};
