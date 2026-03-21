import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import authService from '@services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const loadUserCalled = useRef(false);

  const loadUser = useCallback(async () => {
    if (loadUserCalled.current) return;
    try {
      loadUserCalled.current = true;
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setIsAuthenticated(false);
        setUser(null);
        return;
      }
      const res = await authService.getMe();
      setUser(res.data.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Load user error:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
      loadUserCalled.current = false;
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      toast.success('Registration successful');
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      toast.success('Login successful');
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      throw error;
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const res = await authService.adminLogin(email, password);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      toast.success('Admin login successful');
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Admin login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out');
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      register,
      login,
      adminLogin,
      logout,
      loadUser,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};