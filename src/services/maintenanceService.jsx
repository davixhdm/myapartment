import api from './api';

const maintenanceService = {
  getRequests: (params) => api.get('/maintenance', { params }),
  getRequest: (id) => api.get(`/maintenance/${id}`),
  createRequest: (data) => api.post('/maintenance', data),
  updateRequest: (id, data) => api.put(`/maintenance/${id}`, data),
  deleteRequest: (id) => api.delete(`/maintenance/${id}`)
};

export default maintenanceService;