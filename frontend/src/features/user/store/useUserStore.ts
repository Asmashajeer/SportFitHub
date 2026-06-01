import { create } from 'zustand';
import { userService } from '../service/userService';
import type { GenderType, RelationType } from '@/constants/constants';

export interface UserState {
  profile: Profile | null;
  isLoading: boolean;
  setProfile: (profile: Profile) => void;
  fetchProfile: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: false,
  setProfile: (profile: Profile) => set({ profile }),
  fetchProfile: async () => {
    set({ isLoading: true });
    const data = await userService.getProfile();
    set({ profile: data.profile, isLoading: false });
  },
}));

interface address {
  street?: string;
  city?: string;
  zip?: string;
}
interface location {
  type: 'Point';
  coordinates: [number, number];
}
interface Profile {
  id: string;
  userId: string;
  fullName: string;
  DOB: Date;
  gender: GenderType;
  phone: string;
  relationship: RelationType;
  address: address;
  location?: location;
  profilePic: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}
