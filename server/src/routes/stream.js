import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, checkContentAccess } from '../middleware/auth.js';
import * as streamingService from '../services/streamingService.js';

const router = express.Router();

// Get stream info for a video
router.get('/:videoId', authenticate, asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const maxQuality = req.maxQuality || 'UHD_4K';

  const streamInfo = await streamingService.getStreamInfo(
    videoId,
    req.user.id,
    maxQuality
  );

  res.json({
    status: 'success',
    data: streamInfo,
  });
}));

// Get master playlist (dynamic based on subscription)
router.get('/:videoId/master.m3u8', authenticate, asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const maxQuality = req.maxQuality || 'UHD_4K';

  const playlist = await streamingService.generateMasterPlaylist(videoId, maxQuality);

  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  res.setHeader('Cache-Control', 'no-cache');
  res.send(playlist);
}));

// Update watch progress
router.post('/:videoId/progress', authenticate, asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { progress, duration, profileId } = req.body;

  if (typeof progress !== 'number' || typeof duration !== 'number') {
    return res.status(400).json({
      status: 'fail',
      message: 'Progress and duration are required',
    });
  }

  const result = await streamingService.updateWatchProgress(
    req.user.id,
    videoId,
    Math.floor(progress),
    Math.floor(duration),
    profileId
  );

  res.json({
    status: 'success',
    data: result,
  });
}));

// Get continue watching list
router.get('/continue-watching', authenticate, asyncHandler(async (req, res) => {
  const { profileId, limit = 20 } = req.query;

  const continueWatching = await streamingService.getContinueWatching(
    req.user.id,
    profileId,
    parseInt(limit)
  );

  res.json({
    status: 'success',
    data: continueWatching,
  });
}));

// Record playback analytics event
router.post('/:videoId/analytics', authenticate, asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { event, data } = req.body;

  const result = await streamingService.recordPlaybackEvent(
    req.user.id,
    videoId,
    event,
    data
  );

  res.json({
    status: 'success',
    data: result,
  });
}));

export default router;
