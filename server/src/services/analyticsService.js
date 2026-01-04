/**
 * Analytics Service (Backend)
 *
 * Handles analytics event processing, storage, and aggregation.
 * Can be extended to send to external analytics services.
 */

import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { redis } from '../config/redis.js';

// Event buffer for batch processing
let eventBuffer = [];
const BUFFER_FLUSH_INTERVAL = 30000; // 30 seconds
const BUFFER_MAX_SIZE = 100;

class AnalyticsService {
  constructor() {
    this.flushInterval = null;
  }

  /**
   * Initialize the analytics service
   */
  init() {
    // Start periodic flushing
    this.flushInterval = setInterval(() => {
      this.flushEvents();
    }, BUFFER_FLUSH_INTERVAL);

    logger.info('Analytics service initialized');
  }

  /**
   * Record a page view
   */
  async recordPageView(data) {
    const event = {
      type: 'page_view',
      userId: data.userId,
      sessionId: data.sessionId,
      path: data.path,
      referrer: data.referrer,
      userAgent: data.userAgent,
      timestamp: new Date()
    };

    this.bufferEvent(event);
  }

  /**
   * Record a custom event
   */
  async recordEvent(data) {
    const event = {
      type: 'event',
      userId: data.userId,
      sessionId: data.sessionId,
      eventName: data.eventName,
      eventData: data.eventData,
      timestamp: new Date()
    };

    this.bufferEvent(event);
  }

  /**
   * Record video playback event
   */
  async recordPlaybackEvent(data) {
    const event = {
      type: 'playback',
      userId: data.userId,
      sessionId: data.sessionId,
      videoId: data.videoId,
      contentId: data.contentId,
      action: data.action, // start, pause, resume, complete, seek, buffer, error
      position: data.position,
      duration: data.duration,
      quality: data.quality,
      timestamp: new Date()
    };

    this.bufferEvent(event);

    // For real-time metrics, update Redis counters
    if (redis) {
      try {
        const today = new Date().toISOString().split('T')[0];
        const hourKey = `analytics:hourly:${today}:${new Date().getHours()}`;

        await Promise.all([
          redis.hincrby(hourKey, 'playback_events', 1),
          redis.hincrby(hourKey, `playback_${data.action}`, 1),
          redis.expire(hourKey, 86400 * 7) // Keep for 7 days
        ]);

        // Track active viewers
        if (data.action === 'start') {
          await redis.sadd('analytics:active_viewers', data.userId);
          await redis.expire('analytics:active_viewers', 300); // 5 min expiry
        }
      } catch (error) {
        logger.warn('Failed to update Redis analytics:', error.message);
      }
    }
  }

  /**
   * Record batch of events from frontend
   */
  async recordBatch(events, sessionId, userId) {
    for (const event of events) {
      this.bufferEvent({
        ...event.data,
        type: event.event,
        sessionId,
        userId,
        timestamp: new Date(event.timestamp)
      });
    }
  }

  /**
   * Buffer an event for batch processing
   */
  bufferEvent(event) {
    eventBuffer.push(event);

    // Flush if buffer is full
    if (eventBuffer.length >= BUFFER_MAX_SIZE) {
      this.flushEvents();
    }
  }

  /**
   * Flush buffered events to storage
   */
  async flushEvents() {
    if (eventBuffer.length === 0) return;

    const events = [...eventBuffer];
    eventBuffer = [];

    try {
      // Store events in database (could be a separate analytics database)
      // For now, we'll log them and could extend to write to a time-series DB

      // Group events by type for efficient storage
      const pageViews = events.filter(e => e.type === 'page_view');
      const playbackEvents = events.filter(e => e.type === 'playback');
      const customEvents = events.filter(e => e.type === 'event');

      // Log summary
      logger.info('Analytics flush:', {
        pageViews: pageViews.length,
        playbackEvents: playbackEvents.length,
        customEvents: customEvents.length
      });

      // Update daily aggregates in Redis
      if (redis) {
        const today = new Date().toISOString().split('T')[0];
        const dailyKey = `analytics:daily:${today}`;

        await Promise.all([
          redis.hincrby(dailyKey, 'page_views', pageViews.length),
          redis.hincrby(dailyKey, 'playback_events', playbackEvents.length),
          redis.hincrby(dailyKey, 'custom_events', customEvents.length),
          redis.expire(dailyKey, 86400 * 30) // Keep for 30 days
        ]);
      }

      // Here you could also send to external analytics services:
      // - Google Analytics Measurement Protocol
      // - Mixpanel
      // - Amplitude
      // - Custom data warehouse

    } catch (error) {
      logger.error('Failed to flush analytics events:', error);
      // Re-buffer events on failure (with limit)
      if (eventBuffer.length < BUFFER_MAX_SIZE * 2) {
        eventBuffer.unshift(...events);
      }
    }
  }

  /**
   * Get real-time analytics summary
   */
  async getRealTimeSummary() {
    if (!redis) {
      return { activeViewers: 0, eventsLastHour: 0 };
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const currentHour = new Date().getHours();
      const hourKey = `analytics:hourly:${today}:${currentHour}`;

      const [activeViewers, hourlyStats] = await Promise.all([
        redis.scard('analytics:active_viewers'),
        redis.hgetall(hourKey)
      ]);

      return {
        activeViewers: activeViewers || 0,
        eventsLastHour: parseInt(hourlyStats?.playback_events || 0, 10),
        playbackStarts: parseInt(hourlyStats?.playback_start || 0, 10),
        playbackCompletes: parseInt(hourlyStats?.playback_complete || 0, 10)
      };
    } catch (error) {
      logger.warn('Failed to get real-time analytics:', error.message);
      return { activeViewers: 0, eventsLastHour: 0 };
    }
  }

  /**
   * Get daily analytics summary
   */
  async getDailySummary(date = new Date()) {
    if (!redis) {
      return { pageViews: 0, playbackEvents: 0, customEvents: 0 };
    }

    try {
      const dateStr = date.toISOString().split('T')[0];
      const dailyKey = `analytics:daily:${dateStr}`;
      const stats = await redis.hgetall(dailyKey);

      return {
        date: dateStr,
        pageViews: parseInt(stats?.page_views || 0, 10),
        playbackEvents: parseInt(stats?.playback_events || 0, 10),
        customEvents: parseInt(stats?.custom_events || 0, 10)
      };
    } catch (error) {
      logger.warn('Failed to get daily analytics:', error.message);
      return { pageViews: 0, playbackEvents: 0, customEvents: 0 };
    }
  }

  /**
   * Cleanup on shutdown
   */
  async shutdown() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    await this.flushEvents();
    logger.info('Analytics service shut down');
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;
