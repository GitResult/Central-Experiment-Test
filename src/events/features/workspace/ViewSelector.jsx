import React, { useState, useEffect, useRef } from "react";
import { useTheme, SPACING, ICONS } from '../../design-system';
import { getTransition } from '../../utils';

export function ListingFilterHeader({ selectedView, savedViews = [], onSaveView, onLoadView, onDeleteView, onResetView }) {
  const { theme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!showDropdown) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: SPACING.sm,
      }}
    >
      <div style={{ position: "relative" }} ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            fontSize: "0.8rem",
            color: theme.textSecondary,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: SPACING.xs,
          }}
        >
          View: <strong style={{ color: theme.textPrimary }}>{selectedView}</strong>
          <ICONS.chevronDown size={12} />
        </button>
        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              marginTop: SPACING.xs,
              background: theme.background,
              border: `1px solid ${theme.border}`,
              borderRadius: SPACING.sm,
              boxShadow: theme.shadowMd,
              minWidth: "180px",
              zIndex: 20,
            }}
          >
            <button
              onClick={() => { onResetView && onResetView(); setShowDropdown(false); }}
              style={{
                width: "100%",
                padding: `${SPACING.sm} ${SPACING.md}`,
                border: "none",
                background: selectedView === "Default" ? theme.primaryLight : "transparent",
                textAlign: "left",
                fontSize: "0.75rem",
                cursor: "pointer",
                color: theme.textPrimary,
              }}
            >
              Default
            </button>
            {savedViews.length > 0 && (
              <div style={{ borderTop: `1px solid ${theme.border}`, padding: `${SPACING.xs} 0` }}>
                <div style={{ padding: `${SPACING.xs} ${SPACING.md}`, fontSize: "0.65rem", color: theme.textMuted, textTransform: "uppercase" }}>
                  Saved Views
                </div>
                {savedViews.map((view) => (
                  <div
                    key={view.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: `${SPACING.xs} ${SPACING.md}`,
                      background: selectedView === view.name ? theme.primaryLight : "transparent",
                    }}
                  >
                    <button
                      onClick={() => { onLoadView && onLoadView(view); setShowDropdown(false); }}
                      style={{
                        flex: 1,
                        border: "none",
                        background: "transparent",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        color: theme.textPrimary,
                        padding: 0,
                      }}
                    >
                      {view.name}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteView && onDeleteView(view.id); }}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        color: theme.textMuted,
                        padding: "2px",
                        fontSize: "0.7rem",
                      }}
                      title="Delete view"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <button
        onClick={onSaveView}
        style={{
          border: "none",
          background: theme.backgroundTertiary,
          borderRadius: "999px",
          padding: `${SPACING.xs} ${SPACING.md}`,
          fontSize: "0.75rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: SPACING.xs,
          color: theme.textSecondary,
          transition: getTransition(["background", "color"], "fast"),
        }}
      >
        <ICONS.save size={12} />
        Save view
      </button>
    </div>
  );
}

export function ListingSearchInput({ value, onChange }) {
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, province, member type, registration..."
        style={{
          width: "100%",
          padding: "0.4rem 0.5rem",
          fontSize: "0.8rem",
          borderRadius: "0.5rem",
          border: "1px solid #d1d5db",
        }}
      />
    </div>
  );
}
