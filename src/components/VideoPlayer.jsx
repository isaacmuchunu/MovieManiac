import { useState, useEffect, useRef, useCallback } from 'react';
import { videoServers, getMovieStreamUrl, getTvStreamUrl, getNextServer } from '../lib/videoProviders';

const VideoPlayer = ({
  tmdbId,
  type = 'movie', // 'movie' or 'tv'
  season = 1,
  episode = 1,
  title = '',
  backdrop = '',
  onClose,
  onNextEpisode,
  onPreviousEpisode,
  hasNextEpisode = false,
  hasPreviousEpisode = false
}) => {
  const [currentServer, setCurrentServer] = useState(videoServers[0]);
  const [showServerList, setShowServerList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoSwitchAttempts, setAutoSwitchAttempts] = useState(0);
  const [loadStartTime, setLoadStartTime] = useState(Date.now());

  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Get the current stream URL
  const getStreamUrl = useCallback(() => {
    if (type === 'movie') {
      return getMovieStreamUrl(tmdbId, currentServer.id);
    }
    return getTvStreamUrl(tmdbId, season, episode, currentServer.id);
  }, [tmdbId, type, season, episode, currentServer]);

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
    setAutoSwitchAttempts(0);
  };

  // Handle iframe error or timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading && autoSwitchAttempts < videoServers.length - 1) {
        // Auto-switch to next server after timeout
        const nextServer = getNextServer(currentServer.id);
        setCurrentServer(nextServer);
        setAutoSwitchAttempts(prev => prev + 1);
        setLoadStartTime(Date.now());
      } else if (isLoading && autoSwitchAttempts >= videoServers.length - 1) {
        setError('Unable to load video from any server. Please try again later.');
        setIsLoading(false);
      }
    }, 15000); // 15 second timeout per server

    return () => clearTimeout(timeout);
  }, [isLoading, currentServer.id, autoSwitchAttempts, loadStartTime]);

  // Switch server manually
  const switchServer = (server) => {
    if (server.id !== currentServer.id) {
      setCurrentServer(server);
      setIsLoading(true);
      setError(null);
      setAutoSwitchAttempts(0);
      setLoadStartTime(Date.now());
    }
    setShowServerList(false);
  };

  // Toggle fullscreen
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle mouse movement for controls
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen();
          } else {
            onClose?.();
          }
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'ArrowRight':
          if (e.shiftKey && hasNextEpisode) {
            onNextEpisode?.();
          }
          break;
        case 'ArrowLeft':
          if (e.shiftKey && hasPreviousEpisode) {
            onPreviousEpisode?.();
          }
          break;
        case 's':
        case 'S':
          setShowServerList(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onClose, hasNextEpisode, hasPreviousEpisode, onNextEpisode, onPreviousEpisode]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Save watch progress
  useEffect(() => {
    const saveProgress = () => {
      const watchHistory = JSON.parse(localStorage.getItem('moovie-watch-history') || '[]');
      const existingIndex = watchHistory.findIndex(
        item => item.tmdbId === tmdbId && item.type === type
      );

      const historyItem = {
        tmdbId,
        type,
        title,
        backdrop,
        season: type === 'tv' ? season : undefined,
        episode: type === 'tv' ? episode : undefined,
        watchedAt: new Date().toISOString(),
        server: currentServer.id
      };

      if (existingIndex > -1) {
        watchHistory[existingIndex] = historyItem;
      } else {
        watchHistory.unshift(historyItem);
      }

      // Keep only last 50 items
      localStorage.setItem('moovie-watch-history', JSON.stringify(watchHistory.slice(0, 50)));
    };

    saveProgress();
  }, [tmdbId, type, season, episode, title, backdrop, currentServer.id]);

  // Reset loading state when content changes
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setAutoSwitchAttempts(0);
    setLoadStartTime(Date.now());
  }, [tmdbId, type, season, episode]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex flex-col"
      onMouseMove={handleMouseMove}
    >
      {/* Top Controls */}
      <div
        className={`absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/90 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Back Button & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-white text-xl font-bold">{title}</h1>
              {type === 'tv' && (
                <p className="text-gray-400 text-sm">Season {season}, Episode {episode}</p>
              )}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Server Selector */}
            <div className="relative">
              <button
                onClick={() => setShowServerList(!showServerList)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <span className="text-lg">{currentServer.logo}</span>
                <span className="text-white text-sm hidden sm:inline">{currentServer.name}</span>
                <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
                  {currentServer.quality}
                </span>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Server Dropdown */}
              {showServerList && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-netflix-dark-gray rounded-lg shadow-2xl overflow-hidden z-20">
                  <div className="p-3 border-b border-gray-700">
                    <h3 className="text-white font-semibold text-sm">Select Server</h3>
                    <p className="text-gray-400 text-xs">{videoServers.length} servers available</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {videoServers.map((server, index) => (
                      <button
                        key={server.id}
                        onClick={() => switchServer(server)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors ${
                          currentServer.id === server.id ? 'bg-netflix-red/20' : ''
                        }`}
                      >
                        <span className="text-xl w-8">{server.logo}</span>
                        <div className="flex-1 text-left">
                          <p className="text-white text-sm font-medium">{server.name}</p>
                          <p className="text-gray-500 text-xs">Server {index + 1}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          server.quality === 'FHD' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-300'
                        }`}>
                          {server.quality}
                        </span>
                        {currentServer.id === server.id && (
                          <svg className="w-5 h-5 text-netflix-red" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-700 bg-black/30">
                    <p className="text-gray-500 text-xs text-center">
                      Press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-300">S</kbd> to toggle server list
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isFullscreen ? (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="flex-1 relative">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-netflix-red/30 rounded-full" />
              <div className="absolute inset-0 w-20 h-20 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-white text-lg font-medium">Loading from {currentServer.name}...</p>
            {autoSwitchAttempts > 0 && (
              <p className="text-gray-400 text-sm mt-2">
                Trying server {autoSwitchAttempts + 1} of {videoServers.length}
              </p>
            )}
            <div className="mt-4 flex gap-2">
              {videoServers.slice(0, 7).map((server, i) => (
                <div
                  key={server.id}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i < autoSwitchAttempts ? 'bg-gray-600' :
                    i === autoSwitchAttempts ? 'bg-netflix-red animate-pulse' :
                    'bg-gray-700'
                  }`}
                />
              ))}
              {videoServers.length > 7 && <span className="text-gray-600 text-xs">+{videoServers.length - 7}</span>}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
            <svg className="w-16 h-16 text-netflix-red mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-white text-lg mb-2">{error}</p>
            <p className="text-gray-400 text-sm mb-6">Try selecting a different server manually</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setAutoSwitchAttempts(0);
                  setCurrentServer(videoServers[0]);
                  setIsLoading(true);
                  setError(null);
                  setLoadStartTime(Date.now());
                }}
                className="px-6 py-3 bg-netflix-red hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => setShowServerList(true)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Change Server
              </button>
            </div>
          </div>
        )}

        {/* Video Iframe */}
        <iframe
          ref={iframeRef}
          src={getStreamUrl()}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          onLoad={handleIframeLoad}
          style={{ border: 'none' }}
        />
      </div>

      {/* Bottom Controls - Episode Navigation */}
      {type === 'tv' && (hasPreviousEpisode || hasNextEpisode) && (
        <div
          className={`absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center justify-center gap-4">
            {hasPreviousEpisode && (
              <button
                onClick={onPreviousEpisode}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
                <span className="text-white text-sm">Previous Episode</span>
              </button>
            )}
            {hasNextEpisode && (
              <button
                onClick={onNextEpisode}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <span className="text-white text-sm">Next Episode</span>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div
        className={`absolute bottom-4 left-4 text-gray-500 text-xs transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p>
          <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">F</kbd> fullscreen •
          <kbd className="px-1.5 py-0.5 bg-gray-800 rounded ml-2">S</kbd> servers •
          <kbd className="px-1.5 py-0.5 bg-gray-800 rounded ml-2">ESC</kbd> exit
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
