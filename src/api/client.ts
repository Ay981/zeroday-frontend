import axios, { AxiosError } from 'axios';
import { AxiosHeaders } from 'axios';
import { queryClient } from '../lib/queryClient';

const api = axios.create({
  baseURL: 'https://api.zeroday.aymenabdulkerim.dev',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});
 
const readDecodedXsrfToken = (): string | null => {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  if (!match?.[1]) {
    return null;
  }
  const token = decodeURIComponent(match[1]);
  return token;
};

api.interceptors.request.use((config) => {
  const token = readDecodedXsrfToken();
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set('X-XSRF-TOKEN', token);
    config.headers = headers;
  }
  
  // Remove Content-Type header for FormData to let browser set it automatically
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Only logout on actual authentication failures, not all 401/403 errors
    const err = error as AxiosError;
    if (err?.response?.status === 401) {
      const responseData = err?.response?.data as any;
      const errorMessage = responseData?.message;
      // Only logout if it's an authentication error, not other 401 errors
      if (errorMessage === 'Invalid credentials' || errorMessage?.includes('Unauthenticated')) {
        queryClient.setQueryData(['auth-user'], null);
      }
    }
    return Promise.reject(error);
  }
);

export default api;