import { create } from 'zustand';
import { createUserSlice, type UserSlice } from './userSlice';
import { createTrainerSlice, type TrainerSlice } from './trainerSlice';

import { createCategorySlice, type CategorySlice } from './categorySlice';

export type AdminState = UserSlice &
  TrainerSlice &
  CategorySlice & {
    clearAdminData: () => void;
  };

export const UseAdminStore = create<AdminState>()((set, get, ...a) => ({
  ...createUserSlice(set, get, ...a),
  ...createTrainerSlice(set, get, ...a),
  ...createCategorySlice(set, get, ...a),
  clearAdminData: () => get().resetUserSlice(),
}));
