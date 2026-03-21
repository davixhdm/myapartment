import React from 'react';
import TenantCard from './TenantCard';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';

const TenantList = ({ tenants, loading, error, onRetry }) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;
  if (tenants.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-gray-500">No tenants found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tenants.map(tenant => (
        <TenantCard key={tenant._id} tenant={tenant} />
      ))}
    </div>
  );
};

export default TenantList;