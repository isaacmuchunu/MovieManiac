/**
 * Watch Party Hook
 *
 * Provides WebSocket-based watch party functionality for synchronized viewing.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from './store';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useWatchParty() {
  const { token, isAuthenticated } = useAuthStore();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [party, setParty] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  // Connect to WebSocket
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      setError(err.message);
      setIsConnected(false);
    });

    // Party events
    newSocket.on('user-joined', ({ user, participantCount }) => {
      setParty(prev => prev ? {
        ...prev,
        participantCount,
        participants: [...(prev.participants || []), user]
      } : null);
      setMessages(prev => [...prev, {
        type: 'system',
        message: `${user.name} joined the party`,
        timestamp: new Date()
      }]);
    });

    newSocket.on('user-left', ({ userId, participantCount }) => {
      setParty(prev => {
        if (!prev) return null;
        const leftUser = prev.participants?.find(p => p.id === userId);
        if (leftUser) {
          setMessages(msgs => [...msgs, {
            type: 'system',
            message: `${leftUser.name} left the party`,
            timestamp: new Date()
          }]);
        }
        return {
          ...prev,
          participantCount,
          participants: prev.participants?.filter(p => p.id !== userId) || []
        };
      });
    });

    newSocket.on('host-changed', ({ newHostId }) => {
      setParty(prev => prev ? { ...prev, host: newHostId } : null);
      setMessages(prev => [...prev, {
        type: 'system',
        message: 'Host has changed',
        timestamp: new Date()
      }]);
    });

    newSocket.on('new-message', (message) => {
      setMessages(prev => [...prev, { type: 'chat', ...message }]);
    });

    newSocket.on('new-reaction', (reaction) => {
      setReactions(prev => [...prev, { ...reaction, id: Date.now() }]);
      // Auto-remove reaction after animation
      setTimeout(() => {
        setReactions(prev => prev.filter(r => r.id !== reaction.id));
      }, 3000);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, token]);

  // Create a watch party
  const createParty = useCallback((contentId) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current?.connected) {
        reject(new Error('Not connected'));
        return;
      }

      socketRef.current.emit('create-watch-party', { contentId }, (response) => {
        if (response.success) {
          setParty(response.party);
          setMessages([{
            type: 'system',
            message: 'Watch party created! Share the code with friends.',
            timestamp: new Date()
          }]);
          resolve(response);
        } else {
          reject(new Error(response.error || 'Failed to create party'));
        }
      });
    });
  }, []);

  // Join an existing watch party
  const joinParty = useCallback((partyCode) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current?.connected) {
        reject(new Error('Not connected'));
        return;
      }

      socketRef.current.emit('join-watch-party', { partyId: partyCode }, (response) => {
        if (response.success) {
          setParty(response.party);
          setMessages([{
            type: 'system',
            message: 'You joined the watch party!',
            timestamp: new Date()
          }]);
          resolve(response);
        } else {
          reject(new Error(response.error || 'Failed to join party'));
        }
      });
    });
  }, []);

  // Leave the current party
  const leaveParty = useCallback(() => {
    if (!socketRef.current?.connected || !party) return;

    socketRef.current.emit('leave-watch-party', { partyId: party.id });
    setParty(null);
    setMessages([]);
    setReactions([]);
  }, [party]);

  // Sync playback (host only)
  const syncPlayback = useCallback((action, time, videoId) => {
    if (!socketRef.current?.connected || !party) return;

    socketRef.current.emit('sync-playback', {
      partyId: party.id,
      action,
      time,
      videoId
    });
  }, [party]);

  // Request sync from host
  const requestSync = useCallback(() => {
    if (!socketRef.current?.connected || !party) return;

    socketRef.current.emit('request-sync', { partyId: party.id });
  }, [party]);

  // Send a chat message
  const sendMessage = useCallback((message) => {
    if (!socketRef.current?.connected || !party || !message.trim()) return;

    socketRef.current.emit('party-message', {
      partyId: party.id,
      message: message.trim()
    });
  }, [party]);

  // Send a reaction
  const sendReaction = useCallback((reaction) => {
    if (!socketRef.current?.connected || !party) return;

    socketRef.current.emit('party-reaction', {
      partyId: party.id,
      reaction
    });
  }, [party]);

  // Listen for playback updates (for non-hosts)
  const onPlaybackUpdate = useCallback((callback) => {
    if (!socketRef.current) return () => {};

    socketRef.current.on('playback-update', callback);
    return () => socketRef.current?.off('playback-update', callback);
  }, []);

  // Listen for sync state (for late joiners)
  const onSyncState = useCallback((callback) => {
    if (!socketRef.current) return () => {};

    socketRef.current.on('sync-state', callback);
    return () => socketRef.current?.off('sync-state', callback);
  }, []);

  return {
    isConnected,
    party,
    messages,
    reactions,
    error,
    createParty,
    joinParty,
    leaveParty,
    syncPlayback,
    requestSync,
    sendMessage,
    sendReaction,
    onPlaybackUpdate,
    onSyncState
  };
}

export default useWatchParty;
