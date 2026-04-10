import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { Program } from '../types/report';

export const usePrograms = () => {
  return useQuery<Program[]>({
    queryKey: ['programs'],
    queryFn: async () => {
      const response = await apiClient.get('/programs');
      return response.data.data;
    },
  });
};