import React from "react";
import { useTheme, SPACING } from '../../design-system';

export function SkipLink({ targetId = "main-content", children = "Skip to main content" }) {
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
