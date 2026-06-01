import { create } from 'zustand';

export interface SessionState {
  sports: Sport[];
  fitness: FitnessPgm[];
  setSports: (sports: Sport[]) => void;
  setFitness: (fitness: FitnessPgm[]) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sports: [],
  fitness: [],
  setSports: (sports: Sport[]) => set({ sports }),
  setFitness: (fitness: FitnessPgm[]) => set({ fitness }),
}));

export interface Sport {
  id: string;
  sportName: string;
  slug: string;
  icon?: string;
  description: string;
  isActive?: boolean;
}

export interface FitnessPgm {
  id: string;
  programName: string;
  slug: string;
  description: string;
  isActive?: boolean;
}
