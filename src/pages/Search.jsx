import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';

const API_KEY = '617c0260598c225e728db47b98d5ea6f';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const searchMovies = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
        );
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error('Error searching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [query]);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div className="min-h-screen bg-netflix-black pt-24 px-4 md:px-14">
      {/* Search Header */}
      <div className="mb-8">
        {query ? (
          <h1 className="text-2xl md:text-3xl text-white">
            {loading ? (
              'Searching...'
            ) : results.length > 0 ? (
              <>Results for "<span className="text-gray-400">{query}</span>"</>
            ) : (
              <>No results found for "<span className="text-gray-400">{query}</span>"</>
            )}
          </h1>
        ) : (
          <h1 className="text-2xl md:text-3xl text-white">
            Search for movies, TV shows, and more...
          </h1>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-video skeleton rounded-md"></div>
          ))}
        </div>
      )}

      {/* Results Grid */}
      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {results.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              index={index}
              onClick={() => handleMovieClick(movie)}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && query && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-4">
            Your search for "{query}" did not have any matches.
          </p>
          <p className="text-gray-500">
            Suggestions:
          </p>
          <ul className="text-gray-500 mt-2 space-y-1">
            <li>Try different keywords</li>
            <li>Looking for a movie or TV show?</li>
            <li>Try using a movie, TV show title, or actor name</li>
          </ul>
        </div>
      )}

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
};

export default Search;
