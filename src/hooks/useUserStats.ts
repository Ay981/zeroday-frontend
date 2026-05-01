import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import { useAuth } from './useAuth';

interface UserStats {
  stats: {
    total_reports: number;
    critical_count: number;
    open_bugs: number;
  };
  recent_activity: unknown[];
}

export const useUserStats = () => {
  const { data: user } = useAuth();
  
  return useQuery<UserStats>({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/user/stats');
      return response.data;
    },
    enabled: !!user, // Only run query if user is authenticated
  });
};