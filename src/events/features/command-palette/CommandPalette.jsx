import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTheme, SPACING, ICONS } from '../../design-system';
import { getTransition } from '../../utils';

export function CommandPalette({ isOpen, onClose, onNavigate, attendees = [], tabs = [] }) {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const defaultTabs = [
    { id: "profile", label: "Profile", type: "tab" },
    { id: "activities", label: "Activities", type: "tab" },
    { id: "more", label: "More", type: "tab" },
  ];

  const actions = [
    { id: "action-export", label: "Export Attendees", type: "action", icon: "download" },
    { id: "action-filter", label: "Filter Attendees", type: "action", icon: "filter" },
    { id: "action-insights", label: "Open Insights", type: "action", icon: "insights" },
  ];

  const results = useMemo(() => {
    if (!query.trim()) {
      return [
        ...defaultTabs.map(t => ({ ...t, category: "Tabs" })),
        ...actions.map(a => ({ ...a, category: "Actions" })),
      ];
    }

    const q = query.toLowerCase();
    const matches = [];

    // Match tabs
    defaultTabs.forEach(tab => {
      if (tab.label.toLowerCase().includes(q)) {
        matches.push({ ...tab, category: "Tabs" });
      }
    });

    // Match attendees
    attendees.slice(0, 50).forEach(a => {
      if (a.name.toLowerCase().includes(q) ||
          (a.email && a.email.toLowerCase().includes(q)) ||
          (a.company && a.company.toLowerCase().includes(q))) {
        matches.push({
          id: `attendee-${a.id}`,
          label: a.name,
          sublabel: a.company || a.memberType,
          type: "attendee",
          data: a,
          category: "Attendees"
        });
      }
    });

    // Match actions
    actions.forEach(action => {
      if (action.label.toLowerCase().includes(q)) {
        matches.push({ ...action, category: "Actions" });
      }
    });

    return matches.slice(0, 10);
  }, [query, attendees]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelect = (item) => {
    onNavigate(item);
    onClose();
  };

  if (!isOpen) return null;

  // Group results by category
  const grouped = results.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  let flatIndex = 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "15vh",
        zIndex: 1000,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: theme.background,
          borderRadius: SPACING.md,
          boxShadow: theme.shadowLg,
          width: "560px",
          maxWidth: "90vw",
          maxHeight: "60vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Search Input */}
        <div style={{
          padding: SPACING.lg,
          borderBottom: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          gap: SPACING.md,
        }}>
          <ICONS.explorer size={20} color={theme.textMuted} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Search tabs, attendees, actions..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "1rem",
              background: "transparent",
              color: theme.textPrimary,
            }}
          />
          <kbd style={{
            padding: `${SPACING.xs} ${SPACING.sm}`,
            background: theme.backgroundTertiary,
            borderRadius: SPACING.xs,
            fontSize: "0.7rem",
            color: theme.textMuted,
          }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div style={{ overflow: "auto", flex: 1 }}>
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div style={{
                padding: `${SPACING.sm} ${SPACING.lg}`,
                fontSize: "0.7rem",
                fontWeight: 600,
                color: theme.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
                {category}
              </div>
              {items.map((item) => {
                const currentFlatIndex = flatIndex++;
                const isSelected = currentFlatIndex === selectedIndex;
                const IconComponent = ICONS[item.icon] || ICONS.chevronRight;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    style={{
                      width: "100%",
                      padding: `${SPACING.md} ${SPACING.lg}`,
                      border: "none",
                      background: isSelected ? theme.primaryLight : "transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: SPACING.md,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: getTransition("background", "fast"),
                    }}
                  >
                    <IconComponent size={18} color={isSelected ? theme.primary : theme.textMuted} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.875rem", color: theme.textPrimary, fontWeight: 500 }}>
                        {item.label}
                      </div>
                      {item.sublabel && (
                        <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>
                          {item.sublabel}
                        </div>
                      )}
                    </div>
                    {item.type === "tab" && (
                      <span style={{ fontSize: "0.7rem", color: theme.textLight }}>Go to tab</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {results.length === 0 && (
            <div style={{
              padding: SPACING.xxl,
              textAlign: "center",
              color: theme.textMuted,
              fontSize: "0.875rem",
            }}>
              No results found for "{query}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: `${SPACING.sm} ${SPACING.lg}`,
          borderTop: `1px solid ${theme.border}`,
          display: "flex",
          gap: SPACING.lg,
          fontSize: "0.7rem",
          color: theme.textMuted,
        }}>
          <span><kbd style={{ background: theme.backgroundTertiary, padding: "2px 4px", borderRadius: "2px" }}>↑↓</kbd> Navigate</span>
          <span><kbd style={{ background: theme.backgroundTertiary, padding: "2px 4px", borderRadius: "2px" }}>Enter</kbd> Select</span>
          <span><kbd style={{ background: theme.backgroundTertiary, padding: "2px 4px", borderRadius: "2px" }}>Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
