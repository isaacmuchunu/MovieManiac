import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../lib/backendApi';
import { tmdbApi } from '../../lib/tmdbProxy';

// Toast component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in`}>
      {type === 'success' && (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {type === 'error' && (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded p-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <style>{`
        @keyframes slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

// Content Form Component
const ContentForm = ({ item, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    type: item?.type || 'MOVIE',
    status: item?.status || 'DRAFT',
    overview: item?.overview || '',
    genres: item?.genres?.join(', ') || '',
    releaseDate: item?.releaseDate || '',
    rating: item?.rating || '',
    runtime: item?.runtime || '',
    poster: item?.poster || '',
    backdrop: item?.backdrop || '',
    trailerUrl: item?.trailerUrl || '',
    director: item?.director || '',
    cast: item?.cast?.join(', ') || '',
    language: item?.language || 'en',
    ageRating: item?.ageRating || '',
    tmdbId: item?.tmdbId || ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const dataToSubmit = {
        ...formData,
        genres: formData.genres.split(',').map(g => g.trim()).filter(Boolean),
        cast: formData.cast.split(',').map(c => c.trim()).filter(Boolean),
        tmdbId: formData.tmdbId ? parseInt(formData.tmdbId) : null
      };
      
      await onSave(dataToSubmit);
      onClose();
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-netflix-dark-gray rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="sticky top-0 bg-netflix-dark-gray border-b border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {item ? 'Edit Content' : 'Add New Content'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                >
                  <option value="MOVIE">Movie</option>
                  <option value="SERIES">TV Series</option>
                  <option value="DOCUMENTARY">Documentary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Overview</label>
                <textarea
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  rows={4}
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Genres (comma-separated)</label>
                <input
                  type="text"
                  value={formData.genres}
                  onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                  placeholder="Action, Drama, Thriller"
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                />
              </div>
            </div>

            {/* Technical Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Technical Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Release Date</label>
                <input
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Rating (0-10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Runtime (minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.runtime}
                  onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Age Rating</label>
                <select
                  value={formData.ageRating}
                  onChange={(e) => setFormData({ ...formData, ageRating: e.target.value })}
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                >
                  <option value="">Not Rated</option>
                  <option value="G">G - General Audiences</option>
                  <option value="PG">PG - Parental Guidance</option>
                  <option value="PG-13">PG-13</option>
                  <option value="R">R - Restricted</option>
                  <option value="NC-17">NC-17</option>
                </select>
              </div>
            </div>
          </div>

          {/* Visual Assets */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Visual Assets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Poster URL</label>
                <input
                  type="url"
                  value={formData.poster}
                  onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                  placeholder="https://example.com/poster.jpg"
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Backdrop URL</label>
                <input
                  type="url"
                  value={formData.backdrop}
                  onChange={(e) => setFormData({ ...formData, backdrop: e.target.value })}
                  placeholder="https://example.com/backdrop.jpg"
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                />
              </div>
            </div>
          </div>

          {/* Cast & Crew */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Cast & Crew</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Director</label>
                <input
                  type="text"
                  value={formData.director}
                  onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                  placeholder="Director name"
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Cast (comma-separated)</label>
                <input
                  type="text"
                  value={formData.cast}
                  onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                  placeholder="Actor 1, Actor 2, Actor 3"
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                />
              </div>
            </div>
          </div>

          {/* External Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">External Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Trailer URL</label>
                <input
                  type="url"
                  value={formData.trailerUrl}
                  onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">TMDB ID</label>
                <input
                  type="number"
                  value={formData.tmdbId}
                  onChange={(e) => setFormData({ ...formData, tmdbId: e.target.value })}
                  placeholder="Optional TMDB ID"
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loading}
              className="px-6 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              {item ? 'Update Content' : 'Create Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ContentManagement = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState({ type: 'all', status: 'all' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncData, setSyncData] = useState({ tmdbId: '', type: 'MOVIE' });
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [page, filter]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      // Try backend first, fallback to TMDB for demo
      const data = await adminApi.getContent({
        page,
        type: filter.type !== 'all' ? filter.type : undefined,
        status: filter.status !== 'all' ? filter.status : undefined,
        search: searchQuery || undefined
      }).catch(async () => {
        // Fallback: fetch from TMDB for demo
        const movies = await tmdbApi.getTrending();
        return {
          content: movies.results.map(m => ({
            id: m.id,
            title: m.title || m.name,
            type: m.media_type === 'tv' ? 'SERIES' : 'MOVIE',
            poster: m.poster_path ? `https://image.tmdb.org/t/p/w185${m.poster_path}` : null,
            releaseDate: m.release_date || m.first_air_date,
            rating: m.vote_average,
            status: 'PUBLISHED',
            views: Math.floor(Math.random() * 100000)
          })),
          totalPages: 5
        };
      });

      setContent(data.content || data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchContent();
  };

  const handleSync = async () => {
    if (!syncData.tmdbId) return;

    setSyncing(true);
    try {
      await adminApi.syncFromTmdb(syncData.tmdbId, syncData.type);
      setShowSyncModal(false);
      setSyncData({ tmdbId: '', type: 'MOVIE' });
      setToast({ message: 'Content synced successfully from TMDB', type: 'success' });
      fetchContent();
    } catch (error) {
      console.error('Sync failed:', error);
      setToast({ message: error.message || 'Failed to sync from TMDB', type: 'error' });
    } finally {
      setSyncing(false);
    }
  };

  const handleAddContent = async (contentData) => {
    try {
      await adminApi.createContent(contentData);
      setToast({ message: 'Content created successfully', type: 'success' });
      fetchContent();
    } catch (error) {
      console.error('Create failed:', error);
      setToast({ message: error.message || 'Failed to create content', type: 'error' });
      throw error;
    }
  };

  const handleEditContent = async (contentData) => {
    try {
      await adminApi.updateContent(selectedItem.id, contentData);
      setToast({ message: 'Content updated successfully', type: 'success' });
      fetchContent();
    } catch (error) {
      console.error('Update failed:', error);
      setToast({ message: error.message || 'Failed to update content', type: 'error' });
      throw error;
    }
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    setDeleting(true);
    try {
      await adminApi.deleteContent(selectedItem.id);
      setShowDeleteModal(false);
      setSelectedItem(null);
      setToast({ message: 'Content deleted successfully', type: 'success' });
      fetchContent();
    } catch (error) {
      console.error('Delete failed:', error);
      setToast({ message: error.message || 'Failed to delete content', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PUBLISHED: 'bg-green-500/20 text-green-500',
      DRAFT: 'bg-yellow-500/20 text-yellow-500',
      ARCHIVED: 'bg-gray-500/20 text-gray-500',
      PROCESSING: 'bg-blue-500/20 text-blue-500'
    };
    return styles[status] || styles.DRAFT;
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="bg-netflix-dark-gray border-b border-gray-800 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Content Management</h1>
            <p className="text-gray-400 text-sm">Manage movies, series, and other content</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSyncModal(true)}
              className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sync from TMDB
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-netflix-red rounded-lg text-white hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Content
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-8 py-4 border-b border-gray-800">
        <div className="flex flex-wrap items-center gap-4">
          <form onSubmit={handleSearch} className="flex-1 min-w-[300px]">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search content..."
                className="w-full bg-netflix-medium-gray text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="MOVIE">Movies</option>
            <option value="SERIES">Series</option>
            <option value="DOCUMENTARY">Documentaries</option>
          </select>

          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Content Table */}
      <div className="p-8">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-netflix-dark-gray rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            <div className="bg-netflix-dark-gray rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Content</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Rating</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Views</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {content.map((item) => (
                    <tr key={item.id} className="border-b border-gray-800 hover:bg-netflix-medium-gray/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.poster || 'https://via.placeholder.com/45x67'}
                            alt={item.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="text-white font-medium">{item.title}</p>
                            <p className="text-gray-500 text-sm">{item.releaseDate?.split('-')[0]}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{item.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="text-white">{item.rating?.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{item.views?.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => navigate(`/admin/content/${item.id}/videos`)}
                            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                            title="Manage Videos"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-gray-400 text-sm">
                Showing page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-netflix-medium-gray text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-netflix-medium-gray text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sync Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-netflix-dark-gray rounded-xl p-6 w-full max-w-md border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Sync from TMDB</h2>
            <p className="text-gray-400 text-sm mb-6">
              Enter a TMDB ID to import movie or series data automatically.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Content Type</label>
                <select
                  value={syncData.type}
                  onChange={(e) => setSyncData({ ...syncData, type: e.target.value })}
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none"
                >
                  <option value="MOVIE">Movie</option>
                  <option value="SERIES">TV Series</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">TMDB ID</label>
                <input
                  type="text"
                  value={syncData.tmdbId}
                  onChange={(e) => setSyncData({ ...syncData, tmdbId: e.target.value })}
                  placeholder="e.g., 550 for Fight Club"
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowSyncModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSync}
                disabled={syncing || !syncData.tmdbId}
                className="px-4 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {syncing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Syncing...
                  </>
                ) : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-netflix-dark-gray rounded-xl p-6 w-full max-w-md border border-gray-800">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-600/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Content</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete <span className="text-white font-medium">{selectedItem.title}</span>?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedItem(null);
                }}
                className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Deleting...
                  </>
                ) : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Content Modal */}
      {showAddModal && (
        <ContentForm
          item={null}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddContent}
          loading={loading}
        />
      )}

      {/* Edit Content Modal */}
      {showEditModal && selectedItem && (
        <ContentForm
          item={selectedItem}
          onClose={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
          onSave={handleEditContent}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ContentManagement;
