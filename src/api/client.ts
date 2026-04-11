import axios from 'axios';
import { sileo } from 'sileo';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Adjust if your backend is hosted elsewhere
});

// Request Interceptor (Existing: Attach Token)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response Interceptor (New: The Safety Net)
apiClient.interceptors.response.use(
  (response) => response, // If request is 2xx, do nothing
  (error) => {
    const status = error.response?.status;

    switch (status) {
      case 401: // Unauthorized (Token expired/invalid)
        localStorage.removeItem('token');
        sileo.error({
          title: 'Session Terminated',
          description: 'Re-authentication required.',
        });
        // Optional: window.location.href = '/login';
        break;

      case 403: // Forbidden (Policy failed)
        sileo.error({
          title: 'Access Denied',
          description: 'You do not have clearance for this operation.',
        });
        break;

      case 422: // Validation Error
        // We usually handle this inside the component/form
        break;

      case 500: // Server Crash
        sileo.error({
          title: 'Nexus Offline',
          description: 'The backend server encountered a critical error.',
        });
        break;
      case 429: // Too Many Requests
  sileo.error({
    title: "Security Lockout",
    description: "Too many failed attempts. Try again in 60 seconds."
  });
  break;

      default:
        sileo.error({
          title: 'Network Error',
          description: 'Unable to establish uplink with the server.',
        });
    }

    return Promise.reject(error);
  }
);

export default apiClient;