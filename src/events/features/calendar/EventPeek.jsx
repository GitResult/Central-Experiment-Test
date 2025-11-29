import React, { useEffect } from "react";
import { useTheme } from '../../design-system';

export function EventPeek({ event, kpis, onClose, onViewEvent }) {
  const { theme } = useTheme();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.4)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 40,
      }}
    >
      <div
        style={{
          background: theme.background,
          borderRadius: "0.75rem 0.75rem 0 0",
          padding: "1rem 1.25rem",
          width: "100%",
          maxWidth: "960px",
          boxShadow: theme.shadowLg,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <h2 style={{ margin: 0, color: theme.textPrimary }}>{event.name}</h2>
            <p style={{ margin: "0.25rem 0", fontSize: "0.875rem", color: theme.textSecondary }}>
              {event.startDate} – {event.endDate} · {event.venue}
            </p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem", fontSize: "0.875rem" }}>
              <div>
                <div style={{ color: theme.textMuted }}>Total Attendees</div>
                <strong style={{ color: theme.textPrimary }}>{kpis.totalAttendees}</strong>
              </div>
              <div>
                <div style={{ color: theme.textMuted }}>Total Revenue</div>
                <strong style={{ color: theme.textPrimary }}>${(event.totalRevenue / 1000).toFixed(1)}k</strong>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <button
              onClick={onClose}
              style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "0.875rem", color: theme.textMuted }}
            >
              Close
            </button>
            <button
              onClick={onViewEvent}
              style={{ padding: "0.5rem 1rem", borderRadius: "999px", border: "none", background: theme.primary, color: "white", fontSize: "0.875rem", cursor: "pointer" }}
            >
              View event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
