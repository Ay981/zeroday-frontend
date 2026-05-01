import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Props {
  mode: 'protected' | 'guest';
}

export const AuthRoute = ({ mode }: Props) => {
  const { data: user, isLoading } = useAuth();

  if (isLoading) return null; // or a spinner

  // Protected: require authenticated user
  if (mode === 'protected' && !user) return <Navigate to="/login" replace />;

  // If user is authenticated but not verified, force them to /verify
  const location = useLocation();
  if (user && user.is_verified === false && location.pathname !== '/verify') {
    return <Navigate to="/verify" replace />;
  }

  // Guest: redirect authenticated users away from auth pages
  if (mode === 'guest' && user) {
    // Redirect verified users to dashboard; unverified users to verify page
    return <Navigate to={user.is_verified === false ? '/verify' : '/dashboard'} replace />;
  }

  return <Outlet />;
};