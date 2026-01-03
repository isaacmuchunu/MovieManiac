// Video Provider Service - Multi-server streaming support
// Aggregates 20+ embed sources for movies and TV shows
// TMDB API calls are now routed through the backend proxy for security

// Server configurations with embed URL generators
// Updated with more reliable and working video sources
export const videoServers = [
  // Primary Servers (Most Reliable - tested and working)
  {
    id: 'vidsrc-pro',
    name: 'VidSrc Pro',
    logo: '🎬',
    quality: 'HD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidsrc.pro/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidsrc.pro/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vidsrc-icu',
    name: 'VidSrc ICU',
    logo: '🎥',
    quality: 'HD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidsrc.icu/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidsrc.icu/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vidsrc-to',
    name: 'VidSrc TV',
    logo: '📺',
    quality: 'HD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidsrc.to/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'embedsu',
    name: 'EmbedSu',
    logo: '🌐',
    quality: 'FHD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://embed.su/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vidsrc-nl',
    name: 'VidSrc NL',
    logo: '🎯',
    quality: 'HD',
    region: 'Europe',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://player.vidsrc.nl/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://player.vidsrc.nl/embed/tv/${tmdbId}/${season}/${episode}`,
  },

  // High Quality Servers
  {
    id: 'vidsrc-cc',
    name: 'VidSrc CC',
    logo: '💎',
    quality: 'FHD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidsrc.cc/v2/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'smashystream',
    name: 'SmashyStream',
    logo: '💥',
    quality: 'FHD',
    region: 'Global',
    speed: 'medium',
    getMovieUrl: (tmdbId) => `https://player.smashy.stream/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://player.smashy.stream/tv/${tmdbId}?s=${season}&e=${episode}`,
  },
  {
    id: 'multiembed',
    name: 'MultiEmbed',
    logo: '🔗',
    quality: 'HD',
    region: 'Global',
    speed: 'medium',
    getMovieUrl: (tmdbId) => `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`,
    getTvUrl: (tmdbId, season, episode) => `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`,
  },
  {
    id: 'autoembed',
    name: 'AutoEmbed',
    logo: '⚡',
    quality: 'HD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://autoembed.co/movie/tmdb/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`,
  },
  {
    id: '2embed',
    name: '2Embed',
    logo: '🎞️',
    quality: 'HD',
    region: 'Global',
    speed: 'medium',
    getMovieUrl: (tmdbId) => `https://www.2embed.cc/embed/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`,
  },

  // Additional Reliable Servers
  {
    id: 'moviesapi',
    name: 'MoviesAPI',
    logo: '🍿',
    quality: 'HD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://moviesapi.club/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://moviesapi.club/tv/${tmdbId}-${season}-${episode}`,
  },
  {
    id: 'superembed',
    name: 'SuperEmbed',
    logo: '🚀',
    quality: 'HD',
    region: 'Global',
    speed: 'medium',
    getMovieUrl: (tmdbId) => `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`,
    getTvUrl: (tmdbId, season, episode) => `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`,
  },
];

// Get video URL for a movie
export const getMovieStreamUrl = (tmdbId, serverId = 'vidsrc-pro') => {
  const server = videoServers.find(s => s.id === serverId) || videoServers[0];
  return server.getMovieUrl(tmdbId);
};

// Get video URL for a TV episode
export const getTvStreamUrl = (tmdbId, season, episode, serverId = 'vidsrc-pro') => {
  const server = videoServers.find(s => s.id === serverId) || videoServers[0];
  return server.getTvUrl(tmdbId, season, episode);
};

// Filter servers by quality
export const getServersByQuality = (quality) => {
  return videoServers.filter(s => s.quality === quality);
};

// Filter servers by region
export const getServersByRegion = (region) => {
  return videoServers.filter(s => s.region === region || s.region === 'Global');
};

// Get fast servers
export const getFastServers = () => {
  return videoServers.filter(s => s.speed === 'fast');
};

// Re-export tmdbApi from the secure proxy for backward compatibility
// All TMDB API calls now go through the backend proxy
export { tmdbApi } from './tmdbProxy.js';

// Helper to check if a server is available
export const checkServerAvailability = async (serverId, tmdbId) => {
  const server = videoServers.find(s => s.id === serverId);
  if (!server) return false;

  try {
    const url = server.getMovieUrl(tmdbId);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    await fetch(url, {
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

// Get server by ID
export const getServerById = (serverId) => {
  return videoServers.find(s => s.id === serverId);
};

// Get random server from a quality tier
export const getRandomServer = (quality = null) => {
  const servers = quality ? getServersByQuality(quality) : videoServers;
  return servers[Math.floor(Math.random() * servers.length)];
};

export default {
  videoServers,
  getMovieStreamUrl,
  getTvStreamUrl,
  getServersByQuality,
  getServersByRegion,
  getFastServers,
  tmdbApi,
  checkServerAvailability,
  getNextServer,
  getServerById,
  getRandomServer
};
