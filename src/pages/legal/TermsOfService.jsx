import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-netflix-red hover:text-red-600 mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-400 mb-8">Last updated: January 9, 2026</p>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 mb-4">
              By accessing and using Moovie streaming service, you accept and agree to be bound by the terms
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
            <p className="text-gray-300 mb-4">
              Moovie provides a subscription-based streaming service that allows our members to access entertainment
              content over the Internet to certain Internet-connected devices. The Moovie service is provided to you
              by Moovie, Inc.
            </p>
            <p className="text-gray-300 mb-4">
              These Terms of Service govern your use of our service. As used in these Terms of Service, "Moovie service",
              "our service" or "the service" means the personalized service provided by Moovie for discovering and
              accessing content, including all features and functionalities, recommendations and reviews, our website,
              and user interfaces, as well as all content and software associated with our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Membership & Billing</h2>
            <p className="text-gray-300 mb-4">
              <strong>3.1 Subscription Plans:</strong> We offer multiple subscription plans, including Basic, Standard,
              and Premium tiers. Details about each plan are available on our pricing page.
            </p>
            <p className="text-gray-300 mb-4">
              <strong>3.2 Billing Cycle:</strong> Your membership will continue and automatically renew until you cancel.
              You will be charged the monthly or annual membership fee on the calendar day corresponding to the commencement
              of your membership.
            </p>
            <p className="text-gray-300 mb-4">
              <strong>3.3 Cancellation:</strong> You may cancel your Moovie membership at any time, and you will continue
              to have access to the service through the end of your billing period.
            </p>
            <p className="text-gray-300 mb-4">
              <strong>3.4 Payment Methods:</strong> To use the Moovie service you must provide one or more Payment Methods.
              You authorize us to charge any Payment Method associated with your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Use of the Service</h2>
            <p className="text-gray-300 mb-4">
              <strong>4.1 Age Requirement:</strong> You must be at least 18 years of age to become a member of the
              Moovie service. Individuals under 18 may use the service only with the involvement of a parent or legal guardian.
            </p>
            <p className="text-gray-300 mb-4">
              <strong>4.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your account.
            </p>
            <p className="text-gray-300 mb-4">
              <strong>4.3 Prohibited Activities:</strong> You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Circumvent, remove, alter, deactivate, degrade or thwart any of the content protections</li>
              <li>Use any robot, spider, scraper or other automated means to access the service</li>
              <li>Decompile, reverse engineer or disassemble any software or other products</li>
              <li>Insert any code or product to manipulate the content or affect user experience</li>
              <li>Share your account credentials or transfer your account to anyone else</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Content</h2>
            <p className="text-gray-300 mb-4">
              <strong>5.1 Availability:</strong> The content that may be available to watch will change from time to time
              and may vary by geographic location. Moovie makes no guarantee that specific titles will be available.
            </p>
            <p className="text-gray-300 mb-4">
              <strong>5.2 Quality:</strong> Stream quality, including resolution, may vary based on your subscription plan
              and device capabilities. Not all content is available in all formats, such as Ultra HD or HDR.
            </p>
            <p className="text-gray-300 mb-4">
              <strong>5.3 Intellectual Property:</strong> All content on Moovie is protected by copyright, trademarks,
              and other intellectual property rights. You may not download, copy, reproduce, or distribute any content
              except as explicitly permitted by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Watch Party Feature</h2>
            <p className="text-gray-300 mb-4">
              Our Watch Party feature allows you to watch content simultaneously with other users. By using Watch Party:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>You agree to use the feature responsibly and respectfully</li>
              <li>You understand that chat messages may be monitored for violations of our policies</li>
              <li>You may not share party codes publicly or use the feature for commercial purposes</li>
              <li>You must be 13 or older to participate in Watch Party chat features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
            <p className="text-gray-300 mb-4">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason,
              including without limitation if you breach the Terms. Upon termination, your right to use the service
              will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-300 mb-4">
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. MOOVIE MAKES NO WARRANTIES,
              EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
              FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              IN NO EVENT SHALL MOOVIE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE
              DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <p className="text-gray-300 mb-4">
              We reserve the right to modify these terms at any time. We will notify you of any changes by posting
              the new Terms of Service on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-gray-300">
              Email: legal@moovie.com<br />
              Address: 123 Streaming Street, Los Angeles, CA 90001
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            By using Moovie, you acknowledge that you have read and understood these Terms of Service
            and agree to be bound by them.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
