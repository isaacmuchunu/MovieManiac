import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../lib/backendApi';

// Toast notification component (inline for simplicity)
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in`}>
      {type === 'success' && (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {type === 'error' && (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded p-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Section component for grouping settings
const SettingsSection = ({ title, description, children }) => (
  <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    {description && <p className="text-gray-400 text-sm mb-4">{description}</p>}
    <div className="space-y-4">{children}</div>
  </div>
);

// Toggle switch component
const Toggle = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-white font-medium">{label}</p>
      {description && <p className="text-gray-500 text-sm">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-14 h-7 rounded-full transition-colors ${
        enabled ? 'bg-netflix-red' : 'bg-gray-600'
      }`}
    >
      <span
        className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-8' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

// Input field component
const InputField = ({ label, type = 'text', value, onChange, placeholder, disabled, description, isSecret }) => (
  <div>
    <label className="block text-sm text-gray-400 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    />
    {description && <p className="text-gray-500 text-xs mt-1">{description}</p>}
    {isSecret && (
      <p className="text-yellow-500 text-xs mt-1 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        This value is stored securely and never sent to the browser
      </p>
    )}
  </div>
);

// Select component
const Select = ({ label, value, onChange, options, description }) => (
  <div>
    <label className="block text-sm text-gray-400 mb-2">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {description && <p className="text-gray-500 text-xs mt-1">{description}</p>}
  </div>
);

const Settings = () => {
  // General settings - safe to store in state
  const [settings, setSettings] = useState({
    siteName: 'Moovie',
    siteDescription: 'Your premium streaming platform',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    maxProfiles: 5,
    defaultLanguage: 'en',
    defaultQuality: 'auto'
  });

  // Feature flags - safe for frontend
  const [features, setFeatures] = useState({
    stripeEnabled: false,
    paypalEnabled: false,
    smtpEnabled: false,
    analyticsEnabled: true,
    tmdbSyncEnabled: true,
    notificationsEnabled: true
  });

  // Public keys only - NEVER store secret keys in frontend state
  const [publicKeys, setPublicKeys] = useState({
    stripePublicKey: '',
    googleAnalyticsId: '',
    tmdbApiKeyConfigured: false // Only boolean indicator, not the actual key
  });

  // Write-only secret fields - values typed here are only sent on save, never retrieved
  const [secretUpdates, setSecretUpdates] = useState({
    stripeSecretKey: '',
    smtpPassword: '',
    tmdbApiKey: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getSettings?.() || null;

      if (data) {
        // Only populate non-sensitive settings
        setSettings({
          siteName: data.siteName || 'Moovie',
          siteDescription: data.siteDescription || '',
          maintenanceMode: data.maintenanceMode || false,
          allowRegistration: data.allowRegistration ?? true,
          requireEmailVerification: data.requireEmailVerification ?? true,
          maxProfiles: data.maxProfiles || 5,
          defaultLanguage: data.defaultLanguage || 'en',
          defaultQuality: data.defaultQuality || 'auto'
        });

        setFeatures({
          stripeEnabled: data.stripeEnabled || false,
          paypalEnabled: data.paypalEnabled || false,
          smtpEnabled: data.smtpEnabled || false,
          analyticsEnabled: data.analyticsEnabled ?? true,
          tmdbSyncEnabled: data.tmdbSyncEnabled ?? true,
          notificationsEnabled: data.notificationsEnabled ?? true
        });

        setPublicKeys({
          stripePublicKey: data.stripePublicKey || '',
          googleAnalyticsId: data.googleAnalyticsId || '',
          tmdbApiKeyConfigured: data.tmdbApiKeyConfigured || false
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      // Use defaults for demo mode
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // Prepare payload - only include secrets if they were updated
      const payload = {
        ...settings,
        ...features,
        stripePublicKey: publicKeys.stripePublicKey,
        googleAnalyticsId: publicKeys.googleAnalyticsId
      };

      // Only include secrets if user entered new values
      if (secretUpdates.stripeSecretKey) {
        payload.stripeSecretKey = secretUpdates.stripeSecretKey;
      }
      if (secretUpdates.smtpPassword) {
        payload.smtpPassword = secretUpdates.smtpPassword;
      }
      if (secretUpdates.tmdbApiKey) {
        payload.tmdbApiKey = secretUpdates.tmdbApiKey;
      }

      // Call API
      if (adminApi.updateSettings) {
        await adminApi.updateSettings(payload);
      }

      // Clear secret fields after save
      setSecretUpdates({
        stripeSecretKey: '',
        smtpPassword: '',
        tmdbApiKey: ''
      });

      setToast({ message: 'Settings saved successfully', type: 'success' });
    } catch (error) {
      console.error('Failed to save settings:', error);
      setToast({ message: error.message || 'Failed to save settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'auth', label: 'Authentication', icon: '🔐' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'email', label: 'Email', icon: '📧' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
    { id: 'advanced', label: 'Advanced', icon: '🛠️' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-netflix-dark-gray rounded w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="h-12 bg-netflix-dark-gray rounded" />
            <div className="lg:col-span-3 space-y-6">
              <div className="h-48 bg-netflix-dark-gray rounded-xl" />
              <div className="h-48 bg-netflix-dark-gray rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="bg-netflix-dark-gray border-b border-gray-800 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 text-sm">Configure your platform settings</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  activeTab === tab.id
                    ? 'bg-netflix-red text-white'
                    : 'text-gray-400 hover:text-white hover:bg-netflix-medium-gray'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <>
                <SettingsSection title="Site Information" description="Basic information about your streaming platform">
                  <InputField
                    label="Site Name"
                    value={settings.siteName}
                    onChange={(v) => setSettings({ ...settings, siteName: v })}
                    placeholder="Moovie"
                  />
                  <InputField
                    label="Site Description"
                    value={settings.siteDescription}
                    onChange={(v) => setSettings({ ...settings, siteDescription: v })}
                    placeholder="Your premium streaming platform"
                  />
                  <Select
                    label="Default Language"
                    value={settings.defaultLanguage}
                    onChange={(v) => setSettings({ ...settings, defaultLanguage: v })}
                    options={[
                      { value: 'en', label: 'English' },
                      { value: 'es', label: 'Spanish' },
                      { value: 'fr', label: 'French' },
                      { value: 'de', label: 'German' },
                      { value: 'ja', label: 'Japanese' }
                    ]}
                  />
                </SettingsSection>

                <SettingsSection title="Playback Settings" description="Configure default video playback options">
                  <Select
                    label="Default Video Quality"
                    value={settings.defaultQuality}
                    onChange={(v) => setSettings({ ...settings, defaultQuality: v })}
                    options={[
                      { value: 'auto', label: 'Auto (Adaptive)' },
                      { value: '4k', label: '4K Ultra HD' },
                      { value: '1080p', label: '1080p Full HD' },
                      { value: '720p', label: '720p HD' },
                      { value: '480p', label: '480p SD' }
                    ]}
                    description="This can be overridden by users in their profile settings"
                  />
                  <InputField
                    label="Maximum Profiles per Account"
                    type="number"
                    value={settings.maxProfiles}
                    onChange={(v) => setSettings({ ...settings, maxProfiles: parseInt(v) || 5 })}
                    description="How many profiles each user can create"
                  />
                </SettingsSection>

                <SettingsSection title="Maintenance" description="System maintenance options">
                  <Toggle
                    label="Maintenance Mode"
                    description="When enabled, only admins can access the site"
                    enabled={settings.maintenanceMode}
                    onChange={(v) => setSettings({ ...settings, maintenanceMode: v })}
                  />
                </SettingsSection>
              </>
            )}

            {/* Authentication Settings */}
            {activeTab === 'auth' && (
              <>
                <SettingsSection title="Registration" description="Control user registration options">
                  <Toggle
                    label="Allow New Registrations"
                    description="When disabled, new users cannot sign up"
                    enabled={settings.allowRegistration}
                    onChange={(v) => setSettings({ ...settings, allowRegistration: v })}
                  />
                  <Toggle
                    label="Require Email Verification"
                    description="Users must verify their email before accessing content"
                    enabled={settings.requireEmailVerification}
                    onChange={(v) => setSettings({ ...settings, requireEmailVerification: v })}
                  />
                </SettingsSection>

                <SettingsSection title="Security" description="Authentication security settings">
                  <Toggle
                    label="Two-Factor Authentication"
                    description="Allow users to enable 2FA for their accounts"
                    enabled={features.twoFactorEnabled || false}
                    onChange={(v) => setFeatures({ ...features, twoFactorEnabled: v })}
                  />
                </SettingsSection>
              </>
            )}

            {/* Payment Settings */}
            {activeTab === 'payments' && (
              <>
                <SettingsSection title="Stripe" description="Configure Stripe payment processing">
                  <Toggle
                    label="Enable Stripe"
                    description="Accept payments via Stripe"
                    enabled={features.stripeEnabled}
                    onChange={(v) => setFeatures({ ...features, stripeEnabled: v })}
                  />
                  {features.stripeEnabled && (
                    <>
                      <InputField
                        label="Stripe Public Key"
                        value={publicKeys.stripePublicKey}
                        onChange={(v) => setPublicKeys({ ...publicKeys, stripePublicKey: v })}
                        placeholder="pk_live_..."
                        description="Your Stripe publishable key (safe for frontend)"
                      />
                      <InputField
                        label="Stripe Secret Key"
                        type="password"
                        value={secretUpdates.stripeSecretKey}
                        onChange={(v) => setSecretUpdates({ ...secretUpdates, stripeSecretKey: v })}
                        placeholder="Enter new key to update..."
                        isSecret
                        description="Leave empty to keep existing key"
                      />
                    </>
                  )}
                </SettingsSection>

                <SettingsSection title="PayPal" description="Configure PayPal payment processing">
                  <Toggle
                    label="Enable PayPal"
                    description="Accept payments via PayPal"
                    enabled={features.paypalEnabled}
                    onChange={(v) => setFeatures({ ...features, paypalEnabled: v })}
                  />
                </SettingsSection>
              </>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <SettingsSection title="SMTP Configuration" description="Configure email sending for notifications">
                <Toggle
                  label="Enable Email Notifications"
                  description="Send emails for password resets, welcome messages, etc."
                  enabled={features.smtpEnabled}
                  onChange={(v) => setFeatures({ ...features, smtpEnabled: v })}
                />
                {features.smtpEnabled && (
                  <>
                    <InputField
                      label="SMTP Host"
                      value={settings.smtpHost || ''}
                      onChange={(v) => setSettings({ ...settings, smtpHost: v })}
                      placeholder="smtp.example.com"
                    />
                    <InputField
                      label="SMTP Port"
                      type="number"
                      value={settings.smtpPort || 587}
                      onChange={(v) => setSettings({ ...settings, smtpPort: parseInt(v) })}
                      placeholder="587"
                    />
                    <InputField
                      label="SMTP Username"
                      value={settings.smtpUsername || ''}
                      onChange={(v) => setSettings({ ...settings, smtpUsername: v })}
                      placeholder="your-email@example.com"
                    />
                    <InputField
                      label="SMTP Password"
                      type="password"
                      value={secretUpdates.smtpPassword}
                      onChange={(v) => setSecretUpdates({ ...secretUpdates, smtpPassword: v })}
                      placeholder="Enter new password to update..."
                      isSecret
                    />
                    <InputField
                      label="From Email"
                      value={settings.fromEmail || ''}
                      onChange={(v) => setSettings({ ...settings, fromEmail: v })}
                      placeholder="noreply@moovie.com"
                    />
                  </>
                )}
              </SettingsSection>
            )}

            {/* Integrations */}
            {activeTab === 'integrations' && (
              <>
                <SettingsSection title="TMDB Integration" description="The Movie Database API for content metadata">
                  <Toggle
                    label="Enable TMDB Sync"
                    description="Automatically sync movie and TV show metadata"
                    enabled={features.tmdbSyncEnabled}
                    onChange={(v) => setFeatures({ ...features, tmdbSyncEnabled: v })}
                  />
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${publicKeys.tmdbApiKeyConfigured ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-gray-400 text-sm">
                      {publicKeys.tmdbApiKeyConfigured ? 'TMDB API Key is configured' : 'TMDB API Key not configured'}
                    </span>
                  </div>
                  <InputField
                    label="TMDB API Key"
                    type="password"
                    value={secretUpdates.tmdbApiKey}
                    onChange={(v) => setSecretUpdates({ ...secretUpdates, tmdbApiKey: v })}
                    placeholder="Enter new key to update..."
                    isSecret
                  />
                </SettingsSection>

                <SettingsSection title="Analytics" description="Track platform usage and performance">
                  <Toggle
                    label="Enable Analytics"
                    description="Collect anonymous usage statistics"
                    enabled={features.analyticsEnabled}
                    onChange={(v) => setFeatures({ ...features, analyticsEnabled: v })}
                  />
                  {features.analyticsEnabled && (
                    <InputField
                      label="Google Analytics ID"
                      value={publicKeys.googleAnalyticsId}
                      onChange={(v) => setPublicKeys({ ...publicKeys, googleAnalyticsId: v })}
                      placeholder="G-XXXXXXXXXX"
                    />
                  )}
                </SettingsSection>
              </>
            )}

            {/* Advanced Settings */}
            {activeTab === 'advanced' && (
              <>
                <SettingsSection title="Cache Management" description="Manage application caches">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Clear All Caches</p>
                      <p className="text-gray-500 text-sm">Clear API caches, CDN caches, and local storage</p>
                    </div>
                    <button
                      onClick={() => setToast({ message: 'Caches cleared successfully', type: 'success' })}
                      className="px-4 py-2 bg-netflix-medium-gray text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Clear Caches
                    </button>
                  </div>
                </SettingsSection>

                <SettingsSection title="Danger Zone" description="Irreversible actions">
                  <div className="border border-red-800 rounded-lg p-4 bg-red-900/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-400 font-medium">Reset to Defaults</p>
                        <p className="text-gray-500 text-sm">Reset all settings to their default values</p>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure? This will reset all settings to defaults.')) {
                            setToast({ message: 'Settings reset to defaults', type: 'success' });
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </SettingsSection>

                <SettingsSection title="Notifications" description="Configure system notifications">
                  <Toggle
                    label="Push Notifications"
                    description="Send push notifications to users"
                    enabled={features.notificationsEnabled}
                    onChange={(v) => setFeatures({ ...features, notificationsEnabled: v })}
                  />
                </SettingsSection>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Settings;
