import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '../api/client';
import type { Report } from '../types/report';
import type { PaginatedResponse } from '../types/Pagination';

export const useReports = (page = 1, search = '', severity = '', aiMode = false) => {
  return useQuery<PaginatedResponse<Report>>({
    // CRITICAL: Include aiMode in the queryKey so the cache stays separate
    queryKey: ['reports', { page, search, severity, aiMode }], 
    queryFn: async () => {
      const response = await api.get('/api/v1/reports', {
        params: { 
          page, 
          search, 
          severity, 
          ai_mode: aiMode // Send the flag to Laravel
        }
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};
export const useReport = (slug: string) => {
  return useQuery<Report>({
    queryKey: ['report', slug],
    queryFn: async () => {
      const response = await api.get(`/api/v1/reports/${slug}`);
      return response.data.data ?? response.data;
    },
  });
};

