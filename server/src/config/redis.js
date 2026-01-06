import Redis from 'ioredis';
import { logger } from '../utils/logger.js';

let redis = null;

const createRedisClient = () => {
  if (redis) return redis;

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    enableReadyCheck: true,
    lazyConnect: true,
  });

  redis.on('connect', () => {
    logger.info('Redis connected');
  });

  redis.on('error', (err) => {
    logger.error('Redis error:', err);
  });

  redis.on('close', () => {
    logger.warn('Redis connection closed');
  });

  return redis;
};

// Cache utilities
export const cache = {
  async get(key) {
    try {
      const client = createRedisClient();
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  },

  async set(key, value, ttlSeconds = 3600) {
    try {
      const client = createRedisClient();
      await client.setex(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  },

  async del(key) {
    try {
      const client = createRedisClient();
      await client.del(key);
      return true;
    } catch (error) {
      logger.error('Cache del error:', error);
      return false;
    }
  },

  async delPattern(pattern) {
    try {
      const client = createRedisClient();
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(...keys);
      }
      return true;
    } catch (error) {
      logger.error('Cache delPattern error:', error);
      return false;
    }
  },

  // For rate limiting
  async incr(key, ttlSeconds = 60) {
    try {
      const client = createRedisClient();
      const count = await client.incr(key);
      if (count === 1) {
        await client.expire(key, ttlSeconds);
      }
      return count;
    } catch (error) {
      logger.error('Cache incr error:', error);
      return 0;
    }
  },
};

export { redis, createRedisClient };
