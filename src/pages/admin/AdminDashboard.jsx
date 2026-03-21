import React, { useState, useEffect } from 'react';
import { useSettings } from '@hooks/useSettings';
import DashboardCards from '@components/dashboard/DashboardCards';
import RecentActivities from '@components/dashboard/RecentActivities';
import QuickActions from '@components/dashboard/QuickActions';
import StatsChart from '@components/dashboard/StatsChart';
import Card from '@components/common/Card';
import Badge from '@components/ui/Badge';
import { FiClock, FiCalendar } from 'react-icons/fi';
import { formatDate } from '@utils/formatters';

const AdminDashboard = () => {
  const { settings, formatDueDate } = useSettings();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const statsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ label: 'Revenue', data: [45000, 52000, 48000, 60000, 55000, 70000], backgroundColor: '#3B82F6' }]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <Badge className="bg-blue-100 text-blue-800 flex items-center"><FiClock className="mr-1" /> {currentTime.toLocaleTimeString()}</Badge>
          <Badge className="bg-purple-100 text-purple-800 flex items-center"><FiCalendar className="mr-1" /> {formatDate(currentTime)}</Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex justify-between items-center">
            <div><p className="text-green-100">Payment Due Day</p><p className="text-2xl font-bold">{formatDueDate()}</p></div>
            <FiCalendar size={40} className="text-green-300" />
          </div>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex justify-between items-center">
            <div><p className="text-purple-100">Company</p><p className="text-2xl font-bold">{settings.companyName}</p></div>
            <FiCalendar size={40} className="text-purple-300" />
          </div>
          <p className="text-xs text-purple-200 mt-2">{settings.contactEmail}</p>
        </Card>
      </div>
      <DashboardCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><Card><h2 className="text-lg font-semibold mb-4">Revenue Overview</h2><StatsChart type="bar" data={statsData} /></Card></div>
        <div className="space-y-6"><QuickActions role="admin" /><RecentActivities /></div>
      </div>
      <Card className="bg-gray-800 text-white"><div className="grid grid-cols-3 gap-4 text-sm"><div><p className="text-gray-400">Company</p><p className="font-medium">{settings.companyName}</p></div><div><p className="text-gray-400">Payment Terms</p><p className="font-medium">Due on {formatDueDate()}</p></div><div><p className="text-gray-400">Contact</p><p className="font-medium">{settings.contactEmail}</p></div></div></Card>
    </div>
  );
};

export default AdminDashboard;