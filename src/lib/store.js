import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from './api';
import { errorReporting, ErrorCategory } from './errorReporting';

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, accessToken) => {
        set({ user, accessToken, isAuthenticated: true, isLoading: false });
      },

      login: async (email, password) => {
        const response = await api.auth.login(email, password);
        set({ user: response.user, accessToken: response.accessToken, isAuthenticated: true });
        return response;
      },

      register: async (email, password, name) => {
        const response = await api.auth.register(email, password, name);
        set({ user: response.user, accessToken: response.accessToken, isAuthenticated: true });
        return response;
      },

      logout: () => {
        api.auth.logout().catch((err) => {
          // Log logout failures but don't block the UI logout
          errorReporting.captureError(err, { category: ErrorCategory.AUTH });
        });
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        try {
          const response = await api.auth.me();
          set({ user: response.user, isAuthenticated: true, isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Profile Store
export const useProfileStore = create(
  persist(
    (set, get) => ({
      currentProfile: null,
      profiles: [],

      setCurrentProfile: (profile) => set({ currentProfile: profile }),
      setProfiles: (profiles) => set({ profiles }),

      addProfile: (profile) => {
        const profiles = get().profiles;
        set({ profiles: [...profiles, profile] });
      },

      removeProfile: (id) => {
        const profiles = get().profiles.filter((p) => p.id !== id);
        const currentProfile = get().currentProfile;
        set({
          profiles,
          currentProfile: currentProfile?.id === id ? null : currentProfile,
        });
      },

      updateProfile: (id, updates) => {
        const profiles = get().profiles.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        );
        const currentProfile = get().currentProfile;
        set({
          profiles,
          currentProfile: currentProfile?.id === id ? { ...currentProfile, ...updates } : currentProfile,
        });
      },

      loadProfiles: async () => {
        try {
          const response = await api.profiles.list();
          set({ profiles: response });
          return response;
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
export const useWatchlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      loadWatchlist: async (profileId) => {
        set({ isLoading: true });
        try {
          const response = await api.content.getWatchlist();
          set({ items: response, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      addItem: (content) => {
        const items = get().items;
        if (!items.some((item) => item.id === content.id)) {
          set({ items: [...items, content] });
        }
      },

      removeItem: (contentId) => {
        set({ items: get().items.filter((item) => item.id !== contentId) });
      },

      isInWatchlist: (contentId) => {
        return get().items.some((item) => item.id === contentId);
      },

      clearWatchlist: () => set({ items: [] }),
    }),
    {
      name: 'watchlist-storage',
    }
  )
);

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
