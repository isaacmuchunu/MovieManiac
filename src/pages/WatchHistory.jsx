import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { userApi } from '../lib/backendApi';
import { tmdbApi } from '../lib/videoProviders';
import { errorReporting, ErrorCategory } from '../lib/errorReporting';
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
        const response = await userApi.getWatchHistory().catch((error) => {
          errorReporting.captureError(error, { category: ErrorCategory.NETWORK });
          return null;
        });
        // Backend returns { status: 'success', data: [...] }
        const historyData = response?.data || response?.history;
        if (historyData && historyData.length > 0) {
          // Map backend data to component format - flatten nested content object
          setHistory(historyData.map(item => ({
            id: item.id,
            contentId: item.content?.id || item.contentId,
            title: item.content?.title || item.title,
            type: item.content?.type?.toLowerCase() === 'series' ? 'series' : 'movie',
            poster: item.content?.posterUrl || item.poster,
            backdrop: item.content?.backdropUrl || item.backdrop,
            episode: item.episode || null,
            progress: item.progress || 0,
            duration: item.duration || (item.content?.type === 'SERIES' ? 45 : 120),
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
              poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster',
              backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : 'https://via.placeholder.com/1280x720?text=No+Backdrop',
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
  }).sort((a, b) => b.watchedAt - a.watchedAt); // Sort by most recent

  const continueWatching = history.filter((item) => item.progress < 100).sort((a, b) => b.progress - a.progress); // Sort by progress descending

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const groupByDate = (items) => {
    const groups = {};
    items.forEach(item => {
      const dateKey = item.watchedAt.toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(item);
    });
    return groups;
  };

  const historyGroups = groupByDate(filteredHistory);

  const handleContinueWatching = (item) => {
    const watchType = item.type === 'series' ? 'tv' : 'movie';
    if (item.type === 'series' && item.episode) {
      navigate(`/watch/${watchType}/${item.contentId}?s=${item.episode.season}&e=${item.episode.episode}`);
    } else {
      navigate(`/watch/${watchType}/${item.contentId}`);
    }
  };

  const handleRemoveFromHistory = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear your entire watch history? This action cannot be undone.')) {
      setHistory([]);
      localStorage.removeItem('moovie-watch-history');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-netflix-black pt-20 px-4 md:px-8 lg:px-12 xl:px-16 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Watch History</h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            {history.length} titles in your viewing history
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearAllHistory}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All History
          </button>
        )}
      </div>

      {/* Continue Watching Section */}
      {continueWatching.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Continue Watching</h2>
          <div className="overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            <div className="flex gap-4 min-w-max">
              {continueWatching.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-900 rounded-xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 flex-shrink-0 w-64 md:w-72 lg:w-80 snap-start"
                  onClick={() => handleContinueWatching(item)}
                >
                  <div className="relative aspect-video">
                    <img
                      src={item.backdrop || 'https://via.placeholder.com/1280x720?text=No+Backdrop'}
                      alt={`${item.title} backdrop`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <svg className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50">
                      <div
                        className="h-full bg-netflix-red transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-base md:text-lg truncate">{item.title}</h3>
                        {item.episode && (
                          <p className="text-sm text-gray-300 truncate">
                            S{item.episode.season}:E{item.episode.episode} • {item.episode.title}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {Math.floor((item.duration * (100 - item.progress)) / 100)}m left
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { value: 'all', label: 'All' },
          { value: 'movies', label: 'Movies' },
          { value: 'series', label: 'TV Series' },
          { value: 'inProgress', label: 'In Progress' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${
              filter === option.value
                ? 'bg-netflix-red text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* History List */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(historyGroups).map(([dateKey, items]) => (
            <div key={dateKey}>
              <h3 className="text-lg font-semibold text-gray-300 mb-4 sticky top-20 bg-netflix-black py-2 z-10">
                {new Date(dateKey).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col sm:flex-row"
                  >
                    {/* Poster */}
                    <div className="relative sm:w-40 md:w-48 flex-shrink-0">
                      <img
                        src={item.poster || 'https://via.placeholder.com/500x750?text=No+Poster'}
                        alt={`${item.title} poster`}
                        className="w-full h-48 sm:h-full object-cover"
                        loading="lazy"
                      />
                      {/* Progress overlay for movies */}
                      {item.progress < 100 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                          <div
                            className="h-full bg-netflix-red"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}
                      {item.progress === 100 && (
                        <div className="absolute top-2 left-2 bg-green-500/80 text-white text-xs px-2 py-0.5 rounded-full font-medium backdrop-blur-sm">
                          Completed
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-white font-semibold text-lg md:text-xl truncate">{item.title}</h3>
                              <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-md">
                                {item.type === 'movie' ? 'Movie' : 'Series'}
                              </span>
                            </div>
                            {item.episode && (
                              <p className="text-sm text-gray-300 mt-1 truncate">
                                Season {item.episode.season}, Episode {item.episode.episode}: {item.episode.title}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
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
                            className="text-gray-500 hover:text-netflix-red transition-colors p-2 -mr-2 -mt-2"
                            aria-label="Remove from history"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleContinueWatching(item)}
                          className="flex items-center gap-2 bg-netflix-red hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200 shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          {item.progress < 100 ? 'Continue' : 'Watch Again'}
                        </button>
                        <Link
                          to={item.type === 'series' ? `/series/${item.contentId}` : `/movie/${item.contentId}`}
                          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-medium px-4 py-2 rounded-md transition-all duration-200 shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          More Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📺</div>
          <h3 className="text-white text-2xl font-semibold mb-2">No Watch History Yet</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            {filter !== 'all'
              ? 'No items match this filter. Try adjusting your selection.'
              : 'Start watching your favorite movies and series to build your personalized history.'}
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 bg-netflix-red hover:bg-red-700 text-white font-medium px-6 py-3 rounded-md transition-all duration-200 shadow-md"
          >
            Discover Content
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}

export default WatchHistory;