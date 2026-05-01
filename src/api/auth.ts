import api from './client';
import type { AxiosError } from 'axios';
import { queryClient } from '../lib/queryClient';
import type { User } from '../types/report';

type Credentials = {
  email: string;
  password: string;
};

const isCsrfExpiredError = (error: unknown) => {
  const err = error as AxiosError;
  return err?.response?.status === 419;
};

const withCsrfRetry = async <T>(action: () => Promise<T>): Promise<T> => {
  await ensureCsrf();
  try {
    return await action();
  } catch (error) {
    if (!isCsrfExpiredError(error)) throw error;
    await ensureCsrf();
    return action();
  }
};

export const ensureCsrf = async () => {
  try {
    await api.get('/sanctum/csrf-cookie');
  } catch (error) {
    const err = error as AxiosError;
    // For network errors, provide a clear error message
    if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
      throw new Error('Unable to connect to the server. Please check your internet connection and ensure the backend server is running.');
    }
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const resp = await api.get('/api/v1/user');
    const user = (resp.data?.data ?? resp.data ?? null) as User | null;
    queryClient.setQueryData(['auth-user'], user);
    return user;
  } catch (error) {
    const err = error as AxiosError;
    console.debug('[auth] getCurrentUser error:', err?.response?.status, err?.response?.data);
    // Only clear auth state on actual authentication failures
    if (err?.response?.status === 401) {
      const responseData = err?.response?.data as any;
      const errorMessage = responseData?.message;
      if (errorMessage === 'Invalid credentials' || errorMessage?.includes('Unauthenticated')) {
        queryClient.setQueryData(['auth-user'], null);
        return null;
      }
    }
    // Don't clear auth state for other errors (network, 500, etc.)
    return null;
  }
};

export const loginRequest = async (credentials: Credentials) => {
  const resp = await withCsrfRetry(() => api.post('/api/v1/login', credentials));

  const userFromLogin = (resp.data?.user ?? null) as User | null;
  if (userFromLogin) {
    queryClient.setQueryData(['auth-user'], userFromLogin);
  } else {
    await getCurrentUser();
  }

  queryClient.invalidateQueries({ queryKey: ['reports'] });
  return resp.data;
};

export const logoutRequest = async () => {
  await withCsrfRetry(() => api.post('/api/v1/logout'));

  queryClient.setQueryData(['auth-user'], null);
  queryClient.removeQueries({ queryKey: ['reports'] });
  queryClient.removeQueries({ queryKey: ['report'] });
};

export const registerUser = async (payload: unknown) => {
  const resp = await withCsrfRetry(() => api.post('/api/v1/register', payload));

  const userFromRegister = (resp.data?.user ?? null) as User | null;
  if (userFromRegister) {
    queryClient.setQueryData(['auth-user'], userFromRegister);
  }

  // Do NOT call getCurrentUser automatically; some backends do not
  // immediately persist sessions after register. Let the caller decide
  // whether to refresh auth. Always return the server response so the UI
  // can navigate to /verify regardless of auth state.
  queryClient.invalidateQueries({ queryKey: ['reports'] });
  return resp.data;
};

// Helper to get the current user's email from the query cache
function getCurrentUserEmail(): string | null {
  const user = queryClient.getQueryData(['auth-user']) as User | null;
  return user?.email ?? null;
}

export const sendOtp = async (email?: string) => {
  const userEmail = email || getCurrentUserEmail();
  if (!userEmail) throw new Error('No email found for OTP send');
  const resp = await withCsrfRetry(() => api.post('/api/v1/otp/send', { email: userEmail }));
  return resp.data;
};

export const verifyOtp = async (payload: { otp: string; email?: string }) => {
  // Always include email in the payload
  const userEmail = payload.email || getCurrentUserEmail();
  if (!userEmail) throw new Error('No email found for OTP verification');
  const fullPayload = { otp: payload.otp, email: userEmail };

  const resp = await withCsrfRetry(() => api.post('/api/v1/register/verify', fullPayload));
  const userFromVerify = (resp.data?.user ?? null) as User | null;
  if (userFromVerify) {
    queryClient.setQueryData(['auth-user'], userFromVerify);
  } else {
    await getCurrentUser();
  }

  queryClient.invalidateQueries({ queryKey: ['reports'] });

  return resp.data;
};
