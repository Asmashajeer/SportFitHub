import { TRAINER_CATEGORY, TRAINER_STATUS } from "@/constants/enums";
import { PaginationResponseDTO } from "../pagination.response.dto";

export interface AdminTrainersResponseDTO{

  id: string;
  userId: string;
  email:string,
  // basic Info Branding
  category: TRAINER_CATEGORY;
  displayName: string;
  coreDiscipline: string;
  specialties: string[];
  experience: number;
  languages: string[];
  isCertsVerified:boolean,
  isIdVerified:boolean,
  status: TRAINER_STATUS;
  createdAt: string; 
}
export interface AdminTrainersDTOWithPagination extends PaginationResponseDTO{
    trainers:AdminTrainersResponseDTO[],
}


// export interface AdminTrainerDetails extends AdminTrainersResponseDTO{
//     bio?: string;
//      profilePic: string;
//   pricing: {
//     sessionCharge: number;    
//   };
//   // Personal Info
//   personalInfo: {
//     fullName: string;
//     DOB: string;
//     gender: GENDER;
//     phone: string;
//     address: IAddress;
//   };
//   // certificates & Verification
//   certificationInfo: {
//     documents: ICertification[];
//     verified: boolean;
//     status: DOC_VERIFY_STATUS;
//     verifiedAt?: string;
//     rejectReason?: string;
//   };
//   // id &verification
//   idVerification: {
//     idType: GOVT_ID_TYPE;
//     idNumber: string;
//     idAttachment: string;
//     verified: boolean;
//     status: DOC_VERIFY_STATUS;
//     verifiedAt?: string;
//     rejectIdReason?: string;
//   };  
//   // Location
//   currentLocation: {
//     type: 'Point';
//     coordinates: [number, number]; // [longitude, latitude]
//   };
//   // availability
//   availability: {
//     isAvailable: boolean;
//     Monday: IDayAvailability;
//     Tuesday: IDayAvailability;
//     Wednesday: IDayAvailability;
//     Thursday: IDayAvailability;
//     Friday: IDayAvailability;
//     Saturday: IDayAvailability;
//     Sunday: IDayAvailability;
//   };
//   // payment Data
//   paymentInfo: {
//     bankAccount?: {
//       accountName?: string;
//       accountNumber?: string;
//       bankName?: string;
//       ifscCode?: string;
//     };
//     upiId?: string;
//   };
//    suspensionReason?: string;
//   suspendedAt?: string;
//   rejectionReason?: string;
//   rejectedAt?: string;
//   applicationCount: number;
// }