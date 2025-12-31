import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { userApi } from '../lib/backendApi';
import { tmdbApi } from '../lib/videoProviders';
import Loading from '../components/Loading';

function WatchHistory() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, movies, series, inProgress

  useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        // Try to fetch from backend API
        const data = await userApi.getWatchHistory().catch(() => null);

        if (data && data.history) {
          // Map backend data to component format
          setHistory(data.history.map(item => ({
            ...item,
            watchedAt: new Date(item.watchedAt)
          })));
        } else {
          // Fallback: Get from localStorage or show recent TMDB content
          const localHistory = JSON.parse(localStorage.getItem('moovie-watch-history') || '[]');

          if (localHistory.length > 0) {
            setHistory(localHistory.map(item => ({
              ...item,
              watchedAt: new Date(item.watchedAt)
            })));
          } else {
            // Show trending as "recently watched" for demo
            const trending = await tmdbApi.getTrending();
            const demoHistory = trending.results.slice(0, 5).map((item, index) => ({
              id: item.id,
              contentId: item.id,
              title: item.title || item.name,
              type: item.media_type === 'tv' ? 'series' : 'movie',
              poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
              backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : null,
              episode: item.media_type === 'tv' ? { season: 1, episode: Math.floor(Math.random() * 10) + 1, title: 'Episode' } : null,
              progress: Math.floor(Math.random() * 80) + 20,
              duration: item.media_type === 'tv' ? 45 : 120,
              watchedAt: new Date(Date.now() - (1000 * 60 * 60 * index * 3))
            }));
            setHistory(demoHistory);
          }
        }
      } catch (error) {
        console.error('Error fetching watch history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    if (filter === 'movies') return item.type === 'movie';
    if (filter === 'series') return item.type === 'series';
    if (filter === 'inProgress') return item.progress < 100;
    return true;
  });

  const continueWatching = history.filter((item) => item.progress < 100);

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleContinueWatching = (item) => {
    if (item.type === 'series' && item.episode) {
      navigate(`/watch/${item.contentId}/s${item.episode.season}e${item.episode.episode}`);
    } else {
      navigate(`/watch/${item.contentId}`);
    }
  };

  const handleRemoveFromHistory = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllHistory = () => {
    if (confirm('Are you sure you want to clear your entire watch history?')) {
      setHistory([]);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-netflix-black pt-20 px-4 md:px-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Watch History</h1>
          <p className="text-gray-400 mt-2">
            {history.length} titles in your history
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearAllHistory}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Continue Watching Section */}
      {continueWatching.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Continue Watching</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {continueWatching.map((item) => (
              <div
                key={item.id}
                className="bg-gray-900/50 rounded-lg overflow-hidden group cursor-pointer hover:bg-gray-800/50 transition-colors"
                onClick={() => handleContinueWatching(item)}
              >
                <div className="relative aspect-video">
                  <img
                    src={item.backdrop}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div
                      className="h-full bg-netflix-red"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-medium">{item.title}</h3>
                      {item.episode && (
                        <p className="text-sm text-gray-400">
                          S{item.episode.season}:E{item.episode.episode} "{item.episode.title}"
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.floor((item.duration * item.progress) / 100)}m left
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { value: 'all', label: 'All' },
          { value: 'movies', label: 'Movies' },
          { value: 'series', label: 'TV Series' },
          { value: 'inProgress', label: 'In Progress' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === option.value
                ? 'bg-white text-black'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* History List */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900/50 rounded-lg overflow-hidden hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Poster */}
                <div className="relative sm:w-48 flex-shrink-0">
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-48 sm:h-full object-cover"
                  />
                  {/* Progress overlay for movies */}
                  {item.type === 'movie' && item.progress < 100 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                      <div
                        className="h-full bg-netflix-red"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                  {item.progress === 100 && (
                    <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                      Watched
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                          {item.type === 'movie' ? 'Movie' : 'Series'}
                        </span>
                      </div>

                      {item.episode && (
                        <p className="text-gray-400 mt-1">
                          Season {item.episode.season}, Episode {item.episode.episode}: {item.episode.title}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{item.duration}m</span>
                        <span>{formatTimeAgo(item.watchedAt)}</span>
                        {item.progress < 100 && (
                          <span className="text-netflix-red">{item.progress}% watched</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromHistory(item.id);
                      }}
                      className="text-gray-500 hover:text-white transition-colors p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleContinueWatching(item)}
                      className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-medium px-4 py-2 rounded transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      {item.progress < 100 ? 'Continue' : 'Watch Again'}
                    </button>

                    <Link
                      to={item.type === 'series' ? `/series/${item.contentId}` : `/movie/${item.contentId}`}
                      className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📺</div>
          <h3 className="text-white text-xl font-semibold mb-2">No watch history</h3>
          <p className="text-gray-400 mb-6">
            {filter !== 'all'
              ? 'Try changing your filter'
              : "Start watching to build your history"}
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 bg-netflix-red hover:bg-red-700 text-white font-medium px-6 py-3 rounded transition-colors"
          >
            Browse Content
          </Link>
        </div>
      )}
    </div>
  );
}

export default WatchHistory;
