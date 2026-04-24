import axios from 'axios';
import staticData from '../data/staticData.json';

const api = axios.create({ 
  baseURL: 'https://portfolio-backend-pu94.onrender.com/api',
  timeout: 5000 // 5s timeout for quicker fallback
});

// Track backend status
let isStaticMode = false;

export const getBackendStatus = async () => {
  try {
    await axios.get('https://portfolio-backend-pu94.onrender.com/api/projects', { timeout: 2000 });
    isStaticMode = false;
    return 'dynamic';
  } catch (error) {
    isStaticMode = true;
    return 'static';
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    isStaticMode = false;
    return response;
  },
  async (error) => {
    if (!error.response || error.code === 'ECONNABORTED' || error.response.status >= 500) {
      const url = error.config.url;
      const method = error.config.method;

      if (method === 'get') {
        const path = url.replace(/^\/api\//, '').replace(/^\//, '');
        const dataKey = path.split('/')[0]; // e.g., 'projects' from '/projects' or 'projects/123'
        
        if (staticData[dataKey] || Array.isArray(staticData[dataKey])) {
          console.warn(`Backend unreachable. Serving static data for: ${url}`);
          isStaticMode = true;
          return {
            data: staticData[dataKey],
            status: 200,
            statusText: 'OK (Static)',
            headers: {},
            config: error.config,
            isStatic: true
          };
        } else {
          // Default fallback for other GET requests in static mode
          console.warn(`Backend unreachable and no static data for: ${url}. Returning empty set.`);
          isStaticMode = true;
          return {
            data: [],
            status: 200,
            statusText: 'OK (Static Empty)',
            headers: {},
            config: error.config,
            isStatic: true
          };
        }
      }
    }
    return Promise.reject(error);
  }
);

export { isStaticMode };
export default api;
