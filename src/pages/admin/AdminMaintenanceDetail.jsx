import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import maintenanceService from '@services/maintenanceService';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';
import Select from '@components/common/Select';
import { formatDate } from '@utils/formatters';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminMaintenanceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadRequest = useCallback(async () => {
    try {
      const res = await maintenanceService.getRequest(id);
      setRequest(res.data.data);
    } catch (err) {
      setError('Failed to load maintenance request');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await maintenanceService.updateRequest(id, { status: newStatus });
      toast.success('Status updated');
      loadRequest();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadRequest} />;
  if (!request) return <div>Request not found</div>;

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    emergency: 'bg-red-100 text-red-800'
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/maintenance')} className="mr-4">
          <FiArrowLeft className="mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Maintenance Request Details</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="flex justify-between items-center">
            <div><p className="text-sm text-gray-500">Request ID</p><p className="font-mono text-sm">{request.requestId}</p></div>
            <div><Select value={request.status} onChange={(e) => handleStatusChange(e.target.value)} options={statusOptions} disabled={updating} className="w-40" /></div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">{request.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div><p className="text-sm text-gray-500">Priority</p><Badge className={priorityColors[request.priority]}>{request.priority}</Badge></div>
            <div><p className="text-sm text-gray-500">Category</p><p className="font-medium capitalize">{request.category}</p></div>
            <div><p className="text-sm text-gray-500">Created</p><p className="font-medium">{formatDate(request.createdAt)}</p></div>
            <div><p className="text-sm text-gray-500">Last Updated</p><p className="font-medium">{formatDate(request.updatedAt)}</p></div>
          </div>
          <div className="mb-6"><p className="text-sm text-gray-500 mb-2">Description</p><p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{request.description}</p></div>
          <div className="grid grid-cols-2 gap-6">
            <div><p className="text-sm text-gray-500 mb-2">Property</p><div className="bg-gray-50 p-3 rounded-lg"><p className="font-medium">{request.property?.title}</p><p className="text-sm text-gray-600">{request.property?.address?.street}, {request.property?.address?.city}</p></div></div>
            <div><p className="text-sm text-gray-500 mb-2">Tenant</p><div className="bg-gray-50 p-3 rounded-lg"><p className="font-medium">{request.tenant?.name}</p><p className="text-sm text-gray-600">{request.tenant?.email}</p></div></div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminMaintenanceDetail;