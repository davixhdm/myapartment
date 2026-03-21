import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';
import { formatDate } from '@utils/formatters';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800'
};

const ApplicationCard = ({ application }) => {
  return (
    <Card className="hover:shadow-md transition">
      <Link to={`/applications/${application._id}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{application.property?.title}</h3>
            <p className="text-sm text-gray-600">{application.property?.address?.street}</p>
          </div>
          <Badge className={statusColors[application.status]}>
            {application.status}
          </Badge>
        </div>
        <div className="mt-3 text-sm">
          <p>Applied: {formatDate(application.createdAt)}</p>
          {application.reviewDate && (
            <p>Reviewed: {formatDate(application.reviewDate)}</p>
          )}
        </div>
      </Link>
    </Card>
  );
};

export default ApplicationCard;