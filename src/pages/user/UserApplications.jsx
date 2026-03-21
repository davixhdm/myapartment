import React, { useState, useEffect } from 'react';
import applicationService from '@services/applicationService';
import ApplicationList from '@components/applications/ApplicationList';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';

const UserApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await applicationService.getApplications();
        setApplications(res.data.data);
      } catch (err) {
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>
      <ApplicationList applications={applications} loading={loading} error={error} />
    </div>
  );
};

export default UserApplications;