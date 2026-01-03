import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MovieRow from './MovieRow';
import { tmdbApi } from '../lib/tmdbProxy';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

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

const BackIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const MovieDetail = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inMyList, setInMyList] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        // Fetch all movie data in parallel using the secure proxy
        const [movieData, creditsData, videosData, similarData] = await Promise.all([
          tmdbApi.getMovieDetails(movieId),
          tmdbApi.getMovieCredits(movieId),
          tmdbApi.getMovieVideos(movieId),
          tmdbApi.discoverMovies({ similar: movieId, page: 1 })
        ]);

        setMovie(movieData);
        setCredits(creditsData);
        setVideos(videosData.results?.filter(v => v.type === 'Trailer') || []);
        setSimilar(similarData.results?.slice(0, 20) || movieData.similar?.results?.slice(0, 20) || []);

        // Check if in my list
        const savedList = localStorage.getItem('moovie-mylist');
        if (savedList) {
          const list = JSON.parse(savedList);
          setInMyList(list.some(m => m.id === movieData.id));
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
    window.scrollTo(0, 0);
  }, [movieId]);

  const toggleMyList = () => {
    const savedList = localStorage.getItem('moovie-mylist');
    let list = savedList ? JSON.parse(savedList) : [];

    if (inMyList) {
      list = list.filter(m => m.id !== movie.id);
    } else {
      list.push(movie);
    }

    localStorage.setItem('moovie-mylist', JSON.stringify(list));
    setInMyList(!inMyList);
  };

  const getRuntime = () => {
    if (!movie?.runtime) return 'N/A';
    const hours = Math.floor(movie.runtime / 60);
    const mins = movie.runtime % 60;
    return `${hours}h ${mins}m`;
  };

  const director = credits?.crew?.find(c => c.job === 'Director');
  const writers = credits?.crew?.filter(c => c.department === 'Writing').slice(0, 3) || [];
  const topCast = credits?.cast?.slice(0, 10) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black">
        <div className="h-[70vh] skeleton"></div>
        <div className="px-4 md:px-14 py-8 space-y-4">
          <div className="h-10 w-96 skeleton rounded"></div>
          <div className="h-6 w-64 skeleton rounded"></div>
          <div className="h-32 w-full skeleton rounded"></div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <p className="text-white text-xl">Movie not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${IMAGE_BASE}${movie.backdrop_path})`,
          }}
        />

        {/* Gradients */}
        <div className="hero-gradient absolute inset-0" />
        <div className="hero-gradient-left absolute inset-0" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 md:left-14 z-10 flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
        >
          <BackIcon />
          <span>Back</span>
        </button>

        {/* Content */}
        <div className="absolute bottom-16 left-4 md:left-14 right-4 md:right-1/2 z-10 animate-fade-in">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {movie.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
            <span className="text-green-500 font-semibold">
              {Math.round(movie.vote_average * 10)}% Match
            </span>
            <span className="text-gray-400">{movie.release_date?.split('-')[0]}</span>
            <span className="maturity-badge">16+</span>
            <span className="text-gray-400">{getRuntime()}</span>
            <span className="maturity-badge">HD</span>
            <div className="flex items-center gap-1">
              <StarIcon />
              <span className="text-white">{movie.vote_average?.toFixed(1)}</span>
            </div>
          </div>

          {/* Tagline */}
          {movie.tagline && (
            <p className="text-gray-300 italic mb-4">{movie.tagline}</p>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(`/watch/movie/${movie.id}`)}
              className="btn-netflix text-lg py-3 px-8"
            >
              <PlayIcon />
              Play
            </button>
            <button
              onClick={toggleMyList}
              className={`btn-icon ${inMyList ? 'bg-white/20' : ''}`}
            >
              {inMyList ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              ) : (
                <PlusIcon />
              )}
            </button>
            <button className="btn-icon">
              <ThumbUpIcon />
            </button>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {movie.genres?.map((genre) => (
              <span
                key={genre.id}
                className="px-3 py-1 bg-netflix-medium-gray rounded-full text-sm text-gray-300"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-4 md:px-14 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Overview */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Overview</h2>
              <p className="text-gray-300 text-lg leading-relaxed">{movie.overview}</p>
            </div>

            {/* Trailer */}
            {videos.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Trailer</h2>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videos[0].key}`}
                    title={videos[0].name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Cast */}
            {topCast.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {topCast.map((person) => (
                    <div key={person.id} className="text-center">
                      <div className="w-24 h-24 mx-auto mb-2 rounded-full overflow-hidden bg-netflix-medium-gray">
                        {person.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-white text-sm font-medium line-clamp-1">{person.name}</p>
                      <p className="text-gray-500 text-xs line-clamp-1">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="space-y-4 text-sm">
            {director && (
              <div>
                <span className="text-gray-500">Director: </span>
                <span className="text-white">{director.name}</span>
              </div>
            )}
            {writers.length > 0 && (
              <div>
                <span className="text-gray-500">Writers: </span>
                <span className="text-white">{writers.map(w => w.name).join(', ')}</span>
              </div>
            )}
            {movie.production_companies?.length > 0 && (
              <div>
                <span className="text-gray-500">Production: </span>
                <span className="text-white">
                  {movie.production_companies.slice(0, 3).map(p => p.name).join(', ')}
                </span>
              </div>
            )}
            {movie.spoken_languages?.length > 0 && (
              <div>
                <span className="text-gray-500">Languages: </span>
                <span className="text-white">
                  {movie.spoken_languages.map(l => l.english_name).join(', ')}
                </span>
              </div>
            )}
            {movie.budget > 0 && (
              <div>
                <span className="text-gray-500">Budget: </span>
                <span className="text-white">${movie.budget.toLocaleString()}</span>
              </div>
            )}
            {movie.revenue > 0 && (
              <div>
                <span className="text-gray-500">Revenue: </span>
                <span className="text-white">${movie.revenue.toLocaleString()}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500">Status: </span>
              <span className="text-white">{movie.status}</span>
            </div>
            {movie.vote_count > 0 && (
              <div>
                <span className="text-gray-500">Votes: </span>
                <span className="text-white">{movie.vote_count.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      {similar.length > 0 && (
        <div className="mt-8">
          <MovieRow
            title="More Like This"
            movies={similar}
            onMovieClick={(m) => navigate(`/movie/${m.id}`)}
          />
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
