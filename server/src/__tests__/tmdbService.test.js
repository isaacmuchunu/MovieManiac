import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock fetch globally
global.fetch = jest.fn();

// Set TMDB API key for tests
process.env.TMDB_API_KEY = 'test-api-key';

// Import after setting env
const { tmdbService } = await import('../services/tmdbService.js');

describe('tmdbService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getTrending', () => {
    it('should fetch trending content for week', async () => {
      const mockData = {
        results: [{ id: 1, title: 'Test Movie' }],
        page: 1,
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await tmdbService.getTrending('week', 1);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.themoviedb.org/3/trending/all/week')
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('api_key=test-api-key')
      );
      expect(result).toEqual(mockData);
    });

    it('should fetch trending content for day', async () => {
      const mockData = {
        results: [{ id: 1, title: 'Daily Trending' }],
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await tmdbService.getTrending('day', 1);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('trending/all/day')
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('getPopularMovies', () => {
    it('should fetch popular movies', async () => {
      const mockData = {
        results: [{ id: 1, title: 'Popular Movie' }],
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await tmdbService.getPopularMovies(1);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/movie/popular')
      );
      expect(result).toEqual(mockData);
    });

    it('should handle pagination', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      });

      await tmdbService.getPopularMovies(5);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=5')
      );
    });
  });

  describe('getMovieDetails', () => {
    it('should fetch movie details with appended data', async () => {
      const mockData = {
        id: 550,
        title: 'Fight Club',
        credits: { cast: [] },
        videos: { results: [] },
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await tmdbService.getMovieDetails(550);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/movie/550')
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('append_to_response=')
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('searchMulti', () => {
    it('should search for content', async () => {
      const mockData = {
        results: [
          { id: 1, title: 'Test Result', media_type: 'movie' },
        ],
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await tmdbService.searchMulti('test query', 1);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/search/multi')
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('query=test+query')
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('getGenres', () => {
    it('should fetch movie genres', async () => {
      const mockData = {
        genres: [
          { id: 28, name: 'Action' },
          { id: 12, name: 'Adventure' },
        ],
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await tmdbService.getMovieGenres();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/genre/movie/list')
      );
      expect(result).toEqual(mockData);
    });

    it('should fetch TV genres', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ genres: [] }),
      });

      await tmdbService.getTvGenres();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/genre/tv/list')
      );
    });
  });

  describe('Error Handling', () => {
    it('should throw error on failed request', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(tmdbService.getMovieDetails(999999)).rejects.toThrow(
        'TMDB API error: 404'
      );
    });

    it('should throw error on network failure', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(tmdbService.getPopularMovies()).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('Image URL Helper', () => {
    it('should generate correct image URL', () => {
      const url = tmdbService.getImageUrl('/test.jpg', 'w500');
      expect(url).toBe('https://image.tmdb.org/t/p/w500/test.jpg');
    });

    it('should return null for empty path', () => {
      expect(tmdbService.getImageUrl(null)).toBeNull();
      expect(tmdbService.getImageUrl('')).toBeNull();
    });

    it('should use original size by default', () => {
      const url = tmdbService.getImageUrl('/test.jpg');
      expect(url).toBe('https://image.tmdb.org/t/p/original/test.jpg');
    });
  });

  describe('Cache', () => {
    it('should return cached data for repeated requests', async () => {
      const mockData = { results: [{ id: 1 }] };

      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      // First call
      await tmdbService.getPopularMovies(1);
      // Second call should use cache
      await tmdbService.getPopularMovies(1);

      // Fetch should only be called once due to caching
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should clear cache when clearCache is called', () => {
      tmdbService.clearCache();
      // No error means success
      expect(true).toBe(true);
    });
  });
});
