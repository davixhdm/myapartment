import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import propertyService from '@services/propertyService';
import transactionService from '@services/transactionService';
import PropertyCard from '@components/properties/PropertyCard';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';
import { FiHome, FiUser, FiDollarSign, FiCalendar, FiRefreshCw } from 'react-icons/fi';
import { formatCurrency, formatDate } from '@utils/formatters';

const UserProperties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      const [propsRes, transRes] = await Promise.all([
        propertyService.getProperties(),
        transactionService.getTransactions()
      ]);
      
      const assignedProperties = propsRes.data.data.filter(property => {
        return property.units?.some(unit => 
          unit.status === 'occupied' && unit.currentTenant?._id === user._id
        );
      });
      
      setProperties(assignedProperties);
      setTransactions(transRes.data.data.filter(t => t.tenant?._id === user._id));
    } catch (err) {
      console.error('Failed to load user data:', err);
      setError('Failed to load your information');
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const refreshData = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const findMyUnit = (property) => {
    return property.units?.find(u => 
      u.status === 'occupied' && u.currentTenant?._id === user._id
    );
  };

  const calculateTotalRent = () => {
    return properties.reduce((total, property) => {
      const myUnit = findMyUnit(property);
      return total + (myUnit?.price || 0);
    }, 0);
  };

  const calculatePaidThisMonth = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions
      .filter(t => {
        const tDate = new Date(t.createdAt);
        return t.status === 'completed' && 
               tDate.getMonth() === currentMonth &&
               tDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const calculateBalance = () => {
    return calculateTotalRent() - calculatePaidThisMonth();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={refreshData} />;

  const totalRent = calculateTotalRent();
  const paidThisMonth = calculatePaidThisMonth();
  const balance = calculateBalance();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="flex items-center text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {properties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Monthly Rent</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalRent)}</p>
              </div>
              <FiDollarSign className="text-blue-400 text-3xl" />
            </div>
          </Card>
          <Card className="bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Paid This Month</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(paidThisMonth)}</p>
              </div>
              <FiDollarSign className="text-green-400 text-3xl" />
            </div>
          </Card>
          <Card className={balance > 0 ? 'bg-red-50' : 'bg-gray-50'}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${balance > 0 ? 'text-red-600' : 'text-gray-600'}`}>Balance</p>
                <p className={`text-2xl font-bold ${balance > 0 ? 'text-red-700' : 'text-gray-700'}`}>
                  {formatCurrency(balance)}
                </p>
              </div>
              <FiDollarSign className={balance > 0 ? 'text-red-400' : 'text-gray-400'} size={30} />
            </div>
          </Card>
        </div>
      )}

      {properties.length === 0 ? (
        <Card className="text-center py-12">
          <FiHome className="mx-auto text-gray-400 text-5xl mb-4" />
          <p className="text-gray-500 text-lg">You don't have any properties assigned yet.</p>
          <p className="text-gray-400 mt-2">Once your application is approved, your property will appear here.</p>
          <Link to="/browse">
            <button className="mt-6 text-blue-600 hover:underline">Browse Available Properties →</button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => {
            const myUnit = findMyUnit(property);
            return (
              <div key={property._id} className="relative">
                <PropertyCard property={property} />
                {myUnit && (
                  <Card className="mt-3 bg-blue-50 border border-blue-200">
                    <div className="space-y-2">
                      <div className="flex items-center text-blue-700">
                        <FiUser className="mr-2" />
                        <span className="font-medium">Your Unit: {myUnit.unitNumber}</span>
                      </div>
                      <div className="text-sm text-blue-600">
                        <p>{myUnit.bedrooms} bed • {myUnit.bathrooms} bath • {myUnit.area} m²</p>
                        <p className="font-semibold mt-1">{formatCurrency(myUnit.price)}/month</p>
                      </div>
                      <div className="text-xs text-blue-500 flex items-center">
                        <FiCalendar className="mr-1" />
                        Lease active since {formatDate(property.createdAt)}
                      </div>
                      <Link to="/payments">
                        <button className="w-full mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">
                          Make Payment
                        </button>
                      </Link>
                    </div>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserProperties;