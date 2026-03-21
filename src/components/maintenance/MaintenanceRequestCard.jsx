import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';
import { formatDate } from '@utils/formatters';

const MaintenanceRequestCard = ({ request }) => {
  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    emergency: 'bg-red-100 text-red-800'
  };
  const statusColors = {
    pending: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    rejected: 'bg-red-100 text-red-800'
  };
  return (
    <Card className="hover:shadow-md transition">
      <Link to={`/maintenance/${request._id}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{request.title}</h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{request.description}</p>
          </div>
          <Badge className={priorityColors[request.priority]}>{request.priority}</Badge>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <Badge className={statusColors[request.status]}>{request.status.replace('_', ' ')}</Badge>
          <span className="text-gray-500">{formatDate(request.createdAt)}</span>
        </div>
        <div className="mt-2 text-sm text-gray-600">Property: {request.property?.title || 'N/A'}</div>
      </Link>
    </Card>
  );
};

export default MaintenanceRequestCard;