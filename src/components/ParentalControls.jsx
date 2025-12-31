import { useState, useEffect, useRef } from 'react';

const ParentalControls = ({ onClose }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({
    enabled: true,
    maturityLevel: 'PG-13',
    restrictedProfiles: [],
    blockedTitles: [],
    viewingRestrictions: {
      violence: true,
      language: true,
      nudity: true,
      drugs: false
    },
    playbackPin: true,
    autoPlayNextEpisode: true,
    maxDailyHours: 0, // 0 = unlimited
    bedtime: null
  });
  const [showSetPin, setShowSetPin] = useState(false);
  const [newPin, setNewPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const newPinRefs = useRef([]);
  const confirmPinRefs = useRef([]);

  const maturityLevels = [
    { value: 'G', label: 'G - All Ages', description: 'Content suitable for all ages' },
    { value: 'PG', label: 'PG - Parental Guidance', description: 'Some content may not be suitable for children' },
    { value: 'PG-13', label: 'PG-13 - Parents Strongly Cautioned', description: 'Some content may be inappropriate for children under 13' },
    { value: 'R', label: 'R - Restricted', description: 'Under 17 requires accompanying parent' },
    { value: 'NC-17', label: 'NC-17 - Adults Only', description: 'No one 17 and under admitted' }
  ];

  useEffect(() => {
    const savedSettings = localStorage.getItem('moovie-parental-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    const hasPin = localStorage.getItem('moovie-parental-pin');
    if (!hasPin) {
      setIsLocked(false);
      setShowSetPin(true);
    }
  }, []);

  const handlePinChange = (index, value, pinArray, setPinArray, refs) => {
    if (!/^\d*$/.test(value)) return;

    const newPinArray = [...pinArray];
    newPinArray[index] = value.slice(-1);
    setPinArray(newPinArray);

    if (value && index < 3) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (index, e, pinArray, setPinArray, refs) => {
    if (e.key === 'Backspace' && !pinArray[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const verifyPin = () => {
    const enteredPin = pin.join('');
    const savedPin = localStorage.getItem('moovie-parental-pin');

    if (enteredPin === savedPin) {
      setIsLocked(false);
      setError('');
    } else {
      setError('Incorrect PIN');
      setPin(['', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const saveNewPin = () => {
    const newPinValue = newPin.join('');
    const confirmPinValue = confirmPin.join('');

    if (newPinValue.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    if (newPinValue !== confirmPinValue) {
      setError('PINs do not match');
      return;
    }

    localStorage.setItem('moovie-parental-pin', newPinValue);
    setShowSetPin(false);
    setNewPin(['', '', '', '']);
    setConfirmPin(['', '', '', '']);
    setError('');
  };

  const saveSettings = () => {
    localStorage.setItem('moovie-parental-settings', JSON.stringify(settings));
    onClose();
  };

  // PIN Entry Screen
  if (isLocked && !showSetPin) {
    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
        <div className="bg-netflix-dark-gray rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-netflix-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-netflix-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Enter PIN</h2>
            <p className="text-gray-400">Enter your 4-digit PIN to access parental controls</p>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="password"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value, pin, setPin, inputRefs)}
                onKeyDown={(e) => handlePinKeyDown(index, e, pin, setPin, inputRefs)}
                className="w-14 h-14 text-center text-2xl bg-netflix-medium-gray text-white rounded-lg focus:ring-2 focus:ring-netflix-red outline-none"
              />
            ))}
          </div>

          {error && (
            <p className="text-netflix-red text-center mb-4">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={verifyPin}
              disabled={pin.some(d => !d)}
              className="flex-1 py-3 bg-netflix-red hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Set PIN Screen
  if (showSetPin) {
    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
        <div className="bg-netflix-dark-gray rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Set Your PIN</h2>
            <p className="text-gray-400">Create a 4-digit PIN to protect parental controls</p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">New PIN</label>
            <div className="flex justify-center gap-3">
              {newPin.map((digit, index) => (
                <input
                  key={index}
                  ref={el => newPinRefs.current[index] = el}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value, newPin, setNewPin, newPinRefs)}
                  onKeyDown={(e) => handlePinKeyDown(index, e, newPin, setNewPin, newPinRefs)}
                  className="w-14 h-14 text-center text-2xl bg-netflix-medium-gray text-white rounded-lg focus:ring-2 focus:ring-netflix-red outline-none"
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">Confirm PIN</label>
            <div className="flex justify-center gap-3">
              {confirmPin.map((digit, index) => (
                <input
                  key={index}
                  ref={el => confirmPinRefs.current[index] = el}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value, confirmPin, setConfirmPin, confirmPinRefs)}
                  onKeyDown={(e) => handlePinKeyDown(index, e, confirmPin, setConfirmPin, confirmPinRefs)}
                  className="w-14 h-14 text-center text-2xl bg-netflix-medium-gray text-white rounded-lg focus:ring-2 focus:ring-netflix-red outline-none"
                />
              ))}
            </div>
          </div>

          {error && (
            <p className="text-netflix-red text-center mb-4">{error}</p>
          )}

          <button
            onClick={saveNewPin}
            className="w-full py-3 bg-netflix-red hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Set PIN
          </button>
        </div>
      </div>
    );
  }

  // Settings Screen
  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Parental Controls</h1>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Toggle Controls */}
          <div className="bg-netflix-dark-gray rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">Enable Parental Controls</h3>
                <p className="text-gray-400 text-sm">Restrict content based on maturity ratings</p>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, enabled: !s.enabled }))}
                className={`w-14 h-8 rounded-full transition-colors ${
                  settings.enabled ? 'bg-netflix-red' : 'bg-gray-600'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.enabled ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {settings.enabled && (
            <>
              {/* Maturity Level */}
              <div className="bg-netflix-dark-gray rounded-lg p-6 mb-6">
                <h3 className="text-white font-semibold mb-4">Maximum Maturity Level</h3>
                <div className="space-y-3">
                  {maturityLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setSettings(s => ({ ...s, maturityLevel: level.value }))}
                      className={`w-full p-4 rounded-lg text-left transition-all ${
                        settings.maturityLevel === level.value
                          ? 'bg-netflix-red/20 border-2 border-netflix-red'
                          : 'bg-netflix-medium-gray hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{level.label}</p>
                          <p className="text-gray-400 text-sm">{level.description}</p>
                        </div>
                        {settings.maturityLevel === level.value && (
                          <svg className="w-6 h-6 text-netflix-red" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Restrictions */}
              <div className="bg-netflix-dark-gray rounded-lg p-6 mb-6">
                <h3 className="text-white font-semibold mb-4">Content Restrictions</h3>
                <div className="space-y-4">
                  {Object.entries(settings.viewingRestrictions).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-300 capitalize">{key}</span>
                      <button
                        onClick={() => setSettings(s => ({
                          ...s,
                          viewingRestrictions: {
                            ...s.viewingRestrictions,
                            [key]: !value
                          }
                        }))}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          value ? 'bg-netflix-red' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Playback Settings */}
              <div className="bg-netflix-dark-gray rounded-lg p-6 mb-6">
                <h3 className="text-white font-semibold mb-4">Playback Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-300">Require PIN for playback</span>
                      <p className="text-gray-500 text-sm">Ask for PIN before playing restricted content</p>
                    </div>
                    <button
                      onClick={() => setSettings(s => ({ ...s, playbackPin: !s.playbackPin }))}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.playbackPin ? 'bg-netflix-red' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.playbackPin ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-300">Auto-play next episode</span>
                      <p className="text-gray-500 text-sm">Automatically play the next episode</p>
                    </div>
                    <button
                      onClick={() => setSettings(s => ({ ...s, autoPlayNextEpisode: !s.autoPlayNextEpisode }))}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.autoPlayNextEpisode ? 'bg-netflix-red' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.autoPlayNextEpisode ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Viewing Limits */}
              <div className="bg-netflix-dark-gray rounded-lg p-6 mb-6">
                <h3 className="text-white font-semibold mb-4">Viewing Limits</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-300 block mb-2">Daily Viewing Limit (hours)</label>
                    <select
                      value={settings.maxDailyHours}
                      onChange={(e) => setSettings(s => ({ ...s, maxDailyHours: parseInt(e.target.value) }))}
                      className="w-full bg-netflix-medium-gray text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-netflix-red"
                    >
                      <option value={0}>No limit</option>
                      <option value={1}>1 hour</option>
                      <option value={2}>2 hours</option>
                      <option value={3}>3 hours</option>
                      <option value={4}>4 hours</option>
                      <option value={6}>6 hours</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Change PIN */}
              <div className="bg-netflix-dark-gray rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Change PIN</h3>
                    <p className="text-gray-400 text-sm">Update your parental controls PIN</p>
                  </div>
                  <button
                    onClick={() => setShowSetPin(true)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Change
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Save Button */}
          <button
            onClick={saveSettings}
            className="w-full py-4 bg-netflix-red hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentalControls;
