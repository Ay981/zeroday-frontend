import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';

export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (slug: string) => {
      await apiClient.delete(`/reports/${slug}`);
    },
    onSuccess: () => {
      // Refresh the feed
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      // Go back to dashboard
      navigate('/dashboard');
    },
  });
};