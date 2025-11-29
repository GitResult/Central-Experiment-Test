import React from "react";
import { useTheme } from '../../design-system';

export function WorkspaceNavigator({ onOpenCalendar }) {
  const { theme } = useTheme();
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1rem",
      }}
    >
      <div>
        <h1 style={{ margin: 0, color: theme.textPrimary }}>Workspace Navigator</h1>
        <p style={{ margin: 0, fontSize: "0.875rem", color: theme.textSecondary }}>
          Access key workspaces including Calendar, Events, and Reporting.
        </p>
      </div>
      <button
        onClick={onOpenCalendar}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "999px",
          border: "none",
          background: theme.primary,
          color: "white",
          fontSize: "0.875rem",
          cursor: "pointer",
        }}
      >
        Calendar
      </button>
    </header>
  );
}
