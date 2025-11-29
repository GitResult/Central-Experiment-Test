import React from "react";
import { SPACING } from '../../design-system';
import { useBreakpoint } from '../../hooks';

export function ResponsiveGrid({ children, cols = { sm: 1, md: 2, lg: 3 }, gap = SPACING.lg }) {
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
