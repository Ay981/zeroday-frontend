import apiClient from './client';

export const login = async (credentials: { email: string; password: string }) => {
  const { data } = await apiClient.post('/login', credentials);
  
  // 1. Save the token for the Interceptor to find
  localStorage.setItem('token', data.token);
  
  // 2. Save user info for the UI
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

export const logout = async () => {
  try {
    // 1. Tell Laravel to revoke the token
    await apiClient.post('/logout');
  } catch (error) {
    console.error("Session already expired or server unreachable");
  } finally {
    // 2. Clear local storage regardless of server response
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 3. Force a hard refresh to clear all React Query caches
    window.location.href = '/login';
  }
};