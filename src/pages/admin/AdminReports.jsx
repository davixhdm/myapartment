import React, { useState, useEffect } from 'react';
import reportService from '@services/reportService';
import Card from '@components/common/Card';
import StatsChart from '@components/dashboard/StatsChart';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';

const AdminReports = () => {
  const [financial, setFinancial] = useState(null);
  const [occupancy, setOccupancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [finRes, occRes] = await Promise.all([
        reportService.getFinancialReport(),
        reportService.getOccupancyReport()
      ]);
      setFinancial(finRes.data.data);
      setOccupancy(occRes.data.data);
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchReports} />;

  const occupancyChartData = {
    labels: ['Occupied', 'Vacant', 'Maintenance'],
    datasets: [{
      data: [occupancy?.occupied || 0, occupancy?.vacant || 0, occupancy?.maintenance || 0],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444']
    }]
  };

  const incomeExpenseData = {
    labels: ['Income', 'Expenses'],
    datasets: [{
      data: [financial?.totalIncome || 0, financial?.totalExpenses || 0],
      backgroundColor: ['#3B82F6', '#EF4444']
    }]
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Occupancy</h2>
          <StatsChart type="pie" data={occupancyChartData} />
        </Card>
        <Card>
          <h2 className="text-lg font-semibold mb-4">Income vs Expenses</h2>
          <StatsChart type="pie" data={incomeExpenseData} />
        </Card>
        <Card className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Financial Summary</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-500">Total Income</p>
              <p className="text-2xl font-bold text-green-600">KES {financial?.totalIncome?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">KES {financial?.totalExpenses?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Net</p>
              <p className="text-2xl font-bold text-blue-600">
                KES {((financial?.totalIncome || 0) - (financial?.totalExpenses || 0)).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;