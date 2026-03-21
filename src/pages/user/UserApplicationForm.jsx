import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import applicationService from '@services/applicationService';
import propertyService from '@services/propertyService';
import ApplicationForm from '@components/applications/ApplicationForm';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import Card from '@components/common/Card';
import { formatCurrency } from '@utils/formatters';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const UserApplicationForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const query = new URLSearchParams(location.search);
  const selectedUnitNumber = query.get('unit');
  const selectedUnitId = query.get('unitId');

  const [property, setProperty] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await propertyService.getProperty(id);
        setProperty(res.data.data);
        if (selectedUnitId) {
          const unit = res.data.data.units?.find(u => u._id === selectedUnitId);
          setSelectedUnit(unit);
        } else if (selectedUnitNumber) {
          const unit = res.data.data.units?.find(u => u.unitNumber === selectedUnitNumber);
          setSelectedUnit(unit);
        }
      } catch (err) {
        setError('Property not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, selectedUnitId, selectedUnitNumber]);

  const handleSubmit = async (formData) => {
    if (!selectedUnit) {
      toast.error('No unit selected. Please go back and select a unit.');
      navigate(`/property/${id}`);
      return;
    }
    setSubmitting(true);
    try {
      // check duplicate
      const existing = await applicationService.getApplications();
      const hasExisting = existing.data.data.some(app =>
        app.property === id &&
        (app.unit === selectedUnit._id || app.unitNumber === selectedUnit.unitNumber) &&
        ['pending', 'reviewing'].includes(app.status)
      );
      if (hasExisting) {
        toast.error('You already have a pending application for this unit');
        navigate('/applications');
        return;
      }
      await applicationService.createApplication({
        property: id,
        unit: selectedUnit._id,
        unitNumber: selectedUnit.unitNumber,
        applicant: user._id,
        personalInfo: {
          fullName: formData.personalInfo.fullName || user.name,
          email: formData.personalInfo.email || user.email,
          phone: formData.personalInfo.phone || user.phone,
          currentAddress: formData.personalInfo.currentAddress,
          employmentStatus: formData.personalInfo.employmentStatus,
          employer: formData.personalInfo.employer,
          monthlyIncome: formData.personalInfo.monthlyIncome
        },
        emergencyContact: {
          name: formData.emergencyContact.name,
          relationship: formData.emergencyContact.relationship,
          phone: formData.emergencyContact.phone
        }
      });
      toast.success('Application submitted successfully');
      navigate('/applications');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!property) return <div>Property not found</div>;
  if (!selectedUnit) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-4">No Unit Selected</h1>
        <p className="text-gray-600 mb-6">Please select a unit to apply for.</p>
        <button onClick={() => navigate(`/property/${id}`)} className="text-blue-600 hover:underline flex items-center justify-center">
          <FiArrowLeft className="mr-2" /> Back to Property
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate(`/property/${id}`)} className="text-blue-600 hover:underline flex items-center mb-4">
        <FiArrowLeft className="mr-2" /> Back to Property
      </button>
      <h1 className="text-2xl font-bold">Application for {property.title}</h1>
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-semibold text-lg">Selected Unit: {selectedUnit.unitNumber}</h2>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div><p className="text-sm text-gray-600">Bedrooms</p><p className="font-medium">{selectedUnit.bedrooms}</p></div>
              <div><p className="text-sm text-gray-600">Bathrooms</p><p className="font-medium">{selectedUnit.bathrooms}</p></div>
              <div><p className="text-sm text-gray-600">Area</p><p className="font-medium">{selectedUnit.area} m²</p></div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Monthly Rent</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(selectedUnit.price)}</p>
          </div>
        </div>
      </Card>
      <ApplicationForm onSubmit={handleSubmit} selectedUnit={selectedUnit} />
      {submitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 text-center"><LoadingSpinner /><p className="mt-4 text-gray-600">Submitting your application...</p></Card>
        </div>
      )}
    </div>
  );
};

export default UserApplicationForm;