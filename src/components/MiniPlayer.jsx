import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../lib/store';

const MiniPlayer = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const { currentContent, currentVideo, progress, isPlaying, setProgress, setPlaying, reset } = usePlayerStore();
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render if no content
  if (!currentContent) return null;

  const handleDragStart = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const newX = Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragStart.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 180, e.clientY - dragStart.y));
    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, dragStart]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!isPlaying);
    }
  };

  const handleExpand = () => {
    navigate(`/watch/${currentContent.id}`);
  };

  const handleClose = () => {
    reset();
  };

  const handlePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.error('PiP error:', err);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`fixed z-50 transition-all duration-300 shadow-2xl ${
        isExpanded ? 'w-96 h-auto' : 'w-80 h-auto'
      }`}
      style={{
        bottom: position.y,
        right: position.x,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleDragStart}
    >
      {/* Video Container */}
      <div className="relative rounded-lg overflow-hidden bg-black">
        {/* Video */}
        <div className="aspect-video bg-gray-900">
          {currentVideo ? (
            <video
              ref={videoRef}
              src={currentVideo}
              className="w-full h-full object-cover"
              autoPlay
              onTimeUpdate={(e) => setProgress((e.target.currentTime / e.target.duration) * 100)}
            />
          ) : (
            <img
              src={currentContent?.backdrop_path
                ? `https://image.tmdb.org/t/p/w780${currentContent.backdrop_path}`
                : 'https://picsum.photos/seed/mini/640/360'
              }
              alt={currentContent?.title || currentContent?.name}
              className="w-full h-full object-cover"
            />
          )}

          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 hover:opacity-100 transition-opacity">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-2 flex items-center justify-between">
              <span className="text-white text-xs font-medium truncate max-w-[200px]">
                {currentContent?.title || currentContent?.name}
              </span>
              <div className="flex items-center gap-1">
                {/* PiP Button */}
                <button
                  onClick={handlePiP}
                  className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  title="Picture-in-Picture"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
                {/* Expand Button */}
                <button
                  onClick={handleExpand}
                  className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  title="Expand"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  title="Close"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Center Play Button */}
            <button
              onClick={togglePlay}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div
                className="h-full bg-netflix-red transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div className="bg-gray-900 p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-netflix-red flex items-center justify-center">
                <span className="text-white text-xs font-bold">M</span>
              </div>
              <div className="text-xs">
                <p className="text-white font-medium truncate max-w-[180px]">
                  {currentContent?.title || currentContent?.name}
                </p>
                <p className="text-gray-500">
                  {Math.round(progress)}% watched
                </p>
              </div>
            </div>
            <button
              onClick={handleExpand}
              className="text-xs text-netflix-red hover:underline"
            >
              Full Screen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
