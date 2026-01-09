import { Link } from 'react-router-dom';

const MediaCenter = () => {
  const pressReleases = [
    {
      date: 'January 5, 2026',
      title: 'Moovie Announces Watch Party Feature Launch',
      excerpt: 'Revolutionary new feature allows up to 8 friends to watch together in real-time with synchronized playback and live chat.',
      category: 'Product News'
    },
    {
      date: 'December 20, 2025',
      title: 'Moovie Reaches 10 Million Subscribers Milestone',
      excerpt: 'Streaming platform celebrates major growth milestone with expanded content library and enhanced user features.',
      category: 'Company News'
    },
    {
      date: 'December 1, 2025',
      title: 'New Partnership Brings Exclusive Original Content to Moovie',
      excerpt: 'Multi-year agreement secures exclusive streaming rights for highly anticipated original series and films.',
      category: 'Content'
    },
    {
      date: 'November 15, 2025',
      title: 'Moovie Expands 4K HDR Content Library',
      excerpt: 'Premium subscribers now have access to over 5,000 titles in stunning 4K resolution with HDR support.',
      category: 'Technology'
    }
  ];

  const mediaAssets = [
    {
      title: 'Company Logos',
      description: 'Official Moovie logos in various formats',
      items: ['Full Color Logo', 'White Logo', 'Black Logo', 'Icon Only']
    },
    {
      title: 'Brand Guidelines',
      description: 'Complete brand identity and usage guidelines',
      items: ['Color Palette', 'Typography', 'Logo Usage', 'Brand Voice']
    },
    {
      title: 'Product Screenshots',
      description: 'High-resolution screenshots of our platform',
      items: ['Web Interface', 'Mobile App', 'TV App', 'Features']
    },
    {
      title: 'Executive Photos',
      description: 'Professional headshots of leadership team',
      items: ['CEO', 'CTO', 'CMO', 'Board Members']
    }
  ];

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Media Center</h1>
          <p className="text-gray-400 text-lg">
            Press releases, company news, and media resources
          </p>
        </div>

        {/* Press Contact */}
        <div className="bg-gradient-to-r from-netflix-red/20 to-transparent border border-netflix-red/50 rounded-xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Press Inquiries</h2>
              <p className="text-gray-300 mb-6">
                For media inquiries, interview requests, or press materials, please contact our communications team.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-netflix-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:press@moovie.com" className="text-white hover:text-netflix-red transition-colors">
                    press@moovie.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-netflix-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-white">1-800-PRESS-01</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Media Kit</h3>
              <p className="text-gray-300 mb-4">
                Download our complete media kit including logos, brand guidelines, and fact sheets.
              </p>
              <button className="bg-netflix-red hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Download Media Kit
              </button>
            </div>
          </div>
        </div>

        {/* Latest News */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Latest News & Press Releases</h2>
          <div className="space-y-4">
            {pressReleases.map((release, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 hover:border-netflix-red rounded-lg p-6 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm text-gray-500">{release.date}</span>
                  <span className="text-xs bg-netflix-red/20 text-netflix-red px-3 py-1 rounded-full">
                    {release.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 hover:text-netflix-red transition-colors">
                  {release.title}
                </h3>
                <p className="text-gray-400 mb-4">{release.excerpt}</p>
                <button className="text-netflix-red hover:underline text-sm font-medium flex items-center gap-2">
                  Read Full Release
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors">
              View All Press Releases
            </button>
          </div>
        </section>

        {/* Media Assets */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Media Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaAssets.map((asset, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">{asset.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{asset.description}</p>
                <ul className="space-y-2 mb-4">
                  {asset.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-gray-300 flex items-center gap-2">
                      <svg className="w-4 h-4 text-netflix-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="text-netflix-red hover:underline text-sm font-medium">
                  Download Assets →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Company Facts */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Company Facts</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-netflix-red mb-2">10M+</div>
                <div className="text-gray-400">Active Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-netflix-red mb-2">50K+</div>
                <div className="text-gray-400">Content Titles</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-netflix-red mb-2">150+</div>
                <div className="text-gray-400">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-netflix-red mb-2">24/7</div>
                <div className="text-gray-400">Customer Support</div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Company Overview</h4>
                <p className="text-gray-400">
                  Founded in 2024, Moovie is a leading streaming entertainment service offering movies,
                  TV shows, and original content to millions of subscribers worldwide.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Headquarters</h4>
                <p className="text-gray-400">
                  123 Streaming Street<br />
                  Los Angeles, CA 90001<br />
                  United States
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Follow Us</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="#" className="bg-gray-900 border border-gray-800 hover:border-netflix-red rounded-lg p-6 text-center transition-colors">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </div>
              <span className="font-medium">Facebook</span>
            </a>
            <a href="#" className="bg-gray-900 border border-gray-800 hover:border-netflix-red rounded-lg p-6 text-center transition-colors">
              <div className="w-12 h-12 bg-sky-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </div>
              <span className="font-medium">Twitter</span>
            </a>
            <a href="#" className="bg-gray-900 border border-gray-800 hover:border-netflix-red rounded-lg p-6 text-center transition-colors">
              <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span className="font-medium">Instagram</span>
            </a>
            <a href="#" className="bg-gray-900 border border-gray-800 hover:border-netflix-red rounded-lg p-6 text-center transition-colors">
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-2A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
                </svg>
              </div>
              <span className="font-medium">YouTube</span>
            </a>
          </div>
        </section>

        {/* Additional Resources */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/legal/corporate" className="bg-gray-900 border border-gray-800 hover:border-netflix-red rounded-lg p-6 transition-colors">
              <h3 className="font-semibold mb-2">Corporate Information</h3>
              <p className="text-sm text-gray-400">Learn more about our company structure and leadership</p>
            </Link>
            <Link to="/legal/investors" className="bg-gray-900 border border-gray-800 hover:border-netflix-red rounded-lg p-6 transition-colors">
              <h3 className="font-semibold mb-2">Investor Relations</h3>
              <p className="text-sm text-gray-400">Financial reports and investor information</p>
            </Link>
            <Link to="/legal/careers" className="bg-gray-900 border border-gray-800 hover:border-netflix-red rounded-lg p-6 transition-colors">
              <h3 className="font-semibold mb-2">Careers</h3>
              <p className="text-sm text-gray-400">Join our team and help shape the future of streaming</p>
            </Link>
            <Link to="/legal/help" className="bg-gray-900 border border-gray-800 hover:border-netflix-red rounded-lg p-6 transition-colors">
              <h3 className="font-semibold mb-2">Help Center</h3>
              <p className="text-sm text-gray-400">Customer support and frequently asked questions</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MediaCenter;
