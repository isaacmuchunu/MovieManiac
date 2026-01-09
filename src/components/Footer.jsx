import { Link } from 'react-router-dom';

const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M17.5 6.5h.01" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-2A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
  </svg>
);

const Footer = () => {
  const footerLinks = [
    { label: 'Help Center', href: '/legal/help' },
    { label: 'Terms of Use', href: '/legal/terms' },
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Contact Us', href: 'mailto:support@moovie.com' },
    { label: 'Audio Description', href: '/legal/audio-description' },
    { label: 'Gift Cards', href: '/legal/gift-cards' },
    { label: 'Media Center', href: '/legal/media' },
    { label: 'Investor Relations', href: '/legal/investors' },
    { label: 'Jobs', href: '/legal/careers' },
    { label: 'Legal Notices', href: '/legal/terms' },
    { label: 'Cookie Preferences', href: '/legal/cookies' },
    { label: 'Corporate Information', href: '/legal/corporate' },
  ];

  return (
    <footer className="bg-netflix-black text-gray-500 py-16 px-4 md:px-14 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Social Links */}
        <div className="flex items-center gap-6 mb-6">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <FacebookIcon />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <InstagramIcon />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <TwitterIcon />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <YoutubeIcon />
          </a>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {footerLinks.map((link) => (
            link.href.startsWith('/') ? (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm hover:underline"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-sm hover:underline"
              >
                {link.label}
              </a>
            )
          ))}
        </div>

        {/* Service Code Button */}
        <button className="border border-gray-500 text-sm px-4 py-2 mb-6 hover:text-white transition-colors">
          Service Code
        </button>

        {/* Copyright */}
        <p className="text-xs text-gray-600">
          &copy; {new Date().getFullYear()} Moovie. The future of streaming.
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Powered by TMDB API. For educational purposes only.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
