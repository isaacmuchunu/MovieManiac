import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

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

const TopTenCard = ({ movie, rank, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(movie);
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  return (
    <div
      className="flex-shrink-0 flex items-end cursor-pointer group"
      onClick={handleClick}
    >
      {/* Rank Number */}
      <div
        className="relative -mr-6 z-10 text-[140px] font-black leading-none select-none"
        style={{
          WebkitTextStroke: '4px #404040',
          color: 'transparent',
          textShadow: '4px 4px 0 #141414'
        }}
      >
        {rank}
      </div>

      {/* Poster */}
      <div className="relative w-[120px] h-[170px] rounded overflow-hidden transition-transform duration-300 group-hover:scale-105">
        {movie.poster_path ? (
          <img
            src={`${IMAGE_BASE}${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-netflix-medium-gray flex items-center justify-center">
            <span className="text-gray-500 text-xs text-center px-2">{movie.title}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const TopTenRow = ({ title, movies, onMovieClick }) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const rowRef = useRef(null);

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

  if (!movies || movies.length === 0) return null;

  const top10Movies = movies.slice(0, 10);

  return (
    <div className="mb-8 movie-row-container relative group">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-2 px-4 md:px-14 flex items-center gap-3">
        <span className="bg-netflix-red px-2 py-1 text-sm font-bold rounded">TOP 10</span>
        {title}
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

      {/* Row */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto pb-10 pt-2 px-4 md:px-14 hide-scrollbar"
        onScroll={handleScroll}
      >
        {top10Movies.map((movie, index) => (
          <TopTenCard
            key={movie.id}
            movie={movie}
            rank={index + 1}
            onClick={onMovieClick}
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

export default TopTenRow;
