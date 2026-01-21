import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../service/authService';

export const useAuth = () => {
  const { setUser, clearAuth, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        // 1. Try to get current user info using existing Access Cookie
        const data = await authService.getMe();
        setUser(data);
      } catch (error) {
        // 2. If Access Cookie is expired, try to Refresh
        try {
          await authService.refresh();
          const data = await authService.getMe();
          setUser(data);
        } catch (refreshError) {
          // 3. If both fail, the session is expired
          console.error("Session expired, logging out...");
          clearAuth();
        }
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [setUser, clearAuth, setLoading]);

  return { isLoading };
};