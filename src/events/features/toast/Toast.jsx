import React from "react";
import { useTheme, SPACING, ICONS } from '../../design-system';
import { getTransition } from '../../utils';

export function Toast({ type = "info", title, message, onClose }) {
  const { theme } = useTheme();

  const types = {
    success: { bg: theme.successLight, color: theme.success, Icon: ICONS.check },
    error: { bg: theme.errorLight, color: theme.error, Icon: ICONS.x },
    warning: { bg: theme.warningLight, color: theme.warning, Icon: ICONS.alertTriangle },
    info: { bg: theme.primaryLight, color: theme.primary, Icon: ICONS.info },
  };

  const { bg, color, Icon } = types[type] || types.info;

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: SPACING.md,
        padding: SPACING.md,
        background: theme.background,
        border: `1px solid ${theme.border}`,
        borderLeft: `4px solid ${color}`,
        borderRadius: SPACING.sm,
        boxShadow: theme.shadowLg,
        minWidth: "300px",
        maxWidth: "400px",
        pointerEvents: "auto",
        animation: "slideInRight 0.3s ease-out",
      }}
    >
      <div style={{
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon size={14} color={color} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div style={{ fontWeight: 600, fontSize: "0.875rem", color: theme.textPrimary }}>
            {title}
          </div>
        )}
        {message && (
          <div style={{ fontSize: "0.8rem", color: theme.textMuted, marginTop: title ? SPACING.xs : 0 }}>
            {message}
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: SPACING.xs,
          color: theme.textMuted,
          flexShrink: 0,
          transition: getTransition("color", "fast"),
        }}
      >
        <ICONS.close size={14} />
      </button>
    </div>
  );
}
