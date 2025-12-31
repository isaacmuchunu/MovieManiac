import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useWatchlistStore, useAuthStore } from '../lib/store';
import Loading from '../components/Loading';

// Sample series data - in production this would come from the API
const sampleSeries = {
  id: 1,
  title: 'Breaking Bad',
  tagline: 'All Hail the King',
  description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
  backdrop_path: 'https://image.tmdb.org/t/p/original/zzWGRw277MNoCs3zhyG3YmYQsXv.jpg',
  poster_path: 'https://image.tmdb.org/t/p/w500/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg',
  first_air_date: '2008-01-20',
  last_air_date: '2013-09-29',
  status: 'Ended',
  vote_average: 9.5,
  vote_count: 12500,
  imdb_rating: 9.5,
  rotten_tomatoes: 97,
  genres: ['Drama', 'Crime', 'Thriller'],
  created_by: ['Vince Gilligan'],
  cast: [
    { name: 'Bryan Cranston', character: 'Walter White', profile: 'https://image.tmdb.org/t/p/w185/7Jahy5LZX2Fo8fGJltMreAI49hC.jpg' },
    { name: 'Aaron Paul', character: 'Jesse Pinkman', profile: 'https://image.tmdb.org/t/p/w185/8Kc3xgLMBkBnT2V3Tb7eCWM1lXI.jpg' },
    { name: 'Anna Gunn', character: 'Skyler White', profile: 'https://image.tmdb.org/t/p/w185/2XXL3TqNzPPhiVZ9zQnHNwh2JHm.jpg' },
    { name: 'Dean Norris', character: 'Hank Schrader', profile: 'https://image.tmdb.org/t/p/w185/500eUwXlQoGQ3OnuH7RUmvdXlvL.jpg' },
  ],
  number_of_seasons: 5,
  number_of_episodes: 62,
  episode_run_time: [47],
  seasons: [
    {
      id: 1,
      season_number: 1,
      name: 'Season 1',
      episode_count: 7,
      air_date: '2008-01-20',
      poster_path: 'https://image.tmdb.org/t/p/w300/1BP4xYv9ZG4ZVHkL7ocOziBbSYH.jpg',
      overview: 'High school chemistry teacher Walter White\'s life is suddenly transformed by a dire medical diagnosis.',
      episodes: [
        { id: 1, episode_number: 1, name: 'Pilot', runtime: 58, air_date: '2008-01-20', still_path: 'https://picsum.photos/seed/ep1/400/225', overview: 'Diagnosed with terminal lung cancer, chemistry teacher Walter White teams up with a former student to cook and sell crystal meth.', imdb_rating: 9.0 },
        { id: 2, episode_number: 2, name: 'Cat\'s in the Bag...', runtime: 48, air_date: '2008-01-27', still_path: 'https://picsum.photos/seed/ep2/400/225', overview: 'Walt and Jesse attempt to tie up loose ends.', imdb_rating: 8.6 },
        { id: 3, episode_number: 3, name: '...And the Bag\'s in the River', runtime: 48, air_date: '2008-02-10', still_path: 'https://picsum.photos/seed/ep3/400/225', overview: 'Walter fights with himself over a difficult choice.', imdb_rating: 8.8 },
        { id: 4, episode_number: 4, name: 'Cancer Man', runtime: 48, air_date: '2008-02-17', still_path: 'https://picsum.photos/seed/ep4/400/225', overview: 'Walter tells the family he has cancer.', imdb_rating: 8.3 },
        { id: 5, episode_number: 5, name: 'Gray Matter', runtime: 48, air_date: '2008-02-24', still_path: 'https://picsum.photos/seed/ep5/400/225', overview: 'Walter and Skyler attend a former colleague\'s party.', imdb_rating: 8.4 },
        { id: 6, episode_number: 6, name: 'Crazy Handful of Nothin\'', runtime: 48, air_date: '2008-03-02', still_path: 'https://picsum.photos/seed/ep6/400/225', overview: 'Walt takes action against a dangerous distributor.', imdb_rating: 9.2 },
        { id: 7, episode_number: 7, name: 'A No-Rough-Stuff-Type Deal', runtime: 48, air_date: '2008-03-09', still_path: 'https://picsum.photos/seed/ep7/400/225', overview: 'Walt and Jesse try to find an alternative to their drug dealing.', imdb_rating: 8.8 },
      ],
    },
    {
      id: 2,
      season_number: 2,
      name: 'Season 2',
      episode_count: 13,
      air_date: '2009-03-08',
      poster_path: 'https://image.tmdb.org/t/p/w300/e3oGYpoTUhOFK0BJfloru5ZmGV.jpg',
      overview: 'Walt and Jesse build their methamphetamine operation while dealing with the consequences of their actions.',
      episodes: Array.from({ length: 13 }, (_, i) => ({
        id: 8 + i,
        episode_number: i + 1,
        name: `Episode ${i + 1}`,
        runtime: 47,
        air_date: '2009-03-08',
        still_path: `https://picsum.photos/seed/s2ep${i + 1}/400/225`,
        overview: 'The story continues...',
        imdb_rating: 8.5 + Math.random() * 1,
      })),
    },
    {
      id: 3,
      season_number: 3,
      name: 'Season 3',
      episode_count: 13,
      air_date: '2010-03-21',
      poster_path: 'https://image.tmdb.org/t/p/w300/ffP8Q8ew048YnGkFGhpvLgyfA7y.jpg',
      overview: 'Walt continues his criminal empire as threats close in from all sides.',
      episodes: Array.from({ length: 13 }, (_, i) => ({
        id: 21 + i,
        episode_number: i + 1,
        name: `Episode ${i + 1}`,
        runtime: 47,
        air_date: '2010-03-21',
        still_path: `https://picsum.photos/seed/s3ep${i + 1}/400/225`,
        overview: 'The story continues...',
        imdb_rating: 8.5 + Math.random() * 1,
      })),
    },
    {
      id: 4,
      season_number: 4,
      name: 'Season 4',
      episode_count: 13,
      air_date: '2011-07-17',
      poster_path: 'https://image.tmdb.org/t/p/w300/5ewrnKp4TboU4hTLT5cWO350mHj.jpg',
      overview: 'A new enemy emerges as Walt struggles to protect his family and business.',
      episodes: Array.from({ length: 13 }, (_, i) => ({
        id: 34 + i,
        episode_number: i + 1,
        name: `Episode ${i + 1}`,
        runtime: 47,
        air_date: '2011-07-17',
        still_path: `https://picsum.photos/seed/s4ep${i + 1}/400/225`,
        overview: 'The story continues...',
        imdb_rating: 8.5 + Math.random() * 1,
      })),
    },
    {
      id: 5,
      season_number: 5,
      name: 'Season 5',
      episode_count: 16,
      air_date: '2012-07-15',
      poster_path: 'https://image.tmdb.org/t/p/w300/r3z70vunihrAkjILQKWHX0G2xzO.jpg',
      overview: 'The final season brings everything to a dramatic conclusion.',
      episodes: Array.from({ length: 16 }, (_, i) => ({
        id: 47 + i,
        episode_number: i + 1,
        name: `Episode ${i + 1}`,
        runtime: i === 15 ? 55 : 47,
        air_date: '2012-07-15',
        still_path: `https://picsum.photos/seed/s5ep${i + 1}/400/225`,
        overview: 'The story continues...',
        imdb_rating: i === 15 ? 9.9 : 8.5 + Math.random() * 1,
      })),
    },
  ],
};

function Series() {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items: watchlist, addItem, removeItem } = useWatchlistStore();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [showTrailer, setShowTrailer] = useState(false);

  const isInWatchlist = watchlist.some((item) => item.id === Number(seriesId));

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSeries(sampleSeries);
      setLoading(false);
    }, 500);
  }, [seriesId]);

  const handleWatchlistToggle = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isInWatchlist) {
      removeItem(Number(seriesId));
    } else {
      addItem(series);
    }
  };

  const handlePlay = (seasonNum, episodeNum) => {
    navigate(`/watch/${seriesId}/s${seasonNum}e${episodeNum}`);
  };

  if (loading) return <Loading />;
  if (!series) return <div className="text-white text-center py-20">Series not found</div>;

  const currentSeason = series.seasons.find((s) => s.season_number === selectedSeason);

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Hero Section */}
      <div className="relative h-[70vh] md:h-[80vh]">
        {/* Backdrop */}
        <div className="absolute inset-0">
          <img
            src={series.backdrop_path}
            alt={series.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-12 pb-12">
          <div className="max-w-3xl">
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {series.title}
            </h1>

            {/* Tagline */}
            {series.tagline && (
              <p className="text-xl text-gray-300 italic mb-4">{series.tagline}</p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              {/* IMDB Rating */}
              <div className="flex items-center gap-1 bg-yellow-500 text-black px-2 py-1 rounded font-bold">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {series.imdb_rating}
              </div>

              {/* Rotten Tomatoes */}
              <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded font-bold">
                🍅 {series.rotten_tomatoes}%
              </div>

              <span className="text-green-500 font-semibold">{series.vote_average * 10}% Match</span>
              <span className="text-gray-400">{series.first_air_date?.split('-')[0]} - {series.last_air_date?.split('-')[0]}</span>
              <span className="border border-gray-500 text-gray-400 px-1.5 text-xs">TV-MA</span>
              <span className="text-gray-400">{series.number_of_seasons} Seasons</span>
              <span className="text-gray-400">{series.number_of_episodes} Episodes</span>
              <span className="border border-gray-500 text-gray-400 px-1.5 text-xs">HD</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {series.genres.map((genre) => (
                <span
                  key={genre}
                  className="bg-gray-800/80 text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-gray-300 text-lg mb-6 line-clamp-3">{series.description}</p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handlePlay(1, 1)}
                className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-bold px-8 py-3 rounded-md transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play S1:E1
              </button>

              <button
                onClick={handleWatchlistToggle}
                className="flex items-center gap-2 bg-gray-600/80 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-md transition-colors"
              >
                {isInWatchlist ? (
                  <>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    In My List
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    My List
                  </>
                )}
              </button>

              <button
                onClick={() => setShowTrailer(true)}
                className="flex items-center gap-2 bg-gray-600/80 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-md transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-12 py-8">
        {/* Season Selector */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-white">Episodes</h2>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
            className="bg-gray-800 text-white px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-white/50"
          >
            {series.seasons.map((season) => (
              <option key={season.id} value={season.season_number}>
                {season.name}
              </option>
            ))}
          </select>
        </div>

        {/* Season Info */}
        {currentSeason && (
          <div className="mb-6">
            <p className="text-gray-400">
              {currentSeason.episode_count} Episodes • {currentSeason.air_date?.split('-')[0]}
            </p>
            {currentSeason.overview && (
              <p className="text-gray-300 mt-2">{currentSeason.overview}</p>
            )}
          </div>
        )}

        {/* Episodes List */}
        <div className="space-y-4">
          {currentSeason?.episodes.map((episode) => (
            <div
              key={episode.id}
              className="bg-gray-900/50 rounded-lg overflow-hidden hover:bg-gray-800/50 transition-colors group"
            >
              <div className="flex flex-col md:flex-row">
                {/* Episode Thumbnail */}
                <div className="relative md:w-80 flex-shrink-0">
                  <img
                    src={episode.still_path}
                    alt={episode.name}
                    className="w-full h-44 md:h-full object-cover"
                  />
                  <button
                    onClick={() => handlePlay(selectedSeason, episode.episode_number)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </button>
                  {/* Episode Number Badge */}
                  <div className="absolute top-2 left-2 bg-black/80 text-white text-sm font-bold px-2 py-1 rounded">
                    E{episode.episode_number}
                  </div>
                </div>

                {/* Episode Info */}
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        {episode.episode_number}. {episode.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                        <span>{episode.runtime}m</span>
                        <span>{episode.air_date}</span>
                        {episode.imdb_rating && (
                          <span className="flex items-center gap-1 text-yellow-500">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            {episode.imdb_rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handlePlay(selectedSeason, episode.episode_number)}
                      className="hidden md:flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-medium px-4 py-2 rounded transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Play
                    </button>
                  </div>
                  <p className="text-gray-400 mt-2 line-clamp-2">{episode.overview}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cast Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {series.cast.map((person) => (
              <div key={person.name} className="text-center">
                <img
                  src={person.profile || 'https://via.placeholder.com/185x278?text=No+Image'}
                  alt={person.name}
                  className="w-full aspect-[2/3] object-cover rounded-lg mb-2"
                />
                <h4 className="text-white font-medium text-sm">{person.name}</h4>
                <p className="text-gray-500 text-xs">{person.character}</p>
              </div>
            ))}
          </div>
        </div>

        {/* More Like This */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">More Like This</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <Link
                key={i}
                to={`/series/${i + 2}`}
                className="relative aspect-[2/3] rounded-lg overflow-hidden group"
              >
                <img
                  src={`https://picsum.photos/seed/similar${i}/300/450`}
                  alt="Similar show"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-sm font-medium">Similar Show {i + 1}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Trailer would play here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Series;
