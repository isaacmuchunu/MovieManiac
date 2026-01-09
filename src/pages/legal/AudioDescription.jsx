import { Link } from 'react-router-dom';

const AudioDescription = () => {
  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-netflix-red hover:text-red-600 mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-2">Audio Description</h1>
        <p className="text-gray-400 mb-8">Enhanced accessibility for visually impaired viewers</p>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">What is Audio Description?</h2>
            <p className="text-gray-300 mb-4">
              Audio Description (AD) is an accessibility feature that provides narrated descriptions of key visual
              elements in movies and TV shows. These descriptions are added during natural pauses in dialogue,
              helping blind or visually impaired viewers understand what's happening on screen.
            </p>
            <p className="text-gray-300 mb-4">
              The narrator describes important visual information such as:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Actions, gestures, and facial expressions</li>
              <li>Scene changes and settings</li>
              <li>Character appearances and costumes</li>
              <li>On-screen text and graphics</li>
              <li>Visual humor and context</li>
            </ul>
          </section>

          <section className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">How to Enable Audio Description</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-3 text-netflix-red">On Web Browser</h3>
                <ol className="list-decimal pl-6 text-gray-300 space-y-2">
                  <li>Start playing any video with AD support</li>
                  <li>Click the "Audio & Subtitles" icon in the player controls</li>
                  <li>Select "English - Audio Description" from the audio options</li>
                  <li>Click "Apply" to enable the feature</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-3 text-netflix-red">On Smart TV</h3>
                <ol className="list-decimal pl-6 text-gray-300 space-y-2">
                  <li>Navigate to a title with AD support</li>
                  <li>Press the down arrow on your remote while playing</li>
                  <li>Select "Audio & Subtitles"</li>
                  <li>Choose "English - Audio Description"</li>
                  <li>Select "OK" to confirm</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-3 text-netflix-red">On Mobile Devices</h3>
                <ol className="list-decimal pl-6 text-gray-300 space-y-2">
                  <li>Tap anywhere on the screen while playing a video</li>
                  <li>Tap the "Audio & Subtitles" icon</li>
                  <li>Select "English - Audio Description"</li>
                  <li>Tap outside the menu to return to playback</li>
                </ol>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Identifying Content with Audio Description</h2>
            <p className="text-gray-300 mb-4">
              To quickly find content that supports Audio Description:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Look for the "AD" badge on title cards throughout Moovie</li>
              <li>Check the title's detail page for audio options before starting</li>
              <li>Use our search filters to show only AD-supported content</li>
              <li>Browse our dedicated "Audio Described" category</li>
            </ul>
            <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 mt-4">
              <p className="text-blue-300">
                <strong>Note:</strong> Audio Description availability varies by title and region. We're
                continuously expanding our AD catalog based on content availability and user demand.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Subscription & Availability</h2>
            <p className="text-gray-300 mb-4">
              Audio Description is available at no extra cost to all Moovie subscribers across all plan tiers:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Basic Plan</h4>
                <p className="text-sm text-gray-400">Full AD support included</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Standard Plan</h4>
                <p className="text-sm text-gray-400">Full AD support included</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Premium Plan</h4>
                <p className="text-sm text-gray-400">Full AD support included</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
            <div className="space-y-4">
              <div className="bg-gray-900 border-l-4 border-netflix-red p-4 rounded">
                <h4 className="font-semibold mb-2">Audio Description option not appearing?</h4>
                <p className="text-gray-300 text-sm">
                  This title may not have AD support yet. Check the title details page for available audio options.
                  Some older content may not include Audio Description.
                </p>
              </div>

              <div className="bg-gray-900 border-l-4 border-netflix-red p-4 rounded">
                <h4 className="font-semibold mb-2">Audio Description not playing?</h4>
                <p className="text-gray-300 text-sm">
                  Try refreshing the page and re-selecting the audio track. If the issue persists, restart your
                  device and check your audio settings.
                </p>
              </div>

              <div className="bg-gray-900 border-l-4 border-netflix-red p-4 rounded">
                <h4 className="font-semibold mb-2">Volume levels unbalanced?</h4>
                <p className="text-gray-300 text-sm">
                  AD narration is designed to blend naturally with dialogue. If you find it too loud or soft,
                  adjust your device's main volume. Individual AD volume control coming soon.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Providing Feedback</h2>
            <p className="text-gray-300 mb-4">
              We're committed to improving accessibility for all our members. Your feedback helps us enhance
              the Audio Description experience.
            </p>
            <div className="bg-gradient-to-r from-netflix-red/20 to-transparent border border-netflix-red/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Share Your Experience</h3>
              <p className="text-gray-300 mb-4">
                Tell us about your experience with Audio Description or suggest titles you'd like to see AD added to.
              </p>
              <a
                href="mailto:accessibility@moovie.com"
                className="inline-block bg-netflix-red hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Contact Accessibility Team
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Additional Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/legal/help"
                className="bg-gray-900 border border-gray-800 hover:border-netflix-red rounded-lg p-4 transition-colors"
              >
                <h4 className="font-semibold mb-2">Help Center</h4>
                <p className="text-sm text-gray-400">Find answers to common questions</p>
              </Link>
              <a
                href="mailto:support@moovie.com"
                className="bg-gray-900 border border-gray-800 hover:border-netflix-red rounded-lg p-4 transition-colors"
              >
                <h4 className="font-semibold mb-2">Contact Support</h4>
                <p className="text-sm text-gray-400">Get help from our support team</p>
              </a>
            </div>
          </section>

          <section className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Our Commitment to Accessibility</h3>
            <p className="text-gray-300">
              Moovie is dedicated to making entertainment accessible to everyone. We work closely with content
              creators and accessibility advocates to expand our Audio Description library and improve the viewing
              experience for all our members. Learn more about our accessibility initiatives in our{' '}
              <Link to="/legal/accessibility-statement" className="text-netflix-red hover:underline">
                Accessibility Statement
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AudioDescription;
