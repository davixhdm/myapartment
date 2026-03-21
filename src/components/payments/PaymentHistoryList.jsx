import React from 'react';
import PaymentHistory from './PaymentHistory';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';

const PaymentHistoryList = ({ history, loading, error, onRetry }) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;
  if (history.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-gray-500">No payment history found.</p>
      </div>
    );
  }
  return <PaymentHistory payments={history} />;
};

export default PaymentHistoryList;