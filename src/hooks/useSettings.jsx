import { useState, useEffect } from 'react';
import settingsService from '@services/settingsService';

export const useSettings = () => {
  const [settings, setSettings] = useState({
    companyName: 'MyApartment',
    paymentDueDay: 5,
    contactEmail: 'info@myapartment.com',
    contactPhone: '+254 700 123 456',
    address: '123 Main Street, Nairobi, Kenya',
    website: 'https://myapartment.com'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await settingsService.getPublicSettings();
      setSettings(prev => ({ ...prev, ...res.data.data }));
    } catch (err) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentDueDate = () => {
    const today = new Date();
    const dueDay = settings.paymentDueDay || 5;
    const dueDate = new Date(today.getFullYear(), today.getMonth(), dueDay);
    if (today > dueDate) {
      return new Date(today.getFullYear(), today.getMonth() + 1, dueDay);
    }
    return dueDate;
  };

  const getPaymentStatus = (balance) => {
    const dueDate = getPaymentDueDate();
    const today = new Date();
    if (balance <= 0) {
      return { status: 'paid', color: 'bg-green-100 text-green-800', label: 'Paid', icon: 'CheckCircle' };
    } else if (today > dueDate && balance > 0) {
      return { status: 'overdue', color: 'bg-red-100 text-red-800', label: 'Overdue', icon: 'AlertCircle' };
    } else {
      return { status: 'active', color: 'bg-yellow-100 text-yellow-800', label: 'Active', icon: 'Clock' };
    }
  };

  const formatDueDate = () => {
    const day = settings.paymentDueDay || 5;
    const suffix = getDaySuffix(day);
    return `${day}${suffix} of every month`;
  };

  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  return {
    settings,
    loading,
    error,
    getPaymentDueDate,
    getPaymentStatus,
    formatDueDate,
    refreshSettings
  };
};