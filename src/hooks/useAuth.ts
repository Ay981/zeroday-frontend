import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { User } from '../types/report';

export const useAuth = () => {
  return useQuery<User | null>({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const response = await apiClient.get('/user');
      return response.data?.data ?? null;
    },
    // Only fetch if a token exists
    enabled: !!localStorage.getItem('token'), 
    // Keep the user data "fresh" for longer since it rarely changes
    staleTime: Infinity, 
  });
};