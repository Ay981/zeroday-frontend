import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { useNavigate } from 'react-router-dom';

type LoginCredentials = {
  email: string;
  password: string;
};

type LoginResponse = {
  requires_verification?: boolean;
  requiresVerification?: boolean;
  user?: {
    otp_verified?: boolean;
    is_verified?: boolean;
  } | null;
};

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { loginRequest } = await import('../api/auth');
      return loginRequest(credentials);
    },
    onSuccess: (data: LoginResponse) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });

      const requiresVerification = Boolean(
        data?.requires_verification ||
        data?.requiresVerification ||
        data?.user?.otp_verified === false ||
        data?.user?.is_verified === false
      );

      if (requiresVerification) {
        navigate('/verify');
      } else {
        navigate('/dashboard');
      }
    },
  });
};
