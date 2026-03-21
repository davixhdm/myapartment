import api from './api';

const applicationService = {
  getApplications: () => api.get('/applications'),
  getApplication: (id) => api.get(`/applications/${id}`),
  createApplication: (data) => api.post('/applications', data),
  updateApplicationStatus: (id, status, notes) => api.put(`/applications/${id}`, { status, reviewNotes: notes }),
  deleteApplication: (id) => api.delete(`/applications/${id}`)
};

export default applicationService;