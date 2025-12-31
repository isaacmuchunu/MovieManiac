import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore, useProfileStore } from '../lib/store';

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const Navbar = ({ onSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { profiles, currentProfile } = useProfileStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      if (onSearch) onSearch(searchQuery);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/browse', label: 'Browse' },
    { path: '/tv-shows', label: 'TV Shows' },
    { path: '/movies', label: 'Movies' },
    { path: '/new', label: 'New & Popular' },
    { path: '/my-list', label: 'My List', requiresAuth: true },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-netflix-black' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-14 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-netflix-red text-2xl md:text-3xl font-bold tracking-tight">MOVIEMANIA</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-5">
            {navLinks.filter(link => !link.requiresAuth || isAuthenticated).map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm transition-colors duration-300 ${
                      isActive
                        ? 'text-white font-medium'
                        : 'text-gray-300 hover:text-gray-100'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <div className="lg:hidden relative">
            <button
              className="flex items-center gap-1 text-sm text-white"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              Browse <ChevronDownIcon />
            </button>

            {/* Mobile Dropdown */}
            {showMobileMenu && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-black/95 border border-gray-700 rounded">
                <ul className="py-2">
                  {navLinks.map((link) => (
                    <li key={link.path}>
                      <NavLink
                        to={link.path}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1 text-white hover:text-gray-300 transition-colors"
            >
              <SearchIcon />
            </button>
            <input
              type="text"
              placeholder="Titles, people, genres"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`search-input ${searchOpen ? 'active' : ''}`}
            />
          </form>

          {/* Kids */}
          <Link to="/kids" className="hidden md:block text-sm text-gray-300 hover:text-white transition-colors">
            Kids
          </Link>

          {/* Notifications */}
          <button className="relative p-1 text-white hover:text-gray-300 transition-colors">
            <BellIcon />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-netflix-red text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile / Auth */}
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-2">
                <div className="w-8 h-8 rounded overflow-hidden">
                  {currentProfile?.avatar ? (
                    <img src={currentProfile.avatar} alt={currentProfile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-red-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{user?.name?.[0] || 'U'}</span>
                    </div>
                  )}
                </div>
                <ChevronDownIcon />
              </button>

              {/* Profile Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-black/95 border border-gray-700 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <ul className="py-2">
                  {profiles.length > 0 && profiles.slice(0, 3).map((profile) => (
                    <li key={profile.id}>
                      <button className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white text-left flex items-center gap-3">
                        <img src={profile.avatar} alt={profile.name} className="w-6 h-6 rounded object-cover" />
                        {profile.name}
                      </button>
                    </li>
                  ))}
                  <li className="border-t border-gray-700 mt-2 pt-2">
                    <Link to="/profiles" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                      Manage Profiles
                    </Link>
                  </li>
                  <li>
                    <Link to="/history" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                      Watch History
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-list" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                      My List
                    </Link>
                  </li>
                  <li className="border-t border-gray-700 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white text-left"
                    >
                      Sign out of MovieMania
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-netflix-red hover:bg-red-700 text-white text-sm font-medium px-4 py-1.5 rounded transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
