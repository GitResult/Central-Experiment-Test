import React, { useState, useEffect, useRef } from "react";
import { useTheme, SPACING, ICONS } from '../../design-system';
import { getTransition, exportToCSV, exportToExcel } from '../../utils';
import { useToast } from '../toast';

export function ExportMenu({ data, columns }) {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleExport = (format) => {
    const filename = `attendees-${new Date().toISOString().split('T')[0]}`;

    try {
      if (format === "csv") {
        exportToCSV(data, columns, `${filename}.csv`);
      } else if (format === "excel") {
        exportToExcel(data, columns, `${filename}.xlsx`);
      }

      addToast({
        type: "success",
        title: "Export complete",
        message: `${data.length} records exported to ${format.toUpperCase()}`,
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Export failed",
        message: "There was an error exporting the data. Please try again.",
      });
    }

    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        style={{
          display: "flex",
          alignItems: "center",
          gap: SPACING.xs,
          padding: `${SPACING.xs} ${SPACING.md}`,
          background: theme.backgroundSecondary,
          border: `1px solid ${theme.border}`,
          borderRadius: SPACING.sm,
          cursor: "pointer",
          color: theme.textSecondary,
          fontSize: "0.8rem",
          transition: getTransition(["background", "border-color"], "fast"),
        }}
      >
        <ICONS.download size={14} />
        Export
        <ICONS.chevronDown size={12} />
      </button>

      {isOpen && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: SPACING.xs,
            background: theme.background,
            border: `1px solid ${theme.border}`,
            borderRadius: SPACING.sm,
            boxShadow: theme.shadowMd,
            overflow: "hidden",
            zIndex: 50,
            minWidth: "160px",
            animation: "slideInUp 0.15s ease-out",
          }}
        >
          <button
            role="menuitem"
            onClick={() => handleExport("csv")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: SPACING.sm,
              padding: `${SPACING.sm} ${SPACING.md}`,
              width: "100%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: theme.textPrimary,
              fontSize: "0.8rem",
              textAlign: "left",
              transition: getTransition("background", "fast"),
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = theme.backgroundSecondary}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <ICONS.fileText size={16} color={theme.textMuted} />
            Export as CSV
          </button>
          <button
            role="menuitem"
            onClick={() => handleExport("excel")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: SPACING.sm,
              padding: `${SPACING.sm} ${SPACING.md}`,
              width: "100%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: theme.textPrimary,
              fontSize: "0.8rem",
              textAlign: "left",
              borderTop: `1px solid ${theme.border}`,
              transition: getTransition("background", "fast"),
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = theme.backgroundSecondary}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <ICONS.table size={16} color={theme.textMuted} />
            Export as Excel
          </button>
        </div>
      )}
    </div>
  );
}
