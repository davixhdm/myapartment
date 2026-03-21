import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { publicApi } from '@services/api';
import PropertyGallery from '@components/properties/PropertyGallery';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import Button from '@components/common/Button';
import Badge from '@components/ui/Badge';
import { FiMapPin, FiHome, FiUser, FiMaximize, FiGrid, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { formatCurrency } from '@utils/formatters';
import toast from 'react-hot-toast';

const PublicPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await publicApi.get(`/properties/${id}`);
        setProperty(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
    toast.success(`Selected unit ${unit.unitNumber}`);
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply for a unit');
      navigate('/login');
      return;
    }
    if (!selectedUnit) {
      toast.error('Please select a unit to apply for');
      return;
    }
    setApplying(true);
    navigate(`/apply/${id}?unit=${selectedUnit.unitNumber}&unitId=${selectedUnit._id}`);
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} />;
  if (!property) return <div className="text-center py-12">Property not found</div>;

  const availableUnits = property.units?.filter(u => u.status === 'available') || [];
  const occupiedUnits = property.units?.filter(u => u.status === 'occupied') || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <PropertyGallery images={property.images} />
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold">{property.title}</h1>
                {property.propertyCode && <Badge className="bg-gray-200 text-gray-800">{property.propertyCode}</Badge>}
              </div>
              <p className="text-gray-600 flex items-center mt-2"><FiMapPin className="mr-1" /> {property.address?.street}, {property.address?.city}</p>
            </div>
            <Badge className={
              property.status === 'available' ? 'bg-green-100 text-green-800' :
              property.status === 'occupied' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
            }>{property.status}</Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div><p className="text-sm text-gray-500">Base Price</p><p className="text-xl font-bold text-blue-600">{formatCurrency(property.basePrice)}</p></div>
            <div><p className="text-sm text-gray-500">Property Type</p><p className="font-medium capitalize">{property.type}</p></div>
            <div><p className="text-sm text-gray-500">Total Units</p><p className="font-medium">{property.numberOfUnits}</p></div>
            <div><p className="text-sm text-gray-500">Available Units</p><p className="font-medium text-green-600">{availableUnits.length}</p></div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center"><FiGrid className="mr-2" /> Available Units ({availableUnits.length})</h2>
            {availableUnits.length === 0 ? (
              <div className="bg-yellow-50 p-6 rounded-lg text-center"><FiHome className="mx-auto text-yellow-500 text-4xl mb-3" /><p className="text-yellow-700 font-medium">No units currently available</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableUnits.map(unit => (
                  <div key={unit._id} onClick={() => handleUnitClick(unit)} className={`cursor-pointer transition-all duration-200 border-2 rounded-lg p-4 ${selectedUnit?._id === unit._id ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'}`}>
                    <div className="relative">
                      {selectedUnit?._id === unit._id && <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full"><FiCheck size={16} /></div>}
                      <div className="flex justify-between items-start mb-2">
                        <div><h3 className="font-bold text-lg">{unit.unitNumber}</h3><Badge className="bg-green-100 text-green-800 mt-1">Available</Badge></div>
                        <p className="text-xl font-bold text-blue-600">{formatCurrency(unit.price)}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 my-3 text-sm text-gray-600">
                        <div className="text-center p-2 bg-gray-50 rounded"><FiHome className="mx-auto mb-1" /><span>{unit.bedrooms} bed</span></div>
                        <div className="text-center p-2 bg-gray-50 rounded"><FiUser className="mx-auto mb-1" /><span>{unit.bathrooms} bath</span></div>
                        <div className="text-center p-2 bg-gray-50 rounded"><FiMaximize className="mx-auto mb-1" /><span>{unit.area} m²</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedUnit && (
            <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-between">
              <div className="flex items-center"><FiCheck className="text-blue-600 mr-2" size={20} /><span className="font-medium">Selected: Unit {selectedUnit.unitNumber}</span></div>
              <button onClick={() => setSelectedUnit(null)} className="text-blue-600 hover:text-blue-800"><FiX size={20} /></button>
            </div>
          )}

          {occupiedUnits.length > 0 && (
            <details className="bg-gray-50 rounded-lg p-4 mb-8">
              <summary className="font-medium cursor-pointer flex items-center"><FiUser className="mr-2" /> Occupied Units ({occupiedUnits.length})</summary>
              <div className="mt-4 space-y-2">
                {occupiedUnits.map(unit => (
                  <div key={unit._id} className="flex justify-between items-center p-3 bg-white rounded border">
                    <div><span className="font-mono font-medium">{unit.unitNumber}</span><p className="text-xs text-gray-500 mt-1">{unit.bedrooms} bed • {unit.bathrooms} bath • {unit.area} m²</p></div>
                    <Badge className="bg-gray-200 text-gray-600">Occupied</Badge>
                  </div>
                ))}
              </div>
            </details>
          )}

          <div className="mb-8"><h3 className="text-lg font-semibold mb-3">Description</h3><p className="text-gray-700 leading-relaxed">{property.description}</p></div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div><h3 className="text-lg font-semibold mb-3">Property Details</h3><dl className="space-y-2">
              <div className="flex justify-between border-b pb-1"><dt className="text-gray-600">Property Code:</dt><dd className="font-medium">{property.propertyCode}</dd></div>
              <div className="flex justify-between border-b pb-1"><dt className="text-gray-600">Type:</dt><dd className="font-medium capitalize">{property.type}</dd></div>
              <div className="flex justify-between border-b pb-1"><dt className="text-gray-600">Total Units:</dt><dd className="font-medium">{property.numberOfUnits}</dd></div>
              <div className="flex justify-between border-b pb-1"><dt className="text-gray-600">Available Units:</dt><dd className="font-medium text-green-600">{availableUnits.length}</dd></div>
              <div className="flex justify-between border-b pb-1"><dt className="text-gray-600">Occupied Units:</dt><dd className="font-medium text-blue-600">{occupiedUnits.length}</dd></div>
            </dl></div>
            {property.amenities?.length > 0 && <div><h3 className="text-lg font-semibold mb-3">Amenities</h3><div className="flex flex-wrap gap-2">{property.amenities.map(amenity => <Badge key={amenity} className="bg-gray-100 text-gray-800 capitalize">{amenity}</Badge>)}</div></div>}
          </div>

          {availableUnits.length > 0 && (
            <div className="border-t pt-6 flex justify-between items-center">
              <div>{selectedUnit ? <div className="flex items-center text-green-600"><FiCheck className="mr-2" size={20} /><span>Selected: Unit {selectedUnit.unitNumber} - {formatCurrency(selectedUnit.price)}/month</span></div> : <div className="flex items-center text-gray-500"><FiAlertCircle className="mr-2" size={20} /><span>Please select a unit to apply</span></div>}</div>
              <Button variant="primary" size="lg" onClick={handleApply} disabled={!selectedUnit || applying} className="min-w-[200px]">{applying ? 'Redirecting...' : 'Apply for Selected Unit'}</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicPropertyPage;