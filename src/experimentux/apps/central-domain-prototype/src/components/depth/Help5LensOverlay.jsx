/**
 * Help5LensOverlay
 * Overlay component that shows Help5 status on DEPTH containers
 */

import PropTypes from 'prop-types';
import { HelpCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { theme } from '../../config/theme';

export function Help5LensOverlay({ containerStats, lensMode = 'insight', onItemClick }) {
  if (!containerStats) return null;

  const { coverage, documented, missing } = containerStats;

  const getCoverageLevel = () => {
    if (coverage >= 90) return 'high';
    if (coverage >= 70) return 'medium';
    return 'low';
  };

  const getCoverageColor = () => {
    if (coverage >= 90) return theme.colors.success[500];
    if (coverage >= 70) return theme.colors.warning[500];
    return theme.colors.error[500];
  };

  const getIcon = () => {
    const level = getCoverageLevel();
    const iconProps = { size: 20, color: getCoverageColor() };

    switch (level) {
      case 'high':
        return <CheckCircle {...iconProps} />;
      case 'medium':
        return <HelpCircle {...iconProps} />;
      case 'low':
        return <AlertTriangle {...iconProps} />;
      default:
        return <HelpCircle {...iconProps} />;
    }
  };

  // Different display modes based on lens type
  if (lensMode === 'insight') {
    return (
      <div
        style={{
          position: 'absolute',
          top: theme.spacing[3],
          right: theme.spacing[3],
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing[2],
          padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
          backgroundColor: `${getCoverageColor()}15`,
          border: `2px solid ${getCoverageColor()}`,
          borderRadius: theme.borderRadius.md,
          backdropFilter: 'blur(4px)',
          zIndex: 5
        }}
      >
        {getIcon()}
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[0.5] }}>
          <span
            style={{
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary
            }}
          >
            Help5: {coverage}%
          </span>
          <span
            style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary
            }}
          >
            {documented}/{documented + missing} documented
          </span>
        </div>
      </div>
    );
  }

  if (lensMode === 'department') {
    // Show team-specific Help5 status
    return (
      <div
        style={{
          position: 'absolute',
          top: theme.spacing[3],
          right: theme.spacing[3],
          padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
          backgroundColor: theme.colors.background.elevated,
          border: `1px solid ${theme.colors.border.default}`,
          borderRadius: theme.borderRadius.md,
          boxShadow: theme.shadows.md,
          zIndex: 5
        }}
      >
        <div
          style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing[1]
          }}
        >
          Team Coverage
        </div>
        <div
          style={{
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.semibold,
            color: getCoverageColor()
          }}
        >
          {coverage}% Help5
        </div>
      </div>
    );
  }

  if (lensMode === 'dependency') {
    // Show dependency impact
    const impactLevel = coverage < 70 ? 'High Impact' : coverage < 90 ? 'Medium Impact' : 'Low Impact';

    return (
      <div
        style={{
          position: 'absolute',
          top: theme.spacing[3],
          right: theme.spacing[3],
          padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
          backgroundColor: theme.colors.background.elevated,
          border: `1px solid ${getCoverageColor()}`,
          borderRadius: theme.borderRadius.md,
          boxShadow: theme.shadows.md,
          zIndex: 5
        }}
      >
        <div
          style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing[1]
          }}
        >
          Help5 Gap Impact
        </div>
        <div
          style={{
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.semibold,
            color: getCoverageColor()
          }}
        >
          {impactLevel}
        </div>
        {missing > 0 && (
          <div
            style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              marginTop: theme.spacing[1]
            }}
          >
            {missing} items affect downstream
          </div>
        )}
      </div>
    );
  }

  return null;
}

Help5LensOverlay.propTypes = {
  containerStats: PropTypes.shape({
    coverage: PropTypes.number,
    documented: PropTypes.number,
    missing: PropTypes.number,
    total: PropTypes.number
  }),
  lensMode: PropTypes.oneOf(['insight', 'department', 'dependency']),
  onItemClick: PropTypes.func
};

Help5LensOverlay.defaultProps = {
  lensMode: 'insight'
};

export default Help5LensOverlay;
