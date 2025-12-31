import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

const API_KEY = '617c0260598c225e728db47b98d5ea6f';

const SmartSearch = ({ onClose, onSelect }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ movies: [], tv: [], people: [] });
  const [recentSearches, setRecentSearches] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Check voice support
  useEffect(() => {
    setVoiceSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('moovie-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 10));
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Debounced search
  const searchContent = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults({ movies: [], tv: [], people: [] });
        return;
      }

      setLoading(true);
      try {
        const [moviesRes, tvRes, peopleRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=1`),
          fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=1`),
          fetch(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=1`),
        ]);

        const [movies, tv, people] = await Promise.all([
          moviesRes.json(),
          tvRes.json(),
          peopleRes.json(),
        ]);

        setResults({
          movies: movies.results?.slice(0, 6) || [],
          tv: tv.results?.slice(0, 6) || [],
          people: people.results?.slice(0, 6) || [],
        });
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    searchContent(query);
  }, [query, searchContent]);

  // Voice search
  const startVoiceSearch = () => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setQuery(transcript);
    };

    recognition.start();
  };

  // Save to recent searches
  const saveSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('moovie-recent-searches', JSON.stringify(updated));
  };

  const handleSelect = (item, type) => {
    saveSearch(item.title || item.name);
    onClose();
    if (type === 'movie') {
      navigate(`/movie/${item.id}`);
    } else if (type === 'tv') {
      navigate(`/series/${item.id}`);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('moovie-recent-searches');
  };

  const hasResults = results.movies.length > 0 || results.tv.length > 0 || results.people.length > 0;

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Search</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <div className="flex items-center bg-gray-800 rounded-lg border-2 border-gray-700 focus-within:border-netflix-red transition-colors">
            <svg className="w-6 h-6 text-gray-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV shows, people..."
              className="flex-1 bg-transparent text-white text-lg px-4 py-4 outline-none placeholder-gray-500"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-gray-400 hover:text-white p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {voiceSupported && (
              <button
                onClick={startVoiceSearch}
                className={`p-3 mr-2 rounded-full transition-colors ${
                  isListening
                    ? 'bg-netflix-red text-white animate-pulse'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            )}
          </div>
          {isListening && (
            <p className="absolute -bottom-6 left-0 text-netflix-red text-sm animate-pulse">
              Listening... Speak now
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Recent Searches */}
        {!query && !loading && recentSearches.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Searches</h3>
              <button
                onClick={clearRecentSearches}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(search)}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trending */}
        {!query && !loading && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Trending Searches</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Squid Game', 'Wednesday', 'The Last of Us', 'Breaking Bad', 'Stranger Things', 'Money Heist', 'The Crown', 'Dark'].map((trend) => (
                <button
                  key={trend}
                  onClick={() => setQuery(trend)}
                  className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white p-4 rounded-lg text-left transition-colors"
                >
                  <span className="text-sm text-gray-400">#</span> {trend}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Tabs */}
        {query && hasResults && !loading && (
          <>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {['all', 'movies', 'tv', 'people'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'bg-white text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {tab === 'all' && 'All'}
                  {tab === 'movies' && `Movies (${results.movies.length})`}
                  {tab === 'tv' && `TV Shows (${results.tv.length})`}
                  {tab === 'people' && `People (${results.people.length})`}
                </button>
              ))}
            </div>

            {/* Results Grid */}
            <div className="space-y-8">
              {/* Movies */}
              {(activeTab === 'all' || activeTab === 'movies') && results.movies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Movies</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {results.movies.map((movie) => (
                      <button
                        key={movie.id}
                        onClick={() => handleSelect(movie, 'movie')}
                        className="group text-left"
                      >
                        <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 mb-2">
                          {movie.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                              alt={movie.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <h4 className="text-white text-sm font-medium truncate group-hover:text-netflix-red transition-colors">
                          {movie.title}
                        </h4>
                        <p className="text-gray-500 text-xs">{movie.release_date?.split('-')[0]}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TV Shows */}
              {(activeTab === 'all' || activeTab === 'tv') && results.tv.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">TV Shows</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {results.tv.map((show) => (
                      <button
                        key={show.id}
                        onClick={() => handleSelect(show, 'tv')}
                        className="group text-left"
                      >
                        <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 mb-2">
                          {show.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                              alt={show.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <h4 className="text-white text-sm font-medium truncate group-hover:text-netflix-red transition-colors">
                          {show.name}
                        </h4>
                        <p className="text-gray-500 text-xs">{show.first_air_date?.split('-')[0]}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* People */}
              {(activeTab === 'all' || activeTab === 'people') && results.people.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">People</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {results.people.map((person) => (
                      <div key={person.id} className="text-center">
                        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-800 mb-2">
                          {person.profile_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <h4 className="text-white text-sm font-medium truncate">{person.name}</h4>
                        <p className="text-gray-500 text-xs capitalize">{person.known_for_department}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* No Results */}
        {query && !hasResults && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-gray-400">Try searching for something else</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartSearch;
