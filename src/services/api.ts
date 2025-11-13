import axios from 'axios';

// Determine base URL based on environment
const getBaseURL = () => {
  // Check if VITE_API_URL is set (for production)
  if (import.meta.env.VITE_API_URL) {
    console.log('Using VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // For development, use the proxy
  if (import.meta.env.DEV) {
    console.log('Development mode, using /api proxy');
    return '/api';
  }
  
  // For production on Vercel, explicitly use your backend URL
  // This should work even if the environment variable is not set
  console.log('Production mode, using hardcoded backend URL');
  return 'https://travel-log-b.vercel.app';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
});

// Add request interceptor to log requests
api.interceptors.request.use((config) => {
  console.log('Making request to:', config.baseURL + config.url);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Add response interceptor to log responses
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.config?.url);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/account/login';
    }
    return Promise.reject(error);
  }
);

export default api;