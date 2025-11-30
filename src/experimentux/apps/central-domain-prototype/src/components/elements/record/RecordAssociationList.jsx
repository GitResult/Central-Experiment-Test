/**
 * RecordAssociationList Component
 * Displays related records in a list format with avatars/icons
 * Type: record - association-list
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../theme/ThemeProvider';
import { motion } from 'framer-motion';
import { ChevronRight, ExternalLink } from 'lucide-react';

export const RecordAssociationList = ({ data, settings }) => {
  const { resolveAllTokens, theme } = useTheme();

  // Safety check for theme
  if (!theme) {
    return <div>Loading...</div>;
  }

  const resolvedSettings = resolveAllTokens(settings);

  // Extract settings
  const listSettings = resolvedSettings?.record || {};
  const {
    showAvatar = true,
    showIcon = false,
    showChevron = true,
    showStatus = false,
    dividers = true,
    compact = false,
    maxItems,
    emptyMessage = 'No associations'
  } = listSettings;

  // Extract data - expect array of associated records
  const associations = Array.isArray(data) ? data : [];
  const displayedAssociations = maxItems ? associations.slice(0, maxItems) : associations;
  const hasMore = maxItems && associations.length > maxItems;

  if (!associations.length) {
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

  // Render individual association item
  const renderAssociation = (association, index) => {
    const isLast = index === displayedAssociations.length - 1;

    const itemStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[3],
      padding: compact ? theme.spacing[2] : theme.spacing[3],
      borderBottom: dividers && !isLast ? `1px solid ${theme.colors.border.light}` : 'none',
      cursor: association.onClick ? 'pointer' : 'default',
      transition: theme.transitions.base,
      background: 'transparent'
    };

    const hoverStyle = association.onClick
      ? {
          whileHover: { backgroundColor: theme.colors.background.secondary },
          whileTap: { scale: 0.98 }
        }
      : {};

    return (
      <motion.div
        key={association.id || index}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        {...hoverStyle}
        style={itemStyle}
        onClick={association.onClick}
      >
        {/* Avatar or Icon */}
        {showAvatar && association.avatar && (
          <div
            style={{
              width: compact ? '32px' : '40px',
              height: compact ? '32px' : '40px',
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              background: theme.colors.background.tertiary
            }}
          >
            {association.avatar.startsWith('http') ? (
              <img
                src={association.avatar}
                alt={association.name || ''}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
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
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.semibold
                }}
              >
                {association.avatar}
              </div>
            )}
          </div>
        )}

        {/* Icon (alternative to avatar) */}
        {showIcon && association.icon && (
          <div
            style={{
              width: compact ? '32px' : '40px',
              height: compact ? '32px' : '40px',
              borderRadius: theme.borderRadius.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: theme.colors.background.tertiary,
              flexShrink: 0
            }}
          >
            <association.icon
              size={compact ? 16 : 20}
              style={{ color: theme.colors.text.secondary }}
            />
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Primary text */}
          <div
            style={{
              fontSize: compact ? theme.typography.fontSize.sm : theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.primary,
              marginBottom: association.secondary ? theme.spacing[0.5] : 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {association.primary || association.name}
          </div>

          {/* Secondary text */}
          {association.secondary && (
            <div
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.tertiary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {association.secondary}
            </div>
          )}
        </div>

        {/* Status indicator */}
        {showStatus && association.status && (
          <div
            style={{
              padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
              fontSize: theme.typography.fontSize.xs,
              fontWeight: theme.typography.fontWeight.medium,
              borderRadius: theme.borderRadius.sm,
              background: association.statusColor
                ? `${association.statusColor}15`
                : theme.colors.neutral[100],
              color: association.statusColor || theme.colors.text.secondary,
              flexShrink: 0
            }}
          >
            {association.status}
          </div>
        )}

        {/* Meta info (e.g., count, date) */}
        {association.meta && (
          <div
            style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              flexShrink: 0
            }}
          >
            {association.meta}
          </div>
        )}

        {/* Chevron or external link icon */}
        {showChevron && association.onClick && (
          association.external ? (
            <ExternalLink
              size={16}
              style={{ color: theme.colors.text.tertiary, flexShrink: 0 }}
            />
          ) : (
            <ChevronRight
              size={16}
              style={{ color: theme.colors.text.tertiary, flexShrink: 0 }}
            />
          )
        )}
      </motion.div>
    );
  };

  return (
    <div
      style={{
        background: theme.colors.background.primary,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border.default}`,
        overflow: 'hidden'
      }}
    >
      {displayedAssociations.map((association, index) =>
        renderAssociation(association, index)
      )}

      {/* Show more indicator */}
      {hasMore && (
        <div
          style={{
            padding: theme.spacing[3],
            textAlign: 'center',
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            borderTop: `1px solid ${theme.colors.border.light}`,
            background: theme.colors.background.secondary
          }}
        >
          +{associations.length - maxItems} more
        </div>
      )}
    </div>
  );
};

RecordAssociationList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      avatar: PropTypes.string, // URL or initials
      icon: PropTypes.elementType,
      primary: PropTypes.string,
      name: PropTypes.string,
      secondary: PropTypes.string,
      status: PropTypes.string,
      statusColor: PropTypes.string,
      meta: PropTypes.string,
      external: PropTypes.bool,
      onClick: PropTypes.func
    })
  ),
  settings: PropTypes.shape({
    record: PropTypes.shape({
      showAvatar: PropTypes.bool,
      showIcon: PropTypes.bool,
      showChevron: PropTypes.bool,
      showStatus: PropTypes.bool,
      dividers: PropTypes.bool,
      compact: PropTypes.bool,
      maxItems: PropTypes.number,
      emptyMessage: PropTypes.string
    })
  })
};

export default RecordAssociationList;
