import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const PlayIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ThumbUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const MovieCard = ({ movie, index, onClick, isTopTen = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handlePlay = (e) => {
    e.stopPropagation();
    const type = movie.first_air_date ? 'tv' : 'movie';
    navigate(`/watch/${type}/${movie.id}`);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(movie);
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  const getMatchPercentage = () => {
    return Math.round(movie.vote_average * 10);
  };

  const getYear = () => {
    return movie.release_date?.split('-')[0] || 'N/A';
  };

  const genres = ['Action', 'Thriller', 'Drama'];

  return (
    <div
      className="movie-card flex-shrink-0 w-[160px] md:w-[200px] lg:w-[240px] relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transitionDelay: isHovered ? '300ms' : '0ms',
      }}
    >
      {/* Main Card */}
      <div className="relative rounded-md overflow-hidden bg-netflix-dark-gray">
        {/* Image */}
        {!imageError && movie.backdrop_path ? (
          <img
            src={`${IMAGE_BASE}${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full aspect-video object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : movie.poster_path && !imageError ? (
          <img
            src={`${IMAGE_BASE}${movie.poster_path}`}
            alt={movie.title}
            className="w-full aspect-video object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full aspect-video bg-netflix-medium-gray flex items-center justify-center">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}

        {/* Number badge for Top 10 */}
        {isTopTen && index !== undefined && index < 10 && (
          <div className="absolute -left-2 bottom-0 text-7xl font-bold text-netflix-black" style={{
            WebkitTextStroke: '2px white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            {index + 1}
          </div>
        )}
      </div>

      {/* Hover Card - Expanded Info */}
      {isHovered && (
        <div
          className="absolute -left-4 -right-4 -bottom-4 bg-netflix-dark-gray rounded-md shadow-2xl z-50 animate-scale-in overflow-hidden"
          onClick={handleClick}
        >
          {/* Preview Image/Video */}
          <div className="relative">
            {!imageError && movie.backdrop_path ? (
              <img
                src={`${IMAGE_BASE}${movie.backdrop_path}`}
                alt={movie.title}
                className="w-full aspect-video object-cover"
              />
            ) : (
              <div className="w-full aspect-video bg-netflix-medium-gray"></div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark-gray via-transparent to-transparent"></div>
          </div>

          {/* Info Section */}
          <div className="p-3 space-y-3">
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePlay}
                  className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <PlayIcon />
                </button>
                <button className="btn-icon-sm">
                  <PlusIcon />
                </button>
                <button className="btn-icon-sm">
                  <ThumbUpIcon />
                </button>
              </div>
              <button
                className="btn-icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                <ChevronDownIcon />
              </button>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-500 font-semibold">{getMatchPercentage()}% Match</span>
              <span className="maturity-badge text-xs">16+</span>
              <span className="text-gray-400">{getYear()}</span>
              <span className="maturity-badge text-xs">HD</span>
            </div>

            {/* Genres */}
            <div className="flex items-center gap-1 flex-wrap">
              {genres.map((genre) => (
                <span key={genre} className="genre-tag">{genre}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
