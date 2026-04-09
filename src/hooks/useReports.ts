import { useQuery, keepPreviousData } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { Report } from '../types/report';
import type { PaginatedResponse } from '../types/Pagination';

export const useReports = (page = 1, search = '', severity = '') => {
  return useQuery<PaginatedResponse<Report>>({
    // CRITICAL: Every unique search/severity combination gets its own cache key
    queryKey: ['reports', { page, search, severity }], 
    queryFn: async () => {
      const response = await apiClient.get('/reports', {
        params: { page, search, severity } // Axios handles the ?search=... part
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
      const response = await apiClient.get(`/reports/${slug}`);
      return response.data.data;
    },
  });
};

