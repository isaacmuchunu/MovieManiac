import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { tmdbApi } from '../lib/videoProviders';

/**
 * Render the Watch Party UI that lets users create or join synchronized viewing sessions.
 *
 * Renders controls and informational UI for creating a watch party, joining with a party code,
 * and a modal to select popular TV shows for parties. On mount it fetches a small list of popular
 * TV shows for the "Popular for Parties" selection. Authenticated users can open the create modal,
 * select content, and start a party which navigates to the watch route with a generated 6-character
 * party code. Unauthenticated users are redirected to the login page when attempting to create a party.
 * Joining a party validates the entered 6-character code and navigates to the watch route with the provided code.
 *
 * @returns {JSX.Element} The Watch Party component UI.
 */
function WatchParty() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [partyCode, setPartyCode] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const [error, setError] = useState('');
  const [popularForParties, setPopularForParties] = useState([]);

  // Fetch popular TV shows for watch parties
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const data = await tmdbApi.getPopularTvShows();
        const formatted = (data.results || []).slice(0, 4).map(show => ({
          id: show.id,
          title: show.name,
          poster: show.poster_path ? `https://image.tmdb.org/t/p/w300${show.poster_path}` : null,
          type: 'series'
        }));
        setPopularForParties(formatted);
      } catch (error) {
        console.error('Error fetching popular shows:', error);
      }
    };
    fetchPopular();
  }, []);

  const generatePartyCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreateParty = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowCreateModal(true);
  };

  const handleStartParty = () => {
    if (!selectedContent) {
      setError('Please select something to watch');
      return;
    }
    const code = generatePartyCode();
    // In production, this would create a WebSocket room
    navigate(`/watch/${selectedContent.id}?party=${code}`);
  };

  const handleJoinParty = () => {
    if (!partyCode.trim()) {
      setError('Please enter a party code');
      return;
    }
    if (partyCode.length !== 6) {
      setError('Party code must be 6 characters');
      return;
    }
    // In production, this would join a WebSocket room
    navigate(`/watch/1?party=${partyCode.toUpperCase()}`);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-netflix-red/10 to-gray-900 rounded-2xl p-6 md:p-8 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-netflix-red to-red-700 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Watch Party</h2>
          <p className="text-sm text-gray-400">Watch together with friends</p>
        </div>
      </div>

      <p className="text-gray-300 mb-6">
        Start a synchronized watch party and enjoy movies & shows together with friends, no matter where they are!
      </p>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <div className="w-10 h-10 bg-netflix-red/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-netflix-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-300">Synced Playback</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-sm text-gray-300">Live Chat</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-300">Reactions</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-300">Up to 8 People</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleCreateParty}
          className="flex-1 bg-netflix-red hover:bg-netflix-red-hover text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Party
        </button>
        <button
          onClick={() => setShowJoinModal(true)}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Join Party
        </button>
      </div>

      {/* How it works */}
      <div className="mt-8 border-t border-gray-800 pt-6">
        <h3 className="text-white font-medium mb-4">How it works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-netflix-red/20 rounded-full flex items-center justify-center flex-shrink-0 text-netflix-red text-xs font-bold">
              1
            </div>
            <p className="text-gray-400">Create a party and get a unique code to share</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-netflix-red/20 rounded-full flex items-center justify-center flex-shrink-0 text-netflix-red text-xs font-bold">
              2
            </div>
            <p className="text-gray-400">Friends join using your party code</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-netflix-red/20 rounded-full flex items-center justify-center flex-shrink-0 text-netflix-red text-xs font-bold">
              3
            </div>
            <p className="text-gray-400">Watch together with synced playback and chat!</p>
          </div>
        </div>
      </div>

      {/* Create Party Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create Watch Party</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-400 mb-6">Select what you want to watch with your friends</p>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 rounded-lg p-3 mb-4">
                {error}
              </div>
            )}

            <h3 className="text-white font-medium mb-4">Popular for Parties</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {popularForParties.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedContent(item);
                    setError('');
                  }}
                  className={`relative rounded-lg overflow-hidden transition-all ${
                    selectedContent?.id === item.id
                      ? 'ring-2 ring-netflix-red scale-105'
                      : 'hover:scale-105'
                  }`}
                >
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  {selectedContent?.id === item.id && (
                    <div className="absolute inset-0 bg-netflix-red/30 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-white text-sm font-medium truncate">{item.title}</p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleStartParty}
              disabled={!selectedContent}
              className="w-full bg-netflix-red hover:bg-netflix-red-hover text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Party
            </button>
          </div>
        </div>
      )}

      {/* Join Party Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Join Watch Party</h2>
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setPartyCode('');
                  setError('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-400 mb-6">Enter the party code shared by your friend</p>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 rounded-lg p-3 mb-4">
                {error}
              </div>
            )}

            <input
              type="text"
              value={partyCode}
              onChange={(e) => {
                setPartyCode(e.target.value.toUpperCase().slice(0, 6));
                setError('');
              }}
              placeholder="ABC123"
              className="w-full bg-gray-800 text-white text-center text-3xl tracking-[0.5em] font-mono rounded-lg px-4 py-4 outline-none focus:ring-2 focus:ring-netflix-red placeholder-gray-600"
              maxLength={6}
            />

            <button
              onClick={handleJoinParty}
              disabled={partyCode.length !== 6}
              className="w-full mt-6 bg-netflix-red hover:bg-netflix-red-hover text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join Party
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WatchParty;