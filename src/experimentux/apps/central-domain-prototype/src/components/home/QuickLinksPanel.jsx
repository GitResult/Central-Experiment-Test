/**
 * QuickLinksPanel - Apple-inspired quick actions
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Palette, FileText, CheckSquare } from 'lucide-react';
import { theme } from '../../config/theme';

export function QuickLinksPanel() {
  const navigate = useNavigate();
  const links = [
    { id: 1, icon: Palette, label: 'New Canvas', url: '/canvas/new' },
    { id: 2, icon: FileText, label: 'New Page', url: '/page/new' },
    { id: 3, icon: CheckSquare, label: 'New Task', url: '/tasks/new' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      style={{
        marginBottom: theme.spacing[4]
      }}
    >
      <h3
        style={{
          fontSize: theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.text.primary,
          marginBottom: theme.spacing[4]
        }}
      >
        Quick Actions
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
        {links.map((link) => (
          <motion.button
            key={link.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(link.url)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              alignSelf: 'flex-start',
              gap: theme.spacing[2.5],
              padding: `${theme.spacing[2.5]} ${theme.spacing[4]}`,
              background: 'white',
              border: `1px solid ${theme.colors.neutral[900]}`,
              borderRadius: theme.borderRadius.full,
              cursor: 'pointer',
              transition: `all ${theme.transitions.base}`,
              textAlign: 'left'
            }}
          >
            <link.icon size={18} style={{ color: theme.colors.neutral[900], strokeWidth: 1.5 }} />
            <span
              style={{
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.text.primary
              }}
            >
              {link.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
