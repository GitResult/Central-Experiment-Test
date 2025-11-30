/**
 * Help5 System
 * Self-documenting system with 5W framework
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { HelpCircle, Users, MapPin, Calendar, Lightbulb, X } from 'lucide-react';
import { theme } from '../../config/theme';

const HELP5_FIELDS = [
  { id: 'what', label: 'What', icon: HelpCircle, placeholder: 'What does this do?' },
  { id: 'who', label: 'Who', icon: Users, placeholder: 'Who uses this?' },
  { id: 'where', label: 'Where', icon: MapPin, placeholder: 'Where is this used?' },
  { id: 'when', label: 'When', icon: Calendar, placeholder: 'When is this used?' },
  { id: 'why', label: 'Why', icon: Lightbulb, placeholder: 'Why is this needed?' }
];

export function Help5System({ isOpen, onClose, item, onSave }) {
  const [formData, setFormData] = useState({
    what: item?.help5?.what || '',
    who: item?.help5?.who || '',
    where: item?.help5?.where || '',
    when: item?.help5?.when || '',
    why: item?.help5?.why || ''
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave?.(formData);
    onClose();
  };

  const completionScore = Object.values(formData).filter(v => v && v.length >= 10).length * 20;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.background.overlay,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: theme.zIndex.modal,
      padding: theme.spacing[4]
    }}>
      <div style={{
        backgroundColor: theme.colors.background.elevated,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows['2xl'],
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: theme.spacing[6],
          borderBottom: `1px solid ${theme.colors.border.default}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              margin: 0,
              marginBottom: theme.spacing[1]
            }}>
              Help5 Documentation
            </h2>
            <p style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              margin: 0
            }}>
              Complete the 5W framework
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: theme.spacing[2]
          }}>
            <X size={24} color={theme.colors.text.secondary} />
          </button>
        </div>

        {/* Progress */}
        <div style={{
          padding: theme.spacing[4],
          backgroundColor: theme.colors.background.secondary,
          borderBottom: `1px solid ${theme.colors.border.default}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing[2]
          }}>
            <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
              Completion
            </span>
            <span style={{
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.semibold,
              color: completionScore >= 80 ? theme.colors.success[600] : theme.colors.warning[600]
            }}>
              {completionScore}%
            </span>
          </div>
          <div style={{
            height: '8px',
            backgroundColor: theme.colors.background.tertiary,
            borderRadius: theme.borderRadius.full,
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${completionScore}%`,
              height: '100%',
              backgroundColor: completionScore >= 80 ? theme.colors.success[500] : theme.colors.warning[500],
              transition: `width ${theme.transitions.base}`
            }} />
          </div>
        </div>

        {/* Form */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: theme.spacing[6]
        }}>
          {HELP5_FIELDS.map(({ id, label, icon: Icon, placeholder }) => (
            <div key={id} style={{ marginBottom: theme.spacing[4] }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2],
                marginBottom: theme.spacing[2],
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary
              }}>
                <Icon size={16} />
                {label}
              </label>
              <textarea
                value={formData[id]}
                onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                placeholder={placeholder}
                rows={3}
                style={{
                  width: '100%',
                  padding: theme.spacing[3],
                  border: `1px solid ${theme.colors.border.default}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.sm,
                  fontFamily: theme.typography.fontFamily.sans,
                  resize: 'vertical',
                  color: theme.colors.text.primary
                }}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: theme.spacing[6],
          borderTop: `1px solid ${theme.colors.border.default}`,
          display: 'flex',
          gap: theme.spacing[3],
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
              backgroundColor: 'transparent',
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
              backgroundColor: theme.colors.primary[500],
              border: 'none',
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.inverse,
              cursor: 'pointer',
              fontWeight: theme.typography.fontWeight.medium
            }}
          >
            Save Documentation
          </button>
        </div>
      </div>
    </div>
  );
}

Help5System.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  onSave: PropTypes.func
};

export default Help5System;
