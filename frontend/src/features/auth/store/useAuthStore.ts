import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { UserRole } from '../../../constants/constants';
import { authService } from '../service/authService';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  activeRole: UserRole;
  timezone:string;
  hasProfile: boolean;
  isVerified: boolean;
  profilePic?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setHasProfile: (status: boolean) => void;
  clearAuth: () => void;
  logOut:()=>void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: true,

        setUser: (user) =>
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          }),

        clearAuth: () =>
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          }),
        logOut:async()=>{
          await authService.logout();
          get().clearAuth();
        },
        setHasProfile: (status) =>
          set((state) => ({
            user: state.user ? { ...state.user, hasProfile: status } : null,
          })),

        setLoading: (loading) => set({ isLoading: loading }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user
          ? { ...state.user, profilePic: undefined } // don't persist the signed URL
          : null,
          
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);
