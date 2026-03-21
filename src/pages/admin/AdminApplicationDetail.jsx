import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import applicationService from '@services/applicationService';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';
import { formatDate } from '@utils/formatters';
import { FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadApplication = useCallback(async () => {
    try {
      const res = await applicationService.getApplication(id);
      setApplication(res.data.data);
    } catch (err) {
      setError('Failed to load application');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadApplication();
  }, [loadApplication]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await applicationService.updateApplicationStatus(id, newStatus);
      toast.success(`Application ${newStatus}`);
      loadApplication();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadApplication} />;
  if (!application) return <div>Application not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/applications')} className="mr-4">
          <FiArrowLeft className="mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Application Details</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Application ID</p>
              <p className="font-mono text-sm">{application.applicationId}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={
                application.status === 'approved' ? 'bg-green-100 text-green-800' :
                application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                application.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }>
                {application.status}
              </Badge>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-500">Full Name</p><p className="font-medium">{application.personalInfo?.fullName}</p></div>
            <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{application.personalInfo?.email}</p></div>
            <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{application.personalInfo?.phone}</p></div>
            <div><p className="text-sm text-gray-500">Current Address</p><p className="font-medium">{application.personalInfo?.currentAddress}</p></div>
            <div><p className="text-sm text-gray-500">Employment Status</p><p className="font-medium capitalize">{application.personalInfo?.employmentStatus}</p></div>
            {application.personalInfo?.employer && (
              <div><p className="text-sm text-gray-500">Employer</p><p className="font-medium">{application.personalInfo?.employer}</p></div>
            )}
            <div><p className="text-sm text-gray-500">Monthly Income</p><p className="font-medium">KES {application.personalInfo?.monthlyIncome?.toLocaleString()}</p></div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Property & Unit</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Property</p>
              <p className="font-medium">{application.property?.title}</p>
              <p className="text-sm text-gray-500">{application.property?.address?.street}, {application.property?.address?.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Unit</p>
              <p className="font-medium font-mono">{application.unitNumber}</p>
              {application.unitDetails && (
                <p className="text-sm text-gray-500">{application.unitDetails.bedrooms} bed • {application.unitDetails.bathrooms} bath • {application.unitDetails.area} m²</p>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-500">Name</p><p className="font-medium">{application.emergencyContact?.name}</p></div>
            <div><p className="text-sm text-gray-500">Relationship</p><p className="font-medium">{application.emergencyContact?.relationship}</p></div>
            <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{application.emergencyContact?.phone}</p></div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Application Timeline</h2>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-gray-500">Submitted</span><span className="font-medium">{formatDate(application.createdAt)}</span></div>
            {application.reviewDate && (
              <div className="flex justify-between"><span className="text-gray-500">Reviewed</span><span className="font-medium">{formatDate(application.reviewDate)}</span></div>
            )}
          </div>
        </Card>

        <div className="flex justify-end space-x-3">
          <Button variant="success" onClick={() => handleStatusChange('approved')} disabled={updating || application.status === 'approved'}>
            <FiCheck className="mr-2" /> Approve
          </Button>
          <Button variant="danger" onClick={() => handleStatusChange('rejected')} disabled={updating || application.status === 'rejected'}>
            <FiX className="mr-2" /> Reject
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminApplicationDetail;