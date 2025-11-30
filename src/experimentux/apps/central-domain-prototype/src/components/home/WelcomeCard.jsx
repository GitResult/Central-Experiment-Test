/**
 * WelcomeCard Component
 * Apple-inspired personalized greeting with glass morphism
 */

import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Sunrise, Sun, Moon } from 'lucide-react';
import { theme } from '../../config/theme';

export function WelcomeCard({ userName = 'Demo User' }) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const dateStr = now.toLocaleDateString('en-US', dateOptions);

  // Time-based icon and gradient
  const getTimeBasedStyle = () => {
    if (hour < 12) {
      return {
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        Icon: Sunrise,
        color: '#667eea'
      };
    } else if (hour < 18) {
      return {
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        Icon: Sun,
        color: '#E89B3C'
      };
    } else {
      return {
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        Icon: Moon,
        color: '#4facfe'
      };
    }
  };

  const timeStyle = getTimeBasedStyle();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{
        background: theme.colors.background.primary,
        borderRadius: theme.borderRadius.xl,
        boxShadow: theme.shadows.elevated,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Gradient background accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: timeStyle.gradient
        }}
      />

      <div style={{ padding: theme.components.card.padding.lg }}>
        <div className="flex items-start justify-between">
          <div style={{ flex: 1 }}>
            {/* Greeting */}
            <div className="flex items-center gap-3 mb-2">
              <h2
                style={{
                  fontSize: theme.typography.fontSize['4xl'],
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.primary,
                  letterSpacing: theme.typography.letterSpacing.tight,
                  lineHeight: theme.typography.lineHeight.tight,
                  fontFamily: theme.typography.fontFamily.display
                }}
              >
                {greeting}
              </h2>
              <Sparkles
                size={24}
                style={{
                  color: theme.colors.primary[500],
                  strokeWidth: 2
                }}
              />
            </div>

            {/* Date */}
            <p
              style={{
                fontSize: theme.typography.fontSize.md,
                color: theme.colors.text.tertiary,
                fontWeight: theme.typography.fontWeight.medium,
                letterSpacing: theme.typography.letterSpacing.wide,
                marginBottom: theme.spacing[6]
              }}
            >
              {dateStr}
            </p>

            {/* Suggested action */}
            <div style={{ marginTop: theme.spacing[6] }}>
              <p
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.tertiary,
                  fontWeight: theme.typography.fontWeight.medium,
                  marginBottom: theme.spacing[3],
                  letterSpacing: theme.typography.letterSpacing.wide,
                  textTransform: 'uppercase'
                }}
              >
                Suggested next step
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-2"
                style={{
                  background: 'white',
                  color: theme.colors.primary[600],
                  padding: `${theme.spacing[3]} ${theme.spacing[5]}`,
                  borderRadius: theme.borderRadius.lg,
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.semibold,
                  border: `1px solid ${theme.colors.border.default}`,
                  cursor: 'pointer',
                  transition: `all ${theme.transitions.base}`,
                  boxShadow: theme.shadows.sm,
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                <span>Get Started</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                  style={{
                    strokeWidth: 2.5,
                    transition: theme.transitions.base
                  }}
                />
              </motion.button>
            </div>
          </div>

          {/* Time-based icon */}
          <div
            style={{
              marginLeft: theme.spacing[6],
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
            }}
          >
            <timeStyle.Icon
              size={64}
              style={{
                color: timeStyle.color,
                strokeWidth: 1.5
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

WelcomeCard.propTypes = {
  userName: PropTypes.string
};
