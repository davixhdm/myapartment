import api from './api';

const paymentService = {
  getPayments: (params) => api.get('/payments', { params }),
  getPaymentHistory: () => api.get('/payments/history'),
  makePayment: (data) => api.post('/payments', data)
};

export default paymentService;