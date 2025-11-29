import React, { useState, useMemo, useEffect, useRef, useCallback, createContext, useContext } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ==================== DESIGN SYSTEM TOKENS ====================

// Spacing Scale (P2.4)
const SPACING = {
  xs: "0.25rem",   // 4px
  sm: "0.5rem",    // 8px
  md: "0.75rem",   // 12px
  lg: "1rem",      // 16px
  xl: "1.5rem",    // 24px
  xxl: "2rem",     // 32px
  xxxl: "3rem",    // 48px
};

// Motion Tokens (P2.2)
const MOTION = {
  duration: {
    instant: "0ms",
    fast: "150ms",
    normal: "250ms",
    slow: "400ms",
  },
  easing: {
    linear: "linear",
    easeOut: "cubic-bezier(0.0, 0.0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0.0, 1, 1)",
    easeInOut: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
};

// Theme Colors (P2.1)
const LIGHT_THEME = {
  background: "#ffffff",
  backgroundSecondary: "#f9fafb",
  backgroundTertiary: "#f3f4f6",
  backgroundPage: "#f5f5f7",
  textPrimary: "#111827",
  textSecondary: "#4b5563",
  textMuted: "#6b7280",
  textLight: "#9ca3af",
  border: "#e5e7eb",
  borderLight: "#f3f4f6",
  primary: "#2563eb",
  primaryHover: "#1d4ed8",
  primaryLight: "#eff6ff",
  success: "#22c55e",
  successLight: "#dcfce7",
  warning: "#f59e0b",
  warningLight: "#fef3c7",
  error: "#ef4444",
  errorLight: "#fee2e2",
  shadow: "0 1px 3px rgba(0,0,0,0.08)",
  shadowMd: "0 4px 6px -1px rgba(0,0,0,0.1)",
  shadowLg: "0 10px 15px -3px rgba(0,0,0,0.1)",
};

const DARK_THEME = {
  background: "#1f2937",
  backgroundSecondary: "#111827",
  backgroundTertiary: "#374151",
  backgroundPage: "#0f172a",
  textPrimary: "#f9fafb",
  textSecondary: "#d1d5db",
  textMuted: "#9ca3af",
  textLight: "#6b7280",
  border: "#374151",
  borderLight: "#4b5563",
  primary: "#3b82f6",
  primaryHover: "#60a5fa",
  primaryLight: "#1e3a5f",
  success: "#34d399",
  successLight: "#064e3b",
  warning: "#fbbf24",
  warningLight: "#78350f",
  error: "#f87171",
  errorLight: "#7f1d1d",
  shadow: "0 1px 3px rgba(0,0,0,0.3)",
  shadowMd: "0 4px 6px -1px rgba(0,0,0,0.4)",
  shadowLg: "0 10px 15px -3px rgba(0,0,0,0.5)",
};

// Theme Context (P2.1)
const ThemeContext = createContext({ theme: LIGHT_THEME, isDark: false, toggleTheme: () => {} });

function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newValue = !prev;
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      return newValue;
    });
  }, []);

  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  return useContext(ThemeContext);
}

// Motion Helper (P2.2)
function getTransition(properties, speed = "normal") {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return "none";
  }
  const props = Array.isArray(properties) ? properties : [properties];
  return props.map(p => `${p} ${MOTION.duration[speed]} ${MOTION.easing.easeOut}`).join(", ");
}

// ==================== SVG ICON SYSTEM (P1.1) ====================

const ICONS = {
  insights: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  explorer: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  ),
  reports: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  timeline: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  ai: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
    </svg>
  ),
  users: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  briefcase: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  graduation: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  mapPin: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  filter: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  sort: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="4" y1="6" x2="11" y2="6" /><line x1="4" y1="12" x2="11" y2="12" /><line x1="4" y1="18" x2="13" y2="18" /><polyline points="15 9 18 6 21 9" /><polyline points="21 15 18 18 15 15" />
    </svg>
  ),
  save: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  pin: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="17" x2="12" y2="22" /><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
    </svg>
  ),
  close: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  chevronDown: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  chevronRight: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  check: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  sun: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  moon: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  user: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  creditCard: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  edit: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  x: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  download: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  ticket: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
    </svg>
  ),
  command: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
    </svg>
  ),
  // P3 Icons
  alertTriangle: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  inbox: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  ),
  menu: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  refresh: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  fileText: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  table: ({ size = 20, color = "currentColor", ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
    </svg>
  ),
};

// ==================== SKELETON LOADERS (P1.2) ====================

function SkeletonLoader({ width = "100%", height = "1rem", borderRadius = "0.25rem", style = {} }) {
  const { theme } = useTheme();
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: `linear-gradient(90deg, ${theme.backgroundTertiary} 25%, ${theme.border} 50%, ${theme.backgroundTertiary} 75%)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

function TableSkeleton({ rows = 5, columns = 7 }) {
  const { theme } = useTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: SPACING.sm }}>
      {/* Header */}
      <div style={{ display: "flex", gap: SPACING.md, padding: SPACING.md, background: theme.backgroundTertiary, borderRadius: SPACING.sm }}>
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonLoader key={i} width={i === 0 ? "60px" : "120px"} height="0.875rem" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} style={{ display: "flex", gap: SPACING.md, padding: SPACING.md }}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <SkeletonLoader key={colIdx} width={colIdx === 0 ? "60px" : "120px"} height="0.875rem" />
          ))}
        </div>
      ))}
    </div>
  );
}

function CardSkeleton() {
  const { theme } = useTheme();
  return (
    <div style={{
      padding: SPACING.xl,
      background: theme.background,
      borderRadius: SPACING.md,
      boxShadow: theme.shadow,
    }}>
      <SkeletonLoader width="60%" height="1rem" style={{ marginBottom: SPACING.md }} />
      <SkeletonLoader width="40%" height="0.75rem" style={{ marginBottom: SPACING.lg }} />
      <div style={{ display: "flex", flexDirection: "column", gap: SPACING.sm }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: SPACING.sm }}>
            <SkeletonLoader width="100%" height="1.5rem" borderRadius="999px" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartSkeleton({ height = "200px" }) {
  const { theme } = useTheme();
  return (
    <div style={{
      height,
      background: theme.backgroundSecondary,
      borderRadius: SPACING.md,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-around",
      padding: SPACING.lg,
      gap: SPACING.sm,
    }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <SkeletonLoader
          key={i}
          width="40px"
          height={`${30 + Math.random() * 50}%`}
          borderRadius={SPACING.xs}
        />
      ))}
    </div>
  );
}

// ==================== URL STATE PERSISTENCE (P1.3) ====================

function useURLState(key, defaultValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    const params = new URLSearchParams(window.location.search);
    const urlValue = params.get(key);
    if (urlValue === null) return defaultValue;
    try {
      return JSON.parse(urlValue);
    } catch {
      return urlValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const serialized = typeof value === 'object' ? JSON.stringify(value) : String(value);
    const defaultSerialized = typeof defaultValue === 'object' ? JSON.stringify(defaultValue) : String(defaultValue);

    if (serialized === defaultSerialized) {
      params.delete(key);
    } else {
      params.set(key, serialized);
    }
    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newURL);
  }, [key, value, defaultValue]);

  // Handle browser back/forward
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const urlValue = params.get(key);
      if (urlValue === null) {
        setValue(defaultValue);
      } else {
        try {
          setValue(JSON.parse(urlValue));
        } catch {
          setValue(urlValue);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [key, defaultValue]);

  return [value, setValue];
}

// ==================== SAVE VIEW MODAL (P2.3) ====================

function SaveViewModal({ isOpen, onClose, onSave, currentFilters }) {
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

// ==================== COMMAND PALETTE (P1.4) ====================

function CommandPalette({ isOpen, onClose, onNavigate, attendees = [], tabs = [] }) {
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

// Inject CSS animations
if (typeof document !== 'undefined') {
  const styleId = 'events-animations';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes slideInUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideOutRight {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
      }
    `;
    document.head.appendChild(style);
  }
}

// ==================== P3.7: TOAST NOTIFICATION SYSTEM ====================

const ToastContext = createContext({ addToast: () => {} });

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, ...toast }]);

    if (toast.duration !== 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, toast.duration || 4000);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function useToast() {
  return useContext(ToastContext);
}

function ToastContainer({ toasts, onRemove }) {
  return (
    <div style={{
      position: "fixed",
      bottom: SPACING.lg,
      right: SPACING.lg,
      display: "flex",
      flexDirection: "column",
      gap: SPACING.sm,
      zIndex: 9999,
      pointerEvents: "none",
    }}>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={() => onRemove(toast.id)} />
      ))}
    </div>
  );
}

function Toast({ type = "info", title, message, onClose }) {
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

// ==================== P3.6: EMPTY STATES ====================

function EmptyState({
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

const EMPTY_STATES = {
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

// ==================== P3.8: DATA EXPORT ====================

function exportToCSV(data, columns, filename = "export.csv") {
  const headers = columns.map(c => c.label).join(",");
  const rows = data.map(row =>
    columns.map(c => {
      const value = row[c.key] ?? "";
      const escaped = String(value).replace(/"/g, '""');
      return escaped.includes(",") || escaped.includes("\n") ? `"${escaped}"` : escaped;
    }).join(",")
  );

  const csv = [headers, ...rows].join("\n");
  downloadFile(csv, filename, "text/csv;charset=utf-8;");
}

function exportToExcel(data, columns, filename = "export.xlsx") {
  const header = columns.map(c => `<th>${escapeXml(c.label)}</th>`).join("");
  const rows = data.map(row =>
    `<tr>${columns.map(c => `<td>${escapeXml(String(row[c.key] ?? ""))}</td>`).join("")}</tr>`
  ).join("");

  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="Sheet1">
<Table>
<Row>${header}</Row>
${rows}
</Table>
</Worksheet>
</Workbook>`;

  downloadFile(xml, filename, "application/vnd.ms-excel");
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function ExportMenu({ data, columns }) {
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

// ==================== P3.4: ERROR BOUNDARY ====================

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }
    return this.props.children;
  }
}

function ErrorFallback({ error, onRetry, title = "Something went wrong" }) {
  const { theme } = useTheme();

  return (
    <div style={{
      padding: SPACING.xxl,
      textAlign: "center",
      background: theme.errorLight,
      borderRadius: SPACING.md,
      border: `1px solid ${theme.error}20`,
      animation: "fadeIn 0.3s ease-out",
    }}>
      <div style={{
        width: "64px",
        height: "64px",
        margin: "0 auto",
        marginBottom: SPACING.lg,
        background: theme.error,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <ICONS.alertTriangle size={32} color="white" />
      </div>

      <h3 style={{
        margin: 0,
        marginBottom: SPACING.sm,
        fontSize: "1.25rem",
        color: theme.textPrimary,
      }}>
        {title}
      </h3>

      <p style={{
        margin: 0,
        marginBottom: SPACING.lg,
        color: theme.textMuted,
        fontSize: "0.875rem",
      }}>
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>

      <button
        onClick={onRetry}
        style={{
          padding: `${SPACING.sm} ${SPACING.lg}`,
          background: theme.primary,
          color: "white",
          border: "none",
          borderRadius: SPACING.sm,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: SPACING.sm,
          fontWeight: 500,
          transition: getTransition("background", "fast"),
        }}
      >
        <ICONS.refresh size={16} />
        Try Again
      </button>
    </div>
  );
}

// ==================== P3.1: ACCESSIBILITY ====================

function SkipLink({ targetId = "main-content", children = "Skip to main content" }) {
  const { theme } = useTheme();

  return (
    <a
      href={`#${targetId}`}
      style={{
        position: "absolute",
        left: "-9999px",
        top: "auto",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        zIndex: 9999,
      }}
      onFocus={(e) => {
        e.currentTarget.style.cssText = `
          position: fixed; left: ${SPACING.lg}; top: ${SPACING.lg};
          padding: ${SPACING.md} ${SPACING.lg}; background: ${theme.primary};
          color: white; z-index: 9999; border-radius: ${SPACING.sm};
          font-weight: 500; text-decoration: none; box-shadow: ${theme.shadowLg};
        `;
      }}
      onBlur={(e) => {
        e.currentTarget.style.cssText = `
          position: absolute; left: -9999px; top: auto;
          width: 1px; height: 1px; overflow: hidden;
        `;
      }}
    >
      {children}
    </a>
  );
}

function LiveRegion({ message, politeness = "polite" }) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      style={{
        position: "absolute",
        left: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      {message}
    </div>
  );
}

function useFocusRing() {
  const [isFocused, setIsFocused] = useState(false);

  const focusProps = {
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  };

  const getFocusStyle = (theme) => isFocused ? {
    outline: "none",
    boxShadow: `0 0 0 3px ${theme.primary}40`,
  } : {
    outline: "none",
  };

  return { isFocused, focusProps, getFocusStyle };
}

// ==================== P3.5: KEYBOARD NAVIGATION ====================

function useRovingTabindex(itemCount, options = {}) {
  const { orientation = "vertical", loop = true, onSelect } = options;
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef([]);

  const handleKeyDown = useCallback((e) => {
    const isVertical = orientation === "vertical";
    const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";
    const nextKey = isVertical ? "ArrowDown" : "ArrowRight";

    let newIndex = activeIndex;

    if (e.key === prevKey) {
      e.preventDefault();
      newIndex = activeIndex - 1;
      if (newIndex < 0) newIndex = loop ? itemCount - 1 : 0;
    } else if (e.key === nextKey) {
      e.preventDefault();
      newIndex = activeIndex + 1;
      if (newIndex >= itemCount) newIndex = loop ? 0 : itemCount - 1;
    } else if (e.key === "Home") {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      newIndex = itemCount - 1;
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.(activeIndex);
      return;
    }

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, itemCount, loop, orientation, onSelect]);

  useEffect(() => {
    itemRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  const getItemProps = useCallback((index) => ({
    ref: (el) => { itemRefs.current[index] = el; },
    tabIndex: index === activeIndex ? 0 : -1,
    onKeyDown: handleKeyDown,
    onFocus: () => setActiveIndex(index),
    "aria-selected": index === activeIndex,
  }), [activeIndex, handleKeyDown]);

  return { activeIndex, setActiveIndex, getItemProps };
}

function useFocusTrap(isActive) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    firstElement?.focus();

    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [isActive]);

  return containerRef;
}

// ==================== P3.3: RESPONSIVE DESIGN ====================

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

function useBreakpoint() {
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.sm - 1}px)`);
  const isTablet = useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`);
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);

  return { isMobile, isTablet, isDesktop };
}

function ResponsiveGrid({ children, cols = { sm: 1, md: 2, lg: 3 }, gap = SPACING.lg }) {
  const { isMobile, isTablet } = useBreakpoint();
  const columns = isMobile ? cols.sm : isTablet ? cols.md : cols.lg;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap,
    }}>
      {children}
    </div>
  );
}

function MobileNav({ tabs, activeTab, onChange, isOpen, onClose }) {
  const { theme } = useTheme();
  const focusTrapRef = useFocusTrap(isOpen);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <nav
        ref={focusTrapRef}
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "280px",
          maxWidth: "85vw",
          background: theme.background,
          padding: SPACING.lg,
          boxShadow: theme.shadowLg,
          animation: "slideInRight 0.25s ease-out",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: SPACING.xl,
        }}>
          <span style={{ fontWeight: 600, fontSize: "1rem", color: theme.textPrimary }}>
            Navigation
          </span>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: SPACING.xs,
              color: theme.textMuted,
            }}
          >
            <ICONS.close size={20} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: SPACING.xs }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { onChange(tab.id); onClose(); }}
              style={{
                width: "100%",
                padding: `${SPACING.md} ${SPACING.lg}`,
                textAlign: "left",
                background: activeTab === tab.id ? theme.primaryLight : "transparent",
                color: activeTab === tab.id ? theme.primary : theme.textPrimary,
                border: "none",
                borderRadius: SPACING.sm,
                cursor: "pointer",
                fontWeight: activeTab === tab.id ? 600 : 400,
                fontSize: "0.9rem",
                transition: getTransition(["background", "color"], "fast"),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ==================== P3.2: VIRTUALIZED LIST ====================

function VirtualList({
  items,
  itemHeight = 52,
  containerHeight = 400,
  renderItem,
  overscan = 5,
  className = "",
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length, startIndex + visibleCount + overscan * 2);

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        height: containerHeight,
        overflow: "auto",
        position: "relative",
      }}
      onScroll={handleScroll}
      role="list"
      aria-rowcount={items.length}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          transform: `translateY(${offsetY}px)`,
        }}>
          {visibleItems.map((item, i) => (
            <div
              key={item.id || startIndex + i}
              role="listitem"
              aria-rowindex={startIndex + i + 1}
              style={{ height: itemHeight }}
            >
              {renderItem(item, startIndex + i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------- Mock Data --------------------

const MOCK_EVENT = {
  id: "cpa-2025",
  name: "2025 CPA Annual National Convention",
  startDate: "2025-06-12",
  endDate: "2025-06-14",
  venue: "St. John's Convention Centre",
  totalRevenue: 2340000, // Updated for 300 attendees
};

// Deterministic pseudo-random generator for consistent data
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function weightedPick(seed, options) {
  const rand = seededRandom(seed);
  let cumulative = 0;
  for (const [value, weight] of options) {
    cumulative += weight;
    if (rand < cumulative) return value;
  }
  return options[options.length - 1][0];
}

// First/Last name pools for generating realistic names
const FIRST_NAMES = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
  "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
  "Christopher", "Lisa", "Daniel", "Nancy", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra",
  "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
  "Wei", "Priya", "Mohammed", "Fatima", "Raj", "Aisha", "Chen", "Yuki", "Ahmed", "Mei",
  "Pierre", "Marie", "Jean", "Sophie", "François", "Isabelle", "André", "Nathalie", "Michel", "Julie",
  "Liam", "Emma", "Noah", "Olivia", "Oliver", "Ava", "Ethan", "Sophia", "Lucas", "Isabella",
  "Hiroshi", "Sakura", "Kenji", "Yuki", "Takeshi", "Hana", "Ravi", "Ananya", "Arjun", "Deepa"
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
  "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
  "Wang", "Li", "Zhang", "Chen", "Liu", "Yang", "Huang", "Wu", "Zhou", "Xu",
  "Tremblay", "Gagnon", "Roy", "Côté", "Bouchard", "Gauthier", "Morin", "Lavoie", "Fortin", "Gagné",
  "Patel", "Singh", "Kumar", "Sharma", "Gupta", "Khan", "Ali", "Ahmed", "Hassan", "Mohammed",
  "Kim", "Park", "Choi", "Jung", "Kang", "Cho", "Yoon", "Jang", "Lim", "Han",
  "Tanaka", "Yamamoto", "Watanabe", "Suzuki", "Takahashi", "Sato", "Ito", "Nakamura", "Kobayashi", "Saito"
];

// Distribution configs (value, probability)
const MEMBER_TYPE_DIST = [["CPA", 0.55], ["Non-member", 0.18], ["Student", 0.17], ["Guest", 0.10]];
const AGE_GROUP_DIST = [["18-24", 0.12], ["25-34", 0.24], ["35-44", 0.28], ["45-54", 0.22], ["55-64", 0.10], ["65+", 0.04]];
const PROVINCE_DIST = [
  ["Ontario", 0.38], ["Quebec", 0.18], ["British Columbia", 0.14], ["Alberta", 0.12],
  ["Manitoba", 0.04], ["Saskatchewan", 0.03], ["Nova Scotia", 0.04], ["New Brunswick", 0.02],
  ["Newfoundland and Labrador", 0.03], ["Prince Edward Island", 0.02]
];
const EDUCATION_DIST = [["Undergrad", 0.15], ["Bachelors", 0.42], ["Masters", 0.33], ["PhD", 0.10]];
const DIETARY_DIST = [["None", 0.62], ["Vegetarian", 0.15], ["Vegan", 0.08], ["Gluten-free", 0.06], ["Halal", 0.05], ["Kosher", 0.04]];
const SESSION_DIST = [
  ["Audit Track", 0.18], ["Tax Track", 0.20], ["Leadership Track", 0.15], ["Technology Track", 0.12],
  ["Ethics Track", 0.10], ["Research Track", 0.08], ["Student Track", 0.10], ["Keynote", 0.04], ["Social Events", 0.03]
];
const PRIMARY_REASON_DIST = [
  ["Networking", 0.30], ["Professional Development", 0.25], ["Learning", 0.20], ["Career", 0.10],
  ["Thought Leadership", 0.05], ["Speaker", 0.03], ["Exploring Membership", 0.05], ["Guest", 0.02]
];

function generateAttendee(id) {
  const seed1 = id * 13;
  const seed2 = id * 17;
  const seed3 = id * 23;
  const seed4 = id * 29;
  const seed5 = id * 31;
  const seed6 = id * 37;
  const seed7 = id * 41;
  const seed8 = id * 43;
  const seed9 = id * 47;

  const firstName = FIRST_NAMES[Math.floor(seededRandom(seed1) * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(seededRandom(seed2) * LAST_NAMES.length)];
  const memberType = weightedPick(seed3, MEMBER_TYPE_DIST);
  const ageGroup = memberType === "Student" ? weightedPick(seed4, [["18-24", 0.7], ["25-34", 0.3]]) : weightedPick(seed4, AGE_GROUP_DIST);
  const province = weightedPick(seed5, PROVINCE_DIST);
  const education = memberType === "Student" ? "Undergrad" : weightedPick(seed6, EDUCATION_DIST);
  const dietary = weightedPick(seed7, DIETARY_DIST);
  const session = memberType === "Student" ? weightedPick(seed8, [["Student Track", 0.6], ["Keynote", 0.2], ["Technology Track", 0.2]]) : weightedPick(seed8, SESSION_DIST);
  const primaryReason = memberType === "Student" ? "Career" : memberType === "Guest" ? "Guest" : weightedPick(seed9, PRIMARY_REASON_DIST);

  // Determine membership status based on member type
  let membershipStatus, isMember;
  if (memberType === "CPA") {
    const statusRand = seededRandom(id * 53);
    if (statusRand < 0.70) { membershipStatus = "Current"; isMember = true; }
    else { membershipStatus = "Lapsed"; isMember = false; }
  } else if (memberType === "Student") {
    membershipStatus = "Current"; isMember = true;
  } else {
    membershipStatus = "Non-member"; isMember = false;
  }

  // Registration type based on member type
  let registrationType, ticketType, isComplimentary;
  if (memberType === "Student") {
    registrationType = "Student Pass"; ticketType = "Paid"; isComplimentary = false;
  } else if (memberType === "Guest") {
    registrationType = "Guest"; ticketType = "Complimentary"; isComplimentary = true;
  } else if (primaryReason === "Speaker") {
    registrationType = "Speaker"; ticketType = "Complimentary"; isComplimentary = true;
  } else {
    const regRand = seededRandom(id * 59);
    if (regRand < 0.65) registrationType = "Full Conference";
    else registrationType = "Workshop Only";
    ticketType = "Paid"; isComplimentary = false;
  }

  // Renewal based on membership status (only meaningful for members)
  let renewed = false;
  if (membershipStatus === "Current") {
    renewed = seededRandom(id * 61) < 0.75; // 75% renewal for current members
  } else if (membershipStatus === "Lapsed") {
    renewed = seededRandom(id * 61) < 0.20; // 20% renewal for lapsed
  } else {
    renewed = seededRandom(id * 61) < 0.08; // 8% conversion for non-members
  }

  return {
    id,
    name: `${firstName} ${lastName}`,
    memberType,
    membershipStatus,
    isComplimentary,
    isMember,
    ageGroup,
    province,
    education,
    primaryReason,
    registrationType,
    dietary,
    session,
    ticketType,
    renewed,
  };
}

// Generate 300 attendees
const MOCK_ATTENDEES = Array.from({ length: 300 }, (_, i) => generateAttendee(i + 1));


// -------------------- Attendee Data Enrichment --------------------

const COMPANY_LIST = [
  "Deloitte Canada", "KPMG LLP", "PwC Canada", "Ernst & Young",
  "BDO Canada", "Grant Thornton", "MNP LLP", "RSM Canada",
  "Baker Tilly Canada", "Crowe Soberman", "Collins Barrow", "Richter LLP"
];

function enrichAttendeesWithListData(attendees) {
  return attendees.map((a) => {
    const nameParts = a.name.split(" ");
    const firstName = nameParts[0]?.toLowerCase() || "user";
    const lastName = nameParts[nameParts.length - 1]?.toLowerCase() || "unknown";
    const companyIdx = (a.id * 7) % COMPANY_LIST.length;
    const regDay = 1 + (a.id % 28);
    const regMonth = 3 + Math.floor(a.id / 10);

    return {
      ...a,
      company: a.memberType === "Student" ? "N/A - Student" : COMPANY_LIST[companyIdx],
      email: `${firstName}.${lastName}@example.com`,
      phone: `(${500 + (a.id % 400)}) ${100 + (a.id * 3) % 900}-${1000 + (a.id * 7) % 9000}`,
      confirmationId: `CPA2025-${String(a.id).padStart(4, "0")}`,
      registrationDate: `2025-${String(regMonth).padStart(2, "0")}-${String(regDay).padStart(2, "0")}`,
    };
  });
}

// -------------------- Helper Functions --------------------

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

function computeKpis(attendees) {
  const totalAttendees = attendees.length;
  const currentMembers = attendees.filter((a) => a.membershipStatus === "Current")
    .length;
  const nonMembers = attendees.filter(
    (a) => a.membershipStatus === "Non-member"
  ).length;
  const lapsedMembers = attendees.filter(
    (a) => a.membershipStatus === "Lapsed"
  ).length;
  const complimentary = attendees.filter((a) => a.isComplimentary).length;

  return {
    totalAttendees,
    currentMembers,
    nonMembers,
    lapsedMembers,
    complimentary,
  };
}

function groupByField(attendees, field) {
  const map = new Map();
  attendees.forEach((a) => {
    const key = a[field] || "Unknown";
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries()).map(([label, count]) => ({ label, count }));
}

function filterAttendees(attendees, filters, searchTerm) {
  return attendees.filter((a) => {
    // filters: { field: [values] }
    for (const field of Object.keys(filters)) {
      const values = filters[field];
      if (!values || values.length === 0) continue;
      const val = a[field] || "Unknown";
      if (!values.includes(val)) return false;
    }

    if (searchTerm && searchTerm.trim().length > 0) {
      const term = searchTerm.toLowerCase();
      const haystack =
        (a.name || "") +
        " " +
        (a.province || "") +
        " " +
        (a.memberType || "") +
        " " +
        (a.registrationType || "");
      if (!haystack.toLowerCase().includes(term)) {
        return false;
      }
    }

    return true;
  });
}

function computeRenewalByProvince(attendees, provinces, showAsShare) {
  const filtered = attendees.filter((a) =>
    provinces.length ? provinces.includes(a.province) : true
  );
  const map = new Map();

  filtered.forEach((a) => {
    const prov = a.province || "Unknown";
    const existing = map.get(prov) || { renewed: 0, notRenewed: 0 };
    if (a.renewed) existing.renewed += 1;
    else existing.notRenewed += 1;
    map.set(prov, existing);
  });

  return Array.from(map.entries()).map(([province, { renewed, notRenewed }]) => {
    const total = renewed + notRenewed || 1;
    return {
      province,
      renewed: showAsShare ? (renewed / total) * 100 : renewed,
      notRenewed: showAsShare ? (notRenewed / total) * 100 : notRenewed,
      total,
    };
  });
}

function computeSegmentsWithPercentage(segments, totalCount) {
  return segments.map((seg) => ({
    ...seg,
    percentage: totalCount > 0 ? ((seg.count / totalCount) * 100).toFixed(1) : 0,
  }));
}

function transformChartData(originalData, config, attendees) {
  let data = [...originalData];

  // Apply date range filter
  if (config.dateRange === "last4") {
    data = data.slice(-5); // Last 4 weeks + Event
  } else if (config.dateRange === "last2") {
    data = data.slice(-3); // Last 2 weeks + Event
  }

  // Apply membership type filter (affects revenue calculation conceptually)
  // For demo, we'll adjust proportionally based on attendee mix
  if (config.selectedMembershipTypes.length > 0) {
    const filteredCount = attendees.filter((a) =>
      config.selectedMembershipTypes.includes(a.memberType)
    ).length;
    const ratio = filteredCount / attendees.length;
    data = data.map((item) => ({
      ...item,
      registrations: Math.round(item.registrations * ratio),
      revenue: Math.round(item.revenue * ratio),
    }));
  }

  // Apply view mode transformation
  if (config.viewMode === "percentage") {
    const maxReg = Math.max(...data.map((d) => d.registrations));
    const maxRev = Math.max(...data.map((d) => d.revenue));
    data = data.map((item) => ({
      ...item,
      registrations: maxReg > 0 ? Math.round((item.registrations / maxReg) * 100) : 0,
      revenue: maxRev > 0 ? Math.round((item.revenue / maxRev) * 100) : 0,
    }));
  }

  return data;
}

function computeCorrelation(attendees, dimension, metric) {
  const map = new Map();

  attendees.forEach((a) => {
    const key = a[dimension] || "Unknown";
    const existing = map.get(key) || { total: 0, renewed: 0 };
    existing.total += 1;
    if (metric === "renewal" && a.renewed) {
      existing.renewed += 1;
    }
    map.set(key, existing);
  });

  const results = Array.from(map.entries()).map(([label, { total, renewed }]) => {
    const renewalRate = total > 0 ? (renewed / total) * 100 : 0;
    return {
      label,
      total,
      renewed,
      notRenewed: total - renewed,
      renewalRate: renewalRate.toFixed(1),
    };
  });

  // Sort by renewal rate descending
  results.sort((a, b) => parseFloat(b.renewalRate) - parseFloat(a.renewalRate));

  // Find key insight (highest vs lowest rate with meaningful sample size)
  const significantResults = results.filter((r) => r.total >= 3);
  const insight = significantResults.length >= 2
    ? `${significantResults[0].label} shows ${significantResults[0].renewalRate}% renewal vs ${significantResults[significantResults.length - 1].renewalRate}% for ${significantResults[significantResults.length - 1].label}`
    : significantResults.length === 1
    ? `${significantResults[0].label}: ${significantResults[0].renewalRate}% renewal rate`
    : "Insufficient data for correlation analysis";

  return { results, insight };
}

// -------------------- Top-Level Demo Component --------------------

function CentralEventReportingDemoInner() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [view, setView] = useState("calendar"); // "calendar" | "event"
  const [showPeek, setShowPeek] = useState(false);
  const [showInsightsPanel, setShowInsightsPanel] = useState(false);
  const [showInsightsSlideout, setShowInsightsSlideout] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const enrichedAttendees = useMemo(() => enrichAttendeesWithListData(MOCK_ATTENDEES), []);
  const kpis = useMemo(() => computeKpis(MOCK_ATTENDEES), []);

  // P1.2: Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // P1.4: Command palette keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommandNavigate = (item) => {
    if (item.type === 'tab') {
      // Navigate to tab - would need to pass down to EventDetailLayout
      setView("event");
    } else if (item.type === 'action') {
      if (item.id === 'action-insights') {
        setShowInsightsSlideout(true);
      }
    }
  };

  return (
    <>
      {/* P3.1: Skip Link for Accessibility */}
      <SkipLink targetId="main-content" />

      <div
        id="main-content"
        style={{
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          padding: SPACING.lg,
          background: theme.backgroundPage,
          minHeight: "100vh",
          color: theme.textPrimary,
          transition: getTransition(["background", "color"], "normal"),
        }}
      >
      {/* Theme Toggle & Search Hint */}
      <div style={{
        position: "fixed",
        top: SPACING.lg,
        right: SPACING.lg,
        display: "flex",
        alignItems: "center",
        gap: SPACING.sm,
        zIndex: 50,
      }}>
        <button
          onClick={() => setShowCommandPalette(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: SPACING.sm,
            padding: `${SPACING.xs} ${SPACING.md}`,
            background: theme.backgroundSecondary,
            border: `1px solid ${theme.border}`,
            borderRadius: SPACING.sm,
            color: theme.textMuted,
            fontSize: "0.75rem",
            cursor: "pointer",
            transition: getTransition(["background", "border-color"], "fast"),
          }}
        >
          <ICONS.explorer size={14} />
          Search
          <kbd style={{
            padding: `2px ${SPACING.xs}`,
            background: theme.backgroundTertiary,
            borderRadius: "3px",
            fontSize: "0.65rem",
          }}>⌘K</kbd>
        </button>
        <button
          onClick={toggleTheme}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: `1px solid ${theme.border}`,
            background: theme.backgroundSecondary,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.textMuted,
            transition: getTransition(["background", "color", "transform"], "fast"),
          }}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <ICONS.sun size={18} /> : <ICONS.moon size={18} />}
        </button>
      </div>

      <WorkspaceNavigator onOpenCalendar={() => setView("calendar")} />

      {isLoading ? (
        <div style={{ marginTop: SPACING.xl }}>
          <ChartSkeleton height="300px" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: SPACING.lg, marginTop: SPACING.lg }}>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      ) : (
        <>
          {view === "calendar" && (
            <CalendarView
              event={MOCK_EVENT}
              onEventClick={() => setShowPeek(true)}
            />
          )}

          {showPeek && (
            <EventPeek
              event={MOCK_EVENT}
              kpis={kpis}
              onClose={() => setShowPeek(false)}
              onViewEvent={() => {
                setShowPeek(false);
                setView("event");
              }}
            />
          )}

          {view === "event" && (
            <EventDetailLayout
              event={MOCK_EVENT}
              attendees={enrichedAttendees}
              kpis={kpis}
              onBackToCalendar={() => setView("calendar")}
              showInsightsPanel={showInsightsPanel}
              setShowInsightsPanel={setShowInsightsPanel}
              showInsightsSlideout={showInsightsSlideout}
              setShowInsightsSlideout={setShowInsightsSlideout}
            />
          )}
        </>
      )}

      {/* P1.4: Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigate={handleCommandNavigate}
        attendees={enrichedAttendees}
      />
    </div>
    </>
  );
}

// Wrap with ThemeProvider and ToastProvider (P3 Integration)
function CentralEventReportingDemo() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ErrorBoundary>
          <CentralEventReportingDemoInner />
        </ErrorBoundary>
      </ToastProvider>
    </ThemeProvider>
  );
}

// -------------------- Workspace + Calendar --------------------

function WorkspaceNavigator({ onOpenCalendar }) {
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

function CalendarView({ event, onEventClick }) {
  const { theme } = useTheme();
  const [mode, setMode] = useState("month"); // "month" | "year"
  const [hoveredDay, setHoveredDay] = useState(null);

  // June 2025 calendar data - June 1, 2025 is a Sunday (dayOfWeek = 0)
  const daysInJune = 30;
  const startDayOfWeek = 0; // Sunday
  const eventDays = [12, 13, 14]; // Event spans June 12-14
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Build calendar grid
  const calendarDays = [];
  // Empty cells before June 1
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  // Days of June
  for (let day = 1; day <= daysInJune; day++) {
    calendarDays.push(day);
  }

  const isEventDay = (day) => eventDays.includes(day);
  const isEventStart = (day) => day === 12;
  const isEventEnd = (day) => day === 14;
  const isEventMiddle = (day) => day === 13;

  return (
    <div
      style={{
        background: theme.background,
        borderRadius: "0.75rem",
        padding: "1rem",
        boxShadow: theme.shadow,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <h2 style={{ margin: 0, color: theme.textPrimary }}>Calendar</h2>
        <div
          style={{
            display: "inline-flex",
            borderRadius: "999px",
            background: theme.backgroundTertiary,
          }}
        >
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
          {/* Month Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "1rem"
          }}>
            <button style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: theme.textMuted,
              fontSize: "1rem",
              padding: "0.25rem 0.5rem",
            }}>←</button>
            <h3 style={{ margin: 0, color: theme.textPrimary, fontSize: "1rem" }}>June 2025</h3>
            <button style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: theme.textMuted,
              fontSize: "1rem",
              padding: "0.25rem 0.5rem",
            }}>→</button>
          </div>

          {/* Week Day Headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "2px",
            marginBottom: "0.5rem",
          }}>
            {weekDays.map((day) => (
              <div
                key={day}
                style={{
                  textAlign: "center",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: theme.textMuted,
                  padding: "0.25rem",
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "2px",
          }}>
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} style={{ height: "3rem" }} />;
              }
              const hasEvent = isEventDay(day);
              const isStart = isEventStart(day);
              const isEnd = isEventEnd(day);
              const isMiddle = isEventMiddle(day);
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
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: hasEvent ? 600 : 400,
                      color: hasEvent ? "white" : theme.textPrimary,
                    }}
                  >
                    {day}
                  </span>
                  {isStart && (
                    <span style={{
                      fontSize: "0.55rem",
                      color: "white",
                      marginTop: "2px",
                      textAlign: "center",
                      lineHeight: 1.1,
                    }}>
                      Conference
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Event Legend */}
          <div style={{
            marginTop: "1rem",
            padding: "0.75rem",
            background: theme.backgroundSecondary,
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}>
            <div style={{
              width: "12px",
              height: "12px",
              borderRadius: "3px",
              background: `linear-gradient(135deg, ${theme.primary}, #0ea5e9)`,
            }} />
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: theme.textPrimary }}>
                {event.name}
              </div>
              <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>
                {event.startDate} – {event.endDate} · Click to preview
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "1rem",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "0.5rem", color: theme.textPrimary }}>2025</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "0.75rem",
              fontSize: "0.75rem",
              color: theme.textPrimary,
            }}
          >
            <div
              style={{
                borderRadius: "0.5rem",
                border: `1px solid ${theme.border}`,
                padding: "0.5rem",
              }}
            >
              <strong>June</strong>
              <div
                style={{
                  marginTop: "0.5rem",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  background: `linear-gradient(to right, ${theme.primary}, #0ea5e9, ${theme.success})`,
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={onEventClick}
              >
                <div>{event.name}</div>
                <div style={{ fontSize: "0.7rem" }}>
                  {event.startDate} – {event.endDate}
                </div>
              </div>
            </div>
            <div />
            <div />
            <div />
          </div>
        </div>
      )}
    </div>
  );
}

function EventPeek({ event, kpis, onClose, onViewEvent }) {
  const { theme } = useTheme();
  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: theme.textPrimary }}>{event.name}</h2>
            <p style={{ margin: "0.25rem 0", fontSize: "0.875rem", color: theme.textSecondary }}>
              {event.startDate} – {event.endDate} · {event.venue}
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "0.75rem",
                fontSize: "0.875rem",
              }}
            >
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
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "0.875rem",
                color: theme.textMuted,
              }}
            >
              Close
            </button>
            <button
              onClick={onViewEvent}
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
              View event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------- Event Detail Layout --------------------

function EventDetailLayout({
  event,
  attendees,
  kpis,
  onBackToCalendar,
  showInsightsPanel,
  setShowInsightsPanel,
  showInsightsSlideout,
  setShowInsightsSlideout,
}) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [showChartPreview, setShowChartPreview] = useState(false);
  const [chartPreviewData, setChartPreviewData] = useState(null);

  return (
    <div style={{ marginTop: "1rem" }}>
      <button
        onClick={onBackToCalendar}
        style={{
          marginBottom: "0.5rem",
          border: "none",
          padding: "0.25rem 0.75rem",
          borderRadius: "999px",
          fontSize: "0.75rem",
          background: theme.backgroundTertiary,
          color: theme.textPrimary,
          cursor: "pointer",
        }}
      >
        ← Back to Calendar
      </button>
      <div
        style={{
          background: theme.background,
          borderRadius: "0.75rem",
          padding: "1rem",
          boxShadow: theme.shadow,
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: theme.textPrimary }}>{event.name}</h2>
            <p style={{ margin: 0, fontSize: "0.875rem", color: theme.textSecondary }}>
              {event.startDate} – {event.endDate} · {event.venue}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Studio Dock Icons */}
            <StudioDock
              onOpenInsights={() => setShowInsightsPanel(true)}
              onOpenExplorer={() => setShowInsightsSlideout(true)}
            />
            {/* Countdown */}
            <div style={{ textAlign: "right", fontSize: "0.75rem" }}>
              <div style={{ color: theme.textMuted }}>Countdown</div>
              <div style={{ fontWeight: 600, color: theme.textPrimary }}>
                {(() => {
                  const eventDate = new Date(event.startDate);
                  const today = new Date();
                  const diffTime = eventDate - today;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays > 0) return `${diffDays} days`;
                  if (diffDays === 0) return "Today!";
                  return "Event passed";
                })()}
              </div>
            </div>
          </div>
        </header>

        <EventTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "profile" && (
          <EventProfileTab
            event={event}
            attendees={attendees}
            kpis={kpis}
            onOpenInsights={() => setShowInsightsPanel(true)}
            onOpenChartPreview={(data, title) => {
              setChartPreviewData({ data, title, attendees });
              setShowChartPreview(true);
            }}
          />
        )}
        {activeTab === "activities" && <EventActivitiesTab />}
        {activeTab === "more" && (
          <EventMoreTab
            attendees={attendees}
            onOpenInsightsSlideout={() => setShowInsightsSlideout(true)}
          />
        )}
      </div>

      {showInsightsPanel && (
        <InsightsStudioPanel
          attendees={attendees}
          onClose={() => setShowInsightsPanel(false)}
        />
      )}

      {showInsightsSlideout && (
        <InsightsConfigSlideout
          attendees={attendees}
          onClose={() => setShowInsightsSlideout(false)}
        />
      )}

      {showChartPreview && chartPreviewData && (
        <ChartPreviewSlideout
          data={chartPreviewData.data}
          title={chartPreviewData.title}
          attendees={chartPreviewData.attendees}
          onClose={() => setShowChartPreview(false)}
        />
      )}
    </div>
  );
}

function StudioDock({ onOpenInsights, onOpenExplorer }) {
  const { theme } = useTheme();
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const icons = [
    { id: "insights", Icon: ICONS.insights, label: "Insights", onClick: onOpenInsights, priority: 1 },
    { id: "explorer", Icon: ICONS.explorer, label: "Explorer", onClick: onOpenExplorer, priority: 2 },
    { id: "reports", Icon: ICONS.reports, label: "Reports", onClick: () => {}, priority: 3 },
    { id: "timeline", Icon: ICONS.timeline, label: "Timeline", onClick: () => {}, priority: 2 },
    { id: "ai", Icon: ICONS.ai, label: "AI Assistant", onClick: () => {}, priority: 1 },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: SPACING.xs,
        background: theme.backgroundTertiary,
        borderRadius: SPACING.sm,
        padding: SPACING.xs,
      }}
    >
      {icons.map((item) => {
        const isHovered = hoveredIcon === item.id;
        return (
          <div
            key={item.id}
            style={{ position: "relative" }}
            onMouseEnter={() => setHoveredIcon(item.id)}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <button
              onClick={item.onClick}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: SPACING.sm,
                border: "none",
                background: isHovered ? theme.primary : "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: getTransition(["background", "transform"], "fast"),
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            >
              <item.Icon size={18} color={isHovered ? "white" : theme.textMuted} />
            </button>
            {/* Tooltip */}
            {isHovered && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginTop: SPACING.sm,
                  background: theme.textPrimary,
                  color: theme.background,
                  padding: `${SPACING.xs} ${SPACING.sm}`,
                  borderRadius: SPACING.xs,
                  fontSize: "0.7rem",
                  whiteSpace: "nowrap",
                  zIndex: 100,
                  boxShadow: theme.shadowMd,
                  animation: "fadeIn 0.1s ease-out",
                }}
              >
                {item.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function EventTabs({ activeTab, onChange }) {
  const { theme } = useTheme();
  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "activities", label: "Activities" },
    { id: "more", label: "More ▾" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        borderBottom: `1px solid ${theme.border}`,
        marginBottom: "1rem",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            border: "none",
            borderBottom:
              activeTab === tab.id ? `2px solid ${theme.primary}` : "2px solid transparent",
            background: "transparent",
            padding: "0.5rem 0.75rem",
            cursor: "pointer",
            fontSize: "0.875rem",
            color: activeTab === tab.id ? theme.textPrimary : theme.textMuted,
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// -------------------- Chart Clickable Wrapper (P7: Visual Affordance) --------------------

function ChartClickableWrapper({ children, onClick, isClickable, hintText = "Click to explore" }) {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  if (!isClickable) {
    return <div>{children}</div>;
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        cursor: "pointer",
        borderRadius: SPACING.sm,
        transition: getTransition(["box-shadow", "transform"], "fast"),
        boxShadow: isHovered ? `0 0 0 2px ${theme.primary}, ${theme.shadowMd}` : "none",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {children}

      {/* Hover Overlay with Hint */}
      {isHovered && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `${theme.primary}10`,
            borderRadius: SPACING.sm,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: theme.primary,
              color: "white",
              padding: `${SPACING.xs} ${SPACING.md}`,
              borderRadius: SPACING.sm,
              fontSize: "0.75rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: SPACING.xs,
              boxShadow: theme.shadowMd,
            }}
          >
            <ICONS.insights size={14} />
            {hintText}
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------- Profile Tab --------------------

function EventProfileTab({ event, attendees, kpis, onOpenInsights, onOpenChartPreview }) {
  const fakeTrendData = [
    { label: "Week -6", registrations: 3, revenue: 2400 },
    { label: "Week -5", registrations: 8, revenue: 6400 },
    { label: "Week -4", registrations: 15, revenue: 12000 },
    { label: "Week -3", registrations: 22, revenue: 17600 },
    { label: "Week -2", registrations: 28, revenue: 22400 },
    { label: "Week -1", registrations: 32, revenue: 25600 },
    { label: "Event", registrations: 32, revenue: 26000 },
  ];

  return (
    <div>
      {/* KPIs Row - Full Width */}
      <KpiRow kpis={kpis} />

      {/* Main 2-Column Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {/* Left Column - Charts & Visualizations */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <ChartClickableWrapper
            onClick={() => onOpenChartPreview && onOpenChartPreview(fakeTrendData, "Cumulative Registrations & Revenue")}
            isClickable={!!onOpenChartPreview}
            hintText="Click to explore data"
          >
            <ComboChartWithRecharts data={fakeTrendData} />
          </ChartClickableWrapper>
          <RegistrationFunnel />
          <TypesAndRevenueSection attendees={attendees} />
        </div>

        {/* Right Column - Actions & Info Panels */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <QuickLinksPanel />
          <AlertsPanel />
          <UpcomingViewsPanel />
        </div>
      </div>
    </div>
  );
}

function KpiRow({ kpis }) {
  const { theme } = useTheme();
  const items = [
    { label: "Total attendees", value: kpis.totalAttendees },
    { label: "Current members", value: kpis.currentMembers },
    { label: "Non-members", value: kpis.nonMembers },
    { label: "Lapsed members", value: kpis.lapsedMembers },
    { label: "Complimentary", value: kpis.complimentary },
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        gap: "0.75rem",
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            background: theme.backgroundSecondary,
            borderRadius: "0.5rem",
            padding: "0.5rem 0.75rem",
            border: `1px solid ${theme.border}`,
          }}
        >
          <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>{item.label}</div>
          <div style={{ fontSize: "1.125rem", fontWeight: 600, color: theme.textPrimary }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

function ComboChartWithRecharts({ data }) {
  const { theme } = useTheme();
  return (
    <div
      style={{
        background: theme.backgroundSecondary,
        borderRadius: "0.5rem",
        padding: "0.75rem",
        border: `1px solid ${theme.border}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <strong style={{ fontSize: "0.875rem", color: theme.textPrimary }}>
          Cumulative Registrations & Revenue
        </strong>
        <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>
          Interactive chart
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: theme.textMuted }}
            stroke={theme.textLight}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: theme.textMuted }}
            stroke={theme.textLight}
            label={{
              value: "Registrations",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 11, fill: theme.textMuted },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: theme.textMuted }}
            stroke={theme.textLight}
            label={{
              value: "Revenue ($)",
              angle: 90,
              position: "insideRight",
              style: { fontSize: 11, fill: theme.textMuted },
            }}
          />
          <Tooltip
            contentStyle={{
              background: theme.background,
              border: `1px solid ${theme.border}`,
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
              padding: "0.5rem",
              color: theme.textPrimary,
            }}
            formatter={(value, name) => {
              if (name === "Revenue ($)") {
                return `$${value.toLocaleString()}`;
              }
              return value;
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "0.75rem", paddingTop: "0.5rem", color: theme.textSecondary }}
            iconType="plainline"
          />
          <Bar
            yAxisId="left"
            dataKey="registrations"
            fill={theme.primary}
            name="Registrations"
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            stroke={theme.success}
            strokeWidth={2}
            dot={{ fill: theme.success, r: 4 }}
            name="Revenue ($)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function VitalsRow({ event, kpis, membershipSegments }) {
  const { theme } = useTheme();
  return (
    <div
      style={{
        background: theme.backgroundSecondary,
        borderRadius: "0.5rem",
        padding: "0.75rem",
        border: `1px solid ${theme.border}`,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        fontSize: "0.8rem",
      }}
    >
      <div>
        <div style={{ color: theme.textMuted }}>Total revenue</div>
        <div style={{ fontWeight: 600, color: theme.textPrimary }}>
          ${event.totalRevenue.toLocaleString()}
        </div>
      </div>
      <div>
        <div style={{ color: theme.textMuted }}>Membership mix</div>
        <ul style={{ paddingLeft: "1rem", margin: 0, color: theme.textPrimary }}>
          {membershipSegments.map((seg) => (
            <li key={seg.label}>
              {seg.label}: {seg.count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// -------------------- Registration Funnel --------------------

function RegistrationFunnel() {
  const { theme } = useTheme();
  const stages = [
    { id: 1, label: "Registration Page", shortLabel: "Page", value: 500, color: theme.primaryLight },
    { id: 2, label: "Registration Type", shortLabel: "Type", value: 320, color: theme.primary },
    { id: 3, label: "Registration Options", shortLabel: "Options", value: 180, color: theme.warning },
    { id: 4, label: "Checkout", shortLabel: "Checkout", value: 85, color: theme.error },
    { id: 5, label: "Confirmed", shortLabel: "Confirmed", value: 32, color: theme.success },
  ];

  const baseValue = stages[0].value;

  return (
    <div
      style={{
        background: theme.backgroundSecondary,
        borderRadius: "0.5rem",
        padding: "0.75rem",
        border: `1px solid ${theme.border}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <strong style={{ fontSize: "0.875rem", color: theme.textPrimary }}>Registration Funnel</strong>
        <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>
          Conversion flow
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "0.5rem",
        }}
      >
        {stages.map((stage) => {
          const percentage = ((stage.value / baseValue) * 100).toFixed(1);
          return (
            <div
              key={stage.id}
              style={{
                background: stage.color,
                color: "white",
                borderRadius: "0.5rem",
                padding: "0.75rem 0.5rem",
                textAlign: "center",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = `0 4px 12px ${stage.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {stage.value.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  marginTop: "0.25rem",
                  opacity: 0.9,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={stage.label}
              >
                {stage.shortLabel}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  marginTop: "0.25rem",
                }}
              >
                {percentage}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------- Types and Revenue Section --------------------

function TypesAndRevenueSection({ attendees }) {
  // Color map for registration types
  const COLORS = {
    "Full Conference": "#3b82f6",
    "Workshop Only": "#8b5cf6",
    "Student Pass": "#22c55e",
    "Speaker": "#f59e0b",
    "Guest": "#ec4899",
  };

  // Mock pricing per registration type
  const PRICING = {
    "Full Conference": 800,
    "Workshop Only": 350,
    "Student Pass": 200,
    "Speaker": 0,
    "Guest": 0,
  };

  // Calculate type distribution
  const typeData = useMemo(() => {
    const counts = {};
    attendees.forEach((a) => {
      const type = a.registrationType || "Unknown";
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: COLORS[name] || "#6b7280",
    }));
  }, [attendees]);

  // Calculate revenue by type
  const revenueData = useMemo(() => {
    const revenue = {};
    attendees.forEach((a) => {
      const type = a.registrationType || "Unknown";
      const price = PRICING[type] || 0;
      revenue[type] = (revenue[type] || 0) + price;
    });
    return Object.entries(revenue)
      .map(([name, amount]) => ({
        name,
        amount,
        color: COLORS[name] || "#6b7280",
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [attendees]);

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.amount, 0);
  const maxRevenue = Math.max(...revenueData.map((d) => d.amount), 1);

  return (
    <div
      style={{
        background: "#f9fafb",
        borderRadius: "0.5rem",
        padding: "0.75rem",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}
      >
        {/* Pie Chart Section */}
        <div>
          <div
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              color: "#111827",
            }}
          >
            Registration Types
          </div>
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} attendees`, name]}
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                    fontSize: "0.75rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "0.5rem",
              justifyContent: "center",
            }}
          >
            {typeData.map((item) => (
              <div
                key={item.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.6rem",
                  color: "#374151",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: item.color,
                  }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue List Section */}
        <div>
          <div
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              color: "#111827",
            }}
          >
            Revenue by Type
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {revenueData.map((item) => (
              <div key={item.name}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.75rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  <span style={{ color: "#374151" }}>{item.name}</span>
                  <span style={{ fontWeight: 600, color: "#111827" }}>
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    height: "6px",
                    background: "#e5e7eb",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(item.amount / maxRevenue) * 100}%`,
                      background: item.color,
                      borderRadius: "999px",
                      transition: "width 0.5s ease-out",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Total */}
          <div
            style={{
              marginTop: "0.75rem",
              paddingTop: "0.5rem",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.8rem",
            }}
          >
            <span style={{ fontWeight: 600, color: "#374151" }}>Total</span>
            <span style={{ fontWeight: 700, color: "#111827" }}>
              ${totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------- Quick Links Panel --------------------

function QuickLinksPanel() {
  const actions = [
    {
      id: "add-attendee",
      label: "Add Attendee",
      icon: "+",
      primary: true,
      onClick: () => alert("Add Attendee clicked - implement registration form")
    },
    {
      id: "view-registrations",
      label: "View All Registrations",
      icon: "▤",
      primary: false,
      onClick: () => alert("View All Registrations clicked - navigate to registrations list")
    },
    {
      id: "manage-event",
      label: "Manage Event",
      icon: "⚙",
      primary: false,
      onClick: () => alert("Manage Event clicked - open event settings")
    },
  ];

  return (
    <div
      style={{
        background: "white",
        borderRadius: "0.5rem",
        border: "1px solid #e5e7eb",
        padding: "1rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          fontSize: "0.9rem",
          fontWeight: 600,
          color: "#111827",
          marginBottom: "0.75rem",
        }}
      >
        Quick Actions
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            style={{
              background: action.primary ? "#1e3a5f" : "white",
              color: action.primary ? "white" : "#374151",
              border: action.primary ? "none" : "1px solid #e5e7eb",
              borderRadius: "0.375rem",
              padding: "0.5rem 0.75rem",
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              width: "100%",
              textAlign: "left",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (action.primary) {
                e.currentTarget.style.background = "#2d4a6f";
              } else {
                e.currentTarget.style.background = "#f9fafb";
              }
            }}
            onMouseLeave={(e) => {
              if (action.primary) {
                e.currentTarget.style.background = "#1e3a5f";
              } else {
                e.currentTarget.style.background = "white";
              }
            }}
          >
            <span style={{ fontSize: "1rem", lineHeight: 1 }}>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// -------------------- Alerts Panel --------------------

function AlertsPanel() {
  const alerts = [
    {
      id: 1,
      type: "warning",
      icon: "⚠",
      message: "47 incomplete registrations detected. Follow up to complete checkout.",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      type: "info",
      icon: "ℹ",
      message: "12 new registrations this week! Consider sending welcome details.",
      timestamp: "1 day ago",
    },
    {
      id: 3,
      type: "success",
      icon: "✓",
      message: "Revenue target 85% achieved. Event on track for full capacity.",
      timestamp: "3 days ago",
    },
  ];

  const getIconColor = (type) => {
    switch (type) {
      case "warning":
        return "#f59e0b";
      case "info":
        return "#3b82f6";
      case "success":
        return "#22c55e";
      default:
        return "#6b7280";
    }
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "0.5rem",
        border: "1px solid #e5e7eb",
        padding: "1rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          fontSize: "0.9rem",
          fontWeight: 600,
          color: "#111827",
          marginBottom: "0.75rem",
        }}
      >
        Alerts & Insights
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {alerts.map((alert, index) => (
          <div
            key={alert.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              padding: "0.5rem 0",
              borderBottom: index < alerts.length - 1 ? "1px solid #f3f4f6" : "none",
            }}
          >
            <span
              style={{
                fontSize: "1rem",
                lineHeight: 1,
                color: getIconColor(alert.type),
                flexShrink: 0,
                marginTop: "0.1rem",
              }}
            >
              {alert.icon}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#374151",
                  lineHeight: 1.4,
                }}
              >
                {alert.message}
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#9ca3af",
                  marginTop: "0.25rem",
                }}
              >
                {alert.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------- Upcoming Views Panel --------------------

function UpcomingViewsPanel() {
  const [currentMonth, setCurrentMonth] = useState(5); // June = 5 (0-indexed)
  const currentYear = 2025;

  // Event dates to highlight (June 12-14, 2025)
  const eventDates = [12, 13, 14];

  // Upcoming sessions/events
  const upcomingEvents = [
    {
      id: 1,
      month: "Jun",
      day: 12,
      dayName: "Thu",
      time: "9:00 AM",
      type: "Session",
      title: "Opening Keynote",
      location: "Main Hall",
      status: "SCHEDULED",
    },
    {
      id: 2,
      month: "Jun",
      day: 12,
      dayName: "Thu",
      time: "12:30 PM",
      type: "Social",
      title: "Networking Lunch",
      location: "Grand Ballroom",
      status: "SCHEDULED",
    },
    {
      id: 3,
      month: "Jun",
      day: 13,
      dayName: "Fri",
      time: "2:00 PM",
      type: "Session",
      title: "Awards Ceremony",
      location: "Main Hall",
      status: "SCHEDULED",
    },
  ];

  // Generate calendar days for the month
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fullMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  // Create calendar grid
  const calendarDays = [];
  // Add empty cells for days before the 1st
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "0.5rem",
        border: "1px solid #e5e7eb",
        padding: "1rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.75rem",
        }}
      >
        <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111827" }}>
          Upcoming Events
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={handlePrevMonth}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#6b7280",
              fontSize: "0.8rem",
              padding: "0.125rem 0.25rem",
            }}
          >
            ‹
          </button>
          <span style={{ fontSize: "0.75rem", color: "#374151", minWidth: "4rem", textAlign: "center" }}>
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={handleNextMonth}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#6b7280",
              fontSize: "0.8rem",
              padding: "0.125rem 0.25rem",
            }}
          >
            ›
          </button>
        </div>
      </div>

      {/* Mini Calendar */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 500, textAlign: "center", marginBottom: "0.5rem", color: "#374151" }}>
          {fullMonthNames[currentMonth]} {currentYear}
        </div>
        {/* Day headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "0.125rem",
            marginBottom: "0.25rem",
          }}
        >
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div
              key={i}
              style={{
                fontSize: "0.6rem",
                color: "#9ca3af",
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              {day}
            </div>
          ))}
        </div>
        {/* Calendar grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "0.125rem",
          }}
        >
          {calendarDays.map((day, i) => {
            const isEventDate = currentMonth === 5 && eventDates.includes(day); // June only
            const isWeekend = i % 7 === 0 || i % 7 === 6;
            return (
              <div
                key={i}
                style={{
                  fontSize: "0.65rem",
                  textAlign: "center",
                  padding: "0.2rem",
                  borderRadius: "0.25rem",
                  background: isEventDate ? "#3b82f6" : "transparent",
                  color: isEventDate ? "white" : isWeekend ? "#3b82f6" : "#374151",
                  fontWeight: isEventDate ? 600 : 400,
                  cursor: day ? "pointer" : "default",
                }}
              >
                {day || ""}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events List */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {upcomingEvents.map((event, index) => (
          <div
            key={event.id}
            style={{
              display: "flex",
              gap: "0.5rem",
              padding: "0.5rem 0",
              borderBottom: index < upcomingEvents.length - 1 ? "1px solid #f3f4f6" : "none",
            }}
          >
            {/* Date Badge */}
            <div
              style={{
                background: "#3b82f6",
                color: "white",
                borderRadius: "0.375rem",
                padding: "0.25rem 0.4rem",
                textAlign: "center",
                minWidth: "2.25rem",
                flexShrink: 0,
              }}
            >
              <div style={{ fontSize: "0.6rem", fontWeight: 500, textTransform: "uppercase" }}>
                {event.month}
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, lineHeight: 1 }}>
                {event.day}
              </div>
              <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.8)" }}>
                {event.dayName}
              </div>
            </div>
            {/* Event Details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.65rem", color: "#6b7280" }}>
                {event.time} | {event.type}
              </div>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#111827", marginTop: "0.125rem" }}>
                {event.title}
              </div>
              <div style={{ fontSize: "0.65rem", color: "#9ca3af", marginTop: "0.125rem" }}>
                {event.location}
              </div>
            </div>
            {/* Status Badge */}
            <div
              style={{
                alignSelf: "center",
                fontSize: "0.55rem",
                fontWeight: 600,
                background: "#dbeafe",
                color: "#1d4ed8",
                borderRadius: "999px",
                padding: "0.125rem 0.4rem",
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              {event.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------- Activities Tab (Timeline) --------------------

function EventActivitiesTab() {
  const { theme } = useTheme();
  const [filter, setFilter] = useState("all");

  const activities = [
    { id: 1, type: "registration", title: "New Registration", desc: "Alice Member registered for Full Conference", time: "2 hours ago", Icon: ICONS.user, color: theme.success },
    { id: 2, type: "payment", title: "Payment Received", desc: "$800.00 received from Bob NonMember", time: "4 hours ago", Icon: ICONS.creditCard, color: theme.primary },
    { id: 3, type: "update", title: "Registration Updated", desc: "Carol Lapsed changed session to Leadership Track", time: "Yesterday", Icon: ICONS.edit, color: theme.warning },
    { id: 4, type: "registration", title: "New Registration", desc: "David Complimentary added as Speaker", time: "Yesterday", Icon: ICONS.user, color: theme.success },
    { id: 5, type: "cancellation", title: "Registration Cancelled", desc: "Refund processed for James Wilson", time: "2 days ago", Icon: ICONS.x, color: theme.error },
    { id: 6, type: "registration", title: "Batch Import", desc: "15 registrations imported from CRM", time: "3 days ago", Icon: ICONS.download, color: "#8b5cf6" },
    { id: 7, type: "update", title: "Event Updated", desc: "Venue details updated by admin", time: "1 week ago", Icon: ICONS.edit, color: theme.textMuted },
    { id: 8, type: "registration", title: "Early Bird Ended", desc: "Early bird registration period closed", time: "2 weeks ago", Icon: ICONS.ticket, color: theme.warning },
  ];

  const filters = [
    { id: "all", label: "All Activities" },
    { id: "registration", label: "Registrations" },
    { id: "payment", label: "Payments" },
    { id: "update", label: "Updates" },
  ];

  const filteredActivities = filter === "all"
    ? activities
    : activities.filter((a) => a.type === filter);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: SPACING.xl }}>
      {/* Left Filter Panel */}
      <div>
        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: theme.textSecondary, marginBottom: SPACING.md }}>
          Filter Activities
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: SPACING.xs }}>
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: `${SPACING.sm} ${SPACING.md}`,
                borderRadius: SPACING.sm,
                border: "none",
                background: filter === f.id ? theme.primaryLight : "transparent",
                color: filter === f.id ? theme.primary : theme.textMuted,
                fontSize: "0.8rem",
                fontWeight: filter === f.id ? 600 : 400,
                textAlign: "left",
                cursor: "pointer",
                transition: getTransition(["background", "color"], "fast"),
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: theme.textSecondary, marginBottom: SPACING.md }}>
          Recent Activity ({filteredActivities.length})
        </div>
        <div style={{ position: "relative", paddingLeft: SPACING.xl }}>
          {/* Timeline Line */}
          <div
            style={{
              position: "absolute",
              left: "0.4rem",
              top: SPACING.sm,
              bottom: SPACING.sm,
              width: "2px",
              background: theme.border,
            }}
          />

          {/* Timeline Items */}
          {filteredActivities.map((activity, idx) => (
            <div
              key={activity.id}
              style={{
                position: "relative",
                paddingBottom: idx === filteredActivities.length - 1 ? 0 : SPACING.lg,
                animation: "slideInRight 0.3s ease-out",
                animationDelay: `${idx * 50}ms`,
                animationFillMode: "both",
              }}
            >
              {/* Timeline Dot */}
              <div
                style={{
                  position: "absolute",
                  left: "-1.5rem",
                  top: SPACING.xs,
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: theme.background,
                  border: `2px solid ${activity.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: theme.shadow,
                }}
              >
                <activity.Icon size={12} color={activity.color} />
              </div>

              {/* Content */}
              <div
                style={{
                  background: theme.backgroundSecondary,
                  borderRadius: SPACING.sm,
                  padding: `${SPACING.md} ${SPACING.lg}`,
                  boxShadow: theme.shadow,
                  transition: getTransition("transform", "fast"),
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: theme.textPrimary }}>
                    {activity.title}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: theme.textLight }}>{activity.time}</div>
                </div>
                <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginTop: SPACING.xs }}>
                  {activity.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------- More / People Listing --------------------

function EventMoreTab({ attendees, onOpenInsightsSlideout }) {
  const [showCorrelationMenu, setShowCorrelationMenu] = useState(false);
  const [correlationType, setCorrelationType] = useState(null);

  const correlations = [
    { id: "location", label: "Location vs Renewal", dimension: "province", metric: "renewal" },
    { id: "age", label: "Age Group vs Renewal", dimension: "ageGroup", metric: "renewal" },
    { id: "education", label: "Education vs Renewal", dimension: "education", metric: "renewal" },
  ];

  function handleCorrelationSelect(correlation) {
    setCorrelationType(correlation);
    setShowCorrelationMenu(false);
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
          position: "relative",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "0.95rem" }}>People</h3>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowCorrelationMenu(!showCorrelationMenu)}
            style={{
              border: "1px solid #d1d5db",
              background: "white",
              borderRadius: "0.375rem",
              padding: "0.375rem 0.75rem",
              color: "#2563eb",
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            Correlation Insights ▾
          </button>
          {showCorrelationMenu && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "0.25rem",
                background: "white",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 10,
                minWidth: "200px",
              }}
            >
              {correlations.map((corr) => (
                <button
                  key={corr.id}
                  onClick={() => handleCorrelationSelect(corr)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    border: "none",
                    background: "transparent",
                    textAlign: "left",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    color: "#374151",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                  }}
                >
                  {corr.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <MorePeopleListing attendees={attendees} />
      {correlationType && correlationType.id === "location" && (
        <InsightsConfigSlideout
          attendees={attendees}
          onClose={() => setCorrelationType(null)}
        />
      )}
      {correlationType && correlationType.id !== "location" && (
        <CorrelationSlideout
          attendees={attendees}
          dimension={correlationType.dimension}
          dimensionLabel={correlationType.label.split(" vs ")[0]}
          metric={correlationType.metric}
          onClose={() => setCorrelationType(null)}
        />
      )}
    </div>
  );
}

function MorePeopleListing({ attendees }) {
  const { theme } = useTheme();
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [savedViews, setSavedViews] = useState(() => {
    // Load saved views from localStorage on init
    try {
      const stored = localStorage.getItem('savedViews');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [selectedView, setSelectedView] = useState("Default");
  const [viewMode, setViewMode] = useState("list"); // "list" | "cards"
  const [selectedCard, setSelectedCard] = useState(null); // active card for vertical nav
  const [peekData, setPeekData] = useState(null); // { field, segment, attendees }
  const [selectedAttendee, setSelectedAttendee] = useState(null); // for attendee peek
  const [showSaveModal, setShowSaveModal] = useState(false); // P2.3: Save View Modal

  const cards = [
    { title: "Registration Types", field: "registrationType", Icon: ICONS.reports },
    { title: "Dietary Restrictions", field: "dietary", Icon: ICONS.users },
    { title: "Sessions", field: "session", Icon: ICONS.timeline },
    { title: "Tickets", field: "ticketType", Icon: ICONS.ticket },
    { title: "Membership Type", field: "memberType", Icon: ICONS.user },
    { title: "Age Group", field: "ageGroup", Icon: ICONS.insights },
    { title: "Province", field: "province", Icon: ICONS.mapPin },
    { title: "Tenure", field: "tenure", Icon: ICONS.briefcase },
    { title: "Education", field: "education", Icon: ICONS.graduation },
  ];

  const colorPalettes = {
    registrationType: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"],
    dietary: ["#22c55e", "#10b981", "#14b8a6", "#06b6d4"],
    session: ["#f59e0b", "#eab308", "#84cc16", "#22c55e"],
    ticketType: ["#3b82f6", "#8b5cf6"],
    memberType: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"],
    ageGroup: ["#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7"],
    province: ["#f43f5e", "#ec4899", "#d946ef", "#a855f7", "#8b5cf6", "#6366f1", "#3b82f6", "#0ea5e9", "#06b6d4"],
    tenure: ["#6b7280", "#9ca3af"],
    education: ["#84cc16", "#22c55e", "#10b981", "#14b8a6"],
  };

  const filteredAttendees = useMemo(
    () => filterAttendees(attendees, filters, searchTerm),
    [attendees, filters, searchTerm]
  );

  function handleToggle(field, segment) {
    setFilters((prev) => {
      const current = prev[field] || [];
      const exists = current.includes(segment);
      const next = exists
        ? current.filter((v) => v !== segment)
        : [...current, segment];
      const updated = { ...prev, [field]: next };
      if (updated[field].length === 0) delete updated[field];
      return updated;
    });
  }

  function handleSaveView(viewData) {
    // Save to localStorage
    const newView = {
      id: Date.now(),
      name: viewData.name,
      description: viewData.description,
      filters: viewData.filters,
      createdAt: new Date().toISOString(),
    };
    const updatedViews = [...savedViews, newView];
    setSavedViews(updatedViews);
    localStorage.setItem('savedViews', JSON.stringify(updatedViews));
    setSelectedView(viewData.name);
    setShowSaveModal(false);
  }

  function handleLoadView(view) {
    setFilters(view.filters || {});
    setSelectedView(view.name);
  }

  function handleDeleteView(viewId) {
    const updatedViews = savedViews.filter(v => v.id !== viewId);
    setSavedViews(updatedViews);
    localStorage.setItem('savedViews', JSON.stringify(updatedViews));
    if (selectedView !== "Default") {
      setSelectedView("Default");
      setFilters({});
    }
  }

  function handleCardSelect(cardField) {
    setSelectedCard(selectedCard === cardField ? null : cardField);
    setPeekData(null); // Close peek when changing cards
  }

  function handleSegmentPeek(field, segment) {
    const segmentAttendees = attendees.filter((a) => (a[field] || "Unknown") === segment);
    setPeekData({ field, segment, attendees: segmentAttendees });
    setSelectedAttendee(null);
  }

  function handleAttendeeClick(attendee) {
    setSelectedAttendee(attendee);
  }

  function handleCardFilterClick(field, label) {
    handleToggle(field, label);
  }

  // Determine if peek panel should show
  const showPeek = peekData || selectedAttendee;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: viewMode === "list"
          ? showPeek
            ? "minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1.5fr)"
            : "minmax(0, 1fr) minmax(0, 3fr)"
          : "1fr",
        gap: "1rem",
        marginTop: "0.5rem",
      }}
    >
      {/* Left Column - Vertical Card Navigation */}
      {viewMode === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <ListingFilterHeader
            selectedView={selectedView}
            savedViews={savedViews}
            onSaveView={() => setShowSaveModal(true)}
            onLoadView={handleLoadView}
            onDeleteView={handleDeleteView}
            onResetView={() => { setFilters({}); setSelectedView("Default"); }}
          />
          <ListingSearchInput value={searchTerm} onChange={setSearchTerm} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginTop: "0.5rem",
              maxHeight: "520px",
              overflowY: "auto",
            }}
          >
            {cards.map((card) => {
              const segments = groupByField(attendees, card.field);
              const selectedValues = filters[card.field] || [];
              const isActive = selectedCard === card.field;
              return (
                <VerticalNavCard
                  key={card.title}
                  title={card.title}
                  Icon={card.Icon}
                  field={card.field}
                  segments={segments}
                  selectedValues={selectedValues}
                  isActive={isActive}
                  onCardClick={() => handleCardSelect(card.field)}
                  onToggle={(segment) => handleToggle(card.field, segment)}
                  onSegmentPeek={(segment) => handleSegmentPeek(card.field, segment)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Middle Column - Attendee List */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
          }}
        >
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>
            {viewMode === "cards" ? "Demographic Overview" : `Showing ${filteredAttendees.length} attendee(s)`}
          </div>
          <div
            style={{
              display: "inline-flex",
              borderRadius: "999px",
              background: "#e5e7eb",
              padding: "2px",
            }}
          >
            <button
              onClick={() => setViewMode("list")}
              style={{
                border: "none",
                padding: "0.25rem 0.75rem",
                borderRadius: "999px",
                background: viewMode === "list" ? "white" : "transparent",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontWeight: viewMode === "list" ? 600 : 400,
                color: viewMode === "list" ? "#111827" : "#6b7280",
                transition: "all 0.2s",
              }}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("cards")}
              style={{
                border: "none",
                padding: "0.25rem 0.75rem",
                borderRadius: "999px",
                background: viewMode === "cards" ? "white" : "transparent",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontWeight: viewMode === "cards" ? 600 : 400,
                color: viewMode === "cards" ? "#111827" : "#6b7280",
                transition: "all 0.2s",
              }}
            >
              Cards
            </button>
          </div>
        </div>
        {viewMode === "list" ? (
          <AttendeeList attendees={filteredAttendees} onAttendeeClick={handleAttendeeClick} />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {cards.map((card) => (
              <DemographicCard
                key={card.title}
                title={card.title}
                field={card.field}
                attendees={filteredAttendees}
                colorPalette={colorPalettes[card.field]}
                onFilterClick={handleCardFilterClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Column - Peek Panel */}
      {viewMode === "list" && showPeek && (
        <PeekPanel
          peekData={peekData}
          selectedAttendee={selectedAttendee}
          onClose={() => {
            setPeekData(null);
            setSelectedAttendee(null);
          }}
          onAttendeeClick={handleAttendeeClick}
        />
      )}

      {/* P2.3: Save View Modal */}
      <SaveViewModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveView}
        currentFilters={filters}
      />
    </div>
  );
}

function ListingFilterHeader({ selectedView, savedViews = [], onSaveView, onLoadView, onDeleteView, onResetView }) {
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

function ListingSearchInput({ value, onChange }) {
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

function ListingCard({ title, segments, selectedValues, onToggle }) {
  return (
    <div
      style={{
        borderRadius: "0.5rem",
        border: "1px solid #e5e7eb",
        padding: "0.5rem 0.75rem",
        background: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
      }}
    >
      <div
        style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          marginBottom: "0.25rem",
        }}
      >
        {title}
      </div>
      {segments.map((seg) => {
        const isSelected = selectedValues.includes(seg.label);
        return (
          <button
            key={seg.label}
            onClick={() => onToggle(seg.label)}
            style={{
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              padding: "0.15rem 0.5rem",
              fontSize: "0.75rem",
              background: isSelected ? "#2563eb" : "white",
              color: isSelected ? "white" : "#111827",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <span>{seg.label}</span>
            <span
              style={{
                marginLeft: "0.5rem",
                fontSize: "0.7rem",
                opacity: 0.8,
              }}
            >
              {seg.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function VerticalNavCard({ title, Icon, field, segments, selectedValues, isActive, onCardClick, onToggle, onSegmentPeek }) {
  const { theme } = useTheme();
  return (
    <div
      style={{
        borderRadius: SPACING.sm,
        border: isActive ? `2px solid ${theme.primary}` : "none",
        background: isActive ? theme.primaryLight : theme.backgroundSecondary,
        overflow: "hidden",
        transition: getTransition(["background", "border", "box-shadow"], "fast"),
        boxShadow: theme.shadow,
      }}
    >
      {/* Card Header - Always Visible */}
      <button
        onClick={onCardClick}
        style={{
          width: "100%",
          padding: `${SPACING.sm} ${SPACING.md}`,
          border: "none",
          background: "transparent",
          display: "flex",
          alignItems: "center",
          gap: SPACING.sm,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", color: isActive ? theme.primary : theme.textMuted }}>
          <Icon size={18} />
        </span>
        <span style={{ flex: 1, fontSize: "0.8rem", fontWeight: 600, color: theme.textPrimary }}>
          {title}
        </span>
        <span style={{ fontSize: "0.7rem", color: theme.textMuted }}>
          {segments.length}
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            color: theme.textMuted,
            transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
            transition: getTransition("transform", "fast"),
          }}
        >
          <ICONS.chevronDown size={14} />
        </span>
      </button>

      {/* Expanded Segments */}
      {isActive && (
        <div
          style={{
            padding: `${SPACING.xs} ${SPACING.md} ${SPACING.sm}`,
            display: "flex",
            flexDirection: "column",
            gap: SPACING.xs,
            borderTop: `1px solid ${theme.border}`,
          }}
        >
          {segments.map((seg) => {
            const isSelected = selectedValues.includes(seg.label);
            return (
              <div
                key={seg.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: SPACING.sm,
                }}
              >
                <button
                  onClick={() => onToggle(seg.label)}
                  style={{
                    flex: 1,
                    borderRadius: SPACING.sm,
                    border: "none",
                    padding: `${SPACING.xs} ${SPACING.sm}`,
                    fontSize: "0.75rem",
                    background: isSelected ? theme.primary : theme.background,
                    color: isSelected ? "white" : theme.textPrimary,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: getTransition(["background", "color"], "fast"),
                    boxShadow: isSelected ? "none" : theme.shadow,
                  }}
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {seg.label}
                  </span>
                  <span
                    style={{
                      marginLeft: SPACING.sm,
                      fontSize: "0.7rem",
                      opacity: 0.8,
                      fontWeight: 600,
                    }}
                  >
                    {seg.count}
                  </span>
                </button>
                <button
                  onClick={() => onSegmentPeek(seg.label)}
                  title="Preview"
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: SPACING.xs,
                    border: "none",
                    background: theme.backgroundTertiary,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: theme.textMuted,
                    transition: getTransition(["background", "color", "transform"], "fast"),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = theme.primary;
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = theme.backgroundTertiary;
                    e.currentTarget.style.color = theme.textMuted;
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <ICONS.chevronRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PeekPanel({ peekData, selectedAttendee, onClose, onAttendeeClick }) {
  return (
    <div
      style={{
        borderRadius: "0.5rem",
        border: "1px solid #e5e7eb",
        background: "white",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "560px",
        overflow: "hidden",
      }}
    >
      {/* Peek Header */}
      <div
        style={{
          padding: "0.75rem",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f9fafb",
        }}
      >
        <div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {selectedAttendee ? "Attendee Details" : "Segment Preview"}
          </div>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111827" }}>
            {selectedAttendee ? selectedAttendee.name : peekData?.segment || "—"}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "0.25rem",
            border: "none",
            background: "#e5e7eb",
            cursor: "pointer",
            fontSize: "1rem",
            color: "#6b7280",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>
      </div>

      {/* Peek Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "0.75rem" }}>
        {selectedAttendee ? (
          <AttendeePeekDetails attendee={selectedAttendee} />
        ) : peekData ? (
          <SegmentPeekList attendees={peekData.attendees} onAttendeeClick={onAttendeeClick} />
        ) : null}
      </div>
    </div>
  );
}

function AttendeePeekDetails({ attendee }) {
  const fields = [
    { label: "ID", value: attendee.id },
    { label: "Name", value: attendee.name },
    { label: "Company", value: attendee.company || "—" },
    { label: "Email", value: attendee.email || "—" },
    { label: "Phone", value: attendee.phone || "—" },
    { label: "Confirmation", value: attendee.confirmationId || "—" },
    { label: "Registration Date", value: attendee.registrationDate || "—" },
    { label: "Member Type", value: attendee.memberType },
    { label: "Status", value: attendee.membershipStatus },
    { label: "Province", value: attendee.province },
    { label: "Registration Type", value: attendee.registrationType },
    { label: "Dietary", value: attendee.dietary },
    { label: "Session", value: attendee.session },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {fields.map((f) => (
        <div
          key={f.label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0.35rem 0",
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>{f.label}</span>
          <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "#111827", textAlign: "right" }}>
            {f.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function SegmentPeekList({ attendees, onAttendeeClick }) {
  const { theme } = useTheme();
  const [hoveredAttendee, setHoveredAttendee] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e, attendee) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({ x: rect.left - 220, y: rect.top });
    setHoveredAttendee(attendee);
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginBottom: "0.5rem" }}>
        {attendees.length} attendee(s) in this segment
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {attendees.map((a) => (
          <button
            key={a.id}
            onClick={() => onAttendeeClick(a)}
            onMouseEnter={(e) => handleMouseEnter(e, a)}
            onMouseLeave={() => setHoveredAttendee(null)}
            style={{
              padding: "0.5rem",
              borderRadius: "0.375rem",
              border: `1px solid ${theme.border}`,
              background: theme.backgroundSecondary,
              cursor: "pointer",
              textAlign: "left",
              transition: getTransition(["background", "border-color", "box-shadow"], "fast"),
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = theme.primaryLight;
              e.currentTarget.style.borderColor = theme.primary;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.primary}40`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = theme.backgroundSecondary;
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: "0.8rem", fontWeight: 500, color: theme.textPrimary }}>{a.name}</div>
            <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>
              {a.memberType} · {a.province}
            </div>
          </button>
        ))}
      </div>

      {/* Hover Preview Tooltip */}
      {hoveredAttendee && (
        <div
          style={{
            position: "fixed",
            left: Math.max(10, hoverPosition.x),
            top: hoverPosition.y,
            width: "200px",
            background: theme.background,
            border: `1px solid ${theme.border}`,
            borderRadius: SPACING.sm,
            boxShadow: theme.shadowLg,
            padding: SPACING.sm,
            zIndex: 100,
            pointerEvents: "none",
          }}
        >
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: theme.textPrimary, marginBottom: SPACING.xs }}>
            {hoveredAttendee.name}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "0.65rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: theme.textMuted }}>Company</span>
              <span style={{ color: theme.textSecondary }}>{hoveredAttendee.company || "—"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: theme.textMuted }}>Email</span>
              <span style={{ color: theme.textSecondary, maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis" }}>{hoveredAttendee.email || "—"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: theme.textMuted }}>Status</span>
              <span style={{ color: theme.textSecondary }}>{hoveredAttendee.membershipStatus}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: theme.textMuted }}>Registration</span>
              <span style={{ color: theme.textSecondary }}>{hoveredAttendee.registrationType}</span>
            </div>
          </div>
          <div style={{ marginTop: SPACING.xs, paddingTop: SPACING.xs, borderTop: `1px solid ${theme.border}`, fontSize: "0.6rem", color: theme.textMuted, textAlign: "center" }}>
            Click for full details
          </div>
        </div>
      )}
    </div>
  );
}

function AttendeeList({ attendees, onAttendeeClick }) {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    { key: "id", label: "ID", width: "60px" },
    { key: "name", label: "Name", width: "150px" },
    { key: "company", label: "Company", width: "140px" },
    { key: "email", label: "Email", width: "180px" },
    { key: "phone", label: "Phone", width: "130px" },
    { key: "confirmationId", label: "Confirmation ID", width: "120px" },
    { key: "registrationDate", label: "Reg. Date", width: "100px" },
  ];

  // Calculate pagination
  const totalPages = Math.ceil(attendees.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, attendees.length);
  const paginatedAttendees = attendees.slice(startIndex, endIndex);

  // Reset to page 1 when attendees change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [attendees.length]);

  // P3.6: Use EmptyState component when no attendees
  if (!attendees.length) {
    return (
      <EmptyState
        {...EMPTY_STATES.noFiltersMatch}
        variant="compact"
      />
    );
  }

  return (
    <div
      style={{
        borderRadius: "0.5rem",
        border: `1px solid ${theme.border}`,
        background: theme.backgroundSecondary,
        fontSize: "0.75rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Pagination Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem 0.75rem",
          borderBottom: `1px solid ${theme.border}`,
          background: theme.backgroundSecondary,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: theme.textMuted, fontSize: "0.75rem" }}>
            {startIndex + 1}–{endIndex} of {attendees.length}
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{
              border: `1px solid ${theme.border}`,
              borderRadius: "0.25rem",
              padding: "0.15rem 0.35rem",
              fontSize: "0.7rem",
              background: theme.background,
              color: theme.textPrimary,
              cursor: "pointer",
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* P3.8: Export Menu */}
          <ExportMenu data={attendees} columns={columns} />

          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                border: `1px solid ${theme.border}`,
                borderRadius: "0.25rem",
                padding: "0.25rem 0.5rem",
                fontSize: "0.7rem",
                background: currentPage === 1 ? theme.backgroundTertiary : theme.background,
                color: currentPage === 1 ? theme.textLight : theme.textSecondary,
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              ‹
            </button>
            <span style={{ fontSize: "0.7rem", color: theme.textSecondary, padding: "0 0.35rem" }}>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                border: `1px solid ${theme.border}`,
                borderRadius: "0.25rem",
                padding: "0.25rem 0.5rem",
                fontSize: "0.7rem",
                background: currentPage === totalPages ? theme.backgroundTertiary : theme.background,
                color: currentPage === totalPages ? theme.textLight : theme.textSecondary,
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div style={{ maxHeight: "400px", overflow: "auto" }}>
      {/* Table Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: columns.map((c) => c.width).join(" "),
          background: theme.backgroundTertiary,
          borderBottom: `1px solid ${theme.border}`,
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        {columns.map((col) => (
          <div
            key={col.key}
            style={{
              padding: "0.5rem 0.5rem",
              fontWeight: 600,
              color: theme.textSecondary,
              borderRight: `1px solid ${theme.border}`,
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.025em",
            }}
          >
            {col.label}
          </div>
        ))}
      </div>

      {/* Table Body */}
      {paginatedAttendees.map((a, idx) => (
        <div
          key={a.id}
          onClick={() => onAttendeeClick && onAttendeeClick(a)}
          style={{
            display: "grid",
            gridTemplateColumns: columns.map((c) => c.width).join(" "),
            borderBottom: `1px solid ${theme.border}`,
            background: idx % 2 === 0 ? theme.background : theme.backgroundSecondary,
            cursor: onAttendeeClick ? "pointer" : "default",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => {
            if (onAttendeeClick) e.currentTarget.style.background = theme.primaryLight;
          }}
          onMouseLeave={(e) => {
            if (onAttendeeClick) e.currentTarget.style.background = idx % 2 === 0 ? theme.background : theme.backgroundSecondary;
          }}
        >
          <div style={{ padding: "0.5rem", color: theme.textMuted, borderRight: `1px solid ${theme.border}` }}>
            {a.id}
          </div>
          <div style={{ padding: "0.5rem", fontWeight: 500, color: theme.textPrimary, borderRight: `1px solid ${theme.border}`, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {a.name}
          </div>
          <div style={{ padding: "0.5rem", color: theme.textSecondary, borderRight: `1px solid ${theme.border}`, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {a.company || "—"}
          </div>
          <div style={{ padding: "0.5rem", color: theme.primary, borderRight: `1px solid ${theme.border}`, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {a.email || "—"}
          </div>
          <div style={{ padding: "0.5rem", color: theme.textSecondary, borderRight: `1px solid ${theme.border}` }}>
            {a.phone || "—"}
          </div>
          <div style={{ padding: "0.5rem", color: theme.success, fontFamily: "monospace", fontSize: "0.7rem", borderRight: `1px solid ${theme.border}` }}>
            {a.confirmationId || "—"}
          </div>
          <div style={{ padding: "0.5rem", color: theme.textMuted }}>
            {a.registrationDate || "—"}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

function DemographicCard({ title, field, attendees, colorPalette, onFilterClick, onCountClick }) {
  const segments = useMemo(() => groupByField(attendees, field), [attendees, field]);
  const totalCount = attendees.length;
  const segmentsWithPercentage = useMemo(
    () => computeSegmentsWithPercentage(segments, totalCount),
    [segments, totalCount]
  );
  const [peekSegment, setPeekSegment] = useState(null);

  const getColor = (idx) => colorPalette[idx % colorPalette.length];

  // Get attendees for peek segment
  const peekAttendees = useMemo(() => {
    if (!peekSegment) return [];
    return attendees.filter((a) => (a[field] || "Unknown") === peekSegment);
  }, [attendees, field, peekSegment]);

  return (
    <div
      style={{
        borderRadius: "0.75rem",
        border: "1px solid #e5e7eb",
        padding: "0.75rem",
        background: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div
        style={{
          fontSize: "0.85rem",
          fontWeight: 700,
          color: "#111827",
          marginBottom: "0.25rem",
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: "0.7rem", color: "#6b7280", marginBottom: "0.25rem" }}>
        {segments.length} options
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {segmentsWithPercentage.map((seg, idx) => {
          const color = getColor(idx);
          return (
            <div
              key={seg.label}
              style={{
                cursor: onFilterClick ? "pointer" : "default",
                transition: "all 0.2s",
              }}
              onClick={() => onFilterClick && onFilterClick(field, seg.label)}
              onMouseEnter={(e) => {
                if (onFilterClick) {
                  e.currentTarget.style.transform = "scale(1.02)";
                }
              }}
              onMouseLeave={(e) => {
                if (onFilterClick) {
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.72rem",
                  color: "#374151",
                  marginBottom: "0.25rem",
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {seg.label}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPeekSegment(peekSegment === seg.label ? null : seg.label);
                    if (onCountClick) onCountClick(field, seg.label);
                  }}
                  style={{
                    marginLeft: "0.5rem",
                    fontWeight: 700,
                    color: peekSegment === seg.label ? "#2563eb" : "#111827",
                    fontSize: "0.75rem",
                    background: peekSegment === seg.label ? "#eff6ff" : "transparent",
                    border: "none",
                    padding: "0.1rem 0.35rem",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  title="Click to preview"
                >
                  {seg.count}
                </button>
                <span
                  style={{
                    marginLeft: "0.35rem",
                    fontSize: "0.7rem",
                    color: "#6b7280",
                  }}
                >
                  ({seg.percentage}%)
                </span>
              </div>
              <div
                style={{
                  height: "6px",
                  borderRadius: "999px",
                  background: "#f3f4f6",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${seg.percentage}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}dd)`,
                    borderRadius: "999px",
                    transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    boxShadow: `0 0 8px ${color}40`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Count Click Peek Display */}
      {peekSegment && (
        <div
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem",
            background: "#eff6ff",
            borderRadius: "0.5rem",
            border: "1px solid #bfdbfe",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.35rem",
            }}
          >
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#1e40af" }}>
              {peekSegment} ({peekAttendees.length})
            </span>
            <button
              onClick={() => setPeekSegment(null)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "0.8rem",
                color: "#6b7280",
                padding: 0,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
          <div style={{ maxHeight: "100px", overflowY: "auto" }}>
            {peekAttendees.slice(0, 5).map((a) => (
              <div
                key={a.id}
                style={{
                  fontSize: "0.7rem",
                  color: "#374151",
                  padding: "0.15rem 0",
                  borderBottom: "1px solid #dbeafe",
                }}
              >
                {a.name}
              </div>
            ))}
            {peekAttendees.length > 5 && (
              <div style={{ fontSize: "0.65rem", color: "#6b7280", marginTop: "0.25rem" }}>
                +{peekAttendees.length - 5} more...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ChartPreviewSlideout({ data, title, attendees, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState({
    viewMode: "count",
    selectedMembershipTypes: [],
    dateRange: "all",
  });
  const reducedMotion = prefersReducedMotion();

  React.useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (showConfig) {
          setShowConfig(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, showConfig]);

  const transformedData = useMemo(
    () => transformChartData(data, config, attendees),
    [data, config, attendees]
  );

  const totalRegistrations = transformedData[transformedData.length - 1]?.registrations || 0;
  const totalRevenue = transformedData[transformedData.length - 1]?.revenue || 0;
  const avgRevenuePerRegistrant = totalRegistrations > 0 ? (totalRevenue / totalRegistrations).toFixed(0) : 0;
  const peakWeek = transformedData.reduce((max, item) => item.registrations > max.registrations ? item : max, transformedData[0]);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.3)",
          zIndex: 199,
          opacity: isVisible ? 1 : 0,
          transition: reducedMotion ? "opacity 0.01s ease-in-out" : "opacity 0.3s ease-in-out",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "32rem",
          background: "white",
          boxShadow: "-6px 0 15px rgba(0,0,0,0.1)",
          borderLeft: "1px solid #e5e7eb",
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          transform: isVisible ? "translateX(0)" : "translateX(100%)",
          transition: reducedMotion ? "transform 0.01s ease-in-out" : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>
              {title}
            </h3>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "#6b7280" }}>
              Chart Preview & Analysis
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#f3f4f6",
              borderRadius: "0.5rem",
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              cursor: "pointer",
              color: "#374151",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#e5e7eb";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#f3f4f6";
              e.target.style.transform = "scale(1)";
            }}
          >
            Close
          </button>
        </div>

        <div style={{ padding: "1.5rem", flex: 1 }}>
          <div
            style={{
              background: "#f9fafb",
              borderRadius: "0.5rem",
              padding: "1rem",
              border: "1px solid #e5e7eb",
              marginBottom: "1.5rem",
            }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart
                data={transformedData}
                margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  stroke="#9ca3af"
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  stroke="#9ca3af"
                  label={{
                    value: "Registrations",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: "#6b7280" },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  stroke="#9ca3af"
                  label={{
                    value: "Revenue ($)",
                    angle: 90,
                    position: "insideRight",
                    style: { fontSize: 11, fill: "#6b7280" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                    padding: "0.5rem",
                  }}
                  formatter={(value, name) => {
                    if (name === "Revenue ($)") {
                      return `$${value.toLocaleString()}`;
                    }
                    return value;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "0.75rem", paddingTop: "0.5rem" }}
                  iconType="plainline"
                />
                <Bar
                  yAxisId="left"
                  dataKey="registrations"
                  fill="#2563eb"
                  name="Registrations"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", r: 4 }}
                  name="Revenue ($)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              background: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "0.75rem",
              padding: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0c4a6e", marginBottom: "0.75rem" }}>
              Summary Statistics
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>Total Registrations</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0c4a6e" }}>
                  {totalRegistrations}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>Total Revenue</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0c4a6e" }}>
                  ${totalRevenue.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>Avg per Registrant</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0c4a6e" }}>
                  ${avgRevenuePerRegistrant}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>Peak Week</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0c4a6e" }}>
                  {peakWeek.label}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => setShowConfig(true)}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid #2563eb",
                background: "white",
                color: "#2563eb",
                fontSize: "0.85rem",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#eff6ff";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "white";
              }}
            >
              Configure Chart
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                border: "none",
                background: "#e5e7eb",
                color: "#374151",
                fontSize: "0.85rem",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#d1d5db";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#e5e7eb";
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
      {showConfig && (
        <ChartConfigPanel
          config={config}
          onConfigChange={setConfig}
          onClose={() => setShowConfig(false)}
          onApply={() => {}}
        />
      )}
    </>
  );
}

function ChartConfigPanel({ onClose, onApply, config, onConfigChange }) {
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = prefersReducedMotion();

  React.useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const membershipTypes = ["CPA", "Student", "Non-member", "Guest"];

  function handleReset() {
    onConfigChange({
      viewMode: "count",
      selectedMembershipTypes: [],
      dateRange: "all",
    });
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "28rem",
        background: "white",
        boxShadow: "-6px 0 15px rgba(0,0,0,0.1)",
        borderLeft: "1px solid #e5e7eb",
        zIndex: 210,
        display: "flex",
        flexDirection: "column",
        transform: isVisible ? "translateX(-32rem)" : "translateX(100%)",
        transition: reducedMotion ? "transform 0.01s ease-in-out" : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "1.5rem",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>
            Chart Configuration
          </h3>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "#6b7280" }}>
            Customize chart display and filters
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "#6b7280",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: "1.5rem", flex: 1 }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
            View Mode
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <label style={{ display: "flex", alignItems: "center", fontSize: "0.8rem", cursor: "pointer" }}>
              <input
                type="radio"
                name="viewMode"
                value="count"
                checked={config.viewMode === "count"}
                onChange={(e) => onConfigChange({ ...config, viewMode: e.target.value })}
                style={{ marginRight: "0.5rem" }}
              />
              Count
            </label>
            <label style={{ display: "flex", alignItems: "center", fontSize: "0.8rem", cursor: "pointer" }}>
              <input
                type="radio"
                name="viewMode"
                value="percentage"
                checked={config.viewMode === "percentage"}
                onChange={(e) => onConfigChange({ ...config, viewMode: e.target.value })}
                style={{ marginRight: "0.5rem" }}
              />
              Percentage
            </label>
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
            Filter by Membership Type
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {membershipTypes.map((type) => {
              const isSelected = config.selectedMembershipTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => {
                    const updated = isSelected
                      ? config.selectedMembershipTypes.filter((t) => t !== type)
                      : [...config.selectedMembershipTypes, type];
                    onConfigChange({ ...config, selectedMembershipTypes: updated });
                  }}
                  style={{
                    padding: "0.4rem 0.75rem",
                    borderRadius: "999px",
                    border: "1px solid #d1d5db",
                    background: isSelected ? "#2563eb" : "white",
                    color: isSelected ? "white" : "#374151",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    fontWeight: isSelected ? 600 : 400,
                    transition: "all 0.2s",
                  }}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
            Date Range
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { value: "all", label: "All Weeks" },
              { value: "last4", label: "Last 4 Weeks" },
              { value: "last2", label: "Last 2 Weeks" },
            ].map((option) => (
              <label
                key={option.value}
                style={{ display: "flex", alignItems: "center", fontSize: "0.8rem", cursor: "pointer" }}
              >
                <input
                  type="radio"
                  name="dateRange"
                  value={option.value}
                  checked={config.dateRange === option.value}
                  onChange={(e) => onConfigChange({ ...config, dateRange: e.target.value })}
                  style={{ marginRight: "0.5rem" }}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "1.5rem",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          gap: "0.75rem",
        }}
      >
        <button
          onClick={handleReset}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid #d1d5db",
            background: "white",
            color: "#374151",
            fontSize: "0.85rem",
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#f9fafb";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "white";
          }}
        >
          Reset
        </button>
        <button
          onClick={() => {
            onApply();
            onClose();
          }}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontSize: "0.85rem",
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#1d4ed8";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#2563eb";
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

// -------------------- Correlation Slideout --------------------

function CorrelationSlideout({ attendees, dimension, dimensionLabel, metric, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [drilldownSegment, setDrilldownSegment] = useState(null);
  const reducedMotion = prefersReducedMotion();

  React.useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (drilldownSegment) {
          setDrilldownSegment(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, drilldownSegment]);

  const { results, insight } = useMemo(
    () => computeCorrelation(attendees, dimension, metric),
    [attendees, dimension, metric]
  );

  const metricLabel = metric === "renewal" ? "Renewal Rate" : metric;

  // Get attendees for drilldown segment
  const drilldownAttendees = useMemo(() => {
    if (!drilldownSegment) return [];
    return attendees.filter((a) => (a[dimension] || "Unknown") === drilldownSegment);
  }, [attendees, dimension, drilldownSegment]);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.3)",
          zIndex: 199,
          opacity: isVisible ? 1 : 0,
          transition: reducedMotion ? "opacity 0.01s ease-in-out" : "opacity 0.3s ease-in-out",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "32rem",
          maxWidth: "90vw",
          background: "white",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          transform: isVisible ? "translateX(0)" : "translateX(100%)",
          transition: reducedMotion
            ? "transform 0.01s ease-in-out"
            : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>
              Correlation Analysis
            </h3>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "#6b7280" }}>
              {dimensionLabel} vs {metricLabel}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#6b7280",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "1.5rem", flex: 1, overflowY: "auto" }}>
          {/* Key Insight Box */}
          <div
            style={{
              padding: "1rem",
              borderRadius: "0.5rem",
              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              border: "1px solid #fbbf24",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#92400e",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.5rem",
              }}
            >
              Key Insight
            </div>
            <div style={{ fontSize: "0.9rem", color: "#78350f", fontWeight: 500 }}>
              {insight}
            </div>
          </div>

          {/* Correlation Results */}
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "1rem",
              }}
            >
              Breakdown by {dimensionLabel}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {results.map((result, idx) => {
                const renewalRate = parseFloat(result.renewalRate);
                const colorIntensity = Math.max(0.3, renewalRate / 100);
                const barColor = `rgba(37, 99, 235, ${colorIntensity})`;
                const isSelected = drilldownSegment === result.label;

                return (
                  <button
                    key={result.label}
                    onClick={() => setDrilldownSegment(isSelected ? null : result.label)}
                    style={{
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      border: isSelected ? "2px solid #2563eb" : "1px solid #e5e7eb",
                      background: isSelected ? "#eff6ff" : "#f9fafb",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = "#93c5fd";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = "#e5e7eb";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {result.label}
                        <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>→ View details</span>
                      </div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2563eb" }}>
                        {result.renewalRate}%
                      </div>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: "0.5rem",
                        background: "#e5e7eb",
                        borderRadius: "999px",
                        overflow: "hidden",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: `${result.renewalRate}%`,
                          height: "100%",
                          background: barColor,
                          borderRadius: "999px",
                          transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        fontSize: "0.75rem",
                        color: "#6b7280",
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600 }}>Total:</span> {result.total}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600 }}>Renewed:</span> {result.renewed}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600 }}>Not Renewed:</span> {result.notRenewed}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "1.5rem",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: "0.75rem",
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              background: "white",
              color: "#374151",
              fontSize: "0.85rem",
              cursor: "pointer",
              fontWeight: 600,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#f9fafb";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "white";
            }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Double Slide Panel - Drilldown Details */}
      {drilldownSegment && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: "26rem",
            maxWidth: "80vw",
            background: "white",
            boxShadow: "-4px 0 20px rgba(0,0,0,0.2)",
            zIndex: 201,
            display: "flex",
            flexDirection: "column",
            transform: drilldownSegment ? "translateX(0)" : "translateX(100%)",
            transition: reducedMotion
              ? "transform 0.01s ease-in-out"
              : "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Nested Panel Header */}
          <div
            style={{
              padding: "1.25rem",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#f9fafb",
            }}
          >
            <div>
              <button
                onClick={() => setDrilldownSegment(null)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  color: "#2563eb",
                  padding: 0,
                  marginBottom: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                ← Back to Analysis
              </button>
              <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
                {drilldownSegment}
              </h4>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#6b7280" }}>
                {drilldownAttendees.length} attendee(s) in this segment
              </p>
            </div>
            <button
              onClick={() => setDrilldownSegment(null)}
              style={{
                border: "none",
                background: "#e5e7eb",
                fontSize: "1rem",
                cursor: "pointer",
                color: "#6b7280",
                width: "28px",
                height: "28px",
                borderRadius: "0.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>

          {/* Nested Panel Content - Attendee List */}
          <div style={{ flex: 1, overflow: "auto", padding: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {drilldownAttendees.map((attendee) => (
                <div
                  key={attendee.id}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #e5e7eb",
                    background: "#fafafa",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>
                        {attendee.name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                        {attendee.memberType} · {attendee.membershipStatus}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "0.15rem 0.5rem",
                        borderRadius: "999px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        background: attendee.renewed ? "#dcfce7" : "#fee2e2",
                        color: attendee.renewed ? "#166534" : "#991b1b",
                      }}
                    >
                      {attendee.renewed ? "Renewed" : "Not Renewed"}
                    </div>
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "0.5rem" }}>
                    {attendee.email || "—"} · {attendee.province}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nested Panel Footer */}
          <div
            style={{
              padding: "1rem",
              borderTop: "1px solid #e5e7eb",
              background: "#f9fafb",
            }}
          >
            <button
              onClick={() => setDrilldownSegment(null)}
              style={{
                width: "100%",
                padding: "0.6rem 1rem",
                borderRadius: "0.375rem",
                border: "1px solid #d1d5db",
                background: "white",
                color: "#374151",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// -------------------- Insights Studio Panel (Studio Dock → Panel → Correlation) --------------------

function InsightsStudioPanel({ attendees, onClose }) {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [showCorrelationConfig, setShowCorrelationConfig] = useState(false);
  const [showCorrelationPreview, setShowCorrelationPreview] = useState(false);
  const [correlationConfig, setCorrelationConfig] = useState({
    dimension: "province",
    selectedValues: [],
    showAs: "share",
  });
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (showCorrelationPreview) {
          setShowCorrelationPreview(false);
        } else if (showCorrelationConfig) {
          setShowCorrelationConfig(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, showCorrelationConfig, showCorrelationPreview]);

  const insightOptions = [
    { id: "correlation", label: "Correlation Analysis", description: "Analyze renewal patterns by dimension", icon: ICONS.insights },
    { id: "demographics", label: "Event Demographics", description: "Attendee breakdown by category", icon: ICONS.users },
    { id: "trends", label: "Trend Analysis", description: "Registration and revenue trends", icon: ICONS.timeline },
  ];

  const handleOptionClick = (optionId) => {
    if (optionId === "correlation") {
      setShowCorrelationConfig(true);
    }
    // Other options can be added later
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.3)",
          zIndex: 49,
          opacity: isVisible ? 1 : 0,
          transition: reducedMotion ? "none" : "opacity 0.3s ease-in-out",
        }}
      />

      {/* Main Insights Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "320px",
          background: theme.background,
          borderLeft: `1px solid ${theme.border}`,
          boxShadow: theme.shadowLg,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          transform: isVisible ? "translateX(0)" : "translateX(100%)",
          transition: reducedMotion ? "none" : "transform 0.3s ease-out",
        }}
      >
        {/* Header */}
        <div style={{
          padding: SPACING.lg,
          borderBottom: `1px solid ${theme.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: theme.textPrimary }}>
              Insights Studio
            </h3>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: theme.textMuted }}>
              Select an insight type to explore
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: theme.backgroundTertiary,
              borderRadius: SPACING.xs,
              width: "28px",
              height: "28px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.textMuted,
            }}
          >
            <ICONS.close size={16} />
          </button>
        </div>

        {/* Insight Options */}
        <div style={{ flex: 1, padding: SPACING.lg, overflowY: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: SPACING.sm }}>
            {insightOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                style={{
                  padding: SPACING.md,
                  borderRadius: SPACING.sm,
                  border: `1px solid ${theme.border}`,
                  background: theme.backgroundSecondary,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: SPACING.md,
                  transition: getTransition(["background", "border-color", "box-shadow"], "fast"),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme.primaryLight;
                  e.currentTarget.style.borderColor = theme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = theme.backgroundSecondary;
                  e.currentTarget.style.borderColor = theme.border;
                }}
              >
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: SPACING.sm,
                  background: theme.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <option.icon size={18} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: theme.textPrimary }}>
                    {option.label}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: theme.textMuted, marginTop: "2px" }}>
                    {option.description}
                  </div>
                </div>
                <div style={{ marginLeft: "auto", color: theme.textMuted }}>
                  <ICONS.chevronRight size={16} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Correlation Config Slideout (Input Panel First) */}
      {showCorrelationConfig && (
        <CorrelationConfigSlideout
          attendees={attendees}
          config={correlationConfig}
          onConfigChange={setCorrelationConfig}
          onPreview={() => {
            setShowCorrelationConfig(false);
            setShowCorrelationPreview(true);
          }}
          onClose={() => setShowCorrelationConfig(false)}
        />
      )}

      {/* Correlation Preview Slideout (Chart Preview) */}
      {showCorrelationPreview && (
        <CorrelationPreviewSlideout
          attendees={attendees}
          config={correlationConfig}
          onBack={() => {
            setShowCorrelationPreview(false);
            setShowCorrelationConfig(true);
          }}
          onClose={() => setShowCorrelationPreview(false)}
        />
      )}
    </>
  );
}

// -------------------- Correlation Config Slideout (Input Panel) --------------------

function CorrelationConfigSlideout({ attendees, config, onConfigChange, onPreview, onClose }) {
  const { theme } = useTheme();
  const reducedMotion = prefersReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const dimensions = [
    { id: "province", label: "Province" },
    { id: "memberType", label: "Member Type" },
    { id: "ageGroup", label: "Age Group" },
    { id: "education", label: "Education" },
  ];

  const allValues = useMemo(
    () => groupByField(attendees, config.dimension).map((s) => s.label),
    [attendees, config.dimension]
  );

  const toggleValue = (value) => {
    const current = config.selectedValues;
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onConfigChange({ ...config, selectedValues: next });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "360px",
        background: theme.background,
        borderLeft: `1px solid ${theme.border}`,
        boxShadow: theme.shadowLg,
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
        transform: isVisible ? "translateX(0)" : "translateX(100%)",
        transition: reducedMotion ? "none" : "transform 0.3s ease-out",
      }}
    >
      {/* Header */}
      <div style={{
        padding: SPACING.lg,
        borderBottom: `1px solid ${theme.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: theme.textPrimary }}>
            Correlation Configuration
          </h4>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.7rem", color: theme.textMuted }}>
            Configure analysis parameters
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: theme.backgroundTertiary,
            borderRadius: SPACING.xs,
            width: "28px",
            height: "28px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.textMuted,
          }}
        >
          <ICONS.close size={16} />
        </button>
      </div>

      {/* Config Form */}
      <div style={{ flex: 1, padding: SPACING.lg, overflowY: "auto" }}>
        {/* Dimension Selection */}
        <div style={{ marginBottom: SPACING.lg }}>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: theme.textSecondary, marginBottom: SPACING.sm }}>
            Break down by
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: SPACING.xs }}>
            {dimensions.map((dim) => (
              <button
                key={dim.id}
                onClick={() => onConfigChange({ ...config, dimension: dim.id, selectedValues: [] })}
                style={{
                  padding: `${SPACING.xs} ${SPACING.md}`,
                  borderRadius: SPACING.sm,
                  border: config.dimension === dim.id ? `2px solid ${theme.primary}` : `1px solid ${theme.border}`,
                  background: config.dimension === dim.id ? theme.primaryLight : theme.background,
                  color: config.dimension === dim.id ? theme.primary : theme.textPrimary,
                  fontSize: "0.75rem",
                  fontWeight: config.dimension === dim.id ? 600 : 400,
                  cursor: "pointer",
                }}
              >
                {dim.label}
              </button>
            ))}
          </div>
        </div>

        {/* Value Selection (Checkboxes) */}
        <div style={{ marginBottom: SPACING.lg }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.sm }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: theme.textSecondary }}>
              Select values to include
            </label>
            <div style={{ display: "flex", gap: SPACING.sm }}>
              <button
                onClick={() => onConfigChange({ ...config, selectedValues: allValues })}
                style={{ border: "none", background: "transparent", color: theme.primary, fontSize: "0.7rem", cursor: "pointer", fontWeight: 600 }}
              >
                Select All
              </button>
              <button
                onClick={() => onConfigChange({ ...config, selectedValues: [] })}
                style={{ border: "none", background: "transparent", color: theme.primary, fontSize: "0.7rem", cursor: "pointer", fontWeight: 600 }}
              >
                Clear
              </button>
            </div>
          </div>
          <div style={{
            maxHeight: "200px",
            overflowY: "auto",
            border: `1px solid ${theme.border}`,
            borderRadius: SPACING.sm,
            padding: SPACING.sm,
          }}>
            {allValues.map((value) => {
              const isSelected = config.selectedValues.includes(value);
              return (
                <label
                  key={value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: SPACING.sm,
                    padding: SPACING.xs,
                    cursor: "pointer",
                    borderRadius: SPACING.xs,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleValue(value)}
                    style={{ accentColor: theme.primary }}
                  />
                  <span style={{ fontSize: "0.75rem", color: theme.textPrimary }}>{value}</span>
                </label>
              );
            })}
          </div>
          {config.selectedValues.length > 0 && (
            <div style={{ fontSize: "0.65rem", color: theme.textMuted, marginTop: SPACING.xs }}>
              {config.selectedValues.length} of {allValues.length} selected
            </div>
          )}
        </div>

        {/* Show As */}
        <div style={{ marginBottom: SPACING.lg }}>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: theme.textSecondary, marginBottom: SPACING.sm }}>
            Show as
          </label>
          <div style={{ display: "flex", gap: SPACING.lg }}>
            <label style={{ display: "flex", alignItems: "center", gap: SPACING.xs, fontSize: "0.75rem", cursor: "pointer" }}>
              <input
                type="radio"
                name="showAs"
                value="raw"
                checked={config.showAs === "raw"}
                onChange={() => onConfigChange({ ...config, showAs: "raw" })}
                style={{ accentColor: theme.primary }}
              />
              Raw numbers
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: SPACING.xs, fontSize: "0.75rem", cursor: "pointer" }}>
              <input
                type="radio"
                name="showAs"
                value="share"
                checked={config.showAs === "share"}
                onChange={() => onConfigChange({ ...config, showAs: "share" })}
                style={{ accentColor: theme.primary }}
              />
              Share of total
            </label>
          </div>
        </div>
      </div>

      {/* Footer with Preview Button */}
      <div style={{
        padding: SPACING.lg,
        borderTop: `1px solid ${theme.border}`,
      }}>
        <button
          onClick={onPreview}
          disabled={config.selectedValues.length === 0}
          style={{
            width: "100%",
            padding: `${SPACING.md} ${SPACING.lg}`,
            borderRadius: SPACING.sm,
            border: "none",
            background: config.selectedValues.length > 0 ? theme.primary : theme.backgroundTertiary,
            color: config.selectedValues.length > 0 ? "white" : theme.textMuted,
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: config.selectedValues.length > 0 ? "pointer" : "not-allowed",
            transition: getTransition("background", "fast"),
          }}
        >
          Preview Analysis
        </button>
      </div>
    </div>
  );
}

// -------------------- Correlation Preview Slideout (Chart) --------------------

function CorrelationPreviewSlideout({ attendees, config, onBack, onClose }) {
  const { theme } = useTheme();
  const reducedMotion = prefersReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  // Compute correlation results
  const results = useMemo(() => {
    const filteredAttendees = config.selectedValues.length > 0
      ? attendees.filter((a) => config.selectedValues.includes(a[config.dimension] || "Unknown"))
      : attendees;

    const grouped = {};
    filteredAttendees.forEach((a) => {
      const key = a[config.dimension] || "Unknown";
      if (!grouped[key]) grouped[key] = { total: 0, renewed: 0 };
      grouped[key].total++;
      if (a.renewed) grouped[key].renewed++;
    });

    return Object.entries(grouped).map(([label, data]) => ({
      label,
      total: data.total,
      renewed: data.renewed,
      notRenewed: data.total - data.renewed,
      renewalRate: data.total > 0 ? ((data.renewed / data.total) * 100).toFixed(1) : "0.0",
    })).sort((a, b) => parseFloat(b.renewalRate) - parseFloat(a.renewalRate));
  }, [attendees, config]);

  // Find insight
  const insight = results.length >= 2
    ? `${results[0].label} shows ${results[0].renewalRate}% renewal vs ${results[results.length - 1].renewalRate}% for ${results[results.length - 1].label}`
    : results.length === 1
    ? `${results[0].label}: ${results[0].renewalRate}% renewal rate`
    : "Select values to see analysis";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "400px",
        background: theme.background,
        borderLeft: `1px solid ${theme.border}`,
        boxShadow: theme.shadowLg,
        zIndex: 70,
        display: "flex",
        flexDirection: "column",
        transform: isVisible ? "translateX(0)" : "translateX(100%)",
        transition: reducedMotion ? "none" : "transform 0.3s ease-out",
      }}
    >
      {/* Header */}
      <div style={{
        padding: SPACING.lg,
        borderBottom: `1px solid ${theme.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <button
            onClick={onBack}
            style={{
              border: "none",
              background: "transparent",
              color: theme.primary,
              fontSize: "0.7rem",
              cursor: "pointer",
              padding: 0,
              marginBottom: SPACING.xs,
              display: "flex",
              alignItems: "center",
              gap: SPACING.xs,
            }}
          >
            ← Back to Configuration
          </button>
          <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: theme.textPrimary }}>
            Correlation Preview
          </h4>
        </div>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: theme.backgroundTertiary,
            borderRadius: SPACING.xs,
            width: "28px",
            height: "28px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.textMuted,
          }}
        >
          <ICONS.close size={16} />
        </button>
      </div>

      {/* Key Insight */}
      <div style={{ padding: SPACING.lg }}>
        <div style={{
          padding: SPACING.md,
          borderRadius: SPACING.sm,
          background: `linear-gradient(135deg, ${theme.warningLight} 0%, ${theme.warning}20 100%)`,
          border: `1px solid ${theme.warning}`,
        }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, color: theme.warning, textTransform: "uppercase", marginBottom: SPACING.xs }}>
            Key Insight
          </div>
          <div style={{ fontSize: "0.8rem", color: theme.textPrimary, fontWeight: 500 }}>
            {insight}
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ flex: 1, padding: `0 ${SPACING.lg} ${SPACING.lg}`, overflowY: "auto" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: theme.textSecondary, marginBottom: SPACING.md }}>
          Breakdown by {config.dimension}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: SPACING.sm }}>
          {results.map((result) => (
            <div
              key={result.label}
              style={{
                padding: SPACING.md,
                borderRadius: SPACING.sm,
                border: `1px solid ${theme.border}`,
                background: theme.backgroundSecondary,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: SPACING.xs }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: theme.textPrimary }}>
                  {result.label}
                </span>
                <span style={{ fontSize: "1rem", fontWeight: 700, color: theme.primary }}>
                  {result.renewalRate}%
                </span>
              </div>
              <div style={{
                width: "100%",
                height: "6px",
                background: theme.backgroundTertiary,
                borderRadius: "999px",
                overflow: "hidden",
                marginBottom: SPACING.xs,
              }}>
                <div style={{
                  width: `${result.renewalRate}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${theme.primary}, ${theme.primaryHover})`,
                  borderRadius: "999px",
                  transition: "width 0.6s ease-out",
                }} />
              </div>
              <div style={{ display: "flex", gap: SPACING.md, fontSize: "0.65rem", color: theme.textMuted }}>
                <span>Total: {result.total}</span>
                <span>Renewed: {result.renewed}</span>
                <span>Not Renewed: {result.notRenewed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: SPACING.lg,
        borderTop: `1px solid ${theme.border}`,
      }}>
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: `${SPACING.md} ${SPACING.lg}`,
            borderRadius: SPACING.sm,
            border: `1px solid ${theme.border}`,
            background: theme.background,
            color: theme.textPrimary,
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// -------------------- Insights Bottom Panel (Event Insights - Demographics) --------------------

function InsightsBottomPanel({ attendees, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = prefersReducedMotion();

  React.useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const membershipTypeSegments = useMemo(
    () => groupByField(attendees, "memberType"),
    [attendees]
  );
  const ageGroupSegments = useMemo(
    () => groupByField(attendees, "ageGroup"),
    [attendees]
  );
  const educationSegments = useMemo(
    () => groupByField(attendees, "education"),
    [attendees]
  );
  const provinceSegments = useMemo(
    () => groupByField(attendees, "province"),
    [attendees]
  );
  const reasonSegments = useMemo(
    () => groupByField(attendees, "primaryReason"),
    [attendees]
  );

  const totalAttendees = attendees.length;

  const colorPalettes = {
    membershipType: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"],
    ageGroup: ["#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6"],
    education: ["#84cc16", "#22c55e", "#10b981", "#14b8a6"],
    province: ["#f43f5e", "#ec4899", "#d946ef", "#a855f7"],
    reason: ["#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981"],
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.3)",
          zIndex: 29,
          opacity: isVisible ? 1 : 0,
          transition: reducedMotion ? "opacity 0.01s ease-in-out" : "opacity 0.3s ease-in-out",
        }}
      />
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to top, #ffffff, #fefefe)",
          borderTop: "1px solid #d1d5db",
          boxShadow: "0 -10px 40px rgba(0,0,0,0.15)",
          padding: "1.25rem 1.5rem 1.5rem",
          zIndex: 30,
          transform: isVisible ? "translateY(0)" : "translateY(100%)",
          transition: reducedMotion ? "transform 0.01s ease-in-out" : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            paddingBottom: "0.75rem",
            borderBottom: "2px solid #e5e7eb",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#111827",
                letterSpacing: "-0.01em",
              }}
            >
              Event Insights
            </h3>
            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: "0.8rem",
                color: "#6b7280",
              }}
            >
              Demographic breakdown of {totalAttendees} attendees
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#f3f4f6",
              borderRadius: "0.5rem",
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              cursor: "pointer",
              color: "#374151",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#e5e7eb";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#f3f4f6";
              e.target.style.transform = "scale(1)";
            }}
          >
            Close
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: "1rem",
          }}
        >
          <DimensionInsight
            title="Membership Type"
            segments={membershipTypeSegments}
            totalCount={totalAttendees}
            colorPalette={colorPalettes.membershipType}
            delay={0}
            reducedMotion={reducedMotion}
          />
          <DimensionInsight
            title="Age Group"
            segments={ageGroupSegments}
            totalCount={totalAttendees}
            colorPalette={colorPalettes.ageGroup}
            delay={0.1}
            reducedMotion={reducedMotion}
          />
          <DimensionInsight
            title="Education"
            segments={educationSegments}
            totalCount={totalAttendees}
            colorPalette={colorPalettes.education}
            delay={0.2}
            reducedMotion={reducedMotion}
          />
          <DimensionInsight
            title="Province"
            segments={provinceSegments}
            totalCount={totalAttendees}
            colorPalette={colorPalettes.province}
            delay={0.3}
            reducedMotion={reducedMotion}
          />
          <DimensionInsight
            title="Primary Reason"
            segments={reasonSegments}
            totalCount={totalAttendees}
            colorPalette={colorPalettes.reason}
            delay={0.4}
            reducedMotion={reducedMotion}
          />
        </div>
      </div>
    </>
  );
}

function DimensionInsight({ title, segments, totalCount, colorPalette, delay, reducedMotion }) {
  const [isAnimated, setIsAnimated] = useState(false);

  React.useEffect(() => {
    setTimeout(() => setIsAnimated(true), delay * 1000 + 100);
  }, [delay]);

  return (
    <div
      style={{
        borderRadius: "0.75rem",
        border: "1px solid #d1d5db",
        padding: "0.75rem",
        background: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        opacity: isAnimated ? 1 : 0,
        transform: isAnimated ? "translateY(0)" : "translateY(10px)",
        transition: reducedMotion ? `all 0.01s ease-out` : `all 0.4s ease-out ${delay}s`,
      }}
    >
      <div
        style={{
          fontSize: "0.8rem",
          fontWeight: 700,
          marginBottom: "0.5rem",
          color: "#111827",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </div>
      <div style={{ marginBottom: "0.5rem" }}>
        {segments.map((s, idx) => {
          const percentage = ((s.count / totalCount) * 100).toFixed(1);
          const color = colorPalette[idx % colorPalette.length];
          return (
            <div
              key={s.label}
              style={{ marginBottom: "0.5rem" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.72rem",
                  color: "#374151",
                  marginBottom: "0.25rem",
                  fontWeight: 500,
                }}
              >
                <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.label}
                </span>
                <span
                  style={{
                    marginLeft: "0.5rem",
                    fontWeight: 700,
                    color: "#111827",
                    fontSize: "0.75rem",
                  }}
                >
                  {s.count}
                </span>
                <span
                  style={{
                    marginLeft: "0.35rem",
                    fontSize: "0.7rem",
                    color: "#6b7280",
                  }}
                >
                  ({percentage}%)
                </span>
              </div>
              <div
                style={{
                  height: "6px",
                  borderRadius: "999px",
                  background: "#f3f4f6",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: isAnimated ? `${percentage}%` : "0%",
                    background: `linear-gradient(90deg, ${color}, ${color}dd)`,
                    borderRadius: "999px",
                    transition: reducedMotion ? "width 0.01s ease-in-out" : "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transitionDelay: reducedMotion ? "0s" : `${delay + idx * 0.05}s`,
                    boxShadow: `0 0 8px ${color}40`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------- Insights Config Slide-out --------------------

function InsightsConfigSlideout({ attendees, onClose }) {
  const [selectedProvinces, setSelectedProvinces] = useState([
    "Newfoundland and Labrador",
  ]);
  const [showAs, setShowAs] = useState("share"); // "raw" | "share"
  const [isPinned, setIsPinned] = useState(false);

  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && !isPinned) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, isPinned]);

  const allProvinces = useMemo(
    () => groupByField(attendees, "province").map((s) => s.label),
    [attendees]
  );

  const results = useMemo(
    () => computeRenewalByProvince(attendees, selectedProvinces, showAs === "share"),
    [attendees, selectedProvinces, showAs]
  );

  function toggleProvince(prov) {
    setSelectedProvinces((prev) =>
      prev.includes(prov) ? prev.filter((p) => p !== prov) : [...prev, prov]
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "360px",
        background: "white",
        borderLeft: "1px solid #e5e7eb",
        boxShadow: "-6px 0 15px rgba(0,0,0,0.1)",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          padding: "0.75rem 1rem",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.85rem",
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>Membership insight: NL</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
            Location vs renewal patterns (prototype)
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* Pin Button */}
          <button
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? "Unpin panel" : "Pin panel open"}
            style={{
              border: "none",
              background: isPinned ? "#dbeafe" : "transparent",
              padding: "0.25rem",
              borderRadius: "0.25rem",
              cursor: "pointer",
              color: isPinned ? "#2563eb" : "#6b7280",
              fontSize: "0.9rem",
              transition: "all 0.15s",
            }}
          >
            📌
          </button>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "1rem",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            ×
          </button>
        </div>
      </header>
      <div
        style={{
          padding: "0.75rem 1rem",
          fontSize: "0.8rem",
          overflowY: "auto",
          flex: 1,
        }}
      >
        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ color: "#6b7280" }}>What to count</div>
          <select
            disabled
            style={{
              width: "100%",
              borderRadius: "0.4rem",
              border: "1px solid #d1d5db",
              padding: "0.25rem 0.4rem",
              fontSize: "0.8rem",
              background: "#f9fafb",
            }}
          >
            <option>Members</option>
          </select>
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ color: "#6b7280" }}>Break down by</div>
          <select
            disabled
            style={{
              width: "100%",
              borderRadius: "0.4rem",
              border: "1px solid #d1d5db",
              padding: "0.25rem 0.4rem",
              fontSize: "0.8rem",
              background: "#f9fafb",
            }}
          >
            <option>Province</option>
          </select>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ color: "#6b7280" }}>Selected provinces</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
            {allProvinces.map((prov) => {
              const selected = selectedProvinces.includes(prov);
              return (
                <button
                  key={prov}
                  onClick={() => toggleProvince(prov)}
                  style={{
                    borderRadius: "999px",
                    border: "1px solid #d1d5db",
                    padding: "0.15rem 0.5rem",
                    fontSize: "0.75rem",
                    background: selected ? "#2563eb" : "white",
                    color: selected ? "white" : "#111827",
                    cursor: "pointer",
                  }}
                >
                  {prov}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ color: "#6b7280" }}>Only include</div>
          <select
            disabled
            style={{
              width: "100%",
              borderRadius: "0.4rem",
              border: "1px solid #d1d5db",
              padding: "0.25rem 0.4rem",
              fontSize: "0.8rem",
              background: "#f9fafb",
            }}
          >
            <option>All member types</option>
          </select>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ color: "#6b7280" }}>How far back</div>
          <select
            disabled
            style={{
              width: "100%",
              borderRadius: "0.4rem",
              border: "1px solid #d1d5db",
              padding: "0.25rem 0.4rem",
              fontSize: "0.8rem",
              background: "#f9fafb",
            }}
          >
            <option>5 years</option>
          </select>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ color: "#6b7280", marginBottom: "0.25rem" }}>
            Show as
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <label style={{ fontSize: "0.8rem", cursor: "pointer" }}>
              <input
                type="radio"
                name="showAs"
                value="raw"
                checked={showAs === "raw"}
                onChange={() => setShowAs("raw")}
                style={{ marginRight: "0.25rem" }}
              />
              Raw numbers
            </label>
            <label style={{ fontSize: "0.8rem", cursor: "pointer" }}>
              <input
                type="radio"
                name="showAs"
                value="share"
                checked={showAs === "share"}
                onChange={() => setShowAs("share")}
                style={{ marginRight: "0.25rem" }}
              />
              Share of total
            </label>
          </div>
        </div>

        <div
          style={{
            marginTop: "0.75rem",
            fontSize: "0.8rem",
            color: "#6b7280",
          }}
        >
          Results (computed from mock attendee data):
        </div>
        <div style={{ marginTop: "0.25rem" }}>
          {results.map((r) => (
            <div
              key={r.province}
              style={{
                marginBottom: "0.4rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.8rem",
                }}
              >
                <span>{r.province}</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                  }}
                >
                  Renewed:{" "}
                  {showAs === "share"
                    ? `${r.renewed.toFixed(0)}%`
                    : r.renewed}{" "}
                  · Not renewed:{" "}
                  {showAs === "share"
                    ? `${r.notRenewed.toFixed(0)}%`
                    : r.notRenewed}
                </span>
              </div>
              <div
                style={{
                  height: "6px",
                  borderRadius: "999px",
                  background: "#e5e7eb",
                  overflow: "hidden",
                  marginTop: "0.15rem",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(r.renewed / (r.renewed + r.notRenewed || 1)) *
                      100}%`,
                    background: "#22c55e",
                  }}
                />
                <div
                  style={{
                    height: "100%",
                    flex: 1,
                    background: "transparent",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer
        style={{
          padding: "0.5rem 1rem",
          borderTop: "1px solid #e5e7eb",
          fontSize: "0.8rem",
          textAlign: "right",
        }}
      >
        <button
          onClick={onClose}
          style={{
            border: "none",
            borderRadius: "999px",
            padding: "0.25rem 0.75rem",
            fontSize: "0.8rem",
            background: "#e5e7eb",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </footer>
    </div>
  );
}

export default CentralEventReportingDemo;
