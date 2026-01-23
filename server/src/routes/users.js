import express from 'express';
import { prisma } from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get current user profile
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
      profiles: true,
      subscription: true,
    },
  });

  res.json({ status: 'success', data: user });
}));

// Update user profile
router.patch('/me', authenticate, asyncHandler(async (req, res) => {
  const { name, avatarUrl } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, avatarUrl },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
    },
  });

  res.json({ status: 'success', data: user });
}));

// Get user profiles (for profile switching)
router.get('/profiles', authenticate, asyncHandler(async (req, res) => {
  const profiles = await prisma.profile.findMany({
    where: { userId: req.user.id },
    include: { preferences: true },
  });

  res.json({ status: 'success', data: profiles });
}));

// Create new profile
router.post('/profiles', authenticate, asyncHandler(async (req, res) => {
  const { name, avatarUrl, isKids } = req.body;

  // Check profile limit (max 5)
  const count = await prisma.profile.count({
    where: { userId: req.user.id },
  });

  if (count >= 5) {
    return res.status(400).json({
      status: 'fail',
      message: 'Maximum 5 profiles allowed',
    });
  }

  const profile = await prisma.profile.create({
    data: {
      userId: req.user.id,
      name,
      avatarUrl,
      isKids: isKids || false,
      preferences: {
        create: {
          maturityLevel: isKids ? 7 : 18,
        },
      },
    },
    include: { preferences: true },
  });

  res.status(201).json({ status: 'success', data: profile });
}));

// Update profile
router.patch('/profiles/:profileId', authenticate, asyncHandler(async (req, res) => {
  const { profileId } = req.params;
  const { name, avatarUrl, isKids, pin } = req.body;

  // Verify ownership
  const existing = await prisma.profile.findFirst({
    where: { id: profileId, userId: req.user.id },
  });

  if (!existing) {
    return res.status(404).json({
      status: 'fail',
      message: 'Profile not found',
    });
  }

  const profile = await prisma.profile.update({
    where: { id: profileId },
    data: { name, avatarUrl, isKids, pin },
    include: { preferences: true },
  });

  res.json({ status: 'success', data: profile });
}));

// Delete profile
router.delete('/profiles/:profileId', authenticate, asyncHandler(async (req, res) => {
  const { profileId } = req.params;

  // Verify ownership and ensure at least one profile remains
  const profiles = await prisma.profile.findMany({
    where: { userId: req.user.id },
  });

  if (profiles.length <= 1) {
    return res.status(400).json({
      status: 'fail',
      message: 'Cannot delete the last profile',
    });
  }

  const profile = profiles.find((p) => p.id === profileId);
  if (!profile) {
    return res.status(404).json({
      status: 'fail',
      message: 'Profile not found',
    });
  }

  await prisma.profile.delete({ where: { id: profileId } });

  res.json({ status: 'success', message: 'Profile deleted' });
}));

// Update profile preferences
router.patch('/profiles/:profileId/preferences', authenticate, asyncHandler(async (req, res) => {
  const { profileId } = req.params;
  const { autoplayNext, autoplayPreviews, defaultQuality, subtitleLanguage, audioLanguage, maturityLevel } = req.body;

  // Verify ownership
  const profile = await prisma.profile.findFirst({
    where: { id: profileId, userId: req.user.id },
  });

  if (!profile) {
    return res.status(404).json({
      status: 'fail',
      message: 'Profile not found',
    });
  }

  const preferences = await prisma.profilePreferences.upsert({
    where: { profileId },
    create: {
      profileId,
      autoplayNext,
      autoplayPreviews,
      defaultQuality,
      subtitleLanguage,
      audioLanguage,
      maturityLevel,
    },
    update: {
      autoplayNext,
      autoplayPreviews,
      defaultQuality,
      subtitleLanguage,
      audioLanguage,
      maturityLevel,
    },
  });

  res.json({ status: 'success', data: preferences });
}));

// Watch history handler
const getWatchHistoryHandler = asyncHandler(async (req, res) => {
  const { profileId, page = 1, limit = 20 } = req.query;

  const where = { userId: req.user.id };
  if (profileId) where.profileId = profileId;

  const history = await prisma.watchHistory.findMany({
    where,
    orderBy: { watchedAt: 'desc' },
    skip: (parseInt(page) - 1) * parseInt(limit),
    take: parseInt(limit),
    include: {
      content: {
        select: {
          id: true,
          title: true,
          type: true,
          posterUrl: true,
          backdropUrl: true,
        },
      },
    },
  });

  res.json({ status: 'success', data: history });
});

// Get watch history (both routes for compatibility)
router.get('/history', authenticate, getWatchHistoryHandler);
router.get('/watch-history', authenticate, getWatchHistoryHandler);

// Clear watch history handler
const clearWatchHistoryHandler = asyncHandler(async (req, res) => {
  const { profileId } = req.query;

  const where = { userId: req.user.id };
  if (profileId) where.profileId = profileId;

  await prisma.watchHistory.deleteMany({ where });

  res.json({ status: 'success', message: 'Watch history cleared' });
});

// Clear watch history (both routes for compatibility)
router.delete('/history', authenticate, clearWatchHistoryHandler);
router.delete('/watch-history', authenticate, clearWatchHistoryHandler);

export default router;
