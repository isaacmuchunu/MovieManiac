// Backend API Service - Connects frontend to the Moovie server
// Handles authentication, user management, content, and analytics

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('moovie-token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Generic fetch wrapper with error handling
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// Authentication API
export const authApi = {
  // Register new user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Login user
  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (data.token) {
      localStorage.setItem('moovie-token', data.token);
      localStorage.setItem('moovie-user', JSON.stringify(data.user));
    }

    return data;
  },

  // Logout user
  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('moovie-token');
      localStorage.removeItem('moovie-user');
    }
  },

  // Refresh token
  refreshToken: async () => {
    return apiRequest('/auth/refresh', { method: 'POST' });
  },

  // Get current user
  getMe: async () => {
    return apiRequest('/auth/me');
  },

  // Verify email
  verifyEmail: async (token) => {
    return apiRequest(`/auth/verify-email/${token}`);
  },

  // Request password reset
  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  // Reset password
  resetPassword: async (token, password) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    });
  }
};

// User API
export const userApi = {
  // Get user profile
  getProfile: async () => {
    return apiRequest('/users/profile');
  },

  // Update user profile
  updateProfile: async (data) => {
    return apiRequest('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  // Get user profiles (family accounts)
  getProfiles: async () => {
    return apiRequest('/users/profiles');
  },

  // Create new profile
  createProfile: async (profileData) => {
    return apiRequest('/users/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });
  },

  // Update profile
  updateProfileById: async (profileId, data) => {
    return apiRequest(`/users/profiles/${profileId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  // Delete profile
  deleteProfile: async (profileId) => {
    return apiRequest(`/users/profiles/${profileId}`, {
      method: 'DELETE'
    });
  },

  // Get watch history
  getWatchHistory: async (profileId = null, page = 1, limit = 20) => {
    const params = new URLSearchParams({ page, limit });
    if (profileId) params.append('profileId', profileId);
    return apiRequest(`/users/watch-history?${params}`);
  },

  // Add to watch history
  addToWatchHistory: async (contentId, progress, duration) => {
    return apiRequest('/users/watch-history', {
      method: 'POST',
      body: JSON.stringify({ contentId, progress, duration })
    });
  },

  // Get watchlist (My List)
  getWatchlist: async (profileId = null, page = 1, limit = 20) => {
    const params = new URLSearchParams({ page, limit });
    if (profileId) params.append('profileId', profileId);
    return apiRequest(`/users/watchlist?${params}`);
  },

  // Add to watchlist
  addToWatchlist: async (contentId) => {
    return apiRequest('/users/watchlist', {
      method: 'POST',
      body: JSON.stringify({ contentId })
    });
  },

  // Remove from watchlist
  removeFromWatchlist: async (contentId) => {
    return apiRequest(`/users/watchlist/${contentId}`, {
      method: 'DELETE'
    });
  },

  // Get preferences
  getPreferences: async (profileId) => {
    return apiRequest(`/users/profiles/${profileId}/preferences`);
  },

  // Update preferences
  updatePreferences: async (profileId, preferences) => {
    return apiRequest(`/users/profiles/${profileId}/preferences`, {
      method: 'PATCH',
      body: JSON.stringify(preferences)
    });
  }
};

// Content API
export const contentApi = {
  // Get all content with filters
  getContent: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    return apiRequest(`/content?${queryParams}`);
  },

  // Get content by ID
  getContentById: async (id) => {
    return apiRequest(`/content/${id}`);
  },

  // Get featured content
  getFeatured: async () => {
    return apiRequest('/content/featured');
  },

  // Get trending content
  getTrending: async () => {
    return apiRequest('/content/trending');
  },

  // Get content by genre
  getByGenre: async (genreId, page = 1) => {
    return apiRequest(`/content/genre/${genreId}?page=${page}`);
  },

  // Get all genres
  getGenres: async () => {
    return apiRequest('/content/genres');
  },

  // Get seasons for a series
  getSeasons: async (contentId) => {
    return apiRequest(`/content/${contentId}/seasons`);
  },

  // Get episodes for a season
  getEpisodes: async (contentId, seasonNumber) => {
    return apiRequest(`/content/${contentId}/seasons/${seasonNumber}/episodes`);
  },

  // Rate content
  rateContent: async (contentId, rating) => {
    return apiRequest(`/content/${contentId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating })
    });
  },

  // Review content
  reviewContent: async (contentId, reviewData) => {
    return apiRequest(`/content/${contentId}/review`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  },

  // Get reviews
  getReviews: async (contentId, page = 1) => {
    return apiRequest(`/content/${contentId}/reviews?page=${page}`);
  }
};

// Stream API
export const streamApi = {
  // Get stream URL
  getStreamUrl: async (videoId) => {
    return apiRequest(`/stream/${videoId}`);
  },

  // Get available qualities
  getQualities: async (videoId) => {
    return apiRequest(`/stream/${videoId}/qualities`);
  },

  // Get subtitles
  getSubtitles: async (videoId) => {
    return apiRequest(`/stream/${videoId}/subtitles`);
  },

  // Report playback progress
  reportProgress: async (videoId, progress, duration) => {
    return apiRequest(`/stream/${videoId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ progress, duration })
    });
  }
};

// Subscription API
export const subscriptionApi = {
  // Get subscription status
  getStatus: async () => {
    return apiRequest('/subscription/status');
  },

  // Get available plans
  getPlans: async () => {
    return apiRequest('/subscription/plans');
  },

  // Subscribe to plan
  subscribe: async (planId, paymentMethodId) => {
    return apiRequest('/subscription/subscribe', {
      method: 'POST',
      body: JSON.stringify({ planId, paymentMethodId })
    });
  },

  // Cancel subscription
  cancel: async () => {
    return apiRequest('/subscription/cancel', {
      method: 'POST'
    });
  },

  // Update payment method
  updatePaymentMethod: async (paymentMethodId) => {
    return apiRequest('/subscription/payment-method', {
      method: 'PATCH',
      body: JSON.stringify({ paymentMethodId })
    });
  },

  // Get billing history
  getBillingHistory: async () => {
    return apiRequest('/subscription/billing-history');
  }
};

// Search API
export const searchApi = {
  // Search all content
  search: async (query, page = 1, filters = {}) => {
    const params = new URLSearchParams({ q: query, page, ...filters });
    return apiRequest(`/search?${params}`);
  },

  // Get search suggestions
  getSuggestions: async (query) => {
    return apiRequest(`/search/suggestions?q=${encodeURIComponent(query)}`);
  },

  // Get trending searches
  getTrending: async () => {
    return apiRequest('/search/trending');
  }
};

// Admin API
export const adminApi = {
  // Dashboard stats
  getStats: async () => {
    return apiRequest('/admin/stats');
  },

  // Get detailed analytics
  getAnalytics: async (period = '7d') => {
    return apiRequest(`/admin/analytics?period=${period}`);
  },

  // Content management
  getContent: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    return apiRequest(`/admin/content?${queryParams}`);
  },

  createContent: async (contentData) => {
    return apiRequest('/admin/content', {
      method: 'POST',
      body: JSON.stringify(contentData)
    });
  },

  updateContent: async (id, contentData) => {
    return apiRequest(`/admin/content/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(contentData)
    });
  },

  deleteContent: async (id) => {
    return apiRequest(`/admin/content/${id}`, {
      method: 'DELETE'
    });
  },

  // Sync from TMDB
  syncFromTmdb: async (tmdbId, type = 'MOVIE') => {
    return apiRequest(`/admin/sync-tmdb/${tmdbId}`, {
      method: 'POST',
      body: JSON.stringify({ type })
    });
  },

  // User management
  getUsers: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    return apiRequest(`/admin/users?${queryParams}`);
  },

  updateUser: async (userId, data) => {
    return apiRequest(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  // Upload video
  uploadVideo: async (contentId, formData) => {
    const token = localStorage.getItem('moovie-token');
    const response = await fetch(`${API_BASE}/admin/content/${contentId}/video`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    return response.json();
  },

  // Get video status
  getVideoStatus: async (videoId) => {
    return apiRequest(`/admin/videos/${videoId}/status`);
  },

  // Genre management
  createGenre: async (genreData) => {
    return apiRequest('/admin/genres', {
      method: 'POST',
      body: JSON.stringify(genreData)
    });
  },

  // Get system health
  getHealth: async () => {
    const response = await fetch(`${API_BASE.replace('/api', '')}/health`);
    return response.json();
  },

  // Delete user
  deleteUser: async (userId) => {
    return apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE'
    });
  },

  // Get settings
  getSettings: async () => {
    return apiRequest('/admin/settings');
  },

  // Update settings (secrets are write-only)
  updateSettings: async (settings) => {
    return apiRequest('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings)
    });
  },

  // Send notification to user
  sendNotification: async (userId, notification) => {
    return apiRequest(`/admin/users/${userId}/notify`, {
      method: 'POST',
      body: JSON.stringify(notification)
    });
  },

  // Bulk actions
  bulkDeleteContent: async (ids) => {
    return apiRequest('/admin/content/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids })
    });
  },

  bulkUpdateUsers: async (ids, data) => {
    return apiRequest('/admin/users/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ ids, data })
    });
  },

  // Get audit logs
  getAuditLogs: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    return apiRequest(`/admin/audit-logs?${queryParams}`);
  }
};

// Notifications API
export const notificationsApi = {
  // Get notifications
  getNotifications: async (page = 1, limit = 20) => {
    return apiRequest(`/users/notifications?page=${page}&limit=${limit}`);
  },

  // Mark as read
  markAsRead: async (notificationId) => {
    return apiRequest(`/users/notifications/${notificationId}/read`, {
      method: 'POST'
    });
  },

  // Mark all as read
  markAllAsRead: async () => {
    return apiRequest('/users/notifications/read-all', {
      method: 'POST'
    });
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    return apiRequest(`/users/notifications/${notificationId}`, {
      method: 'DELETE'
    });
  }
};

// Analytics helper for frontend
export const analyticsHelper = {
  // Track page view
  trackPageView: async (page) => {
    try {
      await apiRequest('/analytics/pageview', {
        method: 'POST',
        body: JSON.stringify({ page, timestamp: new Date().toISOString() })
      });
    } catch (e) {
      // Silently fail analytics
    }
  },

  // Track event
  trackEvent: async (event, data = {}) => {
    try {
      await apiRequest('/analytics/event', {
        method: 'POST',
        body: JSON.stringify({ event, data, timestamp: new Date().toISOString() })
      });
    } catch (e) {
      // Silently fail analytics
    }
  },

  // Track video play
  trackVideoPlay: async (contentId, videoId) => {
    try {
      await apiRequest('/analytics/video-play', {
        method: 'POST',
        body: JSON.stringify({ contentId, videoId, timestamp: new Date().toISOString() })
      });
    } catch (e) {
      // Silently fail analytics
    }
  }
};

export default {
  authApi,
  userApi,
  contentApi,
  streamApi,
  subscriptionApi,
  searchApi,
  adminApi,
  notificationsApi,
  analyticsHelper
};
