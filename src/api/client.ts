import axios, { AxiosHeaders, type AxiosError } from 'axios';
import { queryClient } from '../lib/queryClient';

const API_BASE_URL = 'https://api.zeroday.aymenabdulkerim.dev';
const AUTH_USER_QUERY_KEY = ['auth-user'] as const;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const readDecodedXsrfToken = (): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
};

const getResponseMessage = (error: AxiosError): string | undefined => {
  const data = error.response?.data;
  return typeof data === 'object' && data !== null && 'message' in data
    ? String(data.message)
    : undefined;
};

const isUnauthenticatedError = (error: AxiosError): boolean => {
  if (error.response?.status !== 401) {
    return false;
  }

  const message = getResponseMessage(error);
  return message === 'Invalid credentials' || message?.includes('Unauthenticated') === true;
};

api.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers);
  const token = readDecodedXsrfToken();

  if (token) {
    headers.set('X-XSRF-TOKEN', token);
  }

  if (config.data instanceof FormData) {
    headers.delete('Content-Type');
  }

  config.headers = headers;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (isUnauthenticatedError(error)) {
      queryClient.setQueryData(AUTH_USER_QUERY_KEY, null);
    }

    return Promise.reject(error);
  }
);

export default api;
