import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';
import type { ReportFormData } from '../types/schemas';

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: ReportFormData) => {
      const response = await apiClient.post('/reports', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      navigate('/dashboard');
    },
  });
};