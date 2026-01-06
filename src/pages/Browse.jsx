import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import Loading from '../components/Loading';
import { tmdbApi } from '../lib/videoProviders';

// TMDB genre IDs mapping
const TMDB_GENRE_IDS = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  'sci-fi': 878,
  thriller: 53,
  war: 10752,
  western: 37,
};

// 36 genres for 4x9 grid
const GENRES = [
  { name: 'Action', slug: 'action', icon: '💥' },
  { name: 'Adventure', slug: 'adventure', icon: '🗺️' },
  { name: 'Animation', slug: 'animation', icon: '🎬' },
  { name: 'Biography', slug: 'biography', icon: '📖' },
  { name: 'Comedy', slug: 'comedy', icon: '😂' },
  { name: 'Crime', slug: 'crime', icon: '🔍' },
  { name: 'Documentary', slug: 'documentary', icon: '🎥' },
  { name: 'Drama', slug: 'drama', icon: '🎭' },
  { name: 'Family', slug: 'family', icon: '👨‍👩‍👧‍👦' },
  { name: 'Fantasy', slug: 'fantasy', icon: '🧙' },
  { name: 'History', slug: 'history', icon: '📜' },
  { name: 'Horror', slug: 'horror', icon: '👻' },
  { name: 'Music', slug: 'music', icon: '🎵' },
  { name: 'Mystery', slug: 'mystery', icon: '🕵️' },
  { name: 'Romance', slug: 'romance', icon: '💕' },
  { name: 'Sci-Fi', slug: 'sci-fi', icon: '🚀' },
  { name: 'Thriller', slug: 'thriller', icon: '😱' },
  { name: 'War', slug: 'war', icon: '⚔️' },
  { name: 'Western', slug: 'western', icon: '🤠' },
  { name: 'Anime', slug: 'anime', icon: '🎌' },
  { name: 'Martial Arts', slug: 'martial-arts', icon: '🥋' },
  { name: 'Sports', slug: 'sports', icon: '⚽' },
  { name: 'Superhero', slug: 'superhero', icon: '🦸' },
  { name: 'Supernatural', slug: 'supernatural', icon: '👁️' },
  { name: 'Teen', slug: 'teen', icon: '🎒' },
  { name: 'Noir', slug: 'noir', icon: '🌙' },
  { name: 'Disaster', slug: 'disaster', icon: '🌋' },
  { name: 'Spy', slug: 'spy', icon: '🕶️' },
  { name: 'Heist', slug: 'heist', icon: '💰' },
  { name: 'Zombie', slug: 'zombie', icon: '🧟' },
  { name: 'Psychological', slug: 'psychological', icon: '🧠' },
  { name: 'Romantic Comedy', slug: 'rom-com', icon: '💝' },
  { name: 'Dark Comedy', slug: 'dark-comedy', icon: '🖤' },
  { name: 'Slice of Life', slug: 'slice-of-life', icon: '☕' },
  { name: 'Epic', slug: 'epic', icon: '⚔️' },
  { name: 'Cult Classic', slug: 'cult', icon: '🎪' },
];

// 36 countries for 4x9 grid
export const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
];

const CONTENT_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'movie', label: 'Movies' },
  { value: 'series', label: 'TV Series' },
  { value: 'documentary', label: 'Documentaries' },
  { value: 'anime', label: 'Anime' },
];

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'release_date', label: 'Release Date' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'title', label: 'A-Z' },
];

const RATING_FILTERS = [
  { value: 'all', label: 'All Ratings' },
  { value: '9', label: '9+ Stars' },
  { value: '8', label: '8+ Stars' },
  { value: '7', label: '7+ Stars' },
  { value: '6', label: '6+ Stars' },
];

// Genre Dropdown Component
const GenreDropdown = ({ currentGenre, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-netflix-dark-gray hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg transition-colors border border-gray-700"
      >
        <span className="text-lg">{currentGenre?.icon || '🎬'}</span>
        <span className="font-medium">{currentGenre?.name || 'Browse Genres'}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-netflix-dark-gray border border-gray-700 rounded-xl shadow-2xl z-50 p-4 w-[600px] max-w-[95vw]">
          <div className="mb-3 pb-2 border-b border-gray-700">
            <h3 className="text-white font-semibold">Select Genre</h3>
          </div>
          <div className="grid grid-cols-4 gap-2 max-h-[400px] overflow-y-auto">
            <button
              onClick={() => {
                onSelect(null);
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                !currentGenre
                  ? 'bg-netflix-red text-white'
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              <span>🎬</span>
              <span className="text-sm truncate">All Genres</span>
            </button>
            {GENRES.map((genre) => (
              <button
                key={genre.slug}
                onClick={() => {
                  onSelect(genre);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                  currentGenre?.slug === genre.slug
                    ? 'bg-netflix-red text-white'
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                <span>{genre.icon}</span>
                <span className="text-sm truncate">{genre.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function Browse() {
  const { genre } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Filter states
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || '');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'popularity');
  const [selectedRating, setSelectedRating] = useState(searchParams.get('rating') || 'all');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');

  const currentGenre = genre ? GENRES.find(g => g.slug === genre) : null;
  const currentCountry = selectedCountry ? COUNTRIES.find(c => c.code === selectedCountry) : null;

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleGenreSelect = (selectedGenre) => {
    if (selectedGenre) {
      navigate(`/browse/${selectedGenre.slug}`);
    } else {
      navigate('/browse');
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        let results = [];

        const fetchMovies = selectedType === 'all' || selectedType === 'movie';
        const fetchTV = selectedType === 'all' || selectedType === 'series';

        const genreId = genre ? TMDB_GENRE_IDS[genre] : null;

        if (genreId) {
          const moviePromise = fetchMovies ? tmdbApi.discoverByGenre(genreId, 'movie') : Promise.resolve({ results: [] });
          const tvPromise = fetchTV ? tmdbApi.discoverByGenre(genreId, 'tv') : Promise.resolve({ results: [] });

          const [movieData, tvData] = await Promise.all([moviePromise, tvPromise]);

          results = [
            ...(movieData.results || []).map(m => ({ ...m, media_type: 'movie' })),
            ...(tvData.results || []).map(t => ({ ...t, media_type: 'tv' }))
          ];
        } else if (selectedCountry) {
          // Fetch by country
          const moviePromise = fetchMovies ? tmdbApi.discoverByCountry(selectedCountry, 'movie') : Promise.resolve({ results: [] });
          const tvPromise = fetchTV ? tmdbApi.discoverByCountry(selectedCountry, 'tv') : Promise.resolve({ results: [] });

          const [movieData, tvData] = await Promise.all([moviePromise, tvPromise]);

          results = [
            ...(movieData.results || []).map(m => ({ ...m, media_type: 'movie' })),
            ...(tvData.results || []).map(t => ({ ...t, media_type: 'tv' }))
          ];
        } else {
          const trendingData = await tmdbApi.getTrending();
          results = trendingData.results || [];

          if (selectedType === 'movie') {
            results = results.filter(item => item.media_type === 'movie');
          } else if (selectedType === 'series') {
            results = results.filter(item => item.media_type === 'tv');
          }
        }

        // Apply rating filter
        if (selectedRating !== 'all') {
          const minRating = parseFloat(selectedRating);
          results = results.filter(item => item.vote_average >= minRating);
        }

        // Apply year filter
        if (selectedYear) {
          results = results.filter(item => {
            const releaseDate = item.release_date || item.first_air_date;
            return releaseDate && releaseDate.startsWith(selectedYear);
          });
        }

        // Apply sorting
        if (selectedSort === 'rating') {
          results.sort((a, b) => b.vote_average - a.vote_average);
        } else if (selectedSort === 'release_date') {
          results.sort((a, b) => {
            const dateA = new Date(a.release_date || a.first_air_date || 0);
            const dateB = new Date(b.release_date || b.first_air_date || 0);
            return dateB - dateA;
          });
        } else if (selectedSort === 'title') {
          results.sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''));
        }

        setContent(results.map(item => ({
          id: item.id,
          title: item.title || item.name,
          poster_path: item.poster_path,
          backdrop_path: item.backdrop_path,
          vote_average: item.vote_average,
          release_date: item.release_date || item.first_air_date,
          type: item.media_type === 'tv' ? 'series' : 'movie',
          overview: item.overview
        })));
      } catch (error) {
        console.error('Error fetching content:', error);
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [genre, selectedType, selectedCountry, selectedSort, selectedRating, selectedYear]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSelectedType('all');
    setSelectedCountry('');
    setSelectedSort('popularity');
    setSelectedRating('all');
    setSelectedYear('');
    setSearchParams({});
  };

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  const hasActiveFilters = selectedType !== 'all' || selectedCountry || selectedRating !== 'all' || selectedYear;

  return (
    <div className="min-h-screen bg-netflix-black pt-24 md:pt-28 px-4 md:px-8 lg:px-14 pb-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Genre Dropdown */}
            <GenreDropdown
              currentGenre={currentGenre}
              onSelect={handleGenreSelect}
            />

            {/* Country Badge */}
            {currentCountry && (
              <div className="flex items-center gap-2 bg-netflix-red text-white px-4 py-2 rounded-lg">
                <span>{currentCountry.name}</span>
                <button
                  onClick={() => {
                    setSelectedCountry('');
                    updateFilter('country', '');
                  }}
                  className="ml-2 hover:bg-red-700 rounded-full p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-400">{content.length} titles</span>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters
                  ? 'bg-netflix-red text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {hasActiveFilters && (
                <span className="bg-white text-netflix-red text-xs px-2 py-0.5 rounded-full font-bold">
                  {[selectedType !== 'all', selectedCountry, selectedRating !== 'all', selectedYear].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 mb-10 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold text-lg">Filter & Sort</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-netflix-red hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Content Type */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  updateFilter('type', e.target.value === 'all' ? '' : e.target.value);
                }}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-netflix-red border border-gray-700"
              >
                {CONTENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  updateFilter('country', e.target.value);
                }}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-netflix-red border border-gray-700"
              >
                <option value="">All Countries</option>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  updateFilter('year', e.target.value);
                }}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-netflix-red border border-gray-700"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Rating</label>
              <select
                value={selectedRating}
                onChange={(e) => {
                  setSelectedRating(e.target.value);
                  updateFilter('rating', e.target.value === 'all' ? '' : e.target.value);
                }}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-netflix-red border border-gray-700"
              >
                {RATING_FILTERS.map((rating) => (
                  <option key={rating.value} value={rating.value}>
                    {rating.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Sort By</label>
              <select
                value={selectedSort}
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  updateFilter('sort', e.target.value);
                }}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-netflix-red border border-gray-700"
              >
                {SORT_OPTIONS.map((sort) => (
                  <option key={sort.value} value={sort.value}>
                    {sort.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content Grid */}
      {loading ? (
        <Loading />
      ) : (
        <>
          {content.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {content.map((item) => (
                <div key={item.id} className="relative group">
                  <MovieCard movie={item} onClick={handleMovieClick} />
                  {/* IMDB Rating Badge */}
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {item.vote_average?.toFixed(1)}
                  </div>
                  {/* Content Type Badge */}
                  {item.type === 'series' && (
                    <div className="absolute top-2 left-2 bg-netflix-red text-white text-xs font-bold px-2 py-1 rounded">
                      Series
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-white text-xl font-semibold mb-2">No content found</h3>
              <p className="text-gray-400 mb-4">Try adjusting your filters</p>
              <button
                onClick={clearFilters}
                className="bg-netflix-red hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}

export default Browse;
