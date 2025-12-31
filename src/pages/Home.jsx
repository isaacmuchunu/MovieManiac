import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import TopTenRow from '../components/TopTenRow';
import MovieModal from '../components/MovieModal';
import AIRecommendations from '../components/AIRecommendations';
import WatchParty from '../components/WatchParty';

const API_KEY = '617c0260598c225e728db47b98d5ea6f';

const Home = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
        );
        const data = await response.json();
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
    <div className="min-h-screen bg-netflix-black">
      {/* Hero Section */}
      <Hero onMoreInfo={handleMovieClick} />

      {/* Movie Rows - positioned to overlap hero */}
      <div className="relative -mt-32 z-10 space-y-2">
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

        {/* AI Recommendations Section */}
        <div className="px-4 md:px-12 py-6">
          <AIRecommendations />
        </div>

        {/* Top Rated */}
        <MovieRow
          title="Top Rated"
          type="top_rated"
          onMovieClick={handleMovieClick}
        />

        {/* Popular */}
        <MovieRow
          title="Popular on MovieMania"
          type="popular"
          onMovieClick={handleMovieClick}
        />

        {/* Watch Party Section */}
        <div className="px-4 md:px-12 py-6">
          <WatchParty />
        </div>

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
