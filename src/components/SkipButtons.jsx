import { useState, useEffect } from 'react';

const SkipButtons = ({
  currentTime = 0,
  introStart = 0,
  introEnd = 90,
  recapStart = null,
  recapEnd = null,
  onSkipIntro,
  onSkipRecap,
  nextEpisode = null,
  onNextEpisode,
  duration = 0
}) => {
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showSkipRecap, setShowSkipRecap] = useState(false);
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // Check if we should show skip intro button
  useEffect(() => {
    if (currentTime >= introStart && currentTime < introEnd) {
      setShowSkipIntro(true);
    } else {
      setShowSkipIntro(false);
    }
  }, [currentTime, introStart, introEnd]);

  // Check if we should show skip recap button
  useEffect(() => {
    if (recapStart !== null && recapEnd !== null) {
      if (currentTime >= recapStart && currentTime < recapEnd) {
        setShowSkipRecap(true);
      } else {
        setShowSkipRecap(false);
      }
    }
  }, [currentTime, recapStart, recapEnd]);

  // Show next episode button near end of video
  useEffect(() => {
    if (nextEpisode && duration > 0) {
      const timeRemaining = duration - currentTime;
      if (timeRemaining <= 30 && timeRemaining > 0) {
        setShowNextEpisode(true);
        setCountdown(Math.ceil(timeRemaining));
      } else {
        setShowNextEpisode(false);
        setCountdown(10);
      }
    }
  }, [currentTime, duration, nextEpisode]);

  const handleSkipIntro = () => {
    if (onSkipIntro) {
      onSkipIntro(introEnd);
    }
    setShowSkipIntro(false);
  };

  const handleSkipRecap = () => {
    if (onSkipRecap) {
      onSkipRecap(recapEnd);
    }
    setShowSkipRecap(false);
  };

  const handleNextEpisode = () => {
    if (onNextEpisode) {
      onNextEpisode(nextEpisode);
    }
  };

  return (
    <>
      {/* Skip Intro Button */}
      {showSkipIntro && (
        <button
          onClick={handleSkipIntro}
          className="absolute bottom-24 right-8 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white font-semibold rounded transition-all duration-200 flex items-center gap-2 animate-fade-in"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
          Skip Intro
        </button>
      )}

      {/* Skip Recap Button */}
      {showSkipRecap && (
        <button
          onClick={handleSkipRecap}
          className="absolute bottom-24 right-8 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white font-semibold rounded transition-all duration-200 flex items-center gap-2 animate-fade-in"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
          Skip Recap
        </button>
      )}

      {/* Next Episode Card */}
      {showNextEpisode && nextEpisode && (
        <div className="absolute bottom-24 right-8 bg-netflix-dark-gray/95 rounded-lg overflow-hidden shadow-2xl animate-slide-up w-80">
          {/* Episode Preview */}
          <div className="relative">
            {nextEpisode.thumbnail && (
              <img
                src={nextEpisode.thumbnail}
                alt={nextEpisode.title}
                className="w-full h-32 object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

            {/* Countdown Timer */}
            <div className="absolute bottom-2 left-3 text-white text-sm">
              Next episode in {countdown}s
            </div>
          </div>

          {/* Episode Info */}
          <div className="p-4">
            <div className="text-gray-400 text-xs mb-1">
              S{nextEpisode.season} E{nextEpisode.episode}
            </div>
            <h4 className="text-white font-semibold mb-2 line-clamp-1">
              {nextEpisode.title}
            </h4>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleNextEpisode}
                className="flex-1 bg-white hover:bg-gray-200 text-black font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Play
              </button>
              <button
                onClick={() => setShowNextEpisode(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-700">
            <div
              className="h-full bg-netflix-red transition-all duration-1000"
              style={{ width: `${((30 - countdown) / 30) * 100}%` }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SkipButtons;
