import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@hooks/useAuth';
import paymentService from '@services/paymentService';
import PaymentList from '@components/payments/PaymentList';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';

const UserPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fetchPayments = useCallback(async () => {
    try {
      const res = await paymentService.getPayments({ tenant: user._id });
      setPayments(res.data.data);
    } catch (err) {
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, [user._id]);
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchPayments} />;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Payments</h1>
      <PaymentList payments={payments} loading={loading} error={error} onRetry={fetchPayments} />
    </div>
  );
};

export default UserPayments;