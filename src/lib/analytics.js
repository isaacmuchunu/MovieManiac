/**
 * Analytics Service
 *
 * Centralized analytics tracking that can integrate with multiple providers:
 * - Google Analytics (GA4)
 * - Custom backend analytics
 * - Mixpanel, Amplitude, etc.
 *
 * Configuration via environment variables:
 * - VITE_ANALYTICS_ENABLED: Enable/disable analytics
 * - VITE_GA_MEASUREMENT_ID: Google Analytics 4 Measurement ID
 */

const ANALYTICS_ENABLED = import.meta.env.VITE_ANALYTICS_ENABLED !== 'false';
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Event categories
export const EventCategory = {
  PLAYBACK: 'playback',
  NAVIGATION: 'navigation',
  ENGAGEMENT: 'engagement',
  AUTH: 'auth',
  SEARCH: 'search',
  CONTENT: 'content',
  SUBSCRIPTION: 'subscription',
  SOCIAL: 'social'
};

// Playback events
export const PlaybackEvent = {
  START: 'video_start',
  PAUSE: 'video_pause',
  RESUME: 'video_resume',
  COMPLETE: 'video_complete',
  SEEK: 'video_seek',
  QUALITY_CHANGE: 'quality_change',
  BUFFER: 'video_buffer',
  ERROR: 'video_error'
};

class AnalyticsService {
  constructor() {
    this.isInitialized = false;
    this.userId = null;
    this.sessionId = this.generateSessionId();
    this.eventQueue = [];
    this.flushInterval = null;
  }

  generateSessionId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize analytics service
   */
  async init() {
    if (this.isInitialized || !ANALYTICS_ENABLED) return;

    // Initialize Google Analytics if configured
    if (GA_MEASUREMENT_ID) {
      this.initGoogleAnalytics();
    }

    // Start event queue flushing
    this.flushInterval = setInterval(() => this.flushEventQueue(), 30000);

    this.isInitialized = true;

    // Track initial page view
    this.trackPageView();
  }

  /**
   * Initialize Google Analytics 4
   */
  initGoogleAnalytics() {
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false // We'll track manually
    });
  }

  /**
   * Set user identity for analytics
   */
  setUser(user) {
    this.userId = user?.id || null;

    if (window.gtag && user) {
      window.gtag('set', 'user_properties', {
        user_id: user.id,
        subscription_plan: user.subscription?.plan || 'free'
      });
    }
  }

  /**
   * Clear user identity (on logout)
   */
  clearUser() {
    this.userId = null;
  }

  /**
   * Track a page view
   */
  trackPageView(path = window.location.pathname, title = document.title) {
    if (!ANALYTICS_ENABLED) return;

    const pageData = {
      page_path: path,
      page_title: title,
      page_location: window.location.href
    };

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'page_view', pageData);
    }

    // Queue for backend
    this.queueEvent('page_view', pageData);
  }

  /**
   * Track a custom event
   */
  trackEvent(eventName, params = {}) {
    if (!ANALYTICS_ENABLED) return;

    const eventData = {
      ...params,
      session_id: this.sessionId,
      user_id: this.userId,
      timestamp: Date.now()
    };

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, eventData);
    }

    // Queue for backend
    this.queueEvent(eventName, eventData);
  }

  /**
   * Track video playback events
   */
  trackPlayback(event, videoId, params = {}) {
    this.trackEvent(event, {
      category: EventCategory.PLAYBACK,
      video_id: videoId,
      ...params
    });
  }

  /**
   * Track video start
   */
  trackVideoStart(videoId, contentTitle, params = {}) {
    this.trackPlayback(PlaybackEvent.START, videoId, {
      content_title: contentTitle,
      ...params
    });
  }

  /**
   * Track video completion
   */
  trackVideoComplete(videoId, contentTitle, watchDuration, totalDuration) {
    this.trackPlayback(PlaybackEvent.COMPLETE, videoId, {
      content_title: contentTitle,
      watch_duration: watchDuration,
      total_duration: totalDuration,
      completion_rate: totalDuration > 0 ? (watchDuration / totalDuration * 100).toFixed(1) : 0
    });
  }

  /**
   * Track search
   */
  trackSearch(query, resultsCount) {
    this.trackEvent('search', {
      category: EventCategory.SEARCH,
      search_term: query,
      results_count: resultsCount
    });
  }

  /**
   * Track content interaction
   */
  trackContentInteraction(action, contentId, contentTitle, params = {}) {
    this.trackEvent(`content_${action}`, {
      category: EventCategory.CONTENT,
      content_id: contentId,
      content_title: contentTitle,
      ...params
    });
  }

  /**
   * Track authentication events
   */
  trackAuth(action, method = 'email') {
    this.trackEvent(`auth_${action}`, {
      category: EventCategory.AUTH,
      method
    });
  }

  /**
   * Queue event for batch sending to backend
   */
  queueEvent(eventName, data) {
    this.eventQueue.push({
      event: eventName,
      data,
      timestamp: Date.now()
    });

    // Flush if queue is getting large
    if (this.eventQueue.length >= 20) {
      this.flushEventQueue();
    }
  }

  /**
   * Flush event queue to backend
   */
  async flushEventQueue() {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events,
          sessionId: this.sessionId,
          userId: this.userId
        })
      });
    } catch {
      // Re-queue events on failure (with limit to prevent memory issues)
      if (this.eventQueue.length < 100) {
        this.eventQueue.unshift(...events);
      }
    }
  }

  /**
   * Track timing metrics
   */
  trackTiming(category, variable, value, label = '') {
    this.trackEvent('timing', {
      timing_category: category,
      timing_variable: variable,
      timing_value: value,
      timing_label: label
    });
  }

  /**
   * Cleanup on app unmount
   */
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushEventQueue();
  }
}

// Singleton instance
const analytics = new AnalyticsService();

export default analytics;
export { analytics };
