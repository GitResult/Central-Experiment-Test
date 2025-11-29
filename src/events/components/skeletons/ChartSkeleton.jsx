import React from "react";
import { useTheme, SPACING } from '../../design-system';
import { SkeletonLoader } from './SkeletonLoader';

export function ChartSkeleton({ height = "200px" }) {
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
