import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sileo } from "sileo"; // Import Sileo
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';
import type { ReportFormData } from '../types/schemas';

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: ReportFormData) => {
      const response = apiClient.post('/reports', data);
      
      // We wrap the actual request promise in Sileo
      sileo.promise(response, {
        loading: { title: "Encrypting...", description: "Securing vulnerability data" },
        success: { title: "Created", description: "Report added to database" },
        error: { title: "Breach Failed", description: "Check terminal for errors" },
      });

      return (await response).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      navigate('/dashboard');
    },
  });
};