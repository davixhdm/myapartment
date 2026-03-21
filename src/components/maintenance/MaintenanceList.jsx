import React from 'react';
import MaintenanceRequestCard from './MaintenanceRequestCard';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';

const MaintenanceList = ({ requests, loading, error, onRetry }) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;
  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-gray-500">No maintenance requests found.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {requests.map(req => <MaintenanceRequestCard key={req._id} request={req} />)}
    </div>
  );
};

export default MaintenanceList;