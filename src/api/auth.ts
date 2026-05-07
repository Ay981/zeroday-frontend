import axios from 'axios';
import api from './client';
import { queryClient } from '../lib/queryClient';
import type { User } from '../types/report';

type Credentials = {
  email: string;
  password: string;
};

type AuthResponse = {
  user?: User | null;
  requires_verification?: boolean;
  requiresVerification?: boolean;
};

type ApiUserResponse = User | { data?: User | null } | null;

const AUTH_USER_QUERY_KEY = ['auth-user'] as const;
const REPORTS_QUERY_KEY = ['reports'] as const;
const REPORT_QUERY_KEY = ['report'] as const;
const CONNECTION_ERROR_CODES = new Set(['ECONNREFUSED', 'ERR_NETWORK']);

const getResponseMessage = (data: unknown): string | undefined => {
  return typeof data === 'object' && data !== null && 'message' in data
    ? String(data.message)
    : undefined;
};

const isUnauthenticatedError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error) || error.response?.status !== 401) {
    return false;
  }

  const message = getResponseMessage(error.response.data);
  return message === 'Invalid credentials' || message?.includes('Unauthenticated') === true;
};

const isCsrfExpiredError = (error: unknown): boolean => {
  return axios.isAxiosError(error) && error.response?.status === 419;
};

const isUserEnvelope = (payload: ApiUserResponse): payload is { data?: User | null } => {
  return typeof payload === 'object' && payload !== null && 'data' in payload;
};

const extractUser = (payload: ApiUserResponse): User | null => {
  if (!payload) {
    return null;
  }

  return isUserEnvelope(payload) ? payload.data ?? null : payload;
};

const cacheAuthUser = (user: User | null) => {
  queryClient.setQueryData(AUTH_USER_QUERY_KEY, user);
};

const refreshReportQueries = () => {
  queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEY });
};

const getCurrentUserEmail = (): string | null => {
  const user = queryClient.getQueryData<User | null>(AUTH_USER_QUERY_KEY);
  return user?.email ?? null;
};

const withCsrfRetry = async <T>(action: () => Promise<T>): Promise<T> => {
  await ensureCsrf();

  try {
    return await action();
  } catch (error) {
    if (!isCsrfExpiredError(error)) {
      throw error;
    }

    await ensureCsrf();
    return action();
  }
};

export const ensureCsrf = async () => {
  try {
    await api.get('/sanctum/csrf-cookie');
  } catch (error) {
    if (axios.isAxiosError(error) && CONNECTION_ERROR_CODES.has(error.code ?? '')) {
      throw new Error(
        'Unable to connect to the server. Please check your internet connection and ensure the backend server is running.'
      );
    }

    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await api.get<ApiUserResponse>('/api/v1/user');
    const user = extractUser(data);
    cacheAuthUser(user);
    return user;
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      cacheAuthUser(null);
    }

    return null;
  }
};

export const loginRequest = async (credentials: Credentials) => {
  const { data } = await withCsrfRetry(() => api.post<AuthResponse>('/api/v1/login', credentials));

  if (data.user) {
    cacheAuthUser(data.user);
  } else {
    await getCurrentUser();
  }

  refreshReportQueries();
  return data;
};

export const logoutRequest = async () => {
  await withCsrfRetry(() => api.post('/api/v1/logout'));

  cacheAuthUser(null);
  queryClient.removeQueries({ queryKey: REPORTS_QUERY_KEY });
  queryClient.removeQueries({ queryKey: REPORT_QUERY_KEY });
};

export const registerUser = async (payload: unknown) => {
  const { data } = await withCsrfRetry(() => api.post<AuthResponse>('/api/v1/register', payload));

  if (data.user) {
    cacheAuthUser(data.user);
  }

  refreshReportQueries();
  return data;
};

export const sendOtp = async (email?: string) => {
  const userEmail = email || getCurrentUserEmail();
  if (!userEmail) {
    throw new Error('No email found for OTP send');
  }

  const { data } = await withCsrfRetry(() => api.post('/api/v1/otp/send', { email: userEmail }));
  return data;
};

export const verifyOtp = async (payload: { otp: string; email?: string }) => {
  const userEmail = payload.email || getCurrentUserEmail();
  if (!userEmail) {
    throw new Error('No email found for OTP verification');
  }

  const { data } = await withCsrfRetry(() =>
    api.post<AuthResponse>('/api/v1/register/verify', {
      otp: payload.otp,
      email: userEmail,
    })
  );

  if (data.user) {
    cacheAuthUser(data.user);
  } else {
    await getCurrentUser();
  }

  refreshReportQueries();
  return data;
};
