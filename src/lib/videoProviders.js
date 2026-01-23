// Video Provider Service - Multi-server streaming support
// Aggregates 50+ embed sources for movies, TV shows, telenovelas, anime, and Asian drama
// TMDB API calls are now routed through the backend proxy for security

// Import tmdbApi from the secure proxy for backward compatibility
// All TMDB API calls now go through the backend proxy
import { tmdbApi } from './tmdbProxy.js';

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

  // VidSrc Variants - More Sources for Maximum Coverage
  {
    id: 'vidsrc-embed-ru',
    name: 'VidSrc Embed RU',
    logo: '🎬',
    quality: 'HD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidsrc-embed.ru/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidsrc-embed.ru/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vidsrc-embed-su',
    name: 'VidSrc Embed SU',
    logo: '📺',
    quality: 'HD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidsrc-embed.su/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidsrc-embed.su/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vidsrcme-su',
    name: 'VidSrc Me',
    logo: '🎥',
    quality: 'HD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidsrcme.su/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidsrcme.su/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vsrc-su',
    name: 'VSrc SU',
    logo: '🎞️',
    quality: 'HD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vsrc.su/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vsrc.su/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vidsrc-pk',
    name: 'VidSrc PK',
    logo: '🎯',
    quality: 'FHD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidsrc.pk/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidsrc.pk/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vidsrc-win',
    name: 'VidSrc Win',
    logo: '🏆',
    quality: 'HD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidsrc.win/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidsrc.win/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vidsrc-wtf',
    name: 'VidSrc WTF',
    logo: '⚡',
    quality: 'FHD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidsrc.wtf/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidsrc.wtf/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vidsrc-co',
    name: 'VidSrc CO',
    logo: '🌟',
    quality: 'HD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://player.vidsrc.co/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://player.vidsrc.co/embed/tv/${tmdbId}/${season}/${episode}`,
  },

  // Premium Embed APIs
  {
    id: 'vikingembed',
    name: 'VikingEmbed',
    logo: '⚓',
    quality: 'FHD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vembed.stream/play/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vembed.stream/play/${tmdbId}?s=${season}&e=${episode}`,
  },
  {
    id: 'godriveplayer',
    name: 'GoDrivePlayer',
    logo: '🚗',
    quality: 'FHD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://godriveplayer.com/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://godriveplayer.com/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'autoembed-cc',
    name: 'AutoEmbed CC',
    logo: '🎬',
    quality: 'FHD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://player.autoembed.cc/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://player.autoembed.cc/embed/tv/${tmdbId}/${season}-${episode}`,
  },
  {
    id: 'vidembed-site',
    name: 'VidEmbed',
    logo: '🎥',
    quality: 'FHD',
    region: 'Global',
    speed: 'medium',
    getMovieUrl: (tmdbId) => `https://vidembed.site/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidembed.site/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'nhdaapi',
    name: 'NHD API',
    logo: '🔥',
    quality: 'FHD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://nhdapi.xyz/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://nhdapi.xyz/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'embed-api-stream',
    name: 'Embed API',
    logo: '💎',
    quality: 'FHD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://embed-api.stream/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://embed-api.stream/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vidstream-site',
    name: 'VidStream Site',
    logo: '📺',
    quality: 'HD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidstream.site/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidstream.site/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vidstreams-net',
    name: 'VidStreams Net',
    logo: '🎞️',
    quality: 'HD',
    region: 'Global',
    speed: 'medium',
    getMovieUrl: (tmdbId) => `https://vidstreams.net/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidstreams.net/embed/tv/${tmdbId}/${season}/${episode}`,
  },

  // Asian Drama & Anime APIs (Great for Telenovela Content)
  {
    id: 'mostream',
    name: 'MoStream',
    logo: '🌏',
    quality: 'FHD',
    region: 'Asia',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://mostream.us/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://mostream.us/embed/tv/${tmdbId}/${season}/${episode}`,
  },

  // Telenovela & Spanish Content APIs
  {
    id: 'dramacool',
    name: 'DramaCool',
    logo: '🎭',
    quality: 'HD',
    region: 'Asia/LatAm',
    speed: 'medium',
    getMovieUrl: (tmdbId) => `https://vidstreams.net/embed/drama/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidstreams.net/embed/drama/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'gogoanime',
    name: 'GoGoAnime',
    logo: '🎬',
    quality: 'HD',
    region: 'Asia',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidstreams.net/embed/anime/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidstreams.net/embed/anime/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'zoro',
    name: 'Zoro',
    logo: '⚔️',
    quality: 'HD',
    region: 'Asia',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidstreams.net/embed/zoro/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidstreams.net/embed/zoro/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'hianime',
    name: 'HiAnime',
    logo: '🎌',
    quality: 'HD',
    region: 'Asia',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidstreams.net/embed/hianime/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidstreams.net/embed/hianime/${tmdbId}/${season}/${episode}`,
  },

  // More Video Hosting Providers
  {
    id: 'streamwish',
    name: 'StreamWish',
    logo: '💫',
    quality: 'HD',
    region: 'Global',
    speed: 'medium',
    getMovieUrl: (tmdbId) => `https://vidstreams.net/embed/streamwish/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidstreams.net/embed/streamwish/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'filelions',
    name: 'FileLions',
    logo: '🦁',
    quality: 'HD',
    region: 'Global',
    speed: 'medium',
    getMovieUrl: (tmdbId) => `https://vidstreams.net/embed/filelions/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidstreams.net/embed/filelions/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'streamtape',
    name: 'StreamTape',
    logo: '📼',
    quality: 'HD',
    region: 'Global',
    speed: 'medium',
    getMovieUrl: (tmdbId) => `https://vidstreams.net/embed/streamtape/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidstreams.net/embed/streamtape/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'voe',
    name: 'Voe',
    logo: '🎥',
    quality: 'HD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidstreams.net/embed/voe/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidstreams.net/embed/voe/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vidmoly',
    name: 'VidMoly',
    logo: '🎬',
    quality: 'HD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidstreams.net/embed/vidmoly/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidstreams.net/embed/vidmoly/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'doodstream',
    name: 'DoodStream',
    logo: '🎥',
    quality: 'HD',
    region: 'Global',
    speed: 'medium',
    getMovieUrl: (tmdbId) => `https://vidstreams.net/embed/doodstream/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidstreams.net/embed/doodstream/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'mixdrop',
    name: 'MixDrop',
    logo: '📦',
    quality: 'HD',
    region: 'Global',
    speed: 'medium',
    getMovieUrl: (tmdbId) => `https://vidstreams.net/embed/mixdrop/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidstreams.net/embed/mixdrop/${tmdbId}/${season}/${episode}`,
  },

  // Additional Servers
  {
    id: 'vidsrc-net',
    name: 'VidSrc Net',
    logo: '🌐',
    quality: 'HD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidsrc.net/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidsrc.net/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vidsrc-me',
    name: 'VidSrc Me',
    logo: '🎥',
    quality: 'HD',
    region: 'Global',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidsrc.me/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidsrc.me/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vidsrc-latino',
    name: 'VidSrc Latino',
    logo: '🎭',
    quality: 'HD',
    region: 'LatAm',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidsrc.lat/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidsrc.lat/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vidsrc-es',
    name: 'VidSrc ES',
    logo: '🇪🇸',
    quality: 'HD',
    region: 'Spain',
    speed: 'fast',
    getMovieUrl: (tmdbId) => `https://vidsrc.es/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidsrc.es/embed/tv/${tmdbId}/${season}/${episode}`,
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

// Re-export tmdbApi for consumers of this module
export { tmdbApi };

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
