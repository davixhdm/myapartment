import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@components/common/Card';
import Avatar from '@components/ui/Avatar';
import { FiMail, FiPhone } from 'react-icons/fi';

const TenantCard = ({ tenant }) => {
  return (
    <Card className="hover:shadow-md transition">
      <Link to={`/tenants/${tenant._id}`}>
        <div className="flex items-center space-x-4">
          <Avatar src={tenant.profileImage} name={tenant.name} size="lg" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{tenant.name}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <FiMail className="mr-1" /> {tenant.email}
            </div>
            {tenant.phone && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <FiPhone className="mr-1" /> {tenant.phone}
              </div>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default TenantCard;