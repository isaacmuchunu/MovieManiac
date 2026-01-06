import { useState, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileDropdown]);

  // Check if user is admin (in real app, this would check auth context)
  const user = JSON.parse(localStorage.getItem('moovie-user') || '{}');
  const isAdmin = user.role === 'ADMIN' || user.role === 'MODERATOR' || true; // Allow for demo

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    {
      path: '/admin',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      path: '/admin/content',
      label: 'Content',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      )
    },
    {
      path: '/admin/users',
      label: 'Users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      path: '/admin/analytics',
      label: 'Analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      path: '/admin/subscriptions',
      label: 'Subscriptions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      path: '/admin/settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleViewProfile = () => {
    setShowProfileDropdown(false);
    setShowProfileModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('moovie-user');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-netflix-black flex">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-netflix-dark-gray border-r border-gray-800 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {!sidebarCollapsed && (
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-netflix-red">MOOVIE</span>
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">Admin</span>
            </Link>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-netflix-red text-white'
                  : 'text-gray-400 hover:text-white hover:bg-netflix-medium-gray'
              }`}
            >
              {item.icon}
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-800 relative profile-dropdown-container">
          <button
            onClick={handleProfileClick}
            className={`flex items-center gap-3 w-full ${sidebarCollapsed ? 'justify-center' : ''} hover:bg-gray-800 rounded-lg p-2 transition-colors`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-netflix-red to-purple-600 flex items-center justify-center text-white font-bold">
              {user.name?.charAt(0) || 'A'}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 text-left">
                <p className="text-white text-sm font-medium truncate">{user.name || 'Admin User'}</p>
                <p className="text-gray-500 text-xs truncate">{user.email || 'admin@moovie.com'}</p>
              </div>
            )}
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Profile Dropdown */}
          {showProfileDropdown && !sidebarCollapsed && (
            <div className="absolute bottom-full left-4 mb-2 w-56 bg-netflix-dark-gray border border-gray-800 rounded-lg shadow-lg z-50">
              <div className="p-2">
                <button
                  onClick={handleViewProfile}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
                <div className="h-px bg-gray-800 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* For collapsed sidebar - simple tooltip */}
          {sidebarCollapsed && (
            <div className="absolute bottom-full left-4 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
              Click for profile
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-netflix-dark-gray rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800">
            <div className="sticky top-0 bg-netflix-dark-gray border-b border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Admin Profile</h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-netflix-red to-purple-600 flex items-center justify-center text-white font-bold text-3xl">
                  {user.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">{user.name || 'Admin User'}</h3>
                  <p className="text-gray-400 mb-2">{user.email || 'admin@moovie.com'}</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-netflix-red text-white text-xs font-medium rounded-full">
                      {user.role || 'ADMIN'}
                    </span>
                    <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue={user.name?.split(' ')[0] || 'Admin'}
                    className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue={user.name?.split(' ')[1] || 'User'}
                    className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user.email || 'admin@moovie.com'}
                    className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Department</label>
                  <select
                    defaultValue="administrative"
                    className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  >
                    <option value="administrative">Administrative</option>
                    <option value="content">Content Management</option>
                    <option value="support">Customer Support</option>
                    <option value="technical">Technical Operations</option>
                  </select>
                </div>
              </div>

              {/* Account Settings */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Account Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-gray-400 text-sm">Receive email updates about system events</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-netflix-red transition-colors focus:outline-none focus:ring-2 focus:ring-netflix-red focus:ring-offset-2 focus:ring-offset-netflix-dark-gray">
                      <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition-transform"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-netflix-red focus:ring-offset-2 focus:ring-offset-netflix-dark-gray">
                      <span className="inline-block h-4 w-4 transform translate-x-1 rounded-full bg-white transition-transform"></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Activity Summary */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Activity Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-netflix-medium-gray rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-netflix-red">247</p>
                    <p className="text-gray-400 text-sm">Total Actions</p>
                  </div>
                  <div className="bg-netflix-medium-gray rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-400">89</p>
                    <p className="text-gray-400 text-sm">Users Modified</p>
                  </div>
                  <div className="bg-netflix-medium-gray rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-400">156</p>
                    <p className="text-gray-400 text-sm">Content Items</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
