'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { 
  Users, Plus, Search, Edit2, Trash2, Shield, UserCheck, Eye, 
  X, Check, Loader2, AlertCircle, ArrowLeft, Crown, User, EyeIcon
} from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'viewer'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // Check authorization
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signin');
    } else if (!authLoading && user?.role !== 'super_admin') {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, user, router]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'super_admin') {
      fetchUsers();
    }
  }, [isAuthenticated, user]);

  // Create user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setShowCreateModal(false);
        setFormData({ fullName: '', email: '', password: '', role: 'viewer' });
        setSuccessMessage('User created successfully');
        fetchUsers();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setFormError(data.message);
      }
    } catch (err) {
      setFormError('Failed to create user');
    } finally {
      setFormLoading(false);
    }
  };

  // Update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const token = localStorage.getItem('auth-token');
      const updateData = { ...formData };
      if (!updateData.password) delete updateData.password;

      const response = await fetch(`/api/admin/users/${selectedUser.UserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (data.success) {
        setShowEditModal(false);
        setSelectedUser(null);
        setFormData({ fullName: '', email: '', password: '', role: 'viewer' });
        setSuccessMessage('User updated successfully');
        fetchUsers();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setFormError(data.message);
      }
    } catch (err) {
      setFormError('Failed to update user');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    setFormLoading(true);

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/admin/users/${selectedUser.UserId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setShowDeleteModal(false);
        setSelectedUser(null);
        setSuccessMessage('User deleted successfully');
        fetchUsers();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setFormError(data.message);
      }
    } catch (err) {
      setFormError('Failed to delete user');
    } finally {
      setFormLoading(false);
    }
  };

  // Toggle user active status
  const handleToggleActive = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = await response.json();
      if (data.success) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Failed to toggle user status');
    }
  };

  // Open edit modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.FullName,
      email: user.Email,
      password: '',
      role: user.Role
    });
    setFormError('');
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Filter users
  const filteredUsers = users.filter(u => 
    u.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.Role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Role badge colors
  const getRoleBadge = (role) => {
    const badges = {
      super_admin: { bg: 'bg-red-100', text: 'text-red-700', icon: Crown },
      admin: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Shield },
      viewer: { bg: 'bg-gray-100', text: 'text-gray-700', icon: EyeIcon }
    };
    const badge = badges[role] || badges.viewer;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        {role.replace('_', ' ')}
      </span>
    );
  };

  if (authLoading || (isAuthenticated && user?.role !== 'super_admin' && loading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#003c7a]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#003c7a]/10 rounded-lg">
                  <Users className="w-5 h-5 text-[#003c7a]" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">User Management</h1>
                  <p className="text-xs text-gray-500">Manage system users and roles</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setFormData({ fullName: '', email: '', password: '', role: 'viewer' });
                setFormError('');
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#003c7a] text-white rounded-lg hover:bg-[#002d5c] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <Check className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700 font-medium">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}

        {/* Search and Stats */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name, email, or role..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#003c7a] focus:ring-2 focus:ring-[#003c7a]/10 transition-all outline-none"
            />
          </div>
          <div className="flex gap-2">
            {['super_admin', 'admin', 'viewer'].map(role => {
              const count = users.filter(u => u.Role === role).length;
              const colors = {
                super_admin: 'bg-red-50 text-red-700 border-red-200',
                admin: 'bg-blue-50 text-blue-700 border-blue-200',
                viewer: 'bg-gray-50 text-gray-700 border-gray-200'
              };
              return (
                <div key={role} className={`px-4 py-2 rounded-lg border ${colors[role]} text-sm font-medium`}>
                  {role.replace('_', ' ')}: {count}
                </div>
              );
            })}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#003c7a] mx-auto" />
              <p className="mt-4 text-gray-500">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="mt-4 text-gray-500">No users found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr key={u.UserId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#003c7a] to-[#005bb5] rounded-full flex items-center justify-center text-white font-semibold">
                          {u.FullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{u.FullName}</p>
                          <p className="text-sm text-gray-500">{u.Email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(u.Role)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(u.UserId, u.IsActive)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          u.IsActive
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {u.IsActive ? (
                          <>
                            <UserCheck className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {u.LastLogin 
                        ? new Date(u.LastLogin).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-2 text-gray-400 hover:text-[#003c7a] hover:bg-[#003c7a]/10 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {u.UserId !== user?.userId && (
                          <button
                            onClick={() => openDeleteModal(u)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create New User</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {formError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#003c7a] focus:ring-2 focus:ring-[#003c7a]/10 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#003c7a] focus:ring-2 focus:ring-[#003c7a]/10 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#003c7a] focus:ring-2 focus:ring-[#003c7a]/10 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#003c7a] focus:ring-2 focus:ring-[#003c7a]/10 outline-none"
                >
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2.5 bg-[#003c7a] text-white rounded-lg hover:bg-[#002d5c] transition-colors flex items-center justify-center gap-2"
                >
                  {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {formError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#003c7a] focus:ring-2 focus:ring-[#003c7a]/10 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#003c7a] focus:ring-2 focus:ring-[#003c7a]/10 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password (leave blank to keep current)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#003c7a] focus:ring-2 focus:ring-[#003c7a]/10 outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#003c7a] focus:ring-2 focus:ring-[#003c7a]/10 outline-none"
                >
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2.5 bg-[#003c7a] text-white rounded-lg hover:bg-[#002d5c] transition-colors flex items-center justify-center gap-2"
                >
                  {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete User?</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete <strong>{selectedUser.FullName}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={formLoading}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
