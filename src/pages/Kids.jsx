import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tmdbApi } from '../lib/videoProviders';
import MovieModal from '../components/MovieModal';

// Netflix-style Hero for Kids
const KidsHero = ({ movie, onPlay, onMoreInfo }) => {
  if (!movie) return null;

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background Image with Ken Burns effect */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 animate-slow-zoom"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          animation: 'slowZoom 20s ease-in-out infinite alternate'
        }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/95 via-purple-900/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a2e] via-transparent to-purple-900/30" />

      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-8 md:px-14 pb-32">
        <div className="max-w-2xl">
          {/* Kids Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold px-4 py-1.5 rounded-full text-sm mb-4 shadow-lg">
            <span className="text-lg">✨</span>
            KIDS
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl leading-tight">
            {movie.title || movie.name}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              {movie.vote_average ? `${Math.round(movie.vote_average * 10)}% Match` : 'New'}
            </span>
            <span className="text-white/80 text-sm">
              {movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}
            </span>
            <span className="border border-white/40 text-white/80 text-xs px-1.5 py-0.5 rounded">
              PG
            </span>
          </div>

          <p className="text-lg text-white/90 max-w-xl mb-8 line-clamp-3 leading-relaxed">
            {movie.overview}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onPlay(movie)}
              className="flex items-center gap-3 bg-white hover:bg-white/90 text-gray-900 font-bold py-4 px-10 rounded-lg transition-all hover:scale-105 shadow-xl"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Play
            </button>
            <button
              onClick={() => onMoreInfo(movie)}
              className="flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-lg transition-all border border-white/20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 text-6xl animate-bounce-slow opacity-50 hidden md:block">🌟</div>
      <div className="absolute top-40 right-32 text-4xl animate-float opacity-40 hidden md:block">🎈</div>
      <div className="absolute bottom-40 right-20 text-5xl animate-float-delayed opacity-40 hidden md:block">🎪</div>
    </div>
  );
};

// Netflix-style Content Row with Scroll Arrows
const KidsRow = ({ title, items, onMovieClick, emoji }) => {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  if (!items?.length) return null;

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.8;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <div className="mb-8 group/row relative">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-8 md:px-14 flex items-center gap-3">
        {emoji && <span className="text-2xl">{emoji}</span>}
        {title}
      </h2>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-0 top-0 bottom-4 z-20 w-14 bg-gradient-to-r from-[#1a0a2e] to-transparent flex items-center justify-start pl-2 transition-opacity duration-300 ${
            showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full flex items-center justify-center transition-all hover:scale-110">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>

        {/* Content */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-2 md:gap-3 overflow-x-auto pb-4 px-8 md:px-14 scrollbar-hide scroll-smooth"
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex-shrink-0 relative"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ transitionDelay: `${index * 30}ms` }}
            >
              <button
                onClick={() => onMovieClick(item)}
                className={`group block transition-all duration-300 origin-center ${
                  hoveredId === item.id ? 'scale-110 z-30 relative' : 'scale-100'
                }`}
              >
                <div className={`w-36 md:w-44 aspect-[2/3] rounded-lg overflow-hidden bg-purple-900/50 shadow-lg transition-all duration-300 ${
                  hoveredId === item.id ? 'ring-2 ring-pink-400 shadow-2xl shadow-pink-500/30' : ''
                }`}>
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-700 to-pink-700">
                      <span className="text-5xl">🎬</span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3 transition-opacity duration-300 ${
                    hoveredId === item.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <p className="text-white font-bold text-sm line-clamp-2 mb-1">
                      {item.title || item.name}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                        {item.vote_average ? `${Math.round(item.vote_average * 10)}%` : 'New'}
                      </span>
                      <span className="text-white/70 text-xs">
                        {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-white/90 transition-colors cursor-pointer">
                        <svg className="w-4 h-4 text-black ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 border border-white/40 transition-colors cursor-pointer">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-0 top-0 bottom-4 z-20 w-14 bg-gradient-to-l from-[#1a0a2e] to-transparent flex items-center justify-end pr-2 transition-opacity duration-300 ${
            showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full flex items-center justify-center transition-all hover:scale-110">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

// Character Categories Section
const CharacterCategories = ({ onCategoryClick }) => {
  const categories = [
    { name: 'Superheroes', emoji: '🦸', gradient: 'from-red-500 to-orange-500', keywords: 'superhero' },
    { name: 'Princesses', emoji: '👸', gradient: 'from-pink-400 to-purple-500', keywords: 'princess' },
    { name: 'Animals', emoji: '🐾', gradient: 'from-green-400 to-emerald-600', keywords: 'animal' },
    { name: 'Robots', emoji: '🤖', gradient: 'from-blue-400 to-cyan-500', keywords: 'robot' },
    { name: 'Dinosaurs', emoji: '🦕', gradient: 'from-amber-400 to-orange-500', keywords: 'dinosaur' },
    { name: 'Space', emoji: '🚀', gradient: 'from-indigo-500 to-violet-600', keywords: 'space' },
    { name: 'Magic', emoji: '🪄', gradient: 'from-purple-400 to-pink-500', keywords: 'magic' },
    { name: 'Ocean', emoji: '🐠', gradient: 'from-cyan-400 to-blue-600', keywords: 'ocean sea' }
  ];

  return (
    <div className="px-8 md:px-14 py-12">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-3xl">🎭</span>
        Explore by Character
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onCategoryClick(cat)}
            className={`bg-gradient-to-br ${cat.gradient} p-4 md:p-6 rounded-2xl text-center hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group`}
          >
            <span className="text-4xl md:text-5xl block mb-2 group-hover:scale-110 transition-transform group-hover:animate-bounce">
              {cat.emoji}
            </span>
            <span className="text-white font-bold text-sm md:text-base drop-shadow-lg">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Age Group Selector
const AgeGroupSelector = ({ selected, onSelect }) => {
  const ageGroups = [
    { id: 'all', label: 'All Kids', icon: '👦', range: 'All ages' },
    { id: 'toddler', label: 'Little Ones', icon: '👶', range: '0-4' },
    { id: 'young', label: 'Kids', icon: '🧒', range: '5-8' },
    { id: 'older', label: 'Tweens', icon: '🧑', range: '9-12' }
  ];

  return (
    <div className="px-8 md:px-14 py-6 flex items-center gap-4 overflow-x-auto scrollbar-hide">
      <span className="text-white/70 text-sm font-medium whitespace-nowrap">Age:</span>
      <div className="flex gap-2">
        {ageGroups.map((group) => (
          <button
            key={group.id}
            onClick={() => onSelect(group.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              selected === group.id
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <span>{group.icon}</span>
            <span>{group.label}</span>
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
    tvShows: [],
    newReleases: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [ageGroup, setAgeGroup] = useState('all');

  // Kid-friendly genres
  const ANIMATION_GENRE = 16;
  const FAMILY_GENRE = 10751;

  useEffect(() => {
    const fetchKidsContent = async () => {
      setLoading(true);
      try {
        const [animationData, familyData, popularData, tvShowsData, newReleasesData] = await Promise.all([
          tmdbApi.getMoviesByGenre(ANIMATION_GENRE, 1, 'popularity.desc'),
          tmdbApi.getMoviesByGenre(FAMILY_GENRE, 1, 'popularity.desc'),
          tmdbApi.getPopularMovies(),
          tmdbApi.getPopularTvShows(),
          tmdbApi.getMoviesByGenre(ANIMATION_GENRE, 1, 'release_date.desc')
        ]);

        const filterKidFriendly = (items) =>
          items.filter(item => !item.adult && (item.vote_average >= 5 || !item.vote_average));

        const animation = filterKidFriendly(animationData.results || []).slice(0, 20);
        const family = filterKidFriendly(familyData.results || []).slice(0, 20);
        const featured = animation[Math.floor(Math.random() * Math.min(5, animation.length))] || family[0];

        const popular = filterKidFriendly(popularData.results || [])
          .filter(m => m.genre_ids?.some(g => [ANIMATION_GENRE, FAMILY_GENRE].includes(g)))
          .slice(0, 20);

        const tvShows = filterKidFriendly(tvShowsData.results || [])
          .filter(s => s.genre_ids?.some(g => [ANIMATION_GENRE, FAMILY_GENRE].includes(g)))
          .slice(0, 20);

        const newReleases = filterKidFriendly(newReleasesData.results || []).slice(0, 20);

        setContent({ featured, animation, family, popular, tvShows, newReleases });
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

  const handleCategoryClick = (category) => {
    navigate(`/search?q=${category.keywords}&type=movie`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-[#1a0a2e] to-[#1a0a2e] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 animate-ping" />
            <div className="absolute inset-2 rounded-full border-4 border-pink-500/50 animate-spin" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <span className="text-3xl animate-bounce">🎬</span>
            </div>
          </div>
          <p className="text-white text-xl font-bold">Loading amazing content...</p>
          <p className="text-white/60 text-sm mt-2">Getting ready for fun!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-[#1a0a2e] to-[#1a0a2e]">
      {/* Custom Kids Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-purple-900/95 to-transparent backdrop-blur-sm">
        <div className="flex items-center justify-between px-8 md:px-14 py-4 max-w-screen-2xl mx-auto">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-white text-2xl md:text-3xl font-black tracking-tight">
              <span className="text-pink-400 group-hover:text-pink-300 transition-colors">M</span>OOVIE
            </span>
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              KIDS
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <button className="text-white/70 hover:text-white transition-colors p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Exit Kids
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <KidsHero
        movie={content.featured}
        onPlay={handlePlay}
        onMoreInfo={handleMovieClick}
      />

      {/* Age Group Selector */}
      <AgeGroupSelector selected={ageGroup} onSelect={setAgeGroup} />

      {/* Content Rows */}
      <div className="relative z-10 -mt-8">
        <KidsRow
          title="New Releases"
          emoji="🆕"
          items={content.newReleases}
          onMovieClick={handleMovieClick}
        />

        <KidsRow
          title="Animation Adventures"
          emoji="🎬"
          items={content.animation}
          onMovieClick={handleMovieClick}
        />

        <KidsRow
          title="Family Favorites"
          emoji="👨‍👩‍👧‍👦"
          items={content.family}
          onMovieClick={handleMovieClick}
        />

        <KidsRow
          title="Popular with Kids"
          emoji="⭐"
          items={content.popular}
          onMovieClick={handleMovieClick}
        />

        <KidsRow
          title="TV Shows"
          emoji="📺"
          items={content.tvShows}
          onMovieClick={handleMovieClick}
        />

        {/* Character Categories */}
        <CharacterCategories onCategoryClick={handleCategoryClick} />

        {/* Fun Facts Footer */}
        <div className="px-8 md:px-14 py-12 text-center">
          <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-3xl p-8 max-w-2xl mx-auto backdrop-blur-sm border border-white/10">
            <span className="text-5xl mb-4 block">🎉</span>
            <h3 className="text-white text-xl font-bold mb-2">Did you know?</h3>
            <p className="text-white/70">
              Moovie Kids has thousands of family-friendly titles, all carefully selected for young viewers!
            </p>
          </div>
        </div>
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatDelayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: floatDelayed 4s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Kids;
