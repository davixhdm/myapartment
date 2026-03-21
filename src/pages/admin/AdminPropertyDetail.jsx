import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import propertyService from '@services/propertyService';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';
import Avatar from '@components/ui/Avatar';
import { FiEdit, FiTrash2, FiMapPin, FiLayers, FiUser, FiX, FiCheck, FiArrowLeft } from 'react-icons/fi';
import { formatCurrency } from '@utils/formatters';
import toast from 'react-hot-toast';

const AdminPropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [vacatingUnit, setVacatingUnit] = useState(null);

  const loadProperty = useCallback(async () => {
    try {
      const res = await propertyService.getProperty(id);
      setProperty(res.data.data);
    } catch (err) {
      setError('Failed to load property');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProperty();
  }, [loadProperty]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await propertyService.deleteProperty(id);
      toast.success('Property deleted');
      navigate('/admin/properties');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleVacateUnit = async (unitId) => {
    if (!window.confirm('Vacate this unit?')) return;
    setVacatingUnit(unitId);
    try {
      await propertyService.updateUnitStatus(id, unitId, { status: 'available', tenantId: null });
      toast.success('Unit vacated');
      loadProperty();
    } catch (err) {
      toast.error('Failed to vacate unit');
    } finally {
      setVacatingUnit(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadProperty} />;
  if (!property) return <div>Property not found</div>;

  const availableUnits = property.units?.filter(u => u.status === 'available') || [];
  const occupiedUnits = property.units?.filter(u => u.status === 'occupied') || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/properties')}><FiArrowLeft className="mr-2" /> Back</Button>
          <h1 className="text-2xl font-bold">Property Details</h1>
        </div>
        <div className="flex space-x-2">
          <Link to={`/admin/properties/edit/${property._id}`}><Button variant="primary"><FiEdit className="mr-2" /> Edit</Button></Link>
          <Button variant="danger" onClick={handleDelete}><FiTrash2 className="mr-2" /> Delete</Button>
        </div>
      </div>

      <Card>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">{property.images?.length > 0 ? <img src={property.images[0].url} alt={property.title} className="w-full h-48 object-cover rounded-lg" /> : <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center"><span className="text-gray-400">No image</span></div>}</div>
          <div className="md:col-span-2">
            <div className="flex items-start justify-between">
              <div><h2 className="text-xl font-bold">{property.title}</h2><p className="text-gray-600 flex items-center mt-1"><FiMapPin className="mr-1" /> {property.address?.street}, {property.address?.city}</p></div>
              <Badge className={property.status === 'available' ? 'bg-green-100 text-green-800' : property.status === 'occupied' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>{property.status}</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div><p className="text-sm text-gray-500">Property Code</p><p className="font-mono font-medium">{property.propertyCode}</p></div>
              <div><p className="text-sm text-gray-500">Base Price</p><p className="font-bold text-blue-600">{formatCurrency(property.basePrice)}</p></div>
              <div><p className="text-sm text-gray-500">Total Units</p><p className="font-medium">{property.numberOfUnits}</p></div>
              <div><p className="text-sm text-gray-500">Available Units</p><p className="font-medium text-green-600">{availableUnits.length}</p></div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-4 flex items-center"><FiLayers className="mr-2" /> Units Management</h2>
        <div className="grid grid-cols-3 gap-4 mb-6"><div className="bg-green-50 p-3 rounded-lg text-center"><p className="text-2xl font-bold text-green-600">{availableUnits.length}</p><p className="text-sm text-gray-600">Available</p></div><div className="bg-blue-50 p-3 rounded-lg text-center"><p className="text-2xl font-bold text-blue-600">{occupiedUnits.length}</p><p className="text-sm text-gray-600">Occupied</p></div><div className="bg-gray-50 p-3 rounded-lg text-center"><p className="text-2xl font-bold text-gray-600">{property.numberOfUnits}</p><p className="text-sm text-gray-600">Total</p></div></div>
        <div className="space-y-4"><h3 className="font-medium">All Units</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{property.units?.map(unit => (<div key={unit._id} className={`border rounded-lg p-4 ${unit.status === 'available' ? 'border-green-200 bg-green-50' : unit.status === 'occupied' ? 'border-blue-200 bg-blue-50' : 'border-yellow-200 bg-yellow-50'}`}><div className="flex justify-between items-start mb-2"><div><span className="font-mono font-bold">{unit.unitNumber}</span><Badge className={`ml-2 ${unit.status === 'available' ? 'bg-green-200 text-green-800' : unit.status === 'occupied' ? 'bg-blue-200 text-blue-800' : 'bg-yellow-200 text-yellow-800'}`}>{unit.status}</Badge></div><span className="font-bold text-blue-600">{formatCurrency(unit.price)}</span></div><div className="text-sm text-gray-600 mb-3"><span>{unit.bedrooms} bed • {unit.bathrooms} bath • {unit.area} m²</span></div>{unit.status === 'occupied' && unit.currentTenant ? (<div className="bg-white p-3 rounded-lg mb-3"><div className="flex items-center"><Avatar name={unit.currentTenant.name} size="sm" className="mr-2" /><div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{unit.currentTenant.name}</p><p className="text-xs text-gray-500 truncate">{unit.currentTenant.email}</p></div></div></div>) : (<div className="bg-white p-3 rounded-lg mb-3 flex items-center text-gray-500"><FiUser className="mr-2" /><span className="text-sm">No tenant assigned</span></div>)}{unit.status === 'occupied' && (<Button variant="outline" size="sm" className="w-full" onClick={() => handleVacateUnit(unit._id)} disabled={vacatingUnit === unit._id}>{vacatingUnit === unit._id ? 'Vacating...' : <><FiX className="mr-2" /> Vacate Unit</>}</Button>)}{unit.status === 'available' && (<div className="flex items-center text-green-600 text-sm"><FiCheck className="mr-1" /> Ready for new tenant</div>)}</div>))}</div></div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card><h3 className="text-lg font-semibold mb-3">Description</h3><p className="text-gray-700">{property.description}</p></Card>
        <Card><h3 className="text-lg font-semibold mb-3">Property Details</h3><dl className="space-y-2"><div className="flex justify-between"><dt className="text-gray-600">Type:</dt><dd className="font-medium capitalize">{property.type}</dd></div><div className="flex justify-between"><dt className="text-gray-600">Landlord:</dt><dd className="font-medium">{property.landlord?.name}</dd></div><div className="flex justify-between"><dt className="text-gray-600">Created:</dt><dd className="font-medium">{new Date(property.createdAt).toLocaleDateString()}</dd></div><div className="flex justify-between"><dt className="text-gray-600">Last Updated:</dt><dd className="font-medium">{new Date(property.updatedAt).toLocaleDateString()}</dd></div></dl></Card>
      </div>

      {property.amenities?.length > 0 && (<Card><h3 className="text-lg font-semibold mb-3">Amenities</h3><div className="flex flex-wrap gap-2">{property.amenities.map(amenity => <Badge key={amenity} className="bg-gray-100 text-gray-800 capitalize">{amenity}</Badge>)}</div></Card>)}
    </div>
  );
};

export default AdminPropertyDetail;