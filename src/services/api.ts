import axios from 'axios';

// Determine base URL based on environment
const getBaseURL = () => {
  // For development, always use the proxy to local backend
  if (import.meta.env.DEV) {
    return '/api';
  }
  
  // Check if VITE_API_URL is set (for production)
  if (import.meta.env.VITE_API_URL) {
    // Ensure the URL doesn't end with a slash
    let url = import.meta.env.VITE_API_URL;
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    return url;
  }
  return 'https://travel-log-b.vercel.app/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/account/login';
    }
    return Promise.reject(error);
  }
);

export default api;