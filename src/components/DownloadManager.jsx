import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Sample downloads - in production these would be managed by Service Worker
const sampleDownloads = [
  {
    id: 1,
    title: 'Breaking Bad',
    type: 'series',
    episode: 'S5:E16 Felina',
    poster: 'https://picsum.photos/seed/dl1/200/300',
    size: '1.2 GB',
    quality: '1080p',
    progress: 100,
    status: 'complete',
    expiresIn: '7 days',
  },
  {
    id: 2,
    title: 'Wednesday',
    type: 'series',
    episode: 'S1:E1 Wednesday\'s Child Is Full of Woe',
    poster: 'https://picsum.photos/seed/dl2/200/300',
    size: '850 MB',
    quality: '720p',
    progress: 65,
    status: 'downloading',
    speed: '5.2 MB/s',
  },
  {
    id: 3,
    title: 'The Dark Knight',
    type: 'movie',
    poster: 'https://picsum.photos/seed/dl3/200/300',
    size: '4.5 GB',
    quality: '4K HDR',
    progress: 100,
    status: 'complete',
    expiresIn: '14 days',
  },
];

const DownloadManager = ({ isOpen, onClose }) => {
  const [downloads, setDownloads] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [storageUsed, setStorageUsed] = useState(6.5);
  const [storageTotal] = useState(20);

  useEffect(() => {
    setDownloads(sampleDownloads);
  }, []);

  // Simulate download progress
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads((prev) =>
        prev.map((d) => {
          if (d.status === 'downloading' && d.progress < 100) {
            const newProgress = Math.min(100, d.progress + Math.random() * 5);
            return {
              ...d,
              progress: newProgress,
              status: newProgress >= 100 ? 'complete' : 'downloading',
            };
          }
          return d;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const downloadingCount = downloads.filter((d) => d.status === 'downloading').length;
  const completedCount = downloads.filter((d) => d.status === 'complete').length;

  const filteredDownloads = downloads.filter((d) => {
    if (activeTab === 'downloading') return d.status === 'downloading';
    if (activeTab === 'completed') return d.status === 'complete';
    return true;
  });

  const pauseDownload = (id) => {
    setDownloads((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === 'paused' ? 'downloading' : 'paused' } : d
      )
    );
  };

  const deleteDownload = (id) => {
    if (confirm('Delete this download?')) {
      setDownloads((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const clearCompleted = () => {
    setDownloads((prev) => prev.filter((d) => d.status !== 'complete'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Downloads</h2>
            <p className="text-gray-400 mt-1">
              {downloads.length} items • {storageUsed.toFixed(1)} GB used
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Storage Bar */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Storage Used</span>
            <span className="text-sm text-white">{storageUsed.toFixed(1)} / {storageTotal} GB</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-netflix-red to-red-400 transition-all"
              style={{ width: `${(storageUsed / storageTotal) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Downloads expire after the date shown. Renew by connecting to the internet.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-white text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All ({downloads.length})
          </button>
          <button
            onClick={() => setActiveTab('downloading')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'downloading'
                ? 'bg-white text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Downloading ({downloadingCount})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'completed'
                ? 'bg-white text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Download List */}
        {filteredDownloads.length > 0 ? (
          <div className="space-y-4">
            {filteredDownloads.map((download) => (
              <div
                key={download.id}
                className="bg-gray-900/50 rounded-lg overflow-hidden hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex">
                  {/* Poster */}
                  <div className="w-24 md:w-32 flex-shrink-0 relative">
                    <img
                      src={download.poster}
                      alt={download.title}
                      className="w-full h-full object-cover"
                    />
                    {download.status === 'complete' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold">{download.title}</h3>
                        {download.episode && (
                          <p className="text-gray-400 text-sm">{download.episode}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                          <span>{download.quality}</span>
                          <span>{download.size}</span>
                          {download.expiresIn && (
                            <span className="text-yellow-500">Expires in {download.expiresIn}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {download.status === 'complete' ? (
                          <Link
                            to={`/watch/${download.id}`}
                            className="bg-white hover:bg-gray-200 text-black font-medium px-4 py-2 rounded transition-colors"
                          >
                            Play
                          </Link>
                        ) : (
                          <button
                            onClick={() => pauseDownload(download.id)}
                            className="text-gray-400 hover:text-white p-2 transition-colors"
                          >
                            {download.status === 'paused' ? (
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                              </svg>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => deleteDownload(download.id)}
                          className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {download.status !== 'complete' && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-400">
                            {download.status === 'paused' ? 'Paused' : 'Downloading'}
                          </span>
                          <span className="text-sm text-white">
                            {Math.round(download.progress)}%
                            {download.speed && ` • ${download.speed}`}
                          </span>
                        </div>
                        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              download.status === 'paused' ? 'bg-yellow-500' : 'bg-netflix-red'
                            }`}
                            style={{ width: `${download.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No downloads yet</h3>
            <p className="text-gray-400 mb-6">Download movies and shows to watch offline</p>
            <Link
              to="/browse"
              onClick={onClose}
              className="inline-flex items-center gap-2 bg-netflix-red hover:bg-red-700 text-white font-medium px-6 py-3 rounded transition-colors"
            >
              Browse Content
            </Link>
          </div>
        )}

        {/* Footer Actions */}
        {completedCount > 0 && activeTab !== 'downloading' && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={clearCompleted}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Clear Completed Downloads
            </button>
          </div>
        )}

        {/* Smart Downloads Feature */}
        <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">Smart Downloads</h3>
              <p className="text-gray-400 text-sm mb-3">
                Automatically download the next episode when you finish watching, and delete watched episodes to save space.
              </p>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-purple-500" />
                <span className="text-white text-sm">Enable Smart Downloads</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadManager;
