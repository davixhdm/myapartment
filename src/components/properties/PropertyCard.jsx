import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiHome, FiUsers } from 'react-icons/fi';
import { formatCurrency } from '@utils/formatters';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';
import PropertyImage from '@components/ui/PropertyImage';

const PropertyCard = ({ property }) => {
  const {
    _id,
    title,
    propertyCode,
    address,
    basePrice,
    type,
    images,
    status,
    numberOfUnits,
    units
  } = property;

  const statusColors = {
    available: 'bg-green-100 text-green-800',
    occupied: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    unavailable: 'bg-red-100 text-red-800'
  };

  const availableCount = units?.filter(u => u.status === 'available').length || 0;
  const occupiedCount = units?.filter(u => u.status === 'occupied').length || 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition">
      <Link to={`/property/${_id}`}>
        <div className="relative h-48">
          <PropertyImage src={images?.[0]?.url} alt={title} className="w-full h-full object-cover" />
          <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
            {status}
          </span>
          {propertyCode && (
            <span className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              {propertyCode}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-2 flex items-center">
            <FiMapPin className="mr-1 flex-shrink-0" /> 
            <span className="truncate">{address?.street}, {address?.city}</span>
          </p>
          <p className="text-2xl font-bold text-blue-600 mb-3">{formatCurrency(basePrice)}</p>
          
          <div className="flex justify-between text-gray-600 text-sm mb-2">
            <span className="flex items-center"><FiHome className="mr-1" /> {type}</span>
            <span className="flex items-center"><FiUsers className="mr-1" /> {occupiedCount}/{numberOfUnits}</span>
          </div>

          {availableCount > 0 ? (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-green-600">{availableCount} available</span>
                <span className="text-gray-500">{occupiedCount} occupied</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(availableCount / numberOfUnits) * 100}%` }}></div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-red-500 mt-2">Fully occupied</p>
          )}
        </div>
      </Link>
    </Card>
  );
};

export default PropertyCard;