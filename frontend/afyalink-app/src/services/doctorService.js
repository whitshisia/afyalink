import api from './api';

export const doctorService = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/doctors', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get doctors:', error);
      return []; // Return empty array on error
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/doctors/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get doctor ${id}:`, error);
      return null;
    }
  },
  
  getSpecializations: async () => {
    try {
      const response = await api.get('/doctors/specializations');
      return response.data;
    } catch (error) {
      console.error('Failed to get specializations:', error);
      return [];
    }
  },
  
  getReviews: async (doctorId, params = {}) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/reviews`, { params });
      return response.data;
    } catch (error) {
      console.error(`Failed to get reviews for doctor ${doctorId}:`, error);
      return []; // Return empty array on error
    }
  },
  
  getRatingSummary: async (doctorId) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/rating-summary`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get rating summary for doctor ${doctorId}:`, error);
      return { average_rating: 0, total_reviews: 0 };
    }
  },
  
  updateProfile: async (data) => {
    const response = await api.put('/doctors/me', data);
    return response.data;
  },
};