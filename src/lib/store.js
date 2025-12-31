import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from './api';

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (email, password) => {
        const response = await api.login(email, password);
        set({ user: response.data.user, isAuthenticated: true });
        return response;
      },

      register: async (email, password, name) => {
        const response = await api.register(email, password, name);
        set({ user: response.data.user, isAuthenticated: true });
        return response;
      },

      logout: async () => {
        await api.logout();
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        try {
          const response = await api.getMe();
          set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Profile Store
export const useProfileStore = create(
  persist(
    (set) => ({
      currentProfile: null,
      profiles: [],

      setCurrentProfile: (profile) => set({ currentProfile: profile }),
      setProfiles: (profiles) => set({ profiles }),

      loadProfiles: async () => {
        try {
          const response = await api.getProfiles();
          set({ profiles: response.data });
          return response.data;
        } catch {
          return [];
        }
      },
    }),
    {
      name: 'profile-storage',
    }
  )
);

// Player Store
export const usePlayerStore = create((set) => ({
  isPlaying: false,
  currentVideo: null,
  currentContent: null,
  progress: 0,
  volume: 1,
  isMuted: false,
  quality: 'AUTO',
  isFullscreen: false,

  setCurrentVideo: (video, content) => set({ currentVideo: video, currentContent: content }),
  setProgress: (progress) => set({ progress }),
  setVolume: (volume) => set({ volume }),
  setMuted: (isMuted) => set({ isMuted }),
  setQuality: (quality) => set({ quality }),
  setFullscreen: (isFullscreen) => set({ isFullscreen }),
  setPlaying: (isPlaying) => set({ isPlaying }),

  reset: () => set({
    isPlaying: false,
    currentVideo: null,
    currentContent: null,
    progress: 0,
  }),
}));

// Watchlist Store
export const useWatchlistStore = create((set, get) => ({
  items: [],
  isLoading: false,

  loadWatchlist: async (profileId) => {
    set({ isLoading: true });
    try {
      const response = await api.getWatchlist(profileId);
      set({ items: response.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (contentId, profileId) => {
    await api.addToWatchlist(contentId, profileId);
    await get().loadWatchlist(profileId);
  },

  removeItem: async (contentId, profileId) => {
    await api.removeFromWatchlist(contentId);
    set({ items: get().items.filter((item) => item.id !== contentId) });
  },

  isInWatchlist: (contentId) => {
    return get().items.some((item) => item.id === contentId);
  },
}));

// UI Store
export const useUIStore = create((set) => ({
  isModalOpen: false,
  modalContent: null,
  searchQuery: '',
  isSearchOpen: false,

  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
}));
