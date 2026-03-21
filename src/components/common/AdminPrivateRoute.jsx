import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const AdminPrivateRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  
  if (!isAuthenticated) return <Navigate to="/admin/login" />;
  
  if (user?.role !== 'admin') return <Navigate to="/dashboard" />;

  return children;
};

export default AdminPrivateRoute;