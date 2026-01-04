import { describe, it, expect, beforeEach, vi } from 'vitest';
import errorReporting, { ErrorCategory, ErrorSeverity } from '../errorReporting';

describe('ErrorReporting Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ErrorSeverity', () => {
    it('should have all severity levels defined', () => {
      expect(ErrorSeverity.DEBUG).toBe('debug');
      expect(ErrorSeverity.INFO).toBe('info');
      expect(ErrorSeverity.WARNING).toBe('warning');
      expect(ErrorSeverity.ERROR).toBe('error');
      expect(ErrorSeverity.FATAL).toBe('fatal');
    });
  });

  describe('ErrorCategory', () => {
    it('should have all categories defined', () => {
      expect(ErrorCategory.NETWORK).toBe('network');
      expect(ErrorCategory.AUTH).toBe('auth');
      expect(ErrorCategory.PLAYBACK).toBe('playback');
      expect(ErrorCategory.UI).toBe('ui');
      expect(ErrorCategory.DATA).toBe('data');
      expect(ErrorCategory.UNKNOWN).toBe('unknown');
    });
  });

  describe('captureError', () => {
    it('should not throw when capturing an error', () => {
      const error = new Error('Test error');
      expect(() => {
        errorReporting.captureError(error, {
          category: ErrorCategory.UNKNOWN,
          severity: ErrorSeverity.ERROR
        });
      }).not.toThrow();
    });

    it('should handle error without context', () => {
      const error = new Error('Test error');
      expect(() => {
        errorReporting.captureError(error);
      }).not.toThrow();
    });
  });

  describe('captureMessage', () => {
    it('should not throw when capturing a message', () => {
      expect(() => {
        errorReporting.captureMessage('Test message', {
          severity: ErrorSeverity.INFO
        });
      }).not.toThrow();
    });
  });

  describe('setUser', () => {
    it('should set user context', () => {
      const user = { id: '123', email: 'test@example.com', name: 'Test User' };
      expect(() => {
        errorReporting.setUser(user);
      }).not.toThrow();
    });

    it('should handle null user', () => {
      expect(() => {
        errorReporting.setUser(null);
      }).not.toThrow();
    });
  });

  describe('clearUser', () => {
    it('should clear user context', () => {
      expect(() => {
        errorReporting.clearUser();
      }).not.toThrow();
    });
  });

  describe('addBreadcrumb', () => {
    it('should add breadcrumb', () => {
      expect(() => {
        errorReporting.addBreadcrumb('User clicked button', { buttonId: 'play' });
      }).not.toThrow();
    });
  });

  describe('createErrorBoundaryHandler', () => {
    it('should return a function', () => {
      const handler = errorReporting.createErrorBoundaryHandler('TestComponent');
      expect(typeof handler).toBe('function');
    });

    it('should handle error when called', () => {
      const handler = errorReporting.createErrorBoundaryHandler('TestComponent');
      const error = new Error('Component error');
      const errorInfo = { componentStack: 'at TestComponent' };

      expect(() => {
        handler(error, errorInfo);
      }).not.toThrow();
    });
  });
});
