import React, { useState, useEffect, useRef } from "react";
import { useTheme, SPACING, ICONS } from '../../design-system';
import { getTransition } from '../../utils';

export function SaveViewModal({ isOpen, onClose, onSave, currentFilters }) {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, name]);

  const handleSave = () => {
    if (!name.trim()) {
      setError("View name is required");
      return;
    }
    onSave({ name: name.trim(), description: description.trim(), filters: currentFilters });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.15s ease-out",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: theme.background,
          borderRadius: SPACING.md,
          boxShadow: theme.shadowLg,
          width: "400px",
          maxWidth: "90vw",
          animation: "scaleIn 0.2s ease-out",
        }}
      >
        <div style={{
          padding: SPACING.xl,
          borderBottom: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: theme.textPrimary }}>
            Save Current View
          </h3>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: SPACING.xs,
              borderRadius: SPACING.xs,
              color: theme.textMuted,
              transition: getTransition("color", "fast"),
            }}
          >
            <ICONS.close size={18} />
          </button>
        </div>

        <div style={{ padding: SPACING.xl, display: "flex", flexDirection: "column", gap: SPACING.lg }}>
          <div>
            <label style={{
              display: "block",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: theme.textSecondary,
              marginBottom: SPACING.xs,
            }}>
              View Name <span style={{ color: theme.error }}>*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="e.g., Active Members Only"
              maxLength={50}
              style={{
                width: "100%",
                padding: `${SPACING.sm} ${SPACING.md}`,
                border: `1px solid ${error ? theme.error : theme.border}`,
                borderRadius: SPACING.sm,
                fontSize: "0.875rem",
                background: theme.background,
                color: theme.textPrimary,
                outline: "none",
                transition: getTransition("border-color", "fast"),
              }}
            />
            {error && (
              <p style={{ margin: `${SPACING.xs} 0 0`, fontSize: "0.75rem", color: theme.error }}>
                {error}
              </p>
            )}
            <p style={{ margin: `${SPACING.xs} 0 0`, fontSize: "0.7rem", color: theme.textLight, textAlign: "right" }}>
              {name.length}/50
            </p>
          </div>

          <div>
            <label style={{
              display: "block",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: theme.textSecondary,
              marginBottom: SPACING.xs,
            }}>
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for this view..."
              maxLength={200}
              rows={2}
              style={{
                width: "100%",
                padding: `${SPACING.sm} ${SPACING.md}`,
                border: `1px solid ${theme.border}`,
                borderRadius: SPACING.sm,
                fontSize: "0.875rem",
                background: theme.background,
                color: theme.textPrimary,
                outline: "none",
                resize: "none",
                fontFamily: "inherit",
                transition: getTransition("border-color", "fast"),
              }}
            />
          </div>
        </div>

        <div style={{
          padding: SPACING.xl,
          borderTop: `1px solid ${theme.border}`,
          display: "flex",
          justifyContent: "flex-end",
          gap: SPACING.sm,
        }}>
          <button
            onClick={onClose}
            style={{
              padding: `${SPACING.sm} ${SPACING.lg}`,
              border: `1px solid ${theme.border}`,
              borderRadius: SPACING.sm,
              background: theme.background,
              color: theme.textSecondary,
              fontSize: "0.8rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: getTransition(["background", "border-color"], "fast"),
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: `${SPACING.sm} ${SPACING.lg}`,
              border: "none",
              borderRadius: SPACING.sm,
              background: theme.primary,
              color: "white",
              fontSize: "0.8rem",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: SPACING.xs,
              transition: getTransition("background", "fast"),
            }}
          >
            <ICONS.save size={14} />
            Save View
          </button>
        </div>
      </div>
    </div>
  );
}
