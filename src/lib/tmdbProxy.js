// TMDB Proxy Client - Secure API access through backend
// All TMDB API calls are routed through the backend to keep the API key secure

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const TMDB_PROXY_URL = `${API_BASE_URL}/api/tmdb`;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// TMDB API configuration - all requests go through backend proxy
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to make API requests with fallback
const fetchFromProxy = async (endpoint, params = {}) => {
  // Try the backend proxy first
  const proxyUrl = new URL(`${TMDB_PROXY_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      proxyUrl.searchParams.set(key, value);
    }
  });

  try {
    const response = await fetch(proxyUrl.toString(), {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend proxy error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Backend proxy failed:', error.message);
    throw new Error('Unable to fetch movie data. Please ensure the backend is running.');
  }
};

export const tmdbApi = {
  baseUrl: TMDB_PROXY_URL,
  imageBase: IMAGE_BASE_URL,

  // Trending
  getTrending: (timeWindow = 'week', page = 1) =>
    fetchFromProxy(`/trending/${timeWindow}`, { page }),

  getTrendingMovies: (timeWindow = 'week', page = 1) =>
    fetchFromProxy(`/trending/movie/${timeWindow}`, { page }),

  getTrendingTv: (timeWindow = 'week', page = 1) =>
    fetchFromProxy(`/trending/tv/${timeWindow}`, { page }),

  // Movies
  getPopularMovies: (page = 1) =>
    fetchFromProxy('/movie/popular', { page }),

  getTopRatedMovies: (page = 1) =>
    fetchFromProxy('/movie/top_rated', { page }),

  getUpcomingMovies: (page = 1) =>
    fetchFromProxy('/movie/upcoming', { page }),

  getNowPlayingMovies: (page = 1) =>
    fetchFromProxy('/movie/now_playing', { page }),

  getMovieDetails: (movieId) =>
    fetchFromProxy(`/movie/${movieId}`),

  getMovieCredits: (movieId) =>
    fetchFromProxy(`/movie/${movieId}/credits`),

  getMovieVideos: (movieId) =>
    fetchFromProxy(`/movie/${movieId}/videos`),

  getMovieWatchProviders: (movieId) =>
    fetchFromProxy(`/movie/${movieId}/watch/providers`),

  getMovieImages: (movieId) =>
    fetchFromProxy(`/movie/${movieId}/images`),

  getMovieExternalIds: (movieId) =>
    fetchFromProxy(`/movie/${movieId}/external_ids`),

  // TV Shows
  getPopularTvShows: (page = 1) =>
    fetchFromProxy('/tv/popular', { page }),

  getTopRatedTvShows: (page = 1) =>
    fetchFromProxy('/tv/top_rated', { page }),

  getAiringTodayTvShows: (page = 1) =>
    fetchFromProxy('/tv/airing_today', { page }),

  getOnTheAirTvShows: (page = 1) =>
    fetchFromProxy('/tv/on_the_air', { page }),

  getTvDetails: (tvId) =>
    fetchFromProxy(`/tv/${tvId}`),

  getTvSeasonDetails: (tvId, seasonNumber) =>
    fetchFromProxy(`/tv/${tvId}/season/${seasonNumber}`),

  getTvEpisodeDetails: (tvId, seasonNumber, episodeNumber) =>
    fetchFromProxy(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`),

  getTvWatchProviders: (tvId) =>
    fetchFromProxy(`/tv/${tvId}/watch/providers`),

  getTvImages: (tvId) =>
    fetchFromProxy(`/tv/${tvId}/images`),

  getTvExternalIds: (tvId) =>
    fetchFromProxy(`/tv/${tvId}/external_ids`),

  // Search
  searchMulti: (query, page = 1) =>
    fetchFromProxy('/search/multi', { query, page }),

  searchMovies: (query, page = 1) =>
    fetchFromProxy('/search/movie', { query, page }),

  searchTvShows: (query, page = 1) =>
    fetchFromProxy('/search/tv', { query, page }),

  searchPerson: (query, page = 1) =>
    fetchFromProxy('/search/person', { query, page }),

  // Discover
  discoverMovies: (params = {}) =>
    fetchFromProxy('/discover/movie', params),

  discoverTvShows: (params = {}) =>
    fetchFromProxy('/discover/tv', params),

  discoverByGenre: (genreId, type = 'movie', page = 1) =>
    fetchFromProxy(`/discover/${type}`, {
      with_genres: genreId,
      page,
      sort_by: 'popularity.desc'
    }),

  discoverByCountry: (countryCode, type = 'movie', page = 1) =>
    fetchFromProxy(`/discover/${type}`, {
      with_origin_country: countryCode,
      page,
      sort_by: 'popularity.desc'
    }),

  // Genres
  getGenres: (type = 'movie') =>
    fetchFromProxy(`/genre/${type}/list`),

  getMovieGenres: () =>
    fetchFromProxy('/genre/movie/list'),

  getTvGenres: () =>
    fetchFromProxy('/genre/tv/list'),

  getMoviesByGenre: (genreId, page = 1, sortBy = 'popularity.desc') =>
    fetchFromProxy('/discover/movie', {
      with_genres: genreId,
      page,
      sort_by: sortBy
    }),

  getTvShowsByGenre: (genreId, page = 1, sortBy = 'popularity.desc') =>
    fetchFromProxy('/discover/tv', {
      with_genres: genreId,
      page,
      sort_by: sortBy
    }),

  // Person
  getPersonDetails: (personId) =>
    fetchFromProxy(`/person/${personId}`),

  // Collections
  getCollectionDetails: (collectionId) =>
    fetchFromProxy(`/collection/${collectionId}`),

  // Configuration
  getConfiguration: () =>
    fetchFromProxy('/configuration'),

  getCountries: () =>
    fetchFromProxy('/configuration/countries'),

  getLanguages: () =>
    fetchFromProxy('/configuration/languages'),

  // Image URL helper
  getImageUrl: (path, size = 'original') => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },
};

export default tmdbApi;
