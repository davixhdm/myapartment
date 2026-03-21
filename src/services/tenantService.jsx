import api from './api';

const tenantService = {
  getTenants: () => api.get('/users/tenants'),
  getTenant: (id) => api.get(`/users/${id}`),
  getTenantProperties: (tenantId) => api.get(`/properties?currentTenant=${tenantId}`),
  getTenantTransactions: (tenantId) => api.get(`/transactions/tenant/${tenantId}`),
  updateTenant: (id, data) => api.put(`/users/${id}`, data),
  deactivateTenant: (id) => api.put(`/users/${id}`, { isActive: false }),
  activateTenant: (id) => api.put(`/users/${id}`, { isActive: true })
};

export default tenantService;