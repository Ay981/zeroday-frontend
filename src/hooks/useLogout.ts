import { useMutation } from '@tanstack/react-query';
import { logoutRequest } from '../api/auth';
import { queryClient } from '../lib/queryClient';
import { useNavigate } from 'react-router-dom';
import { sileo } from 'sileo';

export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['auth-user'] });
      queryClient.setQueryData(['auth-user'], null);
    },
    mutationFn: logoutRequest,
    onSuccess: () => {
      queryClient.setQueryData(['auth-user'], null);
      navigate('/login');
    },
    onError: () => {
      sileo.error({
        title: 'Logout Failed',
        description: 'Unable to terminate the server session. Please retry.',
      });
    },
  });
};
