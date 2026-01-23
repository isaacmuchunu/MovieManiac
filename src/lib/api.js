const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE;
    this.accessToken = null;
  }

  setToken(token) {
    this.accessToken = token;
  }

  getToken() {
    return this.accessToken || localStorage.getItem('accessToken');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      // Handle token refresh
      if (response.status === 401) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          headers.Authorization = `Bearer ${this.getToken()}`;
          return fetch(url, { ...options, headers, credentials: 'include' });
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async refreshToken() {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data?.tokens?.accessToken) {
          this.setToken(data.data.tokens.accessToken);
          localStorage.setItem('accessToken', data.data.tokens.accessToken);
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  // Auth
  async register(email, password, name) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.data?.tokens?.accessToken) {
      this.setToken(response.data.tokens.accessToken);
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
    }
    return response;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.setToken(null);
    localStorage.removeItem('accessToken');
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async verifyEmail(email, code) {
    const response = await this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
    if (response.data?.tokens?.accessToken) {
      this.setToken(response.data.tokens.accessToken);
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
    }
    return response;
  }

  async resendVerification(email) {
    return this.request('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Content
  async getContent(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/content?${query}`);
  }

  async getContentById(id) {
    return this.request(`/content/${id}`);
  }

  async getFeatured() {
    return this.request('/content/featured');
  }

  async getCategory(category, limit = 20) {
    return this.request(`/content/category/${category}?limit=${limit}`);
  }

  // Streaming
  async getStreamInfo(videoId) {
    return this.request(`/stream/${videoId}`);
  }

  async updateProgress(videoId, progress, duration, profileId) {
    return this.request(`/stream/${videoId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ progress, duration, profileId }),
    });
  }

  async getContinueWatching(profileId) {
    return this.request(`/stream/continue-watching?profileId=${profileId || ''}`);
  }

  // User
  async getWatchlist(profileId) {
    return this.request(`/content/user/watchlist?profileId=${profileId || ''}`);
  }

  async addToWatchlist(contentId, profileId) {
    return this.request(`/content/${contentId}/watchlist`, {
      method: 'POST',
      body: JSON.stringify({ profileId }),
    });
  }

  async removeFromWatchlist(contentId) {
    return this.request(`/content/${contentId}/watchlist`, {
      method: 'DELETE',
    });
  }

  async rateContent(contentId, rating) {
    return this.request(`/content/${contentId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
    });
  }

  // Profiles
  async getProfiles() {
    return this.request('/users/profiles');
  }

  async createProfile(name, avatarUrl, isKids) {
    return this.request('/users/profiles', {
      method: 'POST',
      body: JSON.stringify({ name, avatarUrl, isKids }),
    });
  }

  // Search
  async search(query, params = {}) {
    const queryParams = new URLSearchParams({ q: query, ...params }).toString();
    return this.request(`/search?${queryParams}`);
  }

  async getSuggestions(query) {
    return this.request(`/search/suggestions?q=${encodeURIComponent(query)}`);
  }

  // Subscription
  async getSubscription() {
    return this.request('/subscription/current');
  }

  async createCheckout(plan) {
    return this.request('/subscription/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });
  }
}

const api = new ApiClient();

// Add structured auth methods for backward compatibility with components expecting api.auth
api.auth = {
  register: (email, password, name) => api.register(email, password, name),
  login: (email, password) => api.login(email, password),
  logout: () => api.logout(),
  getMe: () => api.getMe(),
  verifyEmail: (email, code) => api.verifyEmail(email, code),
  resendVerification: (email) => api.resendVerification(email),
};

export default api;
export { api };
