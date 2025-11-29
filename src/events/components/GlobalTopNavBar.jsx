import React from "react";
import { ICONS } from '../design-system';

export function GlobalTopNavBar({ onOpenCommandPalette }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "48px",
        background: "#4b5563",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        zIndex: 1000,
      }}
    >
      {/* Left Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ICONS.menu size={20} color="#9ca3af" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ color: "#ffffff", fontSize: "14px", fontWeight: 500 }}>Central</span>
          <ICONS.chevronDown size={16} color="#9ca3af" />
        </div>
        <button
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ICONS.plus size={18} color="#9ca3af" />
        </button>
      </div>

      {/* Center Section - Search */}
      <div
        onClick={onOpenCommandPalette}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#e5e7eb",
          borderRadius: "6px",
          padding: "6px 12px",
          minWidth: "560px",
          cursor: "pointer",
        }}
      >
        <ICONS.explorer size={16} color="#9ca3af" />
        <span style={{ color: "#9ca3af", fontSize: "13px" }}>Search Central</span>
      </div>

      {/* Right Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ICONS.bell size={20} color="#9ca3af" />
        </button>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "#4b5563",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          JD
        </div>
        <button
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ICONS.settings size={20} color="#9ca3af" />
        </button>
      </div>
    </div>
  );
}
