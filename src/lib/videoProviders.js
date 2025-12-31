// Video Provider Service - Multi-server streaming support
// Aggregates multiple embed sources for movies and TV shows

const TMDB_API_KEY = '617c0260598c225e728db47b98d5ea6f';

// Server configurations with embed URL generators
export const videoServers = [
  {
    id: 'vidsrc',
    name: 'VidSrc',
    logo: '🎬',
    quality: 'HD',
    getMovieUrl: (tmdbId) => `https://vidsrc.xyz/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidsrc.xyz/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vidsrc-me',
    name: 'VidSrc Pro',
    logo: '🎥',
    quality: 'HD',
    getMovieUrl: (tmdbId) => `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`,
  },
  {
    id: 'vidsrc-to',
    name: 'VidSrc TV',
    logo: '📺',
    quality: 'HD',
    getMovieUrl: (tmdbId) => `https://vidsrc.to/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'embedsu',
    name: 'EmbedSu',
    logo: '🌐',
    quality: 'HD',
    getMovieUrl: (tmdbId) => `https://embed.su/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'multiembed',
    name: 'MultiEmbed',
    logo: '🔗',
    quality: 'HD',
    getMovieUrl: (tmdbId) => `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`,
    getTvUrl: (tmdbId, season, episode) => `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`,
  },
  {
    id: 'autoembed',
    name: 'AutoEmbed',
    logo: '⚡',
    quality: 'HD',
    getMovieUrl: (tmdbId) => `https://autoembed.co/movie/tmdb/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`,
  },
  {
    id: '2embed',
    name: '2Embed',
    logo: '🎞️',
    quality: 'HD',
    getMovieUrl: (tmdbId) => `https://www.2embed.cc/embed/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`,
  },
  {
    id: 'smashystream',
    name: 'SmashyStream',
    logo: '💥',
    quality: 'FHD',
    getMovieUrl: (tmdbId) => `https://player.smashy.stream/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://player.smashy.stream/tv/${tmdbId}?s=${season}&e=${episode}`,
  },
  {
    id: 'moviesapi',
    name: 'MoviesAPI',
    logo: '🍿',
    quality: 'HD',
    getMovieUrl: (tmdbId) => `https://moviesapi.club/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://moviesapi.club/tv/${tmdbId}-${season}-${episode}`,
  },
  {
    id: 'filmxy',
    name: 'FilmXY',
    logo: '📽️',
    quality: 'HD',
    getMovieUrl: (tmdbId) => `https://filmxy.vip/embed/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://filmxy.vip/embed/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'superembed',
    name: 'SuperEmbed',
    logo: '🚀',
    quality: 'HD',
    getMovieUrl: (tmdbId) => `https://superembed.stream/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://superembed.stream/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'nontongo',
    name: 'NontonGo',
    logo: '🎭',
    quality: 'HD',
    getMovieUrl: (tmdbId) => `https://nontongo.win/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://nontongo.win/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'movie-api',
    name: 'MovieAPI',
    logo: '🎦',
    quality: 'HD',
    getMovieUrl: (tmdbId) => `https://movieapi.club/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://movieapi.club/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'frembed',
    name: 'Frembed',
    logo: '🌟',
    quality: 'FHD',
    getMovieUrl: (tmdbId) => `https://frembed.pro/api/film.php?id=${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://frembed.pro/api/serie.php?id=${tmdbId}&sa=${season}&epi=${episode}`,
  },
];

// Get video URL for a movie
export const getMovieStreamUrl = (tmdbId, serverId = 'vidsrc') => {
  const server = videoServers.find(s => s.id === serverId) || videoServers[0];
  return server.getMovieUrl(tmdbId);
};

// Get video URL for a TV episode
export const getTvStreamUrl = (tmdbId, season, episode, serverId = 'vidsrc') => {
  const server = videoServers.find(s => s.id === serverId) || videoServers[0];
  return server.getTvUrl(tmdbId, season, episode);
};

// TMDB API functions for real data
export const tmdbApi = {
  baseUrl: 'https://api.themoviedb.org/3',
  imageBase: 'https://image.tmdb.org/t/p',

  // Fetch trending movies
  getTrending: async (timeWindow = 'week', page = 1) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/all/${timeWindow}?api_key=${TMDB_API_KEY}&page=${page}`
    );
    return res.json();
  },

  // Fetch popular movies
  getPopularMovies: async (page = 1) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
    );
    return res.json();
  },

  // Fetch top rated movies
  getTopRatedMovies: async (page = 1) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`
    );
    return res.json();
  },

  // Fetch upcoming movies
  getUpcomingMovies: async (page = 1) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}`
    );
    return res.json();
  },

  // Fetch now playing movies
  getNowPlayingMovies: async (page = 1) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&page=${page}`
    );
    return res.json();
  },

  // Fetch popular TV shows
  getPopularTvShows: async (page = 1) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`
    );
    return res.json();
  },

  // Fetch top rated TV shows
  getTopRatedTvShows: async (page = 1) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}&page=${page}`
    );
    return res.json();
  },

  // Fetch TV shows airing today
  getAiringTodayTvShows: async (page = 1) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/airing_today?api_key=${TMDB_API_KEY}&page=${page}`
    );
    return res.json();
  },

  // Fetch movie details
  getMovieDetails: async (movieId) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,similar,recommendations,external_ids`
    );
    return res.json();
  },

  // Fetch TV show details
  getTvDetails: async (tvId) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${tvId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,similar,recommendations,external_ids`
    );
    return res.json();
  },

  // Fetch TV season details
  getTvSeasonDetails: async (tvId, seasonNumber) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`
    );
    return res.json();
  },

  // Fetch TV episode details
  getTvEpisodeDetails: async (tvId, seasonNumber, episodeNumber) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${TMDB_API_KEY}`
    );
    return res.json();
  },

  // Search multi (movies, TV, people)
  searchMulti: async (query, page = 1) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    return res.json();
  },

  // Search movies
  searchMovies: async (query, page = 1) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    return res.json();
  },

  // Search TV shows
  searchTvShows: async (query, page = 1) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    return res.json();
  },

  // Discover movies with filters
  discoverMovies: async (params = {}) => {
    const queryParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      ...params
    });
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?${queryParams}`
    );
    return res.json();
  },

  // Discover TV shows with filters
  discoverTvShows: async (params = {}) => {
    const queryParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      ...params
    });
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/tv?${queryParams}`
    );
    return res.json();
  },

  // Get all genres
  getGenres: async (type = 'movie') => {
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/${type}/list?api_key=${TMDB_API_KEY}`
    );
    return res.json();
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId, page = 1) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
    );
    return res.json();
  },

  // Get TV shows by genre
  getTvShowsByGenre: async (genreId, page = 1) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
    );
    return res.json();
  },

  // Get person details
  getPersonDetails: async (personId) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/person/${personId}?api_key=${TMDB_API_KEY}&append_to_response=combined_credits,external_ids,images`
    );
    return res.json();
  },

  // Get movie watch providers
  getMovieWatchProviders: async (movieId) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`
    );
    return res.json();
  },

  // Get TV watch providers
  getTvWatchProviders: async (tvId) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${tvId}/watch/providers?api_key=${TMDB_API_KEY}`
    );
    return res.json();
  },

  // Get collection details
  getCollectionDetails: async (collectionId) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/collection/${collectionId}?api_key=${TMDB_API_KEY}`
    );
    return res.json();
  },

  // Get image URL helper
  getImageUrl: (path, size = 'original') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },
};

// Helper to check if a server is available
export const checkServerAvailability = async (serverId, tmdbId) => {
  const server = videoServers.find(s => s.id === serverId);
  if (!server) return false;

  try {
    const url = server.getMovieUrl(tmdbId);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return true;
  } catch {
    return false;
  }
};

// Get next available server
export const getNextServer = (currentServerId) => {
  const currentIndex = videoServers.findIndex(s => s.id === currentServerId);
  const nextIndex = (currentIndex + 1) % videoServers.length;
  return videoServers[nextIndex];
};

export default {
  videoServers,
  getMovieStreamUrl,
  getTvStreamUrl,
  tmdbApi,
  checkServerAvailability,
  getNextServer
};
