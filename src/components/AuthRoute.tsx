import { useQueryClient } from '@tanstack/react-query';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types/report';

interface Props {
  mode: 'protected' | 'guest';
}

export const AuthRoute = ({ mode }: Props) => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const shouldCheckSession = mode === 'protected';
  const cachedUser = queryClient.getQueryData<User | null>(['auth-user']);
  const { data: fetchedUser, isLoading } = useAuth({ enabled: shouldCheckSession });
  const user = shouldCheckSession ? fetchedUser : cachedUser;

  if (shouldCheckSession && isLoading) {
    return null;
  }

  if (mode === 'protected' && !user) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.is_verified === false && location.pathname !== '/verify') {
    return <Navigate to="/verify" replace />;
  }

  if (mode === 'guest' && user) {
    return <Navigate to={user.is_verified === false ? '/verify' : '/dashboard'} replace />;
  }

  return <Outlet />;
};
