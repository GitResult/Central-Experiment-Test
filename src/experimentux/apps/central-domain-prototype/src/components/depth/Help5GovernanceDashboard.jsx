/**
 * Help5GovernanceDashboard
 * Displays Help5 coverage statistics for DEPTH Governance container
 */

import PropTypes from 'prop-types';
import { AlertCircle, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { theme } from '../../config/theme';
import { useHelp5Analytics } from './hooks/useHelp5Analytics';

export function Help5GovernanceDashboard({ help5Records, allElements, onViewDetails }) {
  const analytics = useHelp5Analytics(help5Records, allElements);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp size={16} color={theme.colors.success[500]} />;
      case 'declining':
        return <TrendingDown size={16} color={theme.colors.error[500]} />;
      default:
        return <Minus size={16} color={theme.colors.neutral[500]} />;
    }
  };

  const getCoverageColor = (coverage) => {
    return analytics.getCoverageColor(coverage, theme.colors);
  };

  return (
    <div
      style={{
        backgroundColor: theme.colors.background.elevated,
        border: `1px solid ${theme.colors.border.default}`,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing[6],
        marginTop: theme.spacing[4]
      }}
    >
      <h3
        style={{
          fontSize: theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.text.primary,
          margin: 0,
          marginBottom: theme.spacing[4]
        }}
      >
        Help5 Governance Dashboard
      </h3>

      {/* Overall Coverage */}
      <div style={{ marginBottom: theme.spacing[5] }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing[2]
          }}
        >
          <span
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary
            }}
          >
            Overall Help5 Coverage: {analytics.overall.coverage}%
          </span>
          {getTrendIcon(analytics.overall.trend)}
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: '8px',
            backgroundColor: theme.colors.background.tertiary,
            borderRadius: theme.borderRadius.full,
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${analytics.overall.coverage}%`,
              height: '100%',
              backgroundColor: getCoverageColor(analytics.overall.coverage),
              transition: `width ${theme.transitions.base}`
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: theme.spacing[1],
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary
          }}
        >
          <span>{analytics.overall.documented} documented</span>
          <span>{analytics.overall.missing} missing</span>
        </div>
      </div>

      {/* By Container */}
      <div style={{ marginBottom: theme.spacing[5] }}>
        <h4
          style={{
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            margin: 0,
            marginBottom: theme.spacing[3]
          }}
        >
          By Container:
        </h4>

        {Object.entries(analytics.byContainer).map(([containerName, stats]) => (
          <div
            key={containerName}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[3],
              marginBottom: theme.spacing[2]
            }}
          >
            <span
              style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.primary,
                width: '100px',
                textTransform: 'capitalize'
              }}
            >
              {containerName}:
            </span>

            <div
              style={{
                flex: 1,
                height: '6px',
                backgroundColor: theme.colors.background.tertiary,
                borderRadius: theme.borderRadius.full,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${stats.coverage}%`,
                  height: '100%',
                  backgroundColor: getCoverageColor(stats.coverage),
                  transition: `width ${theme.transitions.base}`
                }}
              />
            </div>

            <span
              style={{
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: getCoverageColor(stats.coverage),
                minWidth: '45px',
                textAlign: 'right'
              }}
            >
              {stats.coverage}%
            </span>

            {stats.coverage < 70 && (
              <AlertCircle size={16} color={theme.colors.warning[500]} />
            )}
          </div>
        ))}
      </div>

      {/* Missing Help5 Items */}
      {analytics.missingItems.length > 0 && (
        <div style={{ marginBottom: theme.spacing[5] }}>
          <h4
            style={{
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              margin: 0,
              marginBottom: theme.spacing[3]
            }}
          >
            Missing Help5 ({analytics.missingItems.length} items):
          </h4>

          {analytics.missingItems.slice(0, 3).map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2],
                padding: theme.spacing[2],
                marginBottom: theme.spacing[1],
                backgroundColor: theme.colors.background.secondary,
                borderRadius: theme.borderRadius.sm,
                fontSize: theme.typography.fontSize.sm
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor:
                    item.priority === 'high'
                      ? theme.colors.error[500]
                      : theme.colors.warning[500],
                  flexShrink: 0
                }}
              />
              <span style={{ flex: 1, color: theme.colors.text.primary }}>
                {item.name}
              </span>
              <span
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.tertiary,
                  textTransform: 'capitalize'
                }}
              >
                ({item.container})
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Outdated Help5 */}
      {analytics.outdatedItems.length > 0 && (
        <div style={{ marginBottom: theme.spacing[4] }}>
          <h4
            style={{
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              margin: 0,
              marginBottom: theme.spacing[2]
            }}
          >
            Outdated Help5 (&gt;6 months): {analytics.outdatedItems.length} items
          </h4>
        </div>
      )}

      {/* View All Button */}
      <button
        onClick={onViewDetails}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing[2],
          padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
          backgroundColor: 'transparent',
          border: `1px solid ${theme.colors.border.default}`,
          borderRadius: theme.borderRadius.md,
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.primary[600],
          cursor: 'pointer',
          width: '100%',
          justifyContent: 'center',
          transition: `all ${theme.transitions.fast}`
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.background.secondary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        View All
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

Help5GovernanceDashboard.propTypes = {
  help5Records: PropTypes.arrayOf(
    PropTypes.shape({
      record_id: PropTypes.string,
      parent_id: PropTypes.string,
      title: PropTypes.string,
      completionScore: PropTypes.number,
      created_at: PropTypes.string
    })
  ),
  allElements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      name: PropTypes.string,
      container: PropTypes.string,
      priority: PropTypes.string
    })
  ),
  onViewDetails: PropTypes.func
};

Help5GovernanceDashboard.defaultProps = {
  help5Records: [],
  allElements: [],
  onViewDetails: () => {}
};

export default Help5GovernanceDashboard;
