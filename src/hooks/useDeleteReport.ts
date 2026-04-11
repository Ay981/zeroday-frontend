import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';
import { sileo } from "sileo"; 

export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (slug: string) => {
      // 1. Capture the request promise
      const promise = apiClient.delete(`/reports/${slug}`);

      // 2. Hand it to Sileo IMMEDIATELY
      sileo.promise(promise, {
        loading: { title: "Purging Logs...", description: "Removing vulnerability from terminal." },
        success: { title: "Wiped", description: "Report successfully deleted." },
        error: { title: "Access Denied", description: "Purge sequence failed." },
      });

      // 3. Wait for the actual request to finish
      return await promise;
    },
    onSuccess: () => {
      // 4. Invalidate cache so the list updates
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      
      // 5. Navigate back to feed after a short delay so they see the success toast
      setTimeout(() => navigate('/dashboard'), 500);
    },
  });
};