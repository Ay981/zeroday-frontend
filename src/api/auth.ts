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
    await apiClient.post('/logout');
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Logout API failed:', error);
    }
    // Optional: send to monitoring service instead
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

export const registerUser = async (data: unknown) => {
  const response = await apiClient.post('/register', data);
  
  // Persist the session
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));

  return response.data;
};
