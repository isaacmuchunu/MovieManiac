import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { prisma } from '../config/database.js';
import { cache } from '../config/redis.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TRANSCODED_DIR = path.join(__dirname, '../../transcoded');

// Quality settings for HLS
export const QUALITY_PROFILES = {
  UHD_4K: { width: 3840, height: 2160, bitrate: 15000, audioBitrate: 192 },
  FHD_1080: { width: 1920, height: 1080, bitrate: 5000, audioBitrate: 192 },
  HD_720: { width: 1280, height: 720, bitrate: 2500, audioBitrate: 128 },
  SD_480: { width: 854, height: 480, bitrate: 1200, audioBitrate: 96 },
  SD_360: { width: 640, height: 360, bitrate: 800, audioBitrate: 96 },
};

// Get stream info for a video
export const getStreamInfo = async (videoId, userId, maxQuality = 'UHD_4K') => {
  const cacheKey = `stream:${videoId}`;
  let streamInfo = await cache.get(cacheKey);

  if (!streamInfo) {
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        qualities: true,
        subtitles: true,
        content: {
          select: {
            id: true,
            title: true,
            posterUrl: true,
            backdropUrl: true,
          },
        },
      },
    });

    if (!video) {
      throw new AppError('Video not found', 404);
    }

    if (video.status !== 'READY') {
      throw new AppError('Video is not ready for streaming', 400);
    }

    streamInfo = {
      id: video.id,
      contentId: video.contentId,
      title: video.title || video.content.title,
      duration: video.duration,
      hlsUrl: `/videos/${video.id}/master.m3u8`,
      posterUrl: video.content.posterUrl,
      backdropUrl: video.content.backdropUrl,
      qualities: video.qualities.map((q) => ({
        quality: q.quality,
        width: q.width,
        height: q.height,
        bitrate: q.bitrate,
      })),
      subtitles: video.subtitles.map((s) => ({
        language: s.language,
        label: s.label,
        url: `/subtitles/${s.filePath}`,
        isDefault: s.isDefault,
      })),
    };

    await cache.set(cacheKey, streamInfo, 3600); // Cache for 1 hour
  }

  // Filter qualities based on subscription
  const qualityOrder = ['SD_360', 'SD_480', 'HD_720', 'FHD_1080', 'UHD_4K'];
  const maxQualityIndex = qualityOrder.indexOf(maxQuality);

  streamInfo.qualities = streamInfo.qualities.filter((q) => {
    const qIndex = qualityOrder.indexOf(q.quality);
    return qIndex <= maxQualityIndex;
  });

  // Get watch progress
  if (userId) {
    const history = await prisma.watchHistory.findFirst({
      where: {
        userId,
        videoId,
      },
      select: {
        progress: true,
        completed: true,
      },
    });

    streamInfo.progress = history?.progress || 0;
    streamInfo.completed = history?.completed || false;
  }

  return streamInfo;
};

// Generate master playlist dynamically based on available qualities
export const generateMasterPlaylist = async (videoId, maxQuality = 'UHD_4K') => {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: { qualities: true },
  });

  if (!video) {
    throw new AppError('Video not found', 404);
  }

  const qualityOrder = ['SD_360', 'SD_480', 'HD_720', 'FHD_1080', 'UHD_4K'];
  const maxQualityIndex = qualityOrder.indexOf(maxQuality);

  let playlist = '#EXTM3U\n#EXT-X-VERSION:3\n';

  // Sort qualities by bitrate
  const sortedQualities = video.qualities
    .filter((q) => {
      const qIndex = qualityOrder.indexOf(q.quality);
      return qIndex <= maxQualityIndex;
    })
    .sort((a, b) => a.bitrate - b.bitrate);

  for (const quality of sortedQualities) {
    playlist += `#EXT-X-STREAM-INF:BANDWIDTH=${quality.bitrate * 1000},RESOLUTION=${quality.width}x${quality.height},NAME="${quality.quality}"\n`;
    playlist += `${quality.quality}/playlist.m3u8\n`;
  }

  return playlist;
};

// Update watch progress
export const updateWatchProgress = async (userId, videoId, progress, duration, profileId = null) => {
  const completed = duration > 0 && progress >= duration * 0.9; // 90% watched

  // Get content ID from video
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    select: { contentId: true },
  });

  if (!video) {
    throw new AppError('Video not found', 404);
  }

  await prisma.watchHistory.upsert({
    where: {
      userId_contentId_videoId: {
        userId,
        contentId: video.contentId,
        videoId,
      },
    },
    create: {
      userId,
      contentId: video.contentId,
      videoId,
      profileId,
      progress,
      duration,
      completed,
    },
    update: {
      progress,
      duration,
      completed,
      watchedAt: new Date(),
    },
  });

  // Clear cache
  await cache.del(`continue-watching:${userId}`);

  logger.debug(`Updated watch progress for user ${userId}, video ${videoId}: ${progress}/${duration}`);

  return { progress, completed };
};

// Get continue watching list
export const getContinueWatching = async (userId, profileId = null, limit = 20) => {
  const cacheKey = `continue-watching:${userId}:${profileId || 'all'}`;
  let continueWatching = await cache.get(cacheKey);

  if (!continueWatching) {
    const whereClause = {
      userId,
      completed: false,
      progress: { gt: 0 },
    };

    if (profileId) {
      whereClause.profileId = profileId;
    }

    continueWatching = await prisma.watchHistory.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: {
        content: {
          select: {
            id: true,
            title: true,
            type: true,
            posterUrl: true,
            backdropUrl: true,
            runtime: true,
          },
        },
        video: {
          select: {
            id: true,
            title: true,
            duration: true,
          },
        },
      },
    });

    // Add progress percentage
    continueWatching = continueWatching.map((item) => ({
      ...item,
      progressPercent: item.duration > 0
        ? Math.round((item.progress / item.duration) * 100)
        : 0,
    }));

    await cache.set(cacheKey, continueWatching, 300); // Cache for 5 minutes
  }

  return continueWatching;
};

// Record playback analytics
export const recordPlaybackEvent = async (userId, videoId, event, data = {}) => {
  // Events: play, pause, seek, quality_change, buffer, error, complete
  const analyticsData = {
    userId,
    videoId,
    event,
    timestamp: new Date(),
    ...data,
  };

  // In production, send to analytics service
  logger.debug('Playback event:', analyticsData);

  return analyticsData;
};

// Get video file path for direct streaming
export const getVideoFilePath = async (videoId, quality) => {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: { qualities: true },
  });

  if (!video) {
    throw new AppError('Video not found', 404);
  }

  const qualityData = video.qualities.find((q) => q.quality === quality);
  if (!qualityData) {
    throw new AppError('Quality not available', 404);
  }

  const filePath = path.join(TRANSCODED_DIR, video.id, quality);

  if (!existsSync(filePath)) {
    throw new AppError('Video file not found', 404);
  }

  return filePath;
};
