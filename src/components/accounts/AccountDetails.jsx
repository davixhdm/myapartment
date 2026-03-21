import React from 'react';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';
import Avatar from '@components/ui/Avatar';
import { formatDate } from '@utils/formatters';

const AccountDetails = ({ account }) => {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center space-x-6">
          <Avatar name={account.name} size="xl" />
          <div>
            <h2 className="text-2xl font-bold">{account.name}</h2>
            <p className="text-gray-600">{account.email}</p>
            <div className="flex space-x-2 mt-2">
              <Badge className={account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {account.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">{account.role}</Badge>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p>{formatDate(account.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Login</p>
            <p>{account.lastLogin ? formatDate(account.lastLogin) : 'Never'}</p>
          </div>
        </div>
      </Card>

      {account.permissions && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Permissions</h3>
          <div className="flex flex-wrap gap-2">
            {account.permissions.map(perm => (
              <Badge key={perm} className="bg-gray-100 text-gray-800">{perm}</Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AccountDetails;