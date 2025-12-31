import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/backendApi';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState({ role: 'all', subscription: 'all' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, filter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getUsers({
        page,
        role: filter.role !== 'all' ? filter.role : undefined,
        subscription: filter.subscription !== 'all' ? filter.subscription : undefined,
        search: searchQuery || undefined
      }).catch(() => ({
        // Demo data when API unavailable
        users: [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'USER', subscription: 'PREMIUM', joinDate: '2024-01-15', lastActive: '2024-12-30', status: 'ACTIVE' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'USER', subscription: 'STANDARD', joinDate: '2024-02-20', lastActive: '2024-12-29', status: 'ACTIVE' },
          { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'ADMIN', subscription: 'PREMIUM', joinDate: '2023-06-10', lastActive: '2024-12-30', status: 'ACTIVE' },
          { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'USER', subscription: 'BASIC', joinDate: '2024-05-08', lastActive: '2024-12-28', status: 'ACTIVE' },
          { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'USER', subscription: 'FREE', joinDate: '2024-08-22', lastActive: '2024-12-25', status: 'INACTIVE' },
          { id: 6, name: 'Eva Martinez', email: 'eva@example.com', role: 'MODERATOR', subscription: 'PREMIUM', joinDate: '2024-03-15', lastActive: '2024-12-30', status: 'ACTIVE' },
          { id: 7, name: 'Frank Lee', email: 'frank@example.com', role: 'USER', subscription: 'STANDARD', joinDate: '2024-07-01', lastActive: '2024-12-27', status: 'SUSPENDED' },
          { id: 8, name: 'Grace Kim', email: 'grace@example.com', role: 'USER', subscription: 'PREMIUM', joinDate: '2024-04-18', lastActive: '2024-12-30', status: 'ACTIVE' },
        ],
        totalPages: 5
      }));

      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      await adminApi.updateUser(selectedUser.id, {
        role: selectedUser.role,
        status: selectedUser.status
      });
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      ADMIN: 'bg-red-500/20 text-red-500',
      MODERATOR: 'bg-purple-500/20 text-purple-500',
      USER: 'bg-blue-500/20 text-blue-500'
    };
    return styles[role] || styles.USER;
  };

  const getSubscriptionBadge = (subscription) => {
    const styles = {
      PREMIUM: 'bg-yellow-500/20 text-yellow-500',
      STANDARD: 'bg-green-500/20 text-green-500',
      BASIC: 'bg-blue-500/20 text-blue-500',
      FREE: 'bg-gray-500/20 text-gray-500'
    };
    return styles[subscription] || styles.FREE;
  };

  const getStatusBadge = (status) => {
    const styles = {
      ACTIVE: 'bg-green-500/20 text-green-500',
      INACTIVE: 'bg-gray-500/20 text-gray-500',
      SUSPENDED: 'bg-red-500/20 text-red-500'
    };
    return styles[status] || styles.INACTIVE;
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header */}
      <div className="bg-netflix-dark-gray border-b border-gray-800 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <p className="text-gray-400 text-sm">Manage users, roles, and subscriptions</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-netflix-medium-gray rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export Users
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
                placeholder="Search by name or email..."
                className="w-full bg-netflix-medium-gray text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          <select
            value={filter.role}
            onChange={(e) => setFilter({ ...filter, role: e.target.value })}
            className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="MODERATOR">Moderator</option>
            <option value="USER">User</option>
          </select>

          <select
            value={filter.subscription}
            onChange={(e) => setFilter({ ...filter, subscription: e.target.value })}
            className="bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none"
          >
            <option value="all">All Subscriptions</option>
            <option value="PREMIUM">Premium</option>
            <option value="STANDARD">Standard</option>
            <option value="BASIC">Basic</option>
            <option value="FREE">Free</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="p-8">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-netflix-dark-gray rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            <div className="bg-netflix-dark-gray rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">User</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Subscription</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Join Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Last Active</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800 hover:bg-netflix-medium-gray/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-netflix-red to-purple-600 flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.name}</p>
                            <p className="text-gray-500 text-sm">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getSubscriptionBadge(user.subscription)}`}>
                          {user.subscription}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{user.joinDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{user.lastActive}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            title="Edit User"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                            title="View Activity"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                            title="Send Notification"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
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

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-netflix-dark-gray rounded-xl p-6 w-full max-w-md border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Edit User</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={selectedUser.name}
                  disabled
                  className="w-full bg-netflix-medium-gray text-gray-400 px-4 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="text"
                  value={selectedUser.email}
                  disabled
                  className="w-full bg-netflix-medium-gray text-gray-400 px-4 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Role</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none"
                >
                  <option value="USER">User</option>
                  <option value="MODERATOR">Moderator</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <select
                  value={selectedUser.status}
                  onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                  className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
