import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sileo } from "sileo"; // Import Sileo
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = apiClient.post('/api/v1/reports', data);
      
      // We wrap the actual request promise in Sileo
      sileo.promise(response, {
        loading: { title: "Encrypting...", description: "Securing vulnerability data" },
        success: { title: "Created", description: "Report added to database" },
        error: { title: "Breach Failed", description: "Check terminal for errors" },
      });

      return (await response).data;
    },
    // src/hooks/useCreateReport.ts
    onSuccess: () => {
      // Invalidate the reports feed
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      
      // CRITICAL: Invalidate the user so the reputation/level updates instantly
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      
      sileo.success({ title: "Points Awarded", description: "Reputation updated." });
      navigate('/dashboard');
    },
  });
};