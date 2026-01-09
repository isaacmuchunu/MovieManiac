import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import TopTenRow from '../components/TopTenRow';
import MovieModal from '../components/MovieModal';
import { tmdbApi } from '../lib/tmdbProxy';

const Home = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await tmdbApi.getTrendingMovies('week', 1);
        setTrendingMovies(data.results?.slice(0, 10) || []);
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

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen bg-netflix-black pt-16 md:pt-20">
      {/* Hero Section */}
      <Hero onMoreInfo={handleMovieClick} />

      {/* Movie Rows - positioned with controlled spacing from hero */}
      <div className="relative -mt-24 pt-6 z-10 space-y-14 md:space-y-16 pb-20">
        {/* Trending Now */}
        <MovieRow
          title="Trending Now"
          movies={trendingMovies}
          onMovieClick={handleMovieClick}
        />

        {/* Top 10 Movies */}
        <TopTenRow
          title="Top 10 Movies Today"
          movies={trendingMovies}
          onMovieClick={handleMovieClick}
        />

        {/* Top Rated */}
        <MovieRow
          title="Top Rated"
          type="top_rated"
          onMovieClick={handleMovieClick}
        />

        {/* Popular */}
        <MovieRow
          title="Popular on Moovie"
          type="popular"
          onMovieClick={handleMovieClick}
        />

        {/* Now Playing */}
        <MovieRow
          title="Now Playing"
          type="now_playing"
          onMovieClick={handleMovieClick}
        />

        {/* Upcoming */}
        <MovieRow
          title="Coming Soon"
          type="upcoming"
          onMovieClick={handleMovieClick}
        />

        {/* Top 10 TV Shows */}
        <TopTenRow
          title="Top 10 TV Shows Today"
          movies={trendingMovies}
          onMovieClick={handleMovieClick}
        />

        {/* Action Movies - using discover */}
        <MovieRow
          title="Action Blockbusters"
          type="popular"
          onMovieClick={handleMovieClick}
        />
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Home;
