import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import transactionService from '@services/transactionService';
import propertyService from '@services/propertyService';
import userService from '@services/userService';
import Input from '@components/common/Input';
import Select from '@components/common/Select';
import Textarea from '@components/common/Textarea';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import toast from 'react-hot-toast';

const AdminTransactionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [formData, setFormData] = useState({
    type: 'rent',
    amount: '',
    paymentMethod: 'mpesa',
    status: 'pending',
    property: '',
    tenant: '',
    description: '',
    dueDate: ''
  });

  const fetchProperties = useCallback(async () => {
    try {
      const res = await propertyService.getProperties();
      setProperties(res.data.data);
    } catch (err) {
      console.error('Failed to load properties', err);
    }
  }, []);

  const fetchTenants = useCallback(async () => {
    try {
      const res = await userService.getUsers({ role: 'tenant' });
      setTenants(res.data.data);
    } catch (err) {
      console.error('Failed to load tenants', err);
    }
  }, []);

  const loadTransaction = useCallback(async () => {
    setLoading(true);
    try {
      const res = await transactionService.getTransaction(id);
      setFormData(res.data.data);
    } catch (err) {
      setError('Failed to load transaction');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProperties();
    fetchTenants();
    if (id) loadTransaction();
  }, [id, fetchProperties, fetchTenants, loadTransaction]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (id) {
        await transactionService.updateTransaction(id, formData);
        toast.success('Transaction updated');
      } else {
        await transactionService.createTransaction(formData);
        toast.success('Transaction created');
      }
      navigate('/admin/transactions');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{id ? 'Edit Transaction' : 'Create New Transaction'}</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Transaction Type" name="type" value={formData.type} onChange={handleChange} options={[{ value: 'rent', label: 'Rent Payment' }, { value: 'deposit', label: 'Deposit' }, { value: 'maintenance', label: 'Maintenance Fee' }, { value: 'utility', label: 'Utility Bill' }, { value: 'fine', label: 'Fine' }, { value: 'refund', label: 'Refund' }]} required />
          <Input label="Amount (KES)" name="amount" type="number" value={formData.amount} onChange={handleChange} required />
          <Select label="Payment Method" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} options={[{ value: 'mpesa', label: 'M-Pesa' }, { value: 'cash', label: 'Cash' }, { value: 'bank_transfer', label: 'Bank Transfer' }, { value: 'credit_card', label: 'Credit Card' }, { value: 'cheque', label: 'Cheque' }]} required />
          <Select label="Status" name="status" value={formData.status} onChange={handleChange} options={[{ value: 'pending', label: 'Pending' }, { value: 'completed', label: 'Completed' }, { value: 'failed', label: 'Failed' }, { value: 'refunded', label: 'Refunded' }]} required />
          <Select label="Property" name="property" value={formData.property} onChange={handleChange} options={properties.map(p => ({ value: p._id, label: p.title }))} required />
          <Select label="Tenant" name="tenant" value={formData.tenant} onChange={handleChange} options={tenants.map(t => ({ value: t._id, label: `${t.name} (${t.email})` }))} required />
          <Input label="Due Date" name="dueDate" type="date" value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''} onChange={handleChange} required />
          <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} rows={3} />
          <div className="flex space-x-3"><Button type="submit" isLoading={submitting}>{id ? 'Update Transaction' : 'Create Transaction'}</Button><Button type="button" variant="outline" onClick={() => navigate('/admin/transactions')}>Cancel</Button></div>
        </form>
      </Card>
    </div>
  );
};

export default AdminTransactionForm;