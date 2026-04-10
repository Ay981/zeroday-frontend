import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';
import { sileo } from "sileo"; 

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
         sileo.promise(Promise.resolve(), {
        loading: { title: "Encrypting...", description: "Securing vulnerability data" },
        success: { title: "Deleted", description: "Report removed from database" },
        error: { title: "Breach Failed", description: "Check terminal for errors" },
      });
      // Go back to dashboard
      navigate('/dashboard');
    },
  });
};