import api from './api';

const userService = {
  getUsers: (params) => api.get('/users', { params }),
  getStaff: () => api.get('/users/staff'),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  updateProfile: (data) => api.put('/auth/updatedetails', data)
};

export default userService;