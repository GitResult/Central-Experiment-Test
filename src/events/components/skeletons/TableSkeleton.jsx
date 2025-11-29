import React from "react";
import { useTheme, SPACING } from '../../design-system';
import { SkeletonLoader } from './SkeletonLoader';

export function TableSkeleton({ rows = 5, columns = 7 }) {
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
