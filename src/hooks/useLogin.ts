import { useMutation } from '@tanstack/react-query';
import { loginRequest } from '../api/auth';
import { queryClient } from '../lib/queryClient';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });

      // Backend may return flags in different shapes. Check common ones.
      const requiresVerification = Boolean(
        data?.requires_verification ||
        data?.requiresVerification ||
        data?.requires_verification === true ||
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
