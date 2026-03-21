import React from 'react';
import { useProperties } from '@hooks/useProperties';
import { useTransactions } from '@hooks/useTransactions';
import { useAuth } from '@hooks/useAuth';
import { formatCurrency } from '@utils/formatters';
import Card from '@components/common/Card';

const DashboardCards = () => {
  const { user } = useAuth();
  const { properties } = useProperties();
  const { transactions } = useTransactions();

  let totalProperties = 0;
  let occupiedProperties = 0;
  let totalIncome = 0;
  let pendingRequests = 0;
  let myProperty = null;

  if (user?.role === 'landlord' || user?.role === 'admin') {
    totalProperties = properties.length;
    occupiedProperties = properties.filter(p => p.status === 'occupied').length;
    totalIncome = transactions
      .filter(t => t.type === 'rent' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  } else if (user?.role === 'tenant') {
    myProperty = properties.find(p => p.currentTenant === user._id);
    pendingRequests = transactions.filter(t => t.status === 'pending').length;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {user?.role !== 'tenant' ? (
        <>
          <Card>
            <h3 className="text-gray-500 text-sm">Total Properties</h3>
            <p className="text-3xl font-bold">{totalProperties}</p>
          </Card>
          <Card>
            <h3 className="text-gray-500 text-sm">Occupied Properties</h3>
            <p className="text-3xl font-bold">{occupiedProperties}</p>
          </Card>
          <Card>
            <h3 className="text-gray-500 text-sm">Total Income</h3>
            <p className="text-3xl font-bold">{formatCurrency(totalIncome)}</p>
          </Card>
        </>
      ) : (
        <>
          <Card>
            <h3 className="text-gray-500 text-sm">My Property</h3>
            <p className="text-xl font-bold">
              {myProperty ? `${myProperty.address?.street}, ${myProperty.address?.city}` : 'None'}
            </p>
          </Card>
          <Card>
            <h3 className="text-gray-500 text-sm">Pending Payments</h3>
            <p className="text-3xl font-bold">{pendingRequests}</p>
          </Card>
          <Card>
            <h3 className="text-gray-500 text-sm">Maintenance Requests</h3>
            <p className="text-3xl font-bold">-</p>
          </Card>
        </>
      )}
    </div>
  );
};

export default DashboardCards;