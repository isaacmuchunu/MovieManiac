import { describe, it, expect, beforeEach, vi } from 'vitest';
import analytics, { EventCategory, PlaybackEvent } from '../analytics';

describe('Analytics Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('EventCategory', () => {
    it('should have all categories defined', () => {
      expect(EventCategory.PLAYBACK).toBe('playback');
      expect(EventCategory.NAVIGATION).toBe('navigation');
      expect(EventCategory.ENGAGEMENT).toBe('engagement');
      expect(EventCategory.AUTH).toBe('auth');
      expect(EventCategory.SEARCH).toBe('search');
      expect(EventCategory.CONTENT).toBe('content');
      expect(EventCategory.SUBSCRIPTION).toBe('subscription');
      expect(EventCategory.SOCIAL).toBe('social');
    });
  });

  describe('PlaybackEvent', () => {
    it('should have all playback events defined', () => {
      expect(PlaybackEvent.START).toBe('video_start');
      expect(PlaybackEvent.PAUSE).toBe('video_pause');
      expect(PlaybackEvent.RESUME).toBe('video_resume');
      expect(PlaybackEvent.COMPLETE).toBe('video_complete');
      expect(PlaybackEvent.SEEK).toBe('video_seek');
      expect(PlaybackEvent.QUALITY_CHANGE).toBe('quality_change');
      expect(PlaybackEvent.BUFFER).toBe('video_buffer');
      expect(PlaybackEvent.ERROR).toBe('video_error');
    });
  });

  describe('setUser', () => {
    it('should set user identity', () => {
      const user = { id: '123', subscription: { plan: 'premium' } };
      expect(() => {
        analytics.setUser(user);
      }).not.toThrow();
    });

    it('should handle null user', () => {
      expect(() => {
        analytics.setUser(null);
      }).not.toThrow();
    });
  });

  describe('clearUser', () => {
    it('should clear user identity', () => {
      expect(() => {
        analytics.clearUser();
      }).not.toThrow();
    });
  });

  describe('trackEvent', () => {
    it('should track custom event', () => {
      expect(() => {
        analytics.trackEvent('button_click', { buttonId: 'play' });
      }).not.toThrow();
    });
  });

  describe('trackSearch', () => {
    it('should track search event', () => {
      expect(() => {
        analytics.trackSearch('action movies', 25);
      }).not.toThrow();
    });
  });

  describe('trackVideoStart', () => {
    it('should track video start', () => {
      expect(() => {
        analytics.trackVideoStart('video123', 'Test Movie');
      }).not.toThrow();
    });
  });

  describe('trackVideoComplete', () => {
    it('should track video completion', () => {
      expect(() => {
        analytics.trackVideoComplete('video123', 'Test Movie', 7200, 7500);
      }).not.toThrow();
    });
  });

  describe('trackContentInteraction', () => {
    it('should track content interaction', () => {
      expect(() => {
        analytics.trackContentInteraction('view', 'content123', 'Test Content');
      }).not.toThrow();
    });
  });

  describe('trackAuth', () => {
    it('should track auth event', () => {
      expect(() => {
        analytics.trackAuth('login', 'email');
      }).not.toThrow();
    });
  });

  describe('trackTiming', () => {
    it('should track timing metrics', () => {
      expect(() => {
        analytics.trackTiming('page_load', 'home', 1500);
      }).not.toThrow();
    });
  });
});
