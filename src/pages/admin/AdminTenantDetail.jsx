import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userService from '@services/userService';
import propertyService from '@services/propertyService';
import transactionService from '@services/transactionService';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';
import Avatar from '@components/ui/Avatar';
import Button from '@components/common/Button';
import { formatCurrency, formatDate } from '@utils/formatters';
import { FiMail, FiPhone, FiHome, FiDollarSign, FiCalendar, FiArrowLeft, FiMapPin } from 'react-icons/fi';

const AdminTenantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [properties, setProperties] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTenantData = useCallback(async () => {
    try {
      const [tenantRes, propertiesRes, transactionsRes] = await Promise.all([
        userService.getUser(id),
        propertyService.getProperties({ currentTenant: id }),
        transactionService.getTenantTransactions(id)
      ]);
      setTenant(tenantRes.data.data);
      setProperties(propertiesRes.data.data);
      setTransactions(transactionsRes.data.data);
    } catch (err) {
      setError('Failed to load tenant information');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTenantData();
  }, [fetchTenantData]);

  const getTenantUnit = (property) => {
    return property.units?.find(u => u.status === 'occupied' && u.currentTenant?._id === id);
  };

  const calculateTotalRent = () => {
    return properties.reduce((total, prop) => {
      const unit = getTenantUnit(prop);
      return total + (unit?.price || 0);
    }, 0);
  };

  const calculatePaidThisMonth = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return transactions
      .filter(t => {
        const tDate = new Date(t.createdAt);
        return t.status === 'completed' && tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const calculateBalance = () => calculateTotalRent() - calculatePaidThisMonth();

  const getPaymentStatus = () => {
    const balance = calculateBalance();
    const today = new Date();
    const dueDate = new Date(today.getFullYear(), today.getMonth(), 5);
    if (balance <= 0) return { status: 'paid', color: 'bg-green-100 text-green-800', label: 'Paid' };
    if (today > dueDate && balance > 0) return { status: 'overdue', color: 'bg-red-100 text-red-800', label: 'Overdue' };
    return { status: 'active', color: 'bg-yellow-100 text-yellow-800', label: 'Active' };
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchTenantData} />;
  if (!tenant) return <div>Tenant not found</div>;

  const totalRent = calculateTotalRent();
  const paidThisMonth = calculatePaidThisMonth();
  const balance = calculateBalance();
  const paymentStatus = getPaymentStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/tenants')}><FiArrowLeft className="mr-2" /> Back to Tenants</Button>
          <h1 className="text-2xl font-bold">Tenant Details</h1>
        </div>
      </div>

      <Card>
        <div className="flex items-start space-x-6">
          <Avatar name={tenant.name} size="xl" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{tenant.name}</h2>
            <p className="text-gray-600">Member since {formatDate(tenant.createdAt)}</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center text-gray-600"><FiMail className="mr-2" /> {tenant.email}</div>
              <div className="flex items-center text-gray-600"><FiPhone className="mr-2" /> {tenant.phone || 'N/A'}</div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Badge className={tenant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{tenant.isActive ? 'Active Account' : 'Inactive Account'}</Badge>
              <Badge className={paymentStatus.color}>{paymentStatus.label}</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50"><div className="flex justify-between"><div><p className="text-sm text-blue-600">Monthly Rent</p><p className="text-2xl font-bold text-blue-700">{formatCurrency(totalRent)}</p></div><FiHome className="text-blue-400 text-3xl" /></div></Card>
        <Card className="bg-green-50"><div className="flex justify-between"><div><p className="text-sm text-green-600">Paid This Month</p><p className="text-2xl font-bold text-green-700">{formatCurrency(paidThisMonth)}</p></div><FiDollarSign className="text-green-400 text-3xl" /></div></Card>
        <Card className={balance > 0 ? 'bg-red-50' : 'bg-gray-50'}><div className="flex justify-between"><div><p className={`text-sm ${balance > 0 ? 'text-red-600' : 'text-gray-600'}`}>Balance</p><p className={`text-2xl font-bold ${balance > 0 ? 'text-red-700' : 'text-gray-700'}`}>{formatCurrency(balance)}</p></div><FiDollarSign className={balance > 0 ? 'text-red-400' : 'text-gray-400'} size={30} /></div></Card>
        <Card className="bg-purple-50"><div className="flex justify-between"><div><p className="text-sm text-purple-600">Next Due Date</p><p className="text-2xl font-bold text-purple-700">5th</p></div><FiCalendar className="text-purple-400 text-3xl" /></div></Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center"><FiHome className="mr-2" /> Assigned Properties</h3>
        {properties.length === 0 ? <p className="text-gray-500">No properties assigned to this tenant.</p> : (
          <div className="space-y-4">
            {properties.map(property => {
              const unit = getTenantUnit(property);
              return (
                <div key={property._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div><h4 className="font-semibold">{property.title}</h4><p className="text-sm text-gray-600 flex items-center mt-1"><FiMapPin className="mr-1" size={12} /> {property.address?.street}, {property.address?.city}</p></div>
                    <Badge className="bg-blue-100 text-blue-800">{property.propertyCode}</Badge>
                  </div>
                  {unit && (
                    <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                      <div><span className="text-gray-500">Unit:</span><span className="ml-2 font-mono">{unit.unitNumber}</span></div>
                      <div><span className="text-gray-500">Rent:</span><span className="ml-2 font-medium">{formatCurrency(unit.price)}</span></div>
                      <div><span className="text-gray-500">Details:</span><span className="ml-2">{unit.bedrooms} bed, {unit.bathrooms} bath</span></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center"><FiDollarSign className="mr-2" /> Payment History</h3>
        {transactions.length === 0 ? <p className="text-gray-500">No payment history available.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th></tr></thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx._id}>
                    <td className="px-4 py-2 text-sm">{formatDate(tx.createdAt)}</td>
                    <td className="px-4 py-2 text-sm">{tx.description || 'Rent Payment'}</td>
                    <td className="px-4 py-2 text-sm font-medium">{formatCurrency(tx.amount)}</td>
                    <td className="px-4 py-2"><Badge className={tx.status === 'completed' ? 'bg-green-100 text-green-800' : tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>{tx.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminTenantDetail;