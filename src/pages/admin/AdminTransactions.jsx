import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import transactionService from '@services/transactionService';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';
import { FiPlus, FiEye } from 'react-icons/fi';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await transactionService.getTransactions();
      setTransactions(res.data.data);
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchTransactions} />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Link to="/admin/transactions/new">
          <Button variant="primary">
            <FiPlus className="mr-2" /> New Transaction
          </Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap"><span className="font-mono text-sm">{tx.transactionId?.slice(0, 8)}...</span></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{tx.property?.title}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{tx.tenant?.name}</div><div className="text-xs text-gray-500">{tx.tenant?.email}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-bold text-blue-600">KES {tx.amount?.toLocaleString()}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><Badge className={tx.status === 'completed' ? 'bg-green-100 text-green-800' : tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>{tx.status}</Badge></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><Link to={`/admin/transactions/${tx._id}`}><Button variant="outline" size="sm"><FiEye className="mr-1" /> View</Button></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminTransactions;