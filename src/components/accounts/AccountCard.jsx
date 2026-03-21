import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';
import Avatar from '@components/ui/Avatar';

const AccountCard = ({ account }) => {
  return (
    <Card className="hover:shadow-md transition">
      <Link to={`/admin/accounts/${account._id}`}>
        <div className="flex items-center space-x-4">
          <Avatar name={account.name} size="lg" />
          <div className="flex-1">
            <h3 className="font-semibold">{account.name}</h3>
            <p className="text-sm text-gray-600">{account.email}</p>
            <div className="flex items-center mt-2 space-x-2">
              <Badge className={account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {account.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">{account.role}</Badge>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default AccountCard;