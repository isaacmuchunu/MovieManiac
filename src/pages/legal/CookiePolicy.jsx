import { useState } from 'react';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always required
    functional: true,
    analytics: true,
    advertising: false
  });

  const handleSavePreferences = () => {
    // TODO: Implement cookie preference saving
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    alert('Cookie preferences saved!');
  };

  const cookieTypes = [
    {
      name: 'Strictly Necessary Cookies',
      key: 'necessary',
      required: true,
      description: 'These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility. You may disable these by changing your browser settings, but this may affect how the website functions.',
      examples: [
        'Session authentication',
        'Load balancing',
        'Security tokens',
        'User preferences'
      ]
    },
    {
      name: 'Functional Cookies',
      key: 'functional',
      required: false,
      description: 'These cookies enable enhanced functionality and personalization, such as videos and live chats. They may be set by us or by third-party providers whose services we have added to our pages.',
      examples: [
        'Video player settings',
        'Audio/subtitle preferences',
        'Recently watched content',
        'Watchlist data'
      ]
    },
    {
      name: 'Analytics Cookies',
      key: 'analytics',
      required: false,
      description: 'These cookies help us understand how visitors interact with our website. They help us improve our service by collecting and reporting information anonymously.',
      examples: [
        'Page views and navigation',
        'Time spent on pages',
        'Device and browser info',
        'Geographic location'
      ]
    },
    {
      name: 'Advertising Cookies',
      key: 'advertising',
      required: false,
      description: 'These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing and ensuring that ads are properly displayed.',
      examples: [
        'Ad personalization',
        'Campaign effectiveness',
        'Cross-site tracking',
        'Retargeting'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-netflix-red hover:text-red-600 mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: January 9, 2026</p>

        {/* Cookie Preferences Panel */}
        <div className="bg-gradient-to-r from-netflix-red/20 to-transparent border border-netflix-red/50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Manage Your Cookie Preferences</h2>
          <p className="text-gray-300 mb-6">
            Choose which types of cookies you want to allow. Note that blocking some types of cookies may impact your experience.
          </p>

          <div className="space-y-4 mb-6">
            {cookieTypes.map((type) => (
              <div key={type.key} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{type.name}</h3>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={cookiePreferences[type.key]}
                      disabled={type.required}
                      onChange={(e) => setCookiePreferences({
                        ...cookiePreferences,
                        [type.key]: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-netflix-red after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full ${type.required ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                  </label>
                </div>
                {type.required && (
                  <div className="text-xs text-yellow-400 mt-2">
                    Always Active - Required for website functionality
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSavePreferences}
            className="bg-netflix-red hover:bg-red-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
          >
            Save Preferences
          </button>
        </div>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
            <p className="text-gray-300 mb-4">
              Cookies are small text files that are placed on your device when you visit our website. They help us
              provide you with a better experience by remembering your preferences, understanding how you use our
              service, and improving our content and features.
            </p>
            <p className="text-gray-300 mb-4">
              Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device after you
              close your browser, while session cookies are deleted when you close your browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
            <p className="text-gray-300 mb-4">We use cookies for several purposes:</p>

            <div className="space-y-6">
              {cookieTypes.map((type, index) => (
                <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">{type.name}</h3>
                  <p className="text-gray-400 mb-4">{type.description}</p>
                  <div>
                    <h4 className="font-medium mb-2">Examples:</h4>
                    <ul className="list-disc pl-6 text-gray-400 space-y-1">
                      {type.examples.map((example, exIndex) => (
                        <li key={exIndex}>{example}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
            <p className="text-gray-300 mb-4">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics
              of the service and deliver advertisements on and through the service.
            </p>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Third-Party Services We Use:</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-netflix-red mt-1">•</span>
                  <div>
                    <strong className="text-white">Google Analytics:</strong> Helps us understand how visitors use our website
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-netflix-red mt-1">•</span>
                  <div>
                    <strong className="text-white">Payment Processors:</strong> Securely process subscription payments
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-netflix-red mt-1">•</span>
                  <div>
                    <strong className="text-white">Content Delivery Networks:</strong> Improve video streaming performance
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-netflix-red mt-1">•</span>
                  <div>
                    <strong className="text-white">Social Media Platforms:</strong> Enable content sharing and social features
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
            <p className="text-gray-300 mb-4">
              You have several options for managing cookies:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-900 border-l-4 border-netflix-red p-4 rounded">
                <h4 className="font-semibold mb-2">Browser Settings</h4>
                <p className="text-sm text-gray-400">
                  Most web browsers allow you to control cookies through their settings preferences. However, limiting
                  cookies may impact your experience on our service.
                </p>
              </div>

              <div className="bg-gray-900 border-l-4 border-netflix-red p-4 rounded">
                <h4 className="font-semibold mb-2">Our Cookie Preference Tool</h4>
                <p className="text-sm text-gray-400">
                  Use the preference tool at the top of this page to customize which cookies you allow on Moovie.
                </p>
              </div>

              <div className="bg-gray-900 border-l-4 border-netflix-red p-4 rounded">
                <h4 className="font-semibold mb-2">Third-Party Opt-Out</h4>
                <p className="text-sm text-gray-400">
                  Visit industry opt-out pages such as{' '}
                  <a href="https://optout.aboutads.info" className="text-netflix-red hover:underline" target="_blank" rel="noopener noreferrer">
                    aboutads.info
                  </a>{' '}
                  or{' '}
                  <a href="https://www.youronlinechoices.com" className="text-netflix-red hover:underline" target="_blank" rel="noopener noreferrer">
                    youronlinechoices.com
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Browser-Specific Instructions</h2>
            <p className="text-gray-300 mb-4">
              Here's how to manage cookies in popular browsers:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                  </svg>
                  Chrome
                </h4>
                <p className="text-sm text-gray-400">
                  Settings → Privacy and security → Cookies and other site data
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Firefox</h4>
                <p className="text-sm text-gray-400">
                  Options → Privacy & Security → Cookies and Site Data
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Safari</h4>
                <p className="text-sm text-gray-400">
                  Preferences → Privacy → Manage Website Data
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Edge</h4>
                <p className="text-sm text-gray-400">
                  Settings → Privacy, search, and services → Cookies and site permissions
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Do Not Track Signals</h2>
            <p className="text-gray-300 mb-4">
              Some browsers have a "Do Not Track" feature that signals to websites that you do not want to have your
              online activity tracked. Currently, our service does not respond to Do Not Track signals, as there is
              no industry standard for how to respond to such signals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
            <p className="text-gray-300 mb-4">
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new
              Cookie Policy on this page and updating the "Last updated" date at the top of this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about our use of cookies, please contact us:
            </p>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="space-y-2">
                <p className="text-gray-300">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:privacy@moovie.com" className="text-netflix-red hover:underline">
                    privacy@moovie.com
                  </a>
                </p>
                <p className="text-gray-300">
                  <strong>Address:</strong> 123 Streaming Street, Los Angeles, CA 90001
                </p>
                <p className="text-gray-300 mt-4">
                  For more information about privacy, see our{' '}
                  <Link to="/legal/privacy" className="text-netflix-red hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
