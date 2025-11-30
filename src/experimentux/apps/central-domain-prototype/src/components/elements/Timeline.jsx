/**
 * Timeline Element
 * Activity timeline for CRM and project management
 */

import PropTypes from 'prop-types';
import * as Icons from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { motion } from 'framer-motion';

export function Timeline({ data, settings }) {
  const { resolveAllTokens, theme } = useTheme();

  // Safety check for theme
  if (!theme) {
    return <div>Loading...</div>;
  }

  const resolvedSettings = resolveAllTokens(settings);

  // Extract data
  const { items = [] } = data;

  // Extract settings
  const timelineSettings = resolvedSettings?.timeline || {};
  const {
    compact = false,
    showLine = true,
    animate = true,
    emptyMessage = 'No timeline items'
  } = timelineSettings;

  if (!items.length) {
    return (
      <div
        style={{
          padding: theme.spacing[6],
          textAlign: 'center',
          color: theme.colors.text.tertiary,
          fontSize: theme.typography.fontSize.sm,
          background: theme.colors.background.secondary,
          borderRadius: theme.borderRadius.md
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  const timelineStyle = {
    position: 'relative',
    paddingLeft: compact ? theme.spacing[8] : theme.spacing[10]
  };

  const lineStyle = {
    position: 'absolute',
    left: compact ? theme.spacing[2.5] : theme.spacing[4],
    top: theme.spacing[8],
    bottom: theme.spacing[8],
    width: '2px',
    backgroundColor: theme.colors.border.default
  };

  return (
    <div style={timelineStyle}>
      {showLine && <div style={lineStyle} />}
      {items.map((item, index) => (
        <TimelineItem
          key={item.id || index}
          item={item}
          compact={compact}
          animate={animate}
          isLast={index === items.length - 1}
          index={index}
          theme={theme}
        />
      ))}
    </div>
  );
}

function TimelineItem({ item, compact, isLast, animate, index, theme }) {
  const {
    date,
    time,
    type,
    description,
    icon,
    user,
    userAvatar,
    meta,
    status,
    statusColor,
    attachments,
    onClick
  } = item;

  const itemStyle = {
    position: 'relative',
    marginBottom: isLast ? '0' : (compact ? theme.spacing[4] : theme.spacing[6]),
    paddingBottom: isLast ? '0' : (compact ? theme.spacing[4] : theme.spacing[6])
  };

  // Determine icon color based on status
  const getIconColor = () => {
    if (statusColor) return statusColor;
    if (status === 'success') return theme.colors.success[500];
    if (status === 'error') return theme.colors.error[500];
    if (status === 'warning') return theme.colors.warning[500];
    if (status === 'info') return theme.colors.primary[500];
    return theme.colors.primary[500];
  };

  const iconColor = getIconColor();

  const iconWrapperStyle = {
    position: 'absolute',
    left: compact ? `-${theme.spacing[8]}` : `-${theme.spacing[10]}`,
    top: '0',
    width: compact ? theme.spacing[5] : theme.spacing[8],
    height: compact ? theme.spacing[5] : theme.spacing[8],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${iconColor}15`,
    border: `2px solid ${iconColor}`,
    borderRadius: theme.borderRadius.full,
    fontSize: compact ? theme.typography.fontSize.sm : theme.typography.fontSize.base
  };

  const contentStyle = {
    backgroundColor: theme.colors.background.elevated,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    transition: `all ${theme.transitions.base}`,
    cursor: onClick ? 'pointer' : 'default'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2]
  };

  const typeStyle = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary
  };

  const timeStyle = {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary
  };

  const descriptionStyle = {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.relaxed
  };

  const metaStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    marginTop: theme.spacing[3],
    paddingTop: theme.spacing[3],
    borderTop: `1px solid ${theme.colors.border.subtle}`,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary
  };

  // Get icon component
  const IconComponent = icon && Icons[icon] ? Icons[icon] : null;

  const ItemWrapper = animate ? motion.div : 'div';
  const animationProps = animate
    ? {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.3, delay: index * 0.1 }
      }
    : {};

  const hoverProps = onClick
    ? {
        whileHover: { scale: 1.01, boxShadow: theme.shadows.md },
        whileTap: { scale: 0.99 }
      }
    : {};

  return (
    <div style={itemStyle}>
      <div style={iconWrapperStyle}>
        {IconComponent ? (
          <IconComponent size={compact ? 12 : 16} color={iconColor} strokeWidth={2.5} />
        ) : (
          <span style={{ color: iconColor }}>●</span>
        )}
      </div>
      <ItemWrapper
        style={contentStyle}
        onClick={onClick}
        {...animationProps}
        {...hoverProps}
      >
        <div style={headerStyle}>
          <span style={typeStyle}>{type}</span>
          <span style={timeStyle}>
            {date} {time && `• ${time}`}
          </span>
        </div>
        <div style={descriptionStyle}>{description}</div>

        {/* Attachments */}
        {attachments && attachments.length > 0 && (
          <div
            style={{
              marginTop: theme.spacing[3],
              display: 'flex',
              flexWrap: 'wrap',
              gap: theme.spacing[2]
            }}
          >
            {attachments.map((attachment, idx) => (
              <div
                key={idx}
                style={{
                  padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.secondary,
                  background: theme.colors.background.secondary,
                  borderRadius: theme.borderRadius.sm,
                  border: `1px solid ${theme.colors.border.light}`
                }}
              >
                {attachment}
              </div>
            ))}
          </div>
        )}

        {/* User and meta info */}
        {(user || meta) && (
          <div style={metaStyle}>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                {userAvatar && (
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: theme.colors.background.tertiary
                    }}
                  >
                    {userAvatar.startsWith('http') ? (
                      <img
                        src={userAvatar}
                        alt={user}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: theme.colors.primary[100],
                          color: theme.colors.primary[600],
                          fontSize: '10px',
                          fontWeight: theme.typography.fontWeight.semibold
                        }}
                      >
                        {userAvatar}
                      </div>
                    )}
                  </div>
                )}
                <span>{user}</span>
              </div>
            )}
            {meta && <span>• {meta}</span>}
          </div>
        )}
      </ItemWrapper>
    </div>
  );
}

Timeline.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        date: PropTypes.string.isRequired,
        time: PropTypes.string,
        type: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        icon: PropTypes.string,
        user: PropTypes.string,
        userAvatar: PropTypes.string,
        meta: PropTypes.string,
        status: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
        statusColor: PropTypes.string,
        attachments: PropTypes.arrayOf(PropTypes.string),
        onClick: PropTypes.func
      })
    )
  }),
  settings: PropTypes.shape({
    timeline: PropTypes.shape({
      compact: PropTypes.bool,
      showLine: PropTypes.bool,
      animate: PropTypes.bool,
      emptyMessage: PropTypes.string
    })
  })
};

TimelineItem.propTypes = {
  item: PropTypes.object.isRequired,
  compact: PropTypes.bool,
  animate: PropTypes.bool,
  isLast: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
};
