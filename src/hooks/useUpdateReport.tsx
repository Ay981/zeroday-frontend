import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';
import type { ReportFormData } from '../types/schemas';

export const useUpdateReport = (slug: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: ReportFormData) => {
      // Laravel expects a PUT or PATCH request for updates
      const response = await apiClient.patch(`/reports/${slug}`, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate both the list and this specific report
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['report', slug] });
      navigate(`/dashboard/reports/${slug}`);
    },
  });
};