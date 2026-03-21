import { useState, useEffect } from 'react';
import reportService from '@services/reportService';

export const useReports = () => {
  const [financial, setFinancial] = useState(null);
  const [occupancy, setOccupancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [finRes, occRes] = await Promise.all([
        reportService.getFinancialReport(),
        reportService.getOccupancyReport()
      ]);
      setFinancial(finRes.data.data);
      setOccupancy(occRes.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return { financial, occupancy, loading, error, fetchReports };
};