import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useSettings } from '@hooks/useSettings';
import propertyService from '@services/propertyService';
import transactionService from '@services/transactionService';
import DashboardCards from '@components/dashboard/DashboardCards';
import QuickActions from '@components/dashboard/QuickActions';
import NotificationsWidget from '@components/dashboard/NotificationsWidget';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import { formatCurrency, formatDate } from '@utils/formatters';
import { FiCalendar, FiDollarSign, FiHome, FiInfo, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useAuth();
  const { settings, getPaymentDueDate, formatDueDate, getPaymentStatus } = useSettings();
  const [properties, setProperties] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      const [propsRes, transRes] = await Promise.all([
        propertyService.getProperties({ currentTenant: user._id }),
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

  const paymentStatus = getPaymentStatus(calculateBalance());
  const totalRent = calculateTotalRent();
  const paidThisMonth = calculatePaidThisMonth();
  const balance = calculateBalance();
  const dueDate = getPaymentDueDate();

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={refreshData} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">{settings.companyName}</p>
        </div>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="flex items-center text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <Card className="bg-gray-50 border border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <FiInfo className="text-blue-500" />
            <span><strong>Payment Due Date:</strong> {formatDueDate()}</span>
          </div>
          <div className="flex items-center space-x-4">
            <FiCalendar className="text-blue-500" />
            <span><strong>Next Due:</strong> {dueDate.toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div>
            <Badge className={paymentStatus.color}>
              {paymentStatus.label}
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Monthly Rent</p>
              <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalRent)}</p>
            </div>
            <FiHome className="text-blue-400 text-3xl" />
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

        <Card className="bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Next Due Date</p>
              <p className="text-2xl font-bold text-purple-700">
                {dueDate.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
              </p>
            </div>
            <FiCalendar className="text-purple-400 text-3xl" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCards />
        </div>
        <div className="space-y-6">
          <QuickActions role="tenant" />
          <NotificationsWidget />
        </div>
      </div>

      {properties.length > 0 && (
        <Card className="mt-4">
          <h2 className="text-lg font-semibold mb-4">Your Properties</h2>
          <div className="space-y-4">
            {properties.map(property => {
              const myUnit = findMyUnit(property);
              return (
                <div key={property._id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{property.title}</h3>
                      <p className="text-sm text-gray-600">{property.address?.street}, {property.address?.city}</p>
                      {myUnit && (
                        <div className="mt-2">
                          <Badge className="bg-blue-100 text-blue-800">Unit {myUnit.unitNumber}</Badge>
                          <p className="text-sm text-gray-600 mt-1">{myUnit.bedrooms} bed • {myUnit.bathrooms} bath • {myUnit.area} m²</p>
                        </div>
                      )}
                    </div>
                    <Link to={`/payments`}>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                        Make Payment
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Card className="bg-gray-800 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold mb-2">{settings.companyName}</h3>
            <p className="text-sm text-gray-300">{settings.address}</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Contact</h3>
            <p className="text-sm text-gray-300">{settings.contactEmail}</p>
            <p className="text-sm text-gray-300">{settings.contactPhone}</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Payment Terms</h3>
            <p className="text-sm text-gray-300">Rent due on the {formatDueDate()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserDashboard;