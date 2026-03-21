import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import maintenanceService from '@services/maintenanceService';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';
import { formatDate } from '@utils/formatters';
import { FiArrowLeft, FiClock, FiAlertCircle, FiCheckCircle, FiTool } from 'react-icons/fi';

const UserMaintenanceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRequest = useCallback(async () => {
    try {
      const res = await maintenanceService.getRequest(id);
      setRequest(res.data.data);
    } catch (err) {
      setError('Failed to load request');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    emergency: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const priorityIcons = {
    low: <FiClock className="mr-1" />,
    medium: <FiClock className="mr-1" />,
    high: <FiAlertCircle className="mr-1" />,
    emergency: <FiAlertCircle className="mr-1" />
  };

  const statusIcons = {
    pending: <FiClock className="mr-1" />,
    approved: <FiCheckCircle className="mr-1" />,
    in_progress: <FiTool className="mr-1" />,
    completed: <FiCheckCircle className="mr-1" />,
    cancelled: <FiAlertCircle className="mr-1" />,
    rejected: <FiAlertCircle className="mr-1" />
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadRequest} />;
  if (!request) return <div>Request not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/maintenance')}>
          <FiArrowLeft className="mr-2" /> Back to Requests
        </Button>
        <h1 className="text-2xl font-bold">Maintenance Request Details</h1>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">{request.title}</h2>
              <p className="text-sm text-gray-500 mt-1">Request ID: {request.requestId}</p>
            </div>
            <div className="flex space-x-2">
              <Badge className={priorityColors[request.priority]}>
                {priorityIcons[request.priority]} {request.priority}
              </Badge>
              <Badge className={statusColors[request.status]}>
                {statusIcons[request.status]} {request.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{request.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium capitalize">{request.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Property</p>
              <p className="font-medium">{request.property?.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium">{formatDate(request.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium">{formatDate(request.updatedAt)}</p>
            </div>
          </div>

          {request.assignedTo && (
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500">Assigned To</p>
              <p className="font-medium">{request.assignedTo?.name}</p>
            </div>
          )}

          {request.comments && request.comments.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Comments</h3>
              <div className="space-y-2">
                {request.comments.map((comment, idx) => (
                  <div key={idx} className="bg-gray-50 p-2 rounded">
                    <p className="text-sm">{comment.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(comment.createdAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserMaintenanceDetail;