import { useEffect, useState } from 'react';
import MovieRow from './MovieRow';

const API_KEY = '617c0260598c225e728db47b98d5ea6f';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PlusIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ThumbUpIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
  </svg>
);

const VolumeOnIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

const VolumeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
  </svg>
);

const MovieModal = ({ movie, onClose }) => {
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [detailsRes, creditsRes, similarRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=${API_KEY}&language=en-US&page=1`)
        ]);

        const [detailsData, creditsData, similarData] = await Promise.all([
          detailsRes.json(),
          creditsRes.json(),
          similarRes.json()
        ]);

        setDetails(detailsData);
        setCredits(creditsData);
        setSimilar(similarData.results?.slice(0, 12) || []);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (movie?.id) {
      fetchDetails();
    }
  }, [movie?.id]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!movie) return null;

  const getMatchPercentage = () => Math.round((details?.vote_average || movie.vote_average) * 10);
  const getYear = () => (details?.release_date || movie.release_date)?.split('-')[0] || 'N/A';
  const getRuntime = () => {
    if (!details?.runtime) return 'N/A';
    const hours = Math.floor(details.runtime / 60);
    const mins = details.runtime % 60;
    return `${hours}h ${mins}m`;
  };

  const director = credits?.crew?.find(c => c.job === 'Director');
  const topCast = credits?.cast?.slice(0, 5) || [];
  const genres = details?.genres || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 overflow-y-auto bg-black/70"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl mx-4 bg-netflix-dark-gray rounded-lg overflow-hidden shadow-2xl animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-netflix-dark-gray flex items-center justify-center hover:bg-gray-700 transition-colors"
        >
          <CloseIcon />
        </button>

        {/* Hero Section */}
        <div className="relative h-[400px] overflow-hidden">
          <img
            src={`${IMAGE_BASE}${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark-gray via-transparent to-black/30"></div>

          {/* Content over hero */}
          <div className="absolute bottom-8 left-8 right-8">
            <h1 className="text-4xl font-bold text-white mb-4">{movie.title}</h1>
            <div className="flex items-center gap-4">
              <button className="btn-netflix text-lg py-3 px-8">
                <PlayIcon />
                Play
              </button>
              <button className="btn-icon">
                <PlusIcon />
              </button>
              <button className="btn-icon">
                <ThumbUpIcon />
              </button>
              <div className="ml-auto">
                <button
                  className="btn-icon"
                  onClick={() => setMuted(!muted)}
                >
                  {muted ? <VolumeOffIcon /> : <VolumeOnIcon />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-8">
          <div className="flex gap-8">
            {/* Left Column */}
            <div className="flex-1">
              {/* Meta Info */}
              <div className="flex items-center gap-3 mb-4 text-sm">
                <span className="text-green-500 font-semibold">{getMatchPercentage()}% Match</span>
                <span className="text-gray-400">{getYear()}</span>
                <span className="maturity-badge">16+</span>
                <span className="text-gray-400">{getRuntime()}</span>
                <span className="maturity-badge">HD</span>
              </div>

              {/* Overview */}
              <p className="text-base text-gray-200 mb-6 leading-relaxed">
                {details?.overview || movie.overview}
              </p>
            </div>

            {/* Right Column */}
            <div className="w-64 text-sm space-y-3">
              {/* Cast */}
              {topCast.length > 0 && (
                <div>
                  <span className="text-gray-500">Cast: </span>
                  <span className="text-gray-300">
                    {topCast.map((c, i) => (
                      <span key={c.id}>
                        {c.name}
                        {i < topCast.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                </div>
              )}

              {/* Genres */}
              {genres.length > 0 && (
                <div>
                  <span className="text-gray-500">Genres: </span>
                  <span className="text-gray-300">
                    {genres.map((g, i) => (
                      <span key={g.id}>
                        {g.name}
                        {i < genres.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                </div>
              )}

              {/* Director */}
              {director && (
                <div>
                  <span className="text-gray-500">Director: </span>
                  <span className="text-gray-300">{director.name}</span>
                </div>
              )}

              {/* Rating */}
              {details?.vote_average && (
                <div>
                  <span className="text-gray-500">Rating: </span>
                  <span className="text-gray-300">{details.vote_average.toFixed(1)}/10</span>
                </div>
              )}

              {/* Status */}
              {details?.status && (
                <div>
                  <span className="text-gray-500">Status: </span>
                  <span className="text-gray-300">{details.status}</span>
                </div>
              )}
            </div>
          </div>

          {/* Similar Movies */}
          {similar.length > 0 && (
            <div className="mt-8 -mx-8">
              <h3 className="text-xl font-semibold text-white mb-4 px-8">More Like This</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-8">
                {similar.map((similarMovie) => (
                  <div
                    key={similarMovie.id}
                    className="bg-netflix-medium-gray rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-white transition-all"
                    onClick={() => {
                      onClose();
                      // Could open new modal here
                    }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${similarMovie.backdrop_path || similarMovie.poster_path}`}
                      alt={similarMovie.title}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="p-3">
                      <div className="flex items-center gap-2 text-xs mb-2">
                        <span className="text-green-500 font-semibold">
                          {Math.round(similarMovie.vote_average * 10)}% Match
                        </span>
                        <span className="text-gray-400">
                          {similarMovie.release_date?.split('-')[0]}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-white line-clamp-1">
                        {similarMovie.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {similarMovie.overview}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About Section */}
          <div className="mt-8 border-t border-gray-700 pt-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              About {movie.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {director && (
                <div>
                  <span className="text-gray-500">Director: </span>
                  <span className="text-gray-300">{director.name}</span>
                </div>
              )}
              {topCast.length > 0 && (
                <div>
                  <span className="text-gray-500">Cast: </span>
                  <span className="text-gray-300">{topCast.map(c => c.name).join(', ')}</span>
                </div>
              )}
              {genres.length > 0 && (
                <div>
                  <span className="text-gray-500">Genres: </span>
                  <span className="text-gray-300">{genres.map(g => g.name).join(', ')}</span>
                </div>
              )}
              {details?.production_companies?.length > 0 && (
                <div>
                  <span className="text-gray-500">Production: </span>
                  <span className="text-gray-300">
                    {details.production_companies.slice(0, 3).map(p => p.name).join(', ')}
                  </span>
                </div>
              )}
              {details?.budget > 0 && (
                <div>
                  <span className="text-gray-500">Budget: </span>
                  <span className="text-gray-300">${details.budget.toLocaleString()}</span>
                </div>
              )}
              {details?.revenue > 0 && (
                <div>
                  <span className="text-gray-500">Revenue: </span>
                  <span className="text-gray-300">${details.revenue.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
