import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import { tmdbApi } from '../lib/tmdbProxy';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const TVShows = () => {
  const navigate = useNavigate();
  const [shows, setShows] = useState({
    popular: [],
    topRated: [],
    onAir: [],
    airingToday: []
  });
  const [selectedShow, setSelectedShow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const [popularData, topRatedData, onAirData, airingTodayData] = await Promise.all([
          tmdbApi.getPopularTvShows(1),
          tmdbApi.getTopRatedTvShows(1),
          tmdbApi.getOnTheAirTvShows(1),
          tmdbApi.getAiringTodayTvShows(1)
        ]);

        setShows({
          popular: popularData.results?.slice(0, 20) || [],
          topRated: topRatedData.results?.slice(0, 20) || [],
          onAir: onAirData.results?.slice(0, 20) || [],
          airingToday: airingTodayData.results?.slice(0, 20) || []
        });
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  const PlayIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const TVShowCard = ({ show, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const getMatchPercentage = () => Math.round(show.vote_average * 10);
  const getYear = () => show.first_air_date?.split('-')[0] || 'N/A';
  const navigate = useNavigate();

  const handlePlay = (e) => {
    e.stopPropagation();
    navigate(`/watch/tv/${show.id}`);
  };

  return (
    <div
      className="flex-shrink-0 w-[160px] md:w-[200px] lg:w-[240px] cursor-pointer group"
      onClick={() => onClick(show)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative rounded-md overflow-hidden bg-netflix-dark-gray">
        {show.backdrop_path || show.poster_path ? (
          <img
            src={`${IMAGE_BASE}${show.backdrop_path || show.poster_path}`}
            alt={show.name}
            className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-video bg-netflix-medium-gray flex items-center justify-center">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-sm font-semibold text-white line-clamp-1">{show.name}</h3>
            <div className="flex items-center gap-2 text-xs mt-1">
              <span className="text-green-500">{getMatchPercentage()}% Match</span>
              <span className="text-gray-400">{getYear()}</span>
            </div>
          </div>
        </div>
        
        {/* Play button overlay on hover */}
        {isHovered && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={handlePlay}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <PlayIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

  const TVRow = ({ title, showsList }) => (
    <div className="mb-6">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 px-4 md:px-14">{title}</h2>
      <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 px-4 md:px-14 hide-scrollbar">
        {showsList.map((show) => (
          <TVShowCard
            key={show.id}
            show={show}
            onClick={(s) => {
              // Transform TV show data to match movie format for modal
              setSelectedShow({
                ...s,
                title: s.name,
                release_date: s.first_air_date,
              });
            }}
          />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black pt-20">
        <div className="px-4 md:px-14 py-8">
          <div className="h-10 w-48 skeleton rounded mb-8"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="mb-8">
              <div className="h-8 w-40 skeleton rounded mb-4"></div>
              <div className="flex gap-2 overflow-hidden">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="flex-shrink-0 w-[240px] aspect-video skeleton rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black pt-24 md:pt-28 pb-12">
      {/* Header */}
      <div className="px-4 md:px-14 py-8 mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">TV Shows</h1>
        <p className="text-gray-400">
          Discover the best TV shows from around the world
        </p>
      </div>

      {/* TV Show Rows */}
      <div className="space-y-8 md:space-y-10">
        <TVRow title="Popular TV Shows" showsList={shows.popular} />
        <TVRow title="Top Rated" showsList={shows.topRated} />
        <TVRow title="Currently On Air" showsList={shows.onAir} />
        <TVRow title="Airing Today" showsList={shows.airingToday} />
      </div>

      {/* Modal */}
      {selectedShow && (
        <MovieModal movie={selectedShow} onClose={() => setSelectedShow(null)} />
      )}
    </div>
  );
};

export default TVShows;
