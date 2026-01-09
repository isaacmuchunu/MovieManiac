import { Link } from 'react-router-dom';

const InvestorRelations = () => {
  const financialHighlights = [
    { label: 'Market Cap', value: '$12.4B', change: '+15.3%' },
    { label: 'Revenue (TTM)', value: '$3.2B', change: '+22.1%' },
    { label: 'Subscribers', value: '10.2M', change: '+18.5%' },
    { label: 'ARPU', value: '$9.99', change: '+5.2%' }
  ];

  const quarterlyResults = [
    { quarter: 'Q4 2025', revenue: '$850M', growth: '+23%', subscribers: '10.2M' },
    { quarter: 'Q3 2025', revenue: '$820M', growth: '+21%', subscribers: '9.8M' },
    { quarter: 'Q2 2025', revenue: '$790M', growth: '+19%', subscribers: '9.3M' },
    { quarter: 'Q1 2025', revenue: '$740M', growth: '+17%', subscribers: '8.9M' }
  ];

  const documents = [
    {
      category: 'Annual Reports',
      items: [
        { title: '2025 Annual Report', date: 'March 2026', size: '12.5 MB' },
        { title: '2024 Annual Report', date: 'March 2025', size: '11.8 MB' }
      ]
    },
    {
      category: 'Quarterly Earnings',
      items: [
        { title: 'Q4 2025 Earnings Report', date: 'January 2026', size: '4.2 MB' },
        { title: 'Q3 2025 Earnings Report', date: 'October 2025', size: '3.9 MB' },
        { title: 'Q2 2025 Earnings Report', date: 'July 2025', size: '3.7 MB' }
      ]
    },
    {
      category: 'SEC Filings',
      items: [
        { title: '10-K Annual Report (2025)', date: 'March 2026', size: '8.1 MB' },
        { title: '10-Q Quarterly Report (Q4 2025)', date: 'January 2026', size: '5.3 MB' }
      ]
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Investor Relations</h1>
          <p className="text-gray-400 text-lg">
            Financial information and resources for Moovie investors
          </p>
        </div>

        {/* Stock Info Banner */}
        <div className="bg-gradient-to-r from-netflix-red/20 to-transparent border border-netflix-red/50 rounded-xl p-8 mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="text-sm text-gray-400 mb-1">NASDAQ: MOOV</div>
              <div className="text-4xl font-bold">$124.50</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  +$3.25 (2.68%)
                </span>
                <span className="text-gray-500 text-sm">Today</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="bg-netflix-red hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors">
                Email Alerts
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors">
                RSS Feed
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Market data delayed by 15 minutes. Last updated: January 9, 2026, 4:00 PM EST
          </div>
        </div>

        {/* Financial Highlights */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Financial Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {financialHighlights.map((item, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="text-sm text-gray-400 mb-2">{item.label}</div>
                <div className="text-3xl font-bold mb-2">{item.value}</div>
                <div className={`text-sm flex items-center ${item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.change.startsWith('+') ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                  </svg>
                  {item.change} YoY
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quarterly Results */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Quarterly Results</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Quarter</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Revenue</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Growth</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Subscribers</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {quarterlyResults.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-white font-medium">{result.quarter}</td>
                      <td className="px-6 py-4 text-gray-300">{result.revenue}</td>
                      <td className="px-6 py-4">
                        <span className="text-green-400">{result.growth}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{result.subscribers}</td>
                      <td className="px-6 py-4">
                        <button className="text-netflix-red hover:underline text-sm font-medium">
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Financial Documents */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Financial Documents</h2>
          <div className="space-y-6">
            {documents.map((category, catIndex) => (
              <div key={catIndex} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
                <div className="space-y-3">
                  {category.items.map((doc, docIndex) => (
                    <div key={docIndex} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-netflix-red/20 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-netflix-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-white">{doc.title}</div>
                          <div className="text-sm text-gray-400">{doc.date} • {doc.size}</div>
                        </div>
                      </div>
                      <button className="text-netflix-red hover:text-red-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-netflix-red">15</div>
                  <div className="text-xs text-gray-400">FEB</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Q1 2026 Earnings Call</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Join our management team for a discussion of Q1 2026 financial results
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      2:00 PM EST
                    </span>
                    <button className="text-netflix-red hover:underline">Add to Calendar</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-netflix-red">22</div>
                  <div className="text-xs text-gray-400">MAR</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Annual Shareholder Meeting</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    2026 Annual Meeting of Shareholders - virtual attendance available
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      10:00 AM EST
                    </span>
                    <button className="text-netflix-red hover:underline">Register</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Corporate Governance */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Corporate Governance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-netflix-red transition-colors">
              <h3 className="font-semibold mb-2">Board of Directors</h3>
              <p className="text-sm text-gray-400 mb-4">
                Meet our experienced board members
              </p>
              <button className="text-netflix-red hover:underline text-sm font-medium">
                View Board →
              </button>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-netflix-red transition-colors">
              <h3 className="font-semibold mb-2">Executive Team</h3>
              <p className="text-sm text-gray-400 mb-4">
                Leadership driving our success
              </p>
              <button className="text-netflix-red hover:underline text-sm font-medium">
                View Team →
              </button>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-netflix-red transition-colors">
              <h3 className="font-semibold mb-2">Governance Documents</h3>
              <p className="text-sm text-gray-400 mb-4">
                Charters, policies, and guidelines
              </p>
              <button className="text-netflix-red hover:underline text-sm font-medium">
                View Documents →
              </button>
            </div>
          </div>
        </section>

        {/* Contact IR */}
        <section>
          <div className="bg-gradient-to-r from-netflix-red/20 to-transparent border border-netflix-red/50 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Investor Relations Contact</h2>
            <p className="text-gray-300 mb-6">
              For investor inquiries, please contact our Investor Relations team
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">General Inquiries</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-netflix-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:ir@moovie.com" className="text-white hover:text-netflix-red transition-colors">
                      ir@moovie.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-netflix-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-white">1-800-INVEST-1</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Mailing Address</h3>
                <p className="text-sm text-gray-300">
                  Moovie, Inc.<br />
                  Investor Relations<br />
                  123 Streaming Street<br />
                  Los Angeles, CA 90001
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InvestorRelations;
