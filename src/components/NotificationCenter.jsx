import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { tmdbApi } from '../lib/videoProviders';
import { errorReporting, ErrorCategory } from '../lib/errorReporting';

const NotificationCenter = ({ onClose }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // Try to fetch from backend API if authenticated
        if (isAuthenticated) {
          try {
            const response = await fetch('/api/notifications', {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
              }
            });
            if (response.ok) {
              const data = await response.json();
              if (data.data?.notifications) {
                setNotifications(data.data.notifications.map(n => ({
                  ...n,
                  time: new Date(n.createdAt || n.time)
                })));
                setLoading(false);
                return;
              }
            }
          } catch {
            // Backend notifications not available, fall back to TMDB-based notifications
          }
        }

        // Generate notifications based on trending content for demo
        const trending = await tmdbApi.getTrending();
        const dynamicNotifications = (trending.results || []).slice(0, 5).map((item, index) => ({
          id: `tmdb-${item.id}`,
          type: index === 0 ? 'new_release' : index === 1 ? 'recommendation' : index === 2 ? 'continue' : index === 3 ? 'social' : 'download',
          title: index === 0 ? 'New Release' : index === 1 ? 'Recommended for You' : index === 2 ? 'Continue Watching' : index === 3 ? 'Trending Now' : 'Download Ready',
          message: index === 0 ? `${item.title || item.name} is now streaming!` :
                   index === 1 ? `Based on your history: ${item.title || item.name}` :
                   index === 2 ? `Continue watching ${item.title || item.name}` :
                   index === 3 ? `${item.title || item.name} is trending` :
                   `${item.title || item.name} is ready to watch offline`,
          image: item.poster_path ? `https://image.tmdb.org/t/p/w185${item.poster_path}` : null,
          link: item.media_type === 'tv' ? `/series/${item.id}` : `/movie/${item.id}`,
          time: new Date(Date.now() - (1000 * 60 * 60 * index * 2)),
          read: index > 2
        }));

        // Add account notification if logged in
        if (isAuthenticated && user?.name) {
          dynamicNotifications.push({
            id: 'welcome',
            type: 'account',
            title: 'Welcome back!',
            message: `Good to see you, ${user.name}. Check out what's new.`,
            image: null,
            link: '/browse',
            time: new Date(Date.now() - 86400000),
            read: true
          });
        }

        setNotifications(dynamicNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [isAuthenticated, user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    // Update backend if authenticated
    if (isAuthenticated && !id.startsWith('tmdb-')) {
      fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      }).catch((err) => {
        errorReporting.captureError(err, { category: ErrorCategory.NETWORK });
      });
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    if (isAuthenticated) {
      fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      }).catch((err) => {
        errorReporting.captureError(err, { category: ErrorCategory.NETWORK });
      });
    }
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    if (isAuthenticated && !id.startsWith('tmdb-')) {
      fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      }).catch((err) => {
        errorReporting.captureError(err, { category: ErrorCategory.NETWORK });
      });
    }
  };

  const clearAll = () => {
    setNotifications([]);

    if (isAuthenticated) {
      fetch('/api/notifications', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      }).catch((err) => {
        errorReporting.captureError(err, { category: ErrorCategory.NETWORK });
      });
    }
  };

  const formatTime = (date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getIcon = (type) => {
    const icons = {
      new_release: { svg: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', color: 'text-netflix-red', bg: 'bg-red-500/20' },
      recommendation: { svg: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', color: 'text-purple-500', bg: 'bg-purple-500/20' },
      continue: { svg: 'M8 5v14l11-7z', color: 'text-blue-500', bg: 'bg-blue-500/20' },
      download: { svg: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', color: 'text-green-500', bg: 'bg-green-500/20' },
      social: { svg: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'text-yellow-500', bg: 'bg-yellow-500/20' },
      account: { svg: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'text-gray-400', bg: 'bg-gray-500/20' }
    };
    return icons[type] || icons.account;
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-96 max-w-[95vw] bg-netflix-dark-gray/98 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-netflix-red text-white text-xs px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                filter === 'all'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white bg-gray-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                filter === 'unread'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white bg-gray-800'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-netflix-red hover:text-red-400 transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full mx-auto" />
            <p className="text-gray-400 text-sm mt-3">Loading...</p>
          </div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => {
            const iconData = getIcon(notification.type);
            return (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-gray-800/30' : ''
                }`}
              >
                <div className="flex gap-3">
                  {/* Image */}
                  <div className="relative flex-shrink-0">
                    {notification.image ? (
                      <img
                        src={notification.image}
                        alt=""
                        className="w-14 h-20 rounded object-cover"
                      />
                    ) : (
                      <div className={`w-14 h-20 rounded flex items-center justify-center ${iconData.bg}`}>
                        <svg className={`w-6 h-6 ${iconData.color}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d={iconData.svg} />
                        </svg>
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${iconData.bg}`}>
                      <svg className={`w-3 h-3 ${iconData.color}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d={iconData.svg} />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-sm font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-netflix-red rounded-full flex-shrink-0 mt-1 ml-2" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{formatTime(notification.time)}</p>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="flex-shrink-0 text-gray-500 hover:text-white p-1 transition-colors opacity-0 hover:opacity-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-gray-400">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-800 flex items-center justify-between">
          <Link
            to="/settings/notifications"
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Settings
          </Link>
          <button
            onClick={clearAll}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
