import type { StateCreator } from 'zustand';

import {
  DOC_VERIFY_STATUS,
  GOVT_ID_TYPE,
  TRAINER_STATUS,
  type GenderType,
  type TRAINER_CATEGORY,
} from '@/constants/constants';

//--------------- Trainer Slice--------------

export interface TrainerSlice {
  pendingTrainers: TrainerOverView[] | null;
  trainerLoading: boolean;
  selectedTrainer: TrainerProfileData | null;
  setTrainerLoading: (loading: boolean) => void;
  setSelectedTrainer: (trainer: TrainerProfileData) => void;
  setPendingTrainers: (trainer: TrainerOverView[]) => void;
  removeTrainerFromList: (trainerId: string) => void;
}
export const createTrainerSlice: StateCreator<TrainerSlice> = (set) => ({
  pendingTrainers: [],
  trainerLoading: false,
  selectedTrainer: null,
  setTrainerLoading: (loading) => set({ trainerLoading: loading }),
  setSelectedTrainer: (trainer: TrainerProfileData) => set({ selectedTrainer: trainer }),
  setPendingTrainers: (trainers) => set({ pendingTrainers: trainers }),
  removeTrainerFromList: (trainerId) =>
    set((state) => ({
      pendingTrainers: state.pendingTrainers?.filter((t) => t.id !== trainerId),
    })),
});

// ---------------------------------------------------------------------------

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
  verificationRemarks: {
    fields: string[],
    changedAt: string, 
  },
  createdAt: Date; // Timestamps
  certCount: number;
}

interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}
export interface ICertification {
  id:string,
  name: string;
  url: string;
  validUpto: Date;
  issuedAt: Date;
}
interface IDayAvailability {
  available: boolean;
  startTime?: string;
  endTime?: string;
}

export interface Trainer {
  id: string;
  userId: string;
  category: (typeof TRAINER_CATEGORY)[keyof typeof TRAINER_CATEGORY]; // basic Info Branding
  displayName: string;
  coreDiscipline: string;
  bio?: string;
  specialties: string[];
  experience: number;
  languages: string[];
  profilePic: string;
  pricing: {
    sessionCharge: number;
    currency: string;
  };
  personalInfo: {
    // Personal Info
    fullName: string;
    DOB: string;
    gender: GenderType;
    phone: string;
    address: IAddress;
  };
  certificationInfo: {
    
    documents: ICertification[];
    verified: boolean;
    status: (typeof DOC_VERIFY_STATUS)[keyof typeof DOC_VERIFY_STATUS];
    verifiedAt?: string;
    rejectReason?: string;
  };
  idVerification: {
    // id &verification
    idType: (typeof GOVT_ID_TYPE)[keyof typeof GOVT_ID_TYPE];
    idNumber: string;
    idAttachment: string;
    verified: boolean;
    status: (typeof DOC_VERIFY_STATUS)[keyof typeof DOC_VERIFY_STATUS];
    verifiedAt?: string;
    rejectReason?: string;
  };
  currentLocation: {
    // Location
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  availability: {
    // availability
    isAvailable: boolean;
    Monday: IDayAvailability;
    Tuesday: IDayAvailability;
    Wednesday: IDayAvailability;
    Thursday: IDayAvailability;
    Friday: IDayAvailability;
    Saturday: IDayAvailability;
    Sunday: IDayAvailability;
  };
  paymentInfo: {
    // payment Data
    bankAccount?: {
      accountName?: string;
      accountNumber?: string;
      bankName?: string;
      ifscCode?: string;
    };
    upiId?: string;
  };
  status: (typeof TRAINER_STATUS)[keyof typeof TRAINER_STATUS]; // Administrative State
  verificationRemarks: {
    fields: string[],
    changedAt: string, 
  },
  suspensionReason?: string;
  suspendedAt?: string;
  rejectionReason?: string;
  rejectedAt?: string;
  applicationCount: number;  
  penalty:number
  strikePoints:number;
  cancellationCount: number,
   lastStrikeDate?:string
  createdAt: string; // Timestamps
  updatedAt: string;
}

export interface TrainerProfileData extends Trainer{
  email:string,
  fcmToken?:string
}