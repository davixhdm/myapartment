import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import propertyService from '@services/propertyService';
import PropertyForm from '@components/properties/PropertyForm';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import toast from 'react-hot-toast';

const AdminPropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');

  const loadProperty = useCallback(async () => {
    try {
      const res = await propertyService.getProperty(id);
      setInitialData(res.data.data);
    } catch (err) {
      setError('Failed to load property');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) loadProperty();
  }, [id, loadProperty]);

  const handleSubmit = async (data) => {
    try {
      if (id) {
        await propertyService.updateProperty(id, data);
        toast.success('Property updated');
      } else {
        await propertyService.createProperty(data);
        toast.success('Property created');
      }
      navigate('/admin/properties');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{id ? 'Edit Property' : 'Add New Property'}</h1>
      <PropertyForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
};

export default AdminPropertyForm;