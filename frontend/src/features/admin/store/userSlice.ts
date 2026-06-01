import type { UserRole } from '../../../constants/constants';
import type { StateCreator } from 'zustand';
import { userManagementService } from '../service/userManagementService';

export interface UserSlice {
  users: Users[];
  userStats: UserStats | null;
  setUsers: (users: Users[]) => void;
  setUserStats: (userStats: UserStats) => void;
  fetchStats: () => void;
  updateUser: (user: Users) => void;
  removeUser: (id: string) => void;
  resetUserSlice: () => void;
}

//--------------------------------userSlice----------------
export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  users: [],
  userStats: {
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
  },

  setUsers: (users: Users[]) => set({ users }),
  setUserStats: (userStats: UserStats) => set({ userStats }),
  fetchStats: async () => {
    try {
      const stats = await userManagementService.getStats();
      set({ userStats: stats.userStats });
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  },
  updateUser: (updatedUser: Users) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === updatedUser.id ? { ...updatedUser } : user
      ),
    })),

  removeUser: (id: string) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),

  resetUserSlice: () =>
    set({
      users: [],
      userStats: null,
    }),
});
//--------------------------------------------------------------

export interface Users {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  googleId?: string;
  isVerified: boolean;
  isBlocked: boolean;
  isActive: boolean;
  createdAt: Date;
}
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
}
