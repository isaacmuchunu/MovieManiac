import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_KEY = '617c0260598c225e728db47b98d5ea6f';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

const PlayIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const InfoIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Hero = ({ onMoreInfo }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMovie = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await response.json();
        // Get a random movie from top 5
        const randomIndex = Math.floor(Math.random() * Math.min(5, data.results.length));
        setMovie(data.results[randomIndex]);
      } catch (error) {
        console.error('Error fetching featured movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMovie();
  }, []);

  if (loading) {
    return (
      <div className="relative h-[85vh] bg-netflix-dark-gray animate-pulse">
        <div className="absolute bottom-1/4 left-4 md:left-14 space-y-4">
          <div className="h-12 w-96 bg-netflix-medium-gray rounded"></div>
          <div className="h-6 w-80 bg-netflix-medium-gray rounded"></div>
          <div className="h-24 w-[500px] bg-netflix-medium-gray rounded"></div>
          <div className="flex gap-4">
            <div className="h-12 w-32 bg-netflix-medium-gray rounded"></div>
            <div className="h-12 w-40 bg-netflix-medium-gray rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="relative h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${IMAGE_BASE}${movie.backdrop_path})`,
        }}
      />

      {/* Gradient Overlays */}
      <div className="hero-gradient absolute inset-0" />
      <div className="hero-gradient-left absolute inset-0" />

      {/* Content */}
      <div className="absolute bottom-1/4 left-4 md:left-14 max-w-2xl z-10 animate-fade-in">
        {/* Netflix Original Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-netflix-red font-bold text-xl tracking-widest">N</span>
          <span className="text-gray-300 text-sm font-light tracking-widest uppercase">Film</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
          {movie.title}
        </h1>

        {/* Info Row */}
        <div className="flex items-center gap-3 mb-4 text-sm">
          <span className="text-green-500 font-semibold">
            {Math.round(movie.vote_average * 10)}% Match
          </span>
          <span className="text-gray-400">{movie.release_date?.split('-')[0]}</span>
          <span className="maturity-badge">HD</span>
        </div>

        {/* Overview */}
        <p className="text-base md:text-lg text-gray-200 mb-6 line-clamp-3 drop-shadow-md">
          {movie.overview}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button className="btn-netflix text-lg py-3 px-8">
            <PlayIcon />
            Play
          </button>
          <button
            className="btn-netflix-outline text-lg py-3 px-6"
            onClick={() => onMoreInfo && onMoreInfo(movie)}
          >
            <InfoIcon />
            More Info
          </button>
        </div>
      </div>

      {/* Maturity Rating Badge */}
      <div className="absolute bottom-1/4 right-0 flex items-center">
        <div className="bg-gray-800/80 border-l-2 border-gray-400 py-1 px-4">
          <span className="text-sm text-gray-300">16+</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
