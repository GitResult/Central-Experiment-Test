/**
 * ErrorBoundary Component
 * Catches React errors and displays fallback UI
 */

import { Component } from 'react';
import PropTypes from 'prop-types';
import { theme } from '../config/theme';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log to error reporting service (future)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Default fallback UI
      return (
        <div
          role="alert"
          style={{
            padding: theme.spacing['8'],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            backgroundColor: theme.colors.background.secondary,
            borderRadius: theme.borderRadius.lg,
            border: `2px solid ${theme.colors.error[500]}`,
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontSize: theme.typography.fontSize['2xl'],
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.error[600],
                marginBottom: theme.spacing['4'],
              }}
            >
              Something went wrong
            </h2>

            <p
              style={{
                fontSize: theme.typography.fontSize.base,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing['6'],
              }}
            >
              {this.props.errorMessage ||
                'An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.'}
            </p>

            {this.state.error && process.env.NODE_ENV === 'development' && (
              <details
                style={{
                  marginBottom: theme.spacing['6'],
                  padding: theme.spacing['4'],
                  backgroundColor: theme.colors.background.primary,
                  borderRadius: theme.borderRadius.md,
                  textAlign: 'left',
                }}
              >
                <summary
                  style={{
                    cursor: 'pointer',
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.text.primary,
                    marginBottom: theme.spacing['2'],
                  }}
                >
                  Error Details (Development Only)
                </summary>
                <pre
                  style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.tertiary,
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div
              style={{
                display: 'flex',
                gap: theme.spacing['3'],
                justifyContent: 'center',
              }}
            >
              <button
                onClick={this.handleReset}
                style={{
                  padding: `${theme.spacing['3']} ${theme.spacing['6']}`,
                  backgroundColor: theme.colors.primary[500],
                  color: theme.colors.text.inverse,
                  border: 'none',
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.medium,
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = theme.colors.primary[600];
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = theme.colors.primary[500];
                }}
              >
                Try Again
              </button>

              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: `${theme.spacing['3']} ${theme.spacing['6']}`,
                  backgroundColor: theme.colors.background.primary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border.default}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.medium,
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = theme.colors.neutral[100];
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = theme.colors.background.primary;
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.func,
  errorMessage: PropTypes.string,
  onError: PropTypes.func,
  onReset: PropTypes.func,
};
