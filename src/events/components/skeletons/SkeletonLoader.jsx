import React from "react";
import { useTheme } from '../../design-system';

export function SkeletonLoader({ width = "100%", height = "1rem", borderRadius = "0.25rem", style = {} }) {
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
