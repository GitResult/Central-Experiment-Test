import React, { useState, useCallback, createContext, useContext } from "react";

// Theme Colors (P2.1)
export const LIGHT_THEME = {
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

export const DARK_THEME = {
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
export const ThemeContext = createContext({ theme: LIGHT_THEME, isDark: false, toggleTheme: () => {} });

export function ThemeProvider({ children }) {
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

export function useTheme() {
  return useContext(ThemeContext);
}
