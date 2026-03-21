import React from 'react';
import Badge from '@components/ui/Badge';

const statusMap = {
  pending: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
  reviewing: { label: 'Under Review', color: 'bg-blue-100 text-blue-800' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
  withdrawn: { label: 'Withdrawn', color: 'bg-gray-100 text-gray-800' }
};

const ApplicationStatus = ({ status }) => {
  const config = statusMap[status] || statusMap.pending;
  return <Badge className={config.color}>{config.label}</Badge>;
};

export default ApplicationStatus;