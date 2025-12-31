import express from 'express';
import { prisma } from '../config/database.js';
import { cache } from '../config/redis.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Search content
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const { q, type, genre, year, page = 1, limit = 20 } = req.query;

  if (!q || q.length < 2) {
    return res.json({ status: 'success', data: { results: [], total: 0 } });
  }

  const cacheKey = `search:${JSON.stringify({ q, type, genre, year, page, limit })}`;
  let result = await cache.get(cacheKey);

  if (!result) {
    const where = {
      isPublished: true,
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { originalTitle: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ],
    };

    if (type) where.type = type;

    if (genre) {
      where.genres = {
        some: { genre: { name: { equals: genre, mode: 'insensitive' } } },
      };
    }

    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      where.releaseDate = { gte: startDate, lte: endDate };
    }

    const [results, total] = await Promise.all([
      prisma.content.findMany({
        where,
        orderBy: [{ rating: 'desc' }, { releaseDate: 'desc' }],
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: {
          genres: { include: { genre: true } },
        },
      }),
      prisma.content.count({ where }),
    ]);

    result = {
      results: results.map((c) => ({
        ...c,
        genres: c.genres.map((g) => g.genre),
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    };

    await cache.set(cacheKey, result, 300);
  }

  res.json({ status: 'success', data: result });
}));

// Search suggestions (autocomplete)
router.get('/suggestions', asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.json({ status: 'success', data: [] });
  }

  const cacheKey = `suggestions:${q.toLowerCase()}`;
  let suggestions = await cache.get(cacheKey);

  if (!suggestions) {
    suggestions = await prisma.content.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { originalTitle: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        type: true,
        posterUrl: true,
        releaseDate: true,
      },
      take: 10,
      orderBy: { rating: 'desc' },
    });

    await cache.set(cacheKey, suggestions, 300);
  }

  res.json({ status: 'success', data: suggestions });
}));

// Trending searches
router.get('/trending', asyncHandler(async (req, res) => {
  const cacheKey = 'search:trending';
  let trending = await cache.get(cacheKey);

  if (!trending) {
    // Get most viewed content in last 7 days
    trending = await prisma.content.findMany({
      where: {
        isPublished: true,
        watchHistory: {
          some: {
            watchedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        },
      },
      select: {
        id: true,
        title: true,
        type: true,
        posterUrl: true,
      },
      take: 10,
      orderBy: {
        watchHistory: { _count: 'desc' },
      },
    });

    await cache.set(cacheKey, trending, 3600);
  }

  res.json({ status: 'success', data: trending });
}));

// Browse by genre
router.get('/browse/:genre', asyncHandler(async (req, res) => {
  const { genre } = req.params;
  const { page = 1, limit = 20, sort = 'rating' } = req.query;

  const cacheKey = `browse:${genre}:${page}:${limit}:${sort}`;
  let result = await cache.get(cacheKey);

  if (!result) {
    const [content, total] = await Promise.all([
      prisma.content.findMany({
        where: {
          isPublished: true,
          genres: {
            some: { genre: { name: { equals: genre, mode: 'insensitive' } } },
          },
        },
        orderBy: { [sort]: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: {
          genres: { include: { genre: true } },
        },
      }),
      prisma.content.count({
        where: {
          isPublished: true,
          genres: {
            some: { genre: { name: { equals: genre, mode: 'insensitive' } } },
          },
        },
      }),
    ]);

    result = {
      content: content.map((c) => ({
        ...c,
        genres: c.genres.map((g) => g.genre),
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    };

    await cache.set(cacheKey, result, 600);
  }

  res.json({ status: 'success', data: result });
}));

export default router;
