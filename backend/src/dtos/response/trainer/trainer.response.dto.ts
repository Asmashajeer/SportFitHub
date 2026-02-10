import { DOC_VERIFY_STATUS, GOVT_ID_TYPE, TRAINER_CATEGORY } from "@/constants/enums";

interface basicInfo {
  displayName: string;
  profilePic: string;
  // category: TRAINER_CATEGORY;
  // coreDiscipline: string;
  // bio: string;
  // specialties: string[];
  // experience: string;
  // languages: string[];
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
