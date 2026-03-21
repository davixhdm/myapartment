import React from 'react';
import ApplicationCard from './ApplicationCard';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';

const ApplicationList = ({ applications, loading, error, onRetry }) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;
  if (applications.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-gray-500">No applications found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {applications.map(application => (
        <ApplicationCard key={application._id} application={application} />
      ))}
    </div>
  );
};

export default ApplicationList;