import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore, useProfileStore } from '../lib/store';
import SmartSearch from './SmartSearch';
import NotificationCenter from './NotificationCenter';
import DownloadManager from './DownloadManager';
import { COUNTRIES } from '../pages/Browse';

// Genres list for navbar dropdown
const GENRES = [
  { name: 'Action', slug: 'action' },
  { name: 'Adventure', slug: 'adventure' },
  { name: 'Animation', slug: 'animation' },
  { name: 'Comedy', slug: 'comedy' },
  { name: 'Crime', slug: 'crime' },
  { name: 'Documentary', slug: 'documentary' },
  { name: 'Drama', slug: 'drama' },
  { name: 'Family', slug: 'family' },
  { name: 'Fantasy', slug: 'fantasy' },
  { name: 'History', slug: 'history' },
  { name: 'Horror', slug: 'horror' },
  { name: 'Music', slug: 'music' },
  { name: 'Mystery', slug: 'mystery' },
  { name: 'Romance', slug: 'romance' },
  { name: 'Sci-Fi', slug: 'sci-fi' },
  { name: 'Thriller', slug: 'thriller' },
  { name: 'War', slug: 'war' },
  { name: 'Western', slug: 'western' },
];

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

const GlobeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Genres Dropdown Component
const GenresDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGenreSelect = (genre) => {
    navigate(`/browse/${genre.slug}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 text-sm transition-colors duration-300 ${
          isOpen ? 'text-white font-medium' : 'text-gray-300 hover:text-gray-100'
        }`}
      >
        <span>Genres</span>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 bg-netflix-dark-gray/98 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl z-50 p-4 w-[400px] max-w-[95vw]">
          <div className="mb-3 pb-2 border-b border-gray-700">
            <h3 className="text-white font-semibold">Browse by Genre</h3>
            <p className="text-gray-400 text-sm">Select a genre to explore</p>
          </div>
          <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
            {GENRES.map((genre) => (
              <button
                key={genre.slug}
                onClick={() => handleGenreSelect(genre)}
                className="px-3 py-2.5 rounded-lg text-left transition-all hover:bg-gray-700 text-gray-300 hover:text-white text-sm"
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Country Dropdown Component
const CountryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country) => {
    navigate(`/browse?country=${country.code}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 text-sm transition-colors duration-300 ${
          isOpen ? 'text-white' : 'text-gray-300 hover:text-gray-100'
        }`}
      >
        <GlobeIcon />
        <span className="hidden md:inline">Country</span>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 bg-netflix-dark-gray/98 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl z-50 p-4 w-[400px] max-w-[95vw]">
          <div className="mb-3 pb-2 border-b border-gray-700">
            <h3 className="text-white font-semibold">Browse by Country</h3>
            <p className="text-gray-400 text-sm">Select a country to see regional content</p>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountrySelect(country)}
                className="px-3 py-2.5 rounded-lg text-left transition-all hover:bg-gray-700 text-gray-300 hover:text-white text-sm"
              >
                {country.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = ({ onSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSmartSearch, setShowSmartSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);
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

  const handleSearchResult = (result) => {
    if (result.media_type === 'person') {
      navigate(`/person/${result.id}`);
    } else if (result.media_type === 'tv') {
      navigate(`/series/${result.id}`);
    } else {
      navigate(`/movie/${result.id}`);
    }
    setShowSmartSearch(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
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
            <span className="text-netflix-red text-2xl md:text-3xl font-bold tracking-tight">
              <span className="text-white">M</span>OOVIE
            </span>
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
            {/* Genres Dropdown in Nav */}
            <li>
              <GenresDropdown />
            </li>
            {/* Country Dropdown in Nav */}
            <li>
              <CountryDropdown />
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <div className="lg:hidden relative">
            <button
              className="flex items-center gap-1 text-sm text-white"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              Menu <ChevronDownIcon />
            </button>

            {/* Mobile Dropdown */}
            {showMobileMenu && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-black/95 border border-gray-700 rounded max-h-[80vh] overflow-y-auto">
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
                  <li className="border-t border-gray-700 mt-2 pt-2">
                    <span className="block px-4 py-2 text-xs text-gray-500 uppercase">Genres</span>
                    <div className="grid grid-cols-2 gap-1 px-2 pb-2">
                      {GENRES.slice(0, 12).map((genre) => (
                        <Link
                          key={genre.slug}
                          to={`/browse/${genre.slug}`}
                          className="px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded"
                          onClick={() => setShowMobileMenu(false)}
                        >
                          {genre.name}
                        </Link>
                      ))}
                    </div>
                  </li>
                  <li className="border-t border-gray-700 mt-2 pt-2">
                    <span className="block px-4 py-2 text-xs text-gray-500 uppercase">Countries</span>
                    <div className="grid grid-cols-2 gap-1 px-2 pb-2">
                      {COUNTRIES.slice(0, 8).map((country) => (
                        <Link
                          key={country.code}
                          to={`/browse?country=${country.code}`}
                          className="px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded"
                          onClick={() => setShowMobileMenu(false)}
                        >
                          {country.name}
                        </Link>
                      ))}
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Smart Search */}
          <button
            onClick={() => setShowSmartSearch(true)}
            className="p-1 text-white hover:text-gray-300 transition-colors"
            aria-label="Search"
          >
            <SearchIcon />
          </button>

          {/* Downloads */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setShowDownloads(!showDownloads)}
                className="p-1 text-white hover:text-gray-300 transition-colors"
                aria-label="Downloads"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              {showDownloads && (
                <DownloadManager onClose={() => setShowDownloads(false)} />
              )}
            </div>
          )}

          {/* Kids */}
          <Link to="/kids" className="hidden md:block text-sm text-gray-300 hover:text-white transition-colors">
            Kids
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1 text-white hover:text-gray-300 transition-colors"
              aria-label="Notifications"
            >
              <BellIcon />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-netflix-red text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            {showNotifications && (
              <NotificationCenter onClose={() => setShowNotifications(false)} />
            )}
          </div>

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
                      Sign out of Moovie
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

      {/* Smart Search Overlay */}
      {showSmartSearch && (
        <SmartSearch
          onClose={() => setShowSmartSearch(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
