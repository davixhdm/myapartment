import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import PrivateRoute from '@components/common/PrivateRoute';
import AdminPrivateRoute from '@components/common/AdminPrivateRoute';
import Header from '@components/common/Header';
import Sidebar from '@components/common/Sidebar';
import { Toaster } from 'react-hot-toast';

// Public Pages
import LandingPage from '@pages/LandingPage';
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import AdminLoginPage from '@pages/AdminLoginPage';
import PublicPropertyPage from '@pages/PublicPropertyPage';

// User Pages
import UserDashboard from '@pages/user/UserDashboard';
import UserProperties from '@pages/user/UserProperties';
import UserMaintenance from '@pages/user/UserMaintenance';
import UserMaintenanceForm from '@pages/user/UserMaintenanceForm';
import UserMaintenanceDetail from '@pages/user/UserMaintenanceDetail';
import UserBrowseProperties from '@pages/user/UserBrowseProperties';
import UserApplications from '@pages/user/UserApplications';
import UserApplicationForm from '@pages/user/UserApplicationForm';
import UserMessages from '@pages/user/UserMessages';
import UserProfile from '@pages/user/UserProfile';
import UserPayments from '@pages/user/UserPayments';
import UserPaymentHistory from '@pages/user/UserPaymentHistory';

// Admin Pages
import AdminDashboard from '@pages/admin/AdminDashboard';
import AdminProperties from '@pages/admin/AdminProperties';
import AdminPropertyForm from '@pages/admin/AdminPropertyForm';
import AdminPropertyDetail from '@pages/admin/AdminPropertyDetail';
import AdminMaintenance from '@pages/admin/AdminMaintenance';
import AdminMaintenanceDetail from '@pages/admin/AdminMaintenanceDetail';
import AdminTenants from '@pages/admin/AdminTenants';
import AdminTenantDetail from '@pages/admin/AdminTenantDetail';
import AdminApplications from '@pages/admin/AdminApplications';
import AdminApplicationDetail from '@pages/admin/AdminApplicationDetail';
import AdminTransactions from '@pages/admin/AdminTransactions';
import AdminTransactionForm from '@pages/admin/AdminTransactionForm';
import AdminTransactionDetail from '@pages/admin/AdminTransactionDetail';
import AdminReports from '@pages/admin/AdminReports';
import AdminMessages from '@pages/admin/AdminMessages';
import AdminUsers from '@pages/admin/AdminUsers';
import AdminSettings from '@pages/admin/AdminSettings';

import './App.css';

function App() {
  const { loadUser, isAuthenticated, loading, user } = useAuth();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MyApartment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Header />
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 p-6 ${!isAuthenticated ? 'max-w-7xl mx-auto w-full' : ''}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/property/:id" element={<PublicPropertyPage />} />

            {/* User Routes */}
            <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
            <Route path="/properties" element={<PrivateRoute><UserProperties /></PrivateRoute>} />
            <Route path="/maintenance" element={<PrivateRoute><UserMaintenance /></PrivateRoute>} />
            <Route path="/maintenance/new" element={<PrivateRoute><UserMaintenanceForm /></PrivateRoute>} />
            <Route path="/maintenance/:id" element={<PrivateRoute><UserMaintenanceDetail /></PrivateRoute>} />
            <Route path="/browse" element={<PrivateRoute><UserBrowseProperties /></PrivateRoute>} />
            <Route path="/apply/:id" element={<PrivateRoute><UserApplicationForm /></PrivateRoute>} />
            <Route path="/applications" element={<PrivateRoute><UserApplications /></PrivateRoute>} />
            <Route path="/applications/:id" element={<PrivateRoute><UserApplications /></PrivateRoute>} />
            <Route path="/messages" element={<PrivateRoute><UserMessages /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route path="/payments" element={<PrivateRoute><UserPayments /></PrivateRoute>} />
            <Route path="/payments/history" element={<PrivateRoute><UserPaymentHistory /></PrivateRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute>} />
            <Route path="/admin/properties" element={<AdminPrivateRoute><AdminProperties /></AdminPrivateRoute>} />
            <Route path="/admin/properties/new" element={<AdminPrivateRoute><AdminPropertyForm /></AdminPrivateRoute>} />
            <Route path="/admin/properties/edit/:id" element={<AdminPrivateRoute><AdminPropertyForm /></AdminPrivateRoute>} />
            <Route path="/admin/properties/:id" element={<AdminPrivateRoute><AdminPropertyDetail /></AdminPrivateRoute>} />
            <Route path="/admin/maintenance" element={<AdminPrivateRoute><AdminMaintenance /></AdminPrivateRoute>} />
            <Route path="/admin/maintenance/:id" element={<AdminPrivateRoute><AdminMaintenanceDetail /></AdminPrivateRoute>} />
            <Route path="/admin/tenants" element={<AdminPrivateRoute><AdminTenants /></AdminPrivateRoute>} />
            <Route path="/admin/tenants/:id" element={<AdminPrivateRoute><AdminTenantDetail /></AdminPrivateRoute>} />
            <Route path="/admin/applications" element={<AdminPrivateRoute><AdminApplications /></AdminPrivateRoute>} />
            <Route path="/admin/applications/:id" element={<AdminPrivateRoute><AdminApplicationDetail /></AdminPrivateRoute>} />
            <Route path="/admin/transactions" element={<AdminPrivateRoute><AdminTransactions /></AdminPrivateRoute>} />
            <Route path="/admin/transactions/new" element={<AdminPrivateRoute><AdminTransactionForm /></AdminPrivateRoute>} />
            <Route path="/admin/transactions/edit/:id" element={<AdminPrivateRoute><AdminTransactionForm /></AdminPrivateRoute>} />
            <Route path="/admin/transactions/:id" element={<AdminPrivateRoute><AdminTransactionDetail /></AdminPrivateRoute>} />
            <Route path="/admin/reports" element={<AdminPrivateRoute><AdminReports /></AdminPrivateRoute>} />
            <Route path="/admin/messages" element={<AdminPrivateRoute><AdminMessages /></AdminPrivateRoute>} />
            <Route path="/admin/users" element={<AdminPrivateRoute><AdminUsers /></AdminPrivateRoute>} />
            <Route path="/admin/settings" element={<AdminPrivateRoute><AdminSettings /></AdminPrivateRoute>} />

            {/* Redirect root to appropriate dashboard if authenticated */}
            <Route path="/" element={
              isAuthenticated ? (
                user?.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/dashboard" />
              ) : (
                <LandingPage />
              )
            } />

            {/* 404 Route */}
            <Route path="*" element={
              <div className="text-center py-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page not found</p>
                <a 
                  href={isAuthenticated && user?.role === 'admin' ? '/admin/dashboard' : '/'} 
                  className="text-blue-600 hover:underline"
                >
                  Go back home
                </a>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;