import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';

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
  { name: 'Kungfu', slug: 'kungfu', icon: '🥋' },
];

const COUNTRIES = [
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

// Sample data - in production, this would come from the API
const generateSampleContent = (count = 20) => {
  const titles = [
    'The Dark Knight', 'Inception', 'Interstellar', 'Parasite', 'The Godfather',
    'Pulp Fiction', 'Fight Club', 'The Matrix', 'Forrest Gump', 'The Shawshank Redemption',
    'Breaking Bad', 'Game of Thrones', 'Stranger Things', 'The Crown', 'Money Heist',
    'Squid Game', 'Wednesday', 'The Last of Us', 'House of the Dragon', 'Peaky Blinders'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: titles[i % titles.length],
    poster_path: `https://picsum.photos/seed/${i + 100}/300/450`,
    backdrop_path: `https://picsum.photos/seed/${i + 200}/1280/720`,
    vote_average: (7 + Math.random() * 2).toFixed(1),
    release_date: `${2020 + Math.floor(Math.random() * 4)}-0${1 + Math.floor(Math.random() * 9)}-${10 + Math.floor(Math.random() * 18)}`,
    type: Math.random() > 0.5 ? 'movie' : 'series',
    genres: GENRES.slice(Math.floor(Math.random() * 5), Math.floor(Math.random() * 5) + 3).map(g => g.name),
  }));
};

function Browse() {
  const { genre } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || '');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'popularity');
  const [selectedRating, setSelectedRating] = useState(searchParams.get('rating') || 'all');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');

  const currentGenre = genre ? GENRES.find(g => g.slug === genre) : null;

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setContent(generateSampleContent(24));
      setLoading(false);
    }, 500);
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

  const years = Array.from({ length: 30 }, (_, i) => 2024 - i);

  return (
    <div className="min-h-screen bg-netflix-black pt-20 px-4 md:px-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {currentGenre ? (
                <span className="flex items-center gap-3">
                  <span>{currentGenre.icon}</span>
                  {currentGenre.name}
                </span>
              ) : (
                'Browse All'
              )}
            </h1>
            <p className="text-gray-400 mt-2">
              {content.length} titles available
            </p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {(selectedType !== 'all' || selectedCountry || selectedRating !== 'all' || selectedYear) && (
              <span className="bg-netflix-red text-white text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Genre Pills */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2">
          <Link
            to="/browse"
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !genre
                ? 'bg-white text-black'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            All
          </Link>
          {GENRES.map((g) => (
            <Link
              key={g.slug}
              to={`/browse/${g.slug}`}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                genre === g.slug
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {g.icon} {g.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 mb-8 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Filter & Sort</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear all
            </button>
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
                className="w-full bg-gray-800 text-white rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-netflix-red"
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
                className="w-full bg-gray-800 text-white rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-netflix-red"
              >
                <option value="">All Countries</option>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
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
                className="w-full bg-gray-800 text-white rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-netflix-red"
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
                className="w-full bg-gray-800 text-white rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-netflix-red"
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
                className="w-full bg-gray-800 text-white rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-netflix-red"
              >
                {SORT_OPTIONS.map((sort) => (
                  <option key={sort.value} value={sort.value}>
                    {sort.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Country Quick Select */}
          <div className="mt-6">
            <label className="block text-sm text-gray-400 mb-3">Quick Select Country</label>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.slice(0, 8).map((country) => (
                <button
                  key={country.code}
                  onClick={() => {
                    setSelectedCountry(country.code);
                    updateFilter('country', country.code);
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedCountry === country.code
                      ? 'bg-netflix-red text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {country.flag} {country.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Grid */}
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {content.map((item) => (
              <div key={item.id} className="relative group">
                <MovieCard movie={item} />
                {/* IMDB Rating Badge */}
                <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {item.vote_average}
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

          {/* Load More */}
          <div className="mt-12 text-center">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-md transition-colors">
              Load More
            </button>
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && content.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-white text-xl font-semibold mb-2">No content found</h3>
          <p className="text-gray-400">Try adjusting your filters</p>
          <button
            onClick={clearFilters}
            className="mt-4 bg-netflix-red hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default Browse;
