import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../lib/backendApi';

// Dashboard logging utility
const dashboardLogger = {
  info: (message, data = {}) => {
    if (import.meta.env.DEV) {
      console.log(`[Dashboard INFO] ${new Date().toISOString()}: ${message}`, data);
    }
  },
  warn: (message, data = {}) => {
    console.warn(`[Dashboard WARN] ${new Date().toISOString()}: ${message}`, data);
  },
  error: (message, error = null) => {
    console.error(`[Dashboard ERROR] ${new Date().toISOString()}: ${message}`, error);
  },
  debug: (message, data = {}) => {
    if (import.meta.env.DEV) {
      console.debug(`[Dashboard DEBUG] ${new Date().toISOString()}: ${message}`, data);
    }
  }
};

// Stat Card Component with enhanced animations
const StatCard = ({ title, value, change, icon, color, loading, trend, subtitle }) => (
  <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        {loading ? (
          <div className="h-9 w-24 bg-netflix-medium-gray rounded animate-pulse" />
        ) : (
          <>
            <p className="text-3xl font-bold text-white">{value}</p>
            {subtitle && (
              <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
            )}
          </>
        )}
        {!loading && change !== undefined && change !== null && (
          <div className="flex items-center gap-1 mt-2">
            {change >= 0 ? (
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            <p className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? '+' : ''}{typeof change === 'number' ? change.toFixed(1) : change}%
              <span className="text-gray-500 ml-1">from last period</span>
            </p>
          </div>
        )}
      </div>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color} flex-shrink-0`}>
        {icon}
      </div>
    </div>
  </div>
);

// Revenue Card Component
const RevenueCard = ({ revenue, loading }) => {
  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-green-900/30 to-netflix-dark-gray rounded-xl p-6 border border-green-800/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
        <div className="px-3 py-1 bg-green-500/20 rounded-full">
          <span className="text-green-400 text-sm font-medium">This Month</span>
        </div>
      </div>
      {loading ? (
        <div className="space-y-4">
          <div className="h-10 bg-netflix-medium-gray rounded animate-pulse w-32" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-netflix-medium-gray rounded animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <p className="text-4xl font-bold text-white mb-4">
            {formatCurrency(revenue?.monthly ?? 0)}
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-netflix-medium-gray/50 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Daily Avg</p>
              <p className="text-white font-semibold">{formatCurrency(revenue?.dailyAverage ?? 0)}</p>
            </div>
            <div className="bg-netflix-medium-gray/50 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">New Subs</p>
              <p className="text-white font-semibold">{revenue?.newSubscriptions ?? 0}</p>
            </div>
            <div className="bg-netflix-medium-gray/50 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Churn Rate</p>
              <p className="text-white font-semibold">{revenue?.churnRate ?? 0}%</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Recent Activity Component
const RecentActivity = ({ activities, loading }) => (
  <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
      <Link to="/admin/analytics" className="text-netflix-red text-sm hover:underline">
        View All
      </Link>
    </div>
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
      <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
        {activities.map((activity, index) => (
          <div key={activity.id || index} className="flex items-start gap-3 group">
            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
              activity.type === 'error' ? 'bg-red-500' :
              activity.type === 'warning' ? 'bg-yellow-500' :
              activity.type === 'success' ? 'bg-green-500' :
              activity.color || 'bg-blue-500'
            }`} />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm group-hover:text-gray-200 transition-colors truncate">
                {activity.message}
              </p>
              <p className="text-gray-500 text-xs">{activity.time}</p>
            </div>
            {activity.action && (
              <Link
                to={activity.action.link}
                className="text-netflix-red text-xs hover:underline flex-shrink-0"
              >
                {activity.action.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-500 text-sm">No recent activity</p>
        <p className="text-gray-600 text-xs mt-1">Activity will appear here when users interact with the platform</p>
      </div>
    )}
  </div>
);

// Quick Actions Component
const QuickActions = ({ onAction }) => {
  const actions = [
    {
      label: 'Add Content',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      color: 'text-green-500',
      link: '/admin/content/new'
    },
    {
      label: 'Sync TMDB',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      color: 'text-blue-500',
      link: '/admin/content',
      action: 'sync'
    },
    {
      label: 'Manage Users',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'text-purple-500',
      link: '/admin/users'
    },
    {
      label: 'View Analytics',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'text-yellow-500',
      link: '/admin/analytics'
    },
    {
      label: 'Settings',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'text-gray-400',
      link: '/admin/settings'
    },
    {
      label: 'View Logs',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'text-cyan-500',
      link: '/admin/logs'
    }
  ];

  return (
    <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            to={action.link}
            onClick={action.action ? () => onAction?.(action.action) : undefined}
            className="p-4 bg-netflix-medium-gray rounded-lg hover:bg-gray-700 transition-all duration-200 text-center group hover:scale-105"
          >
            <span className={`w-6 h-6 mx-auto mb-2 block ${action.color} group-hover:scale-110 transition-transform`}>
              {action.icon}
            </span>
            <span className="text-white text-sm">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Top Content Component
const TopContent = ({ content, loading }) => (
  <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-white">Top Content Today</h3>
      <Link to="/admin/content" className="text-netflix-red text-sm hover:underline">
        Manage
      </Link>
    </div>
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
        {content.slice(0, 5).map((item, index) => (
          <Link
            key={item.id}
            to={`/admin/content/${item.id}`}
            className="flex items-center gap-3 group hover:bg-netflix-medium-gray/30 p-2 -mx-2 rounded-lg transition-colors"
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
              index === 0 ? 'bg-yellow-500 text-black' :
              index === 1 ? 'bg-gray-400 text-black' :
              index === 2 ? 'bg-amber-700 text-white' :
              'bg-netflix-medium-gray text-white'
            }`}>
              {index + 1}
            </span>
            <img
              src={item.posterUrl || item.poster || '/placeholder-poster.png'}
              alt={item.title}
              className="w-10 h-14 object-cover rounded flex-shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-poster.png';
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate group-hover:text-netflix-red transition-colors">
                {item.title}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{(item.views ?? 0).toLocaleString()} views</span>
                {item.rating && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {item.rating.toFixed(1)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
        <p className="text-gray-500 text-sm">No content data available</p>
        <Link to="/admin/content/new" className="text-netflix-red text-xs hover:underline mt-1 inline-block">
          Add your first content
        </Link>
      </div>
    )}
  </div>
);

// System Health Component with enhanced status indicators
const SystemHealth = ({ health, loading, lastChecked }) => {
  const getStatusColor = (status) => {
    if (status === true || status === 'ok' || status === 'healthy') return 'bg-green-500';
    if (status === false || status === 'error') return 'bg-red-500';
    if (status === 'degraded' || status === 'warning') return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getStatusText = (status, fallbackTrue, fallbackFalse, fallbackUnknown = 'Unknown') => {
    if (status === true || status === 'ok' || status === 'healthy') return fallbackTrue;
    if (status === false || status === 'error') return fallbackFalse;
    if (status === 'degraded' || status === 'warning') return 'Degraded';
    return fallbackUnknown;
  };

  return (
    <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">System Health</h3>
        {lastChecked && (
          <span className="text-xs text-gray-500">
            Updated {new Date(lastChecked).toLocaleTimeString()}
          </span>
        )}
      </div>
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
          {/* API Server */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${getStatusColor(health?.api)}`} />
                API Server
              </span>
              <span className={health?.api ? 'text-green-500' : 'text-red-500'}>
                {getStatusText(health?.api, 'Healthy', 'Unhealthy', 'Checking...')}
              </span>
            </div>
            <div className="w-full h-2 bg-netflix-medium-gray rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getStatusColor(health?.api)}`}
                style={{ width: health?.api ? '100%' : '0%' }}
              />
            </div>
            {health?.apiResponseTime && (
              <p className="text-xs text-gray-500 mt-1">{health.apiResponseTime}ms response time</p>
            )}
          </div>

          {/* Database */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${getStatusColor(health?.database)}`} />
                Database
              </span>
              <span className={health?.database ? 'text-green-500' : 'text-red-500'}>
                {getStatusText(health?.database, 'Connected', 'Disconnected', 'Checking...')}
              </span>
            </div>
            <div className="w-full h-2 bg-netflix-medium-gray rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getStatusColor(health?.database)}`}
                style={{ width: health?.database ? '100%' : '0%' }}
              />
            </div>
          </div>

          {/* Redis Cache */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${health?.redis ? 'bg-green-500' : 'bg-yellow-500'}`} />
                Redis Cache
              </span>
              <span className={health?.redis ? 'text-green-500' : 'text-yellow-500'}>
                {health?.redis ? 'Active' : 'Unavailable'}
              </span>
            </div>
            <div className="w-full h-2 bg-netflix-medium-gray rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${health?.redis ? 'bg-green-500' : 'bg-yellow-500'}`}
                style={{ width: health?.redis ? '100%' : '50%' }}
              />
            </div>
            {!health?.redis && (
              <p className="text-xs text-yellow-500/70 mt-1">Running without cache - performance may be affected</p>
            )}
          </div>

          {/* Storage */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  (health?.storage ?? 0) > 90 ? 'bg-red-500' :
                  (health?.storage ?? 0) > 75 ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
                Storage
              </span>
              <span className={
                (health?.storage ?? 0) > 90 ? 'text-red-500' :
                (health?.storage ?? 0) > 75 ? 'text-yellow-500' :
                'text-blue-500'
              }>
                {health?.storage ?? 0}% Used
              </span>
            </div>
            <div className="w-full h-2 bg-netflix-medium-gray rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  (health?.storage ?? 0) > 90 ? 'bg-red-500' :
                  (health?.storage ?? 0) > 75 ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}
                style={{ width: `${health?.storage ?? 0}%` }}
              />
            </div>
            {(health?.storage ?? 0) > 75 && (
              <p className="text-xs text-yellow-500/70 mt-1">Consider cleaning up old media files</p>
            )}
          </div>

          {/* Memory Usage */}
          {health?.memory !== undefined && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    health.memory > 90 ? 'bg-red-500' :
                    health.memory > 75 ? 'bg-yellow-500' :
                    'bg-purple-500'
                  }`} />
                  Memory
                </span>
                <span className={
                  health.memory > 90 ? 'text-red-500' :
                  health.memory > 75 ? 'text-yellow-500' :
                  'text-purple-500'
                }>
                  {health.memory}% Used
                </span>
              </div>
              <div className="w-full h-2 bg-netflix-medium-gray rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    health.memory > 90 ? 'bg-red-500' :
                    health.memory > 75 ? 'bg-yellow-500' :
                    'bg-purple-500'
                  }`}
                  style={{ width: `${health.memory}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Analytics Chart Component
const AnalyticsChart = ({ data, loading, period, onPeriodChange }) => {
  const maxValue = useMemo(() => {
    if (!data || data.length === 0) return 100;
    return Math.max(...data.map(d => d.value || d));
  }, [data]);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(d => ({
      value: typeof d === 'number' ? d : (d.value || 0),
      label: d.label || '',
      percentage: ((typeof d === 'number' ? d : (d.value || 0)) / maxValue) * 100
    }));
  }, [data, maxValue]);

  return (
    <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Viewing Analytics</h3>
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value)}
          className="bg-netflix-medium-gray text-white px-3 py-1.5 rounded-lg text-sm border border-gray-700 focus:border-netflix-red focus:outline-none cursor-pointer"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-netflix-red border-t-transparent" />
        </div>
      ) : chartData.length > 0 ? (
        <div className="h-64 flex items-end justify-between gap-1 px-2">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center group"
              style={{ maxWidth: '40px' }}
            >
              <div className="w-full relative">
                <div
                  className="w-full bg-gradient-to-t from-netflix-red to-red-400 rounded-t-sm transition-all duration-300 group-hover:from-red-500 group-hover:to-red-300"
                  style={{ height: `${Math.max(item.percentage, 2)}%`, minHeight: '4px' }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.value.toLocaleString()}
                </div>
              </div>
              {item.label && (
                <span className="text-xs text-gray-500 mt-2 truncate w-full text-center">
                  {item.label}
                </span>
              )}
            </div>
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
  );
};

// Server Alerts Component
const ServerAlerts = ({ alerts, loading }) => {
  if (loading) {
    return (
      <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Server Alerts</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-netflix-medium-gray rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Server Alerts</h3>
        <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-800/30 rounded-lg">
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-green-400 font-medium">All systems operational</p>
            <p className="text-green-500/70 text-sm">No active alerts</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-netflix-dark-gray rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Server Alerts</h3>
        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
          {alerts.length} Active
        </span>
      </div>
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {alerts.map((alert, index) => (
          <div
            key={alert.id || index}
            className={`p-3 rounded-lg border ${
              alert.severity === 'critical' ? 'bg-red-900/20 border-red-800/50' :
              alert.severity === 'warning' ? 'bg-yellow-900/20 border-yellow-800/50' :
              'bg-blue-900/20 border-blue-800/50'
            }`}
          >
            <div className="flex items-start gap-2">
              {alert.severity === 'critical' ? (
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : alert.severity === 'warning' ? (
                <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  alert.severity === 'critical' ? 'text-red-400' :
                  alert.severity === 'warning' ? 'text-yellow-400' :
                  'text-blue-400'
                }`}>
                  {alert.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [topContent, setTopContent] = useState([]);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [revenue, setRevenue] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);

  // Fetch dashboard data with comprehensive logging
  const fetchDashboardData = useCallback(async (isManualRefresh = false) => {
    const fetchStartTime = Date.now();
    dashboardLogger.info('Starting dashboard data fetch', { isManualRefresh, period: analyticsPeriod });

    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      }
      setError(null);

      const [statsData, healthData] = await Promise.all([
        adminApi.getStats().catch(err => {
          dashboardLogger.warn('Stats API failed', { error: err.message });
          return null;
        }),
        adminApi.getHealth().catch(err => {
          dashboardLogger.warn('Health API failed', { error: err.message });
          return null;
        })
      ]);

      dashboardLogger.debug('API responses received', {
        hasStats: !!statsData,
        hasHealth: !!healthData,
        fetchDuration: Date.now() - fetchStartTime
      });

      // Process stats data
      if (statsData?.data) {
        dashboardLogger.debug('Processing stats data', { statsKeys: Object.keys(statsData.data) });
        setStats(statsData.data);

        if (statsData.data.topContent) {
          setTopContent(statsData.data.topContent);
        }
        if (statsData.data.recentActivity) {
          setRecentActivity(statsData.data.recentActivity);
        }
        if (statsData.data.revenue) {
          setRevenue(statsData.data.revenue);
        }
        if (statsData.data.alerts) {
          setAlerts(statsData.data.alerts);
        }
      } else if (statsData) {
        setStats(statsData);
      }

      // Process health data with FIXED nullish coalescing
      if (healthData) {
        dashboardLogger.debug('Processing health data', { healthKeys: Object.keys(healthData) });

        // FIXED: Use ternary operators that return null when status is not 'ok'
        // This allows the nullish coalescing chain to continue properly
        const databaseStatus = healthData.database ??
          (healthData.components?.database?.status === 'ok' ? true : null) ??
          (healthData.status === 'ok' ? true : false);

        const redisStatus = healthData.redis ??
          (healthData.components?.redis?.status === 'ok' ? true : null);

        const storageUsage = healthData.storage ??
          healthData.components?.storage?.usage ??
          healthData.storageUsage ??
          null;

        const memoryUsage = healthData.memory ??
          healthData.components?.memory?.usage ??
          null;

        const healthState = {
          api: healthData.status === 'ok',
          apiResponseTime: healthData.responseTime,
          database: databaseStatus,
          redis: redisStatus,
          storage: typeof storageUsage === 'number' ? storageUsage : 0,
          memory: typeof memoryUsage === 'number' ? memoryUsage : undefined
        };

        dashboardLogger.debug('Health state computed', healthState);
        setHealth(healthState);
      }

      setLastUpdate(Date.now());
      dashboardLogger.info('Dashboard data fetch completed', {
        duration: Date.now() - fetchStartTime,
        hasError: false
      });

    } catch (err) {
      dashboardLogger.error('Dashboard fetch error', err);
      setError('Unable to connect to server. Please check your connection.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [analyticsPeriod]);

  // Initial fetch and polling
  useEffect(() => {
    dashboardLogger.info('Dashboard mounted, starting initial fetch');
    fetchDashboardData();

    const interval = setInterval(() => {
      dashboardLogger.debug('Auto-refresh triggered');
      fetchDashboardData();
    }, 30000); // Refresh every 30 seconds

    return () => {
      dashboardLogger.info('Dashboard unmounting, clearing interval');
      clearInterval(interval);
    };
  }, [fetchDashboardData]);

  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    dashboardLogger.info('Manual refresh requested');
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Handle export report
  const handleExportReport = useCallback(async () => {
    dashboardLogger.info('Export report requested');
    setExportLoading(true);

    try {
      const reportData = {
        generatedAt: new Date().toISOString(),
        period: analyticsPeriod,
        stats: {
          totalUsers: stats?.totalUsers ?? 0,
          activeSubscriptions: stats?.activeSubscriptions ?? 0,
          totalContent: stats?.totalContent ?? 0,
          viewsLast24h: stats?.viewsLast24h ?? 0
        },
        health: {
          api: health?.api ? 'Healthy' : 'Unhealthy',
          database: health?.database ? 'Connected' : 'Disconnected',
          redis: health?.redis ? 'Active' : 'Unavailable',
          storage: `${health?.storage ?? 0}%`
        },
        topContent: topContent.slice(0, 10).map(c => ({
          title: c.title,
          views: c.views ?? 0
        })),
        recentActivity: recentActivity.slice(0, 20)
      };

      // Create and download JSON report
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `moovie-dashboard-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      dashboardLogger.info('Report exported successfully');
    } catch (err) {
      dashboardLogger.error('Export failed', err);
      setError('Failed to export report. Please try again.');
    } finally {
      setExportLoading(false);
    }
  }, [stats, health, topContent, recentActivity, analyticsPeriod]);

  // Handle quick action
  const handleQuickAction = useCallback((action) => {
    dashboardLogger.info('Quick action triggered', { action });
  }, []);

  // Handle analytics period change
  const handlePeriodChange = useCallback((newPeriod) => {
    dashboardLogger.info('Analytics period changed', { from: analyticsPeriod, to: newPeriod });
    setAnalyticsPeriod(newPeriod);
  }, [analyticsPeriod]);

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header */}
      <div className="bg-netflix-dark-gray border-b border-gray-800 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-gray-400 text-sm">
                Welcome back! Here's what's happening with Moovie.
              </p>
              {lastUpdate && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <span className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                  {isRefreshing ? 'Updating...' : `Updated ${new Date(lastUpdate).toLocaleTimeString()}`}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 bg-netflix-medium-gray rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <svg className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={handleExportReport}
              disabled={exportLoading}
              className="px-4 py-2 bg-netflix-medium-gray rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {exportLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              )}
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
        <div className="mx-8 mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-400">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={(stats?.totalUsers ?? 0).toLocaleString()}
            change={stats?.userGrowth}
            subtitle={stats?.newUsersToday ? `+${stats.newUsersToday} today` : undefined}
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
            value={(stats?.activeSubscriptions ?? 0).toLocaleString()}
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
            value={(stats?.totalContent ?? 0).toLocaleString()}
            change={stats?.contentGrowth}
            subtitle={stats?.totalMovies && stats?.totalSeries ? `${stats.totalMovies} movies, ${stats.totalSeries} series` : undefined}
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
            value={(stats?.viewsLast24h ?? 0).toLocaleString()}
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

        {/* Revenue Section */}
        <div className="mb-8">
          <RevenueCard revenue={revenue} loading={loading} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Analytics Chart */}
            <AnalyticsChart
              data={stats?.analyticsData}
              loading={loading}
              period={analyticsPeriod}
              onPeriodChange={handlePeriodChange}
            />

            {/* Recent Activity */}
            <RecentActivity activities={recentActivity} loading={loading} />

            {/* Server Alerts */}
            <ServerAlerts alerts={alerts} loading={loading} />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <QuickActions onAction={handleQuickAction} />
            <TopContent content={topContent} loading={loading} />
            <SystemHealth health={health} loading={loading} lastChecked={lastUpdate} />
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
