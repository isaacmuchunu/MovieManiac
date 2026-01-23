import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tmdbApi } from '../lib/videoProviders';
import Loading from '../components/Loading';
import api from '../lib/api';
import { useAuthStore } from '../lib/store';

function Series() {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [series, setSeries] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [currentSeasonData, setCurrentSeasonData] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seasonLoading, setSeasonLoading] = useState(false);
  const [inMyList, setInMyList] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  // Fetch series details
  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true);
      try {
        const data = await tmdbApi.getTvDetails(seriesId);
        setSeries(data);

        // Get valid seasons (skip specials if season 0)
        const validSeasons = data.seasons?.filter(s => s.season_number > 0) || [];
        setSeasons(validSeasons);

        // Set initial season
        if (validSeasons.length > 0) {
          setSelectedSeason(validSeasons[0].season_number);
        }

        // Fetch similar shows
        if (data.similar?.results) {
          setSimilar(data.similar.results.slice(0, 12));
        }

        // Check my list
        if (isAuthenticated) {
          try {
            const watchlistResponse = await api.getWatchlist();
            const watchlist = watchlistResponse.data || [];
            setInMyList(watchlist.some(item =>
              item.tmdbId === data.id || item.id === String(data.id)
            ));
          } catch (err) {
            console.error('Error checking watchlist:', err);
            const savedList = localStorage.getItem('moovie-mylist');
            if (savedList) {
              const list = JSON.parse(savedList);
              setInMyList(list.some(m => m.id === data.id));
            }
          }
        } else {
          const savedList = localStorage.getItem('moovie-mylist');
          if (savedList) {
            const list = JSON.parse(savedList);
            setInMyList(list.some(m => m.id === data.id));
          }
        }
      } catch (error) {
        console.error('Error fetching series:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
    window.scrollTo(0, 0);
  }, [seriesId, isAuthenticated]);

  // Fetch season details when selection changes
  useEffect(() => {
    const fetchSeasonData = async () => {
      if (!series || !selectedSeason) return;

      setSeasonLoading(true);
      try {
        const data = await tmdbApi.getTvSeasonDetails(seriesId, selectedSeason);
        setCurrentSeasonData(data);
      } catch (error) {
        console.error('Error fetching season:', error);
      } finally {
        setSeasonLoading(false);
      }
    };

    fetchSeasonData();
  }, [seriesId, selectedSeason, series]);

  const toggleMyList = async () => {
    if (watchlistLoading) return;

    if (isAuthenticated) {
      // Sync with backend API
      setWatchlistLoading(true);
      try {
        if (inMyList) {
          await api.removeFromWatchlist(String(series.id));
        } else {
          await api.addToWatchlist(String(series.id));
        }
        setInMyList(!inMyList);
      } catch (err) {
        console.error('Error updating watchlist:', err);
      } finally {
        setWatchlistLoading(false);
      }
    } else {
      // Use localStorage for non-authenticated users
      const savedList = localStorage.getItem('moovie-mylist');
      let list = savedList ? JSON.parse(savedList) : [];

      if (inMyList) {
        list = list.filter(m => m.id !== series.id);
      } else {
        list.push({
          ...series,
          media_type: 'tv'
        });
      }

      localStorage.setItem('moovie-mylist', JSON.stringify(list));
      setInMyList(!inMyList);
    }
  };

  const handlePlay = (seasonNum, episodeNum) => {
    navigate(`/watch/tv/${seriesId}?s=${seasonNum}&e=${episodeNum}`);
  };

  const getImageUrl = (path, size = 'original') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  if (loading) return <Loading />;

  if (!series) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Series not found</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-netflix-red hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Hero Section */}
      <div className="relative h-[70vh] md:h-[80vh]">
        {/* Backdrop */}
        <div className="absolute inset-0">
          {series.backdrop_path ? (
            <img
              src={getImageUrl(series.backdrop_path)}
              alt={series.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-netflix-dark-gray" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/40 to-transparent" />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 md:left-12 z-10 flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-12 pb-12">
          <div className="max-w-3xl">
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {series.name}
            </h1>

            {/* Tagline */}
            {series.tagline && (
              <p className="text-xl text-gray-300 italic mb-4">{series.tagline}</p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              {/* Rating */}
              <div className="flex items-center gap-1 bg-yellow-500 text-black px-2 py-1 rounded font-bold">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {series.vote_average?.toFixed(1)}
              </div>

              <span className="text-green-500 font-semibold">
                {Math.round((series.vote_average || 0) * 10)}% Match
              </span>
              <span className="text-gray-400">
                {series.first_air_date?.split('-')[0]}
                {series.status === 'Ended' && series.last_air_date && ` - ${series.last_air_date.split('-')[0]}`}
              </span>
              <span className="border border-gray-500 text-gray-400 px-1.5 text-xs">
                {series.adult ? '18+' : 'TV-MA'}
              </span>
              <span className="text-gray-400">{series.number_of_seasons} Season{series.number_of_seasons !== 1 ? 's' : ''}</span>
              <span className="text-gray-400">{series.number_of_episodes} Episodes</span>
              <span className="border border-gray-500 text-gray-400 px-1.5 text-xs">HD</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {series.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-gray-800/80 text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-gray-300 text-lg mb-6 line-clamp-3">{series.overview}</p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handlePlay(selectedSeason, 1)}
                className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-bold px-8 py-3 rounded-md transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play S{selectedSeason}:E1
              </button>

              <button
                onClick={toggleMyList}
                className="flex items-center gap-2 bg-gray-600/80 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-md transition-colors"
              >
                {inMyList ? (
                  <>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    In My List
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    My List
                  </>
                )}
              </button>
            </div>

            {/* Created By */}
            {series.created_by?.length > 0 && (
              <p className="mt-4 text-gray-400 text-sm">
                Created by: <span className="text-white">{series.created_by.map(c => c.name).join(', ')}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-12 py-8">
        {/* Season Selector */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-white">Episodes</h2>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
            className="bg-gray-800 text-white px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-white/50"
          >
            {seasons.map((season) => (
              <option key={season.id} value={season.season_number}>
                Season {season.season_number} ({season.episode_count} episodes)
              </option>
            ))}
          </select>
        </div>

        {/* Season Info */}
        {currentSeasonData && (
          <div className="mb-6">
            <p className="text-gray-400">
              {currentSeasonData.episodes?.length} Episodes
              {currentSeasonData.air_date && ` • ${currentSeasonData.air_date.split('-')[0]}`}
            </p>
            {currentSeasonData.overview && (
              <p className="text-gray-300 mt-2">{currentSeasonData.overview}</p>
            )}
          </div>
        )}

        {/* Episodes List */}
        {seasonLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {currentSeasonData?.episodes?.map((episode) => (
              <div
                key={episode.id}
                className="bg-gray-900/50 rounded-lg overflow-hidden hover:bg-gray-800/50 transition-colors group"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Episode Thumbnail */}
                  <div className="relative md:w-80 flex-shrink-0">
                    {episode.still_path ? (
                      <img
                        src={getImageUrl(episode.still_path, 'w500')}
                        alt={episode.name}
                        className="w-full h-44 md:h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-44 md:h-full bg-netflix-medium-gray flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                        </svg>
                      </div>
                    )}
                    <button
                      onClick={() => handlePlay(selectedSeason, episode.episode_number)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </button>
                    {/* Episode Number Badge */}
                    <div className="absolute top-2 left-2 bg-black/80 text-white text-sm font-bold px-2 py-1 rounded">
                      E{episode.episode_number}
                    </div>
                  </div>

                  {/* Episode Info */}
                  <div className="p-4 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-lg">
                          {episode.episode_number}. {episode.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                          {episode.runtime && <span>{episode.runtime}m</span>}
                          <span>{episode.air_date}</span>
                          {episode.vote_average > 0 && (
                            <span className="flex items-center gap-1 text-yellow-500">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                              {episode.vote_average.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handlePlay(selectedSeason, episode.episode_number)}
                        className="hidden md:flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-medium px-4 py-2 rounded transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Play
                      </button>
                    </div>
                    <p className="text-gray-400 mt-2 line-clamp-2">{episode.overview || 'No description available.'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cast Section */}
        {series.credits?.cast?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {series.credits.cast.slice(0, 12).map((person) => (
                <div key={person.id} className="text-center">
                  {person.profile_path ? (
                    <img
                      src={getImageUrl(person.profile_path, 'w185')}
                      alt={person.name}
                      className="w-full aspect-[2/3] object-cover rounded-lg mb-2"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-netflix-medium-gray rounded-lg mb-2 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                  <h4 className="text-white font-medium text-sm line-clamp-1">{person.name}</h4>
                  <p className="text-gray-500 text-xs line-clamp-1">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Shows */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">More Like This</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similar.map((show) => (
                <Link
                  key={show.id}
                  to={`/series/${show.id}`}
                  className="relative aspect-[2/3] rounded-lg overflow-hidden group"
                >
                  {show.poster_path ? (
                    <img
                      src={getImageUrl(show.poster_path, 'w342')}
                      alt={show.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-netflix-medium-gray flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-sm font-medium line-clamp-2">{show.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Series;
