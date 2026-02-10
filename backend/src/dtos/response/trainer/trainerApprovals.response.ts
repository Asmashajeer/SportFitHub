import { DOC_VERIFY_STATUS, GENDER, GOVT_ID_TYPE, TRAINER_CATEGORY, TRAINER_STATUS } from "@/constants/enums";

export interface PendingTrainersBasicDTO{
  id: string;
  userId: string;  

  category:typeof TRAINER_CATEGORY[keyof typeof TRAINER_CATEGORY]; // basic Info Branding
  displayName: string; 
  specialties: string[];
  experience: number;
  profilePic:string, 
 
  personalInfo: { // Personal Info
    fullName: string;
     phone: string;   
  };

  status: typeof TRAINER_STATUS [keyof typeof TRAINER_STATUS];    // Trainer State 
  createdAt: string; // Timestamps 
  certCount:number;
}


// get single trainer by admin

interface IAddress {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  }
  export interface ICertification {
    name: string;
    url: string;
    validUpto: string ,
    issuedAt: string
  }
  interface IDayAvailability {
    available: boolean;
    startTime?: string; 
    endTime?: string;   
  }





export interface TrainerProfileDTO{  

    id: string;
    userId: string;
    // basic Info Branding
    category:TRAINER_CATEGORY;
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
   
  
    // Personal Info
    personalInfo: {
      fullName: string;
      DOB: string;
      gender: GENDER
      phone: string;
      address: IAddress;
    };
  
    // certificates & Verification 
    certificationInfo: {
      documents: ICertification[];
      verified: boolean;
      status: DOC_VERIFY_STATUS;
      verifiedAt?: string;
      rejectReason?:string;
    };
  
    // id &verification
    idVerification: {
      idType: GOVT_ID_TYPE;
      idNumber: string;
      idAttachment: string;
      verified: boolean;
      status: DOC_VERIFY_STATUS;
      verifiedAt?: string;
      rejectIdReason?:string;
    };
  
    // Location 
    currentLocation: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
  
    // availability
    availability: {
      isAvailable: boolean;
      Monday:    IDayAvailability;
      Tuesday:   IDayAvailability;
      Wednesday: IDayAvailability;
      Thursday:  IDayAvailability;
      Friday:    IDayAvailability;
      Saturday:  IDayAvailability;
      Sunday:    IDayAvailability;
    };
  
    // payment Data
    paymentInfo: {
      bankAccount?: {
        accountName?: string;
        accountNumber?: string;
        bankName?: string;
        ifscCode?: string;
      };
      upiId?: string;
    };
  
    // Administrative State
    status: TRAINER_STATUS;
    suspensionReason?: string;
    suspendedAt?: string;
    rejectionReason?: string;
    rejectedAt?: string;
    applicationCount: number;
    
    // Timestamps 
    createdAt: string;
    updatedAt: string;
}
  

