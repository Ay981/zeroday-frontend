import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../api/auth';
import type { User } from '../types/report';

export const useAuth = () => {
  return useQuery<User | null>({
    queryKey: ['auth-user'],
    queryFn: getCurrentUser,
    staleTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};