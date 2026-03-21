import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import propertyService from '@services/propertyService';
import maintenanceService from '@services/maintenanceService';
import MaintenanceForm from '@components/maintenance/MaintenanceForm';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import Card from '@components/common/Card';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const UserMaintenanceForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMyProperties = useCallback(async () => {
    try {
      const res = await propertyService.getProperties({ currentTenant: user._id });
      const assignedProperties = res.data.data.filter(property => {
        return property.units?.some(unit => 
          unit.status === 'occupied' && unit.currentTenant?._id === user._id
        );
      });
      setProperties(assignedProperties);
    } catch (err) {
      setError('Failed to load your properties');
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    fetchMyProperties();
  }, [fetchMyProperties]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await maintenanceService.createRequest(data);
      toast.success('Maintenance request created successfully');
      navigate('/maintenance');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchMyProperties} />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/maintenance')}>
          <FiArrowLeft className="mr-2" /> Back to Requests
        </Button>
        <h1 className="text-2xl font-bold">New Maintenance Request</h1>
      </div>

      {properties.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500 text-lg">You don't have any properties assigned.</p>
          <p className="text-gray-400 mt-2">You can only submit maintenance requests for properties you're assigned to.</p>
          <Link to="/browse">
            <button className="mt-4 text-blue-600 hover:underline">Browse Properties →</button>
          </Link>
        </Card>
      ) : (
        <MaintenanceForm onSubmit={handleSubmit} properties={properties} />
      )}

      {submitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Submitting your request...</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserMaintenanceForm;