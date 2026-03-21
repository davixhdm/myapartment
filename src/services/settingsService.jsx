import api from './api';

const settingsService = {
  getPublicSettings: () => api.get('/settings/public'),
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data),
  getSetting: (key) => api.get(`/settings/${key}`),
  updateSetting: (key, data) => api.put(`/settings/${key}`, data),
  deleteSetting: (key) => api.delete(`/settings/${key}`),
  initDefaultSettings: () => api.post('/settings/init')
};

export default settingsService;