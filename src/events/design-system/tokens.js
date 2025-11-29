// Design System Tokens

// Spacing Scale (P2.4)
export const SPACING = {
  xs: "0.25rem",   // 4px
  sm: "0.5rem",    // 8px
  md: "0.75rem",   // 12px
  lg: "1rem",      // 16px
  xl: "1.5rem",    // 24px
  xxl: "2rem",     // 32px
  xxxl: "3rem",    // 48px
};

// Motion Tokens (P2.2)
export const MOTION = {
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
