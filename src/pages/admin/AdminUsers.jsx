import React, { useState, useEffect } from 'react';
import userService from '@services/userService';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/ui/Badge';
import Avatar from '@components/ui/Avatar';
import Modal from '@components/common/Modal';
import Input from '@components/common/Input';
import Select from '@components/common/Select';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import { FiEdit, FiTrash2, FiUserPlus, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ userId: null, newPassword: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'landlord',
    password: '',
    phone: ''
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await userService.getStaff();
      setUsers(res.data.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const { password, ...updateData } = formData;
        await userService.updateUser(editingUser._id, updateData);
        toast.success('User updated');
      } else {
        await userService.createUser(formData);
        toast.success('User created');
      }
      setShowModal(false);
      resetForm();
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await userService.deleteUser(userId);
      toast.success('User deleted');
      fetchStaff();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await userService.updateUser(passwordData.userId, { password: passwordData.newPassword });
      toast.success('Password updated');
      setShowPasswordModal(false);
      setPasswordData({ userId: null, newPassword: '' });
    } catch (err) {
      toast.error('Failed to update password');
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'landlord',
      password: '',
      phone: user.phone || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'landlord', password: '', phone: '' });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchStaff} />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Staff (Admins & Landlords)</h1>
        <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <FiUserPlus className="mr-2" /> Add Staff
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar name={user.name} size="sm" className="mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.phone && <div className="text-xs text-gray-400">{user.phone}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => openEditModal(user)} className="text-blue-600 hover:text-blue-900" title="Edit user">
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => {
                        setPasswordData({ userId: user._id, newPassword: '' });
                        setShowPasswordModal(true);
                      }}
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Change password"
                    >
                      <FiLock />
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-900" title="Delete user">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No staff users found.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Add/Edit User Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingUser ? 'Edit Staff' : 'Add Staff'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" name="name" value={formData.name} onChange={handleInputChange} required />
          <Input label="Email" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          <Select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'landlord', label: 'Landlord' }
            ]}
          />
          {!editingUser && (
            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleInputChange} required minLength={6} />
          )}
          <Input label="Phone (optional)" name="phone" value={formData.phone} onChange={handleInputChange} />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">{editingUser ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Password">
        <div className="space-y-4">
          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            minLength={6}
            required
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
            <Button onClick={handlePasswordChange}>Update Password</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;