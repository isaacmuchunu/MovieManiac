import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../lib/backendApi';

const StatCard = ({ title, value, change, icon, color, loading }) => (
  <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        {loading ? (
          <div className="h-9 w-24 bg-netflix-medium-gray rounded animate-pulse" />
        ) : (
          <p className="text-3xl font-bold text-white">{value}</p>
        )}
        {!loading && change !== undefined && (
          <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '+' : ''}{change}% from last period
          </p>
        )}
      </div>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const RecentActivity = ({ activities, loading }) => (
  <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
    <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
    {loading ? (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-start gap-3 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-netflix-medium-gray mt-2" />
            <div className="flex-1">
              <div className="h-4 bg-netflix-medium-gray rounded w-3/4 mb-1" />
              <div className="h-3 bg-netflix-medium-gray rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    ) : activities.length > 0 ? (
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-2 ${activity.color || 'bg-blue-500'}`} />
            <div className="flex-1">
              <p className="text-white text-sm">{activity.message}</p>
              <p className="text-gray-500 text-xs">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">No recent activity</p>
        <p className="text-gray-600 text-xs mt-1">Activity will appear here when users interact with the platform</p>
      </div>
    )}
  </div>
);

const QuickActions = () => (
  <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
    <div className="grid grid-cols-2 gap-3">
      <Link
        to="/admin/content/new"
        className="p-4 bg-netflix-medium-gray rounded-lg hover:bg-gray-700 transition-colors text-center"
      >
        <svg className="w-6 h-6 mx-auto mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="text-white text-sm">Add Content</span>
      </Link>
      <Link
        to="/admin/content"
        className="p-4 bg-netflix-medium-gray rounded-lg hover:bg-gray-700 transition-colors text-center"
      >
        <svg className="w-6 h-6 mx-auto mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="text-white text-sm">Sync TMDB</span>
      </Link>
      <Link
        to="/admin/users"
        className="p-4 bg-netflix-medium-gray rounded-lg hover:bg-gray-700 transition-colors text-center"
      >
        <svg className="w-6 h-6 mx-auto mb-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span className="text-white text-sm">Manage Users</span>
      </Link>
      <Link
        to="/admin/analytics"
        className="p-4 bg-netflix-medium-gray rounded-lg hover:bg-gray-700 transition-colors text-center"
      >
        <svg className="w-6 h-6 mx-auto mb-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span className="text-white text-sm">View Analytics</span>
      </Link>
    </div>
  </div>
);

const TopContent = ({ content, loading }) => (
  <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
    <h3 className="text-lg font-semibold text-white mb-4">Top Content Today</h3>
    {loading ? (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-6 h-6 rounded-full bg-netflix-medium-gray" />
            <div className="w-10 h-14 bg-netflix-medium-gray rounded" />
            <div className="flex-1">
              <div className="h-4 bg-netflix-medium-gray rounded w-3/4 mb-1" />
              <div className="h-3 bg-netflix-medium-gray rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    ) : content.length > 0 ? (
      <div className="space-y-3">
        {content.map((item, index) => (
          <div key={item.id} className="flex items-center gap-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
              index === 0 ? 'bg-yellow-500 text-black' :
              index === 1 ? 'bg-gray-400 text-black' :
              index === 2 ? 'bg-amber-700 text-white' :
              'bg-netflix-medium-gray text-white'
            }`}>
              {index + 1}
            </span>
            <img
              src={item.posterUrl || item.poster || 'https://via.placeholder.com/40x60?text=N/A'}
              alt={item.title}
              className="w-10 h-14 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">{item.title}</p>
              <p className="text-gray-500 text-xs">{(item.views || 0).toLocaleString()} views</p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">No content data available</p>
        <p className="text-gray-600 text-xs mt-1">Add content to see top performing titles</p>
      </div>
    )}
  </div>
);

const SystemHealth = ({ health, loading }) => (
  <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
    <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
    {loading ? (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse">
            <div className="flex justify-between mb-1">
              <div className="h-4 bg-netflix-medium-gray rounded w-20" />
              <div className="h-4 bg-netflix-medium-gray rounded w-16" />
            </div>
            <div className="w-full h-2 bg-netflix-medium-gray rounded-full" />
          </div>
        ))}
      </div>
    ) : (
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">API Server</span>
            <span className={health?.api ? 'text-green-500' : 'text-red-500'}>
              {health?.api ? 'Healthy' : 'Checking...'}
            </span>
          </div>
          <div className="w-full h-2 bg-netflix-medium-gray rounded-full">
            <div className={`h-full rounded-full transition-all ${health?.api ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: health?.api ? '100%' : '0%' }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Database</span>
            <span className={health?.database ? 'text-green-500' : 'text-red-500'}>
              {health?.database ? 'Connected' : 'Checking...'}
            </span>
          </div>
          <div className="w-full h-2 bg-netflix-medium-gray rounded-full">
            <div className={`h-full rounded-full transition-all ${health?.database ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: health?.database ? '100%' : '0%' }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Redis Cache</span>
            <span className={health?.redis ? 'text-green-500' : 'text-yellow-500'}>
              {health?.redis ? 'Active' : 'Unavailable'}
            </span>
          </div>
          <div className="w-full h-2 bg-netflix-medium-gray rounded-full">
            <div className={`h-full rounded-full transition-all ${health?.redis ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: health?.redis ? '100%' : '50%' }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Storage</span>
            <span className="text-blue-500">{health?.storage || 0}% Used</span>
          </div>
          <div className="w-full h-2 bg-netflix-medium-gray rounded-full">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${health?.storage || 0}%` }} />
          </div>
        </div>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [topContent, setTopContent] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError(null);
        const [statsData, healthData] = await Promise.all([
          adminApi.getStats().catch(err => {
            console.error('Stats API error:', err);
            return null;
          }),
          adminApi.getHealth().catch(err => {
            console.error('Health API error:', err);
            return null;
          })
        ]);

        if (statsData?.data) {
          setStats(statsData.data);
          if (statsData.data.topContent) {
            setTopContent(statsData.data.topContent);
          }
          if (statsData.data.recentActivity) {
            setRecentActivity(statsData.data.recentActivity);
          }
        } else if (statsData) {
          setStats(statsData);
        }

        if (healthData) {
          // Read real values from healthData response with sensible defaults
          const databaseStatus = healthData.database ??
            healthData.components?.database?.status === 'ok' ??
            (healthData.status === 'ok' ? null : false);
          const redisStatus = healthData.redis ??
            healthData.components?.redis?.status === 'ok' ??
            null;
          const storageUsage = healthData.storage ??
            healthData.components?.storage?.usage ??
            healthData.storageUsage ??
            null;

          setHealth({
            api: healthData.status === 'ok',
            database: databaseStatus,
            redis: redisStatus,
            storage: typeof storageUsage === 'number' ? storageUsage : 0
          });
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Unable to connect to server. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header */}
      <div className="bg-netflix-dark-gray border-b border-gray-800 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm">Welcome back! Here's what's happening with Moovie.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-netflix-medium-gray rounded-lg text-white hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export Report
            </button>
            <Link
              to="/"
              className="px-4 py-2 bg-netflix-red rounded-lg text-white hover:bg-red-700 transition-colors"
            >
              View Site
            </Link>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mx-8 mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers?.toLocaleString() || '0'}
            change={stats?.userGrowth}
            color="bg-blue-500/20"
            loading={loading}
            icon={
              <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatCard
            title="Active Subscriptions"
            value={stats?.activeSubscriptions?.toLocaleString() || '0'}
            change={stats?.subscriptionGrowth}
            color="bg-green-500/20"
            loading={loading}
            icon={
              <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Total Content"
            value={stats?.totalContent?.toLocaleString() || '0'}
            change={stats?.contentGrowth}
            color="bg-purple-500/20"
            loading={loading}
            icon={
              <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            }
          />
          <StatCard
            title="Views (24h)"
            value={stats?.viewsLast24h?.toLocaleString() || '0'}
            change={stats?.viewsGrowth}
            color="bg-yellow-500/20"
            loading={loading}
            icon={
              <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart Placeholder */}
            <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Viewing Analytics</h3>
                <select className="bg-netflix-medium-gray text-white px-3 py-1 rounded-lg text-sm border-none">
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-netflix-red border-t-transparent" />
                </div>
              ) : stats?.analyticsData ? (
                <div className="h-64 flex items-end justify-between gap-2">
                  {stats.analyticsData.map((value, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gradient-to-t from-netflix-red to-red-400 rounded-t-sm transition-all hover:from-red-500 hover:to-red-300"
                      style={{ height: `${value}%` }}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                  <svg className="w-12 h-12 mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p>No analytics data available</p>
                  <p className="text-sm text-gray-600 mt-1">Data will appear as users watch content</p>
                </div>
              )}
            </div>

            <RecentActivity activities={recentActivity} loading={loading} />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <QuickActions />
            <TopContent content={topContent} loading={loading} />
            <SystemHealth health={health} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
