import {
  DOC_VERIFY_STATUS,
  GENDER,
  GOVT_ID_TYPE,
  TRAINER_CATEGORY,
  TRAINER_STATUS,
} from '@/constants/enums';

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
  validUpto: string;
  issuedAt: string;
}
interface IDayAvailability {
  available: boolean;
  startTime?: string;
  endTime?: string;
}

export interface TrainerProfileDTO {
  id: string;
  userId: string;
  // basic Info Branding
  category: TRAINER_CATEGORY;
  displayName: string;
  coreDiscipline: string;
  bio?: string;
  specialties: string[];
  experience: number;
  languages: string[];
  profilePic: string;
  pricing: {
    sessionCharge: number;
    
  };

  // Personal Info
  personalInfo: {
    fullName: string;
    DOB: string;
    gender: GENDER;
    phone: string;
    address: IAddress;
  };

  // certificates & Verification
  certificationInfo: {
    documents: ICertification[];
    verified: boolean;
    status: DOC_VERIFY_STATUS;
    verifiedAt?: string;
    rejectReason?: string;
  };

  // id &verification
  idVerification: {
    idType: GOVT_ID_TYPE;
    idNumber: string;
    idAttachment: string;
    verified: boolean;
    status: DOC_VERIFY_STATUS;
    verifiedAt?: string;
    rejectIdReason?: string;
  };

  // Location
  currentLocation: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };

  // availability
  availability: {
    isAvailable: boolean;
    Monday: IDayAvailability;
    Tuesday: IDayAvailability;
    Wednesday: IDayAvailability;
    Thursday: IDayAvailability;
    Friday: IDayAvailability;
    Saturday: IDayAvailability;
    Sunday: IDayAvailability;
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

interface basicInfo {
  displayName: string;
  profilePic: string;
}

interface idStatus {
  type: GOVT_ID_TYPE;
  status: DOC_VERIFY_STATUS;
}
interface verification {
  overallStatus: string;
  idStatus: idStatus;
  certificationStatus: certificationStatus;
}
interface certificationStatus {
  count: number;
  status: DOC_VERIFY_STATUS;
}
export interface TrainerProfileResponseDTO {
  basicInfo: basicInfo;
  verification: verification;
  createdAt: string;
}
