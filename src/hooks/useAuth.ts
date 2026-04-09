import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

export const useAuth = () => {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const response = await apiClient.get('/user');
      return response.data;
    },
    // Only fetch if a token exists
    enabled: !!localStorage.getItem('token'), 
    // Keep the user data "fresh" for longer since it rarely changes
    staleTime: Infinity, 
  });
};