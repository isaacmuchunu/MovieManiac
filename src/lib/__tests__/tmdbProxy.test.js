import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { tmdbApi } from '../tmdbProxy';

describe('tmdbProxy', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('API Methods', () => {
    it('getTrending fetches trending content', async () => {
      const mockResponse = {
        results: [{ id: 1, title: 'Test Movie' }],
        page: 1,
        total_pages: 10,
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await tmdbApi.getTrending('week', 1);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/trending/week'),
        expect.objectContaining({
          credentials: 'include',
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('getPopularMovies fetches popular movies', async () => {
      const mockResponse = {
        results: [{ id: 1, title: 'Popular Movie' }],
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await tmdbApi.getPopularMovies(1);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/movie/popular'),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    it('getMovieDetails fetches movie details', async () => {
      const mockResponse = {
        id: 550,
        title: 'Fight Club',
        overview: 'Test overview',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await tmdbApi.getMovieDetails(550);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/movie/550'),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    it('searchMovies fetches search results', async () => {
      const mockResponse = {
        results: [{ id: 1, title: 'Searched Movie' }],
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await tmdbApi.searchMovies('test', 1);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/search/movie'),
        expect.any(Object)
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('query=test'),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    it('getTvDetails fetches TV show details', async () => {
      const mockResponse = {
        id: 1396,
        name: 'Breaking Bad',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await tmdbApi.getTvDetails(1396);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/tv/1396'),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    it('getGenres fetches genre list', async () => {
      const mockResponse = {
        genres: [
          { id: 28, name: 'Action' },
          { id: 12, name: 'Adventure' },
        ],
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await tmdbApi.getGenres('movie');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/genre/movie/list'),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error Handling', () => {
    it('throws error on non-ok response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(tmdbApi.getMovieDetails(999999)).rejects.toThrow('API error: 404');
    });

    it('throws error on network failure', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(tmdbApi.getPopularMovies()).rejects.toThrow('Network error');
    });
  });

  describe('Image URL Helper', () => {
    it('generates correct image URL', () => {
      const path = '/abc123.jpg';
      const url = tmdbApi.getImageUrl(path, 'w500');

      expect(url).toBe('https://image.tmdb.org/t/p/w500/abc123.jpg');
    });

    it('returns null for empty path', () => {
      expect(tmdbApi.getImageUrl(null)).toBeNull();
      expect(tmdbApi.getImageUrl('')).toBeNull();
      expect(tmdbApi.getImageUrl(undefined)).toBeNull();
    });

    it('uses original size by default', () => {
      const url = tmdbApi.getImageUrl('/abc123.jpg');

      expect(url).toBe('https://image.tmdb.org/t/p/original/abc123.jpg');
    });
  });
});
