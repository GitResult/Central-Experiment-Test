import React from "react";
import { useTheme, SPACING, ICONS } from '../design-system';
import { getTransition } from '../utils';

export function EmptyState({
  icon: Icon = ICONS.inbox,
  title,
  description,
  action,
  actionLabel,
  variant = "default"
}) {
  const { theme } = useTheme();

  const variants = {
    default: { iconBg: theme.backgroundTertiary, iconColor: theme.textMuted },
    search: { iconBg: theme.primaryLight, iconColor: theme.primary },
    error: { iconBg: theme.errorLight, iconColor: theme.error },
    filter: { iconBg: theme.warningLight, iconColor: theme.warning },
  };

  const { iconBg, iconColor } = variants[variant] || variants.default;

  return (
    <div style={{
      padding: SPACING.xxxl,
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: SPACING.lg,
      animation: "fadeIn 0.3s ease-out",
    }}>
      <div style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: iconBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Icon size={40} color={iconColor} />
      </div>

      <div>
        <h3 style={{
          margin: 0,
          marginBottom: SPACING.xs,
          fontSize: "1.125rem",
          fontWeight: 600,
          color: theme.textPrimary,
        }}>
          {title}
        </h3>
        <p style={{
          margin: 0,
          color: theme.textMuted,
          fontSize: "0.875rem",
          maxWidth: "320px",
          lineHeight: 1.5,
        }}>
          {description}
        </p>
      </div>

      {action && actionLabel && (
        <button
          onClick={action}
          style={{
            padding: `${SPACING.sm} ${SPACING.lg}`,
            background: theme.primary,
            color: "white",
            border: "none",
            borderRadius: SPACING.sm,
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "0.875rem",
            transition: getTransition("background", "fast"),
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export const EMPTY_STATES = {
  noResults: {
    icon: ICONS.explorer,
    title: "No results found",
    description: "Try adjusting your search or filter criteria to find what you're looking for.",
    variant: "search",
  },
  noAttendees: {
    icon: ICONS.users,
    title: "No attendees yet",
    description: "Attendees will appear here once they register for this event.",
    variant: "default",
  },
  noFiltersMatch: {
    icon: ICONS.filter,
    title: "No matches",
    description: "No attendees match the current filter combination. Try removing some filters.",
    variant: "filter",
  },
  error: {
    icon: ICONS.alertTriangle,
    title: "Failed to load data",
    description: "Something went wrong while loading. Please try again.",
    variant: "error",
  },
};
