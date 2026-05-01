import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { Program } from '../types/report';
import { useAuth } from './useAuth';

export const usePrograms = () => {
  const { data: user } = useAuth();
  
  return useQuery<Program[]>({
    queryKey: ['programs'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/programs');
      return response.data.data;
    },
    enabled: !!user, // Only run query if user is authenticated
  });
};