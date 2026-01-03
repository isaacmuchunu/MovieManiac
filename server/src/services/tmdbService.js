// TMDB API Service with LRU Cache and Memory Management
// Provides caching layer for TMDB API calls with automatic cleanup

import { logger } from '../utils/logger.js';

// Configuration
const MAX_CACHE_ENTRIES = 1000;
const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Validate TMDB API Key at module load
const TMDB_API_KEY = process.env.TMDB_API_KEY?.trim();

if (!TMDB_API_KEY) {
  const errorMessage = 'Missing required TMDB_API_KEY environment variable. Please set TMDB_API_KEY in your .env file.';
  logger.error(errorMessage);
  throw new Error(errorMessage);
}

// LRU Cache implementation using Map (maintains insertion order)
// Keys are moved to the end on access to track usage order
class LRUCache {
  constructor(maxSize = MAX_CACHE_ENTRIES, defaultTtl = DEFAULT_TTL) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.defaultTtl = defaultTtl;
    this.cleanupIntervalId = null;

    // Start periodic cleanup
    this.startPeriodicCleanup();

    logger.info(`TMDB LRU Cache initialized with max ${maxSize} entries`);
  }

  /**
   * Get a cached value and update its usage order
   * @param {string} key - Cache key
   * @returns {*} Cached value or undefined if not found/expired
   */
  get(key) {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      logger.debug(`Cache entry expired: ${key}`);
      return undefined;
    }

    // Move to end of Map to mark as recently used (LRU update)
    this.cache.delete(key);
    entry.lastAccessed = Date.now();
    this.cache.set(key, entry);

    return entry.value;
  }

  /**
   * Set a cache value with TTL and usage tracking
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, value, ttl = this.defaultTtl) {
    // Evict least recently used entries if at capacity
    while (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    const now = Date.now();
    const entry = {
      value,
      createdAt: now,
      lastAccessed: now,
      expiresAt: now + ttl
    };

    // If key exists, delete first to update position in Map
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    this.cache.set(key, entry);
  }

  /**
   * Delete a specific cache entry
   * @param {string} key - Cache key to delete
   * @returns {boolean} True if entry was deleted
   */
  delete(key) {
    return this.cache.delete(key);
  }

  /**
   * Delete cache entries matching a pattern
   * @param {string} pattern - Pattern to match (supports * as wildcard)
   * @returns {number} Number of entries deleted
   */
  deletePattern(pattern) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    let deleted = 0;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        deleted++;
      }
    }

    if (deleted > 0) {
      logger.debug(`Deleted ${deleted} cache entries matching pattern: ${pattern}`);
    }

    return deleted;
  }

  /**
   * Evict the least recently used entry
   */
  evictLRU() {
    // Map iteration order is insertion order, so first key is LRU
    const firstKey = this.cache.keys().next().value;
    if (firstKey !== undefined) {
      this.cache.delete(firstKey);
      logger.debug(`LRU evicted: ${firstKey}`);
    }
  }

  /**
   * Remove all expired entries
   * @returns {number} Number of entries removed
   */
  cleanupExpired() {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }

    if (removed > 0) {
      logger.debug(`Periodic cleanup removed ${removed} expired cache entries`);
    }

    return removed;
  }

  /**
   * Start periodic cleanup of expired entries
   */
  startPeriodicCleanup() {
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
    }

    this.cleanupIntervalId = setInterval(() => {
      this.cleanupExpired();
    }, CLEANUP_INTERVAL);

    // Prevent interval from keeping Node process alive
    if (this.cleanupIntervalId.unref) {
      this.cleanupIntervalId.unref();
    }

    logger.info(`TMDB cache periodic cleanup started (interval: ${CLEANUP_INTERVAL / 1000}s)`);
  }

  /**
   * Stop periodic cleanup (call on service shutdown)
   */
  stopPeriodicCleanup() {
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
      this.cleanupIntervalId = null;
      logger.info('TMDB cache periodic cleanup stopped');
    }
  }

  /**
   * Get cache statistics
   * @returns {object} Cache stats
   */
  getStats() {
    let expiredCount = 0;
    const now = Date.now();

    for (const entry of this.cache.values()) {
      if (now > entry.expiresAt) {
        expiredCount++;
      }
    }

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      expiredPending: expiredCount,
      utilizationPercent: Math.round((this.cache.size / this.maxSize) * 100)
    };
  }

  /**
   * Clear all cache entries
   */
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    logger.info(`TMDB cache cleared (${size} entries removed)`);
  }

  /**
   * Check if cache has a valid (non-expired) entry for key
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }
}

// Create singleton cache instance
const cache = new LRUCache();

// Base URL for TMDB API
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Fetch from TMDB API with caching
 * @param {string} endpoint - API endpoint (e.g., '/movie/550')
 * @param {object} params - Query parameters
 * @param {number} ttl - Cache TTL in milliseconds
 * @returns {Promise<object>} API response
 */
async function fetchFromTMDB(endpoint, params = {}, ttl = DEFAULT_TTL) {
  // Build cache key from endpoint and params
  const paramString = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&');
  const cacheKey = `tmdb:${endpoint}${paramString ? ':' + paramString : ''}`;

  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached !== undefined) {
    logger.debug(`TMDB cache hit: ${cacheKey}`);
    return cached;
  }

  // Build URL with params
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', TMDB_API_KEY);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid TMDB API key - please check your TMDB_API_KEY environment variable');
      }
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Cache successful response
    cache.set(cacheKey, data, ttl);
    logger.debug(`TMDB cache miss, fetched and cached: ${cacheKey}`);

    return data;
  } catch (error) {
    logger.error(`TMDB fetch error for ${endpoint}:`, error);
    throw error;
  }
}

// TMDB API methods
const tmdbService = {
  // Movie endpoints
  getMovie: (movieId, appendToResponse = '') =>
    fetchFromTMDB(`/movie/${movieId}`, appendToResponse ? { append_to_response: appendToResponse } : {}),

  getMovieCredits: (movieId) =>
    fetchFromTMDB(`/movie/${movieId}/credits`),

  getMovieVideos: (movieId) =>
    fetchFromTMDB(`/movie/${movieId}/videos`),

  getSimilarMovies: (movieId, page = 1) =>
    fetchFromTMDB(`/movie/${movieId}/similar`, { page }),

  getMovieRecommendations: (movieId, page = 1) =>
    fetchFromTMDB(`/movie/${movieId}/recommendations`, { page }),

  // TV endpoints
  getTvShow: (tvId, appendToResponse = '') =>
    fetchFromTMDB(`/tv/${tvId}`, appendToResponse ? { append_to_response: appendToResponse } : {}),

  getTvCredits: (tvId) =>
    fetchFromTMDB(`/tv/${tvId}/credits`),

  getTvVideos: (tvId) =>
    fetchFromTMDB(`/tv/${tvId}/videos`),

  getSimilarTvShows: (tvId, page = 1) =>
    fetchFromTMDB(`/tv/${tvId}/similar`, { page }),

  getTvSeason: (tvId, seasonNumber) =>
    fetchFromTMDB(`/tv/${tvId}/season/${seasonNumber}`),

  // Discovery and search
  discoverMovies: (params = {}) =>
    fetchFromTMDB('/discover/movie', params),

  discoverTvShows: (params = {}) =>
    fetchFromTMDB('/discover/tv', params),

  searchMulti: (query, page = 1) =>
    fetchFromTMDB('/search/multi', { query, page }),

  searchMovies: (query, page = 1) =>
    fetchFromTMDB('/search/movie', { query, page }),

  searchTvShows: (query, page = 1) =>
    fetchFromTMDB('/search/tv', { query, page }),

  // Trending and popular
  getTrending: (mediaType = 'all', timeWindow = 'week', page = 1) =>
    fetchFromTMDB(`/trending/${mediaType}/${timeWindow}`, { page }),

  getPopularMovies: (page = 1) =>
    fetchFromTMDB('/movie/popular', { page }),

  getTopRatedMovies: (page = 1) =>
    fetchFromTMDB('/movie/top_rated', { page }),

  getNowPlayingMovies: (page = 1) =>
    fetchFromTMDB('/movie/now_playing', { page }),

  getUpcomingMovies: (page = 1) =>
    fetchFromTMDB('/movie/upcoming', { page }),

  getPopularTvShows: (page = 1) =>
    fetchFromTMDB('/tv/popular', { page }),

  getTopRatedTvShows: (page = 1) =>
    fetchFromTMDB('/tv/top_rated', { page }),

  // Genres
  getMovieGenres: () =>
    fetchFromTMDB('/genre/movie/list', {}, 24 * 60 * 60 * 1000), // Cache for 24 hours

  getTvGenres: () =>
    fetchFromTMDB('/genre/tv/list', {}, 24 * 60 * 60 * 1000),

  // Configuration
  getConfiguration: () =>
    fetchFromTMDB('/configuration', {}, 24 * 60 * 60 * 1000),

  // Cache management
  cache: {
    get: (key) => cache.get(key),
    set: (key, value, ttl) => cache.set(key, value, ttl),
    delete: (key) => cache.delete(key),
    deletePattern: (pattern) => cache.deletePattern(pattern),
    clear: () => cache.clear(),
    getStats: () => cache.getStats(),
    cleanup: () => cache.cleanupExpired()
  },

  // Service lifecycle
  shutdown: () => {
    cache.stopPeriodicCleanup();
    cache.clear();
    logger.info('TMDB service shutdown complete');
  }
};

// Handle process shutdown gracefully
process.on('SIGTERM', () => tmdbService.shutdown());
process.on('SIGINT', () => tmdbService.shutdown());

export { tmdbService, cache, TMDB_API_KEY };
export default tmdbService;
