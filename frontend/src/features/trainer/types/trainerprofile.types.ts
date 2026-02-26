import { GOVT_ID_TYPE,TRAINER_STATUS,TRAINER_CATEGORY,DOC_VERIFY_STATUS,CURRENCY } from "@/constants/constants";
export interface dayAvailability  {
  available:boolean;
  startTime?:string;
  endTime?:string,
};
// Trainer form values
export interface TrainerOnboardingFormValues {
  displayName: string;
  category: typeof TRAINER_CATEGORY[keyof typeof TRAINER_CATEGORY]; 
  coreDiscipline: string;
  bio: string;
  profilePic: FileList | null; 
  specialties: string[];
  experience: number;
  languages: string[];
  certificationInfo: { 
    documents:[];
  };  
  personalInfo: {
    fullName: string;
    DOB:string;
    gender: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    }
  };
  idVerification: {
    idType: typeof GOVT_ID_TYPE[keyof typeof GOVT_ID_TYPE];
    idNumber: string;
    idAttachment: FileList| null;
  };
  currentLocation:{
    type:'Point'
    coordinates: [number, number];
  }
  pricing: {
      sessionCharge:number          
      currency: typeof CURRENCY [keyof typeof CURRENCY]
    },
  availability: { 
    isAvailable: boolean;
    Monday:    dayAvailability;
   Tuesday:   dayAvailability;
    Wednesday: dayAvailability;
    Thursday:  dayAvailability;
    Friday:    dayAvailability;
    Saturday:  dayAvailability;
    Sunday:dayAvailability;
  };
 paymentInfo?: {
  bankAccount?: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
  };
  upiId?: string;
};
}




export interface documents{
  name:string,
  file: FileList | null;
  validUpto:string,
  issuedAt:string,
}
export interface  idVerification {
    idType: typeof GOVT_ID_TYPE[keyof typeof GOVT_ID_TYPE];
    idNumber: string;
    idAttachment: FileList| null;
  };
  
  export interface  idVerificationwithUrl {
      idType: typeof GOVT_ID_TYPE[keyof typeof GOVT_ID_TYPE];
      idNumber: string;
      idAttachment: string;
 };


export interface AvailabiltyPricing{
    pricing:{
      sessionCharge:number          
        currency: typeof CURRENCY [keyof typeof CURRENCY]
    },
    availability :{ 

      isAvailable: boolean;
      Monday:    dayAvailability;
      Tuesday:   dayAvailability;
      Wednesday: dayAvailability;
      Thursday:  dayAvailability;
      Friday:    dayAvailability;
      Saturday:  dayAvailability;
      Sunday:dayAvailability;
    };
}

export interface paymentInfoData{
  bankAccount?: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
  };
  upiId?: string;
};

export interface DocumentValues{
  name:string,file:FileList,validUpto:Date,issuedAt:Date
}




//profile response data
interface BasicResponse{
  success:boolean,
  message:string,
}
interface basicInfo {
  displayName: string;
  profilePic: string;
  category: typeof TRAINER_CATEGORY;
  coreDiscipline: string;
  bio: string;
  specialties: string[];
  experience: string;
  languages: string[];
}

interface idStatus {
  type: typeof GOVT_ID_TYPE;
  status: typeof DOC_VERIFY_STATUS;
}
interface verification {
  overallStatus: typeof TRAINER_STATUS;
  idStatus: idStatus;
  certificationStatus: certificationStatus;
}
interface certificationStatus {
  count: number;
  status: typeof DOC_VERIFY_STATUS;
}
export interface TrainerProfileResponseData extends BasicResponse {
  basicInfo: basicInfo;
  verification: verification;  
  createdAt: string;
}