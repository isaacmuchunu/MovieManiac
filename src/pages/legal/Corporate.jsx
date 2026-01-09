import { Link } from 'react-router-dom';

const Corporate = () => {
  const leadership = [
    {
      name: 'Sarah Johnson',
      title: 'Chief Executive Officer',
      bio: '15+ years leading technology and entertainment companies. Previously VP at major streaming platform.',
      image: null
    },
    {
      name: 'Michael Chen',
      title: 'Chief Technology Officer',
      bio: 'Pioneer in video streaming technology with 20 patents. Former architect at leading cloud services provider.',
      image: null
    },
    {
      name: 'Emily Rodriguez',
      title: 'Chief Content Officer',
      bio: 'Award-winning producer with deep relationships across Hollywood. Former studio executive.',
      image: null
    },
    {
      name: 'David Park',
      title: 'Chief Financial Officer',
      bio: 'Experienced CFO with track record of scaling tech companies. MBA from Stanford, CPA.',
      image: null
    }
  ];

  const boardMembers = [
    { name: 'Jennifer Martinez', title: 'Board Chair', affiliation: 'Former CEO, Tech Ventures Inc.' },
    { name: 'Robert Williams', title: 'Board Member', affiliation: 'Managing Partner, Innovation Capital' },
    { name: 'Lisa Anderson', title: 'Board Member', affiliation: 'President, Media Holdings Group' },
    { name: 'James Thompson', title: 'Board Member', affiliation: 'Independent Director' },
    { name: 'Maria Garcia', title: 'Board Member', affiliation: 'CEO, Digital Strategies Corp' }
  ];

  const milestones = [
    { year: '2024', event: 'Moovie founded in Los Angeles', icon: '🚀' },
    { year: '2024 Q3', event: 'Launched beta platform with 1,000 titles', icon: '📺' },
    { year: '2024 Q4', event: 'Reached 1 million subscribers', icon: '🎉' },
    { year: '2025 Q2', event: 'Expanded to 50+ countries', icon: '🌍' },
    { year: '2025 Q3', event: 'Launched original content division', icon: '🎬' },
    { year: '2025 Q4', event: 'Surpassed 10 million subscribers', icon: '🏆' },
    { year: '2026', event: 'Introduced Watch Party feature', icon: '👥' }
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

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Corporate Information</h1>
          <p className="text-gray-400 text-lg">
            Learn about Moovie's mission, leadership, and corporate structure
          </p>
        </div>

        {/* Company Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">About Moovie</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <p className="text-gray-300 text-lg mb-6">
              Moovie is a leading streaming entertainment service that brings movies, TV shows, and original content
              to millions of subscribers worldwide. Founded in 2024, we're committed to providing the best streaming
              experience through innovative technology and exceptional content.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="font-semibold mb-2">Our Mission</h3>
                <p className="text-sm text-gray-400">
                  To entertain the world with stories that inspire, inform, and bring people together
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">👁️</div>
                <h3 className="font-semibold mb-2">Our Vision</h3>
                <p className="text-sm text-gray-400">
                  To be the most loved entertainment service, delivering joy to every screen
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">⭐</div>
                <h3 className="font-semibold mb-2">Our Values</h3>
                <p className="text-sm text-gray-400">
                  Innovation, diversity, user-first thinking, and creative excellence
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Stats */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-netflix-red mb-2">10M+</div>
              <div className="text-sm text-gray-400">Active Subscribers</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-netflix-red mb-2">50K+</div>
              <div className="text-sm text-gray-400">Content Titles</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-netflix-red mb-2">150+</div>
              <div className="text-sm text-gray-400">Countries</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-netflix-red mb-2">500+</div>
              <div className="text-sm text-gray-400">Employees</div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Executive Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {leadership.map((leader, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-netflix-red to-red-700 rounded-lg flex items-center justify-center text-3xl font-bold flex-shrink-0">
                    {leader.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{leader.name}</h3>
                    <p className="text-netflix-red text-sm mb-3">{leader.title}</p>
                    <p className="text-gray-400 text-sm">{leader.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Board of Directors */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Board of Directors</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Affiliation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {boardMembers.map((member, index) => (
                    <tr key={index} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-white font-medium">{member.name}</td>
                      <td className="px-6 py-4 text-gray-300">{member.title}</td>
                      <td className="px-6 py-4 text-gray-400">{member.affiliation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Company Milestones */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Journey</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-800"></div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative pl-20">
                  <div className="absolute left-0 w-16 h-16 bg-netflix-red rounded-full flex items-center justify-center text-2xl">
                    {milestone.icon}
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <div className="text-netflix-red font-semibold mb-2">{milestone.year}</div>
                    <div className="text-white text-lg">{milestone.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Corporate Structure */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Corporate Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Company Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Legal Name:</span>
                  <span className="text-white">Moovie, Inc.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Founded:</span>
                  <span className="text-white">2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white">Private Corporation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Stock Symbol:</span>
                  <span className="text-white">NASDAQ: MOOV</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Headquarters:</span>
                  <span className="text-white">Los Angeles, CA</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-400 mb-1">Corporate Address:</div>
                  <div className="text-white">
                    123 Streaming Street<br />
                    Los Angeles, CA 90001<br />
                    United States
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">General Inquiries:</div>
                  <a href="mailto:info@moovie.com" className="text-netflix-red hover:underline">
                    info@moovie.com
                  </a>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Phone:</div>
                  <span className="text-white">1-800-MOOVIE-1</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Awards & Recognition</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Tech Innovation Award</h3>
              <p className="text-sm text-gray-400">2025 Streaming Technology Excellence</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Best Workplace</h3>
              <p className="text-sm text-gray-400">2025 Top Tech Employer</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Customer Choice</h3>
              <p className="text-sm text-gray-400">2025 Streaming Platform of the Year</p>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/legal/investors" className="bg-gray-900 border border-gray-800 hover:border-netflix-red rounded-lg p-6 transition-colors">
              <h3 className="font-semibold mb-2">Investor Relations</h3>
              <p className="text-sm text-gray-400">Financial reports and investor information</p>
            </Link>
            <Link to="/legal/media" className="bg-gray-900 border border-gray-800 hover:border-netflix-red rounded-lg p-6 transition-colors">
              <h3 className="font-semibold mb-2">Media Center</h3>
              <p className="text-sm text-gray-400">Press releases and media resources</p>
            </Link>
            <Link to="/legal/careers" className="bg-gray-900 border border-gray-800 hover:border-netflix-red rounded-lg p-6 transition-colors">
              <h3 className="font-semibold mb-2">Careers</h3>
              <p className="text-sm text-gray-400">Join our team and shape the future</p>
            </Link>
            <Link to="/legal/help" className="bg-gray-900 border border-gray-800 hover:border-netflix-red rounded-lg p-6 transition-colors">
              <h3 className="font-semibold mb-2">Help Center</h3>
              <p className="text-sm text-gray-400">Customer support and FAQs</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Corporate;
