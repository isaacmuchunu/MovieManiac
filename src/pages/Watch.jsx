import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { tmdbApi } from '../lib/videoProviders';
import VideoPlayer from '../components/VideoPlayer';
import Loading from '../components/Loading';

const Watch = () => {
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For TV shows
  const [currentSeason, setCurrentSeason] = useState(parseInt(searchParams.get('s')) || 1);
  const [currentEpisode, setCurrentEpisode] = useState(parseInt(searchParams.get('e')) || 1);
  const [seasonData, setSeasonData] = useState(null);
  const [allSeasons, setAllSeasons] = useState([]);

  // Fetch content details
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);

      try {
        if (type === 'movie') {
          const data = await tmdbApi.getMovieDetails(id);
          setContent(data);
        } else if (type === 'tv') {
          const data = await tmdbApi.getTvDetails(id);
          setContent(data);

          // Filter valid seasons (exclude season 0 - specials)
          const validSeasons = (data.seasons || []).filter(s => s.season_number > 0);
          setAllSeasons(validSeasons);

          // Fetch season details
          const season = await tmdbApi.getTvSeasonDetails(id, currentSeason);
          setSeasonData(season);
        }
      } catch (err) {
        setError('Failed to load content');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [type, id]);

  // Fetch season data when season changes
  useEffect(() => {
    const fetchSeason = async () => {
      if (type === 'tv' && content) {
        try {
          const season = await tmdbApi.getTvSeasonDetails(id, currentSeason);
          setSeasonData(season);
        } catch (err) {
          console.error('Failed to fetch season data:', err);
        }
      }
    };

    fetchSeason();
  }, [type, id, currentSeason, content]);

  // Update URL when episode changes
  useEffect(() => {
    if (type === 'tv') {
      navigate(`/watch/tv/${id}?s=${currentSeason}&e=${currentEpisode}`, { replace: true });
    }
  }, [type, id, currentSeason, currentEpisode, navigate]);

  const handleClose = () => {
    if (type === 'movie') {
      navigate(`/movie/${id}`);
    } else {
      navigate(`/series/${id}`);
    }
  };

  const hasNextEpisode = () => {
    if (type !== 'tv' || !seasonData || !content) return false;

    // Check if there's a next episode in current season
    if (currentEpisode < (seasonData.episodes?.length || 0)) {
      return true;
    }

    // Check if there's a next season
    if (currentSeason < (content.number_of_seasons || 0)) {
      return true;
    }

    return false;
  };

  const hasPreviousEpisode = () => {
    if (type !== 'tv') return false;
    return currentEpisode > 1 || currentSeason > 1;
  };

  const goToNextEpisode = async () => {
    if (!seasonData || !content) return;

    if (currentEpisode < (seasonData.episodes?.length || 0)) {
      // Next episode in same season
      setCurrentEpisode(currentEpisode + 1);
    } else if (currentSeason < (content.number_of_seasons || 0)) {
      // First episode of next season
      setCurrentSeason(currentSeason + 1);
      setCurrentEpisode(1);
    }
  };

  const goToPreviousEpisode = async () => {
    if (currentEpisode > 1) {
      setCurrentEpisode(currentEpisode - 1);
    } else if (currentSeason > 1) {
      // Go to last episode of previous season
      try {
        const prevSeasonData = await tmdbApi.getTvSeasonDetails(id, currentSeason - 1);
        setCurrentSeason(currentSeason - 1);
        setCurrentEpisode(prevSeasonData.episodes?.length || 1);
      } catch (err) {
        console.error('Error fetching previous season:', err);
        setCurrentSeason(currentSeason - 1);
        setCurrentEpisode(1);
      }
    }
  };

  // Handle season change from video player
  const handleSeasonChange = async (seasonNum) => {
    try {
      const season = await tmdbApi.getTvSeasonDetails(id, seasonNum);
      setSeasonData(season);
    } catch (err) {
      console.error('Failed to fetch season data:', err);
    }
  };

  // Handle episode change from video player
  const handleEpisodeChange = (seasonNum, episodeNum) => {
    setCurrentSeason(seasonNum);
    setCurrentEpisode(episodeNum);
  };

  const getTitle = () => {
    if (!content) return '';

    if (type === 'movie') {
      return content.title;
    }

    const episodeData = seasonData?.episodes?.find(e => e.episode_number === currentEpisode);
    return `${content.name} - S${currentSeason}E${currentEpisode}${episodeData ? `: ${episodeData.name}` : ''}`;
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">{error || 'Content not found'}</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-netflix-red hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <VideoPlayer
      tmdbId={parseInt(id)}
      type={type}
      season={currentSeason}
      episode={currentEpisode}
      title={getTitle()}
      backdrop={content.backdrop_path}
      onClose={handleClose}
      onNextEpisode={goToNextEpisode}
      onPreviousEpisode={goToPreviousEpisode}
      hasNextEpisode={hasNextEpisode()}
      hasPreviousEpisode={hasPreviousEpisode()}
      seasonData={seasonData}
      allSeasons={allSeasons}
      onSeasonChange={handleSeasonChange}
      onEpisodeChange={handleEpisodeChange}
    />
  );
};

export default Watch;
