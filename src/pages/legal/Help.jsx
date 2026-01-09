import { useState } from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I sign up for Moovie?',
          a: 'Click the "Sign Up" button on our homepage, choose a subscription plan, and enter your payment information. You\'ll have immediate access to our entire content library.'
        },
        {
          q: 'What subscription plans are available?',
          a: 'We offer three plans: Basic ($4.99/month - SD quality, 1 device), Standard ($7.99/month - HD quality, 2 devices), and Premium ($9.99/month - 4K quality, 4 devices).'
        },
        {
          q: 'Can I cancel my subscription anytime?',
          a: 'Yes! You can cancel your subscription at any time from your Account Settings. You\'ll continue to have access until the end of your current billing period.'
        }
      ]
    },
    {
      category: 'Streaming & Playback',
      questions: [
        {
          q: 'What devices can I watch Moovie on?',
          a: 'You can watch Moovie on smart TVs, streaming media players, game consoles, smartphones, tablets, and computers. Check our supported devices page for a complete list.'
        },
        {
          q: 'Why is my video buffering or low quality?',
          a: 'Video quality depends on your internet speed. For HD, we recommend at least 5 Mbps. For 4K, 25 Mbps or higher. Check your internet connection and try lowering the quality settings.'
        },
        {
          q: 'Can I download content to watch offline?',
          a: 'Offline downloads are coming soon! This feature will allow Premium subscribers to download select titles for offline viewing.'
        }
      ]
    },
    {
      category: 'Watch Party',
      questions: [
        {
          q: 'How do I start a Watch Party?',
          a: 'Click the "Watch Party" button on the homepage, select content, and share the generated party code with friends. Up to 8 people can join a party.'
        },
        {
          q: 'Do all participants need a Moovie subscription?',
          a: 'Yes, all Watch Party participants must have an active Moovie subscription to join.'
        },
        {
          q: 'Can I use Watch Party on mobile devices?',
          a: 'Watch Party is currently available on desktop and tablet devices. Mobile support is coming soon.'
        }
      ]
    },
    {
      category: 'Account & Billing',
      questions: [
        {
          q: 'How do I update my payment information?',
          a: 'Go to Account Settings > Billing Information. You can update your payment method, billing address, and view past invoices.'
        },
        {
          q: 'When will I be charged?',
          a: 'You\'ll be charged on the same day each month as your sign-up date. For example, if you signed up on January 15th, you\'ll be charged on the 15th of each month.'
        },
        {
          q: 'Do you offer refunds?',
          a: 'We don\'t offer refunds, but you can cancel anytime and keep access until the end of your billing period.'
        }
      ]
    },
    {
      category: 'Technical Issues',
      questions: [
        {
          q: 'I can\'t log in to my account',
          a: 'Try resetting your password using the "Forgot Password" link. If you\'re still having issues, clear your browser cache or contact support at support@moovie.com.'
        },
        {
          q: 'The video player isn\'t working',
          a: 'Try refreshing the page, clearing your browser cache, or using a different browser. Ensure you have the latest browser version installed.'
        },
        {
          q: 'Error code troubleshooting',
          a: 'Common error codes: E001 (network issue - check connection), E002 (playback error - refresh page), E003 (authentication - log out and back in).'
        }
      ]
    }
  ];

  const contactOptions = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      action: 'support@moovie.com'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Available 9 AM - 9 PM EST'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Phone Support',
      description: 'Speak with a representative',
      action: '1-800-MOOVIE-1'
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      item =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-netflix-red hover:text-red-600 mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How can we help you?</h1>
          <p className="text-gray-400 text-lg mb-8">Search our help center or browse by category</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="w-full bg-gray-800 text-white px-6 py-4 rounded-lg pl-14 focus:outline-none focus:ring-2 focus:ring-netflix-red"
              />
              <svg
                className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactOptions.map((option, index) => (
            <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-netflix-red transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-netflix-red/20 rounded-lg flex items-center justify-center text-netflix-red">
                  {option.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{option.title}</h3>
                  <p className="text-gray-400 text-sm">{option.description}</p>
                </div>
              </div>
              <p className="text-netflix-red font-medium">{option.action}</p>
            </div>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>

          {filteredFaqs.map((category, catIndex) => (
            <div key={catIndex} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-netflix-red">{category.category}</h3>
              <div className="space-y-3">
                {category.questions.map((item, qIndex) => {
                  const faqKey = `${catIndex}-${qIndex}`;
                  const isExpanded = expandedFaq === faqKey;

                  return (
                    <div key={qIndex} className="border-b border-gray-800 last:border-0">
                      <button
                        onClick={() => setExpandedFaq(isExpanded ? null : faqKey)}
                        className="w-full flex items-center justify-between py-4 text-left hover:text-netflix-red transition-colors"
                      >
                        <span className="text-white font-medium pr-4">{item.q}</span>
                        <svg
                          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isExpanded && (
                        <div className="pb-4 text-gray-300">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredFaqs.length === 0 && searchQuery && (
            <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
              <p className="text-gray-400 text-lg mb-4">No results found for "{searchQuery}"</p>
              <p className="text-gray-500">Try different keywords or contact our support team</p>
            </div>
          )}
        </div>

        {/* Additional Resources */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-netflix-red/20 to-transparent border border-netflix-red/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Can't find what you're looking for?</h3>
            <p className="text-gray-300 mb-4">Our support team is here to help!</p>
            <a
              href="mailto:support@moovie.com"
              className="inline-block bg-netflix-red hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Contact Support
            </a>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Community Forums</h3>
            <p className="text-gray-300 mb-4">Connect with other Moovie users and share tips</p>
            <button className="text-netflix-red hover:underline font-medium">
              Visit Forums →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
