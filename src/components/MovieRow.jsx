import { useState, useRef, useEffect } from 'react';
import MovieCard from './MovieCard';

const ChevronLeftIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const API_KEY = '617c0260598c225e728db47b98d5ea6f';

const MovieRow = ({ title, type, movies: propMovies, onMovieClick }) => {
  const [movies, setMovies] = useState(propMovies || []);
  const [loading, setLoading] = useState(!propMovies);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const rowRef = useRef(null);

  useEffect(() => {
    if (propMovies) {
      setMovies(propMovies);
      setLoading(false);
      return;
    }

    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${type}?api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await response.json();
        setMovies(data.results?.slice(0, 20) || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    if (type) {
      fetchMovies();
    }
  }, [type, propMovies]);

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.8;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 px-4 md:px-14">
          {title}
        </h2>
        <div className="flex gap-2 px-4 md:px-14 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[200px] md:w-[250px]">
              <div className="aspect-video skeleton rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!movies.length) return null;

  return (
    <div className="mb-8 movie-row-container relative group">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-2 px-4 md:px-14 flex items-center gap-2 cursor-pointer group/title">
        {title}
        <span className="text-netflix-red text-sm opacity-0 group-hover/title:opacity-100 transition-opacity flex items-center gap-1">
          Explore All <ChevronRightIcon className="w-4 h-4" />
        </span>
      </h2>

      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          className="row-arrow row-arrow-left"
          onClick={() => scroll('left')}
        >
          <ChevronLeftIcon />
        </button>
      )}

      {/* Movie Row */}
      <div
        ref={rowRef}
        className="movie-row hide-scrollbar"
        onScroll={handleScroll}
      >
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            index={index}
            onClick={() => onMovieClick && onMovieClick(movie)}
          />
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          className="row-arrow row-arrow-right"
          onClick={() => scroll('right')}
        >
          <ChevronRightIcon />
        </button>
      )}
    </div>
  );
};

export default MovieRow;
