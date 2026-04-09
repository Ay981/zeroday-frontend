import { Navigate, Outlet } from 'react-router-dom';

interface Props {
  mode: 'protected' | 'guest';
}

export const AuthRoute = ({ mode }: Props) => {
  const token = localStorage.getItem('token');

  // Logic 1: Protected Mode (Keep guests out)
  if (mode === 'protected' && !token) {
    return <Navigate to="/login" replace />;
  }

  // Logic 2: Guest Mode (Keep hackers out of login once they are in)
  if (mode === 'guest' && token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, proceed to the requested page
  return <Outlet />;
};