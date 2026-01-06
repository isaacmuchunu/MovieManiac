import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tmdbApi } from '../lib/videoProviders';
import MovieModal from '../components/MovieModal';

const KidsHero = ({ movie, onPlay }) => {
  if (!movie) return null;

  return (
    <div className="relative h-[60vh] min-h-[400px]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/90 via-sky-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-sky-900 via-transparent to-transparent" />
      </div>

      <div className="absolute bottom-20 left-0 right-0 px-8 md:px-14">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
          {movie.title || movie.name}
        </h1>
        <p className="text-lg text-white/90 max-w-xl mb-6 line-clamp-2">
          {movie.overview}
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onPlay(movie)}
            className="flex items-center gap-2 bg-white hover:bg-white/90 text-gray-900 font-bold py-3 px-8 rounded-full transition-all hover:scale-105"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Play
          </button>
          <button
            onClick={() => onPlay(movie)}
            className="flex items-center gap-2 bg-sky-500/50 hover:bg-sky-500/70 text-white font-bold py-3 px-6 rounded-full transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            More Info
          </button>
        </div>
      </div>

      {/* Kids Badge */}
      <div className="absolute top-4 right-4 md:top-8 md:right-14">
        <div className="bg-sky-500 text-white font-bold px-4 py-2 rounded-full text-sm flex items-center gap-2">
          <span className="text-xl">👦</span>
          KIDS
        </div>
      </div>
    </div>
  );
};

const KidsRow = ({ title, items, onMovieClick }) => {
  if (!items?.length) return null;

  return (
    <div className="mb-10">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-8 md:px-14">
        {title}
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-4 px-8 md:px-14 hide-scrollbar">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onMovieClick(item)}
            className="flex-shrink-0 group"
          >
            <div className="w-40 md:w-52 aspect-[2/3] rounded-xl overflow-hidden bg-sky-800 transition-transform group-hover:scale-105 group-hover:ring-4 ring-sky-400">
              {item.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sky-300">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
              )}
            </div>
            <p className="mt-2 text-white text-sm font-medium truncate max-w-40 md:max-w-52">
              {item.title || item.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

const Kids = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState({
    featured: null,
    animation: [],
    family: [],
    popular: [],
    tvShows: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Kid-friendly genres
  const ANIMATION_GENRE = 16;
  const FAMILY_GENRE = 10751;

  useEffect(() => {
    const fetchKidsContent = async () => {
      setLoading(true);
      try {
        // Fetch kid-friendly content in parallel
        const [animationData, familyData, popularData, tvShowsData] = await Promise.all([
          tmdbApi.getMoviesByGenre(ANIMATION_GENRE, 1, 'popularity.desc'),
          tmdbApi.getMoviesByGenre(FAMILY_GENRE, 1, 'popularity.desc'),
          tmdbApi.getPopularMovies(),
          tmdbApi.getPopularTvShows()
        ]);

        // Filter for kid-friendly content (no adult content, high vote average)
        const filterKidFriendly = (items) =>
          items.filter(item => !item.adult && (item.vote_average >= 5 || !item.vote_average));

        const animation = filterKidFriendly(animationData.results || []).slice(0, 15);
        const family = filterKidFriendly(familyData.results || []).slice(0, 15);

        // Get featured from animation
        const featured = animation[0] || family[0];

        // Filter popular for kids (animation or family genres)
        const popular = filterKidFriendly(popularData.results || [])
          .filter(m => m.genre_ids?.some(g => [ANIMATION_GENRE, FAMILY_GENRE].includes(g)))
          .slice(0, 15);

        // Filter TV shows for kids
        const tvShows = filterKidFriendly(tvShowsData.results || [])
          .filter(s => s.genre_ids?.some(g => [ANIMATION_GENRE, FAMILY_GENRE].includes(g)))
          .slice(0, 15);

        setContent({
          featured,
          animation,
          family,
          popular,
          tvShows
        });
      } catch (error) {
        console.error('Error fetching kids content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKidsContent();
  }, []);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handlePlay = (movie) => {
    const type = movie.first_air_date ? 'tv' : 'movie';
    navigate(`/watch/${type}/${movie.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-800 to-sky-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-xl font-medium">Loading fun content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-800 to-sky-900">
      {/* Navbar Override for Kids */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-sky-900 to-transparent px-8 py-4">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-white text-2xl md:text-3xl font-black">
              <span className="text-sky-400">M</span>OOVIE
            </span>
            <span className="bg-sky-400 text-sky-900 text-xs font-bold px-2 py-1 rounded">
              KIDS
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Exit Kids
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <KidsHero movie={content.featured} onPlay={handlePlay} />

      {/* Content Rows */}
      <div className="relative z-10 -mt-16 pt-8">
        <KidsRow
          title="🎬 Animation Adventures"
          items={content.animation}
          onMovieClick={handleMovieClick}
        />

        <KidsRow
          title="👨‍👩‍👧‍👦 Family Fun"
          items={content.family}
          onMovieClick={handleMovieClick}
        />

        <KidsRow
          title="⭐ Popular with Kids"
          items={content.popular}
          onMovieClick={handleMovieClick}
        />

        <KidsRow
          title="📺 TV Shows for Kids"
          items={content.tvShows}
          onMovieClick={handleMovieClick}
        />

        {/* Characters Section */}
        <div className="px-8 md:px-14 py-12">
          <h2 className="text-2xl font-bold text-white mb-6">Explore by Character</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Superheroes', emoji: '🦸', color: 'from-red-500 to-orange-500' },
              { name: 'Princesses', emoji: '👸', color: 'from-pink-500 to-purple-500' },
              { name: 'Animals', emoji: '🐾', color: 'from-green-500 to-teal-500' },
              { name: 'Robots', emoji: '🤖', color: 'from-blue-500 to-cyan-500' },
              { name: 'Dinosaurs', emoji: '🦕', color: 'from-amber-500 to-yellow-500' },
              { name: 'Space', emoji: '🚀', color: 'from-indigo-500 to-purple-500' }
            ].map((cat) => (
              <button
                key={cat.name}
                className={`bg-gradient-to-br ${cat.color} p-6 rounded-2xl text-center hover:scale-105 transition-transform`}
              >
                <span className="text-5xl block mb-2">{cat.emoji}</span>
                <span className="text-white font-bold">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
};

export default Kids;
