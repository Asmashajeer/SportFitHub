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

export interface TrainerOverView {
  id: string;
  userId: string;
  category: (typeof TRAINER_CATEGORY)[keyof typeof TRAINER_CATEGORY]; // basic Info Branding
  displayName: string;
  specialties: string[];
  experience: number;
  profilePic: string;
  personalInfo: {
    // Personal Info
    fullName: string;
    phone: string;
  };
  status: (typeof TRAINER_STATUS)[keyof typeof TRAINER_STATUS]; //trainerStatus
  createdAt: Date; // Timestamps
  certCount: number;
}