/**
 * FacetFields Component
 *
 * Displays schema structure and data quality.
 */

import PropTypes from 'prop-types';
import { theme } from '../../../config/theme';

const FIELDS_COLOR = theme.colors.charts.accent2;

export function FacetFields({ data }) {
  const { fields } = data;

  if (!fields || fields.length === 0) {
    return (
      <div style={{
        height: '140px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.text.tertiary,
        fontSize: theme.typography.fontSize.sm
      }}>
        No field data available
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {fields.slice(0, 4).map((field, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 0',
            fontSize: theme.typography.fontSize.sm,
            cursor: 'pointer',
            transition: `color ${theme.transitions.fast}`
          }}
          onMouseOver={(e) => e.currentTarget.style.color = FIELDS_COLOR}
          onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}
        >
          {/* Field Name & Type */}
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: theme.colors.text.primary }}>{field.name}</span>
            <span style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              background: theme.colors.background.tertiary,
              padding: '2px 8px',
              borderRadius: theme.borderRadius.sm
            }}>
              {field.type}
            </span>
          </span>

          {/* Fill Indicator */}
          <span style={{ display: 'flex', gap: '3px' }}>
            {[1, 2, 3, 4, 5].map((level) => (
              <span
                key={level}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '1px',
                  background: FIELDS_COLOR,
                  opacity: level <= field.fill ? 1 : 0.15
                }}
              />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

FacetFields.propTypes = {
  data: PropTypes.shape({
    fields: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
      fill: PropTypes.number
    }))
  }).isRequired
};
