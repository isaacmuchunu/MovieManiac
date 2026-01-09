import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-netflix-red hover:text-red-600 mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: January 9, 2026</p>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-300 mb-4">
              At Moovie, we respect your privacy and are committed to protecting your personal data. This privacy
              policy explains how we collect, use, and share information about you when you use our streaming service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="text-gray-300 mb-4">
              <strong>2.1 Information You Provide:</strong>
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
              <li>Account information (name, email address, password)</li>
              <li>Payment information (credit card details, billing address)</li>
              <li>Profile information (preferences, watchlist, ratings)</li>
              <li>Communications with customer support</li>
            </ul>

            <p className="text-gray-300 mb-4">
              <strong>2.2 Information We Collect Automatically:</strong>
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Device information (IP address, device type, operating system)</li>
              <li>Usage data (viewing history, search queries, interaction with content)</li>
              <li>Location data (based on IP address)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Provide, maintain, and improve our service</li>
              <li>Process payments and prevent fraud</li>
              <li>Personalize your experience and provide recommendations</li>
              <li>Send you service-related communications</li>
              <li>Analyze usage patterns to improve our service</li>
              <li>Enforce our Terms of Service</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
            <p className="text-gray-300 mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li><strong>Service Providers:</strong> Third parties who help us operate our service (payment processors, hosting providers, analytics services)</li>
              <li><strong>Content Partners:</strong> To provide content recommendations and fulfill licensing obligations</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition of all or a portion of our business</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Watch Party Privacy</h2>
            <p className="text-gray-300 mb-4">
              When using our Watch Party feature:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Your name and viewing activity are visible to other participants in the party</li>
              <li>Chat messages are stored temporarily and may be monitored for policy violations</li>
              <li>Party codes are generated randomly and expire after the session ends</li>
              <li>We collect analytics about Watch Party usage to improve the feature</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <p className="text-gray-300 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information,
              including:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-gray-300 mt-4">
              However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights and Choices</h2>
            <p className="text-gray-300 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct your information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Request your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Cookie Preferences:</strong> Manage cookie settings in your browser</li>
            </ul>
            <p className="text-gray-300 mt-4">
              To exercise these rights, contact us at privacy@moovie.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-gray-300 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Authenticate your account</li>
              <li>Analyze site traffic and usage patterns</li>
              <li>Provide personalized recommendations</li>
            </ul>
            <p className="text-gray-300 mt-4">
              You can control cookie settings through your browser, but this may limit certain features of our service.
              See our <Link to="/legal/cookie-policy" className="text-netflix-red hover:underline">Cookie Policy</Link> for more details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p className="text-gray-300 mb-4">
              Our service is not directed to children under 13. We do not knowingly collect personal information
              from children under 13. If you believe we have collected information from a child under 13, please
              contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
            <p className="text-gray-300 mb-4">
              Your information may be transferred to and processed in countries other than your country of residence.
              We ensure appropriate safeguards are in place to protect your information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-300 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by
              posting the new policy on this page and updating the "Last updated" date. Your continued use of the
              service constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <p className="text-gray-300">
              Email: privacy@moovie.com<br />
              Address: 123 Streaming Street, Los Angeles, CA 90001<br />
              Phone: 1-800-MOOVIE-1
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. California Privacy Rights</h2>
            <p className="text-gray-300 mb-4">
              California residents have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Right to know what personal information is collected, used, and shared</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information (we do not sell your information)</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            This Privacy Policy is effective as of the date stated at the top of this policy and applies to
            all information collected through our service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
