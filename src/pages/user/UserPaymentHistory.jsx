import React, { useState, useEffect } from 'react';
import paymentService from '@services/paymentService';
import PaymentHistory from '@components/payments/PaymentHistory';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';

const UserPaymentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await paymentService.getPaymentHistory();
        setHistory(res.data.data);
      } catch (err) {
        setError('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>
      <PaymentHistory payments={history} />
    </div>
  );
};

export default UserPaymentHistory;