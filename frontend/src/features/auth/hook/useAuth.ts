
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../service/authService';

export const useAuth = () => {
  const { setAuth,setAccessToken,setUser, clearAuth, setLoading, isLoading, user,isAuthenticated,accessToken } = useAuthStore();

  useEffect(() => {   
      const initialize = async () => {
      
      if (isAuthenticated && accessToken) {
        setLoading(false);
        return;
      }
         setLoading(true);
      try {
        const response = await authService.refresh(); 
        // new
        const accessToken = typeof response === 'string' ? response : response.accessToken;
        setAccessToken(accessToken);

        const data = await authService.getMe(accessToken);
        console.log("API SUCCESS: User data found",data);
        setUser(data);
      } catch (error) {
        console.log("API ERROR: No session found, clearing auth");
        clearAuth();
      } finally {
        console.log("FINALLY: Setting loading to false");
        setLoading(false);
      }
    };
    // if (isAuthenticated && !accessToken) {
          initialize();
        // } else {
        //   setLoading(false);
        // }
      }, []);

  return { isLoading};
  // , user,isAuthenticated 
};