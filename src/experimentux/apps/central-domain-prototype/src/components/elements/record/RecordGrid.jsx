/**
 * RecordGrid Component
 * Flexible grid layout for rendering collections of records
 * Type: record - grid
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../theme/ThemeProvider';
import { motion } from 'framer-motion';

export const RecordGrid = ({ data, settings }) => {
  const { resolveAllTokens, theme } = useTheme();

  // Safety check for theme
  if (!theme) {
    return <div>Loading...</div>;
  }

  const resolvedSettings = resolveAllTokens(settings);

  // Extract settings
  const gridSettings = resolvedSettings?.record || {};
  const {
    columns = { mobile: 1, tablet: 2, desktop: 3 },
    gap = theme.spacing[4],
    itemAspectRatio,
    itemRounded = true,
    itemShadow = false,
    staggerAnimation = true
  } = gridSettings;

  // Extract data - expect array of items
  const items = Array.isArray(data) ? data : [];

  if (!items.length) {
    return (
      <div
        style={{
          padding: theme.spacing[8],
          textAlign: 'center',
          color: theme.colors.text.tertiary,
          fontSize: theme.typography.fontSize.sm,
          background: theme.colors.background.tertiary,
          borderRadius: theme.borderRadius.lg
        }}
      >
        No items to display
      </div>
    );
  }

  // Determine grid columns based on responsive settings
  const getGridColumns = () => {
    if (typeof columns === 'number') {
      return columns;
    }
    // Default to desktop columns for SSR
    return columns.desktop || 3;
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)`,
    gap: gap,
    width: '100%'
  };

  // Add responsive columns via media queries if columns is an object
  const responsiveStyles = typeof columns === 'object' ? `
    @media (max-width: 768px) {
      .record-grid {
        grid-template-columns: repeat(${columns.mobile || 1}, 1fr);
      }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
      .record-grid {
        grid-template-columns: repeat(${columns.tablet || 2}, 1fr);
      }
    }
    @media (min-width: 1025px) {
      .record-grid {
        grid-template-columns: repeat(${columns.desktop || 3}, 1fr);
      }
    }
  ` : '';

  // Render individual grid item
  const renderItem = (item, index) => {
    const itemStyle = {
      background: theme.colors.background.primary,
      borderRadius: itemRounded ? theme.borderRadius.lg : 0,
      boxShadow: itemShadow ? theme.shadows.md : 'none',
      overflow: 'hidden',
      transition: theme.transitions.base,
      cursor: item.onClick ? 'pointer' : 'default'
    };

    const containerMotionProps = staggerAnimation
      ? {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3, delay: index * 0.05 }
        }
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3 }
        };

    const interactionProps = item.onClick
      ? {
          whileHover: { scale: 1.02, boxShadow: theme.shadows.lg },
          whileTap: { scale: 0.98 }
        }
      : {};

    return (
      <motion.div
        key={item.id || index}
        {...containerMotionProps}
        {...interactionProps}
        style={itemStyle}
        onClick={item.onClick}
      >
        {/* Image */}
        {item.image && (
          <div
            style={{
              width: '100%',
              aspectRatio: itemAspectRatio || 'auto',
              overflow: 'hidden',
              background: theme.colors.background.tertiary
            }}
          >
            <img
              src={item.image}
              alt={item.imageAlt || item.title || ''}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div
          style={{
            padding: theme.spacing[4]
          }}
        >
          {/* Badge/Tag */}
          {item.badge && (
            <span
              style={{
                display: 'inline-block',
                padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.primary[600],
                background: theme.colors.primary[50],
                borderRadius: theme.borderRadius.sm,
                marginBottom: theme.spacing[2]
              }}
            >
              {item.badge}
            </span>
          )}

          {/* Title */}
          {item.title && (
            <h3
              style={{
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing[2],
                lineHeight: theme.typography.lineHeight.tight
              }}
            >
              {item.title}
            </h3>
          )}

          {/* Subtitle */}
          {item.subtitle && (
            <p
              style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing[3],
                lineHeight: theme.typography.lineHeight.relaxed
              }}
            >
              {item.subtitle}
            </p>
          )}

          {/* Description */}
          {item.description && (
            <p
              style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.tertiary,
                lineHeight: theme.typography.lineHeight.relaxed
              }}
            >
              {item.description}
            </p>
          )}

          {/* Meta info (e.g., price, date, stats) */}
          {item.meta && (
            <div
              style={{
                marginTop: theme.spacing[3],
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.text.primary
              }}
            >
              {item.meta}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <div className="record-grid" style={gridStyle}>
        {items.map((item, index) => renderItem(item, index))}
      </div>

      {/* Responsive styles */}
      {responsiveStyles && <style>{responsiveStyles}</style>}
    </>
  );
};

RecordGrid.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      image: PropTypes.string,
      imageAlt: PropTypes.string,
      badge: PropTypes.string,
      title: PropTypes.string,
      subtitle: PropTypes.string,
      description: PropTypes.string,
      meta: PropTypes.string,
      onClick: PropTypes.func
    })
  ),
  settings: PropTypes.shape({
    record: PropTypes.shape({
      columns: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          mobile: PropTypes.number,
          tablet: PropTypes.number,
          desktop: PropTypes.number
        })
      ]),
      gap: PropTypes.string,
      itemAspectRatio: PropTypes.string,
      itemRounded: PropTypes.bool,
      itemShadow: PropTypes.bool,
      staggerAnimation: PropTypes.bool
    })
  })
};

export default RecordGrid;
