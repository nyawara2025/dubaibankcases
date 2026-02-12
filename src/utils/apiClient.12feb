import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

/**
 * Pre-configured Axios instance for SOC Command
 * Handles base settings and automatic security headers
 */
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    // Add any standard Bank Security headers here
    'X-System-ID': 'SOC-COMMAND-V1'
  }
});

// REQUEST INTERCEPTOR: Automatically attach the JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('soc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Global error handling (e.g., auto-logout on 401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session Expired - Redirecting to Login");
      localStorage.removeItem('soc_token');
      localStorage.removeItem('soc_user');
      window.location.href = '/login'; // Or your login route
    }
    return Promise.reject(error);
  }
);

export default apiClient;
