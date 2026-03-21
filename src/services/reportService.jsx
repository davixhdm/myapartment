import api from './api';

const reportService = {
  getFinancialReport: (params) => api.get('/reports/financial', { params }),
  getOccupancyReport: () => api.get('/reports/occupancy')
};

export default reportService;