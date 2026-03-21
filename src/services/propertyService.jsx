import api from './api';

const propertyService = {
  getProperties: (params) => api.get('/properties', { params }),
  getProperty: (id) => api.get(`/properties/${id}`),
  createProperty: (data) => api.post('/properties', data),
  updateProperty: (id, data) => api.put(`/properties/${id}`, data),
  deleteProperty: (id) => api.delete(`/properties/${id}`),
  getAvailableUnits: (propertyId) => api.get(`/properties/${propertyId}/units`),
  updateUnitStatus: (propertyId, unitId, data) => api.put(`/properties/${propertyId}/units/${unitId}`, data),
  uploadImages: (id, formData) => api.post(`/properties/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getPropertiesByLandlord: (landlordId) => api.get(`/properties/landlord/${landlordId}`),
  getNearby: (lat, lng, distance) => api.get('/properties/nearby', { params: { lat, lng, distance } })
};

export default propertyService;