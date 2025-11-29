import React from "react";
import { useTheme, SPACING, ICONS } from '../design-system';
import { getTransition } from '../utils';

export class ErrorBoundary extends React.Component {
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

export function ErrorFallback({ error, onRetry, title = "Something went wrong" }) {
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
