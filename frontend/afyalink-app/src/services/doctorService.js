import api from './api';

export const doctorService = {
  getAll: async (params = {}) => {
    const response = await api.get('/doctors', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },
  
  getSpecializations: async () => {
    const response = await api.get('/doctors/specializations');
    return response.data;
  },
  
  getReviews: async (doctorId, params = {}) => {
    const response = await api.get(`/doctors/${doctorId}/reviews`, { params });
    return response.data;
  },
  
  getRatingSummary: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}/rating-summary`);
    return response.data;
  },
  
  updateProfile: async (data) => {
    const response = await api.put('/doctors/me', data);
    return response.data;
  },
};