import React, { useState } from "react";
import { useTheme } from '../../design-system';
import { getTransition } from '../../utils';

export function CalendarView({ event, onEventClick }) {
  const { theme } = useTheme();
  const [mode, setMode] = useState("month");
  const [hoveredDay, setHoveredDay] = useState(null);

  const daysInJune = 30;
  const startDayOfWeek = 0;
  const eventDays = [12, 13, 14];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarDays = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInJune; day++) {
    calendarDays.push(day);
  }

  const isEventDay = (day) => eventDays.includes(day);
  const isEventStart = (day) => day === 12;
  const isEventEnd = (day) => day === 14;

  return (
    <div
      style={{
        background: theme.background,
        borderRadius: "0.75rem",
        padding: "1rem",
        boxShadow: theme.shadow,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2 style={{ margin: 0, color: theme.textPrimary }}>Calendar</h2>
        <div style={{ display: "inline-flex", borderRadius: "999px", background: theme.backgroundTertiary }}>
          <button
            onClick={() => setMode("month")}
            style={{
              border: "none",
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
              background: mode === "month" ? theme.background : "transparent",
              color: theme.textPrimary,
              cursor: "pointer",
              fontSize: "0.75rem",
            }}
          >
            Month
          </button>
          <button
            onClick={() => setMode("year")}
            style={{
              border: "none",
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
              background: mode === "year" ? theme.background : "transparent",
              color: theme.textPrimary,
              cursor: "pointer",
              fontSize: "0.75rem",
            }}
          >
            Year
          </button>
        </div>
      </div>

      {mode === "month" ? (
        <div style={{ padding: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
            <button style={{ border: "none", background: "transparent", cursor: "pointer", color: theme.textMuted, fontSize: "1rem", padding: "0.25rem 0.5rem" }}>←</button>
            <h3 style={{ margin: 0, color: theme.textPrimary, fontSize: "1rem" }}>June 2025</h3>
            <button style={{ border: "none", background: "transparent", cursor: "pointer", color: theme.textMuted, fontSize: "1rem", padding: "0.25rem 0.5rem" }}>→</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "0.5rem" }}>
            {weekDays.map((day) => (
              <div key={day} style={{ textAlign: "center", fontSize: "0.7rem", fontWeight: 600, color: theme.textMuted, padding: "0.25rem" }}>
                {day}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} style={{ height: "3rem" }} />;
              }
              const hasEvent = isEventDay(day);
              const isStart = isEventStart(day);
              const isEnd = isEventEnd(day);
              const isHovered = hoveredDay === day && hasEvent;

              return (
                <div
                  key={day}
                  onClick={hasEvent ? onEventClick : undefined}
                  onMouseEnter={() => hasEvent && setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  style={{
                    height: "3rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    paddingTop: "0.25rem",
                    borderRadius: hasEvent ? (isStart ? "0.5rem 0 0 0.5rem" : isEnd ? "0 0.5rem 0.5rem 0" : "0") : "0.25rem",
                    background: hasEvent
                      ? isHovered
                        ? `linear-gradient(135deg, ${theme.primary}, #0ea5e9)`
                        : `linear-gradient(135deg, ${theme.primary}dd, #0ea5e9dd)`
                      : "transparent",
                    cursor: hasEvent ? "pointer" : "default",
                    transition: getTransition(["background", "transform"], "fast"),
                    transform: isHovered ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  <span style={{ fontSize: "0.8rem", fontWeight: hasEvent ? 600 : 400, color: hasEvent ? "white" : theme.textPrimary }}>
                    {day}
                  </span>
                  {isStart && (
                    <span style={{ fontSize: "0.55rem", color: "white", marginTop: "2px", textAlign: "center", lineHeight: 1.1 }}>
                      Conference
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "1rem", padding: "0.75rem", background: theme.backgroundSecondary, borderRadius: "0.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: `linear-gradient(135deg, ${theme.primary}, #0ea5e9)` }} />
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: theme.textPrimary }}>{event.name}</div>
              <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>{event.startDate} – {event.endDate} · Click to preview</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: "1rem" }}>
          <h3 style={{ marginTop: 0, marginBottom: "0.5rem", color: theme.textPrimary }}>2025</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.75rem", fontSize: "0.75rem", color: theme.textPrimary }}>
            <div style={{ borderRadius: "0.5rem", border: `1px solid ${theme.border}`, padding: "0.5rem" }}>
              <strong>June</strong>
              <div
                style={{ marginTop: "0.5rem", padding: "0.5rem", borderRadius: "0.5rem", background: `linear-gradient(to right, ${theme.primary}, #0ea5e9, ${theme.success})`, color: "white", cursor: "pointer" }}
                onClick={onEventClick}
              >
                <div>{event.name}</div>
                <div style={{ fontSize: "0.7rem" }}>{event.startDate} – {event.endDate}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
