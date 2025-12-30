import { useState, useEffect } from 'react';
import MovieRow from '../components/MovieRow';
import MovieModal from '../components/MovieModal';

const API_KEY = '617c0260598c225e728db47b98d5ea6f';

const Movies = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        const data = await response.json();
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
            const response = await fetch(
              `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}&language=en-US&page=1`
            );
            const data = await response.json();
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
    <div className="min-h-screen bg-netflix-black pt-20">
      {/* Header */}
      <div className="px-4 md:px-14 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Movies</h1>
        <p className="text-gray-400">
          Explore our collection of movies across all genres
        </p>
      </div>

      {/* Movie Rows by Genre */}
      <div className="space-y-2">
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
