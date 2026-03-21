import api from './api';

const transactionService = {
  getTransactions: () => api.get('/transactions'),
  getTransaction: (id) => api.get(`/transactions/${id}`),
  createTransaction: (data) => api.post('/transactions', data),
  updateTransaction: (id, data) => api.put(`/transactions/${id}`, data),
  deleteTransaction: (id) => api.delete(`/transactions/${id}`),
  getTenantTransactions: (tenantId) => api.get(`/transactions/tenant/${tenantId}`)
};

export default transactionService;