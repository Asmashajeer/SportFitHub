import type { DOC_VERIFY_STATUS, GenderType, GOVT_ID_TYPE, TRAINER_CATEGORY, TRAINER_STATUS } from "@/constants/constants";
import { create } from "zustand";
import { trainerService } from "../service/trainerService";


export interface TrainerState{
    profile:Trainer |null; 
    isLoading:boolean;
    setProfile:(profile:Trainer)=>void,
    fetchProfile:()=>void;
    
}

export const useTrainerStore= create<TrainerState>((set,get)=>({
    profile:null,
    isLoading:false,
    setProfile:(profile:Trainer)=>set({profile}),
    fetchProfile:async()=>{
        set({isLoading:true});
        const data= await trainerService.getProfile();
        set({profile:data.profile,isLoading:false})
    },
        
}));






interface IAddress {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  }
  
  export interface ICertification {
    name: string;
    url: string;
    validUpto: Date ,
    issuedAt: Date
  }
  interface IDayAvailability {
    available: boolean;
    startTime?: string; 
    endTime?: string;   
  }

export interface Trainer{  
    id: string;
    userId: string;    
    category:typeof TRAINER_CATEGORY[keyof typeof TRAINER_CATEGORY ];// basic Info Branding
    displayName: string;
    coreDiscipline: string;
    bio?: string;
    specialties: string[];
    experience: number;
    languages: string[];
    profilePic:string,
    pricing:{
      sessionCharge: number,   
      currency:string,
    }   
    personalInfo: {        // Personal Info
      fullName: string;
      DOB: string;
      gender: GenderType
      phone: string;
      address: IAddress;
    };    
    certificationInfo: {    // certificates & Verification 
      documents: ICertification[];
      verified: boolean;
      status: typeof DOC_VERIFY_STATUS[keyof typeof DOC_VERIFY_STATUS ];
      verifiedAt?: string;
      rejectReason?:string;
    };   
    idVerification: {// id &verification
      idType: typeof GOVT_ID_TYPE[keyof typeof GOVT_ID_TYPE ];
      idNumber: string;
      idAttachment: string;
      verified: boolean;
      status: typeof DOC_VERIFY_STATUS[keyof typeof DOC_VERIFY_STATUS ];
      verifiedAt?: string;
      rejectReason?:string;
    };   
    currentLocation: { // Location 
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
    availability: {   // availability
      isAvailable: boolean;
      Monday:    IDayAvailability;
      Tuesday:   IDayAvailability;
      Wednesday: IDayAvailability;
      Thursday:  IDayAvailability;
      Friday:    IDayAvailability;
      Saturday:  IDayAvailability;
      Sunday:    IDayAvailability;
    };
    paymentInfo: {// payment Data
      bankAccount?: {
        accountName?: string;
        accountNumber?: string;
        bankName?: string;
        ifscCode?: string;
      };
      upiId?: string;
    };   
    status: typeof TRAINER_STATUS [keyof typeof TRAINER_STATUS]; // Administrative State
    suspensionReason?: string;
    suspendedAt?: string;
    rejectionReason?: string;
    rejectedAt?: string;
    applicationCount: number;  
    createdAt: string;   // Timestamps 
    updatedAt: string;
}