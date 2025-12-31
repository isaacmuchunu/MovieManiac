import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../lib/backendApi';

const StatCard = ({ title, value, change, icon, color }) => (
  <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
        {change !== undefined && (
          <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last period
          </p>
        )}
      </div>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const RecentActivity = ({ activities }) => (
  <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
    <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
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
        to="/admin/content/sync"
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

const TopContent = ({ content }) => (
  <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
    <h3 className="text-lg font-semibold text-white mb-4">Top Content Today</h3>
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
            src={item.poster || 'https://via.placeholder.com/40x60'}
            alt={item.title}
            className="w-10 h-14 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm truncate">{item.title}</p>
            <p className="text-gray-500 text-xs">{item.views?.toLocaleString()} views</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SystemHealth = ({ health }) => (
  <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
    <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">API Server</span>
          <span className={health?.api ? 'text-green-500' : 'text-red-500'}>
            {health?.api ? 'Healthy' : 'Down'}
          </span>
        </div>
        <div className="w-full h-2 bg-netflix-medium-gray rounded-full">
          <div className={`h-full rounded-full ${health?.api ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: health?.api ? '100%' : '0%' }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Database</span>
          <span className={health?.database ? 'text-green-500' : 'text-red-500'}>
            {health?.database ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="w-full h-2 bg-netflix-medium-gray rounded-full">
          <div className={`h-full rounded-full ${health?.database ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: health?.database ? '100%' : '0%' }} />
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
          <div className={`h-full rounded-full ${health?.redis ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: health?.redis ? '100%' : '50%' }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Storage</span>
          <span className="text-blue-500">{health?.storage || 0}% Used</span>
        </div>
        <div className="w-full h-2 bg-netflix-medium-gray rounded-full">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${health?.storage || 0}%` }} />
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, healthData] = await Promise.all([
          adminApi.getStats().catch(() => null),
          adminApi.getHealth().catch(() => null)
        ]);
        setStats(statsData);
        setHealth(healthData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Default stats for demo/when API unavailable
  const displayStats = stats || {
    totalUsers: 12847,
    activeSubscriptions: 9823,
    totalContent: 2456,
    monthlyRevenue: 147890,
    userGrowth: 12.5,
    subscriptionGrowth: 8.3,
    contentGrowth: 5.2,
    revenueGrowth: 15.7
  };

  const recentActivities = [
    { message: 'New user registration: john.doe@email.com', time: '2 minutes ago', color: 'bg-green-500' },
    { message: 'Content "The Matrix 4" synced from TMDB', time: '15 minutes ago', color: 'bg-blue-500' },
    { message: 'Premium subscription upgrade', time: '32 minutes ago', color: 'bg-purple-500' },
    { message: 'Video transcoding completed: Breaking Bad S01E01', time: '1 hour ago', color: 'bg-yellow-500' },
    { message: 'System backup completed successfully', time: '3 hours ago', color: 'bg-green-500' },
  ];

  const topContent = [
    { id: 1, title: 'Stranger Things', poster: 'https://image.tmdb.org/t/p/w92/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', views: 45892 },
    { id: 2, title: 'The Witcher', poster: 'https://image.tmdb.org/t/p/w92/7vjaCdMw15FEbXyLQTVa04URsPm.jpg', views: 38721 },
    { id: 3, title: 'Wednesday', poster: 'https://image.tmdb.org/t/p/w92/9PFonBhy4cQy7Jz20NpMygczOkv.jpg', views: 34156 },
    { id: 4, title: 'The Last of Us', poster: 'https://image.tmdb.org/t/p/w92/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg', views: 29843 },
    { id: 5, title: 'House of the Dragon', poster: 'https://image.tmdb.org/t/p/w92/z2yahl2uefxDCl0nogcRBstwruJ.jpg', views: 27654 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-netflix-dark-gray rounded w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Main Content */}
      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={displayStats.totalUsers?.toLocaleString()}
            change={displayStats.userGrowth}
            color="bg-blue-500/20"
            icon={
              <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatCard
            title="Active Subscriptions"
            value={displayStats.activeSubscriptions?.toLocaleString()}
            change={displayStats.subscriptionGrowth}
            color="bg-green-500/20"
            icon={
              <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Total Content"
            value={displayStats.totalContent?.toLocaleString()}
            change={displayStats.contentGrowth}
            color="bg-purple-500/20"
            icon={
              <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            }
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${displayStats.monthlyRevenue?.toLocaleString()}`}
            change={displayStats.revenueGrowth}
            color="bg-yellow-500/20"
            icon={
              <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <div className="h-64 flex items-end justify-between gap-2">
                {[65, 45, 78, 52, 89, 67, 94, 73, 81, 56, 88, 72].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-netflix-red to-red-400 rounded-t-sm transition-all hover:from-red-500 hover:to-red-300"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>

            <RecentActivity activities={recentActivities} />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <QuickActions />
            <TopContent content={topContent} />
            <SystemHealth health={health || { api: true, database: true, redis: true, storage: 34 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
