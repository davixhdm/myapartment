import React from 'react';
import Card from '@components/common/Card';
import Avatar from '@components/ui/Avatar';
import { FiMail, FiPhone, FiMapPin, FiCalendar } from 'react-icons/fi';
import { formatDate } from '@utils/formatters';

const TenantDetails = ({ tenant }) => {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center space-x-6">
          <Avatar src={tenant.profileImage} name={tenant.name} size="xl" />
          <div>
            <h2 className="text-2xl font-bold">{tenant.name}</h2>
            <p className="text-gray-600">Member since {formatDate(tenant.createdAt)}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="space-y-2">
          <div className="flex items-center"><FiMail className="mr-2 text-gray-500" /> {tenant.email}</div>
          {tenant.phone && <div className="flex items-center"><FiPhone className="mr-2 text-gray-500" /> {tenant.phone}</div>}
        </div>
      </Card>

      {tenant.properties && tenant.properties.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Rented Properties</h3>
          <ul className="space-y-2">
            {tenant.properties.map(prop => (
              <li key={prop._id} className="border-b pb-2 last:border-0">
                <p className="font-medium">{prop.title}</p>
                <p className="text-sm text-gray-600">{prop.address?.street}, {prop.address?.city}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default TenantDetails;