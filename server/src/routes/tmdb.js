// TMDB Proxy Routes - Secure backend proxy for TMDB API
import express from 'express';
import { tmdbService } from '../services/tmdbService.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// ============= TRENDING =============
router.get('/trending/:timeWindow?', asyncHandler(async (req, res) => {
  const { timeWindow = 'week' } = req.params;
  const { page = 1 } = req.query;
  const data = await tmdbService.getTrending(timeWindow, page);
  res.json(data);
}));

router.get('/trending/movie/:timeWindow?', asyncHandler(async (req, res) => {
  const { timeWindow = 'week' } = req.params;
  const { page = 1 } = req.query;
  const data = await tmdbService.getTrendingMovies(timeWindow, page);
  res.json(data);
}));

router.get('/trending/tv/:timeWindow?', asyncHandler(async (req, res) => {
  const { timeWindow = 'week' } = req.params;
  const { page = 1 } = req.query;
  const data = await tmdbService.getTrendingTv(timeWindow, page);
  res.json(data);
}));

// ============= MOVIES =============
router.get('/movie/popular', asyncHandler(async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdbService.getPopularMovies(page);
  res.json(data);
}));

router.get('/movie/top_rated', asyncHandler(async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdbService.getTopRatedMovies(page);
  res.json(data);
}));

router.get('/movie/upcoming', asyncHandler(async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdbService.getUpcomingMovies(page);
  res.json(data);
}));

router.get('/movie/now_playing', asyncHandler(async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdbService.getNowPlayingMovies(page);
  res.json(data);
}));

router.get('/movie/:movieId', asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  if (!movieId || isNaN(movieId)) {
    throw new AppError('Invalid movie ID', 400);
  }
  const data = await tmdbService.getMovieDetails(movieId);
  res.json(data);
}));

router.get('/movie/:movieId/credits', asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const data = await tmdbService.getMovieCredits(movieId);
  res.json(data);
}));

router.get('/movie/:movieId/videos', asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const data = await tmdbService.getMovieVideos(movieId);
  res.json(data);
}));

router.get('/movie/:movieId/watch/providers', asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const data = await tmdbService.getMovieWatchProviders(movieId);
  res.json(data);
}));

router.get('/movie/:movieId/images', asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const data = await tmdbService.getMovieImages(movieId);
  res.json(data);
}));

router.get('/movie/:movieId/external_ids', asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const data = await tmdbService.getMovieExternalIds(movieId);
  res.json(data);
}));

// ============= TV SHOWS =============
router.get('/tv/popular', asyncHandler(async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdbService.getPopularTvShows(page);
  res.json(data);
}));

router.get('/tv/top_rated', asyncHandler(async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdbService.getTopRatedTvShows(page);
  res.json(data);
}));

router.get('/tv/airing_today', asyncHandler(async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdbService.getAiringTodayTvShows(page);
  res.json(data);
}));

router.get('/tv/on_the_air', asyncHandler(async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdbService.getOnTheAirTvShows(page);
  res.json(data);
}));

router.get('/tv/:tvId', asyncHandler(async (req, res) => {
  const { tvId } = req.params;
  if (!tvId || isNaN(tvId)) {
    throw new AppError('Invalid TV show ID', 400);
  }
  const data = await tmdbService.getTvDetails(tvId);
  res.json(data);
}));

router.get('/tv/:tvId/season/:seasonNumber', asyncHandler(async (req, res) => {
  const { tvId, seasonNumber } = req.params;
  const data = await tmdbService.getTvSeasonDetails(tvId, seasonNumber);
  res.json(data);
}));

router.get('/tv/:tvId/season/:seasonNumber/episode/:episodeNumber', asyncHandler(async (req, res) => {
  const { tvId, seasonNumber, episodeNumber } = req.params;
  const data = await tmdbService.getTvEpisodeDetails(tvId, seasonNumber, episodeNumber);
  res.json(data);
}));

router.get('/tv/:tvId/watch/providers', asyncHandler(async (req, res) => {
  const { tvId } = req.params;
  const data = await tmdbService.getTvWatchProviders(tvId);
  res.json(data);
}));

router.get('/tv/:tvId/images', asyncHandler(async (req, res) => {
  const { tvId } = req.params;
  const data = await tmdbService.getTvImages(tvId);
  res.json(data);
}));

router.get('/tv/:tvId/external_ids', asyncHandler(async (req, res) => {
  const { tvId } = req.params;
  const data = await tmdbService.getTvExternalIds(tvId);
  res.json(data);
}));

// ============= SEARCH =============
router.get('/search/multi', asyncHandler(async (req, res) => {
  const { query, page = 1 } = req.query;
  if (!query) {
    throw new AppError('Search query is required', 400);
  }
  const data = await tmdbService.searchMulti(query, page);
  res.json(data);
}));

router.get('/search/movie', asyncHandler(async (req, res) => {
  const { query, page = 1 } = req.query;
  if (!query) {
    throw new AppError('Search query is required', 400);
  }
  const data = await tmdbService.searchMovies(query, page);
  res.json(data);
}));

router.get('/search/tv', asyncHandler(async (req, res) => {
  const { query, page = 1 } = req.query;
  if (!query) {
    throw new AppError('Search query is required', 400);
  }
  const data = await tmdbService.searchTvShows(query, page);
  res.json(data);
}));

router.get('/search/person', asyncHandler(async (req, res) => {
  const { query, page = 1 } = req.query;
  if (!query) {
    throw new AppError('Search query is required', 400);
  }
  const data = await tmdbService.searchPerson(query, page);
  res.json(data);
}));

// ============= DISCOVER =============
router.get('/discover/movie', asyncHandler(async (req, res) => {
  const data = await tmdbService.discoverMovies(req.query);
  res.json(data);
}));

router.get('/discover/tv', asyncHandler(async (req, res) => {
  const data = await tmdbService.discoverTvShows(req.query);
  res.json(data);
}));

// ============= GENRES =============
router.get('/genre/movie/list', asyncHandler(async (req, res) => {
  const data = await tmdbService.getMovieGenres();
  res.json(data);
}));

router.get('/genre/tv/list', asyncHandler(async (req, res) => {
  const data = await tmdbService.getTvGenres();
  res.json(data);
}));

router.get('/genre/:type/list', asyncHandler(async (req, res) => {
  const { type } = req.params;
  const data = await tmdbService.getGenres(type);
  res.json(data);
}));

// ============= PERSON =============
router.get('/person/:personId', asyncHandler(async (req, res) => {
  const { personId } = req.params;
  if (!personId || isNaN(personId)) {
    throw new AppError('Invalid person ID', 400);
  }
  const data = await tmdbService.getPersonDetails(personId);
  res.json(data);
}));

// ============= COLLECTIONS =============
router.get('/collection/:collectionId', asyncHandler(async (req, res) => {
  const { collectionId } = req.params;
  if (!collectionId || isNaN(collectionId)) {
    throw new AppError('Invalid collection ID', 400);
  }
  const data = await tmdbService.getCollectionDetails(collectionId);
  res.json(data);
}));

// ============= CONFIGURATION =============
router.get('/configuration', asyncHandler(async (req, res) => {
  const data = await tmdbService.getConfiguration();
  res.json(data);
}));

router.get('/configuration/countries', asyncHandler(async (req, res) => {
  const data = await tmdbService.getCountries();
  res.json(data);
}));

router.get('/configuration/languages', asyncHandler(async (req, res) => {
  const data = await tmdbService.getLanguages();
  res.json(data);
}));

export default router;
