import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import tenantService from '@services/tenantService';
import propertyService from '@services/propertyService';
import transactionService from '@services/transactionService';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';
import Avatar from '@components/ui/Avatar';
import { formatCurrency } from '@utils/formatters';
import { FiEye, FiMail, FiPhone } from 'react-icons/fi';

const AdminTenants = () => {
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [tenantsRes, propertiesRes, transactionsRes] = await Promise.all([
        tenantService.getTenants(),
        propertyService.getProperties(),
        transactionService.getTransactions()
      ]);
      setTenants(tenantsRes.data.data);
      setProperties(propertiesRes.data.data);
      setTransactions(transactionsRes.data.data);
    } catch (err) {
      setError('Failed to load tenant data');
    } finally {
      setLoading(false);
    }
  };

  const getTenantProperties = (tenantId) => {
    return properties.filter(property =>
      property.units?.some(unit =>
        unit.status === 'occupied' && unit.currentTenant?._id === tenantId
      )
    );
  };

  const getTenantUnit = (property, tenantId) => {
    return property.units?.find(u =>
      u.status === 'occupied' && u.currentTenant?._id === tenantId
    );
  };

  const getTenantTransactions = (tenantId) => {
    return transactions.filter(t => t.tenant?._id === tenantId);
  };

  const calculateRent = (tenantId) => {
    const tenantProps = getTenantProperties(tenantId);
    return tenantProps.reduce((total, prop) => {
      const unit = getTenantUnit(prop, tenantId);
      return total + (unit?.price || 0);
    }, 0);
  };

  const calculatePaid = (tenantId) => {
    const tenantTransactions = getTenantTransactions(tenantId);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return tenantTransactions
      .filter(t => {
        const tDate = new Date(t.createdAt);
        return t.status === 'completed' &&
               tDate.getMonth() === currentMonth &&
               tDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const calculateBalance = (tenantId) => {
    return calculateRent(tenantId) - calculatePaid(tenantId);
  };

  const getPaymentStatus = (tenantId) => {
    const balance = calculateBalance(tenantId);
    const today = new Date();
    const dueDate = new Date(today.getFullYear(), today.getMonth(), 5);
    if (balance <= 0) return { status: 'paid', color: 'bg-green-100 text-green-800', label: 'Paid' };
    if (today > dueDate && balance > 0) return { status: 'overdue', color: 'bg-red-100 text-red-800', label: 'Overdue' };
    return { status: 'active', color: 'bg-yellow-100 text-yellow-800', label: 'Active' };
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAllData} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tenants Management</h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property/Unit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map(tenant => {
                const tenantProps = getTenantProperties(tenant._id);
                const totalRent = calculateRent(tenant._id);
                const totalPaid = calculatePaid(tenant._id);
                const balance = calculateBalance(tenant._id);
                const paymentStatus = getPaymentStatus(tenant._id);
                return (
                  <tr key={tenant._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><div className="flex items-center"><Avatar name={tenant.name} size="sm" className="mr-2" /><div><div className="font-medium text-gray-900">{tenant.name}</div><div className="text-xs text-gray-500">ID: {tenant._id.slice(-6)}</div></div></div></td>
                    <td className="px-4 py-3"><div className="flex flex-col space-y-1"><div className="flex items-center text-sm"><FiMail className="mr-1 text-gray-400" size={12} /><span className="text-gray-600">{tenant.email}</span></div><div className="flex items-center text-sm"><FiPhone className="mr-1 text-gray-400" size={12} /><span className="text-gray-600">{tenant.phone || 'N/A'}</span></div></div></td>
                    <td className="px-4 py-3">{tenantProps.length > 0 ? tenantProps.map(prop => { const unit = getTenantUnit(prop, tenant._id); return <div key={prop._id} className="text-sm"><div className="font-medium">{prop.title}</div><div className="text-xs text-gray-500">Unit: {unit?.unitNumber} • {unit?.bedrooms} bed • {unit?.area} m²</div></div>; }) : <span className="text-sm text-gray-400">No property assigned</span>}</td>
                    <td className="px-4 py-3"><div className="text-sm font-medium text-blue-600">{formatCurrency(totalRent)}</div><div className="text-xs text-gray-500">per month</div></td>
                    <td className="px-4 py-3"><div className="text-sm font-medium text-green-600">{formatCurrency(totalPaid)}</div><div className="text-xs text-gray-500">this month</div></td>
                    <td className="px-4 py-3"><div className={`text-sm font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(balance)}</div>{balance > 0 && <div className="text-xs text-gray-500">outstanding</div>}</td>
                    <td className="px-4 py-3"><Badge className={paymentStatus.color}>{paymentStatus.label}</Badge>{paymentStatus.status === 'active' && <div className="text-xs text-gray-500 mt-1">Due: 5th</div>}</td>
                    <td className="px-4 py-3"><Link to={`/admin/tenants/${tenant._id}`}><button className="text-blue-600 hover:text-blue-800"><FiEye size={18} /></button></Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminTenants;