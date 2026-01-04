import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore, useProfileStore, usePlayerStore, useWatchlistStore, useUIStore } from '../store';

// Mock the API and errorReporting
vi.mock('../api', () => ({
  default: {
    auth: {
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      me: vi.fn()
    },
    profiles: {
      list: vi.fn()
    },
    content: {
      getWatchlist: vi.fn()
    }
  }
}));

vi.mock('../errorReporting', () => ({
  errorReporting: {
    captureError: vi.fn()
  },
  ErrorCategory: {
    AUTH: 'auth'
  }
}));

describe('Auth Store', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true
    });
  });

  it('should have initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should set auth correctly', () => {
    const { setAuth } = useAuthStore.getState();
    const user = { id: '123', name: 'Test User' };
    const token = 'test-token';

    setAuth(user, token);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.accessToken).toBe(token);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('should logout correctly', () => {
    const { setAuth, logout } = useAuthStore.getState();
    setAuth({ id: '123' }, 'token');

    logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should set user correctly', () => {
    const { setUser } = useAuthStore.getState();
    const user = { id: '123', name: 'Updated User' };

    setUser(user);

    expect(useAuthStore.getState().user).toEqual(user);
  });
});

describe('Profile Store', () => {
  beforeEach(() => {
    useProfileStore.setState({
      currentProfile: null,
      profiles: []
    });
  });

  it('should have initial state', () => {
    const state = useProfileStore.getState();
    expect(state.currentProfile).toBeNull();
    expect(state.profiles).toEqual([]);
  });

  it('should set current profile', () => {
    const { setCurrentProfile } = useProfileStore.getState();
    const profile = { id: '1', name: 'Test Profile' };

    setCurrentProfile(profile);

    expect(useProfileStore.getState().currentProfile).toEqual(profile);
  });

  it('should add profile', () => {
    const { addProfile } = useProfileStore.getState();
    const profile = { id: '1', name: 'New Profile' };

    addProfile(profile);

    expect(useProfileStore.getState().profiles).toContainEqual(profile);
  });

  it('should remove profile', () => {
    const { setProfiles, removeProfile } = useProfileStore.getState();
    const profiles = [
      { id: '1', name: 'Profile 1' },
      { id: '2', name: 'Profile 2' }
    ];
    setProfiles(profiles);

    removeProfile('1');

    expect(useProfileStore.getState().profiles).toHaveLength(1);
    expect(useProfileStore.getState().profiles[0].id).toBe('2');
  });

  it('should update profile', () => {
    const { setProfiles, updateProfile } = useProfileStore.getState();
    setProfiles([{ id: '1', name: 'Old Name' }]);

    updateProfile('1', { name: 'New Name' });

    expect(useProfileStore.getState().profiles[0].name).toBe('New Name');
  });
});

describe('Player Store', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      isPlaying: false,
      currentVideo: null,
      currentContent: null,
      progress: 0,
      volume: 1,
      isMuted: false,
      quality: 'AUTO',
      isFullscreen: false
    });
  });

  it('should have initial state', () => {
    const state = usePlayerStore.getState();
    expect(state.isPlaying).toBe(false);
    expect(state.progress).toBe(0);
    expect(state.volume).toBe(1);
    expect(state.quality).toBe('AUTO');
  });

  it('should set current video', () => {
    const { setCurrentVideo } = usePlayerStore.getState();
    const video = { id: 'v1' };
    const content = { id: 'c1', title: 'Test' };

    setCurrentVideo(video, content);

    const state = usePlayerStore.getState();
    expect(state.currentVideo).toEqual(video);
    expect(state.currentContent).toEqual(content);
  });

  it('should set progress', () => {
    const { setProgress } = usePlayerStore.getState();
    setProgress(50);
    expect(usePlayerStore.getState().progress).toBe(50);
  });

  it('should set volume', () => {
    const { setVolume } = usePlayerStore.getState();
    setVolume(0.5);
    expect(usePlayerStore.getState().volume).toBe(0.5);
  });

  it('should toggle mute', () => {
    const { setMuted } = usePlayerStore.getState();
    setMuted(true);
    expect(usePlayerStore.getState().isMuted).toBe(true);
  });

  it('should reset player state', () => {
    const { setCurrentVideo, setProgress, reset } = usePlayerStore.getState();
    setCurrentVideo({ id: 'v1' }, { id: 'c1' });
    setProgress(75);

    reset();

    const state = usePlayerStore.getState();
    expect(state.currentVideo).toBeNull();
    expect(state.progress).toBe(0);
    expect(state.isPlaying).toBe(false);
  });
});

describe('UI Store', () => {
  beforeEach(() => {
    useUIStore.setState({
      isModalOpen: false,
      modalContent: null,
      searchQuery: '',
      isSearchOpen: false
    });
  });

  it('should have initial state', () => {
    const state = useUIStore.getState();
    expect(state.isModalOpen).toBe(false);
    expect(state.modalContent).toBeNull();
    expect(state.searchQuery).toBe('');
    expect(state.isSearchOpen).toBe(false);
  });

  it('should open modal', () => {
    const { openModal } = useUIStore.getState();
    const content = { type: 'movie', id: '123' };

    openModal(content);

    const state = useUIStore.getState();
    expect(state.isModalOpen).toBe(true);
    expect(state.modalContent).toEqual(content);
  });

  it('should close modal', () => {
    const { openModal, closeModal } = useUIStore.getState();
    openModal({ type: 'test' });

    closeModal();

    const state = useUIStore.getState();
    expect(state.isModalOpen).toBe(false);
    expect(state.modalContent).toBeNull();
  });

  it('should set search query', () => {
    const { setSearchQuery } = useUIStore.getState();
    setSearchQuery('test query');
    expect(useUIStore.getState().searchQuery).toBe('test query');
  });

  it('should toggle search open', () => {
    const { setSearchOpen } = useUIStore.getState();
    setSearchOpen(true);
    expect(useUIStore.getState().isSearchOpen).toBe(true);
  });
});
