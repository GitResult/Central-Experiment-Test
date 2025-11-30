/**
 * FacetActions Component
 *
 * Displays operations and automations.
 */

import PropTypes from 'prop-types';
import { Plus, Download, Upload, Zap } from 'lucide-react';
import { theme } from '../../../config/theme';

const ACTIONS_COLOR = theme.colors.error[500];

export function FacetActions({ data }) {
  const { automations = [] } = data;

  return (
    <div>
      {/* Quick Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '16px'
      }}>
        {[
          { icon: Plus, label: 'Add' },
          { icon: Download, label: 'Import' },
          { icon: Upload, label: 'Export' }
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '14px 10px',
              background: theme.colors.background.tertiary,
              border: 'none',
              borderRadius: theme.borderRadius.lg,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.secondary,
              transition: `all ${theme.transitions.fast}`
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = `${ACTIONS_COLOR}15`;
              e.currentTarget.style.color = ACTIONS_COLOR;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = theme.colors.background.tertiary;
              e.currentTarget.style.color = theme.colors.text.secondary;
            }}
          >
            <Icon size={18} strokeWidth={1.5} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Automations */}
      {automations.length > 0 && (
        <>
          <div style={{
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.medium,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: theme.colors.text.tertiary,
            marginBottom: '10px'
          }}>
            Automations
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {automations.slice(0, 2).map((automation, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  fontSize: theme.typography.fontSize.sm
                }}
              >
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: theme.colors.text.primary
                }}>
                  <Zap size={14} strokeWidth={1.5} style={{ color: ACTIONS_COLOR }} />
                  <span>{automation}</span>
                </span>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: theme.colors.success[500]
                }} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

FacetActions.propTypes = {
  data: PropTypes.shape({
    automations: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};
