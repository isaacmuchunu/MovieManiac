/**
 * Error Reporting Service
 *
 * Centralized error reporting that can be configured to send errors to
 * external services like Sentry, LogRocket, or Bugsnag.
 *
 * Configuration via environment variables:
 * - VITE_ERROR_REPORTING_ENABLED: Enable/disable error reporting
 * - VITE_SENTRY_DSN: Sentry DSN for error tracking (optional)
 */

const ERROR_REPORTING_ENABLED = import.meta.env.VITE_ERROR_REPORTING_ENABLED === 'true';
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

// Error severity levels
export const ErrorSeverity = {
  DEBUG: 'debug',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  FATAL: 'fatal'
};

// Error categories for grouping
export const ErrorCategory = {
  NETWORK: 'network',
  AUTH: 'auth',
  PLAYBACK: 'playback',
  UI: 'ui',
  DATA: 'data',
  UNKNOWN: 'unknown'
};

class ErrorReportingService {
  constructor() {
    this.isInitialized = false;
    this.pendingErrors = [];
    this.userId = null;
    this.sessionId = this.generateSessionId();
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize the error reporting service
   * Call this once at app startup
   */
  async init() {
    if (this.isInitialized) return;

    // If Sentry DSN is provided, initialize Sentry
    if (SENTRY_DSN && ERROR_REPORTING_ENABLED) {
      try {
        // Dynamic import for Sentry to avoid bundling if not used
        const Sentry = await import('@sentry/react');
        Sentry.init({
          dsn: SENTRY_DSN,
          environment: import.meta.env.MODE,
          tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
          beforeSend(event) {
            // Sanitize sensitive data before sending
            if (event.request?.headers) {
              delete event.request.headers['Authorization'];
              delete event.request.headers['Cookie'];
            }
            return event;
          }
        });
        this.sentry = Sentry;
      } catch {
        // Sentry not installed, use fallback
        console.info('[ErrorReporting] Sentry not installed, using console fallback');
      }
    }

    this.isInitialized = true;

    // Process any pending errors
    this.pendingErrors.forEach(error => this.captureError(error.error, error.context));
    this.pendingErrors = [];
  }

  /**
   * Set the current user for error context
   */
  setUser(user) {
    this.userId = user?.id || null;

    if (this.sentry && user) {
      this.sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.name
      });
    }
  }

  /**
   * Clear user context (on logout)
   */
  clearUser() {
    this.userId = null;
    if (this.sentry) {
      this.sentry.setUser(null);
    }
  }

  /**
   * Capture an error with optional context
   *
   * @param {Error} error - The error to capture
   * @param {Object} context - Additional context
   * @param {string} context.category - Error category from ErrorCategory
   * @param {string} context.severity - Error severity from ErrorSeverity
   * @param {Object} context.extra - Additional data to attach
   */
  captureError(error, context = {}) {
    if (!ERROR_REPORTING_ENABLED) {
      // In development, just log to console
      if (import.meta.env.DEV) {
        console.error('[Error]', error, context);
      }
      return;
    }

    if (!this.isInitialized) {
      this.pendingErrors.push({ error, context });
      return;
    }

    const {
      category = ErrorCategory.UNKNOWN,
      severity = ErrorSeverity.ERROR,
      extra = {}
    } = context;

    const errorContext = {
      category,
      severity,
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      ...extra
    };

    if (this.sentry) {
      this.sentry.withScope(scope => {
        scope.setLevel(severity);
        scope.setTag('category', category);
        scope.setExtras(errorContext);
        this.sentry.captureException(error);
      });
    } else {
      // Fallback: Log to console and optionally to backend
      this.logToBackend(error, errorContext);
    }
  }

  /**
   * Capture a message (non-error event)
   */
  captureMessage(message, context = {}) {
    if (!ERROR_REPORTING_ENABLED) return;

    const { severity = ErrorSeverity.INFO, extra = {} } = context;

    if (this.sentry) {
      this.sentry.captureMessage(message, severity);
    } else {
      console.info('[Message]', message, extra);
    }
  }

  /**
   * Add breadcrumb for debugging
   */
  addBreadcrumb(message, data = {}, category = 'navigation') {
    if (this.sentry) {
      this.sentry.addBreadcrumb({
        message,
        data,
        category,
        level: 'info'
      });
    }
  }

  /**
   * Fallback logging to backend when Sentry is not available
   */
  async logToBackend(error, context) {
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        name: error.name,
        context
      };

      // Log to console in development
      if (import.meta.env.DEV) {
        console.error('[ErrorReporting]', errorData);
      }

      // In production, send to backend error logging endpoint
      if (import.meta.env.PROD) {
        await fetch('/api/errors/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorData)
        }).catch(() => {
          // Silently fail - don't cause cascading errors
        });
      }
    } catch {
      // Prevent error reporting from causing additional errors
    }
  }

  /**
   * Create an error boundary handler
   */
  createErrorBoundaryHandler(componentName) {
    return (error, errorInfo) => {
      this.captureError(error, {
        category: ErrorCategory.UI,
        severity: ErrorSeverity.ERROR,
        extra: {
          componentName,
          componentStack: errorInfo?.componentStack
        }
      });
    };
  }
}

// Singleton instance
const errorReporting = new ErrorReportingService();

// Initialize on module load
if (typeof window !== 'undefined') {
  // Capture unhandled errors
  window.addEventListener('error', (event) => {
    errorReporting.captureError(event.error || new Error(event.message), {
      category: ErrorCategory.UNKNOWN,
      severity: ErrorSeverity.ERROR,
      extra: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    });
  });

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason));

    errorReporting.captureError(error, {
      category: ErrorCategory.UNKNOWN,
      severity: ErrorSeverity.ERROR,
      extra: { type: 'unhandledrejection' }
    });
  });
}

export default errorReporting;
export { errorReporting };
