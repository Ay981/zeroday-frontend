import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';
import type { ReportFormData } from '../types/schemas';
import { sileo } from "sileo"; // Import Sileo

export const useUpdateReport = (slug: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: ReportFormData) => {
      // Laravel expects a PUT or PATCH request for updates
      const responsePromise = apiClient.patch(`/reports/${slug}`, data);
      sileo.promise(responsePromise, {
        loading: { title: "Encrypting...", description: "Securing vulnerability data" },
        success: { title: "Report Updated", description: "Changes saved successfully" },
        error: { title: "Breach Failed", description: "Check terminal for errors" },
      });
      const response = await responsePromise;
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