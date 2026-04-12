import axios from 'axios';

const api = axios.create({ 
  baseURL: 'https://portfolio-backend-pu94.onrender.com/api',
  timeout: 10000 // 10s timeout to account for Render cold starts
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('NETWORK ERROR: Check if backend is awake and CORS is allowed.');
    }
    return Promise.reject(error);
  }
);

export default api;
