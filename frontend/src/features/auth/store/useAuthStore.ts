// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '../../../constants/constants';

export interface User {
  id: string; 
  // name:string, 
  email: string;
  role: UserRole;
  hasProfile: boolean;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; 
  // Actions to update the state
  setAuth: (user: User,accessToken: string) => void;
  setAccessToken: (token: string)=>void;
  setUser: (user:User)=>void;
  setHasProfile: (status: boolean) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // INITIAL STATE
      user: null,
      accessToken:  null,
      isAuthenticated: false,
      isLoading: true,      

      // ACTIONS ( to change the state)      
      
      setAuth: (user, accessToken) => set({ 
        user, 
        accessToken, 
        isAuthenticated: true, 
        isLoading: false 
      }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearAuth: () => {
       set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
        localStorage.removeItem('otpExpiry');
      },

      //  Update hasProfile 
      setHasProfile: (status: boolean) => 
        set((state) => ({
          user: state.user ? { ...state.user, hasProfile: status } : null
        })),

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage', // The key name in  LocalStorage
      partialize: (state) => ({ 
          user: state.user, 
          // isAuthenticated: state.isAuthenticated 
        }), 
    }
  )
);