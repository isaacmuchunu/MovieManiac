import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';

export const setupSocketHandlers = (io) => {
  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, name: true, role: true },
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id} (User: ${socket.user.email})`);

    // Join user's personal room
    socket.join(`user:${socket.user.id}`);

    // Admin room
    if (['ADMIN', 'MODERATOR'].includes(socket.user.role)) {
      socket.join('admin');
    }

    // Watch party / co-watching
    socket.on('join-watch-party', async ({ partyId }) => {
      socket.join(`party:${partyId}`);
      socket.to(`party:${partyId}`).emit('user-joined', {
        user: { id: socket.user.id, name: socket.user.name },
      });
      logger.debug(`User ${socket.user.id} joined watch party ${partyId}`);
    });

    socket.on('leave-watch-party', ({ partyId }) => {
      socket.leave(`party:${partyId}`);
      socket.to(`party:${partyId}`).emit('user-left', {
        userId: socket.user.id,
      });
    });

    // Sync playback for watch party
    socket.on('sync-playback', ({ partyId, action, time, videoId }) => {
      socket.to(`party:${partyId}`).emit('playback-update', {
        action, // play, pause, seek
        time,
        videoId,
        userId: socket.user.id,
      });
    });

    // Chat for watch party
    socket.on('party-message', ({ partyId, message }) => {
      io.to(`party:${partyId}`).emit('new-message', {
        userId: socket.user.id,
        userName: socket.user.name,
        message,
        timestamp: new Date(),
      });
    });

    // Video playback events (for analytics)
    socket.on('playback-event', async ({ videoId, event, data }) => {
      logger.debug(`Playback event: ${event} for video ${videoId} by user ${socket.user.id}`);

      // Record analytics
      // In production, batch these and send to analytics service
    });

    // Real-time notifications
    socket.on('subscribe-notifications', () => {
      socket.join(`notifications:${socket.user.id}`);
    });

    // Typing indicator for comments
    socket.on('typing-start', ({ contentId }) => {
      socket.to(`content:${contentId}`).emit('user-typing', {
        userId: socket.user.id,
        userName: socket.user.name,
      });
    });

    socket.on('typing-stop', ({ contentId }) => {
      socket.to(`content:${contentId}`).emit('user-stopped-typing', {
        userId: socket.user.id,
      });
    });

    // Join content room (for comments/reactions)
    socket.on('join-content', ({ contentId }) => {
      socket.join(`content:${contentId}`);
    });

    socket.on('leave-content', ({ contentId }) => {
      socket.leave(`content:${contentId}`);
    });

    // Disconnect
    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.id} (${reason})`);
    });
  });

  // Utility function to send notification to user
  io.sendToUser = (userId, event, data) => {
    io.to(`user:${userId}`).emit(event, data);
  };

  // Utility function to broadcast to all admins
  io.sendToAdmins = (event, data) => {
    io.to('admin').emit(event, data);
  };

  return io;
};

export default setupSocketHandlers;
