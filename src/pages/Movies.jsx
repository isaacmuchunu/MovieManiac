import { useState, useEffect } from 'react';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';
import { tmdbApi } from '../lib/tmdbProxy';

const Movies = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await tmdbApi.getMovieGenres();
        setGenres(data.genres?.slice(0, 8) || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchGenreMovies = async () => {
      if (genres.length === 0) return;

      try {
        const moviesByGenre = {};
        await Promise.all(
          genres.map(async (genre) => {
            const data = await tmdbApi.getMoviesByGenre(genre.id, 1);
            moviesByGenre[genre.id] = data.results?.slice(0, 20) || [];
          })
        );
        setGenreMovies(moviesByGenre);
      } catch (error) {
        console.error('Error fetching genre movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreMovies();
  }, [genres]);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div className="min-h-screen bg-netflix-black pt-24 md:pt-28 pb-12">
      {/* Header */}
      <div className="px-4 md:px-14 py-8 mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Movies</h1>
        <p className="text-gray-400">
          Explore our collection of movies across all genres
        </p>
      </div>

      {/* Movie Rows by Genre */}
      <div className="space-y-8 md:space-y-10">
        <MovieRow
          title="Popular Movies"
          type="popular"
          onMovieClick={handleMovieClick}
        />

        <MovieRow
          title="Top Rated Movies"
          type="top_rated"
          onMovieClick={handleMovieClick}
        />

        <MovieRow
          title="Now Playing"
          type="now_playing"
          onMovieClick={handleMovieClick}
        />

        {genres.map((genre) => (
          genreMovies[genre.id]?.length > 0 && (
            <MovieRow
              key={genre.id}
              title={genre.name}
              movies={genreMovies[genre.id]}
              onMovieClick={handleMovieClick}
            />
          )
        ))}

        <MovieRow
          title="Upcoming Releases"
          type="upcoming"
          onMovieClick={handleMovieClick}
        />
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
};

export default Movies;
