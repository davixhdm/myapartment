import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiFileText, FiMail, FiTool } from 'react-icons/fi';
import Card from '@components/common/Card';

const QuickActions = ({ role }) => {
  const actions = [
    ...(role === 'landlord' || role === 'admin'
      ? [
          { label: 'Add Property', icon: FiPlus, to: '/admin/properties/new', color: 'bg-blue-500' },
          { label: 'Create Invoice', icon: FiFileText, to: '/admin/transactions/new', color: 'bg-green-500' },
        ]
      : []),
    ...(role === 'tenant'
      ? [
          { label: 'Pay Rent', icon: FiPlus, to: '/payments', color: 'bg-purple-500' },
          { label: 'Maintenance Request', icon: FiTool, to: '/maintenance/new', color: 'bg-yellow-500' },
        ]
      : []),
    { label: 'Messages', icon: FiMail, to: '/messages', color: 'bg-indigo-500' },
  ];

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, idx) => (
          <Link
            key={idx}
            to={action.to}
            className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition"
          >
            <div className={`${action.color} text-white p-3 rounded-full mb-2`}>
              <action.icon size={20} />
            </div>
            <span className="text-sm text-center">{action.label}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;