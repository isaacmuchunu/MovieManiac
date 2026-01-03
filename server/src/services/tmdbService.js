// TMDB API Service - Backend proxy for secure API access
// This service handles all TMDB API calls server-side to keep the API key secure

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Cache for frequently accessed data (simple in-memory cache)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCached = (key) => {
  const item = cache.get(key);
  if (item && Date.now() - item.timestamp < CACHE_TTL) {
    return item.data;
  }
  cache.delete(key);
  return null;
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Helper function to make TMDB API requests
const tmdbFetch = async (endpoint, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', TMDB_API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  const cacheKey = url.toString();
  const cached = getCached(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const error = new Error(`TMDB API error: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  setCache(cacheKey, data);
  return data;
};

export const tmdbService = {
  // Trending
  getTrending: (timeWindow = 'week', page = 1) =>
    tmdbFetch(`/trending/all/${timeWindow}`, { page }),

  getTrendingMovies: (timeWindow = 'week', page = 1) =>
    tmdbFetch(`/trending/movie/${timeWindow}`, { page }),

  getTrendingTv: (timeWindow = 'week', page = 1) =>
    tmdbFetch(`/trending/tv/${timeWindow}`, { page }),

  // Movies
  getPopularMovies: (page = 1) =>
    tmdbFetch('/movie/popular', { page }),

  getTopRatedMovies: (page = 1) =>
    tmdbFetch('/movie/top_rated', { page }),

  getUpcomingMovies: (page = 1) =>
    tmdbFetch('/movie/upcoming', { page }),

  getNowPlayingMovies: (page = 1) =>
    tmdbFetch('/movie/now_playing', { page }),

  getMovieDetails: (movieId) =>
    tmdbFetch(`/movie/${movieId}`, {
      append_to_response: 'credits,videos,similar,recommendations,external_ids,reviews,keywords'
    }),

  getMovieCredits: (movieId) =>
    tmdbFetch(`/movie/${movieId}/credits`),

  getMovieVideos: (movieId) =>
    tmdbFetch(`/movie/${movieId}/videos`),

  getMovieWatchProviders: (movieId) =>
    tmdbFetch(`/movie/${movieId}/watch/providers`),

  getMovieImages: (movieId) =>
    tmdbFetch(`/movie/${movieId}/images`),

  getMovieExternalIds: (movieId) =>
    tmdbFetch(`/movie/${movieId}/external_ids`),

  // TV Shows
  getPopularTvShows: (page = 1) =>
    tmdbFetch('/tv/popular', { page }),

  getTopRatedTvShows: (page = 1) =>
    tmdbFetch('/tv/top_rated', { page }),

  getAiringTodayTvShows: (page = 1) =>
    tmdbFetch('/tv/airing_today', { page }),

  getOnTheAirTvShows: (page = 1) =>
    tmdbFetch('/tv/on_the_air', { page }),

  getTvDetails: (tvId) =>
    tmdbFetch(`/tv/${tvId}`, {
      append_to_response: 'credits,videos,similar,recommendations,external_ids,reviews,keywords,content_ratings'
    }),

  getTvSeasonDetails: (tvId, seasonNumber) =>
    tmdbFetch(`/tv/${tvId}/season/${seasonNumber}`),

  getTvEpisodeDetails: (tvId, seasonNumber, episodeNumber) =>
    tmdbFetch(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`, {
      append_to_response: 'credits,videos'
    }),

  getTvWatchProviders: (tvId) =>
    tmdbFetch(`/tv/${tvId}/watch/providers`),

  getTvImages: (tvId) =>
    tmdbFetch(`/tv/${tvId}/images`),

  getTvExternalIds: (tvId) =>
    tmdbFetch(`/tv/${tvId}/external_ids`),

  // Search
  searchMulti: (query, page = 1) =>
    tmdbFetch('/search/multi', { query, page }),

  searchMovies: (query, page = 1) =>
    tmdbFetch('/search/movie', { query, page }),

  searchTvShows: (query, page = 1) =>
    tmdbFetch('/search/tv', { query, page }),

  searchPerson: (query, page = 1) =>
    tmdbFetch('/search/person', { query, page }),

  // Discover
  discoverMovies: (params = {}) =>
    tmdbFetch('/discover/movie', params),

  discoverTvShows: (params = {}) =>
    tmdbFetch('/discover/tv', params),

  discoverByGenre: (genreId, type = 'movie', page = 1) =>
    tmdbFetch(`/discover/${type}`, {
      with_genres: genreId,
      page,
      sort_by: 'popularity.desc'
    }),

  discoverByCountry: (countryCode, type = 'movie', page = 1) =>
    tmdbFetch(`/discover/${type}`, {
      with_origin_country: countryCode,
      page,
      sort_by: 'popularity.desc'
    }),

  // Genres
  getMovieGenres: () =>
    tmdbFetch('/genre/movie/list'),

  getTvGenres: () =>
    tmdbFetch('/genre/tv/list'),

  getGenres: (type = 'movie') =>
    tmdbFetch(`/genre/${type}/list`),

  getMoviesByGenre: (genreId, page = 1, sortBy = 'popularity.desc') =>
    tmdbFetch('/discover/movie', {
      with_genres: genreId,
      page,
      sort_by: sortBy
    }),

  getTvShowsByGenre: (genreId, page = 1, sortBy = 'popularity.desc') =>
    tmdbFetch('/discover/tv', {
      with_genres: genreId,
      page,
      sort_by: sortBy
    }),

  // Person
  getPersonDetails: (personId) =>
    tmdbFetch(`/person/${personId}`, {
      append_to_response: 'combined_credits,external_ids,images'
    }),

  // Collections
  getCollectionDetails: (collectionId) =>
    tmdbFetch(`/collection/${collectionId}`),

  // Configuration
  getConfiguration: () =>
    tmdbFetch('/configuration'),

  getCountries: () =>
    tmdbFetch('/configuration/countries'),

  getLanguages: () =>
    tmdbFetch('/configuration/languages'),

  // Image URL helper
  getImageUrl: (path, size = 'original') => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  // Clear cache (for admin/maintenance)
  clearCache: () => {
    cache.clear();
  }
};

export default tmdbService;
