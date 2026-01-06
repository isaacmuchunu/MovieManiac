import express from 'express';
import { prisma } from '../config/database.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Get user notifications
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;

  const where = { userId: req.user.id };
  if (unreadOnly === 'true') {
    where.read = false;
  }

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      include: {
        content: {
          select: {
            id: true,
            title: true,
            posterUrl: true,
            type: true,
            tmdbId: true
          }
        }
      }
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId: req.user.id, read: false } })
  ]);

  res.json({
    status: 'success',
    data: {
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
}));

// Mark notification as read
router.post('/:id/read', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await prisma.notification.findFirst({
    where: { id, userId: req.user.id }
  });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  await prisma.notification.update({
    where: { id },
    data: { read: true }
  });

  res.json({ status: 'success', message: 'Notification marked as read' });
}));

// Mark all notifications as read
router.post('/read-all', asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({
    where: { userId: req.user.id, read: false },
    data: { read: true }
  });

  res.json({ status: 'success', message: 'All notifications marked as read' });
}));

// Delete notification
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await prisma.notification.findFirst({
    where: { id, userId: req.user.id }
  });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  await prisma.notification.delete({ where: { id } });

  res.json({ status: 'success', message: 'Notification deleted' });
}));

// Clear all notifications
router.delete('/', asyncHandler(async (req, res) => {
  await prisma.notification.deleteMany({
    where: { userId: req.user.id }
  });

  res.json({ status: 'success', message: 'All notifications cleared' });
}));

// Get notification preferences
router.get('/preferences', asyncHandler(async (req, res) => {
  let preferences = await prisma.notificationPreferences.findUnique({
    where: { userId: req.user.id }
  });

  if (!preferences) {
    preferences = await prisma.notificationPreferences.create({
      data: {
        userId: req.user.id,
        newReleases: true,
        recommendations: true,
        watchReminders: true,
        accountAlerts: true,
        marketing: false,
        emailNotifications: true,
        pushNotifications: true
      }
    });
  }

  res.json({ status: 'success', data: preferences });
}));

// Update notification preferences
router.patch('/preferences', asyncHandler(async (req, res) => {
  const {
    newReleases,
    recommendations,
    watchReminders,
    accountAlerts,
    marketing,
    emailNotifications,
    pushNotifications
  } = req.body;

  const preferences = await prisma.notificationPreferences.upsert({
    where: { userId: req.user.id },
    create: {
      userId: req.user.id,
      newReleases: newReleases ?? true,
      recommendations: recommendations ?? true,
      watchReminders: watchReminders ?? true,
      accountAlerts: accountAlerts ?? true,
      marketing: marketing ?? false,
      emailNotifications: emailNotifications ?? true,
      pushNotifications: pushNotifications ?? true
    },
    update: {
      ...(newReleases !== undefined && { newReleases }),
      ...(recommendations !== undefined && { recommendations }),
      ...(watchReminders !== undefined && { watchReminders }),
      ...(accountAlerts !== undefined && { accountAlerts }),
      ...(marketing !== undefined && { marketing }),
      ...(emailNotifications !== undefined && { emailNotifications }),
      ...(pushNotifications !== undefined && { pushNotifications })
    }
  });

  res.json({ status: 'success', data: preferences });
}));

// Helper function to create notification (used by other services)
export const createNotification = async (userId, data, io = null) => {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type: data.type,
      title: data.title,
      message: data.message,
      image: data.image,
      link: data.link,
      contentId: data.contentId,
      metadata: data.metadata || {}
    },
    include: {
      content: {
        select: {
          id: true,
          title: true,
          posterUrl: true,
          type: true,
          tmdbId: true
        }
      }
    }
  });

  // Emit via socket if available
  if (io) {
    io.to(`user:${userId}`).emit('notification', notification);
  }

  logger.info(`Notification created for user ${userId}: ${data.type}`);

  return notification;
};

// Bulk create notifications for all users (admin use)
export const createBulkNotification = async (data, io = null) => {
  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: { id: true }
  });

  const notifications = await prisma.notification.createMany({
    data: users.map(user => ({
      userId: user.id,
      type: data.type,
      title: data.title,
      message: data.message,
      image: data.image,
      link: data.link,
      contentId: data.contentId,
      metadata: data.metadata || {}
    }))
  });

  // Emit via socket if available
  if (io) {
    io.emit('notification', {
      type: data.type,
      title: data.title,
      message: data.message,
      image: data.image,
      link: data.link
    });
  }

  logger.info(`Bulk notification created: ${data.type} for ${users.length} users`);

  return notifications;
};

export default router;
