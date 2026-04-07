import axios from 'axios';

// 1. Create the Instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Your Laravel API URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Required for the CORS 'supports_credentials' we set earlier
});

// 2. The Request Interceptor (The "Wristband Attacher")
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;