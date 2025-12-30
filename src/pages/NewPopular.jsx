import { useState, useEffect } from 'react';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';

const API_KEY = '617c0260598c225e728db47b98d5ea6f';

const NewPopular = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trendingDay, setTrendingDay] = useState([]);
  const [trendingWeek, setTrendingWeek] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const [dayRes, weekRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
        ]);

        const [dayData, weekData] = await Promise.all([
          dayRes.json(),
          weekRes.json()
        ]);

        setTrendingDay(dayData.results || []);
        setTrendingWeek(weekData.results || []);
      } catch (error) {
        console.error('Error fetching trending:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'movies', label: 'Movies' },
    { id: 'tv', label: 'TV Shows' },
  ];

  return (
    <div className="min-h-screen bg-netflix-black pt-20">
      {/* Header */}
      <div className="px-4 md:px-14 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">New & Popular</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-black'
                  : 'bg-netflix-medium-gray text-white hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Worth the Wait - Upcoming */}
        <div className="mb-8">
          <div className="flex items-center gap-3 px-4 md:px-14 mb-4">
            <span className="text-2xl">🍿</span>
            <h2 className="text-xl md:text-2xl font-semibold text-white">Worth the Wait</h2>
          </div>
          <MovieRow
            title=""
            type="upcoming"
            onMovieClick={handleMovieClick}
          />
        </div>

        {/* Trending Today */}
        <div className="mb-8">
          <div className="flex items-center gap-3 px-4 md:px-14 mb-4">
            <span className="text-2xl">🔥</span>
            <h2 className="text-xl md:text-2xl font-semibold text-white">Trending Today</h2>
          </div>
          <MovieRow
            title=""
            movies={trendingDay}
            onMovieClick={handleMovieClick}
          />
        </div>

        {/* Trending This Week */}
        <div className="mb-8">
          <div className="flex items-center gap-3 px-4 md:px-14 mb-4">
            <span className="text-2xl">📈</span>
            <h2 className="text-xl md:text-2xl font-semibold text-white">Trending This Week</h2>
          </div>
          <MovieRow
            title=""
            movies={trendingWeek}
            onMovieClick={handleMovieClick}
          />
        </div>

        {/* Top 10 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 px-4 md:px-14 mb-4">
            <span className="text-2xl">🏆</span>
            <h2 className="text-xl md:text-2xl font-semibold text-white">Top 10 Movies Today</h2>
          </div>
          <MovieRow
            title=""
            movies={trendingDay.slice(0, 10)}
            onMovieClick={handleMovieClick}
          />
        </div>

        {/* Now Playing */}
        <div className="mb-8">
          <div className="flex items-center gap-3 px-4 md:px-14 mb-4">
            <span className="text-2xl">🎬</span>
            <h2 className="text-xl md:text-2xl font-semibold text-white">Now Playing in Theaters</h2>
          </div>
          <MovieRow
            title=""
            type="now_playing"
            onMovieClick={handleMovieClick}
          />
        </div>
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
};

export default NewPopular;
