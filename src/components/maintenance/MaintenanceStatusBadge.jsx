import React from 'react';
import Badge from '@components/ui/Badge';

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
  in_progress: { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
  completed: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
  cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
  rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' }
};

const MaintenanceStatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  return <Badge className={config.color}>{config.label}</Badge>;
};

export default MaintenanceStatusBadge;