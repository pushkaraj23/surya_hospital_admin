import api from '../../../services/api';
import { API_ENDPOINTS } from '../../../constants';

// This function fetches the overview data (counts)
export const fetchDashboardStats = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.DASHBOARD_STATS);
    return response.data; // Should return { totalDoctors, appointments, inquiries, departments }
  } catch (error) {
    // Interceptor handles the global error; we just log and rethrow/return default here
    console.error('Failed to fetch dashboard stats:', error);
    throw error;
  }
};

// This function fetches the latest feedback
export const fetchLatestFeedback = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.LATEST_FEEDBACK, { params: { limit: 5 } });
    return response.data; // Should return an array of feedback objects
  } catch (error) {
    console.error('Failed to fetch latest feedback:', error);
    throw error;
  }
};