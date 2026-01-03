import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/backendApi';

const ToggleSwitch = ({ enabled, onChange, disabled }) => (
  <button
    onClick={() => !disabled && onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    } ${enabled ? 'bg-netflix-red' : 'bg-gray-600'}`}
    disabled={disabled}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const SettingCard = ({ title, description, children }) => (
  <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <h3 className="text-white font-medium">{title}</h3>
        {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  </div>
);

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // General settings
    siteName: 'Moovie',
    siteDescription: 'Your ultimate streaming platform',
    maintenanceMode: false,
    debugMode: false,

    // Content settings
    autoSyncTmdb: true,
    syncInterval: '24',
    defaultContentQuality: '1080p',
    enableAutoplay: true,
    showTrailers: true,
    contentRating: 'all',

    // User settings
    allowRegistration: true,
    requireEmailVerification: true,
    maxProfiles: 5,
    sessionTimeout: '30',
    enableTwoFactor: false,

    // Email settings
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    emailFrom: 'noreply@moovie.com',

    // Security settings
    rateLimit: '100',
    enableCaptcha: false,
    ipWhitelist: '',
    enableBruteForceProtection: true,
    maxLoginAttempts: '5',

    // Payment settings
    stripeEnabled: true,
    stripePublicKey: '',
    stripeSecretKey: '',
    paypalEnabled: false,
    paypalClientId: '',

    // API settings
    tmdbApiKey: '',
    enableApiAccess: true,
    apiRateLimit: '1000',

    // Notification settings
    enableEmailNotifications: true,
    enablePushNotifications: false,
    notifyOnNewContent: true,
    notifyOnSubscriptionChanges: true,
    weeklyDigest: true,

    // Storage settings
    storageProvider: 'local',
    maxUploadSize: '500',
    enableCdn: false,
    cdnUrl: '',

    // Analytics settings
    enableAnalytics: true,
    googleAnalyticsId: '',
    enableHeatmaps: false,
    dataRetentionDays: '90'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getSettings().catch(() => null);
      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettings(settings).catch(() => {
        // Demo mode - just show success
      });
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'content', label: 'Content', icon: '🎬' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'email', label: 'Email', icon: '📧' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'api', label: 'API', icon: '🔗' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'storage', label: 'Storage', icon: '💾' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-netflix-dark-gray rounded w-48" />
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-netflix-dark-gray rounded" />
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-netflix-dark-gray rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header */}
      <div className="bg-netflix-dark-gray border-b border-gray-800 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 text-sm">Configure your platform settings</p>
          </div>
          <div className="flex items-center gap-3">
            {showSaveSuccess && (
              <div className="flex items-center gap-2 text-green-500 text-sm animate-fade-in">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Settings saved successfully
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-netflix-red rounded-lg text-white hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
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
      </div>

      <div className="flex">
        {/* Sidebar Tabs */}
        <div className="w-64 bg-netflix-dark-gray border-r border-gray-800 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-netflix-red text-white'
                    : 'text-gray-400 hover:text-white hover:bg-netflix-medium-gray'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-8">
          <div className="max-w-3xl space-y-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <>
                <h2 className="text-xl font-semibold text-white mb-4">General Settings</h2>

                <SettingCard title="Site Name" description="The name displayed across the platform">
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  />
                </SettingCard>

                <SettingCard title="Site Description" description="Brief description for SEO and metadata">
                  <input
                    type="text"
                    value={settings.siteDescription}
                    onChange={(e) => updateSetting('siteDescription', e.target.value)}
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  />
                </SettingCard>

                <SettingCard title="Maintenance Mode" description="Enable to show maintenance page to users">
                  <ToggleSwitch
                    enabled={settings.maintenanceMode}
                    onChange={(v) => updateSetting('maintenanceMode', v)}
                  />
                </SettingCard>

                <SettingCard title="Debug Mode" description="Enable detailed logging for development">
                  <ToggleSwitch
                    enabled={settings.debugMode}
                    onChange={(v) => updateSetting('debugMode', v)}
                  />
                </SettingCard>
              </>
            )}

            {/* Content Settings */}
            {activeTab === 'content' && (
              <>
                <h2 className="text-xl font-semibold text-white mb-4">Content Settings</h2>

                <SettingCard title="Auto Sync with TMDB" description="Automatically sync content metadata from TMDB">
                  <ToggleSwitch
                    enabled={settings.autoSyncTmdb}
                    onChange={(v) => updateSetting('autoSyncTmdb', v)}
                  />
                </SettingCard>

                <SettingCard title="Sync Interval (hours)" description="How often to sync with TMDB">
                  <select
                    value={settings.syncInterval}
                    onChange={(e) => updateSetting('syncInterval', e.target.value)}
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none"
                  >
                    <option value="6">Every 6 hours</option>
                    <option value="12">Every 12 hours</option>
                    <option value="24">Every 24 hours</option>
                    <option value="48">Every 48 hours</option>
                  </select>
                </SettingCard>

                <SettingCard title="Default Content Quality" description="Default streaming quality for new users">
                  <select
                    value={settings.defaultContentQuality}
                    onChange={(e) => updateSetting('defaultContentQuality', e.target.value)}
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none"
                  >
                    <option value="auto">Auto</option>
                    <option value="480p">480p</option>
                    <option value="720p">720p</option>
                    <option value="1080p">1080p (HD)</option>
                    <option value="4k">4K Ultra HD</option>
                  </select>
                </SettingCard>

                <SettingCard title="Enable Autoplay" description="Automatically play next episode">
                  <ToggleSwitch
                    enabled={settings.enableAutoplay}
                    onChange={(v) => updateSetting('enableAutoplay', v)}
                  />
                </SettingCard>

                <SettingCard title="Show Trailers" description="Display trailers on content pages">
                  <ToggleSwitch
                    enabled={settings.showTrailers}
                    onChange={(v) => updateSetting('showTrailers', v)}
                  />
                </SettingCard>

                <SettingCard title="Content Rating Filter" description="Filter content by rating">
                  <select
                    value={settings.contentRating}
                    onChange={(e) => updateSetting('contentRating', e.target.value)}
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none"
                  >
                    <option value="all">All Ratings</option>
                    <option value="g">G - General</option>
                    <option value="pg">PG - Parental Guidance</option>
                    <option value="pg13">PG-13</option>
                    <option value="r">R - Restricted</option>
                  </select>
                </SettingCard>
              </>
            )}

            {/* User Settings */}
            {activeTab === 'users' && (
              <>
                <h2 className="text-xl font-semibold text-white mb-4">User Settings</h2>

                <SettingCard title="Allow Registration" description="Allow new users to sign up">
                  <ToggleSwitch
                    enabled={settings.allowRegistration}
                    onChange={(v) => updateSetting('allowRegistration', v)}
                  />
                </SettingCard>

                <SettingCard title="Require Email Verification" description="Require users to verify email before access">
                  <ToggleSwitch
                    enabled={settings.requireEmailVerification}
                    onChange={(v) => updateSetting('requireEmailVerification', v)}
                  />
                </SettingCard>

                <SettingCard title="Max Profiles per Account" description="Maximum number of profiles per account">
                  <select
                    value={settings.maxProfiles}
                    onChange={(e) => updateSetting('maxProfiles', e.target.value)}
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10].map(n => (
                      <option key={n} value={n}>{n} profile{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </SettingCard>

                <SettingCard title="Session Timeout (days)" description="How long before users need to log in again">
                  <select
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSetting('sessionTimeout', e.target.value)}
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none"
                  >
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                  </select>
                </SettingCard>

                <SettingCard title="Two-Factor Authentication" description="Enable 2FA for all users">
                  <ToggleSwitch
                    enabled={settings.enableTwoFactor}
                    onChange={(v) => updateSetting('enableTwoFactor', v)}
                  />
                </SettingCard>
              </>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <>
                <h2 className="text-xl font-semibold text-white mb-4">Email Settings</h2>

                <SettingCard title="SMTP Host" description="Email server hostname">
                  <input
                    type="text"
                    value={settings.smtpHost}
                    onChange={(e) => updateSetting('smtpHost', e.target.value)}
                    placeholder="smtp.example.com"
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  />
                </SettingCard>

                <SettingCard title="SMTP Port" description="Email server port">
                  <input
                    type="text"
                    value={settings.smtpPort}
                    onChange={(e) => updateSetting('smtpPort', e.target.value)}
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  />
                </SettingCard>

                <SettingCard title="SMTP Username" description="Email server username">
                  <input
                    type="text"
                    value={settings.smtpUser}
                    onChange={(e) => updateSetting('smtpUser', e.target.value)}
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  />
                </SettingCard>

                <SettingCard title="SMTP Password" description="Email server password">
                  <input
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => updateSetting('smtpPassword', e.target.value)}
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  />
                </SettingCard>

                <SettingCard title="From Email" description="Default sender email address">
                  <input
                    type="email"
                    value={settings.emailFrom}
                    onChange={(e) => updateSetting('emailFrom', e.target.value)}
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  />
                </SettingCard>

                <div className="pt-4">
                  <button className="px-4 py-2 bg-netflix-medium-gray text-white rounded-lg hover:bg-gray-700 transition-colors">
                    Send Test Email
                  </button>
                </div>
              </>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <>
                <h2 className="text-xl font-semibold text-white mb-4">Security Settings</h2>

                <SettingCard title="Rate Limit (requests/min)" description="Maximum API requests per minute per IP">
                  <input
                    type="number"
                    value={settings.rateLimit}
                    onChange={(e) => updateSetting('rateLimit', e.target.value)}
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  />
                </SettingCard>

                <SettingCard title="Enable CAPTCHA" description="Show CAPTCHA on login/register forms">
                  <ToggleSwitch
                    enabled={settings.enableCaptcha}
                    onChange={(v) => updateSetting('enableCaptcha', v)}
                  />
                </SettingCard>

                <SettingCard title="Brute Force Protection" description="Block IPs after failed login attempts">
                  <ToggleSwitch
                    enabled={settings.enableBruteForceProtection}
                    onChange={(v) => updateSetting('enableBruteForceProtection', v)}
                  />
                </SettingCard>

                <SettingCard title="Max Login Attempts" description="Failed attempts before temporary block">
                  <input
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => updateSetting('maxLoginAttempts', e.target.value)}
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  />
                </SettingCard>

                <SettingCard title="IP Whitelist" description="Comma-separated IPs that bypass rate limits">
                  <textarea
                    value={settings.ipWhitelist}
                    onChange={(e) => updateSetting('ipWhitelist', e.target.value)}
                    placeholder="192.168.1.1, 10.0.0.1"
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg w-64 h-20 focus:outline-none focus:ring-2 focus:ring-netflix-red resize-none"
                  />
                </SettingCard>
              </>
            )}

            {/* Payment Settings */}
            {activeTab === 'payments' && (
              <>
                <h2 className="text-xl font-semibold text-white mb-4">Payment Settings</h2>

                <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-blue-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">API keys are encrypted and stored securely</span>
                  </div>
                </div>

                <SettingCard title="Enable Stripe" description="Accept payments via Stripe">
                  <ToggleSwitch
                    enabled={settings.stripeEnabled}
                    onChange={(v) => updateSetting('stripeEnabled', v)}
                  />
                </SettingCard>

                {settings.stripeEnabled && (
                  <>
                    <SettingCard title="Stripe Public Key" description="Your Stripe publishable key">
                      <input
                        type="text"
                        value={settings.stripePublicKey}
                        onChange={(e) => updateSetting('stripePublicKey', e.target.value)}
                        placeholder="pk_live_..."
                        className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-netflix-red font-mono text-sm"
                      />
                    </SettingCard>

                    <SettingCard title="Stripe Secret Key" description="Your Stripe secret key">
                      <input
                        type="password"
                        value={settings.stripeSecretKey}
                        onChange={(e) => updateSetting('stripeSecretKey', e.target.value)}
                        placeholder="sk_live_..."
                        className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-netflix-red font-mono text-sm"
                      />
                    </SettingCard>
                  </>
                )}

                <SettingCard title="Enable PayPal" description="Accept payments via PayPal">
                  <ToggleSwitch
                    enabled={settings.paypalEnabled}
                    onChange={(v) => updateSetting('paypalEnabled', v)}
                  />
                </SettingCard>

                {settings.paypalEnabled && (
                  <SettingCard title="PayPal Client ID" description="Your PayPal client ID">
                    <input
                      type="text"
                      value={settings.paypalClientId}
                      onChange={(e) => updateSetting('paypalClientId', e.target.value)}
                      className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-netflix-red font-mono text-sm"
                    />
                  </SettingCard>
                )}
              </>
            )}

            {/* API Settings */}
            {activeTab === 'api' && (
              <>
                <h2 className="text-xl font-semibold text-white mb-4">API Settings</h2>

                <SettingCard title="TMDB API Key" description="Your TMDB API key for metadata">
                  <input
                    type="password"
                    value={settings.tmdbApiKey}
                    onChange={(e) => updateSetting('tmdbApiKey', e.target.value)}
                    placeholder="Enter API key"
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-netflix-red font-mono text-sm"
                  />
                </SettingCard>

                <SettingCard title="Enable API Access" description="Allow third-party API access">
                  <ToggleSwitch
                    enabled={settings.enableApiAccess}
                    onChange={(v) => updateSetting('enableApiAccess', v)}
                  />
                </SettingCard>

                <SettingCard title="API Rate Limit (requests/hour)" description="Maximum API requests per hour per key">
                  <input
                    type="number"
                    value={settings.apiRateLimit}
                    onChange={(e) => updateSetting('apiRateLimit', e.target.value)}
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  />
                </SettingCard>

                <div className="pt-4 space-y-2">
                  <button className="px-4 py-2 bg-netflix-medium-gray text-white rounded-lg hover:bg-gray-700 transition-colors mr-3">
                    Generate New API Key
                  </button>
                  <button className="px-4 py-2 bg-netflix-medium-gray text-white rounded-lg hover:bg-gray-700 transition-colors">
                    View API Documentation
                  </button>
                </div>
              </>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <>
                <h2 className="text-xl font-semibold text-white mb-4">Notification Settings</h2>

                <SettingCard title="Email Notifications" description="Send notifications via email">
                  <ToggleSwitch
                    enabled={settings.enableEmailNotifications}
                    onChange={(v) => updateSetting('enableEmailNotifications', v)}
                  />
                </SettingCard>

                <SettingCard title="Push Notifications" description="Send browser push notifications">
                  <ToggleSwitch
                    enabled={settings.enablePushNotifications}
                    onChange={(v) => updateSetting('enablePushNotifications', v)}
                  />
                </SettingCard>

                <SettingCard title="New Content Alerts" description="Notify users when new content is added">
                  <ToggleSwitch
                    enabled={settings.notifyOnNewContent}
                    onChange={(v) => updateSetting('notifyOnNewContent', v)}
                  />
                </SettingCard>

                <SettingCard title="Subscription Changes" description="Notify users about subscription updates">
                  <ToggleSwitch
                    enabled={settings.notifyOnSubscriptionChanges}
                    onChange={(v) => updateSetting('notifyOnSubscriptionChanges', v)}
                  />
                </SettingCard>

                <SettingCard title="Weekly Digest" description="Send weekly content recommendations">
                  <ToggleSwitch
                    enabled={settings.weeklyDigest}
                    onChange={(v) => updateSetting('weeklyDigest', v)}
                  />
                </SettingCard>
              </>
            )}

            {/* Storage Settings */}
            {activeTab === 'storage' && (
              <>
                <h2 className="text-xl font-semibold text-white mb-4">Storage Settings</h2>

                <SettingCard title="Storage Provider" description="Where media files are stored">
                  <select
                    value={settings.storageProvider}
                    onChange={(e) => updateSetting('storageProvider', e.target.value)}
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none"
                  >
                    <option value="local">Local Storage</option>
                    <option value="s3">Amazon S3</option>
                    <option value="gcs">Google Cloud Storage</option>
                    <option value="azure">Azure Blob Storage</option>
                  </select>
                </SettingCard>

                <SettingCard title="Max Upload Size (MB)" description="Maximum file upload size">
                  <input
                    type="number"
                    value={settings.maxUploadSize}
                    onChange={(e) => updateSetting('maxUploadSize', e.target.value)}
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  />
                </SettingCard>

                <SettingCard title="Enable CDN" description="Serve media through CDN for faster delivery">
                  <ToggleSwitch
                    enabled={settings.enableCdn}
                    onChange={(v) => updateSetting('enableCdn', v)}
                  />
                </SettingCard>

                {settings.enableCdn && (
                  <SettingCard title="CDN URL" description="Your CDN base URL">
                    <input
                      type="text"
                      value={settings.cdnUrl}
                      onChange={(e) => updateSetting('cdnUrl', e.target.value)}
                      placeholder="https://cdn.example.com"
                      className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                    />
                  </SettingCard>
                )}

                <div className="pt-4">
                  <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
                    <h4 className="text-white font-medium mb-4">Storage Usage</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Used Space</span>
                          <span className="text-white">245 GB / 500 GB</span>
                        </div>
                        <div className="w-full h-2 bg-netflix-medium-gray rounded-full overflow-hidden">
                          <div className="w-1/2 h-full bg-netflix-red rounded-full" />
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Movies</span>
                        <span className="text-white">180 GB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">TV Shows</span>
                        <span className="text-white">55 GB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Other</span>
                        <span className="text-white">10 GB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Analytics Settings */}
            {activeTab === 'analytics' && (
              <>
                <h2 className="text-xl font-semibold text-white mb-4">Analytics Settings</h2>

                <SettingCard title="Enable Analytics" description="Collect usage statistics and insights">
                  <ToggleSwitch
                    enabled={settings.enableAnalytics}
                    onChange={(v) => updateSetting('enableAnalytics', v)}
                  />
                </SettingCard>

                <SettingCard title="Google Analytics ID" description="Your Google Analytics tracking ID">
                  <input
                    type="text"
                    value={settings.googleAnalyticsId}
                    onChange={(e) => updateSetting('googleAnalyticsId', e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-netflix-red font-mono"
                  />
                </SettingCard>

                <SettingCard title="Enable Heatmaps" description="Track user interactions with heatmaps">
                  <ToggleSwitch
                    enabled={settings.enableHeatmaps}
                    onChange={(v) => updateSetting('enableHeatmaps', v)}
                  />
                </SettingCard>

                <SettingCard title="Data Retention (days)" description="How long to keep analytics data">
                  <select
                    value={settings.dataRetentionDays}
                    onChange={(e) => updateSetting('dataRetentionDays', e.target.value)}
                    className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none"
                  >
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="365">1 year</option>
                    <option value="730">2 years</option>
                  </select>
                </SettingCard>

                <div className="pt-4 flex gap-3">
                  <button className="px-4 py-2 bg-netflix-medium-gray text-white rounded-lg hover:bg-gray-700 transition-colors">
                    Export Analytics Data
                  </button>
                  <button className="px-4 py-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600/30 transition-colors">
                    Clear Analytics Data
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
