import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useProfileStore } from '../lib/store';

const AVATAR_OPTIONS = [
  'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png',
  'https://i.pinimg.com/736x/e8/df/e7/e8dfe74b7b47fb92f33da2143d3c45ba.jpg',
  'https://i.pinimg.com/736x/1b/a2/e6/1ba2e6d1d4874546616d4acf56c22a8e.jpg',
  'https://i.pinimg.com/736x/a6/97/ed/a697ed4b7cb21f767ea5ef5e25be0d6c.jpg',
  'https://i.pinimg.com/736x/b1/8e/f4/b18ef49b6f4a77bea08e0d56b09c3b3d.jpg',
  'https://i.pinimg.com/736x/82/2a/10/822a1023b6c3a6e14e0e68e9c7d9a05e.jpg',
];

function Profiles() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { profiles, currentProfile, setCurrentProfile, addProfile, removeProfile, updateProfile } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [newProfile, setNewProfile] = useState({
    name: '',
    avatar: AVATAR_OPTIONS[0],
    isKids: false,
  });

  // Default profiles if none exist
  const displayProfiles = profiles.length > 0 ? profiles : [
    { id: 1, name: user?.name || 'User', avatar: AVATAR_OPTIONS[0], isKids: false },
    { id: 2, name: 'Kids', avatar: AVATAR_OPTIONS[3], isKids: true },
  ];

  const handleSelectProfile = (profile) => {
    if (isEditing) {
      setEditingProfile(profile);
    } else {
      setCurrentProfile(profile);
      navigate('/');
    }
  };

  const handleAddProfile = () => {
    if (!newProfile.name.trim()) return;
    addProfile({
      id: Date.now(),
      ...newProfile,
    });
    setNewProfile({ name: '', avatar: AVATAR_OPTIONS[0], isKids: false });
    setIsAdding(false);
  };

  const handleUpdateProfile = () => {
    if (!editingProfile.name.trim()) return;
    updateProfile(editingProfile.id, editingProfile);
    setEditingProfile(null);
  };

  const handleDeleteProfile = (id) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      removeProfile(id);
      setEditingProfile(null);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        {/* Header */}
        <h1 className="text-3xl md:text-5xl font-medium text-white mb-2">
          {isEditing ? 'Manage Profiles' : "Who's watching?"}
        </h1>
        {isEditing && (
          <p className="text-gray-400 mb-8">Edit or delete your profiles</p>
        )}

        {/* Profile Grid */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 mb-12">
          {displayProfiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleSelectProfile(profile)}
              className="group relative"
            >
              <div
                className={`w-28 h-28 md:w-36 md:h-36 rounded-md overflow-hidden transition-all ${
                  isEditing ? 'ring-2 ring-gray-500' : 'group-hover:ring-2 ring-white'
                } ${currentProfile?.id === profile.id ? 'ring-2 ring-white' : ''}`}
              >
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-gray-400 group-hover:text-white mt-3 text-lg transition-colors">
                {profile.name}
              </p>
              {profile.isKids && (
                <span className="text-xs text-blue-400">KIDS</span>
              )}
            </button>
          ))}

          {/* Add Profile Button */}
          {!isEditing && displayProfiles.length < 5 && (
            <button
              onClick={() => setIsAdding(true)}
              className="group"
            >
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-md border-2 border-gray-600 group-hover:border-white flex items-center justify-center transition-colors">
                <svg className="w-16 h-16 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-gray-400 group-hover:text-white mt-3 text-lg transition-colors">
                Add Profile
              </p>
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {isEditing ? (
            <button
              onClick={() => setIsEditing(false)}
              className="bg-white hover:bg-gray-200 text-black font-medium px-8 py-2 rounded transition-colors"
            >
              Done
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="border border-gray-500 hover:border-white text-gray-500 hover:text-white font-medium px-8 py-2 rounded transition-colors"
            >
              Manage Profiles
            </button>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="mt-8 text-gray-500 hover:text-white text-sm transition-colors"
        >
          Sign out of Moovie
        </button>
      </div>

      {/* Add Profile Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-medium text-white mb-6">Add Profile</h2>

            {/* Avatar Selection */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-3">Choose Avatar</label>
              <div className="flex flex-wrap gap-3">
                {AVATAR_OPTIONS.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => setNewProfile({ ...newProfile, avatar })}
                    className={`w-16 h-16 rounded-md overflow-hidden transition-all ${
                      newProfile.avatar === avatar
                        ? 'ring-2 ring-white scale-110'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">Name</label>
              <input
                type="text"
                value={newProfile.name}
                onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                placeholder="Profile name"
                className="w-full bg-gray-800 text-white rounded px-4 py-3 outline-none focus:ring-2 focus:ring-white/50"
                maxLength={20}
              />
            </div>

            {/* Kids Toggle */}
            <label className="flex items-center gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={newProfile.isKids}
                onChange={(e) => setNewProfile({ ...newProfile, isKids: e.target.checked })}
                className="w-5 h-5 accent-netflix-red"
              />
              <span className="text-white">Kids Profile</span>
            </label>
            <p className="text-gray-500 text-sm -mt-4 mb-6 ml-8">
              Only show content suitable for children
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsAdding(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProfile}
                disabled={!newProfile.name.trim()}
                className="flex-1 bg-white hover:bg-gray-200 text-black font-medium py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editingProfile && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-medium text-white mb-6">Edit Profile</h2>

            {/* Avatar Selection */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-3">Choose Avatar</label>
              <div className="flex flex-wrap gap-3">
                {AVATAR_OPTIONS.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => setEditingProfile({ ...editingProfile, avatar })}
                    className={`w-16 h-16 rounded-md overflow-hidden transition-all ${
                      editingProfile.avatar === avatar
                        ? 'ring-2 ring-white scale-110'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">Name</label>
              <input
                type="text"
                value={editingProfile.name}
                onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                placeholder="Profile name"
                className="w-full bg-gray-800 text-white rounded px-4 py-3 outline-none focus:ring-2 focus:ring-white/50"
                maxLength={20}
              />
            </div>

            {/* Kids Toggle */}
            <label className="flex items-center gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={editingProfile.isKids}
                onChange={(e) => setEditingProfile({ ...editingProfile, isKids: e.target.checked })}
                className="w-5 h-5 accent-netflix-red"
              />
              <span className="text-white">Kids Profile</span>
            </label>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteProfile(editingProfile.id)}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setEditingProfile(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={!editingProfile.name.trim()}
                className="flex-1 bg-white hover:bg-gray-200 text-black font-medium py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profiles;
