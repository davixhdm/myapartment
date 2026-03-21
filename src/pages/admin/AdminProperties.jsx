import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import propertyService from '@services/propertyService';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import Button from '@components/common/Button';
import Badge from '@components/ui/Badge';
import { FiPlus, FiEye, FiEdit } from 'react-icons/fi';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await propertyService.getProperties();
      setProperties(res.data.data);
    } catch (err) {
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProperties} />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Properties</h1>
        <Link to="/admin/properties/new">
          <Button variant="primary">
            <FiPlus className="mr-2" /> Add Property
          </Button>
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(p => {
              const avail = p.units?.filter(u => u.status === 'available').length || 0;
              return (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><div className="font-medium text-gray-900">{p.title}</div></td>
                  <td className="px-6 py-4 font-mono text-sm">{p.propertyCode}</td>
                  <td className="px-6 py-4 text-sm">{p.address?.city}</td>
                  <td className="px-6 py-4 text-sm"><span className="text-green-600">{avail}</span><span className="text-gray-500">/{p.numberOfUnits}</span></td>
                  <td className="px-6 py-4"><Badge className={p.status === 'available' ? 'bg-green-100 text-green-800' : p.status === 'occupied' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>{p.status}</Badge></td>
                  <td className="px-6 py-4 space-x-2">
                    <Link to={`/admin/properties/${p._id}`}><Button variant="outline" size="sm"><FiEye className="mr-1" /> View</Button></Link>
                    <Link to={`/admin/properties/edit/${p._id}`}><Button variant="outline" size="sm"><FiEdit className="mr-1" /> Edit</Button></Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProperties;