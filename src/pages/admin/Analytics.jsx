import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/backendApi';
import { errorReporting, ErrorCategory } from '../../lib/errorReporting';

const MetricCard = ({ title, value, subtitle, icon, trend }) => (
  <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      <div className="text-right">
        <div className="w-12 h-12 rounded-xl bg-netflix-medium-gray flex items-center justify-center mb-2">
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  </div>
);

const ChartBar = ({ label, value, maxValue, color }) => (
  <div className="flex items-center gap-4">
    <span className="text-gray-400 text-sm w-20 truncate">{label}</span>
    <div className="flex-1 h-8 bg-netflix-medium-gray rounded-lg overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-500`}
        style={{ width: `${(value / maxValue) * 100}%` }}
      />
    </div>
    <span className="text-white text-sm w-16 text-right">{value.toLocaleString()}</span>
  </div>
);

const Analytics = () => {
  const [period, setPeriod] = useState('7d');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAnalytics(period);
      setAnalytics(data);
    } catch (error) {
      // Analytics fetch failed - use demo data (expected in demo mode)
      errorReporting.captureError(error, { category: ErrorCategory.NETWORK });
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  // Show error if no analytics data available
  if (!analytics) {
    return (
      <div className="min-h-screen bg-netflix-black p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-netflix-dark-gray rounded-xl p-8 border border-gray-800 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-2">No Analytics Data Available</h2>
            <p className="text-gray-400 mb-6">
              Unable to load analytics data. Please try again later.
            </p>
            <button
              onClick={fetchAnalytics}
              className="bg-netflix-red hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayData = analytics;
  const maxViews = displayData.contentPerformance?.length > 0
    ? Math.max(...displayData.contentPerformance.map(c => c.views))
    : 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-netflix-dark-gray rounded w-64" />
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-netflix-dark-gray rounded-xl" />
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
            <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400 text-sm">Comprehensive insights into platform performance</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <button className="px-4 py-2 bg-netflix-medium-gray rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Views"
            value={displayData.overview.totalViews.toLocaleString()}
            trend={displayData.overview.viewsTrend}
            icon={
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          />
          <MetricCard
            title="Unique Viewers"
            value={displayData.overview.uniqueViewers.toLocaleString()}
            trend={displayData.overview.viewersTrend}
            icon={
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <MetricCard
            title="Avg Watch Time"
            value={displayData.overview.avgWatchTime}
            trend={displayData.overview.watchTimeTrend}
            icon={
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <MetricCard
            title="Completion Rate"
            value={`${displayData.overview.completionRate}%`}
            trend={displayData.overview.completionTrend}
            icon={
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hourly Views */}
          <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Viewing Patterns (24h)</h3>
            <div className="h-48 flex items-end justify-between gap-1">
              {displayData.hourlyViews.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-netflix-red to-red-400 rounded-t transition-all hover:from-red-500 hover:to-red-300"
                  style={{ height: `${(value / Math.max(...displayData.hourlyViews)) * 100}%` }}
                  title={`${index}:00 - ${value}% activity`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>12AM</span>
              <span>6AM</span>
              <span>12PM</span>
              <span>6PM</span>
              <span>12AM</span>
            </div>
          </div>

          {/* Genre Distribution */}
          <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Genre Distribution</h3>
            <div className="space-y-3">
              {displayData.genreDistribution.map((item) => (
                <div key={item.genre} className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm w-16">{item.genre}</span>
                  <div className="flex-1 h-6 bg-netflix-medium-gray rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-netflix-red to-purple-600 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-white text-sm w-12 text-right">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Performance */}
        <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Content</h3>
          <div className="space-y-4">
            {displayData.contentPerformance.map((content, index) => (
              <ChartBar
                key={content.title}
                label={content.title}
                value={content.views}
                maxValue={maxViews}
                color={index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-700' : 'bg-netflix-red'}
              />
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Device Stats */}
          <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Device Breakdown</h3>
            <div className="space-y-4">
              {displayData.deviceStats.map((item) => (
                <div key={item.device} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-netflix-medium-gray flex items-center justify-center">
                      {item.device === 'Smart TV' && (
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                      {item.device === 'Mobile' && (
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      )}
                      {item.device === 'Desktop' && (
                        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                      {item.device === 'Tablet' && (
                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-white">{item.device}</span>
                  </div>
                  <span className="text-gray-400">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Metrics */}
          <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Subscription Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">New Subscriptions</span>
                <span className="text-green-500 font-medium">+{displayData.subscriptionMetrics.newSubscriptions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Cancellations</span>
                <span className="text-red-500 font-medium">-{displayData.subscriptionMetrics.cancellations}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Upgrades</span>
                <span className="text-blue-500 font-medium">+{displayData.subscriptionMetrics.upgrades}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Downgrades</span>
                <span className="text-yellow-500 font-medium">{displayData.subscriptionMetrics.downgrades}</span>
              </div>
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Churn Rate</span>
                  <span className="text-white font-medium">{displayData.subscriptionMetrics.churnRate}%</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-400">Period Revenue</span>
                  <span className="text-green-500 font-medium">${displayData.subscriptionMetrics.revenue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Geographic Data */}
          <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Geographic Distribution</h3>
            <div className="space-y-3">
              {displayData.geographicData.map((item) => (
                <div key={item.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white">{item.country}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-netflix-medium-gray rounded-full overflow-hidden">
                      <div
                        className="h-full bg-netflix-red rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-sm w-12 text-right">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
