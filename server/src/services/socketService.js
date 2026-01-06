import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { analyticsService } from './analyticsService.js';

// Active watch parties storage (in production, use Redis for persistence)
const watchParties = new Map();

/**
 * Generate a unique party code
 */
function generatePartyCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Get or create a watch party
 */
function getParty(partyId) {
  if (!watchParties.has(partyId)) {
    watchParties.set(partyId, {
      id: partyId,
      host: null,
      participants: new Map(),
      contentId: null,
      currentTime: 0,
      isPlaying: false,
      createdAt: new Date()
    });
  }
  return watchParties.get(partyId);
}

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

    // ==================
    // Watch Party Events
    // ==================

    // Create a new watch party
    socket.on('create-watch-party', ({ contentId }, callback) => {
      const partyCode = generatePartyCode();
      const party = getParty(partyCode);
      party.host = socket.user.id;
      party.contentId = contentId;
      party.participants.set(socket.user.id, {
        id: socket.user.id,
        name: socket.user.name,
        isHost: true,
        joinedAt: new Date()
      });

      socket.join(`party:${partyCode}`);
      socket.partyId = partyCode;

      logger.info(`Watch party created: ${partyCode} by ${socket.user.email}`);

      if (callback) {
        callback({ success: true, partyCode, party: serializeParty(party) });
      }
    });

    // Join an existing watch party
    socket.on('join-watch-party', async ({ partyId }, callback) => {
      const party = watchParties.get(partyId);

      if (!party) {
        if (callback) {
          callback({ success: false, error: 'Party not found' });
        }
        return;
      }

      // Check participant limit (8 max)
      if (party.participants.size >= 8) {
        if (callback) {
          callback({ success: false, error: 'Party is full (max 8 participants)' });
        }
        return;
      }

      party.participants.set(socket.user.id, {
        id: socket.user.id,
        name: socket.user.name,
        isHost: false,
        joinedAt: new Date()
      });

      socket.join(`party:${partyId}`);
      socket.partyId = partyId;

      // Notify others in the party
      socket.to(`party:${partyId}`).emit('user-joined', {
        user: { id: socket.user.id, name: socket.user.name },
        participantCount: party.participants.size
      });

      logger.info(`User ${socket.user.email} joined watch party ${partyId}`);

      if (callback) {
        callback({
          success: true,
          party: serializeParty(party),
          currentTime: party.currentTime,
          isPlaying: party.isPlaying
        });
      }
    });

    // Leave watch party
    socket.on('leave-watch-party', ({ partyId }) => {
      const party = watchParties.get(partyId || socket.partyId);
      if (!party) return;

      party.participants.delete(socket.user.id);
      socket.leave(`party:${partyId || socket.partyId}`);
      socket.partyId = null;

      socket.to(`party:${partyId || socket.partyId}`).emit('user-left', {
        userId: socket.user.id,
        participantCount: party.participants.size
      });

      // Clean up empty parties
      if (party.participants.size === 0) {
        watchParties.delete(partyId || socket.partyId);
        logger.info(`Watch party ${partyId || socket.partyId} ended (empty)`);
      } else if (party.host === socket.user.id) {
        // Transfer host to first remaining participant
        const newHost = party.participants.keys().next().value;
        party.host = newHost;
        const newHostData = party.participants.get(newHost);
        if (newHostData) newHostData.isHost = true;
        io.to(`party:${partyId || socket.partyId}`).emit('host-changed', { newHostId: newHost });
      }
    });

    // Sync playback for watch party
    socket.on('sync-playback', ({ partyId, action, time, videoId }) => {
      const party = watchParties.get(partyId);
      if (!party) return;

      // Only host can control playback
      if (party.host !== socket.user.id) {
        socket.emit('sync-error', { error: 'Only the host can control playback' });
        return;
      }

      // Update party state
      party.currentTime = time;
      party.isPlaying = action === 'play';

      socket.to(`party:${partyId}`).emit('playback-update', {
        action, // play, pause, seek
        time,
        videoId,
        userId: socket.user.id,
      });
    });

    // Request sync (for late joiners or out-of-sync clients)
    socket.on('request-sync', ({ partyId }) => {
      const party = watchParties.get(partyId);
      if (!party) return;

      socket.emit('sync-state', {
        currentTime: party.currentTime,
        isPlaying: party.isPlaying,
        contentId: party.contentId
      });
    });

    // Chat for watch party
    socket.on('party-message', ({ partyId, message }) => {
      if (!message || message.trim().length === 0) return;
      if (message.length > 500) return; // Limit message length

      io.to(`party:${partyId}`).emit('new-message', {
        userId: socket.user.id,
        userName: socket.user.name,
        message: message.trim(),
        timestamp: new Date(),
      });
    });

    // Reaction in watch party
    socket.on('party-reaction', ({ partyId, reaction }) => {
      const allowedReactions = ['❤️', '😂', '😮', '😢', '👏', '🔥'];
      if (!allowedReactions.includes(reaction)) return;

      io.to(`party:${partyId}`).emit('new-reaction', {
        userId: socket.user.id,
        userName: socket.user.name,
        reaction,
        timestamp: new Date()
      });
    });

    // ==================
    // Analytics Events
    // ==================

    // Video playback events (for analytics)
    socket.on('playback-event', async ({ videoId, contentId, event, data }) => {
      logger.debug(`Playback event: ${event} for video ${videoId} by user ${socket.user.id}`);

      // Record analytics
      try {
        await analyticsService.recordPlaybackEvent({
          userId: socket.user.id,
          sessionId: socket.id,
          videoId,
          contentId,
          action: event,
          position: data?.position || 0,
          duration: data?.duration || 0,
          quality: data?.quality || 'auto'
        });
      } catch (error) {
        logger.warn('Failed to record playback event:', error.message);
      }
    });

    // ==================
    // Notification Events
    // ==================

    // Real-time notifications
    socket.on('subscribe-notifications', () => {
      socket.join(`notifications:${socket.user.id}`);
    });

    // ==================
    // Content Events
    // ==================

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

    // ==================
    // Disconnect Handler
    // ==================

    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.id} (${reason})`);

      // Clean up watch party participation
      if (socket.partyId) {
        const party = watchParties.get(socket.partyId);
        if (party) {
          party.participants.delete(socket.user.id);
          socket.to(`party:${socket.partyId}`).emit('user-left', {
            userId: socket.user.id,
            participantCount: party.participants.size
          });

          if (party.participants.size === 0) {
            watchParties.delete(socket.partyId);
          } else if (party.host === socket.user.id) {
            const newHost = party.participants.keys().next().value;
            party.host = newHost;
            io.to(`party:${socket.partyId}`).emit('host-changed', { newHostId: newHost });
          }
        }
      }
    });
  });

  // ==================
  // Utility Functions
  // ==================

  // Utility function to send notification to user
  io.sendToUser = (userId, event, data) => {
    io.to(`user:${userId}`).emit(event, data);
  };

  // Utility function to broadcast to all admins
  io.sendToAdmins = (event, data) => {
    io.to('admin').emit(event, data);
  };

  // Get watch party info
  io.getPartyInfo = (partyId) => {
    const party = watchParties.get(partyId);
    return party ? serializeParty(party) : null;
  };

  return io;
};

/**
 * Serialize party for client
 */
function serializeParty(party) {
  return {
    id: party.id,
    host: party.host,
    contentId: party.contentId,
    participants: Array.from(party.participants.values()),
    participantCount: party.participants.size,
    createdAt: party.createdAt
  };
}

export default setupSocketHandlers;
