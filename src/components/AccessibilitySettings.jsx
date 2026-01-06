import { useState, useEffect } from 'react';

const AccessibilitySettings = ({ onClose }) => {
  const [settings, setSettings] = useState({
    // Visual
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    textScale: 100,

    // Audio
    audioDescriptions: false,
    voiceGuidance: false,
    soundEffectsVolume: 100,

    // Subtitles
    subtitlesEnabled: true,
    subtitleLanguage: 'en',
    subtitleSize: 'medium',
    subtitleBackground: 'semi-transparent',
    subtitleColor: 'white',
    subtitleFont: 'default',

    // Playback
    autoPlayPreviews: true,
    autoPlayNextEpisode: true,
    defaultPlaybackSpeed: 1,

    // Navigation
    keyboardShortcuts: true,
    focusIndicators: true,
    screenReaderOptimized: false
  });

  const [activeSection, setActiveSection] = useState('visual');

  useEffect(() => {
    const savedSettings = localStorage.getItem('moovie-accessibility');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // Apply settings to document
    document.documentElement.classList.toggle('high-contrast', settings.highContrast);
    document.documentElement.classList.toggle('reduced-motion', settings.reducedMotion);
    document.documentElement.classList.toggle('large-text', settings.largeText);
    document.documentElement.style.setProperty('--text-scale', `${settings.textScale}%`);
  }, [settings.highContrast, settings.reducedMotion, settings.largeText, settings.textScale]);

  const saveSettings = () => {
    localStorage.setItem('moovie-accessibility', JSON.stringify(settings));
    onClose();
  };

  const sections = [
    { id: 'visual', label: 'Visual', icon: '👁️' },
    { id: 'audio', label: 'Audio', icon: '🔊' },
    { id: 'subtitles', label: 'Subtitles', icon: '💬' },
    { id: 'playback', label: 'Playback', icon: '▶️' },
    { id: 'navigation', label: 'Navigation', icon: '⌨️' }
  ];

  const subtitleSizes = ['small', 'medium', 'large', 'extra-large'];
  const subtitleBackgrounds = ['none', 'semi-transparent', 'opaque'];
  const subtitleColors = ['white', 'yellow', 'green', 'cyan'];
  const subtitleFonts = ['default', 'sans-serif', 'serif', 'monospace', 'dyslexic'];
  const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const renderToggle = (key, label, description = null) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <span className="text-white">{label}</span>
        {description && <p className="text-gray-500 text-sm">{description}</p>}
      </div>
      <button
        onClick={() => setSettings(s => ({ ...s, [key]: !s[key] }))}
        className={`w-12 h-6 rounded-full transition-colors ${
          settings[key] ? 'bg-netflix-red' : 'bg-gray-600'
        }`}
        aria-pressed={settings[key]}
        aria-label={`Toggle ${label}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
          settings[key] ? 'translate-x-6' : 'translate-x-0.5'
        }`} />
      </button>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'visual':
        return (
          <div className="space-y-1">
            {renderToggle('highContrast', 'High Contrast Mode', 'Increase contrast for better visibility')}
            {renderToggle('reducedMotion', 'Reduce Motion', 'Minimize animations and transitions')}
            {renderToggle('largeText', 'Large Text', 'Increase text size throughout the app')}

            <div className="py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white">Text Scale</span>
                <span className="text-gray-400">{settings.textScale}%</span>
              </div>
              <input
                type="range"
                min="75"
                max="200"
                step="25"
                value={settings.textScale}
                onChange={(e) => setSettings(s => ({ ...s, textScale: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-netflix-red"
                aria-label="Text scale percentage"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>75%</span>
                <span>200%</span>
              </div>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="space-y-1">
            {renderToggle('audioDescriptions', 'Audio Descriptions', 'Narrated descriptions of visual elements')}
            {renderToggle('voiceGuidance', 'Voice Guidance', 'Spoken feedback for navigation')}

            <div className="py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white">Sound Effects Volume</span>
                <span className="text-gray-400">{settings.soundEffectsVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={settings.soundEffectsVolume}
                onChange={(e) => setSettings(s => ({ ...s, soundEffectsVolume: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-netflix-red"
                aria-label="Sound effects volume"
              />
            </div>
          </div>
        );

      case 'subtitles':
        return (
          <div className="space-y-4">
            {renderToggle('subtitlesEnabled', 'Enable Subtitles', 'Show subtitles when available')}

            {settings.subtitlesEnabled && (
              <>
                <div>
                  <label className="text-white block mb-2">Subtitle Size</label>
                  <div className="grid grid-cols-4 gap-2">
                    {subtitleSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSettings(s => ({ ...s, subtitleSize: size }))}
                        className={`py-2 px-3 rounded-lg text-sm capitalize transition-colors ${
                          settings.subtitleSize === size
                            ? 'bg-netflix-red text-white'
                            : 'bg-netflix-medium-gray text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white block mb-2">Background</label>
                  <div className="grid grid-cols-3 gap-2">
                    {subtitleBackgrounds.map((bg) => (
                      <button
                        key={bg}
                        onClick={() => setSettings(s => ({ ...s, subtitleBackground: bg }))}
                        className={`py-2 px-3 rounded-lg text-sm capitalize transition-colors ${
                          settings.subtitleBackground === bg
                            ? 'bg-netflix-red text-white'
                            : 'bg-netflix-medium-gray text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white block mb-2">Text Color</label>
                  <div className="flex gap-3">
                    {subtitleColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSettings(s => ({ ...s, subtitleColor: color }))}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          settings.subtitleColor === color
                            ? 'border-netflix-red scale-110'
                            : 'border-transparent hover:border-gray-500'
                        }`}
                        style={{ backgroundColor: color === 'white' ? '#fff' : color }}
                        aria-label={`${color} text color`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white block mb-2">Font</label>
                  <select
                    value={settings.subtitleFont}
                    onChange={(e) => setSettings(s => ({ ...s, subtitleFont: e.target.value }))}
                    className="w-full bg-netflix-medium-gray text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-netflix-red"
                  >
                    {subtitleFonts.map((font) => (
                      <option key={font} value={font} className="capitalize">
                        {font === 'dyslexic' ? 'Dyslexia-Friendly' : font.charAt(0).toUpperCase() + font.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preview */}
                <div className="bg-black p-6 rounded-lg">
                  <p className="text-center text-gray-400 text-sm mb-4">Preview</p>
                  <div className="bg-gray-900 p-4 rounded flex items-center justify-center">
                    <span
                      className={`
                        px-3 py-1 rounded
                        ${settings.subtitleSize === 'small' ? 'text-sm' : ''}
                        ${settings.subtitleSize === 'medium' ? 'text-base' : ''}
                        ${settings.subtitleSize === 'large' ? 'text-xl' : ''}
                        ${settings.subtitleSize === 'extra-large' ? 'text-2xl' : ''}
                        ${settings.subtitleBackground === 'none' ? 'bg-transparent' : ''}
                        ${settings.subtitleBackground === 'semi-transparent' ? 'bg-black/70' : ''}
                        ${settings.subtitleBackground === 'opaque' ? 'bg-black' : ''}
                        ${settings.subtitleFont === 'sans-serif' ? 'font-sans' : ''}
                        ${settings.subtitleFont === 'serif' ? 'font-serif' : ''}
                        ${settings.subtitleFont === 'monospace' ? 'font-mono' : ''}
                      `}
                      style={{ color: settings.subtitleColor }}
                    >
                      Sample subtitle text
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'playback':
        return (
          <div className="space-y-4">
            {renderToggle('autoPlayPreviews', 'Auto-Play Previews', 'Automatically play video previews')}
            {renderToggle('autoPlayNextEpisode', 'Auto-Play Next Episode', 'Automatically start next episode')}

            <div>
              <label className="text-white block mb-2">Default Playback Speed</label>
              <div className="grid grid-cols-4 gap-2">
                {playbackSpeeds.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSettings(s => ({ ...s, defaultPlaybackSpeed: speed }))}
                    className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                      settings.defaultPlaybackSpeed === speed
                        ? 'bg-netflix-red text-white'
                        : 'bg-netflix-medium-gray text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'navigation':
        return (
          <div className="space-y-1">
            {renderToggle('keyboardShortcuts', 'Keyboard Shortcuts', 'Enable keyboard navigation shortcuts')}
            {renderToggle('focusIndicators', 'Enhanced Focus Indicators', 'Show visible focus outlines')}
            {renderToggle('screenReaderOptimized', 'Screen Reader Optimization', 'Optimize for screen readers')}

            {settings.keyboardShortcuts && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="text-white font-medium mb-3">Keyboard Shortcuts</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Play/Pause</span>
                    <kbd className="px-2 py-1 bg-netflix-medium-gray rounded text-white">Space</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fullscreen</span>
                    <kbd className="px-2 py-1 bg-netflix-medium-gray rounded text-white">F</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mute</span>
                    <kbd className="px-2 py-1 bg-netflix-medium-gray rounded text-white">M</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Seek Forward</span>
                    <kbd className="px-2 py-1 bg-netflix-medium-gray rounded text-white">→</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Seek Back</span>
                    <kbd className="px-2 py-1 bg-netflix-medium-gray rounded text-white">←</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume Up</span>
                    <kbd className="px-2 py-1 bg-netflix-medium-gray rounded text-white">↑</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume Down</span>
                    <kbd className="px-2 py-1 bg-netflix-medium-gray rounded text-white">↓</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Toggle Subtitles</span>
                    <kbd className="px-2 py-1 bg-netflix-medium-gray rounded text-white">C</kbd>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Accessibility</h1>
              <p className="text-gray-400 mt-1">Customize your viewing experience</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Close accessibility settings"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex gap-6">
            {/* Sidebar Navigation */}
            <nav className="w-48 flex-shrink-0">
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                        activeSection === section.id
                          ? 'bg-netflix-red text-white'
                          : 'text-gray-400 hover:text-white hover:bg-netflix-medium-gray'
                      }`}
                    >
                      <span>{section.icon}</span>
                      <span>{section.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Content */}
            <div className="flex-1 bg-netflix-dark-gray rounded-lg p-6">
              {renderSection()}
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveSettings}
              className="px-6 py-3 bg-netflix-red hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
