import api from './api';

export const appointmentService = {
  create: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },
  
  getAll: async (params = {}) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },
  
  getUpcoming: async () => {
    const response = await api.get('/appointments/upcoming');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },
  
  cancel: async (id, reason, cancelledBy) => {
    const response = await api.post(`/appointments/${id}/cancel`, {
      reason,
      cancelled_by: cancelledBy,
    });
    return response.data;
  },
};