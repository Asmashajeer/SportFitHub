import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../service/authService';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { setUser, clearAuth, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        // 1. Try to get current user info using existing Access Cookie
        const data = await authService.getMe();
        setUser(data.user);
      } catch (error: unknown) {
        // 2. If Access Cookie is expired, try to Refresh

        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const errorData = error.response?.data;

          if (status === 401) {
            //for expired token 401
            try {
              await authService.refresh();
              const data = await authService.getMe();
              setUser(data.user);
            } catch (refreshError) {
              clearAuth();
            }
            return;
          }
          if (status === 403) {
            if (errorData?.message?.includes('blocked')) {
              console.error('User is blocked or unauthorized');
              toast.error('Your account has been deactivated. ');
            }
            clearAuth();
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [setUser, clearAuth, setLoading]);

  return { isLoading };
};
