import express from 'express';
import { prisma } from '../config/database.js';
import { cache } from '../config/redis.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all content (with filters)
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const {
    type,
    genre,
    page = 1,
    limit = 20,
    sort = 'releaseDate',
    order = 'desc',
    featured,
  } = req.query;

  const cacheKey = `content:list:${JSON.stringify(req.query)}`;
  let result = await cache.get(cacheKey);

  if (!result) {
    const where = { isPublished: true };

    if (type) where.type = type;
    if (featured === 'true') where.featured = true;

    if (genre) {
      where.genres = {
        some: {
          genre: { name: { equals: genre, mode: 'insensitive' } },
        },
      };
    }

    const [content, total] = await Promise.all([
      prisma.content.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        include: {
          genres: { include: { genre: true } },
          videos: { where: { status: 'READY' }, take: 1 },
        },
      }),
      prisma.content.count({ where }),
    ]);

    result = {
      content: content.map((c) => ({
        ...c,
        genres: c.genres.map((g) => g.genre),
        hasVideo: c.videos.length > 0,
        videos: undefined,
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

// Get featured content
router.get('/featured', asyncHandler(async (req, res) => {
  const cacheKey = 'content:featured';
  let featured = await cache.get(cacheKey);

  if (!featured) {
    featured = await prisma.content.findMany({
      where: { isPublished: true, featured: true },
      take: 10,
      orderBy: { updatedAt: 'desc' },
      include: {
        genres: { include: { genre: true } },
      },
    });

    featured = featured.map((c) => ({
      ...c,
      genres: c.genres.map((g) => g.genre),
    }));

    await cache.set(cacheKey, featured, 600);
  }

  res.json({ status: 'success', data: featured });
}));

// Get content by category/genre
router.get('/category/:category', asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { limit = 20 } = req.query;

  const cacheKey = `content:category:${category}:${limit}`;
  let content = await cache.get(cacheKey);

  if (!content) {
    content = await prisma.content.findMany({
      where: {
        isPublished: true,
        genres: {
          some: {
            genre: { name: { equals: category, mode: 'insensitive' } },
          },
        },
      },
      take: parseInt(limit),
      orderBy: { rating: 'desc' },
      include: {
        genres: { include: { genre: true } },
      },
    });

    content = content.map((c) => ({
      ...c,
      genres: c.genres.map((g) => g.genre),
    }));

    await cache.set(cacheKey, content, 600);
  }

  res.json({ status: 'success', data: content });
}));

// Get single content details
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const cacheKey = `content:${id}`;
  let content = await cache.get(cacheKey);

  if (!content) {
    content = await prisma.content.findUnique({
      where: { id },
      include: {
        genres: { include: { genre: true } },
        cast: {
          include: { person: true },
          orderBy: { order: 'asc' },
          take: 20,
        },
        videos: {
          where: { status: 'READY' },
          select: {
            id: true,
            title: true,
            duration: true,
            episodeId: true,
          },
        },
        seasons: {
          orderBy: { seasonNumber: 'asc' },
          include: {
            episodes: {
              orderBy: { episodeNumber: 'asc' },
              include: {
                videos: {
                  where: { status: 'READY' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!content || !content.isPublished) {
      throw new AppError('Content not found', 404);
    }

    content = {
      ...content,
      genres: content.genres.map((g) => g.genre),
      cast: content.cast.map((c) => ({
        ...c.person,
        character: c.character,
        role: c.role,
      })),
    };

    await cache.set(cacheKey, content, 600);
  }

  // Add user-specific data
  if (req.user) {
    const [inWatchlist, rating, watchHistory] = await Promise.all([
      prisma.watchlist.findUnique({
        where: { userId_contentId: { userId: req.user.id, contentId: id } },
      }),
      prisma.rating.findUnique({
        where: { userId_contentId: { userId: req.user.id, contentId: id } },
      }),
      prisma.watchHistory.findFirst({
        where: { userId: req.user.id, contentId: id },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    content.inWatchlist = !!inWatchlist;
    content.userRating = rating?.rating;
    content.watchProgress = watchHistory;
  }

  res.json({ status: 'success', data: content });
}));

// Add to watchlist
router.post('/:id/watchlist', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { profileId } = req.body;

  await prisma.watchlist.upsert({
    where: { userId_contentId: { userId: req.user.id, contentId: id } },
    create: { userId: req.user.id, contentId: id, profileId },
    update: { profileId },
  });

  await cache.del(`watchlist:${req.user.id}`);

  res.json({ status: 'success', message: 'Added to watchlist' });
}));

// Remove from watchlist
router.delete('/:id/watchlist', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.watchlist.delete({
    where: { userId_contentId: { userId: req.user.id, contentId: id } },
  });

  await cache.del(`watchlist:${req.user.id}`);

  res.json({ status: 'success', message: 'Removed from watchlist' });
}));

// Rate content
router.post('/:id/rate', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    throw new AppError('Rating must be between 1 and 5', 400);
  }

  await prisma.rating.upsert({
    where: { userId_contentId: { userId: req.user.id, contentId: id } },
    create: { userId: req.user.id, contentId: id, rating },
    update: { rating },
  });

  res.json({ status: 'success', message: 'Rating saved' });
}));

// Get user's watchlist
router.get('/user/watchlist', authenticate, asyncHandler(async (req, res) => {
  const { profileId } = req.query;

  const cacheKey = `watchlist:${req.user.id}:${profileId || 'all'}`;
  let watchlist = await cache.get(cacheKey);

  if (!watchlist) {
    const where = { userId: req.user.id };
    if (profileId) where.profileId = profileId;

    watchlist = await prisma.watchlist.findMany({
      where,
      orderBy: { addedAt: 'desc' },
      include: {
        content: {
          include: {
            genres: { include: { genre: true } },
          },
        },
      },
    });

    watchlist = watchlist.map((w) => ({
      ...w.content,
      genres: w.content.genres.map((g) => g.genre),
      addedAt: w.addedAt,
    }));

    await cache.set(cacheKey, watchlist, 300);
  }

  res.json({ status: 'success', data: watchlist });
}));

// Get all genres
router.get('/meta/genres', asyncHandler(async (req, res) => {
  const cacheKey = 'genres:all';
  let genres = await cache.get(cacheKey);

  if (!genres) {
    genres = await prisma.genre.findMany({
      orderBy: { name: 'asc' },
    });
    await cache.set(cacheKey, genres, 3600);
  }

  res.json({ status: 'success', data: genres });
}));

export default router;
