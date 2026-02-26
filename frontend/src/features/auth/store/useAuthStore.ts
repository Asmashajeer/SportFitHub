import { create } from "zustand";
import { devtools, persist} from "zustand/middleware";

import type { UserRole } from "../../../constants/constants";

export interface User {
  id: string;
  name:string;
  email: string;
  role: UserRole;
  hasProfile: boolean;
  isVerified:boolean;
  profilePic?:string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setHasProfile: (status: boolean) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
    (set) => ({
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

      setHasProfile: (status) =>
        set((state) => ({
          user: state.user ? { ...state.user, hasProfile: status } : null,
        })),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage",      
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  ))
);
