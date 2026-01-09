import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database.js';
import { cache } from '../config/redis.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { transcodeToHLS, generateThumbnail } from '../services/transcoderService.js';
import { analyticsService } from '../services/analyticsService.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer config for video uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads/videos'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 * 1024 }, // 10GB
  fileFilter: (req, file, cb) => {
    const allowed = ['.mp4', '.mkv', '.avi', '.mov', '.webm'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Apply admin auth to all routes
router.use(authenticate, authorize('ADMIN', 'MODERATOR'));

// Dashboard stats
router.get('/stats', asyncHandler(async (req, res) => {
  const [users, content, activeSubscriptions, watchHistory] = await Promise.all([
    prisma.user.count(),
    prisma.content.count(),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.watchHistory.count({ where: { watchedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
  ]);

  res.json({
    status: 'success',
    data: {
      totalUsers: users,
      totalContent: content,
      activeSubscriptions,
      viewsLast24h: watchHistory,
    },
  });
}));

// Analytics endpoint - comprehensive analytics data
router.get('/analytics', asyncHandler(async (req, res) => {
  const { period = '7d', startDate, endDate } = req.query;

  try {
    // Get real-time summary
    const realTimeSummary = await analyticsService.getRealTimeSummary();

    // Calculate date range based on period
    const now = new Date();
    let start, end;

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = now;
      switch (period) {
        case '24h':
          start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }
    }

    // Get analytics data from database
    const [
      totalViews,
      uniqueViewers,
      watchHistory,
      topContent,
      userGrowth,
      deviceStats,
      subscriptionStats
    ] = await Promise.all([
      // Total views in period
      prisma.analyticsEvent.count({
        where: {
          action: 'VIDEO_VIEW',
          createdAt: { gte: start, lte: end }
        }
      }),

      // Unique viewers
      prisma.analyticsEvent.groupBy({
        by: ['userId'],
        where: {
          action: 'VIDEO_VIEW',
          createdAt: { gte: start, lte: end }
        }
      }),

      // Average watch time from watch history
      prisma.watchHistory.aggregate({
        _avg: { progress: true },
        _sum: { progress: true },
        where: {
          watchedAt: { gte: start, lte: end }
        }
      }),

      // Top 10 most viewed content
      prisma.watchHistory.groupBy({
        by: ['contentId'],
        _count: { id: true },
        where: {
          watchedAt: { gte: start, lte: end }
        },
        orderBy: {
          _count: { id: 'desc' }
        },
        take: 10
      }),

      // User growth over period
      prisma.user.groupBy({
        by: ['createdAt'],
        _count: { id: true },
        where: {
          createdAt: { gte: start, lte: end }
        }
      }),

      // Device/platform stats
      prisma.analyticsEvent.groupBy({
        by: ['metadata'],
        _count: { id: true },
        where: {
          createdAt: { gte: start, lte: end }
        }
      }),

      // Subscription statistics
      prisma.subscription.groupBy({
        by: ['plan', 'status'],
        _count: { id: true }
      })
    ]);

    // Format response
    const analytics = {
      overview: {
        totalViews,
        uniqueViewers: uniqueViewers.length,
        avgWatchTime: watchHistory._avg.progress
          ? `${Math.round(watchHistory._avg.progress)} min`
          : '0 min',
        totalWatchTime: watchHistory._sum.progress || 0,
        activeUsers: realTimeSummary.activeUsers || 0,
        currentViewers: realTimeSummary.currentViewers || 0,
      },
      topContent: await Promise.all(
        topContent.slice(0, 10).map(async (item) => {
          const content = await prisma.content.findUnique({
            where: { id: item.contentId },
            select: { id: true, title: true, type: true, posterUrl: true }
          });
          return {
            ...content,
            views: item._count.id
          };
        })
      ),
      userGrowth: {
        total: userGrowth.reduce((sum, day) => sum + day._count.id, 0),
        daily: userGrowth.map(day => ({
          date: day.createdAt,
          count: day._count.id
        }))
      },
      subscriptions: {
        byPlan: subscriptionStats.reduce((acc, sub) => {
          if (!acc[sub.plan]) acc[sub.plan] = 0;
          acc[sub.plan] += sub._count.id;
          return acc;
        }, {}),
        byStatus: subscriptionStats.reduce((acc, sub) => {
          if (!acc[sub.status]) acc[sub.status] = 0;
          acc[sub.status] += sub._count.id;
          return acc;
        }, {})
      },
      realTime: realTimeSummary,
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
        label: period
      }
    };

    res.json({
      status: 'success',
      data: analytics
    });

  } catch (error) {
    logger.error('Analytics fetch error:', error);
    throw new AppError('Failed to fetch analytics data', 500);
  }
}));

// Content management
router.get('/content', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type, status } = req.query;

  const where = {};
  if (type) where.type = type;
  if (status === 'published') where.isPublished = true;
  if (status === 'draft') where.isPublished = false;

  const [content, total] = await Promise.all([
    prisma.content.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      include: {
        videos: { select: { id: true, status: true } },
        genres: { include: { genre: true } },
      },
    }),
    prisma.content.count({ where }),
  ]);

  res.json({
    status: 'success',
    data: {
      content,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
}));

// Create content
router.post('/content', asyncHandler(async (req, res) => {
  const {
    title, originalTitle, description, tagline, type,
    releaseDate, runtime, maturityRating, posterUrl, backdropUrl,
    trailerUrl, genres, featured,
  } = req.body;

  const content = await prisma.content.create({
    data: {
      title,
      originalTitle,
      description,
      tagline,
      type,
      releaseDate: releaseDate ? new Date(releaseDate) : null,
      runtime,
      maturityRating,
      posterUrl,
      backdropUrl,
      trailerUrl,
      featured: featured || false,
      genres: {
        create: genres?.map((genreId) => ({ genreId })) || [],
      },
    },
    include: {
      genres: { include: { genre: true } },
    },
  });

  await cache.delPattern('content:*');

  res.status(201).json({ status: 'success', data: content });
}));

// Update content
router.patch('/content/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Handle genres separately
  if (updateData.genres) {
    await prisma.contentGenre.deleteMany({ where: { contentId: id } });
    await prisma.contentGenre.createMany({
      data: updateData.genres.map((genreId) => ({ contentId: id, genreId })),
    });
    delete updateData.genres;
  }

  if (updateData.releaseDate) {
    updateData.releaseDate = new Date(updateData.releaseDate);
  }

  const content = await prisma.content.update({
    where: { id },
    data: updateData,
    include: {
      genres: { include: { genre: true } },
    },
  });

  await cache.delPattern('content:*');

  res.json({ status: 'success', data: content });
}));

// Delete content
router.delete('/content/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.content.delete({ where: { id } });
  await cache.delPattern('content:*');

  res.json({ status: 'success', message: 'Content deleted' });
}));

// Upload video
router.post('/content/:contentId/video', upload.single('video'), asyncHandler(async (req, res) => {
  const { contentId } = req.params;
  const { title, episodeId, seasonId } = req.body;

  if (!req.file) {
    throw new AppError('No video file uploaded', 400);
  }

  // Verify content exists
  const content = await prisma.content.findUnique({ where: { id: contentId } });
  if (!content) {
    throw new AppError('Content not found', 404);
  }

  // Create video record
  const video = await prisma.video.create({
    data: {
      contentId,
      title,
      episodeId,
      seasonId,
      originalFile: req.file.filename,
      duration: 0,
      status: 'PENDING',
    },
  });

  logger.info(`Video uploaded: ${video.id}, starting transcode...`);

  // Start transcoding in background
  transcodeToHLS(video.id, req.file.path, (progress) => {
    // Emit progress via socket
    const io = req.app.get('io');
    io.to(`admin`).emit('transcode-progress', {
      videoId: video.id,
      ...progress,
    });
  }).catch((err) => {
    logger.error(`Transcoding failed for ${video.id}:`, err);
  });

  res.status(201).json({
    status: 'success',
    data: video,
    message: 'Video uploaded, transcoding started',
  });
}));

// Get video status
router.get('/videos/:videoId/status', asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: { qualities: true },
  });

  if (!video) {
    throw new AppError('Video not found', 404);
  }

  res.json({ status: 'success', data: video });
}));

// User management
router.get('/users', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;

  const where = {};
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        subscription: { select: { plan: true, status: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    status: 'success',
    data: {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
}));

// Update user
router.patch('/users/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role, isActive } = req.body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role, isActive },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
    },
  });

  await cache.del(`user:${userId}`);

  res.json({ status: 'success', data: user });
}));

// Genre management
router.post('/genres', asyncHandler(async (req, res) => {
  const { name, tmdbId } = req.body;

  const genre = await prisma.genre.create({
    data: { name, tmdbId },
  });

  await cache.del('genres:all');

  res.status(201).json({ status: 'success', data: genre });
}));

// Sync content from TMDB
router.post('/sync-tmdb/:tmdbId', asyncHandler(async (req, res) => {
  const { tmdbId } = req.params;
  const { type = 'MOVIE' } = req.body;

  const apiKey = process.env.TMDB_API_KEY;
  const endpoint = type === 'MOVIE' ? 'movie' : 'tv';

  const response = await fetch(
    `https://api.themoviedb.org/3/${endpoint}/${tmdbId}?api_key=${apiKey}&append_to_response=credits`
  );
  const data = await response.json();

  if (data.success === false) {
    throw new AppError('Content not found on TMDB', 404);
  }

  // Create or update content
  const content = await prisma.content.upsert({
    where: { tmdbId: parseInt(tmdbId) },
    create: {
      tmdbId: parseInt(tmdbId),
      title: data.title || data.name,
      originalTitle: data.original_title || data.original_name,
      description: data.overview,
      tagline: data.tagline,
      type,
      releaseDate: data.release_date || data.first_air_date ? new Date(data.release_date || data.first_air_date) : null,
      runtime: data.runtime || data.episode_run_time?.[0],
      rating: data.vote_average,
      posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
      backdropUrl: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : null,
    },
    update: {
      title: data.title || data.name,
      description: data.overview,
      rating: data.vote_average,
      posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
      backdropUrl: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : null,
    },
  });

  await cache.delPattern('content:*');

  res.json({ status: 'success', data: content });
}));

export default router;
