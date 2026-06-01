import type { TRAINER_CATEGORY, TRAINER_STATUS } from "@/constants/constants";

export interface AdminTrainersData{
     id: string;
  userId: string;
  email:string,
  // basic Info Branding
  category: typeof TRAINER_CATEGORY [keyof typeof TRAINER_CATEGORY];
  displayName: string;
  coreDiscipline: string;
  specialties: string[];
  experience: number;
  languages: string[];
  isCertsVerified:boolean,
  isIdVerified:boolean,
  status: typeof TRAINER_STATUS [keyof typeof TRAINER_STATUS];
  createdAt: string; 
}
