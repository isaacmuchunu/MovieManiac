import { Component } from 'react';
import { Link } from 'react-router-dom';

/**
 * ErrorBoundary - React Error Boundary Component
 * Catches JavaScript errors anywhere in child component tree and displays a fallback UI
 * Prevents the entire app from crashing due to component errors
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // In production, you would send this to an error reporting service like Sentry
    if (import.meta.env.PROD) {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-netflix-black flex items-center justify-center p-4">
          <div className="max-w-lg w-full text-center">
            {/* Error Icon */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Error Title */}
            <h1 className="text-3xl font-bold text-white mb-4">
              {this.props.title || 'Something went wrong'}
            </h1>

            {/* Error Message */}
            <p className="text-gray-400 mb-8">
              {this.props.message ||
                "We're sorry, but something unexpected happened. Please try again or go back to the home page."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={this.handleRetry}
                className="px-6 py-3 bg-netflix-red text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>

              <Link
                to="/"
                className="px-6 py-3 bg-netflix-medium-gray text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Go Home
              </Link>
            </div>

            {/* Error Details (Development Only) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-8 text-left bg-netflix-dark-gray rounded-lg p-4 border border-gray-800">
                <summary className="text-gray-400 cursor-pointer hover:text-white transition-colors">
                  Error Details (Development Only)
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-red-400 font-mono text-sm">
                      {this.state.error.toString()}
                    </p>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <p className="text-gray-500 text-xs mb-2">Component Stack:</p>
                      <pre className="text-gray-400 text-xs overflow-x-auto whitespace-pre-wrap font-mono bg-netflix-black p-3 rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Help Link */}
            <p className="mt-8 text-gray-500 text-sm">
              If this problem persists, please{' '}
              <a
                href="mailto:support@moovie.com"
                className="text-netflix-red hover:underline"
              >
                contact support
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional wrapper for ErrorBoundary with common configurations
 */
export const withErrorBoundary = (WrappedComponent, options = {}) => {
  return function WithErrorBoundary(props) {
    return (
      <ErrorBoundary {...options}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
};

/**
 * Specialized ErrorBoundary for async components
 */
export const AsyncErrorBoundary = ({ children, fallback }) => {
  return (
    <ErrorBoundary
      fallback={
        fallback || (
          <div className="p-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Failed to load content
            </div>
          </div>
        )
      }
    >
      {children}
    </ErrorBoundary>
  );
};

/**
 * Specialized ErrorBoundary for page-level errors
 */
export const PageErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary
      title="Page Error"
      message="This page encountered an error and couldn't be displayed. Please try refreshing or go back to the home page."
    >
      {children}
    </ErrorBoundary>
  );
};

/**
 * Specialized ErrorBoundary for component-level errors (smaller UI)
 */
export const ComponentErrorBoundary = ({ children, componentName }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 bg-netflix-dark-gray rounded-lg border border-red-800/50">
          <div className="flex items-center gap-3 text-red-400">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-medium">
                {componentName ? `${componentName} failed to load` : 'Component error'}
              </p>
              <p className="text-sm text-gray-500">Please refresh the page</p>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;
