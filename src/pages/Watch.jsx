import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';

const API_KEY = '617c0260598c225e728db47b98d5ea6f';

const Watch = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos`
        );
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleProgress = (currentTime, duration) => {
    // Save progress to localStorage
    const progress = {
      movieId,
      currentTime,
      duration,
      timestamp: Date.now(),
    };
    localStorage.setItem(`watch-progress-${movieId}`, JSON.stringify(progress));
  };

  const handleEnded = () => {
    // Clear progress and navigate back
    localStorage.removeItem(`watch-progress-${movieId}`);
    navigate(-1);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Get saved progress
  const getSavedProgress = () => {
    const saved = localStorage.getItem(`watch-progress-${movieId}`);
    if (saved) {
      const data = JSON.parse(saved);
      // Only use if saved within last 7 days
      if (Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000) {
        return data.currentTime;
      }
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Movie not found</p>
          <button onClick={() => navigate('/')} className="btn-netflix">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Find trailer or use demo
  const trailer = movie.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  // Demo HLS stream (Big Buck Bunny)
  const demoStream = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

  return (
    <VideoPlayer
      src={demoStream}
      poster={movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : undefined}
      title={movie.title}
      onProgress={handleProgress}
      onEnded={handleEnded}
      onBack={handleBack}
      initialTime={getSavedProgress()}
      autoPlay={true}
    />
  );
};

export default Watch;
