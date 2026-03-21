import React, { useState, useEffect } from 'react';
import settingsService from '@services/settingsService';
import userService from '@services/userService';
import Card from '@components/common/Card';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import Badge from '@components/ui/Badge';
import Avatar from '@components/ui/Avatar';
import Modal from '@components/common/Modal';
import Select from '@components/common/Select';
import { FiSave, FiClock, FiCalendar, FiInfo, FiUsers, FiSettings, FiEdit, FiTrash2, FiUserPlus, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [settings, setSettings] = useState({
    companyName: 'MyApartment',
    contactEmail: 'info@myapartment.com',
    contactPhone: '+254 700 123 456',
    address: '123 Main Street, Nairobi, Kenya',
    website: 'https://myapartment.com',
    paymentDueDay: 5
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ userId: null, newPassword: '' });
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    role: 'landlord',
    password: '',
    phone: ''
  });

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchUsers();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await settingsService.getSettings();
      setSettings(prev => ({ ...prev, ...res.data.data }));
    } catch (err) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await userService.getStaff();
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to load users', err);
    }
  };

  const handleSettingChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const settingsToSave = {};
      Object.keys(settings).forEach(key => {
        if (settings[key] !== undefined && settings[key] !== null) {
          settingsToSave[key] = settings[key];
        }
      });
      await settingsService.updateSettings(settingsToSave);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUserInputChange = (e) => {
    setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const { password, ...updateData } = userFormData;
        await userService.updateUser(editingUser._id, updateData);
        toast.success('User updated');
      } else {
        await userService.createUser(userFormData);
        toast.success('User created');
      }
      setShowUserModal(false);
      resetUserForm();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await userService.deleteUser(userId);
      toast.success('User deleted');
      fetchUsers();
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
    setUserFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'landlord',
      password: '',
      phone: user.phone || ''
    });
    setShowUserModal(true);
  };

  const resetUserForm = () => {
    setEditingUser(null);
    setUserFormData({ name: '', email: '', role: 'landlord', password: '', phone: '' });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSettings} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* System Status Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FiClock size={40} />
            <div>
              <h2 className="text-xl font-semibold">System Time</h2>
              <p className="text-blue-100">{currentTime.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{currentTime.toLocaleTimeString()}</p>
            <p className="text-blue-100">Current Time</p>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center px-4 py-2 font-medium ${activeTab === 'company' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <FiSettings className="mr-2" /> Company Settings
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center px-4 py-2 font-medium ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <FiUsers className="mr-2" /> Manage Staff
        </button>
      </div>

      {/* Company Settings Tab */}
      {activeTab === 'company' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-lg font-semibold mb-4">Company Information</h2>
              <p className="text-sm text-gray-500 mb-4">All fields are optional. Only fill what you want to display.</p>
              <div className="space-y-4">
                <Input label="Company Name" name="companyName" value={settings.companyName || ''} onChange={handleSettingChange} placeholder="MyApartment" />
                <Input label="Website" name="website" value={settings.website || ''} onChange={handleSettingChange} placeholder="https://myapartment.com" />
                <Input label="Contact Email" type="email" name="contactEmail" value={settings.contactEmail || ''} onChange={handleSettingChange} placeholder="info@myapartment.com" />
                <Input label="Contact Phone" name="contactPhone" value={settings.contactPhone || ''} onChange={handleSettingChange} placeholder="+254 700 123 456" />
                <Input label="Address" name="address" value={settings.address || ''} onChange={handleSettingChange} placeholder="123 Main Street, Nairobi, Kenya" />
                <Input label="Payment Due Day" name="paymentDueDay" type="number" min="1" max="31" value={settings.paymentDueDay || 5} onChange={handleSettingChange} placeholder="5" />
                <p className="text-sm text-gray-500 mt-1">Rent due on the {settings.paymentDueDay || 5}th of each month</p>
                <Button onClick={handleSaveSettings} isLoading={saving}><FiSave className="mr-2" /> Save Settings</Button>
              </div>
            </Card>
          </div>
          <div>
            <Card>
              <h3 className="text-lg font-semibold mb-4">Current Configuration</h3>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded"><p className="text-sm text-gray-500">Company</p><p className="font-medium">{settings.companyName || 'MyApartment'}</p></div>
                <div className="p-3 bg-gray-50 rounded"><p className="text-sm text-gray-500">Payment Due Date</p><p className="font-medium">{settings.paymentDueDay || 5}{settings.paymentDueDay ? (settings.paymentDueDay >= 11 && settings.paymentDueDay <= 13 ? 'th' : ['st', 'nd', 'rd'][(settings.paymentDueDay % 10) - 1] || 'th') : 'th'} of every month</p></div>
                <div className="p-3 bg-gray-50 rounded"><p className="text-sm text-gray-500">Contact</p><p className="font-medium">{settings.contactEmail || 'Not set'}</p><p className="font-medium">{settings.contactPhone || 'Not set'}</p></div>
                <div className="p-3 bg-gray-50 rounded"><p className="text-sm text-gray-500">Address</p><p className="font-medium">{settings.address || 'Not set'}</p></div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Users Management Tab */}
      {activeTab === 'users' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Staff Management</h2>
            <Button variant="primary" onClick={() => { resetUserForm(); setShowUserModal(true); }}>
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
                        <button onClick={() => openEditModal(user)} className="text-blue-600 hover:text-blue-900"><FiEdit /></button>
                        <button onClick={() => { setPasswordData({ userId: user._id, newPassword: '' }); setShowPasswordModal(true); }} className="text-yellow-600 hover:text-yellow-900"><FiLock /></button>
                        <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-900"><FiTrash2 /></button>
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
        </div>
      )}

      {/* Add/Edit User Modal */}
      <Modal isOpen={showUserModal} onClose={() => setShowUserModal(false)} title={editingUser ? 'Edit Staff' : 'Add Staff'}>
        <form onSubmit={handleUserSubmit} className="space-y-4">
          <Input label="Name" name="name" value={userFormData.name} onChange={handleUserInputChange} required />
          <Input label="Email" type="email" name="email" value={userFormData.email} onChange={handleUserInputChange} required />
          <Select
            label="Role"
            name="role"
            value={userFormData.role}
            onChange={handleUserInputChange}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'landlord', label: 'Landlord' }
            ]}
          />
          {!editingUser && (
            <Input label="Password" type="password" name="password" value={userFormData.password} onChange={handleUserInputChange} required minLength={6} />
          )}
          <Input label="Phone (optional)" name="phone" value={userFormData.phone} onChange={handleUserInputChange} />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setShowUserModal(false)}>Cancel</Button>
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

export default AdminSettings;