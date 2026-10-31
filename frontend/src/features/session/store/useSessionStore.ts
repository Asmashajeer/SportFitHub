import { create } from 'zustand';
import { sportSessionService } from '../service/sportSessionService';
import { fitnessSessionService } from '../service/fitnessSessionService ';
import type { FitnessData, SportData } from '@/features/admin/store/types';

export interface SessionState {
  sports: SportData[];
  fitness: FitnessData[];
  setSports: (sports: SportData[]) => void;
  setFitness: (fitness: FitnessData[]) => void;
   loadSports:()=>void,
  loadFitness:()=>void
}

export const useSessionStore = create<SessionState>((set) => ({
  sports: [],
  fitness: [],
  setSports: (sports: SportData[]) => set({ sports }),
  setFitness: (fitness:FitnessData[]) => set({ fitness }),
  loadSports:async()=>{
    const data= await sportSessionService.getAvailableSports();
    set({sports:data.sports})
  },
  loadFitness:async()=>{
    const data= await fitnessSessionService.getAvailableFitnessPgms();
    set({fitness:data.fitnessPgms})
  },
}));

// export interface Sport {
//   id: string;
//   sportName: string;
//   slug: string;
//   icon?: string;
//   description: string;
//   isActive?: boolean;
// }

// export interface FitnessPgm {
//   id: string;
//   programName: string;
//   slug: string;
//   description: string;
//   isActive?: boolean;
// }
