import crypto from 'crypto';
import { cache } from '../config/redis.js';
import { AppError, asyncHandler } from './errorHandler.js';
import { logger } from '../utils/logger.js';

// Session management with Redis
const SESSION_PREFIX = 'session:';
const SESSION_EXPIRY = 60 * 60 * 24; // 24 hours in seconds

// Generate session ID
export const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Create session
export const createSession = async (userId, metadata = {}) => {
  const sessionId = generateSessionId();
  const sessionData = {
    userId,
    createdAt: Date.now(),
    lastActivity: Date.now(),
    userAgent: metadata.userAgent || 'unknown',
    ip: metadata.ip || 'unknown',
    deviceInfo: metadata.deviceInfo || {}
  };

  await cache.set(`${SESSION_PREFIX}${sessionId}`, sessionData, SESSION_EXPIRY);

  // Track active sessions per user
  const userSessionsKey = `user_sessions:${userId}`;
  const userSessions = await cache.get(userSessionsKey) || [];
  userSessions.push({
    sessionId,
    createdAt: sessionData.createdAt,
    ip: sessionData.ip
  });

  // Keep only last 10 sessions
  const trimmedSessions = userSessions.slice(-10);
  await cache.set(userSessionsKey, trimmedSessions, SESSION_EXPIRY * 7);

  return sessionId;
};

// Get session
export const getSession = async (sessionId) => {
  const session = await cache.get(`${SESSION_PREFIX}${sessionId}`);
  if (!session) return null;

  // Update last activity
  session.lastActivity = Date.now();
  await cache.set(`${SESSION_PREFIX}${sessionId}`, session, SESSION_EXPIRY);

  return session;
};

// Destroy session
export const destroySession = async (sessionId) => {
  const session = await getSession(sessionId);
  if (session) {
    // Remove from user sessions list
    const userSessionsKey = `user_sessions:${session.userId}`;
    const userSessions = await cache.get(userSessionsKey) || [];
    const filtered = userSessions.filter(s => s.sessionId !== sessionId);
    await cache.set(userSessionsKey, filtered, SESSION_EXPIRY * 7);
  }
  await cache.del(`${SESSION_PREFIX}${sessionId}`);
};

// Destroy all user sessions
export const destroyAllUserSessions = async (userId) => {
  const userSessionsKey = `user_sessions:${userId}`;
  const userSessions = await cache.get(userSessionsKey) || [];

  for (const session of userSessions) {
    await cache.del(`${SESSION_PREFIX}${session.sessionId}`);
  }

  await cache.del(userSessionsKey);
};

// URL Hashing for content IDs
// SECURITY: URL_HASH_SECRET must be set via environment variable - no hardcoded fallback
const URL_HASH_SECRET = process.env.URL_HASH_SECRET;
if (!URL_HASH_SECRET) {
  logger.error('CRITICAL: URL_HASH_SECRET environment variable is not set. Server cannot start securely.');
  throw new Error('URL_HASH_SECRET environment variable is required. Please set it in your .env file or environment.');
}

export const hashContentId = (id, type = 'content') => {
  const data = `${type}:${id}:${URL_HASH_SECRET}`;
  const hash = crypto.createHash('sha256').update(data).digest('base64url').substring(0, 12);
  return `${hash}-${Buffer.from(String(id)).toString('base64url')}`;
};

export const decodeContentId = (hashedId) => {
  try {
    const parts = hashedId.split('-');
    if (parts.length !== 2) return null;

    const encodedId = parts[1];
    const id = Buffer.from(encodedId, 'base64url').toString('utf8');
    return id;
  } catch {
    return null;
  }
};

export const verifyHashedId = (hashedId, type = 'content') => {
  const id = decodeContentId(hashedId);
  if (!id) return null;

  const expectedHash = hashContentId(id, type);
  if (hashedId === expectedHash) {
    return id;
  }
  return null;
};

// Advanced rate limiting per endpoint
const rateLimitStore = new Map();

export const createRateLimiter = (options = {}) => {
  const {
    windowMs = 60000,
    max = 100,
    keyGenerator = (req) => req.ip,
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    handler = null
  } = options;

  return asyncHandler(async (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();

    // Get or create entry
    let entry = rateLimitStore.get(key);
    if (!entry || now - entry.startTime > windowMs) {
      entry = { count: 0, startTime: now };
    }

    entry.count++;
    rateLimitStore.set(key, entry);

    // Clean old entries periodically
    if (Math.random() < 0.01) {
      const cutoff = now - windowMs;
      for (const [k, v] of rateLimitStore) {
        if (v.startTime < cutoff) {
          rateLimitStore.delete(k);
        }
      }
    }

    // Set rate limit headers
    res.set('X-RateLimit-Limit', String(max));
    res.set('X-RateLimit-Remaining', String(Math.max(0, max - entry.count)));
    res.set('X-RateLimit-Reset', String(Math.ceil((entry.startTime + windowMs) / 1000)));

    if (entry.count > max) {
      logger.warn(`Rate limit exceeded for ${key}`);

      if (handler) {
        return handler(req, res, next);
      }

      res.set('Retry-After', String(Math.ceil((entry.startTime + windowMs - now) / 1000)));
      throw new AppError(message, 429);
    }

    next();
  });
};

// Admin-specific rate limiter
export const adminRateLimiter = createRateLimiter({
  windowMs: 60000,
  max: 60,
  message: 'Too many admin requests, please slow down.'
});

// Login rate limiter (stricter)
export const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  keyGenerator: (req) => `login:${req.ip}`,
  message: 'Too many login attempts. Please try again in 15 minutes.'
});

// API rate limiter
export const apiRateLimiter = createRateLimiter({
  windowMs: 60000,
  max: 100,
  message: 'API rate limit exceeded.'
});

// CSRF Token generation and validation
export const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const csrfProtection = asyncHandler(async (req, res, next) => {
  // Skip for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.cookies?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    logger.warn(`CSRF validation failed for ${req.path}`);
    throw new AppError('Invalid CSRF token', 403);
  }

  next();
});

// Admin IP whitelist (optional)
const ADMIN_IP_WHITELIST = process.env.ADMIN_IP_WHITELIST?.split(',').map(ip => ip.trim()) || [];

export const adminIpWhitelist = asyncHandler(async (req, res, next) => {
  // Skip if no whitelist configured
  if (ADMIN_IP_WHITELIST.length === 0) {
    return next();
  }

  const clientIp = req.ip || req.connection.remoteAddress;

  if (!ADMIN_IP_WHITELIST.includes(clientIp)) {
    logger.warn(`Admin access denied from IP: ${clientIp}`);
    throw new AppError('Access denied', 403);
  }

  next();
});

// Security headers middleware
export const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy for API
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");

  // Permissions policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  next();
};

// Request logging for security audit
export const securityAudit = asyncHandler(async (req, res, next) => {
  const startTime = Date.now();

  // Log the request
  const requestInfo = {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.id,
    timestamp: new Date().toISOString()
  };

  // Log after response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logEntry = {
      ...requestInfo,
      statusCode: res.statusCode,
      duration
    };

    // Log security-relevant events
    if (res.statusCode >= 400) {
      logger.warn('Security audit - failed request', logEntry);
    } else if (req.path.includes('/admin')) {
      logger.info('Security audit - admin action', logEntry);
    }
  });

  next();
});

// Sanitize input middleware
export const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;

    const sanitized = Array.isArray(obj) ? [] : {};

    for (const [key, value] of Object.entries(obj)) {
      // Remove keys starting with $ (MongoDB injection prevention)
      if (key.startsWith('$')) continue;

      // Remove __proto__ and constructor (prototype pollution prevention)
      if (key === '__proto__' || key === 'constructor') continue;

      if (typeof value === 'string') {
        // Remove null bytes
        sanitized[key] = value.replace(/\0/g, '');
      } else if (typeof value === 'object') {
        sanitized[key] = sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

export default {
  createSession,
  getSession,
  destroySession,
  destroyAllUserSessions,
  hashContentId,
  decodeContentId,
  verifyHashedId,
  createRateLimiter,
  adminRateLimiter,
  loginRateLimiter,
  apiRateLimiter,
  generateCsrfToken,
  csrfProtection,
  adminIpWhitelist,
  securityHeaders,
  securityAudit,
  sanitizeInput
};
