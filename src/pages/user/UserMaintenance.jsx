import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import maintenanceService from '@services/maintenanceService';
import MaintenanceList from '@components/maintenance/MaintenanceList';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';

const UserMaintenance = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await maintenanceService.getRequests({ tenant: user._id });
      setRequests(res.data.data);
    } catch (err) {
      setError('Failed to load maintenance requests');
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const refreshData = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={refreshData} />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Maintenance Requests</h1>
        <div className="flex space-x-2">
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <Link to="/maintenance/new">
            <Button variant="primary">
              <FiPlus className="mr-2" /> New Request
            </Button>
          </Link>
        </div>
      </div>

      {requests.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500 text-lg">No maintenance requests found.</p>
          <p className="text-gray-400 mt-2">Submit a request if you need maintenance for your property.</p>
          <Link to="/maintenance/new">
            <button className="mt-4 text-blue-600 hover:underline">Create New Request →</button>
          </Link>
        </Card>
      ) : (
        <MaintenanceList 
          requests={requests} 
          loading={loading} 
          error={error} 
          onRetry={refreshData}
        />
      )}
    </div>
  );
};

export default UserMaintenance;