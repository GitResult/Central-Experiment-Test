/**
 * JourneyCard Component
 * Apple-inspired prominent CTA for guided onboarding
 */

import { motion } from 'framer-motion';
import { Rocket, ArrowRight } from 'lucide-react';
import { theme } from '../../config/theme';

export function JourneyCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: theme.borderRadius.xl,
        boxShadow: theme.shadows.elevated,
        background: theme.colors.background.primary
      }}
    >
      <div
        style={{
          padding: theme.components.card.padding.xl
        }}
      >
        <div className="flex items-start justify-between gap-8">
          <div style={{ flex: 1 }}>
            {/* Title */}
            <h3
              style={{
                fontSize: theme.typography.fontSize['3xl'],
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing[3],
                letterSpacing: theme.typography.letterSpacing.tight,
                lineHeight: theme.typography.lineHeight.tight,
                fontFamily: theme.typography.fontFamily.display
              }}
            >
              Your Journey with Central
            </h3>

            {/* Description */}
            <p
              style={{
                fontSize: theme.typography.fontSize.md,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing[6],
                lineHeight: theme.typography.lineHeight.relaxed
              }}
            >
              A guided experience to help you get started and make the most of Central.
            </p>

            {/* CTA button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-2"
              style={{
                background: theme.colors.background.primary,
                color: theme.colors.primary[600],
                padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
                borderRadius: theme.borderRadius.lg,
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.semibold,
                border: 'none',
                cursor: 'pointer',
                transition: `all ${theme.transitions.base}`,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              <span>Start Journey</span>
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

          {/* Illustration */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
            }}
          >
            <Rocket
              size={96}
              style={{
                color: theme.colors.primary[400],
                strokeWidth: 1.5
              }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
