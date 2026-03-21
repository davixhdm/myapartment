import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import transactionService from '@services/transactionService';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';
import { formatCurrency, formatDate } from '@utils/formatters';
import { FiEdit, FiPrinter, FiArrowLeft } from 'react-icons/fi';

const AdminTransactionDetail = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTransaction = useCallback(async () => {
    try {
      const res = await transactionService.getTransaction(id);
      setTransaction(res.data.data);
    } catch (err) {
      setError('Failed to load transaction');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTransaction();
  }, [loadTransaction]);

  const handlePrint = () => window.print();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadTransaction} />;
  if (!transaction) return <div>Transaction not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link to="/admin/transactions"><Button variant="outline" size="sm"><FiArrowLeft className="mr-2" /> Back</Button></Link>
        <div className="space-x-2"><Button variant="outline" onClick={handlePrint}><FiPrinter className="mr-2" /> Print</Button><Link to={`/admin/transactions/edit/${transaction._id}`}><Button variant="primary"><FiEdit className="mr-2" /> Edit</Button></Link></div>
      </div>
      <h1 className="text-2xl font-bold mb-6">Transaction Details</h1>
      <div className="space-y-6">
        <Card>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><p className="text-sm text-gray-500">Transaction ID</p><p className="font-mono font-medium">{transaction.transactionId}</p></div>
            <div><p className="text-sm text-gray-500">Type</p><Badge className="bg-blue-100 text-blue-800 capitalize">{transaction.type}</Badge></div>
            <div><p className="text-sm text-gray-500">Status</p><Badge className={transaction.status === 'completed' ? 'bg-green-100 text-green-800' : transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>{transaction.status}</Badge></div>
            <div><p className="text-sm text-gray-500">Amount</p><p className="text-xl font-bold text-blue-600">{formatCurrency(transaction.amount)}</p></div>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold mb-4">Property & Tenant Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <div><h3 className="font-medium mb-2">Property Details</h3><p className="text-gray-700">{transaction.property?.title}</p><p className="text-sm text-gray-500">{transaction.property?.address?.street}, {transaction.property?.address?.city}</p></div>
            <div><h3 className="font-medium mb-2">Tenant Details</h3><p className="text-gray-700">{transaction.tenant?.name}</p><p className="text-sm text-gray-500">{transaction.tenant?.email}</p><p className="text-sm text-gray-500">{transaction.tenant?.phone}</p></div>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div><p className="text-sm text-gray-500">Payment Method</p><p className="font-medium capitalize">{transaction.paymentMethod}</p></div>
            <div><p className="text-sm text-gray-500">Payment Reference</p><p className="font-mono text-sm">{transaction.paymentReference || 'N/A'}</p></div>
            <div><p className="text-sm text-gray-500">Due Date</p><p>{transaction.dueDate ? formatDate(transaction.dueDate) : 'N/A'}</p></div>
            <div><p className="text-sm text-gray-500">Paid Date</p><p>{transaction.paidDate ? formatDate(transaction.paidDate) : 'Not paid'}</p></div>
            <div><p className="text-sm text-gray-500">Created</p><p>{formatDate(transaction.createdAt)}</p></div>
          </div>
          {transaction.description && <div className="mt-4"><p className="text-sm text-gray-500">Description</p><p className="text-gray-700">{transaction.description}</p></div>}
        </Card>
      </div>
    </div>
  );
};

export default AdminTransactionDetail;