import React from "react";
import { useTheme, SPACING } from '../../design-system';
import { SkeletonLoader } from './SkeletonLoader';

export function CardSkeleton() {
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
