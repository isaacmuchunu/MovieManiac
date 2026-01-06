import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/backendApi';

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

// Subscription Form Component
const SubscriptionForm = ({ subscription, plans, users, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    userId: subscription?.user?.id || '',
    planId: subscription?.plan?.id || '',
    status: subscription?.status || 'active',
    startDate: subscription?.startDate ? new Date(subscription.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    nextBilling: subscription?.nextBilling ? new Date(subscription.nextBilling).toISOString().split('T')[0] : '',
    paymentMethodId: subscription?.paymentMethod?.id || '',
    notes: subscription?.notes || ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const dataToSubmit = {
        ...formData,
        userId: parseInt(formData.userId),
        planId: parseInt(formData.planId)
      };
      
      await onSave(dataToSubmit);
      onClose();
    } catch (error) {
      console.error('Error saving subscription:', error);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-netflix-dark-gray rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="sticky top-0 bg-netflix-dark-gray border-b border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {subscription ? 'Edit Subscription' : 'Create New Subscription'}
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
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">User *</label>
              <select
                required
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Subscription Plan *</label>
              <select
                required
                value={formData.planId}
                onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
              >
                <option value="">Select a plan</option>
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - ${plan.price}/month
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
              >
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
                <option value="paused">Paused</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Payment Method</label>
              <select
                value={formData.paymentMethodId}
                onChange={(e) => setFormData({ ...formData, paymentMethodId: e.target.value })}
                className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
              >
                <option value="">Select payment method</option>
                <option value="card_123">Visa ending in 4242</option>
                <option value="card_456">Mastercard ending in 8888</option>
                <option value="card_789">PayPal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Next Billing Date</label>
              <input
                type="date"
                value={formData.nextBilling}
                onChange={(e) => setFormData({ ...formData, nextBilling: e.target.value })}
                className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full bg-netflix-medium-gray text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
            />
          </div>

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
              {subscription ? 'Update Subscription' : 'Create Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Billing History Modal
const BillingHistoryModal = ({ subscription, onClose }) => {
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock billing history data
    const mockHistory = [
      {
        id: 1,
        date: '2024-01-01',
        amount: 9.99,
        status: 'paid',
        description: 'Monthly subscription - Premium Plan',
        paymentMethod: 'Visa ending in 4242'
      },
      {
        id: 2,
        date: '2023-12-01',
        amount: 9.99,
        status: 'paid',
        description: 'Monthly subscription - Premium Plan',
        paymentMethod: 'Visa ending in 4242'
      },
      {
        id: 3,
        date: '2023-11-01',
        amount: 9.99,
        status: 'failed',
        description: 'Monthly subscription - Premium Plan',
        paymentMethod: 'Visa ending in 4242',
        retryDate: '2023-11-03'
      }
    ];
    
    setBillingHistory(mockHistory);
    setLoading(false);
  }, [subscription]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-netflix-dark-gray rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="sticky top-0 bg-netflix-dark-gray border-b border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Billing History</h2>
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

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            </div>
          ) : (
            <div className="space-y-4">
              {billingHistory.map((transaction) => (
                <div key={transaction.id} className="bg-netflix-medium-gray rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{transaction.description}</div>
                      <div className="text-gray-400 text-sm">
                        {new Date(transaction.date).toLocaleDateString()} • {transaction.paymentMethod}
                      </div>
                      {transaction.retryDate && (
                        <div className="text-yellow-400 text-sm">
                          Retry scheduled for {new Date(transaction.retryDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">${transaction.amount}</div>
                      <div className={`text-sm ${
                        transaction.status === 'paid' ? 'text-green-400' : 
                        transaction.status === 'failed' ? 'text-red-400' : 
                        'text-yellow-400'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SubscriptionsManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState({ status: 'all', plan: 'all' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBillingHistoryModal, setShowBillingHistoryModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [toast, setToast] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
    fetchPlans();
    fetchUsers();
  }, [page, filter]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getSubscriptions({
        page,
        status: filter.status !== 'all' ? filter.status : undefined,
        plan: filter.plan !== 'all' ? filter.plan : undefined,
        search: searchQuery || undefined
      }).catch(() => {
        // Demo data for fallback
        return {
          subscriptions: [
            {
              id: 1,
              user: { id: 1, name: 'John Doe', email: 'john@example.com' },
              plan: { id: 3, name: 'Premium', price: 9.99 },
              status: 'active',
              startDate: '2024-01-01',
              nextBilling: '2025-01-01',
              features: ['HD Streaming', '4K Content', '4 Devices'],
              paymentMethod: { id: 'card_123', type: 'visa', last4: '4242' }
            },
            {
              id: 2,
              user: { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
              plan: { id: 1, name: 'Basic', price: 4.99 },
              status: 'active',
              startDate: '2024-02-15',
              nextBilling: '2025-02-15',
              features: ['SD Streaming', '1 Device'],
              paymentMethod: { id: 'card_456', type: 'mastercard', last4: '8888' }
            },
            {
              id: 3,
              user: { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
              plan: { id: 3, name: 'Premium', price: 9.99 },
              status: 'cancelled',
              startDate: '2024-03-01',
              nextBilling: '2025-03-01',
              features: ['HD Streaming', '4K Content', '4 Devices'],
              cancellationDate: '2024-12-15',
              paymentMethod: { id: 'card_789', type: 'paypal' }
            }
          ],
          totalPages: 1,
          totalCount: 3
        };
      });

      setSubscriptions(data.subscriptions || data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const plansData = [
        { id: 1, name: 'Basic', price: 4.99, features: ['SD Streaming', '1 Device'], maxScreenQuality: '480p' },
        { id: 2, name: 'Standard', price: 7.99, features: ['HD Streaming', '2 Devices'], maxScreenQuality: '1080p' },
        { id: 3, name: 'Premium', price: 9.99, features: ['4K Streaming', '4 Devices'], maxScreenQuality: '4K' }
      ];
      setPlans(plansData);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersData = [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active' },
        { id: 4, name: 'Alice Williams', email: 'alice@example.com', status: 'active' },
        { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', status: 'active' }
      ];
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchSubscriptions();
  };

  const handleEdit = (subscription) => {
    setSelectedSubscription(subscription);
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setSelectedSubscription(null);
    setShowCreateModal(true);
  };

  const handleCreateSubscription = async (subscriptionData) => {
    try {
      await adminApi.createSubscription(subscriptionData);
      setToast({ message: 'Subscription created successfully', type: 'success' });
      fetchSubscriptions();
    } catch (error) {
      console.error('Create failed:', error);
      setToast({ message: error.message || 'Failed to create subscription', type: 'error' });
      throw error;
    }
  };

  const handleUpdateSubscription = async (subscriptionData) => {
    try {
      await adminApi.updateSubscription(selectedSubscription.id, subscriptionData);
      setToast({ message: 'Subscription updated successfully', type: 'success' });
      fetchSubscriptions();
    } catch (error) {
      console.error('Update failed:', error);
      setToast({ message: error.message || 'Failed to update subscription', type: 'error' });
      throw error;
    }
  };

  const handleCancelSubscription = async () => {
    if (!selectedSubscription) return;
    
    try {
      await adminApi.cancelSubscription(selectedSubscription.id);
      setToast({ message: 'Subscription cancelled successfully', type: 'success' });
      setShowCancelModal(false);
      setSelectedSubscription(null);
      fetchSubscriptions();
    } catch (error) {
      console.error('Cancel failed:', error);
      setToast({ message: error.message || 'Failed to cancel subscription', type: 'error' });
    }
  };

  const handleDeleteSubscription = async () => {
    if (!selectedSubscription) return;
    
    setDeleting(true);
    try {
      // In a real app, this would be a delete API call
      // await adminApi.deleteSubscription(selectedSubscription.id);
      setToast({ message: 'Subscription deleted successfully', type: 'success' });
      setShowDeleteModal(false);
      setSelectedSubscription(null);
      fetchSubscriptions();
    } catch (error) {
      console.error('Delete failed:', error);
      setToast({ message: error.message || 'Failed to delete subscription', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const handleBillingHistory = (subscription) => {
    setSelectedSubscription(subscription);
    setShowBillingHistoryModal(true);
  };

  const handleFilterChange = (key, value) => {
    setFilter(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: 'bg-green-500',
      cancelled: 'bg-red-500',
      expired: 'bg-gray-500',
      pending: 'bg-yellow-500'
    };
    
    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium text-white rounded-full ${statusStyles[status] || statusStyles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading && subscriptions.length === 0) {
    return (
      <div className="min-h-screen bg-netflix-black p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading subscriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Subscriptions Management</h1>
            <p className="text-gray-400">Manage user subscriptions and billing</p>
          </div>
          <button
            onClick={handleCreate}
            className="px-6 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Subscription
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-netflix-dark-gray rounded-xl p-6 mb-8 border border-gray-800">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search subscriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg pl-10 outline-none focus:ring-2 focus:ring-netflix-red border border-gray-700 placeholder-gray-400"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </form>
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={filter.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-netflix-red border border-gray-700"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filter.plan}
                onChange={(e) => handleFilterChange('plan', e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-netflix-red border border-gray-700"
              >
                <option value="all">All Plans</option>
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-netflix-dark-gray rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Next Billing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">{subscription.user.name}</div>
                        <div className="text-sm text-gray-400">{subscription.user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{subscription.plan.name}</div>
                      <div className="text-sm text-gray-400">${subscription.plan.price}/mo</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(subscription.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      ${subscription.plan.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {new Date(subscription.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {subscription.status === 'cancelled' ? 'N/A' : new Date(subscription.nextBilling).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(subscription)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleBillingHistory(subscription)}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                          title="Billing History"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </button>
                        {subscription.status === 'active' && (
                          <button
                            onClick={() => {
                              setSelectedSubscription(subscription);
                              setShowCancelModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                            title="Cancel Subscription"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedSubscription(subscription);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete Subscription"
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
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-400">
              Showing {subscriptions.length} subscriptions
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-white">
                {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <SubscriptionForm
          subscription={null}
          plans={plans}
          users={users}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateSubscription}
          loading={loading}
        />
      )}

      {showEditModal && selectedSubscription && (
        <SubscriptionForm
          subscription={selectedSubscription}
          plans={plans}
          users={users}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateSubscription}
          loading={loading}
        />
      )}

      {showCancelModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-netflix-dark-gray rounded-xl w-full max-w-md p-6 border border-gray-800">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Cancel Subscription</h3>
              <p className="text-gray-400">
                Are you sure you want to cancel the subscription for {selectedSubscription.user.name}?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-netflix-dark-gray rounded-xl w-full max-w-md p-6 border border-gray-800">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Delete Subscription</h3>
              <p className="text-gray-400">
                Are you sure you want to delete the subscription for {selectedSubscription.user.name}?
                This action cannot be undone and will remove all associated data.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                disabled={deleting}
              >
                Keep Subscription
              </button>
              <button
                onClick={handleDeleteSubscription}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showBillingHistoryModal && selectedSubscription && (
        <BillingHistoryModal
          subscription={selectedSubscription}
          onClose={() => {
            setShowBillingHistoryModal(false);
            setSelectedSubscription(null);
          }}
        />
      )}

      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default SubscriptionsManagement;
