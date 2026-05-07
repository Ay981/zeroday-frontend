import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../api/auth';
import type { User } from '../types/report';

type UseAuthOptions = {
  enabled?: boolean;
};

export const useAuth = ({ enabled = true }: UseAuthOptions = {}) => {
  return useQuery<User | null>({
    queryKey: ['auth-user'],
    queryFn: getCurrentUser,
    enabled,
    staleTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
