import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import {
  FiHome,
  FiGrid,
  FiTool,
  FiDollarSign,
  FiMail,
  FiUser,
  FiLogOut,
  FiFileText,
  FiSearch,
  FiClipboard,
  FiSettings,
  FiUsers,
  FiBarChart2,
  FiCreditCard
} from 'react-icons/fi';

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const linkClass = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;

  const handleLogout = () => {
    logout();
  };

  if (isAdminRoute) {
    return (
      <aside className="w-64 bg-white shadow-md h-screen sticky top-16">
        <nav className="p-4 space-y-1">
          <NavLink to="/admin/dashboard" className={linkClass}><FiHome /><span>Dashboard</span></NavLink>
          <NavLink to="/admin/properties" className={linkClass}><FiGrid /><span>Properties</span></NavLink>
          <NavLink to="/admin/tenants" className={linkClass}><FiUsers /><span>Tenants</span></NavLink>
          <NavLink to="/admin/maintenance" className={linkClass}><FiTool /><span>Maintenance</span></NavLink>
          <NavLink to="/admin/applications" className={linkClass}><FiFileText /><span>Applications</span></NavLink>
          <NavLink to="/admin/transactions" className={linkClass}><FiCreditCard /><span>Transactions</span></NavLink>
          <NavLink to="/admin/reports" className={linkClass}><FiBarChart2 /><span>Reports</span></NavLink>
          <NavLink to="/admin/messages" className={linkClass}><FiMail /><span>Messages</span></NavLink>
          <NavLink to="/admin/users" className={linkClass}><FiUsers /><span>Manage Users</span></NavLink>
          <NavLink to="/admin/settings" className={linkClass}><FiSettings /><span>Settings</span></NavLink>
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg">
            <FiLogOut /><span>Logout</span>
          </button>
        </nav>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-white shadow-md h-screen sticky top-16">
      <nav className="p-4 space-y-1">
        <NavLink to="/dashboard" className={linkClass}><FiHome /><span>Dashboard</span></NavLink>
        <NavLink to="/properties" className={linkClass}><FiGrid /><span>My Properties</span></NavLink>
        <NavLink to="/maintenance" className={linkClass}><FiTool /><span>Maintenance</span></NavLink>
        <NavLink to="/browse" className={linkClass}><FiSearch /><span>Browse Properties</span></NavLink>
        <NavLink to="/applications" className={linkClass}><FiFileText /><span>My Applications</span></NavLink>
        <NavLink to="/payments" className={linkClass}><FiDollarSign /><span>Payments</span></NavLink>
        <NavLink to="/payments/history" className={linkClass}><FiClipboard /><span>Payment History</span></NavLink>
        <NavLink to="/messages" className={linkClass}><FiMail /><span>Messages</span></NavLink>
        <NavLink to="/profile" className={linkClass}><FiUser /><span>Profile</span></NavLink>
        <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg">
          <FiLogOut /><span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;