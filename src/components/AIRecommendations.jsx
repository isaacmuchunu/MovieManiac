import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { tmdbApi } from '../lib/videoProviders';

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: 'from-yellow-500 to-orange-500', genreIds: [35, 10751] }, // Comedy, Family
  { id: 'excited', emoji: '🤩', label: 'Excited', color: 'from-pink-500 to-red-500', genreIds: [28, 12] }, // Action, Adventure
  { id: 'relaxed', emoji: '😌', label: 'Relaxed', color: 'from-green-500 to-teal-500', genreIds: [35, 18] }, // Comedy, Drama
  { id: 'romantic', emoji: '💕', label: 'Romantic', color: 'from-pink-400 to-rose-500', genreIds: [10749] }, // Romance
  { id: 'adventurous', emoji: '🎯', label: 'Adventurous', color: 'from-blue-500 to-purple-500', genreIds: [12, 14] }, // Adventure, Fantasy
  { id: 'thoughtful', emoji: '🤔', label: 'Thoughtful', color: 'from-indigo-500 to-blue-500', genreIds: [878, 18] }, // Sci-Fi, Drama
  { id: 'scared', emoji: '😨', label: 'Thrilled', color: 'from-gray-700 to-black', genreIds: [27, 53] }, // Horror, Thriller
  { id: 'nostalgic', emoji: '🥹', label: 'Nostalgic', color: 'from-amber-500 to-yellow-500', genreIds: [10751, 12] }, // Family, Adventure
];

/**
 * Render an AI-powered mood-based movie recommendations panel.
 *
 * When a mood is selected, fetches movies for the mood's primary genre, displays up to six
 * recommendation cards with poster, title, genre label, and rating, and shows a loading state
 * and an AI Insight summary. Includes a reset action to return to mood selection and a
 * sign-in prompt when the user is not authenticated.
 *
 * @returns {JSX.Element} The recommendations panel UI.
 */
function AIRecommendations() {
  const { isAuthenticated } = useAuthStore();
  const [selectedMood, setSelectedMood] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    setIsLoading(true);

    try {
      // Fetch movies based on mood's genre IDs
      const genreId = mood.genreIds[0];
      const data = await tmdbApi.getMoviesByGenre(genreId, 1, 'vote_average.desc');

      const formattedResults = (data.results || []).slice(0, 6).map(movie => ({
        id: movie.id,
        title: movie.title,
        genre: mood.label,
        rating: movie.vote_average?.toFixed(1),
        poster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null
      }));

      setRecommendations(formattedResults);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetMood = () => {
    setSelectedMood(null);
    setRecommendations([]);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">AI-Powered Recommendations</h2>
          <p className="text-sm text-gray-400">Tell us how you're feeling</p>
        </div>
      </div>

      {!selectedMood ? (
        <>
          <p className="text-gray-300 mb-6">
            What's your mood today? Our AI will find the perfect content for you.
          </p>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood)}
                className={`aspect-square rounded-xl bg-gradient-to-br ${mood.color} p-0.5 hover:scale-105 transition-transform`}
              >
                <div className="w-full h-full bg-gray-900 rounded-[10px] flex flex-col items-center justify-center gap-1">
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs text-gray-300 hidden md:block">{mood.label}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedMood.color} flex items-center justify-center text-2xl`}>
                {selectedMood.emoji}
              </div>
              <div>
                <p className="text-white font-medium">Feeling {selectedMood.label}</p>
                <p className="text-sm text-gray-400">Here's what we recommend</p>
              </div>
            </div>
            <button
              onClick={resetMood}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((item) => (
                <Link
                  key={item.id}
                  to={`/movie/${item.id}`}
                  className="group bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors"
                >
                  <div className="relative aspect-[2/3]">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-full bg-white hover:bg-gray-200 text-black font-medium py-2 rounded-lg transition-colors">
                        Watch Now
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-white font-medium truncate">{item.title}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-400">{item.genre}</span>
                      <span className="text-sm text-yellow-500 flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {item.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* AI Insight */}
          <div className="mt-6 bg-purple-900/30 border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-purple-300 font-medium text-sm">AI Insight</h4>
                <p className="text-gray-400 text-sm mt-1">
                  Based on your {selectedMood.label.toLowerCase()} mood, we've selected content with uplifting themes,
                  dynamic pacing, and engaging storytelling that matches your current emotional state.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Personalization Note */}
      {!isAuthenticated && (
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            <Link to="/login" className="text-purple-400 hover:text-purple-300">Sign in</Link>
            {' '}to get personalized recommendations based on your watch history
          </p>
        </div>
      )}
    </div>
  );
}

export default AIRecommendations;