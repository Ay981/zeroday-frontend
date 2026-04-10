import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

interface UserStats {
  stats: {
    total_reports: number;
    critical_count: number;
    open_bugs: number;
  };
  recent_activity: unknown[];
}

export const useUserStats = () => {
  return useQuery<UserStats>({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const response = await apiClient.get('/user/stats');
      return response.data;
    },
  });
};