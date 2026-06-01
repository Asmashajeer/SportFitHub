import type { StateCreator } from 'zustand';
import type { FitnessData, SportData } from './types';

export interface CategorySlice {
  sports: SportData[] | null;
  setSports: (data: SportData[]) => void;
  addSport: (newSport: SportData) => void;

  updateSport: (sport: SportData) => void;
  deleteSport: (id: string) => void;

  programs: FitnessData[] | null;
  setPrograms: (data: FitnessData[]) => void;
  addProgram: (newProgram: FitnessData) => void;
  updateProgram: (program: FitnessData) => void;
  deleteProgram: (id: string) => void;
}
export const createCategorySlice: StateCreator<CategorySlice> = (set) => ({
  sports: null,
  setSports: (data) => set({ sports: data }),
  addSport: (newSport) =>
    set((state) => ({
      sports: [...(state.sports || []), newSport],
    })),
  updateSport: (sport) =>
    set((state) => ({
      sports: state.sports?.map((s) => (s.id === sport.id ? { ...sport } : s)),
    })),

  deleteSport: (id) =>
    set((state) => ({
      sports: state.sports?.filter((s) => s.id !== id),
    })),
  // -----------------------fitnessprogram------------
  programs: [],
  setPrograms: (data) => set({ programs: data }),
  addProgram: (newProgram) =>
    set((state) => ({
      programs: [...(state.programs || []), newProgram],
    })),
  updateProgram: (program) =>
    set((state) => ({
      programs: state.programs?.map((s) =>
        s.id === program?.id ? { ...program } : s
      ),
    })),
  deleteProgram: (id) =>
    set((state) => ({
      programs: state.programs?.filter((s) => s.id !== id),
    })),
});
